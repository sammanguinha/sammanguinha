'use strict';
/* V32: testa o menu real, foco, biblioteca, retomada e visual responsivo. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const root=process.env.SM_GAME_ROOT?path.resolve(process.env.SM_GAME_ROOT):path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.ico':'image/x-icon'};
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));
 if(file===root)file=path.join(root,'index.html');
 if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
 fs.readFile(file,(error,data)=>{if(error)return res.writeHead(404).end();
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data)});
});
(async()=>{
 await new Promise(resolve=>server.listen(4292,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
 for(const [name,width,height]of[['desktop',1366,820],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},isMobile:name==='mobile',hasTouch:name==='mobile'});
  const errors=[],missing=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:4292/')&&r.status()>=400)missing.push(r.url())});
  await page.route('https://cdn.jsdelivr.net/**',route=>route.fulfill({status:200,contentType:'text/javascript',body:'// offline mock'}));
  await page.route('https://rygeemrxyjknhxxlewdb.supabase.co/**',route=>route.fulfill({status:200,contentType:'application/json',body:'[]'}));
  await page.addInitScript(()=>{
    localStorage.setItem('sm_last_seen_update_version','24.0.0');
    localStorage.setItem('sm_last_seen_release_v29','29.0.0');
    localStorage.setItem('sm_last_seen_v31_preview','31.0.0-preview');
    localStorage.setItem('sg_handle','v32browser');
    localStorage.setItem('sg_tok','abcdefghijklmnopqrstuvwxyz123456789');
  });
  await page.goto('http://127.0.0.1:4292/',{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>!!window.SamSiteV32&&typeof window.showPane==='function',{timeout:25000});
  for(const id of ['homeBtn','rpgWorldBtn','gameBtn','houseBtn','profBtn'])assert.equal(await page.locator('#areas .v32-tabs>button#'+id).count(),1,'primary '+id+' available');
  assert.equal(await page.locator('#v32MorePanel [data-p]').count(),8,'eight preserved secondary destinations');
  assert.equal(await page.locator('#v32MorePanel').isHidden(),true,'menu closed initially');
  for(const id of ['rpgDlg','gameDlg','houseDlg','profDlg'])assert.equal(await page.locator('.v32-featured-grid .portal-card[data-go="'+id+'"]').count(),1,'featured destination '+id);
  for(const id of ['eventDlg','diary','rankDlg','murDlg','galDlg','secDlg'])assert.ok(await page.locator('.v32-library .portal-card[data-go="'+id+'"]').count()>=1,'available library destination '+id);
  assert.equal(await page.locator('#v32Library').evaluate(el=>el.open),false,'secondary library collapsed');
  const overflow=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth}));
  assert.ok(overflow.page<=overflow.viewport+7,name+' home horizontal overflow '+JSON.stringify(overflow));
  await page.locator('#v32MoreToggle').click();
  assert.equal(await page.locator('#v32MoreToggle').getAttribute('aria-expanded'),'true');
  await page.locator('#v32DestinationSearch').fill('Diário');
  assert.equal(await page.locator('#v32MorePanel button[data-p]:visible').count(),1,'filter searches actual links');
  await page.locator('#diaryBtn').click();
  assert.equal(await page.locator('#diary').isVisible(),true,'secondary destination opens');
  assert.equal(await page.locator('#v32MorePanel').isHidden(),true,'menu closes after selection');
  await page.locator('#homeBtn').click();
  assert.ok(await page.locator('#home').isVisible(),'home remains usable');
  await page.locator('#v32Library summary').click();
  assert.ok(await page.locator('.v32-library-grid .portal-card[data-go="galDlg"]').isVisible());
  await page.locator('.v32-library-grid .portal-card[data-go="galDlg"]').click();
  assert.ok(await page.locator('#galDlg').isVisible(),'library destination routes correctly');
  await page.locator('#gameBtn').click();
  assert.ok(await page.locator('#gameDlg').isVisible(),'defense retained');
  assert.equal(await page.evaluate(()=>localStorage.getItem('sam_v32_last_journey')),'gameDlg','resume stored');
  await page.locator('#homeBtn').click();
  assert.equal(await page.locator('#v32Resume').getAttribute('data-go'),'gameDlg');
  await page.locator('#v32Resume').click();
  assert.ok(await page.locator('#gameDlg').isVisible(),'resume works');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.SamSiteV32);
  assert.equal(await page.locator('#v32Resume').getAttribute('data-go'),'gameDlg','resume persists');
  assert.deepEqual(missing,[],name+' missing assets');
  assert.deepEqual(errors,[],name+' uncaught runtime errors');
  console.log(name+' V32 PASS: navigation, filter, accessible overflow, destination library, defense resume, reload');
  await page.close();
 }
 }finally{await browser.close();server.close()}
})().catch(error=>{console.error(error.stack||error);server.close();process.exitCode=1});
