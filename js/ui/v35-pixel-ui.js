/* V35 — Crônicas em Pixels.
   Visual e texto de interface; não altera física, perfis, saves,
   Supabase nem associa novamente eventos dos botões antigos. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 if(!document.getElementById('home')||!document.getElementById('areas'))return;
 document.documentElement.classList.add('v35-pixel');
 document.documentElement.dataset.pixelEdition='35';
 const mq=window.matchMedia('(max-width:720px)');
 const shortLabels={
  homeBtn:'Início',
  rpgWorldBtn:'RPG',
  gameBtn:'Defesa',
  houseBtn:'Casa',
  profBtn:'Herói',
  v32MoreToggle:'Mais'
 };
 // Nav stays real (same buttons, IDs, click handlers). Only labels fit the dock.
 const navButtons=Object.entries(shortLabels).map(([id,short])=>{
  const btn=$(id);
  const spans=btn?.querySelectorAll('span');
  const text=spans?.length?spans[spans.length-1]:null;
  if(!btn||!text)return null;
  const original=text.textContent.trim();
  if(!btn.getAttribute('aria-label'))btn.setAttribute('aria-label',original);
  return {btn,text,original,short};
 }).filter(Boolean);
 function syncDock(){for(const entry of navButtons)entry.text.textContent=mq.matches?entry.short:entry.original}
 syncDock();
 mq.addEventListener('change',syncDock);
 // Preserve the original Atlas destination and its click handler; give it a
 // short label only in the cramped 320px/390px resume panel.
 const mapLink=$('v32ResumeSecondary'),mapLabel=mapLink?.textContent||'';
 if(mapLink){
  if(!mapLink.hasAttribute('aria-label'))mapLink.setAttribute('aria-label','Abrir mapa e missões do Pomar');
  const syncMap=()=>{mapLink.textContent=mq.matches?'▣ Mapa':mapLabel};
  syncMap();mq.addEventListener('change',syncMap);
 }
 // Real 3-class Defense selection remains intact. Only compact visible labels
 // on phones while full original descriptions stay in accessible names/title.
 const jobs=[...document.querySelectorAll('#sm21Jobs [data-sm21-job]')].map(btn=>{
  const name=btn.querySelector('b'),description=btn.querySelector('span');
  if(!name)return null;
  const original=name.textContent,detail=description?.textContent||'';
  if(!btn.hasAttribute('aria-label'))btn.setAttribute('aria-label',original+'. '+detail);
  btn.title=original+'. '+detail;
  const short={guardian:'🛡 Guardião',ranger:'🏹 Caçador',mage:'🌙 Mago'}[btn.dataset.sm21Job]||original;
  return {name,original,short};
 }).filter(Boolean);
 const syncJobs=()=>jobs.forEach(job=>{job.name.textContent=mq.matches?job.short:job.original});
 syncJobs();mq.addEventListener('change',syncJobs);
 // One shared working theme button belongs in More, not floating over canvas
 // or horta. Move the original V27 button: no new listener or duplicate.
 const theme= document.querySelector('#home .v27-theme-button'),menu=$('v32MorePanel');
 if(theme&&menu){
  theme.classList.add('v35-global-theme');
  theme.setAttribute('aria-label','Alternar tema Aurora ou Eclipse');
  menu.append(theme);
 }

 const eyebrow=document.querySelector('#home .r23-hero-eyebrow');
 if(eyebrow)eyebrow.textContent='✦ CRÔNICAS EM PIXELS · V35';
 const heroTitle=document.querySelector('#home .v32-adventure-home h2');
 if(heroTitle)heroTitle.textContent='Seu Pomar. Sua lenda.';
 const subtitle=document.querySelector('#home .v32-adventure-home .r23-hero-copy>p');
 if(subtitle)subtitle.textContent='Explore, proteja as árvores e descubra um mundo que cresce com você.';
 const dashboardTitle=$('sm35DashboardTitle');
 if(dashboardTitle)dashboardTitle.textContent='ESCOLHA SEU CAMINHO';
 const kicker=document.querySelector('#home .sm35-eyebrow');
 if(kicker)kicker.textContent='▣ MENU DE AVENTURA';
 const library=document.querySelector('#v32Library summary b');
 if(library)library.textContent='▸ OUTROS DESTINOS';
 const news=$('sm36NewsDetails')?.querySelector('summary');
 if(news)news.textContent='✦ NOVIDADES DA V35';
 const gameHeader=document.querySelector('#rpgDlg .r12-head h2');
 if(gameHeader)gameHeader.textContent='MUNDO DO POMAR';
 const defenseTitle=document.querySelector('#gameDlg>.ptitle');
 if(defenseTitle)defenseTitle.dataset.pixelQuest='Defesa das Árvores';
 const houseTitle=document.querySelector('#houseDlg .sm21-house-top h2');
 if(houseTitle)houseTitle.textContent='REFÚGIO DO GUARDIÃO';
 const profileTitle=document.querySelector('#profDlg .map-header h2');
 if(profileTitle)profileTitle.textContent='MEU PERSONAGEM';
 const replace=(selector,value)=>{const node=document.querySelector(selector);if(node)node.textContent=value};
 replace('#sm30NewsVersion','V35 · Crônicas em Pixels');
 replace('#sm30NewsHeading','Um novo visual para sua aventura');
 replace('#sm30News h2 + p','Tudo ganhou identidade de RPG em pixels: janelas, fontes, ícones, mapas, inventário, diálogos e controles, sem perder sua história, seus saves ou os modos anteriores.');
 replace('#smUpdatePanel .sm-tag','✦ NOVA ERA EM PIXELS · V35');
 replace('#smUpdateTitle','V35 — Crônicas em Pixels');
 replace('#smUpdatePanel > p','Uma transformação visual: pixel art original, menus de RPG, controles legíveis no celular e progressão preservada.');
 // Preserve the entire update history; include the new release with concrete changes.
 const history=document.querySelector('#smUpdatePanel .sm-update-history');
 if(history&&!history.querySelector('[data-v35-pixel-entry]')){
  const item=document.createElement('div');item.dataset.v35PixelEntry='true';item.className='sm-update-item';
  const heading=document.createElement('strong');heading.textContent='V35 · Crônicas em Pixels';
  const copy=document.createElement('p');copy.textContent='Fonte pixelada e visual 16-bit em toda a interface, ícones e paisagem originais, janelas de missão, diálogos, Casa, Defesa, Perfil e menus para celular.';
  item.append(heading,copy);history.prepend(item);
 }
 window.SamPixelV35=Object.freeze({
  version:'35.0',
  getNavLabels:()=>navButtons.map(x=>({id:x.btn.id,text:x.text.textContent})),
  refreshDock:syncDock
 });
})();
