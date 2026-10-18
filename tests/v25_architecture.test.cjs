'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const html=read('index.html');
const manifest=JSON.parse(read('architecture-v25.json'));
const styles=[...html.matchAll(/<link\s+[^>]*href="(css\/[^"?]+)\\?v=(?:25|26)"[^>]*>/gi)].map(m=>m[1]);
const scripts=[...html.matchAll(/<script\s+src="(js\/[^"?]+)\\?v=(?:25|26)"><\/script>/gi)].map(m=>m[1]);
test('index.html has been physically split into 19 CSS assets and 14 classic JS files',()=>{
 assert.equal(styles.length,19);
 assert.equal(scripts.length,14);
 assert.deepEqual(styles,manifest.styles.map(x=>x.file));
 assert.deepEqual(scripts,manifest.scripts.map(x=>x.file));
 assert.equal([...html.matchAll(/<style(?:\s|>)/gi)].length,0,'no embedded style blocks');
 assert.equal([...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].filter(x=>x[1].trim()).length,0,'no embedded executable scripts');
 assert.ok(html.length<225000,'markup should be substantially smaller than V24 monolith');
});
test('all extracted assets exist, are non-empty and retain original contents',()=>{
 for(const entry of [...manifest.styles,...manifest.scripts]){
  assert.ok(exists(entry.file),entry.file);
  assert.equal(read(entry.file).length,entry.bytes,entry.file+' content length');
  assert.ok(entry.bytes>0,entry.file);
 }
});
test('legacy global execution ordering and script semantics are preserved',()=>{
 for(const file of scripts) assert.doesNotThrow(()=>new vm.Script(read(file),{filename:file}));
 assert.ok(html.indexOf('src="js/core/app.js?v=26"')<html.indexOf('src="js/games/halloween-wardrobe.js?v=25"'));
 assert.ok(html.indexOf('src="js/games/halloween-wardrobe.js?v=25"')<html.indexOf('src="rpg_epico_expansao.js"'));
 assert.ok(html.indexOf('src="js/ui/update-notice.js?v=25"')>html.indexOf('src="mundo_pomar.js"'));
 for(const match of html.matchAll(/<script\b([^>]*)src="(js\/[^"]+)"([^>]*)>/gi)){
  assert.doesNotMatch(match[1]+match[3],/\b(?:defer|async|type="module")\b/i,'must preserve original synchronous execution');
 }
});
test('RPG, defense, immersive controls and identity integrations are still referenced',()=>{
 for(const id of ['rpgDlg','gameDlg','houseDlg','profDlg','r12Canvas','gCv','sm21HouseCanvas'])
  assert.ok(html.includes('id="'+id+'"'),id);
 for(const file of ['mundo_pomar.js','mundo_v24.css?v=24','tela_cheia_v24.js?v=24.2','casa_sync_v22.js?v=22','renascimento_v23.js?v=23'])
  assert.ok(html.includes(file),file);
 assert.ok(read('js/games/defense-engine.js').includes('function sm21TacticsTick(s,dt){'))
 assert.ok(read('js/ui/update-notice.js').includes("const version='24.0.0'"));
});
test('reference URLs are local and all package file dependencies can be resolved',()=>{
 for(const kind of ['script','link']){
  const re=kind==='script'?/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/gi:/<link\b[^>]*\bhref="([^"]+)"[^>]*>/gi;
  for(const m of html.matchAll(re)){
   const v=m[1];
   if(/^(?:https?:|data:|#)/.test(v))continue;
   const p=v.split('?')[0].split('#')[0];
   if(p.startsWith('/'))continue;
   assert.ok(exists(p),kind+' missing asset '+p);
  }
 }
 for(const s of styles){
  const urls=[...read(s).matchAll(/url\(([^)]+)\)/gi)].map(x=>x[1].replace(/^['"]|['"]$/g,''));
  for(const url of urls){if(/^(data:|https?:|#)/.test(url))continue; assert.ok(exists(path.normalize(path.join(path.dirname(s),url))),'CSS reference '+s+' '+url);}
 }
});
