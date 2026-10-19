/* V33.4 · Horta viva do Refúgio. Os recursos pertencem ao save RPG por conta;
   a economia usa apenas sementes LOCAIS já utilizadas pela Casa/Defesa. */
(()=>{'use strict';
 const api=window.SamHybridRPG,house=document.getElementById('houseDlg');
 if(!api?.getGardenV34||!house)return;
 const elem=(tag,cls,text)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x};
 const root=elem('section','sm34-garden');root.id='sm34Garden';root.setAttribute('aria-labelledby','sm34Title');
 root.innerHTML='<div class="sm34-garden-heading"><div><span class="sm34-eyebrow">VIDA NO POMAR · V33.4</span><h3 id="sm34Title">🌱 Horta do Guardião</h3><p>Plante, regue, colha e prepare itens que entram de verdade na mochila RPG.</p></div><div class="sm34-garden-budget"><span>SEMENTES LOCAIS</span><strong id="sm34Wallet">🌱 0</strong></div></div>'+
  '<div class="sm34-garden-work"><div class="sm34-field"><div id="sm34PlantChoices" class="sm34-seed-row" role="group" aria-label="Escolha de cultivos"></div><div id="sm34Plots" class="sm34-plots" aria-label="Seis canteiros cultiváveis"></div>'+
   '<p id="sm34GardenNotice" role="status" aria-live="polite">Selecione uma cultura e um canteiro vazio para começar.</p></div>'+
   '<aside class="sm34-garden-satchel"><h4>🎒 Bolsa de ingredientes</h4><div id="sm34Resources"></div><h4>🧪 Oficina de receitas</h4><div id="sm34Crafts"></div>'+
   '<div class="sm34-daily"><h4>📜 Contrato de Hoje</h4><p id="sm34Contract">Colha e prepare uma receita para ganhar moedas RPG locais.</p><button type="button" id="sm34DailyClaim">Entregar contrato · +20 moedas RPG</button></div>'+ 
   '<p class="sm34-disclaimer">Cultivo e receitas são locais e não geram mangas oficiais, posição no ranking ou compras externas. O progresso segue o save RPG desta conta.</p></aside></div>';
 const existing=document.getElementById('sm21House');
 existing.after(root);
 let selected='erva',lastJSON='',lastTick=0;
 const choices=root.querySelector('#sm34PlantChoices'),plots=root.querySelector('#sm34Plots'),resources=root.querySelector('#sm34Resources'),crafts=root.querySelector('#sm34Crafts');
 const notice=root.querySelector('#sm34GardenNotice'),wallet=root.querySelector('#sm34Wallet');
 const cropNames={erva:'Erva do Guardião',orvalho:'Flor do Orvalho',lunar:'Flor da Lua'};
 const labels={erva:'🌿',orvalho:'💧',lunar:'🌙'};
 const recipeNames={pocao:'Poção RPG',mana:'Infusão Lunar',amuleto:'Amuleto dos Jardineiros'};
 const asTime=millis=>{const secs=Math.ceil(Math.max(0,millis)/1000);return secs>=60?Math.floor(secs/60)+'m '+String(secs%60).padStart(2,'0')+'s':secs+'s'};
 function read(){return api.getGardenV34()}
 function draw(){
  const data=read(),now=Date.now();
  wallet.textContent='🌱 '+data.seeds.toLocaleString('pt-BR');
  choices.replaceChildren(...Object.entries(data.plants).map(([key,item])=>{
   const button=elem('button','sm34-seed-choice',item.emoji+' '+item.name);
   button.type='button';button.dataset.sm34Crop=key;
   button.setAttribute('aria-pressed',String(selected===key));
   button.title=item.cost+' sementes · '+asTime(item.grow)+' de crescimento';
   const small=elem('small',null,item.cost+' 🌱 · '+asTime(item.grow));button.append(small);
   return button;
  }));
  plots.replaceChildren(...data.plots.map((p,index)=>{
   const button=elem('button','sm34-plot'+(p?' growing':' empty'));
   button.type='button';button.dataset.sm34Plot=String(index);
   const ripe=p&&now>=p.readyAt;
   if(ripe)button.classList.add('ripe');
   button.setAttribute('aria-label','Canteiro '+(index+1)+': '+(p?cropNames[p.kind]+(ripe?' pronto para colher':' crescendo'):'vazio, plantar '+cropNames[selected]));
   const icon=elem('span','sm34-plot-icon',p?(ripe?'🌾':p.watered?'🌷':'🌱'):'✚');
   const name=elem('b',null,p?cropNames[p.kind]:'Canteiro '+(index+1));
   const detail=elem('small',null,!p?'Plantar aqui':ripe?'✓ Colher agora':(p.watered?'Regado · ':'Regar · ')+asTime(p.readyAt-now));
   button.append(icon,name,detail);return button;
  }));
  resources.replaceChildren(...Object.entries(data.resources).map(([key,count])=>{
   const row=elem('div','sm34-resource');
   row.append(elem('span',null,labels[key]+' '+cropNames[key]),elem('strong',null,String(count)));
   return row;
  }));
  crafts.replaceChildren(...Object.entries(data.recipes).map(([id,r])=>{
   const button=elem('button','sm34-craft');button.type='button';button.dataset.sm34Craft=id;
   const available=Object.entries(r.cost).every(([name,count])=>data.resources[name]>=count);
   const done=id==='amuleto'&&data.unlocked.aurora;
   button.disabled=!available||done;
   button.append(elem('b',null,id==='pocao'?'🧪 '+recipeNames[id]:id==='mana'?'🌙 '+recipeNames[id]:'🛡 '+recipeNames[id]),
    elem('small',null,done?'Relíquia já forjada':r.description));
   return button;
  }));
  const today=api.getDailyContractV35?.();
  if(today){
   const contract=root.querySelector('#sm34Contract'),claim=root.querySelector('#sm34DailyClaim');
   contract.textContent=(today.harvest?'✓':'◇')+' Colheita feita hoje · '+(today.craft?'✓':'◇')+' Receita preparada hoje';
   claim.disabled=(!today.harvest||!today.craft||today.claimed);
   claim.textContent=today.claimed?'✓ Contrato concluído — volte amanhã':'Entregar contrato · +20 moedas RPG';
  }
  root.dataset.grown=String(data.harvests);
 }
 function action(result){notice.textContent=result.message;notice.dataset.state=result.ok?'ok':'error';draw();}
 choices.addEventListener('click',e=>{
  const crop=e.target.closest('[data-sm34-crop]')?.dataset.sm34Crop;if(!crop)return;
  selected=crop;draw();notice.textContent='Selecionado: '+cropNames[crop]+'. Toque num canteiro vazio.';
 });
 plots.addEventListener('click',e=>{
  const tile=e.target.closest('[data-sm34-plot]');if(!tile)return;
  const i=Number(tile.dataset.sm34Plot),data=read(),crop=data.plots[i];
  if(!crop)return action(api.plantV34(i,selected));
  if(Date.now()>=crop.readyAt)return action(api.harvestV34(i));
  return action(api.waterV34(i));
 });
 root.querySelector('#sm34DailyClaim').addEventListener('click',()=>{
  const r=api.claimDailyV35();notice.textContent=r.message;notice.dataset.state=r.ok?'ok':'error';draw();
 });
 crafts.addEventListener('click',e=>{
  const recipe=e.target.closest('[data-sm34-craft]')?.dataset.sm34Craft;
  if(recipe)action(api.craftV34(recipe));
 });
 // Continuous updates only when the house is visible. Plants grow by wall clock,
 // including while the player is offline; no page refresh is necessary.
 function refreshCountdown(){
  // Never replace active buttons during pointerdown/focus: that cancels clicks.
  const data=read(),now=Date.now();
  for(const tile of plots.querySelectorAll('button[data-sm34-plot]')){
   const i=Number(tile.dataset.sm34Plot),p=data.plots[i];if(!p)continue;
   const ready=now>=p.readyAt;
   tile.classList.toggle('ripe',ready);
   tile.setAttribute('aria-label','Canteiro '+(i+1)+': '+cropNames[p.kind]+(ready?' pronto para colher':' crescendo'));
   const icon=tile.querySelector('.sm34-plot-icon'),small=tile.querySelector('small');
   if(icon)icon.textContent=ready?'🌾':p.watered?'🌷':'🌱';
   if(small)small.textContent=ready?'✓ Colher agora':(p.watered?'Regado · ':'Regar · ')+asTime(p.readyAt-now);
  }
 }
 function poll(now){
  if(!house.hidden&&now-lastTick>900){lastTick=now;refreshCountdown()}
  requestAnimationFrame(poll);
 }
 requestAnimationFrame(poll);
 window.addEventListener('storage',e=>{if(e.key?.startsWith('sg_extras_v1_')||e.key?.startsWith('sam_rpg_hibrido_v12_'))draw()});
 // Focus must not rebuild the pressed button; user actions refresh immediately.
 draw();
 // Local wardrobe extension: changes actually render on the RPG canvas.
 const profile=document.getElementById('profDlg');
 if(profile){
  const section=elem('section','sm34-wardrobe');section.id='sm34Wardrobe';
  section.innerHTML='<div class="sm34-garden-heading"><div><span class="sm34-eyebrow">ESTILO DE JORNADA · V33.4</span><h3>✨ Acessórios do Guardião</h3><p>Ganhe novos visuais colhendo ingredientes e criando o Amuleto. Eles aparecem no personagem dentro do RPG.</p></div></div>'+
   '<div class="sm34-wardrobe-layout"><canvas id="sm34WardrobePreview" width="128" height="160" aria-label="Prévia em pixel art do acessório selecionado" role="img"></canvas><div><div id="sm34Accessories" class="sm34-accessories" role="group" aria-label="Escolher acessório local"></div><p id="sm34WardrobeStatus" role="status" aria-live="polite">Escolha um visual.</p><small>Chapéus e cores oficiais continuam no editor original; estes acessórios são locais ao seu RPG.</small></div></div>';
  profile.append(section);
  const output=section.querySelector('#sm34Accessories'),status=section.querySelector('#sm34WardrobeStatus'),canvas=section.querySelector('#sm34WardrobePreview');
  const skins={none:['Clássico','Sempre disponível'],leaf:['Coroa da Aurora','2 colheitas'],scarf:['Cachecol de Iara','5 colheitas'],aurora:['Aura do Jardineiro','Forjar Amuleto']};
  function preview(kind){
   const g=canvas.getContext('2d');g.clearRect(0,0,128,160);
   g.fillStyle='#192d38';g.fillRect(0,0,128,160);
   g.fillStyle='#304a4b';g.fillRect(12,130,104,10);
   const tmp=document.createElement('canvas');tmp.width=16;tmp.height=20;
   if(typeof drawAv==='function')drawAv(tmp,typeof draft!=='undefined'?draft:{c:0,h:'none'});
   g.imageSmoothingEnabled=false;g.drawImage(tmp,16,20,96,120);
   if(kind==='leaf'){
    g.fillStyle='#75b48b';g.fillRect(39,13,49,14);g.fillStyle='#c3e59d';g.fillRect(57,3,20,18);
   }else if(kind==='scarf'){
    g.fillStyle='#e1b785';g.fillRect(23,80,80,14);g.fillStyle='#aa6a69';g.fillRect(89,92,13,35);
   }else if(kind==='aurora'){
    g.strokeStyle='#9cebc8';g.lineWidth=5;g.beginPath();g.ellipse(64,81,53,67,0,0,Math.PI*2);g.stroke();
   }
  }
  function refresh(){
   const v=read();output.replaceChildren(...Object.entries(skins).map(([id,[name,requirement]])=>{
    const btn=elem('button','sm34-accessory');btn.dataset.sm34Accessory=id;btn.type='button';
    btn.disabled=!v.unlocked[id];btn.setAttribute('aria-pressed',String(v.accessory===id));
    btn.append(elem('b',null,(id==='none'?'🥭 ':id==='leaf'?'🌿 ':id==='scarf'?'🧣 ':'✨ ')+name),
     elem('small',null,v.unlocked[id]?(v.accessory===id?'✓ Equipado':'Equipar'):('🔒 '+requirement)));return btn;
   }));preview(v.accessory);
  }
  output.addEventListener('click',e=>{
   const key=e.target.closest('[data-sm34-accessory]')?.dataset.sm34Accessory;
   if(!key)return;
   const response=api.dressV34(key);status.textContent=response.message;status.dataset.state=response.ok?'ok':'error';refresh();
  });
  profile.addEventListener('pointerenter',refresh);
  // No focus-triggered rebuild here: clicks on accessories must remain stable.
  refresh();
  const notify=()=>{if(!profile.hidden)refresh()};setInterval(notify,3000);
 }
 window.SamGardenV34=Object.freeze({refresh:draw,snapshot:read});
})();
