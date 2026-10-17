"""V18: extract embedded soundtrack into separate same-origin MP3 assets.
Only known <audio> elements are changed; binary bytes are preserved exactly.
Idempotent. Keeps a rollback copy in Git history.
"""
from pathlib import Path
import re, base64, hashlib
root=Path(__file__).parent
p=root/'index.html';s=p.read_text(encoding='utf-8')
out=root/'audio';out.mkdir(exist_ok=True)
for ident,filename in [('bgm','trilha_pomar.mp3'),('samuel','segredo_samuel.mp3')]:
 pattern=r'(<audio\s+id="'+re.escape(ident)+r'"[^>]*?src=")data:audio/mpeg;base64,([^\"]+)(")'
 matches=list(re.finditer(pattern,s,flags=re.S))
 target=out/filename
 if not matches:
  if 'src="audio/'+filename+'"' not in s or not target.is_file():
   raise RuntimeError('Áudio esperado ausente: '+ident)
  print('Áudio já extraído:',ident);continue
 if len(matches)!=1:raise RuntimeError('Duplicação de áudio: '+ident)
 m=matches[0];data=base64.b64decode(m.group(2),validate=True)
 if not data.startswith(b'ID3'):raise RuntimeError('Assinatura de MP3 inválida: '+ident)
 target.write_bytes(data)
 s=s[:m.start()]+m.group(1)+'audio/'+filename+m.group(3)+s[m.end():]
 print(filename, len(data),'bytes SHA-256',hashlib.sha256(data).hexdigest())
p.write_text(s,encoding='utf-8')
print('index.html',len(s.encode('utf-8')),'bytes')
