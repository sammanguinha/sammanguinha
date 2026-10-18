# V22 — Fundação dos Reinos

Base: dev/v21-reinos-do-pomar. Branch: dev/v22-fundacao-reinos.
Status: desenvolvimento separado da versão pública; nenhum merge ou deploy automático.

## Entrega 1: refúgio com backup e conflitos seguros

A V22 adiciona armazenamento remoto independente (sm22_home_state) via Supabase, mantendo o localStorage da casa e todos os arquivos legados. A estrutura anterior sm21_player_homes usa outro catálogo, portanto foi preservada sem alterações. Os RPCs sm22_house_load e sm22_house_save exigem a autenticação existente pelo @ e token. A tabela bloqueia SELECT/INSERT/UPDATE diretos para clientes, com RLS ativa.

Cada atualização usa um número de revisão. Se nuvem e navegador foram alterados independentemente, o jogo mostra duas escolhas: usar a nuvem ou manter a versão deste aparelho. Não ocorre sobrescrita silenciosa; a casa segue utilizável offline. No início da sessão, um refúgio que exista apenas localmente pode ser copiado para nuvem.

A migração em sql/v22_home_sync.sql já foi aplicada no Supabase. Foram validados em transação revertida: salvamento de revisão 1, atualização para 2, rejeição de atualização com revisão antiga, rejeição de token errado e tema inválido. Nenhuma conta de teste ficou armazenada.

**Limite:** sementes e inventário da casa continuam sendo cosméticos ligados à economia local do navegador; não concedem créditos oficiais ao ranking. Benefícios da casa ficam restritos às partidas sem ranking.

## Entrega 2: Defesa melhorada de forma funcional

- Torres podem evoluir ao nível 2 por 3 energias e ao nível 3 por mais 5 energias. O nível 2 acelera disparos; o nível 3 acrescenta dano; runas de gelo aplicam lentidão maior.
- Cada torre escolhe entre mirar no inimigo mais próximo da árvore ou no inimigo mais resistente, alterando de fato o alvo escolhido.
- Corredor Âmbar: praga 65% mais rápida introduzida a partir da terceira onda, com sprite original animado de quatro quadros em sprites/corredor_ambar_v22.svg.
- Custos, recargas e limites são aplicados pelo motor da partida; torres não acrescentam diretamente pontos ao ranking oficial.
- Modos Normal/Difícil/Infinito e classes da V21 continuam disponíveis.

## Testes e arquivos

- tests/v21_reinos_pomar.test.cjs: regressões da V21.
- tests/v22_fundacao.test.cjs: integração de scripts, RLS e segurança.
- tests/v22_cloud_browser.cjs: desktop e mobile, nuvem simulada, diferenças entre versões, duas resoluções de conflito e salvamento local.
- tests/v22_defense.test.cjs: testes executando cálculo real de dano, alvo, evolução da torre e gelo.
- GitHub Actions nas pastas .github/workflows geram resultados e artefato sem configuração Wrangler.

## Publicação no Cloudflare Pages

No workflow Pacote Cloudflare Pages V22, baixar Artifacts → Sam-Manguinha-V22-Cloudflare-Pages. Extrair o primeiro ZIP do GitHub Actions e enviar o ZIP interno ao Cloudflare Pages > Upload assets. A branch V22 não foi mesclada nem publicada.

## Próximas fases planejadas, não entregues nesta etapa

Refatoração gradual do código grande em módulos; missões e exploração de mapa mais conectadas; monitoração de travamentos sem dados pessoais; perfil e guarda-roupa sincronizados; testes completos de cinco ondas em celulares reais; remodelação visual unificada.

## Riscos e recomendações antes de publicar

Os testes de navegador usam perfis e nuvem simulados para não alterar contas de usuários. Testar a sincronização em dois aparelhos reais com conta de teste, partidas completas e classificação do Supabase. Não tratar esta entrega como remake total de Final Fantasy. O sistema de autenticação atual é próprio do jogo, com SECURITY DEFINER protegido por auth_profile; revisão futura da arquitetura de identidade é desejável.
