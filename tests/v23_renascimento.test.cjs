const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html'),world=read('mundo_pomar.js'),hub=read('renascimento_v23.js'),css=read('renascimento_v23.css');
const slice=(s,start,end)=>{const i=s.indexOf(start),j=s.indexOf(end,i+start.length);assert.ok(i>=0&&j>i,'missing '+start);return s.slice(i,j)};
function towerTick(){
 const source=slice(html,'const sm21Towers=','const sm22RunnerSprite=')+'\n'+slice(html,'function sm21TacticsTick(s,dt){','function sm21DrawTowers(g,s,t)')+'\nsm21TacticsTick;';
 const context={GW:360,GH:480,orchardBurst:()=>{}};return vm.runInNewContext(source,context);
}
const game=(kind,enemyList,priority='danger',level=1)=>({job:'ranger',energy:2,kills:0,combo:0,comboTimer:0,trees:[true,true,true],towers:[{kind,lane:1,shots:0,cooldown:0,priority,level}],pe:enemyList});
test('full V23 scripts compile and dashboard mounts',()=>{
 const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(x=>x.trim());
 for(const [i,s] of scripts.entries())assert.doesNotThrow(()=>new vm.Script(s,{filename:'inline '+i}));
 for(const file of ['mundo_pomar.js','renascimento_v23.js','casa_v21.js','casa_sync_v22.js','pomar_ao_vivo_v20.js'])assert.doesNotThrow(()=>new vm.Script(read(file),{filename:file}));
 assert.ok(html.includes('renascimento_v23.css?v=23'));
 assert.ok(html.includes('renascimento_v23.js?v=23'));
 assert.ok(html.includes("const version='23.0.0'"));
});
test('solar tower causes actual grouped damage without damaging distant enemies',()=>{
 const s=game('solar',[{x:174,y:245,hp:3,maxHp:3},{x:180,y:220,hp:2,maxHp:2},{x:180,y:110,hp:3,maxHp:3}]);
 towerTick()(s,.016);
 assert.equal(s.towers[0].shots,1);
 assert.equal(s.pe[0].hp,2);
 assert.equal(s.pe[1].hp,1);
 assert.equal(s.pe[2].hp,3);
 assert.equal(s.energy,2);
});
test('root tower immobilizes its target and movement code respects the root status',()=>{
 const target={x:180,y:245,hp:2,maxHp:2,vy:70,hit:0,phase:0};
 const s=game('root',[target]);
 towerTick()(s,.016);
 assert.ok(target.rooted>=1.8);
 const source=slice(html,'s.pe.forEach(p=>{\n   p.slow=Math.max(0,(p.slow||0)-dt);','s.it.forEach(i=>i.y+=i.vy*dt);');
 const move=vm.runInNewContext('(function(s,dt){'+source+'})',{GW:360,GH:480,orchardBurst:()=>{}});
 const previous=target.y;
 move(s,.4);assert.equal(target.y,previous,'root stops actual vertical movement');
 move(s,1.6);assert.ok(target.y>previous,'movement resumes after root expires');
});
test('healer genuinely restores injured ally, but not above its maximum HP',()=>{
 const healer={kind:'healer',x:180,y:145,vy:0,hp:3,maxHp:3,healCd:.01,phase:0};
 const hurt={kind:'beetle',x:174,y:156,vy:0,hp:1,maxHp:2,phase:0};
 const s=game('arrow',[healer,hurt]);s.towers=[];
 const source=slice(html,'s.pe.forEach(p=>{\n   p.slow=Math.max(0,(p.slow||0)-dt);','s.it.forEach(i=>i.y+=i.vy*dt);');
 const move=vm.runInNewContext('(function(s,dt){'+source+'})',{GW:360,GH:480,orchardBurst:()=>{}});
 move(s,.1);assert.equal(hurt.hp,2);
 healer.healCd=.01;move(s,.1);assert.equal(hurt.hp,2,'cannot heal past max HP');
});
test('support targeting prioritizes healer before a nearer regular enemy',()=>{
 const normal={kind:'larva',x:180,y:300,hp:1,maxHp:1};
 const healer={kind:'healer',x:182,y:184,hp:3,maxHp:3};
 const s=game('arrow',[normal,healer],'support');
 towerTick()(s,.016);
 assert.equal(healer.hp,2);assert.equal(normal.hp,1);
});
test('dead-tree collision uses fixed physical lanes, never compresses indices',()=>{
 const source=slice(html,'s.pe=s.pe.filter(p=>{if(p.dead)return false;','const me2={x:s.x,y:GH-90};');
 const process=vm.runInNewContext('(function(s){'+source+'})',{GW:360,GH:480,orchardBurst:()=>{},sfx:()=>{}});
 const s={pe:[{x:310,y:435,dead:false,kind:'beetle'}],trees:[true,false,true],treeHits:[0,0,0],towers:[{lane:2}],shield:0,hard:false,energy:0};
 process(s);assert.equal(s.trees[0],true,'left tree must not be hit by right-lane enemy');
 assert.equal(s.trees[2],false);assert.equal(s.towers.length,0,'lost tree removes its tower');
 assert.equal(s.hp,1);
});
test('world reuses original villa, adds permanent lamp quest and home portal',()=>{
 for(const id of ['mira','v23LampEast','v23LampNorth','v23LampSouth'])assert.ok(world.includes("id:'"+id+"'"));
 assert.ok(world.includes("if(a.id==='profile'){pane('houseDlg');return}"));
 assert.ok(world.includes("if(a.type==='lantern')"));
 assert.ok(world.includes("if(!st.v23.started)"));
 assert.ok(world.includes("if(st.v23.lit.includes(a.id))"));
 assert.ok(world.includes("st.v23.rewarded=true"));
 assert.ok(world.includes("gainLocalSeeds(40)"));
 assert.ok(world.includes("sam_rpg_hibrido_v12_"));
 assert.ok(world.includes("window.Sam23World=Object.freeze"));
 for(const id of ['r12V23Quest','r12V23Minimap','r12V23Return'])assert.ok(html.includes('id="'+id+'"'));
 assert.ok(world.includes('v23MiniMap();'));
});
test('sprite sheets are original, four-frame and referenced by functioning game engines',()=>{
 const files=[
 ['v23_bento.svg',40],['v23_livia.svg',40],['v23_mira.svg',40],['v23_eldra.svg',40],
 ['v23_lanterna.svg',40],['v23_torre_solar.svg',48],['v23_torre_raiz.svg',48],['v23_curandeira.svg',48]
 ];
 for(const [f,w] of files){
  const svg=read('sprites/'+f);
  assert.ok(svg.includes('width="'+(w*4)+'"'),f);
  for(let i=0;i<4;i++)assert.ok(svg.includes('translate('+(i*w)+' '),f+' frame '+i);
 }
 assert.ok(world.includes('v23DrawAnimation'));
 assert.ok(html.includes('sm23HealerSprite'));
 assert.ok(html.includes("['arrow','frost','solar','root']"));
});
test('visual overhaul has functional accessibility toggles, no direct secret keys',()=>{
 for(const k of ['contrast','motion','text'])assert.ok(html.includes('data-v23-setting="'+k+'"'));
 for(const k of ['v23-high-contrast','v23-reduce-motion','v23-large-text'])assert.ok(css.includes(k)&&hub.includes(k));
 for(const id of ['v23Region','v23MissionStatus','v23HomeStatus','v23DefenseStatus'])assert.ok(html.includes('id="'+id+'"'));
 assert.ok(!hub.includes('service_role'));
 assert.ok(!hub.includes('innerHTML'));
 assert.ok(css.includes('@media(max-width:760px)'));
});
test('existing server-ranked flow remains unmodified',()=>{
 assert.ok(html.includes('if(gDifficulty==="normal")gRun=await rpc("game_start"'));
 assert.ok(html.includes('rpc("game_finish",{p_handle:me,p_token:tok,p_run:gRun,p_score:s.score'));
 assert.ok(read('casa_sync_v22.js').includes('sm22_house_save'));
 assert.ok(read('pomar_ao_vivo_v20.js').includes('sm_live_send'));
});
