/* V30.2 · Cutscenes narrativas em pixel art desenhadas em Canvas.
   Arte e diálogos originais. Sem imagens externas nem autoplay de áudio. */
(()=>{'use strict';
const SCENES=Object.freeze({
 awakening:{
  label:'PRÓLOGO · UMA NOVA VOZ',theme:'cinematic',world:'village',
  frames:[
   {who:'Narrador',line:'Na manhã após a Última Badalada, uma segunda nota ecoou sob as casas da Vila. Mas nenhum sino havia tocado.',stage:'village'},
   {who:'Íris, Cartógrafa',line:'Meus mapas mudaram durante a noite. Ruas antigas ganharam raízes novas, e o mesmo caminho agora parece levar a dois lugares.',stage:'roots'},
   {who:'A Primeira Mangueira',line:'Enquanto uma lembrança for guardada por apenas uma pessoa, haverá raízes que não encontram a luz.',stage:'tree'},
   {who:'Narrador',line:'Três luzes surgem na Floresta. A trilha aceita os passos de quem observa antes de escolher. A nova jornada começa.',stage:'forest'}
  ]
 },
 whisper:{
  label:'CAPÍTULO I · O SUSSURRO DA TRILHA',theme:'mystery',world:'forest',
  frames:[
   {who:'Narrador',line:'No coração da Floresta, raízes brilhantes se encontram em uma pedra marcada por três pequenos círculos.',stage:'forest'},
   {who:'Mara, Jardineira',line:'O que nasce precisa de água para crescer. Só então a luz revela suas folhas. Não trate as marcas como fechaduras: escute a história delas.',stage:'roots'},
   {who:'A Fissura',line:'SEMENTE. ÁGUA. LUZ. A ordem não é um capricho: é o caminho que a vida percorre até conseguir florescer.',stage:'tree'},
   {who:'Narrador',line:'Três pedras distantes respondem à memória da Floresta. Procure-as e toque-as na ordem correta.',stage:'forest'}
  ]
 },
 opening:{
  label:'CAPÍTULO I · O LIMIAR DAS RAÍZES',theme:'cinematic',world:'temple',
  frames:[
   {who:'Narrador',line:'O último símbolo acende. As raízes se afastam, não como uma porta quebrada, mas como mãos abrindo espaço.',stage:'roots'},
   {who:'Eco Antigo',line:'Os primeiros guardiões construíram este átrio para registrar promessas que ninguém deveria esquecer. Agora suas vozes estão divididas.',stage:'temple'},
   {who:'Íris, em lembrança',line:'Há três inscrições do outro lado. Se entender o que cada uma protege, talvez possamos seguir até a cidade esquecida.',stage:'temple'},
   {who:'Narrador',line:'Um novo caminho se abriu. Explore o Átrio, procure três inscrições e descubra a promessa dos antigos cuidadores.',stage:'tree'}
  ]
 },
 archive:{
  label:'CAPÍTULO I · O JURAMENTO ESQUECIDO',theme:'temple',world:'temple',
  frames:[
   {who:'A Última Inscrição',line:'Não pertence ao primeiro que chega a árvore que alimenta todos.',stage:'temple'},
   {who:'Narrador',line:'As três inscrições contam a mesma promessa: caminho, alimento e lembrança não devem ser trancados para sempre.',stage:'roots'},
   {who:'Eco da Primeira Mangueira',line:'Você encontrou o que procurava, mas esta não é a história inteira. Há raízes abaixo de cada região, e algumas perderam o próprio nome.',stage:'tree'},
   {who:'Narrador',line:'Prólogo concluído. O Diário da V30 guarda sua descoberta; os próximos capítulos trarão as raízes mais profundas do Pomar.',stage:'forest'}
  ]
 }
});
let active=null,raf=0,clock=0,storedFocus=null;
function reduce(){return !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches}
function root(){return document.fullscreenElement||document.body}
function paint(canvas,scene,t){
 const c=canvas.getContext('2d',{alpha:false});if(!c)return;
 const w=320,h=180,seed=scene.stage||'tree',still=reduce();const time=still?0:t;
 c.clearRect(0,0,w,h);c.imageSmoothingEnabled=false;
 const sky=seed==='village'?['#263d54','#b58c6d']:seed==='forest'?['#101f34','#3a5c4e']:seed==='temple'?['#151c38','#3d3b60']:['#1b253a','#516549'];
 c.fillStyle=sky[0];c.fillRect(0,0,w,h*.62);c.fillStyle=sky[1];c.fillRect(0,90,w,90);
 // Distant pixel hills.
 for(let i=0;i<10;i++){
  const x=i*40-15;const bh=19+(i*17%33);c.fillStyle=i%2?'#283d3d':'#304c47';
  c.fillRect(x,91-bh,46,bh+8);
 }
 for(let y=120;y<h;y+=9){c.fillStyle=y%18?'#283c36':'#324c41';c.fillRect(0,y,w,9)}
 for(let x=0;x<w;x+=16){const bump=((x*13)%17)-8;c.fillStyle='#526b4c';c.fillRect(x,143+bump,6,3)}
 if(seed==='village'){
  for(const [x,y,wid,col] of [[21,82,61,'#795544'],[118,76,75,'#795f4a'],[237,89,59,'#92634b']]){
   c.fillStyle='#303344';c.fillRect(x+5,y,wid-10,51);
   c.fillStyle=col;c.fillRect(x,y,wid,10);
   for(let k=0;k<3;k++){c.fillStyle='#c99865';c.fillRect(x+9+k*15,y+23,9,14)}
   c.fillStyle='#ecd18e';c.fillRect(x+wid/2-5,y+39,11,12);
  }
 }else if(seed==='temple'){
  for(const x of [22,80,226,282]){c.fillStyle='#716682';c.fillRect(x,28,17,115);c.fillStyle='#a9a3a2';c.fillRect(x-5,27,27,12)}
  c.fillStyle='#95837b';c.fillRect(0,129,320,13);
  for(let x=7;x<320;x+=30){c.fillStyle='#4d4962';c.fillRect(x,140,2,40)}
  c.fillStyle='#ddbc88';c.fillRect(141,109,38,6);c.fillStyle='#9c826e';c.fillRect(149,93,22,16);
 }else{
  for(let i=0;i<8;i++){const x=i*45+4;const y=seed==='forest'?42:61;
   c.fillStyle='#514437';c.fillRect(x+12,y+23,10,96);
   c.fillStyle=i%2?'#37624e':'#285644';c.fillRect(x,y,32,42);
   c.fillStyle='#51805d';c.fillRect(x+3,y-10,27,22);
  }
 }
 // Ancient tree, roots and glowing hanging fruit — original pixel artwork.
 const sway=Math.round(Math.sin(time*1.7)*3);
 c.fillStyle='#66513a';c.fillRect(151,71,20,81);
 c.fillStyle='#765b3c';c.fillRect(146,91,31,11);c.fillRect(139,108,41,9);
 for(const [x,y,ww,hh,col] of [[125,49,75,28,'#376650'],[137,28,54,32,'#467c5e'],[109,65,45,25,'#315a49'],[178,59,38,29,'#376b54'],[148,19,30,24,'#61926b']]){
  c.fillStyle=col;c.fillRect(x+sway,y,ww,hh);
  c.fillStyle='#8acb89';c.fillRect(x+sway+9,y+6,6,5)
 }
 for(const [x,y]of [[139,69],[178,55],[157,39]]){c.fillStyle='#f4c56f';c.fillRect(x+sway,y,6,8);c.fillStyle='#fff2b3';c.fillRect(x+sway+2,y+1,2,2)}
 c.fillStyle='#74543d';c.fillRect(122,151,31,5);c.fillRect(168,152,32,5);
 for(let i=0;i<31;i++){
  const dx=(i*71+19)%320,dy=24+(i*53)%124;
  const off=still?0:Math.sin(time*(.6+(i%3)*.19)+i)*5;
  const glow=(i+Math.floor(time*2))%3;
  c.fillStyle=glow?'#f4d48b':'#a0f4be';
  c.fillRect(dx,dy+off|0,2+(i%2),2);
 }
 if(seed==='roots'){
  c.fillStyle='#80cda2';for(let j=0;j<3;j++)c.fillRect(93+j*39,141,6,9);
 }
 // Scene-specific foreground + light blooms.
 if(seed==='tree'||seed==='roots'||seed==='temple'){
  c.fillStyle='#f4dea5';c.fillRect(157,112,6,7);
  c.fillStyle='#aed9a0';c.fillRect(155,109,10,2);
 }
}
function ensure(){
 let layer=document.getElementById('sm30Cutscene');if(layer)return layer;
 layer=document.createElement('div');layer.id='sm30Cutscene';layer.className='sm30-cutscene-layer';layer.hidden=true;
 layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-labelledby','sm30CutTitle');
 layer.innerHTML='<div class="sm30-cut-box"><div class="sm30-cut-top"><span id="sm30CutTitle">O Despertar do Pomar</span><button type="button" id="sm30CutSkip">Pular cena ↗</button></div>'+
 '<canvas id="sm30CutCanvas" width="320" height="180" role="img" aria-label="Cena em pixel art: uma mangueira ancestral, raízes e luzes no Pomar"></canvas>'+
 '<div class="sm30-cut-dialogue" aria-live="polite"><span id="sm30CutSpeaker"></span><p id="sm30CutText"></p></div>'+
 '<div class="sm30-cut-footer"><span id="sm30CutProgress"></span><button type="button" id="sm30CutNext">Continuar ▸</button></div></div>';
 root().append(layer);
 layer.querySelector('#sm30CutNext').addEventListener('click',advance);
 layer.querySelector('#sm30CutSkip').addEventListener('click',()=>finish(true));
 layer.addEventListener('keydown',e=>{
  if(!active)return;
  if(['ArrowRight','Enter',' '].includes(e.key)){e.preventDefault();e.stopPropagation();advance()}
  if(e.key==='Escape'){e.preventDefault();e.stopPropagation();finish(true)}
  if(e.key==='Tab'){
   const nodes=[layer.querySelector('#sm30CutSkip'),layer.querySelector('#sm30CutNext')];
   const index=nodes.indexOf(document.activeElement);
   if(e.shiftKey&&index===0){e.preventDefault();nodes[1].focus()}
   if(!e.shiftKey&&index===1){e.preventDefault();nodes[0].focus()}
  }
 });
 return layer;
}
function stopFrame(){if(raf)cancelAnimationFrame(raf);raf=0}
function animate(){
 if(!active)return;
 const scene=active.data.frames[active.index];paint(active.canvas,scene,clock);
 if(!reduce()){clock+=.016;raf=requestAnimationFrame(animate)}
}
function drawCurrent(){
 const data=active,frame=data.data.frames[data.index],layer=data.layer;
 layer.querySelector('#sm30CutSpeaker').textContent=frame.who;
 layer.querySelector('#sm30CutText').textContent=frame.line;
 layer.querySelector('#sm30CutProgress').textContent='CENA '+(data.index+1)+' / '+data.data.frames.length;
 layer.querySelector('#sm30CutNext').textContent=data.index===data.data.frames.length-1?'Concluir cena ✓':'Continuar ▸';
 stopFrame();animate();
}
function advance(){if(!active)return;if(active.index+1>=active.data.frames.length){finish(false);return}active.index++;drawCurrent()}
function finish(skipped){
 if(!active)return;
 const s=active;active=null;stopFrame();s.layer.hidden=true;
 if(s.layer.parentNode!==document.body)document.body.append(s.layer);
 if(window.SamMusic?.currentScene==='cinematic'||window.SamMusic?.currentScene==='mystery'||window.SamMusic?.currentScene==='temple')
  window.SamMusic?.scene(s.previousTrack);
 if(storedFocus?.isConnected&&typeof storedFocus.focus==='function')storedFocus.focus({preventScroll:true});
 storedFocus=null;
 try{s.onFinish?.({id:s.id,skipped:!!skipped})}catch(e){console.error('Cutscene callback:',e)}
}
function play(id,options={}){
 const data=SCENES[id];if(!data)return false;
 if(active)finish(true);
 const layer=ensure(),canvas=layer.querySelector('canvas');
 if(layer.parentElement!==root())root().append(layer);
 storedFocus=document.activeElement;clock=0;
 active={id,index:0,data,canvas,layer,previousTrack:window.SamMusic?.currentScene||'village',onFinish:options.onFinish};
 layer.hidden=false;
 // Respect the existing audio opt-in: do not start sound without a gesture.
 window.SamMusic?.scene(data.theme);
 drawCurrent();layer.querySelector('#sm30CutNext').focus({preventScroll:true});return true;
}
document.addEventListener('fullscreenchange',()=>{
 if(active&&active.layer.parentElement!==root())root().append(active.layer);
});
window.addEventListener('pagehide',()=>{if(active)stopFrame()});
window.SamCutscenes=Object.freeze({play,replay:id=>play(id),close:()=>finish(true),
 get isPlaying(){return !!active},get scenes(){return Object.keys(SCENES)},
 getScene:id=>SCENES[id]?{label:SCENES[id].label,frames:SCENES[id].frames.length}:null});
})();
