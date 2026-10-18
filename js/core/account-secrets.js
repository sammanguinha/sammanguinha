/* login por @ */
function renderMe(){$("meChip").textContent=me?"@"+me+" · trocar":"Entrar"}
function showGate(){
  gateOn=true;$("gate").hidden=false;syncInert();
  $("gIn").value=me;$("gErr").textContent="";
  setTimeout(()=>$("gIn").focus(),50);
}
$("gForm").onsubmit=async e=>{
  e.preventDefault();
  const h=$("gIn").value.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?instagram\.com\//,"").replace(/[\/?].*$/,"").replace(/^@+/,"").replace(/\s+/g,"");
  if(!/^[a-z0-9._]{1,30}$/.test(h)){
    $("gErr").textContent="Esse @ não parece válido. Use só letras, números, ponto e underline, sem espaços (exemplo: sammanguinha).";
    $("gIn").focus();return;
  }
  const key=$("gKey").value.trim();const previousToken=tok;if(key.length>=16)setTok(key);
  const previousHandle=me;me=h;renderMe();$("gOk").disabled=true;$("gErr").textContent="";
  try{await claim()}
  catch(err){
    $("gOk").disabled=false;setTok(previousToken);
    if(err.message==="handle_taken"){me=previousHandle;renderMe();$("gKeyWrap").hidden=false;$("gErr").textContent="Esse @ já tem dono. Cole a chave dele ou use outro @."}
    else {me=previousHandle;renderMe();$("gErr").textContent="Não consegui entrar agora. Tente de novo.";}
    return;
  }
  LS.set("sg_handle",me);window.dispatchEvent(new Event("sm18:account-changed"));$("gOk").disabled=false;gateOn=false;$("gate").hidden=true;syncInert();
  toast("Bem-vindo(a), @"+me+"! Colha as mangas do topo.",4500);
  say("Oi, @"+me+"! Eu sou o Manguito. Me clique para ouvir curiosidades.",7000);
  rpc("register_visit",{p_handle:me}).catch(()=>{});
  pollEvent();loadMine();
};
$("meChip").onclick=showGate;
renderMe();

/* mascote */
const mas=$("mascot");let mc=[];
function mClick(){
  const n=Date.now();mc=mc.filter(x=>n-x<4000);mc.push(n);
  if(mc.length>=7){mc=[];mas.classList.add("splat");say("Splash! Virei suco 🧃",3000);unlock("splat");setTimeout(()=>mas.classList.remove("splat"),2300);return}
  mas.classList.remove("jump");void mas.offsetWidth;mas.classList.add("jump");
  say(rnd(FACTS),7000);
}
mas.addEventListener("click",mClick);
mas.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();mClick()}});
let ptr=0;
addEventListener("pointermove",e=>{
  if(ptr)return;
  ptr=requestAnimationFrame(()=>{
    ptr=0;const r=mas.getBoundingClientRect(),dx=e.clientX-(r.left+31),dy=e.clientY-(r.top+37),d=Math.hypot(dx,dy)||1,k=Math.min(3,d/30);
    mas.style.setProperty("--px",(dx/d*k)+"px");mas.style.setProperty("--py",(dy/d*k)+"px");
  });
});
function dance(){mas.classList.add("dance");say("♪ ♫ ♪",3200);unlock("manga");setTimeout(()=>mas.classList.remove("dance"),3200)}
$("seed").onclick=()=>{toast("🌱 Você achou o caroço! Dentro dele mora uma mangueira inteira.",5000);unlock("seed")};

/* códigos secretos */
function samuel(){const a=$("samuel");a.currentTime=0;a.play().then(()=>{toast("🔊 apicadosamuel");unlock("samuel")}).catch(()=>toast("Não consegui tocar o áudio."))}
function stars(){
  const els=[];
  for(let i=0;i<40;i++){
    const s=document.createElement("i");s.className="star";s.textContent="★";
    s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;font-size:${14+Math.random()*30}px;animation-delay:-${Math.random()*3}s;animation-duration:${1.6+Math.random()*2}s`;
    fx.appendChild(s);els.push(s);
  }
  toast("★ lulala ★");unlock("lulala");
  setTimeout(()=>els.forEach(s=>s.classList.add("out")),12000);
  setTimeout(()=>els.forEach(s=>s.remove()),13200);
}
let rotOn=false,flies=[];
function rot(){
  rotOn=!rotOn;document.documentElement.classList.toggle("rot",rotOn);
  flies.forEach(f=>f.remove());flies=[];
  if(rotOn)for(let i=0;i<6;i++){
    const f=document.createElement("i");f.className="fly";f.textContent="🪰";
    f.style.cssText=`--x:${5+Math.random()*80}vw;--y:${10+Math.random()*70}vh;animation-delay:-${Math.random()*6}s;animation-duration:${5+Math.random()*5}s`;
    fx.appendChild(f);flies.push(f);
  }
  toast(rotOn?"As mangas apodreceram… digite podridao de novo para curá-las.":"As mangas estão frescas de novo 🥭",5000);
  unlock("podridao");
}
function beep(){
  try{
    const A=new (window.AudioContext||window.webkitAudioContext)(),t=A.currentTime;
    [[988,0],[1319,.09]].forEach(([f,d])=>{
      const o=A.createOscillator(),g=A.createGain();
      o.type="square";o.frequency.value=f;
      g.gain.setValueAtTime(.08,t+d);g.gain.exponentialRampToValueAtTime(.001,t+d+.35);
      o.connect(g);g.connect(A.destination);o.start(t+d);o.stop(t+d+.4);
    });
    setTimeout(()=>A.close(),900);
  }catch(e){}
}
function coin(){
  const S=["....oooo....","..ooyyyyoo..",".oyyyllyyyo.",".oyyllyyyydo","oyyllyyyyydo","oyyllyyyyydo","oyyllyyyyydo","oyyllyyyyydo","oyyllyyyyydo","oyyllyyyyydo","oyyllyyyyydo","oyyyyyyyyydo",".oyyyyyyydo.","..oddyyddo..","..ooddddoo..","....oooo...."];
  const pal={o:"#7A3E00",y:"#FFD21F",l:"#FFF4A8",d:"#E08A00"};
  const w=document.createElement("div"),c=document.createElement("canvas");
  w.className="cw";c.className="coin";c.width=12;c.height=16;
  const g=c.getContext("2d");
  S.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch!==".") {g.fillStyle=pal[ch];g.fillRect(x,y,1,1)}}));
  w.appendChild(c);fx.appendChild(w);beep();unlock("luigi");
  setTimeout(()=>w.remove(),2000);
}
function rain(emojis,n,ms){
  for(let i=0;i<n;i++){
    const s=document.createElement("i");s.className="rain";s.textContent=emojis[i%emojis.length];
    s.style.cssText=`left:${Math.random()*100}%;font-size:${18+Math.random()*26}px;animation-duration:${2+Math.random()*2.5}s;animation-delay:${Math.random()*(ms/1000-3)}s`;
    fx.appendChild(s);setTimeout(()=>s.remove(),ms+500);
  }
}
function suco(){const j=document.createElement("div");j.className="juice";j.textContent="glub glub 🥭";fx.appendChild(j);setTimeout(()=>j.remove(),4800);unlock("suco")}
function noite(){const r=document.documentElement,d=r.dataset.theme==="dark";r.dataset.theme=d?"light":"dark";toast(d?"☀️ Dia de novo!":"🌙 Boa noite, pomar.");unlock("noite")}
function ventania(){
  const cols=[["#6CC070","#2E7D32"],["#9BCB4B","#4C8C2B"],["#FFC83D","#E58A00"],["#FF9A4A","#D9532B"]],box=$("leaves"),els=[];
  for(let i=0;i<30;i++){
    const l=document.createElement("i"),c=rnd(cols);l.className="leaf";
    l.style.cssText=`left:${Math.random()*100}%;--s:${12+Math.random()*16}px;--a:${c[0]};--b:${c[1]};--t:${3+Math.random()*3}s;--d:-${Math.random()*5}s;--dx:${(Math.random()<.5?-1:1)*(160+Math.random()*220)}px`;
    box.appendChild(l);els.push(l);
  }
  toast("🍃 Ventania!");unlock("ventania");
  setTimeout(()=>els.forEach(l=>l.remove()),12000);
}
function alphonso(){rain(["🥭","✨","🥭","👑"],36,6500);toast("👑 Alphonso: a manga de ouro chegou!",5000);unlock("alphonso")}
function miseri(){
  if(!$("cDlg").open){resetCheat();$("cDlg").showModal()}
  $("cAsk").hidden=true;$("cOk").hidden=true;$("cImg").hidden=false;unlock("miseri");
}
let lockT=null;
function lock(sec,until){
  const tot=sec||13,end=until||Date.now()+tot*1000;
  LS.set("sg_lock",String(end));
  document.querySelectorAll("dialog[open]").forEach(d=>d.close());
  locked=true;syncInert();document.body.style.overflow="hidden";$("lock").hidden=false;
  const tick=()=>{
    const ms=end-Date.now(),left=Math.ceil(ms/1000);
    if(left<=0){release();return}
    $("lockN").textContent=left;$("lockBar").style.transform="scaleX("+Math.max(0,ms/(tot*1000))+")";
  };
  tick();clearInterval(lockT);lockT=setInterval(tick,200);
}
function release(){clearInterval(lockT);locked=false;LS.set("sg_lock","0");$("lock").hidden=true;document.body.style.overflow="";syncInert();toast("Liberado! Pode voltar a mexer 🥭")}
function bolso(){unlock("bolso");lock(13)}
const fxDlg=$("fxDlg");let fxT=0;
function fxOpen(h,c){$("fxBody").className=c||"";$("fxBody").innerHTML=h;if(!fxDlg.open)fxDlg.showModal()}
$("fxClose").onclick=()=>fxDlg.close();
fxDlg.addEventListener("close",()=>{clearInterval(fxT);$("fxBody").innerHTML=""});
function pop(){fxOpen('<p class="pixt big">SAMMANGUINHA É POP,<br>JAMAIS “ROCK”!</p>');burst(innerWidth/2,innerHeight/2);unlock("pop")}
function fakeAdmin(){
  fxOpen('<p class="pixt">Verificação ultrassecreta</p><div class="pbar"><i id="pb"></i></div><p id="pt" class="mono">Lendo suas impressões digitais de manga…</p>');
  let n=0;clearInterval(fxT);
  fxT=setInterval(()=>{const b=$("pb");if(!b){clearInterval(fxT);return}n+=2+Math.random()*5;b.style.width=Math.min(n,100)+"%";
    if(n>=100){clearInterval(fxT);$("pt").innerHTML='<b class="red">ACESSO NEGADO.</b> Motivo: '+rnd(["você tem cara de quem confunde manga com mamão.","seu nível de poder equivale ao de uma banana-prata.","o sistema desconfia que você é um caroço disfarçado.","seu carisma foi reprovado por unanimidade pelas folhas."])}},140);
  unlock("admin");
}
function hack(){
  const L=["> iniciando invasão do pomar…","> contornando o firewall de casca…","> quebrando a senha: 12345… não. 54321… não.","> acessando o mainframe da mangueira…","> baixando 100% das mangas… 99%… 99%… 99%…","> INVASÃO CONCLUÍDA. Você hackeou a geladeira de alguém e encontrou uma manga esquecida desde 2019."];
  fxOpen('<pre class="term" id="tm"></pre>');let i=0;clearInterval(fxT);
  fxT=setInterval(()=>{const x=$("tm");if(!x||i>=L.length){clearInterval(fxT);return}x.textContent+=L[i++]+"\n"},900);
  unlock("hack");
}
function socorro(){document.documentElement.classList.add("alarm");toast("ALERTA NO POMAR! Uma manga caiu e ninguém viu. Mantenha a calma.",6000);setTimeout(()=>document.documentElement.classList.remove("alarm"),5000);unlock("socorro")}
function deus(){fxOpen('<p class="hand">'+rnd(["Se uma manga cai na floresta e ninguém a colhe, ela ainda é doce?","Quem veio primeiro: a mangueira ou o caroço? E se a resposta for “o suco”?","Todo caroço é só uma mangueira esperando a sua vez.","Colher é ganhar ou perder uma manga?"])+'</p>');unlock("deus")}
function amor(){fxOpen('<div class="letter"><p class="hand">Querido(a) @'+esc(me||"explorador(a)")+',</p><p class="hand">desde que te vi colhendo mangas, meu caroço não para de acelerar. Você é a polpa da minha vida e o suco dos meus dias. Se for para ser fiapo, que seja entre os seus dentes.</p><p class="hand">Com carinho (e um pouco de vergonha),<br>o Pomar</p></div>');unlock("amor")}
function care(){fxOpen('<p class="pixt">Ei, passando só para dizer:</p><p>Se você está pensando em se machucar, converse com alguém agora. No Brasil, o CVV atende 24 horas pelo <a href="tel:188"><b>188</b></a> (ligação gratuita) e em <a href="https://cvv.org.br" target="_blank" rel="noopener">cvv.org.br</a>. Você importa.</p>')}
const CODES={misericordia:miseri,apicadosamuel:samuel,lulala:stars,podridao:rot,luigi:coin,bolsonaro:bolso,suco,noite,ventania,alphonso,sammanguinha:pop,admin:fakeAdmin,hack,socorro,deus,amor,suicidio:care};
function resetCheat(){$("cIn").value="";$("cErr").textContent="";$("cAsk").hidden=false;$("cImg").hidden=true;$("cOk").hidden=false}
function tryCode(){
  const k=norm($("cIn").value);
  if(!Object.prototype.hasOwnProperty.call(CODES,k))return false;
  if(k!=="misericordia")$("cDlg").close();
  setTimeout(CODES[k],k==="misericordia"?0:80);
  return true;
}
$("cheat").onclick=()=>{resetCheat();$("cDlg").showModal();$("cIn").focus()};
$("cIn").addEventListener("input",tryCode);
$("cForm").onsubmit=e=>{e.preventDefault();if(!tryCode()){$("cErr").textContent="Código incorreto.";$("cIn").select()}};
$("cClose").onclick=()=>$("cDlg").close();
$("cDlg").addEventListener("close",resetCheat);

/* códigos digitados em qualquer lugar + Konami */
const KON=["arrowup","arrowup","arrowdown","arrowdown","arrowleft","arrowright","arrowleft","arrowright","b","a"];
let buf="",kon=[];
addEventListener("keydown",e=>{
  if(locked||gateOn||e.ctrlKey||e.metaKey||e.altKey)return;
  const t=e.target;if(t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable))return;
  const k=e.key.toLowerCase();
  kon.push(k);kon=kon.slice(-10);
  if(kon.join()===KON.join()){kon=[];rain(["🥭"],40,6000);toast("🎮 Código clássico! Chuva de mangas!",5000);unlock("konami");return}
  if(e.key.length!==1)return;
  buf=(buf+norm(e.key)).slice(-16);
  for(const c of Object.keys(CODES))if(buf.endsWith(c)){buf="";CODES[c]();return}
  if(buf.endsWith("manga")){buf="";dance()}
});

/* música de fundo */
const bgm=$("bgm");bgm.volume=.5;
const PLAY="M8 5v14l11-7z",PAUSE="M6 5h4v14H6zM14 5h4v14h-4z";
function setMusic(on){
  $("music").classList.toggle("on",on);
  $("mBtn").setAttribute("aria-pressed",on);
  $("mBtn").setAttribute("aria-label",on?"Pausar música":"Tocar música");
  $("mIco").firstElementChild.setAttribute("d",on?PAUSE:PLAY);
}
$("mBtn").onclick=()=>{
  if(bgm.paused){bgm.play().then(()=>setMusic(true)).catch(()=>setMusic(false))}
  else{bgm.pause();setMusic(false)}
};
$("mVol").oninput=e=>{bgm.volume=+e.target.value};

/* folhas caindo (e que dá para pegar) */
const LC=[["#6CC070","#2E7D32"],["#9BCB4B","#4C8C2B"],["#D2DF55","#6E9B2A"],["#FFC83D","#E58A00"],["#FF9A4A","#D9532B"]];
function mkLeaf(){
  const l=document.createElement("i"),c=rnd(LC);
  l.className="leaf";
  l.style.cssText=`left:${Math.random()*100}%;--s:${12+Math.random()*16}px;--a:${c[0]};--b:${c[1]};--t:${11+Math.random()*10}s;--d:-${Math.random()*20}s;--dx:${(Math.random()<.5?-1:1)*(40+Math.random()*90)}px`;
  $("leaves").appendChild(l);
}
const NL=matchMedia("(max-width:600px)").matches?7:11;
for(let i=0;i<NL;i++)mkLeaf();
let lc=0;
$("leaves").addEventListener("click",e=>{
  const l=e.target.closest(".leaf");if(!l)return;
  burst(e.clientX,e.clientY);l.remove();lc++;
  if(lc>=5)unlock("leaves");else toast("🍂 Folha pega! ("+lc+"/5)",1800);
  setTimeout(mkLeaf,5000);
});

/* início */
render();
{
  const L=parseInt(LS.get("sg_lock"),10)||0;
  if(L>Date.now())lock(13,L);
  if(!me)showGate();
}

