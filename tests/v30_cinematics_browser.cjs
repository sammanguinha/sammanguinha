'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const root=process.env.SM_GAME_ROOT?path.resolve(process.env.SM_GAME_ROOT):path.resolve(__dirname,'..');
const shots=process.env.SM_V30_SHOTS?path.resolve(process.env.SM_V30_SHOTS):null;
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon','.mp3':'audio/mpeg','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));
 if(!file.startsWith(root+path.sep)&&file!==root)return res.writeHead(403).end();
 if(file===root)file=path.join(root,'index.html');
 fs.readFile(file,(err,bytes)=>{if(err)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(bytes)});
});
(async()=>{
 await new Promise(ok=>server.listen(4203,'127.0.0.1',ok));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const [name,width,height] of [['desktop',1440,900],['phone',390,844]]){
   const page=await browser.newPage({viewport:{width,height},hasTouch:name==='phone',isMobile:name==='phone'});
   const errors=[],missing=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:4203/')&&r.status()>=400)missing.push(r.url())});
   await page.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:'// offline CDN'}));
   await page.route('https://rygeemrxyjknhxxlewdb.supabase.co/**',r=>r.fulfill({status:200,contentType:'application/json',body:'null'}));
   await page.addInitScript(()=>{
    localStorage.setItem('sg_handle','v30cuttester');
    localStorage.setItem('sg_tok','abcdefghijklmnopqrstuvxyz123456789');
    localStorage.setItem('sm_last_seen_update_version','24.0.0');
    localStorage.setItem('sm_last_seen_release_v29','29.0.0');
    if(!localStorage.getItem('sam_rpg_hibrido_v12_v30cuttester'))localStorage.setItem('sam_rpg_hibrido_v12_v30cuttester',JSON.stringify({
      map:'vila',x:11.7,y:10.8,seen:['welcome'],found:[],journal:[],
      epic:{class:'guardiao',level:7,points:0,stats:{vig:14,for:26,int:14,agi:11},
       gold:130,hp:125,mp:20,chapter:0,seenIntro:true,items:['semente_guardia'],
       equipped:['semente_guardia'],defeated:[],flags:{},story:[]}
    }));
   });
   await page.goto('http://127.0.0.1:4203/index.html',{waitUntil:'domcontentloaded',timeout:50000});
   await page.waitForFunction(()=>window.SamHybridRPG?.getState&&window.SamCutscenes?.scenes.length===4&&window.SamMusic?.themeNames.length>=9,{timeout:30000});
   const names=await page.evaluate(()=>window.SamMusic.themeNames);
   assert.ok(['village','forest','mystery','cinematic','temple'].every(s=>names.includes(s)),name+' five music scores loaded');
   assert.ok(await page.locator('#sm30WatchTeaser').isVisible(),name+' homepage has cinematic teaser');
   await page.locator('#sm30WatchTeaser').click();
   assert.ok(await page.locator('#sm30Cutscene').isVisible(),name+' film works from home');
   assert.equal((await page.locator('#sm30CutText').innerText()).includes('Última Badalada'),true);
   await page.locator('#sm30CutSkip').click();
   assert.equal((await page.locator('#sm30Cutscene').isVisible()),false,name+' film is skippable');
   await page.evaluate(()=>window.showPane('rpgDlg'));
   const state=()=>page.evaluate(()=>window.SamHybridRPG.getState());
   const interact=id=>page.evaluate(id=>window.SamHybridRPG.interactById(id),id);
   const travel=room=>page.evaluate(room=>window.SamHybridRPG.gotoRoom(room),room);
   const dismiss=async()=>{if(await page.locator('#r12TalkNext:visible').count())await page.locator('#r12TalkNext:visible').click()};
   const nextMovie=async()=>{for(let i=0;i<4;i++)await page.locator('#sm30CutNext').click()};
   assert.ok(await page.locator('#v30PrologueCard').isVisible(),name+' quest journal visible');
   assert.ok((await page.locator('#v30QuestStatus').innerText()).includes('Raiz que Canta'));
   await interact('v30RootSignal');
   assert.ok(await page.locator('#sm30Cutscene').isVisible(),name+' prologue plays from actual world object');
   assert.equal(await page.locator('#sm30CutTitle').innerText(),'PRÓLOGO · UMA NOVA VOZ');
   const pixels=await page.locator('#sm30CutCanvas').evaluate(canvas=>{
    const d=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
    let pixels=0;for(let i=0;i<d.length;i+=4)if(d[i]+d[i+1]+d[i+2]>0)pixels++;return pixels;
   });
   assert.ok(pixels>12000,name+' scene genuinely paints pixel art');
   const box=await page.locator('#sm30Cutscene .sm30-cut-box').boundingBox();
   assert.ok(box.x>=-1&&box.x+box.width<=width+1&&box.y>=-1&&box.y+box.height<=height+1,
    'cutscene accessible without overflow: '+JSON.stringify(box));
   if(shots){fs.mkdirSync(shots,{recursive:true});await page.screenshot({path:path.join(shots,name+'-cutscene.png')})}
   await nextMovie();
   assert.equal((await state()).epic.v30.started,true,name+' prologue persisted');
   await travel('floresta');
   assert.equal(await page.evaluate(()=>window.SamMusic.currentScene),'village','gotoRoom test helper intentionally does not warp music');
   await interact('v30RootGate');await dismiss();
   assert.equal((await state()).map,'floresta',name+' forest gate remains closed');
   await interact('v30ForestFissure');await nextMovie();
   assert.equal((await state()).epic.v30.discovered,true);
   await interact('v30StoneWater');await dismiss();
   assert.equal((await state()).epic.v30.mistakes,1,name+' wrong puzzle stone has recovery');
   for(const [i,id] of ['v30StoneSeed','v30StoneWater','v30StoneLight'].entries()){
    await interact(id);await dismiss();
    assert.equal((await state()).epic.v30.sequence,i+1);
   }
   await interact('v30RootGate');
   assert.ok(await page.locator('#sm30Cutscene').isVisible(),'gate cutscene starts');
   await nextMovie();
   assert.equal((await state()).map,'atrioRaizes','actual new atrium accessible');
   assert.equal((await state()).epic.v30.opened,true);
   assert.equal(await page.evaluate(()=>window.SamMusic.currentScene),'temple','new biome starts temple soundtrack');
   await interact('v30AtrioKeeper');await dismiss();
   const coinBefore=(await state()).epic.gold;
   for(const id of ['v30RecordPath','v30RecordHarvest']){
    await interact(id);await dismiss();
   }
   await interact('v30RecordMemory');
   assert.ok(await page.locator('#sm30Cutscene').isVisible(),name+' archive ending cinematic triggers after discoveries');
   await nextMovie();
   const finished=await state();
   assert.equal(finished.epic.v30.completed,true);
   assert.equal(finished.epic.v30.records.length,3);
   assert.ok(finished.epic.items.includes('pingente_primeira_raiz_v30'));
   assert.equal(finished.epic.gold-coinBefore,40,'unique archive coin reward');
   await interact('v30RecordMemory');await dismiss();
   assert.equal((await state()).epic.gold,finished.epic.gold,'no duplicated reward for reread');
   await interact('v30AtrioBack');
   assert.equal((await state()).map,'floresta','direct return route functions');
   await travel('vila');await interact('v30RootSignal');await dismiss();
   assert.equal((await state()).epic.v30.completed,true,'finished root does not reset progress');
   await page.reload({waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>!!window.SamHybridRPG?.getState().epic.v30?.completed,{timeout:25000});
   const saved=await state();
   assert.equal(saved.epic.v30.mistakes,1,'puzzle error history persisted');
   assert.equal(saved.epic.v30.records.length,3,'three records survived reload');
   assert.equal(saved.epic.gold,finished.epic.gold,'coins not duplicated by reload');
   assert.ok(saved.epic.items.includes('pingente_primeira_raiz_v30'),'reward persisted');
   await page.evaluate(()=>window.showPane('rpgDlg'));
   await page.locator('#v30MusicToggle').click();
   await page.waitForFunction(()=>window.SamMusic?.enabled===true,{timeout:8000});
   await page.locator('#v30TrackChoice').selectOption('forest');
   assert.equal(await page.evaluate(()=>window.SamMusic.currentScene),'forest','user can choose original forest song');
   await page.locator('#v30MusicToggle').click();
   assert.equal(await page.evaluate(()=>window.SamMusic.enabled),false,'audio can be muted');
   assert.deepEqual(errors,[],'no uncaught JS errors');
   assert.deepEqual(missing,[],'all local dependencies present');
   console.log(name+' V30.2 PASS: original cutscenes, live pixel art, puzzle, atrium, branching music, rewards, reload');
   await page.close();
  }
 }finally{await browser.close();server.close()}
})().catch(err=>{console.error(err.stack||err);server.close();process.exitCode=1});
