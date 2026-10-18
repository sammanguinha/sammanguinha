const {sourceView}=require('./v25_source_view.cjs');
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');
const html=sourceView(read('index.html'),read),world=read('mundo_pomar.js'),css=read('renascimento_v23.css'),prefs=read('renascimento_v23.js');
test('all inline and V23 scripts parse',()=>{
 const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean);
 assert.ok(scripts.length>4);scripts.forEach((source,i)=>assert.doesNotThrow(()=>new vm.Script(source,{filename:'inline-'+i})));
 for(const file of ['mundo_pomar.js','renascimento_v23.js','casa_v21.js','casa_sync_v22.js','pomar_ao_vivo_v20.js'])
 assert.doesNotThrow(()=>new vm.Script(read(file),{filename:file}));
});
test('first playable hub is integrated with existing RPG, house, defense, social',()=>{
 assert.ok(world.includes("if(a.id==='profile'){pane('houseDlg');return}"),'cabana opens playable house');
 assert.ok(world.includes("if(a.id==='praca'){pane('murDlg');return}"),'community is a world actor');
 assert.ok(world.includes("id:'praca',x:13.7,y:5.6"));
 assert.ok(html.includes('id="r23GuideList"'));
 for(const id of ['guardiao','casa','defesa','praca','floresta'])assert.ok(html.includes('data-r23-guide="'+id+'"'));
 for(const room of ['houseDlg','murDlg','gameDlg'])assert.ok(html.includes('data-r12open="'+room+'"'));
 assert.ok(world.includes('function guideTarget()'));
 assert.ok(world.includes('guideDraw();drawPlayer()'));
});
test('animated NPCs and trees are original 4-frame sprites with working drawImage references',()=>{
 for(const name of ['bento','livia','eldra','maira']){
  const svg=read('sprites/npc_'+name+'_v23.svg');assert.ok(svg.includes('viewBox="0 0 192 48"'));for(const n of [0,48,96,144])assert.ok(svg.includes('translate('+n+','),name+' frame '+n);
 }
 for(const name of ['arvore_lunar','arvore_corrompida']){
  const svg=read('sprites/'+name+'_v23.svg');assert.ok(svg.includes('viewBox="0 0 256 64"'));
  for(const n of [0,64,128,192])assert.ok(svg.includes('translate('+n+','),name+' frame '+n);
 }
 assert.ok(world.includes('ctx.drawImage(im,frame*48,0,48,48'));
 assert.ok(world.includes("const v24Trees=Object.fromEntries"));
});
test('V23 supports accessibility and preserved V22 cloud saving',()=>{
 for(const id of ['r23SettingsToggle','r23SettingsPanel','r23EffectPref','r23ContrastPref'])assert.ok(prefs.includes(id));
 assert.ok(prefs.includes("document.documentElement.classList.toggle('sm165-lowfx'"));
 assert.ok(html.includes('renascimento_v23.css?v=23'));
 assert.ok(html.includes('renascimento_v23.js?v=23'));
 assert.ok(html.includes('casa_sync_v22.js?v=22'));
 assert.ok(css.includes('@media(max-width:540px)'));
 assert.ok(css.includes('focus-visible'));
 assert.ok(html.includes("const version='24.0.0'"));
});
test('defense lane targeting remains tied to physical lane after tree losses',()=>{
 assert.ok(html.includes('Math.floor(p.x/GW*s.trees.length)'));
 assert.ok(html.includes('s.trees[lane]?lane:alive.reduce'));
 assert.ok(!html.includes('Math.floor(p.x/GW*alive.length)'));
});
