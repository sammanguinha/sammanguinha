const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const js=fs.readFileSync('tela_cheia_v24.js','utf8'),html=fs.readFileSync('index.html','utf8');
test('immersive module parses',()=>assert.doesNotThrow(()=>new vm.Script(js)));
test('five game modes have immersive overlay controls',()=>{for(const id of ['rpgDlg','gameDlg','eventDlg','houseDlg','profDlg'])assert.ok(js.includes("'"+id+"'"))});
test('RPG viewport prioritizes rendered map and overlay interactions',()=>{for(const s of ['#rpgDlg.sm-immersive #r12Canvas','#rpgDlg.sm-immersive .r12-controls','#rpgDlg.sm-immersive .v24-sprint-bar','#rpgDlg.sm-immersive .r12-aside','#rpgDlg.sm-immersive .r12-bubble'])assert.ok(js.includes(s))});
test('Defense viewport keeps canvas, attacks, abilities and tactical sidebar',()=>{for(const s of ['#gameDlg.sm-immersive #gCv','#gameDlg.sm-immersive .gctl','#gameDlg.sm-immersive .sm20-skills','#gameDlg.sm-immersive .sm21-tactics','sm-immersive-panel-open'])assert.ok(js.includes(s))});
test('native fullscreen plus app-like fallback and exit',()=>{for(const s of ['requestFullscreen','exitFullscreen','sm-immersive-fallback','fullscreenchange','aria-expanded','sm-immersive-lock'])assert.ok(js.includes(s))});
test('loaded cache-busted V24.2',()=>assert.ok(html.includes('tela_cheia_v24.js?v=28.1')));
