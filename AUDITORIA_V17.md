# Sam Manguinha V17 — Auditoria de qualidade e interação

## Escopo

Revisão a partir dos arquivos da **V16.5**, preservando a campanha RPG, o Defesa do Pomar, o Halloween, o Mural, a Galeria, as contas, as conquistas e os arquivos de sprites. Não há alterações no Supabase remoto.

| Área | Força existente | Ponto fraco observado no código | Ajuste V17 |
| --- | --- | --- | --- |
| **Interface** | Navegação já reorganizada em quatro seções + Mais | Praça e códigos estavam dispersos; novas ações não eram fáceis de localizar | Atalhos diretos na página inicial, revisão de foco e caixas responsivas |
| **Códigos** | Grimório e conquistas originais | V16.5 usava seletores de CSS sem correspondência visível e dependia da antiga janela de códigos | Terminal próprio com botão **Ativar**, 18 códigos funcionais, mensagens e efeitos reversíveis |
| **Defesa** | Modos normal, difícil e infinito, mascotes e chefão | Sem pausa manual; modo de efeitos leves não reduzia partículas criadas pelo Canvas | Botão/tecla **P**, máscara de pausa, pausa automática ao ocultar aba, partículas reduzidas |
| **Campanha RPG** | Classes, artefatos, fraquezas e capítulos narrativos | Indicador de fraqueza desatualizado nas fases do chefão; custo de habilidade exibido fixo; foco perdido na reconstrução do menu | Fraqueza pelo elemento da fase atual; MP efetivo; foco restaurado; histórico acessível |
| **Halloween** | Seis salas, enigmas, diário e salvamento | Sem pedido de ajuda discreto; desenhava o Canvas mesmo oculto; herói com cor diferente do avatar principal | Botão de pistas graduais, pausa de renderização em segundo plano, cor do personagem sincronizada |
| **Comunidade** | Mural online com postagens moderadas e reações reais; ranking e galeria | Feed plano sem resposta fácil, busca nem chamada de participação | Praça com respostas referenciadas, filtros, pesquisa e desafio do dia (mensagem moderada) |
| **Acessibilidade** | Preferências de contraste, fonte e efeitos reduzidos na V16.5 | A ligação anterior de eventos seria perdida ao substituir o módulo antigo | Preferências reconectadas; status com `aria-live` e histórico do RPG com `role=log` |

## O que *não* foi implementado ou verificado

- **Não há chat instantâneo, mensagens privadas ou presença online.** A Praça é uma interface sobre o Mural dos Murmúrios preexistente e sua aprovação pelo administrador.
- **Não houve alteração no Supabase remoto**, portanto não houve criação de tabelas, políticas RLS, autenticação adicional, endpoints ou moderadores automáticos.
- O ranking oficial permanece sendo fornecido pelos endpoints anteriores; **códigos e desafios informais não concedem recompensas oficiais**.
- Testes isolados executaram as interações dos novos módulos em um navegador Chromium com páginas simplificadas (larguras de 390 e 1280 px); **não validam o site inteiro nem serviços externos**. O navegador de testes bloqueou a navegação para o servidor local.
- Não foi medida performance real em Android/iPhone, nem concluído um ciclo integral de campanhas no ambiente publicado.
- O avatar em Halloween sincroniza **a cor** do personagem, mas não reproduz todos os acessórios do guarda-roupa.
- O backend atual parece usar um identificador `@` e um token próprio guardado no navegador. Recomenda-se uma revisão de autenticação/autorização, limites de publicação e políticas de moderação antes de adicionar chat em tempo real.

## Roteiro de testes de publicação

1. Entrar com um perfil existente e verificar se nível, inventário, mascote e ranking continuam corretos.
2. No Grimório, ativar `BATATA`, `ARCOIRIS`, `MATRIX`, `AMOGUS`, `SIGMA` e clicar em **Desligar efeitos**. Conferir o contador de descobertas após recarregar.
3. Iniciar a Defesa em computador e celular, testar botões de movimento, tiro, **Pausar**, **Retomar**, alternância de abas e chegada à tela final.
4. Prosseguir uma luta do RPG com fraqueza e efeito de artefato; verificar foco de teclado e a indicação correta na próxima fase do Rei.
5. Abrir o Halloween, solicitar uma pista, navegar no mapa e confirmar que salvamento e puzzles continuam funcionando.
6. Enviar uma postagem à Praça com `#desafio`, aprová-la no painel admin, atualizar o feed em outro navegador e responder por `@`/`#id`. Confirmar o ciclo completo com contas **diferentes**, sem simular resultados locais.
7. Verificar redução de movimento, contraste e texto ampliado no celular; conferir links de galeria, envio de fotos e conquistas.

## Futuras melhorias que exigem backend

- Salas de bate-papo ao vivo com canais, moderação, bloqueio, denúncia e anti-spam.
- Guildas, pedidos de amizade, batalhas cooperativas e eventos conjuntos sincronizados.
- Ranking de desafios comunitários assinado pelo servidor e premiações oficiais.

Esses recursos dependem de autenticação, banco de dados e implantação real — **não** devem ser simulados apenas com `localStorage`.
