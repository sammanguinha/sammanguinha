const {sourceView}=require('./v25_source_view.cjs');
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=sourceView(read('index.html'),read),house=read('casa_v21.js');
test('JavaScript inline and game scripts compile',()=>{
 const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean);
 assert.ok(scripts.length>=6);
 scripts.forEach((s,i)=>assert.doesNotThrow(()=>new vm.Script(s,{filename:'inline-'+i})));
 for(const file of ['casa_v21.js','expedicao_v18.js','pomar_ao_vivo_v20.js'])assert.doesNotThrow(()=>new vm.Script(read(file),{filename:file}));
});
test('house navigation and editor are reachable',()=>{
 for(const id of ['houseDlg','houseBtn','sm21House','sm21HouseCanvas','sm21HouseFurniture','sm21HouseBuy','sm21HouseRest','sm21HouseNotice','sm21HouseExport','sm21HouseReset'])assert.ok(html.includes('id="'+id+'"'),id);
 for(const id of ['twilight','spring','midnight'])assert.ok(html.includes('data-house-theme="'+id+'"'));
 for(const id of ['planks','stone','garden'])assert.ok(html.includes('data-house-floor="'+id+'"'));
 for(const id of ['place','move','erase'])assert.ok(html.includes('data-house-mode="'+id+'"'));
 assert.match(html,/casa_v21\.js\?v=(?:21|22)/);
});
test('ten furniture sprites have 4 real, distinct animation frames',()=>{
 const ids=['bed','table','fern','fireplace','library','crystal','banner','lantern','rug','throne'];
 for(const id of ids){
  const p='sprites/casa_'+id+'_v21.svg',src=read(p);
  assert.ok(src.includes('width="192" height="48"'));
  for(const x of [0,48,96,144])assert.ok(src.includes('translate('+x+' '),p+': frame '+x);
  assert.ok(house.includes("id:'"+id+"'"),id);
 }
});
test('house has per-account persistence, no arbitrary item insertion and daily limits',()=>{
 for(const n of ['sam21_casa_','sg_extras_v1_','new Set()','allowed.has(p.id)','seen.has(x+',"restDay","state.restDay===today()",'localStorage.setItem(key()','getTrainingBonus'])assert.ok(house.includes(n),n);
 assert.ok(house.includes("if(!putWallet(w))return"));
});
test('defense includes actual towers, energy, damage, slow and revival logic',()=>{
 for(const n of ['sm21TacticsTick(s,dt)','sm21Build(id)','s.towers.push({kind:id,lane','target.hp-=damage','enemy.slow=Math.max','s.trees[lane]=true','s.energy-=cost','s.energy=Math.min(12,s.energy+1)','sm21DrawTowers(g,s,t)','s.intermission=3.5'])assert.ok(html.includes(n),n);
 for(const n of ['sm21TacticalStatus','sm21Energy','sm21Lanes'])assert.ok(html.includes('id="'+n+'"'));
 for(const n of ['arrow','frost','heal'])assert.ok(html.includes('data-sm21-build="'+n+'"'));
 for(const n of ['arco','gelo'])assert.ok(read('sprites/torre_'+n+'_v21.svg').includes('width="192"'));
});
test('boss on normal wave five, normal ranking remains validated',()=>{
 assert.ok(html.includes('s.mode==="normal"&&s.wave===5'));
 assert.ok(html.includes('s.bossDefeated=true'));
 assert.ok(html.includes('if(gDifficulty==="normal")gRun=await rpc("game_start"'));
 assert.ok(html.includes('s.score+=s.hard?1500:180'));
 assert.ok(html.includes('if(gDifficulty!==\'normal\')'));
 assert.ok(html.includes('window.Sam21House?.getTrainingBonus?.()'));
 assert.ok(html.includes('s.score+=10'), 'removed combat multiplier that could violate anti-cheat');
});
test('version menu retained and Cloudflare config only remains in source',()=>{
 assert.match(html,/const version='(?:21|22)\.0\.0'/);
 for(const n of ['<b>V21</b>','<b>V20</b>','<b>V19</b>','<b>V18</b>'])assert.ok(html.includes(n));
 assert.ok(!fs.existsSync(path.join(root,'wrangler.jsonc')),'Cloudflare Pages package must not depend on Worker configuration');
});

test('TACTICAL COMBAT: arrow tower actually kills enemy, consumes cooldown and earns battle energy',()=>{
 const start=html.indexOf('function sm21TacticsTick(s,dt){'),end=html.indexOf('function sm21DrawTowers(g,s,t)',start);
 assert.ok(start>0&&end>start);
 const ctx={GW:360,GH:480,orchardBurst:()=>{},sm21Towers:{arrow:{cooldown:1.3,damage:1},frost:{cooldown:2.4,damage:1}}};
 const act=vm.runInNewContext(html.slice(start,end)+'\nsm21TacticsTick;',ctx);
 const game={job:'ranger',energy:1,kills:0,combo:0,comboTimer:0,trees:[true,true,true],towers:[{kind:'arrow',lane:0,cooldown:0,shots:0}],pe:[{x:60,y:230,hp:1,dead:false}]};
 act(game,.016);
 assert.equal(Boolean(game.pe[0].dead),true,'enemy was killed by real tower damage');
 assert.equal(game.kills,1,'kill registered');
 assert.equal(game.energy,2,'energy earned');
 assert.equal(game.towers[0].shots,1);
 assert.ok(game.towers[0].cooldown>0,'cooldown prevents per-frame attacks');
 act(game,.016);assert.equal(game.towers[0].shots,1,'no extra shot while cooling down');
});
test('TACTICAL COMBAT: frost turret damages and slows targets; mage job speeds cooldown',()=>{
 const start=html.indexOf('function sm21TacticsTick(s,dt){'),end=html.indexOf('function sm21DrawTowers(g,s,t)',start);
 const ctx={GW:360,GH:480,orchardBurst:()=>{},sm21Towers:{arrow:{cooldown:1.3,damage:1},frost:{cooldown:2.4,damage:1}}};
 const act=vm.runInNewContext(html.slice(start,end)+'\nsm21TacticsTick;',ctx);
 const game={job:'mage',energy:0,kills:0,combo:0,trees:[true,true,true],towers:[{kind:'frost',lane:1,cooldown:0,shots:0}],pe:[{x:180,y:220,hp:3,dead:false}]};
 act(game,.016);assert.equal(game.pe[0].hp,2);assert.ok(game.pe[0].slow>=2.3);assert.ok(game.towers[0].cooldown<2.4,'mage improves frost reload');
});
test('TACTICAL COMBAT: revive tree restores survival but spends earned energy',()=>{
 const start=html.indexOf('function sm21Build(id){'),end=html.indexOf('$("sm21Lanes")?.addEventListener',start);
 assert.ok(start>0&&end>start);
 const sim=vm.runInNewContext('let gs={job:"guardian",energy:6,trees:[false,true,true],treeHits:[2,0,0],hp:2,towers:[]};let sm17GamePaused=false,sm21SelectedLane=0;'+html.slice(start,end)+'\nsm21Build("heal");gs;',{
 document:{hidden:false},GW:360,GH:480,sm21Towers:{arrow:{cost:3},frost:{cost:4}},orchardBurst:()=>{},toast:()=>{},sm21StrategyUi:()=>{}
 });
 assert.equal(sim.trees[0],true);assert.equal(sim.hp,3);assert.equal(sim.energy,2,'guardian revival 4-energy discount');assert.equal(sim.treeHits[0],0);
});
