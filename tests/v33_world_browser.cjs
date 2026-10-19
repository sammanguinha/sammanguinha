'use strict';
/* V33: experiência real de mapa, puzzle, boss de fases, escolha, modos, Atlas e reload. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=process.env.SM_GAME_ROOT?path.resolve(process.env.SM_GAME_ROOT):path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.ico':'image/x-icon','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));
 if(file===root)file=path.join(root,'index.html');
 if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
 fs.readFile(file,(error,data)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data)});
});
const fresh={
 map:'vila',x:11.7,y:10.8,seen:['welcome'],found:[],journal:[],
 epic:{class:'guardiao',level:16,xp:3600,points:0,stats:{vig:38,for:45,int:45,agi:29},
 gold:230,hp:510,mp:90,potions:12,chapter:0,seenIntro:true,
 items:['semente_guardia'],equipped:['semente_guardia'],defeated:[],flags:{},story:[],v33:{}}
};
async function run(){
 await new Promise(resolve=>server.listen(4293,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
 for(const [device,width,height,choice]of [['desktop',1440,900,'rio'],['mobile',390,844,'floresta']]){
  const page=await browser.newPage({viewport:{width,height},isMobile:device==='mobile',hasTouch:device==='mobile'});
  const errors=[],missing=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',resp=>{if(resp.url().startsWith('http://127.0.0.1:4293/')&&resp.status()>=400)missing.push(resp.url())});
  await page.route('https://cdn.jsdelivr.net/**',route=>route.fulfill({status:200,contentType:'text/javascript',body:'// offline Supabase SDK'}));
  await page.route('https://rygeemrxyjknhxxlewdb.supabase.co/**',route=>route.fulfill({status:200,contentType:'application/json',body:'[]'}));
  await page.addInitScript(({data})=>{
   localStorage.setItem('sg_handle','v33test');
   localStorage.setItem('sg_tok','abcdefghijklmnopqrstuvwxyz123456789');
   localStorage.setItem('sm_last_seen_update_version','24.0.0');
   localStorage.setItem('sm_last_seen_release_v29','29.0.0');
   localStorage.setItem('sm_last_seen_v31_preview','31.0.0-preview');
   if(!localStorage.getItem('sam_rpg_hibrido_v12_v33test'))localStorage.setItem('sam_rpg_hibrido_v12_v33test',JSON.stringify(data));
  },{data:fresh});
  await page.goto('http://127.0.0.1:4293/',{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>!!window.SamAtlasV33&&!!window.SamHybridRPG?.getV33State&&!!window.Sam21House?.getLayout,{timeout:25000});
  assert.ok((await page.locator('#sm30NewsVersion').innerText()).includes('V33'),'V33 notes visible');
  assert.ok((await page.locator('#sm30NewsHeading').innerText()).includes('Aurora'),'V33 home announcement');
  assert.ok(await page.locator('#v33HomeAtlas').isVisible(),'direct atlas entry on home');
  const start=await page.evaluate(()=>window.SamHybridRPG.getWorldAtlas());
  assert.equal(start.filter(p=>p.visited).length,1,'initially only Vila visited');
  assert.equal(await page.evaluate(()=>window.SamHybridRPG.travelV33('mirantePrimeiraLuz')),false,'no locked fast travel');
  await page.locator('#v33HomeAtlas').click();
  assert.ok(await page.locator('#v33Atlas').isVisible(),'atlas dialog accessible from home');
  assert.equal(await page.locator('#v33Atlas button[data-travel]').count(),0,'only current room discovered');
  await page.locator('#v33Atlas .sm33-atlas-close').click();
  assert.equal(await page.locator('#v33Atlas').isHidden(),true);
  await page.evaluate(()=>window.showPane('rpgDlg'));
  await page.waitForSelector('#v33Card',{state:'attached'});
  const player=()=>page.evaluate(()=>window.SamHybridRPG.getState());
  const v33=()=>page.evaluate(()=>window.SamHybridRPG.getV33State());
  const interact=id=>page.evaluate(id=>window.SamHybridRPG.interactById(id),id);
  const dismiss=async()=>{
   const more=page.locator('#r12TalkNext:visible');
   if(await more.count())await more.click();
  };
  await interact('v33Entrance');
  assert.equal((await player()).map,'valeAurora','walkable entrance from Vila');
  assert.ok((await v33()).visited.includes('valeAurora'),'region recorded on entry');
  await interact('v33Iara');await dismiss();
  assert.equal((await v33()).metIara,true,'NPC begins the quest');
  await interact('v33RiverGate');await dismiss();
  assert.equal((await player()).map,'valeAurora','gates must block without puzzle');
  for(const id of ['v33EchoWind','v33EchoRain','v33EchoRoot']){await interact(id);await dismiss()}
  assert.equal((await v33()).echoes.length,3,'three collectible echoes');
  await interact('v33RuneRain');await dismiss();
  assert.equal((await v33()).runes,0,'incorrect rune resets');
  assert.equal((await v33()).errors,1,'failure counted');
  for(const id of ['v33RuneWind','v33RuneRain','v33RuneRoot']){await interact(id);await dismiss()}
  assert.equal((await v33()).runes,3,'rune sequence unlocks');
  await interact('v33Nilo');await dismiss();
  await interact('v33NiloSatchel');await dismiss();
  const beforeNilo=(await player()).epic.potions;
  await interact('v33Nilo');await dismiss();
  assert.equal((await v33()).niloReward,true,'real sidequest rewarded');
  await interact('v33Nilo');await dismiss();
  assert.equal((await player()).epic.potions,beforeNilo+1,'sidequest cannot farm potions');
  await interact('v33RiverGate');
  assert.equal((await player()).map,'bibliotecaSubmersa','river puzzle unlocks destination');
  await interact('v33SummitGate');await dismiss();
  assert.equal((await player()).map,'bibliotecaSubmersa','two memories required for summit');
  for(const id of ['v33MemoryOne','v33MemoryTwo']){await interact(id);await dismiss()}
  assert.equal((await v33()).memories.length,2,'both memories persist');
  await interact('v33SummitGate');
  assert.equal((await player()).map,'mirantePrimeiraLuz','summit is accessible');
  await interact('v33Warden');await dismiss();
  await page.waitForSelector('#r13Combat:not([hidden])',{timeout:15000});
  for(let turn=0;turn<36;turn++){
   if(await page.locator('#r13Combat').isHidden())break;
   await page.waitForFunction(()=>Array.from(document.querySelectorAll('#r13Combat [data-r13action]')).some(b=>!b.disabled),{timeout:16000});
   const skill=page.locator('#r13Combat [data-r13action="skill"]:not([disabled])');
   if(await skill.count())await skill.click();
   else await page.locator('#r13Combat [data-r13action="attack"]:not([disabled])').click();
   await page.waitForTimeout(950);
  }
  assert.equal((await v33()).bossWon,true,'two-phase boss defeated through actual combat UI');
  await interact('v33Choice');
  await page.locator('#r12Choices button').filter({hasText:choice==='rio'?'Libertar o Rio':'Restaurar a Floresta'}).click();
  await dismiss();
  let ended=await player();
  assert.equal(ended.epic.v33.finished,true,'branching ending persists');
  assert.equal(ended.epic.v33.ending,choice,'player choice truly recorded');
  const equipment=choice==='rio'?'medalhao_rio_v33':'medalhao_raiz_v33';
  assert.ok(ended.epic.items.includes(equipment),'unique real equipment');
  const rewards={potions:ended.epic.potions,gold:ended.epic.gold};
  await interact('v33Choice');await dismiss();
  ended=await player();
  assert.equal(ended.epic.potions,rewards.potions,'no repeatable item farming');
  assert.equal(ended.epic.gold,rewards.gold,'no repeatable currency farming');
  // V33 local cross-mode bridge cannot change Supabase leaderboard.
  await page.evaluate(()=>window.SamHybridRPG.onDefenseResult(false));
  assert.equal((await v33()).defenseReward,undefined,'loss cannot grant reward');
  await page.evaluate(()=>window.SamHybridRPG.onDefenseResult(true));
  assert.equal((await v33()).defenseReward,true,'actual defense win cross-mode reward');
  const rewardOnce=(await player()).epic.potions;
  await page.evaluate(()=>window.SamHybridRPG.onDefenseResult(true));
  assert.equal((await player()).epic.potions,rewardOnce,'defense bonus once per player');
  // Create a local house layout: actual Sam21House normalizer reads the saved four furniture slots.
  await page.evaluate(()=>{
   const house=window.Sam21House.getLayout();house.items=[{id:'bed',x:1,y:2},{id:'table',x:5,y:2},{id:'fern',x:7,y:1},{id:'lantern',x:6,y:4}];
   localStorage.setItem('sam21_casa_v33test',JSON.stringify(house));
  });
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.SamAtlasV33&&!!window.Sam21House?.getLayout,{timeout:20000});
  await page.evaluate(()=>window.showPane('rpgDlg'));
  await page.waitForTimeout(350);
  let persisted=await player();
  assert.equal(persisted.epic.v33.ending,choice,'ending persists after reload');
  assert.equal(persisted.epic.v33.niloReward,true,'sidequest persists after reload');
  assert.equal(persisted.epic.v33.houseReward,true,'four actual house objects grant once');
  const housePotion=persisted.epic.potions;
  await page.evaluate(()=>window.showPane('home'));
  await page.evaluate(()=>window.showPane('rpgDlg'));
  assert.equal((await player()).epic.potions,housePotion,'house bonus not duplicated');
  assert.equal(await page.evaluate(()=>window.SamHybridRPG.travelV33('vila')),true,'visited Vila accessible');
  assert.equal((await player()).map,'vila','fast travel changes real room');
  assert.equal(await page.evaluate(()=>window.SamHybridRPG.travelV33('mirantePrimeiraLuz')),true,'visited summit accessible');
  assert.equal((await player()).map,'mirantePrimeiraLuz','fast travel respects discovered routes');
  await page.locator('#v33AtlasOpen').click();
  assert.ok(await page.locator('#v33Atlas').isVisible(),'in-game atlas works');
  await page.locator('#v33Atlas button[data-atlas-tab="quests"]').click();
  assert.ok((await page.locator('#v33AtlasContent').innerText()).includes('Jornadas conectadas'),'cross-mode quest shown');
  await page.locator('#v33Atlas button[data-atlas-tab="codex"]').click();
  assert.ok((await page.locator('#v33AtlasContent').innerText()).includes('Iara'),'codex reflects met NPC');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#v33Atlas').isHidden(),true,'Escape dismisses modal');
  await page.evaluate(()=>window.showPane('home'));
  const overflow=await page.evaluate(()=>({document:document.documentElement.scrollWidth,viewport:innerWidth}));
  assert.ok(overflow.document<=overflow.viewport+7,device+' home overflow: '+JSON.stringify(overflow));
  assert.deepEqual(errors,[],'no uncaught V33 errors on '+device);
  assert.deepEqual(missing,[],'all local site assets loaded on '+device);
  console.log(device+' V33 PASS: three rooms, rune puzzle, sidequest, boss, choice, local rewards, home, reload, safe atlas, codex');
  await page.close();
 }
 }finally{await browser.close();server.close()}
}
run().catch(error=>{console.error(error.stack||error);server.close();process.exitCode=1});
