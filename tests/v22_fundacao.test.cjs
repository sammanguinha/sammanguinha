const {sourceView}=require('./v25_source_view.cjs');
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const html=sourceView(read('index.html'),read),cloud=read('casa_sync_v22.js'),housing=read('casa_v21.js'),sql=read('sql/v22_home_sync.sql');
test('V22 JavaScript and all inline scripts parse',()=>{
 const inline=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean);
 for(const [i,s] of inline.entries())assert.doesNotThrow(()=>new vm.Script(s,{filename:'inline '+i}));
 for(const name of ['casa_v21.js','casa_sync_v22.js','pomar_ao_vivo_v20.js','expedicao_v18.js'])
  assert.doesNotThrow(()=>new vm.Script(read(name),{filename:name}));
});
test('V22 visible UI and versioned script are properly integrated',()=>{
 for(const id of ['sm22HomeSync','sm22SyncStatus','sm22SyncNow','sm22SyncConflict','sm22SyncCloud','sm22SyncLocal'])
  assert.ok(html.includes('id="'+id+'"'),id);
 assert.ok(html.includes('casa_v21.js?v=22'));
 assert.ok(html.includes('casa_sync_v22.js?v=22'));
 assert.ok(html.includes("const version='24.0.0'") || html.includes("const version='23.0.0'") || html.includes("const version='22.0.0'"));
 for(const version of ['V22','V21','V20','V19','V18'])assert.ok(html.includes('<b>'+version+'</b>'),version);
});
test('Cloud homes remain account-scoped, revision-checked, and never replace unsaved local work silently',()=>{
 for(const phrase of ['sm22_house_load','sm22_house_save','house_conflict','p_expected_revision','sm18:account-changed','sam21:home-local-change','window.sam22HomeConflict','isStarter(now)','meta.signature===nowSig','house.applyCloudLayout(remote.state)'])
  assert.ok(cloud.includes(phrase),phrase);
 assert.ok(housing.includes("save({fromCloud:true})"));
 assert.ok(housing.includes("new CustomEvent('sam21:home-local-change'"));
 assert.ok(!cloud.includes('service_role'));
 assert.ok(!cloud.includes('innerHTML'));
});
test('SQL enforces RLS, RPC authentication, optimistic locking and furniture constraints',()=>{
 for(const phrase of ['sm22_home_state','enable row level security','revoke all on public.sm22_home_state',
  'perform public.auth_profile','for update','house_conflict','on conflict do nothing','house_furniture_collision','house_furniture_limit','house_invalid_theme','p_expected_revision'])
   assert.ok(sql.includes(phrase),phrase);
 assert.ok(!sql.includes('grant select on public.sm22_home_state'));
 assert.ok(!sql.includes('grant insert on public.sm22_home_state'));
 assert.ok(sql.includes('references public.profiles(handle)'));
 assert.ok(!sql.includes('drop table'));
});
test('V21 tactical combat tests remain present; progress stays on existing branch',()=>{
 assert.ok(html.includes('function sm21TacticsTick'));
 assert.ok(html.includes('function sm21Build'));
 assert.ok(html.includes('sm21Towers'));
 assert.ok(html.includes('sm21DrawTowers'));
 assert.ok(fs.existsSync(path.join(__dirname,'..','tests','v21_reinos_pomar.test.cjs')));
});
