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

