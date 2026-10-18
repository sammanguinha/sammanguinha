'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=process.env.SM_GAME_ROOT?path.resolve(process.env.SM_GAME_ROOT):path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));
 if(!file.startsWith(root+path.sep)&&file!==root)return res.writeHead(403).end();
 if(file===root)file=path.join(root,'index.html');
 fs.readFile(file,(err,bytes)=>{if(err)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(bytes)});
});
(async()=>{
 await new Promise(done=>server.listen(4198,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const [device,width,height] of [['desktop',1380,900],['mobile',390,844]]){
   const page=await browser.newPage({viewport:{width,height},hasTouch:device==='mobile',isMobile:device==='mobile'});
   const errors=[],missing=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:4198/')&&r.status()>=400)missing.push(r.url())});
   await page.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:'// offline CDN'}));
   await page.route('https://rygeemrxyjknhxxlewdb.supabase.co/**',r=>r.fulfill({status:200,contentType:'application/json',body:/ranking_full|ranking_v/.test(r.request().url())?'[]':'null'}));
   await page.addInitScript(()=>{
    localStorage.setItem('sg_handle','v29tester');
    localStorage.setItem('sg_tok','abcdefghijklmnopqrstuvxyz123456789');
    localStorage.setItem('sm_last_seen_update_version','24.0.0');
    localStorage.setItem('sam_rpg_hibrido_v12_v29tester',JSON.stringify({
      map:'vila',x:11.7,y:10.8,seen:['welcome'],found:[],journal:[],
      epic:{class:'guardiao',level:12,xp:0,points:0,stats:{vig:17,for:45,int:22,agi:12},
       gold:75,hp:142,mp:24,chapter:0,seenIntro:true,items:['semente_guardia'],equipped:['semente_guardia'],
       flags:{},defeated:[],story:[],questRewards:[]}
    }));
   });
   await page.goto('http://127.0.0.1:4198/index.html',{waitUntil:'domcontentloaded',timeout:50000});
   await page.waitForFunction(()=>typeof window.showPane==='function'&&!!window.SamHybridRPG?.getState&&!!window.SamV29Data?.story,{timeout:30000});
   await page.evaluate(()=>window.showPane('rpgDlg'));
   const snapshot=()=>page.evaluate(()=>window.SamHybridRPG.getState().epic.v29);
   const go=room=>page.evaluate(room=>window.SamHybridRPG.gotoRoom(room),room);
   const interact=id=>page.evaluate(id=>window.SamHybridRPG.interactById(id),id);
   const next=async(n=1)=>{for(let i=0;i<n;i++)await page.locator('#r12TalkNext:visible').click({timeout:9000})};
   const chronicle=await page.evaluate(()=>{
    const pane=document.getElementById('rpgDlg'),el=document.getElementById('v29Chronicle');
    const chain=[];let cur=el;
    while(cur&&chain.length<6){const style=getComputedStyle(cur);chain.push({id:cur.id,class:cur.className,display:style.display,visibility:style.visibility,rect:cur.getBoundingClientRect().toJSON()});cur=cur.parentElement}
    return {exists:!!el,mode:pane?.hidden,immersive:pane?.classList.contains('sm-immersive'),chain};
   });
   assert.ok(await page.locator('#v29Chronicle').isVisible(),'living chronicle panel exists: '+JSON.stringify(chronicle));
   assert.ok((await page.locator('#v29QuestObjective').innerText()).includes('Íris'));
   await interact('v29Sentinela');
   assert.equal(await page.locator('#r13Combat').count(),0,'boss cannot be reached before scouting');
   await next();
   await interact('v29Iris');await next(3);
   assert.equal((await snapshot()).started,true,'quest starts only after intro');
   assert.ok((await page.locator('#v29QuestObjective').innerText()).includes('Investigue'));
   await interact('v29Relogio');await next();
   await go('floresta');await interact('v29Casca');await next();
   await interact('v29Mara');await next(3);
   await go('planicie');await interact('v29Biruta');await next();
   assert.equal((await snapshot()).clues.length,3);
   await go('floresta');await interact('v29Carrilhao');
   await page.locator('#r12Choices button').filter({hasText:'LUZ'}).click();
   assert.equal((await snapshot()).failures,1,'incorrect musical clue has meaningful recovery');
   assert.equal((await snapshot()).step,0);
   await next();
   for(const [i,note] of ['SOPRO','RAIZ','LUZ'].entries()){
    await page.locator('#r12Choices button').filter({hasText:note}).click();
    if(i<2)await next();
   }
   assert.equal((await snapshot()).chime,true,'solved sequence persists');
   await next(2);
   await interact('v29Mariposa');
   assert.ok(await page.locator('#r13Combat').isVisible(),'wisp triggers a real turn-based combat');
   assert.ok(await page.locator('[data-r13action="study"]').isVisible(),'new Analyze action actually exists');
   await page.locator('[data-r13action="study"]').click();
   await page.waitForFunction(()=>!!document.querySelector('[data-r13action="attack"]:not(:disabled)'),null,{timeout:13000});
   const studyLog=await page.locator('.r13-combat-log').innerText();
   assert.match(studyLog,/Observação|Bônus|observou/,'analyze adds usable preparation');
   await page.locator('[data-r13action="attack"]').click();
   await page.waitForFunction(()=>!!window.SamHybridRPG.getState().epic.v29?.wisp,null,{timeout:15000});
   await next(2);
   await go('planicie');await interact('v29Caio');await next(3);
   assert.equal((await snapshot()).scout,true,'Caio actually unlocks guardian');
   await interact('v29Sentinela');
   assert.ok((await page.locator('.r13-weak').innerText()).includes('Sentinela'));
   await page.locator('[data-r13action="study"]').click();
   await page.waitForFunction(()=>!!document.querySelector('[data-r13action="attack"]:not(:disabled)'),null,{timeout:13000});
   await page.locator('[data-r13action="attack"]').click();
   await page.waitForFunction(()=>!!window.SamHybridRPG.getState().epic.v29?.guardian,null,{timeout:15000});
   await next(2);
   await go('floresta');
   const before=await page.evaluate(()=>window.SamHybridRPG.getState().epic.gold);
   await interact('v29Copa');await next(3);
   await page.locator('#r12Choices button').filter({hasText:'Devolver a badalada à Vila'}).click();
   assert.equal((await snapshot()).ending,'vila');
   await next(3);
   const after=await page.evaluate(()=>window.SamHybridRPG.getState().epic);
   assert.equal(after.gold-before,75,'branch ending grants coins once');
   assert.ok(after.items.includes('broche_aurora'),'real equipable unique reward');
   await interact('v29Copa');await next();
   assert.equal((await page.evaluate(()=>window.SamHybridRPG.getState().epic.gold)),after.gold,'no duplicate ending payout');
   const found=Object.entries(await page.evaluate(()=>window.SamV29Data.actors)).flatMap(([map,actors])=>actors.filter(a=>a.v29==='find').map(a=>({map,id:a.id})));
   assert.equal(found.length,9);
   for(const {map,id} of found){await go(map);await interact(id);await next()}
   assert.equal((await snapshot()).finds.length,9);
   assert.equal((await snapshot()).collectionReward,true,'nine discoveries unlock single collection bonus');
   await go('vila');await interact('v29FieldBoard');await next();
   const day=await page.evaluate(()=>({daily:window.SamHybridRPG.getState().epic.v29.daily,tasks:window.SamV29Data.fieldTasks}));
   const spot=day.tasks[day.daily.task];
   await interact(spot.id);await next();
   assert.equal((await snapshot()).daily.observed,true);
   const rewardStart=await page.evaluate(()=>window.SamHybridRPG.getState().epic.gold);
   await interact('v29FieldBoard');await next();
   assert.equal((await snapshot()).daily.claimed,true);
   assert.equal((await page.evaluate(()=>window.SamHybridRPG.getState().epic.gold))-rewardStart,18);
   await interact('v29FieldBoard');await next();
   assert.equal((await page.evaluate(()=>window.SamHybridRPG.getState().epic.gold)),rewardStart+18,'daily reward is not repeatable');
   await page.reload({waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>!!window.SamHybridRPG?.getState().epic.v29?.ending,{timeout:25000});
   const saved=await snapshot();
   assert.equal(saved.ending,'vila');assert.equal(saved.finds.length,9);assert.equal(saved.daily.claimed,true);
   assert.equal(saved.failures,1,'puzzle retries survive reload');
   await page.evaluate(()=>window.showPane('rpgDlg'));
   assert.ok(await page.locator('#v29Chronicle').isVisible());
   assert.deepEqual(errors,[],'game has no uncaught JavaScript errors');
   assert.deepEqual(missing,[],'all game assets resolve locally');
   console.log(device+' V29 PASS: complete story, NPCs, 3 clues, wrong+right puzzle, 2 real fights, choices, 9 discoveries, daily quest, reload');
   await page.close();
  }
 }finally{await browser.close();server.close()}
})().catch(err=>{console.error(err.stack||err);server.close();process.exitCode=1});
