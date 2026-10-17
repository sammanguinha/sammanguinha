const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));
 if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return}
 if(file===root)file=path.join(root,'index.html');
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data)});
});
(async()=>{
 await new Promise(resolve=>server.listen(4162,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const context of [{name:'desktop',viewport:{width:1366,height:820},isMobile:false},{name:'mobile',viewport:{width:390,height:844},isMobile:true}]){
    const page=await browser.newPage({viewport:context.viewport,isMobile:context.isMobile,hasTouch:context.isMobile});
    const errs=[];page.on('pageerror',e=>errs.push(e.message));
    await page.goto('http://127.0.0.1:4162/index.html',{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForFunction(()=>document.querySelector('#sm20Live')&&document.querySelector('#inventoryGrid .item-card'),{timeout:30000});
    const release=await page.evaluate(()=>{
      const release=document.querySelector('#smUpdateLayer');
      return {v20:release?.textContent?.includes('V20'),versions:release?.textContent?.includes('V19')&&release.textContent.includes('V18')};
    });
    assert.deepEqual(release,{v20:true,versions:true},context.name+': version panels');
    const wardrobe=await page.evaluate(()=>{
      const search=document.querySelector('#sm20WardrobeSearch');
      search.value='Boina do Astrônomo';search.dispatchEvent(new Event('input',{bubbles:true}));
      const found=[...document.querySelectorAll('#inventoryGrid .item-card .item-name')].map(n=>n.textContent);
      search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));
      return {found,total:document.querySelectorAll('#inventoryGrid .item-card').length};
    });
    assert.ok(wardrobe.found.includes('Boina do Astrônomo'),context.name+': wardrobe search');
    assert.ok(wardrobe.total>=30,context.name+': wardrobe items');
    const chat=await page.evaluate(()=>{
      document.querySelector('#murDlg').hidden=false;
      const r=document.querySelector('[data-sm20-room="rpg"]');
      r.click();
      return {room:r.getAttribute('aria-pressed'),input:!!document.querySelector('#sm20LiveInput'),feedback:!!document.querySelector('#sm20LiveStatus')};
    });
    assert.deepEqual(chat,{room:'true',input:true,feedback:true},context.name+': chat room');
    const defense=await page.evaluate(()=>{
      document.querySelector('#gameDlg').hidden=false;
      return ['sm20Dash','sm20Nova','sm20DashCd','sm20NovaCd','sm20Combo'].every(id=>!!document.getElementById(id)) && !!document.querySelector('#gCv').getContext('2d');
    });
    assert.ok(defense,context.name+': defense controls');
    fs.mkdirSync(path.join(root,'test-artifacts'),{recursive:true});
    await page.screenshot({path:path.join(root,'test-artifacts','v20-'+context.name+'.png'),fullPage:false,animations:'disabled'});
    console.log(context.name+': release OK; wardrobe '+wardrobe.total+' items; rooms OK; defense controls OK. Uncaught JS errors: '+JSON.stringify(errs.slice(0,5)));
    await page.close();
  }
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e.stack||e);server.close();process.exitCode=1});
