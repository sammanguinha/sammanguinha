'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const root=process.env.SM_GAME_ROOT?path.resolve(process.env.SM_GAME_ROOT):path.resolve(__dirname,'..');
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
   await page.addInitScript(()=>{
     localStorage.setItem('sm_last_seen_update_version','24.0.0');
     localStorage.setItem('sg_handle','v25test');
     localStorage.setItem('sg_tok','abcdefghijklmnopqrstuvxyz123456789');
     localStorage.setItem('sam_rpg_hibrido_v12_v25test',JSON.stringify({map:'vila',x:11.7,y:10.8,found:[],seen:[],journal:[],epic:{class:'guardiao',seenIntro:true,gold:250,potions:3,items:['semente_guardia'],equipped:['semente_guardia']}}));
     localStorage.setItem('sg_extras_v1_v25test',JSON.stringify({seeds:0,owned:[],pet:'',best:0,day:'',claimed:[],stats:{}}));
   });
   await page.goto('http://127.0.0.1:4186/index.html',{waitUntil:'domcontentloaded',timeout:45000});
   await page.waitForFunction(()=>typeof window.showPane==='function'&&!!window.SamHybridRPG?.getState&&!!window.SamGameV27?.getSnapshot&&!!window.SamGameShellV27?.setTheme,{timeout:30000});
   const summary=await page.evaluate(()=>({
    base:!!document.querySelector('link[href="css/base.css?v=26"],link[href="css/game-v26.bundle.css?v=26"]')&&getComputedStyle(document.documentElement).getPropertyValue('--bg-deep').trim().length>0,
    scripts:!!document.querySelector('script[src="js/core/app.js?v=26"],script[src="js/game-v26.bundle.js?v=26"]'),
    world:!!document.querySelector('#r12Canvas'),
    defense:!!document.querySelector('#gCv')
   }));
   assert.ok(summary.base,'main stylesheet should load');
   assert.ok(summary.scripts,'main controller should be linked');
   assert.ok(summary.world&&summary.defense,'RPG + defense elements retained');
   assert.ok(await page.locator('link[href="visual_v27.css?v=27"]').count(),'V27 stylesheet must be linked');
   assert.equal(await page.evaluate(()=>window.SamGameShellV27.getTheme()),'aurora');
   await page.evaluate(()=>window.showPane('rpgDlg'));
   const themeSwitch=page.locator('#rpgDlg .v27-theme-button');
   assert.equal((await themeSwitch.textContent()).trim(),'🌙 Eclipse');
   await themeSwitch.click();
   assert.equal(await page.evaluate(()=>document.documentElement.dataset.v27Theme),'eclipse');
   assert.equal(await page.evaluate(()=>localStorage.getItem('sam_v27_visual_theme')),'eclipse');
   await themeSwitch.click();
   assert.equal(await page.evaluate(()=>document.documentElement.dataset.v27Theme),'aurora');
   await page.evaluate(()=>window.showPane('rpgDlg'));
   assert.ok(await page.locator('#r12Canvas').isVisible());
   assert.ok(await page.locator('#rpgDlg .sm-fullscreen-toggle').isVisible());
   await page.locator('#rpgDlg .sm-fullscreen-toggle').click();
   assert.ok(await page.locator('#r12Action').isVisible(),'action button must overlay viewport');
   assert.ok(await page.locator('#v27RpgHud').isVisible(),'RPG HUD visible during immersive gameplay');
   if(mode==='mobile'){
     const rect=await page.locator('#r12Canvas').boundingBox();
     const ratio=rect.width/rect.height;
     assert.ok(Math.abs(ratio-(768/448))<0.1,'mobile RPG art must retain its native aspect ratio; got '+ratio.toFixed(3));
   }
   assert.ok(await page.locator('#rpgDlg .v27-rpg-actionbar').isVisible(),'RPG app actionbar visible');
   const vitals=await page.evaluate(()=>window.SamGameV27.getSnapshot().rpg);
   assert.ok(vitals.maxHp>=vitals.hp&&vitals.maxMp>=vitals.mp,'calculated RPG resource caps are available');
   await page.locator('#rpgDlg [data-v27-action="rpg:inventory"]').click();
   assert.equal(await page.locator('#rpgDlg .r12-aside').isVisible(),true,'inventory opens inside immersive viewport');
   // On mobile, the inventory intentionally covers the quick toolbar. Close it using the visible top menu control.
   await page.locator('#rpgDlg .sm-immersive-menu').click();
   assert.equal(await page.locator('#rpgDlg .r12-aside').isVisible(),false,'inventory can close without exposing blocked controls');
   await page.locator('#rpgDlg [data-v27-action="rpg:shop"]').click();
   assert.ok(await page.locator('#v24Shop').isVisible(),'quick shop opens inside the fullscreen game');
   await page.locator('#v24ShopClose').click();
   if(process.env.SM_SCREENSHOTS){const dir=path.resolve(process.env.SM_SCREENSHOTS);fs.mkdirSync(dir,{recursive:true});await page.screenshot({path:path.join(dir,mode+'-rpg.png')})}
   assert.ok(await page.locator('#rpgDlg').evaluate(el=>el.classList.contains('sm-immersive')));
   await page.locator('#rpgDlg .sm-fullscreen-toggle').click();
   assert.ok(!(await page.locator('#rpgDlg').evaluate(el=>el.classList.contains('sm-immersive'))));
   await page.evaluate(()=>window.showPane('gameDlg'));
   assert.ok(await page.locator('#gCv').isVisible(),'defense canvas should remain usable');
   assert.ok(await page.locator('#gameDlg .sm-fullscreen-toggle').isVisible(),'defense immersive button visible');
   await page.locator('#gameDlg .sm-fullscreen-toggle').click();
   assert.ok(await page.locator('#v27DefenseHud').isVisible(),'defense HUD visible inside game');
   assert.ok(await page.locator('#gameDlg .v27-defense-actionbar').isVisible(),'defense quick actions visible');
   assert.equal(await page.locator('#gameDlg [data-v27-action="defense:pulse"]').isDisabled(),true,'pulse cannot be used without an active eligible game');
   await page.locator('#gameDlg [data-v27-action="defense:tactics"]').click();
   assert.equal(await page.locator('#gameDlg .sm21-tactics').isVisible(),true,'tower controls open over defense arena');
   // As in the RPG, the overlay intentionally covers the quick bar on narrow screens.
   await page.locator('#gameDlg .sm-immersive-menu').click();
   assert.equal(await page.locator('#gameDlg .sm21-tactics').isVisible(),false,'tower drawer closes through visible menu');
   if(process.env.SM_SCREENSHOTS){const dir=path.resolve(process.env.SM_SCREENSHOTS);fs.mkdirSync(dir,{recursive:true});await page.screenshot({path:path.join(dir,mode+'-defesa.png')})}
   await page.locator('#gameDlg .sm-fullscreen-toggle').click();
   assert.deepEqual(missing,[],'local resources all fetched');
   assert.deepEqual(errors,[],'no browser JavaScript errors');
   console.log(mode+' V27 PASS: modular CSS+JS, RPG, defense, immersive UI, no 404/JS errors');
   await page.close();
  }
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e.stack||e);server.close();process.exitCode=1});
