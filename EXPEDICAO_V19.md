# SAM MANGUINHA — EXPEDIÇÃO ASTRAL V19
## O Eclipse das Cinco Luas

**Status:** implementação na branch `dev/v19-expedicao-cinematica`, baseada em `dev/v18-grande-atualizacao`. **Nenhum deploy em produção.** `main`, Cloudflare e dados oficiais do Supabase não foram alterados.

### A campanha
1. **Clareira das Três Luas** — Nara ensina os caminhos do pomar e o mistério das mangas celestiais.
2. **Vale dos Besouros Reais** — o pacto dos guardiões começa a se revelar.
3. **Templo da Manga Celestial** — primeiro confronto com o Arauto das Pragas.
4. **Biblioteca das Raízes** — a maldição e o juramento esquecido são revelados.
5. **Coração do Eclipse** — confrontação final com o Rei das Pragas e desfecho.

Cada capítulo tem uma cena narrada, **3 mangas**, uma **relíquia** e um portal. As relíquias permitem descobrir fragmentos de história; são colecionáveis locais. Os mapas foram validados quanto a dimensões e caminhos possíveis.

### Mecânicas novas
- **Pulso astral (F):** custa 3 de energia e atinge pragas próximas em área.
- **Guarda (G):** protege o personagem contra o próximo golpe recebido.
- **Energia:** carrega com mangas, relíquias, passos e transição de capítulo.
- **Espíritos lunares:** inimigos que atacam à distância, com intervalo de recarga.
- **Novos bosses:** Arauto no templo e Rei das Pragas no último capítulo.
- **Conquistas:** oito medalhas cosméticas locais, preservando as seis da V18.

### Arte realmente implementada
- Nova arte original em `sprites/espirito_lunar_v19.svg`, `sprites/reliquia_lunar_v19.svg` e `sprites/portal_astral_v19.svg`.
- Reutilização correta dos sprites existentes `sam_idle.png`, `sam_andando_1.png` e `sam_atacando.png` (estados visualmente distintos), `aranha_infectada.png`, `besouro.png` e `rei_das_pragas_idle.png`.
- Renderização em Canvas com interpolação de movimento, bobbing, partículas, flashes, vinheta, bruma, glows, indicadores de dano, barras de vida e tremor de tela.
- Modo `prefers-reduced-motion` respeitado.
- Diálogos e controles mobile no mesmo painel existente, sem gerar imagens separadas no chat.

### Controles
| Ação | Teclado | Celular |
|---|---|---|
| Andar | WASD / setas | Botões ou deslizar no tabuleiro |
| Atacar | Espaço | ⚔ Atacar |
| Curar | Q | 🧪 Curar |
| Pulso | F | ✴ Pulso |
| Guardar | G | 🛡 Defender |
| Pausar | Esc | Pausar |
| Próxima fala | Enter ou botão | Continuar |

### Salvamento, privacidade e recompensas
- `sm19_expedicao_<handle>` salva no **mesmo navegador**, por identificação @.
- Se existir apenas uma partida V18, o jogo cria cópia migrada para V19 e **não apaga o original**.
- Se a V18 já foi concluída, a V19 continua a jornada no quarto capítulo, sem exigir repetir tudo.
- O modo não concede XP, saldo de manga, ranking ou conquistas oficiais do Supabase. Medalhas e pontos são locais.
- Nenhuma API, policy, tabela, RPC ou credencial do backend é alterada.

### Testes
Workflow: `.github/workflows/v19-expedicao-testar.yml`, exclusivo da branch V19, **sem deploy**.

Executar manualmente:
```sh
node --check expedicao_v18.js
node --test tests/expedicao_v19_smoke.test.cjs
```

Os testes cobrem mapas e caminhos, presença de sprites, inicialização, diálogos, movimentação, energia, relíquias, salvamento, migração V18 e bloqueio de portal por boss. Ainda é recomendável jogar no navegador real e no celular antes de mesclar ou publicar.

### Arquivos envolvidos
- `index.html` — V19 em notas de atualização e cache-busting dos assets.
- `expedicao_v18.js` — motor atualizado para 19, mantido o nome por compatibilidade com a integração existente.
- `expedicao_v18.css` — ambientação, efeitos, diálogos e layout.
- `sprites/*_v19.svg` — novos sprites utilizados de fato pelo jogo.
- `tests/expedicao_v19_smoke.test.cjs` — regressão reproduzível.

**Não houve uso do Adobe.**
