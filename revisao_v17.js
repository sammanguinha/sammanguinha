/* Sam Manguinha V17 — correções verificáveis, segredos e interação via Mural moderado */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const root=document.documentElement;
const get=(k)=>{try{return localStorage.getItem(k)}catch{return null}};
const put=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
const account=()=>String(get('sg_handle')||'visitante').replace(/^@/,'').toLowerCase().replace(/[^a-z0-9_.-]/g,'').slice(0,35);
const norm=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]/g,'');
const lowFx=()=>root.classList.contains('sm165-lowfx')||matchMedia('(prefers-reduced-motion: reduce)').matches;
const toast=document.createElement('div');toast.id='sm17Toast';toast.className='sm17-toast';toast.hidden=true;toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');document.body.append(toast);
const banner=document.createElement('div');banner.id='sm17Banner';banner.className='sm17-stage-banner';banner.hidden=true;banner.setAttribute('role','status');banner.setAttribute('aria-live','polite');document.body.append(banner);
let toastTimeout=0,bannerTimeout=0;
function notify(s){toast.textContent=String(s);toast.hidden=false;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>toast.hidden=true,4400)}
function showBanner(s,ms=6500){banner.textContent=String(s);banner.hidden=false;clearTimeout(bannerTimeout);if(ms>0)bannerTimeout=setTimeout(()=>banner.hidden=true,ms)}
function emit(icon,n=14){if(lowFx())return;for(let i=0;i<Math.min(n,35);i++){const p=document.createElement('span');p.textContent=icon;p.className='sm17-particle';p.style.left=(10+Math.random()*80)+'vw';p.style.top=(24+Math.random()*56)+'vh';p.style.animationDelay=(i*.027)+'s';document.body.append(p);setTimeout(()=>p.remove(),1900)}}
function jingle(){try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const a=new AC(),t=a.currentTime;[392,523.25,659.25,783.99,1046.5].forEach((f,i)=>{const o=a.createOscillator(),v=a.createGain();o.type='triangle';o.frequency.value=f;v.gain.setValueAtTime(.001,t+i*.105);v.gain.linearRampToValueAtTime(.065,t+i*.105+.019);v.gain.exponentialRampToValueAtTime(.001,t+i*.105+.26);o.connect(v);v.connect(a.destination);o.start(t+i*.105);o.stop(t+i*.105+.28)});setTimeout(()=>a.close().catch(()=>{}),1350)}catch(e){}}
const classes=['sm17-matrix','sm17-invert','sm17-party','sm17-rainbow','sm17-potato','sm17-sigma'];
let activeMode='';
function mode(m){classes.forEach(c=>root.classList.remove(c));if(activeMode===m){activeMode='';showBanner('Modo desligado. Pomar normalizado.');return}activeMode=m;root.classList.add('sm17-'+m);const titles={matrix:'🟩 POMAR.EXE — VOCÊ É O ESCOLHIDO',invert:'🙃 MANGA REVERSA: O UNIVERSO INVERTEU',party:'🎉 RAVE DAS MANGUEIRAS ATIVADA',rainbow:'🌈 MODO MANGA RGB',potato:'🥔 O POMAR FOI DOMINADO PELAS BATATAS',sigma:'🗿 +999 DE AURA MANGUÍSTICA'};showBanner(titles[m]||m,0)}
const codes=[
 ['BATATA','Modo Batata','A fruta rival que vem da terra.',()=>mode('potato')],
 ['CALABRESO','Calma, Calabreso','Uma palavra que pede calma.',()=>{showBanner('🍕 CALMA, CALABRESO! As pragas entraram em férias.');emit('🍕',20);jingle()}],
 ['AMOGUS','Reunião de Emergência','Um jogo cheio de impostores.',()=>{showBanner('🚨 REUNIÃO DE EMERGÊNCIA: HÁ UMA MANGA SUSPEITA ENTRE NÓS!',8000);emit('📮',24)}],
 ['SIGMA','Manga Sigma','Três letras: começa em SIG...',()=>mode('sigma')],
 ['MATRIX','Pomar.exe','Pílula vermelha ou azul?',()=>mode('matrix')],
 ['ARCOIRIS','Manga RGB','O fenômeno das sete cores.',()=>{mode('rainbow');emit('🌈',15)}],
 ['TANANAN','Orquestra do Pomar','Onomatopeia de uma fanfarra.',()=>{showBanner('🎺 TANANANAN! ORQUESTRA DE MANGA (ORÇAMENTO ZERO)');emit('🎺',13);jingle()}],
 ['PARABENS','Aniversário da Manga','O que se canta numa festa?',()=>{mode('party');emit('🎊',29);jingle()}],
 ['EOMANGA','É O MANGA!','Quando a torcida grita: É O...',()=>{showBanner('🥭 É O MANGAAAAAAAAAA!',6500);emit('🥭',25)}],
 ['ARROZ','Receita Duvidosa','Grão que acompanha feijão.',()=>{showBanner('🍚 ARROZ COM MANGA FOI APROVADO PELO CONSELHO',7500);emit('🍚',17)}],
 ['ABACAXI','Fruta Infiltrada','A fruta espinhosa.',()=>{showBanner('🍍 UM ABACAXI FOI VISTO NO POMAR. SUSPEITO!',7000);emit('🍍',16)}],
 ['INVERTER','Pomar Invertido','Virar ao contrário.',()=>mode('invert')],
 ['GATO','Miau Manguinha','Animal que pede ração às 3 da manhã.',()=>{showBanner('🐈 MIAU. O GATO AGORA É DONO DO POMAR.');emit('🐈',16)}],
 ['CAFE','Modo Café','O combustível dos programadores.',()=>{showBanner('☕ CAFÉ DO BENTO: +300% VONTADE DE NÃO DORMIR (COSMÉTICO)');emit('☕',18)}],
 ['BISCOITO','Biscoito ou Bolacha?','Pergunta que divide famílias.',()=>{showBanner('🍪 O POMAR VOTOU: BISCOITO. DISCUSSÃO ENCERRADA!',9000);emit('🍪',17)}],
 ['MANGASUPREMA','Lenda da Manga Suprema','O próprio nome da fruta + SUPREMA.',()=>{showBanner('👑 MANGA SUPREMA CONVOCOU O CONSELHO DAS 7 BATATAS');emit('👑',24);jingle()}],
 ['ERROR404','O Bug Virou Lenda','Código de erro de página não encontrada.',()=>{showBanner('⚠️ ERRO 404: PRAGAS NÃO ENCONTRADAS. TUDO NORMAL.',9000);emit('💾',17)}],
 ['CAPIVARA','Capivara da Paz','O animal brasileiro mais tranquilo.',()=>{showBanner('🦫 CAPIVARA PACIFICOU TODOS OS BESOUROS (POR 5 SEGUNDOS, NA SUA IMAGINAÇÃO)');emit('🌿',17)}]
].map(([id,title,hint,run])=>({id,title,hint,run}));
const k=()=> 'sm17_found_'+account();
function found(){let a=[];try{a=JSON.parse(get(k())||'[]')||[]}catch{};let legacy=[];try{legacy=JSON.parse(get('sm_v165_codes_'+account())||'[]')||[]}catch{};return [...new Set([...a,...legacy.map(x=>norm(x))])].filter(x=>codes.some(c=>c.id===x))}
function updateList(){const seen=found(),count=$('sm17Count'),out=$('sm17CodesFound');if(count)count.textContent=seen.length+'/'+codes.length+' descobertos';if(out){out.replaceChildren();for(const c of codes){const card=document.createElement('div');card.className='sm17-code-card';card.dataset.found=String(seen.includes(c.id));const title=document.createElement('b'),hint=document.createElement('span');title.textContent=seen.includes(c.id)?'✓ '+c.title:'🔒 ???';hint.textContent=seen.includes(c.id)?c.id:c.hint;card.append(title,hint);out.append(card)}}}
function activate(raw){const id=norm(raw),c=codes.find(x=>x.id===id);if(!c){const msg='Código não encontrado. Confira a escrita ou peça uma pista.';const feedback=$('sm17CodeFeedback');if(feedback)feedback.textContent='❌ '+msg;notify(msg);return false}const seen=found(),first=!seen.includes(id);if(first){seen.push(id);put(k(),JSON.stringify(seen));}c.run();updateList();const msg=(first?'🏆 Descoberto: ':'↻ Ativado: ')+c.title+' — '+id;const feedback=$('sm17CodeFeedback');if(feedback)feedback.textContent=msg;notify(msg);return true}
$('sm17CodeForm')?.addEventListener('submit',e=>{e.preventDefault();activate($('sm17CodeInput').value);$('sm17CodeInput').select()});
$('sm17Hint')?.addEventListener('click',()=>{const unseen=codes.find(c=>!found().includes(c.id));notify(unseen?'💡 '+unseen.hint:'🥭 Você encontrou todos os códigos!')});
$('sm17ShowCodes')?.addEventListener('click',e=>{const out=$('sm17CodesFound');if(!out)return;out.hidden=!out.hidden;e.currentTarget.setAttribute('aria-expanded',String(!out.hidden));updateList()});
$('sm17EffectsReset')?.addEventListener('click',()=>{activeMode='';classes.forEach(c=>root.classList.remove(c));banner.hidden=true;notify('Todos os efeitos temporários foram desligados. Seus códigos continuam descobertos.')});
// Modally entered codes: capture only NEW codes so old achievements keep their existing handler.
$('cForm')?.addEventListener('submit',e=>{const id=norm($('cIn')?.value);if(!codes.some(c=>c.id===id))return;e.preventDefault();e.stopImmediatePropagation();activate(id);$('cDlg')?.close()},true);
updateList();

// Keep the accessibility options of V16.5 functional instead of leaving inert checkboxes.
for(const [id,cls,setting] of [['sm165Contrast','sm165-contrast','contrast'],['sm165LargeText','sm165-large','large'],['sm165LowFX','sm165-lowfx','lowfx']]){
 const el=$(id),key='sm165_pref_'+setting;if(!el)continue;const v=get(key);el.checked=v==='1'||(v===null&&setting==='lowfx'&&matchMedia('(prefers-reduced-motion: reduce)').matches);root.classList.toggle(cls,el.checked);el.addEventListener('change',()=>{root.classList.toggle(cls,el.checked);put(key,el.checked?'1':'0');notify('✅ Acessibilidade: preferência salva.')});
}
// Escape closes the collapsed More menu, including when screen reader focus is inside.
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;const m=$('r14MoreMenu'),b=$('r14MoreToggle');if(m&&!m.hidden){m.hidden=true;b?.setAttribute('aria-expanded','false');b?.focus()}});
// The global moderated mural already uses Supabase. Extend it with replies, safe filtering and daily shared prompts.
const hub=$('sm17Social'),feed=$('murFeed'),form=$('murForm'),msg=$('murTxt'),filter=$('sm17FeedFilter'),search=$('sm17FeedSearch');
const quests=[
 'Qual o seu mascote favorito e por quê? Conte no mural usando #desafio.',
 'Desafio do dia: chegue até a onda 3 no Defesa do Pomar e conte como foi. #desafio',
 'Qual classe do RPG você escolheu? Defenda sua escolha no mural. #desafio',
 'Compartilhe um segredo do Halloween SEM dar spoiler! #desafio',
 'Qual chefão foi o mais difícil para você? Conte sua estratégia. #desafio',
 'Faça uma teoria engraçada sobre o Conselho das Mangueiras. #desafio',
 'Sua melhor jogada de hoje: narre uma batalha ou descoberta. #desafio'
];
const day=()=>new Date().toLocaleDateString('en-CA',{timeZone:'America/Sao_Paulo'});
function challenge(){const d=day(),num=d.split(/\D/).reduce((a,b)=>a+Number(b||0),0);return quests[num%quests.length]}
if($('sm17DailyText'))$('sm17DailyText').textContent=challenge();
function toMural(){const nav=document.querySelector('.areas button[data-p="murDlg"]');if(nav){nav.click();return true}if(typeof window.showPane==='function'){window.showPane('murDlg');return true}return false}
$('sm17GoSocial')?.addEventListener('click',toMural);
$('sm17GoGrimoire')?.addEventListener('click',()=>{const b=document.querySelector('.areas button[data-p="secDlg"]');b?.click();setTimeout(()=>$('sm17CodeInput')?.focus({preventScroll:true}),150)});
$('sm17Join')?.addEventListener('click',()=>{if(!toMural())return;const text=challenge().replace(/\s*#desafio/i,'').slice(0,195);if(msg){if($('murCat'))$('murCat').value='pergunta';msg.value='#desafio '+text+' Minha resposta: ';msg.focus();msg.scrollIntoView({behavior:lowFx()?'auto':'smooth',block:'center'})}notify('✍️ Escreva sua resposta. Ela só fica pública após moderação.')});
function decorateFeed(){if(!feed)return;const entries=[...feed.querySelectorAll('li[data-id]')];for(const li of entries){if(li.dataset.sm17Done==='1')continue;const id=String(li.dataset.id||''),name=(li.querySelector('.nm')?.textContent||'').replace(/^\s*@/,'').trim().slice(0,30);if(!/^\d+$/.test(id)||!name)continue;li.dataset.sm17Done='1';const div=document.createElement('div');div.className='sm17-message-actions';const reply=document.createElement('button');reply.type='button';reply.textContent='↩ Responder';reply.dataset.replyId=id;reply.dataset.replyName=name;const marker=document.createElement('span');marker.className='sm17-thread-id';marker.textContent='Mensagem #'+id;div.append(reply,marker);li.append(div)}filterFeed()}
function filterFeed(){if(!feed)return;const q=(search?.value||'').trim().toLowerCase(),mode=filter?.value||'all';let shown=0;for(const li of feed.querySelectorAll('li[data-id]')){const full=(li.querySelector('.hand')?.textContent||'').toLowerCase(),by=(li.querySelector('.nm')?.textContent||'').toLowerCase();const matches=(mode==='all'||(mode==='replies'&&(full.includes('↪')||full.includes('resposta #')||full.includes('respondendo @')))||(mode==='challenge'&&full.includes('#desafio')))&&(!q||(full+' '+by).includes(q));li.hidden=!matches;if(matches)shown++}const status=$('sm17FeedStatus');if(status&&feed.querySelector('li[data-id]'))status.textContent=shown+' mensagem(ns) exibida(s). As respostas são publicadas após aprovação pelo administrador.'}
if(feed){new MutationObserver(decorateFeed).observe(feed,{childList:true});feed.addEventListener('click',e=>{const btn=e.target.closest('[data-reply-id]');if(!btn||!msg)return;if(!toMural())return;const seed='↪ @'+btn.dataset.replyName+' (#'+btn.dataset.replyId+'): ';msg.value=seed;msg.focus();msg.setSelectionRange(seed.length,seed.length);msg.scrollIntoView({behavior:lowFx()?'auto':'smooth',block:'center'});notify('Resposta criada. Escreva sua mensagem e envie para aprovação.')});decorateFeed()}
filter?.addEventListener('change',filterFeed);search?.addEventListener('input',filterFeed);
const refresh=$('sm17Refresh');refresh?.addEventListener('click',async()=>{refresh.disabled=true;const status=$('sm17FeedStatus');if(status)status.textContent='Atualizando mensagens compartilhadas…';try{if(typeof window.loadMural==='function')await window.loadMural();else if(typeof loadMural==='function')await loadMural();decorateFeed();}catch(e){if(status)status.textContent='Não foi possível atualizar o mural. Tente novamente.'}finally{refresh.disabled=false}});
// Avoid duplicate submits while a request is pending; server still determines auth, rate limit, and moderation.
if(form){form.addEventListener('submit',()=>{const b=form.querySelector('[type="submit"]');if(!b)return;b.disabled=true;setTimeout(()=>{b.disabled=false},1800)},false)}
let lastFetch=0;
const tab=document.querySelector('.areas');tab?.addEventListener('click',e=>{const btn=e.target.closest('button[data-p="murDlg"]');if(btn&&Date.now()-lastFetch>45000){lastFetch=Date.now();setTimeout(decorateFeed,180)}});

// Arena pause: no extra scoring, no rank manipulation, state is local to the current game.
$('sm17PauseBtn')?.addEventListener('click',()=>{try{if(gs)sm17GamePause(!sm17GamePaused)}catch(e){notify('Não foi possível pausar esta partida.')}});
$('sm17ResumeOverlay')?.addEventListener('click',()=>{try{if(gs)sm17GamePause(false)}catch(e){notify('Não foi possível retomar a partida.')}});
document.addEventListener('keydown',e=>{if(e.key.toLowerCase()!=='p'||e.repeat||e.ctrlKey||e.metaKey||e.altKey)return;const target=e.target;if(target&&(target.closest('input,textarea,select,[contenteditable=true]')||target.closest('dialog[open]')))return;try{if(gs&&!$('gameDlg')?.hidden){e.preventDefault();sm17GamePause(!sm17GamePaused)}}catch(err){}});
window.SamReview17=Object.freeze({version:'17.0',activate,found,challenge,decorateFeed,filterFeed});
})();
