/* V32 — Notas verdadeiras da versão, sempre acessíveis na Home. */
(()=>{'use strict';
 const home=document.getElementById('sm30News'),history=document.querySelector('#smUpdatePanel .sm-update-history');
 if(!home||!history)return;
 home.classList.add('sm32-featured');
 const kicker=home.querySelector('.sm30-news-kicker');
 if(kicker)kicker.textContent='🌿 AVENTURA EM PRIMEIRO LUGAR';
 const version=document.getElementById('sm30NewsVersion');
 if(version)version.textContent='V32 · Prévia da reestruturação';
 const heading=document.getElementById('sm30NewsHeading');
 if(heading)heading.textContent='O Pomar ficou mais fácil de explorar';
 const paragraph=home.querySelector('h2 + p');
 if(paragraph)paragraph.textContent='Menos menus duplicados, uma central de aventura mais direta, destinos organizados e uma biblioteca que deixa você escolher o que quer descobrir.';
 const chips=home.querySelector('.sm31-preview-features');
 if(chips){chips.replaceChildren();for(const text of ['Menu simplificado','Biblioteca de destinos','Continuar de onde parou','Expedição clássica preservada']){const badge=document.createElement('span');badge.textContent=text;chips.append(badge)}}
 const btn=document.getElementById('sm30NewsPlay');
 if(btn)btn.textContent='🎮 Entrar no mundo RPG';
 const teaser=document.getElementById('sm30WatchTeaser');
 if(teaser)teaser.textContent='🎬 Relembrar a história';
 const foot=home.querySelector('.sm30-news-footnote');
 if(foot)foot.textContent='Prévia V32 em branch de homologação. O Jardim das Entrelinhas (V31), a Defesa, a Casa e seus salvamentos anteriores continuam disponíveis.';
 const tag=document.querySelector('#smUpdatePanel .sm-tag');
 if(tag)tag.textContent='🌿 NOTAS DE REESTRUTURAÇÃO · V32';
 const title=document.getElementById('smUpdateTitle');
 if(title)title.textContent='V32 — Reestruturação Geral';
 const description=document.querySelector('#smUpdatePanel > p');
 if(description)description.textContent='Uma interface mais organizada que preserva os modos de jogo e os avanços anteriores.';
 const details=document.createElement('details');details.className='sm-update-version';details.open=true;
 const summary=document.createElement('summary'),name=document.createElement('span'),label=document.createElement('b');label.textContent='V32 · PRÉVIA';name.append(label,document.createTextNode(' Reestruturação Geral'));
 const count=document.createElement('span');count.className='sm-update-count';count.textContent='6 melhorias';summary.append(name,count);
 const list=document.createElement('ul');
 for(const [head,text]of [
  ['Navegação enxuta','Cinco destinos principais e menu Explorar com busca por áreas.'],
  ['Página inicial reconstruída','Central de aventura e quatro ações destacadas, sem a introdução redundante de edições antigas.'],
  ['Biblioteca expansível','Diário, mapa, galeria, segredos, conquistas e comunidade continuam acessíveis sem poluir a home.'],
  ['Expedição Astral clássica','Cinco capítulos preservados e realocados para evitar atalhos repetidos.'],
  ['Continuar jogando','A página lembra o último modo visitado entre RPG, Defesa e Casa neste navegador.'],
  ['Compatibilidade testada','Rotas e telas avaliadas em desktop e mobile; campanha V31 e pacote Cloudflare Pages em regressão.']
 ]){const li=document.createElement('li'),b=document.createElement('strong');b.textContent=head+' — ';li.append(b,document.createTextNode(text));list.append(li)}
 details.append(summary,list);history.prepend(details);
 // No automatic popup: players can always reopen complete release notes.
})();
