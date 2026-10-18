const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));if(!file.startsWith(root+path.sep)&&file!==root)return res.writeHead(403).end();if(file===root)file=path.join(root,'index.html');fs.readFile(file,(err,bytes)=>{if(err)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(bytes)})});
(async()=>{await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 for(const cfg of [{name:'desktop',width:1440,height:900,mobile:false},{name:'mobile',width:390,height:844,mobile:true}]){
 const page=await browser.newPage({viewport:{width:cfg.width,height:cfg.height},isMobile:cfg.mobile,hasTouch:cfg.mobile});
 const errors=[],assets=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(r.url().includes('v23.svg'))assets.push(r.url().split('/').at(-1))});
 await page.route('https://rygeemrxyjknhxxlewdb.supabase.co/**',r=>r.fulfill({status:200,contentType:'application/json',body:'null'}));
 await page.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({status:200,contentType:'application/javascript',body:'// offline third-party fallback'}));
 await page.addInitScript(()=>{
  localStorage.setItem('sm_last_seen_update_version','23.0.0');
  localStorage.setItem('sg_handle','v23tester');
  localStorage.setItem('sg_tok','abcdefghijklmnopqrstuvwxyz123456');
 });
 await page.goto('http://127.0.0.1:4173/index.html',{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForFunction(()=>typeof window.showPane==='function'&&document.getElementById('r23GuideList')&&document.getElementById('r23SettingsToggle'),{timeout:30000});
 await page.evaluate(()=>window.showPane('rpgDlg'));
 await page.waitForFunction(()=>!document.querySelector('#rpgDlg').hidden);
 await page.evaluate(()=>document.querySelector('[data-r23-guide="casa"]').click());
 await page.waitForFunction(()=>document.querySelector('#r23GuideText').textContent.includes('Seu Refúgio'));
 assert.equal(await page.locator('[data-r23-guide="casa"]').getAttribute('aria-pressed'),'true');
 const waypoint=await page.locator('#r23GuideText').innerText();assert.ok(waypoint.includes('Destino'));
 await page.evaluate(()=>document.querySelector('[data-r23-guide="praca"]').click());
 assert.match(await page.locator('#r23GuideText').innerText(),/Praça Ao Vivo/);
 await page.locator('#r23SettingsToggle').click();
 await page.locator('#r23EffectPref').check();
 await page.locator('#r23ContrastPref').check();
 assert.ok(await page.evaluate(()=>document.documentElement.classList.contains('sm165-lowfx')&&document.documentElement.classList.contains('r23-high-contrast')));
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>!!document.getElementById('r23SettingsToggle'));
 assert.ok(await page.evaluate(()=>document.documentElement.classList.contains('sm165-lowfx')&&document.documentElement.classList.contains('r23-high-contrast')),'preferences survive reload');
 await page.evaluate(()=>window.showPane('houseDlg'));
 assert.equal(await page.locator('#houseDlg').evaluate(e=>e.hidden),false,'house navigation');
 await page.evaluate(()=>window.showPane('murDlg'));
 assert.equal(await page.locator('#murDlg').evaluate(e=>e.hidden),false,'social navigation');
 await page.evaluate(()=>window.showPane('gameDlg'));
 assert.equal(await page.locator('#gameDlg').evaluate(e=>e.hidden),false,'defense navigation');
 const hit=await page.evaluate(()=>{const el=document.getElementById('r23GuideList');return el&&getComputedStyle(el).display!=='none'});
 assert.ok(hit);
 assert.ok(assets.some(x=>x.includes('npc_bento_v23.svg')),'real sprite asset requested: '+assets.join(', '));
 assert.equal(errors.length,0,'runtime JS exceptions on '+cfg.name+': '+errors.join(' | '));
 console.log(cfg.name+' PASS: waypoints, SVG sprites, persisted settings, home/defense/social panels; requestedSprites='+assets.length+' errors=0');
 await page.close();
 }
}finally{await browser.close();server.close()}
})().catch(e=>{console.error(e.stack||e);server.close();process.exitCode=1});