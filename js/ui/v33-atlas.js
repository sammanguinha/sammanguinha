/* V33 — Atlas do Pomar. Apenas leitura de progresso real e viagem validada pelo motor. */
(()=>{'use strict';
 const world=window.SamHybridRPG;
 if(!world?.getWorldAtlas)return;
 const el=(tag,klass,text)=>{const n=document.createElement(tag);if(klass)n.className=klass;if(text!==undefined)n.textContent=text;return n};
 const escape={};let currentTab='map',previousFocus=null;
 const dialog=el('dialog','sm33-atlas');dialog.id='v33Atlas';dialog.setAttribute('aria-labelledby','v33AtlasTitle');
 const wrapper=el('div','sm33-atlas-shell');
 const head=el('header','sm33-atlas-head');
 const top=el('div','sm33-atlas-top');
 const eyebrow=el('span','sm33-atlas-eyebrow','🌿 O RENASCIMENTO DO POMAR · V33');
 const title=el('h2',null,'Atlas do Pomar');title.id='v33AtlasTitle';
 const subtitle=el('p',null,'Sua jornada, suas descobertas e as conexões reais entre os reinos.');
 top.append(eyebrow,title,subtitle);
 const close=el('button','sm33-atlas-close','✕ Fechar');close.type='button';close.setAttribute('aria-label','Fechar Atlas');
 head.append(top,close);
 const tabs=el('div','sm33-atlas-tabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','Seções do Atlas');
 const definitions=[['map','🗺 Territórios'],['quests','📜 Jornada'],['codex','📚 Códice']];
 for(const [id,text]of definitions){const btn=el('button',null,text);btn.type='button';btn.dataset.atlasTab=id;btn.setAttribute('role','tab');btn.setAttribute('aria-controls','v33AtlasContent');tabs.append(btn)}
 const content=el('section','sm33-atlas-content');content.id='v33AtlasContent';content.setAttribute('role','tabpanel');
 const foot=el('footer','sm33-atlas-footer');
 foot.textContent='Os destinos só aceitam viagem rápida depois de visitados no mapa. Progresso salvo localmente por jogador; ranking oficial não é alterado.';
 wrapper.append(head,tabs,content,foot);dialog.append(wrapper);document.body.append(dialog);
 let lastError='';
 const now=()=>world.getState();
 const state=()=>world.getV33State();
 const addText=(parent,tag,klass,text)=>{const n=el(tag,klass,text);parent.append(n);return n};
 function markTabs(){
  for(const b of tabs.querySelectorAll('button')){const active=b.dataset.atlasTab===currentTab;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1}
 }
 function renderMap(){
  const places=world.getWorldAtlas(),visited=places.filter(p=>p.visited).length;
  const intro=el('div','sm33-overview');
  addText(intro,'span','sm33-atlas-eyebrow','EXPLORAÇÃO DO REINO');
  addText(intro,'h3',null,visited+' de '+places.length+' regiões descobertas');
  addText(intro,'p',null,'Encontre caminhos jogando. Se já passou por uma região nesta versão, pode retornar por aqui sem perder a missão.');
  content.append(intro);
  const map=el('div','sm33-region-grid');
  for(const p of places){
   const card=el('article','sm33-region'+(p.here?' here':'')+(p.visited?' discovered':' locked'));
   const area=addText(card,'span','sm33-region-status',p.here?'● VOCÊ ESTÁ AQUI':p.visited?'✓ EXPLORADA':'◇ A DESCOBRIR');
   addText(card,'h3',null,p.visited?p.name:'Região não descoberta');
   addText(card,'p',null,p.visited?p.subtitle:'Aventure-se a pé para encontrar este caminho.');
   if(p.visited&&!p.here){
    const button=el('button','sm33-travel','↗ Viajar até aqui');button.type='button';button.dataset.travel=p.id;card.append(button);
   }
   if(p.here)addText(card,'span','sm33-here','Local atual');
   map.append(card);
  }
  content.append(map);
  if(lastError)addText(content,'p','sm33-atlas-error',lastError);
 }
 function completed(){const v=state();return [!!v.metIara,v.echoes?.length===3,v.runes===3,v.memories?.length===2,!!v.bossWon,!!v.finished,!!v.niloReward].filter(Boolean).length}
 function renderQuests(){
  const s=state(),progress=completed();const banner=el('div','sm33-quest-overview');
  addText(banner,'span','sm33-atlas-eyebrow','CRÔNICA III · A CANÇÃO DA ÁGUA');
  addText(banner,'h3',null,world.getV33Objective());
  const meter=el('div','sm33-quest-rail');meter.setAttribute('role','progressbar');meter.setAttribute('aria-label','Progresso da Crônica III');meter.setAttribute('aria-valuemin','0');meter.setAttribute('aria-valuemax','7');meter.setAttribute('aria-valuenow',String(progress));
  const fill=el('i');fill.style.width=(progress/7*100)+'%';meter.append(fill);banner.append(meter);
  addText(banner,'p',null,progress+' de 7 marcos concluídos. Seu avanço não altera o ranking global.');
  content.append(banner);
  const events=[
   ['Conhecer Iara','Converse com a Cartógrafa no Vale.',!!s.metIara],
   ['Recolher três ecos','Vento, Chuva e Raiz.',s.echoes?.length===3],
   ['Despertar as pedras','Vento → Chuva → Raiz.',s.runes===3],
   ['Ler duas memórias','Histórias da Biblioteca Submersa.',s.memories?.length===2],
   ['Superar a Sentinela','Combate no Mirante da Primeira Luz.',!!s.bossWon],
   ['Escolher o destino do Vale','O Rio ou a Floresta.',!!s.finished],
   ['Ajudar Nilo','Encontre e devolva a bolsa perdida.',!!s.niloReward]
  ];
  const list=el('ol','sm33-steps');
  for(const [name,description,done]of events){
   const item=el('li',done?'done':'');
   addText(item,'span','sm33-step-mark',done?'✓':'◇');
   const col=el('div');addText(col,'b',null,name);addText(col,'small',null,description);item.append(col);list.append(item);
  }content.append(list);
  const connected=el('div','sm33-connection-card');
  addText(connected,'h3',null,'Jornadas conectadas');
  addText(connected,'p',null,'A Defesa do Pomar e a Casa agora podem enviar poções para sua campanha RPG, uma única vez por marco local.');
  const lines=[
   [!!s.defenseReward,'Defesa: vitória reconhecida — +1 poção RPG'],
   [!!s.houseReward,'Casa: quatro móveis colocados — +1 poção RPG'],
   [!!s.niloReward,'Vale: bolsa de Nilo devolvida — +1 poção RPG']
  ];
  for(const [done,text]of lines)addText(connected,'p','sm33-connected'+(done?' done':''),(done?'✓ ':'◇ ')+text);
  content.append(connected);
 }
 function renderCodex(){
  const s=now(),v=state(),epic=s.epic||{},visited=world.getWorldAtlas();
  const areas=visited.filter(p=>p.visited).map(p=>p.name);
  const characters=[
    ['Guardião Bento',!!s.seen?.includes('guarda'),'O guardião das primeiras sementes, na Vila.'],
    ['Iara, Cartógrafa',!!v.metIara,'Sua bússola aponta os ecos do Vale.'],
    ['Nilo, Aprendiz do Rio',!!(v.satchel||v.niloReward),'Perdeu uma bolsa junto das antigas pedras.'],
    ['Custódia das Páginas',visited.some(p=>p.id==='bibliotecaSubmersa'&&p.visited),'Protege memórias que resistiram à última seca.'],
    ['Sentinela do Primeiro Orvalho',!!v.bossWon,'Guardou a Fonte até a chegada de um novo protetor.']
  ];
  const artifacts=Array.isArray(epic.items)?epic.items:[];
  const cards=[
   ['👥 Personagens',characters.filter(p=>p[1]).map(p=>p[0]+' — '+p[2])],
   ['🗺 Lugares conhecidos',areas],
   ['🎒 Equipamentos encontrados',artifacts.map(x=>x.replace(/_/g,' '))],
   ['📖 História e escolhas',[
    v.ending==='rio'?'Você libertou o Rio do Vale da Primeira Aurora.':v.ending==='floresta'?'Você restaurou a Floresta da Primeira Aurora.':null,
    epic.v31?.finished?'O Jardim das Entrelinhas foi concluído.':null,
    epic.v30?.chapter1?.finished?'O primeiro capítulo do Bosque dos Ecos foi concluído.':null
   ].filter(Boolean)]
  ];
  const grid=el('div','sm33-codex-grid');
  for(const [name,lines]of cards){
   const card=el('section','sm33-codex-card');addText(card,'h3',null,name);
   if(!lines.length)addText(card,'p',null,'Continue explorando para revelar novos registros.');
   else {const list=el('ul');for(const text of lines)addText(list,'li',null,text);card.append(list)}
   grid.append(card);
  }content.append(grid);
 }
 function render(){
  markTabs();content.replaceChildren();
  if(currentTab==='map')renderMap();
  else if(currentTab==='quests')renderQuests();
  else renderCodex();
 }
 function open(tab='map'){
  currentTab=definitions.some(([id])=>id===tab)?tab:'map';lastError='';
  previousFocus=document.activeElement;render();
  if(!dialog.open)dialog.showModal();
  close.focus({preventScroll:true});
 }
 function hide(){if(dialog.open)dialog.close()}
 dialog.addEventListener('close',()=>{if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true})});
 dialog.addEventListener('click',event=>{if(event.target===dialog)hide()});
 close.addEventListener('click',hide);
 tabs.addEventListener('click',event=>{const button=event.target.closest('button[data-atlas-tab]');if(!button)return;currentTab=button.dataset.atlasTab;render();button.focus({preventScroll:true})});
 content.addEventListener('click',event=>{
  const button=event.target.closest('button[data-travel]');if(!button)return;
  const id=button.dataset.travel;
  if(!world.travelV33(id)){
   lastError='Esta viagem ainda não está disponível. Desbloqueie o destino caminhando ou feche o diálogo ativo.';
   render();return;
  }
  hide();world.open();
  const heading=document.getElementById('r12MapName');heading?.scrollIntoView({behavior:'smooth',block:'nearest'});
 });
 function installHome(){
  const host=document.querySelector('#home .v32-resume-panel');
  if(!host)return;
  const label=el('span','sm33-journey-label','ATLAS E PROGRESSO DE VERDADE');
  const status=el('span','sm33-journey-status');status.id='v33HomeStatus';status.setAttribute('aria-live','polite');
  const buttons=el('div','sm33-hero-actions');
  const atlasBtn=el('button','sm33-open','🗺 Abrir Atlas');atlasBtn.type='button';atlasBtn.id='v33HomeAtlas';atlasBtn.addEventListener('click',()=>open('map'));
  const missionBtn=el('button','sm33-open subtle','📜 Minha missão');missionBtn.type='button';missionBtn.id='v33HomeQuest';missionBtn.addEventListener('click',()=>open('quests'));
  buttons.append(atlasBtn,missionBtn);host.append(label,status,buttons);
  function refresh(){
    if(document.hidden)return;
    const v=state();
    status.textContent=completed()+'/7 marcos da Canção da Água'+(v.ending?' · CRÔNICA CONCLUÍDA':'');
  }
  refresh();setInterval(()=>{if(document.getElementById('home')?.hidden===false)refresh()},2000);
 }
 installHome();
 window.SamAtlasV33=Object.freeze({open,close:hide,refresh:render});
})();
