
const $=id=>document.getElementById(id);
const norm=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const mem={};
const LS={get(k){try{return localStorage.getItem(k)}catch(e){return mem[k]!==undefined?mem[k]:null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){mem[k]=v}}};
const FACTS=[
"A mangueira (Mangifera indica) é originária do sul da Ásia, na região entre Índia, Bangladesh e Mianmar.",
"Ela é cultivada há mais de 4 mil anos.",
"A manga é a fruta nacional da Índia, do Paquistão e das Filipinas.",
"Em Bangladesh, a mangueira é a árvore nacional.",
"Na Índia, a manga é chamada de “rei das frutas”.",
"O nome vem do tâmil “mankay”, que chegou ao português como “manga”.",
"Os portugueses ajudaram a espalhar a manga pelo mundo e a trouxeram ao Brasil no século XVI.",
"A mangueira é da mesma família do caju e do pistache, as Anacardiáceas.",
"Também é parente da hera-venenosa: a casca da manga tem urushiol, que pode irritar a pele de pessoas sensíveis.",
"Uma mangueira pode passar de 30 metros de altura.",
"Existem centenas de variedades de manga, estima-se mais de 500.",
"A Índia é, de longe, a maior produtora de manga do mundo.",
"No Brasil, o Vale do São Francisco (Petrolina e Juazeiro) é o principal polo de exportação.",
"Tommy Atkins, Palmer, Keitt, Kent, Haden, Espada, Rosa e Ubá são variedades comuns no Brasil.",
"A Tommy Atkins, a mais exportada pelo Brasil, foi criada na Flórida, nos Estados Unidos.",
"A manga é rica em vitamina C e em betacaroteno, que o corpo transforma em vitamina A.",
"Uma manga tem cerca de 60 kcal a cada 100 g.",
"Ela também tem fibras e potássio.",
"A manga contém mangiferina, um antioxidante encontrado na polpa, nas folhas e na casca.",
"A manga continua amadurecendo depois de colhida, por causa do gás etileno.",
"Colocar manga verde num saco de papel com uma banana acelera o amadurecimento.",
"Manga madura pode ir para a geladeira; a verde amadurece melhor fora dela.",
"Os frutos levam de 3 a 5 meses para ficar prontos depois da flor.",
"A mangueira produz milhares de flores, mas só uma pequena parte vira fruta.",
"As flores são polinizadas principalmente por moscas e outros insetos.",
"As folhas novas da mangueira nascem avermelhadas e ficam verdes com o tempo.",
"Uma manga pode pesar de poucas centenas de gramas a mais de 1 kg, dependendo da variedade.",
"Do caroço se extrai a manteiga de manga, usada em cosméticos.",
"Na Índia, folhas de mangueira enfeitam portas e cerimônias em festivais.",
"A manga verde é usada em chutneys, picles e bebidas como o aam panna, na Índia.",
"O lassi de manga, bebida de iogurte com manga, é famoso na culinária indiana.",
"No Brasil, a safra principal vai de setembro a janeiro.",
"Uma mangueira bem cuidada pode viver por mais de 100 anos.",
"O emoji da manga 🥭 foi aprovado no Unicode em 2018.",
"Belém, no Pará, é conhecida como “Cidade das Mangueiras” pelas árvores que enfeitam suas ruas.",
"A manga é uma drupa, o mesmo tipo de fruto do pêssego e da cereja: tem uma única semente dentro de um caroço.",
"Em algumas variedades, um único caroço pode gerar várias mudas, fenômeno chamado poliembrionia.",
"A semente de uma manga nem sempre gera uma planta com frutos iguais aos da planta-mãe, por isso os pomares usam enxertia.",
"Uma muda enxertada costuma dar frutos bem antes de uma planta nascida de semente.",
"Alphonso, Kesar, Dasheri e Langra são variedades famosas na Índia.",
"No Paquistão, Chaunsa e Sindhri estão entre as variedades mais conhecidas.",
"A Alphonso é considerada uma das variedades mais apreciadas do mundo.",
"As mangas Palmer e Keitt costumam ter pouca fibra; Espada e Ubá costumam ter mais fiapos.",
"A cor avermelhada da casca nem sempre indica que a manga está madura. Vale apertar de leve e cheirar perto do cabo.",
"O cheiro doce perto do cabo é um bom sinal de que a manga está pronta para comer.",
"A mangueira gosta de clima tropical e sofre com geadas.",
"Um período seco ou com frio leve ajuda a mangueira a florescer.",
"O látex que escorre perto do cabo quando a manga é colhida pode manchar a casca e irritar a pele.",
"Em português, “manga” também é a parte da roupa onde entra o braço, mas essa palavra vem do latim e a da fruta vem do tâmil.",
"Mais de 80% da manga é água.",
"Manga verde com sal é um petisco popular no Brasil.",
"Na Tailândia, manga com arroz doce e leite de coco é uma sobremesa muito querida.",
"Manga seca é um produto famoso das Filipinas.",
"Em Hong Kong, o pudim de manga virou um clássico de sobremesa.",
"O aamras, um purê de manga, é servido em refeições festivas na Índia.",
"Bahia e Pernambuco estão entre os maiores produtores de manga do Brasil.",
"A manga é um dos frutos tropicais mais consumidos do mundo.",
"A mangueira tem copa grande e arredondada, e dá ótima sombra.",
"Quando maduras, as mangas podem ser verdes, amarelas, laranjas ou avermelhadas, dependendo da variedade.",
"Uma mangueira adulta pode produzir centenas de frutos em uma única safra.",
"As flores da mangueira são minúsculas e nascem em cachos enormes, chamados panículas.",
"Em várias cidades brasileiras ainda existem mangueiras muito antigas em praças e ruas."
];
const SECRETS=[
{id:"miseri",e:"🍓",n:"Misericórdia",h:"Uma oração para sobreviver."},
{id:"samuel",e:"🔊",n:"A picada do Samuel",h:"Alguém deixou um recado em áudio."},
{id:"lulala",e:"⭐",n:"Chuva vermelha",h:"Uma palavra que brilha."},
{id:"podridao",e:"🪰",n:"Podridão",h:"O tempo passa para as frutas."},
{id:"luigi",e:"🪙",n:"Moeda do Luigi",h:"O irmão do Mario."},
{id:"bolso",e:"⛔",n:"Castigo de 13 segundos",h:"Um nome que dá castigo."},
{id:"suco",e:"🧃",n:"Suco de manga",h:"Uma bebida bem gelada."},
{id:"noite",e:"🌙",n:"Modo noturno",h:"Quando o sol vai embora."},
{id:"ventania",e:"🍃",n:"Ventania",h:"Sopra forte nas folhas."},
{id:"alphonso",e:"👑",n:"Manga de ouro",h:"Uma variedade indiana famosa."},
{id:"konami",e:"🎮",n:"Código clássico",h:"↑ ↑ ↓ ↓ ← → ← → ..."},
{id:"manga",e:"🕺",n:"Manguito dançarino",h:"Escreva o nome da fruta fora de uma caixa de texto."},
{id:"splat",e:"💥",n:"Suco no chão",h:"Seja insistente com o mascote."},
{id:"seed",e:"🌱",n:"O caroço",h:"Lá no final da página."},
{id:"days",e:"📅",n:"Contagem regressiva",h:"Clique no dia várias vezes."},
{id:"leaves",e:"🍂",n:"Pegador de folhas",h:"As folhas que caem podem ser pegas."},
{id:"pop",e:"★",n:"Pop, jamais rock",h:"Diga o nome do pomar."},
{id:"admin",e:"★",n:"Verificação ultrassecreta",h:"Quem manda aqui?"},
{id:"hack",e:"★",n:"Hacker de geladeira",h:"Um terminal duvidoso."},
{id:"socorro",e:"★",n:"Alerta no pomar",h:"Peça ajuda."},
{id:"deus",e:"★",n:"Pergunta filosófica",h:"Alguém lá em cima."},
{id:"amor",e:"★",n:"Bilhete constrangedor",h:"Sentimentos."},
{id:"harvest",e:"🧺",n:"Colheita farta",h:"Colha 50 mangas."}
];
let posts=[],newest=true,limit=24,list=[];
let me=(LS.get("sg_handle")||"").toLowerCase();
let mine=parseInt(LS.get("sg_count"),10)||0;
let found={};try{found=JSON.parse(LS.get("sg_found")||"{}")||{}}catch(e){found={}}
const SB="https://rygeemrxyjknhxxlewdb.supabase.co",KEY="sb_publishable_RNaqpl3_c_7XYVNNzb3wpA_8sislKLR";
let ADMPW="",unlocked=false,locked=false,gateOn=false,rank=[];
async function rest(path){const r=await fetch(SB+"/rest/v1/"+path,{headers:{apikey:KEY}});if(!r.ok)throw new Error("rest "+r.status);return r.json()}
async function rpc(fn,body){
  const r=await fetch(SB+"/rest/v1/rpc/"+fn,{method:"POST",headers:{apikey:KEY,"Content-Type":"application/json"},body:JSON.stringify(body||{})});
  const x=await r.text();
  if(!r.ok){let m="";try{m=JSON.parse(x).message}catch(e){}throw new Error(m||"rpc "+r.status)}
  return x?JSON.parse(x):null;
}

