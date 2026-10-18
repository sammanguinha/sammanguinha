# Sam Manguinha V25 — Arquitetura modular (fase 1)

A migração removeu os blocos `<style>` e scripts inline do `index.html`, mantendo os mesmos sistemas e a mesma sequência de execução.

## Estrutura

- `index.html`: HTML, SVGs e ordem das dependências.
- `css/base.css`: tema e estilos gerais originais.
- `css/halloween*.css`, `css/defense*.css`, `css/house-v21.css` etc.: estilos de sistemas específicos, conservando a ordem original de cascata.
- `js/core/app.js`: controlador legado principal (ainda monolítico nesta primeira fase).
- `js/games/*`: campanha de Halloween, guarda-roupa e inicialização móvel da Defesa.
- `js/ui/*`: controles de interface e aviso de atualização.
- `js/architecture/*`: verificações de integridade e manifesto (futuro).
- `sprites/`, `audio/`, `halloween_art/`: arquivos originais preservados.

## Cuidados necessários

1. **Não usar `defer` nem `type=module` nos scripts extraídos ainda**: os scripts clássicos foram originalmente síncronos e compartilham contexto global; converter automaticamente mudaria as dependências e o comportamento.
2. Preservar a ordem das folhas CSS, para evitar mudanças de prioridade nos seletores.
3. Servir o projeto por HTTP(S), não por `file://`, para reproduzir o Cloudflare Pages.
4. Empacotar as pastas `css/` e `js/` no ZIP e verificar que os arquivos retornam HTTP 200.
5. Manter salvamentos localStorage, Supabase, ranking, inventário e partidas sem migrações de dados nesta fase.

## Próximas fases

- Quebrar `js/core/app.js` em módulos de dados, autenticação, UI e motor de Defesa, com uma camada de compatibilidade.
- Converter estilos inline de componentes para classes, após confirmar equivalência visual.
- Consolidar configuração, eventos e dependências (sem reconstruir o RPG).
- Criar testes por modo e verificar renderização mobile, imersiva e em produção.

**Esta fase não promete ganho de FPS automático**: a vantagem é redução de acoplamento, manutenção, cache de assets e capacidade de evoluir sistemas com mais segurança.

## Fase 2 / V26 — Motor em arquivos por responsabilidade

O arquivo de ~120 KB `js/core/app.js` foi distribuído em **nove scripts clássicos**, na ordem original:

- `js/core/app.js` — 7794 caracteres
- `js/core/profile-community.js` — 21593 caracteres
- `js/ui/ranking-home.js` — 3787 caracteres
- `js/core/account-secrets.js` — 13779 caracteres
- `js/services/community-data.js` — 6716 caracteres
- `js/services/gallery.js` — 6383 caracteres
- `js/games/defense-engine.js` — 42481 caracteres
- `js/games/defense-animation.js` — 10053 caracteres
- `js/core/progression.js` — 7807 caracteres

As declarações `let` e `const` permanecem compartilhadas no *ambiente léxico global* dos scripts clássicos. Não foi aplicada minificação, bundling, módulos ES ou troca de contratos. Esta etapa permite manutenção e futura introdução de uma API de módulos explícita com segurança.
