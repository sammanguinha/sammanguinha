'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=process.env.SM_GAME_ROOT?path.resolve(process.env.SM_GAME_ROOT):path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.ico':'image/x-icon'};
const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));if(file===root)file=path.join(root,'index.html');if(!file.startsWith(root+path.sep))return res.writeHead(403).end();fs.readFile(file,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(b)})});
(async()=>{
 await new Promise(ok=>server.listen(4296,'127.0.0.1',ok));const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{for(const [label,w,h,compact] of [['desktop',1366,850,false],['phone',390,844,true],['small',320,640,true]]){
  const page=await browser.newPage({viewport:{width:w,height:h},isMobile:compact,hasTouch:compact});
  const errors=[],missing=[];page.on('pageerror',e=>errors.push(e.stack||e.message));
  page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:4296/')&&r.status()>=400)missing.push(r.url())});
  await page.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:'// browser QA offline'}));
  await page.route('https://rygeemrxyjknhxxlewdb.supabase.co/**',r=>{
   const p=new URL(r.request().url()).pathname;
   const data=p.endsWith('/rpc/quest_state')?{goals:[],title:''}:p.endsWith('/rpc/game_bonus')?{mangoes:0,xp:0}:p.endsWith('/rpc/claim_profile')?{mangoes:0,xp:0,found:[],avatar:{c:0,h:'none'}}:[];
   r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
  });
  await page.addInitScript(()=>{localStorage.setItem('sg_handle','v36test');localStorage.setItem('sg_tok','abcdefghijklmnopqrstuvwxyz123456789');localStorage.setItem('sm_last_seen_update_version','24.0.0');localStorage.setItem('sm_last_seen_release_v29','29.0.0');localStorage.setItem('sm_last_seen_v31_preview','31.0.0-preview');
   if(!localStorage.getItem('sam_rpg_hibrido_v12_v36test'))localStorage.setItem('sam_rpg_hibrido_v12_v36test',JSON.stringify({
    map:'vila',x:11.7,y:10.8,seen:['welcome'],found:[],journal:[],
    epic:{class:'guardiao',level:4,xp:20,points:0,stats:{vig:5,for:7,int:5,agi:4},gold:50,hp:60,mp:12,potions:4,
    chapter:0,seenIntro:true,items:['semente_guardia'],equipped:['semente_guardia'],defeated:[],flags:{},story:[],v33:{},v34:{}}
   }));});
  await page.goto('http://127.0.0.1:4296/',{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>!!window.SamCompactV36&&!!window.SamGardenV34&&!!window.SamSiteV35,{timeout:23000});
  const overflow=async()=>page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:innerWidth}));
  const bounds=await overflow();assert.ok(bounds.width<=bounds.viewport+7,label+' homepage overflow: '+JSON.stringify(bounds));
  for(const id of ['homeBtn','rpgWorldBtn','gameBtn','houseBtn','profBtn'])assert.equal(await page.locator('#areas .v32-tabs>button#'+id).count(),1,'real nav '+id);
  const primary=await page.locator('#areas').boundingBox();
  assert.ok(primary,'navigation exists');
  if(compact)assert.ok(primary.y>h-85,label+' bottom nav stays near viewport bottom: '+JSON.stringify(primary));
  assert.equal(await page.locator('#sm35Dashboard').isVisible(),true,'fast real-game dashboard visible');
  assert.equal(await page.locator('#sm36AllDestinations').isVisible(),false,'redundant destination cards removed from visible home');
  assert.ok(await page.locator('#v32Library summary').isVisible(),'secondary destinations remain discoverable');
  await page.locator('#v32MoreToggle').click();assert.ok(await page.locator('#v32MorePanel').isVisible(),'all secondary navigation reachable');
  await page.locator('#v32DestinationSearch').fill('Galeria');
  assert.ok(await page.locator('#v32MorePanel button[data-p="galDlg"]').isVisible(),'search existing gallery');
  if(compact)assert.equal(await page.locator('#v32MorePanel #setBtn').count(),1,'original settings preserved in mobile menu');
  await page.locator('#v32MorePanel button[data-p="galDlg"]').click();
  assert.equal(await page.locator('#galDlg').isVisible(),true,'actual secondary destination responds to touch');
  await page.locator('#v32MoreToggle').click();
  await page.keyboard.press('Escape');assert.ok(await page.locator('#v32MorePanel').isHidden(),'menu closes with escape');
  await page.evaluate(()=>{window.SamHybridRPG.chooseClass('guardiao');window.showPane('rpgDlg');});
  assert.equal(await page.locator('#r12Canvas').isVisible(),true,'RPG canvas visible');
  assert.equal(await page.locator('#sm36RpgSideToggle').isVisible(),compact,'mobile-only journal toggle');
  if(compact){
   assert.ok(await page.locator('#sm36RpgExtras').isHidden(),'RPG secondary sidebar initially tucked away');
   await page.locator('#sm36RpgSideToggle').click();
   assert.ok(await page.locator('#sm36RpgExtras').isVisible(),'missions reopened accessibly');
   assert.equal(await page.locator('#sm36RpgSideToggle').getAttribute('aria-expanded'),'true');
  }else assert.ok(await page.locator('#sm36RpgExtras').isVisible(),'desktop stays fully featured');
  await page.evaluate(()=>window.showPane('houseDlg'));
  if(compact){
   assert.ok(await page.locator('#sm34Garden').isVisible(),'mobile defaults to garden');
   assert.ok(await page.locator('#sm21House').isHidden(),'home decorator initially folded');
   await page.locator('#sm36HouseSwitch [data-sm36-house="decor"]').click();
   assert.ok(await page.locator('#sm21House').isVisible(),'decorator still works on mobile');
   await page.locator('#sm36HouseSwitch [data-sm36-house="garden"]').click();
   assert.ok(await page.locator('#sm34Garden').isVisible(),'garden can reopen');
  }else {assert.ok(await page.locator('#sm21House').isVisible(),'desktop decoration full');assert.ok(await page.locator('#sm34Garden').isVisible(),'desktop garden full');}
  await page.evaluate(()=>{me='v36test';prof={xp:1,mangoes:0,avatar:{c:0,h:'none'}};window.showPane('gameDlg')});
  assert.ok(await page.locator('#gCv').isVisible(),'Defense canvas visible');
  if(compact){
   assert.ok(!(await page.locator('#sm36DefenseTactics').evaluate(e=>e.open)),'advanced defense collapsed');
   await page.locator('#sm36DefenseTactics summary').click();
   assert.ok(await page.locator('#sm33DefenseCouncil').isVisible(),'strategy actions remain reachable');
   await page.locator('#gDifficulty [data-difficulty="hard"]').click();
   assert.ok(await page.locator('#sm33DefenseCouncil').isVisible(),'difficulty still works');
  }
  const final=await overflow();assert.ok(final.width<=final.viewport+7,label+' defense overflow: '+JSON.stringify(final));
  assert.deepEqual(missing,[],label+' missing assets');assert.deepEqual(errors,[],label+' JavaScript errors');
  console.log(label+' V33.6 PASS: responsive dock, all navigation, collapsible content, RPG, House, Defense and no overflow');
  await page.close();
 }}finally{await browser.close();server.close()}
})().catch(e=>{console.error(e.stack||e);server.close();process.exitCode=1});