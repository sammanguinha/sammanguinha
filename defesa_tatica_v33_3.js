/* Sam Manguinha V33.3 — Expansão funcional da Defesa.
   O motor V26 verificado permanece imutável; esta extensão só afeta os modos
   Difícil/Infinito (locais). Ranking Normal, scores oficiais e Supabase intactos.
   Carregar como script clássico depois do bundle da Defesa. */
(()=>{'use strict';
 if(typeof stepG!=='function'||typeof sm21TacticsTick!=='function'||typeof gs==='undefined')return;
 const PLANS=Object.freeze({
  vigilia:{name:'Vigília',label:'🛡️ Vigília',description:'Uma barreira gratuita ao começar cada nova onda.'},
  assalto:{name:'Assalto',label:'🏹 Assalto',description:'A cada terceiro disparo, torres causam 1 dano extra ao alvo.'},
  contencao:{name:'Contenção',label:'🌿 Contenção',description:'Cada terceiro disparo da torre prende inimigos na rota.'}
 });
 const MAX_BARRIER=2,COST=3;
 let chosen='vigilia',lastUi=0;
 const $=id=>document.getElementById(id);
 const getKey=()=>{
  let account='visitante';try{account=(localStorage.getItem('sg_handle')||'visitante').toLowerCase().replace(/[^a-z0-9._]/g,'').slice(0,30)||'visitante'}catch(_){}
  return 'sam33_defense_plan_'+account;
 };
 try{const stored=localStorage.getItem(getKey());if(PLANS[stored])chosen=stored}catch(_){}
 const sprite=new Image();sprite.src='sprites/praga_sapador_v33.svg';
 const panel=$('gameDlg')?.querySelector('.sm21-tactics');
 if(!panel)return;
 const section=document.createElement('section');section.id='sm33DefenseCouncil';section.className='sm33-defense-council';
 section.setAttribute('aria-labelledby','sm33DefenseTitle');
 section.innerHTML='<div class="sm33-council-title"><div><small>EXPANSÃO V33.3 · ESTRATÉGIA REAL</small><h3 id="sm33DefenseTitle">Conselho de Guerra do Pomar</h3></div><span class="sm33-mode-chip" id="sm33ModeChip">Modo treino</span></div>'+
  '<p id="sm33Intro">Escolha como defender o Pomar. Planos e fortificações atuam somente nos modos Difícil e Infinito, mantendo a disputa Normal inalterada.</p>'+
  '<div id="sm33Plans" class="sm33-plan-grid" role="group" aria-label="Selecionar plano tático">'+
   Object.entries(PLANS).map(([id,p])=>'<button type="button" data-sm33-plan="'+id+'" aria-pressed="false"><b>'+p.label+'</b><span>'+p.description+'</span></button>').join('')+
  '</div><div class="sm33-war-controls"><button type="button" id="sm33Fortify">🧱 Fortificar rota · 3 ✦</button>'+
  '<span id="sm33WarInfo" role="status" aria-live="polite">Inicie uma batalha para liberar os comandos.</span></div>'+
  '<div class="sm33-threat-grid"><div><span>Onda e preparação</span><strong id="sm33WaveReadout">Aguardando partida</strong></div>'+
  '<div><span>Fortificações</span><strong id="sm33WallReadout">0 barreiras</strong></div>'+
  '<div><span>Ameaça da rota</span><strong id="sm33ThreatReadout">Sem pragas</strong></div></div>'+
  '<p class="sm33-legend">Ameaças: <b>Sapador</b> procura a rota mais protegida e consome barreiras; <b>Corredor</b> mira rotas fragilizadas; <b>Curandeira</b> restaura outras pragas. O Rei das Pragas muda de fase no modo Difícil.</p>';
 panel.append(section);
 const planBtns=Array.from(section.querySelectorAll('[data-sm33-plan]'));
 const fortifyBtn=$('sm33Fortify');
 const safeNote=message=>{const el=$('sm33WarInfo');if(el)el.textContent=message;};
 const eligible=s=>!!s&&s.mode!=='normal';
 const getCurrent=()=>gs&&gs.sm33;
 function init(s){
  if(s.sm33||!eligible(s))return;
  s.sm33={plan:chosen,wave:s.wave,barriers:Array(s.trees.length).fill(0),sapperClock:8,
   sappersSpawned:0,blocked:0,bonusHits:0,rootBursts:0,bossPhase:1,waveBuff:0,lastWarning:'',mode:s.mode};
  // A primeira onda de treino também usa a decisão do jogador.
  onWave(s);
 }
 function onWave(s){
  const state=s.sm33;state.wave=s.wave;state.sapperClock=Math.max(6,14-s.wave*.4);
  if(state.plan==='vigilia'){
   const lane=s.trees.map((alive,i)=>alive?i:-1).filter(i=>i>=0)
    .sort((a,b)=>state.barriers[a]-state.barriers[b])[0];
   if(Number.isInteger(lane)&&state.barriers[lane]<MAX_BARRIER){
    state.barriers[lane]++;state.waveBuff++;
    if(typeof orchardBurst==='function')orchardBurst(GW*(lane+.5)/s.trees.length,GH-100,'#acffe1',1,'VIGÍLIA');
   }
  }
  state.lastWarning='Onda '+s.wave+' — '+(s.wave>=4?'sapadores possíveis':'prepare as rotas');
 }
 function pickLane(s,kind){
  const st=s.sm33,alive=s.trees.map((yes,i)=>yes?i:-1).filter(i=>i>=0);
  if(!alive.length)return -1;
  const calc=i=>(st.barriers[i]||0)*4+(s.towers.some(t=>t.lane===i)?3:0);
  return alive.sort((a,b)=>kind==='sapador'?calc(b)-calc(a)||a-b:calc(a)-calc(b)||a-b)[0];
 }
 function spawnSapper(s){
  const lane=pickLane(s,'sapador');if(lane<0)return;
  const x=GW*(lane+.5)/s.trees.length;
  s.pe.push({kind:'sapador',x:x+Math.sin(s.t*2)*24,y:-32,originX:x,
   targetLane:lane,phase:0,vy:46+s.wave*4,hp:3,maxHp:3,hit:0,rooted:0,slow:0,dead:false});
  s.sm33.sappersSpawned++;
  s.sm33.lastWarning='⚠ SAPADOR a caminho da Rota '+(lane+1);
  if(typeof toast==='function')toast('⚠ Sapador se aproxima da rota '+(lane+1)+'! Fortifique ou intercepte.',2800);
 }
 function fortify(){
  const s=gs;
  if(!eligible(s)||!s.sm33)return safeNote('Fortificações estão disponíveis nos modos Difícil e Infinito.');
  if(sm17GamePaused||document.hidden||$('gameDlg')?.hidden)return;
  const lane=sm21SelectedLane,st=s.sm33;
  if(!s.trees[lane])return safeNote('Rota destruída. Use Restaurar Árvore antes de fortificar.');
  if(st.barriers[lane]>=MAX_BARRIER)return safeNote('Rota '+(lane+1)+' já tem duas camadas de proteção.');
  if(s.energy<COST)return safeNote('Energia insuficiente: são necessárias 3 energias.');
  st.barriers[lane]++;s.energy-=COST;
  safeNote('🧱 Rota '+(lane+1)+' reforçada ('+st.barriers[lane]+'/2). A barreira bloqueará uma praga.');
  orchardBurst(GW*(lane+.5)/s.trees.length,GH-96,'#97e7cb',1.5,'BARREIRA +1');
  updateUI();
 }
 function choose(id){
  if(!PLANS[id])return;
  const s=gs;
  if(eligible(s)){
   if(sm17GamePaused)return;
   if(!s.intermission)return safeNote('Só é possível trocar o plano durante a preparação entre ondas.');
   if(s.sm33?.planChangedWave===s.wave)return safeNote('Seu plano já foi alterado nesta preparação.');
   init(s);s.sm33.plan=id;s.sm33.planChangedWave=s.wave;
   safeNote('Plano '+PLANS[id].name+' aplicado. '+PLANS[id].description);
  }else if(s)return safeNote('O modo Normal preserva as regras anteriores para o ranking.');
  chosen=id;try{localStorage.setItem(getKey(),id)}catch(_){}
  updateUI();
 }
 fortifyBtn.addEventListener('click',fortify);
 section.querySelector('#sm33Plans').addEventListener('click',e=>{
  const btn=e.target.closest('[data-sm33-plan]');if(btn)choose(btn.dataset.sm33Plan);
 });
 function updateUI(){
  const s=gs,st=getCurrent(),valid=eligible(s),selected=valid&&st?.plan||chosen;
  for(const b of planBtns){
   const id=b.dataset.sm33Plan;
   b.setAttribute('aria-pressed',String(selected===id));
   b.disabled=!!s&&(s.mode==='normal'||sm17GamePaused||!s.intermission||st?.planChangedWave===s.wave);
  }
  const mode=$('sm33ModeChip');if(mode)mode.textContent=s?.mode==='normal'?'Normal · regras oficiais':valid?'Treino tático ativo':'Difícil / Infinito';
  fortifyBtn.disabled=!valid||!st||sm17GamePaused||document.hidden||!s.trees[sm21SelectedLane]||st.barriers[sm21SelectedLane]>=MAX_BARRIER||s.energy<COST;
  if(s&&st)fortifyBtn.textContent='🧱 Fortificar rota '+(sm21SelectedLane+1)+' · 3 ✦ ('+st.barriers[sm21SelectedLane]+'/2)';
  else fortifyBtn.textContent='🧱 Fortificar rota · 3 ✦';
  const wave=$('sm33WaveReadout'),wall=$('sm33WallReadout'),threat=$('sm33ThreatReadout');
  if(wave)wave.textContent=s?'Onda '+s.wave+(s.intermission>0?' · prepare-se':' · defendendo'):'Aguardando partida';
  if(wall)wall.textContent=st?st.barriers.reduce((a,b)=>a+b,0)+' ativas · '+st.blocked+' impactos bloqueados':'0 barreiras';
  if(threat)threat.textContent=st?(s.pe.filter(p=>!p.dead&&p.kind==='sapador').length+' sapadores · '+s.pe.filter(p=>!p.dead&&p.kind==='runner').length+' corredores'):'Sem pragas táticas';
  section.dataset.active=String(!!st);
  section.dataset.rank=String(s?.mode==='normal');
 }
 function preStep(s,dt){
  if(!eligible(s))return;
  init(s);const st=s.sm33;
  if(st.wave!==s.wave)onWave(s);
  // Runner picks the nearest exposed route, creating clear tower/barrier counterplay.
  for(const p of s.pe){
   if(p.dead)continue;
   if(p.kind==='runner'){
    const target=pickLane(s,'runner');
    if(target>=0&&p.y<GH-170){
     const dest=GW*(target+.5)/s.trees.length;
     p.x+=Math.max(-1,Math.min(1,dest-p.x))*Math.min(16,dt*42);
     p.originX=p.x;
    }
   }else if(p.kind==='sapador'){
    const dest=GW*(p.targetLane+.5)/s.trees.length;
    p.x+=(dest-p.x)*Math.min(1,dt*1.7);
    p.originX=p.x;
   }
  }
  // The original step removes enemies as soon as they hit a tree; intercept them
  // just before crossing the existing GH-60 collision threshold.
  for(const p of s.pe){
   if(p.dead||!Number.isFinite(p.y)||p.vy<=0)continue;
   const speed=p.rooted>0?0:p.slow>0?.38:1;
   if(p.y+p.vy*dt*speed<GH-60)continue;
   const lane=Math.max(0,Math.min(s.trees.length-1,Math.floor(p.x/GW*s.trees.length)));
   const live=s.trees[lane]?lane:pickLane(s,'runner');
   if(live<0||st.barriers[live]<=0)continue;
   st.barriers[live]-=p.kind==='sapador'?Math.min(2,st.barriers[live]):1;
   st.blocked++;p.dead=true;
   orchardBurst(GW*(live+.5)/s.trees.length,GH-93,p.kind==='sapador'?'#ffb785':'#a5f2d1',1.6,p.kind==='sapador'?'SABOTAGEM!':'BLOQUEOU!');
  }
  // Targeted archer barrages are occasional and only local training mode.
  st.sapperClock=Math.max(0,st.sapperClock-dt);
  if(!s.intermission&&s.wave>=4&&st.sapperClock<=0&&s.pe.filter(p=>p.kind==='sapador'&&!p.dead).length<2){
   spawnSapper(s);st.sapperClock=Math.max(7,13-s.wave*.4);
  }
  if(s.boss){
   if(st.bossPhase===1&&s.boss.hp<=Math.ceil(s.boss.max*.52)){
    st.bossPhase=2;st.lastWarning='⚠ O Rei entrou na fase II: cerco às rotas';
    s.boss.attack=Math.min(s.boss.attack,2.0);
    spawnSapper(s);
    toast('👑 FASE II: o Rei convoca Sapadores! Proteja as rotas.',4000);
   }
  }
 }
 const baseStep=stepG;
 stepG=function(dt){
  const s=gs;
  if(s&&eligible(s))preStep(s,dt);
  const alive=baseStep(dt);
  if(gs&&gs===s&&eligible(s)&&s.sm33&&(!lastUi||s.t-lastUi>.19)){
   lastUi=s.t;updateUI();
  }
  return alive;
 };
 const baseTick=sm21TacticsTick;
 sm21TacticsTick=function(s,dt){
  const previous=s.towers.map(t=>({tower:t,shots:t.shots}));
  baseTick(s,dt);
  if(!eligible(s)||!s.sm33)return;
  const st=s.sm33;
  for(const {tower,shots} of previous){
   if(tower.shots<=shots||tower.shots%3!==0)continue;
   const x=GW*(tower.lane+.5)/s.trees.length;
   const targets=s.pe.filter(p=>!p.dead&&Math.abs(p.x-x)<GW/s.trees.length*.48&&p.y>70&&p.y<GH-115).sort((a,b)=>b.y-a.y);
   const target=targets[0];if(!target)continue;
   if(st.plan==='assalto'){
    target.hp--;target.hit=.35;st.bonusHits++;
    orchardBurst(target.x,target.y,'#ffe4a1',.7,'BÔNUS -1');
    if(target.hp<=0){target.dead=true;s.kills++;s.energy=Math.min(12,s.energy+1);s.score+=s.hard?20:10}
   }else if(st.plan==='contencao'){
    target.rooted=Math.max(target.rooted||0,1.5);st.rootBursts++;
    orchardBurst(target.x,target.y,'#a6e8be',.8,'ENRAIZOU!');
   }
  }
 };
 const baseDraw=drawG;
 drawG=function(){
  baseDraw();
  const s=gs;if(!eligible(s)||!s.sm33)return;
  const st=s.sm33,g=gx;
  g.save();g.imageSmoothingEnabled=false;
  for(let i=0;i<s.trees.length;i++){
   if(!s.trees[i]||!st.barriers[i])continue;
   const x=GW*(i+.5)/s.trees.length,y=GH-95,count=st.barriers[i];
   g.save();g.globalAlpha=.6+Math.sin(s.t*3+i)*.1;
   for(let n=0;n<count;n++){
    g.strokeStyle=n?'#ffe0a1':'#a6f6db';g.lineWidth=3;
    g.beginPath();g.ellipse(x,y,33+n*9,54+n*8,0,0,Math.PI*2);g.stroke();
   }
   g.fillStyle='#edfbe3';g.font='bold 11px Inter,sans-serif';g.textAlign='center';g.fillText('🧱 '+count,x,y-63);g.restore();
  }
  for(const p of s.pe){
   if(p.kind!=='sapador'||p.dead)continue;
   if(sprite.complete&&sprite.naturalWidth)g.drawImage(sprite,Math.floor(s.t*7+p.x*.01)%4*48,0,48,48,p.x-32,p.y-34,64,64);
   else{g.fillStyle='#e4a67b';g.fillRect(p.x-11,p.y-17,22,30);g.fillStyle='#5f3645';g.fillRect(p.x-8,p.y-6,16,11)}
   g.fillStyle='#fff1df';g.font='bold 10px Inter,sans-serif';g.textAlign='center';g.fillText('SAPADOR',p.x,p.y-36);
  }
  if(s.boss&&st.bossPhase===2){
   g.fillStyle='#ffcb8e';g.textAlign='center';g.font='bold 12px Inter,sans-serif';
   g.fillText('FASE II · CERCO',s.boss.x,s.boss.y-117);
   g.strokeStyle='#ffc87988';g.lineWidth=3;g.beginPath();g.ellipse(s.boss.x,s.boss.y,98,78,0,0,Math.PI*2);g.stroke();
  }
  g.restore();
 };
 const baseUi=sm21StrategyUi;
 sm21StrategyUi=function(){baseUi.apply(this,arguments);updateUI()};
 $('gDifficulty')?.addEventListener('click',()=>queueMicrotask(updateUI));
 $('sm21Lanes')?.addEventListener('click',()=>queueMicrotask(updateUI));
 // Game controls already have their own pointer handlers and stop independently.
 window.Sam33Defense=Object.freeze({
  snapshot:()=>{
   const s=gs,st=s?.sm33;return st?{
    mode:s.mode,plan:st.plan,wave:s.wave,barriers:st.barriers.slice(),
    blocked:st.blocked,sappersSpawned:st.sappersSpawned,sappers:s.pe.filter(p=>!p.dead&&p.kind==='sapador').length,
    bonusHits:st.bonusHits,rootBursts:st.rootBursts,bossPhase:st.bossPhase,warning:st.lastWarning
   }:null;
  },
  selectedPlan:()=>chosen,
  availablePlans:()=>Object.keys(PLANS)
 });
 updateUI();
})();
