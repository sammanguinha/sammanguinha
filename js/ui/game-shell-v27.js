/* V27 — Interface visual desacoplada: apenas snapshots e comandos autorizados do SamGameV27. */
(()=>{
 'use strict';
 if(window.SamGameShellV27)return;
 const bridge=window.SamGameV27;
 if(!bridge){console.warn('HUD V27: contrato de estado indisponível');return}
 const $=id=>document.getElementById(id);
 const mk=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!=null)el.textContent=text;return el};
 const safeStorage={get(k){try{return localStorage.getItem(k)}catch(_){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(_){}}};
 const themeKey='sam_v27_visual_theme';
 const saved=safeStorage.get(themeKey);
 let theme=saved==='eclipse'?'eclipse':'aurora';
 function setTheme(next){
   theme=next==='eclipse'?'eclipse':'aurora';
   document.documentElement.dataset.v27Theme=theme;
   safeStorage.set(themeKey,theme);
   document.querySelectorAll('.v27-theme-button').forEach(btn=>{
     btn.textContent=theme==='eclipse'?'☀️ Aurora':'🌙 Eclipse';
     btn.setAttribute('aria-label','Trocar aparência para '+(theme==='eclipse'?'Aurora':'Eclipse'));
     btn.setAttribute('aria-pressed',String(theme==='eclipse'));
   });
 }
 function themeButton(){
   const btn=mk('button','v27-theme-button');btn.type='button';
   btn.title='Alterar tema visual · opção salva neste dispositivo';
   btn.addEventListener('click',()=>setTheme(theme==='aurora'?'eclipse':'aurora'));
   return btn;
 }
 setTheme(theme);
 const panes=[
   ['home','.r23-home-hero'],
   ['rpgDlg','.r12-head'],
   ['gameDlg','.ptitle'],
   ['eventDlg','.h8-head'],
   ['houseDlg','.sm21-house-top'],
   ['profDlg','.map-header']
 ];
 for(const [id,selector]of panes){
   const host=$(id)?.querySelector(selector);
   if(host){host.classList.add('v27-theme-anchor');host.append(themeButton())}
 }
 setTheme(theme);
 function meter(label,icon,max=100){
   const stat=mk('div','v27-stat');
   const caption=mk('span','v27-stat-label',icon+' '+label);
   const value=mk('b','v27-stat-value','—');
   const rail=mk('div','v27-stat-rail');
   const fill=mk('i','v27-stat-fill');rail.append(fill);
   stat.append(caption,value,rail);
   return {stat,value,rail,fill,max};
 }
 function update(m,value,max){
   const validMax=Math.max(1,Number(max)||m.max),n=Math.max(0,Number(value)||0);
   m.value.textContent=String(Math.round(n));
   m.fill.style.width=Math.min(100,Math.max(0,n/validMax*100)).toFixed(1)+'%';
   m.rail.setAttribute('role','progressbar');
   m.rail.setAttribute('aria-label',m.stat.querySelector('.v27-stat-label').textContent);
   m.rail.setAttribute('aria-valuemin','0');
   m.rail.setAttribute('aria-valuemax',String(validMax));
   m.rail.setAttribute('aria-valuenow',String(Math.min(validMax,Math.round(n))));
 }
 function hud(id,title){
   const el=mk('aside','v27-live-hud');
   el.id=id;el.setAttribute('aria-label',title);
   const heading=mk('div','v27-hud-heading');
   const mark=mk('span','v27-hud-mark',title);heading.append(mark);
   const contents=mk('div','v27-stats');el.append(heading,contents);
   return {el,heading,mark,contents};
 }
 function actionButton(text,id){
   const button=mk('button','v27-action',text);
   button.type='button';button.dataset.v27Action=id;
   button.addEventListener('click',()=>bridge.action(id));
   return button;
 }
 const rpg=$('rpgDlg'),game=$('gameDlg');
 const frame=rpg?.querySelector('.r12-frame');
 let rHud=null,gHud=null,rStats={},gStats={};
 if(frame){
   rHud=hud('v27RpgHud','✧ GUARDIÃO');
   rStats.hp=meter('VIDA','❤',100);
   rStats.mp=meter('MAGIA','✦',30);
   rStats.stamina=meter('FÔLEGO','⚡',100);
   rStats.gold=mk('span','v27-hud-currency','🪙 0');
   rStats.region=mk('span','v27-hud-region','VILA');
   for(const v of [rStats.hp,rStats.mp,rStats.stamina])rHud.contents.append(v.stat);
   rHud.heading.append(rStats.region);rHud.el.append(rStats.gold);
   frame.append(rHud.el);
   const toolbar=mk('nav','v27-actionbar v27-rpg-actionbar');
   toolbar.setAttribute('aria-label','Atalhos rápidos da aventura');
   toolbar.append(
     actionButton('🎒 Mochila','rpg:inventory'),
     actionButton('📜 Missões','rpg:quests'),
     actionButton('🛒 Loja','rpg:shop')
   );
   rpg.append(toolbar);
 }
 if(game){
   gHud=hud('v27DefenseHud','✦ DEFESA DO POMAR');
   gStats.hp=meter('VIDA','❤',6);
   gStats.trees=meter('ÁRVORES','🌳',3);
   gStats.wave=mk('b','v27-wave','ONDA —');
   gStats.points=mk('span','v27-score','0 PONTOS');
   gStats.energy=mk('span','v27-energy','✦ 0 ENERGIA');
   const lead=mk('div','v27-defense-lead');lead.append(gStats.wave,gStats.points,gStats.energy);
   gHud.el.insertBefore(lead,gHud.contents);
   gHud.contents.append(gStats.hp.stat,gStats.trees.stat);
   game.append(gHud.el);
   const toolbar=mk('nav','v27-actionbar v27-defense-actionbar');
   toolbar.setAttribute('aria-label','Ações rápidas da batalha');
   toolbar.append(actionButton('⏸ Pausar','defense:pause'),actionButton('🏰 Torres','defense:tactics'),actionButton('🌿 Pulso','defense:pulse'));
   game.append(toolbar);
 }
 let previousMode='';
 function paint(state){
   if(state.mode==='rpgDlg'&&state.rpg&&rHud){
     const x=state.rpg;
     update(rStats.hp,x.hp,x.maxHp);
     update(rStats.mp,x.mp,x.maxMp);
     update(rStats.stamina,x.stamina,x.maxStamina);
     rStats.gold.textContent='🪙 '+x.gold+' moedas · Nv. '+x.level;
     rStats.region.textContent=x.region.toUpperCase().replace(/_/g,' ');
     rHud.el.dataset.empty='false';
   }else if(rHud&&state.mode==='rpgDlg'){rHud.el.dataset.empty='true'}
   if(state.mode==='gameDlg'&&state.defense&&gHud){
     const x=state.defense;
     update(gStats.hp,x.hp,x.maxHp);
     update(gStats.trees,x.trees,Math.max(1,x.totalTrees));
     gStats.wave.textContent=x.active?'ONDA '+x.wave:'PRONTO PARA DEFENDER';
     gStats.points.textContent=x.score.toLocaleString('pt-BR')+' PONTOS';
     gStats.energy.textContent='✦ '+x.energy+' ENERGIA';
     gHud.el.dataset.empty=x.active?'false':'true';
     const pulse=game.querySelector('[data-v27-action="defense:pulse"]');
     const pause=game.querySelector('[data-v27-action="defense:pause"]');
     if(pulse){pulse.disabled=!x.pulseReady;pulse.title=x.difficulty==='normal'?'Disponível apenas no Difícil e Infinito':'Pulso do Bosque (6 de energia)'}
     if(pause){pause.disabled=!x.active;pause.textContent=x.paused?'▶ Continuar':'⏸ Pausar'}
   }
   if(state.mode!==previousMode){
     previousMode=state.mode;
     document.body.dataset.v27Mode=state.mode;
   }
 }
 const unsub=bridge.subscribe(paint);
 const pulse=game?.querySelector('[data-v27-action="defense:pulse"]');
 if(pulse)pulse.disabled=true;
 window.SamGameShellV27=Object.freeze({setTheme,getTheme:()=>theme,refresh:()=>paint(bridge.getSnapshot()),destroy:unsub});
})();
