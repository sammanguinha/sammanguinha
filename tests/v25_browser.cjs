'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent((req.url||'/').split('?')[0]);
 let file=path.resolve(root,'.'+pathname);
 if(!file.startsWith(root+path.sep)&&file!==root)return res.writeHead(403).end();
 if(file===root)file=path.join(root,'index.html');
 fs.readFile(file,(err,bytes)=>{if(err)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(bytes)});
});
(async()=>{
 await new Promise(done=>server.listen(4186,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const [mode,width,height] of [['desktop',1320,900],['mobile',390,844]]){
   const page=await browser.newPage({viewport:{width,height},isMobile:mode==='mobile',hasTouch:mode==='mobile'});
   const errors=[],missing=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:4186/')&&r.status()>=400)missing.push(r.status()+' '+r.url())});
   await page.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:'// mocked Supabase CDN'}));
   await page.route('https://rygeemrxyjknhxxlewdb.supabase.co/**',r=>r.fulfill({status:200,contentType:'application/json',body:'null'}));
   await page.addInitScript(()=>{localStorage.setItem('sm_last_seen_update_version','24.0.0')});
   await page.goto('http://127.0.0.1:4186/index.html',{waitUntil:'domcontentloaded',timeout:45000});
   await page.waitForFunction(()=>typeof window.showPane==='function'&&!!window.SamHybridRPG?.getState,{timeout:30000});
   const summary=await page.evaluate(()=>({
    base:!!document.querySelector('link[href="css/base.css?v=25"]')&&getComputedStyle(document.documentElement).getPropertyValue('--bg-deep').trim().length>0,
    scripts:!!document.querySelector('script[src="js/core/app.js?v=25"]'),
    world:!!document.querySelector('#r12Canvas'),
    defense:!!document.querySelector('#gCv')
   }));
   assert.ok(summary.base,'main stylesheet should load');
   assert.ok(summary.scripts,'main controller should be linked');
   assert.ok(summary.world&&summary.defense,'RPG + defense elements retained');
   await page.evaluate(()=>window.showPane('rpgDlg'));
   assert.ok(await page.locator('#r12Canvas').isVisible());
   assert.ok(await page.locator('#rpgDlg .sm-fullscreen-toggle').isVisible());
   await page.locator('#rpgDlg .sm-fullscreen-toggle').click();
   assert.ok(await page.locator('#r12Action').isVisible(),'action button must overlay viewport');
   assert.ok(await page.locator('#rpgDlg').evaluate(el=>el.classList.contains('sm-immersive')));
   await page.locator('#rpgDlg .sm-fullscreen-toggle').click();
   assert.ok(!(await page.locator('#rpgDlg').evaluate(el=>el.classList.contains('sm-immersive'))));
   await page.evaluate(()=>window.showPane('gameDlg'));
   assert.ok(await page.locator('#gCv').isVisible(),'defense canvas should remain usable');
   assert.ok(await page.locator('#gameDlg .sm-fullscreen-toggle').isVisible(),'defense immersive button visible');
   assert.deepEqual(missing,[],'local resources all fetched');
   assert.deepEqual(errors,[],'no browser JavaScript errors');
   console.log(mode+' V25 PASS: modular CSS+JS, RPG, defense, immersive UI, no 404/JS errors');
   await page.close();
  }
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e.stack||e);server.close();process.exitCode=1});
