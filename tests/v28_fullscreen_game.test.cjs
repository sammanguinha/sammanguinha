'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),
 fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html'),game=read('mundo_pomar.js'),
 full=read('tela_cheia_v24.js'),css=read('css/v28-rpg-fullscreen.css');
test('V28.1 visibly exposes fullscreen in RPG heading and directly on game map',()=>{
 for(const text of ['.r12-head','.r12-frame','sm-rpg-head-enter',
  'sm-rpg-map-enter','JOGAR EM TELA CHEIA','Jogar em tela cheia'])
  assert.ok(full.includes(text),text);
 assert.ok(full.includes("['rpgDlg','RPG']"));
 assert.ok(full.includes('requestFullscreen'));
 assert.ok(full.includes('sm-immersive-fallback'));
 assert.ok(full.includes('exitFullscreen'));
});
test('real renderer preserves camera/player scaling when viewport changes',()=>{
 for(const item of ['let W=768,H=448','RENDER_PIXEL_BUDGET','syncGameViewport',
  'ResizeObserver','cv.width=width','cv.height=height','window.addEventListener(\'resize\'',
  "host.classList.contains('sm-immersive')",'W/(COLS*T)','H/(ROWS*T)'])
  assert.ok(game.includes(item),'missing screen-aware engine '+item);
 assert.ok(game.includes('getBoundingClientRect()'));
 assert.ok(game.includes('(e.clientX-b.left)/b.width*W'));
 assert.doesNotThrow(()=>new vm.Script(game));
 assert.doesNotThrow(()=>new vm.Script(full));
});
test('fullscreen CSS overrides old portrait letterboxing and keeps on-screen controls usable',()=>{
 for(const sel of [
  '#rpgDlg.sm-immersive[data-sm-immersive] #r12Canvas',
  '#rpgDlg.sm-immersive[data-sm-immersive] .r12-frame',
  '#rpgDlg.sm-immersive[data-sm-immersive] .r12-controls',
  '#rpgDlg.sm-immersive[data-sm-immersive] .r12-interact',
  '#rpgDlg.sm-immersive[data-sm-immersive] .v27-rpg-actionbar',
  '#rpgDlg.sm-immersive[data-sm-immersive] .sm-fullscreen-toggle',
  '#rpgDlg.sm-immersive[data-sm-immersive] #v27RpgHud',
  '#rpgDlg.sm-immersive[data-sm-immersive] .r12-aside',
  '#rpgDlg:not(.sm-immersive)>.sm-fullscreen-toggle'
 ])assert.ok(css.includes(sel),sel);
 assert.ok(css.includes('width:100%!important;height:100%!important'));
 assert.ok(css.includes('aspect-ratio:auto!important'));
 assert.ok(css.includes('@media(max-width:720px)'));
 assert.ok(css.includes('@media(max-height:550px)'));
 assert.ok(css.includes('pointer-events:auto'));
});
test('gameplay fullscreen CSS is loaded last, on original V28 static package',()=>{
 const last=html.lastIndexOf('css/v28-rpg-fullscreen.css?v=28.1');
 assert.ok(last>html.indexOf('css/v28-live-extensions.css?v=28'));
 assert.ok(html.includes('tela_cheia_v24.js?v=28.1'));
 assert.ok(html.includes('visual_v27.css?v=27'));
 assert.ok(html.includes('css/v28-foundation.css?v=28'));
});
