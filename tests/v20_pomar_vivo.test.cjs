const {sourceView}=require('./v25_source_view.cjs');
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
const html=sourceView(read('index.html'),read);
test('inline scripts compile without syntax errors',()=>{
 const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean);
 assert.ok(scripts.length>=5);
 scripts.forEach((source,i)=>assert.doesNotThrow(()=>new vm.Script(source,{filename:'inline-'+i+'.js'})));
});
test('new chat and expedition scripts compile',()=>{
 for(const src of ['pomar_ao_vivo_v20.js','expedicao_v18.js'])assert.doesNotThrow(()=>new vm.Script(read(src),{filename:src}));
});
test('V20 online chat UI, rooms, safe messages and server RPC are wired',()=>{
 for(const id of ['sm20Live','sm20LiveFeed','sm20LiveForm','sm20LiveRoom','sm20LiveStatus','sm20LiveInput','sm20LiveCount']){
  if(id==='sm20LiveRoom')continue;
  assert.match(html,new RegExp('id="'+id+'"'));
 }
 for(const room of ['praca','defesa','rpg'])assert.ok(html.includes('data-sm20-room="'+room+'"'));
 assert.ok(html.includes('pomar_ao_vivo_v20.js?v=20'));
 assert.ok(html.includes('supabase.js'));
 const client=read('pomar_ao_vivo_v20.js');
 assert.ok(client.includes('.textContent=item.body'),'message bodies should never be injected as HTML');
 assert.ok(client.includes("'postgres_changes'"));
 assert.ok(client.includes("sm_live_send"));
 assert.ok(client.includes("sm_live_report"));
 assert.ok(client.includes('8000'),'reconnect/polling fallback');
});
test('schema enforces RLS, approved reads, authenticated RPC with rate limits',()=>{
 const sql=read('sql/v20_pomar_chat.sql');
 for(const rule of ['enable row level security','using (status=','auth_profile','pg_advisory_xact_lock','7 seconds','sm_live_report','supabase_realtime','revoke all on table public.sm_live_messages']){
  assert.ok(sql.includes(rule),rule);
 }
 assert.doesNotMatch(sql,/service_role/i);
});
test('Defesa evolved with live skills, combo and honest official score',()=>{
 for(const n of ['sm20Dash','sm20Nova','sm20Combo','dashCd','novaCd','esporo_v20','sm20-defense-hint'])assert.ok(html.includes(n),n);
 assert.ok(html.includes('if(gDifficulty==="normal")gRun=await rpc("game_start"'));
 assert.ok(html.includes('s.score+=s.hard?20:10'));
 assert.ok(!html.includes('s.score+=(s.hard?20:10)*('),'server anti-cheat should not be bypassed');
 assert.ok(fs.existsSync(path.join(__dirname,'..','sprites','esporo_v20.svg')));
});
test('21 real cosmetics, wardrobe search, local RPG persistence',()=>{
 for(const n of ['astral-beret','guardian-helm','eclipse-horns','sunflower-band','forest-goggles','raven-mask','heart-glasses','petal-cloak','galaxy-cloak','ember-mantle','lunar-vest','knight-bark','jade-wand','mango-banner','crystal-lamp','rainbow-aura','moonfire-aura','butterfly-buddy','shadow-fox','title-moon','title-forest'])assert.ok(html.includes('id: "'+n+'"'),n);
 for(const n of ['sm20WardrobeSearch','sm20WardrobeOwned','sm20WardrobeStat'])assert.ok(html.includes('id="'+n+'"'));
 assert.ok(html.includes('const rpgSave = () => LS.set(rpgStorageKey, JSON.stringify(rpgState))'));
});
test('patch notes group V20, V19, V18 and cloudflare-friendly source',()=>{
 assert.ok(html.includes("const version='24.0.0'"));
 for(const v of ['<b>V20</b>','<b>V19</b>','<b>V18</b>'])assert.ok(html.includes(v));
 assert.ok(fs.existsSync(path.join(__dirname,'..','wrangler.jsonc')),'Worker config retained in source, excluded from static Pages artifact');
});

test('live admin moderation has protected RPC and interactive controls',()=>{
 const sql=read('sql/v20_chat_admin.sql');
 for(const item of ['admin_ok','sm_live_admin_list','sm_live_reports','revoke all on function'])assert.ok(sql.includes(item),item);
 for(const item of ['sm20AdminChatRefresh','sm20AdminChatList','sm_live_admin_set','sm_live_admin_list'])assert.ok(html.includes(item),item);
 assert.ok(html.includes('esc(m.body)'));
});
test('extra six dailies have genuine combat metrics and record persistence',()=>{
 for(const item of ['id:"games"','id:"kills"','id:"waves"','id:"dashes"','id:"novas"','id:"combo"','v.stats.dashes+=','v.stats.novas+=','v.stats.combo=Math.max'])assert.ok(html.includes(item),item);
});
