const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));
 if(!file.startsWith(root+path.sep)&&file!==root)return res.writeHead(403).end();
 if(file===root)file=path.join(root,'index.html');
 fs.readFile(file,(error,data)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data)});
});
const cellClick=async(page,x,y)=>{
 return page.evaluate(({x,y})=>{
  const cv=document.querySelector('#sm21HouseCanvas');
  const r=cv.getBoundingClientRect();
  const cx=r.left+(45+x*50+25)*r.width/540;
  const cy=r.top+(61+y*50+25)*r.height/390;
  cv.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:cx,clientY:cy}));
 },{x,y})
};
(async()=>{
 await new Promise(resolve=>server.listen(4163,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const cfg of [{name:'desktop',width:1440,height:900,mobile:false},{name:'mobile',width:390,height:844,mobile:true}]){
   const page=await browser.newPage({viewport:{width:cfg.width,height:cfg.height},isMobile:cfg.mobile,hasTouch:cfg.mobile});
   const errors=[];page.on('pageerror',err=>errors.push(err.message));
   await page.addInitScript(()=>{
    localStorage.setItem('sg_handle','teste_v21');
    localStorage.setItem('sg_tok','abcdefghijklmnopqrstuvwxyz123456');
    // Testing does not require changing live server state.
   });
   await page.goto('http://127.0.0.1:4163/index.html',{waitUntil:'domcontentloaded',timeout:45000});
   await page.waitForFunction(()=>document.querySelectorAll('#sm21HouseFurniture button').length===10,{timeout:30000});
   assert.ok(await page.locator('#houseBtn').count());
   await page.locator('#smUpdatesClose').click();
   await page.locator('#houseBtn').click();
   await page.waitForFunction(()=>!document.querySelector('#houseDlg').hidden);
   const getLayout=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('sam21_casa_teste_v21')||'null'));
   await page.locator('[data-house-theme="spring"]').click();
   await page.locator('[data-house-floor="stone"]').click();
   await page.locator('[data-house-mode="erase"]').click();
   await cellClick(page,7,1);
   const a=await getLayout();assert.equal(a.theme,'spring');assert.equal(a.floor,'stone');
   assert.equal(a.items.some(it=>it.x===7&&it.y===1),false);
   assert.ok(a.inventory.fern>=1);
   await page.locator('.sm21-furniture').filter({hasText:'Samambaia Lunar'}).click();
   await cellClick(page,7,1);
   const b=await getLayout();assert.equal(b.items.some(it=>it.id==='fern'&&it.x===7&&it.y===1),true,'furniture re-placement');
   await page.reload({waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>document.querySelectorAll('#sm21HouseFurniture button').length===10);
   const c=await getLayout();assert.equal(c.theme,'spring');assert.equal(c.floor,'stone');assert.equal(c.items.some(it=>it.id==='fern'&&it.x===7&&it.y===1),true);
   const visual=await page.evaluate(()=>{
    document.querySelector('#gameDlg').hidden=false;
    document.querySelector('#gDifficulty [data-difficulty="hard"]')?.click();
    return {lanes:document.querySelector('#sm21Lanes')?.children.length,towers:document.querySelectorAll('[data-sm21-build]').length,controls:!!document.querySelector('#sm21Energy')};
   });
   assert.deepEqual(visual,{lanes:3,towers:3,controls:true});
   for(const id of ['arrow','frost','heal'])assert.equal(await page.locator('[data-sm21-build="'+id+'"]').isDisabled(),true);
   fs.mkdirSync(path.join(root,'test-artifacts'),{recursive:true});
   await page.locator('#houseBtn').click();
   await page.screenshot({path:path.join(root,'test-artifacts','v21-house-'+cfg.name+'.png'),animations:'disabled'});
   console.log(cfg.name+' PASS: interactive house edit, persistence after reload, tactical controls. Errors '+JSON.stringify(errors.slice(0,10)));
   assert.equal(errors.length,0, cfg.name+' uncaught JavaScript exceptions: '+errors.join('; '));
   await page.close();
  }
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e.stack||e);server.close();process.exitCode=1});
