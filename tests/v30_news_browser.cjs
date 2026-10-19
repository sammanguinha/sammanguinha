'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=process.env.SM_GAME_ROOT?path.resolve(process.env.SM_GAME_ROOT):path.resolve(__dirname,'..');
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));
 if(!file.startsWith(root+path.sep)&&file!==root)return res.writeHead(403).end();
 if(file===root)file=path.join(root,'index.html');
 fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data)});
});
(async()=>{
 await new Promise(ok=>server.listen(4199,'127.0.0.1',ok));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const [mode,width,height] of [['desktop',1440,900],['mobile',390,844]]){
   const page=await browser.newPage({viewport:{width,height},isMobile:mode==='mobile',hasTouch:mode==='mobile'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:'// offline CDN'}));
   await page.route('https://rygeemrxyjknhxxlewdb.supabase.co/**',r=>r.fulfill({status:200,contentType:'application/json',body:'null'}));
   await page.addInitScript(()=>{
    localStorage.setItem('sg_handle','newsuser');
    localStorage.setItem('sg_tok','abcdefghijklmnopqrstuvxyz123456789');
    localStorage.setItem('sm_last_seen_update_version','24.0.0');
   });
   await page.goto('http://127.0.0.1:4199/index.html',{waitUntil:'domcontentloaded',timeout:45000});
   await page.waitForSelector('#sm30News',{state:'visible',timeout:25000});
   await page.waitForFunction(()=>document.querySelector('#smUpdateTitle')?.textContent?.includes('V29'),null,{timeout:9000});
   assert.ok((await page.locator('#sm30News').innerText()).includes('Crônicas'));
   assert.equal(await page.locator('#smUpdateTitle').innerText(),'V29 — Crônicas Vivas');
   await page.waitForSelector('#smUpdateLayer.sm-show',{timeout:10000});
   await page.locator('#smUpdatesClose').click();
   assert.equal(await page.evaluate(()=>localStorage.getItem('sm_last_seen_release_v29')),'29.0.0');
   await page.reload({waitUntil:'domcontentloaded'});
   await page.waitForSelector('#sm30News',{state:'visible'});
   await page.waitForTimeout(300);
   assert.equal(await page.locator('#smUpdateLayer.sm-show').count(),0,'do not force popup on every refresh');
   await page.locator('#sm30NewsRead').click();
   assert.ok(await page.locator('#smUpdatePanel').isVisible());
   assert.ok((await page.locator('#smUpdatePanel').innerText()).includes('Analisar'));
   await page.locator('#smUpdatesLater').click();
   await page.evaluate(()=>window.showPane('rpgDlg'));
   assert.ok(await page.locator('#rpgDlg').isVisible(),'RPG still opens after closing release notes');
   assert.equal(await page.locator('#smUpdateLayer.sm-show').count(),0,'release overlay must not block game');
   assert.deepEqual(errors,[],'no uncaught script errors');
   console.log(mode+' V30.1 PASS: home release card, real version, first visit, dismiss, persistence, reopen and gameplay');
   await page.close();
  }
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e.stack||e);server.close();process.exitCode=1});
