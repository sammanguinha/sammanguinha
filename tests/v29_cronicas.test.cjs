'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data=read('rpg_cronicas_v29.js'),world=read('mundo_pomar.js'),html=read('index.html'),css=read('css/v29-quest.css');
const context={window:{}};
vm.runInNewContext(data,context);
const book=context.window.SamV29Data;
test('Both V29 scripts parse and are loaded in the only valid dependency order',()=>{
 assert.doesNotThrow(()=>new vm.Script(world));
 assert.doesNotThrow(()=>new vm.Script(data));
 assert.ok(html.indexOf('rpg_cronicas_v29.js?v=29')<html.indexOf('mundo_pomar.js?v=33.3'));
 assert.ok(html.includes('css/v29-quest.css?v=29'));
});
test('Campaign connects 3 accessible regions, 3 NPCs and 3 environmental clues',()=>{
 assert.deepEqual(Array.from(book.chime.symbols),['SOPRO','RAIZ','LUZ']);
 assert.deepEqual(Object.keys(book.clues).sort(),['v29Biruta','v29Casca','v29Relogio']);
 assert.ok(['vila','floresta','planicie'].every(room=>book.actors[room]?.length>=4));
 assert.equal(['v29Iris','v29Mara','v29Caio'].filter(id=>Object.values(book.actors).flat().some(a=>a.id===id)).length,3);
 for(const name of ['intro','mara','caio','final','share','shelter'])assert.ok(book.story[name]?.length>=2,name);
});
test('Nine discoverable artifacts across maps, with one-time journal rewards',()=>{
 assert.equal(Object.keys(book.discoveries).length,9);
 assert.equal(new Set(Object.keys(book.discoveries)).size,9);
 for(const id of Object.keys(book.discoveries)){
  const actor=Object.values(book.actors).flat().find(a=>a.id===id);
  assert.ok(actor&&actor.v29==='find',id+' must be a real map object');
 }
 for(const token of ['q.finds.includes(id)','q.collectionReward','q.clues.includes(id)',
  'if(q.ending)return','d.claimed=true','d.observed=true'])assert.ok(world.includes(token),token);
});
test('Two unlockable encounters use real existing sprites and meaningful victory gates',()=>{
 assert.deepEqual(Object.keys(book.enemies).sort(),['v29_sentinela','v29_silencio']);
 for(const enemy of Object.values(book.enemies)){
  assert.ok(enemy.hp>=50&&enemy.atk>0&&enemy.xp>0);
  assert.ok(fs.existsSync(path.join(root,'sprites',enemy.sprite+'.svg')));
 }
 assert.ok(world.includes("v29Mariposa:'v29_silencio'"));
 assert.ok(world.includes("v29Sentinela:'v29_sentinela'"));
 assert.ok(world.includes("if(key==='v29_silencio'||key==='v29_sentinela')v29CombatWon(key)"));
});
test('Combat telegraph predicts charged turns and Analyze provides guarded risk/reward',()=>{
 const begin=world.indexOf('function v29CombatTell(c){'),end=world.indexOf('function startCombat(',begin);
 assert.ok(begin>0&&end>begin);
 const tell=vm.runInNewContext(world.slice(begin,end)+'\nv29CombatTell', {});
 assert.match(tell({key:'v29_sentinela',turn:3}),/CARREGADO/);
 assert.doesNotMatch(tell({key:'v29_sentinela',turn:2}),/CARREGADO/);
 assert.match(tell({key:'v29_silencio',turn:4}),/causará mais dano/);
 for(const token of ["type==='study'","c.focus=1;c.playerGuard=true","if(epicCombat.focus)mult*=1.35",
  "['attack','skill','artifact'].includes(type)","v29Charged","data-r13action=\"study\""])
  assert.ok(world.includes(token),token);
});
test('Daily field research rotates 3 targets and grants only local capped rewards',()=>{
 assert.equal(book.fieldTasks.length,3);
 assert.equal(new Set(book.fieldTasks.map(x=>x.id)).size,3);
 for(const task of book.fieldTasks)
  assert.ok(Object.values(book.actors).flat().some(a=>a.id===task.id&&a.v29==='dailySpot'));
 assert.ok(Object.values(book.actors).flat().some(a=>a.id==='v29FieldBoard'));
 assert.ok(world.includes("d.claimed=true;epic().gold+=18;giveXP(30)"));
 assert.ok(world.includes("q.daily.day!==today"));
});
test('Visual journal and action prompts are responsive and keyboard discoverable',()=>{
 for(const name of ['#v29Chronicle','#v29QuestObjective','#v29WorldQuest',
  '#v29ReadClues','#v29DailyStatus','#v29QuestSteps','.r13-combat-controls'])
  assert.ok(css.includes(name)||world.includes(name.replace(/^#/,'')),name);
 assert.ok(css.includes('prefers-reduced-motion'));
 assert.ok(css.includes('max-width:620px'));
 assert.ok(world.includes("main.append(badge)"));
 assert.ok(world.includes("card.scrollIntoView"));
});
