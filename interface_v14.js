/* Sam Manguinha v14 — UX compacta, navegação e bestiário. Não altera os saves existentes. */
(()=>{'use strict';
const qs=(s,root=document)=>root.querySelector(s),qsa=(s,root=document)=>[...root.querySelectorAll(s)];
const nav=qs('#areas'),tabs=qs('.areas .tabs2'),actions=qs('.areas .nav-actions');
if(nav&&tabs){
 const keep=new Set(['home','rpgDlg','gameDlg','houseDlg','profDlg']);
 const wrap=document.createElement('div');wrap.className='r14-more';wrap.innerHTML='<button type="button" class="r14-more-button" id="r14MoreToggle" aria-controls="r14MoreMenu" aria-expanded="false">☰ Mais</button><div id="r14MoreMenu" class="r14-more-menu" hidden></div>';
 tabs.after(wrap);const menu=qs('#r14MoreMenu'),toggle=qs('#r14MoreToggle');
 // O painel administrativo continua acessível, mas sai da barra para economizar largura.
 const admin=qs('#admBtn');if(admin){menu.appendChild(admin);admin.classList.add('r14-admin-option');}
 qsa('button[data-p]',tabs).forEach(b=>{
   if(!keep.has(b.dataset.p)){menu.appendChild(b)}
   if(b.dataset.p==='rpgDlg')b.querySelector('span')?.replaceChildren(document.createTextNode('RPG'));
   if(b.dataset.p==='gameDlg')b.querySelector('span')?.replaceChildren(document.createTextNode('Defesa'));
   if(b.dataset.p==='profDlg')b.querySelector('span')?.replaceChildren(document.createTextNode('Visual'));
 });
 const show=state=>{menu.hidden=!state;toggle.setAttribute('aria-expanded',String(state))};
 toggle.onclick=()=>show(menu.hidden);menu.addEventListener('click',e=>{if(e.target.closest('button[data-p]'))show(false)});
 document.addEventListener('pointerdown',e=>{if(!wrap.contains(e.target))show(false)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')show(false)});
 nav.addEventListener('click',e=>{const b=e.target.closest('[data-p]');if(b){window.SamMusic?.scene(b.dataset.p==='eventDlg'?'shadows':'explore')}});
}
// Music controls with user gesture: mobile browsers won't play unprompted.
if(actions&&window.SamMusic){
 const dock=document.createElement('div');dock.className='r14-music-item';dock.innerHTML='<button id="r14MusicToggle" type="button" class="r14-music-toggle" aria-pressed="false">♫ Música</button><button id="r14MusicOptions" class="r14-music-options" aria-label="Volume e trilha" aria-expanded="false" type="button">▾</button><div id="r14MusicPopover" class="r14-music-pop" hidden><strong>♫ Trilha do Pomar</strong><p id="r14MusicStatus">Toque em Música para ouvir.</p><label for="r14MusicVolume">Volume</label><input id="r14MusicVolume" type="range" min="0" max="100" value="32" step="1"><p>4 temas instrumentais originais: exploração, combate, chefão e Halloween.</p></div>';
 actions.prepend(dock);
 const pop=qs('#r14MusicPopover'),more=qs('#r14MusicOptions');
 qs('#r14MusicToggle').addEventListener('click',()=>window.SamMusic.toggle());
 more.addEventListener('click',()=>{pop.hidden=!pop.hidden;more.setAttribute('aria-expanded',String(!pop.hidden))});
 qs('#r14MusicVolume').addEventListener('input',e=>window.SamMusic.setVolume(+e.target.value/100));
 document.addEventListener('pointerdown',e=>{if(!dock.contains(e.target)){pop.hidden=true;more.setAttribute('aria-expanded','false')}});
 window.SamMusic.sync();
}
// Reduce home information density: four main activities first, all other portal cards in one optional drawer.
const portal=qs('.rpg-portal-grid');
if(portal){
 const entries=qsa('.portal-card',portal),byId=new Map(entries.map(b=>[b.dataset.go,b]));
 const main=['rpgDlg','gameDlg','houseDlg','profDlg','eventDlg'];
 main.forEach(id=>{const c=byId.get(id);if(c)portal.appendChild(c)});
 const others=entries.filter(c=>!main.includes(c.dataset.go));
 if(others.length){
  const details=document.createElement('details');details.className='r14-community r14-home-extras';
  details.innerHTML='<summary>✦ Explorar outras áreas <span>Diário, ranking, galeria, segredos e mural</span></summary><div class="rpg-portal-grid r14-extra-grid"></div>';
  portal.after(details);const grid=qs('.r14-extra-grid',details);others.forEach(c=>grid.appendChild(c));
 }
}
// Compact the home page without removing any original content or server-backed ranking.
const cols=qs('#home .cols')||qs('.wrap .cols');
if(cols&&cols.parentElement&&cols.closest('#home, #stage')){
 const details=document.createElement('details');details.className='r14-community';details.innerHTML='<summary>✦ Comunidade, ranking e notícias <span>Toque para expandir</span></summary>';
 cols.before(details);details.appendChild(cols);
}
// RPG panel switcher. All original quest, backpack, shortcut and history nodes remain in DOM.
const aside=qs('#rpgDlg .r12-aside');
if(aside){
 const quest=qs('#r12Quests')?.closest('.r12-card'),inventory=qs('#r12Inventory')?.closest('.r12-card'),shortcuts=qs('.r12-shortcuts')?.closest('.r12-card'),journal=qs('#r12Journal')?.closest('.r12-card');
 const story=qs('.r13-story-card',aside),stats=qs('.r13-stat-card',aside),art=qs('.r13-artifacts-card',aside),side=qs('.r13-side-card',aside),chronicles=qs('.r13-chronicle-card',aside);
 [[story,'journey'],[quest,'journey'],[inventory,'journey'],[stats,'hero'],[art,'artifacts'],[side,'extras'],[shortcuts,'extras'],[journal,'extras'],[chronicles,'chronicles']].forEach(([el,key])=>{if(el)el.dataset.r14Group=key});
 const b=document.createElement('section');b.className='r12-card r14-bestiary-card';b.dataset.r14Group='bestiary';b.innerHTML='<h3>📗 Bestiário das Pragas</h3><p class="r13-caption">Os registros surgem quando você enfrenta e derrota cada guardião.</p><div id="r14BestiaryEntries"></div>';aside.append(b);
 const tabBar=document.createElement('nav');tabBar.className='r14-info-tabs';tabBar.setAttribute('aria-label','Painéis do RPG');
 const list=[['journey','Missão'],['hero','Herói'],['artifacts','Relíquias'],['bestiary','Bestiário'],['chronicles','Crônicas'],['extras','Extras']];
 tabBar.innerHTML=list.map(([id,name])=>'<button type="button" data-r14tab="'+id+'" aria-pressed="false">'+name+'</button>').join('');aside.prepend(tabBar);
 function getEpic(){try{const h=(localStorage.getItem('sg_handle')||'visitante').toLowerCase();return JSON.parse(localStorage.getItem('sam_rpg_hibrido_v12_'+h)||'null')?.epic||{}}catch(e){return {}}}
 function updateBestiary(){const el=qs('#r14BestiaryEntries');if(!el)return;const e=getEpic(),defs=window.SamEpicData?.enemies||{};const ids=[['larva','larva'],['rainha','spider'],['besouro','crystalBoss'],['espectro','collector'],['sentinela','moonGuardian'],['rei','finalKing']];el.innerHTML=ids.map(([id,actor])=>{const m=defs[id];if(!m)return '';const found=(e.defeated||[]).includes(actor);return '<div class="r14-beast '+(found?'found':'unknown')+'"><span>'+(found?'✦':'?')+'</span><div><b>'+(found?m.name:'Criatura desconhecida')+'</b><small>'+(found?'Fraqueza: '+({fire:'Fogo',light:'Luz',nature:'Natureza',earth:'Terra',shadow:'Sombra',storm:'Raio'}[m.weak]||m.weak)+' · '+m.xp+' XP':'Descubra lutando no mundo RPG')+'</small></div></div>'}).join('')}
 function choose(id){qsa('[data-r14tab]',tabBar).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.r14tab===id)));qsa('.r12-card[data-r14-group]',aside).forEach(el=>el.classList.toggle('r14-visible',el.dataset.r14Group===id));try{sessionStorage.setItem('sam_ui_v14_tab',id)}catch(e){};if(id==='bestiary')updateBestiary();}
 tabBar.addEventListener('click',e=>{const button=e.target.closest('button[data-r14tab]');if(button)choose(button.dataset.r14tab)});
 let initial='journey';try{initial=sessionStorage.getItem('sam_ui_v14_tab')||'journey'}catch(e){};if(!list.some(([id])=>id===initial))initial='journey';choose(initial);
 // compact badge under main section header, updated only when context changes.
 const hud=document.createElement('div');hud.className='r14-rpg-summary';hud.innerHTML='<span>✦ A Crônica da Primeira Mangueira</span><span id="r14HudSummary">Encontre sua história</span>';
 const head=qs('#rpgDlg .r12-head');head?.after(hud);
 const stage=qs('#r13Class');let previous='';function updateHud(){const cls=stage?.textContent||'Aventureiro',lv=qs('#r13Level')?.textContent||'',value=cls+' · '+lv;if(value!==previous){previous=value;const badge=qs('#r14HudSummary');if(badge)badge.textContent=value}}
 updateHud();
 if(stage){new MutationObserver(updateHud).observe(stage,{childList:true,subtree:true,characterData:true})}
}
// Confirm a new battle can be launched with a clean modal, but don't hijack gameplay.
window.SamUI14={version:14};
})();
