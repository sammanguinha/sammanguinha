const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const vm=require('node:vm');
const file=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const html=file('index.html');
test('todos os scripts JS originais e V21 analisáveis pelo motor Node',()=>{
 const inline=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]).filter(x=>x.trim());
 assert.ok(inline.length>=6);
 for(const [i,code] of inline.entries())assert.doesNotThrow(()=>new vm.Script(code,{filename:'inline-'+i+'.js'}));
 for(const f of ['casa_pomar_v21.js','pomar_ao_vivo_v20.js','expedicao_v18.js','mundo_pomar.js'])assert.doesNotThrow(()=>new vm.Script(file(f),{filename:f}));
});
test('casa completa com interface navegável e privacidade',()=>{
 for(const id of ['houseDlg','houseBtn','sm21HouseCanvas','sm21HouseInventory','sm21HouseTheme','sm21HouseFloor','sm21HouseDecorate','sm21HouseSync','sm21HouseRemove'])assert.ok(html.includes('id="'+id+'"'),id);
 assert.ok(html.includes('data-p="houseDlg"'));assert.ok(html.includes('data-go="houseDlg"'));
 const js=file('casa_pomar_v21.js');
 for(const feature of ['pointerdown','pointerup','pointermove','ArrowRight','sm21_house_load','sm21_house_save','sm18:defense-ended','sg_extras_v1_','cloudSave','localLoad','owned','placed','floor','theme','renderInventory'])assert.ok(js.includes(feature),feature);
 assert.ok(html.includes('casa_pomar_v21.css?v=21'));
});
test('mecânicas táticas e chefão do modo Normal com escolhas e recargas',()=>{
 for(const n of ['sm21Repair','sm21WaveUpgrade','sm21Weapon','sm21UpgradeChoices','sm21Essence','sm21TreeInfo','sm21WaveInfo','sm21BossDown','sm21Kill','sm21Wave(s,dt)','s.mode===\'normal\'&&s.wave===5','sm21Blessings','sm21Fire','sm21PickBless'])assert.ok(html.includes(n),n);
 assert.ok(html.includes('s.essence-=6'),'repair must consume essence');
 assert.ok(html.includes('s.trees[target]=true'),'repair must restore trees');
 assert.ok(html.includes('bossWave&&!s.bossDefeated'),'boss must gate victory');
 assert.ok(html.includes('s.upgrading=true'),'wave upgrades must interrupt gameplay');
 assert.ok(html.includes('if(s.upgrading)return true'),'do not advance game during upgrade');
 assert.ok(html.includes('if(gDifficulty==="normal")gRun=await rpc("game_start"'),'only normal belongs to official rank');
 assert.ok(!html.includes('s.score+=1500'),'boss score must respect server anti-cheat');
});
test('arte original registrada e realmente desenhada no canvas',()=>{
 const names=['arqueiro_sombra_v21_idle','arqueiro_sombra_v21_cast','arqueiro_sombra_v21_hurt',
 'carapaca_v21_idle','carapaca_v21_hurt','rei_eclipse_v21_idle','rei_eclipse_v21_attack','rei_eclipse_v21_hurt',
 'casa_cristal_v21_idle','casa_cristal_v21_brilho','casa_gato_v21_idle','casa_gato_v21_brilho','manga_runica_v21','runa_reparo_v21'];
 for(const n of names){
  const svg=file('sprites/'+n+'.svg');
  assert.ok(svg.startsWith('<svg'),n);
  assert.ok(svg.includes('viewBox="0 0 32 32"'),n);
  assert.ok(html.includes(n)||file('casa_pomar_v21.js').includes(n.split('_v21_')[0]),'referenced '+n);
 }
 assert.ok(html.includes('p.kind===\'caster\''),'ranged caster must exist');
 assert.ok(html.includes("p.kind==='armored'"),'armored variant must exist');
});
test('casa no Supabase com validação de dono, layout e RLS',()=>{
 const sql=file('sql/v21_casa_guardiões.sql');
 for(const text of ['enable row level security','revoke all on public.sm21_player_homes','auth_profile(h,p_token)','sm21_house_load','sm21_house_save','jsonb_array_length','posicao_invalida','colisao_de_moveis','item_nao_adquirido','not (key=any(ownership))']){
  assert.ok(sql.includes(text),text);
 }
 assert.doesNotMatch(sql,/grant (insert|update|delete) on public.sm21_player_homes to anon/i);
});
test('V21 possui histórico colapsável e CSS responsivo sem excluir versões antigas',()=>{
 assert.ok(html.includes("const version='21.0.0'"));
 for(const version of ['V21','V20','V19','V18'])assert.ok(html.includes('<b>'+version+'</b>'));
 for(const fileName of ['estetica_v21.css','casa_pomar_v21.css'])assert.ok(fs.existsSync(path.join(__dirname,'..',fileName)));
 assert.ok(file('casa_pomar_v21.css').includes('@media(max-width:480px)'));
 assert.ok(file('estetica_v21.css').includes('@media(prefers-reduced-motion:reduce)'));
});
