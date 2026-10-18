# Sam Manguinha V27 — Interface Viva (fase 5)
 
Esta versão preserva o motor modular V26 e melhora a aparência e o fluxo real do jogo. As alterações são incrementais e reversíveis, mantidas em uma branch separada.

## O que foi implementado

- **HUDs vivos:** durante o RPG, vida, magia, fôlego, nível, moedas e região são apresentados sobre o mapa. No modo Defesa, há placar, onda, árvores, HP e energia.
- **Atalhos funcionais no modo imersivo:** mochila, missões, Empório RPG, torres, pausa e Pulso do Bosque (mantendo a restrição do modo ranqueado). Todos encaminham eventos aos controles existentes, sem atalhos que contornem as regras.
- **Dois estilos visuais:** Aurora (verde dourado) e Eclipse (violeta). A preferência é salva no dispositivo por `sam_v27_visual_theme` e respeita redução de animações.
- **Refinamento visual:** cartões RPG, modo Defesa, loja, seleção de torres, combate por turnos, casa, Halloween, personagem e tela inicial. Controles de toque e modo imersivo receberam melhor organização.
- **Contrato do motor:** `js/core/runtime-bridge-v27.js` expõe `window.SamGameV27` apenas para leitura, `subscribe()`, `getSnapshot()`, `action()`. As assinaturas podem ser canceladas e o polling só roda com assinantes. Não expõe credenciais do usuário.
- **Dados reais:** `SamHybridRPG.getVitals()` fornece limites calculados pelo motor, sem copiar fórmulas de atributos para o front-end.

## Segurança da migração

- O balanceamento de combate, ranking oficial, compra e conquistas permanece regido pelos motores V26 e V24.
- Nenhuma tabela do Supabase, save key ou pagamento foi migrado.
- Mantém a arquitetura de desenvolvimento da V26, com script original compilado por hash e duas camadas extras versionadas V27.
- O empacotamento de Cloudflare Pages inclui `visual_v27.css` e scripts V27, sem configuração de Workers.
- Testes automatizados com JavaScript, navegador desktop e mobile, incluindo compra via menu rápido e troca de tema. Capturas são guardadas para revisão visual no GitHub Actions.

## Limitações assumidas

- O motor original ainda depende do ambiente lexical global de scripts clássicos. A V27 introduz um contrato estável para **novos componentes**; não remove de uma vez essas referências antigas.
- O visual usa CSS e os sprites existentes; ainda não há uma remodelagem completa de sprites ou novos mapas nesta versão.
- Não há deploy automático para produção. Revisar PR e publicar o ZIP apenas após validação.

## Arquivos

- `js/core/runtime-bridge-v27.js` — estado e comandos seguros
- `js/ui/game-shell-v27.js` — HUDs, menus rápidos, tema
- `visual_v27.css` — acabamento e responsividade
- `mundo_pomar.js` — pequeno método somente de leitura para vitais
- `tests/v27_bridge_ui.test.cjs` e testes de navegador — regressões
