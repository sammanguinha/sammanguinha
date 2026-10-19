/* V30.1: release notes are real content that can always be reopened from Home.
   The version is deliberately V29: V30 remains in development, not released. */
(()=>{'use strict';
 const current='29.0.0',flag='sm_last_seen_release_v29',store=window.localStorage;
 const layer=document.getElementById('smUpdateLayer');
 const panel=document.getElementById('smUpdatePanel');
 const home=document.getElementById('sm30News');
 const read=document.getElementById('sm30NewsRead');
 const reopen=document.getElementById('smUpdatesReopen');
 const close=document.getElementById('smUpdatesClose');
 const later=document.getElementById('smUpdatesLater');
 if(!layer||!panel||!home||!read||!reopen||!close||!later)return;
 let seen=null;try{seen=store.getItem(flag)}catch(_){}
 // Replace the stale V23 content, while retaining legacy dialog events and accessibility.
 const tag=panel.querySelector('.sm-tag');
 if(tag)tag.textContent='🌳 NOVAS AVENTURAS · V29.0';
 const title=document.getElementById('smUpdateTitle');
 if(title)title.textContent='V29 — Crônicas Vivas';
 const desc=panel.querySelector('p');
 if(desc)desc.textContent='A Última Badalada chega ao RPG com investigação, escolhas e descobertas.';
 const history=panel.querySelector('.sm-update-history');
 if(history){
  const entries=[
   {v:'V29',name:'Crônicas Vivas — A Última Badalada',notes:[
    ['📜 História jogável','Investigue o sino perdido com Íris, Mara e Caio.'],
    ['🧩 Puzzle musical','Colete três pistas e afine o Carrilhão das Três Vozes.'],
    ['⚔️ Combate tático','Mariposa do Silêncio e Sentinela da Badalada, golpes anunciados e ação Analisar.'],
    ['🔎 Descobertas','Nove histórias secretas espalhadas pelo Pomar.'],
    ['📚 Diário de Campo','Pesquisas locais rotativas, com recompensa limitada por dia.'],
    ['🌿 Decisões','Escolha o destino da Última Badalada e receba um broche equipável.']
   ]},
   {v:'V28.1',name:'RPG em tela cheia',notes:[
    ['🎮 Mundo imersivo','Mapa ocupando a tela inteira, com câmera adaptável.'],
    ['📱 Controles','HUD e comandos móveis sobre o mapa, com botão visível para sair.']
   ]},
   {v:'V28',name:'Crônicas do Bosque — Reforma Visual',notes:[
    ['🎨 Identidade visual','Novo visual para home, RPG, Defesa, casa e personalização.'],
    ['🖥️ Responsividade','Layouts revisados em computador, tablet e celular.']
   ]}
  ];
  history.replaceChildren();
  for(const entry of entries){
   const details=document.createElement('details');details.className='sm-update-version';details.open=entry.v==='V29';
   const summary=document.createElement('summary');
   const heading=document.createElement('span'),b=document.createElement('b');
   b.textContent=entry.v;heading.append(b,document.createTextNode(' '+entry.name));
   const count=document.createElement('span');count.className='sm-update-count';count.textContent=entry.notes.length+' novidades';
   summary.append(heading,count);
   const ul=document.createElement('ul');
   for(const [name,description] of entry.notes){
    const li=document.createElement('li'),strong=document.createElement('strong');
    strong.textContent=name+' — ';li.append(strong,document.createTextNode(description));ul.append(li);
   }
   details.append(summary,ul);history.append(details);
  }
 }
 function openNotes(){layer.classList.add('sm-show');document.body.style.overflow='hidden';close.focus({preventScroll:true})}
 function markSeen(){try{store.setItem(flag,current)}catch(_){}}
 read.addEventListener('click',openNotes);
 const teaser=document.getElementById('sm30WatchTeaser');
 teaser?.addEventListener('click',()=>window.SamCutscenes?.play('awakening'));

 reopen.classList.add('sm-ready');reopen.setAttribute('aria-label','Ver novidades da versão V29');
 // The legacy modal closes through its own handlers; record the new release acknowledgement too.
 close.addEventListener('click',markSeen);
 later.addEventListener('click',markSeen);
 layer.addEventListener('click',e=>{if(e.target===layer)markSeen()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&layer.classList.contains('sm-show'))markSeen()});
 // Do not display a version notice over a game already in progress.
 if(seen!==current){
  const active=document.querySelector('#rpgDlg.sm-immersive,#gameDlg.sm-immersive');
  if(!active)requestAnimationFrame(()=>requestAnimationFrame(openNotes));
 }
})();
