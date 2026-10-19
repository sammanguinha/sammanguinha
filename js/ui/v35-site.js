/* V33.5 — Dashboard de aventura e navegação útil.
   Só reorganiza elementos com handlers já existentes; nenhum destino é apagado. */
(()=>{'use strict';
 const world=window.SamHybridRPG,garden=window.SamGardenV34;
 const $=id=>document.getElementById(id);
 const create=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el};
 const home=$('home');
 if(!home)return;
 const hero=home.querySelector('.v32-adventure-home');
 if(hero){
  hero.dataset.edition='V33.5 · VIDA NO POMAR';
  const eyebrow=hero.querySelector('.r23-hero-eyebrow');
  if(eyebrow)eyebrow.textContent='✦ CENTRAL DE JOGO · V33.5';
  const title=hero.querySelector('h2');if(title)title.textContent='Seu mundo continua crescendo.';
  const paragraph=hero.querySelector('.r23-hero-copy p');
  if(paragraph)paragraph.textContent='Continue a campanha, organize a defesa ou cultive seu refúgio. Cada atividade faz parte da mesma jornada.';
 }
 const grid=create('section','sm35-dashboard');grid.id='sm35Dashboard';
 grid.setAttribute('aria-labelledby','sm35DashboardTitle');
 grid.innerHTML='<div class="sm35-dashboard-heading"><span class="sm35-eyebrow">JORNADA EM TEMPO REAL</span><h2 id="sm35DashboardTitle">O que acontece no seu Pomar</h2></div>'+
 '<div class="sm35-live-grid">'+
 '<button type="button" data-sm35-go="rpgDlg" class="sm35-live-card"><span class="sm35-live-icon">🗺</span><span class="sm35-live-text"><b>Minha aventura</b><strong id="sm35Region">Carregando região…</strong><small id="sm35Quest">Veja o próximo objetivo do RPG</small></span><span aria-hidden="true">↗</span></button>'+
 '<button type="button" data-sm35-go="houseDlg" class="sm35-live-card"><span class="sm35-live-icon">🌱</span><span class="sm35-live-text"><b>Minha horta</b><strong id="sm35Garden">Seis canteiros cultiváveis</strong><small id="sm35Harvest">Plante e prepare itens RPG</small></span><span aria-hidden="true">↗</span></button>'+
 '<button type="button" data-sm35-go="gameDlg" class="sm35-live-card"><span class="sm35-live-icon">🛡️</span><span class="sm35-live-text"><b>Defesa do Pomar</b><strong id="sm35Defense">Modos Normal e Estratégico</strong><small id="sm35DefenseTip">Proteja suas árvores</small></span><span aria-hidden="true">↗</span></button></div>';
 hero.after(grid);
 function update(){
  const state=world?.getState?.();const region=world?.getWorldAtlas?.().find(p=>p.here);
  if(state&&region){
   $('sm35Region').textContent=region.name;
   const objective=world.getV33Objective?.()||'Explore e conclua os capítulos.';
   $('sm35Quest').textContent=objective;
  }
  const g=garden?.snapshot?.();
  if(g){
   const ready=g.plots.filter(p=>p&&Date.now()>=p.readyAt).length;
   const growing=g.plots.filter(Boolean).length;
   $('sm35Garden').textContent=ready?ready+' colheita(s) pronta(s)':growing?growing+' canteiro(s) plantado(s)':'Plante sua primeira semente';
   $('sm35Harvest').textContent='🌿 '+g.resources.erva+' ervas · 💧 '+g.resources.orvalho+' orvalho · 🌙 '+g.resources.lunar+' flores';
  }
  const s=window.Sam33Defense?.snapshot?.();
  const plan=window.Sam33Defense?.selectedPlan?.()||'vigilia';
  $('sm35Defense').textContent=s?'Onda '+s.wave+' · '+s.plan:'Plano: '+({vigilia:'Vigília',assalto:'Assalto',contencao:'Contenção'}[plan]||'Vigília');
  $('sm35DefenseTip').textContent=s?'Barreiras ativas: '+s.barriers.reduce((x,y)=>x+y,0):'Monte torres e fortifique rotas no treino';
 }
 grid.addEventListener('click',e=>{
  const button=e.target.closest('button[data-sm35-go]');
  if(button&&typeof window.showPane==='function')window.showPane(button.dataset.sm35Go);
 });
 // Remove redundant *placement* of old social billboard, but keep its actual buttons.
 const cta=$('sm17HomeCTA'),library=$('v32Library');
 if(cta&&library&&!$('sm35MoreCommunity')){
  const details=create('details','sm35-community-details');details.id='sm35MoreCommunity';
  const summary=create('summary',null,'💬 Comunidade e códigos do Pomar');
  details.append(summary,cta);library.after(details);
 }
 // Within RPG, add deep links to actual panels rather than duplicating their controls.
 const rpg=$('rpgDlg');
 const rpgHead=rpg?.querySelector('.r12-head');
 if(rpgHead&&!$('sm35RpgJumps')){
  const bar=create('nav','sm35-rpg-jumps');bar.id='sm35RpgJumps';
  bar.setAttribute('aria-label','Atalhos do painel RPG');
  const links=[
   ['🎯 Próximo objetivo','#v33Card'],
   ['⚔️ Equipamentos','#r13Equip'],
   ['📖 Diário','#r12Journal'],
   ['🧩 Atributos','#r13Attrs']
  ];
  for(const [label,selector]of links){
   const btn=create('button',null,label);btn.type='button';btn.dataset.sm35Jump=selector;
   bar.append(btn);
  }
  const atlas=create('button',null,'🗺 Atlas');atlas.type='button';atlas.dataset.sm35Atlas='true';bar.append(atlas);
  rpgHead.after(bar);
  bar.addEventListener('click',e=>{
   const atlasBtn=e.target.closest('[data-sm35-atlas]');
   if(atlasBtn){window.SamAtlasV33?.open('map');return;}
   const button=e.target.closest('[data-sm35-jump]');if(!button)return;
   const target=rpg.querySelector(button.dataset.sm35Jump);
   if(!target)return;
   target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
   target.closest('.r12-card')?.classList.add('sm35-highlight');
   setTimeout(()=>target.closest('.r12-card')?.classList.remove('sm35-highlight'),1500);
  });
 }
 const houseHead=$('houseDlg')?.querySelector('.sm21-house-top');
 if(houseHead&&!$('sm35HouseIntro')){
  const intro=create('p','sm35-house-intro','🏠 Decoração · 🌱 Cultivo · 🧪 Receitas · ✨ Acessórios. Tudo ligado ao RPG; seus móveis e saves antigos permanecem.');
  intro.id='sm35HouseIntro';houseHead.append(intro);
 }
 function refreshIfVisible(){
  if(document.hidden||!home.isConnected)return;
  if(!home.hidden)update();
 }
 update();
 // Updates are intentionally infrequent; no networking, animation loops or overwrites.
 setInterval(refreshIfVisible,4000);
 window.SamSiteV35=Object.freeze({refresh:update});
})();
