const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..');const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));if(!file.startsWith(root+path.sep)&&file!==root)return res.writeHead(403).end();if(file===root)file=path.join(root,'index.html');fs.readFile(file,(err,bytes)=>{if(err)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(bytes)})});
(async()=>{
 await new Promise(done=>server.listen(4166,'127.0.0.1',done));const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1300,height:900}});
  const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.route('https://rygeemrxyjknhxxlewdb.supabase.co/**',async(route)=>{
    const url=new URL(route.request().url());const key=url.pathname.split('/').at(-1);
    const json= key==='claim_profile'?{handle:'v22tester',avatar:{c:0,h:'none'},xp:130,mangoes:900,found:[]}:key==='game_bonus'?{xp:0,mangoes:0}:key==='game_ranking'?[]:key==='quest_state'?{goals:[]}:[];
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(json)});
  });
  await page.addInitScript(()=>{localStorage.setItem('sg_handle','v22tester');localStorage.setItem('sg_tok','abcdefghjkmnpqrstuvwxyz23456789abcd');localStorage.setItem('sm_last_seen_update_version','22.0.0');});
  await page.clock.install();
  await page.goto('http://127.0.0.1:4166/index.html',{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>!!window.Sam21Defense&&document.querySelector('#gDifficulty'),{timeout:20000});
  await page.locator('#gameBtn').click();
  await page.locator('[data-sm21-job="mage"]').click();
  await page.locator('[data-difficulty="hard"]').click();
  await page.locator('#gPlay').click();
  await page.waitForFunction(()=>!!window.Sam21Defense.snapshot(),{timeout:5000});
  let s=await page.evaluate(()=>window.Sam21Defense.snapshot());
  assert.equal(s.job,'mage');assert.equal(s.energy,2);assert.equal(s.wave,1);assert.equal(s.towers.length,0);
  await page.clock.runFor(22000);
  s=await page.evaluate(()=>window.Sam21Defense.snapshot());
  assert.ok(s&&s.wave>=2,'next wave reached: '+JSON.stringify(s));
  assert.ok(s.energy>=3,'wave reward added energy: '+JSON.stringify(s));
  // Select a lane with an actual enemy in firing range (deterministic targeting, not RNG luck).
  let lanes=[];
  for(let i=0;i<6;i++){
    s=await page.evaluate(()=>window.Sam21Defense.snapshot());
    lanes=(s?.enemies||[]).filter(p=>p.y>80&&p.y<490).map(p=>Math.max(0,Math.min(4,Math.floor(p.x/108))));
    if(lanes.length)break;
    await page.clock.runFor(650);
  }
  assert.ok(lanes.length>0,'enemy actually spawned to test tower combat: '+JSON.stringify(s));
  const lane=lanes[0];
  await page.locator('[data-sm21-lane="'+lane+'"]').click();
  await page.locator('[data-sm21-build="arrow"]').click();
  s=await page.evaluate(()=>window.Sam21Defense.snapshot());
  assert.equal(s.towers.length,1,'tower actually placed in state');
  assert.equal(s.towers[0].kind,'arrow');assert.equal(s.towers[0].lane,lane);
  const afterBuild=s.energy;assert.ok(afterBuild>=0&&afterBuild<6,'energy consumed');
  await page.clock.runFor(1800);
  s=await page.evaluate(()=>window.Sam21Defense.snapshot());
  assert.ok(s&&s.towers[0]?.shots>0,'tower fired at a target: '+JSON.stringify(s));
  // A partida real já demonstrou disparos; injetamos apenas energia para testar UI/controle
  // de upgrades em condições determinísticas, sem gravar qualquer ranking.
  const prep=await page.evaluate(()=>window.eval('gs.energy=10;sm21StrategyUi();window.Sam21Defense.snapshot()'));
  assert.equal(prep.energy,10,'test fixture provides energy for upgrades');
  await page.locator('#sm22Upgrade').click();
  s=await page.evaluate(()=>window.Sam21Defense.snapshot());
  assert.equal(s.towers[0].level,2);assert.equal(s.energy,7);
  await page.locator('#sm22Upgrade').click();
  s=await page.evaluate(()=>window.Sam21Defense.snapshot());
  assert.equal(s.towers[0].level,3);assert.equal(s.energy,2);
  assert.equal(await page.locator('#sm22Upgrade').isDisabled(),true,'max tower level enforced');
  await page.locator('#sm22Priority').click();
  s=await page.evaluate(()=>window.Sam21Defense.snapshot());
  assert.equal(s.towers[0].priority,'strongest','targeting preference changed through real UI');
    assert.equal(errs.length,0,'no runtime exceptions: '+errs.join('; '));
  console.log('V22 BATTLE/UPGRADE PASS wave='+s.wave+' towerShots='+s.towers[0].shots+' kills='+s.kills+' energy='+s.energy+' errors='+errs.length);
  await page.close();
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e.stack||e);server.close();process.exitCode=1});
