# Sam Manguinha V21 — Crônicas do Pomar

**Origem:** `dev/v20-pomar-vivo` • **Branch:** `dev/v21-cronicas-do-pomar` • **Estado:** revisão por PR; nenhum merge nem deploy automático.

## Filosofia

Um RPG original que busca o sentimento de exploração, personalização, combate com escolhas e vitória conquistada presente em grandes aventuras como *Final Fantasy*, sem copiar personagens, imagens ou trilhas protegidas. As novas mecânicas têm estado e efeitos verificáveis, não são meras animações decorativas.

## 1. Defesa do Pomar — o que mudou de verdade

### Chefão em vez de vitória automática
- **Normal:** cinco ondas e chefe **Rei do Eclipse** na quinta. O contador da última onda não encerra a partida enquanto o chefe não for derrotado.
- **Difícil:** dez ondas; Rei do Eclipse na décima.
- **Infinito:** chefe recorrente a cada cinco ondas; recorde local, não ranking oficial.
- Chefão com vida, movimento, projéteis, prenúncio do ataque, sprites de repouso/ataque/dano, recompensa ao derrotá-lo.

### Armas com custo e resultado
| Estilo | Custo | Efeito |
| --- | ---: | --- |
| Arco da Colheita | 1 manga | Disparo único equilibrado |
| Rajada Dupla | 2 mangas | Dois disparos laterais |
| Canhão Rúnico | 2 mangas | Projétil novo que causa **2 de dano**, com cadência menor |

O corpo dos projéteis e os pontos de vida dos inimigos são efetivamente modificados. Vida e munição não são somente desenhos no HUD.

### Tipos de inimigos
- **Larva** básica; **Besouro** mais resistente.
- **Esporo Errante** com trajetória oscilatória.
- **Arqueiro Sombrio** com vida própria, intervalo de conjuração, sprite alternado e tiro que atinge o jogador.
- **Carapaça Blindada** com **3 pontos de vida**, velocidade reduzida e sprite de dano.

### Habilidades
- **Q — Impulso evasivo:** deslocamento lateral, curta invulnerabilidade e recarga.
- **E — Explosão Astral:** consome munição, dano de área em pragas e chefe.
- **R — Reparo da Árvore:** **consome 6 essências**; restaura árvore caída, cura árvore danificada ou cria escudo quando não há dano. Abate de inimigos concede essências reais, limitado a 12. No celular, botões dedicados.
- **Seis bênçãos** oferecidas em conjuntos de três entre ondas: recarga rápida, vida extra, recuperação de árvores, reserva de essência, golpe preciso e passo do vento. O combate pausa até o jogador escolher.

### Regras e pontuação
- Ranking oficial continua usando o RPC original `game_finish` **apenas no Normal**, porque o servidor aceita no máximo a quinta onda. Difícil e Infinito permanecem locais, sem envio de pontuação inválida.
- Abates continuam com pontuação dentro da escala original para não provocar rejeição previsível por anti-cheat.
- Tela final detalha **rank cosmético S/A/B/C**, eliminações, reparos, combo, tiros e status do chefe. O rank exibido é só um indicador da partida, não ranking oficial.
- Partículas têm limite de quantidade e há suporte a baixo efeito/animação reduzida.

## 2. Casa dos Guardiões — espaço pessoal

O jogador tem uma **casa acessível pelo menu, pelo Grimório de Acesso e pela cabana existente no Mundo RPG**.

- Canvas de **800 × 496**, malha **12 × 6**, com iluminação, janela, estrelas e chão em pixel art.
- Três ambientes: **Refúgio da Floresta, Observatório Astral, Jardim do Amanhecer**.
- Três pisos: **Madeira de Carvalho, Mármore Lunar, Musgo Encantado**.
- **16 tipos de móveis**: cama, mapa, estante, plantas, tapete, lampião, cristal, baú, lareira, aquário, gato familiar, trono, altar, escrivaninha, bandeira e espelho.
- Clique, toque, arraste ou use **setas e Enter** para posicionar; botão para guardar móveis.
- Modo **Visitar** permite interagir com objetos. O baú rende **10 sementes locais por dia**; a cama muda o estado visual; outros objetos contam lore.
- Móveis iniciais gratuitos; especiais comprados com sementes locais acumuladas no modo Defesa; **nenhum dá vantagens competitivas**.
- O **Trono do Defensor** é desbloqueado ao vencer uma partida da Defesa.
- O **Altar das Cinco Luas** é desbloqueado quando `sm19_expedicao_<@>.finished===true`, após terminar a Expedição.
- O estado da casa salva sob chave própria por @ no `localStorage` e, com autenticação, no **Supabase**; alterações offline recebem um marcador de sincronização pendente que sobrevive a recargas. Layout vazio também é preservado.

### Segurança da Casa
Tabela `public.sm21_player_homes` com RLS ativa, sem permissões diretas de SELECT/INSERT/UPDATE para `anon`. RPCs `sm21_house_load` e `sm21_house_save` exigem o **mesmo token privado do perfil** via `auth_profile`, limitam IDs, tipo, posição e tamanho do JSON e não permitem consultar a casa alheia pela API direta.

Os SQLs em `sql/v21_casa_guardiões.sql` **já foram aplicados** ao projeto Supabase existente e revisados para aceitar quartos intencionalmente vazios. Não há nova credencial secreta no cliente.

**Limite:** sementes e compras continuam com economia local; o layout pode ser sincronizado, mas moedas não são uma carteira financeira autoritativa. Última alteração vence em edição simultânea da mesma conta em vários dispositivos.

## 3. Jornada Viva — conexão entre modos

No Início há dois atos diários: **jogar uma partida da Defesa** e **alterar de fato a decoração da Casa**. O progresso persiste por conta/dia no fuso de São Paulo. Concluindo os dois, o jogador pode resgatar uma única recompensa de **25 sementes locais**; clicar duas vezes não concede novamente.

O envio de mensagens ao chat **não** gera sementes, para não incentivar spam na comunidade. O chat ao vivo V20 e o mural moderado permanecem independentes.

## 4. Sprites e animações originais utilizados

Arquivos em `sprites/`: `arqueiro_sombra_v21_idle.svg`, `arqueiro_sombra_v21_cast.svg`, `arqueiro_sombra_v21_hurt.svg`; `carapaca_v21_idle.svg` e `carapaca_v21_hurt.svg`; `rei_eclipse_v21_idle.svg`, `rei_eclipse_v21_attack.svg`, `rei_eclipse_v21_hurt.svg`; `manga_runica_v21.svg`, `runa_reparo_v21.svg`; `casa_cristal_v21_idle.svg`, `casa_cristal_v21_brilho.svg`, `casa_gato_v21_idle.svg`, `casa_gato_v21_brilho.svg`.

**São 14 arquivos novos de pixel art SVG**, desenhados especificamente e integrados a caminhos de renderização em Canvas; as alternâncias de quadros se baseiam em estado real de ataque, dano, magia ou tempo, com fallback nos inimigos existentes quando o sprite não carrega. Não foram acrescentadas imagens externas decorativas que não aparecem no jogo.

## 5. Arquitetura e testes

- `index.html`: motor Defesa, HUD, interface, menu de versões V21 (V20, V19, V18 preservadas) e acesso à Casa.
- `casa_pomar_v21.js` / `casa_pomar_v21.css`: decoração, interação, compras locais, persistência e renderização.
- `jornada_v21.js`: progresso diário real por eventos e recompensa local única.
- `estetica_v21.css`: acabamento responsivo do combate e UI.
- `mundo_pomar.js`: interação com a cabana do Mundo RPG leva à casa.
- `tests/v21_chronicles.test.cjs`: regressões de sintaxe, assets, integração, segurança.
- `tests/v21_browser_gameplay.cjs`: Chromium desktop e móvel; compra e posicionamento de móveis, troca de tema, sincronização simulada entre navegadores, disparo com custo/dano, reparo que altera árvores, projéteis do arqueiro, escolha de melhorias, chefe da onda 5, bloqueio da vitória sem chefe, vitória após chefe, placar final e contrato diário. Usa respostas **simuladas** de API; não publica pontuação real.
- `.github/workflows/v21-jogabilidade.yml`: testes automatizados sem deploy, capturas de tela de dois formatos.
- `.github/workflows/empacotar-cloudflare-v21.yml`: produz ZIP apenas com arquivos públicos estáticos, comprovando ausência de Wrangler.

## 6. Publicação no Cloudflare Pages

1. Abrir **Actions → Pacote V21 - Cloudflare Pages (sem Wrangler)** na branch V21.
2. Baixar o artefato **Sam-Manguinha-V21-Cloudflare-Pages**.
3. Extrair o ZIP do GitHub Actions e enviar o **ZIP interno** `Sam-Manguinha-V21-Cloudflare-Pages.zip` ao uploader do Pages.
4. Não enviar `wrangler.jsonc` ao uploader estático. Se usar Workers, a publicação deve usar seu fluxo separado de `wrangler deploy`.
5. Recarregar com cache atualizado (`?v=21` para scripts e CSS novos).

## 7. O que ainda exige QA humano antes de publicar para todos

- Partida humana completa até a onda 5 contra o chefe, incluindo envio oficial do resultado ao banco e reclamações de balanceamento.
- Login real com dois @ em aparelhos físicos diferentes, sincronização da Casa, alternância de abas e conexão fraca.
- Moderação do chat V20 com duas contas simultâneas, denúncias e administrador.
- Experiência real com vários tamanhos de telefone e navegador Safari.
- Eventos e conquistas legados, Halloween, upload da galeria e progresso do Mundo RPG. Os módulos permanecem presentes, mas a revisão não comprova que todos os bugs históricos desapareceram.
- Avisos preexistentes de segurança no Supabase fora do escopo das novas tabelas.

**Não há deploy da V21 nem merge automático.** PR permanece como rascunho até revisão do usuário.
