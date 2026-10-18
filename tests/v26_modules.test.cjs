'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html'),config=JSON.parse(read('architecture-v25.json'));
const core=config.scripts.filter(x=>x.file.startsWith('js/')&&x.file!=='js/games/halloween-wardrobe.js'&&x.file!=='js/ui/home-logo.js'&&x.file!=='js/games/halloween-campaign.js'&&x.file!=='js/games/defense-mobile.js'&&x.file!=='js/ui/update-notice.js');
test('V26 separated controller into nine synchronous scripts',()=>{
 assert.equal(core.length,9);
 assert.ok(read('js/core/app.js').length<20000);
 assert.ok(read('js/games/defense-engine.js').length>25000);
 assert.ok(read('js/core/progression.js').includes('function renderQuests()'));
 for(const x of core)assert.ok(html.includes('src="'+x.file+'?v=26"'),x.file);
});
test('V26 scripts have unique stable order and compile separately',()=>{
 const starts=['js/core/app.js','js/core/profile-community.js','js/ui/ranking-home.js','js/core/account-secrets.js','js/services/community-data.js','js/services/gallery.js','js/games/defense-engine.js','js/games/defense-animation.js','js/core/progression.js'];
 let prev=-1;
 for(const file of starts){
  const i=html.indexOf('src="'+file+'?v=26"');
  assert.ok(i>prev,'out of order '+file);prev=i;
  assert.doesNotThrow(()=>new vm.Script(read(file),{filename:file}));
 }
 assert.ok(prev<html.indexOf('src="js/games/halloween-wardrobe.js?v=25"'));
});
test('V26 defense and Supabase contracts remain untouched',()=>{
 const defense=read('js/games/defense-engine.js')+read('js/games/defense-animation.js');
 for(const k of ['function sm21TacticsTick(s,dt){','function sm21DrawTowers(g,s,t)','function sm21Build(id)','if(gDifficulty==="normal")gRun=await rpc("game_start"','function stopGame()'])assert.ok(defense.includes(k),k);
 assert.ok(read('js/core/app.js').includes('async function rpc(fn,body)'));
 assert.ok(read('js/services/gallery.js').includes('gallery'));
 assert.ok(read('js/core/account-secrets.js').includes('function showGate()'));
});
