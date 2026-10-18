const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.mp3':'audio/mpeg'};
const srv=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));
 if(!file.startsWith(root+path.sep)&&file!==root)return res.writeHead(403).end();
 if(file===root)file=path.join(root,'index.html');
 fs.readFile(file,(err,bytes)=>{if(err)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(bytes)});
});
(async()=>{
 await new Promise(ok=>srv.listen(4184,'127.0.0.1',ok));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const [mode,width,height] of [['desktop',1280,900],['mobile',390,844]]){
   const page=await browser.newPage({viewport:{width,height},isMobile:mode==='mobile',hasTouch:mode==='mobile'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.route('https://rygeemrxyjknhxxlewdb.supabase.co/**',r=>r.fulfill({status:200,contentType:'application/json',body:'null'}));
   await page.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:'// mocked Supabase CDN'}));
   await page.addInitScript(()=>{
    localStorage.setItem('sm_last_seen_update_version','24.0.0');
    localStorage.setItem('sg_handle','v24test');
    localStorage.setItem('sg_tok','abcdefghijklmnopqrstuvxyz123456789');
    localStorage.setItem('sam_rpg_hibrido_v12_v24test',JSON.stringify({
      map:'vila',x:11.7,y:10.8,found:[],seen:[],journal:[],epic:{class:'guardiao',seenIntro:true,gold:400,potions:3,items:['semente_guardia'],equipped:['semente_guardia']}
    }));
    localStorage.setItem('sg_extras_v1_v24test',JSON.stringify({seeds:0,owned:[],pet:'',best:0,day:'',claimed:[],stats:{}}));
   });
   await page.goto('http://127.0.0.1:4184/index.html',{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>!!window.SamHybridRPG?.openShop,{timeout:30000});
   await page.evaluate(()=>window.showPane('rpgDlg'));
   assert.ok(await page.locator('#v24ShopShortcut').isVisible());
   await page.locator('#v24ShopShortcut').click();
   assert.ok(await page.locator('#v24Shop').isVisible());
   const before=await page.evaluate(()=>window.SamHybridRPG.getState().epic.gold);
   const card=page.locator('#v24ShopItems .v24-shop-item').filter({hasText:'Anel do Orvalho'});
   await card.locator('button').first().click();
   const bought=await page.evaluate(()=>window.SamHybridRPG.getState().epic);
   assert.equal(bought.gold,before-85);
   assert.ok(bought.items.includes('anel_orvalho'));
   assert.equal(await card.locator('button').first().isDisabled(),true);
   const tonico=page.locator('#v24ShopItems .v24-shop-item').filter({hasText:'Tônico Lunar'});
   await tonico.locator('button').first().click();
   const after=await page.evaluate(()=>window.SamHybridRPG.getState().epic);
   assert.equal(after.v24.bag.tonico_mana,1);
   assert.equal(after.gold,before-85-22);
   await page.locator('#v24ShopClose').click();
   assert.equal(await page.locator('#v24Shop').isVisible(),false);
   // A tela imersiva realmente transforma o mapa em viewport e mantém controles utilizáveis.
   await page.locator('#rpgDlg .sm-fullscreen-toggle').click();
   assert.equal(await page.locator('#rpgDlg').evaluate(el=>el.classList.contains('sm-immersive')),true);
   assert.ok(await page.locator('#r12Canvas').isVisible());
   assert.ok(await page.locator('#r12Action').isVisible());
   assert.ok(await page.locator('#v24RunTouch').isVisible());
   assert.equal(await page.locator('#rpgDlg .r12-aside').isVisible(),false,'RPG sidebar hidden for gameplay');
   await page.locator('#rpgDlg .sm-immersive-menu').click();
   assert.equal(await page.locator('#rpgDlg .r12-aside').isVisible(),true,'inventory panel is an interactive overlay');
   await page.locator('#rpgDlg .sm-immersive-menu').click();
   await page.locator('#rpgDlg .sm-fullscreen-toggle').click();
   assert.equal(await page.locator('#rpgDlg').evaluate(el=>el.classList.contains('sm-immersive')),false);
   await page.evaluate(()=>window.SamHybridRPG.gotoRoom('planicie'));
   assert.equal((await page.evaluate(()=>window.SamHybridRPG.getState())).map,'planicie');
   await page.evaluate(()=>window.SamHybridRPG.gotoRoom('gruta'));
   assert.equal((await page.evaluate(()=>window.SamHybridRPG.getState())).map,'gruta');
   await page.evaluate(()=>window.SamHybridRPG.gotoRoom('vila'));
   if(mode==='desktop'){
    await page.locator('#r12Canvas').focus();
    await page.keyboard.down('Shift');await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(1150);
    await page.keyboard.up('ArrowRight');await page.keyboard.up('Shift');
    const raced=await page.evaluate(()=>window.SamHybridRPG.getState());
    assert.ok(raced.epic.v24.stamina<100,'running must spend stamina');
   }else{
    assert.ok(await page.locator('#v24RunTouch').isVisible(),'mobile run control visible');
   }
   for(const item of ['arvore_saudavel','torre_arco','praga_corredor','rei_pragas']){
    const ok=await page.evaluate(async(name)=>{const r=await fetch('/sprites/'+name+'_v24.svg');return r.ok&&r.headers.get('Content-Type')?.includes('image/svg+xml')},item);
    assert.equal(ok,true,item+' sprite loaded');
   }
   assert.equal(errors.length,0,'browser exceptions: '+errors.join('; '));
   console.log(mode+' V24 PASS: live shop, gold, inventory, biomes, sprint, 4-frame sprites; runtime errors: 0');
   await page.close();
  }
 }finally{await browser.close();srv.close()}
})().catch(e=>{console.error(e.stack||e);srv.close();process.exitCode=1});
