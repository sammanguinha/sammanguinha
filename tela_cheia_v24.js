/* V24.2 - Modo imersivo: jogo ocupa o visor; HUD e comandos ficam dentro do jogo. */
(()=>{'use strict';
const modes=[['rpgDlg','RPG'],['gameDlg','Defesa'],['eventDlg','Halloween'],['houseDlg','Casa'],['profDlg','Personagem']];
let current=null,fallback=false;
const css=document.createElement('style');css.id='smImmersiveStyles';css.textContent=`
.sm-fullscreen-toggle{position:relative;z-index:4;display:inline-flex;align-items:center;justify-content:center;gap:7px;margin:8px 8px 10px 0;padding:10px 15px;border:1px solid #a5d7bc;border-radius:10px;background:#193f39;color:#f3ffeb;font-weight:800;cursor:pointer;touch-action:manipulation}
.sm-fullscreen-toggle:hover,.sm-fullscreen-toggle:focus-visible{background:#2a6858;outline-offset:3px}
.sm-immersive[data-sm-immersive]{box-sizing:border-box!important;background:#0b1820!important;color:#f2f5e9;--sm-hud:#101b2ce8}
.sm-immersive:fullscreen{width:100vw;height:100dvh;max-width:none;max-height:none;overflow:hidden;margin:0;padding:0!important}
.sm-immersive.sm-immersive-fallback{position:fixed!important;inset:0!important;width:100vw!important;height:100dvh!important;max-width:none!important;max-height:none!important;z-index:2147483640!important;overflow:hidden!important;margin:0!important;padding:0!important;display:block!important}
body.sm-immersive-lock{overflow:hidden!important}
.sm-immersive .sm-fullscreen-toggle{position:absolute;right:max(12px,env(safe-area-inset-right));top:max(8px,env(safe-area-inset-top));margin:0;padding:10px 14px;z-index:120;background:#17283bea;box-shadow:0 3px 18px #0008}
.sm-immersive-menu,.sm-immersive-header{display:none}\n.sm-immersive .sm-immersive-menu{display:block;position:absolute;top:max(8px,env(safe-area-inset-top));right:170px;z-index:120;padding:10px 14px;border:1px solid #b7dcb0;border-radius:10px;background:#20384ded;color:white;font-weight:800;cursor:pointer}
.sm-immersive .sm-immersive-header{display:block;position:absolute;z-index:100;top:max(9px,env(safe-area-inset-top));left:max(12px,env(safe-area-inset-left));padding:8px 13px;border:1px solid #527c7b;border-radius:9px;background:var(--sm-hud);max-width:calc(100vw - 340px);font-weight:800}
.sm-immersive .sm-immersive-header small{display:block;font-weight:500;font-size:.73rem;color:#aed3c6}
.sm-immersive .sm-immersive-close-menu{display:none}
#rpgDlg.sm-immersive .r12-shell{position:absolute;inset:0!important;max-width:none!important;margin:0!important;padding:0!important;display:block!important}
#rpgDlg.sm-immersive .r12-head,#rpgDlg.sm-immersive .r23-travel-guide,#rpgDlg.sm-immersive .r23-village-systems{display:none!important}
#rpgDlg.sm-immersive .r12-columns{position:absolute;inset:0!important;display:block!important;margin:0!important;padding:0!important}
#rpgDlg.sm-immersive .r12-main{position:absolute;inset:0!important;display:block!important;min-height:0!important;margin:0!important;padding:0!important;background:#0b1920}
#rpgDlg.sm-immersive .r12-frame{position:absolute;inset:0!important;border:0!important;border-radius:0!important;max-width:none!important;width:100%!important;height:100%!important;aspect-ratio:auto!important;margin:0!important;padding:0!important;background:#152d28}
#rpgDlg.sm-immersive #r12Canvas{display:block!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;aspect-ratio:auto!important;object-fit:fill!important;border:0!important;touch-action:manipulation}
#rpgDlg.sm-immersive .r12-hud{position:absolute!important;top:65px!important;left:max(12px,env(safe-area-inset-left));z-index:3;background:#101b2cce;padding:6px 12px;border-radius:9px;max-width:45vw}
#rpgDlg.sm-immersive .r12-tip{position:absolute!important;bottom:132px;left:50%;transform:translateX(-50%);max-width:75vw;width:max-content;padding:7px 14px;border-radius:8px;background:#111b2bd9;color:#fff2c9;z-index:6;font-size:.82rem;pointer-events:none}
#rpgDlg.sm-immersive .r12-controls{position:absolute!important;bottom:max(16px,env(safe-area-inset-bottom));left:max(12px,env(safe-area-inset-left));right:max(12px,env(safe-area-inset-right));z-index:10;display:flex!important;justify-content:space-between;align-items:flex-end;gap:12px;margin:0!important;padding:0!important;pointer-events:none;background:transparent!important}
#rpgDlg.sm-immersive .r12-controls button{pointer-events:auto;min-width:50px;min-height:48px;border-radius:12px;background:#142538e8;color:white;box-shadow:0 2px 8px #0009;touch-action:none}
#rpgDlg.sm-immersive .r12-dpad{pointer-events:auto;max-width:210px}
#rpgDlg.sm-immersive .v24-sprint-bar{position:absolute!important;right:max(12px,env(safe-area-inset-right));bottom:87px;z-index:12;width:min(220px,35vw);margin:0!important;padding:8px!important;gap:4px;background:#13283ce6}
#rpgDlg.sm-immersive .v24-sprint-bar label,#rpgDlg.sm-immersive .v24-sprint-bar small{display:none}
#rpgDlg.sm-immersive .v24-sprint-bar progress{width:100%;height:7px;flex:auto}
#rpgDlg.sm-immersive .v24-sprint-bar button{padding:8px;flex:1;min-width:0}
#rpgDlg.sm-immersive .r12-aside{position:absolute!important;right:0;top:0;bottom:0;width:min(390px,93vw)!important;max-height:none!important;overflow:auto!important;padding:74px 18px 25px!important;background:#101c2bf6;z-index:105;box-shadow:-8px 0 25px #0008;display:none!important}
#rpgDlg.sm-immersive.sm-immersive-panel-open .r12-aside{display:block!important}
#rpgDlg.sm-immersive .r12-bubble{position:absolute!important;left:50%;top:48%;transform:translate(-50%,-50%);width:min(550px,90vw);max-height:76dvh;overflow:auto;z-index:110}
#gameDlg.sm-immersive{display:block!important}
#gameDlg.sm-immersive>.ptitle{display:none!important}
#gameDlg.sm-immersive>.panel{position:absolute;inset:0;display:block!important;margin:0!important;padding:0!important;max-width:none!important;border:0!important;border-radius:0!important;background:#091621!important;overflow:hidden}
#gameDlg.sm-immersive .sm21-jobs,#gameDlg.sm-immersive #orchardExtras,#gameDlg.sm-immersive #gRank,#gameDlg.sm-immersive .sm20-defense-hint,#gameDlg.sm-immersive .chk,#gameDlg.sm-immersive .panel>div[style*="margin-top:24px"]{display:none!important}
#gameDlg.sm-immersive .panel>div:has(>#gCv){position:absolute!important;inset:0!important;display:flex!important;align-items:center;justify-content:center;border:0!important;border-radius:0!important;max-width:none!important;max-height:none!important;width:100%!important;height:100%!important;box-shadow:none!important;background:#0e202a!important}
#gameDlg.sm-immersive #gCv{width:auto!important;height:100%!important;max-width:100%!important;max-height:100%!important;object-fit:contain!important;aspect-ratio:auto!important}
#gameDlg.sm-immersive #gOv,#gameDlg.sm-immersive #sm17PauseCover{z-index:60}
#gameDlg.sm-immersive .sm17-defense-actions{position:absolute!important;top:58px;left:max(12px,env(safe-area-inset-left));z-index:50;margin:0!important;padding:0!important;border:0!important;background:#13253bc7}
#gameDlg.sm-immersive #sm17DefenseStatus{display:none}
#gameDlg.sm-immersive .sm21-tactics{position:absolute!important;top:0;bottom:0;right:0;width:min(390px,95vw);z-index:106;overflow:auto!important;margin:0!important;padding:78px 15px 20px!important;background:#122135f6!important;display:none!important;border-radius:0!important}
#gameDlg.sm-immersive.sm-immersive-panel-open .sm21-tactics{display:block!important}
#gameDlg.sm-immersive .gctl{position:absolute!important;left:max(12px,env(safe-area-inset-left));right:max(12px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom));z-index:45;margin:0!important;display:flex!important;justify-content:space-between!important;pointer-events:none}
#gameDlg.sm-immersive .gctl button{pointer-events:auto;min-height:54px;padding:12px!important;border-radius:12px;background:#15283edf;touch-action:none}
#gameDlg.sm-immersive .sm20-skills{position:absolute!important;right:max(12px,env(safe-area-inset-right));bottom:88px;z-index:45;display:flex!important;gap:6px;max-width:47vw}
#gameDlg.sm-immersive .sm20-skills button{padding:10px;min-height:44px;background:#16283bdc;color:white}
#gameDlg.sm-immersive #sm24GrovePulse{position:sticky;bottom:4px;z-index:3}
#houseDlg.sm-immersive,#profDlg.sm-immersive,#eventDlg.sm-immersive{overflow:auto!important;padding:65px 16px 18px!important}
#houseDlg.sm-immersive #sm21House,#profDlg.sm-immersive .sanctuary-grid{max-width:1600px;margin:auto}
#houseDlg.sm-immersive #sm21HouseCanvas{width:min(100%,1000px)!important;max-height:65dvh;object-fit:contain}
#eventDlg.sm-immersive #h8Canvas{max-height:72dvh;max-width:100%;object-fit:contain}
@media(max-width:650px){
 .sm-immersive .sm-immersive-header{top:8px;padding:5px 8px;max-width:40vw;font-size:.77rem}
 .sm-immersive .sm-immersive-header small{display:none}
 .sm-immersive .sm-fullscreen-toggle{top:6px;right:8px;padding:8px;font-size:.76rem}
 .sm-immersive .sm-immersive-menu{top:6px;right:125px;padding:8px;font-size:.76rem}
 #rpgDlg.sm-immersive .r12-hud{top:45px;padding:4px 7px;font-size:.75rem}
 #rpgDlg.sm-immersive .r12-tip{bottom:120px;font-size:.69rem;max-width:58vw}
 #rpgDlg.sm-immersive .v24-sprint-bar{bottom:77px;width:145px}
 #rpgDlg.sm-immersive .v24-sprint-bar button{font-size:.7rem;padding:5px}
 #rpgDlg.sm-immersive .r12-dpad{max-width:160px}
 #rpgDlg.sm-immersive .r12-controls button{min-width:43px;min-height:43px;padding:5px;font-size:.76rem}
 #gameDlg.sm-immersive .sm20-skills{bottom:78px;flex-wrap:wrap;max-width:38vw}
 #gameDlg.sm-immersive .sm20-skills button{padding:6px;font-size:.7rem}
 #gameDlg.sm-immersive .gctl button{min-height:48px;padding:8px!important;font-size:.72rem}
}
@media(max-height:510px){
 #rpgDlg.sm-immersive .r12-tip{display:none}
 #rpgDlg.sm-immersive .v24-sprint-bar{bottom:64px}
 #gameDlg.sm-immersive .sm20-skills{bottom:68px}
 #gameDlg.sm-immersive .gctl button{min-height:38px}
}
`;document.head.append(css);
function native(){return document.fullscreenElement}
function on(pane){return pane&&current===pane&&pane.classList.contains('sm-immersive')}
function sync(){for(const [id] of modes){const pane=document.getElementById(id),btn=pane?.querySelector('.sm-fullscreen-toggle');if(!btn)continue;const yes=on(pane);btn.textContent=yes?'⤢ Sair do modo jogo':'🎮 Modo jogo';btn.setAttribute('aria-pressed',String(yes));btn.setAttribute('aria-label',yes?'Sair do modo jogo':'Entrar no modo jogo')} }
function cleanup(){if(!current)return;const was=current;current=null;fallback=false;was.classList.remove('sm-immersive','sm-immersive-fallback','sm-immersive-panel-open');was.removeAttribute('data-sm-immersive');document.body.classList.remove('sm-immersive-lock');was.querySelector('.sm-immersive-menu')?.setAttribute('aria-expanded','false');sync()}
async function leave(){if(!current)return;const old=current;cleanup();if(native()===old&&document.exitFullscreen){try{await document.exitFullscreen()}catch(e){console.warn('Falha ao sair de tela cheia:',e)}}}
async function enter(pane){if(current&&current!==pane)await leave();if(on(pane))return leave();current=pane;pane.classList.add('sm-immersive');pane.dataset.smImmersive='true';document.body.classList.add('sm-immersive-lock');sync();if(pane.requestFullscreen){try{await pane.requestFullscreen();fallback=false;return}catch(e){console.info('Modo jogo sem tela cheia nativa:',e?.message)}}fallback=true;pane.classList.add('sm-immersive-fallback');}
for(const [id,label] of modes){const pane=document.getElementById(id);if(!pane)continue;
 const old=pane.querySelector('.sm-fullscreen-toggle');if(old)old.remove();
 const btn=document.createElement('button');btn.type='button';btn.className='sm-fullscreen-toggle';btn.setAttribute('aria-label','Entrar no modo jogo '+label);btn.textContent='🎮 Modo jogo';pane.prepend(btn);btn.addEventListener('click',()=>{if(on(pane))leave();else enter(pane)});
 const menu=document.createElement('button');menu.type='button';menu.className='sm-immersive-menu';menu.setAttribute('aria-expanded','false');menu.textContent='☰ '+(id==='gameDlg'?'Torres':'Menu');menu.hidden=!['rpgDlg','gameDlg'].includes(id);pane.append(menu);
 menu.addEventListener('click',()=>{const isOpen=pane.classList.toggle('sm-immersive-panel-open');menu.setAttribute('aria-expanded',String(isOpen));menu.textContent=isOpen?'✕ Fechar':('☰ '+(id==='gameDlg'?'Torres':'Menu'))});
 const header=document.createElement('div');header.className='sm-immersive-header';header.innerHTML='<strong>'+label+'</strong><small>EXPEDIÇÃO · MODO JOGO</small>';pane.append(header);
 const observer=new MutationObserver(()=>{if(on(pane)&&pane.hidden)leave()});observer.observe(pane,{attributes:true,attributeFilter:['hidden']});
}
document.addEventListener('fullscreenchange',()=>{if(current&&native()!==current&&!fallback)cleanup();sync()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&current&&!native()){e.preventDefault();leave()}});
window.SamImmersive=Object.freeze({enterById:id=>{const pane=document.getElementById(id);if(pane)return enter(pane)},leave,isActive:()=>!!current});
sync();
})();