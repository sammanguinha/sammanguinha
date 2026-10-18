/* V23: central de jornada e acessibilidade, sem substituir os saves ou o roteador existente. */
(()=>{'use strict';
const $=id=>document.getElementById(id),root=$('v23Journey');
if(!root)return;
const settingKey='sam_v23_preferences';
const allowed=['contrast','motion','text'];
const pref=(()=>{try{const raw=JSON.parse(localStorage.getItem(settingKey)||'{}');return Object.fromEntries(allowed.map(k=>[k,!!raw[k]]))}catch(_){return {contrast:false,motion:false,text:false}}})();
const handle=()=>{try{return String(localStorage.getItem('sg_handle')||'visitante').toLowerCase().replace(/[^a-z0-9._]/g,'').slice(0,30)||'visitante'}catch(_){return 'visitante'}};
const get=(key)=>{try{return JSON.parse(localStorage.getItem(key)||'null')}catch(_){return null}};
function applySettings(){
 const el=document.documentElement;
 el.classList.toggle('v23-high-contrast',pref.contrast);
 el.classList.toggle('v23-reduce-motion',pref.motion);
 el.classList.toggle('v23-large-text',pref.text);
 root.querySelectorAll('[data-v23-setting]').forEach(button=>button.setAttribute('aria-pressed',String(!!pref[button.dataset.v23Setting])));
}
root.querySelectorAll('[data-v23-setting]').forEach(button=>button.addEventListener('click',()=>{
 const key=button.dataset.v23Setting;if(!allowed.includes(key))return;
 pref[key]=!pref[key];
 applySettings();
 try{localStorage.setItem(settingKey,JSON.stringify(pref))}catch(_){}
}));
function updateDashboard(){
 const h=handle(),world=get('sam_rpg_hibrido_v12_'+h),home=get('sam21_casa_'+h);
 const arena=get('sg_extras_v1_'+h),mission=world?.v23,light=Array.isArray(mission?.lit)?mission.lit.length:0;
 const region=String(world?.map||'vila');
 const names={vila:'Vila da Mangueira',floresta:'Trilha Encantada',ruinas:'Santuário das Raízes',estufa:'Estufa das Brasas',bosque:'Bosque das Teias',mina:'Minas do Prisma',pantano:'Pântano das Memórias',observatorio:'Observatório Lunar',coracao:'Coração do Pomar'};
 const location=names[region]||'Seu mundo RPG';
 const quest=mission?.rewarded?'Ronda concluída · 3/3 lanternas':mission?.started?'Acender lanternas · '+light+'/3':'Fale com Mira na vila';
 const house=home&&Array.isArray(home.items)?home.items.length+' móveis colocados':'Refúgio pronto para decorar';
 const games=Number(arena?.stats?.games)||0;
 const set=(id,value)=>{const el=$(id);if(el&&el.textContent!==value)el.textContent=value};
 set('v23Region',location);set('v23MissionStatus',quest);set('v23HomeStatus',house);
 set('v23DefenseStatus',games+' partida'+(games===1?'':'s')+' registrada'+(games===1?'':'s')+' localmente');
 set('v23Welcome',h==='visitante'?'Uma nova jornada começa aqui':'Bem-vindo de volta, @'+h);
}
applySettings();
updateDashboard();
document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateDashboard()});
window.addEventListener('storage',updateDashboard);
window.addEventListener('sam21:home-local-change',updateDashboard);
window.addEventListener('sm18:defense-ended',updateDashboard);
window.addEventListener('sm18:account-changed',updateDashboard);
const refresh=window.setInterval(()=>{if(!document.hidden&&root.getBoundingClientRect().width>0)updateDashboard()},6000);
window.Sam23Hub=Object.freeze({refresh:updateDashboard,version:'23.0.0'});
})();
