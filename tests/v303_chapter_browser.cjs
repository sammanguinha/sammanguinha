'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=process.env.SM_GAME_ROOT?path.resolve(process.env.SM_GAME_ROOT):path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{let f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(f===root)f=path.join(root,'index.html');if(!f.startsWith(root+path.sep))return res.writeHead(403).end();fs.readFile(f,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.html')?'text/html':'application/octet-stream');res.end(b)})});
(async()=>{
 await new Promise(ok=>server.listen(4208,'127.0.0.1',ok));const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{for(const [device,width,height]of [['desktop',1440,900],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:device==='mobile',isMobile:device==='mobile'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   localStorage.setItem('sg_handle','v303test');
   localStorage.setItem('sm_last_seen_update_version','24.0.0');
   localStorage.setItem('sm_last_seen_release_v29','29.0.0');
   localStorage.setItem('sg_tok','abcdefghijklmnopqrstuvxyz123456789');
   localStorage.setItem('sam_rpg_hibrido_v12_v303test',JSON.stringify({
    map:'atrioRaizes',x:20,y:7,seen:['welcome'],found:[],journal:[],
    epic:{class:'guardiao',level:12,points:0,stats:{vig:24,for:40,int:30,agi:24},
     gold:200,hp:300,mp:40,chapter:0,seenIntro:true,items:['semente_guardia'],equipped:['semente_guardia'],
     defeated:[],flags:{},story:[],v30:{started:true,discovered:true,sequence:3,opened:true,records:['v30RecordPath','v30RecordHarvest','v30RecordMemory'],completed:true}}
   }));
  });
  await page.goto('http://127.0.0.1:4208/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.SamHybridRPG?.getState&&window.SamCutscenes?.scenes.length===6);
  await page.evaluate(()=>window.showPane('rpgDlg'));
  const state=()=>page.evaluate(()=>window.SamHybridRPG.getState());
  const act=id=>page.evaluate(id=>window.SamHybridRPG.interactById(id),id);
  const talk=async()=>{const b=page.locator('#r12TalkNext:visible');if(await b.count())await b.click()};
  const film=async()=>{for(let i=0;i<4;i++)await page.locator('#sm30CutNext').click()};
  await act('v303GroveGate');
  assert.equal((await state()).map,'bosqueEcos');
  await act('v303Ayla');
  assert.ok(await page.locator('#sm30Cutscene').isVisible(),'new opening cutscene');
  await film();assert.equal((await state()).epic.v30.chapter1.metAyla,true);
  await act('v303ChimeWind');await talk();
  assert.equal((await state()).epic.v30.chapter1.errors,1,'wrong chime resets puzzle');
  for(const [i,id]of ['v303ChimeRain','v303ChimeEarth','v303ChimeWind'].entries()){
   await act(id);await talk();assert.equal((await state()).epic.v30.chapter1.chimes,i+1);
  }
  await act('v303Sentinel');
  await page.waitForFunction(()=>!!document.getElementById('r13Combat')&&!document.getElementById('r13Combat').hidden);
  assert.ok((await page.locator('#r13Combat').innerText()).includes('Sentinela do Silêncio'));
  // Play actual combat actions, using class skill and defense if necessary.
  for(let i=0;i<30;i++){
   if(await page.locator('#r13Combat').isHidden())break;
   await page.waitForFunction(()=>[...document.querySelectorAll('[data-r13action]')].some(b=>!b.disabled),{timeout:20000});
   const btn=page.locator('#r13Combat [data-r13action="skill"]:not([disabled])');
   if(await btn.count())await btn.click();
   else await page.locator('#r13Combat [data-r13action="attack"]:not([disabled])').click();
   await page.waitForTimeout(1250);
  }
  assert.equal((await state()).epic.v30.chapter1.bossWon,true,'actual boss defeated');
  await act('v303Mural');assert.ok(await page.locator('#sm30Cutscene').isVisible(),'ending cutscene');
  await film();
  let c=(await state()).epic.v30.chapter1;
  assert.equal(c.finished,true,'chapter 1 finished');
  assert.ok((await state()).epic.items.includes('selo_dos_ecos_v303'),'unique chapter artifact');
  await act('v303Supply');await talk();await act('v303Ayla');await talk();
  c=(await state()).epic.v30.chapter1;
  assert.equal(c.supplyReturned,true,'optional NPC quest');
  const gold=(await state()).epic.gold,potions=(await state()).epic.potions;
  await act('v303Mural');await talk();
  assert.equal((await state()).epic.gold,gold,'no repeated chapter reward');
  const beforeReload=await page.evaluate(()=>({handle:localStorage.getItem('sg_handle'),keys:Object.keys(localStorage).filter(k=>k.includes('rpg_hibrido')),saved:JSON.parse(localStorage.getItem('sam_rpg_hibrido_v12_v303test')||'null')?.epic?.v30?.chapter1}));
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.SamHybridRPG?.getState,{timeout:20000});
  const afterReload=await page.evaluate(()=>({handle:localStorage.getItem('sg_handle'),keys:Object.keys(localStorage).filter(k=>k.includes('rpg_hibrido')),current:window.SamHybridRPG.getState().epic.v30?.chapter1,saved:JSON.parse(localStorage.getItem('sam_rpg_hibrido_v12_v303test')||'null')?.epic?.v30?.chapter1}));
  assert.equal(!!afterReload.current?.finished,true,'chapter survives reload: '+JSON.stringify({beforeReload,afterReload}));
  assert.equal((await state()).epic.v30.chapter1.supplyReturned,true,'side quest persists');
  assert.equal((await state()).epic.gold,gold,'coins persist');
  assert.equal((await state()).epic.potions,potions,'potions persist');
  assert.deepEqual(errors,[],device+' no JS exceptions');
  console.log(device+' V30.3 PASS: gate, 2 films, chime puzzle, boss battle, side quest, rewards and save');
  await page.close();
 }}finally{await browser.close();server.close()}
})().catch(e=>{console.error(e.stack||e);server.close();process.exitCode=1});
