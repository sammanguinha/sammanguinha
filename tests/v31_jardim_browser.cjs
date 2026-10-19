'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=process.env.SM_GAME_ROOT?path.resolve(process.env.SM_GAME_ROOT):path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
 if(file===root)file=path.join(root,'index.html');
 if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
 fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end();
 res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream');res.end(data)});
});
const initial={
 map:'bosqueEcos',x:20.5,y:7,seen:['welcome'],found:[],journal:[],
 epic:{class:'guardiao',level:13,points:0,stats:{vig:30,for:43,int:36,agi:29},
 gold:220,hp:420,mp:50,potions:8,chapter:0,seenIntro:true,
 items:['semente_guardia'],equipped:['semente_guardia'],defeated:[],flags:{},story:[],
 v30:{started:true,discovered:true,sequence:3,opened:true,
 records:['v30RecordPath','v30RecordHarvest','v30RecordMemory'],completed:true,
 chapter1:{metAyla:true,chimes:3,bossWon:true,mural:true,finished:true}}}
};
async function run(){
 await new Promise(resolve=>server.listen(4281,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
 for(const [label,width,height] of [['desktop',1366,820],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height},isMobile:label==='mobile',hasTouch:label==='mobile'});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(({save})=>{
  localStorage.setItem('sg_handle','v31test');
  localStorage.setItem('sg_tok','abcdefghijklmnopqrstuvwxyz123456789');
  localStorage.setItem('sm_last_seen_release_v29','29.0.0');
  localStorage.setItem('sm_last_seen_v31_preview','31.0.0-preview');
  localStorage.setItem('sam_rpg_hibrido_v12_v31test',JSON.stringify(save));
 },{save:initial});
 await page.goto('http://127.0.0.1:4281/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>!!window.SamHybridRPG?.toggleBroto,{timeout:20000});
 await page.evaluate(()=>window.showPane('rpgDlg'));
 await page.waitForSelector('#v31Card');
 const state=()=>page.evaluate(()=>window.SamHybridRPG.getState());
 const interact=id=>page.evaluate(id=>window.SamHybridRPG.interactById(id),id);
 const close=async()=>{
  const b=page.locator('#r12TalkNext:visible');
  if(await b.count())await b.click();
 };
 await interact('v31Entrance');
 assert.equal((await state()).map,'jardimBruma','new entrance');
 await interact('v31Ema');await close();
 assert.equal((await state()).epic.v31.metEma,true);
 for(const id of ['v31Dew','v31Bark','v31Pollen']){await interact(id);await close()}
 assert.equal((await state()).epic.v31.ingredients.length,3);
 await interact('v31Lens');await close();
 assert.equal((await state()).epic.v31.lens,true,'lens crafted');
 await interact('v31Heavy');await close();
 assert.equal((await state()).epic.v31.heavy,true,'normal weight plate');
 await page.locator('#v31SizeButton').click();
 assert.equal((await state()).epic.v31.small,true,'size change from HUD');
 await interact('v31TinyGate');
 assert.equal((await state()).map,'galeriasInsetos','tiny gate');
 // The barrier consists of two solid blocks with a 0.6-tile gap.
 // A normal-radius player cannot pass; mini radius must fit.
 await page.evaluate(()=>window.SamHybridRPG.gotoRoom('galeriasInsetos'));
 await page.evaluate(()=>window.SamHybridRPG.toggleBroto());
 await page.keyboard.down('ArrowRight');await page.waitForTimeout(290);await page.keyboard.up('ArrowRight');
 await page.keyboard.down('ArrowUp');await page.waitForTimeout(850);await page.keyboard.up('ArrowUp');
 await page.waitForTimeout(950);
 const normal=(await state());
 assert.ok(normal.y>7.6,'normal size cannot cross wall, y='+normal.y);
 await page.evaluate(()=>window.SamHybridRPG.toggleBroto());
 await page.keyboard.down('ArrowUp');await page.waitForTimeout(1450);await page.keyboard.up('ArrowUp');
 await page.waitForTimeout(950);
 const tiny=(await state());
 assert.ok(tiny.y<6.3,'tiny size crosses gap, y='+tiny.y+', x='+tiny.x);
 await interact('v31Sap');await close();
 assert.equal((await state()).epic.v31.sap,true);
 await interact('v31GalleryGate');
 assert.equal((await state()).map,'relicarioMusgo');
 await interact('v31Chronicle');await close();
 await interact('v31RuneRoot');await close();
 assert.equal((await state()).epic.v31.runes,0,'normal size required for Root');
 await page.locator('#v31SizeButton').click();
 await interact('v31RuneRoot');await close();
 assert.equal((await state()).epic.v31.runes,1);
 await page.locator('#v31SizeButton').click();
 await interact('v31RuneDew');await close();
 assert.equal((await state()).epic.v31.runes,2);
 await page.locator('#v31SizeButton').click();
 await interact('v31RuneMoon');await close();
 assert.equal((await state()).epic.v31.runes,3);
 await interact('v31Warden');
 await page.waitForSelector('#r13Combat:not([hidden])',{timeout:10000});
 for(let i=0;i<26;i++){
  if(await page.locator('#r13Combat').isHidden())break;
  await page.waitForFunction(()=>[...document.querySelectorAll('[data-r13action]')].some(b=>!b.disabled),{timeout:10000});
  const skill=page.locator('#r13Combat [data-r13action="skill"]:not([disabled])');
  if(await skill.count())await skill.click();
  else await page.locator('#r13Combat [data-r13action="attack"]:not([disabled])').click();
  await page.waitForTimeout(950);
 }
 assert.equal((await state()).epic.v31.bossWon,true,'phased boss actually defeated');
 await interact('v31Heart');await close();
 let s=await state();
 assert.equal(s.epic.v31.finished,true);
 assert.ok(s.epic.items.includes('broche_entrelinhas_v31'),'unique collectible');
 const gold=s.epic.gold;
 await interact('v31Heart');await close();
 assert.equal((await state()).epic.gold,gold,'no duplicate reward');
 await page.evaluate(()=>window.SamHybridRPG.gotoRoom('jardimBruma'));
 await interact('v31Beetle');await close();
 await interact('v31Ema');await close();
 assert.equal((await state()).epic.v31.bugReturned,true,'optional side quest');
 s=await state();
 const pots=s.epic.potions;
 await interact('v31Ema');await close();
 assert.equal((await state()).epic.potions,pots,'no farming repeated side-quest');
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>!!window.SamHybridRPG?.getState);
 const persisted=await state();
 assert.equal(persisted.epic.v31.finished,true,'chapter persists');
 assert.equal(persisted.epic.v31.bugReturned,true,'side quest persists');
 assert.deepEqual(errors,[],'no browser page errors: '+label);
 assert.ok(await page.locator('#sm30NewsHeading').count(),'news still visible');
 console.log(label+' V31 PASS: three maps, collision, changing size, puzzles, phased boss, unique rewards, reload');
 await page.close();
 }
 }finally{await browser.close();server.close()}
}
run().catch(e=>{console.error(e.stack||e);server.close();process.exitCode=1});
