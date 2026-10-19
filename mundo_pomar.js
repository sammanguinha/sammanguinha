/* Sam Manguinha — Mundo do Pomar v12. Progresso local; jogos originais preservados. */
(()=>{'use strict';
 const host=document.getElementById('rpgDlg');
 const cv=document.getElementById('r12Canvas');if(!host||!cv)return;
 const ctx=cv.getContext('2d',{alpha:false});
 let W=768,H=448;
 const T=32,COLS=24,ROWS=14;
 // The canvas uses its native 768 × 448 coordinates outside game mode.
 // In immersive mode its drawing buffer matches the *screen aspect ratio*:
 // no stretched sprites, no landscape letterboxing, and touch coordinates stay exact.
 const RENDER_PIXEL_BUDGET=1400000;
 let lastViewportSignature='768x448';
 function syncGameViewport(){
  const immersive=host.classList.contains('sm-immersive');
  let width=768,height=448;
  if(immersive){
   const box=cv.parentElement.getBoundingClientRect();
   if(box.width>40&&box.height>40){
    const scale=Math.min(1,Math.sqrt(RENDER_PIXEL_BUDGET/(box.width*box.height)));
    width=Math.max(250,Math.round(box.width*scale));
    height=Math.max(250,Math.round(box.height*scale));
   }
  }
  const signature=width+'x'+height;
  if(lastViewportSignature===signature)return;
  lastViewportSignature=signature;
  W=width;H=height;cv.width=width;cv.height=height;
  ctx.imageSmoothingEnabled=false;
 }
 const viewportObserver=new ResizeObserver(()=>syncGameViewport());
 viewportObserver.observe(cv.parentElement);
 new MutationObserver(()=>requestAnimationFrame(syncGameViewport)).observe(host,{attributes:true,attributeFilter:['class']});
 window.addEventListener('resize',syncGameViewport,{passive:true});
 document.addEventListener('fullscreenchange',()=>requestAnimationFrame(syncGameViewport));
 const $=id=>document.getElementById(id);
 const keys={up:false,down:false,left:false,right:false,run:false};
 const rooms={
  vila:{name:'Vila da Mangueira',subtitle:'O início de toda colheita',floor:'#294d35',dirt:'#756043',night:false,
   blocks:[{x:2,y:2,w:5,h:3,type:'loja'},{x:17,y:2,w:5,h:3,type:'casa'},{x:2,y:9,w:4,h:3,type:'defesa'},{x:18,y:9,w:4,h:3,type:'portal'}],
   props:[{x:7,y:3,type:'tree'},{x:16,y:11,type:'tree'},{x:7,y:10,type:'tree'}],
   actors:[{id:'guarda',x:11.5,y:8.4,type:'npc',label:'Guardião Bento'},{id:'livia',x:17,y:7,type:'npc',label:'Lívia'},{id:'loja',x:4.5,y:5.6,type:'shop',label:'Empório da Vila · RPG'},{id:'defesa',x:4.0,y:8.1,type:'defense',label:'Arena de Defesa'},{id:'halloween',x:20,y:8.15,type:'halloween',label:'Pomar das Sombras'},{id:'forest',x:12,y:1.25,type:'passage',label:'Trilha Encantada'},{id:'profile',x:19,y:5.5,type:'profile',label:'Seu Refúgio'},{id:'praca',x:13.7,y:5.6,type:'social',label:'Praça Ao Vivo'}]},
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
 {id:'alchemist',x:15,y:7.5,type:'npc',epic:'npc',label:'Tito, o Botânico'},
 {id:'guildBoard',x:9.2,y:7.0,type:'board',label:'Quadro de Contratos'}
);
rooms.floresta.actors.push(
 {id:'toBosque',x:12,y:12,type:'passage',epic:'gate',min:2,target:'bosque',tx:2.7,ty:7,label:'Bosque das Teias'},
 {id:'basket',x:5.4,y:11.4,type:'seed',epic:'resource',label:'Cesta de Amália'},
 {id:'herb',x:21.4,y:4.8,type:'seed',epic:'resource',label:'Broto Luminoso'}
);
rooms.ruinas.actors.push({id:'toEstufa',x:20.5,y:11,type:'door',epic:'gate',min:1,target:'estufa',tx:2.8,ty:7,label:'Estufa das Brasas'});


/* V24 · Empório, cosméticos equipáveis e consumíveis úteis.
   Moedas aqui são progressão LOCAL RPG: ranking e mangas oficiais intocados. */
Object.assign(EPIC_ARTIFACTS,{
 anel_orvalho:{name:'Anel do Orvalho',rarity:'Comum',element:'water',desc:'+10 HP máximo. Brilho azul no personagem.',effect:'bloom'},
 broche_solar:{name:'Broche Solar',rarity:'Raro',element:'light',desc:'+12% de dano mágico.',effect:'focus'},
 capa_brisa:{name:'Capa da Brisa',rarity:'Raro',element:'nature',desc:'Mais fôlego para correr.',effect:'swift'},
 bracelete_casca:{name:'Bracelete da Casca',rarity:'Raro',element:'earth',desc:'Reduz dano recebido em 2.',effect:'ward'},
 amuleto_luar:{name:'Amuleto do Luar',rarity:'Épico',element:'light',desc:'+2 MP no início do combate.',effect:'moonrise'}
});
const V24_SHOP=Object.freeze([
 {id:'pocao',type:'Poções',name:'Poção de Vida',icon:'🧪',price:18,desc:'Recupera HP e remove veneno em combate.'},
 {id:'tonico_mana',type:'Poções',name:'Tônico Lunar',icon:'🌙',price:22,desc:'Recupera 6 MP em combate ou fora dele.'},
 {id:'antidoto',type:'Poções',name:'Antídoto Floral',icon:'🌿',price:12,desc:'Remove veneno no combate.'},
 {id:'elixir_velocidade',type:'Poções',name:'Elixir de Passos',icon:'💨',price:25,desc:'Corrida reforçada durante 90 segundos.'},
 {id:'bomba_esporos',type:'Combate',name:'Bomba de Esporos',icon:'🍄',price:34,desc:'20 de dano e cegueira temporária no alvo.'},
 {id:'escudo_folha',type:'Combate',name:'Escudo de Folha',icon:'🛡️',price:28,desc:'Defende um turno e restaura 1 MP.'},
 {id:'anel_orvalho',type:'Acessórios',name:'Anel do Orvalho',icon:'💍',price:85,desc:'+10 HP máximo.'},
 {id:'broche_solar',type:'Acessórios',name:'Broche Solar',icon:'☀️',price:125,desc:'Magia reforçada.'},
 {id:'capa_brisa',type:'Acessórios',name:'Capa da Brisa',icon:'🧣',price:110,desc:'Mais fôlego para correr.'},
 {id:'bracelete_casca',type:'Acessórios',name:'Bracelete da Casca',icon:'🪵',price:120,desc:'Proteção aprimorada.'},
 {id:'amuleto_luar',type:'Acessórios',name:'Amuleto do Luar',icon:'🌜',price:145,desc:'Energia extra ao iniciar batalhas.'}
]);
function v24Bag(){
 const e=epic();
 if(!e.v24||typeof e.v24!=='object')e.v24={};
 if(!e.v24.bag||typeof e.v24.bag!=='object')e.v24.bag={};
 if(!Number.isFinite(e.v24.stamina))e.v24.stamina=100;
 if(!Number.isFinite(e.v24.hasteUntil))e.v24.hasteUntil=0;
 return e.v24;
}
function v24Count(id){return Math.max(0,Math.floor(Number(v24Bag().bag[id])||0))}
function v24Take(id){const n=v24Count(id);if(!n)return false;v24Bag().bag[id]=n-1;save();return true}
function v24Buy(id){
 const it=V24_SHOP.find(item=>item.id===id),e=epic();if(!it)return;
 const accessory=!!EPIC_ARTIFACTS[id];
 if(accessory&&e.items.includes(id))return notify('Este acessório já está no seu Relicário.');
 if(!Number.isFinite(e.gold)||e.gold<it.price)return notify('Moedas insuficientes. Explore e vença batalhas.');
 // O estado do jogador e suas moedas são gravados juntos no save da campanha.
 const prev=JSON.stringify(e);
 e.gold-=it.price;
 if(accessory)e.items.push(id);
 else if(id==='pocao')e.potions=(Number(e.potions)||0)+1;
 else v24Bag().bag[id]=v24Count(id)+1;
 try{
  st.x=player.x;st.y=player.y;localStorage.setItem(storageKey(),JSON.stringify(st));
 }catch(err){st.epic=JSON.parse(prev);notify('Não foi possível salvar a compra: nenhum item ou moeda foi alterado.');renderV24Shop();return}
 recomputeHealth();update();renderV24Shop();
 notify('Adquirido: '+it.name+(accessory?' · equipe no Relicário!':'!'));
}
function v24UseOutside(id){
 const e=epic();if(!v24Count(id))return notify('Você não tem esse item.');
 if(id==='tonico_mana'){
  if(e.mp>=maxMana())return notify('MP já está cheio.');
  v24Take(id);e.mp=Math.min(maxMana(),e.mp+6);
 }else if(id==='elixir_velocidade'){
  v24Take(id);v24Bag().hasteUntil=Date.now()+90000;v24Bag().stamina=100;
 }else return notify('Esse item funciona durante o combate.');
 save();update();renderV24Shop();notify('Item utilizado.');
}
let v24ShopFocus=null;
function openV24Shop(){
 const modal=document.getElementById('v24Shop');if(!modal||!modal.hidden)return;
 if(epicCombat||document.getElementById('r12Bubble')?.hidden===false||document.getElementById('r13ClassSelect')?.hidden===false){notify('Conclua o combate, diálogo ou escolha de classe antes de comprar.');return}
 v24ShopFocus=document.activeElement;keys.run=keys.up=keys.down=keys.left=keys.right=false;
 dialogOpen=true;renderV24Shop();modal.hidden=false;
 modal.querySelector('#v24ShopClose')?.focus({preventScroll:true});
}
function closeV24Shop(){
 const modal=document.getElementById('v24Shop');if(!modal||modal.hidden)return;
 modal.hidden=true;dialogOpen=false;update();save();
 v24ShopFocus?.focus?.({preventScroll:true});v24ShopFocus=null;
}
function renderV24Shop(){
 const holder=document.getElementById('v24ShopItems');if(!holder)return;
 const e=epic();document.getElementById('v24ShopGold').textContent='🪙 '+Math.max(0,Math.floor(e.gold||0))+' moedas RPG';
 holder.replaceChildren();
 for(const kind of ['Poções','Combate','Acessórios']){
  const sec=document.createElement('section');sec.className='v24-shop-group';
  const title=document.createElement('h3');title.textContent=kind;sec.append(title);
  const grid=document.createElement('div');grid.className='v24-shop-grid';
  for(const it of V24_SHOP.filter(q=>q.type===kind)){
   const owned=!!EPIC_ARTIFACTS[it.id]&&e.items.includes(it.id);
   const count=it.id==='pocao'?e.potions:v24Count(it.id);
   const card=document.createElement('article');card.className='v24-shop-item';
   const name=document.createElement('strong');name.textContent=it.icon+' '+it.name;
   const desc=document.createElement('p');desc.textContent=it.desc;
   const amount=document.createElement('small');amount.textContent=owned?'✓ Adquirido':EPIC_ARTIFACTS[it.id]?'Acessório permanente':'Na bolsa: '+count;
   const btn=document.createElement('button');btn.type='button';
   btn.textContent=owned?'✓ Comprado':'🪙 '+it.price+' · Comprar';
   btn.disabled=owned||e.gold<it.price;btn.onclick=()=>v24Buy(it.id);
   card.append(name,desc,amount,btn);
   if(!EPIC_ARTIFACTS[it.id]&&['tonico_mana','elixir_velocidade'].includes(it.id)&&count>0){
    const use=document.createElement('button');use.type='button';use.className='v24-secondary';
    use.textContent='Usar na exploração';use.onclick=()=>v24UseOutside(it.id);card.append(use);
   }grid.append(card);
  }sec.append(grid);holder.append(sec);
 }
}
function initV24Shop(){
 const root=document.getElementById('rpgDlg');if(!root||document.getElementById('v24Shop'))return;
 const modal=document.createElement('div');modal.id='v24Shop';modal.className='v24-modal';modal.hidden=true;
 modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');
 modal.setAttribute('aria-label','Loja RPG Empório da Vila');
 modal.innerHTML='<div class="v24-shop-panel"><header><div><small>VILA DA MANGUEIRA · COMÉRCIO RPG</small><h2>🏡 Empório da Vila</h2><p>Poções, itens de combate e acessórios equipáveis.</p></div><div><b id="v24ShopGold"></b><button id="v24ShopClose" type="button">✕ Fechar</button></div></header><p class="v24-shop-note">Moedas locais da aventura; não são mangas oficiais ou recursos de ranking. Acessórios podem ser equipados no Relicário.</p><div id="v24ShopItems"></div></div>';
 root.append(modal);modal.querySelector('#v24ShopClose').onclick=closeV24Shop;
 modal.addEventListener('click',ev=>{if(ev.target===modal)closeV24Shop()});
 modal.addEventListener('keydown',ev=>{
  if(ev.key==='Escape'){ev.preventDefault();closeV24Shop()}
  if(ev.key==='Tab'){
   const btns=[...modal.querySelectorAll('button:not(:disabled)')],first=btns[0],last=btns[btns.length-1];
   if(ev.shiftKey&&document.activeElement===first){ev.preventDefault();last?.focus()}
   else if(!ev.shiftKey&&document.activeElement===last){ev.preventDefault();first?.focus()}
  }
 });
 const main=root.querySelector('.r12-main');
 if(main){
  const bar=document.createElement('div');bar.className='v24-sprint-bar';
  bar.innerHTML='<label for="v24SprintMeter">⚡ Fôlego <span id="v24SprintText">100 fôlego</span></label><progress id="v24SprintMeter" max="100" value="100"></progress><button id="v24RunTouch" type="button" aria-pressed="false">💨 Segure para correr</button><button id="v24ShopShortcut" type="button">🛍️ Empório RPG</button><small>Shift + movimento no PC · segure Correr no celular</small>';
  main.append(bar);
  const run=bar.querySelector('#v24RunTouch');
  run.addEventListener('pointerdown',ev=>{ev.preventDefault();keys.run=true;run.setAttribute('aria-pressed','true');run.setPointerCapture?.(ev.pointerId)});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])run.addEventListener(type,()=>{keys.run=false;run.setAttribute('aria-pressed','false')});
  bar.querySelector('#v24ShopShortcut').onclick=openV24Shop;
 }
}


const V24_BIOMES={
 vila:['#365c3d','#426a46','#2b5139','#b2ce87'],floresta:['#1b4335','#235441','#153d2e','#67ab74'],
 ruinas:['#343748','#434557','#292c3e','#9990bf'],estufa:['#584632','#684d32','#453729','#ffad54'],
 bosque:['#283b3b','#354444','#1b2d31','#86aaa4'],mina:['#262c40','#343c59','#1d2337','#8ca9ee'],
 pantano:['#243f46','#2b4a4b','#182f39','#90c4b2'],observatorio:['#313451','#3b426a','#252741','#c5b2fb'],
 coracao:['#523346','#61394d','#42293b','#e986ba'],planicie:['#4d6440','#66804c','#3f563b','#ffe19b'],
 gruta:['#253d45','#2f5660','#183139','#74dbe6']
};
function v24Tile(px,py,x,y,h){
 const colors=V24_BIOMES[st.map]||V24_BIOMES.vila;
 const m=random(x,y,st.map.length*77);
 rect(px,py,T,T,h>.7?colors[1]:h<.16?colors[2]:colors[0]);
 if(['ruinas','mina','gruta','observatorio'].includes(st.map)){
  if(m>.63){rect(px+3,py+8,12,2,colors[3]);rect(px+3,py+10,2,9,colors[2]);rect(px+23,py+19,5,2,colors[3])}
  else if(m<.19){rect(px+10,py+23,3,5,colors[3]);rect(px+14,py+21,2,7,colors[3])}
 }else if(['pantano','bosque'].includes(st.map)){
  if(m>.54){rect(px+4,py+20,23,2,colors[2]);rect(px+8,py+22,13,3,colors[3])}
  if(m<.22){rect(px+21,py+5,3,8,colors[3]);rect(px+17,py+12,2,5,colors[3])}
 }else if(['estufa','coracao'].includes(st.map)){
  if(m>.58){rect(px+7,py+18,17,2,colors[3]);rect(px+12,py+12,3,7,colors[3])}
 }else if(m>.56){
  rect(px+4,py+20,2,4,colors[3]);rect(px+6,py+17,2,3,colors[3]);rect(px+22,py+13,2,4,colors[3]);
 }
}
function v24Decor(){
 const b=V24_BIOMES[st.map]||V24_BIOMES.vila;ctx.save();
 for(let i=0;i<22;i++){
  const x=32+random(i,7,77)*704,y=22+random(i,13,37)*397,m=random(i,5,18);
  ctx.globalAlpha=.4+m*.36;
  if(['mina','gruta','observatorio'].includes(st.map)){
   ctx.fillStyle=b[3];ctx.beginPath();ctx.moveTo(x,y-9-m*9);ctx.lineTo(x+4,y);ctx.lineTo(x-5,y);ctx.closePath();ctx.fill();
  }else if(['pantano','bosque','coracao'].includes(st.map)){
   ctx.strokeStyle=b[3];ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-3,y-9);ctx.lineTo(x+3,y-13);ctx.stroke();
   ctx.fillStyle=b[3];ctx.fillRect(x-4,y-14,7,3);
  }else if(['estufa','ruinas'].includes(st.map)){
   ctx.fillStyle=b[3];ctx.fillRect(x-5,y-2,11,2);ctx.fillRect(x-2,y-6,3,5);
  }else{ctx.fillStyle=b[3];ctx.fillRect(x,y-4,2,6);ctx.fillRect(x-3,y-1,8,2)}
 }
 ctx.restore();
}


/* V24 · Ramificações opcionais da aventura, preservando os nove mapas originais. */
Object.assign(rooms,{
 planicie:{name:'Campina dos Ventos',subtitle:'Relva dourada, pedras antigas e brisa constante',floor:'#4d6440',dirt:'#807957',night:false,
 blocks:[{x:3,y:3,w:3,h:2,type:'rocks'},{x:18,y:9,w:3,h:2,type:'rocks'}],
 props:[{x:5,y:8,type:'tree'},{x:20,y:4,type:'tree'}],
 actors:[{id:'toForestFromMeadow',x:1.4,y:7,type:'passage',epic:'gate',target:'floresta',tx:18,ty:11,label:'Voltar à Trilha'},
 {id:'v24MeadowHerb',x:12,y:4,type:'seed',epic:'resource',label:'Erva do Vento'},
 {id:'v24MeadowHerb2',x:19,y:11,type:'seed',epic:'resource',label:'Erva Solar'},
 {id:'v24MeadowWolf',x:13,y:9,type:'npc',epic:'enemy',label:'Lobo dos Ventos'}]},
 gruta:{name:'Gruta do Eco Azul',subtitle:'Cristais luminosos e ecos sob a terra',floor:'#253d45',dirt:'#395665',night:true,
 blocks:[{x:4,y:2,w:3,h:3,type:'rocks'},{x:17,y:9,w:4,h:3,type:'rocks'}],
 props:[{x:7,y:10,type:'dead'},{x:19,y:3,type:'dead'}],
 actors:[{id:'toMineFromGrotto',x:1.4,y:7,type:'passage',epic:'gate',target:'mina',tx:19,ty:10,label:'Voltar às Minas'},
 {id:'v24CrystalA',x:10,y:3,type:'seed',epic:'resource',label:'Cristal Ecoante'},
 {id:'v24CrystalB',x:17,y:5,type:'seed',epic:'resource',label:'Fragmento Azul'},
 {id:'v24GrottoWisp',x:12,y:9,type:'npc',epic:'enemy',label:'Vulto de Cristal'}]}
});
rooms.floresta.actors.push({id:'toMeadow',x:20.4,y:11.8,type:'passage',epic:'gate',target:'planicie',tx:2.5,ty:7,label:'Campina dos Ventos'});
rooms.mina.actors.push({id:'toGrotto',x:20.8,y:10.7,type:'door',epic:'gate',min:3,target:'gruta',tx:2.5,ty:7,label:'Gruta do Eco Azul'});
 // V29: the extra story shares the current RPG save; no account migration.
 const v29Data=window.SamV29Data;
 if(v29Data){
  for(const [key,actors] of Object.entries(v29Data.actors))
   if(rooms[key])rooms[key].actors.push(...actors.map(actor=>({...actor})));
  Object.assign(EPIC_ENEMIES,v29Data.enemies);
  Object.assign(EPIC_ARTIFACTS,{
   broche_aurora:{name:'Broche da Badalada',rarity:'Raro',element:'light',
    desc:'Com este broche equipado, MP máximo +3 e habilidades +8% de dano.',
    effect:'resonance'}
  });
 }


/* V30.2 · An explorable atrium and physical puzzle on the V29 world. */
rooms.atrioRaizes={name:'Átrio das Raízes',subtitle:'O juramento dos primeiros cuidadores',
 floor:'#253e44',dirt:'#536a5c',night:true,
 blocks:[{x:3,y:2,w:4,h:2,type:'ruin'},{x:18,y:2,w:3,h:2,type:'ruin'},{x:9,y:2,w:6,h:1,type:'ruin'}],
 props:[{x:4,y:11,type:'dead'},{x:20,y:10,type:'dead'},{x:11,y:12,type:'tree'}],
 actors:[
  {id:'v30AtrioBack',x:1.4,y:7,type:'passage',v30:'return',label:'Voltar à Floresta'},
  {id:'v30AtrioKeeper',x:12,y:9,type:'npc',v30:'keeper',label:'Guardião dos Registros'},
  {id:'v30RecordPath',x:7,y:6.4,type:'altar',v30:'record',label:'Inscrição dos Caminhos'},
  {id:'v30RecordHarvest',x:15.9,y:6.4,type:'altar',v30:'record',label:'Inscrição da Colheita'},
  {id:'v30RecordMemory',x:11.5,y:4.7,type:'altar',v30:'record',label:'Inscrição da Memória'}]};
rooms.vila.actors.push({id:'v30RootSignal',x:14.8,y:10.1,type:'altar',v30:'intro',label:'Raiz que Canta · V30'});
rooms.floresta.actors.push(
 {id:'v30ForestFissure',x:7.4,y:6.8,type:'altar',v30:'vision',label:'Fissura das Lembranças'},
 {id:'v30StoneSeed',x:5,y:9.6,type:'altar',v30:'stone',label:'Pedra da Semente'},
 {id:'v30StoneWater',x:13.2,y:9.2,type:'altar',v30:'stone',label:'Pedra da Água'},
 {id:'v30StoneLight',x:20.7,y:5.2,type:'altar',v30:'stone',label:'Pedra da Luz'},
 {id:'v30RootGate',x:20.4,y:9.9,type:'door',v30:'gate',label:'Passagem das Raízes · V30'});
Object.assign(EPIC_ARTIFACTS,{
 selo_dos_ecos_v303:{name:'Selo dos Ecos',rarity:'Raro',element:'light',desc:'Protege as vozes do bosque. Recupera 3 HP por turno quando equipado.',effect:'regen'},
 pingente_primeira_raiz_v30:{name:'Pingente da Primeira Raiz',rarity:'Raro',element:'nature',
  desc:'O juramento dos cuidadores. Em combate, recupera 3 HP por turno quando equipado.',effect:'regen'}
});
/* V30.3 — Chapter 1: the Echo Grove. Unlocks after the V30 prologue. */
rooms.bosqueEcos={name:'Bosque dos Ecos',subtitle:'Capítulo I · As vozes entre as folhas',
 floor:'#243f3e',dirt:'#536a55',night:true,
 blocks:[{x:3,y:2,w:4,h:3,type:'rocks'},{x:18,y:2,w:3,h:3,type:'ruin'},
 {x:9,y:9,w:5,h:2,type:'rocks'}],
 props:[{x:4,y:10,type:'tree'},{x:8,y:4,type:'dead'},{x:15,y:10,type:'tree'},
 {x:19,y:4,type:'dead'},{x:21,y:10,type:'tree'}],
 actors:[
 {id:'v303Back',x:1.5,y:7,type:'passage',v30:'backGrove',label:'Voltar ao Átrio'},
 {id:'v303Ayla',x:6.4,y:6.4,type:'npc',v30:'ayla',label:'Ayla, Guardiã dos Ecos'},
 {id:'v303Marker',x:12,y:4.4,type:'altar',v30:'marker',label:'Marco das Três Canções'},
 {id:'v303ChimeRain',x:5.2,y:10.6,type:'altar',v30:'chime',label:'Sino da Chuva'},
 {id:'v303ChimeWind',x:17.8,y:5.6,type:'altar',v30:'chime',label:'Sino do Vento'},
 {id:'v303ChimeEarth',x:20.1,y:10.6,type:'altar',v30:'chime',label:'Sino da Terra'},
 {id:'v303Sentinel',x:12.8,y:7.2,type:'npc',v30:'sentinel',label:'Sentinela do Silêncio'},
 {id:'v303Mural',x:20.2,y:3.2,type:'altar',v30:'mural',label:'Mural das Primeiras Vozes'},
 {id:'v303Supply',x:8.2,y:7.8,type:'seed',v30:'supply',label:'Bolsa de Sementes Perdida'}
 ]};
rooms.atrioRaizes.actors.push({id:'v303GroveGate',x:22,y:7,type:'door',v30:'groveGate',label:'Passagem para o Bosque dos Ecos'});
Object.assign(EPIC_ENEMIES,{
 v303_sentinela:{name:'Sentinela do Silêncio',element:'shadow',hp:150,atk:18,def:7,
 xp:170,gold:70,weak:'light',sprite:'vulto_eco_v24',
 intro:'O silêncio se move entre as raízes. A Sentinela prepara pulsos de sombra a cada três turnos.'}
});
Object.assign(EPIC_ENEMIES,{
 lobo_vento:{name:'Lobo dos Ventos',element:'nature',hp:44,atk:8,def:2,xp:68,gold:32,weak:'fire',sprite:'lobo_vento_v24',intro:'Um guardião da campina corre em círculos. A marca do vento revela quando ele vai atacar.'},
 vulto_eco:{name:'Vulto de Cristal',element:'storm',hp:90,atk:13,def:4,xp:130,gold:58,weak:'earth',sprite:'vulto_eco_v24',intro:'Os cristais escutam seus passos. O vulto reúne a luz em um único ponto.'}
});


/* V31 · Jardim das Entrelinhas. A escala muda os caminhos e as colisões, não só o desenho. */
Object.assign(V24_BIOMES,{
 jardimBruma:['#234b43','#315e4b','#1a3a36','#e5c986'],
 galeriasInsetos:['#534431','#675138','#3c322c','#dec579'],
 relicarioMusgo:['#293c48','#3d5360','#23333e','#b6daab']
});
rooms.jardimBruma={name:'Jardim da Bruma',subtitle:'Capítulo II · O mundo entre as raízes',floor:'#234b43',dirt:'#54765c',night:false,
 blocks:[{x:3,y:2,w:3,h:2,type:'rocks'},{x:18,y:2,w:3,h:2,type:'rocks'},{x:9,y:10,w:5,h:2,type:'rocks'}],
 props:[{x:4,y:5,type:'tree'},{x:8,y:3,type:'tree'},{x:16,y:11,type:'tree'},{x:20,y:4,type:'tree'}],
 actors:[
  {id:'v31Back',x:1.5,y:7,type:'passage',v31:'back',label:'Voltar ao Bosque dos Ecos'},
  {id:'v31Ema',x:6.8,y:6.4,type:'npc',v31:'ema',label:'Ema, Tecelã das Raízes'},
  {id:'v31Dew',x:6,y:10.4,type:'seed',v31:'ingredient',label:'Gota de Orvalho'},
  {id:'v31Bark',x:20,y:10.4,type:'seed',v31:'ingredient',label:'Casca de Memória'},
  {id:'v31Pollen',x:15.8,y:4.8,type:'seed',v31:'ingredient',label:'Pólen de Vidro'},
  {id:'v31Lens',x:12,y:5.1,type:'altar',v31:'lens',label:'Tear da Lente de Broto'},
  {id:'v31Heavy',x:18.5,y:7.7,type:'altar',v31:'heavy',label:'Placa de Contrapeso'},
  {id:'v31TinyGate',x:22,y:7,type:'door',v31:'smallGate',label:'Fenda nas Raízes'},
  {id:'v31Beetle',x:13.3,y:8.6,type:'seed',v31:'beetle',label:'Besouro de Ema'}
]};
rooms.galeriasInsetos={name:'Galerias dos Pequenos',subtitle:'Passagens impossíveis para passos grandes',floor:'#534431',dirt:'#78654c',night:true,
 blocks:[{x:.5,y:6.3,w:11.2,h:1.4,type:'rocks'},{x:12.3,y:6.3,w:11.2,h:1.4,type:'rocks'},
 {x:4,y:2,w:3,h:2,type:'rocks'},{x:17,y:2,w:2,h:2,type:'rocks'}],
 props:[{x:3,y:11,type:'dead'},{x:20,y:11,type:'dead'}],
 actors:[
  {id:'v31GalleryBack',x:1.6,y:10.5,type:'passage',v31:'galleryBack',label:'Voltar ao Jardim'},
  {id:'v31Bottleneck',x:11.98,y:5.55,type:'altar',v31:'hintGap',label:'Fresta das Formigas'},
  {id:'v31Sap',x:19.9,y:5,type:'altar',v31:'sap',label:'Pino da Seiva'},
  {id:'v31GalleryGate',x:22,y:3.1,type:'door',v31:'galleryGate',label:'Porta do Relicário'}
]};
rooms.relicarioMusgo={name:'Relicário do Musgo',subtitle:'As lembranças não cabem num único tamanho',floor:'#293c48',dirt:'#587166',night:true,
 blocks:[{x:3,y:2,w:3,h:2,type:'ruin'},{x:18,y:2,w:3,h:2,type:'ruin'},{x:10,y:11,w:4,h:2,type:'ruin'}],
 props:[{x:5,y:11,type:'dead'},{x:18,y:11,type:'tree'}],
 actors:[
  {id:'v31RelicBack',x:1.4,y:7,type:'passage',v31:'relicBack',label:'Voltar às Galerias'},
  {id:'v31Chronicle',x:7,y:5.3,type:'altar',v31:'chronicle',label:'Crônica das Três Formas'},
  {id:'v31RuneRoot',x:5.6,y:9.6,type:'altar',v31:'rune',label:'Marca da Raiz'},
  {id:'v31RuneDew',x:18.2,y:9.6,type:'altar',v31:'rune',label:'Marca da Gota'},
  {id:'v31RuneMoon',x:12,y:4.2,type:'altar',v31:'rune',label:'Marca da Estrela'},
  {id:'v31Warden',x:12,y:7.5,type:'npc',v31:'boss',label:'Guardião de Musgo'},
  {id:'v31Heart',x:20.7,y:5.5,type:'altar',v31:'heart',label:'Coração da Entrelinha'}
]};
rooms.bosqueEcos.actors.push({id:'v31Entrance',x:22,y:7,type:'door',v31:'entrance',label:'Jardim da Bruma · Capítulo II'});
Object.assign(EPIC_ENEMIES,{
 v31_guardiao:{name:'Guardião de Musgo',element:'earth',hp:110,atk:15,def:5,xp:175,gold:70,weak:'nature',
  sprite:'v31_guardiao_musgo_v24',intro:'O Guardião alterna entre a couraça de raiz e uma flor espectral. Leia suas intenções.',
  phases:[{title:'Couraça de Raízes',hp:110,element:'earth'},{title:'Flor da Memória',hp:85,element:'shadow'}]}
});
Object.assign(EPIC_ARTIFACTS,{
 broche_entrelinhas_v31:{name:'Broche das Entrelinhas',rarity:'Épico',element:'nature',
  desc:'Prova de quem aprendeu a observar as pequenas coisas. Reduz em 2 o dano recebido.',effect:'ward'}
});


/* V33.1/33.2 — Vale da Primeira Aurora: três mapas ligados por uma campanha real.
   Integra-se ao motor existente e mantém saves v12, moedas oficiais e RNG intactos. */
Object.assign(V24_BIOMES,{
 valeAurora:['#284c45','#456b53','#1e3631','#f7d390'],
 bibliotecaSubmersa:['#233c4d','#34556a','#1e2d41','#a9dbe9'],
 mirantePrimeiraLuz:['#454355','#71664c','#282e3c','#ffe7a3']
});
rooms.valeAurora={name:'Vale da Primeira Aurora',subtitle:'Crônica III · A Canção da Água',floor:'#284c45',dirt:'#5a795d',night:false,
 blocks:[{x:3,y:2,w:3,h:2,type:'rocks'},{x:18,y:2,w:3,h:2,type:'rocks'},{x:9,y:11,w:5,h:1,type:'ruin'}],
 props:[{x:4,y:10,type:'tree'},{x:8,y:3,type:'tree'},{x:16,y:10,type:'tree'},{x:20,y:4,type:'tree'}],
 actors:[
 {id:'v33Back',x:1.4,y:7,type:'passage',v33:'back',label:'Voltar à Vila'},
 {id:'v33Iara',x:7.2,y:6,type:'npc',v33:'iara',label:'Iara, Cartógrafa das Chuvas'},
 {id:'v33Nilo',x:15.4,y:9,type:'npc',v33:'nilo',label:'Nilo, Aprendiz do Rio'},
 {id:'v33EchoWind',x:4.7,y:5,type:'seed',v33:'echo',label:'Eco do Vento'},
 {id:'v33EchoRain',x:15,y:4.7,type:'seed',v33:'echo',label:'Eco da Chuva'},
 {id:'v33EchoRoot',x:20,y:9.5,type:'seed',v33:'echo',label:'Eco da Raiz'},
 {id:'v33RuneWind',x:6,y:10.5,type:'altar',v33:'rune',label:'Pedra do Vento'},
 {id:'v33RuneRain',x:12.2,y:6,type:'altar',v33:'rune',label:'Pedra da Chuva'},
 {id:'v33RuneRoot',x:19,y:6.5,type:'altar',v33:'rune',label:'Pedra da Raiz'},
 {id:'v33RiverGate',x:22.1,y:7,type:'door',v33:'riverGate',label:'Passagem da Biblioteca Submersa'},
 {id:'v33NiloSatchel',x:10.2,y:9.1,type:'seed',v33:'satchel',label:'Bolsa perdida de Nilo'}]};
rooms.bibliotecaSubmersa={name:'Biblioteca Submersa',subtitle:'Palavras escritas na correnteza',floor:'#233c4d',dirt:'#556b73',night:true,
 blocks:[{x:3,y:2,w:4,h:2,type:'ruin'},{x:17,y:2,w:4,h:2,type:'ruin'},{x:10,y:10,w:4,h:2,type:'rocks'}],
 props:[{x:6,y:10,type:'dead'},{x:19,y:10,type:'dead'}],
 actors:[
 {id:'v33LibraryBack',x:1.4,y:7,type:'passage',v33:'libraryBack',label:'Voltar ao Vale'},
 {id:'v33MemoryOne',x:7,y:5.4,type:'altar',v33:'memory',label:'Memória da Primeira Chuva'},
 {id:'v33MemoryTwo',x:17,y:6.2,type:'altar',v33:'memory',label:'Memória da Última Seca'},
 {id:'v33Librarian',x:10.8,y:8.7,type:'npc',v33:'librarian',label:'A Custódia das Páginas'},
 {id:'v33SummitGate',x:22,y:7,type:'door',v33:'summitGate',label:'Subida ao Mirante'}]};
rooms.mirantePrimeiraLuz={name:'Mirante da Primeira Luz',subtitle:'A origem de cada novo amanhecer',floor:'#454355',dirt:'#7b745b',night:true,
 blocks:[{x:3,y:2,w:4,h:2,type:'ruin'},{x:17,y:2,w:4,h:2,type:'ruin'}],
 props:[{x:5,y:10,type:'tree'},{x:18,y:11,type:'tree'}],
 actors:[
 {id:'v33SummitBack',x:1.4,y:7,type:'passage',v33:'summitBack',label:'Voltar à Biblioteca'},
 {id:'v33Warden',x:12,y:7,type:'npc',v33:'warden',label:'Sentinela do Primeiro Orvalho'},
 {id:'v33Choice',x:20,y:5.5,type:'altar',v33:'choice',label:'Fonte das Duas Promessas'}]};
rooms.vila.actors.push({id:'v33Entrance',x:22.2,y:6.4,type:'door',v33:'entrance',label:'Vale da Primeira Aurora · V33'});
Object.assign(EPIC_ENEMIES,{
 v33_sentinela:{name:'Sentinela do Primeiro Orvalho',element:'water',hp:98,atk:12,def:4,xp:160,gold:65,weak:'storm',
  sprite:'vulto_eco_v24',intro:'Duas correntes cercam a sentinela. Leia sua intenção e use a vantagem elemental.',
  phases:[{title:'Água em Torvelinho',hp:98,element:'water'},{title:'Memória Tempestuosa',hp:88,element:'storm'}]}
});
Object.assign(EPIC_ARTIFACTS,{
 medalhao_raiz_v33:{name:'Medalhão da Floresta Viva',rarity:'Épico',element:'nature',effect:'ward',desc:'Escolha do Vale: reduz em 2 o dano recebido quando equipado.'},
 medalhao_rio_v33:{name:'Medalhão do Rio Livre',rarity:'Épico',element:'water',effect:'regen',desc:'Escolha do Vale: recupera vida a cada turno quando equipado.'}
});

 const storageKey=()=>{const live=(typeof window.me==='string'&&window.me&&window.me!=='visitante')?window.me:null;const handle=live||localStorage.getItem('sg_handle')||'visitante';return 'sam_rpg_hibrido_v12_'+String(handle).toLowerCase()};
 const blank=()=>({map:'vila',x:11.7,y:10.8,found:[],unlocked:false,relic:false,bonus:false,altarActive:false,ritualStep:0,seen:[],journal:['O Guardião Bento espera por você na vila.'],visits:0,epic:freshEpic()});
 let accountRpgKey=storageKey();let st=blank();try{let raw=JSON.parse(localStorage.getItem(storageKey())||'null');if(raw&&rooms[raw.map]&&Number.isFinite(raw.x)&&Number.isFinite(raw.y))st={...blank(),...raw,found:Array.isArray(raw.found)?raw.found:[],seen:Array.isArray(raw.seen)?raw.seen:[],journal:Array.isArray(raw.journal)?raw.journal:[]}}catch(e){}
 st.epic={...freshEpic(),...(st.epic||{}),stats:{...freshEpic().stats,...(st.epic?.stats||{})},flags:{...(st.epic?.flags||{})},items:Array.isArray(st.epic?.items)?st.epic.items:['semente_guardia'],equipped:Array.isArray(st.epic?.equipped)?st.epic.equipped:['semente_guardia'],defeated:Array.isArray(st.epic?.defeated)?st.epic.defeated:[]};
 const v23Sprites=Object.fromEntries(['bento','livia','eldra','maira','amalia','tito'].map(name=>{const im=new Image();im.src='sprites/npc_'+name+'_v23.svg';return [name,im]}));
 const v23Trees=Object.fromEntries(['arvore_lunar','arvore_corrompida'].map(name=>{const im=new Image();im.src='sprites/'+name+'_v23.svg';return [name,im]}));
 const v24Trees=Object.fromEntries(['arvore_saudavel','arvore_danificada','arvore_destruida'].map(name=>{const im=new Image();im.src='sprites/'+name+'_v24.svg';return [name,im]}));
 const imgCache=new Map();const sprite=name=>{if(!imgCache.has(name)){const i=new Image();i.src='sprites/'+name+((name==='aranha_rainha_v14'||name.endsWith('_v24'))?'.svg':'.png');imgCache.set(name,i)}return imgCache.get(name)};
 const player={x:st.x,y:st.y,vx:0,vy:0};let nextSave=0,last=0,clock=0,visible=false,touchDest=null,dialogOpen=false,lastTip='';
 const room=()=>rooms[st.map];

 // V23 · Contratos de Vila. Apenas sementes da economia LOCAL, jamais XP ou mangas do ranking.
 const v23DailyDefs=[
  {id:'bento',name:'Saudações ao Guardião',desc:'Converse com Bento hoje.',reward:25},
  {id:'forest',name:'Passos na Trilha',desc:'Visite a Trilha Encantada hoje.',reward:35},
  {id:'victory',name:'Vigília do Pomar',desc:'Vença uma batalha da campanha hoje.',reward:65}
 ];
 function v23Day(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
 function v23DailyKey(){return 'sam23_vila_contratos_'+storageKey()}
 function v23DailyRead(){
  const day=v23Day();
  try{const raw=JSON.parse(localStorage.getItem(v23DailyKey())||'null');
   if(raw?.day===day&&Array.isArray(raw.marks)&&Array.isArray(raw.claimed))
    return {day,marks:raw.marks.filter(id=>v23DailyDefs.some(q=>q.id===id)),claimed:raw.claimed.filter(id=>v23DailyDefs.some(q=>q.id===id))};
  }catch(_){}
  return {day,marks:[],claimed:[]};
 }
 let v23Daily=v23DailyRead();
 function v23DailySave(){try{localStorage.setItem(v23DailyKey(),JSON.stringify(v23Daily));return true}catch(_){notify('Salvamento local indisponível. O contrato não pode ser reivindicado.');return false}}
 function v23DailyRefresh(){if(v23Daily.day!==v23Day())v23Daily=v23DailyRead()}
 function v23DailyMark(id){
  if(!v23DailyDefs.some(q=>q.id===id))return;
  v23DailyRefresh();if(v23Daily.marks.includes(id))return;
  v23Daily.marks.push(id);v23DailySave();v23DailyRender();
 }
 function v23DailyClaim(id){
  v23DailyRefresh();const item=v23DailyDefs.find(q=>q.id===id);
  if(!item||!v23Daily.marks.includes(id)||v23Daily.claimed.includes(id))return;
  v23Daily.claimed.push(id);
  if(!v23DailySave()){v23Daily.claimed.pop();return}
  if(!gainLocalSeeds(item.reward)){notify('Economia local indisponível: contrato reservado neste aparelho.');return}
  notify('🌱 Contrato cumprido: +'+item.reward+' sementes locais!');
  v23DailyRender();
 }
 function v23DailyRender(){
  const list=$('r23Contracts');if(!list)return;
  v23DailyRefresh();
  list.replaceChildren();
  for(const q of v23DailyDefs){
    const done=v23Daily.marks.includes(q.id),claimed=v23Daily.claimed.includes(q.id);
    const li=document.createElement('div');li.className='r23-contract'+(claimed?' claimed':'');
    const text=document.createElement('div');const name=document.createElement('strong');name.textContent=q.name;
    const desc=document.createElement('small');desc.textContent=q.desc+' · 🌱 '+q.reward+' sementes locais';
    text.append(name,desc);
    const btn=document.createElement('button');btn.type='button';btn.disabled=!done||claimed;
    btn.textContent=claimed?'✓ Recebido':done?'Resgatar':'Pendente';
    btn.addEventListener('click',()=>v23DailyClaim(q.id));
    li.append(text,btn);list.append(li);
  }
 }
 const v23MoodOptions=new Set(['clear','mist','stars']);
 const v23MoodKey=()=> 'sam23_mood_'+storageKey();
 function v23MoodRead(){try{const x=localStorage.getItem(v23MoodKey());return v23MoodOptions.has(x)?x:'clear'}catch(_){return 'clear'}}
 let v23Mood=v23MoodRead();
 function v23MoodSet(m){
  if(!v23MoodOptions.has(m))return;
  v23Mood=m;try{localStorage.setItem(v23MoodKey(),m)}catch(_){}
  document.querySelectorAll('[data-r23-mood]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.r23Mood===m)));
  const label=$('r23MoodStatus');if(label)label.textContent='Atmosfera: '+({clear:'amanhecer',mist:'névoa',stars:'noite estrelada'}[m]);
 }
 $('r23MoodChoices')?.addEventListener('click',e=>{const b=e.target.closest('[data-r23-mood]');if(b)v23MoodSet(b.dataset.r23Mood)});
 function v23Atmosphere(){
  if(v23Mood==='clear')return;
  const low=matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('sm165-lowfx');
  ctx.save();
  if(v23Mood==='mist'){
    ctx.fillStyle='#c3d7d51b';ctx.fillRect(0,0,W,H);
    for(let i=0;i<(low?4:14);i++){
      const x=(i*83+(low?0:clock*6))%(W+120)-60,y=(i*63)%H;
      ctx.fillStyle='#d5fbf71d';ctx.fillRect(x,y,84,9);
    }
  }else{
    ctx.fillStyle='#0c133a69';ctx.fillRect(0,0,W,H);
    for(let i=0;i<(low?9:32);i++){
      const x=(i*137)%W,y=(i*67)%H;
      ctx.globalAlpha=low?.45:.30+.23*Math.sin(clock*1.5+i)**2;
      ctx.fillStyle=i%3===0?'#f7daa9':'#bddfff';ctx.fillRect(x,y,2+i%2,2+i%2);
    }
  }
  ctx.restore();
 }
 function v23NpcRoutine(){
  if(st.map!=='vila'&&st.map!=='estufa')return;
  for(const a of room().actors){
    if(!['guarda','livia','oldAmalia','alchemist','maira'].includes(a.id))continue;
    if(!Number.isFinite(a.originX)){a.originX=a.x;a.originY=a.y}
    const low=matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('sm165-lowfx');
    // Fixed center means NPC never walks off the mapped interaction target.
    a.x=a.originX+(low?0:.22*Math.sin(clock*.6+a.originX));
    a.y=a.originY+(low?0:.10*Math.sin(clock*.45+a.originY));
  }
 }
 window.Sam23World=Object.freeze({
  snapshot:()=>({map:st.map,x:player.x,y:player.y,scene:v23Mood,guide:guideKey,seenBento:st.seen.includes('guarda'),
    contracts:v23DailyDefs.map(q=>({id:q.id,completed:v23Daily.marks.includes(q.id),claimed:v23Daily.claimed.includes(q.id)}))})
 });
 v23MoodSet(v23Mood);v23DailyRender();

 // V23 · guia de destinos ancorado nas posições reais dos atores. Não teleporta nem altera missões.
 const guide={
  guardiao:{label:'Guardião Bento',map:'vila',id:'guarda'},
  casa:{label:'Seu Refúgio',map:'vila',id:'profile'},
  defesa:{label:'Arena de Defesa',map:'vila',id:'defesa'},
  praca:{label:'Praça Ao Vivo',map:'vila',id:'praca'},
  floresta:{label:'Trilha Encantada',map:'vila',id:'forest'},
  quadro:{label:'Quadro de Contratos',map:'vila',id:'guildBoard'}
 };
 let guideKey='guardiao';
 function guideTarget(){const item=guide[guideKey];return item?{...item,actor:rooms[item.map]?.actors.find(a=>a.id===item.id)}:null}
 function guideUI(){
  const el=$('r23GuideText'),target=guideTarget();
  if(!el||!target)return;
  const reach=target.map===st.map&&target.actor;
  const steps=reach?Math.ceil(Math.hypot(player.x-target.actor.x,player.y-target.actor.y)):null;
  const next=reach?'Destino: '+target.label+' · '+steps+' passos':'Destino: '+target.label+' · retorne à Vila da Mangueira';
  if(el.textContent!==next)el.textContent=next;
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
  $('r12Region').textContent=room().subtitle;renderEpicUI();v29RenderUI();v30RenderUI();v31RenderUI();
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
 function warp(dest,x,y){if(!rooms[dest])return;if(!v31Rooms.has(dest))v31State().small=false;if(dest==='floresta')v23DailyMark('forest');window.SamMusic?.scene(v30SceneForRoom(dest));st.map=dest;player.x=x;player.y=y;touchDest=null;save();update();notify('Você entrou em '+room().name+'.')}
 function pane(dest){save();window.SamMusic?.scene(dest==='eventDlg'?'shadows':'explore');if(typeof window.showPane==='function')window.showPane(dest)}
 function toShop(){openV24Shop()}
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
function maxHealth(){return classInfo().hp+(epic().level-1)*4+epic().stats.vig*3+(hasEffect('vigor')?12:0)+(hasEffect('royal')?20:0)+(hasEffect('bloom')?10:0)}
function maxMana(){return classInfo().mp+epic().stats.int+Math.floor(epic().level/2)+(hasEffect('resonance')?3:0)}
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
 larva:'larva',spider:'rainha',crystalBoss:'besouro',collector:'espectro',moonGuardian:'sentinela',finalKing:'rei',v24MeadowWolf:'lobo_vento',v24GrottoWisp:'vulto_eco',v29Mariposa:'v29_silencio',v29Sentinela:'v29_sentinela'
};
/* V29 · CRÔNICAS VIVAS — trilha narrativa jogável, pistas e recompensas únicas.
   Salva tudo no mesmo epic.v29; rankings, Supabase e a campanha principal não mudam. */
/* V30.2 — Root prologue: authored cinematic scenes + interactive three-stone environment.
   All milestones are stored under the existing local save's epic.v30. */
/* V30.3 — Three environmental chimes, a story NPC, optional recovery and a boss. */

/* V31 · Passagens em escala, enigmas que alternam tamanho, chefe em duas fases e diário salvo. */
const v31Rooms=new Set(['jardimBruma','galeriasInsetos','relicarioMusgo']);
const v31Ingredients=['v31Dew','v31Bark','v31Pollen'];
const v31RuneOrder=['v31RuneRoot','v31RuneDew','v31RuneMoon'];
function v31State(){
 const e=epic();if(!e.v31||typeof e.v31!=='object'||Array.isArray(e.v31))e.v31={};
 const c=e.v31;
 if(!Array.isArray(c.ingredients))c.ingredients=[];
 c.ingredients=c.ingredients.filter(id=>v31Ingredients.includes(id));
 if(!Number.isInteger(c.runes)||c.runes<0||c.runes>3)c.runes=0;
 if(!Number.isInteger(c.errors)||c.errors<0)c.errors=0;
 return c;
}
function v31Objective(){
 const c=v31State();
 if(!v303State().finished)return 'Restaure o Mural do Bosque dos Ecos para alcançar o Jardim.';
 if(!c.metEma)return 'Encontre Ema no Jardim da Bruma e ouça sua proposta.';
 if(!c.lens)return 'Reúna Orvalho, Casca e Pólen ('+c.ingredients.length+'/3) e teça uma Lente de Broto.';
 if(!c.heavy)return 'Em tamanho normal, pressione a placa a leste do Jardim.';
 if(!c.sap)return 'Encolha com Q ou o botão BROTO. Atravesse a fresta estreita nas Galerias e gire o Pino da Seiva.';
 if(c.runes<3)return 'Relicário: Raiz (grande) → Gota (pequeno) → Estrela (grande) · '+c.runes+'/3.';
 if(!c.bossWon)return 'Enfrente o Guardião de Musgo. Observe as duas fases e DEFENDA-se de golpes carregados.';
 if(!c.finished)return 'Leia o Coração da Entrelinha para receber seu broche.';
 return 'Capítulo II concluído! Explore o mundo e encontre o besouro perdido de Ema.';
}
function v31ActorVisible(a){
 const c=v31State();
 if(a.v31==='entrance')return !!v303State().finished;
 if(a.v31==='ingredient')return !c.ingredients.includes(a.id);
 if(a.v31==='beetle')return !c.bugFound;
 if(a.v31==='boss')return c.runes===3&&!c.bossWon;
 if(a.v31==='heart')return !!c.bossWon;
 return true;
}
function v31TinyCanGrow(){
 return !room().blocks.some(b=>player.x+.35>b.x&&player.x-.35<b.x+b.w&&player.y+.35>b.y&&player.y-.35<b.y+b.h);
}
function v31Toggle(){
 const c=v31State();
 if(!v31Rooms.has(st.map)){notify('A Lente de Broto só responde nos jardins das entrelinhas.');return false}
 if(!c.lens){notify('Construa a Lente de Broto com Ema primeiro.');return false}
 if(c.small&&!v31TinyCanGrow()){notify('A passagem é estreita demais para crescer aqui. Procure um espaço livre.');return false}
 c.small=!c.small;
 window.SamMusic?.effect('magic');
 notify(c.small?'Modo Broto: você ficou pequeno e atravessa frestas.':'Tamanho normal: você pode acionar placas pesadas.');
 save();update();return true;
}
function v31Finish(){
 const c=v31State();if(c.finished)return;
 c.finished=true;c.small=false;
 epic().gold+=90;giveXP(180);ownItem('broche_entrelinhas_v31');
 log('Capítulo II · O Guardião finalmente compartilhou sua lembrança: o Pomar também pertence às vozes pequenas.');
 notify('Capítulo II concluído: +180 XP, +90 moedas RPG e Broche das Entrelinhas.');
 save();update();
}
function v31Rune(a){
 const c=v31State();if(c.runes===3){say('Relicário','As três inscrições estão em harmonia.');return}
 if(!c.chronicle){say('Inscrição Oculta','Leia a Crônica das Três Formas para descobrir a sequência.');return}
 const wanted=v31RuneOrder[c.runes];
 const smallNeeded=c.runes===1;
 if(a.id!==wanted){
  c.runes=0;c.errors++;save();update();
  say('Ressonância Quebrada','A ordem é Raiz, Gota, Estrela. A Raiz e a Estrela precisam de peso; o orvalho de delicadeza.');return;
 }
 if(!!c.small!==smallNeeded){
  say('Marca Silenciosa',smallNeeded?'Você precisa ficar pequeno para tocar a gota sem derramá-la.':'O símbolo é pesado: volte ao tamanho normal para ativá-lo.');return;
 }
 c.runes++;
 window.SamMusic?.effect('magic');
 log('Entrelinhas · '+a.label+' respondeu à sua escolha de tamanho.');
 save();update();
 say(a.label,c.runes===3?'O Guardião de Musgo desperta no salão central.':'A marca ressoou. Próxima etapa: '+(c.runes===1?'Gota, em tamanho pequeno.':'Estrela, em tamanho normal.'));
}
function v31Interact(a){
 const c=v31State();
 if(a.v31==='entrance'){if(!v303State().finished){say('Passagem Lacrada','Conclua o Mural dos Ecos antes de prosseguir.');return}warp('jardimBruma',2.8,7);return}
 if(a.v31==='back'){c.small=false;warp('bosqueEcos',20,7);return}
 if(a.v31==='galleryBack'){warp('jardimBruma',20.4,7);return}
 if(a.v31==='relicBack'){warp('galeriasInsetos',20.3,4.5);return}
 if(a.v31==='ema'){
  if(!c.metEma){c.metEma=true;log('Ema contou que caminhos antigos são visíveis apenas a quem muda a perspectiva.');save();update();
   say('Ema, Tecelã das Raízes','O Pomar não acaba onde seus passos cabem. Traga Orvalho, Casca e Pólen ao tear; farei uma lente que altera seu tamanho.');return}
  if(c.bugFound&&!c.bugReturned){c.bugReturned=true;epic().potions+=2;giveXP(40);log('Devolvi o besouro a Ema.');save();update();say('Ema','Você o trouxe de volta! Guarde estas duas poções.');return}
  say('Ema',c.lens?'Pressione Q ou BROTO para alternar o tamanho. Cresça para erguer pedras, encolha para cruzar frestas.':'Orvalho, Casca e Pólen — os três fios do Tear.');return;
 }
 if(a.v31==='ingredient'){
  if(c.ingredients.includes(a.id))return;
  c.ingredients.push(a.id);log('Ingrediente encontrado: '+a.label+'.');save();update();
  say(a.label,'Você guardou '+c.ingredients.length+'/3 ingredientes da Lente de Broto.');return;
 }
 if(a.v31==='beetle'){if(c.bugFound)return;c.bugFound=true;log('Encontrei o besouro de Ema perto do tear.');save();update();say('Besouro Dourado','Ele repousa em sua mão. Ema deve estar procurando por ele.');return}
 if(a.v31==='lens'){
  if(c.lens){say('Tear de Broto','A lente vibra ao perceber a diferença entre seus passos. Use Q ou BROTO para alternar.');return}
  if(!c.metEma){say('Tear de Broto','Converse com Ema antes de usar o tear.');return}
  if(c.ingredients.length!==3){say('Tear de Broto','Faltam '+(3-c.ingredients.length)+' ingredientes para tecer a lente.');return}
  c.lens=true;log('Tecemos a Lente de Broto! Agora posso alternar a escala com Q.');save();update();
  say('Lente de Broto','A lente está pronta. Em tamanho pequeno você passa por fendas estreitas; grande, consegue ativar placas pesadas.');return;
 }
 if(a.v31==='heavy'){
  if(!c.lens){say('Placa de Contrapeso','Sem a lente, é difícil entender o mecanismo.');return}
  if(c.small){say('Placa de Contrapeso','Seu peso é pequeno demais. Cresça e tente novamente.');return}
  if(!c.heavy){c.heavy=true;log('Acionei a placa: a fenda a leste brilhou.');save();update()}
  say('Placa Ativada','Um portão sob a folhagem se abriu para alguém do tamanho de um broto.');return;
 }
 if(a.v31==='smallGate'){
  if(!c.lens||!c.heavy){say('Fenda das Raízes','A placa do Jardim ainda não abriu a passagem.');return}
  if(!c.small){say('Fenda das Raízes','O túnel é estreito demais. Use Q ou BROTO para diminuir.');return}
  warp('galeriasInsetos',2.8,10.5);return;
 }
 if(a.v31==='hintGap'){say('Fresta das Formigas','Há apenas meia telha entre as duas rochas. Um corpo grande não passa; uma Lente de Broto pode ajudar.');return}
 if(a.v31==='sap'){
  if(!c.small){say('Pino da Seiva','O pino é delicado demais para mãos grandes. Encolha.');return}
  if(!c.sap){c.sap=true;log('O Pino da Seiva mudou o curso das raízes e abriu o Relicário.');save();update()}
  say('Pino da Seiva','A seiva percorre os relevos da pedra. Uma porta se abriu no alto do corredor.');return;
 }
 if(a.v31==='galleryGate'){
  if(!c.sap){say('Porta do Relicário','A seiva precisa atravessar o pino além da fresta.');return}
  warp('relicarioMusgo',2.8,7);return;
 }
 if(a.v31==='chronicle'){
  c.chronicle=true;save();update();
  say('Crônica das Três Formas','“Primeiro a RAIZ sustenta o caminho com seu peso. Depois a GOTA o alimenta sem fazer ruído. Por fim a ESTRELA revela seu nome.” Use o tamanho certo para cada marca.');return;
 }
 if(a.v31==='rune'){v31Rune(a);return}
 if(a.v31==='boss'){
  if(c.runes!==3){say('Guardião de Musgo','O selo ainda guarda seus dois nomes.');return}
  if(c.bossWon){say('Guardião de Musgo','O velho guardião finalmente repousa.');return}
  startCombat('v31_guardiao','v31Warden');return;
 }
 if(a.v31==='heart'){
  if(!c.bossWon){say('Coração Velado','O Guardião ainda protege a pedra.');return}
  if(!c.finished){v31Finish();say('Coração da Entrelinha','O reino dos pequenos não era invisível. O resto do Pomar é que desaprendeu a olhar. Sua próxima viagem começa além das raízes.');}
  else say('Coração da Entrelinha','As raízes menores sustentam até a maior das árvores.');return;
 }
}
function v31Decor(){
 if(!v31Rooms.has(st.map))return;
 const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
 ctx.save();ctx.imageSmoothingEnabled=false;
 for(let i=0;i<34;i++){
  const x=((i*79+23)%(COLS*T)),y=((i*53+41)%(ROWS*T));
  const wobble=still?0:Math.sin(clock*1.8+i)*3;
  const petals=i%3===0?'#f3ce87':i%3===1?'#c49dc1':'#9acdb8';
  rect(x-2,y+8,3,12,'#4f886b');
  rect(x-7,y+wobble,14,7,petals);rect(x-3,y-4+wobble,6,15,petals);
  rect(x-2,y+2+wobble,4,4,'#f8e9b3');
 }
 if(st.map==='galeriasInsetos'){
  for(let i=0;i<13;i++){const x=i*59+7,y=10+i%3*140;
   rect(x,y,5,24,'#9b8052');rect(x-3,y-6,10,8,'#d2b878');}
  // Narrow bottleneck: actual solid blocks use a 0.6-tile opening.
  rect(11.7*T,6.3*T,0.6*T,1.4*T,'#a98d4d25');
 }
 if(st.map==='relicarioMusgo'){
  for(let i=0;i<8;i++){
   const x=32+i*97,y=48+(i%4)*91;rect(x,y,28,3,'#b7aa86');rect(x+6,y-8,3,22,'#779c87');
  }
 }
 ctx.restore();
}
function v31DrawActor(a,x,y,bob){
 const c=v31State(),still=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const float=still?0:bob;
 ctx.save();ctx.imageSmoothingEnabled=false;
 ctx.fillStyle='#071d25a0';ctx.fillRect(x-16,y+16,32,5);
 const kind=a.v31;
 if(kind==='ema'){
  drawCharacter(x,y-4+float,'#6a9484','#e8c7a6',false);
  rect(x-8,y-33+float,16,7,'#cdb47a');rect(x-15,y-37+float,30,5,'#6a946a');
  rect(x+15,y-22+float,4,27,'#bbd99a');
 }else if(kind==='ingredient'||kind==='beetle'){
  const color=kind==='beetle'?'#ffe08a':a.id==='v31Dew'?'#9ae9dd':a.id==='v31Bark'?'#bf9573':'#f7c9e2';
  ctx.shadowColor=color;ctx.shadowBlur=7;
  rect(x-9,y-13+float,18,18,color);rect(x-3,y-18+float,6,6,'#fff2bb');ctx.shadowBlur=0;
 }else if(kind==='boss'){
  rect(x-16,y-26,32,45,'#435d4b');rect(x-13,y-38,26,20,'#628a62');
  rect(x-10,y-30,5,5,'#f3d79a');rect(x+5,y-30,5,5,'#f3d79a');
  rect(x-22,y-8,9,20,'#4f7750');rect(x+13,y-8,9,20,'#4f7750');
 }else if(kind==='smallGate'||kind==='galleryGate'||kind==='entrance'){
  rect(x-16,y-28,32,45,'#47645a');rect(x-12,y-24,24,38,'#1e3938');
  rect(x-9,y-18,18,7,c.small?'#f7e1a5':'#abd8b0');rect(x-4,y-9,8,17,'#d2b67b');
 }else if(kind==='rune'||kind==='heavy'||kind==='sap'||kind==='heart'||kind==='lens'||kind==='chronicle'||kind==='hintGap'){
  rect(x-19,y-10,38,24,'#5b6e6b');rect(x-16,y-19,32,13,'#99a395');
  const symbol=kind==='rune'?(a.id==='v31RuneRoot'?'♣':a.id==='v31RuneDew'?'≈':'✦'):
   kind==='heavy'?'⬟':kind==='lens'?'◇':kind==='heart'?'✹':'✧';
  drawGlyph(x,y-26+float,symbol,'#ffe7aa');
 }else{
  ctx.strokeStyle='#bcdfb4';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y-4,18,12,0,0,Math.PI*2);ctx.stroke();
  drawGlyph(x,y-23,'↩','#d8eeba');
 }
 ctx.restore();
}
function v31Setup(){
 const aside=document.querySelector('#rpgDlg .r12-aside'),controls=document.querySelector('#rpgDlg .r12-controls');
 if(!aside||!controls||document.getElementById('v31Card'))return;
 const card=document.createElement('section');card.id='v31Card';card.className='r12-card sm31-quest-card';
 card.innerHTML='<span class="sm31-eyebrow">NOVA AVENTURA · CAPÍTULO II</span><h3>🌿 O Jardim das Entrelinhas</h3>'+
  '<p id="v31Task" aria-live="polite"></p><div class="sm31-track"><span id="v31Track"></span></div>'+
  '<p id="v31Status"></p><button type="button" id="v31SizeButton">◇ Ativar Modo Broto · Q</button>';
 aside.prepend(card);
 const mobile=document.createElement('button');mobile.type='button';mobile.id='v31MobileBroto';mobile.className='r12-interact sm31-mobile-toggle';
 mobile.textContent='◇ BROTO (Q)';mobile.setAttribute('aria-label','Alternar entre tamanho normal e tamanho pequeno');
 controls.append(mobile);
 for(const id of ['v31SizeButton','v31MobileBroto'])document.getElementById(id).addEventListener('click',v31Toggle);
}
function v31RenderUI(){
 const card=document.getElementById('v31Card');if(!card)return;
 const c=v31State(),active=v31Rooms.has(st.map),unlocked=v303State().finished;
 const steps=[!!c.metEma,c.ingredients.length===3,!!c.lens,!!c.heavy,!!c.sap,c.runes===3,!!c.bossWon,!!c.finished];
 document.getElementById('v31Task').textContent=v31Objective();
 document.getElementById('v31Status').textContent=steps.filter(Boolean).length+'/8 marcos · '+(c.small?'TAMANHO PEQUENO':'tamanho normal')+' · '+(c.errors||0)+' tentativas refeitas';
 document.getElementById('v31Track').style.width=(steps.filter(Boolean).length/8*100)+'%';
 card.classList.toggle('sm31-unlocked',unlocked);
 for(const id of ['v31SizeButton','v31MobileBroto']){
  const button=document.getElementById(id);if(!button)continue;
  button.disabled=!c.lens||!active;
  button.setAttribute('aria-pressed',String(!!c.small));
  button.textContent=c.small?'↟ CRESCER · Q':'◇ MODO BROTO · Q';
 }
}

function v303State(){
 const q=v30State();
 if(!q.chapter1||typeof q.chapter1!=='object')q.chapter1={};
 const c=q.chapter1;
 if(!Number.isInteger(c.chimes)||c.chimes<0||c.chimes>3)c.chimes=0;
 if(!Number.isInteger(c.errors)||c.errors<0)c.errors=0;
 return c;
}
function v303Objective(){
 const c=v303State(),q=v30State();
 if(!q.completed)return 'Conclua as três inscrições no Átrio das Raízes.';
 if(!c.metAyla)return 'Atravesse o Átrio e encontre Ayla no Bosque dos Ecos.';
 if(c.chimes<3)return 'Escute os sinos na ordem Chuva → Terra → Vento ('+c.chimes+'/3).';
 if(!c.bossWon)return 'Enfrente a Sentinela do Silêncio. Observe o golpe carregado a cada três turnos.';
 if(!c.mural)return 'Leia o Mural das Primeiras Vozes e descubra a origem do silêncio.';
 return 'Capítulo I concluído! Explore o Bosque e complete a missão opcional de Ayla.';
}
function v303ActorVisible(a){
 const c=v303State(),q=v30State();
 if(a.v30==='groveGate')return !!q.completed;
 if(a.v30==='chime')return !!c.metAyla&&!c.bossWon;
 if(a.v30==='sentinel')return c.chimes===3&&!c.bossWon;
 if(a.v30==='mural')return !!c.bossWon;
 return true;
}
function v303Finish(){
 const c=v303State();if(c.finished)return;
 c.finished=true;epic().gold+=55;giveXP(115);
 ownItem('selo_dos_ecos_v303');
 log('V30.3 · O Mural revelou que os primeiros sinos foram construídos para que nenhuma voz desaparecesse.');
 notify('Capítulo I concluído! +115 XP, +55 moedas e Selo dos Ecos.');
 save();update();
}
function v303Chime(a){
 const c=v303State(),order=['v303ChimeRain','v303ChimeEarth','v303ChimeWind'];
 if(!c.metAyla){say('Sino Antigo','Ayla conhece a melodia que abre o bosque.');return}
 if(a.id===order[c.chimes]){
  c.chimes++;
  window.SamMusic?.effect('magic');
  log('V30.3 · '+a.label+' tocou a nota correta.');
  say('Sino Desperto',c.chimes===3?
   'Três notas atravessam o bosque. A Sentinela do Silêncio acorda no círculo central.':
   'A floresta respondeu à sua nota. Continue a sequência ('+c.chimes+'/3).');
 }else{
  c.chimes=0;c.errors++;
  say('Melodia Interrompida','As notas se dispersam. Ayla contou a sequência: primeiro a chuva cai, depois a terra recebe e finalmente o vento espalha.');
 }
 save();update();
}
function v303Interact(a){
 const c=v303State();
 if(a.v30==='groveGate'){warp('bosqueEcos',2.8,7);return}
 if(a.v30==='backGrove'){warp('atrioRaizes',20.5,7);return}
 if(a.v30==='ayla'){
  if(!c.metAyla){
   c.metAyla=true;
   log('V30.3 · Ayla pediu que eu restaurasse a melodia dos três sinos.');
   save();update();
   v30Cutscene('grove',()=>notify('Nova missão: encontre os sinos da Chuva, Terra e Vento.'));
  }else if(c.bossWon&&!c.supplyReturned){
   if(c.supply){
    c.supplyReturned=true;epic().potions+=2;giveXP(45);
    log('V30.3 · Devolvi a bolsa de sementes a Ayla.');
    save();update();
    say('Ayla, Guardiã dos Ecos','Você encontrou minhas sementes! Duas poções e a gratidão do bosque são suas.');
   }else say('Ayla, Guardiã dos Ecos','O silêncio recuou, mas minha bolsa de sementes ficou perto da passagem de pedra. Você poderia procurá-la?');
  }else say('Ayla, Guardiã dos Ecos',c.bossWon?
   'As raízes voltaram a cantar. Leia o mural e leve adiante o que aprendeu.':
   'Primeiro a chuva cai, depois a terra recebe e por último o vento espalha. A Sentinela tem medo da luz.');
  return;
 }
 if(a.v30==='chime'){v303Chime(a);return}
 if(a.v30==='marker'){
  say('Marco das Três Canções','A melodia foi gravada em versos: “Chuva que desperta, Terra que acolhe, Vento que leva.”');return;
 }
 if(a.v30==='sentinel'){
  if(c.chimes!==3){say('Sentinela Adormecida','Os sinos ainda não se alinharam.');return}
  if(c.bossWon){say('Sentinela Serena','O silêncio já não impede as vozes de atravessar o bosque.');return}
  startCombat('v303_sentinela','v303Sentinel');return;
 }
 if(a.v30==='mural'){
  if(!c.bossWon){say('Mural Selado','Uma sombra ainda cobre a inscrição.');return}
  if(!c.mural){
   c.mural=true;save();update();
   v30Cutscene('groveEnding',v303Finish);
  }else if(!c.finished)v30Cutscene('groveEnding',v303Finish);
  else say('Mural das Primeiras Vozes','O bosque guarda a promessa de nunca silenciar quem precisa ser ouvido.');
  return;
 }
 if(a.v30==='supply'){
  if(c.supply){say('Bolsa de Ayla','Você já guardou a bolsa para devolver à guardiã.');return}
  c.supply=true;log('V30.3 · Encontrei a bolsa de sementes de Ayla.');save();update();
  say('Bolsa de Sementes','Há sementes de três cores e o nome de Ayla bordado na alça.');return;
 }
}
function v30State(){
 const e=epic();
 if(!e.v30||typeof e.v30!=='object'||Array.isArray(e.v30))e.v30={};
 const q=e.v30;
 if(!Array.isArray(q.records))q.records=[];
 if(!Number.isInteger(q.sequence)||q.sequence<0||q.sequence>3)q.sequence=0;
 if(!Number.isInteger(q.mistakes)||q.mistakes<0)q.mistakes=0;
 return q;
}
function v30SceneForRoom(where){
 if(where==='vila')return 'village';
 if(where==='floresta'||where==='planicie'||where==='estufa')return 'forest';
 if(where==='atrioRaizes'||where==='ruinas'||where==='mina'||where==='gruta')return 'temple';
 if(where==='bosque'||where==='bosqueEcos'||where==='pantano'||where==='coracao')return 'mystery';
 if(v31Rooms.has(where))return 'mystery';
 if(where==='observatorio')return 'shadows';
 return 'explore';
}
function v30Objective(){
 const q=v30State();
 if(!q.started)return 'Procure a Raiz que Canta perto da Praça da Vila e descubra por que os mapas mudaram.';
 if(!q.discovered)return 'Encontre a Fissura das Lembranças no caminho central da Floresta.';
 if(q.sequence<3)return 'Ative as três pedras da Floresta na ordem Semente → Água → Luz ('+q.sequence+'/3).';
 if(!q.opened)return 'Volte à Passagem das Raízes, a sudeste da Floresta, e abra o caminho oculto.';
 if(!q.completed)return 'Explore o Átrio das Raízes e investigue suas três inscrições ('+q.records.length+'/3).';
 return v31Objective();
}
function v30ActorVisible(a){
 const q=v30State();
 if(a.v30==='intro')return true;
 if(a.v30==='vision')return !!q.started;
 if(a.v30==='stone')return !!q.discovered&&!q.opened;
 if(a.v30==='gate')return !!q.started;
 if(a.v30==='record')return !q.records.includes(a.id)||(q.records.length===3&&!q.completed);
 return true;
}
function v30Cutscene(name,onFinish){
 if(window.SamCutscenes?.play(name,{onFinish}))return;
 say('Uma visão das Raízes','A história continua no Livro das Crônicas.',onFinish,'Continuar a aventura');
}
function v30DoneIntro(){
 const q=v30State();if(q.started)return;
 q.started=true;
 log('V30 · A Raiz que Canta mostrou a nova ligação entre a Vila e a Floresta.');
 save();update();
 notify('Prólogo V30 iniciado. Investigue a Fissura das Lembranças na Floresta.');
}
function v30DoneVision(){
 const q=v30State();if(q.discovered)return;
 q.discovered=true;q.sequence=0;
 log('V30 · A Fissura contou a ordem de crescimento: Semente, Água e Luz.');
 save();update();
 notify('Três Pedras da Floresta despertaram!');
}
function v30DoneGate(){
 const q=v30State();if(!q.opened){
  q.opened=true;epic().gold+=25;giveXP(40);
  log('V30 · A Passagem das Raízes foi restaurada. Um Átrio oculto se abriu.');
  notify('Passagem aberta! +40 XP e +25 moedas RPG.');
  save();update();
 }
 warp('atrioRaizes',2.8,7);
}
function v30DoneArchive(){
 const q=v30State();if(q.completed)return;
 q.completed=true;epic().gold+=40;giveXP(80);
 ownItem('pingente_primeira_raiz_v30');
 log('V30 · As inscrições recuperaram o Juramento dos Primeiros Cuidadores.');
 notify('Prólogo V30 concluído! +80 XP, +40 moedas e Pingente da Primeira Raiz.');
 save();update();
}
function v30Stone(a){
 const q=v30State();
 if(!q.discovered){say('Pedra Antiga','As inscrições estão adormecidas. Investigue primeiro a Fissura na Floresta.');return}
 const seq=['v30StoneSeed','v30StoneWater','v30StoneLight'],index=q.sequence;
 if(q.opened){say('Pedra Antiga','A passagem já está aberta. O símbolo continua brilhando em sua lembrança.');return}
 if(a.id===seq[index]){
  q.sequence++;
  window.SamMusic?.effect('magic');
  log('V30 · A pedra '+a.label+' respondeu à melodia das raízes.');
  if(q.sequence===3)say('Três Pedras Despertas','As inscrições se unem num feixe verde e abrem a passagem no sudeste da Floresta.');
  else say('Pedra Desperta','Você ouviu a nota correta ('+q.sequence+'/3). Siga a ordem ensinada pela Fissura.');
 }else{
  q.sequence=0;q.mistakes++;
  say('Ressonância Interrompida','As luzes se apagaram, mas você pode recomeçar sem perder o restante da aventura. A ordem é aquela que faz uma planta crescer.');
 }
 save();update();
}
function v30Record(a){
 const q=v30State();
 if(q.records.includes(a.id)){if(q.records.length===3&&!q.completed)v30Cutscene('archive',v30DoneArchive);else say('Inscrição Lida','Este registro já entrou no seu diário.');return}
 const texts={
  v30RecordPath:'O caminho que une aldeias pertence a quem precisa atravessá-lo, não ao primeiro que encontrou sua entrada.',
  v30RecordHarvest:'Toda colheita tem espaço para quem plantou, para quem cuidou e para quem chegou com fome.',
  v30RecordMemory:'A lembrança de um povo cresce quando pode ser contada por muitas vozes.'
 };
 q.records.push(a.id);
 log('Registro do Átrio · '+a.label+': '+texts[a.id]);
 save();update();
 if(q.records.length===3&&!q.completed){
  v30Cutscene('archive',v30DoneArchive);
 }else say(a.label,texts[a.id]+'\n\nRegistro anotado ('+q.records.length+'/3).');
}
function v30Interact(a){
 if(['groveGate','backGrove','ayla','chime','marker','sentinel','mural','supply'].includes(a.v30)){v303Interact(a);return}
 const q=v30State();
 if(a.id==='v30RootSignal'){
  if(!q.started)v30Cutscene('awakening',v30DoneIntro);
  else say('Raiz que Canta',q.completed?
   'Você restaurou o primeiro juramento. Há outras raízes esperando por alguém que saiba escutá-las.':
   'A lembrança continua viva. '+v30Objective());
  return;
 }
 if(a.id==='v30ForestFissure'){
  if(!q.started){say('Fissura Adormecida','A Raiz que Canta na Vila ainda precisa despertar.');return}
  if(!q.discovered)v30Cutscene('whisper',v30DoneVision);
  else say('Fissura das Lembranças','A semente nasce, recebe água e encontra a luz. As pedras guardam essa sequência.');
  return;
 }
 if(a.v30==='stone'){v30Stone(a);return}
 if(a.v30==='gate'){
  if(q.opened){warp('atrioRaizes',2.8,7);return}
  if(q.sequence<3){
   say('Passagem das Raízes','As raízes continuam entrelaçadas. Toque as três pedras da Floresta na ordem correta ('+q.sequence+'/3).');
   return;
  }
  v30Cutscene('opening',v30DoneGate);return;
 }
 if(a.v30==='return'){warp('floresta',19.1,9.4);return}
 if(a.v30==='record'){v30Record(a);return}
 if(a.v30==='keeper'){
  say('Guardião dos Registros',q.completed?
   'Você ouviu três promessas, mas elas são só a primeira página de uma história esquecida.':
   'As promessas estão gravadas em três inscrições. Leia-as para compreender por que as raízes se abriram.');
 }
}
function v30SetupUI(){
 if($('v30PrologueCard'))return;
 const aside=host.querySelector('.r12-aside');if(!aside)return;
 const card=document.createElement('section');
 card.className='r12-card v30-prologue';card.id='v30PrologueCard';
 card.setAttribute('aria-label','Diário do Despertar do Pomar');
 card.innerHTML='<div class="v30-kicker">✦ NOVA CAMPANHA · V30.2</div>'+
 '<h3>🌳 O Despertar do Pomar</h3><p id="v30QuestStatus" aria-live="polite"></p>'+
 '<div class="v30-track" role="progressbar" aria-label="Progresso do prólogo" aria-valuemin="0" aria-valuemax="5" aria-valuenow="0"><span id="v30ProgressFill"></span></div>'+
 '<div id="v30QuestCount" class="v30-quest-count"></div>'+
 '<div class="v30-actions"><button type="button" id="v30ReplayIntro">🎬 Rever cutscene</button>'+
 '<button type="button" id="v30MusicToggle">♫ Ligar trilha</button></div>'+
 '<label class="v30-track-label" for="v30TrackChoice">🎼 Trilha ambiente (5 músicas novas)</label>'+
 '<select id="v30TrackChoice"><option value="village">Manhã na Vila</option>'+
 '<option value="forest">Luzes da Floresta</option><option value="mystery">Raízes que Sussurram</option>'+
 '<option value="cinematic">O Despertar da Árvore</option><option value="temple">Templo das Raízes</option></select>'+
 '<p class="v30-help">As trilhas são originais, funcionam offline e só tocam depois que você ligar o som. O progresso permanece salvo.</p>';
 aside.prepend(card);
 $('v30ReplayIntro').addEventListener('click',()=>window.SamCutscenes?.play('awakening'));
 $('v30MusicToggle').addEventListener('click',()=>{window.SamMusic?.toggle();v30RenderUI()});
 $('v30TrackChoice').addEventListener('change',e=>window.SamMusic?.scene(e.target.value));
}
function v30RenderUI(){
 const card=$('v30PrologueCard');if(!card)return;
 const q=v30State();
 $('v30QuestStatus').textContent=v30Objective();
 const chapter=v303State();
 const steps=[!!q.started,!!q.discovered,q.sequence>=3,!!q.opened,!!q.completed,!!chapter.metAyla,chapter.chimes===3,!!chapter.bossWon,!!chapter.finished];
 const n=steps.filter(Boolean).length;
 $('v30QuestCount').textContent=n+'/9 marcos · '+q.records.length+'/3 inscrições'+(q.mistakes?' · '+q.mistakes+' tentativas refeitas':'');
 $('v30ProgressFill').style.width=100*n/9+'%';
 card.querySelector('[role="progressbar"]').setAttribute('aria-valuenow',String(n));
 $('v30ReplayIntro').disabled=!q.started;
 $('v30MusicToggle').textContent=window.SamMusic?.enabled?'♫ Silenciar trilha':'♫ Ligar trilha';
}
function v29State(){
 const e=epic();
 if(!e.v29||typeof e.v29!=='object'||Array.isArray(e.v29))e.v29={};
 const q=e.v29;
 if(!Array.isArray(q.clues))q.clues=[];
 if(!Array.isArray(q.finds))q.finds=[];
 if(!Array.isArray(q.dialogues))q.dialogues=[];
 if(!Array.isArray(q.notes))q.notes=[];
 if(!Number.isInteger(q.step)||q.step<0||q.step>3)q.step=0;
 q.failures=Math.max(0,Math.floor(Number(q.failures)||0));
 return q;
}
function v29Objective(){
 const q=v29State();
 if(!q.started)return 'Encontre Íris, a cartógrafa, na Vila da Mangueira.';
 if(q.clues.length<3)return 'Investigue o relógio na Vila, a casca na Floresta e a biruta na Campina ('+q.clues.length+'/3).';
 if(!q.chime)return 'Afine o carrilhão no leste da Trilha Encantada usando suas três pistas.';
 if(!q.wisp)return 'Investigue e enfrente a Mariposa do Silêncio na Floresta.';
 if(!q.scout)return 'Encontre Caio na Campina e descubra por que a sentinela levou o sino.';
 if(!q.guardian)return 'Enfrente a Sentinela da Badalada na Campina. Observe seus ataques antes de agir.';
 if(!q.ending)return 'Volte à Copa da Primeira Mangueira, ao norte da Trilha, e decida o destino do sino.';
 return 'Crônica concluída. Descubra as nove memórias escondidas nos mapas ('+q.finds.length+'/9).';
}
function v29ActorVisible(a){
 const q=v29State();
 if(a.v29==='find')return !q.finds.includes(a.id);
 if(a.v29==='dailySpot'){const d=v29Daily();return !!q.started&&!!d.started&&d.task===v29Data.fieldTasks.findIndex(t=>t.id===a.id)}
 if(a.v29==='enemy'){
  if(a.id==='v29Mariposa')return !!q.chime&&!q.wisp&&!epic().defeated.includes(a.id);
  return !!q.scout&&!q.guardian&&!epic().defeated.includes(a.id);
 }
 if(a.v29==='ending')return !!q.guardian;
 if(a.v29==='puzzle')return !!q.started;
 return true;
}
function v29Memory(id){
 const q=v29State(),data=v29Data?.discoveries[id];
 if(!data)return false;
 if(q.finds.includes(id)){
  say('Registro do Pomar',data.text);return true;
 }
 q.finds.push(id);
 if(q.notes.length<16)q.notes.unshift(data.chapter+' · '+data.title);
 const e=epic();e.gold+=6;giveXP(10);
 log('Descoberta: '+data.title+' · +10 XP e +6 moedas RPG.');
 if(q.finds.length===Object.keys(v29Data.discoveries).length&&!q.collectionReward){
  q.collectionReward=true;e.gold+=45;giveXP(80);
  log('Coleção completa: as nove memórias do Pomar foram preservadas. Bônus de +80 XP e +45 moedas!');
 }
 say('Descoberta de cenário · '+data.title,data.text+'\n\nO registro entrou no Livro da Crônica. +10 XP e +6 moedas RPG'+(q.collectionReward&&q.finds.length===9?' · Coleção completa!':'')+'.');
 save();update();return true;
}
function v29Clue(id){
 const q=v29State(),c=v29Data?.clues[id];if(!c)return false;
 if(!q.started){
  say(c.who,c.text+' Procure Íris na Vila para começar a investigação da badalada.');return true;
 }
 if(q.clues.includes(id)){say(c.who,c.text+' Esta pista já está anotada no seu diário.');return true}
 q.clues.push(id);q.notes.unshift('Pista '+q.clues.length+'/3: '+c.name);
 log('Pista musical encontrada: '+c.name+'.');
 say(c.who,c.text+'\n\nPista registrada ('+q.clues.length+'/3).');
 save();update();return true;
}
function v29ShowClues(){
 const q=v29State();
 const texts=q.clues.map(id=>v29Data.clues[id]?.text).filter(Boolean);
 say('Caderno de Íris',
  texts.length?texts.join('\n\n')+'\n\nPense na ordem dos acontecimentos, não na ordem em que encontrou os objetos.':
  'Sua investigação ainda não tem pistas. O relógio, a casca da árvore e a biruta guardam uma informação cada.');
}
function v29Puzzle(){
 const q=v29State(),seq=v29Data.chime.symbols;
 if(!q.started){say('Carrilhão Silencioso','Os sinos não respondem. Encontre Íris na Vila para começar a investigação.');return}
 if(q.clues.length<3){
  say('Carrilhão das Três Vozes','Há três encaixes e apenas '+q.clues.length+' pista(s) anotada(s). Investigue o relógio, a casca e a biruta antes de tentar.');return;
 }
 if(q.chime){say('Carrilhão Restaurado','A melodia atravessa o vento e as raízes. Ela aponta para um vulto na parte sul da Floresta.');return}
 const step=q.step;
 const explain=step===0?'Primeira nota: onde nasceu o chamado?':step===1?'Segunda nota: quem guardou o som?':'Terceira nota: quem respondeu ao chamado?';
 choiceBox('🎼 Carrilhão · '+(step+1)+'/3',
  explain+'\n\n'+v29Data.chime.clue+'\nErros: '+q.failures,
  [...['LUZ','RAIZ','SOPRO'].map(key=>[key,()=>{
   if(key!==seq[step]){
    q.step=0;q.failures++;save();update();
    say('Carrilhão desafinado','Uma nota ressoa fora de ordem e o carrilhão silencia. Sua investigação não foi perdida. Leia as pistas antes de tentar de novo.',()=>v29Puzzle(),'Tentar novamente');
    return;
   }
   q.step=step+1;save();update();
   if(q.step>=3){
    q.step=3;q.chime=true;
    log('O carrilhão despertou. Sopro, Raiz e Luz revelaram a Mariposa do Silêncio.');
    goStory([['Carrilhão das Três Vozes','O último toque traz de volta uma canção infantil e aponta para a mata ao sul.'],['Íris, na lembrança','Agora você consegue ouvir o que roubou a badalada. Procure o som no silêncio da Floresta.']]);
    return;
   }
   say('Carrilhão · nota correta','A nota foi ouvida. O som percorre as raízes e espera a próxima escolha.',()=>v29Puzzle(),'Escolher próxima nota');
  }]),['📖 Relêr as pistas',()=>v29ShowClues()],['Deixar o carrilhão',()=>{}]]);
}
function v29StoryChoice(){
 const q=v29State();if(!q.guardian)return;
 if(q.ending){say('Copa da Primeira Mangueira',q.ending==='vila'
  ?'Sua decisão permanece: a badalada une os habitantes na Vila.'
  :'Sua decisão permanece: o Bosque guia viajantes com sua melodia.');return}
 goStory(v29Data.story.final,()=>choiceBox('A Última Badalada',
  'O sino foi recuperado. Onde a melodia poderá cuidar melhor de quem vive no Pomar?',
  [['Devolver a badalada à Vila',()=>v29Ending('vila')],
   ['Confiar o sino às raízes do Bosque',()=>v29Ending('bosque')],
   ['Preciso pensar mais',()=>say('Eco da Mangueira','A decisão é sua. Volte à Copa quando estiver pronto.')]]));
}
function v29Ending(kind){
 const q=v29State();if(q.ending)return;
 q.ending=kind;
 const e=epic();e.gold+=75;
 ownItem('broche_aurora');
 giveXP(140);save();update();
 log(kind==='vila'?'A badalada voltou para todos na Vila.':'A badalada passou a orientar viajantes pela Floresta.');
 goStory(v29Data.story[kind==='vila'?'share':'shelter'],()=>{
  say('Nova conquista · A Última Badalada','Você completou a Crônica da Badalada! +140 XP, +75 moedas RPG e o Broche da Badalada. Há nove histórias de cenário para colecionar.');
 });
}
function v29CombatWon(key){
 const q=v29State();
 if(key==='v29_silencio'&&!q.wisp){
  q.wisp=true;log('A Mariposa libertou a melodia. Agora Caio precisa ouvir o que você encontrou.');
  goStory(v29Data.story.afterWisp);
 }else if(key==='v29_sentinela'&&!q.guardian){
  q.guardian=true;
  log('A Sentinela reconheceu a música do sino. A Copa da Primeira Mangueira aguarda a decisão final.');
  goStory([['Sentinela da Badalada','Eu protegia o sino da palavra que exclui. Não deixarei que calem os pequenos outra vez.'],
   ['Caio, em lembrança','A Copa, ao norte da Floresta, sabe por que o sino foi criado. Encontre a árvore e escute sua escolha.']]);
 }
 save();update();
}
/* An optional once-per-day local field assignment. Official leaderboards unaffected. */
function v29Daily(){
 const q=v29State(),today=v23Day();
 if(!q.daily||q.daily.day!==today){
  const dayNumber=Number(String(today).replace(/\D/g,'').slice(-2))||1;
  q.daily={day:today,task:dayNumber%v29Data.fieldTasks.length,
   started:false,observed:false,claimed:false};
 }
 return q.daily;
}
function v29DailyBoard(){
 const q=v29State();if(!q.started){
  say('Diário de Campo','Íris organiza pequenas pesquisas pelo Pomar. Comece A Última Badalada com ela antes de usar o diário.');return;
 }
 const d=v29Daily(),task=v29Data.fieldTasks[d.task];
 if(d.claimed){
  say('Diário de Campo','Pesquisa registrada! Você recebeu a recompensa de hoje. Amanhã haverá uma nova expedição.');return;
 }
 if(!d.started){
  d.started=true;save();
  say('Diário de Campo · Pesquisa de Hoje','Destino: '+task.map+'.\n'+task.text+'\n\nInvestigue a marca brilhante da região e volte ao quadro na Vila.');
  return;
 }
 if(!d.observed){
  say('Diário de Campo','Pesquisa em andamento. Vá até '+task.map+' e investigue a marca. Volte para receber a recompensa.');return;
 }
 d.claimed=true;epic().gold+=18;giveXP(30);
 log('Diário de Campo: pesquisa de '+task.map+' concluída! +30 XP e +18 moedas RPG.');
 say('Diário de Campo','Observação registrada e enviada para Íris! +30 XP e +18 moedas RPG. A tarefa foi concluída por hoje.');
 save();update();
}
function v29DailySpot(a){
 const d=v29Daily(),task=v29Data.fieldTasks[d.task];
 if(!d.started||a.id!==task.id){
  say('Observação do Pomar','Uma marca de pesquisa antiga. O Diário de Campo da Vila informa a rota do dia.');return;
 }
 if(d.observed){
  say('Observação do Pomar','O registro de hoje já foi feito. Volte ao Diário de Campo na Vila.');return;
 }
 d.observed=true;log('Pesquisa do dia: a observação em '+task.map+' foi concluída.');
 say('Caderno de Campo',task.text+'\n\nVocê anotou os detalhes. Volte à Vila e entregue o registro no Diário de Campo.');
 save();update();
}
function v29Interact(a){
 const q=v29State();if(!v29Data)return false;
 if(a.v29==='dailyBoard'){v29DailyBoard();return true}
 if(a.v29==='dailySpot'){v29DailySpot(a);return true}
 if(a.v29==='clue')return v29Clue(a.id);
 if(a.v29==='find')return v29Memory(a.id);
 if(a.v29==='puzzle'){v29Puzzle();return true}
 if(a.v29==='ending'){v29StoryChoice();return true}
 if(a.v29==='enemy'){
  if(a.id==='v29Mariposa'&&!q.chime){say('Vulto Silencioso','O carrilhão ainda não revelou o caminho.');return true}
  if(a.id==='v29Sentinela'&&!q.scout){say('Sentinela','Caio pode explicar por que esta guardiã se esconde.');return true}
  startCombat(epicMonsters[a.id],a.id);return true;
 }
 if(a.id==='v29Iris'){
  if(!q.started){
   goStory(v29Data.story.intro,()=>{
    q.started=true;q.notes.unshift('Íris pediu ajuda para recuperar a última badalada.');
    log('Uma nova Crônica começou: A Última Badalada. Investigue relógio, casca e biruta.');
   });return true;
  }
  const mood=q.ending==='vila'?'A Vila voltou a celebrar em conjunto.':q.ending==='bosque'?'Desenhei no mapa o novo caminho musical.':'É bom ver alguém que ouve com tanta atenção.';
  choiceBox('Íris, Cartógrafa',
   mood+'\n\n'+v29Objective(),
   [['Relembrar pistas',()=>v29ShowClues()],
    ['Perguntar sobre a Crônica',()=>say('Íris','Explore a Vila, a Trilha e a Campina. Pistas e histórias de cenário serão registradas no seu livro.')],
    ['Até logo',()=>{}]]);return true;
 }
 if(a.id==='v29Mara'){
  if(!q.started){say('Mara, Jardineira','A Floresta silenciou e eu não entendo por quê. Íris investiga a badalada perdida na Vila.');return true}
  if(!q.dialogues.includes('mara')){
   q.dialogues.push('mara');goStory(v29Data.story.mara);return true;
  }
  say('Mara, Jardineira',q.chime?'Você ouviu a melodia! Procure a Mariposa ao sul, perto da trilha.':
   'A partitura nasce no sopro, percorre a raiz e alcança a luz. Guarde o que cada objeto contou.');return true;
 }
 if(a.id==='v29Caio'){
  if(!q.started){say('Caio, Aprendiz','Íris precisa da sua ajuda na Vila. O relógio da Praça não toca há dias.');return true}
  if(!q.wisp){say('Caio, Aprendiz','Ouvi passos na Campina, mas a névoa não me deixa ver. Afine o carrilhão e liberte primeiro a Mariposa na Floresta.');return true}
  if(!q.scout){
   q.scout=true;log('Caio revelou que a Sentinela da Badalada protege o sino na Campina.');
   goStory(v29Data.story.caio);return true;
  }
  say('Caio, Aprendiz',q.guardian?'Você atravessou a tempestade! A Copa ao norte da Floresta espera sua decisão.':
   'A Sentinela guarda o sino perto do centro da Campina. Quando reunir nuvens para o golpe forte, use DEFENDER.');return true;
 }
 return false;
}
function v29SetupUI(){
 if($('v29Chronicle'))return;
 const aside=host.querySelector('.r12-aside');
 if(!aside)return;
 const card=document.createElement('section');card.id='v29Chronicle';card.className='r12-card v29-chronicle';
 card.setAttribute('aria-label','Nova crônica de exploração');
 card.innerHTML='<div class="v29-eyebrow">NOVA AVENTURA · V29</div><h3>🔔 A Última Badalada</h3>'+
 '<p id="v29QuestObjective"></p><div class="v29-progress-track" role="progressbar" aria-label="Progresso da Crônica" aria-valuemin="0" aria-valuemax="7" aria-valuenow="0"><i id="v29QuestBar"></i></div>'+
 '<p id="v29QuestMeta"></p><div id="v29QuestSteps"></div><div id="v29QuestClues" class="v29-clues"></div>'+
 '<button type="button" id="v29ReadClues">📖 Ver pistas no diário</button>'+
 '<p id="v29DailyStatus" class="v29-daily"></p><p class="v29-caption">Pistas, combates e descobertas salvam no seu RPG. Sem alterar o ranking.</p>';
 aside.prepend(card);
 $('v29ReadClues').addEventListener('click',v29ShowClues);
 const main=host.querySelector('.r12-main');
 if(main){
  const badge=document.createElement('button');badge.id='v29WorldQuest';badge.type='button';
  badge.className='v29-world-quest';badge.textContent='🔔 A Última Badalada · ver missão';
  badge.addEventListener('click',()=>{
   const menu=host.querySelector('.sm-immersive-menu');
   if(host.classList.contains('sm-immersive')&&!host.classList.contains('sm-immersive-panel-open'))menu?.click();
   card.scrollIntoView({block:'nearest',behavior:'auto'});
  });
  main.append(badge);
 }
}
function v29RenderUI(){
 const card=$('v29Chronicle');if(!card)return;
 const q=v29State();
 let done=[!!q.started,q.clues.length===3,!!q.chime,!!q.wisp,!!q.scout,!!q.guardian,!!q.ending];
 const n=done.filter(Boolean).length;
 $('v29QuestObjective').textContent=v29Objective();
 $('v29QuestMeta').textContent='Progresso '+n+'/7 · '+q.clues.length+'/3 pistas · '+q.finds.length+'/9 descobertas'+(q.failures?' · '+q.failures+' tentativas incorretas':'');
 $('v29QuestBar').style.width=Math.round(100*n/7)+'%';
 card.querySelector('[role="progressbar"]').setAttribute('aria-valuenow',String(n));
 const labels=['Converse com Íris','Reúna três pistas do cenário','Afine o Carrilhão','Liberte a Mariposa','Ouça Caio','Enfrente a Sentinela','Decida o destino do sino'];
 $('v29QuestSteps').innerHTML=labels.map((label,i)=>'<div class="r12-quest-row '+(done[i]?'done':'')+'">'+(done[i]?'✓ ':'◇ ')+label+'</div>').join('');
 const clues=$('v29QuestClues');
 clues.innerHTML=q.clues.map(id=>'<div>✧ '+escapeHtml(v29Data.clues[id]?.name||id)+'</div>').join('')||
  '<small>O caderno aguarda a primeira pista.</small>';
 const daily=v29Daily(),task=v29Data.fieldTasks[daily.task];
 $('v29DailyStatus').textContent=q.started?('📚 Diário de Campo: '+(daily.claimed?'pesquisa concluída hoje':!daily.started?'nova pesquisa disponível na Vila':daily.observed?'volte à Vila para entregar':'investigue '+task.map)):('📚 Diário de Campo: disponível após conversar com Íris');
 const badge=$('v29WorldQuest');
 if(badge)badge.textContent=q.ending?'🔔 Crônica concluída · '+q.finds.length+'/9 memórias':
  '🔔 '+(q.started?'Crônica: '+n+'/7 etapas · abrir diário':'Nova crônica: fale com Íris');
}
function epicInteract(a){if(!a||!a.epic)return false;
 const e=epic(),f=e.flags;
 if(a.epic==='gate'){epicMapPortal(a.id,a.target,a.tx,a.ty,a.min||0);return true}
 if(a.epic==='enemy'){startCombat(epicMonsters[a.id],a.id);return true}
 if(a.epic==='resource'){
   if(a.id.startsWith('v24')){if(eflag(a.id))return true;setFlag(a.id);const reward=a.id.includes('Crystal')?20:12;e.gold+=reward;save();update();notify('Coletado: '+a.label+' · +'+reward+' moedas RPG.');return true}
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
function v29CombatTell(c){
 if(c.key==='v29_sentinela')return c.turn%3===0
  ?'⚠ A Sentinela concentra nuvens nas patas: próximo ataque CARREGADO. DEFENDA ou ANALISE para resistir.'
  :'A Sentinela circula e testa sua defesa. Natureza abre fissuras na armadura.';
 if(c.key==='v31_guardiao')return c.turn%4===0?'⚠ O Guardião ergue uma tempestade de raízes. DEFENDER reduz o ataque.':'O Guardião protege seu núcleo. Natureza vence a couraça, luz enfraquece sua flor.';
 if(c.key==='v303_sentinela')return c.turn%3===0?'⚠ A Sentinela concentra um eco sombrio. DEFENDER reduz o próximo golpe.':'A luz enfraquece a Sentinela. Observe o ritmo de três turnos.';
 if(c.key==='v29_silencio')return c.turn%4===0
  ?'⚠ A Mariposa recolhe as asas: o próximo eco causará mais dano. Proteja-se.'
  :'A Mariposa perde o brilho diante da Luz. Estude a fraqueza antes de usar magia.';
 return '';
}
function startCombat(monster,actor){if(epicCombat||!EPIC_ENEMIES[monster])return;if(!epic().class){showEpicClasses();return}
 const m=EPIC_ENEMIES[monster];const basePhase=m.phases?m.phases[0]:{hp:m.hp,element:m.element,title:''};epicCombat={key:monster,actor,name:m.name,hp:basePhase.hp,maxHp:basePhase.hp,phase:0,element:basePhase.element,playerGuard:false,turn:1,status:'',enemyStatus:'',logs:[m.intro],enemyIntent:'O inimigo prepara seu primeiro golpe.',lock:false};epicCombat.enemyIntent=v29CombatTell(epicCombat)||epicCombat.enemyIntent;
 window.SamMusic?.scene(monster==='rei'?'boss':'battle');const e=epic();e.mp=Math.min(e.mp+1,maxMana());if(hasEffect('vigor'))e.hp=Math.min(e.hp+2,maxHealth());if(hasEffect('moonrise'))e.mp=Math.min(maxMana(),e.mp+2);dialogOpen=true;createCombat();renderCombat();save();}
function damageMult(atk,def){if(atk===def)return .76;if(EPIC_ADV[atk]===def)return 1.55;if(EPIC_ADV[def]===atk)return .65;return 1}
function damageToEnemy(element,magic=false){const e=epic(),m=EPIC_ENEMIES[epicCombat.key];const attr=magic?e.stats.int:e.stats.for;const coeff=magic?1.7:1.4;const base=Math.max(2,Math.floor(8+e.level*2.0+attr*coeff-m.def));let mult=damageMult(element,epicCombat.element);if(m.weak===element)mult=Math.max(mult,1.65);if(hasEffect('attack'))mult+=(3/base);if(hasEffect('spell')&&magic)mult*=1.3;if(hasEffect('resonance')&&magic)mult*=1.08;if(hasEffect('focus')&&magic)mult*=1.12;if(hasEffect('royal')&&epicCombat.key==='rei')mult*=1.15;if(hasEffect('halloween')&&epicCombat.element==='shadow')mult*=1.15;if(epicCombat.focus)mult*=1.35;const variation=.88+Math.random()*.26;const crit=Math.random()<Math.min(.36,.035+epic().stats.agi*.011+(epic().class==='rastreador'?.10:0));return {value:Math.max(1,Math.floor(base*mult*variation*(crit?1.55:1))),mult,crit}}
function battleMessage(s){epicCombat.logs.unshift(s);epicCombat.logs=epicCombat.logs.slice(0,8)}
function resolveCombatAction(type){const c=epicCombat;if(!c||c.lock)return;const e=epic(),cls=classInfo(),enemy=EPIC_ENEMIES[c.key];let d;
 if(type==='run'){if(c.key==='rei'||['rainha','besouro','espectro','sentinela'].includes(c.key)){battleMessage('Este guardião não permite fuga.');renderCombat();return}endCombat(false,true);return}
 if(type==='potion'){if(e.potions<=0){battleMessage('Você não tem poções.');renderCombat();return}if(e.hp>=maxHealth()&&c.status!=='poison'){battleMessage('Sua vida já está cheia.');renderCombat();return}e.potions--;c.status='';const heal=Math.min(maxHealth()-e.hp,38+e.stats.vig);e.hp+=heal;battleMessage('Você recuperou '+heal+' HP com uma poção.')}
 else if(type==='tonico_mana'){if(!v24Count(type)||e.mp>=maxMana()){battleMessage('Tônico indisponível ou MP cheio.');renderCombat();return}v24Take(type);e.mp=Math.min(maxMana(),e.mp+6);battleMessage('Tônico Lunar: +6 MP!')}
  else if(type==='antidoto'){if(!v24Count(type)||c.status!=='poison'){battleMessage('Antídoto apenas quando envenenado.');renderCombat();return}v24Take(type);c.status='';battleMessage('Você neutralizou o veneno.')}
  else if(type==='bomba_esporos'){if(!v24Count(type)){battleMessage('Sem bombas!');renderCombat();return}v24Take(type);c.hp-=20;c.enemyStatus='blind';c.enemyStatusDuration=2;battleMessage('Bomba de Esporos: 20 de dano e cegueira!')}
  else if(type==='escudo_folha'){if(!v24Count(type)){battleMessage('Sem escudo de folha!');renderCombat();return}v24Take(type);c.playerGuard=true;e.mp=Math.min(maxMana(),e.mp+1);battleMessage('O Escudo de Folha protege este turno.')}
  else if(type==='guard'){c.playerGuard=true;e.mp=Math.min(maxMana(),e.mp+2);battleMessage('Você ergue a guarda e recupera 2 de energia.')}
  else if(type==='study'){if(c.focus){battleMessage('Você já analisou este inimigo. Use um golpe para aproveitar a abertura.');renderCombat();return}c.focus=1;c.playerGuard=true;e.mp=Math.min(maxMana(),e.mp+1);battleMessage('Observação: +1 MP, guarda ativa e +35% no seu próximo ataque.');}
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
 if(['attack','skill','artifact'].includes(type))c.focus=0;
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
  :type==='study'?!c.focus
   :type==='skill'?e.mp>=(3-(hasEffect('mana')?1:0))
  :type==='artifact'?!c.artUsed&&e.equipped.some(id=>EPIC_ARTIFACTS[id])
  :type==='potion'?e.potions>0&&(e.hp<maxHealth()||c.status==='poison'):type==='tonico_mana'?v24Count(type)>0&&e.mp<maxMana():type==='antidoto'?v24Count(type)>0&&c.status==='poison':['bomba_esporos','escudo_folha'].includes(type)?v24Count(type)>0:true;
 if(!valid){resolveCombatAction(type);return}
 c.lock=true;for(const b of $('r13Combat').querySelectorAll('[data-r13action]'))b.disabled=true;
 const attack=type==='attack'||type==='skill'||type==='artifact'||type==='bomba_esporos';
 const scene=type==='skill'?'magic':type==='artifact'?'artifact':['potion','tonico_mana','antidoto'].includes(type)?'heal':['guard','study','escudo_folha'].includes(type)?'guard':type==='bomba_esporos'?'magic':type==='attack'?'attack':'';
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
  const v29Charged=(c.key==='v29_sentinela'&&c.turn%3===0)||(c.key==='v29_silencio'&&c.turn%4===0)||(c.key==='v303_sentinela'&&c.turn%3===0)||(c.key==='v31_guardiao'&&c.turn%4===0);
   const raw=(enemy.atk*coeff+Math.floor(c.turn/3)+Math.random()*5)*(v29Charged?1.7:1);
   if(v29Charged)battleMessage('⚠ Golpe carregado! DEFENDER reduz bastante o impacto.');
  let dmg=Math.max(1,Math.floor(raw-epic().stats.vig*.9-(hasEffect('defense')?3:0)-(hasEffect('harvest')?2:0)-(hasEffect('ward')?2:0)));
  const incoming=damageMult(c.element,classInfo().element);dmg=Math.max(1,Math.floor(dmg*(incoming>1.3?1.13:incoming<.9?.86:1)));if(c.playerGuard)dmg=Math.max(1,Math.floor(dmg*.38));if(c.key==='rei'&&c.phase===1&&epic().class==='guardiao')dmg=Math.floor(dmg*.88);
  e.hp=Math.max(0,e.hp-dmg);battleMessage(enemy.name+' causou '+dmg+' de dano'+(c.playerGuard?' (bloqueado parcialmente)':'')+'.');
  if(!c.playerGuard&&Math.random()<.16&&c.key!=='sentinela'){c.status='poison';battleMessage('Você foi envenenado!')}
 }
 if(c.status==='poison'){e.hp=Math.max(0,e.hp-4);battleMessage('Veneno: -4 HP. Poções e antídotos removem esse estado.')}else if(hasEffect('regen'))e.hp=Math.min(maxHealth(),e.hp+3);
 if(c.enemyStatusDuration>0){c.enemyStatusDuration--;if(c.enemyStatusDuration===0)c.enemyStatus='';}c.turn++;c.playerGuard=false;c.enemyIntent=v29CombatTell(c)||(c.turn%3===0?'O inimigo prepara um ataque mais feroz.':'O inimigo observa seus movimentos.');
 if(e.hp<=0){e.losses++;e.hp=Math.max(1,Math.floor(maxHealth()*.55));e.mp=maxMana();e.gold=Math.max(0,e.gold-12);const target=c.key;endCombat(false,false);say('Derrota e recomeço','Você despertou protegido pelas raízes. Perdeu 12 moedas, mas manteve todas as pistas e missões. Reforce atributos ou equipe artefatos antes de enfrentar '+EPIC_ENEMIES[target].name+' novamente.');}
}
function advanceBattlePhase(){const c=epicCombat,m=EPIC_ENEMIES[c.key];if(m.phases&&c.phase<m.phases.length-1){c.phase++;const phase=m.phases[c.phase];c.hp=phase.hp;c.maxHp=phase.hp;c.element=phase.element;c.status='';c.enemyStatus='';epic().mp=Math.min(maxMana(),epic().mp+3);epic().hp=Math.min(maxHealth(),epic().hp+26);battleMessage(phase.title+'! O Rei mudou de elemento. Você recuperou 26 HP e 3 MP.');window.SamMusic?.effect('magic');return}
 const key=c.key,actor=c.actor;
 endCombat(true,false);const e=epic();if(!e.defeated.includes(actor))e.defeated.push(actor);const enemy=EPIC_ENEMIES[key];e.wins++;v23DailyMark('victory');e.gold+=enemy.gold;e.potions+=1;giveXP(enemy.xp);notify('Vitória! +'+enemy.xp+' XP e '+enemy.gold+' moedas.');
  if(key==='v29_silencio'||key==='v29_sentinela')v29CombatWon(key);
   if(key==='v303_sentinela'){const c=v303State();c.bossWon=true;log('V30.3 · A Sentinela do Silêncio foi vencida. O mural a leste voltou a brilhar.');}
 if(key==='v31_guardiao'){const c=v31State();c.bossWon=true;log('Capítulo II · O Guardião de Musgo se libertou do juramento antigo.');}
 if(key==='larva'){log('A Larva da Ferrugem caiu. A fornalha agora pode ser purificada.');}
 if(key==='rainha'){ownItem('espinho_soberano');goStory([['Rainha das Aranhas','As crianças... ainda lembram de nosso juramento?'],['Eldra','A rainha era guardiã daquelas promessas. A maldição prendeu seu amor numa teia de ódio.'],['Narrador','Com a coroa de espinhos desfeita, uma passagem se abre para as Minas do Prisma Partido.']],()=>advanceEpicChapter(3))}
 if(key==='besouro'){ownItem('prisma_eco');goStory([['Dário','Ouço as minas cantando outra vez. O brilho volta a revelar o caminho das antigas águas.'],['Narrador','O Prisma do Eco se uniu ao seu inventário. A trilha do pântano se abriu.']],()=>advanceEpicChapter(4))}
 if(key==='espectro'){say('Orestes, o Colecionador','Eu só queria que alguém lembrasse... A fonte guarda uma escolha. Volte a ela antes de partir.')}
 if(key==='sentinela'){ownItem('lente_lunar');goStory([['Sentinela do Eclipse','Sua vontade permaneceu mesmo sob o trovão. A Torre aceita seu nome.'],['Selene','O Rei não é apenas um monstro. Ele é a fome que foi deixada fora da mesa. Leve esta lente; ela mostrará o que a névoa esconde.'],['Narrador','A passagem para o Coração do Pomar se acende ao norte.']],()=>advanceEpicChapter(6))}
 if(key==='rei'){ownItem('coroa_semente');goStory([['Rei das Pragas','A coroa... era apenas uma casca. Todas essas vozes, todas essas colheitas...'],['Eldra','Você o venceu, mas a maldição só acaba quando escolhe o que fazer com as memórias.'],['Narrador','O Altar da Última Colheita desperta ao sul. Três destinos aguardam sua decisão.']]);}
 save();update();}
function endCombat(win,ran){if(!epicCombat)return;window.SamMusic?.scene(v30SceneForRoom(st.map));if(win)window.SamMusic?.effect('win');epicCombat=null;dialogOpen=false;const el=$('r13Combat');if(el)el.hidden=true;recomputeHealth();save();update();if(ran)notify('Você recuou para preparar uma estratégia melhor.');}
function createCombat(){let modal=$('r13Combat');if(!modal){modal=document.createElement('div');modal.id='r13Combat';modal.className='r13-combat';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','Combate por turno');document.getElementById('rpgDlg').append(modal)}modal.hidden=false}
function renderCombat(){const c=epicCombat;if(!c)return;const e=epic(),m=EPIC_ENEMIES[c.key],info=EPIC_CHAPTERS[e.chapter];const escape=escapeHtml;const prevAction=document.activeElement?.closest?.('[data-r13action]')?.dataset.r13action||'';const weak=Object.keys(EPIC_ADV).find(key=>EPIC_ADV[key]===c.element)||m.weak;
 const phaseText=m.phases?' · '+m.phases[c.phase].title:'';
 $('r13Combat').innerHTML='<div class="r13-battle-card"><header><small>⚔️ COMBATE RPG '+phaseText+'</small><h2>'+escape(m.name)+'</h2><p>Elemento: '+EPIC_ELEMENTS[c.element]+' · Fraqueza atual: '+EPIC_ELEMENTS[weak]+'</p></header><div class="r13-battle-field"><div class="r13-enemy-figure"><img src="sprites/'+m.sprite+((m.sprite==='aranha_rainha_v14'||m.sprite.endsWith('_v24'))?'.svg':'.png')+'" alt="'+escape(m.name)+'"><span>Inimigo · '+Math.max(0,c.hp)+' / '+c.maxHp+' HP</span><div class="r13-bar enemy"><i style="width:'+Math.min(100,Math.max(0,100*c.hp/c.maxHp))+'%"></i></div></div><div class="r13-battle-vs">⚔</div><div class="r13-player-figure"><canvas id="r13Fighter" width="72" height="90"></canvas><span>'+escape(classInfo().name)+' · Nv. '+e.level+'</span><div class="r13-bar"><i style="width:'+Math.round(e.hp/maxHealth()*100)+'%"></i></div><span>❤ '+e.hp+'/'+maxHealth()+' · ✦ '+e.mp+'/'+maxMana()+' MP</span></div></div><p class="r13-weak">'+escape(c.enemyIntent)+(c.focus?' · ✨ Bônus de observação (+35%)':'')+' · '+(c.status==='poison'?'☠ Envenenado · ':'')+(c.enemyStatus==='burn'?'🔥 Inimigo queimando · ':'')+(c.enemyStatus==='blind'?'✨ Inimigo cego':'')+'</p><div class="r13-combat-controls"><button data-r13action="attack">⚔ ATACAR</button><button data-r13action="skill">✦ '+escape(classInfo().skill)+' ('+(3-(hasEffect('mana')?1:0))+' MP)</button><button data-r13action="guard">🛡 DEFENDER (+2 MP)</button><button data-r13action="study">🔎 ANALISAR (+35% dano)</button><button data-r13action="artifact">◆ ARTEFATO '+(c.artUsed?'(usado)':'')+'</button><button data-r13action="potion">🧪 POÇÃO ('+e.potions+')</button><button data-r13action="tonico_mana">🌙 MP ('+v24Count('tonico_mana')+')</button><button data-r13action="antidoto">🌿 ANTÍDOTO ('+v24Count('antidoto')+')</button><button data-r13action="bomba_esporos">🍄 BOMBA ('+v24Count('bomba_esporos')+')</button><button data-r13action="escudo_folha">🍃 ESCUDO ('+v24Count('escudo_folha')+')</button><button data-r13action="run">↩ RECUAR</button></div><div class="r13-combat-log" role="log" aria-live="polite" aria-label="Histórico do combate">'+c.logs.slice(0,5).map(x=>'<p>'+escape(x)+'</p>').join('')+'</div></div>';
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
 const tasks=epicObjectives(),complete=tasks.filter(x=>x[1]).length;const questList=$('r12Quests');if(questList)questList.innerHTML=tasks.map(([t,done])=>'<div class="r12-quest-row '+(done?'done':'')+'">'+(done?'✓ ':'◇ ')+escapeHtml(t)+'</div>').join('');$('r12Objective').textContent=epicCurrentObjective()+'.';$('r12Progress').style.width=Math.round((Math.min(e.chapter,7)+complete/Math.max(1,tasks.length))/7*100)+'%';$('r12Counter').textContent='Capítulo '+(Math.min(e.chapter,7)+1)+'/8';$('r12Inventory').innerHTML='<span class="r12-tag">🌱 '+st.found.length+'/3 sementes</span><span class="r12-tag">◆ '+e.items.length+' artefatos</span><span class="r12-tag">🧪 '+e.potions+' poções</span><span class="r12-tag">🪙 '+e.gold+' moedas RPG</span><span class="r12-tag">🎒 '+Object.values(v24Bag().bag).reduce((total,qty)=>total+Math.max(0,Number(qty)||0),0)+' consumíveis</span>';
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
  v29SetupUI();v30SetupUI();
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
function refreshEpicAvatar(){const v=visualData(),sig=JSON.stringify([v,epic().equipped.filter(id=>['anel_orvalho','broche_solar','capa_brisa','bracelete_casca','amuleto_luar'].includes(id))]);if(sig===epicAvatarSig)return;epicAvatarSig=sig;epicVisual=v;
 const canvas=document.createElement('canvas');canvas.width=24;canvas.height=34;const g=canvas.getContext('2d');g.imageSmoothingEnabled=false;
 const eq=v.equipped||{},c=v.av.c;
 // Capa atrás da manga: as peças escolhidas no guarda-roupa aparecem no mundo.
 if(eq.cape||hasEffect('swift')){g.fillStyle=(eq.cape||'leaf').includes('leaf')?'#5d973f':(eq.cape||'leaf').includes('dawn')?'#c67b33':(eq.cape||'leaf').includes('aurora')?'#398e99':(eq.cape||'leaf').includes('night')?'#27294f':'#5d417b';g.fillRect(4,8,16,22);g.fillRect(2,23,20,6);g.fillStyle='#292236';g.fillRect(2,29,4,2);g.fillRect(18,29,4,2)}
 const tmp=document.createElement('canvas');tmp.width=16;tmp.height=20;try{if(typeof drawAv==='function')drawAv(tmp,{c:Math.max(0,Math.min(7,Number(c)||0)),h:v.av.h||'none'});else{let gg=tmp.getContext('2d');gg.fillStyle='#f2b632';gg.fillRect(3,3,10,15)}}catch(ex){}
 g.drawImage(tmp,4,4,16,22);
 if(eq.body){g.fillStyle=eq.body.includes('prism')?'#657fc2':eq.body.includes('amber')?'#b87d40':'#6b4c37';g.fillRect(7,19,10,4);g.fillStyle='#cdad74';g.fillRect(9,20,6,1)}
 if(eq.face){g.fillStyle=eq.face.includes('star')?'#e9ba78':eq.face.includes('prism')?'#6abdcf':'#45334e';g.fillRect(7,17,10,3);g.fillStyle='#d6b1e5';g.fillRect(9,17,2,1);g.fillRect(13,17,2,1)}
 if(v.face==='spirit'){g.fillStyle='#88ffbe';g.fillRect(9,17,2,2);g.fillRect(14,17,2,2)}
 if(v.face==='scared'||v.face==='sleepy'){g.fillStyle='#251828';g.fillRect(12,21,2,2)}if(v.face==='joyful'){g.fillStyle='#251828';g.fillRect(9,21,7,1)}if(v.face==='fierce'){g.fillStyle='#fff1ae';g.fillRect(8,16,3,1);g.fillRect(14,16,3,1)}
 if(eq.head && !['none','sprout-pin',v.av.h].includes(eq.head)){g.fillStyle=eq.head.includes('witch')||eq.head.includes('mushroom')?'#634a84':eq.head.includes('crown')||eq.head.includes('circlet')?'#ffc756':eq.head.includes('storm')?'#8bd9eb':'#3d4764';g.fillRect(7,2,10,4);g.fillRect(4,5,16,2)}
 if(eq.hand){g.fillStyle=eq.hand.includes('staff')?'#76dbec':eq.hand.includes('torch')?'#ffb862':'#e0c47c';g.fillRect(21,13,2,15);g.fillRect(19,13,6,3)}
 if(v.classId==='arcanista'){g.fillStyle='#87d4f2';g.fillRect(20,11,2,5)}else if(v.classId==='rastreador'){g.fillStyle='#f39b55';g.fillRect(20,12,2,6)}else if(v.classId==='guardiao'){g.fillStyle='#7fc96c';g.fillRect(20,14,2,5)}
 if(hasEffect('bloom')){g.fillStyle='#8be6dc';g.fillRect(17,10,4,4)}if(hasEffect('focus')){g.fillStyle='#ffd166';g.fillRect(4,13,5,5)}if(hasEffect('ward')){g.fillStyle='#b9ccae';g.fillRect(3,20,4,7)}if(hasEffect('moonrise')){g.fillStyle='#b5a2fa';g.fillRect(11,2,4,3)}
  epicAvatarCanvas=canvas;
}
function renderAvatarToCanvas(target,w,h,inBattle=false){if(!target)return;refreshEpicAvatar();const g=target.getContext('2d');g.clearRect(0,0,w,h);g.imageSmoothingEnabled=false;if(!epicAvatarCanvas)return;
 const ratio=Math.min(w/24,h/34)*.91,szW=24*ratio,szH=34*ratio;g.drawImage(epicAvatarCanvas,(w-szW)/2,(h-szH)/2,szW,szH)}
function drawEpicAvatar(x,y){refreshEpicAvatar();const moving=Math.abs(player.vx)+Math.abs(player.vy)>.1,cadence=keys.run?21:14,bob=moving?Math.sin(clock*cadence)*(keys.run?2.6:1.6):Math.sin(clock*2.5)*.55;
 ctx.save();ctx.fillStyle='#121925aa';ctx.beginPath();ctx.ellipse(x,y+10,12,4,0,0,Math.PI*2);ctx.fill();ctx.translate(x,y-14+bob);if(v31Rooms.has(st.map)&&v31State().small)ctx.scale(.50,.50);
 if(player.vx<-.1)ctx.scale(-1,1);
 const sway=moving?Math.sin(clock*cadence)*(keys.run?.065:.036):Math.sin(clock*2)*.012;ctx.rotate(sway);
 ctx.imageSmoothingEnabled=false;
 if(epicVisual.equipped?.aura){ctx.strokeStyle=epicVisual.equipped.aura.includes('ember')?'#ffc05baa':epicVisual.equipped.aura.includes('aurora')?'#6ff9d5aa':'#9fbcf0aa';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,-2,25+Math.sin(clock*5)*2,27,0,0,Math.PI*2);ctx.stroke()}
 if(epicAvatarCanvas)ctx.drawImage(epicAvatarCanvas,-21,-39,42,60);if(keys.run&&moving){ctx.fillStyle='#caf2b888';ctx.fillRect(-14,25,6,3);ctx.fillRect(8,23,7,3)}
 if(moving){const foot=Math.sin(clock*cadence)*(keys.run?6:4);ctx.fillStyle='#44332e';ctx.fillRect(-10,19+foot,7,5);ctx.fillRect(4,19-foot,7,5)}
 if(epicVisual.equipped?.companion){ctx.shadowColor=epicVisual.equipped.companion.includes('owl')?'#b5a2ff':'#f8f39b';ctx.shadowBlur=10;ctx.fillStyle=epicVisual.equipped.companion.includes('owl')?'#ac99ff':'#e8ed73';ctx.beginPath();ctx.arc(23,-24+Math.sin(clock*7)*3,3.5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0}
 ctx.restore();}

/* V29: scene objects are painted in Canvas and react to the same interaction button. */
/* V30.2 — unique pixel props, animated forest roots and atrium floor. */
function v30DrawActor(a,x,y,bob){
 const q=v30State(),pulse=.55+Math.sin(clock*2.5+a.x)*.3,still=matchMedia('(prefers-reduced-motion: reduce)').matches;
 ctx.save();ctx.imageSmoothingEnabled=false;
 const col=a.v30==='stone'?'#e5d18f':a.v30==='record'?'#a7e0d5':'#91f2b0';
 ctx.fillStyle='#09171caa';ctx.beginPath();ctx.ellipse(x,y+15,19,6,0,0,Math.PI*2);ctx.fill();
 ctx.shadowColor=col;ctx.shadowBlur=5+15*pulse;
 if(a.v30==='chime'){
  rect(x-14,y-13,28,28,'#4c6662');rect(x-11,y-22,22,12,'#9f9c7d');drawGlyph(x,y-6,'♫','#f8e4a4');
 }else if(a.v30==='sentinel'){
  rect(x-15,y-24,30,44,'#3b3759');rect(x-10,y-39,20,19,'#7d81b0');rect(x-7,y-32,5,4,'#e5d7a1');rect(x+3,y-32,5,4,'#e5d7a1');
 }else if(a.v30==='ayla'){
  drawCharacter(x,y-6+bob,'#4f8976','#e8b995',false);drawGlyph(x,y-42,'✦','#f8e4a4');
 }else if(a.v30==='intro'){
  rect(x-9,y-8,18,28,'#654936');rect(x-7,y-13,14,15,'#8a6747');
  rect(x-3,y-26,6,18,'#d2ad73');
  for(let i=0;i<3;i++){let r=17+i*7,c='#80d899';ctx.strokeStyle=c;ctx.lineWidth=2;
   ctx.globalAlpha=.35+i*.11;ctx.beginPath();ctx.arc(x,y-7,r,Math.PI*1.04,Math.PI*1.96);ctx.stroke()}
  drawGlyph(x,y-35+(still?0:bob),'♪','#ffe0a1');
 }else if(a.v30==='vision'){
  rect(x-21,y+5,42,6,'#6a755d');rect(x-16,y-4,32,12,'#3e604c');
  for(let i=0;i<3;i++){const offset=still?0:Math.sin(clock*2+i)*2;
   rect(x-13+i*13,y-18+offset,6,18,'#76bf9d');}
  drawGlyph(x,y-29,'✧','#ecdbac');
 }else if(a.v30==='stone'){
  rect(x-16,y-8,32,22,'#4f5962');rect(x-12,y-18,24,12,'#778b82');
  rect(x-8,y-20,16,4,'#d2cb9e');
  const glyph={v30StoneSeed:'♧',v30StoneWater:'≈',v30StoneLight:'✦'}[a.id]||'✧';
  drawGlyph(x,y-5+bob,glyph,q.sequence>0?'#fcf3ba':'#b6e8cd');
  ctx.strokeStyle='#c7ddbd';ctx.lineWidth=2;ctx.strokeRect(x-17,y-19,34,33);
 }else if(a.v30==='gate'){
  rect(x-24,y-16,8,37,'#674f48');rect(x+16,y-16,8,37,'#674f48');
  rect(x-23,y-27,46,12,'#96785b');
  rect(x-16,y-15,32,36,q.opened?'#357a63':'#283b3e');
  for(let i=0;i<4;i++)rect(x-10+i*6,y-22+(i%2)*9,4,8,'#d2c394');
  drawGlyph(x,y-3,'◇',q.opened?'#aff0bb':'#9fb49e');
 }else if(a.v30==='keeper'){
  drawCharacter(x,y-6+bob,'#576878','#dfbd99',false);
  rect(x-9,y-9+bob,18,5,'#c7c7a0');
  rect(x+9,y-24+bob,8,2,'#e7d291');
  drawGlyph(x,y-43+bob,'✦','#b8e7be');
 }else if(a.v30==='record'){
  rect(x-19,y-16,38,34,'#655a62');rect(x-14,y-21,28,9,'#99918b');
  rect(x-11,y-8,22,3,'#afddbd');rect(x-11,y,17,3,'#dfcfac');rect(x-11,y+8,20,2,'#afddbd');
  drawGlyph(x,y-32+(still?0:bob),'✧',col);
 }else if(a.v30==='return'){
  ctx.strokeStyle='#a1efb3';ctx.lineWidth=3;
  ctx.beginPath();ctx.ellipse(x,y-4,19,11,0,0,2*Math.PI);ctx.stroke();
  rect(x-11,y-31,22,22,'#3c6b50');drawGlyph(x,y-20,'↩','#edebba');
 }
 ctx.shadowBlur=0;ctx.globalAlpha=.65+Math.sin(clock*2)*.15;
 ctx.strokeStyle=col;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y+15,19,7,0,0,2*Math.PI);ctx.stroke();
 ctx.restore();
}
function v30Decor(){
 if(st.map!=='floresta'&&st.map!=='atrioRaizes'&&st.map!=='bosqueEcos')return;
 const q=v30State(),still=matchMedia('(prefers-reduced-motion: reduce)').matches;
 ctx.save();ctx.imageSmoothingEnabled=false;
 if(st.map==='floresta'){
  // Ancient roots point towards the sealed gate and the three rune stones.
  for(let i=0;i<21;i++){
   const x=(i*11+3)%COLS,y=(i*7+4)%ROWS;
   ctx.fillStyle=i%3===0?'#587e4e':'#456a43';
   rect(x*T+4,y*T+18,24,6);rect(x*T+13,y*T+12,5,14);
   if(i%4===0){ctx.fillStyle='#93c89b';rect(x*T+16,y*T+11,4,4)}
  }
  if(q.started){
   ctx.save();ctx.globalAlpha=.28+Math.sin(clock*2)*.13;
   ctx.fillStyle='#b0e9b1';for(let i=0;i<16;i++){
    const px=((i*73+61)%755),py=60+((i*101)%340);
    rect(px,py+(still?0:Math.sin(clock+i)*3),3,3);
   }ctx.restore();
  }
 }
 if(st.map==='bosqueEcos'){
  for(let i=0;i<18;i++){const px=((i*103+37)%(COLS*T)),py=((i*59+91)%(ROWS*T));rect(px,py,13,3,i%3?'#6c9b77':'#a5b87a');rect(px+4,py-5,3,8,'#547f67')}
  ctx.save();ctx.globalAlpha=.18+Math.sin(clock*2)*.09;for(let i=0;i<12;i++)rect((i*71+42)%(COLS*T),(i*41+63)%(ROWS*T),4,4,'#c9e9b2');ctx.restore();
 }
 if(st.map==='atrioRaizes'){
  // A new compact dungeon tile pattern rather than a recolored copy of the Forest.
  for(let x=1;x<COLS-1;x++)for(let y=1;y<ROWS-1;y++){
   const bx=x*T,by=y*T;
   ctx.fillStyle=(x+y)%2?'#334e52':'#2d414b';
   rect(bx+1,by+1,T-2,T-2);
   ctx.fillStyle='#61726c';rect(bx+3,by+3,T-6,2);
   if((x*3+y*5)%8===0){ctx.fillStyle='#9fbea0';rect(bx+15,by+15,4,4)}
  }
  rect(4*T,7*T,16*T,3,'#7b857a');
  rect(11*T,4*T,3,8*T,'#7b857a');
  for(let i=0;i<5;i++){
   ctx.fillStyle='#c5aa73';rect((5+i*3)*T,8*T,7,8);
   ctx.fillStyle='#a5e6c1';rect((5+i*3)*T+2,8*T+2,3,3);
  }
 }
 ctx.restore();
}
function v29DrawActor(a,x,y,bob){
 ctx.save();const glow=.65+Math.sin(clock*2.3+a.x)*.2;
 const hue=a.v29==='find'?'#8eddd2':a.v29==='clue'?'#f3cf88':'#dfbaf9';
 ctx.globalAlpha=.65;ctx.fillStyle='#091b27';ctx.beginPath();ctx.ellipse(x,y+16,17,5,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
 if(a.v29==='enemy'){
  drawEpicEnemy(a,x,y,bob);ctx.strokeStyle='#e7b7f4';ctx.lineWidth=1.5;ctx.setLineDash([4,5]);
  ctx.beginPath();ctx.ellipse(x,y-8,24+Math.sin(clock*2)*2,13,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
 }else if(a.v29==='npc'){
  const tint=a.id==='v29Iris'?'#579aad':a.id==='v29Mara'?'#6e9b64':'#d39c62';
  const scarf=a.id==='v29Iris'?'#efbd83':a.id==='v29Mara'?'#b5d29f':'#e6d49d';
  drawCharacter(x,y-6+bob,tint,'#ecc4a1',a.id==='v29Iris');
  rect(x-10,y-7+bob,20,5,scarf);rect(x+5,y-20+bob,3,3,'#f8f0cf');
  if(a.id==='v29Iris'){rect(x+11,y-11+bob,12,16,'#e0c69e');rect(x+13,y-8+bob,8,2,'#70614e')}
  if(a.id==='v29Mara')drawGlyph(x+16,y-25+bob,'❀','#b1e1b2');
  if(a.id==='v29Caio')rect(x-11,y-30+bob,22,6,'#66523c');
 }else{
  ctx.shadowColor=hue;ctx.shadowBlur=9+glow*10;
  if(a.id==='v29Relogio'){
   rect(x-19,y-18,38,33,'#554638');rect(x-15,y-17,30,27,'#e0c492');
   ctx.fillStyle='#2c3c45';ctx.beginPath();ctx.arc(x,y-4,10,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle='#f4dbb1';ctx.lineWidth=2;ctx.beginPath();
   ctx.moveTo(x,y-4);ctx.lineTo(x,y-11);ctx.moveTo(x,y-4);ctx.lineTo(x+7,y-2);ctx.stroke();
  }else if(a.id==='v29Casca'){
   rect(x-13,y-22,27,45,'#5a412d');rect(x-8,y-19,17,40,'#a58d59');
   drawGlyph(x,y-6,'♮','#f9df98');
  }else if(a.id==='v29Biruta'){
   rect(x-2,y-28,4,48,'#a0a29c');
   ctx.fillStyle='#ecc487';ctx.beginPath();ctx.moveTo(x+1,y-26);
   ctx.lineTo(x+25+Math.sin(clock*2)*4,y-17);ctx.lineTo(x+1,y-8);ctx.fill();
  }else if(a.id==='v29Carrilhao'){
   rect(x-24,y-23,48,5,'#907958');rect(x-19,y-20,4,39,'#645346');rect(x+16,y-20,4,39,'#645346');
   for(let i=0;i<3;i++){const yy=y-9+Math.sin(clock*2+i)*2;
    rect(x-15+i*12,yy,9,19,'#e8c691');rect(x-12+i*12,yy+3,3,11,'#fff2c9')}
   drawGlyph(x,y-33,'♫','#fff2c6');
  }else if(a.id==='v29Copa'){
   rect(x-17,y-10,34,24,'#61472d');ctx.fillStyle='#528c65';
   ctx.beginPath();ctx.arc(x,y-29,27,0,Math.PI*2);ctx.fill();
   ctx.fillStyle='#91c987';ctx.beginPath();ctx.arc(x-11,y-35,13,0,Math.PI*2);ctx.fill();
   drawGlyph(x,y-45,'♪','#fff2cc');
  }else if(a.v29==='dailyBoard'){
   rect(x-19,y-18,38,32,'#5f4a35');rect(x-15,y-15,30,25,'#dac58d');
   rect(x-11,y-10,23,2,'#5e6a4d');rect(x-11,y-4,16,2,'#5e6a4d');
   drawGlyph(x+14,y-25,'✎','#f5dbac');
  }else if(a.v29==='dailySpot'){
   rect(x-12,y-10+bob,24,21,'#d6c994');rect(x-8,y-5+bob,16,12,'#46676b');
   drawGlyph(x,y-18+bob,'⌕','#d5ffe5');
  }else if(a.v29==='find'){
   rect(x-13,y-11+bob,26,23,'#d2c5a3');rect(x-10,y-8+bob,20,17,'#334b56');
   rect(x-7,y-5+bob,14,2,'#f7daa3');rect(x-7,y+bob,9,2,'#89cfc2');
   drawGlyph(x+10,y-17+bob,'✦','#abf1d0');
  }else drawGlyph(x,y-9+bob,'◇',hue);
  ctx.shadowBlur=0;ctx.strokeStyle=hue;ctx.lineWidth=1;ctx.globalAlpha=.65+Math.sin(clock*2)*.17;
  ctx.beginPath();ctx.ellipse(x,y+14,16,6,0,0,Math.PI*2);ctx.stroke();
 }
 ctx.restore();
}
function v29Decor(){
 const motes={vila:'#ffe0a0',floresta:'#99dfb3',planicie:'#eac98a',ruinas:'#bfb6ec',
  estufa:'#ebc88e',bosque:'#c6b2dd',mina:'#99cbe2',pantano:'#add8db',observatorio:'#d2bdff'};
 const c=motes[st.map];if(!c)return;
 const still=matchMedia('(prefers-reduced-motion: reduce)').matches||
  document.documentElement.classList.contains('sm165-lowfx');
 ctx.save();ctx.globalAlpha=.3;
 for(let i=0;i<24;i++){
  const tileX=1+Math.floor(random(i,st.map.length,23)*(COLS-2));
  const tileY=1+Math.floor(random(i,st.map.length,61)*(ROWS-2));
  const offset=still?0:Math.sin(clock*1.2+i*2.4)*2;
  ctx.fillStyle=c;ctx.fillRect(tileX*T+4,tileY*T+8+offset,2+(i%3),2+(i%2));
 }
 ctx.restore();
}
function drawEpicEnemy(a,x,y,bob){const type=epicMonsters[a.id];const m=EPIC_ENEMIES[type];if(!m)return;ctx.save();ctx.fillStyle='#160d2ba4';ctx.beginPath();ctx.ellipse(x,y+17,20,6,0,0,Math.PI*2);ctx.fill();ctx.shadowColor= m.element==='shadow'?'#d485fc':m.element==='nature'?'#79db6f':'#e3d683';ctx.shadowBlur=8+Math.sin(clock*3)*3;pixelSprite(m.sprite,x,y-16+bob,70,65);ctx.restore()}
function drawEpicActor(a,x,y,bob){
 const newNPC=({maira:'maira',oldAmalia:'amalia',alchemist:'tito'})[a.id];
 if(a.epic==='npc'&&newNPC&&v23Sprites[newNPC]?.complete&&v23Sprites[newNPC].naturalWidth){
  ctx.save();const im=v23Sprites[newNPC];const still=matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('sm165-lowfx');
  ctx.imageSmoothingEnabled=false;ctx.drawImage(im,(still?0:Math.floor(clock*3+a.x)%4)*48,0,48,48,x-23,y-41+bob,46,46);ctx.restore();return;
 }
 if(a.epic==='enemy')drawEpicEnemy(a,x,y,bob);
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

 function actorVisible(a){if(a.v31)return v31ActorVisible(a);if(a.v30)return v303ActorVisible(a)&&v30ActorVisible(a);if(a.v29)return v29ActorVisible(a);if(a.epic)return epicActorVisible(a);if(a.type==='seed'&&st.found.includes(a.id))return false;if(a.id==='reliquia'&&!st.unlocked)return false;return true}
 function interact(a){
  if(a?.v31){v31Interact(a);return;}
  if(a?.v30){v30Interact(a);return;}
  if(a?.v29){v29Interact(a);return;}
   if(a?.epic){epicInteract(a);return;}
  if(!a){say('Pomar','Não há nada para investigar aqui. Aproxime-se de um brilho, personagem ou construção.');return}
  if(a.id==='guildBoard'){v23DailyRender();say('Quadro de Contratos','Os pedidos da Vila são renovados diariamente. Complete tarefas na aventura e resgate sementes locais no quadro abaixo do mapa. São recompensas locais, não entram no ranking oficial.');return}
  if(a.id==='guarda'){const first=!st.seen.includes('guarda');st.seen.push('guarda');v23DailyMark('bento');save();say('Guardião Bento',first?'Sam! O pomar está perdendo sua luz. Três Sementes Ancestrais foram levadas para a floresta. Encontre-as e o Santuário das Raízes voltará a despertar.':'Se precisar de ajuda, caminhe pela passagem ao norte. Quando recuperar as três sementes, procure o portão a leste da floresta.',()=>{if(first)log('Bento pediu que eu reunisse três sementes escondidas na floresta.')});return}
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
 function action(){if(!visible||dialogOpen||window.SamCutscenes?.isPlaying)return;interact(nearest())}
 function collide(x,y){if(x<.48||y<.48||x>COLS-.48||y>ROWS-.48)return true;
  const r=v31Rooms.has(st.map)&&v31State().small?.16:.35;
  for(const b of room().blocks){if(x+r>b.x&&x-r<b.x+b.w&&y+r>b.y&&y-r<b.y+b.h)return true}
  for(const t of room().props){if(Math.hypot(x-t.x,y-t.y)<(t.type==='tree'?.72:.5))return true}
  return false}
 function random(x,y,m=97){let v=Math.sin(x*127.1+y*311.7+m*91.7)*43758.5453;return v-Math.floor(v)}
 function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.floor(x),Math.floor(y),Math.ceil(w),Math.ceil(h))}
 function pixelSprite(name,x,y,w,h=w){const im=sprite(name);if(im.complete&&im.naturalWidth){ctx.drawImage(im,x-w/2,y-h/2,w,h);return true}return false}
 function baseMap(){let rm=room();rect(0,0,W,H,rm.floor);
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
   const px=x*T,py=y*T,h=random(x,y,st.map==='vila'?31:st.map==='floresta'?17:9);
   v24Tile(px,py,x,y,h);
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
 function drawTree(x,y,dead=false,scale=1){
  const im=v24Trees[dead?'arvore_destruida':(['ruinas','bosque','pantano','coracao'].includes(st.map)?'arvore_danificada':'arvore_saudavel')];
  if(im.complete&&im.naturalWidth){
   const still=matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('sm165-lowfx');
   const frame=still?0:Math.floor(clock*1.8+x)%4;
   ctx.save();ctx.imageSmoothingEnabled=false;
   ctx.drawImage(im,frame*48,0,48,48,x*T-31*scale,y*T-29*scale,62*scale,62*scale);
   ctx.restore();return;
  }
  ctx.save();ctx.translate(x*T,y*T);ctx.scale(scale,scale);const sway=Math.sin(clock*1.5+x)*1.2;
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
 function drawActor(a){if(!actorVisible(a))return;const x=a.x*T,y=a.y*T,bob=Math.sin(clock*3+a.x)*2;ctx.save();if(a.v31){v31DrawActor(a,x,y,bob);ctx.restore();return}if(a.v30){v30DrawActor(a,x,y,bob);ctx.restore();return}if(a.v29){v29DrawActor(a,x,y,bob);ctx.restore();return}if(a.epic){drawEpicActor(a,x,y,bob);ctx.restore();return;}
  if(['passage','door','halloween','defense','shop','profile','social','board'].includes(a.type)){
   const alpha=.47+Math.sin(clock*3+a.x)*.27;ctx.globalAlpha=alpha;ctx.strokeStyle=actorColor(a.type);ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y-4,19,10,0,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
   if(a.type==='passage'){rect(x-8,y-32,16,14,'#a5e6a9');rect(x-5,y-36,10,6,'#f3e3a3')}
   if(a.type==='door')drawGlyph(x,y,'❖','#e8cca0');
   if(a.type==='halloween')drawGlyph(x,y,'✦','#e29ef5');
   if(a.type==='shop')drawGlyph(x,y,'◆','#ffcd6f');
   if(a.type==='defense')drawGlyph(x,y,'⚔','#ffc28a');
   if(a.type==='profile')drawGlyph(x,y,'⌂','#bedefc');
   if(a.type==='social')drawGlyph(x,y,'♧','#b6f5cc');
   if(a.type==='board'){rect(x-17,y-26,34,27,'#6d4e41');rect(x-13,y-22,26,19,'#d9bd87');rect(x-9,y-17,17,2,'#876b54');rect(x-9,y-12,12,2,'#876b54');}
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
 function camera(){const z=host.classList.contains('sm-immersive')
    ?Math.max(W/(COLS*T),H/(ROWS*T))*1.055
    :(window.innerWidth<=540?1.65:1);
   const halfW=W/(2*z),halfH=H/(2*z);
   return {z,cx:Math.max(halfW,Math.min(W-halfW,player.x*T)),cy:Math.max(halfH,Math.min(H-halfH,player.y*T))};
 }
 function render(){const cam=camera();ctx.save();ctx.translate(W/2,H/2);ctx.scale(cam.z,cam.z);ctx.translate(-cam.cx,-cam.cy);
  baseMap();v24Decor();v29Decor();v30Decor();v31Decor();for(const b of room().blocks)drawBuilding(b);for(const p of room().props)drawTree(p.x,p.y,p.type==='dead');for(const a of room().actors)drawActor(a);guideDraw();drawPlayer();v23Atmosphere();
  const a=nearest();if(a){ctx.save();ctx.textAlign='center';ctx.font='bold 13px sans-serif';let line='E · '+a.label;let width=Math.min(280,ctx.measureText(line).width+22);let px=Math.min(W-width/2-8,Math.max(width/2+8,a.x*T));let py=Math.max(64,a.y*T-39);rect(px-width/2,py-20,width,25,'#1e1428ee');ctx.strokeStyle=actorColor(a.type);ctx.lineWidth=1;ctx.strokeRect(px-width/2,py-20,width,25);ctx.fillStyle='#ffebce';ctx.fillText(line,px,py-3);ctx.restore()}
  if(st.map==='ruinas'){ctx.fillStyle='#b8a3ff12';ctx.fillRect(0,0,W,H)}ctx.restore();
 }
 function tick(time){let dt=Math.min(.04,Math.max(0,(time-last)/1000||0));last=time;clock+=dt;
  if(visible&&!document.hidden){
   v23NpcRoutine();if(Math.floor(clock)%3===0&&Math.floor((clock-dt))%3!==0)v23DailyRender();
   if(!dialogOpen&&!window.SamCutscenes?.isPlaying){let dx=(keys.right?1:0)-(keys.left?1:0),dy=(keys.down?1:0)-(keys.up?1:0);
    if(touchDest){const a=touchDest;dx=a.x-player.x;dy=a.y-player.y;if(Math.hypot(dx,dy)<.3){touchDest=null;dx=dy=0}}
    const m=Math.hypot(dx,dy);if(m>0){dx/=m;dy/=m;const bag=v24Bag(),boost=Date.now()<bag.hasteUntil,run=keys.run&&bag.stamina>1,step=(run?(boost?6.4:5.4):3.45)*dt;if(run)bag.stamina=Math.max(0,bag.stamina-(boost?8:24)*dt);else bag.stamina=Math.min(hasEffect('swift')?140:100,bag.stamina+18*dt);player.vx=dx;player.vy=dy;
      if(!collide(player.x+dx*step,player.y))player.x+=dx*step;
      if(!collide(player.x,player.y+dy*step))player.y+=dy*step;
    }else{player.vx=player.vy=0;const bag=v24Bag();bag.stamina=Math.min(hasEffect('swift')?140:100,bag.stamina+22*dt)}
     const meter=document.getElementById('v24SprintMeter');if(meter){meter.max=hasEffect('swift')?140:100;meter.value=v24Bag().stamina;document.getElementById('v24SprintText').textContent=Math.round(v24Bag().stamina)+' fôlego'}
    if(time>nextSave){nextSave=time+900;save()}
   }
   render();guideUI();let a=nearest(),tip=a?'Pressione E ou INVESTIGAR para '+a.label+'.':'WASD/setas ou toque no mapa. Interaja com portais, NPCs e chefões. Aventure-se pela campanha.';
   if(tip!==lastTip){lastTip=tip;$('r12Tip').textContent=tip}
  }
  requestAnimationFrame(tick)
 }
 function bind(){
  const controlKeys={ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down',ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right'};
  document.addEventListener('keydown',e=>{if(!visible||dialogOpen||window.SamCutscenes?.isPlaying)return;const t=e.target;if(t&&(/INPUT|TEXTAREA|SELECT/.test(t.tagName)||t.isContentEditable))return;
   const k=controlKeys[e.key];if(k){keys[k]=true;e.preventDefault()}
   if(e.key==='q'||e.key==='Q'){e.preventDefault();if(!e.repeat)v31Toggle();return}
   if(e.key==='Shift'){keys.run=true;e.preventDefault()}
    if(e.key==='e'||e.key==='E'||e.key===' '){e.preventDefault();if(!e.repeat)action()}
  });
  document.addEventListener('keyup',e=>{const k=controlKeys[e.key];if(k)keys[k]=false;if(e.key==='Shift')keys.run=false});window.addEventListener('blur',()=>Object.keys(keys).forEach(k=>keys[k]=false));
  document.querySelectorAll('[data-r12move]').forEach(b=>{let name=b.dataset.r12move;
   b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture?.(e.pointerId);keys[name]=true;b.classList.add('pressed');touchDest=null});
   for(const type of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(type,()=>{keys[name]=false;b.classList.remove('pressed')});
  });
  $('r12Action').addEventListener('click',action);
  cv.addEventListener('pointerdown',e=>{if(dialogOpen||window.SamCutscenes?.isPlaying)return;const b=cv.getBoundingClientRect(),cam=camera();const x=(cam.cx+((e.clientX-b.left)/b.width*W-W/2)/cam.z)/T,y=(cam.cy+((e.clientY-b.top)/b.height*H-H/2)/cam.z)/T;
   const target=room().actors.find(a=>actorVisible(a)&&Math.hypot(x-a.x,y-a.y)<.85);
   if(target&&Math.hypot(player.x-target.x,player.y-target.y)<1.9){interact(target);return}
   touchDest={x:Math.max(.5,Math.min(COLS-.5,x)),y:Math.max(.5,Math.min(ROWS-.5,y))};
  });
  document.querySelectorAll('[data-r12open]').forEach(b=>b.addEventListener('click',()=>{const d=b.dataset.r12open;if(d==='shop')toShop();else if(d==='pets')toPets();else if(d==='halloween')toHalloween();else pane(d)}));
  $('r12Reset').addEventListener('click',()=>{if(!window.confirm('Reiniciar toda a campanha RPG (classes, atributos, artefatos, capítulos e exploração)? Loja, conquistas do site e demais modos serão preservados.'))return;st=blank();player.x=st.x;player.y=st.y;save();update();notify('Sua aventura explorável foi reiniciada.');showEpicClasses()});
 }
 const prevShow=window.showPane;
 if(typeof prevShow==='function')window.showPane=function(id){let result=prevShow.apply(this,arguments);const was=visible;visible=id==='rpgDlg';if(visible){window.SamMusic?.scene(v30SceneForRoom(st.map));if(storageKey()!==accountRpgKey){accountRpgKey=storageKey();const newData=JSON.parse(localStorage.getItem(accountRpgKey)||'null');st={...blank(),...(newData||{})};st.epic={...freshEpic(),...(st.epic||{}),stats:{...freshEpic().stats,...(st.epic?.stats||{})},flags:{...(st.epic?.flags||{})}};if(!rooms[st.map])st.map='vila';player.x=Number.isFinite(st.x)?st.x:11.7;player.y=Number.isFinite(st.y)?st.y:10.8;epicAvatarSig=''}syncEpicCrossModes();update();if(!epic().class)showEpicClasses();last=performance.now();if(!was){save();requestAnimationFrame(()=>cv.focus({preventScroll:true}))}}
   else if(was){if(document.getElementById('v24Shop')?.hidden===false)closeV24Shop();save();Object.keys(keys).forEach(k=>keys[k]=false);touchDest=null}return result};
 const targetVisible=()=>!host.hidden;
 setupEpicUI();v31Setup();initV24Shop();if(st.relic&&epic().chapter===0)advanceEpicChapter(1);bind();visible=targetVisible();update();if(visible&&!epic().class)showEpicClasses();requestAnimationFrame(tick);
 if(!st.seen.includes('welcome')){st.seen.push('welcome');save();}
 window.SamHybridRPG={openShop:openV24Shop,getShopCatalog:()=>V24_SHOP.map(x=>({...x})),interactById:(id)=>{const a=room().actors.find(a=>a.id===id);if(a)interact(a)},startBattle:(key)=>startCombat(key,Object.entries(epicMonsters).find(([a,b])=>b===key)?.[0]||key),chooseClass:(id)=>{document.querySelector('[data-r13class="'+id+'"]')?.click()},getState:()=>JSON.parse(JSON.stringify(st)),toggleBroto:v31Toggle,getV31Objective:v31Objective,getVitals:()=>({hp:epic().hp,maxHp:maxHealth(),mp:epic().mp,maxMp:maxMana(),stamina:v24Bag().stamina,maxStamina:hasEffect('swift')?140:100}),gotoRoom:(name)=>{if(rooms[name]){st.map=name;player.x=11;player.y=8;update();save()}},onDefenseResult:(won)=>epicDefenseReward(won),open:()=>window.showPane?.('rpgDlg')};
})();
