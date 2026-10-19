# V31 — O Jardim das Entrelinhas (prévia de desenvolvimento)

## O que mudou de verdade

Esta branch começa da V30.3 e integra uma segunda campanha original ao mundo RPG, sem substituir a estrutura de login, defesa, casa, personalização, galeria, Halloween ou comunidade.

- Três mapas inéditos: Jardim da Bruma, Galerias dos Pequenos e Relicário do Musgo.
- Nova personagem Ema, a Tecelã, com missão narrativa e uma tarefa opcional sobre o besouro desaparecido.
- Ingredientes coletáveis e um Tear que cria a Lente de Broto.
- Lente com efeito direto no motor: muda o tamanho do sprite e o raio de colisão, abre a travessia de uma fresta estreita e impede crescer dentro de paredes.
- Puzzles sequenciais com dois tamanhos: placa de contrapeso, passagem pequena, pino de seiva, três runas com requisitos de tamanho alternados.
- Novo chefe original Guardião de Musgo com duas fases distintas, fraquezas elementais e ataques telegráficos.
- Recompensa única (Broche das Entrelinhas), XP e moedas locais da campanha, e diário preservado em epic.v31 no salvamento anterior por jogador.
- Interface e arte aprimoradas no RPG: painel persistente com missão, progresso, atalhos Q e toque, novo sprite do chefe, efeitos com preferência de movimento reduzido, divulgação de preview na Home.

## Como acessar

1. Conclua o Capítulo I no Bosque dos Ecos: siga a canção dos sinos, vença a Sentinela do Silêncio e leia o Mural.
2. Investigue a nova passagem leste do Bosque dos Ecos.
3. No Jardim da Bruma, converse com Ema e procure os ingredientes da Lente de Broto.
4. Use a tecla Q ou o botão BROTO depois de construir a Lente. Grande aciona pesos, pequeno atravessa passagens.
5. Resolva as Galerias e as inscrições do Relicário antes de enfrentar o Guardião de Musgo.

## Decisões de segurança e compatibilidade

Dados remotos (Supabase, ranking, comunidade e login) não são migrados nem modificados por esta expansão. A campanha usa o estado local de RPG já existente. Os arquivos originais, modo Defesa e todos os outros modos foram mantidos, evitando regressões por substituição em massa. A branch principal permanece intacta.

## Validação

Há testes em tests/v31_jardim_browser.cjs para dois tamanhos de tela: acesso, ingredientes, colisão, puzzles, chefe, recompensa sem duplicar, tarefa opcional e recarregamento. A workflow .github/workflows/v31-jardim.yml também executa testes legados, empacota para Cloudflare Pages apenas após validação e publica artefato de build no GitHub Actions.

**Estado:** branch de testes, não versão publicada. A passagem pelos testes automatizados e a revisão real em navegador devem ser confirmadas antes de publicar. Ainda não é uma reconstrução integral de todos os modos; Defesa, Casa, Halloween, chat, perfis e galeria merecem ciclos dedicados de QA e melhorias.