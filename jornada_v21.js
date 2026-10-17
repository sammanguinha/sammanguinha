/* V21 Jornada Viva: objetivos diários com ações concretas entre Defesa e Casa. */
(()=>{'use strict';const root=document.getElementById('sm21Journey');if(!root)return;
const $=id=>document.getElementById(id);
const h=()=>{try{return (localStorage.getItem('sg_handle')||'visitante').toLowerCase().replace(/[^a-z0-9._]/g,'').slice(0,30)||'visitante'}catch(_){return 'visitante'}};
const today=()=>new Date().toLocaleDateString('en-CA',{timeZone:'America/Sao_Paulo'});
const store=()=>'sm21_daily_journey_'+h()+'_'+today();
function read(){try{return JSON.parse(localStorage.getItem(store())||'null')||{defense:false,house:false,claimed:false}}catch(_){return {defense:false,house:false,claimed:false}}}
function write(o){try{localStorage.setItem(store(),JSON.stringify(o))}catch(_){}}
function hasDefenseToday(){try{const v=JSON.parse(localStorage.getItem('sg_extras_v1_'+h())||'{}');return v.day===today()&&Number(v.stats?.games)>0}catch(_){return false}}
function render(){
 const s=read();if(hasDefenseToday()&&!s.defense){s.defense=true;write(s)}
 const n=Number(s.defense)+Number(s.house);
 $('sm21JourneyProgress').textContent=n+'/2 atos concluídos';
 $('sm21JourneyBar').style.width=(n*50)+'%';
 $('sm21JourneyDefense').textContent=s.defense?'✓ Partida concluída':'○ Faça uma partida';
 $('sm21JourneyHouse').textContent=s.house?'✓ Casa decorada':'○ Personalize a casa';
 const b=$('sm21JourneyClaim');b.disabled=n<2||s.claimed;
 b.textContent=s.claimed?'✓ Recompensa recebida':n===2?'🌱 Resgatar 25 sementes locais':'🔒 Conclua os dois objetivos';
 $('sm21JourneyDate').textContent=new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'long',timeZone:'America/Sao_Paulo'}).format(new Date());
}
window.addEventListener('sm18:defense-ended',()=>{const s=read();if(!s.defense){s.defense=true;write(s)}render()});
window.addEventListener('sm21:house-updated',()=>{const s=read();if(!s.house){s.house=true;write(s)}render()});
$('sm21JourneyClaim').addEventListener('click',()=>{
 const s=read();if(s.claimed||!s.house||!s.defense)return;
 const key='sg_extras_v1_'+h();let v={};try{v=JSON.parse(localStorage.getItem(key)||'{}')||{}}catch(_){}
 const have=Math.max(0,Number(v.seeds)||0);v.seeds=Math.min(1000000,have+25);
 try{localStorage.setItem(key,JSON.stringify(v));s.claimed=true;write(s)}catch(_){return}
 root.querySelector('#sm21JourneyNotice').textContent='✦ +25 sementes locais recebidas. Sua próxima decoração está mais perto!';
 window.dispatchEvent(new CustomEvent('sm21:seeds-updated',{detail:{seeds:v.seeds}}));render();
});
window.addEventListener('storage',render);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)render()});
window.setInterval(()=>{if(!root.closest('[hidden]'))render()},14000);
render();
})();