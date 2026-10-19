/* V33 — O Renascimento do Pomar. Notas na home, sem interrupção no jogo. */
(()=>{'use strict';
 const home=document.getElementById('sm30News'),history=document.querySelector('#smUpdatePanel .sm-update-history');
 if(!home||!history)return;
 home.classList.add('sm33-featured');
 const change=(selector,value)=>{const el=document.querySelector(selector);if(el)el.textContent=value};
 change('#sm30News .sm30-news-kicker','🌿 CRÔNICA III · JORNADA INTEGRADA');
 change('#sm30NewsVersion','V33 · Prévia do Renascimento');
 change('#sm30NewsHeading','O Vale da Primeira Aurora desperta');
 change('#sm30News h2 + p','Três novos mapas conectados ao RPG, Iara e Nilo com histórias próprias, um enigma das três pedras, uma biblioteca de memórias e uma sentinela em duas fases.');
 const chips=home.querySelector('.sm31-preview-features');
 if(chips){chips.replaceChildren();for(const txt of ['3 regiões exploráveis','Missão e escolhas','Atlas com viagem segura','Casa + Defesa integradas']){const chip=document.createElement('span');chip.textContent=txt;chips.append(chip)}}
 change('#sm30NewsPlay','🎮 Começar o Vale pelo RPG');
 change('#sm30News .sm30-news-footnote','Prévia V33 de homologação: encontre o portal do Vale a leste da Vila. Todas as campanhas anteriores continuam disponíveis. Recompensas desta crônica são locais, sem pontos no ranking oficial.');
 change('#smUpdatePanel .sm-tag','🌿 NOTAS DE DESENVOLVIMENTO · V33');
 change('#smUpdateTitle','V33 — O Renascimento do Pomar');
 change('#smUpdatePanel > p','A aventura volta a ser o centro do projeto: mapas, NPCs, escolhas e modos conectados numa única jornada.');
 const notes=[
  ['Mundo conectado','Vale da Primeira Aurora, Biblioteca Submersa e Mirante da Primeira Luz; portais e colisões do RPG antigo preservados.'],
  ['Enigma e exploração','Três ecos coletáveis e pedras Vento → Chuva → Raiz, com erro e reinício reais.'],
  ['Missões e narrativa','Iara guia a crônica, Nilo precisa de ajuda, duas memórias contam a origem da seca.'],
  ['Sentinela em duas fases','Combate com fraquezas elementais, recompensa e persistência no save do jogador.'],
  ['Escolha final permanente','Proteja o Rio ou a Floresta e conquiste um medalhão equipável com efeito RPG.'],
  ['Atlas e códice','Descobertas reais, mapa de regiões, diário de missão, encontros e viagem rápida apenas para áreas já visitadas.'],
  ['Modos integrados','Uma vitória em Defesa e uma Casa com quatro móveis podem conceder poções RPG, uma única vez por jogador.'],
  ['Regressão e distribuição','Scripts, HTML e mapas testados antes do pacote Cloudflare Pages de homologação.']
 ];
 const details=document.createElement('details');details.className='sm-update-version';details.open=true;
 const summary=document.createElement('summary'),span=document.createElement('span'),b=document.createElement('b');
 b.textContent='V33 · PRÉVIA';span.append(b,document.createTextNode(' O Renascimento do Pomar'));
 const count=document.createElement('span');count.className='sm-update-count';count.textContent=notes.length+' melhorias';summary.append(span,count);
 const ul=document.createElement('ul');for(const [title,text]of notes){const li=document.createElement('li'),bold=document.createElement('strong');bold.textContent=title+' — ';li.append(bold,document.createTextNode(text));ul.append(li)}
 details.append(summary,ul);history.prepend(details);
})();
