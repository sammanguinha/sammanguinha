const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const html=read('index.html'),world=read('mundo_pomar.js');
function defenseTick(){
 const start=html.indexOf('function sm21TacticsTick(s,dt){');
 const end=html.indexOf('function sm21DrawTowers(g,s,t)',start);
 assert.ok(start>0&&end>start,'tactical motor exists');
 return vm.runInNewContext(html.slice(start,end)+'\nsm21TacticsTick;',{
  GW:360,GH:480,orchardBurst:()=>{},
  sm21Towers:{arrow:{cost:3,cooldown:1.3,damage:1},frost:{cost:4,cooldown:2.4,damage:1},root:{cost:5,cooldown:3,damage:0},solar:{cost:6,cooldown:3.1,damage:1}}
 });
}
function enemy(x,y,hp=2){return{x,y,hp,dead:false,slow:0,rooted:0,hit:0,vy:70}}
function state(kind,enemies){return{job:'guardian',energy:2,kills:0,combo:0,comboTimer:0,trees:[true,true,true],towers:[{kind,lane:1,cooldown:0,shots:0,level:1,priority:'danger'}],pe:enemies}}
test('Solar deals real area damage and earns only energy for kills',()=>{
 const fire=defenseTick(),a=enemy(180,250,2),b=enemy(230,255,1),far=enemy(60,250,3),s=state('solar',[a,b,far]);
 fire(s,.016);assert.equal(a.hp,1);assert.equal(b.dead,1);assert.equal(far.hp,3);assert.equal(s.kills,1);assert.equal(s.energy,3);assert.equal(s.towers[0].shots,1);
 fire(s,.016);assert.equal(s.towers[0].shots,1,'cooldown enforced');
});
test('Root stops enemy movement without granting unearned kills',()=>{
 const fire=defenseTick(),a=enemy(180,245,2),s=state('root',[a]);fire(s,.016);
 assert.ok(a.rooted>=1.4);assert.equal(a.hp,2);assert.equal(s.kills,0);assert.equal(s.energy,2);
 assert.match(html,/p\.rooted>0\?0:p\.slow>0\?\.38:1/,'movement stops while rooted');
});
test('Tower level three upgrades root duration and solar damage/radius',()=>{
 const fire=defenseTick();const root=state('root',[enemy(180,245,3)]);root.towers[0].level=3;fire(root,.016);assert.ok(root.pe[0].rooted>=2.4);
 const sol=state('solar',[enemy(180,250,2),enemy(276,260,2)]);sol.towers[0].level=3;fire(sol,.016);
 assert.equal(sol.pe[1].hp,0);assert.equal(sol.pe[1].dead,1);
});
test('Original NPC and tower sprite sheets have real animation frames',()=>{
 for(const id of ['solar','raiz']){const art=read('sprites/torre_'+id+'_v23.svg');assert.match(art,/width="192" height="48"/);for(const n of [0,48,96,144])assert.ok(art.includes('translate('+n+','),id+' frame '+n)}
 for(const id of ['amalia','tito'])assert.match(read('sprites/npc_'+id+'_v23.svg'),/viewBox="0 0 192 48"/);
 for(const id of ['root','solar'])assert.ok(html.includes('data-sm21-build="'+id+'"'));
 assert.ok(world.includes("oldAmalia:'amalia'"));assert.ok(world.includes("alchemist:'tito'"));
});
test('Daily village contracts persist per player and pay local rewards only once',()=>{
 const start=world.indexOf('const v23DailyDefs=['),end=world.indexOf('const v23MoodOptions=',start);assert.ok(start>0&&end>start);
 const storage=new Map();let awarded=0;
 const ctx={Intl,Date,JSON,Map,storageKey:()=> 'sam_rpg_hibrido_v12_hero',
  localStorage:{getItem:k=>storage.has(k)?storage.get(k):null,setItem:(k,v)=>storage.set(k,v)},
  $:()=>null,document:{createElement:()=>({})},notify:()=>{},gainLocalSeeds:n=>(awarded+=n,true)};
 const api=vm.runInNewContext(world.slice(start,end)+'\n({mark:v23DailyMark,claim:v23DailyClaim,read:()=>JSON.parse(JSON.stringify(v23Daily))});',ctx);
 assert.equal(api.read().marks.length,0);api.claim('bento');assert.equal(awarded,0);
 api.mark('bento');api.claim('bento');api.claim('bento');assert.equal(awarded,25);
 api.mark('forest');api.claim('forest');assert.equal(awarded,60);
 api.mark('victory');api.claim('victory');assert.equal(awarded,125);assert.equal(api.read().claimed.length,3);
 assert.ok(storage.has('sam23_vila_contratos_sam_rpg_hibrido_v12_hero'));
});
test('Live village actions connect quests, atmosphere and board to world engine',()=>{
 for(const m of ['clear','mist','stars'])assert.ok(world.includes("'"+m+"'"));
 for(const id of ['r23MoodChoices','r23Contracts','r23GuideList'])assert.ok(html.includes('id="'+id+'"'));
 for(const mark of ['bento','forest','victory'])assert.ok(world.includes("v23DailyMark('"+mark+"')"));
 assert.ok(world.includes("if(a.id==='guildBoard')"));
 assert.ok(world.includes('window.Sam23World=Object.freeze('));
 assert.ok(world.includes('gainLocalSeeds(item.reward)'));
});
test('World-first navigation preserves house sync, chat and combat',()=>{
 for(const filename of ['casa_sync_v22.js','pomar_ao_vivo_v20.js','mundo_pomar.js'])assert.ok(fs.existsSync(path.join(root,filename)));
 for(const id of ['sm22HomeSync','sm20Live'])assert.ok(html.includes('id="'+id+'"'));
 assert.ok(html.includes("const version='24.0.0'"));
 for(const room of ['rpgDlg','houseDlg','gameDlg'])assert.ok(html.includes('data-go="'+room+'"'));
});
