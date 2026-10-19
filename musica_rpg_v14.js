/* Sam Manguinha — trilha original sintetizada V14 (Web Audio, offline e sem downloads).
   Melodias compostas para Vila, Combate, Rei e Pomar das Sombras. */
(()=>{'use strict';
const KEY='sam_rpg_musica_v14',VOL='sam_rpg_volume_v14';
const themes={
village:{bpm:106,key:55,scale:[0,2,4,5,7,9,11,12],mel:[0,2,4,3,2,0,1,null,2,3,4,5,4,3,2,null,4,5,7,6,5,4,3,2,0,1,2,4,3,2,0,null,0,2,4,5,4,2,1,0,2,3,5,4,3,2,1,null,4,5,7,5,4,3,2,0,2,4,5,4,3,2,0,null],chords:[[0,2,4],[3,5,0],[4,6,1],[0,3,5]],bass:[0,3,4,0],lead:'triangle'},
forest:{bpm:88,key:53,scale:[0,2,3,5,7,9,10,12],mel:[0,null,2,3,4,2,0,null,3,4,5,null,4,3,2,null,5,7,6,5,4,2,3,null,2,0,2,4,3,2,0,null,0,2,3,null,5,4,2,null,3,5,7,5,4,3,2,null,5,4,3,2,0,2,3,4,5,3,2,0,2,null,0,null],chords:[[0,2,4],[5,0,2],[3,5,7],[4,6,1]],bass:[0,5,3,4],lead:'sine'},
mystery:{bpm:72,key:50,scale:[0,1,3,5,7,8,10,12],mel:[0,null,3,null,2,1,0,null,4,null,5,4,3,null,2,null,1,3,5,null,4,2,1,null,0,2,3,4,3,null,1,null,0,null,5,null,4,3,2,1,3,null,4,5,7,null,5,4,3,null,1,2,4,3,2,1,0,null,3,2,1,null,0,null],chords:[[0,2,4],[1,3,5],[5,0,3],[3,5,7]],bass:[0,1,5,3],lead:'triangle'},
cinematic:{bpm:68,key:48,scale:[0,2,3,5,7,8,10,12],mel:[0,null,null,2,3,null,null,5,4,null,3,null,2,null,null,0,2,null,4,5,7,null,5,4,3,null,2,null,0,null,null,null,0,null,2,null,3,5,7,null,5,null,7,null,6,5,4,null,3,2,0,null,2,3,4,null,5,4,3,2,0,null,null,null],chords:[[0,3,5],[5,0,2],[3,5,7],[1,4,6]],bass:[0,5,3,1],lead:'sine'},
temple:{bpm:82,key:48,scale:[0,2,3,6,7,9,10,12],mel:[0,3,4,null,6,5,3,2,4,null,5,6,7,null,5,3,2,4,null,3,0,2,3,null,5,6,4,3,2,null,0,null,0,2,3,4,6,5,4,null,3,4,6,7,5,4,3,2,0,2,3,5,null,4,3,2,0,3,4,6,5,3,2,null],chords:[[0,3,5],[3,5,0],[4,6,1],[1,3,5]],bass:[0,3,4,1],lead:'triangle'},
 explore:{bpm:94,key:52,scale:[0,2,3,7,8,10,12,14],mel:[0,2,3,4,7,5,4,2,3,2,0,null,2,4,3,null,0,2,5,4,3,2,1,0,2,3,5,7,5,4,3,null,3,4,7,5,4,3,2,0,2,4,5,null,3,2,0,null,0,2,3,5,7,5,4,3,2,3,4,2,0,null,0,null],chords:[[0,3,5],[5,0,2],[3,5,7],[0,2,4]],bass:[0,5,3,0],lead:'triangle'},
 battle:{bpm:136,key:52,scale:[0,2,3,5,7,8,10,12],mel:[0,2,3,4,5,4,3,2,0,null,4,5,6,5,4,2,3,4,6,7,6,4,3,2,1,2,3,5,4,2,0,null,0,3,5,7,6,5,4,3,5,4,3,2,0,null,3,5,4,3,2,4,5,7,5,4,3,2,0,2,3,0,0,null],chords:[[0,2,4],[5,0,3],[3,5,0],[6,0,2]],bass:[0,5,3,6],lead:'sawtooth'},
 boss:{bpm:146,key:45,scale:[0,1,3,5,7,8,10,12],mel:[0,4,3,2,1,0,4,7,6,5,4,3,2,1,0,null,0,2,3,5,7,6,5,4,3,2,1,0,4,3,2,null,7,5,4,2,0,3,4,5,6,7,5,3,2,0,null,0,0,2,3,4,5,4,3,2,1,0,2,4,5,7,4,null],chords:[[0,2,4],[1,3,5],[5,0,2],[4,6,0]],bass:[0,1,5,4],lead:'sawtooth'},
 shadows:{bpm:78,key:50,scale:[0,2,3,5,7,9,10,12],mel:[0,null,2,3,null,5,4,null,3,2,null,0,2,null,null,null,0,null,3,5,null,4,3,null,5,7,null,5,4,null,2,null,3,null,2,0,null,2,4,null,5,4,3,2,null,0,null,null,0,null,5,4,3,null,2,0,null,2,3,null,2,0,null,null],chords:[[0,3,5],[2,4,7],[5,0,2],[3,5,7]],bass:[0,2,5,3],lead:'sine'}
};
let ctx=null,master=null,enabled=false,scene='explore',step=0,next=0,clock=null,volume=.32,session=0;
try{const saved=+localStorage.getItem(VOL);if(Number.isFinite(saved)&&saved>=0&&saved<=1)volume=saved;}catch(e){}
const f=midi=>440*Math.pow(2,(midi-69)/12);
function ensure(){if(ctx)return ctx;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;ctx=new AC();master=ctx.createGain();master.gain.value=volume*.43;const limiter=ctx.createDynamicsCompressor();limiter.threshold.value=-17;limiter.knee.value=15;limiter.ratio.value=5;master.connect(limiter);limiter.connect(ctx.destination);return ctx}
function voice(midi,start,duration,shape='sine',level=.18,attack=.008){if(!ctx||!master)return;const o=ctx.createOscillator(),g=ctx.createGain(),v=level;let release=Math.min(.21,duration*.35);o.type=shape;o.frequency.setValueAtTime(f(midi),start);if(shape==='sawtooth')o.detune.value=-3;
  g.gain.setValueAtTime(.0001,start);g.gain.exponentialRampToValueAtTime(Math.max(.0002,v),start+Math.max(.006,attack));g.gain.setValueAtTime(v,start+Math.max(.006,attack)+.012);g.gain.exponentialRampToValueAtTime(.0001,start+duration+release);o.connect(g);g.connect(master);o.start(start);o.stop(start+duration+release+.04);
}
function noise(start,vol=.07,decay=.065){if(!ctx||!master)return;const b=ctx.createBuffer(1,Math.floor(ctx.sampleRate*.13),ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/(ctx.sampleRate*.035));const s=ctx.createBufferSource(),g=ctx.createGain();s.buffer=b;g.gain.setValueAtTime(vol,start);g.gain.exponentialRampToValueAtTime(.0001,start+decay);s.connect(g);g.connect(master);s.start(start);s.stop(start+decay+.01)}
function beat(t){const a=themes[scene]||themes.explore,unit=60/a.bpm/2,bar=(step/16|0)%4,idx=step%64;
 const base=a.key,sel=a.scale;let n=a.mel[idx];if(n!=null){let oct=n>=8?12:0;let note=sel[n%8]+oct;voice(base+note+12,t,unit*.82,a.lead,scene==='boss'?.11:.155,.014);if(idx%8===0)voice(base+note+24,t,unit*.65,'sine',.06,.028)}
 if(idx%2===0){const chord=a.chords[bar];const arp=chord[(idx/2|0)%3];voice(base+sel[arp%8],t,unit*2.3,scene==='shadows'?'sine':'triangle',.058,.03)}
 if(idx%8===0){let bass=a.bass[(idx/16|0)%4];voice(base-12+sel[bass],t,unit*7.4,'sine',.18,.025)}
 if((scene==='battle'||scene==='boss')&&idx%4===2)noise(t,scene==='boss'?.065:.04,.075);
 if((scene==='battle'||scene==='boss')&&idx%8===0)voice(base-24,t,unit*1.2,'sine',.18,.006);
 step=(step+1)%64;next=t+unit;
}
function tick(){if(!enabled||!ctx||ctx.state!=='running')return;while(next<ctx.currentTime+.26)beat(next)}
function start(){const a=ensure();if(!a)return false;enabled=true;try{localStorage.setItem(KEY,'1')}catch(e){};a.resume().then(()=>{next=a.currentTime+.06;step=0;if(!clock)clock=setInterval(tick,80);tick();sync()}).catch(()=>{enabled=false;sync()});sync();return true}
function stop(){enabled=false;try{localStorage.setItem(KEY,'0')}catch(e){};if(clock){clearInterval(clock);clock=null}if(ctx&&master)master.gain.setTargetAtTime(0,ctx.currentTime,.06);sync()}
function toggle(){if(enabled)stop();else{ensure();if(master)master.gain.value=volume*.43;start()}}
function change(nextScene){if(!themes[nextScene])nextScene='explore';if(scene===nextScene)return;scene=nextScene;step=0;if(enabled&&ctx){next=Math.max(next,ctx.currentTime+.16)}sync()}
function setVolume(value){volume=Math.max(0,Math.min(1,Number(value)||0));if(ctx&&master)master.gain.setTargetAtTime(volume*.43,ctx.currentTime,.05);try{localStorage.setItem(VOL,String(volume))}catch(e){};sync()}
function fx(kind='hit'){if(!ctx||ctx.state!=='running'||!enabled)return;const t=ctx.currentTime+.012;if(kind==='hit'){voice(47,t,.10,'triangle',.17);noise(t,.09,.08)}else if(kind==='magic'){[76,79,84].forEach((n,i)=>voice(n,t+i*.055,.22,'sine',.14))}else if(kind==='heal'){[72,76,79,84].forEach((n,i)=>voice(n,t+i*.085,.24,'sine',.115))}else if(kind==='guard'){voice(55,t,.18,'triangle',.13);voice(62,t+.02,.25,'sine',.09)}else if(kind==='enemy'){voice(40,t,.18,'sawtooth',.11);noise(t+.09,.06,.09)}else if(kind==='win'){[60,64,67,72].forEach((n,i)=>voice(n,t+i*.11,.36,'triangle',.16))}}
function sync(){const btn=document.getElementById('r14MusicToggle');if(btn){btn.setAttribute('aria-pressed',String(enabled));btn.textContent=enabled?'♫ Tocando':'♫ Música';btn.title=enabled?'Desligar trilha sonora':'Ligar trilha sonora original'}const sl=document.getElementById('r14MusicVolume');if(sl)sl.value=String(Math.round(volume*100));const lbl=document.getElementById('r14MusicStatus');if(lbl)lbl.textContent=enabled?'Trilha original ligada · '+({explore:'Vila das Memórias',battle:'Confronto das Raízes',boss:'O Último Trovão',shadows:'Sombras do Pomar',village:'Manhã na Vila',forest:'Luzes da Floresta',mystery:'Raízes que Sussurram',cinematic:'O Despertar da Árvore',temple:'Templo das Raízes'}[scene]||'Vila'):'Toque em Música para ouvir. Sem autoplay.'}
window.SamMusic={start,stop,toggle,scene:change,setVolume,effect:fx,get currentScene(){return scene},get themeNames(){return ['village','forest','mystery','cinematic','temple','battle','boss','shadows','explore']},get enabled(){return enabled},sync};
window.addEventListener('pagehide',()=>{if(ctx)ctx.suspend().catch(()=>{})});
})();
