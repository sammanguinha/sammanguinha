'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'expedicao_v18.js'),'utf8');
function boot(data=new Map()){
 const dom=new Map(),controls={},events={};
 const elem=()=>{const o={hidden:false,style:{},dataset:{},textContent:'',innerHTML:'',children:[],listeners:{},append(...v){this.children.push(...v)},prepend(...v){this.children.unshift(...v)},before(){},replaceChildren(...v){this.children=v},addEventListener(k,fn){this.listeners[k]=fn},click(){this.listeners.click?.()},setAttribute(){},scrollIntoView(){},focus(){},querySelector(){return null},querySelectorAll(s){return s==='[data-sm18-action]'?Object.values(controls):[]}};
 let id='';Object.defineProperty(o,'id',{get(){return id},set(v){id=v;dom.set(v,o)}});return o};
 for(const id of ['panes','home','diary','sm18Canvas','sm18Resume','sm19DialogNext','sm19Replay','sm18Pause','sm18Restart','sm18Sound'])dom.set(id,elem());
 for(const action of ['up','down','left','right','attack','heal','pulse','guard']){controls[action]=elem();controls[action].dataset.sm18Action=action}
 const canvas=dom.get('sm18Canvas');
 const ctx=new Proxy({createRadialGradient(){return {addColorStop(){}}}}, {get(target,k){return Object.hasOwn(target,k)?target[k]:(()=>{})},set(target,k,v){target[k]=v;return true}});
 canvas.getContext=()=>ctx;canvas.getBoundingClientRect=()=>({left:0,top:0,width:720,height:480});
 const document={hidden:false,createElement:elem,getElementById(id){if(!dom.has(id))dom.set(id,elem());return dom.get(id)},querySelector(){return elem()},querySelectorAll(){return []},addEventListener(type,fn){events[type]=fn}};
 const window={matchMedia(){return {matches:false}},addEventListener(){},dispatchEvent(){},showPane(id){dom.get(id).hidden=false}};
 const localStorage={getItem(k){return data.get(k)??null},setItem(k,v){data.set(k,String(v))}};
 function Image(){this.complete=false;this.naturalWidth=0}
 Object.defineProperty(Image.prototype,'src',{get(){return this._src},set(v){this._src=v}});
 const context={document,window,localStorage,Image,performance:{now:()=>1000},requestAnimationFrame(){return 1},MutationObserver:class{observe(){}},CustomEvent:class{constructor(n,o){this.type=n;this.detail=o?.detail}},confirm:()=>true,Intl,Date,Math,Set,Map,JSON,Number,Error};
 vm.runInNewContext(source,context,{filename:'expedicao_v18.js',timeout:1500});
 return {api:window.SamExpedicao18,dom,controls,data,events};
}
function play(s){s.api.open();s.dom.get('sm18Resume').click();for(let i=0;i<3;i++)s.dom.get('sm19DialogNext').click();}
test('cinco mapas completos e todos os objetivos alcançáveis',()=>{
 const block=source.slice(source.indexOf('const levels=['),source.indexOf('const W=18,'));
 const maps=[...block.matchAll(/map:\[\s*([\s\S]*?)\]\}/g)].map(m=>[...m[1].matchAll(/'([#S.EBMHPR A]+)'/g)].map(v=>v[1]));
 assert.equal(maps.length,5);
 for(const [i,rows] of maps.entries()){
  assert.equal(rows.length,12);assert.ok(rows.every(r=>r.length===18));
  const points=[],q=[];rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch==='S')q.push([x,y]);if('MPR'.includes(ch))points.push([x,y,ch])}));
  assert.equal(points.filter(v=>v[2]==='M').length,3);
  assert.equal(points.filter(v=>v[2]==='R').length,1);
  assert.equal(points.filter(v=>v[2]==='P').length,1);
  const seen=new Set(q.map(v=>v.join(',')));
  for(let n=0;n<q.length;n++)for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=q[n][0]+dx,y=q[n][1]+dy,key=x+','+y;if(x>=0&&x<18&&y>=0&&y<12&&rows[y][x]!=='#'&&!seen.has(key)){seen.add(key);q.push([x,y])}}
  assert.ok(points.every(v=>seen.has(v.slice(0,2).join(','))),'capítulo '+(i+1));
 }
});
test('assets gráficos da V19 são arquivos reais',()=>{
 for(const x of ['sprites/espirito_lunar_v19.svg','sprites/reliquia_lunar_v19.svg','sprites/portal_astral_v19.svg','sprites/sam_idle.png','sprites/sam_andando_1.png','sprites/sam_atacando.png','sprites/aranha_infectada.png','sprites/rei_das_pragas_idle.png'])assert.ok(fs.existsSync(path.join(root,x)),x)
});
test('diálogo, controles, relíquia, energia e salvamento local',()=>{
 const s=boot(),initial=s.api.getSnapshot();assert.equal(initial.level,0);assert.equal(initial.hp,10);
 s.api.open();s.dom.get('sm18Resume').click();assert.equal(s.dom.get('sm19Dialog').hidden,false);
 for(let i=0;i<3;i++)s.dom.get('sm19DialogNext').click();
 s.controls.right.click();s.controls.right.click();
 const snap=s.api.getSnapshot();assert.equal(snap.pos.x,3);assert.equal(snap.relics,1);assert.equal(snap.energy,2);
 assert.ok(s.data.has('sm19_expedicao_visitante'));
 const s2=boot(s.data);assert.equal(s2.api.getSnapshot().relics,1);assert.equal(s2.api.getSnapshot().pos.x,3);
});
test('salvamento V18 migra sem sobrescrever o original',()=>{
 const s=boot();let older=JSON.parse(s.data.get('sm19_expedicao_visitante'));older.v=18;older.hp=6;older.pos={x:2,y:1};
 const saved=new Map([['sm18_expedicao_visitante',JSON.stringify(older)]]);
 const newer=boot(saved);assert.equal(newer.api.getSnapshot().hp,6);assert.equal(newer.api.getSnapshot().pos.x,2);
 assert.ok(saved.has('sm19_expedicao_visitante'));assert.equal(JSON.parse(saved.get('sm18_expedicao_visitante')).v,18);
});
test('portal exige vencer chefão antes da conclusão',()=>{
 const base=boot();const state=JSON.parse(base.data.get('sm19_expedicao_visitante'));
 state.level=4;state.pos={x:15,y:1};state.mangos=3;state.hp=10;state.enemies=[{id:'boss',x:9,y:8,hp:9,maxHp:9,boss:true,cool:0}];state.seenScenes=['chapter-4'];state.paused=true;
 const saves=new Map([['sm19_expedicao_visitante',JSON.stringify(state)]]);
 const s=boot(saves);play(s);s.controls.right.click();
 assert.equal(s.api.getSnapshot().finished,false);
 assert.match(s.dom.get('sm18Status').textContent,/guardião/);
 state.enemies=[];saves.set('sm19_expedicao_visitante',JSON.stringify(state));
 const s2=boot(saves);play(s2);s2.controls.right.click();assert.equal(s2.api.getSnapshot().finished,true);
});
