"""Idempotent, assertive integration of the V18 front end. No backend / deployment changes."""
from pathlib import Path
p=Path(__file__).parent/'index.html'
s=p.read_text(encoding='utf-8')

def swap(old,new,label):
 global s
 if new in s:
  print('Already integrated:',label);return
 count=s.count(old)
 if count!=1: raise ValueError(f'{label} pattern occurs {count} times')
 s=s.replace(old,new,1)
 print('Integrated:',label)

swap('<link rel="stylesheet" href="polimento_v17_1.css">','<link rel="stylesheet" href="polimento_v17_1.css">\n<link rel="stylesheet" href="expedicao_v18.css">','V18 CSS')
swap('<script src="polimento_v17_1.js" defer></script>','<script src="polimento_v17_1.js" defer></script>\n<script src="expedicao_v18.js" defer></script>','V18 game')
swap("const version='17.1.0'","const version='18.0.0'",'release version')
swap('🥭 NOTAS DE ATUALIZAÇÃO · V17.1','🥭 NOTAS DE ATUALIZAÇÃO · V18.0','release notes title')
swap('<h2 id="smUpdateTitle">Novidades do Pomar!</h2>', '<h2 id="smUpdateTitle">A Lenda Astral Despertou!</h2>','notes headline')
swap('<p>Bem-vindo de volta! Veja o que mudou na última versão do Sam Manguinha.</p><ul>', '<p>Uma nova aventura está disponível sem perder seus modos anteriores.</p><ul>\n<li><strong>✨ Expedição Astral</strong> — três mapas táticos, pragas inteligentes, chefão e portais dourados.</li>\n<li><strong>🥭 Coleção de medalhas</strong> — seis conquistas cosméticas locais e salvamento da aventura por @.</li>\n<li><strong>📱 Controles acessíveis</strong> — teclado, toque, pausa, sons opcionais e layout renovado.</li>\n<li><strong>🔐 Login mais seguro</strong> — não troca a chave de acesso se o servidor rejeitar a entrada.</li>', 'release notes content')
# Restore prior token when a username/password pair fails validation, rather than persisting rejected credentials.
swap('const key=$("gKey").value.trim();if(key.length>=16)setTok(key);\n  const previousHandle=me;',
     'const key=$("gKey").value.trim();const previousToken=tok;if(key.length>=16)setTok(key);\n  const previousHandle=me;', 'preserve previous token')
swap('$("gOk").disabled=false;\n    if(err.message==="handle_taken")',
     '$("gOk").disabled=false;setTok(previousToken);\n    if(err.message==="handle_taken")','restore token on failure')
swap('LS.set("sg_handle",me);$("gOk").disabled=false;gateOn=false;$("gate").hidden=true;syncInert();',
     'LS.set("sg_handle",me);window.dispatchEvent(new Event("sm18:account-changed"));$("gOk").disabled=false;gateOn=false;$("gate").hidden=true;syncInert();','inform mode of account change')
swap('if(!gRun)return;\n  try{\n    const r=await rpc("game_finish"',
     'if(!gRun){window.dispatchEvent(new CustomEvent("sm18:defense-ended",{detail:{won:!!won,score:s.score,wave:s.wave,ranked:false}}));return;}\n  try{\n    const r=await rpc("game_finish"', 'inform about training results')
swap('if(r.mangoes)refreshBon();\n    loadGRank();',
     'if(r.mangoes)refreshBon();\n    window.dispatchEvent(new CustomEvent("sm18:defense-ended",{detail:{won:!!won,score:s.score,wave:s.wave,ranked:true}}));\n    loadGRank();','inform about validated official results')
p.write_text(s,encoding='utf-8')
print('All integrations completed:',p.stat().st_size,'bytes')
