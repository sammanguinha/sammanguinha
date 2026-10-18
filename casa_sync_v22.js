/* V22 Fundação dos Reinos — sincronização opcional e segura do Refúgio.
   Salvamento local permanece a fonte imediata. Sem escrita direta na tabela, sem service key.
   Conflitos são explícitos; nunca substitui decoração não sincronizada silenciosamente. */
(()=>{'use strict';
const house=window.Sam21House;
const root=document.getElementById('sm22HomeSync');
if(!house||!root)return;
const $=id=>document.getElementById(id);
const SB='https://rygeemrxyjknhxxlewdb.supabase.co';
const KEY='sb_publishable_RNaqpl3_c_7XYVNNzb3wpA_8sislKLR';
const status=$('sm22SyncStatus'),btn=$('sm22SyncNow'),pick=$('sm22SyncConflict'),cloudBtn=$('sm22SyncCloud'),localBtn=$('sm22SyncLocal');
const valid=/^[a-z0-9._]{1,30}$/;
const id=()=>{try{const handle=String(localStorage.getItem('sg_handle')||'').toLowerCase();const token=String(localStorage.getItem('sg_tok')||'');return valid.test(handle)&&token.length>=16?{handle,token}:null}catch(_){return null}};
const revKey=handle=>'sm22_house_sync_revision_'+handle;
const cleanText=e=>String(e?.message||e||'erro desconhecido').slice(0,150);
function setStatus(message,type='info'){status.textContent=message;status.dataset.state=type}
function currentHouse(){return house.getLayout()}
function normalized(value) {
 if(!value||typeof value!=='object'||Array.isArray(value)||!Array.isArray(value.items)||!value.inventory||typeof value.inventory!=='object')throw Error('house_invalid_cloud_data');
 const inv={};for(const k of Object.keys(value.inventory).sort())inv[k]=Math.trunc(Number(value.inventory[k])||0);
 return {version:1,theme:String(value.theme||''),floor:String(value.floor||''),
 items:value.items.map(i=>({id:String(i.id),x:Number(i.x),y:Number(i.y)})).sort((a,b)=>a.y-b.y||a.x-b.x||a.id.localeCompare(b.id)),
 inventory:inv,restDay:String(value.restDay||''),visits:Math.trunc(Number(value.visits)||0)};
}
function signature(s){return JSON.stringify(normalized(s))}
function getMeta(handle){try{const raw=JSON.parse(localStorage.getItem(revKey(handle))||'null');return Number.isSafeInteger(raw?.revision)&&raw.revision>=0&&typeof raw.signature==='string'?raw:null}catch(_){return null}}
function putMeta(handle,rev,state){try{localStorage.setItem(revKey(handle),JSON.stringify({revision:rev,signature:signature(state)}))}catch(_){setStatus('Casa sincronizada, mas não foi possível guardar a referência local.','warn')}}
function clearOptions(){pick.hidden=true;cloudBtn.disabled=false;localBtn.disabled=false}
function conflict(rec){
 window.sam22HomeConflict=rec;pick.hidden=false;
 setStatus('⚠️ Existem duas decorações diferentes. Escolha qual manter; nenhuma foi apagada.','conflict');
}
async function rpc(name,body){
 const r=await fetch(SB+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify(body)});
 const t=await r.text();let data=null;
 try{data=t?JSON.parse(t):null}catch(_){}
 if(!r.ok)throw Error(String(data?.message||'Erro '+r.status));
 return data;
}
async function readRemote(who){return rpc('sm22_house_load',{p_handle:who.handle,p_token:who.token})}
async function writeRemote(who,revision,state){
 return rpc('sm22_house_save',{p_handle:who.handle,p_token:who.token,p_expected_revision:revision,p_state:state});
}
function identityMatches(who){const now=id();return !!now&&now.handle===who.handle&&now.token===who.token}
function isStarter(value){
 const x=normalized(value);
 if(x.theme!=='twilight'||x.floor!=='planks'||x.restDay||x.visits||x.items.length!==3)return false;
 const initial=['bed:1:2','table:5:2','fern:7:1'];
 if(x.items.map(i=>i.id+':'+i.x+':'+i.y).sort().join('|')!==initial.sort().join('|'))return false;
 return Object.values(x.inventory).every(n=>n===0);
}
let busy=false,again=false,timer=0;
async function sync(){
 if(busy){again=true;return}
 const who=id();
 if(!who){clearOptions();return setStatus('Entre com seu @ para ativar o backup da casa.','info')}
 if(!navigator.onLine)return setStatus('📴 Sem conexão. Sua casa continua salva neste aparelho.','warn');
 busy=true;btn.disabled=true;const captured=signature(currentHouse());
 setStatus('☁️ Conferindo seu refúgio com a nuvem…');
 try{
  const remote=await readRemote(who);
  if(!identityMatches(who))return;
  const now=currentHouse(),nowSig=signature(now),meta=getMeta(who.handle);
  if(nowSig!==captured){
   // Something changed while reading. Never push an old snapshot or overwrite the new one.
   again=true;return;
  }
  if(!remote){
   const stored=await writeRemote(who,0,now);
   if(!identityMatches(who))return;
   putMeta(who.handle,stored.revision,now);clearOptions();setStatus('✓ Casa salva pela primeira vez na nuvem.','ok');
   return;
  }
  if(!Number.isSafeInteger(remote.revision)||remote.revision<1)throw Error('house_invalid_revision');
  const remoteSig=signature(remote.state);
  if(remoteSig===nowSig){
   putMeta(who.handle,remote.revision,now);clearOptions();setStatus('✓ Sua casa está sincronizada.','ok');return;
  }
  if(meta?.revision===remote.revision&&meta.signature===remoteSig){
   const saved=await writeRemote(who,remote.revision,now);
   if(!identityMatches(who))return;
   putMeta(who.handle,saved.revision,now);clearOptions();setStatus('✓ Suas alterações foram salvas na nuvem.','ok');return;
  }
  if(isStarter(now)||(meta&&meta.signature===nowSig&&remote.revision>=meta.revision)){
   if(!house.applyCloudLayout(remote.state))throw Error('house_apply_failed');
   putMeta(who.handle,remote.revision,remote.state);clearOptions();setStatus('✓ Casa mais recente recuperada da nuvem.','ok');return;
  }
  conflict(remote);
 }catch(err){
  if(!identityMatches(who))return;
  if(/house_conflict/i.test(cleanText(err))){setStatus('Conflito detectado. Conferindo novamente as duas versões…','warn');again=true}
  else if(/token|noprofile|handle/i.test(cleanText(err)))setStatus('Entre com a chave correta do seu @ para sincronizar a casa.','error');
  else setStatus('⚠️ Sincronização indisponível: '+cleanText(err)+'. A versão local está preservada.','error');
 }finally{
  busy=false;btn.disabled=false;
  if(again){again=false;queue(500)}
 }
}
function queue(delay=900){clearTimeout(timer);timer=setTimeout(sync,delay)}
cloudBtn.addEventListener('click',async()=>{
 const who=id();if(!who||busy)return;busy=true;cloudBtn.disabled=true;localBtn.disabled=true;
 try{
  const remote=await readRemote(who);
  if(!identityMatches(who)||!remote)throw Error('house_not_found');
  if(!house.applyCloudLayout(remote.state))throw Error('house_apply_failed');
  putMeta(who.handle,remote.revision,remote.state);clearOptions();setStatus('☁️ Você escolheu a versão da nuvem. Esta cópia foi salva no aparelho.','ok');
 }catch(err){setStatus('Não foi possível baixar sua casa: '+cleanText(err),'error')}
 finally{busy=false;cloudBtn.disabled=false;localBtn.disabled=false}
});
localBtn.addEventListener('click',async()=>{
 const who=id();if(!who||busy)return;busy=true;cloudBtn.disabled=true;localBtn.disabled=true;
 const local=currentHouse();const captured=signature(local);
 try{
  const remote=await readRemote(who);
  if(!identityMatches(who))return;
  if(signature(currentHouse())!==captured){setStatus('A casa mudou durante a operação. Confira novamente antes de substituir a nuvem.','warn');return}
  const saved=await writeRemote(who,remote?.revision||0,local);
  if(!identityMatches(who))return;
  putMeta(who.handle,saved.revision,local);clearOptions();setStatus('✓ Você escolheu a versão deste aparelho. A nuvem foi atualizada.','ok');
 }catch(err){setStatus('Não foi possível enviar sua casa: '+cleanText(err)+'. Ambas as versões permanecem disponíveis.','error')}
 finally{busy=false;cloudBtn.disabled=false;localBtn.disabled=false}
});
btn.addEventListener('click',()=>sync());
window.addEventListener('sam21:home-local-change',e=>{if(e?.detail?.account===house.getAccountKey()){setStatus('Alteração local salva. Enviando quando possível…');queue(850)}});
window.addEventListener('sm18:account-changed',()=>{clearOptions();queue(100)});
window.addEventListener('online',()=>queue(200));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)queue(800)});
window.addEventListener('storage',e=>{if(e.key==='sg_handle'||e.key==='sg_tok'){clearOptions();queue(150)}});
setTimeout(()=>queue(50),120);
})();