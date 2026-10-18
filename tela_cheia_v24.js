/* V24.1 — Tela cheia para os modos de jogo. */
(()=>{'use strict';
const modes=[['rpgDlg','RPG'],['gameDlg','Defesa'],['eventDlg','Halloween'],['houseDlg','Casa'],['profDlg','Personagem']];
const style=document.createElement('style');style.textContent=`
.sm-fullscreen-toggle{position:relative;z-index:3;display:inline-flex;align-items:center;justify-content:center;gap:7px;margin:8px 8px 10px 0;padding:10px 15px;border:1px solid #a5d7bc;border-radius:10px;background:#193f39;color:#f3ffeb;font-weight:800;cursor:pointer;touch-action:manipulation}
.sm-fullscreen-toggle:hover,.sm-fullscreen-toggle:focus-visible{background:#2a6858;outline-offset:3px}
.pane:fullscreen{box-sizing:border-box;width:100vw;height:100dvh;max-width:none;max-height:none;margin:0;padding:clamp(8px,2vw,24px);overflow:auto;background:#0d1922;color:#f3f6e8}
.pane:fullscreen canvas{max-width:100%;height:auto}
.pane:fullscreen .r12-shell{max-width:1600px;margin:auto}
.pane:fullscreen .panel{max-width:1800px;margin:auto}
@media(max-width:600px){.sm-fullscreen-toggle{width:100%;margin:8px 0}.pane:fullscreen{padding:7px}}
`;document.head.append(style);
function active(){return document.fullscreenElement}
function sync(){for(const[id]of modes){const pane=document.getElementById(id),button=pane?.querySelector('.sm-fullscreen-toggle');if(!button)continue;const on=active()===pane;button.textContent=on?'⤢ Sair da tela cheia':'⛶ Tela cheia';button.setAttribute('aria-pressed',String(on));button.setAttribute('aria-label',on?'Sair da tela cheia':'Ativar tela cheia')}}
for(const[id,label]of modes){const pane=document.getElementById(id);if(!pane)continue;const button=document.createElement('button');button.type='button';button.className='sm-fullscreen-toggle';button.textContent='⛶ Tela cheia';button.setAttribute('aria-label','Ativar tela cheia no modo '+label);button.setAttribute('aria-pressed','false');const heading=pane.querySelector('h2,.r12-head,.panel')||pane.firstElementChild; if(heading?.parentElement)heading.insertAdjacentElement('beforebegin',button);else pane.prepend(button);
button.addEventListener('click',async()=>{try{if(active()===pane){await document.exitFullscreen();return}if(!pane.requestFullscreen){button.textContent='Tela cheia indisponível neste navegador';return}await pane.requestFullscreen()}catch(err){button.textContent='Tela cheia indisponível';console.warn('Tela cheia:',err?.message||err)}finally{sync()}});
}
document.addEventListener('fullscreenchange',sync);
document.addEventListener('fullscreenerror',sync);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&active())sync()});
sync();
})();
