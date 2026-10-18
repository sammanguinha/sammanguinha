/* ===== etapa 4: Defesa do Pomar ===== */
/* ===== pixel art: sprites desenhados em código ===== */
const SPC={};
Object.assign(SPR,{
heart:{p:{R:"#9E2A22",r:"#D9453A",l:"#FF9A86"},r:[".RRR.RRR.","RrrrRrrrR","RrlrrrrrR","RrrrrrrrR",".RrrrrrR.","..RrrrR..","...RrR...","....R...."]},
laugh:{p:{o:"#7A3E00",y:"#F5D547",k:"#2B1B0E",w:"#FFFFFF",r:"#D9453A"},r:["..oooooo..",".oyyyyyyo.","oykkyykkyo","oyyyyyyyyo","okkkkkkkko","oywwwwwwyo",".oywrrwyo.","..oooooo.."]},
sprout:{p:{g:"#4FA84B",G:"#8ED391",d:"#1D5628",b:"#7A4E28"},r:["..ggg.ggg",".gGGggGGg",".gGGggGGg","..gg.gg..","....d....","....d....","..bbbbb..",".bbbbbbb."]}});
const RXN={"🥭":"mango","❤️":"heart","😂":"laugh","🌱":"sprout"},RXU={};
const rxI=e=>`<img class="rxi" alt="${e}" src="${RXU[e]||(RXU[e]=spr(RXN[e]).toDataURL())}">`;
function spr(n){if(SPC[n])return SPC[n];const d=SPR[n],w=Math.max(...d.r.map(r=>r.length)),c=document.createElement("canvas");c.width=w;c.height=d.r.length;const g=c.getContext("2d");d.r.forEach((r,y)=>[...r].forEach((ch,x)=>{if(d.p[ch]){g.fillStyle=d.p[ch];g.fillRect(x,y,1,1)}}));return SPC[n]=c}
let _tree=null,gPl=null;
const treeCv=()=>_tree||(_tree=(()=>{const c=document.createElement("canvas");c.width=c.height=24;drawTree(c,5);return c})());
const playerCv=()=>{if(!gPl){gPl=document.createElement("canvas");gPl.width=16;gPl.height=20;drawAv(gPl,prof&&prof.avatar)}return gPl};
const dr=(c,x,y,k)=>gx.drawImage(c,Math.round(x-c.width*k/2),Math.round(y-c.height*k/2),c.width*k,c.height*k);

const gc=$("gCv"),gx=gc.getContext("2d"),K={};
let GW=360,GH=480,gDifficulty="normal";
const gHard=()=>gDifficulty!=="normal";
const gInfinite=()=>gDifficulty==="infinite";
function setGameDifficulty(mode){
 if(gs)return;gDifficulty=["hard","infinite"].includes(mode)?mode:"normal";GW=gHard()?540:360;GH=gHard()?620:480;gc.width=GW;gc.height=GH;
 document.querySelectorAll("#gDifficulty [data-difficulty]").forEach(b=>{const active=b.dataset.difficulty===gDifficulty;b.setAttribute("aria-pressed",String(active));b.classList.toggle("alt",!active)});
 $("gOvP").textContent=gInfinite()?"Defesa Infinita: sobreviva ao maior número de ondas possível. Recorde local, sem envio ao ranking oficial.":gHard()?"Modo DIFÍCIL: arena maior, 5 árvores para proteger, 30% menos pragas, larvas precisam de 2 ataques para derrubar uma árvore e besouros derrubam com 1. Sobreviva a 10 ondas e ganhe pontos em dobro!":"Pragas descem do céu sombrio. Atire mangas para derrubá-las e colha as que caem. Sobreviva a 5 ondas.";
 $("gModeNote").textContent=gDifficulty==="hard"?"👑 O Rei das Pragas surge na onda 10!":gInfinite()?"♾️ Ondas sem fim; recorde salvo neste navegador.":"🌱 5 ondas clássicas.";
 drawG();
}
document.querySelectorAll("#gDifficulty [data-difficulty]").forEach(b=>b.addEventListener("click",()=>setGameDifficulty(b.dataset.difficulty)));
let gs=null,gRun=null,gRaf=0,gLast=0;
// V21 motor tático: energia por abate; uma torre por rota; reparo caro e pontuação oficial inalterada.
let sm21SelectedLane=0;
const sm21JobKey=()=> 'sam21_combat_job_'+String(me||'visitante').toLowerCase().replace(/[^a-z0-9._]/g,'').slice(0,30);
function sm21JobRead(){try{const id=localStorage.getItem(sm21JobKey());return ['guardian','ranger','mage'].includes(id)?id:'guardian'}catch(_){return 'guardian'}}
let sm21Job='guardian';
function sm21JobsSync(){
 sm21Job=sm21JobRead();
 document.querySelectorAll('[data-sm21-job]').forEach(b=>{b.disabled=!!gs;b.setAttribute('aria-pressed',String(b.dataset.sm21Job===sm21Job))});
}
$("sm21Jobs")?.addEventListener('click',e=>{const b=e.target.closest('[data-sm21-job]');if(!b||gs)return;sm21Job=b.dataset.sm21Job;try{localStorage.setItem(sm21JobKey(),sm21Job)}catch(_){}
 sm21JobsSync();toast('Ofício selecionado: '+b.querySelector('b').textContent);});
sm21JobsSync();

const sm21Towers={arrow:{cost:3,cooldown:1.3,damage:1,name:'Torre de Mangas'},frost:{cost:4,cooldown:2.4,damage:1,name:'Runa de Gelo'},root:{cost:5,cooldown:3.0,damage:0,name:'Raiz Guardiã'},solar:{cost:6,cooldown:3.1,damage:1,name:'Totem Solar'}};
const sm22RunnerSprite=new Image();sm22RunnerSprite.src='sprites/corredor_ambar_v22.svg';
const sm21TowerSprites={};for(const type of ['arrow','frost','root','solar']){const img=new Image();img.src='sprites/torre_'+({arrow:'arco',frost:'gelo',root:'raiz',solar:'solar'}[type])+'_v24.svg';sm21TowerSprites[type]=img}
const sm24Sprites={};for(const kind of ['arvore_saudavel','arvore_danificada','arvore_destruida','praga_larva','praga_besouro','praga_esporo','praga_corredor','praga_curandeira','rei_pragas']){const im=new Image();im.src='sprites/'+kind+'_v24.svg';sm24Sprites[kind]=im}
function sm24DrawSprite(g,kind,x,y,w,h,t,anchorBottom=false){
 const im=sm24Sprites[kind];if(!im?.complete||!im.naturalWidth)return false;
 const still=matchMedia('(prefers-reduced-motion:reduce)').matches||document.documentElement.classList.contains('sm165-lowfx');
 const frame=still?0:Math.floor(t*6+x*.02)%4;
 g.save();g.imageSmoothingEnabled=false;
 g.drawImage(im,48*frame,0,48,48,x-w/2,anchorBottom?y-h:y-h/2,w,h);g.restore();return true;
}
function sm21Lanes(n){const out=$("sm21Lanes");if(!out)return;out.innerHTML=Array.from({length:n},(_,i)=>'<button type="button" data-sm21-lane="'+i+'" aria-pressed="'+(i===sm21SelectedLane)+'">🌳 Rota '+(i+1)+'</button>').join('')}
function sm21StrategyUi(){
 const energy=$("sm21Energy"),status=$("sm21TacticalStatus");if(!energy||!status)return;
 const s=gs;energy.textContent='✦ '+(s?s.energy:0)+' energia';const lane=sm21SelectedLane;
 const tower=s?.towers?.find(t=>t.lane===lane);
 const alive=s?.trees?.[lane];
 status.textContent=!s?'Comece uma partida para construir defesas.':(s.intermission>0?'⏳ Preparação: '+s.intermission.toFixed(1)+'s · ':'Onda '+s.wave+' · ')+(tower?'Torre '+((sm21Towers[tower.kind]?.name||'Desconhecida'))+' nível '+(tower.level||1)+' na rota '+(lane+1):'Rota '+(lane+1)+(alive?' livre':' destruída'))+' · '+s.kills+' abates';
 $("sm21Lanes")?.querySelectorAll('[data-sm21-lane]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.sm21Lane===lane)));
 document.querySelectorAll('[data-sm21-build]').forEach(b=>{const id=b.dataset.sm21Build;const can=s&&!sm17GamePaused&&!document.hidden&&s.energy>=(id==='heal'?(s.job==='guardian'?4:5):sm21Towers[id]?.cost||99)&&(id==='heal'?!s.trees[lane]:s.trees[lane]&&!tower);b.disabled=!can});
 const upgrade=$("sm22Upgrade"),priority=$("sm22Priority"),detail=$("sm22LaneDetail");
 const lvl=tower?.level||1,cost=lvl===1?3:5;
 if(upgrade){upgrade.disabled=!s||sm17GamePaused||!tower||lvl>=3||s.energy<cost;upgrade.textContent=lvl>=3?'✨ Torre no nível máximo':'⬆ Melhorar para nível '+(lvl+1)+' · '+cost+' energia'}
 if(priority){priority.disabled=!s||sm17GamePaused||!tower;priority.textContent='🎯 Alvo: '+(tower?.priority==='strongest'?'mais resistente':tower?.priority==='healer'?'curandeiras':'mais próximo')}
 if(detail)detail.textContent=tower?'Rota '+(lane+1)+' · nível '+lvl+'/3 · '+tower.shots+' disparos':'Escolha ou construa uma torre para melhorá-la.';
 const pulse=$('sm24GrovePulse');if(pulse){pulse.disabled=!s||s.mode==='normal'||sm17GamePaused||s.energy<6||s.groveCd>0;pulse.textContent=s?.mode==='normal'?'🌿 Pulso do Bosque · somente treino':'🌿 Pulso do Bosque · 6 ✦'+(s?.groveCd>0?' ('+Math.ceil(s.groveCd)+'s)':'')}
}
function sm21Build(id){
 const s=gs,lane=sm21SelectedLane;if(!s||sm17GamePaused||document.hidden)return;
 const def=sm21Towers[id],cost=def?.cost||(id==='heal'?(s.job==='guardian'?4:5):99);if(s.energy<cost){toast('Energia insuficiente. Derrote pragas para abastecer suas defesas.');return}
 if(id==='heal'){
  if(s.trees[lane]){toast('Esta árvore já está saudável.');return}
  s.energy-=cost;s.trees[lane]=true;s.treeHits[lane]=0;s.hp=s.trees.filter(Boolean).length;
  orchardBurst(GW*(lane+.5)/s.trees.length,GH-95,'#abff9c',2,'REVIVEU!');toast('🌳 Árvore da rota '+(lane+1)+' restaurada!');
 }else{
  if(!def||!s.trees[lane]||s.towers.some(t=>t.lane===lane)){toast('Essa rota precisa estar viva e sem torre.');return}
  s.energy-=cost;s.towers.push({kind:id,lane,cooldown:.5,shots:0,level:1,priority:'danger'});orchardBurst(GW*(lane+.5)/s.trees.length,GH-165,({frost:'#b6f8ff',root:'#b3efa5',solar:'#ffe6aa',arrow:'#ffdf8f'}[id]||'#ffdf8f'),1.5,'TORRE!');
 }
 sm21StrategyUi();
}
$("sm21Lanes")?.addEventListener('click',e=>{const btn=e.target.closest('[data-sm21-lane]');if(!btn)return;sm21SelectedLane=+btn.dataset.sm21Lane;sm21StrategyUi()});
document.querySelectorAll('[data-sm21-build]').forEach(btn=>btn.addEventListener('click',()=>sm21Build(btn.dataset.sm21Build)));
addEventListener('keydown',e=>{if(!gs||sm17GamePaused||e.target.closest?.('input,textarea,select,[contenteditable]'))return;if(/^[1-5]$/.test(e.key)){const lane=Number(e.key)-1;if(lane<gs.trees.length){sm21SelectedLane=lane;sm21StrategyUi()}}if(e.key==='r'||e.key==='R')sm21Build('heal')});

/* V24 · Pulso do Bosque: efeito real sobre pragas em modos não ranqueados. */
const sm24PulseButton=document.createElement('button');sm24PulseButton.type='button';sm24PulseButton.id='sm24GrovePulse';
sm24PulseButton.textContent='🌿 Pulso do Bosque · 6 ✦';
sm24PulseButton.setAttribute('aria-label','Imobilizar pragas por dois segundos, apenas no modo treino');
$("sm21Lanes")?.parentElement?.append(sm24PulseButton);
sm24PulseButton.addEventListener('click',()=>{
 const s=gs;if(!s||s.mode==='normal'||sm17GamePaused||document.hidden||s.energy<6||s.groveCd>0)return;
 const victims=s.pe.filter(x=>!x.dead);
 if(!victims.length){toast('Aguarde a chegada das pragas para usar o Pulso.');return}
 s.energy-=6;s.groveCd=12;
 for(const enemy of victims)enemy.rooted=Math.max(enemy.rooted||0,2.2);
 orchardBurst(s.x,GH-130,'#93ffb7',2.2,'PULSO DO BOSQUE!');
 toast('🌿 '+victims.length+' pragas imobilizadas por 2,2 s.');
 sm21StrategyUi();
});

// V22: investimento em torres tem efeito real em cadência, dano e lentidão.
function sm22UpgradeTower(){
 const s=gs;if(!s||sm17GamePaused||document.hidden)return;
 const t=s.towers.find(x=>x.lane===sm21SelectedLane);if(!t)return toast('Instale uma torre primeiro.');
 const level=t.level||1;if(level>=3)return toast('Torre já está no nível máximo.');
 const cost=level===1?3:5;if(s.energy<cost)return toast('Derrote mais pragas para conseguir energia.');
 s.energy-=cost;t.level=level+1;t.cooldown=Math.min(t.cooldown,.45);
 orchardBurst(GW*(t.lane+.5)/s.trees.length,GH-160,'#fff1a2',2,'NÍVEL '+t.level);
 sm21StrategyUi();
}
function sm22Priority(){
 const t=gs?.towers?.find(x=>x.lane===sm21SelectedLane);if(!t||sm17GamePaused)return;
 t.priority=t.priority==='strongest'?'healer':t.priority==='healer'?'danger':'strongest';sm21StrategyUi();
}
$("sm22Upgrade")?.addEventListener('click',sm22UpgradeTower);
$("sm22Priority")?.addEventListener('click',sm22Priority);
addEventListener('keydown',e=>{if(!gs||sm17GamePaused||e.repeat||e.target.closest?.('input,textarea,select,[contenteditable]'))return;
 if(e.key==='u'||e.key==='U')sm22UpgradeTower();
 if(e.key==='t'||e.key==='T')sm22Priority();
});
/* V24: Curandeira de Esporos opera no modo dificil/infinito. */
function sm24HealTick(s,dt){
 for(const healer of s.pe){
  if(healer.dead||healer.kind!=='healer')continue;
  healer.healCd=(healer.healCd||3.4)-dt;
  if(healer.healCd>0)continue;
  healer.healCd=3.4;
  const injured=s.pe.filter(enemy=>!enemy.dead&&enemy!==healer&&enemy.hp<Math.max(1,enemy.maxHp||1)&&Math.hypot(enemy.x-healer.x,enemy.y-healer.y)<115);
  injured.sort((a,b)=>(a.hp/(a.maxHp||1))-(b.hp/(b.maxHp||1)));
  const target=injured[0];if(!target)continue;
  target.hp=Math.min(Math.max(1,target.maxHp||1),target.hp+1);
  orchardBurst(target.x,target.y,'#9bffd0',.45,'+1 CURA');
 }
}
function sm21TacticsTick(s,dt){
 s.groveCd=Math.max(0,(s.groveCd||0)-dt);
 s.towers.forEach(t=>{
  t.cooldown-=dt;if(t.cooldown>0)return;
  const cx=GW*(t.lane+.5)/s.trees.length;
  const candidates=s.pe.filter(p=>!p.dead&&Math.abs(p.x-cx)<(GW/s.trees.length)*.48&&p.y>70&&p.y<GH-115);
  candidates.sort(t.priority==='strongest'?(a,b)=>b.hp-a.hp||b.y-a.y:t.priority==='healer'?(a,b)=>(b.kind==='healer')-(a.kind==='healer')||b.y-a.y:(a,b)=>b.y-a.y);
  const target=candidates[0];if(!target)return;
  const level=Math.min(3,Math.max(1,t.level||1));
  t.cooldown=sm21Towers[t.kind].cooldown*(s.job==='mage'&&t.kind==='frost'?.76:1)*(1-(level-1)*.18);t.shots++;
  const x=target.x,y=target.y;
  const damage=sm21Towers[t.kind].damage+(level>=3&&t.kind!=='root'?1:0);
  // Efeitos têm consequência no motor: Solar acerta um pequeno grupo; Raiz para o avanço.
  const victims=t.kind==='solar'
    ?s.pe.filter(p=>!p.dead&&p.y>70&&p.y<GH-115&&Math.hypot(p.x-x,p.y-y)<(level===3?110:82)).slice(0,5)
    :[target];
  for(const enemy of victims){
    if(enemy.dead)continue;
    if(t.kind==='root'){
      enemy.rooted=Math.max(enemy.rooted||0,1.4+(level-1)*.55);
      if(level===3)enemy.hp-=.5;
    }else{
      enemy.hp-=damage;enemy.hit=.32;
      if(t.kind==='frost')enemy.slow=Math.max(enemy.slow||0,2.3+(level-1)*.55);
    }
    if(enemy.hp<=0){enemy.dead=1;s.kills++;s.energy=Math.min(12,s.energy+1);s.combo++;s.comboTimer=5}
  }
  orchardBurst(x,y,({root:'#a4efa1',solar:'#ffd181',frost:'#8feeff',arrow:'#ffe0a0'}[t.kind]),.8,
    t.kind==='root'?'RAÍZES!':t.kind==='solar'?'SOLAR!':t.kind==='frost'?'GELO -'+damage:'🏹 -'+damage);
 });
}
function sm21DrawTowers(g,s,t){
 (s.towers||[]).forEach(tower=>{
  const x=GW*(tower.lane+.5)/s.trees.length,y=GH-149,im=sm21TowerSprites[tower.kind];
  g.save();g.fillStyle='#050c1bb9';g.beginPath();g.ellipse(x,y+23,24,7,0,0,Math.PI*2);g.fill();
  if(im?.complete&&im.naturalWidth){g.imageSmoothingEnabled=false;const still=matchMedia("(prefers-reduced-motion: reduce)").matches||document.documentElement.classList.contains("sm165-lowfx");g.drawImage(im,(still?0:Math.floor((t*2.8+tower.lane)%4))*48,0,48,48,x-28,y-31,56,56)}
  else {g.fillStyle=tower.kind==='frost'?'#90ddff':'#dfb87e';g.fillRect(x-12,y-23,24,38)}
  const level=tower.level||1;g.textAlign='center';g.font='bold 11px sans-serif';g.fillStyle='#170e28';g.fillText('Lv'+level,x+1,y-33);g.fillStyle=level>=3?'#ffe3a5':'#c2f5ff';g.fillText('Lv'+level,x,y-34);
  g.restore();
 });
 if(s.intermission>0){g.save();g.fillStyle='#100d29df';g.fillRect(8,GH*.47,GW-16,55);g.textAlign='center';g.fillStyle='#ffe5ad';g.font='bold 15px sans-serif';g.fillText('PREPARAÇÃO · ONDA '+s.wave,GW/2,GH*.47+22);g.font='12px sans-serif';g.fillText('Instale torres nas rotas · '+Math.ceil(s.intermission)+'s',GW/2,GH*.47+42);g.restore()}
}

// V20: novas habilidades com recarga por partida. Não alteram a pontuação fora do motor de jogo.
function sm20Dash(){if(!gs||sm17GamePaused||document.hidden||gs.dashCd>0)return;const d=(K.r?1:0)-(K.l?1:0);gs.x=Math.max(38,Math.min(GW-38,gs.x+(d||((gs.lastDir||1)))*Math.min(115,GW*.23)));gs.dashCd=gs.job==='guardian'?6:7;gs.dashes=(gs.dashes||0)+1;gs.invuln=Math.max(gs.invuln,0.65);gs.dashFx=.45;orchardBurst(gs.x,GH-93,"#74e8fd",1.9,"IMPULSO");sfx(750,.10)}
function sm20Nova(){if(!gs||sm17GamePaused||document.hidden||gs.novaCd>0||gs.ammo<3)return;const s=gs;s.ammo-=3;s.novas=(s.novas||0)+1;s.novaCd=s.job==='mage'?9:13;s.novaFx=.65;const cy=GH-135,range=154;orchardBurst(s.x,cy,"#c1a4ff",3.1,"EXPLOSÃO!");s.pe.forEach(p=>{if(p.dead||Math.hypot(p.x-s.x,p.y-cy)>range)return;p.hp-=2;p.hit=.45;if(p.hp<=0){p.dead=1;s.kills++;s.energy=Math.min(12,s.energy+1);s.combo=(s.combo||0)+1;s.comboTimer=5;s.score+=10}});if(s.boss&&Math.hypot(s.boss.x-s.x,s.boss.y-cy)<range+45){s.boss.hp-=2;s.boss.hit=.5;if(s.boss.hp<=0){s.boss=null;s.bossDefeated=true;s.score+=s.hard?1500:180;toast("👑 Rei das Pragas derrotado!",3500)}}sfx(150,.24)}
$("sm20Dash")?.addEventListener("click",sm20Dash);$("sm20Nova")?.addEventListener("click",sm20Nova);
// Read-only diagnostics for QA and accessibility: never expose tokens or change game state.
window.Sam21Defense=Object.freeze({snapshot:()=>gs?Object.freeze({wave:gs.wave,energy:gs.energy,trees:gs.trees.slice(),job:gs.job,mode:gs.mode,score:gs.score,kills:gs.kills,boss:!!gs.boss,enemies:gs.pe.filter(p=>!p.dead).map(p=>({x:p.x,y:p.y,hp:p.hp})),towers:gs.towers.map(t=>({kind:t.kind,lane:t.lane,shots:t.shots,level:t.level||1,priority:t.priority||'danger'})),intermission:gs.intermission}):null});
let sm17GamePaused=false;function sm17GamePause(on){sm17GamePaused=!!on;K.l=K.r=K.f=0;const b=document.getElementById("sm17PauseBtn"),info=document.getElementById("sm17DefenseStatus");if(b){b.disabled=!gs;b.textContent=sm17GamePaused?"▶ Retomar":"⏸ Pausar";b.setAttribute("aria-pressed",String(sm17GamePaused))}if(info)info.textContent=sm17GamePaused?"⏸ Pausado. Toque em Retomar para voltar.":"Defenda as árvores. Você pode pausar a qualquer momento.";const cover=document.getElementById("sm17PauseCover");if(cover)cover.hidden=!sm17GamePaused}
let snd=LS.get("sg_snd")==="1";$("gSnd").checked=snd;$("gSnd").onchange=e=>{snd=e.target.checked;LS.set("sg_snd",snd?"1":"0")};
function sfx(f,d){if(!snd)return;try{const A=sfx.A||(sfx.A=new(window.AudioContext||window.webkitAudioContext)()),o=A.createOscillator(),g=A.createGain();o.type="square";o.frequency.value=f;g.gain.value=.05;g.gain.exponentialRampToValueAtTime(.001,A.currentTime+d);o.connect(g);g.connect(A.destination);o.start();o.stop(A.currentTime+d)}catch(e){}}
const near=(a,b,r)=>Math.abs(a.x-b.x)<r&&Math.abs(a.y-b.y)<r;
const orchardCatalog=[
 {id:"bat",name:"🦇 Morceguinho",cost:80,emoji:"🦇",desc:"Sombra protetora: ataca pragas automaticamente a cada 4 segundos."},
 {id:"ghost",name:"👻 Fantasminha",cost:110,emoji:"👻",desc:"Espírito guardião: atravessa inimigos com um raio a cada 5 segundos."},
 {id:"pumpkin",name:"🎃 Miniabóbora",cost:140,emoji:"🎃",desc:"Casca de ferro: protege uma árvore de um ataque a cada 12 segundos."},
 {id:"firefly",name:"✨ Vaga-lume",cost:60,emoji:"✨",desc:"Luz da colheita: atrai mangas e regenera munição a cada 6 segundos."}
];
const orchardKey=()=>"sg_extras_v1_"+(String(typeof me!=="undefined"&&me||"visitante").toLowerCase());
function orchardRead(){try{const a=JSON.parse(localStorage.getItem(orchardKey())||"null");if(a&&typeof a==="object")return a}catch(e){}return {seeds:0,owned:[],pet:"",best:0,day:"",claimed:[],stats:{games:0,kills:0,waves:0,dashes:0,novas:0,combo:0}}}
function orchardSave(v){localStorage.setItem(orchardKey(),JSON.stringify(v))}
const orchardDay=()=>new Date().toLocaleDateString("en-CA",{timeZone:"America/Sao_Paulo"});
function orchardDaily(v){const today=orchardDay();if(v.day!==today){v.day=today;v.claimed=[];v.stats={games:0,kills:0,waves:0,dashes:0,novas:0,combo:0}}v.stats={games:0,kills:0,waves:0,dashes:0,novas:0,combo:0,...(v.stats||{})};v.owned=v.owned||[];v.claimed=v.claimed||[];return v}
let orchardTab="shop";
const orchardTasks=[{id:"games",name:"🌱 Iniciação — jogue 2 partidas",goal:2,reward:45},{id:"kills",name:"⚔️ Guardião — elimine 30 pragas",goal:30,reward:60},{id:"waves",name:"🌳 Vigília — sobreviva a 12 ondas",goal:12,reward:70},{id:"dashes",name:"💨 Vento Vivo — use 5 impulsos",goal:5,reward:35},{id:"novas",name:"💥 Eclipse — conjure 3 explosões",goal:3,reward:50},{id:"combo",name:"✨ Lenda — alcance combo x4",goal:15,reward:80}];
const pixelAsset=n=>"sprites/"+n+(n==="esporo_v20"?".svg":".png");
const pixelImages={};
function pixelImage(n){if(!pixelImages[n]){const im=new Image();im.src=pixelAsset(n);pixelImages[n]=im}return pixelImages[n]}
function pixelDraw(g,n,x,y,w,h){
 const im=pixelImage(n);if(!im.complete||!im.naturalWidth)return false;
 const ratio=Math.min(w/im.naturalWidth,h/im.naturalHeight),dw=im.naturalWidth*ratio,dh=im.naturalHeight*ratio;
 g.save();g.imageSmoothingEnabled=false;g.drawImage(im,Math.round(x-dw/2),Math.round(y-dh/2),Math.round(dw),Math.round(dh));g.restore();return true
}
const petPowers={bat:"🦇 Tiro automático (4s)",ghost:"👻 Raio espectral (5s)",pumpkin:"🎃 Escudo de árvore (12s)",firefly:"✨ +2 mangas de munição (6s)"};
const petSprite={bat:"morceguinho_idle",ghost:"fantasminha_idle",pumpkin:"miniabobora_idle",firefly:"vagalume_idle"};
const petFrames={bat:["morceguinho_idle","morceguinho_voando","morceguinho_ataque"],ghost:["fantasminha_idle","fantasminha_voando","fantasminha_ataque"],pumpkin:["miniabobora_idle","miniabobora_andando","miniabobora_ataque"],firefly:["vagalume_idle","vagalume_voando","vagalume_ataque"]};
function orchardRender(){
 const el=$("orchardExtrasBody");if(!el)return;const v=orchardDaily(orchardRead());orchardSave(v);
 $("orchardWallet").textContent="🌱 "+v.seeds+" sementes · Mascote: "+(orchardCatalog.find(x=>x.id===v.pet)?.name||"Nenhum");
 $("infiniteRecord").textContent="♾️ Melhor Defesa Infinita neste navegador: onda "+(v.best||0);
 document.querySelectorAll("#orchardExtras [data-extras-tab]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.extrasTab===orchardTab)));
 const hero=(img,title)=>`<div class="orchard-hero" style="background-image:url('${pixelAsset(img)}')"><strong>${title}</strong></div>`;
 if(orchardTab==="daily"){
  el.innerHTML=hero("missoes_diarias_conceito","📜 Contratos do Pomar")+orchardTasks.map((t,i)=>{const done=Math.min(t.goal,v.stats[t.id]||0),claimed=v.claimed.includes(t.id);return `<div class="orchard-mission"><img alt="" src="${pixelAsset(["besouro","arvore_saudavel","trofeu","sam_andando_1","rei_das_pragas_completo","manga"][i])}"><div class="mission-info"><b>${t.name}</b><div class="sm">${done}/${t.goal} · 🌱 +${t.reward} sementes</div><div class="orchard-progress"><span style="width:${100*done/t.goal}%"></span></div></div><button type="button" class="btn-gothic alt" data-daily="${t.id}" ${claimed||done<t.goal?"disabled":""}>${claimed?"Resgatada":"Resgatar"}</button></div>`}).join("");
 }else{
  el.innerHTML=hero("loja_pomar_conceito",orchardTab==="pets"?"🐾 Seus companheiros":"🛒 Mercado Assombrado")+`<div class="orchard-grid">`+orchardCatalog.filter(t=>orchardTab!=="pets"||v.owned.includes(t.id)).map(t=>`<div class="orchard-card ${v.pet===t.id?"selected":""}"><div class="pet-stage" aria-label="Animação de ${t.name}"><canvas width="210" height="168" data-pet-stage="${t.id}" role="img" aria-label="${t.name}"></canvas></div><b>${t.name}</b><span class="sm">${t.desc}</span><span class="sm orchard-power">${petPowers[t.id]}</span><span class="sm">${v.owned.includes(t.id)?"✓ Desbloqueado":"🌱 "+t.cost+" sementes"}</span><button type="button" class="btn-gothic alt" data-pet="${t.id}">${v.pet===t.id?"Desequipar":v.owned.includes(t.id)?"Equipar":"Comprar"}</button></div>`).join("")+`</div>`+(orchardTab==="pets"&&!v.owned.length?`<p class="sm">Nenhum mascote desbloqueado ainda. Visite a Loja do Pomar!</p>`:"");
 }
}
function orchardAfterBattle(s,won){if(!me||!prof)return;const v=orchardDaily(orchardRead());v.stats.games++;v.stats.kills+=s.kills||0;v.stats.waves+=s.wave||0;v.stats.dashes+=(s.dashes||0);v.stats.novas+=(s.novas||0);v.stats.combo=Math.max(v.stats.combo||0,s.bestCombo||0);v.seeds+=Math.min(150,Math.floor(s.score/150))+(won?20:0)+(s.bossDefeated?100:0);if(s.mode==="infinite")v.best=Math.max(v.best||0,s.wave);orchardSave(v);orchardRender();toast("🌱 Sementes recebidas! Veja a Loja do Pomar.",3500)}
$("orchardExtras").addEventListener("click",e=>{const tab=e.target.closest("[data-extras-tab]");if(tab){orchardTab=tab.dataset.extrasTab;orchardRender();return}const pet=e.target.closest("[data-pet]");const daily=e.target.closest("[data-daily]");if(!pet&&!daily)return;if(!me||!prof){showGate();return}const v=orchardDaily(orchardRead());if(pet){const item=orchardCatalog.find(x=>x.id===pet.dataset.pet);if(!item)return;if(v.pet===item.id)v.pet="";else if(v.owned.includes(item.id))v.pet=item.id;else if(v.seeds>=item.cost){v.seeds-=item.cost;v.owned.push(item.id);v.pet=item.id}else{toast("Sementes insuficientes.");return}}else{const t=orchardTasks.find(x=>x.id===daily.dataset.daily);if(!t||v.claimed.includes(t.id)||(v.stats[t.id]||0)<t.goal)return;v.claimed.push(t.id);v.seeds+=t.reward;toast("Missão diária concluída! +"+t.reward+" sementes")};orchardSave(v);orchardRender()});
$("gDifficulty").addEventListener("click",()=>orchardRender());
orchardRender();

function gameInit(){loadGRank();sm21JobsSync();if(!gs)drawG()}
function stopGame(){cancelAnimationFrame(gRaf);const was=gs;gs=null;gRun=null;sm17GamePause(false);sm21StrategyUi();sm21JobsSync();if(was){$("gOvT").textContent="Partida interrompida";$("gOvP").textContent="Você saiu no meio do jogo. Essa partida não conta.";$("gOvK").textContent="";$("gPlay").textContent="Jogar de novo";$("gOv").hidden=false}}
async function startGame(){
  if(!me||!prof){showGate();return}
  gRun=null;gPl=null;sm21JobsSync();let note="";
  try{if(gDifficulty==="normal")gRun=await rpc("game_start",{p_handle:me,p_token:tok});else note="Modo "+(gDifficulty==="hard"?"Difícil":"Infinito")+" com recorde local; ranking oficial é do modo Normal."}catch(e){note=e.message==="rate"?"Limite de partidas de hoje atingido. Esta é uma partida de treino.":"Servidor do jogo indisponível. Esta é uma partida de treino e não vale ranking."}
  if($("gameDlg").hidden)return;
  sm21SelectedLane=0;sm21Lanes(gHard()?5:3);
  orchardFX.length=0;
  gs={job:sm21Job,energy:2,towers:[],intermission:2,missed:0,dashCd:0,novaCd:0,dashes:0,novas:0,dashFx:0,novaFx:0,combo:0,bestCombo:0,comboTimer:0,lastDir:1,mode:gDifficulty,kills:0,boss:null,bossDefeated:false,x:GW/2,ammo:gHard()?24:12,stun:0,hp:gHard()?5:3,trees:Array(gHard()?5:3).fill(true),treeHits:Array(gHard()?5:3).fill(0),hard:gHard(),score:0,wave:1,wt:0,t:0,sp:0,ft:0,reg:0,petId:orchardRead().pet,petCooldown:2,petFlash:0,playerMaxHp:gHard()?8:6,playerHp:gHard()?8:6,invuln:0,bossShots:[],sh:[],pe:[],it:[]};
  if(gs.job==='guardian')gs.shield=(gs.shield||0)+1;
  // Housing provides perks in unranked training only.
  if(gDifficulty!=='normal'){
    const bonus=window.Sam21House?.getTrainingBonus?.()||{};
    if(bonus.table)gs.ammo=Math.min(gs.ammo+3,gHard()?26:12);
    if(bonus.fireplace)gs.shield=(gs.shield||0)+1;
    if(bonus.bed)gs.playerHp=Math.min(gs.playerMaxHp,gs.playerHp+1);
  }
  $("gOv").hidden=true;sm17GamePause(false);sm21StrategyUi();if(note)toast(note,5000);
  gLast=performance.now();cancelAnimationFrame(gRaf);gRaf=requestAnimationFrame(loop);
}
function loop(t){
  if(!gs)return;
  if(sm17GamePaused || document.hidden){gLast=t;gRaf=requestAnimationFrame(loop);return}
  const dt=Math.min(.05,(t-gLast)/1000);gLast=t;
  if(!stepG(dt))return;
  drawG();gRaf=requestAnimationFrame(loop);
}
function stepG(dt){
  const s=gs;orchardUpdateFX(dt);s.dashCd=Math.max(0,s.dashCd-dt);s.novaCd=Math.max(0,s.novaCd-dt);s.dashFx=Math.max(0,s.dashFx-dt);s.novaFx=Math.max(0,s.novaFx-dt);s.comboTimer=Math.max(0,s.comboTimer-dt);if(!s.comboTimer)s.combo=0;s.bestCombo=Math.max(s.bestCombo||0,s.combo||0);const dashButton=$("sm20Dash"),novaButton=$("sm20Nova");if(dashButton){dashButton.disabled=s.dashCd>0;$("sm20DashCd").textContent=s.dashCd>0?s.dashCd.toFixed(1)+"s":"Pronto"}if(novaButton){novaButton.disabled=s.novaCd>0||s.ammo<3;$("sm20NovaCd").textContent=s.novaCd>0?s.novaCd.toFixed(1)+"s":s.ammo<3?"3 mangas":"Pronto"}$("sm20Combo").textContent="Combo x"+(1+Math.min(3,Math.floor((s.combo||0)/5)));s.intermission=Math.max(0,(s.intermission||0)-dt);sm21TacticsTick(s,dt);s.strategyUpdate=(s.strategyUpdate||0)-dt;if(s.strategyUpdate<=0){s.strategyUpdate=.2;sm21StrategyUi()}s.t+=dt;if(!s.intermission)s.wt+=dt;s.ft-=dt;s.stun-=dt;s.reg+=dt;s.petCooldown-=dt;s.petFlash=Math.max(0,(s.petFlash||0)-dt);if(s.petEffect)s.petEffect.ttl=Math.max(0,s.petEffect.ttl-dt);s.invuln=Math.max(0,(s.invuln||0)-dt);
  if(s.wt>= (s.hard?18:15)){
    if((s.mode==="hard"&&s.wave===10||s.mode==="normal"&&s.wave===5)&&!s.bossDefeated){s.wt=19.5;}
    else {s.score+=s.hard?100:50;sfx(880,.25);if(s.mode!=="infinite"&&s.wave>=(s.hard?10:5)){endG(true);return false}s.wave++;s.wt=0;s.energy=Math.min(12,s.energy+2);s.intermission=3.5;toast('🌙 Próxima onda! +2 energias. Planeje suas rotas.',2500)}
  }
  if((s.mode==="hard"&&s.wave===10||s.mode==="normal"&&s.wave===5)&&!s.boss&&!s.bossDefeated&&s.wt>=2){const hp=s.hard?12:6;s.boss={x:GW/2,y:s.hard?210:178,hp,max:hp,attack:7,hit:0};toast('👑 O Rei das Pragas chegou! Acerte-o '+hp+' vezes!',4500)}
  if(s.boss){s.boss.x=GW/2+Math.sin(s.t*.9)*GW*.22;s.boss.attack-=dt;s.boss.hit=Math.max(0,(s.boss.hit||0)-dt);if(s.boss.attack<=0){s.boss.attack=4.5;const dx=s.x-s.boss.x,dy=GH-90-s.boss.y,len=Math.hypot(dx,dy)||1;for(const offset of [-.20,0,.20]){const a=Math.atan2(dy,dx)+offset;s.bossShots.push({x:s.boss.x,y:s.boss.y+35,vx:Math.cos(a)*195,vy:Math.sin(a)*195,r:11})}orchardBurst(s.boss.x,s.boss.y+40,"#d58aff",1.1,"ATAQUE!");sfx(180,.14)}}
  if(s.reg>=.72){s.reg=0;s.ammo=Math.min(s.hard?26:12,s.ammo+1)}
  const sp=s.stun>0?110:(s.hard?270:220)*(s.job==='ranger'?1.16:1),dir=(K.r?1:0)-(K.l?1:0);if(dir)s.lastDir=dir;s.x=Math.max(38,Math.min(GW-38,s.x+dir*sp*dt));
  if(K.f&&s.ft<=0&&s.ammo>0&&s.stun<=0){s.ft=(s.hard?.13:.22)*(s.job==='ranger'?.76:1);s.ammo--;s.sh.push({x:s.x,y:GH-100,vy:-500,trail:0});orchardBurst(s.x,GH-104,"#ffcf55",.27);sfx(660,.06)}
  s.sp-=dt;
  if(s.sp<=0&&!s.intermission){
    s.sp=s.hard?Math.max(.42,.98-s.wave*.047)/.7:Math.max(.6,1.5-s.wave*.15);const x=38+Math.random()*(GW-76),r=Math.random();
    if(r<.182)s.it.push({x,y:-10,vy:65,k:"m"});
    else if(r<.182+.045+s.wave*.009)s.it.push({x,y:-10,vy:90,k:"r"});
    else{const beetle=s.hard?(Math.random()<Math.min(.64,.25+s.wave*.038)):(s.wave>=3&&Math.random()<.3);const runner=!beetle&&s.wave>=3&&Math.random()<.26;
 const healer=s.hard&&s.wave>=4&&!beetle&&!runner&&Math.random()<.19;
 const spore=!beetle&&!runner&&!healer&&s.wave>=2&&Math.random()<.18;
 const hp=healer?3:beetle?2:1;
 s.pe.push({x,y:-10,originX:x,phase:Math.random()*6.28,vy:(s.hard?49+s.wave*9:34+s.wave*9)*(runner?1.65:healer?.72:spore?.85:1),hp,maxHp:hp,healCd:healer?2.1:0,kind:beetle?'beetle':runner?'runner':healer?'healer':spore?'spore':'larva'})}
  }
  // Mascotes com poderes reais; todos funcionam apenas quando equipados.
  if(s.petId&&s.petCooldown<=0){
   const id=s.petId; s.petCooldown={bat:4,ghost:5,pumpkin:12,firefly:6}[id]||5;s.petFlash=.55;s.petEffect={id,ttl:.55,x:s.x+(s.x>GW*.66?-45:45),y:GH-132,tx:s.x,ty:GH-128};
   if(id==="firefly"){s.ammo=Math.min(s.hard?26:12,s.ammo+2);orchardBurst(s.x+42,GH-120,"#d8ff81",.6,"+2 🥭")}
   if(id==="pumpkin"){if(s.petEffect){s.petEffect.tx=GW*(.5)/s.trees.length;s.petEffect.ty=GH-104;}s.shield=(s.shield||0)+1;orchardBurst(s.x+42,GH-120,"#ffc26a",.7,"ESCUDO")}
   if(id==="bat"||id==="ghost"){
    const target=s.pe.filter(p=>!p.dead).sort((a,b)=>b.y-a.y)[0];if(target&&s.petEffect){s.petEffect.tx=target.x;s.petEffect.ty=target.y;}else if(s.boss&&s.petEffect){s.petEffect.tx=s.boss.x;s.petEffect.ty=s.boss.y;}
    if(target){const damage=id==="ghost"?2:1;target.hp-=damage;target.hit=.32;orchardBurst(target.x,target.y,id==="ghost"?"#d7b0ff":"#ffd67e",1.1,"-"+damage);if(target.hp<=0){target.dead=1;s.kills++;s.combo=(s.combo||0)+1;s.comboTimer=5;s.score+=s.hard?20:10}}
    else if(s.boss){s.boss.hp-=1;s.boss.hit=.3;orchardBurst(s.boss.x,s.boss.y,"#d9b0ff",1,"-1");if(s.boss.hp<=0){s.boss=null;s.bossDefeated=true;s.score+=1500;toast("👑 Rei das Pragas derrotado!",3500)}}
    }
   }
  s.sh.forEach(b=>{b.y+=b.vy*dt;b.trail=(b.trail||0)+dt;if(b.trail>.055){b.trail=0;orchardFX.push({x:b.x+(Math.random()-.5)*8,y:b.y+9,vx:(Math.random()-.5)*18,vy:30,life:.18,max:.18,c:"#ffc45e",size:3})}});s.sh=s.sh.filter(b=>b.y>-10);
  s.pe.forEach(p=>{p.slow=Math.max(0,(p.slow||0)-dt);p.rooted=Math.max(0,(p.rooted||0)-dt);p.y+=p.vy*dt*(p.rooted>0?0:p.slow>0?.38:1);if(p.kind==="spore")p.x=Math.max(30,Math.min(GW-30,(p.originX||p.x)+Math.sin(s.t*2.7+p.phase)*27));p.hit=Math.max(0,(p.hit||0)-dt)});sm24HealTick(s,dt);s.it.forEach(i=>i.y+=i.vy*dt);
  s.bossShots.forEach(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt});
  s.bossShots=s.bossShots.filter(b=>{if(Math.hypot(b.x-s.x,b.y-(GH-90))<b.r+19){orchardHurtPlayer(s,2,b.x,b.y,"REI DAS PRAGAS");return false}return b.y<GH+25&&b.x>-25&&b.x<GW+25});
  s.pe.forEach(p=>{if(!p.dead&&Math.hypot(p.x-s.x,p.y-(GH-90))<(p.kind==="beetle"?39:34)){orchardHurtPlayer(s,p.kind==="beetle"?2:1,p.x,p.y,p.kind==="beetle"?"BESOURO":"LARVA");p.dead=true}});
  for(const b of s.sh)for(const p of s.pe)if(!b.d&&!p.dead&&near(b,p,p.kind==="beetle"?37:32)){b.d=1;p.hit=.2;p.y-=5;orchardBurst(p.x,p.y,p.kind==="beetle"?"#b9ff79":"#ffcf73",1.35,"-1");if(--p.hp<=0){p.dead=1;s.kills++;s.energy=Math.min(12,s.energy+1);s.score+=s.hard?20:10;sfx(330,.08)}}
  if(s.boss)for(const b of s.sh)if(!b.d&&Math.abs(b.x-s.boss.x)<53&&Math.abs(b.y-s.boss.y)<42){b.d=1;s.boss.hp--;s.boss.hit=.28;orchardBurst(b.x,b.y,"#e0a5ff",1.5,"-1");s.score+=30;sfx(490,.07);if(s.boss.hp<=0){orchardBurst(s.boss.x,s.boss.y,"#ffdd83",4,"REI DERROTADO!");s.boss=null;s.bossDefeated=true;s.score+=s.hard?1500:180;toast("👑 Rei das Pragas derrotado!",4500);break}}
  s.sh=s.sh.filter(b=>!b.d);
  s.pe=s.pe.filter(p=>{if(p.dead)return false;if(p.y>GH-60){const alive=s.trees.map((ok,i)=>ok?i:-1).filter(i=>i>=0);if(alive.length){const lane=Math.max(0,Math.min(s.trees.length-1,Math.floor(p.x/GW*s.trees.length)));const target=s.trees[lane]?lane:alive.reduce((best,i)=>Math.abs(i-lane)<Math.abs(best-lane)?i:best,alive[0]);if((s.shield||0)>0){s.shield--;orchardBurst(GW*(target+.5)/s.trees.length,GH-72,"#ffcf70",.9,"DEFESA!")}
      else if(!s.hard||p.kind==="beetle"||(s.treeHits[target]=(s.treeHits[target]||0)+1)>=2){s.trees[target]=false;s.hp=s.trees.filter(Boolean).length}} sfx(120,.25);return false}return true});
  const me2={x:s.x,y:GH-90};
  s.it=s.it.filter(i=>{if(near(i,me2,s.petId==="firefly"?72:40)){if(i.k==="m"){s.playerHp=Math.min(s.playerMaxHp,s.playerHp+2);s.ammo=Math.min(s.hard?26:12,s.ammo+4);s.score+=s.hard?15:8;orchardBurst(i.x,i.y,"#a5ff91",.85,"+2 VIDA");sfx(990,.08)}else{orchardHurtPlayer(s,1,i.x,i.y,"PEDRA");s.stun=.45;sfx(100,.3)}return false}return i.y<GH});
  if(s.hp<=0||s.playerHp<=0){endG(false);return false}
  return true;
}
// Vida independente do personagem: árvores e personagem têm condições de derrota separadas.
function orchardHurtPlayer(s,amount,x,y,source){
 if(s.invuln>0||s.playerHp<=0)return;
 s.playerHp=Math.max(0,s.playerHp-amount);s.invuln=1.05;s.stun=Math.max(s.stun,.2);
 orchardBurst(x,y,"#ff718e",1.2,"-"+amount+" ❤");sfx(130,.14);
 if(s.playerHp===0)toast("💔 Sam ficou sem vida!",2300);
}
// Impactos estilo RPG: partículas, números de dano e flashes sem imagens cortadas.
const orchardFX=[];
function orchardBurst(x,y,color="#ffeaa2",power=1,damage=""){
 const count=document.documentElement.classList.contains('sm165-lowfx')||matchMedia('(prefers-reduced-motion: reduce)').matches?Math.min(4,Math.round(11*power)):Math.round(11*power);for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,v=(40+Math.random()*110)*power;orchardFX.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-20,life:.25+Math.random()*.24,max:.49,c:color,size:2+Math.random()*4})}
 if(damage)orchardFX.push({x,y:y-14,vx:0,vy:-48,life:.6,max:.6,c:"#fff5d0",label:damage});
}
function orchardUpdateFX(dt){for(let i=orchardFX.length-1;i>=0;i--){const p=orchardFX[i];p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=100*dt;if(p.life<=0)orchardFX.splice(i,1)}}
function orchardDrawFX(g){g.save();for(const p of orchardFX){g.globalAlpha=Math.min(1,p.life/(p.max||.5));if(p.label){g.textAlign="center";g.font="bold 17px monospace";g.fillStyle="#291321";g.fillText(p.label,p.x+1,p.y+2);g.fillStyle=p.c;g.fillText(p.label,p.x,p.y)}else{g.fillStyle=p.c;g.fillRect(Math.round(p.x),Math.round(p.y),Math.ceil(p.size),Math.ceil(p.size))}}g.restore()}

function drawG(){
  const g=gx,s=gs||{x:GW/2,ammo:10,hp:gHard()?5:3,trees:Array(gHard()?5:3).fill(true),treeHits:Array(gHard()?5:3).fill(0),hard:gHard(),score:0,wave:1,sh:[],pe:[],it:[],stun:0,ft:0,playerMaxHp:gHard()?8:6,playerHp:gHard()?8:6,bossShots:[],invuln:0,t:0};
  const t=s.t||0;
  v11Backdrop(g,t,GW,GH);
  // Camadas de atmosferas: nuvens suaves, pétalas e vaga-lumes em paralaxe.
  g.save();const lowFX=document.documentElement.classList.contains("sm165-lowfx")||matchMedia("(prefers-reduced-motion: reduce)").matches;for(let i=0;i<(lowFX?6:24);i++){const x=((i*97.7+t*(9+i%3*6))%(GW+45))-20,y=90+(i*79)%(GH-150);g.globalAlpha=.12+.14*Math.sin(t*1.1+i)*Math.sin(t*1.1+i);g.fillStyle=i%3===0?"#f8b8ce":i%3===1?"#deec9f":"#85dcd9";g.fillRect(x,y,2+(i%3),2+(i%3))}g.restore();
  g.textAlign='center';g.textBaseline='middle';g.imageSmoothingEnabled=false;
  // Bottom-anchored trees: roots never run below the canvas, unlike V10.
  Array.from({length:s.trees.length},(_,i)=>GW*(i+.5)/s.trees.length).forEach((x,i)=>{
    const alive=s.trees[i];const variant=!alive?'arvore_destruida':s.hard&&s.treeHits&&s.treeHits[i]>0?'arvore_danificada':'arvore_saudavel';
    const sway=alive?Math.sin(t*.85+i*.92)*.018:0;
    if(!sm24DrawSprite(g,variant,x,GH-19,s.hard?98:117,s.hard?114:126,t,true)&&!v11Draw(g,variant,x,GH-19,s.hard?98:117,s.hard?114:126,{anchor:'bottom',rotate:sway})){
      const c=alive?treeCv():spr('stump');const k=alive?2.6:3;g.drawImage(c,x-c.width*k/2,GH-16-c.height*k,c.width*k,c.height*k)
    }
    // Shield around vulnerable tree during pumpkin power.
    if(alive&&s.shield>0&&s.petId==='pumpkin'){
      g.save();g.strokeStyle='#eab365';g.globalAlpha=.4+.2*Math.sin(t*4+i);g.lineWidth=2;
      g.beginPath();g.ellipse(x,GH-90,s.hard?42:46,63,0,0,Math.PI*2);g.stroke();g.restore();
    }
  });
  if(s.boss){
    const b=s.boss,pulse=Math.sin(t*3),hit=Math.max(0,b.hit||0),attack=(b.attack||0)<1;
    g.save();g.globalAlpha=.3;g.fillStyle='#6d2c8a';g.beginPath();g.ellipse(b.x,b.y+74,78,9,0,0,Math.PI*2);g.fill();g.restore();
    if(attack){g.save();g.globalAlpha=.18+.12*Math.sin(t*22);g.fillStyle='#ff7e26';g.beginPath();g.arc(b.x,b.y,104,0,Math.PI*2);g.fill();g.restore()}
    const shake=hit>0?Math.sin(t*76)*4*hit/.3:0;
    sm24DrawSprite(g,'rei_pragas',b.x+shake,b.y+Math.sin(t*2.4)*2,195,166,t)||v11Draw(g,'rei_das_pragas_completo',b.x+shake,b.y+Math.sin(t*2.4)*2,195,166,{scale:1+Math.sin(t*2.2)*.018,rotate:attack?Math.sin(t*15)*.018:0,alpha:hit>0?.85:1});
    if(hit>0){g.save();g.globalAlpha=.12*hit/.3;g.fillStyle='#fff9ff';g.beginPath();g.ellipse(b.x,b.y,98,75,0,0,Math.PI*2);g.fill();g.restore()}
    const barw=116,y=b.y-94;g.fillStyle='#160f20';g.fillRect(b.x-barw/2-2,y-2,barw+4,12);
    g.fillStyle='#9b3157';g.fillRect(b.x-barw/2,y,barw,8);g.fillStyle='#9dff95';g.fillRect(b.x-barw/2,y,barw*Math.max(0,b.hp/b.max),8);
    g.fillStyle='#fff0dc';g.font='bold 13px sans-serif';g.fillText('REI DAS PRAGAS',b.x,y-12);
  }
  s.pe.forEach(p=>{
    const beetle=p.kind==='beetle',sz=beetle?63:56;
    const bob=Math.sin(t*8+p.x*.07)*2;
    g.save();g.fillStyle='#06150c88';g.beginPath();g.ellipse(p.x,p.y+sz*.40,sz*.35,4,0,0,Math.PI*2);g.fill();
    if(p.hit>0){g.shadowColor='#fff5bb';g.shadowBlur=12;g.globalAlpha=.76+Math.sin(t*64)*.2}
    if(sm24DrawSprite(g,p.kind==='runner'?'praga_corredor':p.kind==='beetle'?'praga_besouro':p.kind==='spore'?'praga_esporo':p.kind==='healer'?'praga_curandeira':'praga_larva',p.x,p.y+bob,sz,sz,t)){}else if(p.kind==='runner'&&sm22RunnerSprite.complete&&sm22RunnerSprite.naturalWidth){
      g.imageSmoothingEnabled=false;g.drawImage(sm22RunnerSprite,(lowFX?0:Math.floor(t*9+p.phase)%4)*48,0,48,48,p.x-sz/2,p.y+bob-sz/2,sz,sz);
    }else if(!v11Draw(g,beetle?'besouro':p.kind==='spore'?'esporo_v20':'larva_pequena',p.x,p.y+bob,sz,sz)){
      const fallback=spr(beetle?'beetle':'pest');g.drawImage(fallback,p.x-20,p.y+bob-20,40,40)
    }
    g.restore();
  });
  (s.bossShots||[]).forEach(b=>{g.save();g.shadowColor='#bb70ff';g.shadowBlur=14;g.fillStyle='#a14cfc';g.beginPath();g.arc(b.x,b.y,b.r,0,Math.PI*2);g.fill();g.fillStyle='#fff2fb';g.fillRect(b.x-3,b.y-3,6,6);g.restore()});
  s.it.forEach(i=>v11Draw(g,i.k==='m'?'manga':'semente',i.x,i.y,34,38));
  s.sh.forEach(b=>{g.save();g.globalAlpha=.26;g.fillStyle='#fdaf44';g.fillRect(b.x-3,b.y+6,6,18);g.restore();v11Draw(g,'manga',b.x,b.y,22,28)});
  g.save();g.globalAlpha=s.invuln>0&&Math.floor(t*13)%2===0?.46:s.stun>0?.7:1;
  const moving=(K.r?1:0)-(K.l?1:0),shooting=(s.ft||0)>.075;
  const playerName=shooting?'sam_atacando':moving?'sam_andando_1':'sam_idle';
  v11Draw(g,playerName,s.x,GH-36+Math.sin(t*9)*Math.abs(moving)*1.2,65,70,{anchor:'bottom',rotate:moving*.025});
  g.restore();
  const pet=orchardCatalog.find(x=>x.id===s.petId);
  if(pet){
    const id=pet.id,petx=s.x+(s.x>GW*.66?-45:45)+Math.sin(t*1.8)*5,pety=GH-132+Math.sin(t*3.5+1)*5;
    const arr=s.petFlash>.06?[petFrames[id][2]]:v11StageFrames[id];
    g.save();
    const shadowColor={bat:'#ba70f2',ghost:'#85eafa',pumpkin:'#ffb45a',firefly:'#e4ff9a'}[id];
    g.globalAlpha=.25+.12*Math.sin(t*3);g.fillStyle=shadowColor;g.beginPath();g.ellipse(petx,pety+7,34,31,0,0,Math.PI*2);g.fill();g.restore();
    v11Frame(g,arr,t+id.length*.13,4.2,petx,pety,id==='bat'?80:70,id==='bat'?70:71,{rotate:Math.sin(t*3)*.045,scale:s.petFlash>.06?1.12:1});
  }
  sm21DrawTowers(g,s,t);
  v11Magic(g,s);
  if(s.novaFx>0){g.save();g.strokeStyle="#bda5ff";g.shadowColor="#9bdfff";g.shadowBlur=24;g.lineWidth=4;g.globalAlpha=Math.min(1,s.novaFx/.35);g.beginPath();g.arc(s.x,GH-135,154*(1-s.novaFx/.65),0,Math.PI*2);g.stroke();g.restore()}
  if(s.dashFx>0){g.save();g.strokeStyle="#72e6e6";g.globalAlpha=Math.min(1,s.dashFx/.35);for(let i=0;i<4;i++){g.beginPath();g.moveTo(s.x-(s.lastDir||1)*(15+i*12),GH-108+i*7);g.lineTo(s.x-(s.lastDir||1)*(36+i*12),GH-108+i*7);g.stroke()}g.restore()}
  orchardDrawFX(g);
  // HUD: warm, crisp panels; keep the text within the canvas in both modes.
  g.save();g.fillStyle='#08131bd8';g.fillRect(5,3,GW-10,s.hard?92:72);
  g.fillStyle='#f4e9ca';g.font='bold 13px sans-serif';g.textAlign='left';
  g.fillText((s.hard?'DIFÍCIL · ':'')+'Pontos '+s.score+' · Onda '+s.wave+(s.mode==='infinite'?'∞':'/'+(s.hard?10:5))+' · 🥭 '+s.ammo,12,17);
  g.font='12px sans-serif';g.fillText('Árvores: '+s.hp+'/'+s.trees.length+(s.shield?' · Escudos: '+s.shield:''),12,37);
  const hp=Math.max(0,s.playerHp??s.playerMaxHp??6),maxHp=s.playerMaxHp||6;
  const barY=s.hard?68:47;g.fillStyle='#251523';g.fillRect(10,barY,150,18);
  g.fillStyle=hp/maxHp>.35?'#e65a7a':'#ff8d45';g.fillRect(13,barY+3,144*hp/maxHp,12);
  g.strokeStyle='#f4cb9e';g.lineWidth=1.4;g.strokeRect(10,barY,150,18);
  g.fillStyle='#fff';g.font='bold 11px sans-serif';g.fillText('❤ '+hp+'/'+maxHp,20,barY+9);
  g.font='bold 11px sans-serif';g.fillStyle='#f5e4ac';g.fillText('✦ '+(s.energy||0)+' ENERGIA',GW-118,barY+10);
  if(s.hard&&s.treeHits){g.font='11px sans-serif';g.fillText('Larvas: 2 mordidas · Besouros: 1',12,89)}
  g.restore();
}


