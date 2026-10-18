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

