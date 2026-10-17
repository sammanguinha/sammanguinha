# Importação da V17 — pendente dos arquivos

Esta branch foi criada a partir da `main` em 2026-10-17 para preservar o histórico antes de importar a versão **Sam Manguinha V17 — Revisão Geral e Praça dos Jogadores**.

**Atenção: esta branch AINDA NÃO contém a V17. Não publicar ou abrir merge para `main`.**

Pacote validado localmente:
- Arquivo: `sam_manguinha_v17_revisao_e_praca_dos_jogadores.zip`
- Total: 77 arquivos, incluindo `index.html`, `mundo_pomar.js`, `rpg_epico_expansao.js`, `revisao_v17.js`, estilos, sprites e imagens.
- SHA-256 do ZIP: `02c5442083075ca4dbb402586cba9a092f36cbf92171d6ef0463313a64cfa100`

## Próximos passos
1. Descompactar o ZIP localmente.
2. Nesta branch, adicionar todos os arquivos e pastas extraídos, inclusive substituindo o `index.html` antigo.
3. Manter a `main` intacta e não fazer deploy até validar a nova branch.
4. Verificar a lista de arquivos, caminhos de `sprites/` e `halloween_art/` e revisar mudanças de configuração/segredos.
5. Testar login, Defense, RPG, Halloween, ranking e mural em ambiente de teste.

**Motivo da pendência:** o conector disponível permite gravar conteúdo textual e blobs recebidos no próprio chamado, mas não consegue ler diretamente o ZIP e as imagens binárias que estão no ambiente local do ChatGPT.