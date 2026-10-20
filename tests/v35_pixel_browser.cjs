'use strict';
/* V35 — browser QA: real pixel language across all playable panels in 16-bit style.
   Game loops, saves, achievements, map and defense are still tested by older suites. */
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=process.env.SM_GAME_ROOT?path.resolve(process.env.SM_GAME_ROOT):path.resolve(__dirname,'..');
const shots=path.resolve(process.env.SM_SHOT_DIR||path.join(process.cwd(),'v35-screenshots'));
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.ico':'image/x-icon','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));
 if(file===root)file=path.join(root,'index.html');
 if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
 fs.readFile(file,(e,bytes)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(bytes)});
});
(async()=>{
 await new Promise(ok=>server.listen(4298,'127.0.0.1',ok));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{for(const [device,width,height,mobile] of [['wide',1440,900,false],['tablet',800,990,false],['phone',390,844,true],['small',320,640,true]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:mobile,isMobile:mobile});
  const errors=[],notFound=[];
  page.on('pageerror',e=>errors.push(e.stack||e.message));
  page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:4298/')&&r.status()>=400)notFound.push(r.url())});
  await page.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:'// offline test SDK stub'}));
  await page.route('https://rygeemrxyjknhxxlewdb.supabase.co/**',r=>{
   const p=new URL(r.request().url()).pathname;
   const data=p.endsWith('/rpc/quest_state')?{goals:[],title:''}:p.endsWith('/rpc/game_bonus')?{mangoes:0,xp:0}:p.endsWith('/rpc/claim_profile')?{mangoes:0,xp:0,found:[],avatar:{c:0,h:'none'}}:[];
   r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
  });
  await page.addInitScript(()=>{
   localStorage.setItem('sg_handle','v35pixel');
   localStorage.setItem('sg_tok','abcdefghijklmnopqrstuvwxyz123456789');
   localStorage.setItem('sm_last_seen_update_version','24.0.0');
   localStorage.setItem('sm_last_seen_release_v29','29.0.0');
   localStorage.setItem('sm_last_seen_v31_preview','31.0.0-preview');
   if(!localStorage.getItem('sam_rpg_hibrido_v12_v35pixel'))localStorage.setItem('sam_rpg_hibrido_v12_v35pixel',JSON.stringify({
    map:'vila',x:11.7,y:10.8,seen:['welcome'],found:[],journal:[],
    epic:{class:'guardiao',level:5,xp:170,points:0,stats:{vig:6,for:6,int:6,agi:6},gold:50,hp:76,mp:16,potions:3,
    chapter:0,seenIntro:true,items:['semente_guardia'],equipped:['semente_guardia'],defeated:[],flags:{},story:[],v33:{},v34:{}}
   }));
  });
  await page.goto('http://127.0.0.1:4298/',{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>!!window.SamPixelV35&&!!window.SamReworkV34&&!!window.SamCompactV36,{timeout:25000});
  const overflow=async where=>{
   const box=await page.evaluate(()=>({full:document.documentElement.scrollWidth,visible:innerWidth}));
   assert.ok(box.full<=box.visible+7,device+' '+where+' horizontal overflow '+JSON.stringify(box));
  };
  const style=await page.evaluate(()=>{
   const get=(s,p)=>getComputedStyle(document.querySelector(s))[p];
   return {
    family:get('#v32Resume','fontFamily'),
    nav:get('#homeBtn','fontFamily'),
    panelRadius:get('#home .v32-adventure-home','borderTopLeftRadius'),
    background:get('#home .v32-adventure-home','backgroundImage'),
    pixelIcon:getComputedStyle(document.getElementById('homeBtn'),'::before').backgroundImage,
    sky:get('#home .v32-adventure-home','backgroundColor'),
    text:get('#sm35DashboardTitle','fontFamily'),
    chapter:get('#rpgDlg .r12-head h2','fontFamily')
   };
  });
  assert.ok(style.family.includes('Pixelify Sans'),device+' main action uses pixel font: '+style.family);
  assert.ok(style.nav.includes('Pixelify Sans'),device+' nav uses pixel font');
  assert.ok(style.text.includes('Pixelify Sans')&&style.chapter.includes('Pixelify Sans'),device+' headings use pixel font');
  assert.equal(style.panelRadius,'0px',device+' pixel-squared panels');
  assert.ok(style.background.includes('ui-pixel-orchard.svg'),device+' original pixel landscape used');
  assert.ok(style.pixelIcon.includes('ui-pixel-icons.svg'),device+' pixel nav sprites used');
  for(const file of ['ui-pixel-icons.svg','ui-pixel-orchard.svg']){
   assert.ok(await page.evaluate(async name=>(await fetch('/sprites/'+name)).ok,file),device+' pixel asset delivered: '+file);
  }
  assert.equal(await page.locator('#sm36AllDestinations').isVisible(),false,'no duplicated big menu');
  assert.equal(await page.locator('#home .sm35-live-card:visible').count(),2,'two compact activities');
  assert.ok(await page.locator('#v32Resume').isVisible(),'continue adventure CTA');
  assert.match(await page.locator('#sm30NewsVersion').textContent(),/V35/);
  const actualLabels=await page.evaluate(()=>window.SamPixelV35.getNavLabels());
  const expected=mobile?['Início','RPG','Defesa','Casa','Herói','Mais']:['Início','Mundo RPG','Defesa','Minha Casa','Personagem','Explorar'];
  assert.deepEqual(actualLabels.map(x=>x.text),expected,device+' correct semantic dock labels');
  const header=await page.locator('#hero').boundingBox();
  assert.ok(header&&header.height<=95,device+' header remains compact '+JSON.stringify(header));
  if(mobile){
   const dock=await page.locator('#areas').boundingBox();
   assert.ok(dock&&dock.y>height-90,device+' dock remains pinned to bottom');
   const hero=await page.locator('#home .v32-adventure-home').boundingBox();
   assert.ok(hero&&hero.height<460,device+' pixel hero should not block playing '+JSON.stringify(hero));
  }
  await overflow('home');
  fs.mkdirSync(shots,{recursive:true});
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({path:path.join(shots,device+'-home.png'),fullPage:false});
  await page.locator('#v32Resume').click();
  assert.ok(await page.locator('#rpgDlg').isVisible(),'pixel CTA opens the game');
  assert.ok(await page.locator('#r12Canvas').isVisible(),'pixel canvas remains available');
  const rendering=await page.evaluate(()=>getComputedStyle(document.querySelector('#r12Canvas')).imageRendering);
  assert.ok(/pixelated|crisp-edges/.test(rendering),device+' canvas is nearest-neighbour '+rendering);
  assert.equal(await page.locator('#rpgDlg .sm-rpg-head-enter').isVisible(),false,'no duplicated fullscreen action');
  assert.ok(await page.locator('#rpgDlg .sm-rpg-map-enter').isVisible(),'one real fullscreen control');
  const panelFont=await page.locator('#v34WorldTools summary').evaluate(e=>getComputedStyle(e).fontFamily);
  assert.ok(panelFont.includes('Pixelify Sans'),'world tools use pixel font');
  await overflow('rpg');
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({path:path.join(shots,device+'-rpg.png'),fullPage:false});
  if(mobile){
   assert.ok(await page.locator('#sm36RpgSideToggle').isVisible(),'quest + bag panel available');
   await page.locator('#sm36RpgSideToggle').click();
   assert.ok(await page.locator('#sm36RpgExtras').isVisible(),'inventory remains interactive');
  }
  await page.evaluate(()=>{me='v35pixel';prof={xp:100,mangoes:0,avatar:{c:0,h:'none'}};window.showPane('gameDlg')});
  assert.ok(await page.locator('#gCv').isVisible(),'defense pixel-art canvas still working');
  await overflow('defense');
  if(mobile)await page.screenshot({path:path.join(shots,device+'-defense.png'),fullPage:false});
  await page.evaluate(()=>window.showPane('houseDlg'));
  assert.ok(await page.locator('#sm34Garden').count()>0,'garden mechanics retained');
  if(mobile)assert.ok(await page.locator('#sm34Garden').isVisible(),'garden available on mobile');
  await overflow('house');
  if(mobile)await page.screenshot({path:path.join(shots,device+'-house.png'),fullPage:false});
  await page.evaluate(()=>{QS={goals:[]};window.showPane('profDlg')});
  assert.ok(await page.locator('#sm34Wardrobe').isVisible(),'character editor retained');
  await overflow('profile');
  if(mobile)await page.screenshot({path:path.join(shots,device+'-profile.png'),fullPage:false});
  const profileStyle=await page.locator('#profDlg .map-header h2').evaluate(e=>getComputedStyle(e).fontFamily);
  assert.ok(profileStyle.includes('Pixelify Sans'),'profile headings also pixel');
  await page.evaluate(()=>window.showPane('home'));
  await page.locator('#v32MoreToggle').click();
  assert.ok(await page.locator('#v32MorePanel').isVisible(),'more destinations still work');
  assert.equal(await page.locator('#v34Accessibility #sm165LargeText').count(),1,'accessibility intact');
  await page.locator('#v32DestinationSearch').fill('Galeria');
  assert.ok(await page.locator('#v32MorePanel button[data-p="galDlg"]').isVisible(),'pixel menu filter still works');
  await page.keyboard.press('Escape');
  assert.ok(await page.locator('#v32MorePanel').isHidden(),'pixel menu Escape still closes');
  assert.deepEqual(notFound,[],device+' all CSS, sprites, sounds and scripts present');
  assert.deepEqual(errors,[],device+' no JS errors');
  console.log(device+' V35 PASS: 16-bit fonts, original pixel art, six sprite tabs, no overflow, RPG/Defense/House/Profile and old routes');
  await page.close();
 }}finally{await browser.close();server.close()}
})().catch(error=>{console.error(error.stack||error);server.close();process.exitCode=1});
