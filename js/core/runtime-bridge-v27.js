/* V27 — Contrato de leitura entre os motores legados e as interfaces novas.
   Clássico/síncrono: lê o escopo global original, sem alterar lógica nem persistência. */
(()=>{
 'use strict';
 if(window.SamGameV27)return;
 const listeners=new Set();
 let timer=0,previous='',lastMode='';
 const num=(n,def=0)=>Number.isFinite(Number(n))?Number(n):def;
 const clamp=(n,min,max)=>Math.min(max,Math.max(min,num(n)));
 const gameMode=()=>{
   for(const id of ['rpgDlg','gameDlg','eventDlg','houseDlg','profDlg']){
     const el=document.getElementById(id);if(el&&!el.hidden)return id;
   }
   return 'home';
 };
 function getSnapshot(){
   const mode=gameMode(),record={version:27,mode};
   if(mode==='rpgDlg'){
     try{
       const data=window.SamHybridRPG?.getState?.();
       if(data){
         const e=data.epic||{},extra=e.v24||{};
         const vitals=window.SamHybridRPG?.getVitals?.()||{};
         const hpMax=Math.max(1,num(vitals.maxHp,Math.max(1,num(e.hp,1))));
         record.rpg=Object.freeze({
           region:String(data.map||'vila').slice(0,80),
           gold:Math.max(0,Math.floor(num(e.gold))),
           level:Math.max(1,Math.floor(num(e.level,1))),
           hp:Math.max(0,Math.floor(num(vitals.hp??e.hp,0))),
           maxHp:hpMax,
           mp:Math.max(0,Math.floor(num(vitals.mp??e.mp,0))),
           maxMp:Math.max(1,Math.floor(num(vitals.maxMp,20))),
           stamina:clamp(vitals.stamina??extra.stamina??100,0,140),
           maxStamina:Math.max(100,Math.floor(num(vitals.maxStamina,100))),
           potions:Math.max(0,Math.floor(num(e.potions))),
           seeds:Array.isArray(data.found)?data.found.length:0,
           classId:String(e.class||'guardiao').slice(0,40)
         });
       }
     }catch(_){/* The RPG can be loading while the view is first shown. */}
   }
   if(mode==='gameDlg'){
     try{
       const s=gs;
       record.defense=Object.freeze({
         active:!!s,
         paused:!!sm17GamePaused,
         wave:s?Math.max(1,Math.floor(num(s.wave,1))):0,
         score:s?Math.max(0,Math.floor(num(s.score))):0,
         energy:s?Math.max(0,Math.floor(num(s.energy))):0,
         hp:s?Math.max(0,Math.floor(num(s.playerHp))):0,
         maxHp:s?Math.max(1,Math.floor(num(s.playerMaxHp,6))):6,
         trees:s&&Array.isArray(s.trees)?s.trees.filter(Boolean).length:0,
         totalTrees:s&&Array.isArray(s.trees)?s.trees.length:0,
         combo:s?Math.max(0,Math.floor(num(s.combo))):0,
         kills:s?Math.max(0,Math.floor(num(s.kills))):0,
         difficulty:String(s?.mode||gDifficulty||'normal'),
         pulseReady:!!(s&&s.mode!=='normal'&&!sm17GamePaused&&s.energy>=6&&!(s.groveCd>0))
       });
     }catch(_){}
   }
   return Object.freeze(record);
 }
 function action(id){
   // Return a result only for explicitly supported actions. Never set money, HP, rank or XP here.
   const mode=gameMode();
   const pane=document.getElementById(mode);
   const immersive=!!pane?.classList.contains('sm-immersive');
   if(id==='rpg:shop'&&mode==='rpgDlg'&&window.SamHybridRPG?.openShop){window.SamHybridRPG.openShop();return true}
   if(id==='rpg:inventory'&&mode==='rpgDlg'&&immersive){
     const menu=pane.querySelector('.sm-immersive-menu');
     if(!menu)return false;
     menu.click();return true;
   }
   if(id==='rpg:quests'&&mode==='rpgDlg'&&immersive){
     if(!pane.classList.contains('sm-immersive-panel-open'))pane.querySelector('.sm-immersive-menu')?.click();
     const target=pane.querySelector('#r12Quests')||pane.querySelector('.r12-aside .r12-card');
     target?.scrollIntoView({block:'start',behavior:'auto'});return !!target;
   }
   if(id==='defense:tactics'&&mode==='gameDlg'&&immersive){
     const menu=pane.querySelector('.sm-immersive-menu');if(!menu)return false;
     menu.click();return true;
   }
   if(id==='defense:pause'&&mode==='gameDlg'){
     const button=document.getElementById('sm17PauseBtn');
     if(!button||button.disabled)return false;
     button.click();return true;
   }
   if(id==='defense:pulse'&&mode==='gameDlg'){
     const button=document.getElementById('sm24GrovePulse');
     if(!button||button.disabled)return false;
     button.click();return true;
   }
   return false;
 }
 function publish(force=false){
   if(document.hidden&&!force)return;
   const state=getSnapshot();
   const signature=JSON.stringify(state);
   if(signature===previous&&!force)return;
   previous=signature;
   for(const listener of listeners){
     try{listener(state)}catch(error){console.error('V27 HUD subscriber:',error)}
   }
   if(state.mode!==lastMode){
     lastMode=state.mode;
     document.dispatchEvent(new CustomEvent('sam:modechange',{detail:{mode:state.mode}}));
   }
   document.dispatchEvent(new CustomEvent('sam:state',{detail:state}));
 }
 function subscribe(listener){
   if(typeof listener!=='function')throw new TypeError('Listener deve ser uma função');
   listeners.add(listener);
   try{listener(getSnapshot())}catch(error){console.error('V27 subscriber:',error)}
   if(!timer)timer=setInterval(()=>publish(false),350);
   return ()=>{
     listeners.delete(listener);
     if(!listeners.size&&timer){clearInterval(timer);timer=0}
   };
 }
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)publish(true)});
 window.SamGameV27=Object.freeze({getSnapshot,subscribe,action,refresh:()=>publish(true)});
})();
