const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const section=(a,b)=>{const i=html.indexOf(a),j=html.indexOf(b,i);assert.ok(i>0&&j>i,'missing combat section '+a);return html.slice(i,j)};
function getTick(){
 const ctx={GW:360,GH:480,orchardBurst:()=>{},sm21Towers:{arrow:{cost:3,cooldown:1.3,damage:1},frost:{cost:4,cooldown:2.4,damage:1}}};
 return vm.runInNewContext(section('function sm21TacticsTick(s,dt){','function sm21DrawTowers(g,s,t)')+'sm21TacticsTick;',ctx);
}
function game(kind='arrow',priority='danger',level=1){
 return {job:'guardian',energy:0,kills:0,combo:0,comboTimer:0,trees:[true,true,true],towers:[{kind,lane:1,cooldown:0,shots:0,level,priority}],pe:[{x:180,y:180,hp:5,dead:false},{x:180,y:300,hp:1,dead:false}]};
}
test('priority chooses nearest dangerous enemy and awards energy only on kill',()=>{
 const tick=getTick(),s=game();
 tick(s,.016);
 assert.equal(s.pe[1].dead,1,'nearer opponent was killed');
 assert.equal(s.pe[0].hp,5,'tank was not targeted');
 assert.equal(s.energy,1);assert.equal(s.kills,1);
 tick(s,.016);assert.equal(s.towers[0].shots,1,'cooldown enforced');
});
test('strongest priority targets the toughest enemy instead of one nearest to tree',()=>{
 const tick=getTick(),s=game('arrow','strongest',1);
 tick(s,.016);
 assert.equal(s.pe[0].hp,4);assert.equal(s.pe[1].hp,1);
 assert.equal(s.energy,0);
});
test('level 3 has meaningful two-point damage and higher cadence',()=>{
 const tick=getTick(),s=game('arrow','strongest',3);
 tick(s,.016);
 assert.equal(s.pe[0].hp,3);
 assert.ok(s.towers[0].cooldown<1.3);
});
test('frost level 3 applies additional slow and magic specialization',()=>{
 const tick=getTick(),s=game('frost','strongest',3);s.job='mage';
 tick(s,.016);
 assert.equal(s.pe[0].hp,3);
 assert.ok(s.pe[0].slow>3);
 assert.ok(s.towers[0].cooldown<2.4*.76);
});
test('upgrade actually spends 3 then 5 energy and stops at level 3',()=>{
 const ctx={document:{hidden:false},GW:360,GH:480,orchardBurst:()=>{},toast:()=>{},sm21StrategyUi:()=>{}};
 const source='let gs={energy:10,trees:[true,true,true],towers:[{kind:"arrow",lane:0,cooldown:1.5,level:1,priority:"danger"}]};let sm17GamePaused=false,sm21SelectedLane=0;\n'+section('function sm22UpgradeTower(){','function sm22Priority(){')+'\nsm22UpgradeTower();sm22UpgradeTower();sm22UpgradeTower();gs;';
 const state=vm.runInNewContext(source,ctx);
 assert.equal(state.towers[0].level,3);
 assert.equal(state.energy,2);
 assert.ok(state.towers[0].cooldown<=.45);
});
test('animated runner has four distinct sprite-sheet frames and changes wave strategy',()=>{
 const art=fs.readFileSync(path.join(root,'sprites/corredor_ambar_v22.svg'),'utf8');
 for(const x of [0,48,96,144])assert.ok(art.includes('translate('+x+' 0)'),x);
 assert.ok(html.includes("runner?1.65"));
 assert.ok(html.includes("s.wave>=3"));
 assert.ok(html.includes('sm22RunnerSprite'));
 assert.ok(html.includes("p.kind==='runner'&&sm22RunnerSprite.complete"));
});
test('UI offers upgrades and priority and read-only snapshot includes actual level and mode',()=>{
 for(const id of ['sm22Upgrade','sm22Priority','sm22LaneDetail'])assert.ok(html.includes('id="'+id+'"'));
 assert.ok(html.includes('function sm22UpgradeTower()'));
 assert.ok(html.includes('function sm22Priority()'));
 assert.ok(html.includes('level:t.level||1'));
 assert.ok(html.includes('priority:t.priority'));
 assert.ok(html.includes('if(gDifficulty==="normal")gRun=await rpc("game_start"'));
});
