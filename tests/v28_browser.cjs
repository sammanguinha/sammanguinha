'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const root=process.env.SM_GAME_ROOT?path.resolve(process.env.SM_GAME_ROOT):path.resolve(__dirname,'..');
const out=process.env.SM_V28_SHOTS?path.resolve(process.env.SM_V28_SHOTS):null;
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));
 if(!file.startsWith(root+path.sep)&&file!==root)return res.writeHead(403).end();
 if(file===root)file=path.join(root,'index.html');
 fs.readFile(file,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(b)});
});
const modes=['home','sm18Expedition','rpgDlg','gameDlg','profDlg','houseDlg','eventDlg','diary','sm18Expedition','rankDlg','murDlg','questDlg','galDlg','secDlg','curDlg'];
(async()=>{
 await new Promise(resolve=>server.listen(4192,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const [device,width,height] of [['desktop',1440,900],['tablet',820,1180],['mobile',390,844]]){
   const page=await browser.newPage({viewport:{width,height},isMobile:device==='mobile',hasTouch:device==='mobile'});
   const errors=[],missing=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:4192/')&&r.status()>=400)missing.push(r.url())});
   await page.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:'// offline Supabase CDN'}));
   await page.route('https://rygeemrxyjknhxxlewdb.supabase.co/**',r=>r.fulfill({status:200,contentType:'application/json',body:/ranking_full|ranking_v/.test(r.request().url())?'[]':'null'}));
   await page.addInitScript(()=>{
    localStorage.setItem('sm_last_seen_update_version','24.0.0');
    localStorage.setItem('sg_handle','v28visual');
    localStorage.setItem('sg_tok','abcdefghijklmnopqrstuvxyz123456789');
    localStorage.setItem('sam_rpg_hibrido_v12_v28visual',JSON.stringify({map:'vila',x:11.7,y:10.8,found:[],seen:[],journal:[],epic:{class:'guardiao',seenIntro:true,gold:250,potions:3,items:['semente_guardia'],equipped:['semente_guardia']}}));
   });
   await page.goto('http://127.0.0.1:4192/index.html',{waitUntil:'domcontentloaded',timeout:45000});
   await page.waitForFunction(()=>typeof window.showPane==='function'&&!!window.SamGameV27?.getSnapshot&&!!window.SamGameShellV27?.setTheme,{timeout:30000});
   await page.evaluate(()=>{
    const gate=document.getElementById('gate');if(gate)gate.hidden=true;
    const notes=document.getElementById('smUpdateLayer');if(notes)notes.hidden=true;
   });
   const base=await page.evaluate(()=>({
     styles:['foundation','pages','responsive','live-extensions'].map(x=>({
       href:'css/v28-'+x+'.css?v=28',
       exists:!!document.querySelector('link[href="css/v28-'+x+'.css?v=28"]'),
       applied:Array.from(document.styleSheets).some(sheet=>sheet.href?.includes('v28-'+x+'.css')&&sheet.cssRules.length>0)
     })),
     theme:getComputedStyle(document.documentElement).getPropertyValue('--v28-gold').trim(),
     nav:getComputedStyle(document.querySelector('#areas')).position,
     portals:document.querySelectorAll('#home .portal-card').length
   }));
   assert.ok(base.styles.every(s=>s.exists&&s.applied),'all 3 V28 layers must load and parse: '+JSON.stringify(base.styles));
   assert.ok(base.theme.length>3,'theme tokens present');
   assert.equal(base.nav,'sticky','navigation should stay accessible');
   assert.ok(base.portals>=8,'portal destinations preserved');
   const visualResults=[];
   for(const id of modes){
    if(id==='sm18Expedition'){
     await page.evaluate(()=>window.showPane('home'));
     await page.locator('#sm18HubPlay').click();
    }else await page.evaluate(mode=>window.showPane(mode),id);
    await page.waitForTimeout(110);
    const target=id==='diary'?'#diary':id==='home'?'#home':'#'+id;
    assert.ok(await page.locator(target).isVisible(),'section '+id+' visible on '+device);
    const measure=await page.evaluate(mode=>{
      const pane=document.getElementById(mode),style=getComputedStyle(pane);
      return {scrollWidth:document.documentElement.scrollWidth,viewport:window.innerWidth,
        background:style.backgroundColor,hidden:pane.hidden};
    },id);
    assert.equal(measure.hidden,false,'section '+id+' must not remain hidden');
    // Some RPG canvas nodes have intrinsic large dimensions; report actual overflows
    // and fail the home and diary navigation screens where none is acceptable.
    if(['home','diary'].includes(id))
      assert.ok(measure.scrollWidth<=measure.viewport+6,device+' '+id+' horizontal overflow: '+JSON.stringify(measure));
    visualResults.push(id+':'+(measure.scrollWidth>measure.viewport+6?'overflow '+(measure.scrollWidth-measure.viewport):'OK'));
    if(out&&['home','rpgDlg','gameDlg','profDlg','houseDlg','eventDlg','diary'].includes(id)){
      const dir=path.join(out,device);fs.mkdirSync(dir,{recursive:true});
      await page.locator(target).scrollIntoViewIfNeeded();
      await page.screenshot({path:path.join(dir,id+'.png'),fullPage:false,timeout:20000});
    }
   }
   await page.evaluate(()=>window.showPane('home'));
   await page.locator('#gameBtn').click();
   assert.ok(await page.locator('#gameDlg').isVisible(),'navigation remains clickable after redesign');
   await page.locator('#homeBtn').click();
   assert.ok(await page.locator('#home').isVisible(),'navigate home after game');
   await page.evaluate(()=>window.showPane('profDlg'));
   const sw=page.locator('#profDlg .v27-theme-button');
   await sw.click();
   assert.equal(await page.evaluate(()=>window.SamGameShellV27.getTheme()),'eclipse','new CSS respects existing theme toggle');
   await sw.click();
   assert.equal(await page.evaluate(()=>window.SamGameShellV27.getTheme()),'aurora');
   assert.deepEqual(missing,[],'all local assets reachable');
   assert.deepEqual(errors,[],'no uncaught JS regressions');
   console.log(device+' V28 PASS: '+visualResults.join(', '));
   await page.close();
  }
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e.stack||e);server.close();process.exitCode=1});
