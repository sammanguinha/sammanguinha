# V21 — Reinos do Pomar: relatório técnico e publicação

Branch `dev/v21-reinos-do-pomar`, derivada de `dev/v20-pomar-vivo`. Sem merge, sem deploy automático.

## Casa pessoal funcional
- Navegação “Minha Casa” e cartão principal do RPG.
- Ambiente de 9 × 6 células: decoração por toque, clique e teclado, recolher/reposicionar móveis; temas Ocaso/Primavera/Noturno e pisos madeira/pedra/jardim.
- 10 móveis com sprites SVG **reais em 4 quadros**, incluindo cama, mesa, plantas, estante, lareira, cristal, bandeira, lanterna, tapete e trono.
- Inventário, limite por item, compra com **sementes locais**, descanso que concede **15 sementes locais uma vez por dia**, exportação de planta para área de transferência; salvamento local por @.
- Benefícios de mesa (+3 mangas de munição), lareira (+1 escudo) e cama (+1 HP, limitado ao máximo) **somente em modalidades não ranqueadas** da Defesa. Cama também permite descanso diário.
- Os dados não sincronizam entre dispositivos; não confundir sementes locais com mangas oficiais Supabase.
- Ao recolher todos os itens, os móveis ficam no inventário. O layout inicial inclui cama, mesa e samambaia.

## Defesa — mudança jogável, não cosmética
- Nova economia **energia de batalha**, começa com 2 e cresce com derrotas de inimigos e +2 entre ondas, até 12.
- Escolha rota com botões ou teclas 1–5; cada rota suporta uma torre.
- Torre de Mangas (3 energia): alvo automático de pragas em sua rota, ataca a cada 1,3 s.
- Runa de Gelo (4 energia): causa dano e reduz velocidade dos alvos por ~2,3 s.
- Restauração (5 energia): recupera uma árvore já destruída se ainda não perdeu a batalha.
- Torres com sprites SVG originais de 4 quadros; projéteis/efeitos e números de dano, HUD de recursos. Pausa para preparar novas ondas.
- Chefe final também no modo Normal (onda 5, 6 HP), além do chefe difícil (onda 10, 12 HP). A partida só termina depois de enfrentar o chefe.
- Torres não concedem pontos diretos ao ranking (apenas suporte e energia); habilidades do jogador e modo Normal permanecem submetidos a `game_finish`.
- Ranking oficial do Supabase segue aceitando **apenas Normal até onda 5**. Difícil/Infinito: recompensas e recordes locais.

## Integração existente
- RPG/Expedição V19, Halloween, mapa do mundo, guarda-roupa V20, mural moderado e Praça Ao Vivo V20 mantidos.
- Versão V21 adicionada ao menu recolhível de novidades.
- Ambiente e cenas novos trabalham com sprites no Canvas, sem Adobe/Firefly, pois fontes SVG foram implementadas diretamente e integradas.
- O pacote Cloudflare Pages exclui `wrangler.jsonc`, scripts Python, SQL, testes, workflows e outras ferramentas de desenvolvimento.
- Os arquivos de imagem/vídeo estáticos legados são copiados junto; configuração de Worker fica fora do ZIP.

## Validação
- `node --test tests/v21_reinos_pomar.test.cjs`: sintaxe dos scripts, navegação, sprites com quatro quadros, persistência, combate, economia e ranking.
- `node tests/v21_browser_smoke.cjs`: Chromium desktop e mobile, casa recolhe/repõe móveis com eventos reais, muda temas, verifica persistência após recarregar e controles da Defesa.
- Faltam **testes completos de 5 ondas contra servidor real e duas contas reais conversando** para garantir lançamento em produção. Não afirmar que esses fluxos estão confirmados apenas com smoke tests.
- Moderação, segurança e RLS do chat criados na V20 permanecem sujeitos às mesmas limitações.

## Como baixar
Abra o GitHub Actions `Pacote Cloudflare Pages V21`, baixe o artefato `Sam-Manguinha-V21-Cloudflare-Pages`, extraia esse primeiro ZIP e envie o **ZIP interno** ao Cloudflare Pages via Upload assets.

## Nota de design
Referência ao senso de progressão, personagens e fantasia RPG, sem copiar ativos ou personagens protegidos de Final Fantasy.
