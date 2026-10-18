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

