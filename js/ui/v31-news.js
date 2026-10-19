
/* V31: branch de testes; não anuncia como publicada. */
(()=>{'use strict';
 const home=document.getElementById('sm30News'),layer=document.getElementById('smUpdateLayer'),history=document.querySelector('#smUpdatePanel .sm-update-history');
 if(!home||!history)return;
 home.classList.add('sm31-featured');
 const version=document.getElementById('sm30NewsVersion');
 if(version)version.textContent='V31 · Prévia da grande reformulação';
 const kicker=home.querySelector('.sm30-news-kicker');if(kicker)kicker.textContent='🌱 UM NOVO MUNDO SE ABRE';
 const heading=document.getElementById('sm30NewsHeading');if(heading)heading.textContent='O Jardim das Entrelinhas';
 const p=home.querySelector('h2 + p');if(p)p.textContent='Mude de tamanho, atravesse passagens secretas e investigue uma nova região do Pomar — com puzzles ambientais e um chefe de duas fases.';
 const links=home.querySelector('.sm30-news-links');
 if(links&&!home.querySelector('.sm31-preview-features')){
  const list=document.createElement('div');list.className='sm31-preview-features';
  ['3 mapas inéditos','Mecânica de escala real','Enigmas e segredos','Combate em duas fases'].forEach(t=>{const e=document.createElement('span');e.textContent=t;list.append(e)});
  links.before(list);
 }
 const play=document.getElementById('sm30NewsPlay');if(play)play.textContent='🎮 Continuar minha aventura';
 const teaser=document.getElementById('sm30WatchTeaser');if(teaser)teaser.textContent='🎬 Rever prólogo da V30';
 const foot=home.querySelector('.sm30-news-footnote');
 if(foot)foot.textContent='Prévia V31 disponível nesta branch de testes. Para entrar no Jardim, conclua o Capítulo I no Bosque dos Ecos. Salvamentos anteriores são preservados.';
 const tag=document.querySelector('#smUpdatePanel .sm-tag');if(tag)tag.textContent='🌱 NOTAS DA BRANCH DE TESTES · V31';
 const title=document.getElementById('smUpdateTitle');if(title)title.textContent='V31 — O Jardim das Entrelinhas';
 const description=document.querySelector('#smUpdatePanel > p');if(description)description.textContent='Uma campanha inédita baseada em escala, exploração e escolhas de habilidade; ainda em homologação.';
 const entries=[
  ['Escala que muda o jogo','A Lente de Broto altera seu tamanho, a colisão e os caminhos que você pode acessar.'],
  ['Três mapas autorais','Jardim da Bruma, Galerias dos Pequenos e Relicário do Musgo.'],
  ['Puzzles com ações reais','Colete ingredientes, ative uma placa pesada, passe por uma fresta e alterne o tamanho para resolver inscrições.'],
  ['Chefe com duas fases','O Guardião de Musgo alterna couraça e flor, com fraquezas distintas e golpe anunciado.'],
  ['NPC e tarefa opcional','Ajude Ema e recupere seu besouro perdido por poções extras.'],
  ['Progressão persistente','Recompensas únicas, capítulos salvos por jogador e botões de controle para celular.'],
  ['Arte e interface','Sprite original do chefe, elementos pixelados animados e painel de missão atualizado.']
 ];
 const details=document.createElement('details');details.open=true;details.className='sm-update-version';
 const summary=document.createElement('summary');const first=document.createElement('span'),strong=document.createElement('b');
 strong.textContent='V31 · PRÉVIA';first.append(strong,document.createTextNode(' O Jardim das Entrelinhas'));
 const count=document.createElement('span');count.className='sm-update-count';count.textContent=entries.length+' melhorias';
 summary.append(first,count);
 const ul=document.createElement('ul');for(const [head,body]of entries){const li=document.createElement('li'),b=document.createElement('strong');b.textContent=head+' — ';li.append(b,document.createTextNode(body));ul.append(li)}
 details.append(summary,ul);history.prepend(details);
 const key='sm_last_seen_v31_preview',current='31.0.0-preview';
 const show=()=>{if(!layer)return;layer.classList.add('sm-show');document.body.style.overflow='hidden';document.getElementById('smUpdatesClose')?.focus({preventScroll:true})};
 const acknowledge=()=>{try{localStorage.setItem(key,current)}catch(_){}};
 for(const id of ['smUpdatesClose','smUpdatesLater'])document.getElementById(id)?.addEventListener('click',acknowledge);
 layer?.addEventListener('click',e=>{if(e.target===layer)acknowledge()});
 let seen='';try{seen=localStorage.getItem(key)||''}catch(_){}
 // Novidades ficam sempre visíveis no banner inicial; não interrompem jogadores com modal automático.
 if(seen!==current)home.dataset.sm31Unread='true';
})();
