/* V33.3 — Combate e Defesa. Notas na home, sem interrupção no jogo. */
(()=>{'use strict';
 const home=document.getElementById('sm30News'),history=document.querySelector('#smUpdatePanel .sm-update-history');
 if(!home||!history)return;
 home.classList.add('sm33-featured');
 const change=(selector,value)=>{const el=document.querySelector(selector);if(el)el.textContent=value};
 change('#sm30News .sm30-news-kicker','🌿 CRÔNICA III · JORNADA INTEGRADA');
 change('#sm30NewsVersion','V33.5 · O Pomar Vivo');
 change('#sm30NewsHeading','O Pomar cresce com você: horta e estratégia');
 change('#sm30News h2 + p','Cultive seis canteiros no Refúgio, prepare poções para o RPG, desbloqueie acessórios e conclua contratos diários. A Defesa tática e os três mapas da campanha continuam disponíveis.');
 const chips=home.querySelector('.sm31-preview-features');
 if(chips){chips.replaceChildren();for(const txt of ['Horta cultivável','Receitas na mochila RPG','Acessórios na exploração','Painel do Pomar reformulado']){const chip=document.createElement('span');chip.textContent=txt;chips.append(chip)}}
 change('#sm30NewsPlay','🎮 Começar o Vale pelo RPG');
 change('#sm30News .sm30-news-footnote','Prévia V33 de homologação: encontre o portal do Vale a leste da Vila. Todas as campanhas anteriores continuam disponíveis. Recompensas desta crônica são locais, sem pontos no ranking oficial.');
 change('#smUpdatePanel .sm-tag','🌿 VIDA NO POMAR · V33.5');
 change('#smUpdateTitle','V33.5 — O Pomar Vivo');
 change('#smUpdatePanel > p','A aventura volta a ser o centro do projeto: mapas, NPCs, escolhas e modos conectados numa única jornada.');
 const notes=[
  ['V33.4 · Horta Viva','Seis canteiros, três cultivos, crescimento persistente no relógio real, rega que acelera 30 segundos e colheita com ingredientes.'],
  ['V33.4 · Receitas úteis','Use ingredientes cultivados para fabricar poções RPG, restaurar magia ou forjar um Amuleto dos Jardineiros equipável.'],
  ['V33.4 · Aparências no mundo','Coroa de folhas, cachecol e aura especiais desbloqueados por colheitas e artesanato, desenhados no personagem durante a aventura.'],
  ['V33.5 · Contrato diário','Colher e preparar uma receita no mesmo dia concede 20 moedas RPG locais, uma vez por dia; sem interferir no ranking oficial.'],
  ['V33.5 · Interface reformulada','Painel inicial com região e horta reais, atalhos úteis dentro do RPG, área de comunidade recolhível e telas internas mais consistentes.'],
  ['Três planos de Defesa','Vigília prepara barreiras a cada onda; Assalto aumenta o dano a cada três tiros de torre; Contenção imobiliza alvos. Apenas Difícil/Infinito.'],
  ['Fortificações localizadas','Cada rota pode receber até duas barreiras. Custam energia, interceptam pragas e podem ser sabotadas.'],
  ['Sapador da Ferrugem animado','Inimigo original que prioriza rotas fortificadas e ameaça duas camadas de proteção.'],
  ['Rei das Pragas — Fase II','No modo Difícil, o chefe muda de fase ao perder cerca de metade da vida e convoca sapadores.'],
  ['RPG: Riposta por 2 MP','Defesa com contra-ataque: reduz o golpe recebido e revida somente quando o inimigo acerta.'],
  ['Modo Normal preservado','Novas estratégias não mudam o placar do servidor, regras do ranking oficial nem saves anteriores.'],
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
 b.textContent='V33.5 · PRÉVIA';span.append(b,document.createTextNode(' O Renascimento do Pomar'));
 const count=document.createElement('span');count.className='sm-update-count';count.textContent=notes.length+' melhorias';summary.append(span,count);
 const ul=document.createElement('ul');for(const [title,text]of notes){const li=document.createElement('li'),bold=document.createElement('strong');bold.textContent=title+' — ';li.append(bold,document.createTextNode(text));ul.append(li)}
 details.append(summary,ul);history.prepend(details);
})();
