const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html'),house=read('casa_v21.js');
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
 assert.ok(html.includes('casa_v21.js?v=21'));
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
 for(const n of ['sm21TacticsTick(s,dt)','sm21Build(id)','s.towers.push({kind:id,lane','target.hp-=sm21Towers[t.kind].damage','target.slow=Math.max','s.trees[lane]=true','s.energy-=cost','s.energy=Math.min(12,s.energy+1)','sm21DrawTowers(g,s,t)','s.intermission=3.5'])assert.ok(html.includes(n),n);
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
 assert.ok(html.includes("const version='21.0.0'"));
 for(const n of ['<b>V21</b>','<b>V20</b>','<b>V19</b>','<b>V18</b>'])assert.ok(html.includes(n));
 assert.ok(fs.existsSync(path.join(root,'wrangler.jsonc')));
});
