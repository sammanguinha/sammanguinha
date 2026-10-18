/* Sam Manguinha — Mundo do Pomar v12. Progresso local; jogos originais preservados. */
(()=>{'use strict';
 const host=document.getElementById('rpgDlg');
 const cv=document.getElementById('r12Canvas');if(!host||!cv)return;
 const ctx=cv.getContext('2d',{alpha:false});
 const W=768,H=448,T=32,COLS=24,ROWS=14;
 const $=id=>document.getElementById(id);
 const keys={up:false,down:false,left:false,right:false};
 const rooms={
  vila:{name:'Vila da Mangueira',subtitle:'O início de toda colheita',floor:'#294d35',dirt:'#756043',night:false,
   blocks:[{x:2,y:2,w:5,h:3,type:'loja'},{x:17,y:2,w:5,h:3,type:'casa'},{x:2,y:9,w:4,h:3,type:'defesa'},{x:18,y:9,w:4,h:3,type:'portal'}],
   props:[{x:7,y:3,type:'tree'},{x:16,y:11,type:'tree'},{x:7,y:10,type:'tree'}],
   actors:[{id:'guarda',x:11.5,y:8.4,type:'npc',label:'Guardião Bento'},{id:'livia',x:17,y:7,type:'npc',label:'Lívia'},{id:'loja',x:4.5,y:5.6,type:'shop',label:'Loja dos Mascotes'},{id:'defesa',x:4.0,y:8.1,type:'defense',label:'Arena de Defesa'},{id:'halloween',x:20,y:8.15,type:'halloween',label:'Pomar das Sombras'},{id:'forest',x:12,y:1.25,type:'passage',label:'Trilha Encantada'},{id:'profile',x:19,y:5.5,type:'profile',label:'Seu Refúgio'},{id:'praca',x:13.7,y:5.6,type:'social',label:'Praça Ao Vivo'}]},
  floresta:{name:'Trilha Encantada',subtitle:'As sementes seguem a luz',floor:'#24442e',dirt:'#5c5434',night:false,
   blocks:[{x:2,y:2,w:3,h:2,type:'rocks'},{x:17,y:2,w:3,h:2,type:'rocks'},{x:8,y:9,w:3,h:2,type:'rocks'}],
   props:[{x:4,y:7,type:'tree'},{x:6,y:11,type:'tree'},{x:10,y:2,type:'tree'},{x:15,y:10,type:'tree'},{x:20,y:11,type:'tree'},{x:12,y:7,type:'tree'}],
   actors:[{id:'toVila',x:1.3,y:7,type:'passage',label:'Voltar à Vila'},{id:'toRuinas',x:22,y:6.8,type:'door',label:'Santuário das Raízes'},{id:'seedA',x:6.5,y:4.1,type:'seed',label:'Semente Solar'},{id:'seedB',x:16,y:6.8,type:'seed',label:'Semente Lunar'},{id:'seedC',x:19,y:10.5,type:'seed',label:'Semente Ancestral'},{id:'firefly',x:4,y:10.5,type:'npc',label:'Lumi, o Vaga-lume'}]},
  ruinas:{name:'Santuário das Raízes',subtitle:'As raízes guardam promessas antigas',floor:'#333547',dirt:'#676078',night:true,
   blocks:[{x:4,y:2,w:3,h:3,type:'ruin'},{x:17,y:2,w:3,h:3,type:'ruin'},{x:5,y:10,w:3,h:2,type:'ruin'},{x:16,y:10,w:3,h:2,type:'ruin'}],
   props:[{x:5,y:7,type:'dead'},{x:18,y:7,type:'dead'},{x:10,y:11,type:'dead'}],
   actors:[{id:'toFloresta',x:1.5,y:7,type:'passage',label:'Retornar à Floresta'},{id:'altar',x:12,y:5.5,type:'altar',label:'Altar das Três Sementes'},{id:'reliquia',x:12,y:9.2,type:'relic',label:'Relíquia do Guardião'},{id:'portalSombras',x:22,y:6.8,type:'halloween',label:'Portal de Halloween'},{id:'espirito',x:8.5,y:6.8,type:'npc',label:'Eco de Eldra'}]}
 };

/* Regiões inéditas da campanha. Conectadas ao mapa original sem substituí-lo. */
Object.assign(rooms,{
 estufa:{name:'Estufa das Brasas',subtitle:'O fogo que aquece ou devora',floor:'#474631',dirt:'#8b704a',night:false,
  blocks:[{x:2,y:2,w:4,h:3,type:'ruin'},{x:18,y:2,w:4,h:3,type:'ruin'}],props:[{x:5,y:3,type:'dead'},{x:18,y:10,type:'tree'},{x:6,y:11,type:'tree'}],actors:[
   {id:'toRuinasBack',x:1.4,y:7,type:'passage',epic:'gate',target:'ruinas',tx:20.4,ty:9.8,label:'Voltar ao Santuário'},
   {id:'maira',x:9,y:5,type:'npc',epic:'npc',min:1,label:'Maíra, a Vidreira'},
   {id:'dew',x:6.3,y:9.0,type:'seed',epic:'resource',min:1,label:'Orvalho Solar'},
   {id:'glass',x:19.1,y:7.3,type:'seed',epic:'resource',min:1,label:'Vidro-Lua'},
   {id:'larva',x:13.5,y:9.5,type:'npc',epic:'enemy',min:1,label:'Larva da Ferrugem'},
   {id:'furnace',x:12,y:3.4,type:'altar',epic:'altar',min:1,label:'Fornalha Ancestral'}]},
 bosque:{name:'Bosque das Teias',subtitle:'Os nomes que a teia tentou calar',floor:'#2e3633',dirt:'#635747',night:true,
  blocks:[{x:2,y:2,w:4,h:3,type:'rocks'},{x:17,y:2,w:3,h:3,type:'rocks'}],props:[{x:4,y:10,type:'dead'},{x:8,y:3,type:'dead'},{x:18,y:11,type:'dead'},{x:21,y:3,type:'dead'}],actors:[
   {id:'toForestBack',x:1.4,y:7,type:'passage',epic:'gate',target:'floresta',tx:12,ty:10.9,label:'Voltar à Trilha'},
   {id:'elder',x:9.7,y:6.2,type:'npc',epic:'npc',min:2,label:'Eco de Eldra'},
   {id:'stoneRoot',x:6.3,y:8.5,type:'seed',epic:'resource',min:2,label:'Pedra da Raiz'},
   {id:'stoneLeaf',x:15.3,y:4.9,type:'seed',epic:'resource',min:2,label:'Pedra da Folha'},
   {id:'stoneDew',x:19.8,y:9.8,type:'seed',epic:'resource',min:2,label:'Pedra do Orvalho'},
   {id:'oath',x:12,y:4.2,type:'altar',epic:'altar',min:2,label:'Círculo das Vozes'},
   {id:'spider',x:17,y:7.4,type:'npc',epic:'enemy',need:'oathDone',min:2,label:'Rainha das Aranhas'},
   {id:'toMine',x:22.2,y:6.6,type:'door',epic:'gate',min:3,target:'mina',tx:2.9,ty:7,label:'Minas do Prisma'}]},
 mina:{name:'Minas do Prisma Partido',subtitle:'Pedras que guardam os trovões',floor:'#313643',dirt:'#554e55',night:true,
  blocks:[{x:3,y:2,w:3,h:3,type:'rocks'},{x:18,y:2,w:3,h:3,type:'rocks'},{x:10,y:10,w:4,h:2,type:'rocks'}],props:[{x:7,y:7,type:'dead'},{x:17,y:11,type:'dead'}],actors:[
   {id:'toBosqueBack',x:1.4,y:7,type:'passage',epic:'gate',target:'bosque',tx:21.1,ty:7,label:'Voltar ao Bosque'},
   {id:'miner',x:6.4,y:6.3,type:'npc',epic:'npc',min:3,label:'Dário, o Mineiro'},
   {id:'gemBlue',x:7.4,y:10.7,type:'seed',epic:'resource',min:3,label:'Cristal Azul'},
   {id:'gemAmber',x:14.7,y:5.3,type:'seed',epic:'resource',min:3,label:'Cristal Âmbar'},
   {id:'gemWhite',x:21,y:9.8,type:'seed',epic:'resource',min:3,label:'Cristal Branco'},
   {id:'prism',x:12,y:4.3,type:'altar',epic:'altar',min:3,label:'Máquina Prismática'},
   {id:'crystalBoss',x:18,y:7.0,type:'npc',epic:'enemy',min:3,need:'prismDone',label:'Besouro Prismático'},
   {id:'toSwamp',x:22.1,y:6.9,type:'door',epic:'gate',min:4,target:'pantano',tx:2.7,ty:7,label:'Pântano das Memórias'}]},
 pantano:{name:'Pântano das Memórias',subtitle:'Onde as vozes repousam',floor:'#273e46',dirt:'#586660',night:true,
  blocks:[{x:3,y:2,w:3,h:2,type:'rocks'},{x:17,y:2,w:4,h:3,type:'rocks'}],props:[{x:4,y:10,type:'dead'},{x:9,y:3,type:'dead'},{x:17,y:11,type:'dead'}],actors:[
   {id:'toMineBack',x:1.5,y:7,type:'passage',epic:'gate',target:'mina',tx:20.6,ty:7,label:'Voltar às Minas'},
   {id:'voice',x:6.2,y:7.1,type:'npc',epic:'npc',min:4,label:'Voz sem Rosto'},
   {id:'echoOne',x:6.0,y:10,type:'seed',epic:'resource',min:4,label:'Primeiro Eco'},
   {id:'echoTwo',x:14.6,y:5.7,type:'seed',epic:'resource',min:4,label:'Segundo Eco'},
   {id:'echoThree',x:19.4,y:10.3,type:'seed',epic:'resource',min:4,label:'Terceiro Eco'},
   {id:'collector',x:15,y:8.4,type:'npc',epic:'enemy',min:4,label:'Colecionador de Vozes'},
   {id:'memoryChoice',x:11.8,y:3.7,type:'altar',epic:'altar',min:4,label:'Fonte das Memórias'},
   {id:'toTower',x:22,y:6.9,type:'door',epic:'gate',min:5,target:'observatorio',tx:2.8,ty:7,label:'Observatório Lunar'}]},
 observatorio:{name:'Observatório da Lua',subtitle:'O céu conhece cada partida',floor:'#303553',dirt:'#615c83',night:true,
  blocks:[{x:3,y:2,w:4,h:3,type:'ruin'},{x:17,y:2,w:4,h:3,type:'ruin'}],props:[{x:6,y:11,type:'dead'},{x:19,y:11,type:'dead'}],actors:[
   {id:'toSwampBack',x:1.4,y:7,type:'passage',epic:'gate',target:'pantano',tx:20.7,ty:7,label:'Voltar ao Pântano'},
   {id:'selene',x:7,y:6,type:'npc',epic:'npc',min:5,label:'Selene, Astrônoma'},
   {id:'lunarAltar',x:11.6,y:3.7,type:'altar',epic:'altar',min:5,label:'Relógio Lunar'},
   {id:'moonGuardian',x:16.4,y:8.5,type:'npc',epic:'enemy',need:'moonDone',min:5,label:'Sentinela do Eclipse'},
   {id:'toHeart',x:22,y:6.8,type:'door',epic:'gate',min:6,target:'coracao',tx:2.9,ty:7,label:'Coração do Pomar'}]},
 coracao:{name:'Coração do Pomar',subtitle:'A raiz de todas as lembranças',floor:'#473348',dirt:'#6d4962',night:true,
  blocks:[{x:3,y:2,w:4,h:2,type:'ruin'},{x:17,y:2,w:4,h:2,type:'ruin'}],props:[{x:5,y:11,type:'dead'},{x:18,y:10,type:'tree'}],actors:[
   {id:'toTowerBack',x:1.5,y:7,type:'passage',epic:'gate',target:'observatorio',tx:20.7,ty:7,label:'Voltar ao Observatório'},
   {id:'heartVoice',x:6.5,y:5,type:'npc',epic:'npc',min:6,label:'Última lembrança de Eldra'},
   {id:'finalKing',x:14.8,y:7.5,type:'npc',epic:'enemy',min:6,label:'Rei das Pragas'},
   {id:'destiny',x:12.5,y:11,type:'altar',epic:'altar',min:6,label:'Altar da Última Colheita'}]}
});
rooms.vila.actors.push(
 {id:'oldAmalia',x:8,y:5.7,type:'npc',epic:'npc',label:'Dona Amália'},
 {id:'alchemist',x:15,y:7.5,type:'npc',epic:'npc',label:'Tito, o Botânico'}
);
rooms.floresta.actors.push(
 {id:'toBosque',x:12,y:12,type:'passage',epic:'gate',min:2,target:'bosque',tx:2.7,ty:7,label:'Bosque das Teias'},
 {id:'basket',x:5.4,y:11.4,type:'seed',epic:'resource',label:'Cesta de Amália'},
 {id:'herb',x:21.4,y:4.8,type:'seed',epic:'resource',label:'Broto Luminoso'}
);
rooms.ruinas.actors.push({id:'toEstufa',x:20.5,y:11,type:'door',epic:'gate',min:1,target:'estufa',tx:2.8,ty:7,label:'Estufa das Brasas'});

 const storageKey=()=>{const handle=(typeof window.me!=='undefined'&&window.me)||localStorage.getItem('sg_handle')||'visitante';return 'sam_rpg_hibrido_v12_'+String(handle).toLowerCase()};
 const blank=()=>({map:'vila',x:11.7,y:10.8,found:[],unlocked:false,relic:false,bonus:false,altarActive:false,ritualStep:0,seen:[],journal:['O Guardião Bento espera por você na vila.'],visits:0,epic:freshEpic()});
 let accountRpgKey=storageKey();let st=blank();try{let raw=JSON.parse(localStorage.getItem(storageKey())||'null');if(raw&&rooms[raw.map]&&Number.isFinite(raw.x)&&Number.isFinite(raw.y))st={...blank(),...raw,found:Array.isArray(raw.found)?raw.found:[],seen:Array.isArray(raw.seen)?raw.seen:[],journal:Array.isArray(raw.journal)?raw.journal:[]}}catch(e){}
 st.epic={...freshEpic(),...(st.epic||{}),stats:{...freshEpic().stats,...(st.epic?.stats||{})},flags:{...(st.epic?.flags||{})},items:Array.isArray(st.epic?.items)?st.epic.items:['semente_guardia'],equipped:Array.isArray(st.epic?.equipped)?st.epic.equipped:['semente_guardia'],defeated:Array.isArray(st.epic?.defeated)?st.epic.defeated:[]};
 const v23Sprites=Object.fromEntries(['bento','livia','eldra','maira'].map(name=>{const im=new Image();im.src='sprites/npc_'+name+'_v23.svg';return [name,im]}));
 const imgCache=new Map();const sprite=name=>{if(!imgCache.has(name)){const i=new Image();i.src='sprites/'+name+(name==='aranha_rainha_v14'?'.svg':'.png');imgCache.set(name,i)}return imgCache.get(name)};
 const player={x:st.x,y:st.y,vx:0,vy:0};let nextSave=0,last=0,clock=0,visible=false,touchDest=null,dialogOpen=false,lastTip='';
 const room=()=>rooms[st.map];
 // V23 · guia de destinos ancorado nas posições reais dos atores. Não teleporta nem altera missões.
 const guide={
  guardiao:{label:'Guardião Bento',map:'vila',id:'guarda'},
  casa:{label:'Seu Refúgio',map:'vila',id:'profile'},
  defesa:{label:'Arena de Defesa',map:'vila',id:'defesa'},
  praca:{label:'Praça Ao Vivo',map:'vila',id:'praca'},
  floresta:{label:'Trilha Encantada',map:'vila',id:'forest'}
 };
 let guideKey='guardiao';
 function guideTarget(){const item=guide[guideKey];return item?{...item,actor:rooms[item.map]?.actors.find(a=>a.id===item.id)}:null}
 function guideUI(){
  const el=$('r23GuideText'),target=guideTarget();
  if(!el||!target)return;
  const reach=target.map===st.map&&target.actor;
  const steps=reach?Math.round(Math.hypot(player.x-target.actor.x,player.y-target.actor.y)*T):null;
  el.textContent=reach?'Destino: '+target.label+' · '+steps+' px de distância':'Destino: '+target.label+' · retorne à Vila da Mangueira';
  document.querySelectorAll('[data-r23-guide]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.r23Guide===guideKey)));
 }
 function guideDraw(){
  const target=guideTarget();if(!target||target.map!==st.map||!target.actor)return;
  const {x,y}=target.actor,px=x*T,py=y*T;
  ctx.save();ctx.strokeStyle='#ffe6a1';ctx.lineWidth=2;
  ctx.setLineDash([6,4]);ctx.globalAlpha=.52;
  ctx.beginPath();ctx.arc(px,py-8,23+Math.sin(clock*2)*3,0,Math.PI*2);ctx.stroke();
  ctx.setLineDash([]);ctx.globalAlpha=1;
  ctx.fillStyle='#fff1bd';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  ctx.fillText('◆',px,py-43+Math.sin(clock*3)*3);
  ctx.restore()
 }
 $('r23GuideList')?.addEventListener('click',e=>{
   const b=e.target.closest('[data-r23-guide]');if(!b||!guide[b.dataset.r23Guide])return;
   guideKey=b.dataset.r23Guide;guideUI()
 });

 function save(){st.x=player.x;st.y=player.y;try{localStorage.setItem(storageKey(),JSON.stringify(st))}catch(e){}}
 function notify(msg){const tip=$('r12Tip');if(tip)tip.textContent=msg;if(typeof window.toast==='function')window.toast(msg,3500)}
 function log(msg){if(!st.journal.includes(msg)){st.journal.unshift(msg);st.journal=st.journal.slice(0,14)}update();save()}
 function allSeeds(){return ['seedA','seedB','seedC'].every(x=>st.found.includes(x))}
 function gainLocalSeeds(amount){if(typeof orchardRead==='function'&&typeof orchardSave==='function'){const inv=orchardRead();inv.seeds=(inv.seeds||0)+amount;orchardSave(inv);if(typeof orchardRender==='function')orchardRender();return true}return false}
 function update(){const n=st.found.length;
  let objective=!st.seen.includes('guarda')?'Converse com o Guardião Bento na praça.':!allSeeds()?'Encontre as 3 Sementes Ancestrais na Trilha Encantada.':!st.unlocked?'Abra o Santuário das Raízes na passagem leste da floresta.':!st.relic?'Resolva o enigma do altar e recupere a Relíquia do Guardião.':'A Relíquia despertou. Explore a campanha de Halloween ou defenda o pomar!';
  $('r12Objective').textContent=objective;$('r12MapName').textContent=room().name;$('r12Counter').textContent=n+'/3 sementes · '+(st.relic?'Relíquia encontrada':'Relíquia oculta');
  $('r12Progress').style.width=((n+(st.unlocked?1:0)+(st.altarActive?1:0)+(st.relic?1:0))/6*100)+'%';
  const lines=[['Conhecer o Guardião',st.seen.includes('guarda')],['Reunir as 3 sementes',allSeeds()],['Abrir o Santuário',st.unlocked],['Resolver o altar',st.altarActive],['Recuperar a Relíquia',st.relic]];
  $('r12Quests').innerHTML=lines.map(([x,done])=>'<div class="r12-quest-row '+(done?'done':'')+'">'+(done?'✓ ':'◇ ')+x+'</div>').join('');
  $('r12Inventory').innerHTML='<span class="r12-tag">🌱 '+n+'/3 sementes</span><span class="r12-tag '+(st.relic?'':'dim')+'">✦ Relíquia</span>';
  $('r12Journal').innerHTML=st.journal.map(e=>'<div>'+escapeHtml(e)+'</div>').join('');
  $('r12Region').textContent=room().subtitle;renderEpicUI();
 }
 function escapeHtml(str){return String(str).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
 function say(who,msg,onNext=null,actionText='Continuar'){
  dialogOpen=true;keys.up=keys.down=keys.left=keys.right=false; $('r12TalkWho').textContent=who;$('r12TalkText').textContent=msg;
  const btn=$('r12TalkNext');$('r12Choices').hidden=true;$('r12Choices').innerHTML='';btn.hidden=false;btn.textContent=actionText;$('r12Bubble').hidden=false;
  btn.onclick=()=>{ $('r12Bubble').hidden=true;dialogOpen=false; if(onNext)onNext();update();save()};btn.focus({preventScroll:true});
 }
 function ritualPuzzle(){
   const order=['SOL','LUA','MEMÓRIA'];
   dialogOpen=true;keys.up=keys.down=keys.left=keys.right=false;
   $('r12TalkWho').textContent='O Enigma das Três Luzes';
   $('r12TalkText').textContent='As inscrições dizem: “Primeiro nasce o dia; depois a noite o acompanha; por fim, aquilo que permanece quando ambos desaparecem.” Escolha os símbolos na ordem correta. Etapa '+((st.ritualStep||0)+1)+'/3.';
   $('r12Bubble').hidden=false;
   $('r12TalkNext').hidden=true;
   const wrap=$('r12Choices');wrap.hidden=false;wrap.innerHTML='';
   for(const choice of ['MEMÓRIA','SOL','LUA']){
     const btn=document.createElement('button');btn.type='button';btn.className='r12-choice';btn.textContent=choice;
     btn.addEventListener('click',()=>{
       if(choice===order[st.ritualStep||0]){
         st.ritualStep=(st.ritualStep||0)+1;
         if(st.ritualStep===3){st.altarActive=true;wrap.hidden=true;$('r12Bubble').hidden=true;dialogOpen=false;log('O altar foi ativado com a ordem Sol, Lua e Memória. A Relíquia despertou.');say('O Santuário desperta','As três luzes se unem num feixe dourado. A Relíquia aguarda mais ao sul.');return}
         save();ritualPuzzle()
       }else{
         st.ritualStep=0;save();
         $('r12TalkText').textContent='As luzes se apagaram! A ordem não está correta. A inscrição lembra o nascimento do dia, a chegada da noite e o que permanece depois. Tente novamente desde o começo.';
         setTimeout(()=>{if(dialogOpen&&!st.altarActive)ritualPuzzle()},1300);
       }
     });wrap.append(btn)
   }
   wrap.querySelector('button')?.focus({preventScroll:true});
 }
 function warp(dest,x,y){if(!rooms[dest])return;window.SamMusic?.scene(dest==='bosque'||dest==='coracao'?'shadows':'explore');st.map=dest;player.x=x;player.y=y;touchDest=null;save();update();notify('Você entrou em '+room().name+'.')}
 function pane(dest){save();window.SamMusic?.scene(dest==='eventDlg'?'shadows':'explore');if(typeof window.showPane==='function')window.showPane(dest)}
 function toShop(){pane('gameDlg');setTimeout(()=>document.querySelector('#orchardExtras [data-extras-tab="shop"]')?.click(),100);}
 function toPets(){pane('gameDlg');setTimeout(()=>document.querySelector('#orchardExtras [data-extras-tab="pets"]')?.click(),100);}
 function toHalloween(){pane('eventDlg');setTimeout(()=>document.getElementById('h8World')?.scrollIntoView({behavior:'smooth',block:'start'}),250)}
 const labels={seedA:'O brilho amarelo aquece a palma da sua mão.',seedB:'A semente azul pulsa em silêncio, como um pequeno luar.',seedC:'A semente roxa murmura palavras de uma árvore esquecida.'};
/* ===== V13: Crônica da Primeira Mangueira / RPG completo ===== */
function freshEpic(){return {class:null,level:1,xp:0,points:0,stats:{vig:3,for:3,int:3,agi:3},gold:40,hp:42,mp:8,potions:3,chapter:0,items:['semente_guardia'],equipped:['semente_guardia'],flags:{},defeated:[],memories:[],story:[],choices:[],wins:0,losses:0,ending:'',seenIntro:false,questRewards:[]}}
function epic(){if(!st.epic||typeof st.epic!=='object')st.epic=freshEpic();return st.epic}
function eflag(id){return !!epic().flags[id]}
function setFlag(id){epic().flags[id]=true;save();update()}
function ownItem(id){if(!EPIC_ARTIFACTS[id])return;if(!epic().items.includes(id)){epic().items.push(id);log('Artefato encontrado: '+EPIC_ARTIFACTS[id].name)}save();update()}
function hasEffect(effect){return epic().equipped.some(id=>EPIC_ARTIFACTS[id]?.effect===effect)}
function classInfo(){return EPIC_CLASSES[epic().class]||EPIC_CLASSES.guardiao}
function maxHealth(){return classInfo().hp+(epic().level-1)*4+epic().stats.vig*3+(hasEffect('vigor')?12:0)+(hasEffect('royal')?20:0)}
function maxMana(){return classInfo().mp+epic().stats.int+Math.floor(epic().level/2)}
function recomputeHealth(){epic().hp=Math.min(Math.max(1,epic().hp),maxHealth());epic().mp=Math.min(Math.max(0,epic().mp),maxMana())}
function xpNeed(){return 60+epic().level*47}
function giveXP(amount){const e=epic();e.xp+=amount;while(e.xp>=xpNeed()&&e.level<30){e.xp-=xpNeed();e.level++;e.points+=2;e.hp=maxHealth();e.mp=maxMana();notify('Novo nível '+e.level+'! +2 pontos para distribuir.')}save();update()}
function syncEpicCrossModes(){const e=epic();try{const handle=(localStorage.getItem('sg_handle')||'visitante').toLowerCase();const h=JSON.parse(localStorage.getItem('sg_halloween_world_v8_'+handle)||'null');if(h&&h.ending&&!eflag('halloweenComplete')){e.flags.halloweenComplete=true;ownItem('selo_sombras');giveXP(150);log('O Pomar das Sombras foi concluído. Você conquistou o Selo das Sete Sombras!')}}catch(ex){}}
function epicDefenseReward(won){if(!won||eflag('defenseSaved'))return;setFlag('defenseSaved');epic().gold+=55;ownItem('escudo_colheita');giveXP(110);log('A vitória no Defesa do Pomar ecoou no mundo RPG! Escudo da Colheita conquistado.');save();update()}
function advanceEpicChapter(index){const e=epic();if(index<=e.chapter)return;e.chapter=index;giveXP(38+index*22);e.hp=maxHealth();e.mp=maxMana();log('Um novo capítulo começou: '+EPIC_CHAPTERS[Math.min(index,7)].title+'.');update();save();}
function isChapter(n){return epic().chapter>=n}
function addStory(id,txt){if(epic().story.includes(id))return;epic().story.push(id);log(txt);}
function goStory(script,after){let at=0;function next(){if(at>=script.length){if(after)after();return}const [who,text]=script[at++];const entry={who,text};if(!epic().story.some(x=>x&&typeof x==='object'&&x.who===who&&x.text===text)){epic().story.push(entry);epic().story=epic().story.slice(-145);save()}say(who,text,next,at===script.length?'Concluir diálogo':'Próximo trecho')}next()}
function choiceBox(who,text,options){dialogOpen=true;keys.up=keys.down=keys.left=keys.right=false;
 const b=$('r12Bubble'),wrap=$('r12Choices');b.hidden=false;$('r12TalkWho').textContent=who;$('r12TalkText').textContent=text;$('r12TalkNext').hidden=true;wrap.hidden=false;wrap.innerHTML='';
 options.forEach(([label,handler])=>{const btn=document.createElement('button');btn.type='button';btn.className='r12-choice';btn.textContent=label;btn.onclick=()=>{b.hidden=true;wrap.hidden=true;dialogOpen=false;handler?.();update();save()};wrap.append(btn)});
}
function ritualSequence(id,title,clue,seq,onSuccess){let at=0;function step(){choiceBox(title,clue+' | Etapa '+(at+1)+'/'+seq.length+'.',[...new Set(seq)].sort().map(s=>[s,()=>{if(seq[at]!==s){at=0;notify('Os símbolos se apagaram. Volte ao primeiro símbolo.')}else{at++;if(at>=seq.length){onSuccess();return}}step()}]).concat([['Sair',()=>{}]]))}step()}
function epicMapPortal(id,dest,x,y,minChapter=0){if(!isChapter(minChapter)){say('Passagem selada','A trilha ainda não conhece seu nome. Complete o capítulo anterior para despertar esta região.');return}warp(dest,x,y);}
function epicActorVisible(a){if(!a.epic)return true;
 const e=epic();if(a.epic==='enemy')return !e.defeated.includes(a.id)&&isChapter(a.min||0)&&(!a.need||eflag(a.need))&&(a.id!=='collector'||['echoOne','echoTwo','echoThree'].every(eflag));
 if(a.epic==='resource')return !eflag(a.id);
 if(a.min!==undefined&&!isChapter(a.min))return false;
 if(a.epic==='final')return e.chapter>=6&&!e.ending;
 return true;
}
const epicMonsters={
 larva:'larva',spider:'rainha',crystalBoss:'besouro',collector:'espectro',moonGuardian:'sentinela',finalKing:'rei'
};
function epicInteract(a){if(!a||!a.epic)return false;
 const e=epic(),f=e.flags;
 if(a.epic==='gate'){epicMapPortal(a.id,a.target,a.tx,a.ty,a.min||0);return true}
 if(a.epic==='enemy'){startCombat(epicMonsters[a.id],a.id);return true}
 if(a.epic==='resource'){
  if(a.id==='dew'||a.id==='glass'){setFlag(a.id);log(a.id==='dew'?'Você recolheu o Orvalho Solar; uma memória de Maíra aqueceu sua mão.':'Você encontrou um Vidro-Lua intacto, pulsando sob o brilho das folhas.');say('Achado',a.id==='dew'?'O Orvalho Solar foi guardado na bolsa. Ele resiste ao calor que consumiu a estufa.':'O fragmento de vidro preserva uma imagem antiga: Eldra sorrindo diante de uma muda.');return true}
  if(a.id.startsWith('stone')){setFlag(a.id);const stories={stoneRoot:'“A raiz protege o primeiro nome que a chuva esqueceu.”',stoneLeaf:'“A folha escuta aquilo que o vento não ousa contar.”',stoneDew:'“O orvalho registra a promessa quando chega a manhã.”'};say('Pedra do Juramento',stories[a.id]);return true}
  if(a.id.startsWith('gem')){setFlag(a.id);const c={gemBlue:'azul, frio como a chuva',gemAmber:'âmbar, quente como o amanhecer',gemWhite:'branco como uma promessa'}[a.id];say('Cristal recuperado','O cristal '+c+' reverbera no seu inventário.');return true}
  if(a.id.startsWith('echo')){setFlag(a.id);const text={echoOne:'A primeira memória contém um nome: ORESTES, o escrivão do pomar.',echoTwo:'A segunda mostra Orestes devolvendo uma manga roubada às crianças da vila.',echoThree:'A terceira revela Eldra dizendo: “Ninguém precisa ser esquecido para que outro seja lembrado.”'};say('Memória do Pântano',text[a.id]);return true}
 }
 if(a.id==='maira'){if(!isChapter(1)){say('Estufa fechada','A estufa aguarda a relíquia que desperta no Santuário das Raízes.');return true}
 if(!eflag('metMaira')){setFlag('metMaira');goStory(EPIC_DIALOGUES.maira);return true}
 say('Maíra, a Vidreira',eflag('furnaceClean')?'O vidro da estufa voltou a florescer. Lembre-se: uma brasa certa pode proteger uma aldeia inteira.':'Procure Orvalho Solar, Vidro-Lua e a Larva que espalha ferrugem. Depois purifique a fornalha.');return true}
 if(a.id==='furnace'){
  if(!eflag('dew')||!eflag('glass')){say('Fornalha', 'Duas cavidades esperam os componentes: Orvalho Solar e Vidro-Lua.');return true}
  if(!e.defeated.includes('larva')){say('Fornalha','As chamas negras ainda estão presas à Larva da Ferrugem. Derrote-a antes do ritual.');return true}
  if(eflag('furnaceClean')){say('Fornalha purificada','As brasas aquecem sem consumir. O caminho oeste para o Bosque das Teias está aberto.');return true}
  choiceBox('A Última Brasa','Maíra confiou a você o segredo da fornalha. Como vai canalizar o fogo?',[["Aqueço as sementes da vila",()=>{setFlag('mercyFire');completeFurnace()}],["Queimo a ferrugem até virar cinzas",()=>{setFlag('firmFire');completeFurnace()}]]);return true}
 if(a.id==='elder'){if(!eflag('metElder')){setFlag('metElder');goStory(EPIC_DIALOGUES.bosque);return true}say('Eco de Eldra','Três pedras guardam o mesmo juramento. Leia cada uma antes de tentar reconstruir a ordem.');return true}
 if(a.id==='oath'){if(!['stoneRoot','stoneLeaf','stoneDew'].every(eflag)){say('Círculo das Três Vozes','Faltam pedras a serem escutadas. As três lembranças estão dispersas pelo bosque.');return true}if(eflag('oathDone')){say('Círculo das Três Vozes','O juramento foi recomposto: raiz, folha e orvalho. A Rainha despertou.');return true}
 ritualSequence('oath','Juramento das Crianças','A ordem pertence ao caminho da água: primeiro ela alcança o que está enterrado, depois o que brota, enfim o que resiste até amanhecer.',['RAIZ','FOLHA','ORVALHO'],()=>{setFlag('oathDone');say('Círculo das Três Vozes','As teias se rompem, revelando o trono da Rainha. Nenhuma criança será esquecida.')});return true}
 if(a.id==='miner'){if(!eflag('metMiner')){setFlag('metMiner');goStory(EPIC_DIALOGUES.miner);return true}say('Dário, o Mineiro','A tempestade começou azul, brilhou âmbar e terminou branca. Essas são as cores da fechadura.');return true}
 if(a.id==='prism'){if(!['gemBlue','gemAmber','gemWhite'].every(eflag)){say('Máquina Prismática','Três encaixes vazios projetam reflexos: azul, âmbar e branco.');return true}if(eflag('prismDone')){say('Máquina Prismática','A máquina canta novamente. Seu prisma protege as memórias das profundezas.');return true}
 ritualSequence('prism','Prisma Partido','Relembre Dário: primeiro a tempestade, depois o amanhecer e então a promessa.',['AZUL','ÂMBAR','BRANCO'],()=>{setFlag('prismDone');say('Máquina Prismática','O feixe prismático atravessa a mina, despertando o Besouro que dormia sob os cristais.')});return true}
 if(a.id==='voice'){if(!eflag('metVoice')){setFlag('metVoice');goStory(EPIC_DIALOGUES.pantano);return true}say('A Voz Sem Rosto','Quando ouvir os três ecos, encare o Colecionador. Sua fraqueza é a luz que ele pensou perdida.');return true}
 if(a.id==='memoryChoice'){
  if(!e.defeated.includes('collector')){say('Fonte das Memórias','Uma corrente ainda prende a fonte ao Colecionador. Enfrente o espírito e escute sua história.');return true}
  if(eflag('memoryResolved')){say('Fonte das Memórias','Sua escolha permanece escrita nas águas do pântano.');return true}
  choiceBox('O Destino de Orestes','O Colecionador, exausto, devolve as vozes que guardava. O que você faz com as lembranças?',[["Liberto cada voz para sua família",()=>{setFlag('mercyMemory');completeMemory('Você devolveu os nomes às famílias. Orestes agradece e enfim descansa.')}],["Guardo as lembranças no relicário",()=>{setFlag('sealedMemory');completeMemory('Você recolhe as vozes em segurança. Ainda há muito a aprender com elas.')}]]);return true}
 if(a.id==='selene'){if(!eflag('metSelene')){setFlag('metSelene');goStory(EPIC_DIALOGUES.selene);return true}say('Selene, Astrônoma','A lua começa crescente, alcança a cheia, então minguante. A sentinela domina o raio e teme a terra.');return true}
 if(a.id==='lunarAltar'){if(eflag('moonDone')){say('Relógio Lunar','As fases giram em harmonia. A sentinela aguarda, agora vulnerável.');return true}
 ritualSequence('moon','Relógio Lunar','A lua atravessa três idades: o nascimento da luz, seu ápice e a despedida.',['CRESCENTE','CHEIA','MINGUANTE'],()=>{setFlag('moonDone');say('Relógio Lunar','Uma ponte de luz atravessa o observatório. A Sentinela do Eclipse revela sua forma.')});return true}
 if(a.id==='heartVoice'){if(!eflag('metHeart')){setFlag('metHeart');goStory(EPIC_DIALOGUES.heart);return true}say('Coração do Pomar','As raízes pulsantes repetem um nome: o Rei das Pragas. O destino do pomar se aproxima.');return true}
 if(a.id==='destiny'){if(!e.defeated.includes('finalKing')){say('Altar Final','A última escolha só pode ser feita depois que o Rei das Pragas abandonar o trono.');return true}if(e.ending){say('Altar Final','O destino já foi escolhido. Sua história permanece no diário.');return true}
 finishEnding();return true}
 if(a.id==='oldAmalia'){if(eflag('sideAmalia')){say('Dona Amália','Que suas raízes se mantenham firmes. O amuleto que você ganhou protege até o coração mais aflito.');return true}
 if(!eflag('metAmalia')){setFlag('metAmalia');say('Dona Amália','Perdi minha cesta durante uma tempestade. Talvez a encontre na Trilha Encantada, perto das pedras do sul. Pode trazê-la?');return true}
 if(eflag('basket')){setFlag('sideAmalia');ownItem('amuleto_bento');giveXP(65);e.gold+=30;say('Dona Amália','Minha cesta! Guarde este Amuleto das Raízes, ele reduzirá o dano recebido em combate. Obrigada por não esquecer os pequenos pedidos.');return true}
 say('Dona Amália','A cesta deve estar perto das pedras no sul da floresta. Eu confio em você.');return true}
 if(a.id==='basket'){setFlag('basket');say('Cesta Antiga','Uma cesta de mangas encontra-se sob um arbusto. A fita que a prende tem o nome Amália.');return true}
 if(a.id==='alchemist'){if(!eflag('metAlchemist')){setFlag('metAlchemist');say('Tito, o Botânico','Com quatro raízes a mais, a vila poderia fazer remédios. Na Trilha Encantada há um broto luminoso. Traga-o para mim.');return true}
 if(eflag('medHerb')&&!eflag('sideHerb')){setFlag('sideHerb');e.potions+=3;giveXP(70);say('Tito, o Botânico','Excelente! Três poções para você, sem custo. Agora conseguiremos cuidar dos que voltam feridos do pomar.');return true}
 choiceBox('Tito, o Botânico','Uma poção restaura 38 pontos de vida em combate.',[['Comprar poção (18 moedas)',()=>{if(e.gold<18){say('Tito','Moedas insuficientes. Derrote inimigos e conclua missões para ganhar mais.');return}e.gold-=18;e.potions++;save();update();notify('Poção adquirida!')}],['Descansar junto à fonte',()=>{e.hp=maxHealth();e.mp=maxMana();save();notify('Você descansou e recuperou sua vida e energia.')}],['Sair',()=>{}]]);return true}
 if(a.id==='herb'){setFlag('medHerb');say('Broto Luminoso','A planta dança na palma de sua mão. Tito saberá como transformá-la em um remédio.');return true}
 return true;
}
function completeFurnace(){if(eflag('furnaceClean'))return;setFlag('furnaceClean');ownItem('brasa_eterna');goStory([['Maíra','A ferrugem foi expulsa. Pela primeira vez em muitos anos, as sementes germinam sob o teto de vidro.'],['Eldra, em eco','O fogo não escolhe entre justiça e vingança. Somos nós que decidimos o que ele iluminará.'],['Narrador','À noite, uma aranha gigantesca arranha o vidro. Uma trilha de fios prateados aponta para o Bosque das Teias.']],()=>advanceEpicChapter(2))}
function completeMemory(message){setFlag('memoryResolved');ownItem('laco_memoria');say('Fonte das Memórias',message,()=>goStory([['Orestes','Eu jamais quis roubar lembranças. Queria impedir que desaparecessem com a chuva, com a fome e com os anos.'],['Narrador','O pântano se acalma. Uma torre lunar emerge acima da névoa, onde Selene aguarda notícias de Eldra.']],()=>advanceEpicChapter(5)))}
function finishEnding(){const e=epic();const special=eflag('mercyFire')&&eflag('mercyMemory')&&eflag('sideAmalia')&&eflag('sideHerb');
 const options=[['Libertar o Pomar — dividir as memórias',()=>{e.ending='libertar';finishEpilogue()}],['Selar a Maldição — proteger o segredo',()=>{e.ending='selar';finishEpilogue()}]];
 if(special)options.push(['Final secreto — acolher a própria Fome',()=>{e.ending='reconciliar';finishEpilogue()}]);
 choiceBox('A Última Colheita','O poder do Rei se dissolve. Um fruto ancestral brilha entre as raízes. O que acontecerá com as memórias do pomar?',options)}
function finishEpilogue(){const e=epic();e.chapter=7;ownItem('coroa_semente');const endings={
 libertar:[['Narrador','Você abre as mãos. As memórias se erguem como vaga-lumes, espalhando-se pela vila, pelas minas e pelas casas perdidas.'],['Guardião Bento','As crianças se lembram dos próprios avós. As árvores florescem em solos que a guerra havia apagado.'],['Eldra','A memória não pertence a uma coroa. Pertence a quem escolhe compartilhar. Você devolveu o pomar a seus habitantes.'],['Epílogo','As colheitas voltaram. Toda vez que alguém dividia uma manga, o vento repetia o seu nome com gratidão.']],
 selar:[['Narrador','Você sela as vozes no coração da primeira mangueira. O mal não pode alcançá-las, mas a vila permanece sem conhecer toda a verdade.'],['Selene','Há segredos que protegem, sim. Mas uma porta fechada sempre exige alguém que fique de vigia.'],['Eldra','Você aceitou guardar as lembranças. Que nunca confunda silêncio com esquecimento.'],['Epílogo','O pomar resistiu, envolto em névoa dourada. Você se tornou seu Guardião Silencioso.']],
 reconciliar:[['Narrador','Você oferece ao Rei a lembrança que ele nunca teve: uma criança dividindo com ele a última manga.'],['Rei das Pragas','Eu... eu também tinha fome. Era possível sentar à mesa sem precisar tomar a de ninguém?'],['Eldra','Até a maldição pode aprender a terminar. Você não apagou a dor; deu a ela um nome e um lugar no mundo.'],['Epílogo','A primeira mangueira cresceu mais uma vez. Onde havia um trono de pragas, surgiu uma mesa. E naquela mesa havia sempre um fruto a mais.']]};
 addStory('ending:'+e.ending,'Final conquistado: '+({libertar:'O Pomar Compartilhado',selar:'O Guardião Silencioso',reconciliar:'A Mesa para Todos'}[e.ending])+'!');giveXP(550);goStory(endings[e.ending],()=>{update();notify('Campanha concluída! Explore as histórias e missões secundárias.')});save()}
let epicCombat=null;let epicCombatBusy=false;let epicSoundLast=0;
function startCombat(monster,actor){if(epicCombat||!EPIC_ENEMIES[monster])return;if(!epic().class){showEpicClasses();return}
 const m=EPIC_ENEMIES[monster];const basePhase=m.phases?m.phases[0]:{hp:m.hp,element:m.element,title:''};epicCombat={key:monster,actor,name:m.name,hp:basePhase.hp,maxHp:basePhase.hp,phase:0,element:basePhase.element,playerGuard:false,turn:1,status:'',enemyStatus:'',logs:[m.intro],enemyIntent:'O inimigo prepara seu primeiro golpe.',lock:false};
 window.SamMusic?.scene(monster==='rei'?'boss':'battle');const e=epic();e.mp=Math.min(e.mp+1,maxMana());if(hasEffect('vigor'))e.hp=Math.min(e.hp+2,maxHealth());dialogOpen=true;createCombat();renderCombat();save();}
function damageMult(atk,def){if(atk===def)return .76;if(EPIC_ADV[atk]===def)return 1.55;if(EPIC_ADV[def]===atk)return .65;return 1}
function damageToEnemy(element,magic=false){const e=epic(),m=EPIC_ENEMIES[epicCombat.key];const attr=magic?e.stats.int:e.stats.for;const coeff=magic?1.7:1.4;const base=Math.max(2,Math.floor(8+e.level*2.0+attr*coeff-m.def));let mult=damageMult(element,epicCombat.element);if(m.weak===element)mult=Math.max(mult,1.65);if(hasEffect('attack'))mult+=(3/base);if(hasEffect('spell')&&magic)mult*=1.3;if(hasEffect('royal')&&epicCombat.key==='rei')mult*=1.15;if(hasEffect('halloween')&&epicCombat.element==='shadow')mult*=1.15;const variation=.88+Math.random()*.26;const crit=Math.random()<Math.min(.36,.035+epic().stats.agi*.011+(epic().class==='rastreador'?.10:0));return {value:Math.max(1,Math.floor(base*mult*variation*(crit?1.55:1))),mult,crit}}
function battleMessage(s){epicCombat.logs.unshift(s);epicCombat.logs=epicCombat.logs.slice(0,8)}
function resolveCombatAction(type){const c=epicCombat;if(!c||c.lock)return;const e=epic(),cls=classInfo(),enemy=EPIC_ENEMIES[c.key];let d;
 if(type==='run'){if(c.key==='rei'||['rainha','besouro','espectro','sentinela'].includes(c.key)){battleMessage('Este guardião não permite fuga.');renderCombat();return}endCombat(false,true);return}
 if(type==='potion'){if(e.potions<=0){battleMessage('Você não tem poções.');renderCombat();return}if(e.hp>=maxHealth()&&c.status!=='poison'){battleMessage('Sua vida já está cheia.');renderCombat();return}e.potions--;c.status='';const heal=Math.min(maxHealth()-e.hp,38+e.stats.vig);e.hp+=heal;battleMessage('Você recuperou '+heal+' HP com uma poção.')}
 else if(type==='guard'){c.playerGuard=true;e.mp=Math.min(maxMana(),e.mp+2);battleMessage('Você ergue a guarda e recupera 2 de energia.')}
 else if(type==='skill'){
  const cost=3-(hasEffect('mana')?1:0);if(e.mp<cost){battleMessage('Energia insuficiente. Use DEFENDER para recuperar MP.');renderCombat();return}
  e.mp-=cost;const element=cls.element;d=damageToEnemy(element,true);c.hp-=d.value;let msg=cls.skill+' causou '+d.value+' de dano'+(d.crit?' — CRÍTICO!':'')+(d.mult>1.2?' — fraqueza explorada!':'')+'.';if(e.class==='guardiao'){c.playerGuard=true;msg+=' Raízes protegem você.'}if(e.class==='rastreador'&&Math.random()<.65){c.enemyStatus='burn';c.enemyStatusDuration=4;msg+=' Queimadura aplicada!'}if(e.class==='arcanista'&&c.element==='shadow'){c.enemyStatus='blind';c.enemyStatusDuration=2;msg+=' A luz enfraqueceu o inimigo!'}battleMessage(msg)
 }
 else if(type==='artifact'){
  const items=e.equipped.map(id=>EPIC_ARTIFACTS[id]).filter(Boolean);if(!items.length){battleMessage('Nenhum artefato equipado.');renderCombat();return}
  if(c.artUsed){battleMessage('A ressonância de artefatos só funciona uma vez por batalha.');renderCombat();return}c.artUsed=true;
  const heal=items.some(x=>['regen','vigor','defense'].includes(x.effect));if(heal){e.hp=Math.min(maxHealth(),e.hp+22);e.mp=Math.min(maxMana(),e.mp+3);battleMessage('Ressonância: +22 HP e +3 MP.')}else{d=damageToEnemy(items[0].element,true);c.hp-=d.value+8;battleMessage('O artefato '+items[0].name+' liberou '+(d.value+8)+' de dano!')}
 }
 else {d=damageToEnemy(cls.element,false);c.hp-=d.value;battleMessage('Você atacou: '+d.value+' de dano'+(d.crit?' CRÍTICO!':'.')+(d.mult>1.25?' Elemento eficaz!':''));if(hasEffect('burn')&&Math.random()<.28){c.enemyStatus='burn';c.enemyStatusDuration=4;battleMessage('A Brasa do Vidro queimou o inimigo!')}}
 if(c.hp<=0){advanceBattlePhase();renderCombat();save();return}
 c.lock=true;renderCombat();save();queueEnemyAction(c);
}
function delayBattle(ms){return new Promise(r=>setTimeout(r,ms))}
function battleVisualEffect(target,kind,element){
 const host=$('r13Combat');if(!host||host.hidden)return;
 const stage=host.querySelector('.r13-battle-field'),hero=host.querySelector('.r13-player-figure'),enemy=host.querySelector('.r13-enemy-figure');
 if(!stage||!hero||!enemy)return;
 const el=target==='hero'?hero:enemy;
 const flag=kind==='attack'?'r14-lunge':kind==='receive'?'r14-recoil':kind==='guard'?'r14-guard':kind==='heal'?'r14-heal':kind==='magic'||kind==='artifact'?'r14-cast':'';
 if(flag){el.classList.remove(flag);void el.offsetWidth;el.classList.add(flag)}
 if(kind==='receive'){stage.classList.remove('r14-hit-stage');void stage.offsetWidth;stage.classList.add('r14-hit-stage')}
 if(['magic','artifact','attack','receive','heal','guard'].includes(kind)){
  const v=document.createElement('span');v.className='r14-impact r14-impact-'+(element||'nature')+' r14-'+kind+'-effect';
  v.setAttribute('aria-hidden','true');v.textContent=kind==='artifact'?'◆':kind==='magic'?'✦':kind==='receive'?'✹':kind==='heal'?'✧':kind==='guard'?'◇':'⚔';
  v.style.left=(kind==='magic'||kind==='artifact'||kind==='attack'||kind==='receive'?'40%':target==='hero'?'76%':'24%');v.style.top=kind==='heal'||kind==='guard'?'52%':'37%';
  stage.appendChild(v);setTimeout(()=>v.remove(),760);
  if(kind==='magic'||kind==='artifact'){
   const bolt=document.createElement('span');bolt.className='r14-bolt r14-bolt-'+(element||'nature');bolt.setAttribute('aria-hidden','true');stage.appendChild(bolt);setTimeout(()=>bolt.remove(),740);
  }
 }
}
async function doCombatAction(type){
 const c=epicCombat;if(!c||c.lock)return;
 const e=epic(),valid=type==='run'?(c.key!=='rei'&&!['rainha','besouro','espectro','sentinela'].includes(c.key))
  :type==='skill'?e.mp>=(3-(hasEffect('mana')?1:0))
  :type==='artifact'?!c.artUsed&&e.equipped.some(id=>EPIC_ARTIFACTS[id])
  :type==='potion'?e.potions>0&&(e.hp<maxHealth()||c.status==='poison'):true;
 if(!valid){resolveCombatAction(type);return}
 c.lock=true;for(const b of $('r13Combat').querySelectorAll('[data-r13action]'))b.disabled=true;
 const attack=type==='attack'||type==='skill'||type==='artifact';
 const scene=type==='skill'?'magic':type==='artifact'?'artifact':type==='potion'?'heal':type==='guard'?'guard':type==='attack'?'attack':'';
 try {
  if(scene){battleVisualEffect('hero',scene,classInfo().element);window.SamMusic?.effect(type==='skill'||type==='artifact'?'magic':type==='guard'?'guard':type==='potion'?'heal':'hit')}
  if(attack){await delayBattle(type==='skill'||type==='artifact'?310:230);if(epicCombat!==c)return;battleVisualEffect('enemy','receive',classInfo().element);window.SamMusic?.effect('hit')}
  await delayBattle(type==='skill'||type==='artifact'?380:type==='attack'?350:520);
  if(epicCombat!==c)return;
  c.lock=false;resolveCombatAction(type);
 }catch(err){console.error('Falha de animação de batalha',err);if(epicCombat===c){c.lock=false;resolveCombatAction(type)}}
}
async function queueEnemyAction(c){
 await delayBattle(450);if(epicCombat!==c)return;
 battleVisualEffect('enemy','attack',c.element);window.SamMusic?.effect('enemy');
 await delayBattle(270);if(epicCombat!==c)return;
 battleVisualEffect('hero','receive',c.element);
 await delayBattle(440);if(epicCombat!==c)return;
 enemyTurn();if(epicCombat!==c)return;c.lock=false;renderCombat();save();
}
function enemyTurn(){const c=epicCombat,e=epic(),enemy=EPIC_ENEMIES[c.key];if(!c)return;
 if(c.enemyStatus==='burn'){const burn=8+Math.floor(c.turn/3);c.hp-=burn;battleMessage('Queimadura: o inimigo perde '+burn+' HP.');if(c.hp<=0){advanceBattlePhase();return}}
 const dodge=Math.min(.19,epic().stats.agi*.009);const miss=(c.enemyStatus==='blind'&&Math.random()<.55)||Math.random()<dodge;
 if(miss){battleMessage(c.enemyStatus==='blind'?'A luz cegou o inimigo! Ele errou o golpe.':'Sua Agilidade permitiu esquivar do ataque!')}else{
  const coeff=c.key==='rei'?(1+c.phase*.16):1;
  const raw=enemy.atk*coeff+Math.floor(c.turn/3)+Math.random()*5;
  let dmg=Math.max(1,Math.floor(raw-epic().stats.vig*.9-(hasEffect('defense')?3:0)-(hasEffect('harvest')?2:0)));
  const incoming=damageMult(c.element,classInfo().element);dmg=Math.max(1,Math.floor(dmg*(incoming>1.3?1.13:incoming<.9?.86:1)));if(c.playerGuard)dmg=Math.max(1,Math.floor(dmg*.38));if(c.key==='rei'&&c.phase===1&&epic().class==='guardiao')dmg=Math.floor(dmg*.88);
  e.hp=Math.max(0,e.hp-dmg);battleMessage(enemy.name+' causou '+dmg+' de dano'+(c.playerGuard?' (bloqueado parcialmente)':'')+'.');
  if(!c.playerGuard&&Math.random()<.16&&c.key!=='sentinela'){c.status='poison';battleMessage('Você foi envenenado!')}
 }
 if(c.status==='poison'){e.hp=Math.max(0,e.hp-4);battleMessage('Veneno: -4 HP. A poção cura, mas não elimina o veneno.')}else if(hasEffect('regen'))e.hp=Math.min(maxHealth(),e.hp+3);
 if(c.enemyStatusDuration>0){c.enemyStatusDuration--;if(c.enemyStatusDuration===0)c.enemyStatus='';}c.turn++;c.playerGuard=false;c.enemyIntent= c.turn%3===0?'O inimigo prepara um ataque mais feroz.':'O inimigo observa seus movimentos.';
 if(e.hp<=0){e.losses++;e.hp=Math.max(1,Math.floor(maxHealth()*.55));e.mp=maxMana();e.gold=Math.max(0,e.gold-12);const target=c.key;endCombat(false,false);say('Derrota e recomeço','Você despertou protegido pelas raízes. Perdeu 12 moedas, mas manteve todas as pistas e missões. Reforce atributos ou equipe artefatos antes de enfrentar '+EPIC_ENEMIES[target].name+' novamente.');}
}
function advanceBattlePhase(){const c=epicCombat,m=EPIC_ENEMIES[c.key];if(m.phases&&c.phase<m.phases.length-1){c.phase++;const phase=m.phases[c.phase];c.hp=phase.hp;c.maxHp=phase.hp;c.element=phase.element;c.status='';c.enemyStatus='';epic().mp=Math.min(maxMana(),epic().mp+3);epic().hp=Math.min(maxHealth(),epic().hp+26);battleMessage(phase.title+'! O Rei mudou de elemento. Você recuperou 26 HP e 3 MP.');window.SamMusic?.effect('magic');return}
 const key=c.key,actor=c.actor;
 endCombat(true,false);const e=epic();if(!e.defeated.includes(actor))e.defeated.push(actor);const enemy=EPIC_ENEMIES[key];e.wins++;e.gold+=enemy.gold;e.potions+=1;giveXP(enemy.xp);notify('Vitória! +'+enemy.xp+' XP e '+enemy.gold+' moedas.');
 if(key==='larva'){log('A Larva da Ferrugem caiu. A fornalha agora pode ser purificada.');}
 if(key==='rainha'){ownItem('espinho_soberano');goStory([['Rainha das Aranhas','As crianças... ainda lembram de nosso juramento?'],['Eldra','A rainha era guardiã daquelas promessas. A maldição prendeu seu amor numa teia de ódio.'],['Narrador','Com a coroa de espinhos desfeita, uma passagem se abre para as Minas do Prisma Partido.']],()=>advanceEpicChapter(3))}
 if(key==='besouro'){ownItem('prisma_eco');goStory([['Dário','Ouço as minas cantando outra vez. O brilho volta a revelar o caminho das antigas águas.'],['Narrador','O Prisma do Eco se uniu ao seu inventário. A trilha do pântano se abriu.']],()=>advanceEpicChapter(4))}
 if(key==='espectro'){say('Orestes, o Colecionador','Eu só queria que alguém lembrasse... A fonte guarda uma escolha. Volte a ela antes de partir.')}
 if(key==='sentinela'){ownItem('lente_lunar');goStory([['Sentinela do Eclipse','Sua vontade permaneceu mesmo sob o trovão. A Torre aceita seu nome.'],['Selene','O Rei não é apenas um monstro. Ele é a fome que foi deixada fora da mesa. Leve esta lente; ela mostrará o que a névoa esconde.'],['Narrador','A passagem para o Coração do Pomar se acende ao norte.']],()=>advanceEpicChapter(6))}
 if(key==='rei'){ownItem('coroa_semente');goStory([['Rei das Pragas','A coroa... era apenas uma casca. Todas essas vozes, todas essas colheitas...'],['Eldra','Você o venceu, mas a maldição só acaba quando escolhe o que fazer com as memórias.'],['Narrador','O Altar da Última Colheita desperta ao sul. Três destinos aguardam sua decisão.']]);}
 save();update();}
function endCombat(win,ran){if(!epicCombat)return;window.SamMusic?.scene(['bosque','coracao'].includes(st.map)?'shadows':'explore');if(win)window.SamMusic?.effect('win');epicCombat=null;dialogOpen=false;const el=$('r13Combat');if(el)el.hidden=true;recomputeHealth();save();update();if(ran)notify('Você recuou para preparar uma estratégia melhor.');}
function createCombat(){let modal=$('r13Combat');if(!modal){modal=document.createElement('div');modal.id='r13Combat';modal.className='r13-combat';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','Combate por turno');document.getElementById('rpgDlg').append(modal)}modal.hidden=false}
function renderCombat(){const c=epicCombat;if(!c)return;const e=epic(),m=EPIC_ENEMIES[c.key],info=EPIC_CHAPTERS[e.chapter];const escape=escapeHtml;const prevAction=document.activeElement?.closest?.('[data-r13action]')?.dataset.r13action||'';const weak=Object.keys(EPIC_ADV).find(key=>EPIC_ADV[key]===c.element)||m.weak;
 const phaseText=m.phases?' · '+m.phases[c.phase].title:'';
 $('r13Combat').innerHTML='<div class="r13-battle-card"><header><small>⚔️ COMBATE RPG '+phaseText+'</small><h2>'+escape(m.name)+'</h2><p>Elemento: '+EPIC_ELEMENTS[c.element]+' · Fraqueza atual: '+EPIC_ELEMENTS[weak]+'</p></header><div class="r13-battle-field"><div class="r13-enemy-figure"><img src="sprites/'+m.sprite+(m.sprite==='aranha_rainha_v14'?'.svg':'.png')+'" alt="'+escape(m.name)+'"><span>Inimigo · '+Math.max(0,c.hp)+' / '+c.maxHp+' HP</span><div class="r13-bar enemy"><i style="width:'+Math.min(100,Math.max(0,100*c.hp/c.maxHp))+'%"></i></div></div><div class="r13-battle-vs">⚔</div><div class="r13-player-figure"><canvas id="r13Fighter" width="72" height="90"></canvas><span>'+escape(classInfo().name)+' · Nv. '+e.level+'</span><div class="r13-bar"><i style="width:'+Math.round(e.hp/maxHealth()*100)+'%"></i></div><span>❤ '+e.hp+'/'+maxHealth()+' · ✦ '+e.mp+'/'+maxMana()+' MP</span></div></div><p class="r13-weak">'+escape(c.enemyIntent)+' · '+(c.status==='poison'?'☠ Envenenado · ':'')+(c.enemyStatus==='burn'?'🔥 Inimigo queimando · ':'')+(c.enemyStatus==='blind'?'✨ Inimigo cego':'')+'</p><div class="r13-combat-controls"><button data-r13action="attack">⚔ ATACAR</button><button data-r13action="skill">✦ '+escape(classInfo().skill)+' ('+(3-(hasEffect('mana')?1:0))+' MP)</button><button data-r13action="guard">🛡 DEFENDER (+2 MP)</button><button data-r13action="artifact">◆ ARTEFATO '+(c.artUsed?'(usado)':'')+'</button><button data-r13action="potion">🧪 POÇÃO ('+e.potions+')</button><button data-r13action="run">↩ RECUAR</button></div><div class="r13-combat-log" role="log" aria-live="polite" aria-label="Histórico do combate">'+c.logs.slice(0,5).map(x=>'<p>'+escape(x)+'</p>').join('')+'</div></div>';
 $('r13Combat').querySelectorAll('[data-r13action]').forEach(b=>b.addEventListener('click',()=>doCombatAction(b.dataset.r13action)));
 renderAvatarToCanvas($('r13Fighter'),72,90,true);if(c.lock)$('r13Combat').querySelectorAll('[data-r13action]').forEach(b=>b.disabled=true);if(prevAction&&!c.lock)$('r13Combat').querySelector('[data-r13action="'+prevAction+'"]')?.focus({preventScroll:true})
}
function showEpicClasses(){if(epic().class)return;const ui=$('r13ClassSelect');ui.hidden=false;ui.innerHTML='<div class="r13-class-card"><small>PRÓLOGO · O CHAMADO DE ELDRA</small><h2>Escolha sua classe</h2><p>Sua classe define atributos iniciais, elemento e habilidade. Sua <strong>aparência personalizada permanece igual</strong>, independente da classe.</p><div class="r13-class-grid">'+Object.entries(EPIC_CLASSES).map(([key,c])=>'<button type="button" data-r13class="'+key+'"><b>'+c.name+'</b><span>'+c.description+'</span><small>'+c.skillInfo+'</small><strong>VIG '+c.stats.vig+' · FOR '+c.stats.for+' · INT '+c.stats.int+' · AGI '+c.stats.agi+'</strong></button>').join('')+'</div></div>';
 ui.querySelectorAll('[data-r13class]').forEach(b=>b.onclick=()=>{const key=b.dataset.r13class,c=EPIC_CLASSES[key],e=epic();e.class=key;e.stats={...c.stats};e.hp=maxHealth();e.mp=maxMana();ui.hidden=true;save();update();if(!e.seenIntro){e.seenIntro=true;goStory(EPIC_DIALOGUES.intro,()=>{});save()}notify('Classe escolhida: '+c.name)})}
function epicObjectives(){const e=epic(),f=e.flags,d=e.defeated;
 const chapters={
 0:[['Converse com Bento',st.seen.includes('guarda')],['Encontre as três sementes',allSeeds()],['Abra o Santuário',st.unlocked],['Resolva o altar',st.altarActive],['Recupere a Relíquia',st.relic]],
 1:[['Conheça Maíra',!!f.metMaira],['Colete o Orvalho Solar',!!f.dew],['Recupere o Vidro-Lua',!!f.glass],['Derrote a Larva',d.includes('larva')],['Purifique a Fornalha',!!f.furnaceClean]],
 2:[['Ouça o eco de Eldra',!!f.metElder],['Leia a Pedra da Raiz',!!f.stoneRoot],['Leia a Pedra da Folha',!!f.stoneLeaf],['Leia a Pedra do Orvalho',!!f.stoneDew],['Reconstrua o Juramento',!!f.oathDone],['Derrote a Rainha',d.includes('spider')]],
 3:[['Converse com Dário',!!f.metMiner],['Cristal Azul',!!f.gemBlue],['Cristal Âmbar',!!f.gemAmber],['Cristal Branco',!!f.gemWhite],['Alinhe o Prisma',!!f.prismDone],['Derrote o Besouro',d.includes('crystalBoss')]],
 4:[['Escute a Voz sem Rosto',!!f.metVoice],['Ouça três memórias',!!f.echoOne&&!!f.echoTwo&&!!f.echoThree],['Liberte o Colecionador',d.includes('collector')],['Decida o destino das vozes',!!f.memoryResolved]],
 5:[['Converse com Selene',!!f.metSelene],['Ajuste as três fases lunares',!!f.moonDone],['Derrote a Sentinela',d.includes('moonGuardian')]],
 6:[['Ouça a história de Eldra',!!f.metHeart],['Enfrente as três fases do Rei',d.includes('finalKing')],['Escolha o destino do Pomar',!!e.ending]],
 7:[['Conclua o epílogo',!!e.ending],['Ajude Dona Amália',!!f.sideAmalia],['Ajude Tito',!!f.sideHerb]]
 };return chapters[e.chapter]||chapters[7];}
function epicCurrentObjective(){const tasks=epicObjectives(),undone=tasks.find(t=>!t[1]);return undone?undone[0]:'Capítulo concluído! Explore o próximo caminho.';}
function renderEpicUI(){const e=epic(),n=EPIC_CHAPTERS[Math.min(e.chapter,7)];let title=$('r13Chapter');if(!title)return;title.textContent=n.title;
 $('r13Objective').textContent=epicCurrentObjective()+'.';$('r13Class').textContent=e.class?classInfo().name:'Classe ainda não escolhida';$('r13Life').textContent='❤ '+e.hp+'/'+maxHealth()+' HP · ✦ '+e.mp+'/'+maxMana()+' MP';$('r13Level').textContent='Nv. '+e.level+' · '+e.xp+'/'+xpNeed()+' XP';$('r13Coins').textContent=e.gold+' moedas · '+e.potions+' poções';
 $('r13Attrs').innerHTML=Object.entries(e.stats).map(([k,v])=>'<span>'+({vig:'Vigor',for:'Força',int:'Intelecto',agi:'Agilidade'}[k])+' <strong>'+v+'</strong> '+(e.points?'<button data-raise="'+k+'" aria-label="Aumentar '+k+'">+</button>':'')+'</span>').join('');$('r13Points').textContent=e.points?e.points+' ponto(s) para distribuir':'Atributos de combate';
 $('r13Equip').innerHTML=e.items.map(id=>{const a=EPIC_ARTIFACTS[id];if(!a)return '';return '<div class="r13-item '+(e.equipped.includes(id)?'on':'')+'"><b>'+escapeHtml(a.name)+'</b><small>'+escapeHtml(a.rarity)+' · '+escapeHtml(a.desc)+'</small><button data-artifact="'+id+'">'+(e.equipped.includes(id)?'Desequipar':'Equipar')+'</button></div>'}).join('');
 $('r13Legend').textContent='Fraquezas: Fogo > Natureza · Natureza > Terra · Terra > Raio · Raio > Água · Água > Fogo · Luz ↔ Sombra.';
 $('r13Chronicles').innerHTML=e.story.filter(x=>x&&typeof x==='object'&&x.who).slice(-18).reverse().map(x=>'<div class="r13-chronicle-line"><strong>'+escapeHtml(x.who)+'</strong><p>'+escapeHtml(x.text)+'</p></div>').join('')||'<p>As primeiras memórias serão registradas após a escolha de sua classe.</p>';
 $('r13Side').innerHTML=[['Ajude Dona Amália',!!e.flags.sideAmalia],['Ajude Tito, o Botânico',!!e.flags.sideHerb],['Vitória no Defesa do Pomar',!!e.flags.defenseSaved],['Conclua O Pomar das Sombras',!!e.flags.halloweenComplete]].map(([label,done])=>'<div class="r12-quest-row '+(done?'done':'')+'">'+(done?'✓ ':'◇ ')+label+'</div>').join('');
 $('r13Status').textContent=e.ending?'FINAL: '+({libertar:'O Pomar Compartilhado',selar:'Guardião Silencioso',reconciliar:'A Mesa para Todos'}[e.ending]):e.defeated.length+' chefes derrotados · '+e.wins+' vitórias · '+e.losses+' derrotas.';
 const tasks=epicObjectives(),complete=tasks.filter(x=>x[1]).length;const questList=$('r12Quests');if(questList)questList.innerHTML=tasks.map(([t,done])=>'<div class="r12-quest-row '+(done?'done':'')+'">'+(done?'✓ ':'◇ ')+escapeHtml(t)+'</div>').join('');$('r12Objective').textContent=epicCurrentObjective()+'.';$('r12Progress').style.width=Math.round((Math.min(e.chapter,7)+complete/Math.max(1,tasks.length))/7*100)+'%';$('r12Counter').textContent='Capítulo '+(Math.min(e.chapter,7)+1)+'/8';$('r12Inventory').innerHTML='<span class="r12-tag">🌱 '+st.found.length+'/3 sementes</span><span class="r12-tag">◆ '+e.items.length+' artefatos</span><span class="r12-tag">🧪 '+e.potions+' poções</span>';
 $('r13ChapterHint').textContent= e.chapter<=6?'História principal: '+(e.chapter+1)+'/7 · '+n.next:'Campanha encerrada · explore livremente';
 $('r13Attrs').querySelectorAll('[data-raise]').forEach(b=>b.onclick=()=>{if(e.points<=0)return;e.points--;e.stats[b.dataset.raise]++;e.hp=Math.min(maxHealth(),e.hp+(b.dataset.raise==='vig'?3:0));e.mp=Math.min(maxMana(),e.mp+(b.dataset.raise==='int'?1:0));save();update()});
 $('r13Equip').querySelectorAll('[data-artifact]').forEach(b=>b.onclick=()=>{let id=b.dataset.artifact;if(e.equipped.includes(id))e.equipped=e.equipped.filter(x=>x!==id);else{if(e.equipped.length>=2){notify('Só é possível equipar dois artefatos. Desequipe um primeiro.');return}e.equipped.push(id)}recomputeHealth();save();update()});
}
function setupEpicUI(){const box=document.createElement('section');box.className='r12-card r13-story-card';box.innerHTML='<h3 id="r13Chapter">Jornada principal</h3><p id="r13Objective" class="r12-objective"></p><div id="r13ChapterHint" class="r13-caption"></div><p id="r13Status" class="r13-caption"></p>';document.querySelector('.r12-aside').prepend(box);
 const stats=document.createElement('section');stats.className='r12-card r13-stat-card';stats.innerHTML='<h3>⚔️ Herói e atributos</h3><p id="r13Class"></p><div id="r13Life" class="r13-life"></div><div id="r13Level" class="r13-caption"></div><div id="r13Coins" class="r13-caption"></div><div id="r13Points" class="r13-caption"></div><div id="r13Attrs" class="r13-attrs"></div><p class="r13-caption">As fraquezas e habilidades influenciam o dano de cada batalha.</p>';box.after(stats);
 const items=document.createElement('section');items.className='r12-card r13-artifacts-card';items.innerHTML='<h3>◆ Relicário · 2 slots</h3><div id="r13Equip"></div><p id="r13Legend" class="r13-caption"></p>';stats.after(items);
 const side=document.createElement('section');side.className='r12-card r13-side-card';side.innerHTML='<h3>✦ Missões e mundos conectados</h3><div id="r13Side"></div><p class="r13-caption">Os modos clássicos continuam independentes. Suas vitórias liberam recompensas RPG opcionais.</p>';items.after(side);
 const book=document.createElement('section');book.className='r12-card r13-chronicle-card';book.innerHTML='<h3>📚 Livro das Crônicas</h3><p class="r13-caption">Releia a narrativa dos capítulos já descobertos, mesmo após sair do jogo.</p><div id="r13Chronicles" class="r13-chronicles"></div>';side.after(book);
 const intro=document.createElement('div');intro.id='r13ClassSelect';intro.className='r13-class-overlay';intro.hidden=true;intro.setAttribute('role','dialog');intro.setAttribute('aria-label','Escolher classe');document.getElementById('rpgDlg').append(intro);
 const hud=document.querySelector('.r12-head small');if(hud)hud.textContent='RPG · A Crônica da Primeira Mangueira';
 const p=document.querySelector('.r12-head p');if(p)p.textContent='Explore, enfrente os chefes e descubra o destino da primeira mangueira.';
 const reset=$('r12Reset');if(reset)reset.textContent='Reiniciar aventura';
 const objective=document.querySelector('.r12-aside>.r12-card:not(.r13-story-card):not(.r13-stat-card):not(.r13-artifacts-card) h3');if(objective)objective.innerHTML='📜 Prólogo das Sementes';
 renderEpicUI();
}
let epicAvatarSig='',epicAvatarCanvas=null,epicVisual={};
function visualData(){let custom={};try{const handle=(localStorage.getItem('sg_handle')||'').toLowerCase().replace(/[^a-z0-9._]/g,'').slice(0,30);const key='sam_orchard_campaign_2026_'+(handle?'u_'+handle:'guest');custom=JSON.parse(localStorage.getItem(key)||'null')||{}}catch(e){}
 let av={c:Number(custom.fruit)||0,h:'none'};try{if(typeof prof!=='undefined'&&prof?.avatar){av={...av,...prof.avatar}}}catch(e){}
 try{if(typeof draft!=='undefined'&&draft){if(Number.isInteger(draft.c))av.c=draft.c;if(draft.h)av.h=draft.h}}catch(e){}
 // Cor do guarda-roupa é a fonte principal para a aparência, chapéu oficial do perfil prevalece.
 if(Number.isInteger(custom.fruit))av.c=custom.fruit;
 const eq=custom.equipped||{};return {av,face:custom.face||'warm',equipped:eq,classId:epic().class};}
function refreshEpicAvatar(){const v=visualData(),sig=JSON.stringify(v);if(sig===epicAvatarSig)return;epicAvatarSig=sig;epicVisual=v;
 const canvas=document.createElement('canvas');canvas.width=24;canvas.height=34;const g=canvas.getContext('2d');g.imageSmoothingEnabled=false;
 const eq=v.equipped||{},c=v.av.c;
 // Capa atrás da manga: as peças escolhidas no guarda-roupa aparecem no mundo.
 if(eq.cape){g.fillStyle=eq.cape.includes('leaf')?'#5d973f':eq.cape.includes('dawn')?'#c67b33':eq.cape.includes('aurora')?'#398e99':eq.cape.includes('night')?'#27294f':'#5d417b';g.fillRect(4,8,16,22);g.fillRect(2,23,20,6);g.fillStyle='#292236';g.fillRect(2,29,4,2);g.fillRect(18,29,4,2)}
 const tmp=document.createElement('canvas');tmp.width=16;tmp.height=20;try{if(typeof drawAv==='function')drawAv(tmp,{c:Math.max(0,Math.min(7,Number(c)||0)),h:v.av.h||'none'});else{let gg=tmp.getContext('2d');gg.fillStyle='#f2b632';gg.fillRect(3,3,10,15)}}catch(ex){}
 g.drawImage(tmp,4,4,16,22);
 if(eq.body){g.fillStyle=eq.body.includes('prism')?'#657fc2':eq.body.includes('amber')?'#b87d40':'#6b4c37';g.fillRect(7,19,10,4);g.fillStyle='#cdad74';g.fillRect(9,20,6,1)}
 if(eq.face){g.fillStyle=eq.face.includes('star')?'#e9ba78':eq.face.includes('prism')?'#6abdcf':'#45334e';g.fillRect(7,17,10,3);g.fillStyle='#d6b1e5';g.fillRect(9,17,2,1);g.fillRect(13,17,2,1)}
 if(v.face==='spirit'){g.fillStyle='#88ffbe';g.fillRect(9,17,2,2);g.fillRect(14,17,2,2)}
 if(v.face==='scared'||v.face==='sleepy'){g.fillStyle='#251828';g.fillRect(12,21,2,2)}if(v.face==='joyful'){g.fillStyle='#251828';g.fillRect(9,21,7,1)}if(v.face==='fierce'){g.fillStyle='#fff1ae';g.fillRect(8,16,3,1);g.fillRect(14,16,3,1)}
 if(eq.head && !['none','sprout-pin',v.av.h].includes(eq.head)){g.fillStyle=eq.head.includes('witch')||eq.head.includes('mushroom')?'#634a84':eq.head.includes('crown')||eq.head.includes('circlet')?'#ffc756':eq.head.includes('storm')?'#8bd9eb':'#3d4764';g.fillRect(7,2,10,4);g.fillRect(4,5,16,2)}
 if(eq.hand){g.fillStyle=eq.hand.includes('staff')?'#76dbec':eq.hand.includes('torch')?'#ffb862':'#e0c47c';g.fillRect(21,13,2,15);g.fillRect(19,13,6,3)}
 if(v.classId==='arcanista'){g.fillStyle='#87d4f2';g.fillRect(20,11,2,5)}else if(v.classId==='rastreador'){g.fillStyle='#f39b55';g.fillRect(20,12,2,6)}else if(v.classId==='guardiao'){g.fillStyle='#7fc96c';g.fillRect(20,14,2,5)}
 epicAvatarCanvas=canvas;
}
function renderAvatarToCanvas(target,w,h,inBattle=false){if(!target)return;refreshEpicAvatar();const g=target.getContext('2d');g.clearRect(0,0,w,h);g.imageSmoothingEnabled=false;if(!epicAvatarCanvas)return;
 const ratio=Math.min(w/24,h/34)*.91,szW=24*ratio,szH=34*ratio;g.drawImage(epicAvatarCanvas,(w-szW)/2,(h-szH)/2,szW,szH)}
function drawEpicAvatar(x,y){refreshEpicAvatar();const moving=Math.abs(player.vx)+Math.abs(player.vy)>.1,bob=moving?Math.sin(clock*14)*1.6:Math.sin(clock*2.5)*.55;
 ctx.save();ctx.fillStyle='#121925aa';ctx.beginPath();ctx.ellipse(x,y+10,12,4,0,0,Math.PI*2);ctx.fill();ctx.translate(x,y-14+bob);
 if(player.vx<-.1)ctx.scale(-1,1);
 const sway=moving?Math.sin(clock*14)*.036:Math.sin(clock*2)*.012;ctx.rotate(sway);
 ctx.imageSmoothingEnabled=false;
 if(epicVisual.equipped?.aura){ctx.strokeStyle=epicVisual.equipped.aura.includes('ember')?'#ffc05baa':epicVisual.equipped.aura.includes('aurora')?'#6ff9d5aa':'#9fbcf0aa';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,-2,25+Math.sin(clock*5)*2,27,0,0,Math.PI*2);ctx.stroke()}
 if(epicAvatarCanvas)ctx.drawImage(epicAvatarCanvas,-21,-39,42,60);
 if(moving){const foot=Math.sin(clock*14)*4;ctx.fillStyle='#44332e';ctx.fillRect(-10,19+foot,7,5);ctx.fillRect(4,19-foot,7,5)}
 if(epicVisual.equipped?.companion){ctx.shadowColor=epicVisual.equipped.companion.includes('owl')?'#b5a2ff':'#f8f39b';ctx.shadowBlur=10;ctx.fillStyle=epicVisual.equipped.companion.includes('owl')?'#ac99ff':'#e8ed73';ctx.beginPath();ctx.arc(23,-24+Math.sin(clock*7)*3,3.5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0}
 ctx.restore();}
function drawEpicEnemy(a,x,y,bob){const type=epicMonsters[a.id];const m=EPIC_ENEMIES[type];if(!m)return;ctx.save();ctx.fillStyle='#160d2ba4';ctx.beginPath();ctx.ellipse(x,y+17,20,6,0,0,Math.PI*2);ctx.fill();ctx.shadowColor= m.element==='shadow'?'#d485fc':m.element==='nature'?'#79db6f':'#e3d683';ctx.shadowBlur=8+Math.sin(clock*3)*3;pixelSprite(m.sprite,x,y-16+bob,70,65);ctx.restore()}
function drawEpicActor(a,x,y,bob){if(a.epic==='enemy')drawEpicEnemy(a,x,y,bob);
 else if(a.epic==='resource'){ctx.save();ctx.fillStyle=a.id.startsWith('echo')?'#bbb0fd':'#f8d477';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=17;ctx.beginPath();ctx.arc(x,y-7+bob,9,0,Math.PI*2);ctx.fill();ctx.restore()}
 else if(a.epic==='gate'){ctx.save();ctx.strokeStyle=actorColor(a.type);ctx.lineWidth=4;ctx.shadowColor='#c5a5fc';ctx.shadowBlur=12;ctx.beginPath();ctx.ellipse(x,y-7,19,12,0,0,Math.PI*2);ctx.stroke();ctx.restore()}
 else if(a.epic==='npc'){
  const im=a.id==='maira'?v23Sprites.maira:null;
  if(im?.complete&&im.naturalWidth){
    ctx.imageSmoothingEnabled=false;
    const frame=matchMedia('(prefers-reduced-motion: reduce)').matches?0:Math.floor(clock*3)%4;
    ctx.drawImage(im,frame*48,0,48,48,x-23,y-38+bob,46,46)
  }else drawCharacter(x,y-6+bob,'#687a9e','#e3ba96',false)
 }
 else if(a.epic==='altar'){ctx.save();ctx.fillStyle='#72586d';ctx.fillRect(x-15,y-6,30,20);ctx.fillStyle='#cba88c';ctx.fillRect(x-12,y-13,24,9);ctx.fillStyle='#fde0a9';ctx.font='bold 23px serif';ctx.fillText('✧',x,y-21);ctx.restore()}
}

 function actorVisible(a){if(a.epic)return epicActorVisible(a);if(a.type==='seed'&&st.found.includes(a.id))return false;if(a.id==='reliquia'&&!st.unlocked)return false;return true}
 function interact(a){
  if(a?.epic){epicInteract(a);return;}
  if(!a){say('Pomar','Não há nada para investigar aqui. Aproxime-se de um brilho, personagem ou construção.');return}
  if(a.id==='guarda'){const first=!st.seen.includes('guarda');st.seen.push('guarda');save();say('Guardião Bento',first?'Sam! O pomar está perdendo sua luz. Três Sementes Ancestrais foram levadas para a floresta. Encontre-as e o Santuário das Raízes voltará a despertar.':'Se precisar de ajuda, caminhe pela passagem ao norte. Quando recuperar as três sementes, procure o portão a leste da floresta.',()=>{if(first)log('Bento pediu que eu reunisse três sementes escondidas na floresta.')});return}
  if(a.id==='livia'){say('Lívia, a Bruxa','A floresta está acordada, mas a maldição cresce sob as raízes. O portal de Halloween guarda os segredos de uma história antiga. Quer conhecer essa história?',()=>toHalloween(),'Explorar Halloween');return}
  if(a.id==='firefly'){say('Lumi, o Vaga-lume',allSeeds()?'Você reuniu as três luzes! A porta do Santuário finalmente escutará seu chamado.':'Uma semente responde ao sol, outra à lua e a última à memória. Procure os três brilhos em lugares diferentes da trilha.');return}
  if(a.id==='espirito'){say('Eco de Eldra','Antigamente, cada mangueira protegia uma lembrança. A Relíquia não é uma arma: ela reúne as memórias da primeira Guardiã do Pomar. Se você trouxer as três sementes ao altar, talvez consiga ouvi-las.');return}
  if(a.type==='seed'){st.found.push(a.id);log(labels[a.id]);say('Semente encontrada','Você encontrou a '+a.label+'! '+st.found.length+'/3 sementes recuperadas.',()=>{if(allSeeds())log('As três sementes brilham em uníssono. O Santuário pode ser aberto.');});return}
  if(a.id==='forest'){warp('floresta',2.8,7);return}
  if(a.id==='toVila'){warp('vila',12,2.75);return}
  if(a.id==='toRuinas'){if(!allSeeds()){say('Portão de Raízes','Três encaixes vazios formam um triângulo. Faltam '+(3-st.found.length)+' sementes para abrir a passagem.');return}st.unlocked=true;log('O portão leste se abriu. Uma voz antiga chamou pelo meu nome.');warp('ruinas',2.8,7);return}
  if(a.id==='toFloresta'){warp('floresta',20.9,6.9);return}
  if(a.id==='altar'){if(!allSeeds()){say('Altar Ancestral','Há três encaixes ao redor do altar, mas nem todas as sementes foram recuperadas.');return}if(st.altarActive){say('Altar Ancestral','A luz do altar permanece acesa. Procure a Relíquia ao sul.');return}ritualPuzzle();return}
  if(a.id==='reliquia'){if(!st.altarActive){say('Relíquia selada','Há um círculo de símbolos gravado ao redor da relíquia. Resolva primeiro o enigma do altar, ao norte.');return}if(st.relic){say('Relíquia do Guardião','Seu brilho já pertence a você. A história continuará nos modos Defesa e Halloween.');return}
   st.relic=true;advanceEpicChapter(1);const rewarded=!st.bonus;st.bonus=true;save();if(rewarded)gainLocalSeeds(50);log('Recuperei a Relíquia do Guardião. A maldição do pomar começou a revelar seu passado.');say('Relíquia recuperada','Uma luz sobe pelas raízes do pomar. Você concluiu a primeira missão do RPG híbrido! '+(rewarded?'Recebeu 50 sementes locais da loja como recompensa.':'')+' Continue em Defesa do Pomar ou na aventura de Halloween.');return}
  if(a.id==='portalSombras'){if(!st.relic){say('Portal das Sombras','A relíquia do altar reage à neblina. Primeiro, recupere a relíquia para atravessar este portal do mundo. O Halloween continua acessível pelo menu.');return}toHalloween();return}
  if(a.id==='halloween'){toHalloween();return}
  if(a.id==='defesa'){pane('gameDlg');return}
  if(a.id==='loja'){toShop();return}
  if(a.id==='profile'){pane('houseDlg');return}
  if(a.id==='praca'){pane('murDlg');return}
 }
 function nearest(){let best=null,d=Infinity;for(const a of room().actors){if(!actorVisible(a))continue;let dist=Math.hypot(player.x-a.x,player.y-a.y);if(dist<d){d=dist;best=a}}return d<1.9?best:null}
 function action(){if(!visible||dialogOpen)return;interact(nearest())}
 function collide(x,y){if(x<.48||y<.48||x>COLS-.48||y>ROWS-.48)return true;
  const r=.35;
  for(const b of room().blocks){if(x+r>b.x&&x-r<b.x+b.w&&y+r>b.y&&y-r<b.y+b.h)return true}
  for(const t of room().props){if(Math.hypot(x-t.x,y-t.y)<(t.type==='tree'?.72:.5))return true}
  return false}
 function random(x,y,m=97){let v=Math.sin(x*127.1+y*311.7+m*91.7)*43758.5453;return v-Math.floor(v)}
 function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.floor(x),Math.floor(y),Math.ceil(w),Math.ceil(h))}
 function pixelSprite(name,x,y,w,h=w){const im=sprite(name);if(im.complete&&im.naturalWidth){ctx.drawImage(im,x-w/2,y-h/2,w,h);return true}return false}
 function baseMap(){let rm=room();rect(0,0,W,H,rm.floor);
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
   const px=x*T,py=y*T,h=random(x,y,st.map==='vila'?31:st.map==='floresta'?17:9);
   if(st.map==='ruinas'){rect(px,py,T,T,h>.64?'#353746':h<.16?'#2b2e3c':'#343546');if(h>.87)rect(px+3,py+3,26,1,'#56536c');if(h<.15)rect(px+24,py+26,3,2,'#635a67')}
   else{rect(px,py,T,T,h>.7?'#2d5135':h<.18?'#24462e':rm.floor);if(h>.82){rect(px+10,py+11,3,5,'#8dbb61');rect(px+17,py+17,2,4,'#b4c972')}else if(h<.12){rect(px+20,py+11,3,3,'#e5bd63');rect(px+22,py+11,3,4,'#fff1a7')}else if(h<.37){rect(px+4,py+24,3,2,'#36653f');rect(px+17,py+8,4,2,'#3a693b')}}
  }
  if(st.map==='vila'){
   rect(11*T,0,2*T,H,'#74593b');rect(0,7*T,W,2*T,'#74593b');for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){if((x===11||x===12||y===7||y===8)&&random(x,y,44)>.45)rect(x*T+6,y*T+19,11,3,'#927954')}
   drawSign(11*T+18,T*2.8,'NORTE  → FLORESTA');
  }
  if(st.map==='floresta'){
   rect(0,6*T,W,2*T,'#565b36');for(let x=0;x<COLS;x++){if(x%2===0)rect(x*T+7,6*T+8,7,3,'#78714a')}
  }
  if(st.map==='ruinas'){
   rect(0,6*T,W,2*T,'#55506d');rect(11*T,4*T,2*T,7*T,'#54506b');
   for(let i=0;i<ROWS;i+=2){rect(0,i*T,8,13,'#626177');rect(W-8,i*T,8,13,'#626177')}
  }
 }
 function drawSign(x,y,msg){rect(x-65,y-15,130,27,'#3f2c25');rect(x-63,y-13,126,23,'#9a6a3c');rect(x-57,y-8,115,14,'#473425');ctx.fillStyle='#ffe5a5';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText(msg,x,y+1)}
 function drawTree(x,y,dead=false,scale=1){ctx.save();ctx.translate(x*T,y*T);ctx.scale(scale,scale);const sway=Math.sin(clock*1.5+x)*1.2;
  rect(-7,8,14,30,dead?'#41323d':'#4d3122');rect(-4,5,8,20,dead?'#6e5867':'#91613d');rect(-10,1,5,25,dead?'#41323d':'#66422a');
  if(dead){rect(-23,-8,34,6,'#554653');rect(-15,-20,6,18,'#746174');rect(12,-9,6,17,'#746174')}
  else{for(const [ox,oy,r,c] of [[-18,-17,22,'#224f2d'],[17,-14,20,'#285c34'],[sway,-28,24,'#35783b'],[-4,-35,14,'#4b9146']]){ctx.fillStyle=c;ctx.beginPath();ctx.arc(ox,oy,r,0,Math.PI*2);ctx.fill()}for(const [ox,oy] of [[-18,-15],[10,-27],[18,-6]]){rect(ox,oy,7,10,'#ffb83d');rect(ox+2,oy,3,3,'#ffe189')}}ctx.restore()}
 function drawBuilding(b){let x=b.x*T,y=b.y*T,w=b.w*T,h=b.h*T;
  if(b.type==='rocks'||b.type==='ruin'){
    rect(x,y,w,h,b.type==='rocks'?'#353f3c':'#515061');rect(x+6,y+9,w-12,h-14,'#606674');rect(x+12,y+15,w-24,h-27,'#767789');for(let i=0;i<7;i++){rect(x+10+i*11,y+15+i%2*10,8,3,'#4c4b5e')}return
  }
  let roof=b.type==='portal'?'#56325e':b.type==='defesa'?'#6a343f':b.type==='loja'?'#995738':'#49647e';
  rect(x+6,y+14,w-12,h-12,'#3b2a26');rect(x,y+4,w,h-18,roof);rect(x+8,y+10,w-16,7,'#e0ae61');rect(x+9,y+19,w-18,9,roof);
  rect(x+w/2-13,y+h-32,26,32,'#402a28');rect(x+w/2-10,y+h-29,20,29,'#8a633d');
  rect(x+22,y+42,24,23,'#f2bc66');rect(x+w-46,y+42,24,23,'#f2bc66');rect(x+27,y+46,14,14,'#87a4bd');rect(x+w-41,y+46,14,14,'#87a4bd');
  rect(x+14,y-2,w-28,8,'#271e31');rect(x+20,y+4,w-40,3,'#ab8c67');
  ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillStyle='#ffdfae';ctx.fillText(b.type==='loja'?'MASCOTES':b.type==='defesa'?'DEFESA':b.type==='portal'?'HALLOWEEN':'CABANA',x+w/2,y+25)
 }
 function actorColor(type){return ({seed:'#ffe27d',npc:'#baceff',shop:'#f9c58a',defense:'#ffa783',halloween:'#dda8ff',profile:'#b3d5ff',social:'#a8f1be',passage:'#a5e6a9',door:'#d8cf9b',altar:'#ffe0a3',relic:'#ffe7af'})[type]||'#ffffff'}
 function drawActor(a){if(!actorVisible(a))return;const x=a.x*T,y=a.y*T,bob=Math.sin(clock*3+a.x)*2;ctx.save();if(a.epic){drawEpicActor(a,x,y,bob);ctx.restore();return;}
  if(['passage','door','halloween','defense','shop','profile','social'].includes(a.type)){
   const alpha=.47+Math.sin(clock*3+a.x)*.27;ctx.globalAlpha=alpha;ctx.strokeStyle=actorColor(a.type);ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y-4,19,10,0,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
   if(a.type==='passage'){rect(x-8,y-32,16,14,'#a5e6a9');rect(x-5,y-36,10,6,'#f3e3a3')}
   if(a.type==='door')drawGlyph(x,y,'❖','#e8cca0');
   if(a.type==='halloween')drawGlyph(x,y,'✦','#e29ef5');
   if(a.type==='shop')drawGlyph(x,y,'◆','#ffcd6f');
   if(a.type==='defense')drawGlyph(x,y,'⚔','#ffc28a');
   if(a.type==='profile')drawGlyph(x,y,'⌂','#bedefc');
   if(a.type==='social')drawGlyph(x,y,'♧','#b6f5cc');
  }
  if(a.type==='seed'){const colors={seedA:'#f5b945',seedB:'#8cceff',seedC:'#d9a7ff'};const col=colors[a.id];ctx.shadowColor=col;ctx.shadowBlur=14;rect(x-7,y-11+bob,14,17,col);rect(x-3,y-15+bob,6,5,'#fff6ce');ctx.shadowBlur=0;drawGlyph(x,y-24+bob,'✦',col)}
  if(a.type==='altar'){rect(x-25,y-5,50,17,'#443d51');rect(x-21,y-12,42,9,'#927b6c');for(let k=0;k<3;k++){ctx.fillStyle=st.unlocked?'#ffcd7a':'#282234';ctx.beginPath();ctx.arc(x+(k-1)*15,y-13,5,0,Math.PI*2);ctx.fill()}drawGlyph(x,y-37,'✧',st.unlocked?'#ffdc93':'#9285a0')}
  if(a.type==='relic'){drawGlyph(x,y-7+bob,'✦',st.relic?'#ffe9aa':'#e8cb8f')}
  if(a.type==='npc'){
   rect(x-10,y+13,20,5,'#1e2535');
   const characterId=({guarda:'bento',livia:'livia',espirito:'eldra'})[a.id];
   const im=characterId&&v23Sprites[characterId];
   if(im&&im.complete&&im.naturalWidth){
      ctx.imageSmoothingEnabled=false;
      const frame=matchMedia('(prefers-reduced-motion: reduce)').matches?0:Math.floor(clock*3+a.x)%4;
      ctx.drawImage(im,frame*48,0,48,48,x-23,y-39+bob,46,46);
   }else if(a.id==='firefly'){pixelSprite('vagalume_idle',x,y+bob-3,43,43)}
   else if(a.id==='livia'){drawCharacter(x,y-7+bob,'#9d61c4','#f9d4b2',true)}
   else if(a.id==='espirito'){drawCharacter(x,y-8+bob,'#b3dcf8','#e0f8ff',true)}
   else{drawCharacter(x,y-7+bob,'#a6aa5e','#e6bd88',false)}
  }
  ctx.restore()}
 function drawCharacter(x,y,coat,face,witch){rect(x-9,y-7,18,24,coat);rect(x-7,y-28,14,20,face);rect(x-8,y+16,6,6,'#41374a');rect(x+3,y+16,6,6,'#41374a');rect(x-3,y-20,3,3,'#302437');rect(x+4,y-20,3,3,'#302437');if(witch){rect(x-18,y-33,36,6,'#37233d');rect(x-8,y-49,16,17,'#4d315d')}else{rect(x-9,y-30,18,7,'#635039')}}
 function drawGlyph(x,y,symbol,color){ctx.fillStyle=color;ctx.font='bold 24px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(symbol,x,y)}
 function drawPlayer(){drawEpicAvatar(player.x*T,player.y*T)}
 function camera(){const z=window.innerWidth<=540?1.65:1;
   const halfW=W/(2*z),halfH=H/(2*z);
   return {z,cx:Math.max(halfW,Math.min(W-halfW,player.x*T)),cy:Math.max(halfH,Math.min(H-halfH,player.y*T))};
 }
 function render(){const cam=camera();ctx.save();ctx.translate(W/2,H/2);ctx.scale(cam.z,cam.z);ctx.translate(-cam.cx,-cam.cy);
  baseMap();for(const b of room().blocks)drawBuilding(b);for(const p of room().props)drawTree(p.x,p.y,p.type==='dead');for(const a of room().actors)drawActor(a);guideDraw();drawPlayer();
  const a=nearest();if(a){ctx.save();ctx.textAlign='center';ctx.font='bold 13px sans-serif';let line='E · '+a.label;let width=Math.min(280,ctx.measureText(line).width+22);let px=Math.min(W-width/2-8,Math.max(width/2+8,a.x*T));let py=Math.max(64,a.y*T-39);rect(px-width/2,py-20,width,25,'#1e1428ee');ctx.strokeStyle=actorColor(a.type);ctx.lineWidth=1;ctx.strokeRect(px-width/2,py-20,width,25);ctx.fillStyle='#ffebce';ctx.fillText(line,px,py-3);ctx.restore()}
  if(st.map==='ruinas'){ctx.fillStyle='#b8a3ff12';ctx.fillRect(0,0,W,H)}ctx.restore();
 }
 function tick(time){let dt=Math.min(.04,Math.max(0,(time-last)/1000||0));last=time;clock+=dt;
  if(visible&&!document.hidden){
   if(!dialogOpen){let dx=(keys.right?1:0)-(keys.left?1:0),dy=(keys.down?1:0)-(keys.up?1:0);
    if(touchDest){const a=touchDest;dx=a.x-player.x;dy=a.y-player.y;if(Math.hypot(dx,dy)<.3){touchDest=null;dx=dy=0}}
    const m=Math.hypot(dx,dy);if(m>0){dx/=m;dy/=m;const step=3.45*dt;player.vx=dx;player.vy=dy;
      if(!collide(player.x+dx*step,player.y))player.x+=dx*step;
      if(!collide(player.x,player.y+dy*step))player.y+=dy*step;
    }else{player.vx=player.vy=0}
    if(time>nextSave){nextSave=time+900;save()}
   }
   render();guideUI();let a=nearest(),tip=a?'Pressione E ou INVESTIGAR para '+a.label+'.':'WASD/setas ou toque no mapa. Interaja com portais, NPCs e chefões. Aventure-se pela campanha.';
   if(tip!==lastTip){lastTip=tip;$('r12Tip').textContent=tip}
  }
  requestAnimationFrame(tick)
 }
 function bind(){
  const controlKeys={ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down',ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right'};
  document.addEventListener('keydown',e=>{if(!visible||dialogOpen)return;const t=e.target;if(t&&(/INPUT|TEXTAREA|SELECT/.test(t.tagName)||t.isContentEditable))return;
   const k=controlKeys[e.key];if(k){keys[k]=true;e.preventDefault()}
   if(e.key==='e'||e.key==='E'||e.key===' '){e.preventDefault();if(!e.repeat)action()}
  });
  document.addEventListener('keyup',e=>{const k=controlKeys[e.key];if(k)keys[k]=false});window.addEventListener('blur',()=>Object.keys(keys).forEach(k=>keys[k]=false));
  document.querySelectorAll('[data-r12move]').forEach(b=>{let name=b.dataset.r12move;
   b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture?.(e.pointerId);keys[name]=true;b.classList.add('pressed');touchDest=null});
   for(const type of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(type,()=>{keys[name]=false;b.classList.remove('pressed')});
  });
  $('r12Action').addEventListener('click',action);
  cv.addEventListener('pointerdown',e=>{if(dialogOpen)return;const b=cv.getBoundingClientRect(),cam=camera();const x=(cam.cx+((e.clientX-b.left)/b.width*W-W/2)/cam.z)/T,y=(cam.cy+((e.clientY-b.top)/b.height*H-H/2)/cam.z)/T;
   const target=room().actors.find(a=>actorVisible(a)&&Math.hypot(x-a.x,y-a.y)<.85);
   if(target&&Math.hypot(player.x-target.x,player.y-target.y)<1.9){interact(target);return}
   touchDest={x:Math.max(.5,Math.min(COLS-.5,x)),y:Math.max(.5,Math.min(ROWS-.5,y))};
  });
  document.querySelectorAll('[data-r12open]').forEach(b=>b.addEventListener('click',()=>{const d=b.dataset.r12open;if(d==='shop')toShop();else if(d==='pets')toPets();else if(d==='halloween')toHalloween();else pane(d)}));
  $('r12Reset').addEventListener('click',()=>{if(!window.confirm('Reiniciar toda a campanha RPG (classes, atributos, artefatos, capítulos e exploração)? Loja, conquistas do site e demais modos serão preservados.'))return;st=blank();player.x=st.x;player.y=st.y;save();update();notify('Sua aventura explorável foi reiniciada.');showEpicClasses()});
 }
 const prevShow=window.showPane;
 if(typeof prevShow==='function')window.showPane=function(id){let result=prevShow.apply(this,arguments);const was=visible;visible=id==='rpgDlg';if(visible){if(storageKey()!==accountRpgKey){accountRpgKey=storageKey();const newData=JSON.parse(localStorage.getItem(accountRpgKey)||'null');st={...blank(),...(newData||{})};st.epic={...freshEpic(),...(st.epic||{}),stats:{...freshEpic().stats,...(st.epic?.stats||{})},flags:{...(st.epic?.flags||{})}};if(!rooms[st.map])st.map='vila';player.x=Number.isFinite(st.x)?st.x:11.7;player.y=Number.isFinite(st.y)?st.y:10.8;epicAvatarSig=''}syncEpicCrossModes();update();if(!epic().class)showEpicClasses();last=performance.now();if(!was){save();requestAnimationFrame(()=>cv.focus({preventScroll:true}))}}
   else if(was){save();Object.keys(keys).forEach(k=>keys[k]=false);touchDest=null}return result};
 const targetVisible=()=>!host.hidden;
 setupEpicUI();if(st.relic&&epic().chapter===0)advanceEpicChapter(1);bind();visible=targetVisible();update();if(visible&&!epic().class)showEpicClasses();requestAnimationFrame(tick);
 if(!st.seen.includes('welcome')){st.seen.push('welcome');save();}
 window.SamHybridRPG={interactById:(id)=>{const a=room().actors.find(a=>a.id===id);if(a)interact(a)},startBattle:(key)=>startCombat(key,Object.entries(epicMonsters).find(([a,b])=>b===key)?.[0]||key),chooseClass:(id)=>{document.querySelector('[data-r13class="'+id+'"]')?.click()},getState:()=>JSON.parse(JSON.stringify(st)),gotoRoom:(name)=>{if(rooms[name]){st.map=name;player.x=11;player.y=8;update();save()}},onDefenseResult:(won)=>epicDefenseReward(won),open:()=>window.showPane?.('rpgDlg')};
})();
