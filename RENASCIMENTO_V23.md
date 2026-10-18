# V23 — Renascimento do Pomar · entrega integrada

Branch de trabalho: `dev/v23-renascimento-integrado`
Base: `dev/v22-fundacao-reinos`
Status: versão candidata para testes; **nenhum merge nem deploy em produção foi executado**.

## O que mudou de verdade

### Vila central jogável
- A vila continua sendo o mesmo mapa e save da campanha existente: V23 **não reinicia as missões V19/V22** e mantém a posição do jogador, artefatos, batalhas e regiões antigas.
- Entradas no cenário levam realmente à Casa (com backup V22), Arena de Defesa, Praça Ao Vivo, eventos e à floresta.
- Guia de destinos em tela aponta para o NPC/portal físico, com contagem aproximada de passos. Não teletransporta o jogador nem completa missões automaticamente.
- NPCs Bento, Lívia, Eldra, Maíra, Dona Amália e Tito têm seis folhas de sprites originais de quatro quadros; os moradores Bento/Lívia/Amália/Tito possuem leve animação de rotina sem impedir a interação.
- Árvores lunares e corrompidas da fase inicial da V23 permanecem com animação em quatro quadros.
- Três cenas de atmosfera no canvas (amanhecer, névoa e noite estrelada), escolha salva por jogador, com redução de partículas quando o aparelho pede movimento reduzido ou o modo leve está ativo.

### Contratos locais da Vila
- Três tarefas com gatilho verificável dentro do motor do mundo: conversar com Bento, entrar na Floresta e vencer uma batalha da campanha.
- Cada uma concede respectivamente 25, 35 e 65 sementes **locais**; renovam por data no fuso `America/Sao_Paulo`.
- Resgate é único por tarefa/dia e account-scoped no localStorage. Contratos não alteram mangas, conquistas ou ranking oficial do Supabase.
- Os contratos aparecem em cartões visíveis no RPG; o Quadro de Contratos físico no cenário leva até eles. Também há indicação no guia de destinos.
- Limite: sementes locais ainda não são uma economia segura de servidor. Jogadores podem alterar localStorage; por isso não criamos vantagem ranqueada baseada nelas.

### Defesa do Pomar — novas funções táticas
- **Raiz Guardiã** (5 energias): imobiliza inimigos da sua rota por 1,4 s, aumentando a duração até o nível 3; sem somar eliminações gratuitas no nível 1.
- **Totem Solar** (6 energias): acerta grupos de até 5 pragas num raio de 82 px e 110 px no nível 3. Tem intervalo de recarga próprio. Ganhos de energia respeitam apenas inimigos derrotados.
- As torres seguem uma por rota, custos por melhoria do V22, recarga, alvos fortes/próximos e dependência de árvore viva.
- Sprites SVG originais das torres contêm quatro quadros; o render usa o frame de animação, reduzido ao primeiro quando o sistema pede menos movimento.
- Efeito da Raiz Guardiã realmente reduz a velocidade vertical a zero por um tempo, em vez de apenas mostrar partículas. O Totem Solar altera HP de múltiplos alvos reais.
- As torres não incrementam diretamente pontuação oficial; o modo Normal continua sujeito à validação do backend. O modo Difícil/Infinito continua fora do ranking oficial.

### Reformulação visual
- Capa de entrada temática com caminhos diretos para Vila, Defesa e Casa.
- Interface de contratos e ambiente, contraste/foco visível, ajustes para celular e grades de torres mais legíveis.
- Painel de acessibilidade/contraste existente da V23 permanece funcional; estilos novos respeitam redução de movimento.
- Guarda-roupa, Casa sincronizada, Praça Ao Vivo moderada, campanha e Halloween anteriores permanecem, sem apagar os dados.

## Testes

- `tests/v23_renascimento.test.cjs`: integração de hubs, assets, versão e compatibilidade.
- `tests/v23_vila_defesa.test.cjs`: executa o motor real de torre Solar/Raiz (dano, imobilização, recarga, upgrades) e contratos diários em armazenamento isolado.
- `tests/v23_browser_smoke.cjs`: Chromium desktop/celular para menus e navegação.
- `tests/v23_world_interactive.cjs`: Chromium desktop/celular percorrendo diálogo, contrato, resgate e persistência da atmosfera sem chamadas ao banco real.
- Regressões da V22 (`tests/v22_fundacao.test.cjs`, `tests/v22_defense.test.cjs`) garantem que casa/Defesa não percam funcionalidades.
- Códigos de testes e documentação ficam no GitHub, **fora do ZIP de Cloudflare Pages**.

## Publicação e cuidados

Na Action `Pacote Cloudflare Pages V23`, baixar `Sam-Manguinha-V23-Cloudflare-Pages`, extrair o primeiro ZIP do GitHub Actions e enviar o ZIP interno ao Cloudflare Pages (upload estático). Configurações `wrangler*` não são incluídas.

A V23 ainda exige uma rodada antes do lançamento: derrota/vitória completa de cinco ondas no modo Normal com o servidor verdadeiro, conta em dois dispositivos, testes manuais da Praça Ao Vivo e de conquistas, além de desempenho em celular de entrada. Essas verificações não devem ser substituídas por smoke tests.

## Observação sobre direção artística
A obra busca progressão e fantasia RPG cinematográfica com **personagens, nomes e gráficos próprios**. Não copia sprites, músicas, personagens nem interface de Final Fantasy.
