const {chromium}=require('playwright');
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));
 if(!file.startsWith(root+path.sep)&&file!==root)return res.writeHead(403).end();
 if(file===root)file=path.join(root,'index.html');
 fs.readFile(file,(error,data)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data)});
});
(async()=>{
 await new Promise(done=>server.listen(4165,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const cfg of [{name:'desktop',width:1366,height:900,mobile:false},{name:'mobile',width:390,height:844,mobile:true}]){
   let cloud=null,revision=0,writes=0,reads=0;
   const page=await browser.newPage({viewport:{width:cfg.width,height:cfg.height},isMobile:cfg.mobile,hasTouch:cfg.mobile});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.route('https://rygeemrxyjknhxxlewdb.supabase.co/**',async route=>{
    const request=route.request(),url=new URL(request.url()),name=url.pathname.split('/').at(-1);
    if(name==='sm22_house_load'){reads++;return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(cloud&&{revision,state:cloud,updated_at:new Date().toISOString()})})}
    if(name==='sm22_house_save'){
     const input=JSON.parse(request.postData()||'{}');
     if(input.p_expected_revision!==revision)return route.fulfill({status:409,contentType:'application/json',body:JSON.stringify({message:'house_conflict'})});
     revision++;writes++;cloud=structuredClone(input.p_state);
     return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({revision,state:cloud,updated_at:new Date().toISOString()})});
    }
    let result=null;if(name==='claim_profile')result={handle:'v22tester',xp:0,mangoes:0,avatar:{c:0,h:'none'},found:[]};
    if(name==='game_ranking'||name==='posts'||name==='mural')result=[];
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(result)});
   });
   await page.route('https://cdn.jsdelivr.net/**',route=>route.fulfill({status:200,contentType:'text/javascript',body:'// CDN stub: Supabase Realtime client not needed for this test'}));
   await page.addInitScript(()=>{
    localStorage.setItem('sg_handle','v22tester');
    localStorage.setItem('sg_tok','abcdefghijklmnopqrstuvwx123456789');
    localStorage.setItem('sm_last_seen_update_version','22.0.0');
   });
   await page.goto('http://127.0.0.1:4165/index.html',{waitUntil:'domcontentloaded',timeout:45000});
   await page.waitForFunction(()=>document.querySelector('#sm22SyncStatus')?.textContent?.includes('primeira vez'),{timeout:20000});
   assert.equal(revision,1,cfg.name+': initial cloud upload');
   assert.equal(cloud.items.length,3);
   await page.locator('#houseBtn').click();
   await page.locator('[data-house-theme="spring"]').click();
   await page.waitForFunction(()=>document.querySelector('#sm22SyncStatus')?.textContent?.includes('alterações foram salvas'),{timeout:12000});
   assert.equal(cloud.theme,'spring');assert.equal(revision,2);
   // Remote changes unseen by this device, then device makes local changes: no silent overwrites.
   cloud={...cloud,theme:'midnight',floor:'planks'};revision++;
   await page.locator('[data-house-floor="stone"]').click();
   await page.waitForFunction(()=>!document.querySelector('#sm22SyncConflict').hidden,{timeout:14000});
   assert.equal(cloud.theme,'midnight','cloud was not overwritten');
   const pre=await page.evaluate(()=>JSON.parse(localStorage.getItem('sam21_casa_v22tester')));
   assert.equal(pre.theme,'spring','local edits are preserved before choosing');
   await page.locator('#sm22SyncCloud').click();
   await page.waitForFunction(()=>document.querySelector('#sm22SyncStatus')?.textContent?.includes('versão da nuvem'),{timeout:10000});
   const pulled=await page.evaluate(()=>JSON.parse(localStorage.getItem('sam21_casa_v22tester')));
   assert.equal(pulled.theme,'midnight');assert.equal(pulled.floor,'planks');
   assert.equal(revision,3,'download never writes');
   // Another remote conflict; explicitly keep the device's changes instead.
   cloud={...cloud,theme:'spring',floor:'planks'};revision++;
   await page.locator('[data-house-floor="garden"]').click();
   await page.waitForFunction(()=>!document.querySelector('#sm22SyncConflict').hidden,{timeout:14000});
   await page.locator('#sm22SyncLocal').click();
   await page.waitForFunction(()=>document.querySelector('#sm22SyncStatus')?.textContent?.includes('versão deste aparelho'),{timeout:10000});
   assert.equal(cloud.theme,'midnight');assert.equal(cloud.floor,'garden');assert.equal(revision,5,'explicit local choice increments revision');
   assert.equal(errors.length,0,'uncaught '+cfg.name+': '+errors.join(' | '));
   fs.mkdirSync(path.join(root,'test-artifacts'),{recursive:true});
   await page.screenshot({path:path.join(root,'test-artifacts','v22-sync-'+cfg.name+'.png'),animations:'disabled'});
   console.log(cfg.name+' CLOUD SYNC PASS; revisions='+revision+' writes='+writes+' reads='+reads+' conflicts handled=2; pageErrors=0');
   await page.close();
  }
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e.stack||e);server.close();process.exitCode=1});
