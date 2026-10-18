# V23 — Renascimento do Pomar

**Status:** primeira entrega funcional da remodelação, ainda em branch e PR de rascunho. Base: `dev/v22-fundacao-reinos`. Nenhum deploy ou merge para produção.

## Objetivo e inventário de melhorias

Reformar o projeto sem substituir sua campanha existente ou perder progresso. A investigação identificou que a V22 já dispõe de vila explorável (`mundo_pomar.js`), 9 áreas, chefes e mapas. Duplicar mundos seria perigoso. A V23 amplia o mundo existente, preservando a chave de save `sam_rpg_hibrido_v12_<handle>`.

### 1. Vila Viva e progressão
- **Mira, a Acendedora:** NPC novo com sprite original de quatro quadros; aparece na vila atual.
- **Ronda das Lanternas:** falar com Mira desbloqueia uma missão real; reacender três lanternas diferentes, com novos sprites animados, luz visível, diário, progresso e recompensa única (40 sementes **locais** da loja; não mexe no ranking).
- O estado é persistido em `st.v23` dentro do save RPG existente.
- A cabana a leste na vila agora leva à **Minha Casa**, e a casa também foi adicionada aos atalhos do mapa.
- **Minimapa jogável:** posição real do personagem, obstáculos e NPCs/portais/lanternas, com símbolos claros; atualizado durante exploração e adaptado para celular.
- Novas animações originais para Bento, Lívia, Mira e Eldra, com quatro quadros por personagem e redução de movimento quando configurada.

### 2. Defesa 3.0 (mudanças reais no motor)
- **Totem Solar**, custo 6 energias: dispara em uma praga e atinge outras próximas em raio de 78 unidades.
- **Torre Raiz**, custo 5 energias: causa dano e prende a praga por 1,8 s no nível 1; upgrades prolongam o efeito.
- **Curandeira de Esporos:** nasce a partir da onda 4, tem três pontos de vida, move-se mais devagar e cura um aliado ferido próximo a cada 3,4 s.
- Prioridade adicional **Curandeiras**, além de **Mais próximo** e **Mais resistente**.
- Correção importante de mapeamento: quando uma árvore morre, as rotas não são reindexadas indevidamente, e a torre daquela árvore é destruída. Árvores restauradas continuam aceitando novas torres.
- Todos os novos combatentes/torres possuem sprites SVG originais de quatro quadros **realmente usados pelo Canvas**.
- Torretas não concedem pontuação direta; a integração normal de `game_start` e `game_finish` com Supabase continua intacta.

### 3. Site renovado
- Nova camada `renascimento_v23.css` com linguagem visual coerente para topo, menus, central, cartas, RPG, Defesa, casa e comunidade, com foco mobile.
- Central de Jornada `renascimento_v23.js` no início: região salva, missão de lanternas, móveis colocados e partidas locais; atalhos que usam a navegação do site.
- Configurações ativas de alto contraste, texto maior e redução de movimento salvas em `sam_v23_preferences`.
- Notas V23 no painel de novidades; V22 e anteriores continuam no histórico.

### 4. Arquivos novos
- `renascimento_v23.css`, `renascimento_v23.js`
- Sprites: `v23_bento.svg`, `v23_livia.svg`, `v23_mira.svg`, `v23_eldra.svg`, `v23_lanterna.svg`, `v23_torre_solar.svg`, `v23_torre_raiz.svg`, `v23_curandeira.svg`
- Testes: `tests/v23_renascimento.test.cjs`, `tests/v23_browser.cjs`
- Workflows de teste + empacotamento para Cloudflare.

## Preservação de dados
- Autenticação `@`, contas, credenciais, Supabase, contratos de conquistas, casa V22 sincronizada, chat V20 e loja local não são reescritos.
- Não há nova migração de banco na V23; o estado da missão permanece no save local do mundo.
- Compatibilidade da V22 mantida: sprites antigos, campanha, modos especiais e notas de atualização continuam.
- A missão concederá no máximo 40 sementes locais por save; não promete mangas oficiais nem XP do servidor.

## Verificações
- Testes de execução do motor verificam dano solar em grupo, congelamento por raízes, cura real, seleção de curandeira e indexação correta das árvores.
- Testes do navegador no GitHub Actions incluem desktop e mobile; navegação, Mira, minimapa e preferências.
- Rever o status mais recente do GitHub Actions antes de publicar.

## O que ainda não foi concluído
Este é o primeiro pacote funcional da **grande reformulação**, não uma substituição de todos os milhares de recursos existentes.
1. Teste completo de todas as ondas/chefões com contas de teste e ranking real.
2. Separação gradual do `index.html` legado em módulos, com rollback.
3. Atualizar todo o catálogo de sprites restantes seguindo a nova direção artística.
4. House 3D/isométrica, novas áreas da campanha, PvE cooperativo e sincronização dos cosméticos não estão implantados nesta entrega.
5. Medição de FPS de celulares menos potentes e checagem de leitores de tela antes da versão pública.

## Publicação
1. Abrir GitHub Actions → `Pacote Cloudflare Pages V23`.
2. Baixar o artefato `Sam-Manguinha-V23-Cloudflare-Pages`.
3. Extrair o ZIP do GitHub Actions; enviar o **ZIP interno** ao Cloudflare Pages via Upload assets. Não incluir `wrangler.jsonc` no upload estático.
4. Testar login, casa, chat, vila, missão e Defensa antes de atualizar produção.
