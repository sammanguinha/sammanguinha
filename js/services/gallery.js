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

