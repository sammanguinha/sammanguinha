'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html'),styles=[
 'css/v28-foundation.css','css/v28-pages.css','css/v28-responsive.css','css/v28-live-extensions.css','css/v28-rpg-fullscreen.css'
];
test('V28 loads four ordered CSS layers AFTER V27 without removing the existing game engines',()=>{
 let prev=html.indexOf('visual_v27.css?v=27');
 assert.ok(prev>=0);
 for(const file of styles){
  const marker='href="'+file+'?v='+(file.includes('fullscreen')?'28.1':'28')+'"';
  const i=html.indexOf(marker);
  assert.ok(i>prev,'visual layer load order: '+file);prev=i;
  assert.ok(fs.statSync(path.join(root,file)).size>2200,'real stylesheet: '+file);
 }
 for(const src of ['mundo_pomar.js','tela_cheia_v24.js?v=28.1','js/game-v26.bundle.js','js/ui/game-shell-v27.js']){
  // The V26 bundle is a production-only asset. Development source links remain modular.
  if(src==='js/game-v26.bundle.js')assert.ok(html.includes('js/core/app.js?v=26'));
  else assert.ok(html.includes(src));
 }
 assert.ok(html.includes('V28 · CRÔNICAS DO BOSQUE'));
});
test('V28 redesign covers every major section, not just the RPG canvas',()=>{
 const css=styles.map(read).join('\n');
 for(const id of ['#sm18Expedition','#hero','#home','#rpgDlg','#gameDlg','#houseDlg','#profDlg','#eventDlg',
  '#diary','#murDlg','#rankDlg','#questDlg','#galDlg','#secDlg','#curDlg']){
  assert.ok(css.includes(id),'V28 section missing: '+id);
 }
 for(const feature of ['.portal-card','.r12-frame','.sm21-tower-buttons','.r12-card',
 '.sm21-house-sidebar','.wardrobe-tab','.region-node','.sm17-social','.podium',
 '.sm17-code-console','#gGal','#facts','dialog','nav#areas','.sm18-hub','.r14-more-menu','.r14-music-pop']){
  assert.ok(css.includes(feature),'style component missing: '+feature);
 }
});
test('V28 preserves accessibility, immersive canvas and aspect-correct portraits',()=>{
 const css=styles.map(read).join('\n');
 for(const marker of ['prefers-reduced-motion',':focus-visible','min-height:43px',
  '#rpgDlg:not(.sm-immersive)','#gameDlg:not(.sm-immersive)',
  'html[data-v27-theme=eclipse]','@media(max-width:520px)','touch-action:manipulation']){
  assert.ok(css.includes(marker),'style accessibility or compatibility missing: '+marker);
 }
 assert.ok(css.includes('var(--v28-gold)'));
 assert.ok(css.includes('scrollbar'));
 assert.ok(!/display:\s*none\s*!important\s*;?.*?\.sm-fullscreen-toggle/.test(css));
 const original=read('visual_v27.css');
 assert.ok(original.includes('aspect-ratio:12 / 7'), 'V27 mobile canvas aspect layout retained');
});
test('V28 CSS has paired braces and no missing local @import URLs',()=>{
 for(const file of styles){
  const s=read(file).replace(/\/\*[\s\S]*?\*\//g,'').replace(/"(?:\\.|[^"])*"|'(?:\\.|[^'])*'/g,'');
  const left=(s.match(/\{/g)||[]).length,right=(s.match(/\}/g)||[]).length;
  assert.equal(left,right,file+' unbalanced CSS blocks');
  assert.ok(left>25,file+' not a full stylesheet');
  assert.ok(!/@import\s+url\(\s*['"]?\.\//.test(s),file+' unexpected relative external dependency');
 }
});
