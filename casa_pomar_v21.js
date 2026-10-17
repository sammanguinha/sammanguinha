/* Sam Manguinha V21 — Casa dos Guardiões: RPG personalizável, canvas real,
   decoração interativa, progresso por @, recuperação offline e sincronização privada.
   Nenhuma chave de serviço ou informação de outra conta é enviada ao cliente. */
(()=>{'use strict';
const root=document.getElementById('sm21House');if(!root)return;
const $=id=>document.getElementById(id);
const canvas=$('sm21HouseCanvas'),g=canvas.getContext('2d'),W=800,H=496,cols=12,rows=6;
const X=32,Y=170,TW=61,TH=42,api='https://rygeemrxyjknhxxlewdb.supabase.co',key='sb_publishable_RNaqpl3_c_7XYVNNzb3wpA_8sislKLR';
const F=[
{id:'cama',name:'Cama do Aventureiro',icon:'🛏️',cost:0,group:'Básico',text:'Descansar recupera a coragem para sua próxima batalha.'},
{id:'mesa',name:'Mesa de Mapas',icon:'🗺️',cost:0,group:'Básico',text:'Mapas da Expedição e pistas do Pomar.'},
{id:'estante',name:'Biblioteca de Raízes',icon:'📚',cost:0,group:'Básico',text:'Histórias antigas e os nomes dos primeiros guardiões.'},
{id:'planta',name:'Planta Astral',icon:'🌿',cost:0,group:'Básico',text:'Folhas que respondem à luz das luas.'},
{id:'tapete',name:'Tapete Bordado',icon:'🧶',cost:0,group:'Básico',text:'Um lugar tranquilo para observar as estrelas.'},
{id:'lampiao',name:'Lampião de Vagalumes',icon:'🏮',cost:0,group:'Básico',text:'Ilumina o quarto à noite.'},
{id:'cristal',name:'Cristal Lunar',icon:'💎',cost:80,group:'Místico',text:'Um cristal antigo que pulsa com energia astral.'},
{id:'bau',name:'Baú da Colheita',icon:'🧰',cost:110,group:'Aventura',text:'Uma vez por dia, concede 10 sementes locais.'},
{id:'lareira',name:'Lareira Rúnica',icon:'🔥',cost:95,group:'Místico',text:'As chamas mudam conforme o humor da casa.'},
{id:'aquario',name:'Aquário Celestial',icon:'🐠',cost:120,group:'Místico',text:'Peixinhos que brilham no céu da noite.'},
{id:'gato',name:'Familiar Minguinho',icon:'🐈',cost:140,group:'Companheiros',text:'Seu pequeno guardião sonolento.'},
{id:'trono',name:'Trono do Defensor',icon:'👑',cost:0,group:'Recompensa',unlock:'defense',text:'Recompensa cosmética por salvar o pomar no modo Defesa.'},
{id:'reliquias',name:'Altar das Cinco Luas',icon:'🌙',cost:0,unlock:'expedition',group:'Recompensa',text:'Memórias da viagem pelos cinco capítulos.'},
{id:'livros',name:'Escrivaninha Arcana',icon:'🪶',cost:65,group:'Aventura',text:'Para registrar os melhores momentos.'},
{id:'bandeira',name:'Estandarte do Pomar',icon:'🚩',cost:75,group:'Aventura',text:'Um símbolo de perseverança.'},
{id:'espelho',name:'Espelho Encantado',icon:'🪞',cost:110,group:'Místico',text:'Reflete um céu que muda ao anoitecer.'}
];
const START=['cama','mesa','estante','planta','tapete','lampiao'];
const make=()=>({theme:'bosque',floor:'carvalho',owned:[...START],placed:[{id:'cama',x:1,y:3},{id:'mesa',x:7,y:3},{id:'estante',x:10,y:0},{id:'planta',x:0,y:0},{id:'tapete',x:5,y:4},{id:'lampiao',x:9,y:1}]});
const themes={bosque:['#192a2f','#344d46','#334136','#566b50','#b6de9c'],astral:['#151931','#30375e','#272644','#66618e','#bfa6ff'],amanhecer:['#403746','#896174','#8a725d','#b9976d','#f8ce92']};
const floors={carvalho:['#724c3b','#835b45','#9f7655'],marmore:['#585c7d','#767fa2','#989fc0'],musgo:['#344e3d','#42644e','#6c8561']};
let state=make(),account='',selected='cama',decorating=true,cursor={x:5,y:3},hover=null,drag=null,saveTimer=0,saving=false,dirty=false,remoteLoaded=false,raf=0,start=performance.now(),last=0,paused=false;
const imgs={};const svgPath=id=>['cristal','gato'].includes(id)?'sprites/casa_'+id+'_v21_':null;
function getImg(name){if(!imgs[name]){const img=new Image();img.src='sprites/'+name+'.svg';imgs[name]=img}return imgs[name]}
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('sm165-lowfx');
const handle=()=>{try{return (localStorage.getItem('sg_handle')||'').trim().toLowerCase().replace(/[^a-z0-9._]/g,'').slice(0,30)}catch(_){return ''}};
const token=()=>{try{return localStorage.getItem('sg_tok')||''}catch(_){return ''}};
const storageKey=h=>'sm21_house_'+(h||'visitante');
const today=()=>new Date().toLocaleDateString('en-CA',{timeZone:'America/Sao_Paulo'});
const status=t=>{$('sm21HouseStatus').textContent=t};
const message=t=>{$('sm21HouseNote').textContent=t};
function sanitize(input){
 const d=make();if(!input||typeof input!=='object')return d;
 if(themes[input.theme])d.theme=input.theme;
 if(floors[input.floor])d.floor=input.floor;
 if(Array.isArray(input.owned))d.owned=[...new Set([...START,...input.owned.filter(id=>F.some(f=>f.id===id))])].slice(0,16);
 if(Array.isArray(input.placed)){const used=new Set();d.placed=input.placed.filter(a=>{
 if(!a||!d.owned.includes(a.id)||!Number.isInteger(a.x)||!Number.isInteger(a.y)||a.x<0||a.x>=cols||a.y<0||a.y>=rows)return false;
 const xy=a.x+':'+a.y;if(used.has(xy))return false;used.add(xy);return true;
 }).slice(0,24)}
 return d;
}
function localLoad(h){try{return sanitize(JSON.parse(localStorage.getItem(storageKey(h))||'null'))}catch(_){return make()}}
function localSave(){try{localStorage.setItem(storageKey(account),JSON.stringify(state))}catch(_){}}
function seeds(){
 try{const v=JSON.parse(localStorage.getItem('sg_extras_v1_'+(account||'visitante'))||'{}');return Number.isFinite(+v.seeds)?Math.max(0,Math.trunc(+v.seeds)):0}catch(_){return 0}
}
function purchase(cost){
 try{const k='sg_extras_v1_'+(account||'visitante'),v=JSON.parse(localStorage.getItem(k)||'null')||{};if(!Number.isFinite(v.seeds)||v.seeds<cost)return false;v.seeds-=cost;localStorage.setItem(k,JSON.stringify(v));return true}catch(_){return false}
}
async function rest(name,data){
 const res=await fetch(api+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify(data)});
 let body=await res.text(),val;try{val=body?JSON.parse(body):null}catch(_){val=null}
 if(!res.ok)throw new Error(val?.message||'HTTP '+res.status);
 return val;
}
async function cloudRead(){
 if(!account||!token()){status('Casa local · entre com @ para sincronizar');return}
 const h=account;status('Consultando a casa na nuvem…');
 try{
  const result=await rest('sm21_house_load',{p_handle:h,p_token:token()});
  if(h!==account||dirty)return;
  const current=localLoad(h);
  // O estado recém-criado no servidor vem vazio. Não destruir a decoração offline.
  const existing=Array.isArray(result?.placed)&&result.placed.length>0;
  if(existing){state=sanitize(result);localSave();status('✓ Casa sincronizada com seu @');}
  else {state=current;status('Sua casa foi iniciada · salvamento online ativo');markDirty(false)}
  remoteLoaded=true;syncExpeditionUnlock();renderInventory();updateLabels();render(performance.now());
 }catch(err){status('Modo offline · edição salva no navegador');message('A casa funciona sem conexão. Sincronização: '+err.message);syncExpeditionUnlock()}
}
async function cloudSave(){
 if(saving||!dirty||!account||!token())return;
 saving=true;const h=account;const snapshot=JSON.stringify(state);
 try{
  await rest('sm21_house_save',{p_handle:h,p_token:token(),p_state:JSON.parse(snapshot)});
  if(account===h&&JSON.stringify(state)===snapshot){dirty=false;status('✓ Casa salva na nuvem e neste dispositivo')}
  else if(account===h)queueSave();
 }catch(e){status('Salva no navegador · falha ao sincronizar');message('Você pode continuar decorando. '+e.message)}
 finally{saving=false}
}
function markDirty(userAction=true){
 dirty=true;localSave();if(userAction)window.dispatchEvent(new CustomEvent("sm21:house-updated",{detail:{handle:account}}));status('Alterações salvas no navegador · sincronizando…');
 clearTimeout(saveTimer);saveTimer=setTimeout(cloudSave,1100);
}
function syncExpeditionUnlock(){
 try{const exp=JSON.parse(localStorage.getItem('sm19_expedicao_'+(account||'visitante'))||'null');
   if(exp?.finished===true&&!state.owned.includes('reliquias')){state.owned.push('reliquias');markDirty(false);renderInventory();message('🌙 A Expedição foi concluída! O Altar das Cinco Luas agora faz parte da sua casa.');return true}
 }catch(_){}return false
}
function identify(){
 const next=handle();if(account===next){syncExpeditionUnlock();return}
 clearTimeout(saveTimer);account=next;state=localLoad(next);
 selected='cama';hover=null;drag=null;dirty=false;remoteLoaded=false;
 renderInventory();updateLabels();message('Seu refúgio espera novas aventuras.');
 cloudRead();
}
function unlocked(item){return item.unlock?state.owned.includes(item.id):true}
function renderInventory(){
 const box=$('sm21HouseInventory');box.replaceChildren();for(const item of F){
   const owned=state.owned.includes(item.id);
   const button=document.createElement('button');button.type='button';
   button.className='sm21-furnish'+(selected===item.id?' active':'');
   button.dataset.item=item.id;button.disabled=!unlocked(item);button.setAttribute('aria-pressed',String(selected===item.id));
   const ic=document.createElement('span');ic.className='sm21-icon';ic.textContent=item.icon;
   const label=document.createElement('span');label.className='sm21-furnish-label';
   const n=document.createElement('strong');n.textContent=item.name;
   const detail=document.createElement('small');detail.textContent=owned?'✓ Disponível':item.unlock==='defense'?'🏆 Vença uma Defesa':item.unlock==='expedition'?'🌙 Termine a Expedição':'🌱 '+item.cost+' sementes';
   label.append(n,detail);button.append(ic,label);
   button.addEventListener('click',()=>choose(item.id));box.append(button);
 }
 $('sm21Seeds').textContent=seeds()+' sementes locais';
}
function choose(id){
 const item=F.find(x=>x.id===id);if(!item)return;
 if(!state.owned.includes(id)){
   if(item.unlock){message(item.unlock==='defense'?'Conquiste este item vencendo a Defesa do Pomar.':'Conclua os cinco capítulos da Expedição Astral para desbloquear o Altar Lunar.');return}
   if(!purchase(item.cost)){message('Você precisa de '+item.cost+' sementes locais. Ganhe sementes no modo Defesa.');return}
   state.owned.push(id);markDirty();message(item.name+' comprado! Agora escolha uma posição no quarto.');
 }
 selected=id;decorating=true;$('sm21HouseDecorate').setAttribute('aria-pressed','true');
 updateLabels();renderInventory();render(performance.now());
}
function updateLabels(){
 $('sm21HouseTheme').value=state.theme;$('sm21HouseFloor').value=state.floor;
 $('sm21HouseDecorate').textContent=decorating?'✦ Decoração ativada':'👁 Visitar a casa';
 $('sm21HouseDecorate').setAttribute('aria-pressed',String(decorating));
 $('sm21HouseSelected').textContent=(F.find(x=>x.id===selected)?.name||'Nenhum')+' · escolha um quadrado livre';
}
function xyFromPointer(e){
 const r=canvas.getBoundingClientRect();const x=(e.clientX-r.left)*W/r.width,y=(e.clientY-r.top)*H/r.height;
 return {x:Math.floor((x-X)/TW),y:Math.floor((y-Y)/TH)};
}
const inBounds=(x,y)=>x>=0&&x<cols&&y>=0&&y<rows;
function findAt(x,y){return state.placed.findIndex(it=>it.x===x&&it.y===y)}
function place(x,y,fromIndex=-1){
 if(!inBounds(x,y)){message('Escolha um quadrado dentro do quarto.');return false}
 const at=findAt(x,y);if(at>=0&&at!==fromIndex){message('Este espaço já está ocupado. Arraste para um quadrado livre.');return false}
 const id=fromIndex>=0?state.placed[fromIndex]?.id:selected;
 if(!state.owned.includes(id)){message('Desbloqueie o móvel primeiro.');return false}
 const existing=fromIndex>=0?fromIndex:state.placed.findIndex(a=>a.id===id);
 if(existing>=0){state.placed[existing]={id,x,y}}else state.placed.push({id,x,y});
 cursor={x,y};markDirty();render(performance.now());message('✓ '+F.find(f=>f.id===id).name+' colocado no quarto.');return true;
}
function takeItem(){
 const i=state.placed.findIndex(it=>it.id===selected);if(i<0){message('Este móvel não está no quarto.');return}
 state.placed.splice(i,1);markDirty();render(performance.now());message('O móvel voltou para o inventário.');
}
function interact(item){
 if(!item){message('Esta é sua casa. Escolha um móvel ou altere a decoração.');return}
 const detail=F.find(f=>f.id===item.id);if(!detail)return;
 if(item.id==='bau'){
   const k='sm21_house_chest_'+(account||'visitante');if(localStorage.getItem(k)===today()){message('O baú já foi aberto hoje. Volte amanhã!');return}
   const wallet='sg_extras_v1_'+(account||'visitante');let v={};try{v=JSON.parse(localStorage.getItem(wallet)||'{}')||{}}catch(_){}
   v.seeds=Math.min(1000000,Math.max(0,Number(v.seeds)||0)+10);
   localStorage.setItem(wallet,JSON.stringify(v));localStorage.setItem(k,today());
   message('🧰 Baú aberto! +10 sementes locais para decorar e cuidar do Pomar.');renderInventory();return;
 }
 if(item.id==='cama'){paused=!paused;message(paused?'🌙 Você descansou; o céu da casa mudou para a noite.':'☀️ Você acordou pronto para explorar.');render(performance.now());return}
 message(detail.icon+' '+detail.text);
}
function clickCell(x,y){
 if(!inBounds(x,y)){message('Toque no chão dentro da casa.');return}
 const found=findAt(x,y);
 if(decorating){if(found>=0){selected=state.placed[found].id;cursor={x,y};message('Movendo '+F.find(f=>f.id===selected).name+'. Toque em um quadrado vazio.');renderInventory();return}place(x,y)}
 else interact(found>=0?state.placed[found]:null);
}
canvas.addEventListener('pointerdown',e=>{const p=xyFromPointer(e);if(!inBounds(p.x,p.y))return;drag={from:findAt(p.x,p.y),x:p.x,y:p.y,startX:e.clientX,startY:e.clientY};canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{const p=xyFromPointer(e);hover=inBounds(p.x,p.y)?p:null;render(performance.now())});
canvas.addEventListener('pointerup',e=>{
 const p=xyFromPointer(e),d=drag;drag=null;
 if(!d)return;
 const moved=Math.hypot(e.clientX-d.startX,e.clientY-d.startY)>12;
 if(moved&&decorating&&d.from>=0){selected=state.placed[d.from].id;place(p.x,p.y,d.from);renderInventory()}
 else clickCell(p.x,p.y);
});
canvas.addEventListener('pointercancel',()=>{drag=null});
canvas.addEventListener('pointerleave',()=>{hover=null});
canvas.addEventListener('keydown',e=>{
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter',' '].includes(e.key))e.preventDefault();
 const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
 if(delta[e.key]){cursor.x=Math.max(0,Math.min(cols-1,cursor.x+delta[e.key][0]));cursor.y=Math.max(0,Math.min(rows-1,cursor.y+delta[e.key][1]));hover={...cursor};render(performance.now())}
 else if(e.key==='Enter'||e.key===' ')clickCell(cursor.x,cursor.y);
 else if(e.key==='Delete'||e.key==='Backspace')takeItem();
});
$('sm21HouseDecorate').onclick=()=>{decorating=!decorating;updateLabels();render(performance.now());message(decorating?'Modo decoração: selecione e posicione móveis.':'Modo visita: toque em um móvel para interagir.')};
$('sm21HouseRemove').onclick=takeItem;
$('sm21HouseSync').onclick=()=>{dirty?cloudSave():cloudRead()};
$('sm21HouseTheme').onchange=e=>{state.theme=e.target.value;markDirty();render(performance.now())};
$('sm21HouseFloor').onchange=e=>{state.floor=e.target.value;markDirty();render(performance.now())};
window.addEventListener('sm18:defense-ended',e=>{
 if(!e.detail?.won)return;if(!state.owned.includes('trono')){state.owned.push('trono');markDirty();renderInventory();message('🏆 Trono do Defensor desbloqueado! Volte à sua casa para colocá-lo.')}
});
const pix=(c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
function furniture(id,x,y,time){
 const cx=X+x*TW+TW*.5,baseY=Y+(y+1)*TH-5;
 const shadows=['tapete','cristal','gato'].includes(id)?24:31;
 g.save();g.fillStyle='#0d13206a';g.beginPath();g.ellipse(cx,baseY-1,shadows,6,0,0,Math.PI*2);g.fill();
 const bob=reduced()?0:Math.sin(time*.0025+x+y)*2;
 const rect=(dx,dy,w,h,c)=>pix(c,cx+dx,baseY+dy,w,h);
 if(id==='tapete'){rect(-30,-19,60,18,'#5c386d');rect(-25,-16,50,12,'#a56a9a');rect(-18,-12,36,4,'#f8d8aa')}
 else if(id==='cama'){rect(-29,-40,58,32,'#442b32');rect(-25,-36,50,25,'#9d627d');rect(-22,-33,24,10,'#eee9cb');rect(4,-33,20,10,'#eee9cb');rect(-27,-7,54,7,'#c59b61');rect(-26,-46,52,7,'#71513e')}
 else if(id==='mesa'||id==='livros'){rect(-27,-37,54,26,'#433629');rect(-32,-38,64,10,'#a97b4e');rect(-25,-9,7,12,'#5a3b30');rect(20,-9,7,12,'#5a3b30');rect(-17,-44,16,6,id==='livros'?'#6e7ac3':'#a9c2a7');rect(5,-43,16,5,'#dec387')}
 else if(id==='estante'){rect(-27,-74,54,76,'#3d2c37');rect(-23,-70,46,61,'#8d6445');for(let i=0;i<3;i++){rect(-20,-63+i*19,40,4,'#3a2828');for(let j=0;j<5;j++)rect(-18+j*8,-60+i*19,5,15,['#8aa3cf','#d3a462','#a674aa','#8fb989'][((i+j)%4)])}}
 else if(id==='planta'){rect(-20,-28,40,18,'#75513b');rect(-13,-36,26,14,'#b88258');for(let i=0;i<6;i++){const a=i*1.05;rect(Math.cos(a)*16-5,-47+Math.sin(a)*10,12,21,i%2?'#84b78c':'#4e9a68')}}
 else if(id==='lampiao'){rect(-14,-40,28,35,'#634b35');rect(-9,-35,18,25,'#ffe3a3');rect(-6,-34,12,22,'#ebb56d');rect(-3,-51,6,12,'#b0a07a');rect(-14,-42,28,5,'#e0b870');g.shadowBlur=13;g.shadowColor='#ffcc84'}
 else if(['cristal','gato'].includes(id)){const variant='casa_'+id+'_v21_'+(Math.floor(time/(id==='gato'?1600:550))%2?'brilho':'idle');const im=getImg(variant);if(im.complete&&im.naturalWidth){g.imageSmoothingEnabled=false;g.drawImage(im,cx-27,baseY-54+bob,54,58)}else {rect(-17,-45,34,35,id==='cristal'?'#9c8cdd':'#ad927e')}}
 else if(id==='bau'){rect(-27,-32,54,30,'#6c433c');rect(-24,-26,48,21,'#a96c49');rect(-27,-35,54,8,'#d4ae6d');rect(-4,-24,8,9,'#ffda80')}
 else if(id==='lareira'){rect(-29,-75,58,73,'#5b5662');rect(-22,-59,44,50,'#342636');rect(-12,-35,24,22,'#ee904a');rect(-6,-40,12,28,'#ffd882');rect(-33,-77,66,9,'#aea0a5');if(!reduced())rect(-6+Math.sin(time*.006)*6,-48,10,13,'#ffc66a')}
 else if(id==='aquario'){rect(-29,-59,58,51,'#62717b');rect(-23,-52,46,38,'#3b7994');rect(-10+Math.sin(time*.002)*10,-36,13,6,'#ffe4aa');rect(5,-29,7,12,'#9ee1bd');rect(-28,-59,56,6,'#c6cbce')}
 else if(id==='trono'){rect(-23,-85,46,75,'#6d4765');rect(-18,-77,36,58,'#be92a7');rect(-28,-29,56,18,'#d8ba83');rect(-25,-8,50,9,'#9e749d');rect(-11,-93,22,13,'#f7cd70')}
 else if(id==='reliquias'){rect(-27,-42,54,25,'#4d4675');for(let i=0;i<5;i++)rect(-21+i*10,-48-Math.abs(Math.sin(time*.003+i))*7,8,18,['#b69fe9','#dec783','#83cfd6'][i%3]);rect(-31,-18,62,13,'#ad8b85')}
 else if(id==='bandeira'){rect(-20,-79,6,83,'#b9ac86');rect(-14,-75,43,32,'#8b4684');rect(-7,-67,20,14,'#ffd16e');rect(-21,-2,31,7,'#7f6a4d')}
 else if(id==='espelho'){rect(-25,-87,50,78,'#87604d');rect(-19,-80,38,61,'#79b3ca');rect(-15,-75,29,50,'#b2dbdc');rect(-17,-10,34,10,'#9c6c5a')}
 g.restore();
}
function render(now){
 if(!canvas.isConnected)return;
 const t=paused?0:(now-start),c=themes[state.theme]||themes.bosque,fl=floors[state.floor]||floors.carvalho;
 g.clearRect(0,0,W,H);
 const bg=g.createLinearGradient(0,0,0,H);bg.addColorStop(0,c[0]);bg.addColorStop(.5,c[1]);bg.addColorStop(1,c[2]);g.fillStyle=bg;g.fillRect(0,0,W,H);
 // Architectural wall patterns, window and outdoor stars.
 for(let y=12;y<Y;y+=22){for(let x=0;x<W;x+=55){pix('#ffffff0a',(x+(y%44?25:0))%W,y,50,1)}}
 pix('#1b1b30',W*.41,20,160,110);pix('#7b7f88',W*.41-6,17,172,8);pix('#3d3853',W*.41,125,160,7);
 const outside=g.createLinearGradient(0,25,0,123);outside.addColorStop(0,state.theme==='amanhecer'?'#efa187':'#101e43');outside.addColorStop(1,c[3]);g.fillStyle=outside;g.fillRect(W*.41+6,27,148,94);
 g.fillStyle=c[4];g.beginPath();g.arc(421,54,18,0,Math.PI*2);g.fill();
 for(let i=0;i<20;i++){const x=333+(i*37)%140,y=29+(i*19)%85;g.globalAlpha=reduced()?.65:.35+.4*Math.sin(t*.0013+i)**2;pix('#f8edc3',x,y,2,2)}g.globalAlpha=1;
 pix('#a5a0a1',W*.41+76,23,5,104);pix('#a5a0a1',W*.41+6,76,148,5);
 // Room floor, grid and soft ambient perspective.
 const grad=g.createLinearGradient(0,Y,0,H);grad.addColorStop(0,fl[0]);grad.addColorStop(1,fl[2]);g.fillStyle=grad;g.fillRect(0,Y-5,W,H-Y+5);
 for(let y=0;y<=rows;y++){pix(fl[0],X,Y+y*TH,W-X*2,2)}for(let x=0;x<=cols;x++){pix('#10132222',X+x*TW,Y,2,rows*TH)}
 for(let yy=0;yy<rows;yy++)for(let xx=0;xx<cols;xx++){g.fillStyle=(xx+yy)%2?'#ffffff0b':'#00000008';g.fillRect(X+xx*TW,Y+yy*TH,TW,TH)}
 for(let i=0;i<7;i++){const tx=i*113+23,ty=120+Math.sin(t*.001+i)*7;pix(c[4]+'33',tx,ty,3,4)}
 // Furniture sorted by depth for consistent overlap and layering.
 for(const item of state.placed.slice().sort((a,b)=>a.y-b.y||a.x-b.x))furniture(item.id,item.x,item.y,t);
 const focus=hover||cursor;if(decorating&&inBounds(focus.x,focus.y)){
  const ok=findAt(focus.x,focus.y)===-1;
  g.fillStyle=ok?'#aaffbf35':'#ff67673a';g.fillRect(X+focus.x*TW,Y+focus.y*TH,TW,TH);
  g.strokeStyle=ok?'#c2f2b4':'#ff9898';g.lineWidth=2;g.strokeRect(X+focus.x*TW+2,Y+focus.y*TH+2,TW-4,TH-4);
 }
 const mask=g.createRadialGradient(W/2,280,100,W/2,280,510);mask.addColorStop(0,'#00000000');mask.addColorStop(1,'#07111a77');g.fillStyle=mask;g.fillRect(0,0,W,H);
 g.fillStyle='#f6e4bf';g.textAlign='left';g.font='bold 15px system-ui';g.fillText('✦ Casa de '+(account?'@'+account:'Visitante'),17,24);
 g.font='12px system-ui';g.fillStyle='#d8dce4';g.fillText('Um refúgio para suas histórias',17,45);
}
function tick(t){if(document.hidden||root.closest('[hidden]')){raf=0;return}if(!last||t-last>(reduced()?140:45)){last=t;render(t)}raf=requestAnimationFrame(tick)}
function startLoop(){if(raf)return;last=0;raf=requestAnimationFrame(tick)}
function stopLoop(){cancelAnimationFrame(raf);raf=0}
const observed=new MutationObserver(()=>{if(root.closest('[hidden]'))stopLoop();else{identify();startLoop()}});observed.observe($('houseDlg'),{attributes:true,attributeFilter:['hidden']});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!root.closest('[hidden]'))startLoop();else stopLoop()});
window.addEventListener('sm21:seeds-updated',renderInventory);
window.addEventListener('storage',e=>{if(e.key==='sg_handle'||e.key?.startsWith('sm19_expedicao_')){identify()}else if(e.key?.startsWith('sg_extras_v1_'))renderInventory()});
$('sm21HouseCanvas').setAttribute('tabindex','0');
identify();if(!root.closest('[hidden]'))startLoop();
window.SamHouseV21={getState:()=>JSON.parse(JSON.stringify(state)),getCatalog:()=>F.map(({id,cost,unlock})=>({id,cost,unlock})),debugLocal:()=>({account,dirty})};
})();