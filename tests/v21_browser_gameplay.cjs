const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..'),PORT=4261;
const mime={'.html':'text/html;charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.ico':'image/x-icon'};
const server=http.createServer((req,res)=>{
 const cleaned=decodeURIComponent((req.url||'/').split('?')[0]||'/');
 let full=path.resolve(ROOT,'.'+cleaned);
 if(full!==ROOT&&!full.startsWith(ROOT+path.sep)){res.writeHead(403).end();return}
 if(full===ROOT)full=path.join(ROOT,'index.html');
 fs.readFile(full,(err,data)=>{if(err){res.writeHead(404).end('not found');return}res.setHeader('Content-Type',mime[path.extname(full)]||'application/octet-stream');res.end(data)});
});
(async()=>{
 await new Promise(resolve=>server.listen(PORT,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const cloud=new Map();
 try {
  for(const device of [{name:'desktop',w:1366,h:900,mobile:false},{name:'mobile',w:390,h:844,mobile:true}]){
   const page=await browser.newPage({viewport:{width:device.w,height:device.h},isMobile:device.mobile,hasTouch:device.mobile});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(()=>{
     localStorage.setItem('sg_handle','guardiaoteste21');
     localStorage.setItem('sg_tok','abcdefghijklmnopqrstu123456789');
     localStorage.setItem('sg_extras_v1_guardiaoteste21',JSON.stringify({seeds:500,owned:[],pet:'',day:'',claimed:[],stats:{}}));
     localStorage.setItem('sm_last_seen_update_version','21.0.0');
   });
   await page.route('**/cdn.jsdelivr.net/**',route=>route.fulfill({status:200,contentType:'application/javascript',body:"window.supabase={createClient:()=>({channel:()=>({on(){return this},subscribe(cb){cb('SUBSCRIBED');return this}}),removeChannel(){}})};"}));
   await page.route('**/rest/v1/**',async route=>{
    const url=new URL(route.request().url());
    const name=url.pathname.split('/').pop();
    let b=null;try{b=route.request().postDataJSON()}catch(_){}
    let body=[];
    if(name==='claim_profile'||name==='auth_profile')body={handle:'guardiaoteste21',avatar:{c:0,h:'none'},mangoes:180,xp:1500,found:[]};
    if(name==='game_bonus')body={mangoes:0,xp:0};
    if(name==='game_start')body=null;  // prática não ranqueada, protege qualquer conta real
    if(name==='game_ranking'||name==='game_ranking_v2')body=[];
    if(name==='sm21_house_load')body=cloud.get(b?.p_handle)||{};
    if(name==='sm21_house_save'){cloud.set(b?.p_handle,b.p_state);body=b.p_state}
    if(name==='quest_state')body={goals:[]};
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
   });
   await page.goto('http://127.0.0.1:'+PORT+'/index.html',{waitUntil:'domcontentloaded',timeout:60000});
   await page.waitForFunction(()=>!!window.SamHouseV21&&document.getElementById('houseBtn')&&document.getElementById('sm21Repair'),null,{timeout:35000});
   // Casa do jogador acessível pela navegação real.
   await page.evaluate(()=>document.getElementById('houseBtn').click());
   await page.waitForFunction(()=>document.getElementById('houseDlg').hidden===false,null,{timeout:5000});
   await page.waitForTimeout(200);
   const canvas=page.locator('#sm21HouseCanvas');
   await canvas.scrollIntoViewIfNeeded();
   const pos=await canvas.boundingBox();assert.ok(pos&&pos.width>0,device.name+' canvas visible');
   const before=await page.evaluate(()=>window.SamHouseV21.getState());
   assert.ok(before.placed.length>=6,device.name+' starter house');
   if(device.name==='desktop'){
     await page.locator('button[data-item="cristal"]').click();
     const loc=await canvas.boundingBox();
     const x=loc.x+(32+(3+.5)*61)*loc.width/800;
     const y=loc.y+(170+(2+.5)*42)*loc.height/496;
     await page.mouse.click(x,y);
     const result=await page.evaluate(()=>window.SamHouseV21.getState());
     assert.ok(result.owned.includes('cristal'), 'crystal bought using seeds');
     assert.ok(result.placed.some(x=>x.id==='cristal'&&x.x===3&&x.y===2),'crystal placed at tile (3,2)');
     await page.mouse.move(x,y);await page.mouse.down();
     await page.mouse.move(x+loc.width*61/800,y,{steps:6});await page.mouse.up();
     const shifted=await page.evaluate(()=>window.SamHouseV21.getState());
     assert.ok(shifted.placed.some(x=>x.id==='cristal'&&x.x===4&&x.y===2),'pointer drag moves crystal to a new tile');
     await page.locator('#sm21HouseTheme').selectOption('astral');
     await page.locator('#sm21HouseFloor').selectOption('marmore');
     await page.waitForFunction(()=>localStorage.getItem('sm21_house_guardiaoteste21')?.includes('"astral"'),null,{timeout:5000});
     await page.waitForTimeout(1550);
     assert.ok(cloud.get('guardiaoteste21')?.owned.includes('cristal'),'cloud save RPC invoked');
   }else{
     await page.waitForFunction(()=>window.SamHouseV21.getState().theme==='astral',null,{timeout:7000});
     const loaded=await page.evaluate(()=>window.SamHouseV21.getState());
     assert.ok(loaded.owned.includes('cristal'),'server synced house from first browser');
     assert.ok(loaded.placed.some(x=>x.id==='cristal'&&x.x===4&&x.y===2),'furniture placement synced');
     assert.equal(loaded.floor,'marmore');
   }
   // Botões reais do jogo de defesa, seleção de arma e loop de colisão.
   await page.evaluate(()=>{
      me='guardiaoteste21';prof={handle:me,xp:1500,mangoes:180,avatar:{c:0,h:'none'},found:[]};
      document.getElementById('gameBtn').click();
   });
   await page.waitForFunction(()=>document.getElementById('gameDlg').hidden===false,null,{timeout:5000});
   await page.locator('#sm21Weapon').selectOption('arcane');
   await page.evaluate(()=>document.getElementById('gPlay').click());
   await page.waitForFunction(()=>typeof gs!=='undefined'&&gs!==null,null,{timeout:15000});
   const firing=await page.evaluate(()=>{
      cancelAnimationFrame(gRaf);
      gs.sp=200;gs.pe=[];gs.it=[];gs.bossShots=[];gs.sh=[];gs.wt=0;gs.ammo=12;gs.ft=0;K.f=1;stepG(.016);K.f=0;
      return {weapon:gs.weapon,ammo:gs.ammo,power:gs.sh[0]?.power};
   });
   assert.deepEqual(firing,{weapon:'arcane',ammo:10,power:2},device.name+' arcane shot uses ammo and doubles damage');
   const repair=await page.evaluate(()=>{
      gs.pe=[];gs.sh=[];gs.it=[];gs.sp=200;gs.bossShots=[];gs.trees[0]=false;gs.hp=gs.trees.filter(Boolean).length;gs.essence=8;gs.repairCd=0;
      const ok=sm21Repair();
      return {ok,hp:gs.hp,essence:gs.essence,repairs:gs.repairs};
   });
   assert.deepEqual(repair,{ok:true,hp:3,essence:2,repairs:1},device.name+' repair genuinely restores tree and consumes energy');
   const caster=await page.evaluate(()=>{
      gs.pe=[{kind:'caster',x:130,y:125,originX:130,vy:50,hp:2,cast:.001,anim:0,hit:0,phase:0}];
      gs.sp=200;gs.bossShots=[];stepG(.016);
      return {missile:gs.bossShots.some(b=>b.source==='caster'),anim:gs.pe[0]?.anim||0};
   });
   assert.equal(caster.missile,true,device.name+' archer generates real hostile projectile');
   assert.ok(caster.anim>0,device.name+' archer casting animation state');
   const upgrade=await page.evaluate(()=>{
      gs.pe=[];gs.bossShots=[];gs.sp=200;gs.sh=[];gs.wave=1;gs.wt=15.05;gs.upgrading=false;
      stepG(.016);
      return {pause:gs.upgrading,options:document.querySelectorAll('#sm21UpgradeChoices button').length,layer:document.getElementById('sm21WaveUpgrade').hidden};
   });
   assert.deepEqual(upgrade,{pause:true,options:3,layer:false},device.name+' wave ends with meaningful player choice');
   await page.locator('#sm21UpgradeChoices button').first().click();
   const blessed=await page.evaluate(()=>({wave:gs.wave,pending:gs.upgrading,rate:gs.reloadRate}));
   assert.equal(blessed.wave,2);assert.equal(blessed.pending,false);assert.ok(blessed.rate<.72);
   const boss=await page.evaluate(()=>{
     gs.pe=[];gs.sh=[];gs.bossShots=[];gs.sp=200;gs.wave=5;gs.wt=3.1;gs.boss=null;gs.bossDefeated=false;
     stepG(.016);
     return {boss:!!gs.boss,hp:gs.boss?.hp,wave:gs.wave};
   });
   assert.deepEqual(boss,{boss:true,hp:8,wave:5},device.name+' normal mode has a real boss');
   const gated=await page.evaluate(()=>{
     gs.wt=15.2;gs.sp=200;gs.pe=[];gs.sh=[];gs.bossShots=[];stepG(.016);
     return {active:!!gs,stillBoss:!!gs.boss,finished:!document.getElementById('gOv').hidden};
   });
   assert.deepEqual(gated,{active:true,stillBoss:true,finished:false},device.name+' boss cannot be skipped at wave timer');
   const victory=await page.evaluate(()=>{
     gs.boss.hp=2;gs.sp=200;gs.pe=[];gs.bossShots=[];gs.sh=[{x:gs.boss.x,y:gs.boss.y+10,vy:0,power:2,trail:0}];
     stepG(.016);
     const defeated=gs.bossDefeated&&!gs.boss;
     stepG(.016);
     return {defeated,ended:gs===null,screen:document.getElementById('gOvT').textContent};
   });
   assert.equal(victory.defeated,true,device.name+' boss defeated by projectile damage');
   assert.equal(victory.ended,true,device.name+' victory occurs after boss defeated');
   assert.match(victory.screen,/Vitória/,device.name+' victory screen');
   const battleReport=await page.evaluate(()=>[...document.querySelectorAll('#sm21BattleResults span')].map(x=>x.textContent));
   assert.equal(battleReport.length,6,device.name+' real battle report has six metrics');
   assert.ok(battleReport.some(x=>x.includes('Derrotado')),device.name+' boss kill appears in scorecard');
   if(device.name==='mobile'){
     await page.evaluate(()=>document.getElementById('houseBtn').click());
     await page.locator('#sm21HouseFloor').selectOption('musgo');
   }
   await page.evaluate(()=>document.getElementById('homeBtn').click());
   await page.waitForFunction(()=>!document.getElementById('sm21JourneyClaim').disabled,null,{timeout:7000});
   const walletBefore=await page.evaluate(()=>JSON.parse(localStorage.getItem('sg_extras_v1_guardiaoteste21')).seeds);
   await page.locator('#sm21JourneyClaim').click();
   const walletAfter=await page.evaluate(()=>JSON.parse(localStorage.getItem('sg_extras_v1_guardiaoteste21')).seeds);
   assert.equal(walletAfter-walletBefore,25,device.name+' cross-mode daily reward changes real house currency');
   assert.equal(await page.locator('#sm21JourneyClaim').isDisabled(),true,device.name+' daily reward cannot be claimed twice');
   assert.deepEqual(errors,[],device.name+' uncaught JS exceptions');
   fs.mkdirSync(path.join(ROOT,'test-artifacts'),{recursive:true});
   await page.evaluate(()=>{localStorage.setItem('sm19_expedicao_guardiaoteste21',JSON.stringify({finished:true}));document.getElementById('houseBtn').click()});
   await page.waitForFunction(()=>window.SamHouseV21.getState().owned.includes('reliquias'),null,{timeout:5000});
   await page.waitForTimeout(160);
   await page.screenshot({path:path.join(ROOT,'test-artifacts','v21-'+device.name+'-house.png'),animations:'disabled'});
   console.log(device.name+': House synced, advanced battle weapon, repair, archer, upgrade and boss gate PASSED. Browser JS errors: '+errors.length);
   await page.close();
  }
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e.stack||e);server.close();process.exitCode=1});
