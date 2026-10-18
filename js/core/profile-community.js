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

