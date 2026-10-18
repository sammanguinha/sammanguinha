# Sam Manguinha V28 — Reforma visual completa por CSS

## O que mudou
A V28 é uma reformulação **do site todo**, não apenas da tela cheia. A identidade "Crônicas do Bosque" estabelece uma linguagem visual unificada: fundo de floresta escura, superfícies verde-esmeralda, detalhes dourados, legibilidade alta e painéis em camadas.

| Área | Reforma CSS |
|---|---|
| Navegação | Barra fixa em vidro, logo renovado, guias destacadas, scroll horizontal no telefone, contraste e estados de foco |
| Portal de entrada | Cabeçalho cinematográfico, tipografia heroica, botão principal destacado, fichas do jogador |
| Página inicial | Hero editorial, botões de ação e cartões de destino redesenhados em grade adaptativa |
| RPG | Moldura do mapa, contratos, clima, inventário, habilidades, combate, loja e cartões |
| Defesa | Seletor de classe, seleção e aprimoramento de torres, painel de controles, recordes e arena |
| Personagem | Ateliê, opções, guarda-roupa, roupas, botões e escolha do personagem |
| Casa | Refúgio, edição de móveis, canvas, ferramentas, temas e sincronização |
| Halloween e Mapa | Mapa interativo de seis regiões, portais, enigmas, diálogos e minijogo |
| Diário e Galeria | Busca, filtros, cartões, formulários e grade de mídias |
| Mural | Praça dos Jogadores, mensagens, formulário, barra de ferramentas e desafios |
| Ranking e Conquistas | Pódio, tabela de resultados, cartas de objetivos e histórico |
| Segredos e Curiosidades | Console de códigos, coleção de segredos e fichas de fatos |
| Modais | Login, configurações, visualizadores, formulários e estados de foco |

## Arquitetura de estilos

1. `css/v28-foundation.css` — tokens, layout geral, navegação, botões, formulários, diálogos e acessibilidade.
2. `css/v28-pages.css` — transformação visual de cada área do site, com seus componentes.
3. `css/v28-responsive.css` — larguras grandes, tablet, celular, toque e acessibilidade.

Essas folhas são carregadas **depois de `visual_v27.css`**, mantendo compatibilidade com o motor da V26 e o HUD da V27. A preferência existente Aurora/Eclipse permanece operacional. Não foram removidos controles nem alterados IDs usados pelo JavaScript.

## Cuidados técnicos

- Não alterar o aspecto da imagem do canvas imersivo nem a camada de controles do RPG no celular.
- Manter contraste e rótulos visíveis em menus e formulários.
- Manter `prefers-reduced-motion`, estilos de foco e largura mínima de 320px.
- Preservar jogos, saves locais, Supabase, rankings, conquistas, uploads e lojas.
- A migração não promete melhoria de FPS: trata-se de design e organização visual.
- O bundle `js/game-v26.bundle.js` continua idêntico ao motor V26, verificado por hash Git.

## Validação e distribuição
Workflow `.github/workflows/v28-reforma-visual.yml` roda regressões das versões anteriores, analisa o CSS e abre todas as 13 áreas no Chromium em **desktop (1440×900), tablet (820×1180) e celular (390×844)**. Também confere o pacote compilado e gera capturas de comparação para revisão humana.

O ZIP `Sam-Manguinha-V28-Reforma-Visual-Cloudflare-Pages.zip` é criado apenas depois que toda a CI passar. Ele contém os assets necessários para publicação estática no Cloudflare Pages, **sem fazer deploy automaticamente**.

## Limite da atualização
O visual usa as ilustrações e sprites já existentes. Desenhar sprites totalmente novos e reprogramar campanhas não faz parte desta refatoração CSS.
