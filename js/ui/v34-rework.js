/* V34 — Rework total: um lugar para cada ação.
   Preserva todos os IDs, motores, saves, handlers e caminhos antigos.
   DOM apenas reorganizado; sem tocar na economia, login ou código de combate. */
(()=>{'use strict';
 const $=id=>document.getElementById(id);
 const home=$('home'),rpg=$('rpgDlg'),defense=$('gameDlg'),house=$('houseDlg'),profile=$('profDlg');
 if(!home||!rpg||!defense||!house||!profile)return;
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
 document.documentElement.classList.add('v34-ui');
 home.classList.add('v34-home');
 // A antiga árvore de mangas era interativa: preserva a colheita em um controle
 // compacto acessível em vez de apagar a mecânica por causa do rework.
 const siteHeader=$('hero'),originalHarvest=siteHeader?.querySelector('.hang .hm');
 if(siteHeader&&originalHarvest&&!$('v34Harvest')){
  const harvest=el('button','v34-harvest','🥭 Colher');
  harvest.type='button';harvest.id='v34Harvest';
  harvest.title='Colher uma manga no Pomar';
  harvest.setAttribute('aria-label','Colher uma manga');
  harvest.addEventListener('click',()=>originalHarvest.click());
  siteHeader.querySelector('.stats')?.before(harvest);
 }
 // Remover as duplicações da experiência principal, mantendo os destinos
 // no menu Explorar e os listeners antigos disponíveis para outros módulos.
 const hero=home.querySelector('.v32-adventure-home');
 const copy=hero?.querySelector('.r23-hero-copy'),title=copy?.querySelector('h2');
 const eyebrow=copy?.querySelector('.r23-hero-eyebrow');
 if(eyebrow)eyebrow.textContent='🌿 A SUA AVENTURA';
 if(title)title.textContent='O Pomar é seu para explorar.';
 if(copy){
  const paragraph=copy.querySelector('p');
  if(paragraph)paragraph.textContent='Continue de onde parou. Sua próxima história está pronta.';
 }
 const primary=$('v32Resume');
 if(primary){primary.textContent='▶ Continuar aventura';primary.title='Retomar o último modo jogado';primary.classList.add('v34-main-action')}
 const resume=home.querySelector('.v32-resume-panel');
 if(resume)resume.setAttribute('aria-live','off'); // status atualizado sem anúncios repetidos
 const oldDuplicates=home.querySelectorAll('.r23-hero-buttons .r23-secondary, .sm35-live-card[data-sm35-go="rpgDlg"]');
 oldDuplicates.forEach(node=>{node.classList.add('v34-duplicate-route');node.setAttribute('aria-hidden','true');node.tabIndex=-1});
 // Títulos e detalhes tornam-se opcionais. Os arquivos não são apagados:
 // continuam disponíveis no menu Explorar / respectivas seções.
 const repeatedModes=$('sm36AllDestinations');
 if(repeatedModes){repeatedModes.classList.add('v34-redundant-modes');repeatedModes.open=false;repeatedModes.setAttribute('aria-hidden','true');}
 const library=$('v32Library');
 if(library){
  library.open=false;
  const summary=library.querySelector('summary b');
  if(summary)summary.textContent='Explorar outras áreas';
  const hint=library.querySelector('summary small');
  if(hint)hint.textContent='Mapa, diário, ranking, comunidade e segredos';
 }
 const news=$('sm36NewsDetails');
 if(news){
  news.open=false;
  const summary=news.querySelector('summary');
  if(summary)summary.textContent='✨ O que mudou na atualização';
 }
 const community=$('sm35MoreCommunity');
 if(community){community.open=false;community.classList.add('v34-archive-community');}
 const oldStats=home.querySelector('.cols');
 if(oldStats)oldStats.classList.add('v34-archive-stats');
 // Estado resumido — dinâmico, em lugar de vários cards explicativos.
 if(hero&&!$('v34ProgressPill')){
  const pill=el('div','v34-progress-pill');pill.id='v34ProgressPill';
  const dot=el('span','v34-progress-dot');dot.setAttribute('aria-hidden','true');
  const state=el('span',null,'Sua jornada está esperando');state.id='v34ProgressText';
  pill.append(dot,state);copy?.insertBefore(pill,copy.querySelector('.r23-hero-buttons'));
 }
 const dashboard=$('sm35Dashboard');
 if(dashboard){
  dashboard.setAttribute('aria-label','Acesso rápido aos modos');
  const heading=$('sm35DashboardTitle');if(heading)heading.textContent='Para onde vamos?';
  const kicker=dashboard.querySelector('.sm35-eyebrow');if(kicker)kicker.textContent='ACESSO RÁPIDO';
  const names={
   gameDlg:['Defender árvores','🛡️'],
   houseDlg:['Cuidar da casa','🌱']
  };
  for(const [name,[label]] of Object.entries(names)){
   const card=dashboard.querySelector('[data-sm35-go="'+name+'"]');
   const strong=card?.querySelector('.sm35-live-text b');
   if(strong)strong.textContent=label;
  }
 }
 // A antiga seção de Ranking / fatos era uma segunda homepage:
 // permanecerá no HTML para scripts antigos, mas não duplica os destinos visíveis.
 // Nav principal passa a ser a única fonte de navegação. Home tem apenas:
 // continuar + Defesa/Casa + biblioteca opcional + novidades opcionais.
 // Reposiciona notícias depois da seção principal (o jogo vem primeiro).
 if(news&&dashboard)dashboard.after(news);
 const librarySection=home.querySelector('.rpg-portal-section');
 if(library&&librarySection&&dashboard){
  dashboard.after(library);
 }
 if(community&&library)library.after(community);
 // Na página de RPG, contratos e efeitos de cenário ficam num único painel
 // secundário APÓS o mapa e os controles. Nada é destruído.
 const guide=rpg.querySelector('.r23-travel-guide');
 const systems=rpg.querySelector('.r23-village-systems');
 const columns=rpg.querySelector('.r12-columns');
 if(columns&&(guide||systems)&&!$('v34WorldTools')){
  const tools=el('details','v34-world-tools');tools.id='v34WorldTools';
  const summary=el('summary');
  const name=el('span','v34-tools-heading','⚙ Atividades e ajustes do mundo');
  const hint=el('span','v34-tools-hint','Contratos · rotas · atmosfera');
  summary.append(name,hint);tools.append(summary);
  columns.after(tools);
  if(guide)tools.append(guide);
  if(systems)tools.append(systems);
  // O guia continua acessível também via botões antigos.
  tools.addEventListener('toggle',()=>{if(tools.open)rpg.classList.add('v34-world-tools-open');else rpg.classList.remove('v34-world-tools-open')});
 }
 const rpgHead=rpg.querySelector('.r12-head h2');
 if(rpgHead)rpgHead.textContent='Mundo do Pomar';
 const rpgBar=$('sm35RpgJumps');
 if(rpgBar){
  rpgBar.setAttribute('aria-label','Ferramentas do RPG');
  const goals=rpgBar.querySelectorAll('[data-sm35-jump]');
  goals.forEach(btn=>{
   const key=btn.dataset.sm35Jump;
   if(key==='#v33Card')btn.textContent='📜 Missões';
   if(key==='#r13Equip')btn.textContent='🎒 Itens';
   if(key==='#r12Journal')btn.textContent='📖 Diário';
   if(key==='#r13Attrs')btn.textContent='✦ Status';
  });
 }
 // Acesso a painéis recolhidos: expandi-los *antes* da rolagem legada.
 if(rpgBar){
  rpgBar.addEventListener('click',event=>{
   const btn=event.target.closest('[data-sm35-jump]');
   if(!btn)return;
   const target=rpg.querySelector(btn.dataset.sm35Jump);
   const aside=$('sm36RpgExtras'),toggle=$('sm36RpgSideToggle');
   if(target&&aside?.contains(target)&&toggle?.getAttribute('aria-expanded')==='false'){
    toggle.click();
    requestAnimationFrame(()=>target.scrollIntoView({behavior:'smooth',block:'nearest'}));
   }
  },true);
 }
 const heading=defense.querySelector('.ptitle');
 if(heading&&heading.textContent.length>30)heading.classList.add('v34-condensed-title');
 const houseHeading=house.querySelector('.sm21-house-top h2');
 if(houseHeading)houseHeading.textContent='Meu Refúgio';
 // V17 mantinha um guia grande acima do jogo e V16.5 mantinha um painel de
 // acessibilidade de página inteira. Os dois continuam funcionando, agora
 // recolhidos e sem competir com o canvas.
 const legacyGuide=$('sm171Hud'),guideText=$('sm171Guide'),worldTools=$('v34WorldTools');
 if(worldTools){
  if(legacyGuide)worldTools.append(legacyGuide);
  if(guideText)worldTools.append(guideText);
 }
 const accessibility=document.querySelector('.sm165-settings'),explore=$('v32MorePanel');
 if(accessibility&&explore&&!$('v34Accessibility')){
  const details=el('details','v34-accessibility');details.id='v34Accessibility';
  details.append(el('summary',null,'♿ Acessibilidade e conforto'));
  explore.append(details);details.append(accessibility);
 }
 // Preferências duplicadas da V23 continuam carregadas para compatibilidade,
 // mas o usuário encontra alto contraste, fonte maior e efeitos leves num
 // único local, no menu Explorar.
 const fullBtn=rpg.querySelector('.r12-frame>.sm-rpg-map-enter');
 if(fullBtn){fullBtn.textContent='⛶ Tela cheia';fullBtn.setAttribute('aria-label','Jogar RPG em tela cheia');}
 // O contador promocional antigo era montado no cabeçalho e, sem dados,
 // podia mostrar "undefined mangas" e "NaN:NaN". A campanha permanece no
 // menu Explorar, mas qualquer oferta inválida não é mostrada.
 const eventBar=$('evBar');
 if(eventBar&&explore){
  explore.append(eventBar);
  const check=()=>{
   if(/\b(?:undefined|NaN)\b/i.test(eventBar.textContent||'')){
    eventBar.hidden=true;eventBar.classList.add('v34-event-invalid');
   }else eventBar.classList.remove('v34-event-invalid');
  };
  check();
  new MutationObserver(check).observe(eventBar,{childList:true,characterData:true,subtree:true});
 }
 // Controles de corrida e loja com rótulos curtos para não quebrar palavra a
 // palavra num telefone de 320 px. Os eventos nativos permanecem intactos.
 const run=$('v24RunTouch'),shop=$('v24ShopShortcut');
 if(run)run.textContent='💨 Correr';
 if(shop)shop.textContent='🛍 Loja';
 // Estatísticas legíveis sem cards repetidos e sem loop ativo fora da Home.
 function refresh(){
  if(home.hidden)return;
  const world=window.SamHybridRPG;
  const state=world?.getState?.();
  const location=world?.getWorldAtlas?.().find(p=>p.here);
  const pill=$('v34ProgressText');
  if(!pill)return;
  const suffix=state?.epic?.level?' · Nível '+state.epic.level:'';
  pill.textContent=(location?.name||'Continue a sua jornada')+suffix;
 }
 refresh();
 const timer=setInterval(()=>{if(!document.hidden)refresh()},6000);
 window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});
 window.SamReworkV34=Object.freeze({
  refresh,
  openExtras:()=>{if(library){library.open=true;library.querySelector('summary')?.focus()}},
  openWorldTools:()=>{const tools=$('v34WorldTools');if(tools){tools.open=true;tools.querySelector('summary')?.focus()}}
 });
})();