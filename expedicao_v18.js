/* Sam Manguinha V18: A Expedição Astral — jogo tático offline, progressão local. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const levels=[
 {title:'Clareira das Três Luas',sub:'Encontre as mangas antes do último raio de luar.',dark:'#183b3a',floor:'#23493f',wall:'#172823',map:[
 '##################',
 '#S.R...#........P#',
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
 '#S..R...#.....M.P#',
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
 '#S..M.R..........#',
 '#.###..#...####..#',
 '#...#..#.........#',
 '#...#..#..M..#...#',
 '#..E...#.....#...#',
 '#...##....##.....#',
 '#.............E..#',
 '#..###..B...###..#',
 '#...H.....M......#',
 '#...............P#',
 '##################']},
 {title:'Biblioteca das Raízes',sub:'As memórias do pomar estão aprisionadas entre raízes antigas.',dark:'#253b43',floor:'#244452',wall:'#15242f',map:[
 '##################',
 '#S...M...#.....P.#',
 '#.###....#..##...#',
 '#...#....#...A...#',
 '#...#..E....#....#',
 '#......###..#.M..#',
 '#..E....R...#....#',
 '#...###....##....#',
 '#..H...#.....E...#',
 '#......#..M......#',
 '#................#',
 '##################']},
 {title:'Coração do Eclipse',sub:'A última sombra do Rei das Pragas ameaça todas as colheitas.',dark:'#402e56',floor:'#493961',wall:'#23152f',map:[
 '##################',
 '#S....#.....M...P#',
 '#.##...#...####..#',
 '#..E...#.........#',
 '#......#..M..#...#',
 '#...#....###.....#',
 '#...#.A........#.#',
 '#......#...E.....#',
 '#.####....B.###..#',
 '#..H...M......R..#',
 '#................#',
 '##################']}
];
const W=18,H=12,C=40;
const chapters=[
 [{who:'Nara, a Cartógrafa',text:'As três luas estão desaparecendo. O pomar guarda cinco caminhos e nenhum deles é seguro.'},{who:'Sam',text:'Se cada manga celestial devolver um pouco de luz, seguirei até a última árvore.'},{who:'Nara',text:'Use sua lâmina, mas observe: cada passo acorda as pragas. As fontes curam, e as relíquias contam a história.'}],
 [{who:'Nara',text:'Os besouros eram guardiões. Uma voz antiga os convenceu de que os frutos eram veneno.'},{who:'Sam',text:'Então não lutarei só por mangas. Quero descobrir quem espalhou essa mentira.'},{who:'Nara',text:'Uma passagem no vale leva ao templo. Ouça o que as raízes escondem.'}],
 [{who:'Arauto das Pragas',text:'Vocês vieram até meu trono achando que o fim da maldição se esconde aqui?'},{who:'Sam',text:'Entregue a Manga Celestial. Não vou permitir que o pomar caia.'},{who:'Arauto das Pragas',text:'Derrote-me e verá: sou apenas a sombra que guardava a verdadeira passagem.'}],
 [{who:'Eco da Primeira Árvore',text:'Há muito, o pomar foi salvo por guardiões que juraram dividir a colheita.'},{who:'Nara',text:'O pacto foi quebrado, e o Rei das Pragas nasceu da fome e do medo.'},{who:'Sam',text:'Vou recuperar os fragmentos do pacto. Ainda há tempo de plantar algo diferente.'}],
 [{who:'Rei das Pragas',text:'Todas as raízes obedecerão ao eclipse. Nenhuma manga ficará para os outros.'},{who:'Sam',text:'Um pomar que cresce apenas para um rei já está morto.'},{who:'Nara',text:'Esta é a última travessia. Proteja seu coração, reúna energia e liberte o pomar!'}]
];
const relicTexts=[
 'Um mapa lunar mostra os cinco caminhos escondidos pela névoa.',
 'Uma inscrição lembra que os besouros eram protetores do vale.',
 'A coroa partida revela que o guardião do templo era apenas um arauto.',
 'O juramento esquecido: ninguém deveria dominar sozinho a colheita.',
 'A semente de luz contém a força necessária para romper o eclipse.'
];
for(const l of levels){if(l.map.length!==H||l.map.some(row=>row.length!==W))throw Error('Mapa V18 inválido: '+l.title);}
const names=[['🥭','Primeira Manga Astral','Pegue sua primeira manga da expedição.'],['🌙','Clareira Salva','Conclua a Clareira das Três Luas.'],['🪲','Vale Purificado','Conclua o Vale dos Besouros Reais.'],['👑','Guardião Lendário','Conclua a Expedição Astral.'],['⚔️','Caçador de Pragas','Derrote 8 pragas nas expedições.'],['🛡️','Passos Impecáveis','Conclua uma região sem perder vida.'],['📜','Memórias do Pomar','Encontre 2 relíquias da história.'],['🌱','Pacto Renovado','Recupere os fragmentos das regiões finais.']];
const idNames=['first','level1','level2','victory','hunter','untouched','memories','pact'];
const h=()=>String((()=>{try{return localStorage.getItem('sg_handle')}catch{return null}})()||'visitante').toLowerCase().replace(/[^a-z0-9_.-]/g,'').slice(0,30)||'visitante';
const saveKey=()=>`sm19_expedicao_${h()}`;
const oldSaveKey=()=>`sm18_expedicao_${h()}`;
const legendKey=()=>`sm18_lendas_${h()}`;
const read=(k,fallback)=>{try{return JSON.parse(localStorage.getItem(k))??fallback}catch{return fallback}};
const write=(k,val)=>{try{localStorage.setItem(k,JSON.stringify(val));return true}catch{return false}};
const safeInt=(x,d=0)=>Number.isSafeInteger(x)&&x>=0?x:d;
const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const newGame=()=>({v:19,level:0,hp:10,maxHp:10,potions:2,score:0,kills:0,moves:0,clears:0,stageDamage:0,finished:false,paused:true,pos:null,tiles:null,enemies:null,mangos:0,energy:1,shield:0,relics:0,seenScenes:[],log:'A expedição espera por um guardião.'});
let state=newGame(),sound=false,active=false,raf=0,focusBefore=null,lastHandle=h(),lastMove=0,dialogOpen=false,dialogQueue=[],dialogIndex=0,sceneKey='';
const root=document.createElement('section');root.className='pane sm18-expedition';root.id='sm18Expedition';root.hidden=true;root.setAttribute('aria-label','A Expedição Astral');root.innerHTML=`
 <div class="sm18-head"><span class="sm18-eyebrow">NOVA AVENTURA · V19</span><h2>✦ A Expedição Astral</h2><p>Cinco capítulos de uma aventura tática com história, novos inimigos, relíquias, poderes e batalhas épicas. Colete as mangas e restaure o pacto do pomar. Seu progresso é salvo <strong>neste navegador</strong>.</p></div>
 <div class="sm18-game-layout"><div class="sm18-game-card">
  <div class="sm18-hud"><span id="sm18Lv">Região 1/5</span><span id="sm18Hp">♥ 10/10</span><span id="sm18Collect">🥭 0/3</span><span id="sm18Score">✦ 0 pts</span><span id="sm19Energy">✴ 1/3 energia</span><span id="sm19Relics">📜 0 relíquias</span></div>
  <div class="sm18-canvas-wrap"><canvas id="sm18Canvas" width="720" height="480" aria-label="Tabuleiro da Expedição Astral. Use setas ou WASD para mover e Espaço para atacar." role="img"></canvas><div id="sm18Overlay" class="sm18-overlay"><h3 id="sm18OvTitle">Pronto para explorar?</h3><p id="sm18OvText">A aventura está esperando!</p><button type="button" id="sm18Resume">▶ Começar</button></div><div id="sm19Dialog" class="sm19-dialog" hidden role="dialog" aria-label="História da Expedição" aria-modal="false"><div class="sm19-dialog-header"><span class="sm19-dialog-sigil">✦</span><strong id="sm19Speaker"></strong><span id="sm19DialogProgress"></span></div><p id="sm19DialogText"></p><button type="button" id="sm19DialogNext">Continuar →</button></div><div id="sm19Vignette" aria-hidden="true"></div></div>
  <div class="sm18-controls" aria-label="Controles de toque"><button type="button" data-sm18-action="up" aria-label="Mover para cima">▲</button><button type="button" data-sm18-action="left" aria-label="Mover para esquerda">◀</button><button type="button" data-sm18-action="down" aria-label="Mover para baixo">▼</button><button type="button" data-sm18-action="right" aria-label="Mover para direita">▶</button><button type="button" data-sm18-action="attack" class="sm18-hit">⚔ Atacar</button><button type="button" data-sm18-action="heal" class="sm18-heal">🧪 Curar</button><button type="button" data-sm18-action="pulse" class="sm19-pulse">✴ Pulso</button><button type="button" data-sm18-action="guard" class="sm19-guard">🛡 Defender</button></div>
  <div class="sm18-game-actions"><button type="button" id="sm18Pause">⏸ Pausar</button><button type="button" id="sm18Restart">↺ Nova aventura</button><button type="button" id="sm18Sound" aria-pressed="false">♪ Som: não</button></div>
  <p id="sm18Status" role="status" aria-live="polite">Use as setas para começar.</p></div>
  <aside class="sm18-side"><div class="sm18-side-box"><small>CAPÍTULO ATUAL</small><h3 id="sm18Title"></h3><p id="sm18Lore"></p><div class="sm18-stat"><span>Inimigos derrotados</span><b id="sm18Kills">0</b></div><div class="sm18-stat"><span>Poções restantes</span><b id="sm18Potions">2</b></div><div class="sm18-stat"><span>Portais atravessados</span><b id="sm18Clears">0</b></div></div><div class="sm18-side-box sm19-journal"><small>O DIÁRIO DA EXPEDIÇÃO</small><p id="sm19Quest">Encontre as mangas e siga o rastro das luas.</p><div id="sm19ChapterTimeline" class="sm19-timeline"></div><button type="button" id="sm19Replay">📖 Relembrar a história</button></div><div class="sm18-side-box"><small>COMO JOGAR</small><p><kbd>WASD</kbd> ou <kbd>← ↑ ↓ →</kbd> para andar. <kbd>Espaço</kbd> ataca pragas próximas. <kbd>Q</kbd> usa uma poção. <kbd>F</kbd> lança um pulso em área (3 energias). <kbd>G</kbd> assume guarda por um turno. <kbd>Esc</kbd> pausa.</p><p>O combate é por turnos: a cada ação sua, as pragas se movem. Chegue à <b>porta dourada</b> depois de recolher 3 mangas. Colete relíquias secretas <b>📜</b> e use a guarda para absorver ataques. Cada ação sua desperta um turno inimigo.</p></div><div class="sm18-side-box"><small>CONQUISTAS DA EXPEDIÇÃO</small><div id="sm18Achievements" class="sm18-achievements"></div><p class="sm18-fine">Medalhas cosméticas locais. Não alteram o ranking, XP ou saldo oficial do Supabase.</p></div></aside></div>`;
const panes=$('panes');if(!panes)throw Error('Painéis do Sam Manguinha não encontrados.');panes.append(root);
const nav=document.createElement('button');nav.type='button';nav.id='sm18Nav';nav.dataset.p='sm18Expedition';nav.innerHTML='<span aria-hidden="true">✦</span><span>Expedição V19</span>';
const tabs=document.querySelector('.areas .tabs2')||document.querySelector('.areas');tabs?.append(nav);
const portal=$('home')?.querySelector('.rpg-portal-grid');if(portal){const b=document.createElement('button');b.type='button';b.className='portal-card sm18-portal';b.id='sm18Portal';b.innerHTML='<div class="card-head"><span aria-hidden="true">✦</span><h3>Expedição Astral <span class="sm18-new">NOVO</span></h3></div><p>Cinco capítulos, narrativa interativa, relíquias, novos poderes, chefões e efeitos animados.</p><span class="sm18-portal-cta">Explorar agora →</span>';portal.prepend(b);b.addEventListener('click',open)}
function open(){if(typeof window.showPane==='function')window.showPane('sm18Expedition');else{document.querySelectorAll('#panes .pane').forEach(p=>p.hidden=p!==root);$('home').hidden=true;$('diary').hidden=true;root.hidden=false;}active=true;refreshAccount();showOverlay();draw();ensureLoop();root.scrollIntoView({behavior:'smooth',block:'start'});}
nav.addEventListener('click',open);
// Hub compacto e vivo na página inicial, sem interferir na navegação existente.
const home=$('home');const hub=document.createElement('section');hub.id='sm18Hub';hub.className='sm18-hub';hub.innerHTML='<div class="sm18-hub-title"><div><span class="sm18-eyebrow">ATUALIZAÇÃO V19 · O ECLIPSE SE APROXIMA</span><h2>🥭 O seu Pomar evoluiu.</h2><p>Uma nova expedição, coleções e desafios aguardam você.</p></div><button type="button" id="sm18HubPlay">✦ Iniciar Expedição</button></div><div class="sm18-hub-stats"><span><b id="sm18HomeChapter">1/5</b><small>Região astral</small></span><span><b id="sm18HomeMango">0</b><small>Mangas coletadas</small></span><span><b id="sm18HomeMedals">0/8</b><small>Medalhas locais</small></span></div>';
const homeFirst=home?.querySelector('.rpg-portal-section');if(homeFirst)homeFirst.before(hub);else home?.prepend(hub);
$('sm18HubPlay')?.addEventListener('click',open);
function createStage(index){const lv=levels[index];let pos=null,mangos=0;const enemies=[],tiles=lv.map.map((line,y)=>Array.from(line).map((ch,x)=>{if(ch==='S'){pos={x,y};return'.'}if(ch==='E'||ch==='A'||ch==='B'){const boss=ch==='B',spider=ch==='A',hp=boss?(index===4?9:6):spider?3:index===0?1:index>=3?3:2;enemies.push({x,y,hp,maxHp:hp,boss,spider,kind:!boss&&!spider&&index>=3?'wisp':'bug',id:`${index}:${x}:${y}`,cool:0});return'.'}if(ch==='M'){mangos++;return'M'}return ch}));if(!pos||mangos!==3)throw Error('Mapa sem início ou 3 mangas');return {pos,tiles,enemies,mangos:0,stageDamage:0};}
function fresh(){state=newGame();Object.assign(state,createStage(0));persist();updateUi();}
function hydrate(){let x=read(saveKey(),null);if(!x){x=read(oldSaveKey(),null);if(x&&x.v===18){const wasFinished=!!x.finished;x={...x,v:19,energy:1,shield:0,relics:0,seenScenes:[],maxHp:10,finished:false};if(wasFinished){x.level=3;x.clears=3;Object.assign(x,createStage(3));}write(saveKey(),x);}}
if(!x||x.v!==19||!Number.isInteger(x.level)||x.level<0||x.level>=levels.length||!Array.isArray(x.tiles)||x.tiles.length!==H||!x.tiles.every(row=>Array.isArray(row)&&row.length===W)||!Array.isArray(x.enemies)||!x.pos||!Number.isInteger(x.pos.x)||!Number.isInteger(x.pos.y)||!Number.isInteger(x.hp)){fresh();return}
state={...newGame(),...x,level:x.level,hp:Math.max(0,Math.min(10,x.hp)),maxHp:10,potions:Math.min(9,safeInt(x.potions)),score:safeInt(x.score),kills:safeInt(x.kills),moves:safeInt(x.moves),clears:safeInt(x.clears),mangos:Math.min(3,safeInt(x.mangos)),energy:Math.min(3,safeInt(x.energy,1)),shield:Math.min(1,safeInt(x.shield)),relics:Math.min(5,safeInt(x.relics)),seenScenes:Array.isArray(x.seenScenes)?x.seenScenes.filter(v=>typeof v==='string').slice(-30):[],paused:true};
if(!inBounds(state.pos.x,state.pos.y)||state.enemies.some(e=>!inBounds(e.x,e.y))){fresh();return}
state.enemies.forEach(e=>{e.maxHp=e.maxHp||((e.boss&&state.level===4)?9:(e.boss?6:(e.spider?3:Math.max(1,e.hp))));e.cool=safeInt(e.cool)});
updateUi();}

function refreshAccount(){const now=h();if(now!==lastHandle){lastHandle=now;dialogOpen=false;dialogQueue=[];$('sm19Dialog').hidden=true;hydrate();if(!root.hidden)showOverlay()}else updateUi();}
function persist(){write(saveKey(),state)}
function medals(){const arr=read(legendKey(),[]);return Array.isArray(arr)?arr.filter(x=>idNames.includes(x)):[]}
function award(key){let got=medals();if(got.includes(key))return;got.push(key);write(legendKey(),got);const i=idNames.indexOf(key);if(i>=0)message('🏆 Medalha desbloqueada: '+names[i][1]);window.dispatchEvent(new CustomEvent('sm18:medal',{detail:{key}}));}
function updateUi(){const lv=levels[state.level];$('sm18Lv').textContent=`Região ${state.level+1}/${levels.length}`;$('sm18Hp').textContent=`♥ ${state.hp}/${state.maxHp}`;$('sm18Collect').textContent=`🥭 ${state.mangos}/3`;$('sm18Score').textContent=`✦ ${state.score} pts`;$('sm19Energy').textContent=`✴ ${state.energy}/3 energia`;$('sm19Relics').textContent=`📜 ${state.relics} relíquias`; $('sm18Title').textContent=lv.title;$('sm18Lore').textContent=lv.sub;$('sm18Kills').textContent=state.kills;$('sm18Potions').textContent=state.potions;$('sm18Clears').textContent=state.clears;$('sm18Pause').textContent=state.paused?'▶ Retomar':'⏸ Pausar';$('sm18Status').textContent=state.log;$('sm18HomeChapter').textContent=(state.level+1)+'/'+levels.length;$('sm18HomeMango').textContent=state.mangos;$('sm18HomeMedals').textContent=medals().length+'/'+idNames.length;$('sm19Quest').textContent=state.finished?'O pacto foi renovado. O pomar respira novamente.':state.mangos<3?`Recolha ${3-state.mangos} manga(s), explore as runas e alcance o portal.`:'Portal carregado! Vença o guardião se houver um e avance.';$('sm19ChapterTimeline').textContent=levels.map((l,i)=>i===state.level?'✦ ':i<state.level?'✓ ':'○ ').join(' ');const el=$('sm18Achievements');el.replaceChildren();const got=medals();names.forEach(([emoji,title,desc],i)=>{const item=document.createElement('div');item.className='sm18-medal'+(got.includes(idNames[i])?' unlocked':'');const e=document.createElement('span');e.textContent=got.includes(idNames[i])?emoji:'🔒';const t=document.createElement('span');const b=document.createElement('b');b.textContent=got.includes(idNames[i])?title:'Medalha oculta';const small=document.createElement('small');small.textContent=desc;t.append(b,small);item.append(e,t);el.append(item)})}
function showScene(key,lines){if(state.seenScenes.includes(key)||!Array.isArray(lines)||!lines.length)return;dialogQueue=lines;dialogIndex=0;sceneKey=key;dialogOpen=true;state.paused=true;const el=$('sm19Dialog');el.hidden=false;updateDialog();persist();}
function updateDialog(){const line=dialogQueue[dialogIndex];if(!line)return;$('sm19Speaker').textContent=line.who;$('sm19DialogText').textContent=line.text;$('sm19DialogProgress').textContent=`${dialogIndex+1}/${dialogQueue.length}`;$('sm19DialogNext').textContent=dialogIndex===dialogQueue.length-1?'✦ Voltar à aventura':'Continuar →';}
function advanceDialog(){if(!dialogOpen)return;dialogIndex++;if(dialogIndex<dialogQueue.length){updateDialog();return}dialogOpen=false;$('sm19Dialog').hidden=true;if(!state.seenScenes.includes(sceneKey))state.seenScenes.push(sceneKey);state.paused=false;persist();updateUi();}
$('sm19DialogNext').addEventListener('click',advanceDialog);
$('sm19Replay').addEventListener('click',()=>{if(root.hidden||state.paused||state.hp<=0||state.finished)return;state.seenScenes=state.seenScenes.filter(k=>k!=='chapter-'+state.level);showScene('chapter-'+state.level,chapters[state.level])});
function message(txt){state.log=txt;if($('sm18Status'))$('sm18Status').textContent=txt}
function inBounds(x,y){return x>=0&&x<W&&y>=0&&y<H}
function tile(x,y){return inBounds(x,y)?state.tiles[y][x]:'#'}
function wall(x,y){return tile(x,y)==='#'}
function enemyAt(x,y){return state.enemies.find(e=>e.x===x&&e.y===y)}
function distance(a,b){return Math.abs(a.x-b.x)+Math.abs(a.y-b.y)}
/* Motor cinematográfico V19: sprites do repositório + animação real no Canvas. */
const reducedMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches||false;
const pics={};
const assets={hero:'sam_idle.png',walk:'sam_andando_1.png',strike:'sam_atacando.png',mango:'manga.png',bug:'besouro.png',spider:'aranha_infectada.png',boss:'rei_das_pragas_idle.png',seed:'semente.png',potion:'pocao.png',tree:'arvore_saudavel.png',wisp:'espirito_lunar_v19.svg',relic:'reliquia_lunar_v19.svg',portal:'portal_astral_v19.svg'};
for(const [key,path] of Object.entries(assets)){const im=new Image();im.decoding='async';im.src='sprites/'+path;im.onload=()=>{if(!root.hidden)draw()};pics[key]=im}
const canvas=$('sm18Canvas'),ctx=canvas.getContext('2d',{alpha:false});
if(!ctx)throw Error('Não foi possível iniciar o Canvas da Expedição.');
ctx.imageSmoothingEnabled=false;
let particles=[],floats=[],tween=null,attackUntil=0,shakeUntil=0,flashUntil=0,ringUntil=0,ambientFrame=0,lastFrame=0,ambientSeed=17;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const rnd=(n)=>{const x=Math.sin(n*127.1+ambientSeed*311.7)*43758.5453123;return x-Math.floor(x)};
function box(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h)}
function imageSprite(key,x,y,w=C-6,h=C-6){const im=pics[key];if(im?.complete&&im.naturalWidth){ctx.drawImage(im,x,y,w,h);return true}return false}
function dot(x,y,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
function glow(x,y,r,color){const g=ctx.createRadialGradient(x,y,2,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'#0000');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)}
function emit(x,y,color,count=12,speed=2){if(reducedMotion)return;for(let k=0;k<count;k++){const angle=(k/count)*Math.PI*2+rnd(k+performance.now())*.35,power=speed*(.5+rnd(k*21+performance.now()));particles.push({x,y,vx:Math.cos(angle)*power,vy:Math.sin(angle)*power-.55,life:1,size:2+rnd(k*38)*3,color})}particles=particles.slice(-125)}
function floatText(x,y,value,color='#ffe5a0'){floats.push({x:x*C+C/2,y:y*C+2,text:String(value),color,life:1});floats=floats.slice(-22)}
function feedback(type,x,y){const px=x*C+C/2,py=y*C+C/2;const colors={move:'#a4eeae',hit:'#ff9078',mango:'#f9d978',heal:'#7ef1c4',pulse:'#cfadff',portal:'#f4cc85',shield:'#8fcdfc',relic:'#d2d4fa'};emit(px,py,colors[type]||'#ffffff',type==='pulse'?35:12,type==='pulse'?4:2.2);if(type==='hit'){attackUntil=performance.now()+240;shakeUntil=performance.now()+165;flashUntil=performance.now()+145}if(type==='pulse'){ringUntil=performance.now()+430;shakeUntil=performance.now()+260}if(type==='portal'){ringUntil=performance.now()+780;shakeUntil=performance.now()+140}}
function tweenMove(before){if(!before||reducedMotion){tween=null;return}const actors={hero:before.hero};before.enemies.forEach(e=>{actors[e.id]={x:e.x,y:e.y}});tween={at:performance.now(),from:actors,duration:170}}
function drawEntity(key,x,y,time,boss=false,spider=false,stance=false){const px=x*C,py=y*C,bob=reducedMotion?0:Math.sin(time/270+x*1.8+y)*1.8;
 ctx.save();
 dot(px+C/2,py+C-3,boss?17:12,'#0008');
 if(boss){glow(px+C/2,py+C/2,30,'#dc70ff72');ctx.translate(px+C/2,py+C/2);ctx.rotate(Math.sin(time/410)*.045);ctx.translate(-px-C/2,-py-C/2)}
 const bobScale=stance?1.14:1;
 ctx.translate(px+C/2,py+C/2+bob);ctx.scale(bobScale,stance?0.93:1);ctx.translate(-px-C/2,-py-C/2);
 if(!imageSprite(key,px+2,py+2,C-4,C-4)){dot(px+C/2,py+C/2,boss?17:12,boss?'#a567d3':spider?'#cc6b81':'#ebcd7a');ctx.fillStyle='#171b2e';ctx.fillRect(px+14,py+17,4,4);ctx.fillRect(px+23,py+17,4,4)}
 ctx.restore()}
function actorPos(entity,id,time){if(!tween)return {x:entity.x,y:entity.y};const old=tween.from[id];if(!old)return{x:entity.x,y:entity.y};const p=clamp((time-tween.at)/tween.duration,0,1),ease=1-Math.pow(1-p,3);return{x:old.x+(entity.x-old.x)*ease,y:old.y+(entity.y-old.y)*ease}}
function tileGround(x,y,lv,time){const px=x*C,py=y*C,ch=tile(x,y),n=rnd(x*19+y*43+state.level*197);
 box(px,py,C,C,(x+y)%2?lv.floor:lv.dark);
 if(ch==='#'){box(px+1,py+2,C-2,C-3,lv.wall);box(px+3,py+3,C-6,4,'#d4d2b21a');box(px+4,py+33,C-8,4,'#080f19a0');if(n>.6){box(px+7,py+8,3,19,'#afd9b41e');box(px+26,py+21,3,14,'#729cb41c')}return}
 if(n>.17){box(px+Math.floor(n*23),py+Math.floor(rnd(y*29+x)*27),3,3,'#b5daa347')}
 if(n>.83){ctx.strokeStyle='#58a37872';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(px+8,py+33);ctx.lineTo(px+9,py+27);ctx.lineTo(px+14,py+23);ctx.stroke()}
 if(n<.08){dot(px+28,py+13,2,'#a8f9c751')}
 if(ch==='M'){glow(px+20,py+20,26,'#ffda527a');drawEntity('mango',x,y-(reducedMotion?0:Math.sin(time/440+x)*.07),time)}
 if(ch==='H'){glow(px+20,py+20,23,'#64e9a279');box(px+7,py+9,26,23,'#245d62');box(px+9,py+11,22,19,'#368e7d');ctx.fillStyle='#d4ffdb';ctx.font='bold 23px sans-serif';ctx.fillText('♥',px+10,py+30)}
 if(ch==='R'){glow(px+20,py+20,25,'#a1b5ff83');if(!imageSprite('relic',px+5,py+4,31,32)){box(px+13,py+7,15,23,'#ccc3ee');dot(px+20,py+17,3,'#fff5d9')}}
 if(ch==='P'){const open=state.mangos===3;glow(px+20,py+20,open?33:21,open?'#f9bd48b0':'#ad8dd659');if(!imageSprite('portal',px+2,py+2,36,36)){box(px+5,py+3,30,35,open?'#9c682e':'#494261');box(px+8,py+6,24,32,open?'#fbd56e':'#887a9b')}if(open){for(let k=0;k<3;k++)dot(px+13+k*6,py+20+Math.sin(time/220+k)*7,2,'#fff7aa')}}}
function draw(time=performance.now()){if(!ctx||!state?.tiles)return;
 ambientFrame=time;
 const lv=levels[state.level];ctx.save();
 const shaking=!reducedMotion&&time<shakeUntil;
 const sx=shaking?Math.sin(time*.09)*2:0,sy=shaking?Math.cos(time*.12)*2:0;
 box(0,0,720,480,lv.dark);ctx.translate(sx,sy);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)tileGround(x,y,lv,time);
 for(let j=0;j<8;j++){const ax=rnd(j+73+state.level)*700,ay=rnd(j+87)*460;glow(ax,ay,28+Math.sin(time/800+j)*7,state.level===4?'#dc9beb17':'#a9ecd318')}
 if(time<ringUntil){const p=1-(ringUntil-time)/780;ctx.strokeStyle='rgba(244,203,130,'+(1-p)+')';ctx.lineWidth=4;ctx.beginPath();ctx.arc(state.pos.x*C+20,state.pos.y*C+20,Math.max(3,p*165),0,Math.PI*2);ctx.stroke()}
 for(const e of state.enemies){const ep=actorPos(e,e.id,time);const key=e.boss?'boss':e.spider?'spider':e.kind==='wisp'?'wisp':'bug';drawEntity(key,ep.x,ep.y,time,e.boss,e.spider);const width=32,den=e.maxHp||e.hp||1;box(ep.x*C+4,ep.y*C+1,width,4,'#210c1f');box(ep.x*C+4,ep.y*C+1,Math.max(0,width*e.hp/den),4,e.boss?'#f6d36b':'#ef7a79');if(distance(e,state.pos)===1||(e.kind==='wisp'&&distance(e,state.pos)===2)){ctx.strokeStyle=e.kind==='wisp'?'#b3d8ff9a':e.boss?'#f7c17f9a':'#dd666562';ctx.lineWidth=1.5;ctx.strokeRect(ep.x*C+1,ep.y*C+1,38,38)}}
 const hp=actorPos(state.pos,'hero',time),attacking=time<attackUntil;drawEntity(attacking?'strike':tween&&time-tween.at<tween.duration?'walk':'hero',hp.x,hp.y,time,false,false,attacking);
 if(state.shield){ctx.strokeStyle='#8fddff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(hp.x*C+20,hp.y*C+20,21+Math.sin(time/200)*1.5,0,Math.PI*2);ctx.stroke()}
 if(attacking){ctx.strokeStyle='#f6e39b';ctx.lineWidth=4;ctx.beginPath();ctx.arc(hp.x*C+20,hp.y*C+18,24,-1.2,1.4);ctx.stroke()}
 if(!reducedMotion){for(let k=0;k<24;k++){const x=rnd(k*3+401)*720,y=((rnd(k*19+743)*480+time*(.006+(k%3)*.004))%500)-10;dot(x,y,1.5+(k%3)*.3,'#c5e9bb'+(k%4===0?'66':'28'))}
 const delta=clamp((time-lastFrame)/16.6,.2,3);
 particles=particles.filter(p=>p.life>0);for(const p of particles){p.x+=p.vx*delta;p.y+=p.vy*delta;p.vy+=.065*delta;p.life-=.04*delta;dot(p.x,p.y,p.size*clamp(p.life,0,1),p.color)}
 floats=floats.filter(f=>f.life>0);for(const f of floats){f.y-=.6*delta;f.life-=.025*delta;ctx.save();ctx.globalAlpha=clamp(f.life,0,1);ctx.font='bold 16px Pixelify Sans, sans-serif';ctx.textAlign='center';ctx.strokeStyle='#0c1224';ctx.lineWidth=4;ctx.strokeText(f.text,f.x,f.y);ctx.fillStyle=f.color;ctx.fillText(f.text,f.x,f.y);ctx.restore()}}
 if(time<flashUntil){box(0,0,720,480,'#ff777718')}
 const v=ctx.createRadialGradient(360,220,170,360,240,450);v.addColorStop(0,'#0000');v.addColorStop(1,'#08071c99');ctx.fillStyle=v;ctx.fillRect(0,0,720,480);
 ctx.restore();lastFrame=time;if(tween&&time-tween.at>tween.duration)tween=null}
function frame(t){if(root.hidden){raf=0;return}if(!document.hidden&&t-lastPaint>=30){draw(t);lastPaint=t}raf=requestAnimationFrame(frame)}
let lastPaint=0;
function ensureLoop(){if(!raf&&!root.hidden)raf=requestAnimationFrame(frame)}
function audio(freq=460){if(!sound)return;try{const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;const ac=window.sm18Audio||(window.sm18Audio=new AudioCtx());if(ac.state==='suspended')ac.resume();const osc=ac.createOscillator(),gain=ac.createGain();osc.type='triangle';osc.frequency.setValueAtTime(freq,ac.currentTime);gain.gain.setValueAtTime(.025,ac.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.12);osc.connect(gain).connect(ac.destination);osc.start();osc.stop(ac.currentTime+.125)}catch{}}
function showOverlay(){const over=$('sm18Overlay');over.hidden=false;const title=$('sm18OvTitle'),desc=$('sm18OvText'),btn=$('sm18Resume');if(state.finished){title.textContent='🏆 O PACTO DAS CINCO LUAS RENASCEU!';desc.textContent=`Você concluiu a expedição com ${state.score} pontos e ${state.kills} pragas derrotadas!`;btn.textContent='↺ Começar nova expedição'}else if(state.hp===0){title.textContent='💔 O pomar precisa de você';desc.textContent=`Você chegou à região ${state.level+1}. Tente novamente, guardião!`;btn.textContent='↺ Recomeçar expedição'}else{title.textContent=`✦ Capítulo ${state.level+1}: ${levels[state.level].title}`; desc.textContent=`${levels[state.level].sub} As pragas se movimentam a cada ação.`;btn.textContent='▶ '+(state.moves?'Continuar':'Começar jornada')}updateUi()}
function hideOverlay(){if(state.finished||state.hp===0)return;state.paused=false;$('sm18Overlay').hidden=true;active=true;updateUi();persist();showScene('chapter-'+state.level,chapters[state.level]);if(!dialogOpen)$('sm18Pause').focus({preventScroll:true})}
function pause(){if(root.hidden||dialogOpen)return;state.paused=!state.paused;persist();if(state.paused)showOverlay();else {$('sm18Overlay').hidden=true;updateUi()}}
function finish(){feedback('portal',state.pos.x,state.pos.y);if(state.relics>=2)award('pact');state.finished=true;state.paused=true;state.clears=levels.length;state.score+=200+state.hp*25;award('victory');message('🌟 O eclipse terminou. O pacto do pomar foi renovado!');persist();showOverlay();draw();audio(880)}
function proceed(){if(state.mangos<3){message('Colete as 3 mangas para abrir o portal!');audio(180);return}if(state.enemies.some(e=>e.boss)){message('👑 Um guardião ainda protege este portal. Vença-o antes de avançar.');audio(170);return}if(state.level===levels.length-1){if(state.stageDamage===0)award('untouched');finish();return}if(state.stageDamage===0)award('untouched');if(state.level===0)award('level1');if(state.level===1)award('level2');if(state.level>=3&&state.relics>=2)award('pact');const next=state.level+1;state.score+=75+state.hp*8;state.clears=next;state.hp=Math.min(state.maxHp,state.hp+2);state.potions=Math.min(5,state.potions+1);feedback('portal',state.pos.x,state.pos.y);state.level=next;state.shield=0;state.energy=Math.min(3,state.energy+1);Object.assign(state,createStage(next));state.paused=true;message('✨ Portal atravessado! Uma nova região desperta.');persist();showOverlay();draw();audio(650)}
function hit(enemy,damage=1){feedback('hit',enemy.x,enemy.y);floatText(enemy.x,enemy.y,'-'+damage,'#ffb0a2');enemy.hp-=damage;state.score+=5*damage;audio(250);message('⚔️ Golpe certeiro contra a praga!');if(enemy.hp<=0){state.enemies=state.enemies.filter(e=>e!==enemy);state.kills++;state.score+=25;message(enemy.boss?'👑 Rei das Pragas derrotado!':'🪲 Praga derrotada!');if(state.kills>=8)award('hunter')}}
function enemiesTurn(){
 const taken=new Set(state.enemies.map(e=>`${e.x},${e.y}`));
 for(const e of state.enemies){
  if(state.hp<=0)break;
  if(e.cool>0)e.cool--;
  const dist=distance(e,state.pos),ranged=e.kind==='wisp'&&dist===2&&e.cool===0;
  if(dist===1||ranged){
   if(ranged){e.cool=2;feedback('pulse',e.x,e.y);floatText(e.x,e.y,'✦','#c3d9ff');}
   if(state.shield){feedback('shield',state.pos.x,state.pos.y);message('🛡️ Sua guarda absorveu o ataque!');state.shield=0;audio(470)}
   else {const dmg=e.boss?2:1;state.hp=Math.max(0,state.hp-dmg);state.stageDamage+=dmg;feedback('hit',state.pos.x,state.pos.y);floatText(state.pos.x,state.pos.y,'-'+dmg,'#ff8a98');message(ranged?'🌙 Um espírito lunar lançou energia à distância!':'💔 Uma praga atacou! Recuar também é estratégia.');audio(160);}
   continue;
  }
  if(dist>7)continue;
  /* Aranhas perseguem o jogador pelo eixo livre; espíritos só se aproximam até dispararem. */
  const dirs=[{x:Math.sign(state.pos.x-e.x),y:0},{x:0,y:Math.sign(state.pos.y-e.y)}];
  if(Math.abs(state.pos.y-e.y)>Math.abs(state.pos.x-e.x))dirs.reverse();
  for(const d of dirs){
   if(!d.x&&!d.y)continue;
   const nx=e.x+d.x,ny=e.y+d.y,key=`${nx},${ny}`;
   if(wall(nx,ny)||taken.has(key)||(nx===state.pos.x&&ny===state.pos.y)||tile(nx,ny)==='P')continue;
   taken.delete(`${e.x},${e.y}`);e.x=nx;e.y=ny;taken.add(key);break;
  }
 }
 if(state.hp<=0){state.paused=true;message('As pragas venceram esta tentativa. Seu recorde local permanece.');persist();showOverlay()}
}
function action(type){if(root.hidden||dialogOpen||state.paused||state.finished||state.hp<=0)return;let turn=false;const before={hero:{...state.pos},enemies:state.enemies.map(e=>({id:e.id,x:e.x,y:e.y}))};
if(type==='heal'){if(state.potions<=0){message('Você não tem poções restantes.');return}if(state.hp===state.maxHp){message('Sua vida já está completa.');return}state.potions--;state.hp=Math.min(state.maxHp,state.hp+4);feedback('heal',state.pos.x,state.pos.y);floatText(state.pos.x,state.pos.y,'+4','#81ffc8');message('🧪 Poção usada. +4 de vida!');audio(720);turn=true}
else if(type==='guard'){state.shield=1;feedback('shield',state.pos.x,state.pos.y);message('🛡️ Postura defensiva! Absorva o próximo golpe neste turno.');audio(410);turn=true}
else if(type==='pulse'){if(state.energy<3){message('✴ Seu pulso precisa de 3 energias. Colete mangas e explore para carregá-lo.');return}const targets=state.enemies.filter(e=>distance(e,state.pos)<=2);if(!targets.length){message('Não há pragas ao alcance do pulso.');return}state.energy=0;feedback('pulse',state.pos.x,state.pos.y);targets.slice().forEach(e=>hit(e,2));message(`✴ O pulso astral atingiu ${targets.length} praga(s)!`);audio(950);turn=true}
else if(type==='attack'){const e=state.enemies.find(x=>distance(x,state.pos)===1);if(!e){message('Nenhuma praga adjacente. Aproxime-se antes de atacar.');return}hit(e);turn=true}
else{const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[type];if(!d)return;const x=state.pos.x+d[0],y=state.pos.y+d[1];if(wall(x,y)){message('⛔ Caminho bloqueado.');return}const enemy=enemyAt(x,y);if(enemy){hit(enemy);turn=true}else if(tile(x,y)==='P'){proceed();return}else{state.pos={x,y};turn=true;feedback('move',x,y);if(tile(x,y)==='M'){state.tiles[y][x]='.';state.mangos++;state.score+=50;state.energy=Math.min(3,state.energy+1);feedback('mango',x,y);floatText(x,y,'+50','#fce48e');message(`🥭 Manga astral ${state.mangos}/3 coletada!`);award('first');audio(850);if(state.mangos===3)message('🌟 Portal dourado aberto! Siga até ele.')}else if(tile(x,y)==='R'){state.tiles[y][x]='.';state.relics++;state.energy=Math.min(3,state.energy+1);state.score+=85;feedback('relic',x,y);floatText(x,y,'+85','#d2d5ff');message('📜 Relíquia descoberta: '+relicTexts[Math.min(state.level,4)]);if(state.relics>=2)award('memories');}
else if(tile(x,y)==='H'){state.tiles[y][x]='.';state.hp=Math.min(state.maxHp,state.hp+3);feedback('heal',x,y);floatText(x,y,'+3','#7ff5cc');message('♥ Fonte da floresta: +3 de vida!');audio(720)}else message(levels[state.level].title+' · siga buscando mangas.')}}
if(turn){state.moves++;if(state.moves%5===0)state.energy=Math.min(3,state.energy+1);enemiesTurn();tweenMove(before);persist();updateUi();draw();}}
$('sm18Resume').addEventListener('click',()=>{if(state.finished||state.hp===0){fresh();showOverlay();draw();return}hideOverlay()});
$('sm18Pause').addEventListener('click',pause);
$('sm18Restart').addEventListener('click',()=>{if(!confirm('Iniciar nova aventura? A partida atual será reiniciada; medalhas já conquistadas permanecem.'))return;fresh();showOverlay();draw()});
$('sm18Sound').addEventListener('click',()=>{sound=!sound;$('sm18Sound').setAttribute('aria-pressed',String(sound));$('sm18Sound').textContent='♪ Som: '+(sound?'sim':'não');if(sound)audio(540)});
root.querySelectorAll('[data-sm18-action]').forEach(b=>b.addEventListener('click',()=>action(b.dataset.sm18Action)));
/* Deslizar para mover; um toque na casa adjacente interage com ela (mobile). */
let touchStart=null;
canvas.addEventListener('touchstart',e=>{if(e.touches.length!==1)return;const t=e.touches[0];touchStart={x:t.clientX,y:t.clientY}},{passive:true});
canvas.addEventListener('touchend',e=>{if(!touchStart||!e.changedTouches.length)return;const t=e.changedTouches[0],dx=t.clientX-touchStart.x,dy=t.clientY-touchStart.y;touchStart=null;if(root.hidden||state.paused||dialogOpen)return;
if(Math.max(Math.abs(dx),Math.abs(dy))>=20){if(e.cancelable)e.preventDefault();action(Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up')}
else{const rect=canvas.getBoundingClientRect(),rx=(t.clientX-rect.left)/rect.width*W,ry=(t.clientY-rect.top)/rect.height*H,tx=Math.floor(rx),ty=Math.floor(ry),deltaX=tx-state.pos.x,deltaY=ty-state.pos.y;if(Math.abs(deltaX)+Math.abs(deltaY)===1)action(deltaX?deltaX>0?'right':'left':deltaY>0?'down':'up')}
},{passive:false});

document.addEventListener('keydown',e=>{if(root.hidden||!active||e.altKey||e.ctrlKey||e.metaKey)return;if(e.target.closest('input,textarea,select,[contenteditable]'))return;const key=e.key.toLowerCase(),k={arrowup:'up',w:'up',arrowdown:'down',s:'down',arrowleft:'left',a:'left',arrowright:'right',d:'right',' ':'attack',q:'heal',f:'pulse',g:'guard',enter:'story',escape:'pause'}[key];if(!k)return;e.preventDefault();if(e.repeat&&Date.now()-lastMove<100)return;lastMove=Date.now();if(k==='pause')pause();else if(dialogOpen&&k==='story')advanceDialog();else action(k)});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&active&&!state.paused&&!root.hidden){state.paused=true;persist();showOverlay()}});
const obs=new MutationObserver(()=>{if(root.hidden&&active){active=false;if(!state.paused){state.paused=true;persist()}}});obs.observe(root,{attributes:true,attributeFilter:['hidden']});
window.addEventListener('sm18:account-changed',refreshAccount);
window.addEventListener('sm18:defense-ended',e=>{const result=e.detail||{};if(result.won&&result.ranked)message('🎖️ Vitória oficial no Defesa reconhecida. Continue sua expedição!')});
hydrate();draw();
window.SamExpedicao18=Object.freeze({version:'19.0.0',open,getSnapshot:()=>({level:state.level,hp:state.hp,mangos:state.mangos,pos:{...state.pos},score:state.score,kills:state.kills,finished:state.finished,energy:state.energy,relics:state.relics,medals:medals().slice()})});
})();
