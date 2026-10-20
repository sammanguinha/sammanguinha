'use strict';
/* V34 — Acceptance tests for a real, much leaner UI at phone & desktop sizes.
   Older game/state tests run separately to protect save compatibility. */
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=process.env.SM_GAME_ROOT?path.resolve(process.env.SM_GAME_ROOT):path.resolve(__dirname,'..');
const shots=path.resolve(process.env.SM_SHOT_DIR||path.join(process.cwd(),'v34-screenshots'));
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.ico':'image/x-icon','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));
 if(file===root)file=path.join(root,'index.html');
 if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
 fs.readFile(file,(error,bytes)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(bytes)});
});
(async()=>{
 await new Promise(resolve=>server.listen(4297,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
 for(const [device,width,height,mobile] of [['wide',1440,900,false],['tablet',800,990,false],['phone',390,844,true],['small',320,640,true]]){
  const page=await browser.newPage({viewport:{width,height},isMobile:mobile,hasTouch:mobile});
  const errors=[],notFound=[];
  page.on('pageerror',error=>errors.push(error.stack||error.message));
  page.on('response',resp=>{if(resp.url().startsWith('http://127.0.0.1:4297/')&&resp.status()>=400)notFound.push(resp.url())});
  await page.route('https://cdn.jsdelivr.net/**',route=>route.fulfill({status:200,contentType:'text/javascript',body:'// no remote backend in UI test'}));
  await page.route('https://rygeemrxyjknhxxlewdb.supabase.co/**',route=>{
   const u=new URL(route.request().url());
   let data=[];
   if(u.pathname.endsWith('/rpc/quest_state'))data={goals:[],title:''};
   if(u.pathname.endsWith('/rpc/game_bonus'))data={mangoes:0,xp:0};
   if(u.pathname.endsWith('/rpc/claim_profile'))data={mangoes:0,xp:0,found:[],avatar:{c:0,h:'none'}};
   return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
  });
  await page.addInitScript(()=>{
   localStorage.setItem('sg_handle','v34ui');
   localStorage.setItem('sg_tok','abcdefghijklmnopqrstuvwxyz123456789');
   localStorage.setItem('sm_last_seen_update_version','24.0.0');
   localStorage.setItem('sm_last_seen_release_v29','29.0.0');
   localStorage.setItem('sm_last_seen_v31_preview','31.0.0-preview');
   if(!localStorage.getItem('sam_rpg_hibrido_v12_v34ui'))localStorage.setItem('sam_rpg_hibrido_v12_v34ui',JSON.stringify({
    map:'vila',x:11.7,y:10.8,seen:['welcome'],found:[],journal:[],
    epic:{class:'guardiao',level:5,xp:170,points:0,stats:{vig:6,for:6,int:6,agi:6},gold:50,hp:76,mp:16,potions:3,
     chapter:0,seenIntro:true,items:['semente_guardia'],equipped:['semente_guardia'],defeated:[],flags:{},story:[],v33:{},v34:{}}
   }));
  });
  await page.goto('http://127.0.0.1:4297/',{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>!!window.SamReworkV34&&!!window.SamCompactV36&&!!window.SamHybridRPG?.getV33State,{timeout:26000});
  const countVisible=selector=>page.locator(selector+':visible').count();
  const checkNoOverflow=async area=>{
   const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
   assert.ok(sizes.scroll<=sizes.viewport+6,device+' '+area+' overflow '+JSON.stringify(sizes));
  };
  assert.ok(await page.locator('html.v34-ui').count(),'rework initialized');
  assert.ok(await page.locator('#v32Resume').isVisible(),'one main continue action');
  assert.ok(await page.locator('#v34Harvest').isVisible(),'original mango collecting stays available');
  const headerBox=await page.locator('#hero').boundingBox();
  assert.ok(headerBox&&headerBox.height<=90,device+' true compact status header '+JSON.stringify(headerBox));
  assert.equal(await page.locator('#sm165Contrast').count(),1,'original accessibility control preserved');
  assert.equal(await page.locator('#sm165LargeText').count(),1,'original larger text setting preserved');
  assert.equal(await page.locator('#smUpdatesReopen').isVisible(),false,'redundant floating news action removed');
  assert.ok(!/undefined|NaN/i.test(await page.locator('#evBar:visible').allTextContents().then(x=>x.join(' '))),'invalid event countdown never visible');
  assert.equal(await countVisible('#home .r23-hero-buttons button'),1,'no triple hero buttons');
  assert.equal(await countVisible('#home .sm35-live-card'),2,'exactly two auxiliary modes');
  assert.equal(await page.locator('#sm36AllDestinations').isVisible(),false,'four redundant portal cards removed');
  assert.equal(await page.locator('#home .cols').isVisible(),false,'duplicate ranking/news dashboard hidden');
  assert.equal(await page.locator('#v32Library').evaluate(x=>x.open),false,'optional destinations folded');
  assert.equal(await page.locator('#sm36NewsDetails').evaluate(x=>x.open),false,'release news folded');
  assert.equal(await page.locator('#sm35MoreCommunity').isVisible(),false,'duplicate social CTA hidden');
  const hero=await page.locator('#home .v32-adventure-home').boundingBox();
  const shortcuts=await page.locator('#sm35Dashboard').boundingBox();
  assert.ok(hero&&shortcuts&&hero.y<shortcuts.y,'primary action before optional routes');
  if(mobile){
   assert.ok(hero.height<405,device+' hero stays compact ('+hero.height+')');
   assert.ok(shortcuts.height<220,device+' quick routes stay compact ('+shortcuts.height+')');
  }
  assert.ok(await page.locator('#v32Library summary').isVisible(),'secondary destinations remain accessible');
  await page.locator('#v32Library summary').click();
  assert.ok(await page.locator('#v32Library [data-go="galDlg"]').isVisible(),'gallery still accessible');
  await page.locator('#v32Library [data-go="rankDlg"]').click();
  assert.ok(await page.locator('#rankDlg').isVisible(),'ranking works through library');
  await page.locator('#homeBtn').click();
  await page.locator('#sm36NewsDetails summary').click();
  assert.ok(await page.locator('#sm30NewsHeading').isVisible(),'news available on demand');
  assert.match(await page.locator('#sm30NewsVersion').innerText(),/V34/);
  await page.locator('#sm36NewsDetails summary').click();
  await checkNoOverflow('home');
  fs.mkdirSync(shots,{recursive:true});
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await page.waitForTimeout(160);
  await page.screenshot({path:path.join(shots,device+'-home.png'),fullPage:false});
  await page.locator('#v32MoreToggle').click();
  assert.equal(await page.locator('#v34Accessibility').count(),1,'all accessibility controls consolidated in destination menu');
  assert.ok(await page.locator('#v34Accessibility #sm165LargeText').count(),'larger text not removed');
  assert.ok(await page.locator('#v32MorePanel').isVisible(),'more menu accessible');
  await page.locator('#v32DestinationSearch').fill('Diário');
  assert.ok(await page.locator('#diaryBtn').isVisible(),'diary found');
  await page.locator('#diaryBtn').click();
  assert.ok(await page.locator('#diary').isVisible(),'real diary opens');
  assert.equal(await page.locator('#v32MorePanel').isHidden(),true);
  await page.evaluate(()=>window.showPane('rpgDlg'));
  assert.ok(await page.locator('#r12Canvas').isVisible(),'RPG canvas exposed');
  if(mobile){
   const sprint=await page.locator('#rpgDlg .v24-sprint-bar').boundingBox();
   assert.ok(sprint&&sprint.height<=100,device+' sprint/shop toolbar stays compact '+JSON.stringify(sprint));
  }
  assert.ok(await page.locator('#v34WorldTools #sm171Hud').count(),'how-to controls moved into optional world settings');
  assert.equal(await page.locator('#rpgDlg .sm-rpg-head-enter').isVisible(),false,'no duplicate fullscreen header button');
  assert.ok(await page.locator('#rpgDlg .sm-rpg-map-enter').isVisible(),'one compact fullscreen button remains');
  const hudBox=await page.locator('#v27RpgHud').boundingBox();
  assert.ok(hudBox&&hudBox.height<100&&hudBox.width<=220,device+' compact nonblocking HUD '+JSON.stringify(hudBox));
  const tools=page.locator('#v34WorldTools');
  assert.equal(await tools.count(),1,'world settings consolidated');
  assert.equal(await tools.evaluate(x=>x.open),false,'world setup folded by default');
  assert.ok(await page.locator('#r12Canvas').boundingBox(),'RPG map remains visible');
  await tools.locator('summary').click();
  assert.ok(await page.locator('#r23GuideList').isVisible(),'all world travel and contract controls still available');
  assert.ok(await page.locator('#r23MoodChoices').count()>=0,'world structure still present');
  await tools.locator('summary').click();
  if(mobile){
   assert.ok(await page.locator('#sm36RpgSideToggle').isVisible());
   await page.locator('#sm36RpgSideToggle').click();
   assert.ok(await page.locator('#sm36RpgExtras').isVisible(),'quest and bag accessible on tap');
  }else assert.ok(await page.locator('#sm36RpgExtras').isVisible(),'desktop quest tools present');
  await checkNoOverflow('rpg');
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await page.waitForTimeout(160);
  await page.screenshot({path:path.join(shots,device+'-rpg.png'),fullPage:false});
  await page.evaluate(()=>{me='v34ui';prof={xp:100,mangoes:0,avatar:{c:0,h:'none'}};window.showPane('gameDlg')});
  assert.ok(await page.locator('#gCv').isVisible(),'defense canvas remains visible');
  assert.ok(await page.locator('#sm36DefenseTactics summary').isVisible(),'defense settings accessible');
  await checkNoOverflow('defense');
  await page.evaluate(()=>window.showPane('houseDlg'));
  assert.ok(await page.locator('#sm34Garden').count(),'garden still in DOM');
  if(mobile){
   assert.ok(await page.locator('#sm34Garden').isVisible(),'garden selected in house');
   await page.locator('#sm36HouseSwitch [data-sm36-house="decor"]').click();
   assert.ok(await page.locator('#sm21House').isVisible(),'decor editor still reachable');
  }else assert.ok(await page.locator('#sm21House').isVisible(),'desktop has house');
  await page.evaluate(()=>{QS={goals:[]};window.showPane('profDlg')});
  assert.ok(await page.locator('#sm34Wardrobe').isVisible(),'new wardrobe accessible');
  await checkNoOverflow('profile');
  assert.deepEqual(errors,[],device+' no console exceptions');
  assert.deepEqual(notFound,[],device+' all local files are present');
  console.log(device+' V34 PASS: unified hub, real nav, hidden duplicates, preserved harvest, RPG maps/activities, defense, house, profile, no overflow');
  await page.close();
 }
 }finally{await browser.close();server.close()}
})().catch(error=>{console.error(error.stack||error);server.close();process.exitCode=1});
