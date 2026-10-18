/* Sam Manguinha V29 — dados narrativos e encontros (sem efeitos de salvamento).
   As regras e efeitos são executados pelo mundo_pomar.js existente. */
(()=>{
'use strict';
const story=Object.freeze({
  intro:[
    ['Íris, Cartógrafa','Ouviu? A Vila perdeu sua última badalada. Antes, quando alguém se perdia, o sino respondia com uma nota que sempre mostrava o caminho de casa.'],
    ['Íris, Cartógrafa','Ele não sumiu sozinho. Encontrei cinza brilhante no relógio da Praça e uma trilha que aponta para a mata. Há algo apagando os sons do Pomar.'],
    ['Íris, Cartógrafa','Não quero que enfrente sombras sem entender o que está acontecendo. Investigue o relógio da Vila, a casca gravada na Trilha e a biruta da Campina. Cada lugar guarda uma parte da partitura.']
  ],
  mara:[
    ['Mara, Jardineira','A árvore não canta mais. Houve uma noite em que o vento soprou e ninguém se lembrou da melodia.'],
    ['Mara, Jardineira','O som viaja por três lugares: nasce com o vento, atravessa as raízes e alcança a luz. Sem nenhum deles, o sino seria apenas metal.'],
    ['Mara, Jardineira','Há um carrilhão no lado leste da Trilha. Se decifrar o que a mata lembra, ele pode revelar quem levou a última badalada.']
  ],
  caio:[
    ['Caio, Aprendiz','Sou o aprendiz de Íris. Vi pegadas saindo da Floresta e vindo para a Campina. Elas param no meio da relva, como se alguém tivesse esperado uma resposta.'],
    ['Caio, Aprendiz','A Sentinela do Vento não é nossa inimiga. Ela guarda o sino porque teme que a Vila volte a esquecer por que ele foi construído.'],
    ['Caio, Aprendiz','Ela anuncia o golpe mais forte juntando nuvens ao redor das patas. Observe seu ritmo: defender na hora certa é tão importante quanto atacar.']
  ],
  afterWisp:[
    ['Mara, Jardineira','A Mariposa do Silêncio caiu, mas não desapareceu em rancor. Suas asas liberaram os sons que ela guardava.'],
    ['Mara, Jardineira','O carrilhão indica uma direção: a Campina dos Ventos. Caio conhece as pegadas perto do campo. Procure-o antes de enfrentar a sentinela.']
  ],
  final:[
    ['Eco da Primeira Mangueira','Você seguiu sons que não podia ver e reuniu três partes de uma história que estava partida.'],
    ['Eco da Primeira Mangueira','O sino foi feito na primeira colheita para chamar todos à mesa. Um dia, alguém o usou para chamar apenas os mais fortes. A floresta o escondeu.'],
    ['Eco da Primeira Mangueira','A Sentinela queria garantir que a badalada nunca mais separasse as pessoas. Agora, cabe a você decidir onde seu som deve morar.']
  ],
  share:[
    ['Íris, Cartógrafa','O sino voltou à Praça. Quando toca, todos ouvem, até quem não sabe o caminho. Seu mapa agora tem uma trilha marcada com o som da partilha.'],
    ['Narrador','As famílias abrem suas portas. O sino chama pelo nome de todos, e a Vila encontra uma forma nova de celebrar a colheita.']
  ],
  shelter:[
    ['Mara, Jardineira','O sino ficou entre as raízes. A Floresta agora guia os viajantes que respeitam seu silêncio. Íris desenhará sua rota nos mapas.'],
    ['Narrador','Uma melodia suave acompanha os caminhos antigos. A Vila não recuperou um objeto, mas aprendeu a ouvir o Bosque.']
  ]
});
const clues=Object.freeze({
 v29Relogio:{name:'Relógio Parado',who:'Relógio da Praça',text:'Três ponteiros ainda estão gravados no mostrador: o primeiro aponta para uma espiral de VENTO. Ao lado, a frase: “Todo chamado começa com um SOPRO.”',key:'SOPRO'},
 v29Casca:{name:'Casca da Melodia',who:'Inscrição na Árvore',text:'Sob a casca, os antigos escreveram: “O som não se perde no chão: a RAIZ é a segunda a guardar aquilo que o vento conta.”',key:'RAIZ'},
 v29Biruta:{name:'Biruta dos Navegantes',who:'Tecido na Campina',text:'A biruta aponta para o nascente. Uma fita diz: “Depois que o vento fala e a raiz escuta, a LUZ é a última a responder.”',key:'LUZ'}
});
const discoveries=Object.freeze({
 v29Livro:{title:'Livro dos Lugares à Mesa',chapter:'Vila',text:'Nas páginas antigas, os habitantes anotavam as colheitas e os nomes de quem precisava receber uma cesta primeiro.'},
 v29Pegadas:{title:'Pegadas de Vagalume',chapter:'Floresta',text:'Lumi desenhou pequenas constelações no barro para que as crianças perdidas reconhecessem o caminho até a Vila.'},
 v29Marca:{title:'Marca de Eldra',chapter:'Santuário',text:'Uma inscrição mostra Eldra plantando a primeira mangueira ao lado de pessoas diferentes, dividindo o mesmo fruto.'},
 v29Cometa:{title:'Cometa de Madeira',chapter:'Campina',text:'Um brinquedo feito por Caio. Atrás há uma promessa: “Nunca deixarei a estrada ser mais importante que quem a percorre.”'},
 v29Frasco:{title:'Frasco de Maíra',chapter:'Estufa',text:'Uma ampola guarda a cor de um amanhecer. A vidreira deixou escrito: “O que protege vale mais do que o que brilha.”'},
 v29Fio:{title:'Linha do Primeiro Juramento',chapter:'Bosque',text:'As crianças do Bosque usavam fios prateados para lembrar as promessas que não sabiam colocar em palavras.'},
 v29Mosaico:{title:'Mosaico de Dário',chapter:'Minas',text:'O mosaico representa quatro mineiros carregando juntos uma pedra grande demais para qualquer um deles.'},
 v29Barco:{title:'Barquinho de Papel',chapter:'Pântano',text:'Um barquinho leva a mensagem: “Quando uma história dói, devolva a ela o nome de quem sobreviveu.”'},
 v29Carta:{title:'Carta de Selene',chapter:'Observatório',text:'A carta termina assim: “Nem a lua permanece cheia. Permita que as coisas mudem e ainda sejam amadas.”'}
});
const actors=Object.freeze({
 vila:[
  {id:'v29Iris',x:8.1,y:8.4,type:'npc',v29:'npc',label:'Íris, Cartógrafa'},
  {id:'v29Relogio',x:10.3,y:4.8,type:'altar',v29:'clue',label:'Relógio Parado'},
  {id:'v29Livro',x:15.1,y:10.2,type:'seed',v29:'find',label:'Livro dos Lugares à Mesa'}
 ],
 floresta:[
  {id:'v29Mara',x:9.2,y:6.7,type:'npc',v29:'npc',label:'Mara, Jardineira'},
  {id:'v29Casca',x:8.2,y:8.7,type:'altar',v29:'clue',label:'Casca da Melodia'},
  {id:'v29Carrilhao',x:17,y:8.4,type:'altar',v29:'puzzle',label:'Carrilhão das Três Vozes'},
  {id:'v29Mariposa',x:10.8,y:11.6,type:'npc',v29:'enemy',label:'Mariposa do Silêncio'},
  {id:'v29Copa',x:18,y:3.2,type:'altar',v29:'ending',label:'Copa da Primeira Mangueira'},
  {id:'v29Pegadas',x:14.4,y:5.2,type:'seed',v29:'find',label:'Pegadas de Vagalume'}
 ],
 planicie:[
  {id:'v29Caio',x:7.4,y:6.4,type:'npc',v29:'npc',label:'Caio, Aprendiz'},
  {id:'v29Biruta',x:10.6,y:4.4,type:'altar',v29:'clue',label:'Biruta dos Navegantes'},
  {id:'v29Sentinela',x:16.5,y:7.6,type:'npc',v29:'enemy',label:'Sentinela da Badalada'},
  {id:'v29Cometa',x:9.2,y:10.4,type:'seed',v29:'find',label:'Cometa de Madeira'}
 ],
 ruinas:[{id:'v29Marca',x:8.8,y:9.1,type:'seed',v29:'find',label:'Marca de Eldra'}],
 estufa:[{id:'v29Frasco',x:10.7,y:10.2,type:'seed',v29:'find',label:'Frasco de Maíra'}],
 bosque:[{id:'v29Fio',x:13.5,y:9.1,type:'seed',v29:'find',label:'Linha do Primeiro Juramento'}],
 mina:[{id:'v29Mosaico',x:7.8,y:8.4,type:'seed',v29:'find',label:'Mosaico de Dário'}],
 pantano:[{id:'v29Barco',x:9.4,y:9.8,type:'seed',v29:'find',label:'Barquinho de Papel'}],
 observatorio:[{id:'v29Carta',x:11.5,y:10.4,type:'seed',v29:'find',label:'Carta de Selene'}]
});
const enemies=Object.freeze({
 v29_silencio:{name:'Mariposa do Silêncio',element:'shadow',hp:60,atk:9,def:2,xp:90,gold:29,weak:'light',sprite:'vulto_eco_v24',intro:'O bater silencioso das asas tenta interromper cada lembrança. Observe seu ritmo e procure a luz entre as sombras.'},
 v29_sentinela:{name:'Sentinela da Badalada',element:'earth',hp:100,atk:12,def:3,xp:145,gold:48,weak:'nature',sprite:'lobo_vento_v24',intro:'A guardiã reúne nuvens ao redor das patas. Ela não luta por maldade: teme que a Vila volte a usar o sino para excluir alguém.'}
});
const chime=Object.freeze({
 title:'Carrilhão das Três Vozes',
 symbols:Object.freeze(['SOPRO','RAIZ','LUZ']),
 clue:'A partitura não está neste lugar. O relógio, a casca e a biruta contam como o som atravessa o Pomar.'
});
window.SamV29Data=Object.freeze({story,clues,discoveries,actors,enemies,chime});
})();
