'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bridge=read('js/core/runtime-bridge-v27.js');
const shell=read('js/ui/game-shell-v27.js');
const css=read('visual_v27.css');
const html=read('index.html');
test('V27 bridge and app shell are valid and linked after their dependencies',()=>{
 assert.doesNotThrow(()=>new vm.Script(bridge));
 assert.doesNotThrow(()=>new vm.Script(shell));
 for(const file of ['js/core/runtime-bridge-v27.js?v=27','js/ui/game-shell-v27.js?v=27','visual_v27.css?v=27'])assert.ok(html.includes(file));
 assert.ok(html.indexOf('js/core/progression.js?v=26')<html.indexOf('js/core/runtime-bridge-v27.js?v=27'));
 assert.ok(html.indexOf('tela_cheia_v24.js?v=24.2')<html.indexOf('js/ui/game-shell-v27.js?v=27'));
});
function boot(){
 let active='rpgDlg',shop=0,pulse=0,pauses=0,modeMenu=0,interval=null;
 const panes={};
 for(const id of ['rpgDlg','gameDlg','eventDlg','houseDlg','profDlg']){
  panes[id]={get hidden(){return active!==id},classList:{contains:c=>c==='sm-immersive'},querySelector:()=>({click:()=>modeMenu++})};
 }
 const pulseBtn={disabled:false,click:()=>pulse++};
 const pauseBtn={disabled:false,click:()=>pauses++};
 const doc={
  hidden:false,addEventListener:()=>{},dispatchEvent:()=>{},
  getElementById:id=>panes[id]||(id==='sm24GrovePulse'?pulseBtn:id==='sm17PauseBtn'?pauseBtn:null)
 };
 const ctx={window:{SamHybridRPG:{
  getState:()=>({map:'floresta',found:['sol'],epic:{gold:125,level:7,hp:30,mp:5,potions:2,v24:{stamina:57}}}),
  getVitals:()=>({hp:30,maxHp:80,mp:5,maxMp:25,stamina:57,maxStamina:100}),
  openShop:()=>{shop++}
 }},document:doc,CustomEvent:class{constructor(n,o){this.type=n;this.detail=o.detail}},
 gs:{mode:'hard',energy:8,playerHp:4,playerMaxHp:6,trees:[true,false,true],score:240,wave:3,kills:8,combo:2,groveCd:0},
 gDifficulty:'hard',sm17GamePaused:false,setInterval:cb=>{interval=cb;return 1},clearInterval:()=>{interval=null},console};
 vm.runInNewContext(bridge,ctx);
 return {api:ctx.window.SamGameV27,ctx,setMode:v=>active=v,stats:()=>({shop,pulse,pauses,modeMenu,interval}),tick:()=>interval?.()};
}
test('bridge publishes sanitized immutable RPG vitals from authoritative formulas',()=>{
 const x=boot().api.getSnapshot();
 assert.equal(x.mode,'rpgDlg');
 assert.equal(x.rpg.maxHp,80);assert.equal(x.rpg.maxMp,25);
 assert.equal(x.rpg.stamina,57);assert.equal(x.rpg.gold,125);
 assert.ok(Object.isFrozen(x));assert.ok(Object.isFrozen(x.rpg));
 assert.ok(!JSON.stringify(x).includes('abcdefghijkl'));
 assert.equal(typeof x.rpg.token,'undefined');
});
test('bridge actions delegate safely without altering ranked score, health or energy',()=>{
 const x=boot();assert.equal(x.api.action('rpg:shop'),true);assert.equal(x.stats().shop,1);
 assert.equal(x.api.action('defense:pulse'),false);
 x.setMode('gameDlg');const before=JSON.stringify(x.ctx.gs);
 assert.equal(x.api.action('defense:pulse'),true);assert.equal(x.stats().pulse,1);
 assert.equal(x.api.action('defense:pause'),true);assert.equal(x.stats().pauses,1);
 assert.equal(JSON.stringify(x.ctx.gs),before,'read-only bridge must never mutate authoritative gameplay');
 assert.equal(x.api.action('gain:gold'),false);
});
test('subscriptions are cancellable and update only on state changes',()=>{
 const x=boot();let count=0;
 const off=x.api.subscribe(()=>count++);
 assert.equal(count,1);
 assert.equal(typeof x.stats().interval,'function');
 x.tick();assert.equal(count,2,'first interval always publishes a snapshot');
 x.tick();assert.equal(count,2,'unchanged state does not republish');
 x.setMode('gameDlg');x.tick();assert.equal(count,3);
 off();assert.equal(x.stats().interval,null);
});
test('visual layer covers mobile, reduced motion, RPG, Defense, Halloween, house, inventory and accessible theme',()=>{
 for(const selector of ['#rpgDlg .r12-frame','#gameDlg .sm21-tactics','#eventDlg .h8-shell','#houseDlg .sm21-house-top','#r13Combat','.v27-live-hud','.v27-actionbar','.v27-theme-button'])assert.ok(css.includes(selector),selector);
 assert.ok(css.includes('prefers-reduced-motion'));
 assert.ok(css.includes('max-width:430px'));
 assert.ok(css.includes('data-v27-theme=eclipse'));
 assert.ok(shell.includes('sam_v27_visual_theme'));
 assert.ok(shell.includes("setTheme(theme);"));
 assert.ok(shell.includes("actionButton('🎒 Mochila'"));
 assert.ok(shell.includes("actionButton('🏰 Torres'"));
});
test('real RPG API gives resource caps while preserving original persistence and movement',()=>{
 const src=read('mundo_pomar.js');
 assert.ok(src.includes('getVitals:()=>({hp:epic().hp,maxHp:maxHealth()'));
 assert.ok(src.includes('maxStamina:hasEffect(\'swift\')?140:100'));
 assert.ok(src.includes('getState:()=>JSON.parse(JSON.stringify(st))'));
});
