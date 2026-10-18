const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..'),mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));
 if(!file.startsWith(root+path.sep)&&file!==root)return res.writeHead(403).end();
 if(file===root)file=path.join(root,'index.html');
 fs.readFile(file,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(b)});
});
(async()=>{
 await new Promise(ok=>server.listen(4174,'127.0.0.1',ok));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const [name,width,height,mobile] of [['desktop',1280,900,false],['mobile',390,844,true]]){
   const page=await browser.newPage({viewport:{width,height},isMobile:mobile,hasTouch:mobile});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.route('https://rygeemrxyjknhxxlewdb.supabase.co/**',r=>r.fulfill({status:200,contentType:'application/json',body:'null'}));
   await page.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:'// offline mocked CDN'}));
   await page.addInitScript(()=>{
    localStorage.setItem('sm_last_seen_update_version','23.0.0');
    localStorage.setItem('sg_handle','v23play');
    localStorage.setItem('sg_tok','abcdefghijklmnopqrstuvxyz123456789');
    localStorage.setItem('sam_rpg_hibrido_v12_v23play',JSON.stringify({map:'vila',x:11.7,y:10.8,found:[],seen:[],journal:[],epic:{class:'guardiao',seenIntro:true}}));
    localStorage.setItem('sg_extras_v1_v23play',JSON.stringify({seeds:0,owned:[],pet:'',best:0,day:'',claimed:[],stats:{}}));
   });
   await page.goto('http://127.0.0.1:4174/index.html',{waitUntil:'domcontentloaded',timeout:45000});
   await page.waitForFunction(()=>!!window.Sam23World?.snapshot&&document.querySelectorAll('#r23Contracts button').length===3,{timeout:30000});
   await page.evaluate(()=>window.showPane('rpgDlg'));
   assert.equal((await page.evaluate(()=>window.Sam23World.snapshot())).map,'vila');
   // Real UI interaction: scene selection is applied to active Canvas renderer and persisted.
   await page.locator('[data-r23-mood="stars"]').click();
   assert.equal((await page.evaluate(()=>window.Sam23World.snapshot())).scene,'stars');
   await page.locator('[data-r23-guide="quadro"]').click();
   assert.match(await page.locator('#r23GuideText').innerText(),/Quadro de Contratos/);
   // Real movement, not a mocked contract completion.
   await page.keyboard.down('ArrowUp');await page.waitForTimeout(640);await page.keyboard.up('ArrowUp');
   await page.locator('#r12Action').click();
   await page.waitForFunction(()=>window.Sam23World.snapshot().contracts.some(c=>c.id==='bento'&&c.completed),{timeout:6000});
   const bento=await page.evaluate(()=>window.Sam23World.snapshot().contracts.find(c=>c.id==='bento'));
   assert.equal(bento.claimed,false);
   const claim=page.locator('#r23Contracts .r23-contract').first().locator('button');
   assert.equal(await claim.isDisabled(),false,'Bento contract becomes claimable after a real conversation');
   await claim.click();
   assert.equal((await page.evaluate(()=>window.Sam23World.snapshot().contracts.find(c=>c.id==='bento'))).claimed,true);
   assert.equal(await claim.isDisabled(),true,'claimed contract cannot be spammed');
   await page.reload({waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>!!window.Sam23World?.snapshot);
   assert.equal((await page.evaluate(()=>window.Sam23World.snapshot())).scene,'stars','atmosphere survives reload');
   assert.equal((await page.evaluate(()=>window.Sam23World.snapshot().contracts.find(c=>c.id==='bento'))).claimed,true,'daily claim survives reload');
   await page.evaluate(()=>window.showPane('gameDlg'));
   for(const id of ['root','solar'])assert.equal(await page.locator('[data-sm21-build="'+id+'"]').count(),1);
   assert.equal(errors.length,0,'runtime exceptions: '+errors.join('; '));
   fs.mkdirSync(path.join(root,'test-artifacts'),{recursive:true});
   await page.evaluate(()=>window.showPane('rpgDlg'));
   await page.screenshot({path:path.join(root,'test-artifacts','v23-world-'+name+'.png'),fullPage:false,animations:'disabled'});
   console.log(name+' WORLD PASS: travel guide, real NPC dialogue, one-time contract, cloud-safe local progress, scene persistence, defense towers. Runtime errors=0');
   await page.close();
  }
 }finally{await browser.close();server.close()}
})().catch(err=>{console.error(err.stack||err);server.close();process.exitCode=1});
