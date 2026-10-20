/* V33.3 — Combate e Defesa. Notas na home, sem interrupção no jogo. */
(()=>{'use strict';
 const home=document.getElementById('sm30News'),history=document.querySelector('#smUpdatePanel .sm-update-history');
 if(!home||!history)return;
 home.classList.add('sm33-featured');
 const change=(selector,value)=>{const el=document.querySelector(selector);if(el)el.textContent=value};
 change('#sm30News .sm30-news-kicker','🌿 CRÔNICA III · JORNADA INTEGRADA');
 change('#sm30NewsVersion','V34 · O Novo Pomar');
 change('#sm30NewsHeading','Seu jogo, sem excessos.');
 change('#sm30News h2 + p','A página inteira ganhou um novo visual, com uma navegação principal, menos cartões repetidos e mais espaço para o RPG no telefone. Casa, Defesa e campanhas continuam disponíveis.');
 const chips=home.querySelector('.sm31-preview-features');
 if(chips){chips.replaceChildren();for(const txt of ['Página inicial renovada','Atalhos sem repetição','RPG em primeiro plano','Interface mais limpa no telefone']){const chip=document.createElement('span');chip.textContent=txt;chips.append(chip)}}
 change('#sm30NewsPlay','🎮 Começar o Vale pelo RPG');
 change('#sm30News .sm30-news-footnote','Prévia V33 de homologação: encontre o portal do Vale a leste da Vila. Todas as campanhas anteriores continuam disponíveis. Recompensas desta crônica são locais, sem pontos no ranking oficial.');
 change('#smUpdatePanel .sm-tag','🌿 REWORK TOTAL · V34');
 change('#smUpdateTitle','V34 — O Novo Pomar');
 change('#smUpdatePanel > p','A aventura volta a ser o centro do projeto: mapas, NPCs, escolhas e modos conectados numa única jornada.');
 const notes=[
  ['V34 · Tela inicial unificada','Um botão para continuar, dois modos de apoio e um menu secundário. Portais, informações e cartões duplicados deixam de ocupar a tela principal.'],
  ['V34 · Visual renovado','Novo acabamento para navegação, hub de jogo, RPG, Defesa, Refúgio, Perfil e Diário; tamanhos de toque preservados no celular.'],
  ['V34 · RPG em destaque','O mapa aparece antes das informações secundárias; contratos, rotas e atmosfera ficam num painel recolhível após o mundo jogável.'],
  ['V34 · Conteúdo preservado','Salvamentos, crônicas, conquistas, chat, códigos, Atlas e todos os destinos continuam acessíveis pelos menus.'],
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
 b.textContent='V34 · REWORK';span.append(b,document.createTextNode(' O Renascimento do Pomar'));
 const count=document.createElement('span');count.className='sm-update-count';count.textContent=notes.length+' melhorias';summary.append(span,count);
 const ul=document.createElement('ul');for(const [title,text]of notes){const li=document.createElement('li'),bold=document.createElement('strong');bold.textContent=title+' — ';li.append(bold,document.createTextNode(text));ul.append(li)}
 details.append(summary,ul);history.prepend(details);
})();
