'use strict';
/* V33.3 · Browser E2E: actual buttons, costs, collisions, plans and RPG riposte.
   We inject controlled live wave state only to make physics assertions deterministic.
   Production never loads this test code. */
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=process.env.SM_GAME_ROOT?path.resolve(process.env.SM_GAME_ROOT):path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.ico':'image/x-icon','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));
 if(file===root)file=path.join(root,'index.html');
 if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
 fs.readFile(file,(error,data)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data)});
});
(async()=>{
 await new Promise(ok=>server.listen(4294,'127.0.0.1',ok));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
 for(const [device,width,height]of [['desktop',1366,830],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},isMobile:device==='mobile',hasTouch:device==='mobile'});
  const errors=[],missing=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:4294/')&&r.status()>=400)missing.push(r.url())});
  await page.route('https://cdn.jsdelivr.net/**',route=>route.fulfill({status:200,contentType:'text/javascript',body:'// disabled external SDK for isolated QA'}));
  await page.route('https://rygeemrxyjknhxxlewdb.supabase.co/**',route=>route.fulfill({status:200,contentType:'application/json',body:'[]'}));
  await page.addInitScript(()=>{
   localStorage.setItem('sg_handle','v333test');localStorage.setItem('sg_tok','abcdefghijklmnopqrstuvwxyz123456789');
   localStorage.setItem('sm_last_seen_update_version','24.0.0');
   localStorage.setItem('sm_last_seen_release_v29','29.0.0');
   localStorage.setItem('sm_last_seen_v31_preview','31.0.0-preview');
   localStorage.setItem('sam_rpg_hibrido_v12_v333test',JSON.stringify({
    map:'vila',x:11.7,y:10.8,seen:['welcome'],found:[],journal:[],
    epic:{class:'guardiao',level:12,xp:1800,points:0,stats:{vig:35,for:5,int:5,agi:0},
     gold:120,hp:220,mp:60,potions:8,chapter:0,seenIntro:true,
     items:['semente_guardia'],equipped:['semente_guardia'],defeated:[],flags:{},story:[],v33:{}}
   }));
  });
  await page.goto('http://127.0.0.1:4294/',{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>!!window.Sam33Defense&&!!window.SamHybridRPG?.startBattle,{timeout:24000});
  const scriptPresent=await page.evaluate(()=>({available:window.Sam33Defense.availablePlans(),loaded:typeof stepG==='function',normal:window.Sam33Defense.snapshot()}));
  assert.deepEqual(scriptPresent.available,['vigilia','assalto','contencao'],'three real battle plans');
  assert.equal(scriptPresent.loaded,true);assert.equal(scriptPresent.normal,null,'no extra state before playing');
  await page.evaluate(()=>{me='v333test';prof={avatar:{c:0,h:'none'},xp:1};window.showPane('gameDlg')});
  await page.locator('#gDifficulty [data-difficulty="hard"]').click();
  assert.ok((await page.locator('#sm33ModeChip').textContent()).includes('Difícil'),'training stance can be selected');
  await page.locator('[data-sm33-plan="assalto"]').click();
  assert.equal(await page.locator('[data-sm33-plan="assalto"]').getAttribute('aria-pressed'),'true');
  await page.locator('#gPlay').click();
  await page.waitForFunction(()=>!!window.Sam33Defense.snapshot(),{timeout:20000});
  assert.equal((await page.evaluate(()=>window.Sam33Defense.snapshot())).mode,'hard');
  await page.evaluate(()=>{gs.intermission=2.5;gs.energy=11});
  await page.locator('#sm21Lanes [data-sm21-lane="1"]').click();
  assert.equal(await page.locator('#sm33Fortify').isEnabled(),true,'fortify action enabled');
  const energyBefore=await page.evaluate(()=>gs.energy);
  await page.locator('#sm33Fortify').click();
  let st=await page.evaluate(()=>window.Sam33Defense.snapshot());
  assert.equal(st.barriers[1],1,'one barrier installed only on selected lane');
  assert.equal(await page.evaluate(()=>gs.energy),energyBefore-3,'fortification consumes exactly three energy');
  const interception=await page.evaluate(()=>{
   const lane=1,s=gs;
   const target=GW*(lane+.5)/s.trees.length;
   s.pe.push({kind:'sapador',x:target,y:GH-64,originX:target,vy:250,hp:3,maxHp:3,dead:false,hit:0,targetLane:lane,slow:0,rooted:0});
   const before={alive:s.trees[lane],barriers:s.sm33.barriers[lane],blocked:s.sm33.blocked};
   stepG(.05);
   return {before,after:{alive:s.trees[lane],barriers:s.sm33.barriers[lane],blocked:s.sm33.blocked}};
  });
  assert.equal(interception.after.alive,true,'sapador cannot destroy guarded tree');
  assert.equal(interception.after.barriers,0,'sapador consumes local barrier layer');
  assert.equal(interception.after.blocked,interception.before.blocked+1,'collision records block');
  // Genuine tower targeting + third-shot bonus, preserving legacy shots and energy.
  await page.evaluate(()=>{gs.energy=12;gs.intermission=4});
  await page.locator('#sm21Lanes [data-sm21-lane="0"]').click();
  await page.locator('[data-sm21-build="arrow"]').click();
  const bonus=await page.evaluate(()=>{
   const s=gs,t=s.towers.find(t=>t.lane===0);
   t.shots=2;t.cooldown=-1;
   const x=GW*.5/s.trees.length;
   const enemy={kind:'beetle',x,y:190,originX:x,vy:0,hp:6,maxHp:6,dead:false,hit:0,rooted:0,slow:0};
   s.pe.push(enemy);
   const before=s.sm33.bonusHits;stepG(.025);
   return {before,after:s.sm33.bonusHits,hp:enemy.hp,shots:t.shots};
  });
  assert.equal(bonus.after,bonus.before+1,'Assalto 3rd shot applies real damage');
  assert.ok(bonus.hp<=4,'tower and strategy actually damaged enemy');
  const threats=await page.evaluate(()=>{
   const s=gs;s.wave=4;s.intermission=0;s.sm33.wave=4;s.sm33.sapperClock=0;s.wt=0;
   stepG(.03);
   return window.Sam33Defense.snapshot();
  });
  assert.ok(threats.sappersSpawned>=1,'sapper spawned during wave 4');
  const boss=await page.evaluate(()=>{
   const s=gs;s.boss={x:GW/2,y:200,hp:6,max:12,attack:4,hit:0};
   stepG(.02);return window.Sam33Defense.snapshot();
  });
  assert.equal(boss.bossPhase,2,'King reaches genuine phase II');
  await page.evaluate(()=>stopGame());
  await page.locator('#gDifficulty [data-difficulty="normal"]').click();
  await page.locator('#gPlay').click();
  await page.waitForFunction(()=>!!window.Sam21Defense.snapshot(),{timeout:15000});
  assert.equal(await page.evaluate(()=>window.Sam33Defense.snapshot()),null,'Normal mode does not acquire V33 rules');
  assert.equal(await page.locator('#sm33Fortify').isDisabled(),true,'Normal ranking disables new defenses');
  await page.evaluate(()=>{stopGame();window.showPane('rpgDlg')});
  await page.evaluate(()=>window.SamHybridRPG.startBattle('v33_sentinela'));
  await page.waitForSelector('#r13Combat:not([hidden])',{timeout:14000});
  assert.equal(await page.locator('[data-r13action="riposte"]').count(),1,'real Riposte combat action available');
  const initial=await page.evaluate(()=>window.SamHybridRPG.getState().epic.mp);
  await page.locator('[data-r13action="riposte"]').click();
  await page.waitForFunction(()=>document.querySelector('#r13Combat .r13-combat-log')?.textContent?.includes('RIPOSTA:'),{timeout:14000});
  const after=await page.evaluate(()=>window.SamHybridRPG.getState().epic.mp);
  assert.equal(after,initial-2,'Riposte consumes 2 MP');
  const msg=await page.locator('#r13Combat .r13-combat-log').innerText();
  assert.match(msg,/RIPOSTA:/,'actual enemy hit triggers counter damage');
  await page.evaluate(()=>window.showPane('home'));
  const size=await page.evaluate(()=>({w:document.documentElement.scrollWidth,viewport:innerWidth}));
  assert.ok(size.w<=size.viewport+7,device+' horizontal overflow '+JSON.stringify(size));
  assert.deepEqual(missing,[],'no missing local assets');
  assert.deepEqual(errors,[],'no uncaught browser exceptions');
  console.log(device+' V33.3 PASS: plan, barrier cost & interception, third-shot bonus, sapper AI, phase-II boss, ranked isolation, RPG Riposte');
  await page.close();
 }
 }finally{await browser.close();server.close()}
})().catch(error=>{console.error(error.stack||error);server.close();process.exitCode=1});
