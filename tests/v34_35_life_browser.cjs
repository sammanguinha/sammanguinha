'use strict';
/* V33.4 / 33.5: interações reais da horta, receitas, roupas e painel reorganizado.
   Relógio acelerado só no navegador de teste; nenhum cheat existe na produção. */
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=process.env.SM_GAME_ROOT?path.resolve(process.env.SM_GAME_ROOT):path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.ico':'image/x-icon','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));
 if(file===root)file=path.join(root,'index.html');
 if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
 fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data)});
});
(async()=>{
 await new Promise(ok=>server.listen(4295,'127.0.0.1',ok));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
 for(const [device,w,h]of[['desktop',1440,900],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width:w,height:h},isMobile:device==='mobile',hasTouch:device==='mobile'});
  const errors=[],missing=[];
  page.on('pageerror',error=>errors.push(error.stack||error.message));
  page.on('response',response=>{if(response.url().startsWith('http://127.0.0.1:4295/')&&response.status()>=400)missing.push(response.url())});
  await page.route('https://cdn.jsdelivr.net/**',route=>route.fulfill({status:200,contentType:'text/javascript',body:'// isolated supabase SDK'}));
  await page.route('https://rygeemrxyjknhxxlewdb.supabase.co/**',route=>{
   const pathname=new URL(route.request().url()).pathname;
   const data=pathname.endsWith('/rpc/quest_state')?{goals:[],title:''}:
    pathname.endsWith('/rpc/game_bonus')?{mangoes:0,xp:0}:
    pathname.endsWith('/rpc/claim_profile')?{mangoes:0,xp:0,found:[],avatar:{c:0,h:'none'}}:[];
   return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
  });
  await page.addInitScript(()=>{
   const realNow=Date.now.bind(Date);window.__v34Offset=0;Date.now=()=>realNow()+window.__v34Offset;
   window.__advanceGardenClock=ms=>{window.__v34Offset+=ms;return Date.now()};
   if(!localStorage.getItem('v34test_current'))localStorage.setItem('v34test_current','v34test');
   localStorage.setItem('sg_handle',localStorage.getItem('v34test_current'));
   localStorage.setItem('sg_tok','abcdefghijklmnopqrstuvwxyz123456789');
   localStorage.setItem('sm_last_seen_update_version','24.0.0');
   localStorage.setItem('sm_last_seen_release_v29','29.0.0');
   localStorage.setItem('sm_last_seen_v31_preview','31.0.0-preview');
   const key='sg_extras_v1_v34test';
   if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify({seeds:700,owned:[],pet:'',best:0,day:'',claimed:[],stats:{}}));
   const world='sam_rpg_hibrido_v12_v34test';
   if(!localStorage.getItem(world))localStorage.setItem(world,JSON.stringify({
    map:'vila',x:11.7,y:10.8,seen:['welcome'],found:[],journal:[],
    epic:{class:'guardiao',level:12,xp:1400,points:0,stats:{vig:15,for:18,int:12,agi:10},
    gold:100,hp:120,mp:4,potions:3,chapter:0,seenIntro:true,
    items:['semente_guardia'],equipped:['semente_guardia'],defeated:[],flags:{},story:[],v33:{},v34:{}}
   }));
  });
  await page.goto('http://127.0.0.1:4295/',{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>!!window.SamGardenV34&&!!window.SamSiteV35&&!!window.SamHybridRPG?.claimDailyV35,{timeout:22000});
  const world=()=>page.evaluate(()=>window.SamHybridRPG.getState());
  const garden=()=>page.evaluate(()=>window.SamGardenV34.snapshot());
  const contract=()=>page.evaluate(()=>window.SamHybridRPG.getDailyContractV35());
  const chooseCrop=async id=>page.locator('#sm34PlantChoices [data-sm34-crop="'+id+'"]').click();
  const clickPlot=async index=>page.locator('#sm34Plots [data-sm34-plot="'+index+'"]').click();
  const advance=async ms=>page.evaluate(x=>window.__advanceGardenClock(x),ms);
  assert.ok(await page.locator('#sm35Dashboard').isVisible(),'new live dashboard on home');
  assert.equal(await page.locator('#sm35Dashboard [data-sm35-go]').count(),3,'three real quick entry points');
  assert.ok((await page.locator('#sm30NewsVersion').textContent()).includes('V35'),'new release news');
  assert.ok(await page.locator('#sm35MoreCommunity').count()===1,'old link banner consolidated');
  assert.equal(await page.locator('#sm17GoSocial').count(),1,'community button was preserved');
  assert.equal(await page.locator('#sm17GoGrimoire').count(),1,'legacy codes still available');
  await page.locator('#sm35Dashboard [data-sm35-go="houseDlg"]').click();
  await page.waitForSelector('#sm34Garden',{state:'visible'});
  assert.equal(await page.locator('#sm34Plots button').count(),6,'six working plots');
  assert.ok(await page.locator('#sm34Resources').isVisible());
  const before=await garden();
  assert.equal(before.seeds,700,'existing defense seed wallet reused');
  const oldLayout=await page.evaluate(()=>window.Sam21House.getLayout());
  await chooseCrop('erva');await clickPlot(0);
  let st=await garden();
  assert.equal(st.seeds,692,'planting actually charges eight local seeds');
  assert.equal(st.plots[0].kind,'erva','the plot stores the plant');
  await clickPlot(0);
  st=await garden();assert.equal(st.plots[0].watered,true,'water speeds the real timer');
  await clickPlot(0);
  assert.equal((await garden()).plots[0].watered,true,'watering cannot repeat in same cycle');
  await advance(35000);await clickPlot(0);
  st=await garden();assert.equal(st.plots[0],null,'ripe plant harvested');assert.equal(st.resources.erva,2,'real ingredients awarded');
  await chooseCrop('orvalho');await clickPlot(1);
  await advance(125000);await clickPlot(1);
  st=await garden();assert.equal(st.resources.orvalho,1,'dew harvest credits inventory');
  assert.ok(st.unlocked.leaf,'two harvests unlock leaf accessory');
  const potionsBefore=(await world()).epic.potions;
  await page.locator('#sm34Crafts [data-sm34-craft="pocao"]').click();
  assert.equal((await world()).epic.potions,potionsBefore+1,'crafting affects real RPG potions');
  assert.equal((await garden()).resources.erva,0,'ingredients consumed');
  assert.equal((await garden()).resources.orvalho,0,'dew consumed');
  let daily=await contract();assert.equal(daily.harvest,true);assert.equal(daily.craft,true);assert.equal(daily.claimed,false);
  const gold=(await world()).epic.gold;
  await page.locator('#sm34DailyClaim').click();
  daily=await contract();assert.equal(daily.claimed,true,'daily contract claimed');
  assert.equal((await world()).epic.gold,gold+20,'daily contract actually rewards RPG gold');
  assert.equal((await page.locator('#sm34DailyClaim').isDisabled()),true,'cannot farm daily claims');
  assert.equal((await page.evaluate(()=>window.SamHybridRPG.claimDailyV35())).ok,false,'daily replay rejected by backend state');
  // Original house save remains intact throughout the garden changes.
  assert.deepEqual(await page.evaluate(()=>window.Sam21House.getLayout()),oldLayout,'existing home layout preserved');
  await page.evaluate(()=>{QS={goals:[]};window.showPane('profDlg')});
  assert.ok(await page.locator('#sm34Wardrobe').isVisible(),'wardrobe rendered inside real Profile');
  assert.equal(await page.locator('#sm34Accessories [data-sm34-accessory="scarf"]').isDisabled(),true);
  await page.locator('#sm34Accessories [data-sm34-accessory="leaf"]').click();
  assert.equal((await garden()).accessory,'leaf','new wardrobe actually selects RPG accessory');
  await page.evaluate(()=>window.showPane('rpgDlg'));
  assert.ok(await page.locator('#sm35RpgJumps').isVisible(),'new RPG quick-jump navigation');
  await page.locator('#sm35RpgJumps [data-sm35-atlas]').click();
  assert.ok(await page.locator('#v33Atlas').isVisible(),'old atlas reachable after facelift');
  await page.locator('#v33Atlas .sm33-atlas-close').click();
  await page.evaluate(()=>window.showPane('houseDlg'));
  // Unique craftable amulet: grow all ingredients on four garden plots.
  await chooseCrop('erva');await clickPlot(0);
  await chooseCrop('orvalho');await clickPlot(1);
  await chooseCrop('lunar');await clickPlot(2);await clickPlot(3);
  await advance(185000);
  for(const i of [0,1,2,3])await clickPlot(i);
  const gathered=await garden();
  assert.ok(gathered.resources.erva>=2&&gathered.resources.orvalho>=1&&gathered.resources.lunar>=2,'all recipe ingredients grown');
  await page.locator('#sm34Crafts [data-sm34-craft="amuleto"]').click();
  assert.ok((await world()).epic.items.includes('amuleto_colheita_v34'),'unique artifact available in RPG');
  assert.equal((await garden()).unlocked.aurora,true,'artifact unlocks matching visual aura');
  assert.equal((await page.locator('#sm34Crafts [data-sm34-craft="amuleto"]').isDisabled()),true,'artifact cannot be duplicated');
  await page.evaluate(()=>{QS={goals:[]};window.showPane('profDlg')});
  await page.locator('#sm34Accessories [data-sm34-accessory="aurora"]').click();
  assert.equal((await garden()).accessory,'aurora');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.SamGardenV34&&!!window.SamSiteV35,{timeout:20000});
  assert.equal((await garden()).accessory,'aurora','cosmetic persists across reload');
  assert.ok((await world()).epic.items.includes('amuleto_colheita_v34'),'crafted artifact persists');
  assert.equal((await contract()).claimed,true,'daily reward persists');
  // Changing profiles must not show the previous player's local garden.
  await page.evaluate(()=>{localStorage.setItem('v34test_current','v34other');localStorage.setItem('sg_handle','v34other');localStorage.setItem('sg_tok','another-token')});
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.SamGardenV34,{timeout:20000});
  assert.equal((await garden()).harvests,0,'other account has independent save');
  assert.equal((await garden()).accessory,'none','other account has no unlocked cosmetic');
  await page.evaluate(()=>{localStorage.setItem('v34test_current','v34test');localStorage.setItem('sg_handle','v34test');localStorage.setItem('sg_tok','abcdefghijklmnopqrstuvwxyz123456789')});
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.SamGardenV34,{timeout:20000});
  assert.equal((await garden()).accessory,'aurora','switching back loads saved cosmetic');
  await page.evaluate(()=>window.showPane('home'));
  const bounds=await page.evaluate(()=>({total:document.documentElement.scrollWidth,available:innerWidth}));
  assert.ok(bounds.total<=bounds.available+7,device+' horizontal overflow '+JSON.stringify(bounds));
  assert.deepEqual(missing,[],device+' missing assets');
  assert.deepEqual(errors,[],device+' uncaught JS exceptions');
  console.log(device+' V33.4/V33.5 PASS: full garden UI, economy, water, harvest, RPG crafting, contracts, wardrobe, save, account isolation, live dashboard and Atlas');
  await page.close();
 }
 }finally{await browser.close();server.close()}
})().catch(err=>{console.error(err.stack||err);server.close();process.exitCode=1});
