# V24 — Expedição: Mundo Vivo

Branch: dev/v24-mundo-vivo-loja-rpg
Base: dev/v23-renascimento-integrado
Estado: desenvolvimento/testes, sem merge nem deploy.

## Funcionalidades entregues

### Empório da Vila RPG
A construção da loja e o atalho Loja do RPG passam a abrir o Empório da Vila; a loja de mascotes do modo Defesa permanece.
Economia: moedas locais do RPG, independentes das mangas e sementes oficiais.
Poções e consumíveis: poção de vida 18 moedas, tônico lunar +6 MP 22, antídoto floral 12, elixir de corrida 25 (90 segundos), bomba de esporos 34 (20 de dano + cegueira temporária), escudo de folha 28 (defesa +1 MP).
Acessórios: Anel do Orvalho +10 HP (85), Broche Solar +12% magia (125), Capa da Brisa mais fôlego (110), Bracelete da Casca -2 dano (120), Amuleto do Luar +2 MP ao iniciar combate (145).
Compras debitam ouro e concedem itens numa única gravação da campanha; acessório permanente não pode ser comprado duas vezes. Falha na persistência reverte os dados.
Novos consumíveis entram na mochila da campanha, são usados no combate, e acessórios entram no Relicário existente com limite de 2 equipados e detalhes desenhados no avatar Canvas.

### Corrida
Shift no desktop e botão pressionado no celular. Velocidades andar/correr: 3,45 / 5,4; elixir 6,4 unidades/s. Fôlego se consome e recupera. Capa da Brisa aumenta fôlego de 100 para 140. Colisão e movimentos originais preservados.

### Regiões
Os nove mapas originais receberam cores e padrões de chão específicos. Campina dos Ventos (entrada pela Floresta) e Gruta do Eco Azul (entrada pelas Minas) são duas novas ramificações com inimigos próprios, recursos coletáveis e recompensas em moedas locais.

### Modo Defesa
Redesign original em folhas SVG de 4 quadros: árvores saudável/danificada/destruída, torre de mangas/gelo/raízes/solar, pragas larva/besouro/esporo/corredor/curandeira e chefe. Dois inimigos RPG novos possuem artes SVG adicionais.
Pulso do Bosque: habilidade em Difícil/Infinito que custa 6 energias, tem recarga de 12 segundos e paralisa todas as pragas por 2,2 segundos; não opera no modo Normal do ranking.
Curandeira de Esporos: nas ondas a partir da quarta nos modos não ranqueados, com 3 HP, cura aliado próximo em 1 HP a cada 3,4 segundos. Torres podem priorizar curandeiras.
Sprites usados efetivamente pelos motores Canvas com fallback para arte antiga se um arquivo falhar. Progressão, chefões, classes e regras oficiais anteriores permanecem.

## Testes
tests/v24_world_shop.test.cjs verifica moedas, mochila, duplicidade, rollback de armazenamento, sprites, biomas, corrida, Pulso e Curandeira.
tests/v24_browser.cjs verifica em Chromium desktop e mobile com Supabase simulado: compra clicável, saldo, inventário, corrida, viagem e carregamento das sprites.
.github/workflows/v24-mundo-vivo.yml roda estes testes e regressões V23/V22, depois gera o ZIP estático Cloudflare Pages, sem deploy.

## QA manual antes de publicar
1. Usar contas de teste para comprar e equipar acessórios, testar saldo insuficiente, reabrir jogo e verificar persistência.
2. Jogar as ondas completas da Defesa em Normal (servidor real) e Difícil, verificar curandeira e Pulso.
3. Explorar as onze regiões e testar portais, chefes, diários e checkpoints.
4. Testar login, conquistas, upload de fotos, Casa sincronizada e chat com Supabase verdadeiro.
5. Verificar celulares de entrada, acessibilidade e desempenho.

## Limites
O conteúdo da V24 é uma melhoria real sobre o motor existente, não a substituição de todos os sistemas do site. Ainda não foram redesenhados todos os sprites legados nem reescritos coop online, Casa 3D, sincronização remota de cosméticos e eventos Halloween. Moedas e compras de RPG estão salvas no navegador por perfil; não são recursos do ranking. A V24 não foi publicada em produção.
