'use strict';
/* Startup regression: the page must never expose three layouts while loading. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=process.env.SM_GAME_ROOT?path.resolve(process.env.SM_GAME_ROOT):path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'css/v35-boot.css'),'utf8');
const head=html.slice(0,html.indexOf('</head>')),body=html.slice(html.indexOf('</head>'));
assert.ok(/class="[^"]*sm35-booting/.test(html),'boot flag exists before first paint');
assert.ok(head.includes('css/v35-pixel-rpg.css'),'final skin loads in head');
assert.ok(head.includes('css/v35-boot.css'),'boot CSS loads in head');
assert.ok(!/<link\s+rel="stylesheet"/.test(body),'no late CSS can create intermediate layout');
assert.ok(css.includes('sm35-rescue-page'),'broken scripts must not hide the site forever');
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));if(file===root)file=path.join(root,'index.html');
 if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
 fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data)});
});
(async()=>{
 await new Promise(ok=>server.listen(4299,'127.0.0.1',ok));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{for(const [name,width,height] of [['mobile',390,844],['desktop',1280,800]]){
  const page=await browser.newPage({viewport:{width,height}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:'// empty offline SDK'}));
  await page.route('https://rygeemrxyjknhxxlewdb.supabase.co/**',r=>r.fulfill({status:200,contentType:'application/json',body:'[]'}));
  await page.route('**/js/ui/v35-pixel-ui.js?v=35.0',async r=>{await new Promise(ok=>setTimeout(ok,1900));await r.continue()});
  await page.goto('http://127.0.0.1:4299/',{waitUntil:'commit',timeout:45000});
  await page.waitForSelector('#home',{state:'attached',timeout:18000});
  const initial=await page.evaluate(()=>({boot:document.documentElement.classList.contains('sm35-booting'),visibility:getComputedStyle(document.body).visibility,loading:getComputedStyle(document.documentElement,'::after').content,skin:document.documentElement.classList.contains('v35-pixel')}));
  assert.equal(initial.boot,true,name+' still booting before last UI script');
  assert.equal(initial.visibility,'hidden',name+' cannot show a legacy layout');
  assert.equal(initial.skin,true,name+' final theme is present from document start');
  assert.match(initial.loading,/Preparando o Pomar/);
  await page.waitForFunction(()=>document.documentElement.dataset.sm35Ready==='true',{timeout:25000});
  const done=await page.evaluate(()=>({boot:document.documentElement.classList.contains('sm35-booting'),visibility:getComputedStyle(document.body).visibility,skin:document.documentElement.classList.contains('v35-pixel'),width:document.documentElement.scrollWidth,viewport:innerWidth}));
  assert.equal(done.boot,false,name+' removed startup overlay');
  assert.equal(done.visibility,'visible',name+' main site visible');
  assert.equal(done.skin,true,name+' did not regress to old CSS');
  assert.ok(done.width<=done.viewport+7,name+' no width overflow');
  assert.ok(await page.locator('#v32Resume').isVisible(),name+' play button works');
  assert.deepEqual(errors,[],name+' no runtime exceptions');
  console.log(name+' startup PASS: one loader, no V25/V34 flash, pixel site visible after ready');
  await page.close();
 }}finally{await browser.close();server.close()}
})().catch(e=>{console.error(e.stack||e);server.close();process.exitCode=1});
