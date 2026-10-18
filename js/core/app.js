
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

/* ===== etapa 2: perfil, avatar em pixel art, árvore e mural ===== */
let tok=LS.get("sg_tok")||"";
function setTok(v){tok=v;LS.set("sg_tok",v)}
if(!tok){const a=new Uint8Array(24);crypto.getRandomValues(a);setTok(Array.from(a,b=>"abcdefghjkmnpqrstuvwxyz23456789"[b%31]).join(""))}
let rawProf=null,BON={mangoes:0,xp:0},prof=null,draft={c:0,h:"none"};
const XPS=[0,50,150,400,900,2000],LVN=["Semente","Broto","Árvore jovem","Árvore florida","Árvore carregada","Pomar lendário"];
const lvlOf=x=>{let l=1;XPS.forEach((v,i)=>{if(x>=v)l=i+1});return l};
const COLS=[["Ouro","#F2B632"],["Verde","#7FBF3F"],["Laranja","#F08A24"],["Vermelha","#D9453A"],["Rosa","#E87AA6"],["Roxa","#8E5BD0"],["Azul","#4FA3E0"],["Preta","#3A3A44"]];
const SPR={"mango":{"p":{"o":"#7A3E00","y":"#F2B632","l":"#FFF2A8","r":"#E8743B","g":"#4FA84B","d":"#1D5628"},"r":["......dg....","....dggg....","...oooooo...","..oyyyyyro..",".oylyyyyyro.",".oylyyyyyyro","oyyyyyyyyyro","oyyyyyyyyrro","oyyyyyyyyrro",".oyyyyyyrro.","..oyyyyrro..","...oooooo..."]},"pest":{"p":{"g":"#2F6B2F","G":"#7FBF3F","H":"#B6E36B","w":"#FFFFFF","k":"#1E1E26"},"r":["...gg..gg...","..gGGggGGg..",".gGHGGGGHGg.",".gGwkGGwkGg.",".gGGGGGGGGg.","..gGGGGGGg..","...gg..gg..."]},"beetle":{"p":{"k":"#2B1B0E","R":"#B8432F","B":"#E8743B","S":"#5A1F14","w":"#FFFFFF"},"r":["..k......k..","...k....k...","..kkkkkkkk..",".kBRRkkRRBk.",".kRSRkkRSRk.",".kRRRkkRRRk.",".kRRRkkRRRk.","..kRRkkRRk..","...kkkkkk..."]},"rock":{"p":{"k":"#2B2B33","s":"#8A8A96","L":"#BFBFCC","S":"#5E5E6B"},"r":["...kkkk...","..kLLssk..",".kLsssssk.",".ksssssSsk","ksssSsssSk","kSsssssssk",".kkkkkkkk."]},"stump":{"p":{"k":"#2B1B0E","b":"#7A4E28","B":"#A87438","t":"#5A3B1E"},"r":["..kkkkkk..",".kBBBBBBk.","kBbbBBbbBk","kbBBbbBBbk",".ktttttttk",".kttttttk.","..kkkkkk.."]}};
const HP={"r":"#D9453A","R":"#9E2A22","k":"#5A1F14","n":"#8A5A2B","N":"#5C3A1A","y":"#F5D547","Y":"#C9A227","p":"#7B3FBF","P":"#B07BE8","q":"#4A2377","w":"#FFFFFF","x":"#1E1E26","h":"#E8D9A0","H":"#B8A25E","g":"#3E8E3E","G":"#8ED391","f":"#F4A6C0","F":"#E8749E","s":"#9AA3B2","S":"#5E6676","L":"#D4A046","d":"#2A2140","D":"#4A3C73"};
const HATS={"none":["Sem chapéu",1,[]],"cap":["Boné",1,[[1,6,"rrrr"],[2,4,"rrrrrrrr"],[3,3,"rrrwwrrrrR"],[4,3,"rrrrrrrrrR"],[5,2,"kkkkkkkkkkkkkk"]]],"cowboy":["Cowboy",2,[[2,6,"nnnn"],[3,5,"nNnnnN"],[4,5,"nyyyyn"],[5,0,"nnnNnnnnnnNnnnnn"],[6,1,"NNNNNNNNNNNNNN"]]],"pirate":["Pirata",3,[[1,6,"xxxx"],[2,4,"xxxxxxxx"],[3,3,"xxxwwwwxxx"],[4,3,"xxxxwwxxxx"],[5,1,"xxxxxxxxxxxxxx"]]],"wizard":["Mago",4,[[0,7,"pp"],[1,6,"pPpp"],[2,6,"pyyp"],[3,5,"pppPpp"],[4,4,"pppppppp"],[5,2,"pppPppppppPp"],[6,1,"qqqqqqqqqqqqqq"]]],"palha":["Palha",1,[[2,6,"hhhh"],[3,5,"hhhhhh"],[4,5,"hrrrrh"],[5,1,"hhhhhhHhhhHhhh"],[6,2,"HHHHHHHHHHHH"]],"a_colheita"],"folha":["Folha",1,[[2,6,"ggg"],[3,5,"gGGGg"],[4,4,"gGGGGGg"],[5,5,"ggGGgg"],[6,6,"gggg"]],"a_explora"],"flor":["Flores",1,[[3,3,"f"],[3,6,"F"],[3,9,"f"],[3,12,"F"],[4,3,"fgFgfgFgfg"],[5,3,"gggggggggg"]],"a_segredos"],"elmo":["Elmo",1,[[1,8,"rr"],[2,6,"ssss"],[3,5,"sSssSs"],[4,4,"ssssssss"],[5,3,"ssxxxxxxss"],[6,3,"SSSSSSSSSS"]],"a_defesa"],"louro":["Louros",1,[[3,3,"L"],[3,12,"L"],[4,3,"LyLLLLLLyL"],[5,3,"LL"],[5,11,"LL"]],"a_lenda"],"capuz":["Capuz",1,[[2,5,"dddddd"],[3,4,"dDDDDDDd"],[4,3,"dDDDDDDDDd"],[5,2,"dD"],[5,12,"Dd"],[6,2,"d"],[6,13,"d"]],"a_mist"],"crown":["Coroa",5,[[2,3,"y"],[2,7,"y"],[2,11,"y"],[3,3,"yy"],[3,7,"yy"],[3,11,"yy"],[4,3,"yyyyyyyyyyy"],[5,3,"yrYYYYYYrYy"],[6,3,"YYYYYYYYYYY"]]]};
const mix=(h,tc,f)=>{const a=parseInt(h.slice(1),16),b=parseInt(tc.slice(1),16),m=s=>Math.round(((a>>s)&255)*(1-f)+((b>>s)&255)*f);return"#"+[16,8,0].map(s=>m(s).toString(16).padStart(2,"0")).join("")};
function drawAv(cv,av){
  av=av||{c:0,h:"none"};
  const g=cv.getContext("2d"),base=(COLS[av.c]||COLS[0])[1],sh=mix(base,"#000000",.28),hi=mix(base,"#ffffff",.4),ol=mix(base,"#000000",.6);
  g.clearRect(0,0,16,20);
  const inb=(x,y)=>(((x+.5-8)/7.2)**2+((y+.5-13)/6.8)**2)<=1;
  for(let y=0;y<20;y++)for(let x=0;x<16;x++){
    if(!inb(x,y))continue;
    const edge=!inb(x-1,y)||!inb(x+1,y)||!inb(x,y-1)||!inb(x,y+1);
    g.fillStyle=edge?ol:((x-8)+(y-13)>5?sh:((x-5)**2+(y-10)**2<=5?hi:base));
    g.fillRect(x,y,1,1);
  }
  g.fillStyle="#2B1B0E";[[5,12],[5,13],[10,12],[10,13],[6,16],[7,17],[8,17],[9,16]].forEach(([x,y])=>g.fillRect(x,y,1,1));
  g.fillStyle="#2F6B2F";[[8,5],[9,5],[10,4],[11,4],[9,6]].forEach(([x,y])=>g.fillRect(x,y,1,1));
  const hat=HATS[av.h];
  if(hat)hat[2].forEach(([y,x0,s])=>[...s].forEach((c,i)=>{g.fillStyle=HP[c];g.fillRect(x0+i,y,1,1)}));
}
function drawTree(cv,l){
  const g=cv.getContext("2d");g.clearRect(0,0,24,24);
  const R=(c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
  const C=(c,cx,cy,r)=>{g.fillStyle=c;for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++)if(x*x+y*y<=r*r)g.fillRect(cx+x,cy+y,1,1)};
  R("#5A3B1E",0,21,24,3);R("#3E7D3A",0,20,24,1);
  if(l===1){R("#7A4E28",10,18,4,3);R("#A87438",11,18,2,1)}
  else if(l===2){R("#7A4E28",11,13,2,8);C("#4FA84B",8,13,2);C("#4FA84B",15,12,2)}
  else{
    const big=l>=5?9:(l===4?8:6);
    R("#7A4E28",10,12,4,9);C("#2F6B2F",12,10,big);C("#3E8E3E",10,8,big-2);
    if(l>=4)[[7,7],[14,6],[11,12],[16,10],[6,11]].forEach(([x,y])=>R("#F4A6C0",x,y,2,2));
    if(l>=5)[[8,13],[15,13],[11,5],[5,9],[17,8]].forEach(([x,y])=>R("#F2B632",x,y,2,3));
    if(l>=6){[[2,3],[20,4],[4,17],[21,14]].forEach(([x,y])=>{R("#FFE680",x,y,1,3);R("#FFE680",x-1,y+1,3,1)});[[9,3],[14,3]].forEach(([x,y])=>R("#FFC21A",x,y,2,3))}
  }
}
function renderMine(){
  $("mineChip").textContent=mine>=1e5?new Intl.NumberFormat("pt-BR",{notation:"compact",maximumFractionDigits:1}).format(mine):mine.toLocaleString("pt-BR");$("mineChip").title=mine.toLocaleString("pt-BR")+" mangas";
  $("secN").textContent=Object.keys(found).length+"/"+SECRETS.length;
  const xp=prof?prof.xp:0,l=lvlOf(xp),nx=XPS[l];
  $("lvlChip").textContent="Nível "+l+" · "+LVN[l-1];
  $("hXp").style.width=(nx?Math.min(100,(xp-XPS[l-1])/(nx-XPS[l-1])*100):100)+"%";
  $("hXpT").textContent=nx?xp.toLocaleString("pt-BR")+"/"+nx.toLocaleString("pt-BR")+" XP":xp.toLocaleString("pt-BR")+" XP";
  drawAv($("hAv"),prof&&prof.avatar);
}
function renderProfile(){
  const xp=prof?prof.xp:0,l=lvlOf(xp),nx=XPS[l];
  $("pName").textContent=me?"@"+me:"Visitante";
  $("pLvl").textContent="Nível "+l+" · "+LVN[l-1];
  $("pXp").style.width=(nx?Math.min(100,(xp-XPS[l-1])/(nx-XPS[l-1])*100):100)+"%";
  $("pXpT").textContent=nx?xp+" / "+nx+" XP":xp+" XP (nível máximo)";
  drawTree($("pTree"),l);drawAv($("pAv"),draft);
  $("colors").innerHTML=COLS.map((c,i)=>`<button type="button" class="sw${draft.c===i?" on":""}" data-c="${i}" style="background:${c[1]}" aria-label="${c[0]}" title="${c[0]}"></button>`).join("");
  $("hats").innerHTML=Object.keys(HATS).map(k=>{const h=HATS[k],ok=h[3]?!!(QS&&QS.goals.some(g=>g.id===h[3]&&g.done)):l>=h[1];return`<button type="button" class="hat${draft.h===k?" on":""}" data-h="${k}"${ok?"":" disabled"}>${h[0]}${ok?"":h[3]?" (conquista)":" (nv. "+h[1]+")"}</button>`}).join("");
  $("tokShow").textContent=tok;
}
function setProf(r){
  rawProf=r;prof=Object.assign({},r,{xp:(r.xp||0)+BON.xp});mine=r.mangoes+BON.mangoes;found={};(r.found||[]).forEach(i=>{found[i]=1});
  draft={c:(r.avatar||{}).c||0,h:(r.avatar||{}).h||"none"};
  renderMine();renderProfile();renderRank();
  if(mine>=50)unlock("harvest");
}
async function claim(){const r=await rpc("claim_profile",{p_handle:me,p_token:tok});try{BON=await rpc("game_bonus",{p_handle:me,p_token:tok})}catch(e){}setProf(r)}
$("colors").addEventListener("click",e=>{const b=e.target.closest("[data-c]");if(b){draft.c=+b.dataset.c;renderProfile()}});
$("hats").addEventListener("click",e=>{const b=e.target.closest("[data-h]");if(b&&!b.disabled){draft.h=b.dataset.h;renderProfile()}});
$("saveAv").onclick=async()=>{try{setProf(await rpc("set_avatar",{p_handle:me,p_token:tok,p_avatar:draft}));toast("Visual salvo!")}catch(e){toast("Não consegui salvar o visual.")}};
$("tokCopy").onclick=()=>{try{navigator.clipboard.writeText(tok);toast("Chave copiada.")}catch(e){toast("Copie a chave manualmente.")}};
const CATS={nunca:"Uma coisa que nunca falei",sam:"Uma mensagem para o Sam",lembranca:"Uma lembrança que merece ficar",pergunta:"Uma pergunta para o dono do pomar"};
async function loadMural(){
  $("murFeed").innerHTML='<li class="state">Carregando…</li>';
  try{
    const v=await rest("mural?select=id,handle,cat,text,created_at&status=eq.ok&order=created_at.desc&limit=60");
    $("murFeed").innerHTML=v.map(x=>`<li data-id="${+x.id}"><b class="nm">@${esc(x.handle)}</b> <span class="sm">${esc(CATS[x.cat]||x.cat)}</span><p class="hand">${esc(x.text)}</p><div class="rx">${RXS.map(e=>`<button type="button" data-e="${e}">${rxI(e)} <span>0</span></button>`).join("")}</div></li>`).join("")||'<li class="state">O mural está vazio. Escreva a primeira mensagem!</li>';
    if(v.length)try{const c=await rpc("reactions_get",{p_kind:"mural",p_refs:v.map(x=>+x.id),p_handle:me||null});
      const tot={};c.forEach(r=>{tot[r.ref]=(tot[r.ref]||0)+r.n;const b=document.querySelector(`#murFeed li[data-id="${+r.ref}"] [data-e="${r.emoji}"]`);if(b){b.lastElementChild.textContent=r.n;b.classList.toggle("on",!!r.mine)}});const top=Object.keys(tot).sort((a,b)=>tot[b]-tot[a])[0];if(top&&tot[top]>=3){const li=document.querySelector(`#murFeed li[data-id="${+top}"]`);if(li)li.insertAdjacentHTML("afterbegin",'<span class="gbadge ok">★ Em destaque</span> ')}}catch(e){}
  }catch(e){$("murFeed").innerHTML='<li class="state">Não consegui carregar o mural.</li>'}
}
$("murForm").onsubmit=async e=>{
  e.preventDefault();$("murSt").textContent="Enviando…";
  try{
    await rpc("post_mural",{p_handle:me,p_token:tok,p_cat:$("murCat").value,p_text:$("murTxt").value});
    $("murTxt").value="";$("murSt").textContent="Mensagem enviada! Ela aparece no mural depois que o dono aprovar.";
  }catch(err){$("murSt").textContent=({rate:"Limite de 3 mensagens por dia atingido.",spam:"Sem links nem mensagens repetidas, por favor.",len:"Escreva entre 3 e 280 caracteres."})[err.message]||"Não consegui enviar agora."}
};

const mediaUrl=p=>SB+"/storage/v1/object/public/media/"+p;
async function upload(blob,ext){
  const path="p/"+Date.now()+"-"+Math.random().toString(36).slice(2,8)+"."+ext;
  const r=await fetch(SB+"/storage/v1/object/media/"+path,{method:"POST",headers:{apikey:KEY,"Content-Type":blob.type||"application/octet-stream","x-upsert":"false"},body:blob});
  if(!r.ok)throw new Error("up "+r.status);
  return path;
}
const fmt=d=>d.toLocaleDateString("pt-BR");
const grad=p=>{const t=(p.n*37)%100;return `linear-gradient(150deg,hsl(${95-t*.3},55%,45%) 0%,hsl(${42-t*.1},95%,55%) 45%,hsl(${12+t*.12},90%,58%) 100%)`};
const fx=$("fx");

/* utilidades */
function toast(t,ms){const el=$("toast");el.textContent=t;el.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove("on"),ms||3500)}
function syncInert(){const on=locked||gateOn;document.querySelectorAll(".hero,.wrap,.foot,.music,.mascot").forEach(el=>{if(on)el.setAttribute("inert","");else el.removeAttribute("inert")})}
function say(t,ms){const b=$("bub");b.textContent=t;b.hidden=false;clearTimeout(say.t);say.t=setTimeout(()=>{b.hidden=true},ms||6000)}
const rnd=a=>a[Math.floor(Math.random()*a.length)];

/* contador diário */
const U=(y,m,d)=>Date.UTC(y,m,d);
function renderDays(){
  const t=new Date(),y=t.getFullYear(),T=U(y,t.getMonth(),t.getDate());
  const doy=Math.round((T-U(y,0,1))/864e5)+1;
  const total=306+Math.round((T-U(2026,9,15))/864e5);
  const p2=n=>String(n).padStart(2,"0");
  $("dayChip").textContent="Hoje é dia "+p2(t.getDate())+"/"+p2(t.getMonth()+1)+"/"+y+", dia "+doy;
  $("postChip").textContent=total+" postagens";
  $("daily").textContent="Curiosidade do dia: "+FACTS[doy%FACTS.length];$("homeFact").textContent=FACTS[doy%FACTS.length];
}
renderDays();setInterval(renderDays,60000);
let dc=[];
$("dayChip").onclick=()=>{
  const n=Date.now();dc=dc.filter(x=>n-x<3000);dc.push(n);
  if(dc.length>=5){dc=[];const t=new Date(),y=t.getFullYear(),left=Math.round((U(y,11,31)-U(y,t.getMonth(),t.getDate()))/864e5);toast("📅 Faltam "+left+" dias para o fim de "+y+". Cada um deles pode render uma postagem!",6000);unlock("days")}
};

/* segredos e colheita */
function unlock(id){
  if(found[id]||!me||!prof)return;
  found[id]=1;
  const s=SECRETS.find(x=>x.id===id);
  rpc("unlock_secret",{p_handle:me,p_token:tok,p_id:id}).then(r=>{setProf(r);toast("Segredo: "+(s?s.n:id)+" (+25 XP, +5 mangas)",5000)}).catch(()=>{delete found[id]});
}
function renderSecrets(){
  $("sgrid").innerHTML=SECRETS.map(s=>found[s.id]?`<div class="sec"><span class="e">${s.e}</span><b>${esc(s.n)}</b></div>`:`<div class="sec lock"><span class="e">?</span><b>???</b><span>${esc(s.h)}</span></div>`).join("");
}
$("secClose").onclick=()=>showPane("diary");
renderMine();

/* colheita */
$("hang").addEventListener("click",async e=>{
  const b=e.target.closest(".hm");if(!b||b.classList.contains("pick"))return;
  if(!me||!prof){toast("Entre com seu @ para colher.");return}
  b.classList.add("pick");
  try{const r=await rpc("harvest",{p_handle:me,p_token:tok});setProf(r.profile);toast((r.gold?"Manga de ouro! +10 mangas, +20 XP. ":"+1 manga, +2 XP. ")+rnd(FACTS),6000)}
  catch(err){toast(({rate:"Calma! Uma colheita a cada 2 segundos.",daily:"Você atingiu o limite de 300 colheitas de hoje."})[err.message]||"Não consegui colher agora.",4000)}
  setTimeout(()=>b.classList.remove("pick"),3000);
});
$("hero").addEventListener("click",e=>{
  if(e.target.closest("button"))return;
  burst(e.clientX,e.clientY);
});
function burst(x,y){
  for(let i=0;i<8;i++){
    const l=document.createElement("i"),a=Math.random()*6.28,r=40+Math.random()*60;
    l.className="bl";
    l.style.cssText=`left:${x}px;top:${y}px;--tx:${Math.cos(a)*r}px;--ty:${Math.sin(a)*r-30}px;--c:${["#5DB35F","#FFC83D","#FF9A4A"][i%3]}`;
    fx.appendChild(l);setTimeout(()=>l.remove(),900);
  }
}

/* galeria */
function match(p,q){
  q=q.trim();if(!q)return true;let m;
  if(/^#?\d{1,4}$/.test(q))return p.n===+q.replace("#","");
  if(m=q.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/))return p.date.getDate()==+m[1]&&p.date.getMonth()+1==+m[2]&&p.date.getFullYear()==+m[3];
  if(m=q.match(/^(\d{1,2})\/(\d{4})$/))return p.date.getMonth()+1==+m[1]&&p.date.getFullYear()==+m[2];
  if(/^\d{4}$/.test(q))return p.date.getFullYear()==+q;
  return p.cap.toLowerCase().includes(q.toLowerCase());
}
function uiExtras(){
  const q=$("q").value.trim();
  $("status").textContent=q?(list.length?list.length+" postagem(ns) para “"+q+"”.":"Nada encontrado para “"+q+"”."):(posts.length?posts.length+" postagens no diário.":"");
  const mm={};posts.forEach(p=>{const y=p.date.getFullYear(),m=p.date.getMonth()+1,k=y*100+m;mm[k]=mm[k]||{y,m,c:0};mm[k].c++});
  $("months").innerHTML=Object.keys(mm).sort((a,b)=>b-a).map(k=>{const o=mm[k],s=String(o.m).padStart(2,"0")+"/"+o.y;return`<button type="button" data-m="${s}">${s} <i>${o.c}</i></button>`}).join("");
}
$("months").addEventListener("click",e=>{const b=e.target.closest("[data-m]");if(b){$("q").value=b.dataset.m;limit=24;render()}});
function badge(p){const m=p.media||[];if(!m.length||(m.length<2&&m[0].type!=="video"))return"";return`<span class="bdg">${m[0].type==="video"?"▶ ":""}${m.length>1?m.length:""}</span>`}
function render(){
  list=posts.filter(p=>match(p,$("q").value)).sort((a,b)=>newest?b.n-a.n:a.n-b.n);
  $("grid").innerHTML=list.slice(0,limit).map(p=>`<button class="card" data-n="${p.n}"><div class="pic" style="background:${p.img?`url(${esc(p.img)}) center/cover`:grad(p)}">${p.img?"":`<b>#${p.n}</b>`}${badge(p)}<span class="chap">Cap. ${p.n}</span></div><div class="meta"><strong>${fmt(p.date)}</strong><br>${esc(p.cap)}</div></button>`).join("");
  $("empty").textContent=posts.length?"Nenhuma postagem encontrada. Tente só o número (300), um mês (03/2027) ou clique em Limpar para ver tudo.":"Ainda não há postagens por aqui. A primeira será a #300 🥭";
  $("empty").hidden=list.length>0;uiExtras();renderHome();
  $("more").hidden=list.length<=limit;
}
$("q").addEventListener("input",()=>{limit=24;render()});
$("clear").onclick=()=>{$("q").value="";limit=24;render()};
$("sort").onclick=()=>{newest=!newest;$("sort").textContent=newest?"Mais recentes":"Mais antigas";render()};
$("more").onclick=()=>{limit+=24;render()};
$("grid").addEventListener("pointermove",e=>{const c=e.target.closest(".card");if(!c||e.pointerType==="touch")return;const r=c.getBoundingClientRect();c.style.setProperty("--rx",(-((e.clientY-r.top)/r.height-.5)*12)+"deg");c.style.setProperty("--ry",(((e.clientX-r.left)/r.width-.5)*14)+"deg")});
$("grid").addEventListener("pointerout",e=>{const c=e.target.closest(".card");if(c){c.style.removeProperty("--rx");c.style.removeProperty("--ry")}});

/* visualizador de postagem */
let cur=0,curP=null,mi=0,armed=false;
function showMedia(){
  const big=$("dBig"),slot=$("dSlot"),m=curP.media||[];
  slot.innerHTML="";
  if(!m.length){big.style.background=grad(curP);slot.textContent="#"+curP.n}
  else{
    big.style.background="#000";
    const x=m[mi],el=document.createElement(x.type==="video"?"video":"img");
    el.src=x.url;
    if(x.type==="video"){el.controls=true;el.playsInline=true}else el.alt="";
    slot.appendChild(el);
  }
  $("mPrev").hidden=$("mNext").hidden=m.length<2;
  $("mCnt").textContent=m.length>1?(mi+1)+"/"+m.length:"";
}
function openPost(n){
  const p=posts.find(x=>x.n==n);if(!p)return;
  cur=p.n;curP=p;mi=0;showMedia();armed=false;
  $("delBtn").textContent="Apagar postagem";$("delBtn").hidden=!unlocked;
  $("dNum").textContent="Postagem #"+p.n;$("dDate").textContent=fmt(p.date);$("dCap").textContent=p.cap;
  $("prev").disabled=!posts.some(x=>x.n<cur);$("next").disabled=!posts.some(x=>x.n>cur);
  if(!$("dlg").open)$("dlg").showModal();
}
const step=d=>{const s=posts.map(x=>x.n).filter(n=>d<0?n<cur:n>cur).sort((a,b)=>d<0?b-a:a-b);if(s.length)openPost(s[0])};
$("grid").addEventListener("click",e=>{const c=e.target.closest(".card");if(c)openPost(c.dataset.n)});
$("prev").onclick=()=>step(-1);$("next").onclick=()=>step(1);
$("close").onclick=()=>$("dlg").close();
$("mPrev").onclick=()=>{const n=curP.media.length;mi=(mi-1+n)%n;showMedia()};
$("mNext").onclick=()=>{mi=(mi+1)%curP.media.length;showMedia()};
$("dlg").addEventListener("close",()=>{$("dSlot").innerHTML=""});
$("dlg").addEventListener("keydown",e=>{if(e.key==="ArrowLeft")step(-1);if(e.key==="ArrowRight")step(1)});

/* painéis */
function showPane(id){
  $("home").hidden=id!=="home";$("diary").hidden=id!=="diary";
  document.querySelectorAll("#panes .pane").forEach(p=>{p.hidden=p.id!==id});
  document.querySelectorAll(".areas [data-p]").forEach(b=>b.setAttribute("aria-current",b.dataset.p===id?"page":"false"));
  if(id==="rankDlg"){renderRank();loadRank()}
  if(id==="secDlg")renderSecrets();
  if(id==="murDlg")loadMural();
  if(id==="profDlg")renderProfile();
  if(id==="galDlg")galInit();
  if(id==="gameDlg")gameInit();else stopGame();
  trackArea(id);if(id==="questDlg")loadQuests();if(id==="profDlg")loadExtra();
  if(id==="home")scrollTo({top:0,behavior:"smooth"});else $("stage").scrollIntoView({behavior:"smooth",block:"start"});
}
document.querySelectorAll(".areas [data-p]").forEach(b=>{b.onclick=()=>showPane(b.dataset.p)});
$("codeBtn").onclick=()=>{resetCheat();$("cDlg").showModal();$("cIn").focus()};

/* início, atalhos, ajustes e partículas */
function go(k){
  if(k==="harvest"){showPane("home");$("hang").classList.add("pulse");setTimeout(()=>$("hang").classList.remove("pulse"),2600);toast("Clique nas mangas penduradas no galho!",3500)}
  else showPane(k);
}
$("homePosts").addEventListener("click",e=>{const b=e.target.closest("[data-n]");if(b){showPane("diary");openPost(b.dataset.n)}});
function applyPrefs(){
  document.documentElement.dataset.theme=LS.get("sg_theme")||"dark";
  $("leaves").hidden=LS.get("sg_leaves")==="0";
  {const c=LS.get("sg_calm");document.documentElement.classList.toggle("calm",c===null?matchMedia("(prefers-reduced-motion:reduce)").matches:c==="1")}
}
applyPrefs();
$("setBtn").onclick=()=>{$("optLeaves").checked=LS.get("sg_leaves")!=="0";$("optCalm").checked=document.documentElement.classList.contains("calm");$("setDlg").showModal()};
$("setClose").onclick=()=>$("setDlg").close();
$("optLeaves").onchange=e=>{LS.set("sg_leaves",e.target.checked?"1":"0");applyPrefs()};
$("optCalm").onchange=e=>{LS.set("sg_calm",e.target.checked?"1":"0");applyPrefs()};
document.querySelectorAll("[data-theme]").forEach(b=>{b.onclick=()=>{LS.set("sg_theme",b.dataset.theme);applyPrefs()}});
{const sc=document.querySelector(".hero-gate-art")||document.body;for(let i=0;i<14&&sc;i++){const f=document.createElement("i");f.className="ff";f.style.cssText=`--x:${Math.random()*100}%;--y:${10+Math.random()*80}%;--t:${5+Math.random()*6}s;--d:-${Math.random()*8}s`;sc.appendChild(f)}}

/* curiosidades */
function renderFacts(q){
  q=norm(q||"");
  const items=FACTS.map((f,i)=>({f,i})).filter(x=>!q||norm(x.f).includes(q));
  $("facts").innerHTML=items.map(x=>`<li data-i="${x.i}">${esc(x.f)}</li>`).join("")||"<li>Nenhuma curiosidade encontrada.</li>";
  $("fCount").textContent="("+items.length+"/"+FACTS.length+")";
}
renderFacts("");
$("fSearch").addEventListener("input",e=>renderFacts(e.target.value));
$("fRand").onclick=()=>{
  $("fSearch").value="";renderFacts("");
  const li=$("facts").children[Math.floor(Math.random()*FACTS.length)];
  li.classList.add("hl");li.scrollIntoView({block:"center",behavior:"smooth"});
  setTimeout(()=>li.classList.remove("hl"),2500);
};
$("curClose").onclick=()=>showPane("diary");

/* ranking */
function rankRows(el,rows,full){
  el.innerHTML=rows.length?rows.map((r,i)=>`<li class="${r.handle===me?"me":""}"><span class="pos">${i<3?`<svg class="ic crown c${i+1}"><use href="#i-crown"/></svg>`:""}<b>${i+1}</b></span><canvas class="rav" width="16" height="20" data-i="${i}"></canvas><span class="nm">@${esc(r.handle)}${r.handle===me?" <em>(você)</em>":""}${r.title?` <em class="${r.handle.toLowerCase()==="sammanguinha"&&r.title==="Dono"?"owner-rank-title":""}">· ${r.title==="Dono"&&r.handle.toLowerCase()==="sammanguinha"?"👑 ":""}${esc(r.title)}</em>`:""}${+r.ach?` <em>🏅${+r.ach}</em>`:""}</span><span class="ct">${(+r.mangoes||0).toLocaleString("pt-BR")}</span><span class="lv">Nv.${+r.level||1}${r.xp!=null?" · "+(+r.xp).toLocaleString("pt-BR")+" XP":""}</span>${unlocked&&full?`<button type="button" class="x" data-del="${esc(r.handle)}" aria-label="Remover do ranking">✕</button>`:""}</li>`).join(""):'<li class="empty2">Ninguém colheu ainda. Seja o primeiro!</li>';
  el.querySelectorAll("canvas").forEach(c=>drawAv(c,rows[+c.dataset.i].avatar));
}
function renderRank(){
  rankRows($("rankList"),rank,true);renderPodium();rankRows($("homeList"),rank.slice(0,5),false);
  const idx=rank.findIndex(r=>r.handle===me),n=mine.toLocaleString("pt-BR");
  const s=idx>=0?"Você está em "+(idx+1)+"º lugar, com "+n+" mangas.":"Você tem "+n+" mangas colhidas.";
  $("rankMe").textContent=s;$("homeMe").textContent=s;
}
const ago=d=>{const n=Math.round((Date.now()-d.getTime())/864e5);return n<=0?"hoje":n===1?"ontem":n+" dias atrás"};
function renderHome(){
  const L=posts.slice().sort((a,b)=>b.n-a.n).slice(0,3);
  $("homePosts").innerHTML=L.length?L.map(p=>`<li><button type="button" data-n="${p.n}"><span class="th" style="background:${p.img?`url(${esc(p.img)}) center/cover`:grad(p)}"></span><span class="lt"><b>${esc(p.cap||"Capítulo "+p.n)}</b><small>${ago(p.date)}</small></span><svg class="ic sm"><use href="#i-arrow"/></svg></button></li>`).join(""):'<li class="empty2">Nenhuma postagem ainda. A primeira será a #300.</li>';
}
let rkOff=0;
async function loadRank(more){
  if(!more)rkOff=0;const q=$("rkQ").value.trim();
  try{const v=await rpc("ranking_full",{p_offset:rkOff,p_q:q||null});rank=more?rank.concat(v):v;rkOff+=v.length;$("rkMore").hidden=v.length<20;renderRank()}
  catch(e){try{if(!more){rank=await rest("ranking_v?select=handle,mangoes,xp,level&order=mangoes.desc&limit=30");renderRank()}}catch(e2){}}
}
$("rkMore").onclick=()=>loadRank(true);
let rkT=0;$("rkQ").addEventListener("input",()=>{clearTimeout(rkT);rkT=setTimeout(()=>loadRank(false),350)});
function renderPodium(){
  const t=rank.slice(0,3),el=$("podium");if($("rkQ").value.trim()||t.length<3){el.hidden=true;return}el.hidden=false;
  el.innerHTML=[1,0,2].map(i=>{const r=t[i];return`<div class="pod p${i+1}"><svg class="ic crown c${i+1}"><use href="#i-crown"/></svg><b>@${esc(r.handle)}</b><span class="ct">${(+r.mangoes).toLocaleString("pt-BR")}</span><small>Nv.${+r.level||1}${r.title?" · "+esc(r.title):""}</small></div>`}).join("");
}
$("mineChip").onclick=()=>showPane("rankDlg");
$("rankClose").onclick=()=>showPane("diary");
$("rankList").addEventListener("click",async e=>{
  const b=e.target.closest("[data-del]");if(!b||!unlocked)return;
  try{await rpc("admin_remove_ranking",{p_pw:ADMPW,p_handle:b.dataset.del});loadRank()}catch(err){toast("Não foi possível remover.")}
});
async function reg(){
  if(!me)return;
  try{await claim()}catch(e){if(e.message==="handle_taken")needKey();return}
  try{await rpc("register_visit",{p_handle:me})}catch(e){}
  loadMine();
}
function needKey(){
  me="";LS.set("sg_handle","");renderMe();showGate();
  $("gKeyWrap").hidden=false;$("gErr").textContent="Esse @ já tem dono. Cole a chave dele (em Meu pomar) ou use outro @.";
}

/* login por @ */
function renderMe(){$("meChip").textContent=me?"@"+me+" · trocar":"Entrar"}
function showGate(){
  gateOn=true;$("gate").hidden=false;syncInert();
  $("gIn").value=me;$("gErr").textContent="";
  setTimeout(()=>$("gIn").focus(),50);
}
$("gForm").onsubmit=async e=>{
  e.preventDefault();
  const h=$("gIn").value.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?instagram\.com\//,"").replace(/[\/?].*$/,"").replace(/^@+/,"").replace(/\s+/g,"");
  if(!/^[a-z0-9._]{1,30}$/.test(h)){
    $("gErr").textContent="Esse @ não parece válido. Use só letras, números, ponto e underline, sem espaços (exemplo: sammanguinha).";
    $("gIn").focus();return;
  }
  const key=$("gKey").value.trim();const previousToken=tok;if(key.length>=16)setTok(key);
  const previousHandle=me;me=h;renderMe();$("gOk").disabled=true;$("gErr").textContent="";
  try{await claim()}
  catch(err){
    $("gOk").disabled=false;setTok(previousToken);
    if(err.message==="handle_taken"){me=previousHandle;renderMe();$("gKeyWrap").hidden=false;$("gErr").textContent="Esse @ já tem dono. Cole a chave dele ou use outro @."}
    else {me=previousHandle;renderMe();$("gErr").textContent="Não consegui entrar agora. Tente de novo.";}
    return;
  }
  LS.set("sg_handle",me);window.dispatchEvent(new Event("sm18:account-changed"));$("gOk").disabled=false;gateOn=false;$("gate").hidden=true;syncInert();
  toast("Bem-vindo(a), @"+me+"! Colha as mangas do topo.",4500);
  say("Oi, @"+me+"! Eu sou o Manguito. Me clique para ouvir curiosidades.",7000);
  rpc("register_visit",{p_handle:me}).catch(()=>{});
  pollEvent();loadMine();
};
$("meChip").onclick=showGate;
renderMe();

/* mascote */
const mas=$("mascot");let mc=[];
function mClick(){
  const n=Date.now();mc=mc.filter(x=>n-x<4000);mc.push(n);
  if(mc.length>=7){mc=[];mas.classList.add("splat");say("Splash! Virei suco 🧃",3000);unlock("splat");setTimeout(()=>mas.classList.remove("splat"),2300);return}
  mas.classList.remove("jump");void mas.offsetWidth;mas.classList.add("jump");
  say(rnd(FACTS),7000);
}
mas.addEventListener("click",mClick);
mas.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();mClick()}});
let ptr=0;
addEventListener("pointermove",e=>{
  if(ptr)return;
  ptr=requestAnimationFrame(()=>{
    ptr=0;const r=mas.getBoundingClientRect(),dx=e.clientX-(r.left+31),dy=e.clientY-(r.top+37),d=Math.hypot(dx,dy)||1,k=Math.min(3,d/30);
    mas.style.setProperty("--px",(dx/d*k)+"px");mas.style.setProperty("--py",(dy/d*k)+"px");
  });
});
function dance(){mas.classList.add("dance");say("♪ ♫ ♪",3200);unlock("manga");setTimeout(()=>mas.classList.remove("dance"),3200)}
$("seed").onclick=()=>{toast("🌱 Você achou o caroço! Dentro dele mora uma mangueira inteira.",5000);unlock("seed")};

/* códigos secretos */
function samuel(){const a=$("samuel");a.currentTime=0;a.play().then(()=>{toast("🔊 apicadosamuel");unlock("samuel")}).catch(()=>toast("Não consegui tocar o áudio."))}
function stars(){
  const els=[];
  for(let i=0;i<40;i++){
    const s=document.createElement("i");s.className="star";s.textContent="★";
    s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;font-size:${14+Math.random()*30}px;animation-delay:-${Math.random()*3}s;animation-duration:${1.6+Math.random()*2}s`;
    fx.appendChild(s);els.push(s);
  }
  toast("★ lulala ★");unlock("lulala");
  setTimeout(()=>els.forEach(s=>s.classList.add("out")),12000);
  setTimeout(()=>els.forEach(s=>s.remove()),13200);
}
let rotOn=false,flies=[];
function rot(){
  rotOn=!rotOn;document.documentElement.classList.toggle("rot",rotOn);
  flies.forEach(f=>f.remove());flies=[];
  if(rotOn)for(let i=0;i<6;i++){
    const f=document.createElement("i");f.className="fly";f.textContent="🪰";
    f.style.cssText=`--x:${5+Math.random()*80}vw;--y:${10+Math.random()*70}vh;animation-delay:-${Math.random()*6}s;animation-duration:${5+Math.random()*5}s`;
    fx.appendChild(f);flies.push(f);
  }
  toast(rotOn?"As mangas apodreceram… digite podridao de novo para curá-las.":"As mangas estão frescas de novo 🥭",5000);
  unlock("podridao");
}
function beep(){
  try{
    const A=new (window.AudioContext||window.webkitAudioContext)(),t=A.currentTime;
    [[988,0],[1319,.09]].forEach(([f,d])=>{
      const o=A.createOscillator(),g=A.createGain();
      o.type="square";o.frequency.value=f;
      g.gain.setValueAtTime(.08,t+d);g.gain.exponentialRampToValueAtTime(.001,t+d+.35);
      o.connect(g);g.connect(A.destination);o.start(t+d);o.stop(t+d+.4);
    });
    setTimeout(()=>A.close(),900);
  }catch(e){}
}
function coin(){
  const S=["....oooo....","..ooyyyyoo..",".oyyyllyyyo.",".oyyllyyyydo","oyyllyyyyydo","oyyllyyyyydo","oyyllyyyyydo","oyyllyyyyydo","oyyllyyyyydo","oyyllyyyyydo","oyyllyyyyydo","oyyyyyyyyydo",".oyyyyyyydo.","..oddyyddo..","..ooddddoo..","....oooo...."];
  const pal={o:"#7A3E00",y:"#FFD21F",l:"#FFF4A8",d:"#E08A00"};
  const w=document.createElement("div"),c=document.createElement("canvas");
  w.className="cw";c.className="coin";c.width=12;c.height=16;
  const g=c.getContext("2d");
  S.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch!==".") {g.fillStyle=pal[ch];g.fillRect(x,y,1,1)}}));
  w.appendChild(c);fx.appendChild(w);beep();unlock("luigi");
  setTimeout(()=>w.remove(),2000);
}
function rain(emojis,n,ms){
  for(let i=0;i<n;i++){
    const s=document.createElement("i");s.className="rain";s.textContent=emojis[i%emojis.length];
    s.style.cssText=`left:${Math.random()*100}%;font-size:${18+Math.random()*26}px;animation-duration:${2+Math.random()*2.5}s;animation-delay:${Math.random()*(ms/1000-3)}s`;
    fx.appendChild(s);setTimeout(()=>s.remove(),ms+500);
  }
}
function suco(){const j=document.createElement("div");j.className="juice";j.textContent="glub glub 🥭";fx.appendChild(j);setTimeout(()=>j.remove(),4800);unlock("suco")}
function noite(){const r=document.documentElement,d=r.dataset.theme==="dark";r.dataset.theme=d?"light":"dark";toast(d?"☀️ Dia de novo!":"🌙 Boa noite, pomar.");unlock("noite")}
function ventania(){
  const cols=[["#6CC070","#2E7D32"],["#9BCB4B","#4C8C2B"],["#FFC83D","#E58A00"],["#FF9A4A","#D9532B"]],box=$("leaves"),els=[];
  for(let i=0;i<30;i++){
    const l=document.createElement("i"),c=rnd(cols);l.className="leaf";
    l.style.cssText=`left:${Math.random()*100}%;--s:${12+Math.random()*16}px;--a:${c[0]};--b:${c[1]};--t:${3+Math.random()*3}s;--d:-${Math.random()*5}s;--dx:${(Math.random()<.5?-1:1)*(160+Math.random()*220)}px`;
    box.appendChild(l);els.push(l);
  }
  toast("🍃 Ventania!");unlock("ventania");
  setTimeout(()=>els.forEach(l=>l.remove()),12000);
}
function alphonso(){rain(["🥭","✨","🥭","👑"],36,6500);toast("👑 Alphonso: a manga de ouro chegou!",5000);unlock("alphonso")}
function miseri(){
  if(!$("cDlg").open){resetCheat();$("cDlg").showModal()}
  $("cAsk").hidden=true;$("cOk").hidden=true;$("cImg").hidden=false;unlock("miseri");
}
let lockT=null;
function lock(sec,until){
  const tot=sec||13,end=until||Date.now()+tot*1000;
  LS.set("sg_lock",String(end));
  document.querySelectorAll("dialog[open]").forEach(d=>d.close());
  locked=true;syncInert();document.body.style.overflow="hidden";$("lock").hidden=false;
  const tick=()=>{
    const ms=end-Date.now(),left=Math.ceil(ms/1000);
    if(left<=0){release();return}
    $("lockN").textContent=left;$("lockBar").style.transform="scaleX("+Math.max(0,ms/(tot*1000))+")";
  };
  tick();clearInterval(lockT);lockT=setInterval(tick,200);
}
function release(){clearInterval(lockT);locked=false;LS.set("sg_lock","0");$("lock").hidden=true;document.body.style.overflow="";syncInert();toast("Liberado! Pode voltar a mexer 🥭")}
function bolso(){unlock("bolso");lock(13)}
const fxDlg=$("fxDlg");let fxT=0;
function fxOpen(h,c){$("fxBody").className=c||"";$("fxBody").innerHTML=h;if(!fxDlg.open)fxDlg.showModal()}
$("fxClose").onclick=()=>fxDlg.close();
fxDlg.addEventListener("close",()=>{clearInterval(fxT);$("fxBody").innerHTML=""});
function pop(){fxOpen('<p class="pixt big">SAMMANGUINHA É POP,<br>JAMAIS “ROCK”!</p>');burst(innerWidth/2,innerHeight/2);unlock("pop")}
function fakeAdmin(){
  fxOpen('<p class="pixt">Verificação ultrassecreta</p><div class="pbar"><i id="pb"></i></div><p id="pt" class="mono">Lendo suas impressões digitais de manga…</p>');
  let n=0;clearInterval(fxT);
  fxT=setInterval(()=>{const b=$("pb");if(!b){clearInterval(fxT);return}n+=2+Math.random()*5;b.style.width=Math.min(n,100)+"%";
    if(n>=100){clearInterval(fxT);$("pt").innerHTML='<b class="red">ACESSO NEGADO.</b> Motivo: '+rnd(["você tem cara de quem confunde manga com mamão.","seu nível de poder equivale ao de uma banana-prata.","o sistema desconfia que você é um caroço disfarçado.","seu carisma foi reprovado por unanimidade pelas folhas."])}},140);
  unlock("admin");
}
function hack(){
  const L=["> iniciando invasão do pomar…","> contornando o firewall de casca…","> quebrando a senha: 12345… não. 54321… não.","> acessando o mainframe da mangueira…","> baixando 100% das mangas… 99%… 99%… 99%…","> INVASÃO CONCLUÍDA. Você hackeou a geladeira de alguém e encontrou uma manga esquecida desde 2019."];
  fxOpen('<pre class="term" id="tm"></pre>');let i=0;clearInterval(fxT);
  fxT=setInterval(()=>{const x=$("tm");if(!x||i>=L.length){clearInterval(fxT);return}x.textContent+=L[i++]+"\n"},900);
  unlock("hack");
}
function socorro(){document.documentElement.classList.add("alarm");toast("ALERTA NO POMAR! Uma manga caiu e ninguém viu. Mantenha a calma.",6000);setTimeout(()=>document.documentElement.classList.remove("alarm"),5000);unlock("socorro")}
function deus(){fxOpen('<p class="hand">'+rnd(["Se uma manga cai na floresta e ninguém a colhe, ela ainda é doce?","Quem veio primeiro: a mangueira ou o caroço? E se a resposta for “o suco”?","Todo caroço é só uma mangueira esperando a sua vez.","Colher é ganhar ou perder uma manga?"])+'</p>');unlock("deus")}
function amor(){fxOpen('<div class="letter"><p class="hand">Querido(a) @'+esc(me||"explorador(a)")+',</p><p class="hand">desde que te vi colhendo mangas, meu caroço não para de acelerar. Você é a polpa da minha vida e o suco dos meus dias. Se for para ser fiapo, que seja entre os seus dentes.</p><p class="hand">Com carinho (e um pouco de vergonha),<br>o Pomar</p></div>');unlock("amor")}
function care(){fxOpen('<p class="pixt">Ei, passando só para dizer:</p><p>Se você está pensando em se machucar, converse com alguém agora. No Brasil, o CVV atende 24 horas pelo <a href="tel:188"><b>188</b></a> (ligação gratuita) e em <a href="https://cvv.org.br" target="_blank" rel="noopener">cvv.org.br</a>. Você importa.</p>')}
const CODES={misericordia:miseri,apicadosamuel:samuel,lulala:stars,podridao:rot,luigi:coin,bolsonaro:bolso,suco,noite,ventania,alphonso,sammanguinha:pop,admin:fakeAdmin,hack,socorro,deus,amor,suicidio:care};
function resetCheat(){$("cIn").value="";$("cErr").textContent="";$("cAsk").hidden=false;$("cImg").hidden=true;$("cOk").hidden=false}
function tryCode(){
  const k=norm($("cIn").value);
  if(!Object.prototype.hasOwnProperty.call(CODES,k))return false;
  if(k!=="misericordia")$("cDlg").close();
  setTimeout(CODES[k],k==="misericordia"?0:80);
  return true;
}
$("cheat").onclick=()=>{resetCheat();$("cDlg").showModal();$("cIn").focus()};
$("cIn").addEventListener("input",tryCode);
$("cForm").onsubmit=e=>{e.preventDefault();if(!tryCode()){$("cErr").textContent="Código incorreto.";$("cIn").select()}};
$("cClose").onclick=()=>$("cDlg").close();
$("cDlg").addEventListener("close",resetCheat);

/* códigos digitados em qualquer lugar + Konami */
const KON=["arrowup","arrowup","arrowdown","arrowdown","arrowleft","arrowright","arrowleft","arrowright","b","a"];
let buf="",kon=[];
addEventListener("keydown",e=>{
  if(locked||gateOn||e.ctrlKey||e.metaKey||e.altKey)return;
  const t=e.target;if(t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable))return;
  const k=e.key.toLowerCase();
  kon.push(k);kon=kon.slice(-10);
  if(kon.join()===KON.join()){kon=[];rain(["🥭"],40,6000);toast("🎮 Código clássico! Chuva de mangas!",5000);unlock("konami");return}
  if(e.key.length!==1)return;
  buf=(buf+norm(e.key)).slice(-16);
  for(const c of Object.keys(CODES))if(buf.endsWith(c)){buf="";CODES[c]();return}
  if(buf.endsWith("manga")){buf="";dance()}
});

/* música de fundo */
const bgm=$("bgm");bgm.volume=.5;
const PLAY="M8 5v14l11-7z",PAUSE="M6 5h4v14H6zM14 5h4v14h-4z";
function setMusic(on){
  $("music").classList.toggle("on",on);
  $("mBtn").setAttribute("aria-pressed",on);
  $("mBtn").setAttribute("aria-label",on?"Pausar música":"Tocar música");
  $("mIco").firstElementChild.setAttribute("d",on?PAUSE:PLAY);
}
$("mBtn").onclick=()=>{
  if(bgm.paused){bgm.play().then(()=>setMusic(true)).catch(()=>setMusic(false))}
  else{bgm.pause();setMusic(false)}
};
$("mVol").oninput=e=>{bgm.volume=+e.target.value};

/* folhas caindo (e que dá para pegar) */
const LC=[["#6CC070","#2E7D32"],["#9BCB4B","#4C8C2B"],["#D2DF55","#6E9B2A"],["#FFC83D","#E58A00"],["#FF9A4A","#D9532B"]];
function mkLeaf(){
  const l=document.createElement("i"),c=rnd(LC);
  l.className="leaf";
  l.style.cssText=`left:${Math.random()*100}%;--s:${12+Math.random()*16}px;--a:${c[0]};--b:${c[1]};--t:${11+Math.random()*10}s;--d:-${Math.random()*20}s;--dx:${(Math.random()<.5?-1:1)*(40+Math.random()*90)}px`;
  $("leaves").appendChild(l);
}
const NL=matchMedia("(max-width:600px)").matches?7:11;
for(let i=0;i<NL;i++)mkLeaf();
let lc=0;
$("leaves").addEventListener("click",e=>{
  const l=e.target.closest(".leaf");if(!l)return;
  burst(e.clientX,e.clientY);l.remove();lc++;
  if(lc>=5)unlock("leaves");else toast("🍂 Folha pega! ("+lc+"/5)",1800);
  setTimeout(mkLeaf,5000);
});

/* início */
render();
{
  const L=parseInt(LS.get("sg_lock"),10)||0;
  if(L>Date.now())lock(13,L);
  if(!me)showGate();
}

/* dados (Supabase) e administração */
async function loadPosts(){
  try{
    const rows=await rest("posts?select=n,date,cap,media&order=n.desc&limit=500");
    posts=rows.map(x=>{
      const media=(x.media||[]).map(m=>({url:mediaUrl(m.path),type:m.type||"image"}));
      return{n:x.n,date:new Date(x.date+"T12:00:00"),cap:x.cap||"",media,img:media[0]&&media[0].type==="image"?media[0].url:null};
    });
    render();
  }catch(e){toast("Não consegui carregar as postagens agora.",5000)}
}
loadPosts();reg();loadRank();
setInterval(loadPosts,60000);

const checkPw=async pw=>{try{return(await rpc("admin_check",{p_pw:pw}))===true}catch(e){return null}};
{const sp=LS.get("sg_adm");if(sp)checkPw(sp).then(ok=>{if(ok){ADMPW=sp;unlocked=true}else if(ok===false)LS.set("sg_adm","")})}
$("admBtn").onclick=()=>{
  if(unlocked){openAdmin();return}
  $("pErr").textContent="";$("pIn").value="";$("pDlg").showModal();$("pIn").focus();
};
$("pClose").onclick=()=>$("pDlg").close();
let fails=0;
$("pForm").onsubmit=async e=>{
  e.preventDefault();$("pOk").disabled=true;const pw=$("pIn").value,ok=await checkPw(pw);
  if(ok===true){ADMPW=pw;unlocked=true;if($("pRem").checked)LS.set("sg_adm",pw);$("pDlg").close();toast("Admin liberado 🔓");openAdmin()}
  else if(ok===null){$("pErr").textContent="Não consegui falar com o servidor."}
  else{fails++;$("pErr").textContent="Senha incorreta.";await new Promise(r=>setTimeout(r,Math.min(6000,fails*1500)))}
  $("pOk").disabled=false;
};
const tab=n=>{["aForm","visPane","murPane","galAdm"].forEach((id,i)=>{$(id).hidden=i!==n});["tabPost","tabVis","tabMur","tabGal"].forEach((id,i)=>{$(id).classList.toggle("on",i===n);$(id).classList.toggle("alt",i!==n)});if(n===2){loadAdminMural();loadAdminLive()}if(n===3)loadAdminGal()};
async function loadAdminLive(){
 const target=$("sm20AdminChatList");if(!target)return;
 target.innerHTML='<li class="state">Buscando conversas…</li>';
 try{
 const messages=await rpc("sm_live_admin_list",{p_pw:ADMPW});
 target.innerHTML=messages.map(m=>`<li data-chat-id="${Number(m.id)}" style="display:block;padding:10px;border-bottom:1px solid #ffffff23"><b>@${esc(m.handle)}</b> · ${esc(m.room)} · <span class="sm">${m.status==='ok'?'Visível':'Oculta'} · ${Number(m.reports)||0} denúncia(s)</span><p style="white-space:pre-wrap;overflow-wrap:anywhere;margin:5px 0">${esc(m.body)}</p><button type="button" data-chat-set="${m.status==='ok'?'hidden':'ok'}" class="btn-gothic alt">${m.status==='ok'?'Ocultar':'Restaurar'}</button></li>`).join('')||'<li class="state">Nenhuma mensagem ainda.</li>';
 }catch(e){target.textContent="Não consegui carregar o chat: "+e.message}
}
$("sm20AdminChatRefresh")?.addEventListener("click",loadAdminLive);
$("sm20AdminChatList")?.addEventListener("click",async e=>{
 const btn=e.target.closest("[data-chat-set]"),item=btn?.closest("[data-chat-id]");if(!btn||!item)return;
 btn.disabled=true;
 try{await rpc("sm_live_admin_set",{p_pw:ADMPW,p_id:Number(item.dataset.chatId),p_status:btn.dataset.chatSet});await loadAdminLive();toast("Moderação do chat atualizada.")}
 catch(err){toast("Erro ao moderar: "+err.message);btn.disabled=false}
});
async function loadAdminMural(){
  try{
    const v=await rpc("admin_mural",{p_pw:ADMPW});
    $("murList").innerHTML=v.map(x=>`<li data-id="${x.id}"><span class="nm">@${esc(x.handle)} · ${esc(CATS[x.cat]||x.cat)}<br>${esc(x.text)}</span><button type="button" data-s="ok">Aprovar</button><button type="button" class="alt" data-s="hidden">Ocultar</button></li>`).join("")||"<li>Nenhuma mensagem pendente.</li>";
  }catch(e){$("murList").innerHTML="<li>Não consegui carregar.</li>"}
}
$("murList").addEventListener("click",async e=>{
  const b=e.target.closest("[data-s]");if(!b)return;
  try{await rpc("admin_mural_set",{p_pw:ADMPW,p_id:+b.closest("li").dataset.id,p_status:b.dataset.s});loadAdminMural();loadMural()}catch(err){toast("Não consegui atualizar.")}
});
$("tabPost").onclick=()=>tab(0);$("tabVis").onclick=()=>tab(1);$("tabMur").onclick=()=>tab(2);
async function loadVis(){
  try{
    const v=await rpc("admin_visitors",{p_pw:ADMPW});
    $("visN").textContent="("+v.length+")";
    $("visList").innerHTML=v.map(x=>{const t=new Date(x.last_at||0);return`<li><span class="nm">@${esc(x.handle)}</span><span class="sm">${+x.visits||1} visita(s) · ${t.toLocaleDateString("pt-BR")} ${t.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</span></li>`}).join("")||"<li>Ninguém entrou ainda.</li>";
  }catch(e){$("visList").innerHTML="<li>Não consegui carregar os visitantes.</li>"}
}
function openAdmin(){
  $("aForm").reset();$("aSt").textContent="";tab(0);
  $("aNum").value=Math.max(299,...posts.map(p=>p.n))+1;
  $("aDate").value=new Date().toISOString().slice(0,10);
  loadVis();$("aDlg").showModal();
}
$("tabGal").onclick=()=>tab(3);$("aClose").onclick=$("aClose2").onclick=$("aClose3").onclick=$("aClose4").onclick=()=>$("aDlg").close();
$("delBtn").onclick=async()=>{
  if(!armed){armed=true;$("delBtn").textContent="Confirmar: apagar para sempre";return}
  const p=curP;$("delBtn").disabled=true;
  try{await rpc("admin_delete_post",{p_pw:ADMPW,p_n:p.n});$("dlg").close();await loadPosts()}
  catch(e){$("delBtn").textContent="Não foi possível apagar";armed=false}
  $("delBtn").disabled=false;
};
async function shrink(f){
  const bmp=await createImageBitmap(f),k=Math.min(1,1080/Math.max(bmp.width,bmp.height));
  const c=document.createElement("canvas");c.width=Math.round(bmp.width*k);c.height=Math.round(bmp.height*k);
  c.getContext("2d").drawImage(bmp,0,0,c.width,c.height);
  return await new Promise(r=>c.toBlob(r,"image/jpeg",.85));
}
$("aForm").onsubmit=async e=>{
  e.preventDefault();$("aGo").disabled=true;$("aSt").textContent="Enviando…";
  try{
    const files=[...$("aFile").files],media=[];
    for(let i=0;i<files.length;i++){
      const f=files[i],isV=f.type.startsWith("video/");
      if(isV&&f.size>20*1048576)throw new Error("big");
      $("aSt").textContent="Enviando "+(i+1)+" de "+files.length+"…";
      let blob=f,ext="jpg";
      if(isV)ext=((f.name.split(".").pop()||"mp4").toLowerCase().replace(/[^a-z0-9]/g,""))||"mp4";
      else blob=await shrink(f);
      media.push({path:await upload(blob,ext),type:isV?"video":"image"});
    }
    const n=+$("aNum").value;
    await rpc("admin_save_post",{p_pw:ADMPW,p_n:n,p_date:$("aDate").value,p_cap:$("aCap").value.trim(),p_media:media});
    $("aSt").textContent="Postagem #"+n+" publicada.";
    $("aFile").value="";$("aCap").value="";$("aNum").value=n+1;
    loadPosts();
  }catch(err){$("aSt").textContent=err.message==="big"?"Um vídeo passa de 20 MB. Reduza o tamanho e tente de novo.":"Não foi possível publicar. Tente de novo."}
  $("aGo").disabled=false;
};

/* ===== etapa 3: galeria comunitária ===== */
const GST={pending:"Aguardando aprovação",ok:"Aprovada",rejected:"Rejeitada"};
const GERR={rate:"Você já enviou 3 imagens hoje. Tente amanhã.",pending:"Você já tem 6 imagens aguardando análise.",spam:"Sem links, por favor.",dup:"Você já enviou uma imagem com esse título.",len:"Título: 2 a 60 caracteres. Legenda: até 200.",auth:"Entre com seu @ para enviar."};
const gUrl=p=>SB+"/storage/v1/object/public/orchard/"+p;
let gOff=0,gReady=false,gPrep=null;
async function prepImg(f){
  if(!/^image\/(jpeg|png|webp)$/.test(f.type))throw new Error("fmt");
  if(f.size>10*1048576)throw new Error("big");
  const b=await createImageBitmap(f),k=Math.min(1,1600/Math.max(b.width,b.height)),c=document.createElement("canvas");
  c.width=Math.max(1,Math.round(b.width*k));c.height=Math.max(1,Math.round(b.height*k));
  c.getContext("2d").drawImage(b,0,0,c.width,c.height);
  const blob=await new Promise(r=>c.toBlob(r,"image/jpeg",.85));
  if(!blob||blob.size>2097152)throw new Error("big");
  return{blob,w:c.width,h:c.height};
}
$("gFile").onchange=async e=>{
  const f=e.target.files[0];gPrep=null;$("gPrev").hidden=true;if(!f)return;
  try{gPrep=await prepImg(f);URL.revokeObjectURL($("gPrev").src);$("gPrev").src=URL.createObjectURL(gPrep.blob);$("gPrev").hidden=false;$("gSt").textContent="Pronta para enviar. Ela ficará aguardando aprovação."}
  catch(err){e.target.value="";$("gSt").textContent=err.message==="big"?"Imagem grande demais. Use uma de até 10 MB.":"Formato não aceito. Use JPG, PNG ou WebP."}
};
$("gForm2").onsubmit=async e=>{
  e.preventDefault();
  if(!me||!prof){showGate();return}
  if(!gPrep){$("gSt").textContent="Escolha uma imagem primeiro.";return}
  $("gGo").disabled=true;$("gSt").textContent="Enviando…";
  try{
    const path="u/"+Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,"0")).join("")+".jpg";
    const r=await fetch(SB+"/storage/v1/object/orchard/"+path,{method:"POST",headers:{apikey:KEY,"Content-Type":"image/jpeg","x-upsert":"false"},body:gPrep.blob});
    if(!r.ok)throw new Error("up");
    await rpc("gallery_submit",{p_handle:me,p_token:tok,p_path:path,p_title:$("gTit").value.trim(),p_caption:$("gCap").value.trim(),p_w:gPrep.w,p_h:gPrep.h});
    $("gForm2").reset();$("gPrev").hidden=true;gPrep=null;
    $("gSt").textContent="Enviada! Sua imagem está aguardando aprovação e só aparece na galeria depois disso.";
    loadMine();
  }catch(err){$("gSt").textContent=GERR[err.message]||"Não consegui enviar agora. Tente de novo."}
  $("gGo").disabled=false;
};
async function loadMine(){
  const el=$("gMine");if(!me){el.innerHTML='<li class="state">Entre com seu @ para ver suas publicações.</li>';return}
  try{const v=await rpc("gallery_mine",{p_handle:me,p_token:tok});notifyG(v);
    el.innerHTML=v.map(x=>`<li data-id="${x.id}"><img src="${gUrl(esc(x.path))}" alt=""><span class="nm">${esc(x.title)}${x.status==="rejected"&&x.reason?`<br><span class="sm">Motivo: ${esc(x.reason)}</span>`:""}</span><span class="gbadge ${esc(x.status)}">${GST[x.status]||""}</span><button type="button" class="alt" data-del="${x.id}">Excluir</button></li>`).join("")||'<li class="state">Você ainda não enviou nenhuma imagem.</li>'}
  catch(e){el.innerHTML='<li class="state">Não consegui carregar suas publicações.</li>'}
}
$("gMine").addEventListener("click",async e=>{const b=e.target.closest("[data-del]");if(!b)return;
  try{await rpc("gallery_delete_mine",{p_handle:me,p_token:tok,p_id:+b.dataset.del});loadMine();loadGal(true)}catch(err){toast("Não consegui excluir.")}});
async function loadGal(reset){
  if(reset){gOff=0;$("gGal").innerHTML=""}
  $("gEmpty").hidden=true;
  try{const v=await rpc("gallery_public",{p_limit:24,p_offset:gOff});gOff+=v.length;
    $("gGal").insertAdjacentHTML("beforeend",v.map(x=>`<button type="button" class="gi" data-id="${+x.id}" data-p="${esc(x.path)}" data-t="${esc(x.title)}" data-c="${esc(x.caption||"")}" data-h="${esc(x.handle)}"><img src="${gUrl(esc(x.path))}" width="${+x.w}" height="${+x.h}" loading="lazy" alt="${esc(x.title)}"><span><b>${esc(x.title)}</b><br><small>por @${esc(x.handle)}</small></span></button>`).join(""));
    $("gMore").hidden=v.length<24;
    if(!$("gGal").children.length){$("gEmpty").textContent="Ainda não há imagens aprovadas. Envie a primeira!";$("gEmpty").hidden=false}
  }catch(e){$("gEmpty").textContent="Não consegui carregar a galeria agora.";$("gEmpty").hidden=false}
}
$("gMore").onclick=()=>loadGal(false);
$("gGal").addEventListener("click",e=>{const b=e.target.closest(".gi");if(!b)return;
  fxOpen(`<img src="${gUrl(esc(b.dataset.p))}" alt="${esc(b.dataset.t)}"><p class="pixt">${esc(b.dataset.t)}</p><p>${esc(b.dataset.c)}</p><p class="sm">por @${esc(b.dataset.h)}</p><div class="rx" id="gRx" data-id="${+b.dataset.id}">${RXS.map(e=>`<button type="button" data-e="${e}">${rxI(e)} <span>0</span></button>`).join("")}</div>`);galRx(+b.dataset.id)});
function galInit(){loadMine();if(!gReady){gReady=true;loadGal(true)}}
async function loadAdminGal(){
  const row=(x,btns)=>`<li class="gadm" data-id="${x.id}"><img src="${gUrl(esc(x.path))}" alt=""><span class="nm"><b>${esc(x.title)}</b><br>@${esc(x.handle)}<br>${esc(x.caption||"")}</span>${btns}</li>`;
  try{const v=await rpc("admin_gallery_pending",{p_pw:ADMPW});
    $("galAdmList").innerHTML=v.map(x=>row(x,'<button type="button" data-s="ok">Aprovar</button><button type="button" class="alt" data-s="rejected">Rejeitar</button>')).join("")||'<li class="state">Nenhuma imagem aguardando.</li>'}
  catch(e){$("galAdmList").innerHTML='<li class="state">Não consegui carregar.</li>'}
  try{const v=await rpc("admin_gallery_approved",{p_pw:ADMPW});
    $("galAdmOk").innerHTML=v.map(x=>row(x,'<button type="button" class="alt" data-s="rejected">Remover</button>')).join("")||'<li class="state">Nenhuma imagem aprovada ainda.</li>'}
  catch(e){$("galAdmOk").innerHTML='<li class="state">Rode supabase_extras.sql para listar as aprovadas.</li>'}
}
$("galAdm").addEventListener("click",async e=>{const b=e.target.closest("[data-s]");if(!b)return;
  const reason=b.dataset.s==="rejected"?(prompt("Motivo da rejeição (opcional)")||""):"";
  try{await rpc("admin_gallery_set",{p_pw:ADMPW,p_id:+b.closest("li").dataset.id,p_status:b.dataset.s,p_reason:reason});loadAdminGal();loadGal(true)}catch(err){toast("Não consegui atualizar.")}});

/* ===== etapa 4: Defesa do Pomar ===== */
/* ===== pixel art: sprites desenhados em código ===== */
const SPC={};
Object.assign(SPR,{
heart:{p:{R:"#9E2A22",r:"#D9453A",l:"#FF9A86"},r:[".RRR.RRR.","RrrrRrrrR","RrlrrrrrR","RrrrrrrrR",".RrrrrrR.","..RrrrR..","...RrR...","....R...."]},
laugh:{p:{o:"#7A3E00",y:"#F5D547",k:"#2B1B0E",w:"#FFFFFF",r:"#D9453A"},r:["..oooooo..",".oyyyyyyo.","oykkyykkyo","oyyyyyyyyo","okkkkkkkko","oywwwwwwyo",".oywrrwyo.","..oooooo.."]},
sprout:{p:{g:"#4FA84B",G:"#8ED391",d:"#1D5628",b:"#7A4E28"},r:["..ggg.ggg",".gGGggGGg",".gGGggGGg","..gg.gg..","....d....","....d....","..bbbbb..",".bbbbbbb."]}});
const RXN={"🥭":"mango","❤️":"heart","😂":"laugh","🌱":"sprout"},RXU={};
const rxI=e=>`<img class="rxi" alt="${e}" src="${RXU[e]||(RXU[e]=spr(RXN[e]).toDataURL())}">`;
function spr(n){if(SPC[n])return SPC[n];const d=SPR[n],w=Math.max(...d.r.map(r=>r.length)),c=document.createElement("canvas");c.width=w;c.height=d.r.length;const g=c.getContext("2d");d.r.forEach((r,y)=>[...r].forEach((ch,x)=>{if(d.p[ch]){g.fillStyle=d.p[ch];g.fillRect(x,y,1,1)}}));return SPC[n]=c}
let _tree=null,gPl=null;
const treeCv=()=>_tree||(_tree=(()=>{const c=document.createElement("canvas");c.width=c.height=24;drawTree(c,5);return c})());
const playerCv=()=>{if(!gPl){gPl=document.createElement("canvas");gPl.width=16;gPl.height=20;drawAv(gPl,prof&&prof.avatar)}return gPl};
const dr=(c,x,y,k)=>gx.drawImage(c,Math.round(x-c.width*k/2),Math.round(y-c.height*k/2),c.width*k,c.height*k);

const gc=$("gCv"),gx=gc.getContext("2d"),K={};
let GW=360,GH=480,gDifficulty="normal";
const gHard=()=>gDifficulty!=="normal";
const gInfinite=()=>gDifficulty==="infinite";
function setGameDifficulty(mode){
 if(gs)return;gDifficulty=["hard","infinite"].includes(mode)?mode:"normal";GW=gHard()?540:360;GH=gHard()?620:480;gc.width=GW;gc.height=GH;
 document.querySelectorAll("#gDifficulty [data-difficulty]").forEach(b=>{const active=b.dataset.difficulty===gDifficulty;b.setAttribute("aria-pressed",String(active));b.classList.toggle("alt",!active)});
 $("gOvP").textContent=gInfinite()?"Defesa Infinita: sobreviva ao maior número de ondas possível. Recorde local, sem envio ao ranking oficial.":gHard()?"Modo DIFÍCIL: arena maior, 5 árvores para proteger, 30% menos pragas, larvas precisam de 2 ataques para derrubar uma árvore e besouros derrubam com 1. Sobreviva a 10 ondas e ganhe pontos em dobro!":"Pragas descem do céu sombrio. Atire mangas para derrubá-las e colha as que caem. Sobreviva a 5 ondas.";
 $("gModeNote").textContent=gDifficulty==="hard"?"👑 O Rei das Pragas surge na onda 10!":gInfinite()?"♾️ Ondas sem fim; recorde salvo neste navegador.":"🌱 5 ondas clássicas.";
 drawG();
}
document.querySelectorAll("#gDifficulty [data-difficulty]").forEach(b=>b.addEventListener("click",()=>setGameDifficulty(b.dataset.difficulty)));
let gs=null,gRun=null,gRaf=0,gLast=0;
// V21 motor tático: energia por abate; uma torre por rota; reparo caro e pontuação oficial inalterada.
let sm21SelectedLane=0;
const sm21JobKey=()=> 'sam21_combat_job_'+String(me||'visitante').toLowerCase().replace(/[^a-z0-9._]/g,'').slice(0,30);
function sm21JobRead(){try{const id=localStorage.getItem(sm21JobKey());return ['guardian','ranger','mage'].includes(id)?id:'guardian'}catch(_){return 'guardian'}}
let sm21Job='guardian';
function sm21JobsSync(){
 sm21Job=sm21JobRead();
 document.querySelectorAll('[data-sm21-job]').forEach(b=>{b.disabled=!!gs;b.setAttribute('aria-pressed',String(b.dataset.sm21Job===sm21Job))});
}
$("sm21Jobs")?.addEventListener('click',e=>{const b=e.target.closest('[data-sm21-job]');if(!b||gs)return;sm21Job=b.dataset.sm21Job;try{localStorage.setItem(sm21JobKey(),sm21Job)}catch(_){}
 sm21JobsSync();toast('Ofício selecionado: '+b.querySelector('b').textContent);});
sm21JobsSync();

const sm21Towers={arrow:{cost:3,cooldown:1.3,damage:1,name:'Torre de Mangas'},frost:{cost:4,cooldown:2.4,damage:1,name:'Runa de Gelo'},root:{cost:5,cooldown:3.0,damage:0,name:'Raiz Guardiã'},solar:{cost:6,cooldown:3.1,damage:1,name:'Totem Solar'}};
const sm22RunnerSprite=new Image();sm22RunnerSprite.src='sprites/corredor_ambar_v22.svg';
const sm21TowerSprites={};for(const type of ['arrow','frost','root','solar']){const img=new Image();img.src='sprites/torre_'+({arrow:'arco',frost:'gelo',root:'raiz',solar:'solar'}[type])+'_v24.svg';sm21TowerSprites[type]=img}
const sm24Sprites={};for(const kind of ['arvore_saudavel','arvore_danificada','arvore_destruida','praga_larva','praga_besouro','praga_esporo','praga_corredor','praga_curandeira','rei_pragas']){const im=new Image();im.src='sprites/'+kind+'_v24.svg';sm24Sprites[kind]=im}
function sm24DrawSprite(g,kind,x,y,w,h,t,anchorBottom=false){
 const im=sm24Sprites[kind];if(!im?.complete||!im.naturalWidth)return false;
 const still=matchMedia('(prefers-reduced-motion:reduce)').matches||document.documentElement.classList.contains('sm165-lowfx');
 const frame=still?0:Math.floor(t*6+x*.02)%4;
 g.save();g.imageSmoothingEnabled=false;
 g.drawImage(im,48*frame,0,48,48,x-w/2,anchorBottom?y-h:y-h/2,w,h);g.restore();return true;
}
function sm21Lanes(n){const out=$("sm21Lanes");if(!out)return;out.innerHTML=Array.from({length:n},(_,i)=>'<button type="button" data-sm21-lane="'+i+'" aria-pressed="'+(i===sm21SelectedLane)+'">🌳 Rota '+(i+1)+'</button>').join('')}
function sm21StrategyUi(){
 const energy=$("sm21Energy"),status=$("sm21TacticalStatus");if(!energy||!status)return;
 const s=gs;energy.textContent='✦ '+(s?s.energy:0)+' energia';const lane=sm21SelectedLane;
 const tower=s?.towers?.find(t=>t.lane===lane);
 const alive=s?.trees?.[lane];
 status.textContent=!s?'Comece uma partida para construir defesas.':(s.intermission>0?'⏳ Preparação: '+s.intermission.toFixed(1)+'s · ':'Onda '+s.wave+' · ')+(tower?'Torre '+((sm21Towers[tower.kind]?.name||'Desconhecida'))+' nível '+(tower.level||1)+' na rota '+(lane+1):'Rota '+(lane+1)+(alive?' livre':' destruída'))+' · '+s.kills+' abates';
 $("sm21Lanes")?.querySelectorAll('[data-sm21-lane]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.sm21Lane===lane)));
 document.querySelectorAll('[data-sm21-build]').forEach(b=>{const id=b.dataset.sm21Build;const can=s&&!sm17GamePaused&&!document.hidden&&s.energy>=(id==='heal'?(s.job==='guardian'?4:5):sm21Towers[id]?.cost||99)&&(id==='heal'?!s.trees[lane]:s.trees[lane]&&!tower);b.disabled=!can});
 const upgrade=$("sm22Upgrade"),priority=$("sm22Priority"),detail=$("sm22LaneDetail");
 const lvl=tower?.level||1,cost=lvl===1?3:5;
 if(upgrade){upgrade.disabled=!s||sm17GamePaused||!tower||lvl>=3||s.energy<cost;upgrade.textContent=lvl>=3?'✨ Torre no nível máximo':'⬆ Melhorar para nível '+(lvl+1)+' · '+cost+' energia'}
 if(priority){priority.disabled=!s||sm17GamePaused||!tower;priority.textContent='🎯 Alvo: '+(tower?.priority==='strongest'?'mais resistente':tower?.priority==='healer'?'curandeiras':'mais próximo')}
 if(detail)detail.textContent=tower?'Rota '+(lane+1)+' · nível '+lvl+'/3 · '+tower.shots+' disparos':'Escolha ou construa uma torre para melhorá-la.';
 const pulse=$('sm24GrovePulse');if(pulse){pulse.disabled=!s||s.mode==='normal'||sm17GamePaused||s.energy<6||s.groveCd>0;pulse.textContent=s?.mode==='normal'?'🌿 Pulso do Bosque · somente treino':'🌿 Pulso do Bosque · 6 ✦'+(s?.groveCd>0?' ('+Math.ceil(s.groveCd)+'s)':'')}
}
function sm21Build(id){
 const s=gs,lane=sm21SelectedLane;if(!s||sm17GamePaused||document.hidden)return;
 const def=sm21Towers[id],cost=def?.cost||(id==='heal'?(s.job==='guardian'?4:5):99);if(s.energy<cost){toast('Energia insuficiente. Derrote pragas para abastecer suas defesas.');return}
 if(id==='heal'){
  if(s.trees[lane]){toast('Esta árvore já está saudável.');return}
  s.energy-=cost;s.trees[lane]=true;s.treeHits[lane]=0;s.hp=s.trees.filter(Boolean).length;
  orchardBurst(GW*(lane+.5)/s.trees.length,GH-95,'#abff9c',2,'REVIVEU!');toast('🌳 Árvore da rota '+(lane+1)+' restaurada!');
 }else{
  if(!def||!s.trees[lane]||s.towers.some(t=>t.lane===lane)){toast('Essa rota precisa estar viva e sem torre.');return}
  s.energy-=cost;s.towers.push({kind:id,lane,cooldown:.5,shots:0,level:1,priority:'danger'});orchardBurst(GW*(lane+.5)/s.trees.length,GH-165,({frost:'#b6f8ff',root:'#b3efa5',solar:'#ffe6aa',arrow:'#ffdf8f'}[id]||'#ffdf8f'),1.5,'TORRE!');
 }
 sm21StrategyUi();
}
$("sm21Lanes")?.addEventListener('click',e=>{const btn=e.target.closest('[data-sm21-lane]');if(!btn)return;sm21SelectedLane=+btn.dataset.sm21Lane;sm21StrategyUi()});
document.querySelectorAll('[data-sm21-build]').forEach(btn=>btn.addEventListener('click',()=>sm21Build(btn.dataset.sm21Build)));
addEventListener('keydown',e=>{if(!gs||sm17GamePaused||e.target.closest?.('input,textarea,select,[contenteditable]'))return;if(/^[1-5]$/.test(e.key)){const lane=Number(e.key)-1;if(lane<gs.trees.length){sm21SelectedLane=lane;sm21StrategyUi()}}if(e.key==='r'||e.key==='R')sm21Build('heal')});

/* V24 · Pulso do Bosque: efeito real sobre pragas em modos não ranqueados. */
const sm24PulseButton=document.createElement('button');sm24PulseButton.type='button';sm24PulseButton.id='sm24GrovePulse';
sm24PulseButton.textContent='🌿 Pulso do Bosque · 6 ✦';
sm24PulseButton.setAttribute('aria-label','Imobilizar pragas por dois segundos, apenas no modo treino');
$("sm21Lanes")?.parentElement?.append(sm24PulseButton);
sm24PulseButton.addEventListener('click',()=>{
 const s=gs;if(!s||s.mode==='normal'||sm17GamePaused||document.hidden||s.energy<6||s.groveCd>0)return;
 const victims=s.pe.filter(x=>!x.dead);
 if(!victims.length){toast('Aguarde a chegada das pragas para usar o Pulso.');return}
 s.energy-=6;s.groveCd=12;
 for(const enemy of victims)enemy.rooted=Math.max(enemy.rooted||0,2.2);
 orchardBurst(s.x,GH-130,'#93ffb7',2.2,'PULSO DO BOSQUE!');
 toast('🌿 '+victims.length+' pragas imobilizadas por 2,2 s.');
 sm21StrategyUi();
});

// V22: investimento em torres tem efeito real em cadência, dano e lentidão.
function sm22UpgradeTower(){
 const s=gs;if(!s||sm17GamePaused||document.hidden)return;
 const t=s.towers.find(x=>x.lane===sm21SelectedLane);if(!t)return toast('Instale uma torre primeiro.');
 const level=t.level||1;if(level>=3)return toast('Torre já está no nível máximo.');
 const cost=level===1?3:5;if(s.energy<cost)return toast('Derrote mais pragas para conseguir energia.');
 s.energy-=cost;t.level=level+1;t.cooldown=Math.min(t.cooldown,.45);
 orchardBurst(GW*(t.lane+.5)/s.trees.length,GH-160,'#fff1a2',2,'NÍVEL '+t.level);
 sm21StrategyUi();
}
function sm22Priority(){
 const t=gs?.towers?.find(x=>x.lane===sm21SelectedLane);if(!t||sm17GamePaused)return;
 t.priority=t.priority==='strongest'?'healer':t.priority==='healer'?'danger':'strongest';sm21StrategyUi();
}
$("sm22Upgrade")?.addEventListener('click',sm22UpgradeTower);
$("sm22Priority")?.addEventListener('click',sm22Priority);
addEventListener('keydown',e=>{if(!gs||sm17GamePaused||e.repeat||e.target.closest?.('input,textarea,select,[contenteditable]'))return;
 if(e.key==='u'||e.key==='U')sm22UpgradeTower();
 if(e.key==='t'||e.key==='T')sm22Priority();
});
/* V24: Curandeira de Esporos opera no modo dificil/infinito. */
function sm24HealTick(s,dt){
 for(const healer of s.pe){
  if(healer.dead||healer.kind!=='healer')continue;
  healer.healCd=(healer.healCd||3.4)-dt;
  if(healer.healCd>0)continue;
  healer.healCd=3.4;
  const injured=s.pe.filter(enemy=>!enemy.dead&&enemy!==healer&&enemy.hp<Math.max(1,enemy.maxHp||1)&&Math.hypot(enemy.x-healer.x,enemy.y-healer.y)<115);
  injured.sort((a,b)=>(a.hp/(a.maxHp||1))-(b.hp/(b.maxHp||1)));
  const target=injured[0];if(!target)continue;
  target.hp=Math.min(Math.max(1,target.maxHp||1),target.hp+1);
  orchardBurst(target.x,target.y,'#9bffd0',.45,'+1 CURA');
 }
}
function sm21TacticsTick(s,dt){
 s.groveCd=Math.max(0,(s.groveCd||0)-dt);
 s.towers.forEach(t=>{
  t.cooldown-=dt;if(t.cooldown>0)return;
  const cx=GW*(t.lane+.5)/s.trees.length;
  const candidates=s.pe.filter(p=>!p.dead&&Math.abs(p.x-cx)<(GW/s.trees.length)*.48&&p.y>70&&p.y<GH-115);
  candidates.sort(t.priority==='strongest'?(a,b)=>b.hp-a.hp||b.y-a.y:t.priority==='healer'?(a,b)=>(b.kind==='healer')-(a.kind==='healer')||b.y-a.y:(a,b)=>b.y-a.y);
  const target=candidates[0];if(!target)return;
  const level=Math.min(3,Math.max(1,t.level||1));
  t.cooldown=sm21Towers[t.kind].cooldown*(s.job==='mage'&&t.kind==='frost'?.76:1)*(1-(level-1)*.18);t.shots++;
  const x=target.x,y=target.y;
  const damage=sm21Towers[t.kind].damage+(level>=3&&t.kind!=='root'?1:0);
  // Efeitos têm consequência no motor: Solar acerta um pequeno grupo; Raiz para o avanço.
  const victims=t.kind==='solar'
    ?s.pe.filter(p=>!p.dead&&p.y>70&&p.y<GH-115&&Math.hypot(p.x-x,p.y-y)<(level===3?110:82)).slice(0,5)
    :[target];
  for(const enemy of victims){
    if(enemy.dead)continue;
    if(t.kind==='root'){
      enemy.rooted=Math.max(enemy.rooted||0,1.4+(level-1)*.55);
      if(level===3)enemy.hp-=.5;
    }else{
      enemy.hp-=damage;enemy.hit=.32;
      if(t.kind==='frost')enemy.slow=Math.max(enemy.slow||0,2.3+(level-1)*.55);
    }
    if(enemy.hp<=0){enemy.dead=1;s.kills++;s.energy=Math.min(12,s.energy+1);s.combo++;s.comboTimer=5}
  }
  orchardBurst(x,y,({root:'#a4efa1',solar:'#ffd181',frost:'#8feeff',arrow:'#ffe0a0'}[t.kind]),.8,
    t.kind==='root'?'RAÍZES!':t.kind==='solar'?'SOLAR!':t.kind==='frost'?'GELO -'+damage:'🏹 -'+damage);
 });
}
function sm21DrawTowers(g,s,t){
 (s.towers||[]).forEach(tower=>{
  const x=GW*(tower.lane+.5)/s.trees.length,y=GH-149,im=sm21TowerSprites[tower.kind];
  g.save();g.fillStyle='#050c1bb9';g.beginPath();g.ellipse(x,y+23,24,7,0,0,Math.PI*2);g.fill();
  if(im?.complete&&im.naturalWidth){g.imageSmoothingEnabled=false;const still=matchMedia("(prefers-reduced-motion: reduce)").matches||document.documentElement.classList.contains("sm165-lowfx");g.drawImage(im,(still?0:Math.floor((t*2.8+tower.lane)%4))*48,0,48,48,x-28,y-31,56,56)}
  else {g.fillStyle=tower.kind==='frost'?'#90ddff':'#dfb87e';g.fillRect(x-12,y-23,24,38)}
  const level=tower.level||1;g.textAlign='center';g.font='bold 11px sans-serif';g.fillStyle='#170e28';g.fillText('Lv'+level,x+1,y-33);g.fillStyle=level>=3?'#ffe3a5':'#c2f5ff';g.fillText('Lv'+level,x,y-34);
  g.restore();
 });
 if(s.intermission>0){g.save();g.fillStyle='#100d29df';g.fillRect(8,GH*.47,GW-16,55);g.textAlign='center';g.fillStyle='#ffe5ad';g.font='bold 15px sans-serif';g.fillText('PREPARAÇÃO · ONDA '+s.wave,GW/2,GH*.47+22);g.font='12px sans-serif';g.fillText('Instale torres nas rotas · '+Math.ceil(s.intermission)+'s',GW/2,GH*.47+42);g.restore()}
}

// V20: novas habilidades com recarga por partida. Não alteram a pontuação fora do motor de jogo.
function sm20Dash(){if(!gs||sm17GamePaused||document.hidden||gs.dashCd>0)return;const d=(K.r?1:0)-(K.l?1:0);gs.x=Math.max(38,Math.min(GW-38,gs.x+(d||((gs.lastDir||1)))*Math.min(115,GW*.23)));gs.dashCd=gs.job==='guardian'?6:7;gs.dashes=(gs.dashes||0)+1;gs.invuln=Math.max(gs.invuln,0.65);gs.dashFx=.45;orchardBurst(gs.x,GH-93,"#74e8fd",1.9,"IMPULSO");sfx(750,.10)}
function sm20Nova(){if(!gs||sm17GamePaused||document.hidden||gs.novaCd>0||gs.ammo<3)return;const s=gs;s.ammo-=3;s.novas=(s.novas||0)+1;s.novaCd=s.job==='mage'?9:13;s.novaFx=.65;const cy=GH-135,range=154;orchardBurst(s.x,cy,"#c1a4ff",3.1,"EXPLOSÃO!");s.pe.forEach(p=>{if(p.dead||Math.hypot(p.x-s.x,p.y-cy)>range)return;p.hp-=2;p.hit=.45;if(p.hp<=0){p.dead=1;s.kills++;s.energy=Math.min(12,s.energy+1);s.combo=(s.combo||0)+1;s.comboTimer=5;s.score+=10}});if(s.boss&&Math.hypot(s.boss.x-s.x,s.boss.y-cy)<range+45){s.boss.hp-=2;s.boss.hit=.5;if(s.boss.hp<=0){s.boss=null;s.bossDefeated=true;s.score+=s.hard?1500:180;toast("👑 Rei das Pragas derrotado!",3500)}}sfx(150,.24)}
$("sm20Dash")?.addEventListener("click",sm20Dash);$("sm20Nova")?.addEventListener("click",sm20Nova);
// Read-only diagnostics for QA and accessibility: never expose tokens or change game state.
window.Sam21Defense=Object.freeze({snapshot:()=>gs?Object.freeze({wave:gs.wave,energy:gs.energy,trees:gs.trees.slice(),job:gs.job,mode:gs.mode,score:gs.score,kills:gs.kills,boss:!!gs.boss,enemies:gs.pe.filter(p=>!p.dead).map(p=>({x:p.x,y:p.y,hp:p.hp})),towers:gs.towers.map(t=>({kind:t.kind,lane:t.lane,shots:t.shots,level:t.level||1,priority:t.priority||'danger'})),intermission:gs.intermission}):null});
let sm17GamePaused=false;function sm17GamePause(on){sm17GamePaused=!!on;K.l=K.r=K.f=0;const b=document.getElementById("sm17PauseBtn"),info=document.getElementById("sm17DefenseStatus");if(b){b.disabled=!gs;b.textContent=sm17GamePaused?"▶ Retomar":"⏸ Pausar";b.setAttribute("aria-pressed",String(sm17GamePaused))}if(info)info.textContent=sm17GamePaused?"⏸ Pausado. Toque em Retomar para voltar.":"Defenda as árvores. Você pode pausar a qualquer momento.";const cover=document.getElementById("sm17PauseCover");if(cover)cover.hidden=!sm17GamePaused}
let snd=LS.get("sg_snd")==="1";$("gSnd").checked=snd;$("gSnd").onchange=e=>{snd=e.target.checked;LS.set("sg_snd",snd?"1":"0")};
function sfx(f,d){if(!snd)return;try{const A=sfx.A||(sfx.A=new(window.AudioContext||window.webkitAudioContext)()),o=A.createOscillator(),g=A.createGain();o.type="square";o.frequency.value=f;g.gain.value=.05;g.gain.exponentialRampToValueAtTime(.001,A.currentTime+d);o.connect(g);g.connect(A.destination);o.start();o.stop(A.currentTime+d)}catch(e){}}
const near=(a,b,r)=>Math.abs(a.x-b.x)<r&&Math.abs(a.y-b.y)<r;
const orchardCatalog=[
 {id:"bat",name:"🦇 Morceguinho",cost:80,emoji:"🦇",desc:"Sombra protetora: ataca pragas automaticamente a cada 4 segundos."},
 {id:"ghost",name:"👻 Fantasminha",cost:110,emoji:"👻",desc:"Espírito guardião: atravessa inimigos com um raio a cada 5 segundos."},
 {id:"pumpkin",name:"🎃 Miniabóbora",cost:140,emoji:"🎃",desc:"Casca de ferro: protege uma árvore de um ataque a cada 12 segundos."},
 {id:"firefly",name:"✨ Vaga-lume",cost:60,emoji:"✨",desc:"Luz da colheita: atrai mangas e regenera munição a cada 6 segundos."}
];
const orchardKey=()=>"sg_extras_v1_"+(String(typeof me!=="undefined"&&me||"visitante").toLowerCase());
function orchardRead(){try{const a=JSON.parse(localStorage.getItem(orchardKey())||"null");if(a&&typeof a==="object")return a}catch(e){}return {seeds:0,owned:[],pet:"",best:0,day:"",claimed:[],stats:{games:0,kills:0,waves:0,dashes:0,novas:0,combo:0}}}
function orchardSave(v){localStorage.setItem(orchardKey(),JSON.stringify(v))}
const orchardDay=()=>new Date().toLocaleDateString("en-CA",{timeZone:"America/Sao_Paulo"});
function orchardDaily(v){const today=orchardDay();if(v.day!==today){v.day=today;v.claimed=[];v.stats={games:0,kills:0,waves:0,dashes:0,novas:0,combo:0}}v.stats={games:0,kills:0,waves:0,dashes:0,novas:0,combo:0,...(v.stats||{})};v.owned=v.owned||[];v.claimed=v.claimed||[];return v}
let orchardTab="shop";
const orchardTasks=[{id:"games",name:"🌱 Iniciação — jogue 2 partidas",goal:2,reward:45},{id:"kills",name:"⚔️ Guardião — elimine 30 pragas",goal:30,reward:60},{id:"waves",name:"🌳 Vigília — sobreviva a 12 ondas",goal:12,reward:70},{id:"dashes",name:"💨 Vento Vivo — use 5 impulsos",goal:5,reward:35},{id:"novas",name:"💥 Eclipse — conjure 3 explosões",goal:3,reward:50},{id:"combo",name:"✨ Lenda — alcance combo x4",goal:15,reward:80}];
const pixelAsset=n=>"sprites/"+n+(n==="esporo_v20"?".svg":".png");
const pixelImages={};
function pixelImage(n){if(!pixelImages[n]){const im=new Image();im.src=pixelAsset(n);pixelImages[n]=im}return pixelImages[n]}
function pixelDraw(g,n,x,y,w,h){
 const im=pixelImage(n);if(!im.complete||!im.naturalWidth)return false;
 const ratio=Math.min(w/im.naturalWidth,h/im.naturalHeight),dw=im.naturalWidth*ratio,dh=im.naturalHeight*ratio;
 g.save();g.imageSmoothingEnabled=false;g.drawImage(im,Math.round(x-dw/2),Math.round(y-dh/2),Math.round(dw),Math.round(dh));g.restore();return true
}
const petPowers={bat:"🦇 Tiro automático (4s)",ghost:"👻 Raio espectral (5s)",pumpkin:"🎃 Escudo de árvore (12s)",firefly:"✨ +2 mangas de munição (6s)"};
const petSprite={bat:"morceguinho_idle",ghost:"fantasminha_idle",pumpkin:"miniabobora_idle",firefly:"vagalume_idle"};
const petFrames={bat:["morceguinho_idle","morceguinho_voando","morceguinho_ataque"],ghost:["fantasminha_idle","fantasminha_voando","fantasminha_ataque"],pumpkin:["miniabobora_idle","miniabobora_andando","miniabobora_ataque"],firefly:["vagalume_idle","vagalume_voando","vagalume_ataque"]};
function orchardRender(){
 const el=$("orchardExtrasBody");if(!el)return;const v=orchardDaily(orchardRead());orchardSave(v);
 $("orchardWallet").textContent="🌱 "+v.seeds+" sementes · Mascote: "+(orchardCatalog.find(x=>x.id===v.pet)?.name||"Nenhum");
 $("infiniteRecord").textContent="♾️ Melhor Defesa Infinita neste navegador: onda "+(v.best||0);
 document.querySelectorAll("#orchardExtras [data-extras-tab]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.extrasTab===orchardTab)));
 const hero=(img,title)=>`<div class="orchard-hero" style="background-image:url('${pixelAsset(img)}')"><strong>${title}</strong></div>`;
 if(orchardTab==="daily"){
  el.innerHTML=hero("missoes_diarias_conceito","📜 Contratos do Pomar")+orchardTasks.map((t,i)=>{const done=Math.min(t.goal,v.stats[t.id]||0),claimed=v.claimed.includes(t.id);return `<div class="orchard-mission"><img alt="" src="${pixelAsset(["besouro","arvore_saudavel","trofeu","sam_andando_1","rei_das_pragas_completo","manga"][i])}"><div class="mission-info"><b>${t.name}</b><div class="sm">${done}/${t.goal} · 🌱 +${t.reward} sementes</div><div class="orchard-progress"><span style="width:${100*done/t.goal}%"></span></div></div><button type="button" class="btn-gothic alt" data-daily="${t.id}" ${claimed||done<t.goal?"disabled":""}>${claimed?"Resgatada":"Resgatar"}</button></div>`}).join("");
 }else{
  el.innerHTML=hero("loja_pomar_conceito",orchardTab==="pets"?"🐾 Seus companheiros":"🛒 Mercado Assombrado")+`<div class="orchard-grid">`+orchardCatalog.filter(t=>orchardTab!=="pets"||v.owned.includes(t.id)).map(t=>`<div class="orchard-card ${v.pet===t.id?"selected":""}"><div class="pet-stage" aria-label="Animação de ${t.name}"><canvas width="210" height="168" data-pet-stage="${t.id}" role="img" aria-label="${t.name}"></canvas></div><b>${t.name}</b><span class="sm">${t.desc}</span><span class="sm orchard-power">${petPowers[t.id]}</span><span class="sm">${v.owned.includes(t.id)?"✓ Desbloqueado":"🌱 "+t.cost+" sementes"}</span><button type="button" class="btn-gothic alt" data-pet="${t.id}">${v.pet===t.id?"Desequipar":v.owned.includes(t.id)?"Equipar":"Comprar"}</button></div>`).join("")+`</div>`+(orchardTab==="pets"&&!v.owned.length?`<p class="sm">Nenhum mascote desbloqueado ainda. Visite a Loja do Pomar!</p>`:"");
 }
}
function orchardAfterBattle(s,won){if(!me||!prof)return;const v=orchardDaily(orchardRead());v.stats.games++;v.stats.kills+=s.kills||0;v.stats.waves+=s.wave||0;v.stats.dashes+=(s.dashes||0);v.stats.novas+=(s.novas||0);v.stats.combo=Math.max(v.stats.combo||0,s.bestCombo||0);v.seeds+=Math.min(150,Math.floor(s.score/150))+(won?20:0)+(s.bossDefeated?100:0);if(s.mode==="infinite")v.best=Math.max(v.best||0,s.wave);orchardSave(v);orchardRender();toast("🌱 Sementes recebidas! Veja a Loja do Pomar.",3500)}
$("orchardExtras").addEventListener("click",e=>{const tab=e.target.closest("[data-extras-tab]");if(tab){orchardTab=tab.dataset.extrasTab;orchardRender();return}const pet=e.target.closest("[data-pet]");const daily=e.target.closest("[data-daily]");if(!pet&&!daily)return;if(!me||!prof){showGate();return}const v=orchardDaily(orchardRead());if(pet){const item=orchardCatalog.find(x=>x.id===pet.dataset.pet);if(!item)return;if(v.pet===item.id)v.pet="";else if(v.owned.includes(item.id))v.pet=item.id;else if(v.seeds>=item.cost){v.seeds-=item.cost;v.owned.push(item.id);v.pet=item.id}else{toast("Sementes insuficientes.");return}}else{const t=orchardTasks.find(x=>x.id===daily.dataset.daily);if(!t||v.claimed.includes(t.id)||(v.stats[t.id]||0)<t.goal)return;v.claimed.push(t.id);v.seeds+=t.reward;toast("Missão diária concluída! +"+t.reward+" sementes")};orchardSave(v);orchardRender()});
$("gDifficulty").addEventListener("click",()=>orchardRender());
orchardRender();

function gameInit(){loadGRank();sm21JobsSync();if(!gs)drawG()}
function stopGame(){cancelAnimationFrame(gRaf);const was=gs;gs=null;gRun=null;sm17GamePause(false);sm21StrategyUi();sm21JobsSync();if(was){$("gOvT").textContent="Partida interrompida";$("gOvP").textContent="Você saiu no meio do jogo. Essa partida não conta.";$("gOvK").textContent="";$("gPlay").textContent="Jogar de novo";$("gOv").hidden=false}}
async function startGame(){
  if(!me||!prof){showGate();return}
  gRun=null;gPl=null;sm21JobsSync();let note="";
  try{if(gDifficulty==="normal")gRun=await rpc("game_start",{p_handle:me,p_token:tok});else note="Modo "+(gDifficulty==="hard"?"Difícil":"Infinito")+" com recorde local; ranking oficial é do modo Normal."}catch(e){note=e.message==="rate"?"Limite de partidas de hoje atingido. Esta é uma partida de treino.":"Servidor do jogo indisponível. Esta é uma partida de treino e não vale ranking."}
  if($("gameDlg").hidden)return;
  sm21SelectedLane=0;sm21Lanes(gHard()?5:3);
  orchardFX.length=0;
  gs={job:sm21Job,energy:2,towers:[],intermission:2,missed:0,dashCd:0,novaCd:0,dashes:0,novas:0,dashFx:0,novaFx:0,combo:0,bestCombo:0,comboTimer:0,lastDir:1,mode:gDifficulty,kills:0,boss:null,bossDefeated:false,x:GW/2,ammo:gHard()?24:12,stun:0,hp:gHard()?5:3,trees:Array(gHard()?5:3).fill(true),treeHits:Array(gHard()?5:3).fill(0),hard:gHard(),score:0,wave:1,wt:0,t:0,sp:0,ft:0,reg:0,petId:orchardRead().pet,petCooldown:2,petFlash:0,playerMaxHp:gHard()?8:6,playerHp:gHard()?8:6,invuln:0,bossShots:[],sh:[],pe:[],it:[]};
  if(gs.job==='guardian')gs.shield=(gs.shield||0)+1;
  // Housing provides perks in unranked training only.
  if(gDifficulty!=='normal'){
    const bonus=window.Sam21House?.getTrainingBonus?.()||{};
    if(bonus.table)gs.ammo=Math.min(gs.ammo+3,gHard()?26:12);
    if(bonus.fireplace)gs.shield=(gs.shield||0)+1;
    if(bonus.bed)gs.playerHp=Math.min(gs.playerMaxHp,gs.playerHp+1);
  }
  $("gOv").hidden=true;sm17GamePause(false);sm21StrategyUi();if(note)toast(note,5000);
  gLast=performance.now();cancelAnimationFrame(gRaf);gRaf=requestAnimationFrame(loop);
}
function loop(t){
  if(!gs)return;
  if(sm17GamePaused || document.hidden){gLast=t;gRaf=requestAnimationFrame(loop);return}
  const dt=Math.min(.05,(t-gLast)/1000);gLast=t;
  if(!stepG(dt))return;
  drawG();gRaf=requestAnimationFrame(loop);
}
function stepG(dt){
  const s=gs;orchardUpdateFX(dt);s.dashCd=Math.max(0,s.dashCd-dt);s.novaCd=Math.max(0,s.novaCd-dt);s.dashFx=Math.max(0,s.dashFx-dt);s.novaFx=Math.max(0,s.novaFx-dt);s.comboTimer=Math.max(0,s.comboTimer-dt);if(!s.comboTimer)s.combo=0;s.bestCombo=Math.max(s.bestCombo||0,s.combo||0);const dashButton=$("sm20Dash"),novaButton=$("sm20Nova");if(dashButton){dashButton.disabled=s.dashCd>0;$("sm20DashCd").textContent=s.dashCd>0?s.dashCd.toFixed(1)+"s":"Pronto"}if(novaButton){novaButton.disabled=s.novaCd>0||s.ammo<3;$("sm20NovaCd").textContent=s.novaCd>0?s.novaCd.toFixed(1)+"s":s.ammo<3?"3 mangas":"Pronto"}$("sm20Combo").textContent="Combo x"+(1+Math.min(3,Math.floor((s.combo||0)/5)));s.intermission=Math.max(0,(s.intermission||0)-dt);sm21TacticsTick(s,dt);s.strategyUpdate=(s.strategyUpdate||0)-dt;if(s.strategyUpdate<=0){s.strategyUpdate=.2;sm21StrategyUi()}s.t+=dt;if(!s.intermission)s.wt+=dt;s.ft-=dt;s.stun-=dt;s.reg+=dt;s.petCooldown-=dt;s.petFlash=Math.max(0,(s.petFlash||0)-dt);if(s.petEffect)s.petEffect.ttl=Math.max(0,s.petEffect.ttl-dt);s.invuln=Math.max(0,(s.invuln||0)-dt);
  if(s.wt>= (s.hard?18:15)){
    if((s.mode==="hard"&&s.wave===10||s.mode==="normal"&&s.wave===5)&&!s.bossDefeated){s.wt=19.5;}
    else {s.score+=s.hard?100:50;sfx(880,.25);if(s.mode!=="infinite"&&s.wave>=(s.hard?10:5)){endG(true);return false}s.wave++;s.wt=0;s.energy=Math.min(12,s.energy+2);s.intermission=3.5;toast('🌙 Próxima onda! +2 energias. Planeje suas rotas.',2500)}
  }
  if((s.mode==="hard"&&s.wave===10||s.mode==="normal"&&s.wave===5)&&!s.boss&&!s.bossDefeated&&s.wt>=2){const hp=s.hard?12:6;s.boss={x:GW/2,y:s.hard?210:178,hp,max:hp,attack:7,hit:0};toast('👑 O Rei das Pragas chegou! Acerte-o '+hp+' vezes!',4500)}
  if(s.boss){s.boss.x=GW/2+Math.sin(s.t*.9)*GW*.22;s.boss.attack-=dt;s.boss.hit=Math.max(0,(s.boss.hit||0)-dt);if(s.boss.attack<=0){s.boss.attack=4.5;const dx=s.x-s.boss.x,dy=GH-90-s.boss.y,len=Math.hypot(dx,dy)||1;for(const offset of [-.20,0,.20]){const a=Math.atan2(dy,dx)+offset;s.bossShots.push({x:s.boss.x,y:s.boss.y+35,vx:Math.cos(a)*195,vy:Math.sin(a)*195,r:11})}orchardBurst(s.boss.x,s.boss.y+40,"#d58aff",1.1,"ATAQUE!");sfx(180,.14)}}
  if(s.reg>=.72){s.reg=0;s.ammo=Math.min(s.hard?26:12,s.ammo+1)}
  const sp=s.stun>0?110:(s.hard?270:220)*(s.job==='ranger'?1.16:1),dir=(K.r?1:0)-(K.l?1:0);if(dir)s.lastDir=dir;s.x=Math.max(38,Math.min(GW-38,s.x+dir*sp*dt));
  if(K.f&&s.ft<=0&&s.ammo>0&&s.stun<=0){s.ft=(s.hard?.13:.22)*(s.job==='ranger'?.76:1);s.ammo--;s.sh.push({x:s.x,y:GH-100,vy:-500,trail:0});orchardBurst(s.x,GH-104,"#ffcf55",.27);sfx(660,.06)}
  s.sp-=dt;
  if(s.sp<=0&&!s.intermission){
    s.sp=s.hard?Math.max(.42,.98-s.wave*.047)/.7:Math.max(.6,1.5-s.wave*.15);const x=38+Math.random()*(GW-76),r=Math.random();
    if(r<.182)s.it.push({x,y:-10,vy:65,k:"m"});
    else if(r<.182+.045+s.wave*.009)s.it.push({x,y:-10,vy:90,k:"r"});
    else{const beetle=s.hard?(Math.random()<Math.min(.64,.25+s.wave*.038)):(s.wave>=3&&Math.random()<.3);const runner=!beetle&&s.wave>=3&&Math.random()<.26;
 const healer=s.hard&&s.wave>=4&&!beetle&&!runner&&Math.random()<.19;
 const spore=!beetle&&!runner&&!healer&&s.wave>=2&&Math.random()<.18;
 const hp=healer?3:beetle?2:1;
 s.pe.push({x,y:-10,originX:x,phase:Math.random()*6.28,vy:(s.hard?49+s.wave*9:34+s.wave*9)*(runner?1.65:healer?.72:spore?.85:1),hp,maxHp:hp,healCd:healer?2.1:0,kind:beetle?'beetle':runner?'runner':healer?'healer':spore?'spore':'larva'})}
  }
  // Mascotes com poderes reais; todos funcionam apenas quando equipados.
  if(s.petId&&s.petCooldown<=0){
   const id=s.petId; s.petCooldown={bat:4,ghost:5,pumpkin:12,firefly:6}[id]||5;s.petFlash=.55;s.petEffect={id,ttl:.55,x:s.x+(s.x>GW*.66?-45:45),y:GH-132,tx:s.x,ty:GH-128};
   if(id==="firefly"){s.ammo=Math.min(s.hard?26:12,s.ammo+2);orchardBurst(s.x+42,GH-120,"#d8ff81",.6,"+2 🥭")}
   if(id==="pumpkin"){if(s.petEffect){s.petEffect.tx=GW*(.5)/s.trees.length;s.petEffect.ty=GH-104;}s.shield=(s.shield||0)+1;orchardBurst(s.x+42,GH-120,"#ffc26a",.7,"ESCUDO")}
   if(id==="bat"||id==="ghost"){
    const target=s.pe.filter(p=>!p.dead).sort((a,b)=>b.y-a.y)[0];if(target&&s.petEffect){s.petEffect.tx=target.x;s.petEffect.ty=target.y;}else if(s.boss&&s.petEffect){s.petEffect.tx=s.boss.x;s.petEffect.ty=s.boss.y;}
    if(target){const damage=id==="ghost"?2:1;target.hp-=damage;target.hit=.32;orchardBurst(target.x,target.y,id==="ghost"?"#d7b0ff":"#ffd67e",1.1,"-"+damage);if(target.hp<=0){target.dead=1;s.kills++;s.combo=(s.combo||0)+1;s.comboTimer=5;s.score+=s.hard?20:10}}
    else if(s.boss){s.boss.hp-=1;s.boss.hit=.3;orchardBurst(s.boss.x,s.boss.y,"#d9b0ff",1,"-1");if(s.boss.hp<=0){s.boss=null;s.bossDefeated=true;s.score+=1500;toast("👑 Rei das Pragas derrotado!",3500)}}
    }
   }
  s.sh.forEach(b=>{b.y+=b.vy*dt;b.trail=(b.trail||0)+dt;if(b.trail>.055){b.trail=0;orchardFX.push({x:b.x+(Math.random()-.5)*8,y:b.y+9,vx:(Math.random()-.5)*18,vy:30,life:.18,max:.18,c:"#ffc45e",size:3})}});s.sh=s.sh.filter(b=>b.y>-10);
  s.pe.forEach(p=>{p.slow=Math.max(0,(p.slow||0)-dt);p.rooted=Math.max(0,(p.rooted||0)-dt);p.y+=p.vy*dt*(p.rooted>0?0:p.slow>0?.38:1);if(p.kind==="spore")p.x=Math.max(30,Math.min(GW-30,(p.originX||p.x)+Math.sin(s.t*2.7+p.phase)*27));p.hit=Math.max(0,(p.hit||0)-dt)});sm24HealTick(s,dt);s.it.forEach(i=>i.y+=i.vy*dt);
  s.bossShots.forEach(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt});
  s.bossShots=s.bossShots.filter(b=>{if(Math.hypot(b.x-s.x,b.y-(GH-90))<b.r+19){orchardHurtPlayer(s,2,b.x,b.y,"REI DAS PRAGAS");return false}return b.y<GH+25&&b.x>-25&&b.x<GW+25});
  s.pe.forEach(p=>{if(!p.dead&&Math.hypot(p.x-s.x,p.y-(GH-90))<(p.kind==="beetle"?39:34)){orchardHurtPlayer(s,p.kind==="beetle"?2:1,p.x,p.y,p.kind==="beetle"?"BESOURO":"LARVA");p.dead=true}});
  for(const b of s.sh)for(const p of s.pe)if(!b.d&&!p.dead&&near(b,p,p.kind==="beetle"?37:32)){b.d=1;p.hit=.2;p.y-=5;orchardBurst(p.x,p.y,p.kind==="beetle"?"#b9ff79":"#ffcf73",1.35,"-1");if(--p.hp<=0){p.dead=1;s.kills++;s.energy=Math.min(12,s.energy+1);s.score+=s.hard?20:10;sfx(330,.08)}}
  if(s.boss)for(const b of s.sh)if(!b.d&&Math.abs(b.x-s.boss.x)<53&&Math.abs(b.y-s.boss.y)<42){b.d=1;s.boss.hp--;s.boss.hit=.28;orchardBurst(b.x,b.y,"#e0a5ff",1.5,"-1");s.score+=30;sfx(490,.07);if(s.boss.hp<=0){orchardBurst(s.boss.x,s.boss.y,"#ffdd83",4,"REI DERROTADO!");s.boss=null;s.bossDefeated=true;s.score+=s.hard?1500:180;toast("👑 Rei das Pragas derrotado!",4500);break}}
  s.sh=s.sh.filter(b=>!b.d);
  s.pe=s.pe.filter(p=>{if(p.dead)return false;if(p.y>GH-60){const alive=s.trees.map((ok,i)=>ok?i:-1).filter(i=>i>=0);if(alive.length){const lane=Math.max(0,Math.min(s.trees.length-1,Math.floor(p.x/GW*s.trees.length)));const target=s.trees[lane]?lane:alive.reduce((best,i)=>Math.abs(i-lane)<Math.abs(best-lane)?i:best,alive[0]);if((s.shield||0)>0){s.shield--;orchardBurst(GW*(target+.5)/s.trees.length,GH-72,"#ffcf70",.9,"DEFESA!")}
      else if(!s.hard||p.kind==="beetle"||(s.treeHits[target]=(s.treeHits[target]||0)+1)>=2){s.trees[target]=false;s.hp=s.trees.filter(Boolean).length}} sfx(120,.25);return false}return true});
  const me2={x:s.x,y:GH-90};
  s.it=s.it.filter(i=>{if(near(i,me2,s.petId==="firefly"?72:40)){if(i.k==="m"){s.playerHp=Math.min(s.playerMaxHp,s.playerHp+2);s.ammo=Math.min(s.hard?26:12,s.ammo+4);s.score+=s.hard?15:8;orchardBurst(i.x,i.y,"#a5ff91",.85,"+2 VIDA");sfx(990,.08)}else{orchardHurtPlayer(s,1,i.x,i.y,"PEDRA");s.stun=.45;sfx(100,.3)}return false}return i.y<GH});
  if(s.hp<=0||s.playerHp<=0){endG(false);return false}
  return true;
}
// Vida independente do personagem: árvores e personagem têm condições de derrota separadas.
function orchardHurtPlayer(s,amount,x,y,source){
 if(s.invuln>0||s.playerHp<=0)return;
 s.playerHp=Math.max(0,s.playerHp-amount);s.invuln=1.05;s.stun=Math.max(s.stun,.2);
 orchardBurst(x,y,"#ff718e",1.2,"-"+amount+" ❤");sfx(130,.14);
 if(s.playerHp===0)toast("💔 Sam ficou sem vida!",2300);
}
// Impactos estilo RPG: partículas, números de dano e flashes sem imagens cortadas.
const orchardFX=[];
function orchardBurst(x,y,color="#ffeaa2",power=1,damage=""){
 const count=document.documentElement.classList.contains('sm165-lowfx')||matchMedia('(prefers-reduced-motion: reduce)').matches?Math.min(4,Math.round(11*power)):Math.round(11*power);for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,v=(40+Math.random()*110)*power;orchardFX.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-20,life:.25+Math.random()*.24,max:.49,c:color,size:2+Math.random()*4})}
 if(damage)orchardFX.push({x,y:y-14,vx:0,vy:-48,life:.6,max:.6,c:"#fff5d0",label:damage});
}
function orchardUpdateFX(dt){for(let i=orchardFX.length-1;i>=0;i--){const p=orchardFX[i];p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=100*dt;if(p.life<=0)orchardFX.splice(i,1)}}
function orchardDrawFX(g){g.save();for(const p of orchardFX){g.globalAlpha=Math.min(1,p.life/(p.max||.5));if(p.label){g.textAlign="center";g.font="bold 17px monospace";g.fillStyle="#291321";g.fillText(p.label,p.x+1,p.y+2);g.fillStyle=p.c;g.fillText(p.label,p.x,p.y)}else{g.fillStyle=p.c;g.fillRect(Math.round(p.x),Math.round(p.y),Math.ceil(p.size),Math.ceil(p.size))}}g.restore()}

function drawG(){
  const g=gx,s=gs||{x:GW/2,ammo:10,hp:gHard()?5:3,trees:Array(gHard()?5:3).fill(true),treeHits:Array(gHard()?5:3).fill(0),hard:gHard(),score:0,wave:1,sh:[],pe:[],it:[],stun:0,ft:0,playerMaxHp:gHard()?8:6,playerHp:gHard()?8:6,bossShots:[],invuln:0,t:0};
  const t=s.t||0;
  v11Backdrop(g,t,GW,GH);
  // Camadas de atmosferas: nuvens suaves, pétalas e vaga-lumes em paralaxe.
  g.save();const lowFX=document.documentElement.classList.contains("sm165-lowfx")||matchMedia("(prefers-reduced-motion: reduce)").matches;for(let i=0;i<(lowFX?6:24);i++){const x=((i*97.7+t*(9+i%3*6))%(GW+45))-20,y=90+(i*79)%(GH-150);g.globalAlpha=.12+.14*Math.sin(t*1.1+i)*Math.sin(t*1.1+i);g.fillStyle=i%3===0?"#f8b8ce":i%3===1?"#deec9f":"#85dcd9";g.fillRect(x,y,2+(i%3),2+(i%3))}g.restore();
  g.textAlign='center';g.textBaseline='middle';g.imageSmoothingEnabled=false;
  // Bottom-anchored trees: roots never run below the canvas, unlike V10.
  Array.from({length:s.trees.length},(_,i)=>GW*(i+.5)/s.trees.length).forEach((x,i)=>{
    const alive=s.trees[i];const variant=!alive?'arvore_destruida':s.hard&&s.treeHits&&s.treeHits[i]>0?'arvore_danificada':'arvore_saudavel';
    const sway=alive?Math.sin(t*.85+i*.92)*.018:0;
    if(!sm24DrawSprite(g,variant,x,GH-19,s.hard?98:117,s.hard?114:126,t,true)&&!v11Draw(g,variant,x,GH-19,s.hard?98:117,s.hard?114:126,{anchor:'bottom',rotate:sway})){
      const c=alive?treeCv():spr('stump');const k=alive?2.6:3;g.drawImage(c,x-c.width*k/2,GH-16-c.height*k,c.width*k,c.height*k)
    }
    // Shield around vulnerable tree during pumpkin power.
    if(alive&&s.shield>0&&s.petId==='pumpkin'){
      g.save();g.strokeStyle='#eab365';g.globalAlpha=.4+.2*Math.sin(t*4+i);g.lineWidth=2;
      g.beginPath();g.ellipse(x,GH-90,s.hard?42:46,63,0,0,Math.PI*2);g.stroke();g.restore();
    }
  });
  if(s.boss){
    const b=s.boss,pulse=Math.sin(t*3),hit=Math.max(0,b.hit||0),attack=(b.attack||0)<1;
    g.save();g.globalAlpha=.3;g.fillStyle='#6d2c8a';g.beginPath();g.ellipse(b.x,b.y+74,78,9,0,0,Math.PI*2);g.fill();g.restore();
    if(attack){g.save();g.globalAlpha=.18+.12*Math.sin(t*22);g.fillStyle='#ff7e26';g.beginPath();g.arc(b.x,b.y,104,0,Math.PI*2);g.fill();g.restore()}
    const shake=hit>0?Math.sin(t*76)*4*hit/.3:0;
    sm24DrawSprite(g,'rei_pragas',b.x+shake,b.y+Math.sin(t*2.4)*2,195,166,t)||v11Draw(g,'rei_das_pragas_completo',b.x+shake,b.y+Math.sin(t*2.4)*2,195,166,{scale:1+Math.sin(t*2.2)*.018,rotate:attack?Math.sin(t*15)*.018:0,alpha:hit>0?.85:1});
    if(hit>0){g.save();g.globalAlpha=.12*hit/.3;g.fillStyle='#fff9ff';g.beginPath();g.ellipse(b.x,b.y,98,75,0,0,Math.PI*2);g.fill();g.restore()}
    const barw=116,y=b.y-94;g.fillStyle='#160f20';g.fillRect(b.x-barw/2-2,y-2,barw+4,12);
    g.fillStyle='#9b3157';g.fillRect(b.x-barw/2,y,barw,8);g.fillStyle='#9dff95';g.fillRect(b.x-barw/2,y,barw*Math.max(0,b.hp/b.max),8);
    g.fillStyle='#fff0dc';g.font='bold 13px sans-serif';g.fillText('REI DAS PRAGAS',b.x,y-12);
  }
  s.pe.forEach(p=>{
    const beetle=p.kind==='beetle',sz=beetle?63:56;
    const bob=Math.sin(t*8+p.x*.07)*2;
    g.save();g.fillStyle='#06150c88';g.beginPath();g.ellipse(p.x,p.y+sz*.40,sz*.35,4,0,0,Math.PI*2);g.fill();
    if(p.hit>0){g.shadowColor='#fff5bb';g.shadowBlur=12;g.globalAlpha=.76+Math.sin(t*64)*.2}
    if(sm24DrawSprite(g,p.kind==='runner'?'praga_corredor':p.kind==='beetle'?'praga_besouro':p.kind==='spore'?'praga_esporo':p.kind==='healer'?'praga_curandeira':'praga_larva',p.x,p.y+bob,sz,sz,t)){}else if(p.kind==='runner'&&sm22RunnerSprite.complete&&sm22RunnerSprite.naturalWidth){
      g.imageSmoothingEnabled=false;g.drawImage(sm22RunnerSprite,(lowFX?0:Math.floor(t*9+p.phase)%4)*48,0,48,48,p.x-sz/2,p.y+bob-sz/2,sz,sz);
    }else if(!v11Draw(g,beetle?'besouro':p.kind==='spore'?'esporo_v20':'larva_pequena',p.x,p.y+bob,sz,sz)){
      const fallback=spr(beetle?'beetle':'pest');g.drawImage(fallback,p.x-20,p.y+bob-20,40,40)
    }
    g.restore();
  });
  (s.bossShots||[]).forEach(b=>{g.save();g.shadowColor='#bb70ff';g.shadowBlur=14;g.fillStyle='#a14cfc';g.beginPath();g.arc(b.x,b.y,b.r,0,Math.PI*2);g.fill();g.fillStyle='#fff2fb';g.fillRect(b.x-3,b.y-3,6,6);g.restore()});
  s.it.forEach(i=>v11Draw(g,i.k==='m'?'manga':'semente',i.x,i.y,34,38));
  s.sh.forEach(b=>{g.save();g.globalAlpha=.26;g.fillStyle='#fdaf44';g.fillRect(b.x-3,b.y+6,6,18);g.restore();v11Draw(g,'manga',b.x,b.y,22,28)});
  g.save();g.globalAlpha=s.invuln>0&&Math.floor(t*13)%2===0?.46:s.stun>0?.7:1;
  const moving=(K.r?1:0)-(K.l?1:0),shooting=(s.ft||0)>.075;
  const playerName=shooting?'sam_atacando':moving?'sam_andando_1':'sam_idle';
  v11Draw(g,playerName,s.x,GH-36+Math.sin(t*9)*Math.abs(moving)*1.2,65,70,{anchor:'bottom',rotate:moving*.025});
  g.restore();
  const pet=orchardCatalog.find(x=>x.id===s.petId);
  if(pet){
    const id=pet.id,petx=s.x+(s.x>GW*.66?-45:45)+Math.sin(t*1.8)*5,pety=GH-132+Math.sin(t*3.5+1)*5;
    const arr=s.petFlash>.06?[petFrames[id][2]]:v11StageFrames[id];
    g.save();
    const shadowColor={bat:'#ba70f2',ghost:'#85eafa',pumpkin:'#ffb45a',firefly:'#e4ff9a'}[id];
    g.globalAlpha=.25+.12*Math.sin(t*3);g.fillStyle=shadowColor;g.beginPath();g.ellipse(petx,pety+7,34,31,0,0,Math.PI*2);g.fill();g.restore();
    v11Frame(g,arr,t+id.length*.13,4.2,petx,pety,id==='bat'?80:70,id==='bat'?70:71,{rotate:Math.sin(t*3)*.045,scale:s.petFlash>.06?1.12:1});
  }
  sm21DrawTowers(g,s,t);
  v11Magic(g,s);
  if(s.novaFx>0){g.save();g.strokeStyle="#bda5ff";g.shadowColor="#9bdfff";g.shadowBlur=24;g.lineWidth=4;g.globalAlpha=Math.min(1,s.novaFx/.35);g.beginPath();g.arc(s.x,GH-135,154*(1-s.novaFx/.65),0,Math.PI*2);g.stroke();g.restore()}
  if(s.dashFx>0){g.save();g.strokeStyle="#72e6e6";g.globalAlpha=Math.min(1,s.dashFx/.35);for(let i=0;i<4;i++){g.beginPath();g.moveTo(s.x-(s.lastDir||1)*(15+i*12),GH-108+i*7);g.lineTo(s.x-(s.lastDir||1)*(36+i*12),GH-108+i*7);g.stroke()}g.restore()}
  orchardDrawFX(g);
  // HUD: warm, crisp panels; keep the text within the canvas in both modes.
  g.save();g.fillStyle='#08131bd8';g.fillRect(5,3,GW-10,s.hard?92:72);
  g.fillStyle='#f4e9ca';g.font='bold 13px sans-serif';g.textAlign='left';
  g.fillText((s.hard?'DIFÍCIL · ':'')+'Pontos '+s.score+' · Onda '+s.wave+(s.mode==='infinite'?'∞':'/'+(s.hard?10:5))+' · 🥭 '+s.ammo,12,17);
  g.font='12px sans-serif';g.fillText('Árvores: '+s.hp+'/'+s.trees.length+(s.shield?' · Escudos: '+s.shield:''),12,37);
  const hp=Math.max(0,s.playerHp??s.playerMaxHp??6),maxHp=s.playerMaxHp||6;
  const barY=s.hard?68:47;g.fillStyle='#251523';g.fillRect(10,barY,150,18);
  g.fillStyle=hp/maxHp>.35?'#e65a7a':'#ff8d45';g.fillRect(13,barY+3,144*hp/maxHp,12);
  g.strokeStyle='#f4cb9e';g.lineWidth=1.4;g.strokeRect(10,barY,150,18);
  g.fillStyle='#fff';g.font='bold 11px sans-serif';g.fillText('❤ '+hp+'/'+maxHp,20,barY+9);
  g.font='bold 11px sans-serif';g.fillStyle='#f5e4ac';g.fillText('✦ '+(s.energy||0)+' ENERGIA',GW-118,barY+10);
  if(s.hard&&s.treeHits){g.font='11px sans-serif';g.fillText('Larvas: 2 mordidas · Besouros: 1',12,89)}
  g.restore();
}


// ===== V11 — animação contínua, recorte visual de alfa em memória, sem alterar o PNG =====
const v11AlphaBounds = Object.create(null);
const v11PreviewKey = Object.create(null);
const v11StageFrames = {
  bat:['morceguinho_idle','morceguinho_voando'],
  ghost:['fantasminha_idle','fantasminha_voando'],
  pumpkin:['miniabobora_idle','miniabobora_andando'],
  firefly:['vagalume_idle','vagalume_voando']
};
function v11Bounds(n){
  if(v11AlphaBounds[n])return v11AlphaBounds[n];
  const im=pixelImage(n);if(!im.complete||!im.naturalWidth)return null;
  try{
    const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;
    const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(im,0,0);
    const a=ctx.getImageData(0,0,c.width,c.height).data;
    let left=c.width,top=c.height,right=-1,bottom=-1;
    // Ignore semitransparent fringe, but keep tips, wings, leaves and roots.
    for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){
      if(a[(y*c.width+x)*4+3]>18){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y)}
    }
    if(right<0)return null;
    return v11AlphaBounds[n]={sx:Math.max(0,left-3),sy:Math.max(0,top-3),sw:Math.min(c.width,right+4)-Math.max(0,left-3),sh:Math.min(c.height,bottom+4)-Math.max(0,top-3)};
  }catch(e){return v11AlphaBounds[n]={sx:0,sy:0,sw:im.naturalWidth,sh:im.naturalHeight}}
}
function v11Draw(g,n,cx,cy,w,h,opts={}){
  const im=pixelImage(n);if(!im.complete||!im.naturalWidth)return false;
  const bb=v11Bounds(n);if(!bb)return false;
  const factor=Math.min(w/bb.sw,h/bb.sh);
  const dw=bb.sw*factor,dh=bb.sh*factor;
  g.save();g.imageSmoothingEnabled=false;
  if(opts.alpha!=null)g.globalAlpha*=opts.alpha;
  g.translate(cx,cy);
  if(opts.rotate)g.rotate(opts.rotate);
  if(opts.flip)g.scale(-1,1);
  if(opts.scale)g.scale(opts.scale,opts.scale);
  let dx=-dw/2,dy=opts.anchor==='bottom'?-dh: -dh/2;
  if(opts.anchor==='top')dy=0;
  g.drawImage(im,bb.sx,bb.sy,bb.sw,bb.sh,dx,dy,dw,dh);
  g.restore();return true;
}
function v11Ease(a){return a*a*(3-2*a)}
function v11Frame(g,names,phase,fps,x,y,w,h,opts={}){
  const n=names.length,frame=phase*fps,idx=Math.floor(frame)%n,lerp=frame-Math.floor(frame);
  const oldName=names[(idx+n-1)%n],newName=names[idx];
  // Fast cross dissolve immediately after an animation's frame boundary.
  const blend=v11Ease(Math.min(1,lerp/.30));
  if(blend<1)v11Draw(g,oldName,x,y,w,h,{...opts,alpha:1-blend});
  v11Draw(g,newName,x,y,w,h,{...opts,alpha:blend});
}
function v11Backdrop(g,t,gw,gh){
  if(!v11Backdrop.cache ||v11Backdrop.w!==gw||v11Backdrop.h!==gh){
    const c=document.createElement('canvas');c.width=gw;c.height=gh;
    const b=c.getContext('2d');const grd=b.createLinearGradient(0,0,0,gh);
    grd.addColorStop(0,'#0c142d');grd.addColorStop(.42,'#15233c');grd.addColorStop(.79,'#19472c');grd.addColorStop(1,'#12381f');
    b.fillStyle=grd;b.fillRect(0,0,gw,gh);
    b.fillStyle='#ffffff11';for(let i=0;i<30;i++){let x=(i*59+23)%gw,y=24+(i*47)%(gh*.38);b.fillRect(x,y,1+(i%2),1+(i%2))}
    b.fillStyle='#e7cd9d34';b.beginPath();b.arc(gw*.83,gh*.13,25,0,Math.PI*2);b.fill();
    b.fillStyle='#142b29';b.beginPath();b.moveTo(0,gh*.75);
    for(let x=0;x<=gw;x+=8)b.lineTo(x,gh*.74+Math.sin(x*.025)*8);
    b.lineTo(gw,gh);b.lineTo(0,gh);b.fill();
    b.fillStyle='#204d2b';b.fillRect(0,gh-39,gw,39);
    for(let i=0;i<85;i++){const x=(i*43+31)%gw,y=gh-7-(i*17)%32;b.fillStyle=(i%3===0?'#60a34d3a':'#a9cb5c33');b.fillRect(x,y,2+(i%3),1+(i%2))}
    v11Backdrop.cache=c;v11Backdrop.w=gw;v11Backdrop.h=gh;
  }
  g.drawImage(v11Backdrop.cache,0,0);
  // Gentle animated fireflies. No random allocation per frame.
  g.save();for(let i=0;i<9;i++){
    const x=(i*73+17+Math.sin(t*.27+i)*8)%gw,y=gh*.60+Math.sin(i*2.3+t*.7)*18;
    g.globalAlpha=.24+.28*(.5+.5*Math.sin(t*2+i*3));g.fillStyle='#e3ef93';g.fillRect(x,y,2,2);
  }g.restore();
}
function v11Magic(g,s){
  const fx=s.petEffect;if(!fx || fx.ttl<=0)return;
  const fraction=1-fx.ttl/.55,scale=Math.min(1,Math.max(0,fraction));
  const tx=fx.tx??fx.x,ty=fx.ty??fx.y;
  g.save();g.globalAlpha=.85*(1-scale*.65);
  if(fx.id==='ghost'){
    const x=fx.x,y=fx.y;
    g.lineCap='round';
    g.strokeStyle='#1339ae';g.lineWidth=17*(1-scale)+3;g.beginPath();g.moveTo(x,y);g.lineTo(tx,ty);g.stroke();
    g.strokeStyle='#76f5ff';g.lineWidth=9*(1-scale)+2;g.beginPath();g.moveTo(x,y);g.lineTo(tx,ty);g.stroke();
    g.strokeStyle='#f6ffff';g.lineWidth=3;g.beginPath();g.moveTo(x,y);g.lineTo(tx,ty);g.stroke();
    for(let i=0;i<6;i++){const k=(i/6+scale)%1;g.fillStyle=i%2?'#a4ffff':'#d7bdff';g.fillRect(x+(tx-x)*k-2,y+(ty-y)*k+Math.sin(k*14)*5,5,5)}
  }else if(fx.id==='bat'){
    for(let i=0;i<3;i++){g.strokeStyle=i%2?'#d4adff':'#9e56ff';g.lineWidth=4-i*.5;g.beginPath();g.arc(tx,ty,(i+1)*13+scale*43,Math.PI*.2,Math.PI*1.8);g.stroke()}
    g.fillStyle='#f6b2ff';g.beginPath();g.arc(tx,ty,8*(1-scale)+2,0,Math.PI*2);g.fill();
  }else if(fx.id==='pumpkin'){
    const cx=fx.tx??GW*.5,cy=fx.ty??GH-110;
    g.strokeStyle='#ffc76e';g.lineWidth=7*(1-scale)+2;
    g.beginPath();g.arc(cx,cy,24+38*scale,0,Math.PI*2);g.stroke();
    g.strokeStyle='#c8fa9d';g.lineWidth=2;g.beginPath();g.arc(cx,cy,14+32*scale,0,Math.PI*2);g.stroke();
  }else if(fx.id==='firefly'){
    for(let i=0;i<9;i++){const a=(i/9)*Math.PI*2+scale*3,r=12+48*scale;
      g.fillStyle=i%2?'#ffe483':'#b7f86a';g.beginPath();g.arc(fx.x+Math.cos(a)*r,fx.y+Math.sin(a)*r,3+3*(1-scale),0,Math.PI*2);g.fill();
    }
  }
  g.restore();
}
function v11ShopPreviews(t){
  const cards=document.querySelectorAll('canvas[data-pet-stage]');
  const panel=document.querySelector('#orchardExtras');
  const pr=panel?panel.getBoundingClientRect():null;
  const visible=pr&&pr.bottom>=0&&pr.top<window.innerHeight;
  if(cards.length && !document.hidden && visible && (!v11ShopPreviews.prev || t-v11ShopPreviews.prev>45)){
    v11ShopPreviews.prev=t;cards.forEach(c=>{
    if(!c.isConnected ||c.closest('[hidden]'))return;
    const id=c.dataset.petStage,names=v11StageFrames[id];if(!names)return;
    const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
    const phase=t*.001;
    const glow={bat:'#ad5cff',ghost:'#8defff',pumpkin:'#ffc160',firefly:'#ceff79'}[id];
    const cg=ctx.createRadialGradient(c.width/2,c.height*.62,5,c.width/2,c.height*.62,c.height*.52);
    cg.addColorStop(0,glow+'55');cg.addColorStop(1,glow+'00');ctx.fillStyle=cg;ctx.fillRect(0,0,c.width,c.height);
    const bob=Math.sin(phase*2.2+id.length)*5;
    const sway=Math.sin(phase*2.4+id.length)*.03;
    v11Frame(ctx,names,phase+id.length*.2,3.3,c.width/2,c.height*.54+bob,c.width*.78,c.height*.83,{rotate:sway});
  });}
  requestAnimationFrame(v11ShopPreviews);
}
requestAnimationFrame(v11ShopPreviews);
function v11Preload(){
  ['rei_das_pragas_completo','arvore_saudavel','arvore_danificada','arvore_destruida',
   'sam_idle','sam_andando_1','sam_atacando','manga','semente','besouro','larva_pequena','esporo_v20',
   ...Object.values(petFrames).flat()].forEach(n=>pixelImage(n));
}
v11Preload();


async function endG(won){
  const s=gs;cancelAnimationFrame(gRaf);
  if(won)s.score+=Math.max(0,s.hp)*(s.hard?200:100);
  drawG();gs=null;sm17GamePause(false);sm21StrategyUi();sm21JobsSync();sfx(won?1200:150,.4);
  orchardAfterBattle(s,won);try{window.SamHybridRPG?.onDefenseResult?.(won)}catch(ex){}
  $("gOvT").textContent=won?"Vitória! O pomar está salvo":"As pragas venceram";
  $("gOvP").textContent=(s.mode==="infinite"?"Defesa Infinita · ":s.hard?"Modo Difícil · ":"")+"Pontuação: "+s.score+" (onda "+s.wave+(s.mode==="infinite"?"": " de "+(s.hard?10:5))+").";
  $("gOvK").textContent=s.mode==="infinite"?"Recorde infinito salvo localmente; não conta no ranking oficial.":gRun?"Salvando seu resultado…":"Partida de treino: não conta no ranking.";
  $("gPlay").textContent="Jogar de novo";$("gOv").hidden=false;
  if(!gRun){window.dispatchEvent(new CustomEvent("sm18:defense-ended",{detail:{won:!!won,score:s.score,wave:s.wave,ranked:false}}));return;}
  try{
    const r=await rpc("game_finish",{p_handle:me,p_token:tok,p_run:gRun,p_score:s.score,p_wave:s.wave,p_won:!!won});
    $("gOvK").textContent="Seu recorde: "+r.best+(r.mangoes?". Recompensa: +"+r.mangoes+" mangas e +"+r.xp+" XP.":". Esta partida não rendeu recompensa (precisa de 300 pontos e vale 3 vezes por dia).");
    if(r.mangoes)refreshBon();
    window.dispatchEvent(new CustomEvent("sm18:defense-ended",{detail:{won:!!won,score:s.score,wave:s.wave,ranked:true}}));
    loadGRank();
  }catch(e){$("gOvK").textContent=e.message==="invalid"?"Resultado recusado pelo servidor.":"Não consegui salvar o resultado agora."}
  gRun=null;
}
async function loadGRank(){
  const el=$("gRank");
  try{const v=await rpc("game_ranking");el.innerHTML=v.map((r,i)=>`<li class="${r.handle===me?"me":""}"><span class="pos"><b>${i+1}</b></span><span class="nm">@${esc(r.handle)}</span><span class="ct">${+r.best}</span><span class="lv">Onda ${+r.wave}</span></li>`).join("")||'<li class="state">Nenhum recorde ainda. Seja o primeiro!</li>'}
  catch(e){el.innerHTML='<li class="state">Não consegui carregar os recordes.</li>'}
}
$("gPlay").onclick=startGame;$("gBack").onclick=()=>showPane("home");
const KM={ArrowLeft:"l",a:"l",A:"l",ArrowRight:"r",d:"r",D:"r"," ":"f"};
addEventListener("keydown",e=>{if(!gs||sm17GamePaused||e.repeat||e.target.closest?.("input,textarea,select,[contenteditable]"))return;if(e.key==="q"||e.key==="Q"){e.preventDefault();sm20Dash()}if(e.key==="e"||e.key==="E"){e.preventDefault();sm20Nova()}});
addEventListener("keydown",e=>{if(!gs||!KM[e.key])return;e.preventDefault();K[KM[e.key]]=1});
addEventListener("keyup",e=>{if(KM[e.key])K[KM[e.key]]=0});
[["gL","l"],["gR","r"],["gF","f"]].forEach(([id,k])=>{const b=$(id);
  b.addEventListener("pointerdown",e=>{e.preventDefault();K[k]=1});
  ["pointerup","pointerleave","pointercancel"].forEach(ev=>b.addEventListener(ev,()=>{K[k]=0}))});
document.addEventListener("visibilitychange",()=>{if(document.hidden){K.l=K.r=K.f=0;if(gs)sm17GamePause(true)}});

/* ===== etapas 5-8: missões, evento, segredos, perfil, reações ===== */
const RXS=["🥭","❤️","😂","🌱"],seenA=new Set();
async function refreshBon(){try{await claim()}catch(e){}}
function trackArea(id){if(!me||!prof||seenA.has(id))return;seenA.add(id);rpc("visit_area",{p_handle:me,p_token:tok,p_area:id}).catch(()=>seenA.delete(id))}
$("murFeed").addEventListener("click",async e=>{
  const b=e.target.closest("[data-e]");if(!b)return;if(!me||!prof){showGate();return}
  try{await rpc("react",{p_handle:me,p_token:tok,p_kind:"mural",p_ref:+b.closest("li").dataset.id,p_emoji:b.dataset.e});loadMural()}
  catch(err){toast(err.message==="rate"?"Calma! Muitas reações em pouco tempo.":"Não consegui reagir agora.")}
});
function notifyG(v){
  let old={};try{old=JSON.parse(LS.get("sg_gst")||"{}")}catch(e){}
  const now={};v.forEach(x=>{now[x.id]=x.status;if(old[x.id]==="pending"&&x.status!=="pending")toast(x.status==="ok"?"Sua imagem “"+x.title+"” foi aprovada e já está na galeria!":"Sua imagem “"+x.title+"” foi rejeitada."+(x.reason?" Motivo: "+x.reason:""),7000)});
  LS.set("sg_gst",JSON.stringify(now));
}
/* missões e conquistas */
let QS=null,qType="quest";
async function loadQuests(){
  if(!me||!prof){$("qList").innerHTML='<p class="state">Entre com seu @ para ver suas missões.</p>';return}
  $("qList").innerHTML='<p class="state">Carregando…</p>';
  try{QS=await rpc("quest_state",{p_handle:me,p_token:tok});renderQuests()}
  catch(e){console.error("quest_state falhou:",e);const m=String(e&&e.message||e);const miss=/function|schema cache|does not exist|404|PGRST/i.test(m);
    $("qList").innerHTML='<div class="state"><p>'+(miss?'O servidor não tem a função de conquistas instalada (ou ela foi apagada no reset).':'Não consegui carregar as conquistas.')+'</p><p class="sm">Detalhe: '+esc(m)+'</p><button type="button" class="btn-gothic alt" id="qRetry">Tentar de novo</button></div>';
    const rb=$("qRetry");if(rb)rb.onclick=loadQuests}
}
function renderQuests(){
  const L=(QS&&QS.goals||[]).filter(g=>g.type===qType);
  if(!L.length){$("qList").innerHTML='<p class="state">'+((QS&&QS.goals&&QS.goals.length)?'Nada nesta aba ainda.':'O servidor não devolveu nenhuma missão ou conquista. Rode o SQL de catálogo (supabase_extras.sql) no Supabase.')+'</p>';return}
  $("qTabM").classList.toggle("on",qType==="quest");$("qTabA").classList.toggle("on",qType==="ach");
  $("qList").innerHTML=L.map(g=>{
    const hid=g.kind==="hidden"&&!g.done,ready=!g.done&&g.prog>=g.goal,rw=[g.rm?"+"+g.rm+" mangas":"",g.rx?"+"+g.rx+" XP":"",g.ptitle?"título “"+g.ptitle+"”":""].filter(Boolean).join(", ");
    return`<div class="goal${g.done?" done":""}"><span class="gic">${hid?"❔":g.icon}</span><div><b>${esc(g.title)}</b><p class="sm">${hid?"Procure com atenção.":esc(g.descr)}</p><div class="pbar"><i style="width:${Math.round(g.prog/g.goal*100)}%"></i></div><span class="sm">${g.prog}/${g.goal} · Recompensa: ${esc(rw)}</span></div>${ready?`<button type="button" data-g="${esc(g.id)}">Resgatar</button>`:`<span class="gst ${g.done?"fin":""}">${g.done?"Concluída":g.prog>0?"Em andamento":"Disponível"}</span>`}</div>`}).join("")||'<p class="state">Nenhuma missão disponível no momento. Volte mais tarde!</p>';
}
$("qTabM").onclick=()=>{qType="quest";renderQuests()};$("qTabA").onclick=()=>{qType="ach";renderQuests()};
$("qList").addEventListener("click",async e=>{
  const b=e.target.closest("[data-g]");if(!b)return;b.disabled=true;
  try{const r=await rpc("goal_claim",{p_handle:me,p_token:tok,p_id:b.dataset.g});toast(r.new?"🏅 "+r.title+" concluída! +"+r.rm+" mangas, +"+r.rx+" XP":"Recompensa já resgatada.",5000);await refreshBon();loadQuests()}
  catch(err){toast("Ainda não dá para resgatar.");b.disabled=false}
});
/* perfil */
async function loadExtra(){
  if(!me||!prof)return;
  try{QS=await rpc("quest_state",{p_handle:me,p_token:tok})}catch(e){return}
  const G=QS.goals,ach=G.filter(g=>g.type==="ach"),dn=G.filter(g=>g.done);renderProfile();
  $("pName").textContent="@"+me+(QS.title?" · "+(QS.title==="Dono"?"👑 ":"")+QS.title:"");
  $("pTitle").innerHTML='<option value="">Sem título</option>'+ach.filter(g=>g.done&&g.ptitle).map(g=>`<option value="${esc(g.id)}"${g.ptitle===QS.title?" selected":""}>${esc(g.ptitle)}</option>`).join("")+(me.toLowerCase()==="sammanguinha"?`<option value="__owner__"${QS.title==="Dono"?" selected":""}>👑 Dono — Exclusivo</option>`:"");
  $("pStats").innerHTML=[`<li><b>Mangas:</b> ${mine.toLocaleString("pt-BR")}</li>`,`<li><b>Segredos:</b> ${Object.keys(found).length}/${SECRETS.length}</li>`,`<li><b>Conquistas:</b> ${ach.filter(g=>g.done).length}/${ach.length}</li>`,`<li><b>Missões:</b> ${G.filter(g=>g.type==="quest"&&g.done).length}/${G.filter(g=>g.type==="quest").length}</li>`].join("");
  $("pHist").innerHTML=ach.filter(g=>g.done).map(g=>`<li><span class="gic">${g.icon}</span><span class="nm">${esc(g.title)}</span></li>`).join("")||'<li class="state">Nenhuma conquista ainda. Veja a aba Missões.</li>';
}
$("pTitle").onchange=async e=>{if(e.target.value==="__owner__"){if(me.toLowerCase()!=="sammanguinha")return;toast("👑 Título Dono selecionado!");$("pName").textContent="@"+me+" · Dono";return;}try{await rpc("title_set",{p_handle:me,p_token:tok,p_id:e.target.value});toast("Título atualizado.");loadExtra()}catch(err){toast("Esse título ainda não foi conquistado.")}};
/* evento do dia (o servidor decide quando está ativo) */
let EV=null,evT=0;
async function pollEvent(){
  try{EV=await rpc("event_now")}catch(e){EV=null}
  clearInterval(evT);const bar=$("evBar");document.documentElement.classList.toggle("ench",!!EV&&EV.title==="Noite encantada");
  if(!EV||!me||!prof){bar.hidden=true;return}
  const tick=()=>{const l=Math.max(0,Math.round((new Date(EV.ends)-Date.now())/1000));if(l<=0){bar.hidden=true;document.documentElement.classList.remove("ench");clearInterval(evT);return}
    $("evT").textContent="✨ "+EV.title+": +"+EV.rm+" mangas e +"+EV.rx+" XP, termina em "+Math.floor(l/60)+":"+String(l%60).padStart(2,"0");bar.hidden=false};
  tick();evT=setInterval(tick,1000);
}
$("evGo").onclick=async()=>{
  try{const r=await rpc("event_claim",{p_handle:me,p_token:tok});toast(r.new?"✨ Evento resgatado! +"+r.rm+" mangas, +"+r.rx+" XP":"Você já resgatou o evento de hoje.",5000);if(r.new)await refreshBon();$("evBar").hidden=true}
  catch(err){toast(err.message==="closed"?"O evento já terminou.":"Não consegui resgatar agora.");pollEvent()}
};
setInterval(pollEvent,60000);setTimeout(pollEvent,2500);
async function galRx(id){try{const c=await rpc("reactions_get",{p_kind:"gal",p_refs:[id],p_handle:me||null});c.forEach(r=>{const b=document.querySelector(`#gRx [data-e="${r.emoji}"]`);if(b){b.lastElementChild.textContent=r.n;b.classList.toggle("on",!!r.mine)}})}catch(e){}}
$("fxBody").addEventListener("click",async e=>{const b=e.target.closest("#gRx [data-e]");if(!b)return;if(!me||!prof){toast("Entre com seu @ para reagir.");return}
  const id=+b.closest("#gRx").dataset.id;try{await rpc("react",{p_handle:me,p_token:tok,p_kind:"gal",p_ref:id,p_emoji:b.dataset.e});galRx(id)}catch(err){toast(err.message==="rate"?"Calma! Muitas reações em pouco tempo.":"Não consegui reagir agora.")}});
/* segredos escondidos no cenário */
const HID={lanterna:"🏮 A lanterna balança como se soubesse de algo.",arvore:"🌳 A casca da árvore guarda um calor estranho.",vagalume:"✨ Um vagalume pousou na sua mão e sumiu."};
$("hero").addEventListener("click",async e=>{
  const id=e.target.closest(".lantern")?"lanterna":e.target.closest(".tree")?"arvore":e.target.closest(".ff")?"vagalume":"";
  if(!id||!me||!prof||LS.get("sg_h_"+id)==="1")return;
  try{const r=await rpc("secret_find",{p_handle:me,p_token:tok,p_id:id});LS.set("sg_h_"+id,"1");toast(HID[id]+(r.new?" (+25 XP, +5 mangas)":""),5500);if(r.new)refreshBon()}catch(err){}
});

