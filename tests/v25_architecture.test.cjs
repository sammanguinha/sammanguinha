'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const html=read('index.html');
const manifest=JSON.parse(read('architecture-v25.json'));
const integrity=JSON.parse(read('architecture-v26.json'));
const styles=[...html.matchAll(/<link\b[^>]*href="(css\/[^"?]+)\?v=(?:25|26)"[^>]*>/gi)].map(m=>m[1]);
const scripts=[...html.matchAll(/<script\b[^>]*src="(js\/[^"?]+)\?v=(?:25|26)"[^>]*><\/script>/gi)].map(m=>m[1]);
test('HTML delegates to 19 CSS assets and 14 classic scripts in deterministic order',()=>{
 assert.equal(styles.length,19);assert.equal(scripts.length,14);
 assert.deepEqual(styles,manifest.styles.map(x=>x.file));
 assert.deepEqual(scripts,manifest.scripts.map(x=>x.file));
 assert.equal([...html.matchAll(/<style(?:\s|>)/gi)].length,0);
 assert.equal([...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].filter(x=>x[1].trim()).length,0);
 assert.ok(html.length<225000);
});
test('Every extracted file exists and matches the manifest byte-independent length',()=>{
 for(const entry of [...manifest.styles,...manifest.scripts]){
  assert.ok(exists(entry.file),entry.file);
  assert.equal(read(entry.file).length,entry.bytes,entry.file);
  assert.ok(entry.bytes>0);
 }
});
const gitBlob=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s,'utf8')+'\0'+s,'utf8').digest('hex');
test('Split scripts and CSS are byte-for-byte identical to the V25 originals',()=>{
 assert.equal(gitBlob(integrity.controllerSections.map(read).join('')),integrity.originalControllerGitBlob,'legacy game logic changed during split');
 assert.equal(gitBlob(integrity.styleSections.map(read).join('')),integrity.originalStylesGitBlob,'legacy CSS changed during split');
});
test('Classic scripts retain execution order, do not use async/defer, and compile independently',()=>{
 for(const file of scripts)assert.doesNotThrow(()=>new vm.Script(read(file),{filename:file}));
 for(let i=1;i<integrity.controllerSections.length;i++)assert.ok(scripts.indexOf(integrity.controllerSections[i-1])<scripts.indexOf(integrity.controllerSections[i]),'bad order');
 assert.ok(html.indexOf('src="js/core/progression.js?v=26"')<html.indexOf('src="js/games/halloween-wardrobe.js?v=25"'));
 assert.ok(html.indexOf('src="js/games/halloween-wardrobe.js?v=25"')<html.indexOf('src="rpg_epico_expansao.js"'));
 assert.ok(html.indexOf('src="js/ui/update-notice.js?v=25"')>html.indexOf('src="mundo_pomar.js"'));
 for(const m of html.matchAll(/<script\b([^>]*)src="(js\/[^"]+)"([^>]*)>/gi)){
  if(['js/ui/game-shell-v27.js?v=27','js/ui/v32-structure.js?v=32.0','js/ui/v32-news.js?v=32.0','js/ui/v33-atlas.js?v=33.0','js/ui/v33-news.js?v=33.5','js/ui/v34-garden.js?v=33.4','js/ui/v35-site.js?v=33.5'].includes(m[2]))continue; // Visual components initialize after DOM parsing; V25 core remains classic.
  assert.doesNotMatch(m[1]+m[3],/\b(?:defer|async|type="module")\b/i);
 }
});
test('All game modes, persistence and controls remain connected',()=>{
 for(const id of ['rpgDlg','gameDlg','houseDlg','profDlg','r12Canvas','gCv','sm21HouseCanvas'])assert.ok(html.includes('id="'+id+'"'));
 for(const f of ['mundo_pomar.js','mundo_v24.css?v=24','tela_cheia_v24.js?v=28.1','casa_sync_v22.js?v=22','renascimento_v23.js?v=23'])assert.ok(html.includes(f),f);
 assert.ok(read('js/games/defense-engine.js').includes('function sm21TacticsTick(s,dt){'));
 assert.ok(read('js/ui/update-notice.js').includes("const version='24.0.0'"));
});
test('Every local CSS, JS and SVG link points to a real file',()=>{
 for(const [kind,re] of [['script',/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/gi],['link',/<link\b[^>]*\bhref="([^"]+)"[^>]*>/gi]]){
  for(const m of html.matchAll(re)){const v=m[1];if(/^(https?:|data:|#|\/)/.test(v))continue;const p=v.split('?')[0].split('#')[0];assert.ok(exists(p),kind+' '+p);}
 }
 for(const s of styles){
  for(const m of read(s).matchAll(/url\(([^)]+)\)/gi)){
   const v=m[1].replace(/^['"]|['"]$/g,'');if(/^(https?:|data:|#)/.test(v))continue;
   assert.ok(exists(path.normalize(path.join(path.dirname(s),v))),s+' '+v);
  }
 }
});
