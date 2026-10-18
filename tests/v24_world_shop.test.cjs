const {sourceView}=require('./v25_source_view.cjs');
const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const world=read('mundo_pomar.js'),html=sourceView(read('index.html'),read);
test('new RPG/Defense scripts parse and merchant stylesheet is referenced',()=>{
 assert.doesNotThrow(()=>new vm.Script(world));
 for(const [i,part] of [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].entries()){
  if(part[1].trim())assert.doesNotThrow(()=>new vm.Script(part[1]),'inline script '+i);
 }
 assert.ok(html.includes('mundo_v24.css?v=24'));
 assert.ok(html.includes("const version='24.0.0'"));
});
function merchant(overrides={}){
 const a=world.indexOf('Object.assign(EPIC_ARTIFACTS,{');
 const b=world.indexOf('const V24_BIOMES=',a);
 assert.ok(a>0&&b>a,'merchant block found');
 const storage=new Map(),messages=[];
 const ctx={
  EPIC_ARTIFACTS:{},
  st:{x:11,y:7,epic:{gold:300,items:[],potions:3,equipped:[]}},
  player:{x:11,y:7},
  localStorage:{setItem:(key,value)=>{if(overrides.noStorage)throw Error('disabled');storage.set(key,value)},getItem:key=>storage.get(key)||null},
  storageKey:()=>'rpg_test_hero',document:{getElementById:()=>null},
  notify:m=>messages.push(m),save:()=>{},update:()=>{},recomputeHealth:()=>{},
  maxMana:()=>20,epic:()=>ctx.st.epic
 };
 const api=vm.runInNewContext(world.slice(a,b)+'\n({buy:v24Buy,count:v24Count,take:v24Take,bag:v24Bag,use:v24UseOutside,catalog:V24_SHOP});',ctx);
 return{api,ctx,storage,messages};
}
test('merchant debits gold, grants potion and persists player RPG save',()=>{
 const {api,ctx,storage}=merchant();
 assert.equal(api.catalog.length,11);
 api.buy('pocao');assert.equal(ctx.st.epic.gold,282);assert.equal(ctx.st.epic.potions,4);
 api.buy('tonico_mana');assert.equal(ctx.st.epic.gold,260);assert.equal(api.count('tonico_mana'),1);
 assert.equal(JSON.parse(storage.get('rpg_test_hero')).epic.v24.bag.tonico_mana,1);
});
test('purchased accessories are permanent, unique, and paid in RPG coins only',()=>{
 const {api,ctx}=merchant();
 api.buy('anel_orvalho');
 assert.equal(ctx.st.epic.gold,215);
 assert.deepEqual(Array.from(ctx.st.epic.items),['anel_orvalho']);
 api.buy('anel_orvalho');assert.equal(ctx.st.epic.gold,215);
 api.buy('bracelete_casca');assert.equal(ctx.st.epic.gold,95);
 api.buy('amuleto_luar');assert.equal(ctx.st.epic.gold,95,'no funds: no transaction');
 assert.equal(api.count('anel_orvalho'),0,'accessories use relic inventory');
});
test('failed local save rolls back purchase, keeps currency and possessions',()=>{
 const {api,ctx}=merchant({noStorage:true});
 api.buy('capa_brisa');
 assert.equal(ctx.st.epic.gold,300);
 assert.equal(ctx.st.epic.items.length,0);
});
test('consumable removal cannot go negative or be duplicated',()=>{
 const {api}=merchant();
 assert.equal(api.take('bomba_esporos'),false);
 api.buy('bomba_esporos');assert.equal(api.count('bomba_esporos'),1);
 assert.equal(api.take('bomba_esporos'),true);
 assert.equal(api.take('bomba_esporos'),false);
 assert.equal(api.count('bomba_esporos'),0);
});
test('biomes use distinct terrain palettes and original regions remain',()=>{
 for(const name of ['vila','floresta','ruinas','estufa','bosque','mina','pantano','observatorio','coracao','planicie','gruta'])
 assert.ok(world.includes(name+':[')||world.includes(name+':{name:'),name);
 assert.ok(world.includes('v24Tile(px,py,x,y,h);'));
 assert.ok(world.includes('baseMap();v24Decor();'));
 assert.ok(world.includes("id:'toMeadow'"));
 assert.ok(world.includes("id:'toGrotto'"));
});
test('sprint drains and regenerates stamina, is keyboard and touch accessible',()=>{
 for(const name of ['v24RunTouch','v24SprintMeter','v24SprintText'])
 assert.ok(world.includes(name));
 assert.ok(world.includes("if(e.key==='Shift'){keys.run=true"));
 assert.ok(world.includes("if(e.key==='Shift')keys.run=false"));
 assert.ok(world.includes('bag.stamina=Math.max(0,bag.stamina-'));
});
test('four-frame animated original sprites exist and are used by engines',()=>{
 for(const kind of ['arvore_saudavel','arvore_danificada','arvore_destruida','torre_arco','torre_gelo','torre_raiz','torre_solar','praga_larva','praga_besouro','praga_esporo','praga_corredor','praga_curandeira','rei_pragas']){
  const svg=read('sprites/'+kind+'_v24.svg');
  assert.match(svg,/width="192" height="48"/);
  for(const offset of [0,48,96,144])assert.ok(svg.includes('translate('+offset+',0)'),kind+' frame '+offset);
 }
 for(const kind of ['lobo_vento','vulto_eco'])assert.match(read('sprites/'+kind+'_v24.svg'),/width="48" height="48"/);
 assert.ok(html.includes('sm24DrawSprite(g,variant'));
 assert.ok(world.includes("const v24Trees=Object.fromEntries"));
});
test('grove pulse really roots enemies, spends energy, and cannot affect ranked play',()=>{
 const start=html.indexOf('const sm24PulseButton=document.createElement');
 const end=html.indexOf('// V22: investimento em torres',start);
 assert.ok(start>0&&end>start);
 let button=null,bursts=0;const enemy={rooted:0,dead:false};
 const state={mode:'hard',energy:10,groveCd:0,pe:[enemy],x:180};
 const ctx={
  document:{createElement:()=>({setAttribute:()=>{},addEventListener(type,fn){if(type==='click')this.press=fn}}),hidden:false},
  $:()=>({parentElement:{append(x){button=x}}}),gs:state,sm17GamePaused:false,GH:480,
  orchardBurst:()=>bursts++,toast:()=>{},sm21StrategyUi:()=>{}
 };
 vm.runInNewContext(html.slice(start,end),ctx);
 assert.ok(button?.press,'button has functional handler');
 button.press();assert.equal(state.energy,4);assert.equal(enemy.rooted,2.2);assert.equal(bursts,1);
 button.press();assert.equal(state.energy,4,'cooldown prevents repeated purchase');
 state.mode='normal';state.groveCd=0;state.energy=10;button.press();assert.equal(state.energy,10,'ranked untouched');
});


test('spore healer restores injured enemies but obeys cooldown and health cap',()=>{
 const start=html.indexOf('function sm24HealTick(s,dt){');
 const end=html.indexOf('function sm21TacticsTick(s,dt){',start);
 assert.ok(start>0&&end>start);
 let visual=0;
 const heal=vm.runInNewContext(html.slice(start,end)+'\nsm24HealTick;',{
  orchardBurst:()=>visual++
 });
 const ally={x:125,y:200,hp:1,maxHp:3,dead:false,kind:'beetle'};
 const priest={x:160,y:170,hp:3,maxHp:3,dead:false,kind:'healer',healCd:.1};
 const state={pe:[ally,priest]};
 heal(state,.2);assert.equal(ally.hp,2);
 assert.equal(visual,1);
 heal(state,.2);assert.equal(ally.hp,2,'cooldown respected');
 priest.healCd=.1;heal(state,.2);assert.equal(ally.hp,3);
 priest.healCd=.1;heal(state,.2);assert.equal(ally.hp,3,'never over-heals');
});
test('healers only spawn on hard/infinite, and towers can prioritize them',()=>{
 assert.ok(html.includes("const healer=s.hard&&s.wave>=4"));
 assert.ok(html.includes("t.priority==='healer'"));
 assert.ok(html.includes("t.priority=t.priority==='strongest'?'healer'"));
 assert.ok(html.includes("'praga_curandeira'"));
});
