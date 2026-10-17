/* Pomar Vivo V20 — praça ao vivo, Supabase Realtime + consulta de recuperação.
   Sem segredos no cliente: somente publishable key. A autenticação é validada no RPC do banco. */
(()=>{'use strict';
const root=document.getElementById('sm20Live');if(!root)return;
const $=id=>document.getElementById(id);
const url='https://rygeemrxyjknhxxlewdb.supabase.co';
const key='sb_publishable_RNaqpl3_c_7XYVNNzb3wpA_8sislKLR';
const rooms=['praca','defesa','rpg'];
const elements={status:$('sm20LiveStatus'),log:$('sm20LiveFeed'),form:$('sm20LiveForm'),input:$('sm20LiveInput'),room:$('sm20LiveRoom'),count:$('sm20LiveCount'),submit:$('sm20LiveSend')};
let room='praca',channel=null,client=null,interval=null,subscribed=false,pending=false,latest='',fetching=false,lastSeen=0;
const token=()=>{try{return localStorage.getItem('sg_tok')||''}catch(_){return ''}};
const handle=()=>{try{return (localStorage.getItem('sg_handle')||'').toLowerCase().replace(/[^a-z0-9._]/g,'').slice(0,30)}catch(_){return ''}};
const active=()=>!document.hidden&&!root.closest('[hidden]')&&root.getBoundingClientRect().width>0;
function status(text,kind='') {elements.status.textContent=text;elements.status.dataset.state=kind;}
function clock(s){try{return new Intl.DateTimeFormat('pt-BR',{hour:'2-digit',minute:'2-digit'}).format(new Date(s))}catch(_){return '--:--'}}
function setCount(){elements.count.textContent=elements.input.value.length+'/180';}
function buildRow(item){
  const li=document.createElement('li');li.className='sm20-live-msg';li.dataset.id=item.id;
  const meta=document.createElement('div');meta.className='sm20-live-meta';
  const who=document.createElement('b');who.textContent='@'+item.handle;
  const time=document.createElement('time');time.textContent=clock(item.created_at);time.dateTime=item.created_at;
  meta.append(who,time);
  const content=document.createElement('p');content.textContent=item.body;
  li.append(meta,content);
  if(handle()&&handle()!==item.handle){
    const report=document.createElement('button');report.type='button';report.className='sm20-report';
    report.textContent='Denunciar';report.title='Enviar denúncia para a moderação';
    report.addEventListener('click',()=>reportMessage(item.id,report));
    li.append(report);
  }
  return li;
}
function render(rows) {
  const anchored=elements.log.scrollHeight-elements.log.scrollTop-elements.log.clientHeight<85;
  const fragment=document.createDocumentFragment();
  for(const item of rows) fragment.append(buildRow(item));
  elements.log.replaceChildren(fragment);
  if(anchored||!lastSeen)elements.log.scrollTop=elements.log.scrollHeight;
  lastSeen=rows.length;
}
async function api(path,options={}){
  const response=await fetch(url+'/rest/v1/'+path,{...options,headers:{apikey:key,...options.headers}});
  if(!response.ok){let err={};try{err=await response.json()}catch(_){}throw new Error(err.message||'HTTP '+response.status)}
  return response.status===204?null:response.json();
}
async function getHistory(){
 if(fetching||!active())return;
 fetching=true;
 try{
  const rows=await api('sm_live_messages?select=id,handle,room,body,created_at&room=eq.'+room+'&status=eq.ok&order=id.desc&limit=45');
  const ordered=rows.slice().reverse();
  const signature=ordered.map(x=>x.id).join(',');
  if(signature!==latest){render(ordered);latest=signature}
  if(!subscribed)status('↻ Atualização automática · recuperando conexão','poll');
 }catch(e){status('Sem conexão. Tentaremos atualizar de novo.','error')}
 finally{fetching=false}
}
async function rpc(name,data){
  return api('rpc/'+name,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
}
async function reportMessage(id,button) {
 if(!token()||!handle()){status('Entre com seu @ para denunciar.','error');return}
 const reason=window.prompt('Motivo da denúncia: 1 ofensa, 2 spam, 3 dados pessoais, 4 outro','1');
 if(reason===null)return;
 const reasons={1:'ofensa',2:'spam',3:'dados_pessoais',4:'outro'};if(!reasons[reason]){status('Escolha um motivo entre 1 e 4.','error');return}
 button.disabled=true;
 try{await rpc('sm_live_report',{p_handle:handle(),p_token:token(),p_id:id,p_reason:reasons[reason]});
  status('Denúncia recebida. Obrigado por ajudar a comunidade.','ok');await getHistory();
 }catch(e){status('Não foi possível denunciar: '+e.message,'error')}
 finally{button.disabled=false}
}
function unsubscribe(){
 if(channel&&client){try{client.removeChannel(channel)}catch(_){}}
 channel=null;subscribed=false;
}
function connect(){
 unsubscribe();if(!window.supabase?.createClient){status('↻ Modo compatível: atualização automática','poll');return}
 try{
   client=client||window.supabase.createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
   const currentRoom=room;
   channel=client.channel('sm20-live-'+currentRoom+'-'+Math.floor(Math.random()*1e7))
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'sm_live_messages',filter:'room=eq.'+currentRoom},()=>getHistory())
    .on('postgres_changes',{event:'UPDATE',schema:'public',table:'sm_live_messages',filter:'room=eq.'+currentRoom},()=>getHistory())
    .subscribe(s=>{
      if(currentRoom!==room)return;
      if(s==='SUBSCRIBED'){subscribed=true;status('● Ao vivo · mensagens sincronizadas','ok');getHistory()}
      else if(s==='CHANNEL_ERROR'||s==='TIMED_OUT'||s==='CLOSED'){subscribed=false;status('↻ Reconectando · atualização automática ativa','poll')}
    });
 }catch(_){status('↻ Atualização automática disponível','poll')}
}
function setRoom(value) {
 if(!rooms.includes(value))return;
 room=value;latest='';lastSeen=0;elements.log.replaceChildren();
 status('Conectando à sala…');getHistory();connect();
}
root.querySelectorAll('[data-sm20-room]').forEach(button=>button.addEventListener('click',()=>{
 root.querySelectorAll('[data-sm20-room]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 setRoom(button.dataset.sm20Room);
}));
elements.input.addEventListener('input',setCount);
elements.form.addEventListener('submit',async event=>{
 event.preventDefault();if(pending)return;
 const body=elements.input.value.trim();
 if(body.length<2||body.length>180){status('Escreva entre 2 e 180 caracteres.','error');return}
 if(!handle()||!token()){status('Faça login com seu @ antes de conversar.','error');return}
 pending=true;elements.submit.disabled=true;status('Enviando…');
 try{
  await rpc('sm_live_send',{p_handle:handle(),p_token:token(),p_room:room,p_body:body});
  elements.input.value='';setCount();await getHistory();status(subscribed?'● Mensagem enviada · Ao vivo':'✓ Mensagem enviada · sincronização automática','ok');
 }catch(e){status('Mensagem não enviada: '+e.message,'error')}
 finally{pending=false;elements.submit.disabled=false;elements.input.focus()}
});
$('sm20LiveRefresh')?.addEventListener('click',()=>{latest='';getHistory()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){getHistory();if(!subscribed)connect()}});
window.addEventListener('online',()=>{getHistory();if(!subscribed)connect()});
interval=window.setInterval(()=>{if(active())getHistory()},8000);
setCount();setRoom(room);
})();