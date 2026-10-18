/* V23 UI preferences and accessible shortcuts — independent from existing gameplay state. */
(()=>{'use strict';
 if(document.getElementById('r23SettingsToggle'))return;
 const store='sam_r23_preferences_v1';
 let prefs={reduceEffects:false,contrast:false};
 try{const value=JSON.parse(localStorage.getItem(store)||'null');if(value&&typeof value==='object')prefs={reduceEffects:!!value.reduceEffects,contrast:!!value.contrast}}catch(_){}
 const apply=()=>{document.documentElement.classList.toggle('sm165-lowfx',prefs.reduceEffects);document.documentElement.classList.toggle('r23-high-contrast',prefs.contrast)};
 function persist(){apply();try{localStorage.setItem(store,JSON.stringify(prefs))}catch(_){/* settings still work for this tab */}}
 apply();
 const skip=document.createElement('a');skip.className='r23-skip';skip.href='#rpgDlg';skip.textContent='Pular para o mundo do Pomar';document.body.prepend(skip);
 const toggle=document.createElement('button');toggle.type='button';toggle.className='r23-settings-toggle';toggle.id='r23SettingsToggle';toggle.textContent='⚙ Acessibilidade';toggle.setAttribute('aria-controls','r23SettingsPanel');toggle.setAttribute('aria-expanded','false');
 const panel=document.createElement('section');panel.className='r23-settings-panel';panel.id='r23SettingsPanel';panel.setAttribute('aria-label','Acessibilidade e efeitos visuais');panel.hidden=true;
 const title=document.createElement('h3');title.textContent='⚙ Conforto do Guardião';
 const info=document.createElement('p');info.textContent='Preferências locais; não afetam seu progresso nem o ranking.';
 panel.append(title,info);
 const add=(id,label,value,update)=>{const row=document.createElement('label');const txt=document.createElement('span');txt.textContent=label;const control=document.createElement('input');control.type='checkbox';control.id=id;control.checked=value;control.addEventListener('change',()=>{update(control.checked);persist()});row.append(txt,control);panel.append(row)};
 add('r23EffectPref','Reduzir partículas e animações',prefs.reduceEffects,v=>prefs.reduceEffects=v);
 add('r23ContrastPref','Aumentar o contraste da interface',prefs.contrast,v=>prefs.contrast=v);
 const close=document.createElement('button');close.type='button';close.textContent='Fechar opções';close.addEventListener('click',()=>setOpen(false));panel.append(close);
 function setOpen(open){panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));if(open)panel.querySelector('input')?.focus();else toggle.focus()}
 toggle.addEventListener('click',()=>setOpen(panel.hidden));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)setOpen(false)});
 document.addEventListener('pointerdown',e=>{if(!panel.hidden&&!panel.contains(e.target)&&!toggle.contains(e.target))setOpen(false)});
 document.body.append(toggle,panel);
 skip.addEventListener('click',()=>{const game=document.getElementById('rpgDlg');if(game?.hidden){document.querySelector('[data-p="rpgDlg"]')?.click()}requestAnimationFrame(()=>document.getElementById('r12Canvas')?.focus())});
})();