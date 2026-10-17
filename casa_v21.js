/* V21 — Refúgio do Guardião: casa jogável, economia local, edição e sprites animados. */
(()=>{'use strict';
const root=document.getElementById('sm21House');
if(!root)return;
const $=id=>document.getElementById(id);
const cv=$('sm21HouseCanvas'),ctx=cv.getContext('2d');
const W=540,H=390,COLS=9,ROWS=6,CELL=50,X=45,Y=61;
const catalog=[
{id:'bed',name:'Cama do Guardião',cost:0,type:'utility',limit:2,desc:'Descanso diário: 15 sementes locais, uma vez por dia.',icon:'🛌'},
{id:'table',name:'Mesa do Cartógrafo',cost:0,type:'utility',limit:2,desc:'Mesa de mapas. Em modos de treino da Defesa, +3 mangas iniciais.',icon:'📜'},
{id:'fern',name:'Samambaia Lunar',cost:0,type:'nature',limit:8,desc:'Folhagem mágica que pulsa na luz do luar.',icon:'🌿'},
{id:'fireplace',name:'Lareira das Estrelas',cost:85,type:'utility',limit:2,desc:'No modo Difícil ou Infinito: um escudo extra por partida.',icon:'🔥'},
{id:'library',name:'Estante Ancestral',cost:95,type:'decor',limit:4,desc:'Livros de receitas e história dos guardiões.',icon:'📚'},
{id:'crystal',name:'Cristal do Eclipse',cost:120,type:'nature',limit:5,desc:'Cristal vivo com animação própria.',icon:'💎'},
{id:'banner',name:'Bandeira do Reino',cost:70,type:'decor',limit:4,desc:'Um símbolo da sua jornada no pomar.',icon:'🏳️'},
{id:'lantern',name:'Lanterna das Fadas',cost:50,type:'decor',limit:7,desc:'Luzes que dançam no ambiente.',icon:'🏮'},
{id:'rug',name:'Tapete do Ocaso',cost:35,type:'decor',limit:4,desc:'Padrão tecido para o seu lar.',icon:'🟪'},
{id:'throne',name:'Trono das Raízes',cost:160,type:'decor',limit:1,desc:'Assento do defensor mais dedicado.',icon:'👑'}
];
const catalogById=Object.fromEntries(catalog.map(a=>[a.id,a]));
const allowed=new Set(catalog.map(c=>c.id));
const key=()=>{let name='visitante';try{name=(localStorage.getItem('sg_handle')||'visitante').toLowerCase().replace(/[^a-z0-9._]/g,'').slice(0,30)||'visitante'}catch(_){ }return 'sam21_casa_'+name};
const orchardKey=()=>{let name='visitante';try{name=(localStorage.getItem('sg_handle')||'visitante').toLowerCase().replace(/[^a-z0-9._]/g,'').slice(0,30)||'visitante'}catch(_){ }return 'sg_extras_v1_'+name};
const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const starter=[{id:'bed',x:1,y:2},{id:'table',x:5,y:2},{id:'fern',x:7,y:1}];
function fresh(){return{version:1,theme:'twilight',floor:'planks',items:starter.map(i=>({...i})),inventory:{bed:0,table:0,fern:0},restDay:'',visits:0}}
function normalize(raw){
 const v=raw&&typeof raw==='object'?raw:fresh();
 const inventory={};
 for(const id of allowed)inventory[id]=Math.max(0,Math.min(99,Math.floor(Number(v.inventory?.[id])||0)));
 const seen=new Set(),items=[];
 for(const p of Array.isArray(v.items)?v.items:starter){
  const x=Math.floor(Number(p.x)),y=Math.floor(Number(p.y));
  if(!allowed.has(p.id)||!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=COLS||y>=ROWS||seen.has(x+':'+y)||items.length>=COLS*ROWS)continue;
  items.push({id:p.id,x,y});seen.add(x+':'+y);
 }
 return{version:1,theme:['twilight','spring','midnight'].includes(v.theme)?v.theme:'twilight',floor:['planks','stone','garden'].includes(v.floor)?v.floor:'planks',items,inventory,restDay:String(v.restDay||'').slice(0,12),visits:Math.max(0,Number(v.visits)||0)};
}
function read(){try{return normalize(JSON.parse(localStorage.getItem(key())||'null'))}catch(_){return fresh()}}
function save(){try{localStorage.setItem(key(),JSON.stringify(state))}catch(_){announce('Não foi possível salvar: armazenamento indisponível.','error');return false}return true}
function getWallet(){try{const v=JSON.parse(localStorage.getItem(orchardKey())||'null');return v&&typeof v==='object'?v:{seeds:0,owned:[],pet:'',best:0,day:'',claimed:[],stats:{}}}catch(_){return{seeds:0,owned:[],pet:'',best:0,day:'',claimed:[],stats:{}}}}
function putWallet(v){try{localStorage.setItem(orchardKey(),JSON.stringify(v));return true}catch(_){announce('Não foi possível registrar sementes.','error');return false}}
let state=read(),selected='fern',mode='place',lastKey=key(),animation=0,frame=0,paused=false,lastHover=null,sceneVisibility=true;
function announce(msg,kind='ok'){$('sm21HouseNotice').textContent=msg;$('sm21HouseNotice').dataset.state=kind}
function count(id){return state.items.filter(x=>x.id===id).length}
function owned(id){return count(id)+(state.inventory[id]||0)}
function bonus(){return{bed:count('bed')>0,table:count('table')>0,fireplace:count('fireplace')>0}}
window.Sam21House=Object.freeze({getTrainingBonus:()=>{if(key()!==lastKey)return{bed:false,table:false,fireplace:false};return bonus()},getLayout:()=>JSON.parse(JSON.stringify(read()))});
const sprite={};
for(const item of catalog){const image=new Image();image.src='sprites/casa_'+item.id+'_v21.svg';sprite[item.id]=image}
const themes={
 twilight:{wall:'#2e2b50',shadow:'#161936',roof:'#7562aa',line:'#8f7cb0',floor:'#6b4c4d'},
 spring:{wall:'#2c4b43',shadow:'#153b35',roof:'#a6bc8b',line:'#bad69e',floor:'#9b765b'},
 midnight:{wall:'#15283f',shadow:'#0a142c',roof:'#466b9c',line:'#75a5c9',floor:'#33445d'}
};
function draw(t){
 const theme=themes[state.theme],tm=t*.001;
 ctx.clearRect(0,0,W,H);
 const grad=ctx.createLinearGradient(0,0,0,H);grad.addColorStop(0,theme.wall);grad.addColorStop(1,theme.shadow);ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
 ctx.fillStyle='#f7d79c23';ctx.beginPath();ctx.arc(438,52,28,0,Math.PI*2);ctx.fill();
 // interior backdrop: framed stone + animated windows
 ctx.fillStyle=theme.roof;ctx.fillRect(20,22,500,12);ctx.fillStyle=theme.line;ctx.fillRect(23,34,494,3);
 ctx.fillStyle='#f8c77d';ctx.fillRect(30,39,5,342);ctx.fillRect(505,39,5,342);
 const windowX=[99,394];for(let i=0;i<2;i++){let x=windowX[i];ctx.fillStyle='#342948';ctx.fillRect(x-26,39,54,41);ctx.fillStyle=state.theme==='spring'?'#a4edb1':'#7fbbea';ctx.fillRect(x-22,43,46,33);ctx.fillStyle='#fff5cb';ctx.fillRect(x,43,3,33);ctx.fillRect(x-22,59,46,3);ctx.globalAlpha=.23+.13*Math.sin(tm*1.5+i);ctx.fillStyle='#f8f7ff';ctx.fillRect(x-16,47,8,9);ctx.globalAlpha=1}
 for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
  const px=X+x*CELL,py=Y+y*CELL;
  const even=(x+y)%2===0;
  ctx.fillStyle=state.floor==='planks'?(even?'#946b53':'#876044'):state.floor==='stone'?(even?'#5e6673':'#53606a'):(even?'#3d715b':'#35674f');
  ctx.fillRect(px,py,CELL,CELL);
  ctx.fillStyle='#160f244a';ctx.fillRect(px,py+CELL-3,CELL,3);ctx.fillRect(px+CELL-2,py,2,CELL);
  if(state.floor==='planks'){ctx.fillStyle='#dbb18a45';ctx.fillRect(px+8,py+12,24,2);ctx.fillRect(px+19,py+33,23,2)}
  if(state.floor==='garden'){ctx.fillStyle='#a1d68a43';ctx.fillRect(px+11,py+15,4,4);ctx.fillRect(px+36,py+37,3,5)}
 }
 if(lastHover&&mode!=='move'){const {x,y}=lastHover;if(x>=0&&y>=0){ctx.fillStyle=mode==='erase'?'#fa737455':'#b6ffb040';ctx.fillRect(X+x*CELL,Y+y*CELL,CELL,CELL)}}
 for(const item of state.items){
  const img=sprite[item.id],px=X+item.x*CELL,py=Y+item.y*CELL;
  const bob=window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:Math.sin(tm*2.6+item.x*.7)*1.5;
  ctx.fillStyle='#15101b54';ctx.beginPath();ctx.ellipse(px+25,py+43,19,4,0,0,Math.PI*2);ctx.fill();
  if(img.complete&&img.naturalWidth){ctx.imageSmoothingEnabled=false;const index=Math.floor(tm*3+item.x)%4;ctx.drawImage(img,index*48,0,48,48,px+1,py+1+bob,48,48)}else{ctx.fillStyle='#b4a1bf';ctx.fillRect(px+9,py+12,32,29);ctx.fillStyle='#f8e3b8';ctx.font='22px sans-serif';ctx.fillText(catalogById[item.id].icon,px+12,py+34)}
 }
 if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  for(let i=0;i<16;i++){const x=36+((i*47+tm*(5+i%3*3))%475),y=49+((i*37+Math.sin(tm+i)*9)%314);ctx.globalAlpha=.22+.2*Math.sin(tm*2+i)**2;ctx.fillStyle='#fff5c7';ctx.fillRect(x,y,2,2)}
 }
 ctx.globalAlpha=1;
 ctx.fillStyle='#1d192ad9';ctx.fillRect(35,8,235,30);ctx.fillStyle='#fff0cf';ctx.font='bold 17px serif';ctx.fillText('✦ Refúgio do Guardião',46,29);
}
function render(){
 const wallet=getWallet();
 $('sm21HouseWallet').textContent='🌱 '+(Number(wallet.seeds)||0)+' sementes locais';
 $('sm21HouseIdentity').textContent='Casa de @'+(lastKey.split('sam21_casa_')[1]||'visitante');
 document.querySelectorAll('[data-house-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.houseMode===mode)));
 document.querySelectorAll('[data-house-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.houseTheme===state.theme)));
 document.querySelectorAll('[data-house-floor]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.houseFloor===state.floor)));
 $('sm21HouseFurniture').replaceChildren(...catalog.map(item=>{
  const btn=document.createElement('button');btn.type='button';btn.className='sm21-furniture'+(selected===item.id?' selected':'');
  const available=state.inventory[item.id]||0,have=owned(item.id);
  const title=document.createElement('strong');title.textContent=item.icon+' '+item.name;
  const desc=document.createElement('small');desc.textContent=item.desc;
  const info=document.createElement('span');info.textContent='Disponíveis '+available+' · Colocados '+count(item.id)+' · '+(item.cost?'🌱 '+item.cost:'Inicial');
  btn.append(title,desc,info);
  btn.title='Selecionar '+item.name;
  btn.onclick=()=>{selected=item.id;mode='place';render();announce('Toque no piso para posicionar '+item.name+'.')};
  return btn;
 }));
 const chosen=catalogById[selected],purchase=$('sm21HouseBuy');
 purchase.disabled=!(chosen.cost>0&&owned(selected)<chosen.limit&&Number(wallet.seeds)>=chosen.cost);
 purchase.textContent=chosen.cost>0?'Comprar '+chosen.name+' · 🌱 '+chosen.cost:chosen.name+' é um item inicial';
 $('sm21HouseRest').disabled=state.restDay===today()||!count('bed');
 $('sm21HouseRest').textContent=state.restDay===today()?'💤 Descanso feito hoje':'💤 Descansar (+15 sementes)';
}
function gridAt(e){const rect=cv.getBoundingClientRect(),xx=(e.clientX-rect.left)*W/rect.width,yy=(e.clientY-rect.top)*H/rect.height;return{x:Math.floor((xx-X)/CELL),y:Math.floor((yy-Y)/CELL)}}
cv.addEventListener('pointermove',e=>{lastHover=gridAt(e)});
cv.addEventListener('pointerleave',()=>{lastHover=null});
function action(x,y){
 if(x<0||y<0||x>=COLS||y>=ROWS)return;
 const current=state.items.findIndex(a=>a.x===x&&a.y===y);
 if(mode==='erase'){
  if(current<0)return announce('Não há móveis aqui.','error');
  const removed=state.items.splice(current,1)[0];state.inventory[removed.id]=(state.inventory[removed.id]||0)+1;
  save();render();return announce('Móvel guardado no inventário.');
 }
 if(mode==='move'){
  if(current>=0){const found=state.items[current];state.items.splice(current,1);state.inventory[found.id]=(state.inventory[found.id]||0)+1;selected=found.id;mode='place';save();render();return announce('Escolha a nova posição de '+catalogById[found.id].name+'.')}
  return announce('Toque em um móvel para recolhê-lo.','error');
 }
 if(current>=0)return announce('Esse espaço está ocupado. Recolha o móvel antes.','error');
 if((state.inventory[selected]||0)<1)return announce('Você não tem esse item no inventário. Escolha ou compre um.','error');
 state.inventory[selected]--;state.items.push({id:selected,x,y});save();render();announce('Posicionado! Sua casa foi salva.');
}
cv.addEventListener('click',e=>{const p=gridAt(e);action(p.x,p.y)});
cv.tabIndex=0;cv.setAttribute('role','grid');cv.setAttribute('aria-label','Planta da casa. Setas movem o cursor, Enter aplica a ação.');
let cursor={x:0,y:0};
cv.addEventListener('keydown',e=>{const m={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};if(m[e.key]){e.preventDefault();cursor={x:Math.max(0,Math.min(COLS-1,cursor.x+m[e.key][0])),y:Math.max(0,Math.min(ROWS-1,cursor.y+m[e.key][1]))};lastHover=cursor}else if(e.key==='Enter'||e.key===' '){e.preventDefault();action(cursor.x,cursor.y)}});
root.querySelectorAll('[data-house-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.houseMode;render()}));
root.querySelectorAll('[data-house-theme]').forEach(b=>b.addEventListener('click',()=>{state.theme=b.dataset.houseTheme;save();render()}));
root.querySelectorAll('[data-house-floor]').forEach(b=>b.addEventListener('click',()=>{state.floor=b.dataset.houseFloor;save();render()}));
$('sm21HouseBuy').addEventListener('click',()=>{
 const selectedItem=catalogById[selected],w=getWallet();
 if(!selectedItem||selectedItem.cost<=0||owned(selected)>=selectedItem.limit||Number(w.seeds)<selectedItem.cost)return announce('Compra indisponível.','error');
 w.seeds-=selectedItem.cost;
 if(!putWallet(w))return;
 state.inventory[selected]=(state.inventory[selected]||0)+1;save();render();announce(selectedItem.name+' comprado! Posicione-o no chão.');
});
$('sm21HouseRest').addEventListener('click',()=>{
 if(!count('bed')||state.restDay===today())return;
 state.restDay=today();save();
 const w=getWallet();w.seeds=(Number(w.seeds)||0)+15;if(!putWallet(w)){state.restDay='';save();return}
 render();announce('Você descansou no Refúgio! +15 sementes locais. Volte amanhã.');
});
$('sm21HouseExport').addEventListener('click',()=>{
 const json=JSON.stringify(state);
 if(navigator.clipboard?.writeText)navigator.clipboard.writeText(json).then(()=>announce('Planta copiada para a área de transferência.')).catch(()=>announce('Não foi possível copiar.','error'));
 else announce('Área de transferência indisponível.','error');
});
$('sm21HouseReset').addEventListener('click',()=>{
 if(!window.confirm('Redefinir a decoração? Móveis comprados continuarão no inventário.'))return;
 for(const item of state.items)state.inventory[item.id]=(state.inventory[item.id]||0)+1;
 state.items=[];save();render();announce('Todos os móveis estão no inventário. Escolha um para recolocar.');
});
function loop(t){
 if(!document.hidden&&!root.closest('[hidden]')&&root.getBoundingClientRect().width>0){
  if(key()!==lastKey){lastKey=key();state=read();render();announce('Casa do jogador atual carregada.')}
  draw(t);
 }
 animation=requestAnimationFrame(loop);
}
render();animation=requestAnimationFrame(loop);announce('Sua casa está pronta para decorar. Selecione um item e toque no piso.');
})();