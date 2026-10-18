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

