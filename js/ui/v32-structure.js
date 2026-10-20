/* V32 — Navegação preservando os sistemas de jogo, filtro e retorno de jornada. */
(()=>{'use strict';
 const nav=document.getElementById('areas'),toggle=document.getElementById('v32MoreToggle'),panel=document.getElementById('v32MorePanel'),search=document.getElementById('v32DestinationSearch');
 if(!nav||!toggle||!panel||!search)return;
 const more=Array.from(panel.querySelectorAll('button[data-p]')),resume=document.getElementById('v32Resume'),name=document.getElementById('v32ResumeTitle'),desc=document.getElementById('v32ResumeDescription');
 const savedKey='sam_v32_last_journey';
 const descriptions={
  rpgDlg:['Mundo RPG','Explore a Vila, o Bosque e as novas regiões do Pomar.'],
  gameDlg:['Defesa do Pomar','Reforce as árvores e sobreviva às ondas inimigas.'],
  houseDlg:['Meu Refúgio','Continue personalizando e expandindo sua casa.']
 };
 const safeGet=()=>{try{return localStorage.getItem(savedKey)}catch(_){return null}};
 const safeSet=value=>{try{localStorage.setItem(savedKey,value)}catch(_){}};
 function showMenu(open,focus=false){
  panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));
  if(open&&focus){search.focus({preventScroll:true})}
  if(!open){search.value='';filter('')}
 }
 function filter(term){
  const query=term.trim().toLocaleLowerCase('pt-BR');
  let visible=0;
  for(const button of more){
   const match=button.textContent.toLocaleLowerCase('pt-BR').includes(query);
   button.hidden=!match;if(match)visible++;
  }
  const empty=document.getElementById('v32SearchEmpty');if(empty)empty.hidden=visible!==0;
 }
 function setResume(id){
  const mode=descriptions[id]?id:'rpgDlg',item=descriptions[mode];
  if(resume){resume.dataset.go=mode;resume.textContent=mode==='rpgDlg'?'▶ Continuar a jornada':mode==='gameDlg'?'▶ Voltar para a Defesa':'▶ Visitar meu Refúgio'}
  if(name)name.textContent=item[0];
  if(desc)desc.textContent=item[1];
 }
 function markActive(){
  const chosen=more.some(b=>b.getAttribute('aria-current')==='page');
  toggle.dataset.active=String(chosen);
  if(chosen)toggle.setAttribute('aria-label','Explorar outras áreas — área secundária selecionada');
  else toggle.setAttribute('aria-label','Explorar outras áreas');
 }
 setResume(safeGet());markActive();
 toggle.addEventListener('click',()=>showMenu(panel.hidden,true));
 search.addEventListener('input',()=>filter(search.value));
 panel.addEventListener('click',event=>{
  const destination=event.target.closest('button[data-p]');
  if(!destination)return;
  // Some legacy navigation handlers are initialized before secondary controls move.
  // Preserve their first chance to navigate; recover synchronously only if no route was selected.
  if(destination.dataset.p!=='sm18Expedition'&&destination.getAttribute('aria-current')!=='page'&&typeof window.showPane==='function'){
   window.showPane(destination.dataset.p);
  }
  showMenu(false);
 });
 document.addEventListener('click',event=>{
  const target=event.target;
  if(!target.closest('#v32MoreWrap')&&!target.closest('#v32MorePanel')&&!panel.hidden)showMenu(false);
  const action=target.closest('button[data-go],button[data-p]');
  if(action&&descriptions[action.dataset.go||action.dataset.p]){
   const mode=action.dataset.go||action.dataset.p;safeSet(mode);setResume(mode);
  }
  if(action&&action.matches('.v32-library-grid .portal-card')){
   // Existing data-go delegation still handles navigation.
  }
  if(action)requestAnimationFrame(markActive);
 });
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!panel.hidden){showMenu(false);toggle.focus({preventScroll:true});event.stopPropagation()}
  else if(event.key==='/'&&panel.hidden&&!event.ctrlKey&&!event.altKey&&!event.metaKey){
   const tag=event.target?.tagName?.toLowerCase();
   if(!['input','textarea','select'].includes(tag)&&!document.querySelector('#rpgDlg:not([hidden]),#gameDlg:not([hidden])')){
    event.preventDefault();showMenu(true,true);
   }
  }
 });
 // Do not close on focusout: the browser briefly focuses BODY while moving from
 // the search field to a destination button, which would cancel the click.
 // Outside click and Escape already dismiss the menu reliably.
 const observer=new MutationObserver(markActive);
 for(const button of more)observer.observe(button,{attributes:true,attributeFilter:['aria-current']});
 window.SamSiteV32=Object.freeze({openDestinations:()=>showMenu(true,true),getLastJourney:()=>safeGet()});
})();
