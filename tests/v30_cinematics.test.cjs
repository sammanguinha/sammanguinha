'use strict';
const t=require('node:test'),a=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),p=require('node:path');
const dir=p.resolve(__dirname,'..'),rd=f=>fs.readFileSync(p.join(dir,f),'utf8');
const world=rd('mundo_pomar.js'),music=rd('musica_rpg_v14.js'),film=rd('js/games/v30-cutscenes.js'),css=rd('css/v30-cinematics.css'),html=rd('index.html');
t('V30.2 scripts compile and load film only after the existing world',()=>{
 for(const [f,s] of [['RPG',world],['audio',music],['cinematic',film]])a.doesNotThrow(()=>new vm.Script(s,{filename:f}));
 a.ok(html.indexOf('musica_rpg_v14.js?v=30.2')<html.indexOf('mundo_pomar.js?v=33.0'));
 a.ok(html.indexOf('mundo_pomar.js?v=33.0')<html.indexOf('js/games/v30-cutscenes.js?v=30.2'));
 a.ok(html.includes('css/v30-cinematics.css?v=30.2'));
 a.ok(html.includes('id="sm30WatchTeaser"'));
});
t('Five NEW original compositions include 64-note measures and public track selector',()=>{
 const names=['village','forest','mystery','cinematic','temple'];
 for(const x of names){
  const m=music.match(new RegExp(x+":\\{bpm:(\\d+),key:(\\d+),scale:(\\[[^\\]]+\\]),mel:(\\[[^\\]]+\\])"));
  a.ok(m,'missing composition '+x);
  a.equal(JSON.parse(m[4]).length,64,'soundtrack '+x+' must have 64 musical steps');
  a.ok(JSON.parse(m[4]).filter(v=>v!==null).length>=35,'soundtrack '+x+' must have substantive melodies');
 }
 a.ok(music.includes("saved!==null"),'new users have audible default volume');
 a.ok(music.includes('get currentScene(){return scene}'));
 a.ok(world.includes('function v30SceneForRoom(where)'));
 a.ok(world.includes("if(where==='atrioRaizes'||where==='ruinas'"));
});
t('Four original animated cutscenes with keyboard, reduced-motion and skip',()=>{
 const context={window:{},document:{addEventListener(){}},windowStub:0};
 context.window.addEventListener=()=>{};
 vm.runInNewContext(film,context,{timeout:1000});
 const ui=context.window.SamCutscenes;
 a.deepEqual(Array.from(ui.scenes),['awakening','whisper','opening','grove','groveEnding','archive']);
 for(const name of ui.scenes)a.equal(ui.getScene(name).frames,4);
 for(const k of ['createElement(\'div\')','imageSmoothingEnabled=false','requestAnimationFrame',
  'prefers-reduced-motion','ArrowRight','Escape',"'#sm30CutNext'","setAttribute('aria-modal'"])
  a.ok(film.includes(k),k);
 a.ok(css.includes('@media(max-width:620px)'));
 a.ok(css.includes('@media(max-height:440px)'));
 a.ok(css.includes('#sm30Cutscene[hidden]'));
});
t('Physical three-rune path opens new atrium and unique reward once',()=>{
 for(const id of ['v30RootSignal','v30ForestFissure','v30StoneSeed','v30StoneWater','v30StoneLight',
  'v30RootGate','v30AtrioBack','v30AtrioKeeper','v30RecordPath','v30RecordHarvest','v30RecordMemory'])
  a.ok(world.includes("id:'"+id+"'"),id);
 a.ok(world.includes("seq=['v30StoneSeed','v30StoneWater','v30StoneLight']"));
 for(const k of ['function v30DoneIntro()','function v30DoneVision()','function v30DoneGate()',
  'function v30DoneArchive()','if(q.completed)return','if(q.records.includes(a.id))',
  'pingente_primeira_raiz_v30','effect:\'regen\'','warp(\'atrioRaizes\',2.8,7)'])
  a.ok(world.includes(k),k);
 a.ok(world.includes('function v30Decor()'));
 a.ok(world.includes('function v30DrawActor('));
 a.ok(world.includes('if(a.v30)return v303ActorVisible(a)&&v30ActorVisible(a)'));
 a.ok(world.includes('if(a?.v30){v30Interact(a);return;}'));
});
t('Cutscenes pause movement, preserve the V29 save, and are available on mobile',()=>{
 for(const k of ['!window.SamCutscenes?.isPlaying','if(dialogOpen||window.SamCutscenes?.isPlaying)return',
  "if(!visible||dialogOpen||window.SamCutscenes?.isPlaying)return",
  "const e=epic();","e.v30={};",'v30RenderUI();'])
  a.ok(world.includes(k),k);
 for(const k of ['#rpgDlg .v30-prologue','#rpgDlg .v30-actions',
  '#rpgDlg #v30TrackChoice','#sm30Cutscene canvas','#sm30Cutscene #sm30CutNext'])
  a.ok(css.includes(k),k);
});
