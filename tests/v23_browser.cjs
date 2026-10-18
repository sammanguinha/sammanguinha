const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));
 if(!file.startsWith(root+path.sep)&&file!==root)return res.writeHead(403).end();
 if(file===root)file=path.join(root,'index.html');
 fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data)});
});
const walk=async(page,keys,duration)=>{
 for(const key of keys)await page.keyboard.down(key);
 await page.waitForTimeout(duration);
 for(const key of keys)await page.keyboard.up(key);
};
(async()=>{
 await new Promise(r=>server.listen(4168,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const device of [{name:'desktop',width:1366,height:900,mobile:false},{name:'mobile',width:390,height:844,mobile:true}]){
   const page=await browser.newPage({viewport:{width:device.width,height:device.height},isMobile:device.mobile,hasTouch:device.mobile});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.route('https://rygeemrxyjknhxxlewdb.supabase.co/**',async route=>{
    const url=new URL(route.request().url()),key=url.pathname.split('/').at(-1);
    const reply=key==='claim_profile'?{handle:'v23tester',avatar:{c:0,h:'none'},xp:120,mangoes:50,found:[]}:key==='sm22_house_load'?null:key==='sm22_house_save'?{revision:1,state:{},updated_at:new Date().toISOString()}:key==='game_ranking'?[]:key==='sm_live_messages'?[]:[];
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(reply)});
   });
   await page.route('https://cdn.jsdelivr.net/**',route=>route.fulfill({status:200,contentType:'text/javascript',body:'// stub external library for isolated QA'}));
   await page.addInitScript(()=>{
    localStorage.setItem('sg_handle','v23tester');
    localStorage.setItem('sg_tok','abcdefghij1234567890abcdefghijklmnop');
    localStorage.setItem('sm_last_seen_update_version','23.0.0');
   });
   await page.goto('http://127.0.0.1:4168/index.html',{waitUntil:'domcontentloaded',timeout:45000});
   await page.waitForFunction(()=>!!window.Sam23World && !!window.Sam23Hub,{timeout:20000});
   assert.ok(await page.locator('#v23Journey').isVisible(),'central de jornada');
   assert.equal(await page.locator('.v23-hub-actions [data-go]').count(),4);
   await page.locator('[data-v23-setting="contrast"]').click();
   assert.ok(await page.evaluate(()=>document.documentElement.classList.contains('v23-high-contrast')));
   await page.locator('[data-v23-setting="text"]').click();
   assert.ok(await page.evaluate(()=>document.documentElement.classList.contains('v23-large-text')));
   await page.locator('.v23-hub-actions [data-go="rpgDlg"]').click();
   await page.waitForFunction(()=>!document.querySelector('#rpgDlg').hidden,{timeout:10000});
   // First-time players must select a class and read the intro before exploring.
   if(await page.locator('#r13ClassSelect').isVisible()){
     await page.locator('[data-r13class]').first().click();
     for(let i=0;i<14;i++){
       if(!(await page.locator('#r12Bubble').isVisible()))break;
       await page.locator('#r12TalkNext').click();
     }
   }

   const init=await page.evaluate(()=>window.Sam23World.snapshot());
   assert.equal(init.map,'vila');assert.equal(init.mission.started,false);
   await page.waitForTimeout(250);
   assert.ok(await page.evaluate(()=>{const c=document.querySelector('#r12V23Minimap');return c&&c.getContext('2d').getImageData(90,45,1,1).data[3]>0}), 'minimap pixels render');
   // A real interaction: approach Mira diagonally from the starting point and talk.
   await page.locator('#r12Canvas').focus();
   await walk(page,['ArrowLeft','ArrowUp'],900);
   await page.keyboard.press('e');
   await page.waitForTimeout(200);
   let state=await page.evaluate(()=>window.Sam23World.snapshot());
   assert.equal(state.mission.started,true,'Mira quest starts by interacting in world: '+JSON.stringify(state));
   await page.locator('#r12TalkNext').click();
   assert.ok((await page.locator('#r12V23Quest').textContent()).includes('0/3'));
   // Finish the whole three-lantern quest using real player movement and interaction.
   await page.locator('#r12Canvas').focus();
   await walk(page,['ArrowUp'],660);
   await page.keyboard.press('e');
   await page.waitForTimeout(100);
   state=await page.evaluate(()=>window.Sam23World.snapshot());
   assert.ok(state.mission.lit.includes('v23LampNorth'),'north lamp lit by real interaction: '+JSON.stringify(state));
   await page.locator('#r12TalkNext').click();
   await page.locator('#r12Canvas').focus();
   await walk(page,['ArrowRight'],1620);
   await page.keyboard.press('e');
   await page.waitForTimeout(100);
   state=await page.evaluate(()=>window.Sam23World.snapshot());
   assert.ok(state.mission.lit.includes('v23LampEast'),'east lamp lit by real interaction: '+JSON.stringify(state));
   await page.locator('#r12TalkNext').click();
   await page.locator('#r12Canvas').focus();
   await walk(page,['ArrowDown'],1120);
   await page.keyboard.press('e');
   await page.waitForTimeout(100);
   state=await page.evaluate(()=>window.Sam23World.snapshot());
   assert.ok(state.mission.lit.includes('v23LampSouth'),'south lamp lit by real interaction: '+JSON.stringify(state));
   assert.equal(state.mission.rewarded,true,'quest completion saved in world state');
   await page.locator('#r12TalkNext').click();
   const wallet=await page.evaluate(()=>JSON.parse(localStorage.getItem('sg_extras_v1_v23tester')||'null'));
   assert.ok(wallet?.seeds>=40,'40 local seeds granted: '+JSON.stringify(wallet));
   const before=wallet.seeds;
   await page.keyboard.press('e');
   await page.waitForTimeout(100);
   const again=await page.evaluate(()=>JSON.parse(localStorage.getItem('sg_extras_v1_v23tester')||'null'));
   assert.equal(again?.seeds,before,'quest reward cannot be claimed twice');
   const assets=await page.evaluate(()=>performance.getEntriesByType('resource').filter(x=>x.name.includes('v23_mira.svg')).length);
   assert.ok(assets>=1,'animated Mira sprite fetched during world render');
   await page.locator('#r12V23Return').click();
   assert.equal((await page.evaluate(()=>window.Sam23World.snapshot())).map,'vila');
   await page.screenshot({path:(fs.mkdirSync(path.join(root,'test-artifacts'),{recursive:true}),path.join(root,'test-artifacts','v23-vila-'+device.name+'.png')),animations:'disabled'});
   assert.equal(errors.length,0,device.name+' unexpected JS errors: '+errors.join(' | '));
   console.log(device.name+' PASS: Hub, accessibility, map, Mira NPC and three lanterns completed, local reward once, sprite animation asset, 0 JS errors.');
   await page.close();
  }
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e.stack||e);server.close();process.exitCode=1});
