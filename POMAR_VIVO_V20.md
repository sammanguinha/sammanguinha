# Sam Manguinha V20 — Pomar Vivo

Base: `dev/v19-expedicao-cinematica`. Código: `dev/v20-pomar-vivo`.

## Defesa do Pomar
- **Q / Impulso**: esquiva horizontal com 0,65 s de proteção, 7 s de recarga. Em dispositivos de toque há botão dedicado.
- **E / Explosão Astral**: gasta 3 mangas; dano radial em pragas e chefão; recarga 13 s; efeito e dano visíveis.
- **Combo**: contador de eliminações reseta depois de 5 segundos; respeita limites anti-trapaça da pontuação oficial. Pontos do combo são apenas visuais, não multiplicam o ranking.
- **Esporo Errante**: novo inimigo com sprite SVG e deslocamento horizontal a partir da onda 2, além de partículas e ambiente atmosférico.
- **Modos**: somente Normal participa do ranking oficial do Supabase; Difícil e Infinito são modos de treino/recorde local porque o RPC `game_finish` aceita apenas ondas 1–5. Sem alterar a validação do servidor.

## Personalização
- 21 acessórios, companheiros e títulos V20 desbloqueados por presente, campanha e capítulos RPG.
- Busca por termo, filtro por desbloqueados e contagem.
- Renderizador SVG em camadas reflete itens novos (cabeça, máscara, corpo, capa, mão, aura, companheiro); visuais locais do RPG são preservados no `localStorage` com a conta atual.
- **Limite importante**: o perfil/ranking clássico do Supabase suporta apenas seu catálogo original de chapéus. Novas peças V20 são cosméticos locais do guarda-roupa RPG, não sincronizadas como avatar oficial entre dispositivos. A V20 não inventa uma recompensa oficial.

## Praça Ao Vivo
- Salas `Praça`, `Defesa`, `RPG`; envio via `sm_live_send` com validação do token associado ao @; Realtime via publicação de alterações no Postgres e biblioteca JS carregada por CDN.
- Atualização por consulta automática a cada 8 s caso o Realtime esteja bloqueado/instável. Status explica conexão.
- Mensagens públicas com 2–180 caracteres, controle de 7 s entre envios, no máximo 8 mensagens por 5 min, anti-repetição, sem URLs/contatos, proibição básica de termos inadequados.
- Denúncia via `sm_live_report`, limitada por autor. Três denúncias independentes ocultam a mensagem; administrador pode ocultar/restaurar via `sm_live_admin_set`. **Moderação é reativa**, não pré-aprovação: para comunidade grande, adicionar fila humana, rate limit por IP no servidor e ferramentas administrativas melhores.
- RLS restringe SELECT à mensagem aprovada; INSERT/UPDATE/DELETE diretos proibidos. São usadas apenas chaves públicas no cliente.
- Mural dos Murmúrios original **continua** com sua pré-aprovação manual, independente do chat.

## Implantação
1. Baixar o artefato no workflow `Pacote Cloudflare Pages V20` da branch V20.
2. Extrair o ZIP do GitHub Actions e enviar o **ZIP interno** `Sam-Manguinha-V20-Cloudflare-Pages.zip` ao upload estático do Cloudflare Pages.
3. Nunca enviar `wrangler.jsonc` no upload direto do Pages. Worker é fluxo separado.
4. Para Realtime, projeto Supabase existente `rygeemrxyjknhxxlewdb`: migração `sql/v20_pomar_chat.sql` já aplicada uma vez ao banco, publicação confirmada.
5. A V20 usa CDN jsDelivr para o cliente Realtime; se indisponível, o mural ao vivo recorre a consultas automáticas.
6. Cuidado: a versão ainda não foi publicada. Testar login com duas contas, mensagens entre navegadores, denúncia, móvel, alternância de abas, controles e save antes de mesclar para produção.

## Regressões a verificar manualmente
- Fluxo de login @ e troca de contas; persistência do perfil/senha não foi modificada.
- Defesa Normal até onda 5 salvando no Supabase, e Difícil/Infinito apenas local.
- Pausar, fechar painel, voltar, retomar, toque nos botões; proteção à invulnerabilidade e limites de recarga.
- Personalização no móvel, equipar/desequipar, trocar de @, sair e retornar.
- Chat Realtime com dois usuários, RLS, denúncia e ocultação; sem usar contas reais na automação.
- Modos Expedição e Halloween; conteúdo do index.html legado preservado.

## Segurança revisada
A inspeção automática do Supabase ainda detecta avisos pré-existentes em outras funções/visões públicas (por exemplo `ranking_v` security-definer). Não alteramos funções legadas fora do escopo desta versão. Avaliar esses avisos antes de ampliar o número de jogadores.
