'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const root=process.env.SM_GAME_ROOT?path.resolve(process.env.SM_GAME_ROOT):path.resolve(__dirname,'..');
const previews=process.env.SM_FULLSCREEN_SHOTS?path.resolve(process.env.SM_FULLSCREEN_SHOTS):null;
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon'};
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));
 if(!file.startsWith(root+path.sep)&&file!==root)return res.writeHead(403).end();
 if(file===root)file=path.join(root,'index.html');
 fs.readFile(file,(err,data)=>{
  if(err)return res.writeHead(404).end();
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
  res.end(data);
 });
});
(async()=>{
 await new Promise(resolve=>server.listen(4189,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const [name,width,height,touch] of [
   ['desktop',1440,900,false],['phone-portrait',390,844,true],
   ['phone-landscape',844,390,true],['tablet',820,1180,true]
  ]){
   const page=await browser.newPage({viewport:{width,height},isMobile:touch,hasTouch:touch});
   const errors=[],missing=[];
   page.on('pageerror',error=>errors.push(error.message));
   page.on('response',resp=>{if(resp.url().startsWith('http://127.0.0.1:4189/')&&resp.status()>=400)missing.push(resp.url())});
   await page.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:'// integration fixture'}));
   await page.route('https://rygeemrxyjknhxxlewdb.supabase.co/**',r=>r.fulfill({status:200,contentType:'application/json',body:'null'}));
   await page.addInitScript(()=>{
    localStorage.setItem('sm_last_seen_update_version','24.0.0');
    localStorage.setItem('sg_handle','fullscreenuser');
    localStorage.setItem('sg_tok','abcdefghijklmnopqrstuvxyz123456789');
    localStorage.setItem('sam_rpg_hibrido_v12_fullscreenuser',
      JSON.stringify({map:'vila',x:11.7,y:10.8,found:[],seen:[],journal:[],
       epic:{class:'guardiao',seenIntro:true,gold:250,potions:3,items:[],equipped:[]}}));
   });
   await page.goto('http://127.0.0.1:4189/index.html',{waitUntil:'domcontentloaded',timeout:45000});
   await page.waitForFunction(()=>typeof window.showPane==='function'&&!!window.SamHybridRPG?.getState&&!!window.SamImmersive,{timeout:30000});
   await page.evaluate(()=>window.showPane('rpgDlg'));
   assert.ok(await page.locator('#rpgDlg .sm-rpg-head-enter').isVisible(),name+' header button must be visible');
   assert.ok(await page.locator('#rpgDlg .sm-rpg-map-enter').isVisible(),name+' map launcher must be visible');
   assert.ok((await page.locator('#rpgDlg .sm-rpg-map-enter').innerText()).includes('TELA CHEIA'));
   await page.locator('#rpgDlg .sm-rpg-map-enter').click();
   await page.waitForFunction(()=>{
    const c=document.getElementById('r12Canvas'),b=c.getBoundingClientRect();
    return document.getElementById('rpgDlg').classList.contains('sm-immersive')&&
     b.width>=innerWidth*.96&&b.height>=innerHeight*.96&&
     Math.abs(c.width/c.height-b.width/b.height)<.04;
   },null,{timeout:9000});
   const state=await page.evaluate(()=>{
    const c=document.getElementById('r12Canvas'),a=c.getBoundingClientRect();
    const pane=document.getElementById('rpgDlg'),r=pane.getBoundingClientRect();
    const main=document.querySelector('#rpgDlg .sm-fullscreen-toggle');
    const controls=[...document.querySelectorAll('#rpgDlg [data-r12move]')].map(button=>{
      const b=button.getBoundingClientRect(),target=document.elementFromPoint(b.x+b.width/2,b.y+b.height/2);
      return {label:button.getAttribute('aria-label'),visible:b.width>20&&b.height>20,
       topmost:button===target||button.contains(target)};
    });
    return {screen:[innerWidth,innerHeight],canvas:[a.x,a.y,a.width,a.height],
     buffer:[c.width,c.height],pane:[r.width,r.height],exit:main?.innerText,
     controls,world:window.SamHybridRPG.getState().map};
   });
   assert.ok(Math.abs(state.canvas[0])<=2&&Math.abs(state.canvas[1])<=2,'world starts at viewport origin: '+JSON.stringify(state));
   assert.ok(state.controls.every(c=>c.visible&&c.topmost),'directional controls remain clickable: '+JSON.stringify(state.controls));
   assert.ok(state.exit.includes('Sair'),name+' visible exit button');
   assert.ok(await page.locator('#v27RpgHud').isVisible(),name+' resource HUD visible');
   assert.ok(await page.locator('#rpgDlg .v27-rpg-actionbar').isVisible(),name+' inventory and quest toolbar visible');
   assert.equal(state.world,'vila','original world and save still loaded');
   if(name==='phone-portrait')assert.ok(state.buffer[1]>state.buffer[0],'real portrait camera, not stretched 16:9 image');
   if(name==='desktop')assert.ok(state.buffer[0]>state.buffer[1],'desktop landscape camera');
   if(previews){
    fs.mkdirSync(previews,{recursive:true});
    await page.screenshot({path:path.join(previews,name+'-fullscreen.png'),timeout:25000});
   }
   await page.locator('#rpgDlg .sm-fullscreen-toggle').click();
   await page.waitForFunction(()=>!document.getElementById('rpgDlg').classList.contains('sm-immersive'));
   await page.waitForFunction(()=>{
    const c=document.getElementById('r12Canvas');
    return c.width===768&&c.height===448;
   },null,{timeout:8000});
   assert.ok(await page.locator('#rpgDlg .sm-rpg-head-enter').isVisible(),name+' game can relaunch from header');
   await page.locator('#rpgDlg .sm-rpg-head-enter').click();
   assert.ok(await page.locator('#rpgDlg .sm-fullscreen-toggle').isVisible());
   await page.locator('#rpgDlg .sm-fullscreen-toggle').click();
   assert.deepEqual(missing,[],'no missing local assets');
   assert.deepEqual(errors,[],'no uncaught JS errors');
   console.log(name+' PASS: viewport '+state.canvas.map(Math.round).join('×')+', drawing buffer '+state.buffer.join('×')+', touch and exit');
   await page.close();
  }
 }finally{await browser.close();server.close()}
})().catch(error=>{console.error(error.stack||error);server.close();process.exitCode=1});
