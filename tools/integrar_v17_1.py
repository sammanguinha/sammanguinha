"""Integração idempotente dos arquivos V17.1 no HTML V17.
Executado apenas na branch de desenvolvimento, sem implantação.
"""
from pathlib import Path

p = Path("index.html")
s = p.read_text(encoding="utf-8")
replacements = [
 ('me=h;LS.set("sg_handle",me);renderMe();$("gOk").disabled=true;', 'const previousHandle=me;me=h;renderMe();$("gOk").disabled=true;'),
 ('if(err.message==="handle_taken"){me="";LS.set("sg_handle","");renderMe();', 'if(err.message==="handle_taken"){me=previousHandle;renderMe();'),
 ('else $("gErr").textContent="Não consegui entrar agora. Tente de novo.";','else {me=previousHandle;renderMe();$("gErr").textContent="Não consegui entrar agora. Tente de novo.";}'),
 ('$("gOk").disabled=false;gateOn=false;$("gate").hidden=true;syncInert();', 'LS.set("sg_handle",me);$("gOk").disabled=false;gateOn=false;$("gate").hidden=true;syncInert();'),
 ('<link rel="stylesheet" href="revisao_v17.css">','<link rel="stylesheet" href="revisao_v17.css"><link rel="stylesheet" href="polimento_v17_1.css">'),
 ('<script src="revisao_v17.js" defer></script>', '<script src="revisao_v17.js" defer></script>\n<script src="polimento_v17_1.js" defer></script>'),
 ("const version='17.0.0';const key='sm_last_seen_update_version'", "const version='17.1.0';const key='sm_last_seen_update_version'"),
 ('🥭 NOTAS DE ATUALIZAÇÃO · V17', '🥭 NOTAS DE ATUALIZAÇÃO · V17.1')
]
changed = False
for before, after in replacements:
    if before in s:
        if s.count(before) != 1:
            raise SystemExit(f"Ambiguous pattern: {before[:45]}")
        s = s.replace(before, after, 1)
        changed = True
    elif after not in s:
        raise SystemExit(f"Missing expected source: {before[:45]}")
if changed:
    p.write_text(s, encoding="utf-8")
    print("V17.1 integrated into index.html")
else:
    print("V17.1 already integrated")
