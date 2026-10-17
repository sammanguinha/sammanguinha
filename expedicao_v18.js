/* Sam Manguinha V18: A Expedição Astral — jogo tático offline, progressão local. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const levels=[
 {title:'Clareira das Três Luas',sub:'Encontre as mangas antes do último raio de luar.',dark:'#183b3a',floor:'#23493f',wall:'#172823',map:[
 '##################',
 '#S.....#........P#',
 '#.###..#..####...#',
 '#...#.....#......#',
 '###.#..M..#..M...#',
 '#...#.....#..###.#',
 '#.M....E.....#...#',
 '#.###...####.#.#.#',
 '#.......#....#...#',
 '#..E....#..H.....#',
 '#................#',
 '##################']},
 {title:'Vale dos Besouros Reais',sub:'Os guardiões das folhas marcham pelo vale.',dark:'#422735',floor:'#533342',wall:'#2c1b30',map:[
 '##################',
 '#S......#.....M.P#',
 '#.####..#..####..#',
 '#.....E....#.....#',
 '#..#....M..#..#..#',
 '#..#..###..#..#..#',
 '#.....#....#..E..#',
 '###...#..###.....#',
 '#..H..#.....#..M.#',
 '#.....E........#.#',
 '#................#',
 '##################']},
 {title:'Templo da Manga Celestial',sub:'O Rei das Pragas protege a última colheita.',dark:'#35295c',floor:'#483976',wall:'#24243e',map:[
 '##################',
 '#S..M............#',
 '#.###..#...####..#',
 '#...#..#.........#',
 '#...#..#..M..#...#',
 '#..E...#.....#...#',
 '#...##....##.....#',
 '#.............E..#',
 '#..###..B...###..#',
 '#...H.....M......#',
 '#...............P#',
 '##################']}
];
const W=18,H=12,C=40;
for(const l of levels){if(l.map.length!==H||l.map.some(row=>row.length!==W))throw Error('Mapa V18 inválido: '+l.title);}
const names=[['🥭','Primeira Manga Astral','Pegue sua primeira manga da expedição.'],['🌙','Clareira Salva','Conclua a Clareira das Três Luas.'],['🪲','Vale Purificado','Conclua o Vale dos Besouros Reais.'],['👑','Guardião Lendário','Conclua a Expedição Astral.'],['⚔️','Caçador de Pragas','Derrote 8 pragas nas expedições.'],['🛡️','Passos Impecáveis','Conclua uma região sem perder vida.']];
const idNames=['first','level1','level2','victory','hunter','untouched'];
const h=()=>String((()=>{try{return localStorage.getItem('sg_handle')}catch{return null}})()||'visitante').toLowerCase().replace(/[^a-z0-9_.-]/g,'').slice(0,30)||'visitante';
const saveKey=()=>`sm18_expedicao_${h()}`;
const legendKey=()=>`sm18_lendas_${h()}`;
const read=(k,fallback)=>{try{return JSON.parse(localStorage.getItem(k))??fallback}catch{return fallback}};
const write=(k,val)=>{try{localStorage.setItem(k,JSON.stringify(val));return true}catch{return false}};
const safeInt=(x,d=0)=>Number.isSafeInteger(x)&&x>=0?x:d;
const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const newGame=()=>({v:18,level:0,hp:9,maxHp:9,potions:2,score:0,kills:0,moves:0,clears:0,stageDamage:0,finished:false,paused:true,pos:null,tiles:null,enemies:null,mangos:0,log:'A expedição espera por um guardião.'});
let state=newGame(),sound=false,active=false,raf=0,focusBefore=null,lastHandle=h(),lastMove=0;
const root=document.createElement('section');root.className='pane sm18-expedition';root.id='sm18Expedition';root.hidden=true;root.setAttribute('aria-label','A Expedição Astral');root.innerHTML=`
 <div class="sm18-head"><span class="sm18-eyebrow">NOVA AVENTURA · V18</span><h2>✦ A Expedição Astral</h2><p>Uma jornada tática por três regiões. Colete todas as mangas, enfrente as pragas e encontre o portal. Seu progresso é salvo <strong>neste navegador</strong>.</p></div>
 <div class="sm18-game-layout"><div class="sm18-game-card">
  <div class="sm18-hud"><span id="sm18Lv">Região 1/3</span><span id="sm18Hp">♥ 9/9</span><span id="sm18Collect">🥭 0/3</span><span id="sm18Score">✦ 0 pts</span></div>
  <div class="sm18-canvas-wrap"><canvas id="sm18Canvas" width="720" height="480" aria-label="Tabuleiro da Expedição Astral. Use setas ou WASD para mover e Espaço para atacar." role="img"></canvas><div id="sm18Overlay" class="sm18-overlay"><h3 id="sm18OvTitle">Pronto para explorar?</h3><p id="sm18OvText">A aventura está esperando!</p><button type="button" id="sm18Resume">▶ Começar</button></div></div>
  <div class="sm18-controls" aria-label="Controles de toque"><button type="button" data-sm18-action="up" aria-label="Mover para cima">▲</button><button type="button" data-sm18-action="left" aria-label="Mover para esquerda">◀</button><button type="button" data-sm18-action="down" aria-label="Mover para baixo">▼</button><button type="button" data-sm18-action="right" aria-label="Mover para direita">▶</button><button type="button" data-sm18-action="attack" class="sm18-hit">⚔ Atacar</button><button type="button" data-sm18-action="heal" class="sm18-heal">🧪 Curar</button></div>
  <div class="sm18-game-actions"><button type="button" id="sm18Pause">⏸ Pausar</button><button type="button" id="sm18Restart">↺ Nova aventura</button><button type="button" id="sm18Sound" aria-pressed="false">♪ Som: não</button></div>
  <p id="sm18Status" role="status" aria-live="polite">Use as setas para começar.</p></div>
  <aside class="sm18-side"><div class="sm18-side-box"><small>CAPÍTULO ATUAL</small><h3 id="sm18Title"></h3><p id="sm18Lore"></p><div class="sm18-stat"><span>Inimigos derrotados</span><b id="sm18Kills">0</b></div><div class="sm18-stat"><span>Poções restantes</span><b id="sm18Potions">2</b></div><div class="sm18-stat"><span>Portais atravessados</span><b id="sm18Clears">0</b></div></div><div class="sm18-side-box"><small>COMO JOGAR</small><p><kbd>WASD</kbd> ou <kbd>← ↑ ↓ →</kbd> para andar. <kbd>Espaço</kbd> ataca pragas próximas. <kbd>Q</kbd> usa uma poção. <kbd>Esc</kbd> pausa.</p><p>O combate é por turnos: a cada ação sua, as pragas se movem. Chegue à <b>porta dourada</b> depois de recolher 3 mangas.</p></div><div class="sm18-side-box"><small>CONQUISTAS DA EXPEDIÇÃO</small><div id="sm18Achievements" class="sm18-achievements"></div><p class="sm18-fine">Medalhas cosméticas locais. Não alteram o ranking, XP ou saldo oficial do Supabase.</p></div></aside></div>`;
const panes=$('panes');if(!panes)throw Error('Painéis do Sam Manguinha não encontrados.');panes.append(root);
const nav=document.createElement('button');nav.type='button';nav.id='sm18Nav';nav.dataset.p='sm18Expedition';nav.innerHTML='<span aria-hidden="true">✦</span><span>Expedição V18</span>';
const tabs=document.querySelector('.areas .tabs2')||document.querySelector('.areas');tabs?.append(nav);
const portal=$('home')?.querySelector('.rpg-portal-grid');if(portal){const b=document.createElement('button');b.type='button';b.className='portal-card sm18-portal';b.id='sm18Portal';b.innerHTML='<div class="card-head"><span aria-hidden="true">✦</span><h3>Expedição Astral <span class="sm18-new">NOVO</span></h3></div><p>Três regiões jogáveis, inimigos táticos, manga celestial, chefão, conquistas e salvamento automático.</p><span class="sm18-portal-cta">Explorar agora →</span>';portal.prepend(b);b.addEventListener('click',open)}
function open(){if(typeof window.showPane==='function')window.showPane('sm18Expedition');else{document.querySelectorAll('#panes .pane').forEach(p=>p.hidden=p!==root);$('home').hidden=true;$('diary').hidden=true;root.hidden=false;}active=true;refreshAccount();showOverlay();draw();root.scrollIntoView({behavior:'smooth',block:'start'});}
nav.addEventListener('click',open);
// Hub compacto e vivo na página inicial, sem interferir na navegação existente.
const home=$('home');const hub=document.createElement('section');hub.id='sm18Hub';hub.className='sm18-hub';hub.innerHTML='<div class="sm18-hub-title"><div><span class="sm18-eyebrow">ATUALIZAÇÃO V18 · A LENDA DESPERTA</span><h2>🥭 O seu Pomar evoluiu.</h2><p>Uma nova expedição, coleções e desafios aguardam você.</p></div><button type="button" id="sm18HubPlay">✦ Iniciar Expedição</button></div><div class="sm18-hub-stats"><span><b id="sm18HomeChapter">1/3</b><small>Região astral</small></span><span><b id="sm18HomeMango">0</b><small>Mangas coletadas</small></span><span><b id="sm18HomeMedals">0/6</b><small>Medalhas locais</small></span></div>';
const homeFirst=home?.querySelector('.rpg-portal-section');if(homeFirst)homeFirst.before(hub);else home?.prepend(hub);
$('sm18HubPlay')?.addEventListener('click',open);
function createStage(index){const lv=levels[index];let pos=null,mangos=0;const enemies=[],tiles=lv.map.map((line,y)=>Array.from(line).map((ch,x)=>{if(ch==='S'){pos={x,y};return'.'}if(ch==='E'||ch==='B'){enemies.push({x,y,hp:ch==='B'?5:index===0?1:2,boss:ch==='B',id:`${index}:${x}:${y}`});return'.'}if(ch==='M'){mangos++;return'M'}return ch}));if(!pos||mangos!==3)throw Error('Mapa sem início ou 3 mangas');return {pos,tiles,enemies,mangos:0,stageDamage:0};}
function fresh(){state=newGame();Object.assign(state,createStage(0));persist();updateUi();}
function hydrate(){const x=read(saveKey(),null);if(!x||x.v!==18||x.level<0||x.level>2||!Array.isArray(x.tiles)||x.tiles.length!==H||!x.tiles.every(row=>Array.isArray(row)&&row.length===W)||!Array.isArray(x.enemies)||!x.pos||!Number.isInteger(x.pos.x)||!Number.isInteger(x.pos.y)||!Number.isInteger(x.hp)){fresh();return}state={...newGame(),...x,level:safeInt(x.level),hp:Math.max(0,Math.min(9,x.hp)),maxHp:9,potions:Math.min(9,safeInt(x.potions)),score:safeInt(x.score),kills:safeInt(x.kills),moves:safeInt(x.moves),clears:safeInt(x.clears),mangos:Math.min(3,safeInt(x.mangos)),paused:true};if(!inBounds(state.pos.x,state.pos.y)||state.enemies.some(e=>!inBounds(e.x,e.y)))fresh();updateUi();}
function refreshAccount(){const now=h();if(now!==lastHandle){lastHandle=now;hydrate()}else updateUi();}
function persist(){write(saveKey(),state)}
function medals(){const arr=read(legendKey(),[]);return Array.isArray(arr)?arr.filter(x=>idNames.includes(x)):[]}
function award(key){let got=medals();if(got.includes(key))return;got.push(key);write(legendKey(),got);const i=idNames.indexOf(key);if(i>=0)message('🏆 Medalha desbloqueada: '+names[i][1]);window.dispatchEvent(new CustomEvent('sm18:medal',{detail:{key}}));}
function updateUi(){const lv=levels[state.level];$('sm18Lv').textContent=`Região ${state.level+1}/3`;$('sm18Hp').textContent=`♥ ${state.hp}/${state.maxHp}`;$('sm18Collect').textContent=`🥭 ${state.mangos}/3`;$('sm18Score').textContent=`✦ ${state.score} pts`;$('sm18Title').textContent=lv.title;$('sm18Lore').textContent=lv.sub;$('sm18Kills').textContent=state.kills;$('sm18Potions').textContent=state.potions;$('sm18Clears').textContent=state.clears;$('sm18Pause').textContent=state.paused?'▶ Retomar':'⏸ Pausar';$('sm18Status').textContent=state.log;$('sm18HomeChapter').textContent=(state.level+1)+'/3';$('sm18HomeMango').textContent=state.mangos;$('sm18HomeMedals').textContent=medals().length+'/6';const el=$('sm18Achievements');el.replaceChildren();const got=medals();names.forEach(([emoji,title,desc],i)=>{const item=document.createElement('div');item.className='sm18-medal'+(got.includes(idNames[i])?' unlocked':'');const e=document.createElement('span');e.textContent=got.includes(idNames[i])?emoji:'🔒';const t=document.createElement('span');const b=document.createElement('b');b.textContent=got.includes(idNames[i])?title:'Medalha oculta';const small=document.createElement('small');small.textContent=desc;t.append(b,small);item.append(e,t);el.append(item)})}
function message(txt){state.log=txt;if($('sm18Status'))$('sm18Status').textContent=txt}
function inBounds(x,y){return x>=0&&x<W&&y>=0&&y<H}
function tile(x,y){return inBounds(x,y)?state.tiles[y][x]:'#'}
function wall(x,y){return tile(x,y)==='#'}
function enemyAt(x,y){return state.enemies.find(e=>e.x===x&&e.y===y)}
function distance(a,b){return Math.abs(a.x-b.x)+Math.abs(a.y-b.y)}
const pics={};for(const [key,path] of Object.entries({hero:'sam_idle.png',mango:'manga.png',bug:'besouro.png',boss:'rei_das_pragas_idle.png',seed:'semente.png'})){const im=new Image();im.src='sprites/'+path;pics[key]=im}
const canvas=$('sm18Canvas'),ctx=canvas.getContext('2d',{alpha:false});ctx.imageSmoothingEnabled=false;
function box(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h)}
function sprite(key,x,y,background){const im=pics[key];if(im?.complete&&im.naturalWidth){ctx.drawImage(im,x+3,y+3,C-6,C-6)}else{ctx.fillStyle=background;ctx.beginPath();ctx.arc(x+C/2,y+C/2,12,0,7);ctx.fill()}}
function draw(){if(!ctx)return;const lv=levels[state.level];box(0,0,720,480,lv.dark);for(let y=0;y<H;y++)for(let x=0;x<W;x++){const px=x*C,py=y*C,c=tile(x,y);box(px,py,C,C,(x+y)%2?lv.floor:lv.dark);if(c==='#'){box(px+2,py+2,C-4,C-4,lv.wall);box(px+3,py+3,C-6,5,'#7a855e28');}else{if((x*71+y*19+state.level*5)%11===0){box(px+9,py+11,3,3,'#bbd89033');box(px+20,py+29,2,3,'#c9e6a055')}if(c==='M')sprite('mango',px,py,'#ffcf5c');if(c==='H'){box(px+7,py+7,26,26,'#296a55');ctx.font='25px sans-serif';ctx.fillText('♥',px+9,py+30)}if(c==='P'){box(px+5,py+4,30,33,state.mangos===3?'#f3bd55':'#454561');box(px+11,py+9,18,25,state.mangos===3?'#ffed9c':'#8b7b98');box(px+15,py+15,10,18,lv.wall)}}}
for(const e of state.enemies){const px=e.x*C,py=e.y*C;sprite(e.boss?'boss':'bug',px,py,'#dd6658');box(px+5,py+2,Math.floor(30*e.hp/(e.boss?5:state.level===0?1:2)),3,e.boss?'#ffd585':'#ff7979')}
sprite('hero',state.pos.x*C,state.pos.y*C,'#ffda73');if(state.finished){box(0,0,720,480,'#150f1d88')} }
function audio(freq=460){if(!sound)return;try{const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;const ac=window.sm18Audio||(window.sm18Audio=new AudioCtx());if(ac.state==='suspended')ac.resume();const osc=ac.createOscillator(),gain=ac.createGain();osc.type='triangle';osc.frequency.setValueAtTime(freq,ac.currentTime);gain.gain.setValueAtTime(.025,ac.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.12);osc.connect(gain).connect(ac.destination);osc.start();osc.stop(ac.currentTime+.125)}catch{}}
function showOverlay(){const over=$('sm18Overlay');over.hidden=false;const title=$('sm18OvTitle'),desc=$('sm18OvText'),btn=$('sm18Resume');if(state.finished){title.textContent='🏆 A LENDA DESPERTOU!';desc.textContent=`Você concluiu a expedição com ${state.score} pontos e ${state.kills} pragas derrotadas!`;btn.textContent='↺ Começar nova expedição'}else if(state.hp===0){title.textContent='💔 O pomar precisa de você';desc.textContent=`Você chegou à região ${state.level+1}. Tente novamente, guardião!`;btn.textContent='↺ Recomeçar expedição'}else{title.textContent=`✦ ${levels[state.level].title}`;desc.textContent=`${levels[state.level].sub} As pragas se movimentam a cada ação.`;btn.textContent='▶ '+(state.moves?'Continuar':'Começar jornada')}updateUi()}
function hideOverlay(){if(state.finished||state.hp===0)return;state.paused=false;$('sm18Overlay').hidden=true;active=true;updateUi();persist();$('sm18Pause').focus({preventScroll:true})}
function pause(){if(root.hidden)return;state.paused=!state.paused;persist();if(state.paused)showOverlay();else {$('sm18Overlay').hidden=true;updateUi()}}
function finish(){state.finished=true;state.paused=true;state.clears=3;state.score+=200+state.hp*25;award('victory');message('🌟 Você libertou a Manga Celestial!');persist();showOverlay();draw();audio(880)}
function proceed(){if(state.mangos<3){message('Colete as 3 mangas para abrir o portal!');audio(180);return}if(state.level===2){if(state.enemies.some(e=>e.boss)){message('👑 O Rei das Pragas ainda protege o Templo. Derrote o chefão para atravessar!');audio(170);return}if(state.stageDamage===0)award('untouched');finish();return}if(state.stageDamage===0)award('untouched');if(state.level===0)award('level1');if(state.level===1)award('level2');const next=state.level+1;state.score+=75+state.hp*8;state.clears=next;state.hp=Math.min(9,state.hp+2);state.potions=Math.min(5,state.potions+1);state.level=next;Object.assign(state,createStage(next));state.paused=true;message('✨ Portal atravessado! Uma nova região desperta.');persist();showOverlay();draw();audio(650)}
function hit(enemy){enemy.hp--;state.score+=5;audio(250);message('⚔️ Golpe certeiro contra a praga!');if(enemy.hp<=0){state.enemies=state.enemies.filter(e=>e!==enemy);state.kills++;state.score+=25;message(enemy.boss?'👑 Rei das Pragas derrotado!':'🪲 Praga derrotada!');if(state.kills>=8)award('hunter')}}
function enemiesTurn(){const taken=new Set(state.enemies.map(e=>`${e.x},${e.y}`));for(const e of state.enemies){if(state.hp<=0)break;const dist=distance(e,state.pos);if(dist===1){state.hp--;state.stageDamage++;message('💔 Uma praga atacou! Recuar também é estratégia.');audio(160);continue}if(dist>7)continue;const dirs=[{x:Math.sign(state.pos.x-e.x),y:0},{x:0,y:Math.sign(state.pos.y-e.y)}];if(Math.abs(state.pos.y-e.y)>Math.abs(state.pos.x-e.x))dirs.reverse();for(const d of dirs){if(!d.x&&!d.y)continue;const nx=e.x+d.x,ny=e.y+d.y,key=`${nx},${ny}`;if(wall(nx,ny)||taken.has(key)||(nx===state.pos.x&&ny===state.pos.y)||tile(nx,ny)==='P')continue;taken.delete(`${e.x},${e.y}`);e.x=nx;e.y=ny;taken.add(key);break}}if(state.hp<=0){state.paused=true;message('As pragas venceram esta tentativa. Seu recorde local permanece.');persist();showOverlay()} }
function action(type){if(root.hidden||state.paused||state.finished||state.hp<=0)return;let turn=false;
if(type==='heal'){if(state.potions<=0){message('Você não tem poções restantes.');return}if(state.hp===state.maxHp){message('Sua vida já está completa.');return}state.potions--;state.hp=Math.min(state.maxHp,state.hp+4);message('🧪 Poção usada. +4 de vida!');audio(720);turn=true}
else if(type==='attack'){const e=state.enemies.find(x=>distance(x,state.pos)===1);if(!e){message('Nenhuma praga adjacente. Aproxime-se antes de atacar.');return}hit(e);turn=true}
else{const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[type];if(!d)return;const x=state.pos.x+d[0],y=state.pos.y+d[1];if(wall(x,y)){message('⛔ Caminho bloqueado.');return}const enemy=enemyAt(x,y);if(enemy){hit(enemy);turn=true}else if(tile(x,y)==='P'){proceed();return}else{state.pos={x,y};turn=true;if(tile(x,y)==='M'){state.tiles[y][x]='.';state.mangos++;state.score+=50;message(`🥭 Manga astral ${state.mangos}/3 coletada!`);award('first');audio(850);if(state.mangos===3)message('🌟 Portal dourado aberto! Siga até ele.')}else if(tile(x,y)==='H'){state.tiles[y][x]='.';state.hp=Math.min(state.maxHp,state.hp+3);message('♥ Fonte da floresta: +3 de vida!');audio(720)}else message(levels[state.level].title+' · siga buscando mangas.')}}
if(turn){state.moves++;enemiesTurn();persist();updateUi();draw()}}
$('sm18Resume').addEventListener('click',()=>{if(state.finished||state.hp===0){fresh();showOverlay();draw();return}hideOverlay()});
$('sm18Pause').addEventListener('click',pause);
$('sm18Restart').addEventListener('click',()=>{if(!confirm('Iniciar nova aventura? A partida atual será reiniciada; medalhas já conquistadas permanecem.'))return;fresh();showOverlay();draw()});
$('sm18Sound').addEventListener('click',()=>{sound=!sound;$('sm18Sound').setAttribute('aria-pressed',String(sound));$('sm18Sound').textContent='♪ Som: '+(sound?'sim':'não');if(sound)audio(540)});
root.querySelectorAll('[data-sm18-action]').forEach(b=>b.addEventListener('click',()=>action(b.dataset.sm18Action)));
document.addEventListener('keydown',e=>{if(root.hidden||!active||e.altKey||e.ctrlKey||e.metaKey)return;if(e.target.closest('input,textarea,select,[contenteditable]'))return;const key=e.key.toLowerCase(),k={arrowup:'up',w:'up',arrowdown:'down',s:'down',arrowleft:'left',a:'left',arrowright:'right',d:'right',' ':'attack',q:'heal',escape:'pause'}[key];if(!k)return;e.preventDefault();if(e.repeat&&Date.now()-lastMove<100)return;lastMove=Date.now();if(k==='pause')pause();else action(k)});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&active&&!state.paused&&!root.hidden){state.paused=true;persist();showOverlay()}});
const obs=new MutationObserver(()=>{if(root.hidden&&active){active=false;if(!state.paused){state.paused=true;persist()}}});obs.observe(root,{attributes:true,attributeFilter:['hidden']});
window.addEventListener('sm18:account-changed',refreshAccount);
window.addEventListener('sm18:defense-ended',e=>{const result=e.detail||{};if(result.won&&result.ranked)message('🎖️ Vitória oficial no Defesa reconhecida. Continue sua expedição!')});
hydrate();draw();
window.SamExpedicao18=Object.freeze({version:'18.0.0',open,getSnapshot:()=>({level:state.level,hp:state.hp,mangos:state.mangos,pos:{...state.pos},score:state.score,kills:state.kills,finished:state.finished,medals:medals().slice()})});
})();
