# Sam Manguinha V29 — Crônicas Vivas · A Última Badalada

## Por que esta versão existe

O problema do RPG não era apenas visual. O jogo precisava de objetivos com encadeamento, pistas relevantes, NPCs que participam dos eventos, objetos investigáveis e combates com decisões. A V29 expande o mundo **sem eliminar a campanha principal** e sem modificar contas, ranking, Supabase ou formato de salvamento já utilizado.

## Nova linha narrativa: A Última Badalada

A Vila perdeu o sino que ajudava viajantes a voltar para casa. **Íris**, uma cartógrafa, pede ao jogador que investigue três lugares:

1. **Relógio da Praça (Vila)** — revela o primeiro princípio da melodia.
2. **Casca da Melodia (Floresta)** — conta onde o som é guardado.
3. **Biruta dos Navegantes (Campina)** — revela quem completa o ciclo.

É necessário ler as três pistas. O **Carrilhão das Três Vozes** exige que o jogador deduza e escolha três símbolos na ordem correta; o progresso parcial fica salvo, erros dão feedback e permitem tentar outra vez sem reiniciar a aventura.

A melodia revela a **Mariposa do Silêncio**. A vitória e o diálogo seguinte desbloqueiam **Caio**, aprendiz de Íris, que explica as intenções da Sentinela. Após enfrentar a **Sentinela da Badalada**, o jogador retorna à **Copa da Primeira Mangueira** para escolher: devolver o sino à Vila ou confiá-lo às raízes da Floresta. As conversas de Íris, Mara e Caio refletem o que foi descoberto.

### Personagens e cenários

- **Íris, Cartógrafa:** introdução e orientação contextual, diário de pistas.
- **Mara, Jardineira:** história da Floresta, pistas úteis, reação ao carrilhão.
- **Caio, Aprendiz:** investiga rastros, explica a Sentinela e desbloqueia o confronto.
- **Mariposa do Silêncio / Sentinela da Badalada:** encontros completos usando o combate existente, com comportamento e pistas próprios.
- **Objetos desenhados no Canvas:** relógio, inscrição de casca, biruta, carrilhão, copa ancestral, livro de campo e 9 registros escondidos.

## Combates melhorados

- A ação **🔎 ANALISAR** gasta um turno, protege parcialmente o jogador, restaura 1 MP e prepara **+35%** para o próximo ataque.
- A Mariposa e a Sentinela avisam quando carregarão ataques mais fortes. O jogador pode antecipar o turno, defender ou estudar a fraqueza elemental.
- Os confrontos continuam usando equipamentos, classes, poções e XP oficiais do RPG, sem desviar o ranking do modo Defesa.

## Coleção de cenário

Nove objetos encontrados uma única vez estão distribuídos pela Vila, Floresta, Campina, Santuário, Estufa, Bosque, Minas, Pântano e Observatório. Cada achado revela uma lembrança do Pomar e concede XP/moedas locais. Completar os nove dá uma recompensa única adicional. Os achados são salvos em `epic.v29.finds`.

## Diário de Campo diário

Depois de começar a investigação com Íris, o jogador pode abrir o **Diário de Campo**, na Vila. Um objetivo local rotativo o envia a um de três pontos de observação, onde deve registrar evidências e retornar para entregar a pesquisa. Recompensa uma vez ao dia por personagem (30 XP e 18 moedas RPG). **Não** altera leaderboard, moedas oficiais, nem exige servidor.

## Persistência e compatibilidade

O save local existente `sam_rpg_hibrido_v12_<conta>` agora pode incluir `epic.v29` com pistas, tentativas, capítulos, decisões, colecionáveis e missão diária. Saves antigos continuam válidos: esse campo é criado sob demanda, sem alterar os anteriores.

- Dados de história/NPCs: `rpg_cronicas_v29.js` (carregado antes do motor).
- Regras, atores, Canvas, combate e persistência: `mundo_pomar.js`.
- UI do diário, pistas, batalha e responsividade: `css/v29-quest.css`.
- Sem migrar banco, sem introduzir nova dependência JS, sem deploy automático.

## Testes e publicação

- `tests/v29_cronicas.test.cjs`: estrutura, objetivos, pistas, combate, rendição e recompensas únicas.
- `tests/v29_story_browser.cjs`: joga o percurso no Chromium desktop/mobile, com erro e acerto no puzzle, duas lutas reais, desfecho, coleção, tarefa diária e reload.
- CI mantém os testes anteriores do RPG, Defesa, interface imersiva e build compilado.
- O ZIP só é produzido após aprovação dos testes: `Sam-Manguinha-V29-Cronicas-Vivas-Cloudflare-Pages.zip`.

A atualização amplia a experiência, mas não substitui futuras campanhas, mapas maiores nem um sistema de animação completamente novo.
