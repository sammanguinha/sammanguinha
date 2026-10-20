/* V33.6 — Mobile-first: menos ruído, mais jogo. Sem remover handlers ou saves. */
(()=>{'use strict';
 const $=id=>document.getElementById(id),mobile=window.matchMedia('(max-width:720px)');
 const el=(name,cls,text)=>{const item=document.createElement(name);if(cls)item.className=cls;if(text!==undefined)item.textContent=text;return item};
 const home=$('home'),rpg=$('rpgDlg'),defense=$('gameDlg'),house=$('houseDlg');
 if(!home||!rpg||!defense||!house)return;
 // Keep all four destinations, but the dashboard is now the primary compact entry.
 const grid=home.querySelector('.v32-featured-grid');
 if(grid&&!$('sm36AllDestinations')){
  const details=el('details','sm36-all-destinations');details.id='sm36AllDestinations';
  const summary=el('summary',null,'🧭 Outras formas de jogar');
  const hint=el('small',null,'RPG · Defesa · Casa · Personagem');summary.append(hint);
  grid.before(details);details.append(summary,grid);
  let changed=false;
  function responsive(){
   if(!changed)details.open=!mobile.matches;
   details.dataset.mobile=String(mobile.matches);
  }
  responsive();mobile.addEventListener('change',()=>{changed=false;responsive()});
  details.addEventListener('toggle',event=>{if(event.isTrusted)changed=true});
 }
 // Old news remain accessible but no longer occupy a second whole mobile screen.
 const news=$('sm30News');
 if(news&&!$('sm36NewsDetails')){
  const details=el('details','sm36-news-details');details.id='sm36NewsDetails';
  const title=el('summary',null,'✨ Novidades da atualização');
  news.before(details);details.append(title,news);
  let changed=false;
  function responsive(){if(!changed)details.open=!mobile.matches;}
  responsive();mobile.addEventListener('change',()=>{changed=false;responsive()});
  details.addEventListener('toggle',event=>{if(event.isTrusted)changed=true});
 }
 // Existing RPG sidebar remains in DOM; on mobile a single toggle reserves
 // screen space for the actual canvas. Native button exposes expanded state.
 const aside=rpg.querySelector('.r12-aside'),shell=rpg.querySelector('.r12-shell');
 if(aside&&shell&&!$('sm36RpgSideToggle')){
  const button=el('button','sm36-side-toggle','📜 Missões e mochila');
  button.type='button';button.id='sm36RpgSideToggle';
  button.setAttribute('aria-controls','sm36RpgExtras');
  aside.id='sm36RpgExtras';
  button.setAttribute('aria-expanded',String(!mobile.matches));
  const main=rpg.querySelector('.r12-main');
  if(main)main.after(button);
  function set(open){aside.classList.toggle('sm36-aside-open',open);button.setAttribute('aria-expanded',String(open));button.textContent=open?'✕ Recolher painéis':'📜 Missões e mochila'}
  set(!mobile.matches);
  button.addEventListener('click',()=>set(button.getAttribute('aria-expanded')!=='true'));
  mobile.addEventListener('change',()=>set(!mobile.matches));
  // Make old in-game shortcuts reachable without forcing players to scroll.
  rpg.querySelectorAll('.sm35-rpg-jumps [data-sm35-jump]').forEach(action=>action.addEventListener('click',()=>{
   const target=rpg.querySelector(action.dataset.sm35Jump);
   if(mobile.matches&&target&&aside.contains(target))set(true);
  },{capture:true}));
 }
 // Defense: group only the out-of-game controls. Game canvas and touch controls
 // stay outside this details block to preserve pointer handling and visibility.
 const tactics=defense.querySelector('.sm21-tactics');
 if(tactics&&!$('sm36DefenseTactics')){
  const details=el('details','sm36-defense-tactics');details.id='sm36DefenseTactics';
  const summary=el('summary',null,'🛡 Ajustes de estratégia');details.append(summary);
  tactics.before(details);details.append(tactics);
  let changed=false;
  function responsive(){if(!changed)details.open=!mobile.matches}
  responsive();mobile.addEventListener('change',()=>{changed=false;responsive()});
  details.addEventListener('toggle',event=>{if(event.isTrusted)changed=true});
  // Open during combat preparation if player navigates there explicitly.
  defense.querySelectorAll('[data-sm21-lane],[data-difficulty]').forEach(b=>b.addEventListener('click',()=>{if(mobile.matches)details.open=true}));
 }
 // House: garden and decor remain functional, but show one workspace at a time on phones.
 const houseEditor=$('sm21House'),garden=$('sm34Garden');
 if(houseEditor&&garden&&!$('sm36HouseSwitch')){
  const tabs=el('div','sm36-house-switch');tabs.id='sm36HouseSwitch';
  tabs.setAttribute('role','group');tabs.setAttribute('aria-label','Área do Refúgio');
  for(const [id,label] of [['decor','🛋️ Decoração'],['garden','🌱 Horta e receitas']]){
   const b=el('button',null,label);b.type='button';b.dataset.sm36House=id;tabs.append(b);
  }
  const top=house.querySelector('.sm21-house-top');top?.after(tabs);
  let chosen='garden';
  function update(){
   const isMobile=mobile.matches;
   for(const b of tabs.querySelectorAll('button'))b.setAttribute('aria-pressed',String(b.dataset.sm36House===chosen));
   houseEditor.classList.toggle('sm36-pane-hidden',isMobile&&chosen!=='decor');
   garden.classList.toggle('sm36-pane-hidden',isMobile&&chosen!=='garden');
  }
  tabs.addEventListener('click',e=>{const b=e.target.closest('[data-sm36-house]');if(!b)return;chosen=b.dataset.sm36House;update()});
  mobile.addEventListener('change',update);update();
  // The legacy house rendering canvas can still render when decoration is selected.
 }
 // Bottom navigation on touch-width screens reuses existing original nav buttons
 // rather than creating a second set with duplicate IDs and dead handlers.
 const areas=$('areas'),tabs=areas?.querySelector('.v32-tabs'),more=$('v32MoreWrap');
 if(areas&&tabs&&more){
  const toggle=more.querySelector('#v32MoreToggle');
  if(toggle){toggle.title='Abrir outras áreas';}
 }
 const current=()=>home.hidden?'game': 'home';
 document.documentElement.dataset.sm36View=current();
 const observer=new MutationObserver(()=>{document.documentElement.dataset.sm36View=current()});
 observer.observe(home,{attributes:true,attributeFilter:['hidden']});
 window.SamCompactV36=Object.freeze({
  getVisibleHouseArea:()=>houseEditor?.classList.contains('sm36-pane-hidden')?'garden':'decor',
  openRpgPanels:()=>{$('sm36RpgSideToggle')?.click()},
  showGarden:()=>{if(typeof window.showPane==='function')window.showPane('houseDlg');$('sm36HouseSwitch')?.querySelector('[data-sm36-house="garden"]')?.click()}
 });
})();