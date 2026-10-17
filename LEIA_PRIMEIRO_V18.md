# SAM MANGUINHA V18 — A LENDA ASTRAL

**Status:** V18 integrada na branch de desenvolvimento. **Não publicada em produção.** `main` e banco Supabase continuam preservados.

## O que mudou
- Novo minijogo **Expedição Astral**: três mapas, nove mangas, chefão, inimigos que se movem por turnos, combate, poções e portais.
- Seis medalhas cosméticas locais. **Não dão recompensas oficiais**, não alteram XP, mangas ou ranking do Supabase.
- Salvamento de expedição por @ no mesmo navegador, botões para toque, WASD/setas, Espaço para atacar, Q para curar e Esc para pausar.
- Destaque da atualização na página inicial, visual reformulado, painel de progresso e novo item de navegação.
- Login mais seguro: restaura token anterior após falha de autenticação, evitando perda acidental da chave local.
- Áudios convertidos de base64 em `index.html` para `audio/trilha_pomar.mp3` e `audio/segredo_samuel.mp3`, sem recompressão.
- HTML reduzido de ~2,46 MB para ~444 KB; CSS e JS externos.

## Como testar
1. Abra a branch `dev/v18-grande-atualizacao` e veja `index.html`, `expedicao_v18.js`, `expedicao_v18.css` e `audio/`.
2. Execute a página num endereço de **teste**, não no site publicado.
3. Faça login, teste as três fases da Expedição, Defesa, RPG, Halloween, conquistas, galeria e trocas de conta.
4. Confira [GitHub Actions](https://github.com/sammanguinha/sammanguinha/actions) — workflow `V18 - Integrar e testar (sem deploy)`.
5. Somente após homologação, considere mesclar a `main` e publicar por processo separado.

## Segurança e limites
- Não houve alteração de tabelas, policies, RPCs ou contas Supabase.
- Alertas de auditoria do Supabase permanecem: 41 funções `SECURITY DEFINER` executáveis por `anon`, 1 view `SECURITY DEFINER`, 3 funções com `search_path` mutável. Revise antes de multiplayer.
- Testes automáticos cobrem sintaxe, assets, navegação e mecânicas do novo modo; login real/galeria/ranking precisam de testes com backend em homologação.
- Figma: fluxo [Jornada do Jogador](https://www.figma.com/board/mDdQhBABKR05JeKvhDHtqc). Design baseado nos sprites originais.
- NENHUM DEPLOY CLOUDFLARE É EXECUTADO POR ESTA BRANCH.

**Fonte:** versão preservada V17.1 + alterações V18.0.