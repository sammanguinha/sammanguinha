
/* =========================================================================
   SISTEMA DE RPG DE HALLOWEEN & GUARDA-ROUPA UNIFICADO DO POMAR
   ========================================================================= */
(()=>{
  const rpgEsc = v => String(v == null ? "" : v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  
  // 6 Missões / Capítulos da Campanha
  const rpgQuestData = [
    { id: "gate", title: "As Lanternas Apagadas", area: "gate", kind: "main", chapter: "Capítulo I • O Portão", desc: "Reacenda a primeira lanterna e decifre a direção apontada pelo vento leste.", xp: 40, reward: ["sprout-pin", "lantern-charm", "witch-hat", "gate-rune"] },
    { id: "greenhouse", title: "A Semente sob o Vidro", area: "greenhouse", kind: "main", chapter: "Capítulo II • A Estufa", desc: "Descubra qual semente floresce na escuridão e decida seu destino: guardar ou plantar.", xp: 60, reward: ["moon-mask", "ghost-hood", "glass-record"] },
    { id: "trail", title: "Três Folhas, Uma Mentira", area: "trail", kind: "main", chapter: "Capítulo III • A Trilha", desc: "Encontre os três bilhetes da raposa e descubra qual depoimento contradiz a verdade.", xp: 80, reward: ["leaf-cape", "leaf-aura", "map-fragment"] },
    { id: "tree", title: "O Nome que Falta", area: "tree", kind: "main", chapter: "Capítulo IV • A Árvore Ancestral", desc: "Leia as inscrições na casca ancestral. A resposta está na parte oculta sob a terra.", xp: 120, reward: ["root-armor", "root-sigil", "bark-record"] },
    { id: "sanctuary", title: "A Casa sob as Raízes", area: "sanctuary", kind: "secret", chapter: "Capítulo V • O Santuário Oculto", desc: "Abra a gaveta esquecida da Colecionadora que guarda a memória antiga do pomar.", xp: 180, reward: ["secret-veil", "firefly-familiar", "memory-page"] },
    { id: "heart", title: "A Última Colheita", area: "heart", kind: "main", chapter: "Capítulo VI • O Coração do Pomar", desc: "Decida o destino do pomar: libertar as lembranças para a comunidade ou proteger o segredo.", xp: 260, reward: [] }
  ];

  // 6 Regiões do Mundo do Pomar
  const rpgAreas = [
    { id: "gate", name: "Entrada do Pomar", short: "Portão", icon: "gate", step: "01" },
    { id: "greenhouse", name: "Estufa Abandonada", short: "Estufa", icon: "greenhouse", step: "02" },
    { id: "trail", name: "Trilha das Folhas Mortas", short: "Trilha", icon: "trail", step: "03" },
    { id: "tree", name: "Árvore Ancestral", short: "Árvore", icon: "tree", step: "04" },
    { id: "sanctuary", name: "Santuário Oculto", short: "Santuário", icon: "sanctuary", step: "05", secret: true },
    { id: "heart", name: "Coração do Pomar", short: "Coração", icon: "heart", step: "06", secret: true }
  ];

  // Catálogo Completo Unificado de Equipamentos e Itens
  const rpgItems = [
    // V20 · Coleção Pomar Vivo: recompensas com visuais renderizados.
    { kind: "gear", id: "astral-beret", name: "Boina do Astrônomo", slot: "head", rarity: "Comum", icon: "star", from: "Presente V20", starter: true, desc: "Boina de veludo azul com estrela bordada." },
    { kind: "gear", id: "guardian-helm", name: "Elmo do Guardião", slot: "head", rarity: "Raro", icon: "armor", from: "Conclua o portão", quest: "gate", desc: "Elmo de bronze com pluma verde do pomar." },
    { kind: "gear", id: "eclipse-horns", name: "Chifres do Eclipse", slot: "head", rarity: "Lendário", icon: "crown", from: "Capítulo V do RPG", epicChapter: 5, desc: "Chifres lunares esculpidos no cristal noturno." },
    { kind: "gear", id: "sunflower-band", name: "Tiara de Girassol", slot: "head", rarity: "Comum", icon: "leaves", from: "Presente V20", starter: true, desc: "Pequenos girassóis acompanhando a fruta." },
    { kind: "gear", id: "forest-goggles", name: "Óculos de Botânico", slot: "face", rarity: "Comum", icon: "eye", from: "Presente V20", starter: true, desc: "Lentes verdes para exploradores do bosque." },
    { kind: "gear", id: "raven-mask", name: "Máscara de Corvo", slot: "face", rarity: "Épico", icon: "mask", from: "Encontre o Santuário", quest: "sanctuary", desc: "Máscara enigmática usada pelos vigias antigos." },
    { kind: "gear", id: "heart-glasses", name: "Óculos Corações", slot: "face", rarity: "Comum", icon: "eye", from: "Presente V20", starter: true, desc: "Óculos cor-de-rosa que trazem alegria à praça." },
    { kind: "gear", id: "petal-cloak", name: "Manto de Pétalas", slot: "cape", rarity: "Comum", icon: "cloak", from: "Presente V20", starter: true, desc: "Pétalas giram como vento de primavera." },
    { kind: "gear", id: "galaxy-cloak", name: "Manto Galáctico", slot: "cape", rarity: "Épico", icon: "star", from: "Capítulo IV do RPG", epicChapter: 4, desc: "Tecido azulado com estrelas bordadas." },
    { kind: "gear", id: "ember-mantle", name: "Capa Brasa", slot: "cape", rarity: "Raro", icon: "cloak", from: "Decifre a árvore", quest: "tree", desc: "Manto rubro feito de folhas incandescentes." },
    { kind: "gear", id: "lunar-vest", name: "Colete da Lua", slot: "body", rarity: "Comum", icon: "armor", from: "Presente V20", starter: true, desc: "Peitoral de cetim lunar bordado." },
    { kind: "gear", id: "knight-bark", name: "Couraça do Cavaleiro", slot: "body", rarity: "Épico", icon: "armor", from: "Conclua a árvore", quest: "tree", desc: "Armadura com nervuras de carvalho ancestral." },
    { kind: "gear", id: "jade-wand", name: "Cajado de Jade", slot: "hand", rarity: "Comum", icon: "star", from: "Presente V20", starter: true, desc: "Bastão verde usado por iniciantes da expedição." },
    { kind: "gear", id: "mango-banner", name: "Estandarte do Pomar", slot: "hand", rarity: "Raro", icon: "leaves", from: "Encontre a trilha", quest: "trail", desc: "Estandarte de seda com uma manga dourada." },
    { kind: "gear", id: "crystal-lamp", name: "Luminária de Cristal", slot: "hand", rarity: "Raro", icon: "lantern", from: "Resolva a estufa", quest: "greenhouse", desc: "Cristal violeta que ilumina a escuridão." },
    { kind: "gear", id: "rainbow-aura", name: "Aura Arco-íris", slot: "aura", rarity: "Comum", icon: "star", from: "Presente V20", starter: true, desc: "Um halo colorido com brilho suave." },
    { kind: "gear", id: "moonfire-aura", name: "Chama Lunar", slot: "aura", rarity: "Lendário", icon: "star", from: "Capítulo V do RPG", epicChapter: 5, desc: "Chamas azuladas que não queimam." },
    { kind: "gear", id: "butterfly-buddy", name: "Borboleta de Névoa", slot: "companion", rarity: "Comum", icon: "firefly", from: "Presente V20", starter: true, desc: "Uma borboleta que dança ao redor do herói." },
    { kind: "gear", id: "shadow-fox", name: "Raposa Sombria", slot: "companion", rarity: "Épico", icon: "moth", from: "Conclua o Santuário", quest: "sanctuary", desc: "Raposa espectral que observa o bosque." },
    { kind: "title", id: "title-moon", name: "Mensageiro da Lua", slot: "title", rarity: "Comum", icon: "star", from: "Presente V20", starter: true, desc: "Um título para o começo da aventura." },
    { kind: "title", id: "title-forest", name: "Protetor do Bosque", slot: "title", rarity: "Épico", icon: "leaves", from: "Conclua a árvore", quest: "tree", desc: "A floresta reconhece sua coragem." },
    // Cabeça / Chapéus
    { id: "none", name: "Sem Chapéu", desc: "A casca da manga limpa sob a luz lunar.", rarity: "Comum", kind: "gear", slot: "head", icon: "sprout", from: "Visual inicial", serverHat: "none" },
    { id: "sprout-pin", name: "Broto de Cobre", desc: "Um broche de cobre em formato de folha feito para mangas jovens.", rarity: "Comum", kind: "gear", slot: "head", icon: "leaves", from: "Presente de chegada", quest: "gate", serverHat: "folha" },
    { id: "witch-hat", name: "Chapéu da Vigia", desc: "Aba pontiaguda com runas tecidas por quem contava as fases da lua.", rarity: "Incomum", kind: "gear", slot: "head", icon: "star", from: "Decifre o portão", quest: "gate", serverHat: "wizard" },
    { id: "ghost-hood", name: "Capuz sem Sombra", desc: "Tecido etéreo que não projeta sombra no chão.", rarity: "Raro", kind: "gear", slot: "head", icon: "cloak", from: "Resolva a estufa", quest: "greenhouse", serverHat: "capuz" },
    { id: "pact-crown", name: "Coroa do Vigia", desc: "Forjada com galhos secos e gemas de âmbar. Ouve os sussurros da noite.", rarity: "Lendário", kind: "gear", slot: "head", icon: "crown", from: "Final da campanha", ending: "pact", secret: true, serverHat: "crown" },
    { id: "cap", name: "Boné Vermelho", desc: "Um boné clássico virado para frente.", rarity: "Comum", kind: "gear", slot: "head", icon: "star", from: "Nível 1 de colheita", serverHat: "cap" },
    { id: "cowboy", name: "Chapéu de Cowboy", desc: "Feito de couro curtido para dias ensolarados.", rarity: "Incomum", kind: "gear", slot: "head", icon: "star", from: "Nível 2 de colheita", serverHat: "cowboy" },
    { id: "pirate", name: "Bicorne de Pirata", desc: "Chapéu com caveira bordada de capitão dos sete mares.", rarity: "Raro", kind: "gear", slot: "head", icon: "star", from: "Nível 3 de colheita", serverHat: "pirate" },
    { id: "palha", name: "Chapéu de Palha", desc: "Trançado artesanal leve para colheita farta.", rarity: "Incomum", kind: "gear", slot: "head", icon: "leaves", from: "Conquista: Colheita", serverHat: "palha" },
    { id: "elmo", name: "Elmo Enferrujado", desc: "Capacete de metal gasto que defendeu as árvores ancestrais.", rarity: "Épico", kind: "gear", slot: "head", icon: "armor", from: "Conquista: Defesa", serverHat: "elmo" },
    { id: "crown", name: "Coroa Dourada Real", desc: "Coroa de ouro cravejada para lendas do pomar.", rarity: "Lendário", kind: "gear", slot: "head", icon: "crown", from: "Nível 5 de colheita", serverHat: "crown" },

    // Rosto / Máscaras
    { id: "moon-mask", name: "Máscara de Casca", desc: "Esculpida na casca grossa de uma árvore antiga. Protege o olhar.", rarity: "Incomum", kind: "gear", slot: "face", icon: "mask", from: "Resolva a estufa", quest: "greenhouse" },

    // Vestes & Capas
    { id: "leaf-cape", name: "Capa das Folhas", desc: "Feita com folhas de bordo secas entrelaçadas. Move-se com o vento.", rarity: "Raro", kind: "gear", slot: "cape", icon: "cloak", from: "Resolva a trilha", quest: "trail" },
    { id: "secret-veil", name: "Véu do Santuário", desc: "Manto translúcido bordado com constelações antigas.", rarity: "Secreto", kind: "gear", slot: "cape", icon: "star", from: "Encontre o santuário", quest: "sanctuary", secret: true },
    { id: "dawn-cape", name: "Capa da Primeira Manhã", desc: "As bordas guardam o primeiro raio de sol que desfaz a maldição.", rarity: "Lendário", kind: "gear", slot: "cape", icon: "cloak", from: "Liberte as lembranças", ending: "release", secret: true },
    { id: "root-armor", name: "Peitoral de Raízes", desc: "Raízes vivas entrelaçadas que formam uma carapaça protetora.", rarity: "Épico", kind: "gear", slot: "body", icon: "armor", from: "Decifre a árvore", quest: "tree" },

    // Mão & Relíquias
    { id: "lantern-charm", name: "Lanterna de Bolso", desc: "Uma pequena lanterna de bronze com chama que não se apaga.", rarity: "Comum", kind: "gear", slot: "hand", icon: "lantern", from: "Decifre o portão", quest: "gate" },
    { id: "gate-rune", name: "Runa do Leste", desc: "Pedra rúnica que vibra quando apontada para o caminho certo.", rarity: "Incomum", kind: "relic", icon: "compass", from: "Decifre o portão", quest: "gate" },
    { id: "glass-record", name: "Etiqueta de Vidro", desc: "Inscrição antiga: 'A semente escolhe quem sabe escutar'.", rarity: "Raro", kind: "record", icon: "scroll", from: "Resolva a estufa", quest: "greenhouse" },
    { id: "moon-seed", name: "Semente Lunar", desc: "Guardada intacta na estufa como memorial eterno.", rarity: "Raro", kind: "relic", icon: "seed", from: "Guarde a semente na estufa", branch: "keep" },
    { id: "moon-bloom", name: "Flor de Vidro", desc: "Floresceu na estufa sob o luar e emite bioluminescência suave.", rarity: "Raro", kind: "relic", icon: "star", from: "Plante a semente na estufa", branch: "plant" },
    { id: "map-fragment", name: "Fragmento do Mapa", desc: "Pedaço de pergaminho que revela atalhos na névoa.", rarity: "Raro", kind: "relic", icon: "map", from: "Resolva a trilha", quest: "trail" },
    { id: "root-sigil", name: "Selo Ancestral", desc: "Um talismã gravado nas raízes que abre portas esquecidas.", rarity: "Épico", kind: "relic", icon: "ring", from: "Decifre a árvore", quest: "tree" },
    { id: "bark-record", name: "Página de Casca", desc: "A casca registrou um nome sagrado antes de tentar apagá-lo.", rarity: "Raro", kind: "record", icon: "scroll", from: "Decifre a árvore", quest: "tree" },
    { id: "memory-page", name: "Arquivo da Colheita", desc: "Página da crônica original que lembra de cada visitante.", rarity: "Secreto", kind: "record", icon: "scroll", from: "Encontre o santuário", quest: "sanctuary" },

    // Auras & Companheiros
    { id: "leaf-aura", name: "Véu de Folhas Secas", desc: "Uma espiral de folhas outonais flutua continuamente ao seu redor.", rarity: "Incomum", kind: "gear", slot: "aura", icon: "leaves", from: "Resolva a trilha", quest: "trail" },
    { id: "firefly-familiar", name: "Vagalume-Guia", desc: "Um companheiro luminoso que voa ao seu lado e afasta sombras.", rarity: "Épico", kind: "gear", slot: "companion", icon: "firefly", from: "Encontre o santuário", quest: "sanctuary" },

    // V14 · Novos acessórios de personagem; recompensas ligadas à campanha RPG e às conquistas.
    { id: "starlit-circlet", name: "Tiara da Lua Nova", desc: "Um círculo prateado de estrelas que acompanha a sua caminhada.", rarity: "Comum", kind: "gear", slot: "head", icon: "star", from: "Presente inicial", starter: true },
    { id: "forest-hood", name: "Capuz do Bosque", desc: "Folhas frias cobrem a cabeça como um capuz protetor.", rarity: "Raro", kind: "gear", slot: "head", icon: "leaves", from: "Capítulo II · Bosque das Teias", epicChapter: 2 },
    { id: "mushroom-cap", name: "Cogumelo Astral", desc: "Chapéu violeta de cogumelo luminoso.", rarity: "Épico", kind: "gear", slot: "head", icon: "moth", from: "Derrote a Rainha das Aranhas", epicBoss: "spider" },
    { id: "storm-crown", name: "Coroa das Tempestades", desc: "Uma coroa de vento elétrico e âmbar azul.", rarity: "Lendário", kind: "gear", slot: "head", icon: "crown-rpg", from: "Capítulo V · Vigília da Lua", epicChapter: 5 },
    { id: "star-spectacles", name: "Óculos Estelares", desc: "Lentes douradas que capturam a luz mais fraca.", rarity: "Comum", kind: "gear", slot: "face", icon: "eye", from: "Presente inicial", starter: true },
    { id: "prism-visor", name: "Viseira do Prisma", desc: "Um visor cristalino azul, nascido nas minas antigas.", rarity: "Épico", kind: "gear", slot: "face", icon: "eye", from: "Derrote o Besouro Prismático", epicBoss: "crystalBoss" },
    { id: "amber-coat", name: "Jaqueta do Entardecer", desc: "Colete acolchoado em âmbar de aventurista.", rarity: "Comum", kind: "gear", slot: "body", icon: "armor", from: "Presente inicial", starter: true },
    { id: "prism-armor", name: "Armadura do Prisma", desc: "Peitoral de cristal e couro azul de explorador.", rarity: "Épico", kind: "gear", slot: "body", icon: "armor", from: "Capítulo III · Minas", epicChapter: 3 },
    { id: "night-cape", name: "Capa da Meia-Noite", desc: "Tecido escuro com pequenos brilhos de ametista.", rarity: "Raro", kind: "gear", slot: "cape", icon: "cloak", from: "Derrote a Rainha das Aranhas", epicBoss: "spider" },
    { id: "aurora-cape", name: "Capa da Aurora", desc: "Panos turquesa que respondem à luz das estrelas.", rarity: "Lendário", kind: "gear", slot: "cape", icon: "cloak", from: "Derrote a Sentinela do Eclipse", epicBoss: "moonGuardian" },
    { id: "moon-staff", name: "Cajado do Luar", desc: "Bastão com gema azul que pulsa quando o herói conjura.", rarity: "Raro", kind: "gear", slot: "hand", icon: "orb", from: "Capítulo I · Estufa", epicChapter: 1 },
    { id: "orchard-torch", name: "Tocha das Brasas", desc: "Uma tocha de chama morna, nunca violenta.", rarity: "Incomum", kind: "gear", slot: "hand", icon: "lantern", from: "Presente inicial", starter: true },
    { id: "ember-aura", name: "Aura de Brasas", desc: "Partículas douradas giram em torno do herói.", rarity: "Épico", kind: "gear", slot: "aura", icon: "star", from: "Capítulo I · Estufa", epicChapter: 1 },
    { id: "aurora-aura", name: "Aura da Aurora", desc: "Círculo esverdeado que pulsa sob a lua.", rarity: "Lendário", kind: "gear", slot: "aura", icon: "orb", from: "Capítulo V · Vigília", epicChapter: 5 },
    { id: "owl-familiar", name: "Corujinha da Meia-Noite", desc: "Companheira lilás que observa as trilhas escuras.", rarity: "Raro", kind: "gear", slot: "companion", icon: "moth", from: "Capítulo II · Bosque", epicChapter: 2 },
    { id: "title-first-step", name: "Semente Valente", desc: "Para quem deu o primeiro passo em uma nova aventura.", rarity: "Comum", kind: "title", icon: "seed", from: "Presente inicial", starter: true },
    { id: "title-wayfarer", name: "Andarilho das Raízes", desc: "Os caminhos do pomar reconhecem seus passos.", rarity: "Incomum", kind: "title", icon: "map", from: "Capítulo I · Estufa", epicChapter: 1 },
    { id: "title-webbreaker", name: "Rompedor de Teias", desc: "A Rainha das Aranhas se lembra de sua coragem.", rarity: "Épico", kind: "title", icon: "star", from: "Vencer a Rainha das Aranhas", epicBoss: "spider" },
    { id: "title-prismkeeper", name: "Coração de Cristal", desc: "Você devolveu a canção aos cristais.", rarity: "Épico", kind: "title", icon: "orb", from: "Vencer o Besouro Prismático", epicBoss: "crystalBoss" },
    { id: "title-storykeeper", name: "Guardião de Histórias", desc: "As memórias guardadas dizem seu nome.", rarity: "Raro", kind: "title", icon: "scroll", from: "Capítulo IV · Pântano", epicChapter: 4 },
    { id: "title-eclipse", name: "Filho do Eclipse", desc: "O céu abriu passagem diante de você.", rarity: "Lendário", kind: "title", icon: "star", from: "Vencer a Sentinela Lunar", epicBoss: "moonGuardian" },
    { id: "title-kingfall", name: "Vencedor da Maldição", desc: "O Rei das Pragas já caiu diante de você.", rarity: "Lendário", kind: "title", icon: "crown-rpg", from: "Vencer o Rei das Pragas", epicBoss: "finalKing" },
    { id: "title-healer", name: "Alma do Pomar", desc: "Escolheu cuidar da memória de todos.", rarity: "Secreto", kind: "title", icon: "heart", from: "Final secreto · A Mesa para Todos", epicEnding: "reconciliar", secret: true },
    { id: "title-survivor", name: "Incansável", desc: "Caminhou e resistiu por dez níveis de experiência.", rarity: "Épico", kind: "title", icon: "armor", from: "Alcance nível 10 de RPG", epicLevel: 10 },
    { id: "title-halloween", name: "Ecos da Meia-Noite", desc: "Conhece as lembranças que habitam as sombras.", rarity: "Secreto", kind: "title", icon: "moth", from: "Conclua O Pomar das Sombras", epicFlag: "halloweenComplete", secret: true },
    { id: "title-defender", name: "Escudo da Colheita", desc: "Nenhuma praga apagará suas árvores.", rarity: "Raro", kind: "title", icon: "armor", from: "Vença o Defesa do Pomar", epicFlag: "defenseSaved" },

    // Títulos
    { id: "title-owner", name: "👑 Dono", desc: "Título dourado reservado ao criador do pomar, @sammanguinha.", rarity: "Exclusivo", kind: "title", icon: "crown", from: "Exclusivo de @sammanguinha", ownerOnly: true },
    { id: "title-liberator", name: "Guardião das Lembranças", desc: "Distinção concedida a quem libertou as histórias do pomar.", rarity: "Lendário", kind: "title", icon: "star", from: "Final da campanha (Libertação)", ending: "release", secret: true },
    { id: "title-vigil", name: "Vigia da Última Árvore", desc: "Distinção concedida a quem selou o pacto de proteção eterna.", rarity: "Lendário", kind: "title", icon: "eye", from: "Final da campanha (Pacto)", ending: "pact", secret: true }
  ];

  // Estado Padrão e Armazenamento
  const rpgFresh = () => ({
    done: {},
    started: ["gate"],
    visited: ["gate"],
    leaves: [],
    hints: {},
    evidence: [],
    items: ["sprout-pin", "none"],
    equipped: { head: "sprout-pin", face: "", body: "", cape: "", hand: "", aura: "", companion: "", title: "" },
    xp: 0,
    area: "gate",
    filter: "all",
    face: "warm",
    fruit: 0, // 0..7 correspondendo a COLS
    seedChoice: "",
    ending: "",
    log: ["Você chegou ao portão sob o brilho da lua de outubro."]
  });

  const rpgAccountKey = () => {
    const handle = (LS.get("sg_handle") || "").toLowerCase().replace(/[^a-z0-9._]/g, "").slice(0, 30);
    return handle ? "u_" + handle : "guest";
  };
  const rpgStorageKeyForUser = () => "sam_orchard_campaign_2026_" + rpgAccountKey();
  
  const rpgReadState = key => {
    let state = rpgFresh();
    try {
      const stored = JSON.parse(LS.get(key) || "null");
      if (stored && typeof stored === "object") {
        state = {
          ...rpgFresh(),
          ...stored,
          done: stored.done && typeof stored.done === "object" ? stored.done : {},
          started: Array.isArray(stored.started) ? stored.started : ["gate"],
          visited: Array.isArray(stored.visited) ? stored.visited : ["gate"],
          leaves: Array.isArray(stored.leaves) ? stored.leaves : [],
          hints: stored.hints && typeof stored.hints === "object" ? stored.hints : {},
          evidence: Array.isArray(stored.evidence) ? stored.evidence : [],
          items: Array.isArray(stored.items) ? stored.items : ["sprout-pin", "none"],
          equipped: stored.equipped && typeof stored.equipped === "object" ? stored.equipped : { head: "sprout-pin" },
          log: Array.isArray(stored.log) ? stored.log : []
        };
      }
    } catch(e) {}
    return state;
  };

  let rpgStorageKey = rpgStorageKeyForUser();
  let rpgState = rpgReadState(rpgStorageKey);
  const rpgSave = () => LS.set(rpgStorageKey, JSON.stringify(rpgState));
  const rpgOwner = () => typeof me !== "undefined" && String(me).replace(/^@/, "").toLowerCase() === "sammanguinha" && !!tok;
  if (!rpgOwner() && rpgState.equipped.title === "title-owner") { rpgState.equipped.title = ""; rpgSave(); }

  const rpgHas = id => !!rpgState.done[id];
  const rpgOwns = id => rpgState.items.includes(id) || id === "none" || (id === "sprout-pin" && !rpgHas("gate"));

  function rpgCanVisit(area) {
    if (area === "gate") return true;
    if (area === "greenhouse") return rpgHas("gate");
    if (area === "trail") return rpgHas("greenhouse");
    if (area === "tree") return rpgHas("trail");
    if (area === "sanctuary") return rpgHas("tree");
    if (area === "heart") return rpgHas("sanctuary");
    return false;
  }

  const rpgEpicAchievements = () => {try{const handle=(localStorage.getItem('sg_handle')||'visitante').toLowerCase();return JSON.parse(localStorage.getItem('sam_rpg_hibrido_v12_'+handle)||'null')?.epic||{}}catch(e){return {}}};
  function rpgCanOwn(item) {
    if (item.starter) return true;
    const ep = rpgEpicAchievements();
    if(item.epicChapter!==undefined)return (ep.chapter||0)>=item.epicChapter;
    if(item.epicLevel!==undefined)return (ep.level||1)>=item.epicLevel;
    if(item.epicBoss)return Array.isArray(ep.defeated)&&ep.defeated.includes(item.epicBoss);
    if(item.epicEnding)return ep.ending===item.epicEnding;
    if(item.epicFlag)return !!ep.flags?.[item.epicFlag];
    if (item.ownerOnly) return typeof me !== "undefined" && String(me).replace(/^@/, "").toLowerCase() === "sammanguinha" && !!tok;
    if (item.id === "none" || item.id === "sprout-pin") return true;
    if (item.quest) return rpgHas(item.quest);
    if (item.branch) return rpgHas("greenhouse") && rpgState.seedChoice === item.branch;
    if (item.ending) return rpgHas("heart") && rpgState.ending === item.ending;
    if (item.serverHat) {
      const h = typeof HATS !== "undefined" ? HATS[item.serverHat] : null;
      if (h) {
        const lvl = typeof prof !== "undefined" && prof ? (typeof lvlOf === "function" ? lvlOf(prof.xp) : 1) : 1;
        return h[3] ? !!(typeof QS !== "undefined" && QS && QS.goals && QS.goals.some(g => g.id === h[3] && g.done)) : lvl >= h[1];
      }
    }
    return false;
  }

  function rpgPushUnique(arr, val) { if (!arr.includes(val)) arr.push(val); }
  function rpgAwardItems(items) {
    items.forEach(id => {
      rpgPushUnique(rpgState.items, id);
    });
  }

  function rpgComplete(id) {
    const quest = rpgQuestData.find(x => x.id === id);
    if (!quest || rpgHas(id) || !rpgCanVisit(quest.area)) return;
    
    rpgState.done[id] = true;
    rpgState.xp += quest.xp;
    rpgPushUnique(rpgState.started, id);
    rpgAwardItems(quest.reward);
    
    if (id === "gate") rpgPushUnique(rpgState.evidence, "gate-rune");
    if (id === "greenhouse") rpgPushUnique(rpgState.evidence, "glass-record");
    if (id === "trail") rpgPushUnique(rpgState.evidence, "map-fragment");
    if (id === "tree") rpgPushUnique(rpgState.evidence, "root-sigil");
    if (id === "sanctuary") rpgPushUnique(rpgState.evidence, "memory-page");
    if (id === "heart") {
      const rew = rpgState.ending === "release" ? ["dawn-cape", "title-liberator"] : ["pact-crown", "title-vigil"];
      rpgAwardItems(rew);
      rpgState.equipped.title = rpgState.ending === "release" ? "title-liberator" : "title-vigil";
    }

    rpgSave();
    if (typeof toast === "function") toast("✦ " + quest.title + " concluída! +" + quest.xp + " XP da campanha", 4500);
    rpgRenderAll();
  }

  // =========================================================================
  // CONTROLADOR DO MAPA INTERATIVO & CENAS DE INVESTIGAÇÃO
  // =========================================================================
  function rpgMapRender() {
    const completeCount = Object.keys(rpgState.done).length;
    const progressEl = $("rpgProgressCounter");
    if (progressEl) progressEl.textContent = completeCount + " / 6 Marcos Desvendados";

    const chapterEl = $("rpgChapterTitle");
    const activeQuest = rpgQuestData.find(q => q.area === rpgState.area);
    if (chapterEl && activeQuest) chapterEl.textContent = activeQuest.chapter + " • " + activeQuest.title;

    // Atualiza Nós do Mapa
    rpgAreas.forEach(area => {
      const node = $("node-" + area.id);
      if (!node) return;
      
      const isCanVisit = rpgCanVisit(area.id);
      const isDone = rpgHas(area.id);
      const isActive = rpgState.area === area.id;

      node.classList.toggle("is-active", isActive);
      node.classList.toggle("is-done", isDone);
      node.classList.toggle("is-locked", !isCanVisit && !isDone);
    });

    // Atualiza Linhas Místicas de Conexão
    const leyLines = [
      { id: "leyLine1", ok: rpgHas("gate") },
      { id: "leyLine2", ok: rpgHas("greenhouse") },
      { id: "leyLine3", ok: rpgHas("trail") },
      { id: "leyLine4", ok: rpgHas("tree") },
      { id: "leyLine5", ok: rpgHas("sanctuary") }
    ];
    leyLines.forEach(l => {
      const el = $(l.id);
      if (el) el.classList.toggle("is-active", l.ok);
    });
  }

  function rpgSceneRender() {
    const area = rpgAreas.find(a => a.id === rpgState.area) || rpgAreas[0];
    const quest = rpgQuestData.find(q => q.area === area.id);
    const isDone = quest && rpgHas(quest.id);

    const titleEl = $("sceneTitle");
    if (titleEl) titleEl.textContent = area.name;

    const chapterEl = $("sceneChapter");
    if (chapterEl && quest) chapterEl.textContent = quest.chapter + " • " + quest.title;

    const badgeEl = $("sceneStatusBadge");
    if (badgeEl) {
      badgeEl.textContent = isDone ? "REGISTRADO" : "EM INVESTIGAÇÃO";
      badgeEl.dataset.rarity = isDone ? "Épico" : "Raro";
    }

    const narrativeEl = $("sceneNarrativeText");
    const stories = {
      gate: "O portão de ferro estala contra o vento noturno. As lanternas de bronze ao longo do muro leste estão apagadas, como se uma respiração gélida as tivesse soprado juntas. Uma inscrição antiga sob a fechadura pede que você aponte a chave para a direção de onde sopra o vento.",
      greenhouse: "A estufa tem vidros estilhaçados por raízes que subiram pelo chão. Entre frascos cobertos de musgo, repousam sementes que nunca viram o sol: uma delas é a semente lunar, que brilha quando a noite atinge o ápice. Ela aguarda sua decisão.",
      trail: "O chão da trilha é coberto de folhas mortas que estalam sob os passos. Três bilhetes foram presos nos troncos pela Raposa de Bruma. Entre eles, uma mentira se esconde para desorientar quem viaja sem atenção.",
      tree: "O tronco da Árvore Ancestral é colossal, retorcido como um monumento erguido pela própria terra. Runas arcanas foram entalhadas na casca, guardando o nome esquecido de quem plantou o primeiro galho.",
      sanctuary: "Uma câmara subterrânea escondida entre as raízes mais profundas. Arquivos antigos registram a história de cada visitante do pomar desde tempos imemoriais. Um mecanismo de casca tranca a gaveta central.",
      heart: "O centro pulsante da maldição do pomar. Aqui as águas das raízes encontram a névoa noturna. Chegou a hora de decidir se o segredo deve ser guardado eternamente ou se as lembranças voltam ao povo do pomar."
    };
    if (narrativeEl) narrativeEl.textContent = stories[area.id] || "";

    const npcNameEl = $("sceneNpcName");
    const npcQuoteEl = $("sceneNpcQuote");
    const npcs = {
      gate: { name: "Bruma, a Raposa Espectral", quote: "O vento soprou para um dos lados antes das chamas morrerem... Lembre-se para onde o sol nasce." },
      greenhouse: { name: "A Colecionadora de Sementes", quote: "A semente lunar não precisa de sol. Se plantada aqui, iluminará a trilha; se guardada, você manterá viva a lembrança intacta." },
      trail: { name: "O Vigia Noturno", quote: "Três depoimentos foram deixados na casca. Apenas quem observa a ordem dos fatos sabe qual deles não faz sentido." },
      tree: { name: "Voz das Raízes", quote: "O que sustenta o fruto mais doce não fica exposto às folhas... O que fica escondido sob a terra?" },
      sanctuary: { name: "A Guardiã do Arquivo", quote: "A fruta só atinge a plenitude quando protegida por sua camada externa. Diga a palavra protetora." },
      heart: { name: "Espírito do Pomar Ancestral", quote: "Dois caminhos restam antes que a noite termine. Qual será a sua colheita final?" }
    };
    if (npcNameEl && npcs[area.id]) npcNameEl.textContent = npcs[area.id].name;
    if (npcQuoteEl && npcs[area.id]) npcQuoteEl.textContent = '"' + npcs[area.id].quote + '"';

    // Injeção do Componente de Interação
    const box = $("sceneInteractionBox");
    if (!box) return;

    if (area.id === "gate") {
      box.innerHTML = isDone 
        ? `<p style="color:var(--spectral);font-weight:700">✦ O portão foi aberto e a Runa do Leste descansa com você.</p>`
        : `<h4>O Enigma do Portão Leste</h4>
           <p>Para qual direção cardeal o primeiro vento da noite conduziu a fumaça das lanternas?</p>
           <form class="rpg-answer-row" id="formGate">
             <input type="text" id="ansGate" maxlength="10" placeholder="Direção (ex: LESTE)" required>
             <button type="submit" class="rpg-action-btn">Destrancar Portão</button>
           </form>`;
    } else if (area.id === "greenhouse") {
      if (isDone) {
        box.innerHTML = `<p style="color:var(--spectral);font-weight:700">✦ Decisão tomada: ${rpgState.seedChoice === "plant" ? "A semente foi plantada e a Flor de Vidro floresceu!" : "A semente lunar foi guardada como memorial."}</p>`;
      } else {
        box.innerHTML = `<h4>A Escolha da Semente Lunar</h4>
           <p>Como você deseja agir com a semente que sobreviveu à escuridão da estufa?</p>
           <div class="rpg-choice-grid">
             <button type="button" class="rpg-choice" data-seed-act="plant">
               <b>Plantar no Solo de Vidro</b>
               <small>Permitir que floresça e gere a Flor de Vidro bioluminescente</small>
             </button>
             <button type="button" class="rpg-choice" data-seed-act="keep">
               <b>Guardar no relicário</b>
               <small>Preservar a semente lunar intocada como testemunha</small>
             </button>
           </div>`;
      }
    } else if (area.id === "trail") {
      if (isDone) {
        box.innerHTML = `<p style="color:var(--spectral);font-weight:700">✦ A mentira foi desmascarada e o caminho até a Árvore Ancestral está desimpedido.</p>`;
      } else {
        const clues = [
          "1. A fechadura abriu com a palavra LESTE.",
          "2. As raízes apontam para o topo do céu.",
          "3. A semente lunar repousava sob a estufa."
        ];
        box.innerHTML = `<h4>Três Folhas, Uma Mentira</h4>
           <p>Examine as três afirmações deixadas na trilha e clique naquela que é FALSA:</p>
           <div class="rpg-choice-grid">
             ${clues.map((c, i) => `<button type="button" class="rpg-choice" data-lie-index="${i}"><b>${c}</b></button>`).join("")}
           </div>`;
      }
    } else if (area.id === "tree") {
      box.innerHTML = isDone
        ? `<p style="color:var(--spectral);font-weight:700">✦ A inscrição foi compreendida: a RAIZ sustenta o pomar.</p>`
        : `<h4>A Inscrição Oculta na Casca</h4>
           <p>Qual parte vital da mangueira permanece oculta na terra sustentando toda a copa e frutos?</p>
           <form class="rpg-answer-row" id="formTree">
             <input type="text" id="ansTree" maxlength="12" placeholder="O que falta sob a terra?" required>
             <button type="submit" class="rpg-action-btn">Decifrar Runas</button>
           </form>`;
    } else if (area.id === "sanctuary") {
      box.innerHTML = isDone
        ? `<p style="color:var(--spectral);font-weight:700">✦ O Santuário foi aberto e o Vagalume-Guia agora acompanha seus passos.</p>`
        : `<h4>O Mecanismo da Gaveta Secreta</h4>
           <p>A palavra para abrir a gaveta da história é a proteção externa de toda manga. Tem cinco letras e começa com C:</p>
           <form class="rpg-answer-row" id="formSanctuary">
             <input type="text" id="ansSanctuary" maxlength="12" placeholder="Palavra de 5 letras..." required>
             <button type="submit" class="rpg-action-btn">Abrir Arquivo</button>
           </form>`;
    } else if (area.id === "heart") {
      if (isDone) {
        box.innerHTML = `<p style="color:var(--amber);font-weight:700">✦ O destino do Pomar foi selado: ${rpgState.ending === "release" ? "As memórias foram libertadas para todo o povo do pomar!" : "O pacto foi firmado e você vigia a última árvore."}</p>`;
      } else {
        box.innerHTML = `<h4>A Escolha do Coração do Pomar</h4>
           <p>Diante das raízes ancestrais, escolha como encerrar a campanha:</p>
           <div class="rpg-choice-grid">
             <button type="button" class="rpg-choice" data-ending-act="release">
               <b style="color:var(--spectral)">Libertar as Lembranças</b>
               <small>Compartilhar a história e receber a Capa da Primeira Manhã e o título Guardião das Lembranças.</small>
             </button>
             <button type="button" class="rpg-choice" data-ending-act="pact">
               <b style="color:var(--amber)">Firmar o Pacto do Vigia</b>
               <small>Proteger o segredo e receber a Coroa do Vigia e o título Vigia da Última Árvore.</small>
             </button>
           </div>`;
      }
    }
  }

  // =========================================================================
  // CONTROLADOR DO GUARDA-ROUPA & PERSONAGEM UNIFICADO (#profDlg)
  // =========================================================================
  let wardrobeFilter = "all";

  function dollRender() {
    // 1. Cor da Casca da Fruta (corpo)
    const fruitIdx = typeof draft !== "undefined" && draft.c !== undefined ? draft.c : (rpgState.fruit || 0);
    const bodyColor = (typeof COLS !== "undefined" && COLS[fruitIdx]) ? COLS[fruitIdx][1] : "#f5a623";
    const bodyEl = $("dollFruitBody");
    if (bodyEl) bodyEl.setAttribute("fill", bodyColor);

    // 2. Expressão Facial
    const faceId = rpgState.face || "warm";
    const mouth = $("dollMouth");
    const eyeL = $("dollEyeL");
    const eyeR = $("dollEyeR");
    if (mouth && eyeL && eyeR) {
      if (faceId === "warm") {
        mouth.setAttribute("d", "M46 66 Q50 71 54 66");
        eyeL.setAttribute("r", "3.5"); eyeR.setAttribute("r", "3.5");
        eyeL.setAttribute("fill", "#241408"); eyeR.setAttribute("fill", "#241408");
      } else if (faceId === "calm") {
        mouth.setAttribute("d", "M47 67 L53 67");
        eyeL.setAttribute("r", "2.8"); eyeR.setAttribute("r", "2.8");
        eyeL.setAttribute("fill", "#241408"); eyeR.setAttribute("fill", "#241408");
      } else if (faceId === "scared") {
        mouth.setAttribute("d", "M47 70 Q50 65 53 70");
        eyeL.setAttribute("r", "4.5"); eyeR.setAttribute("r", "4.5");
        eyeL.setAttribute("fill", "#241408"); eyeR.setAttribute("fill", "#241408");
      } else if (faceId === "spirit") {
        mouth.setAttribute("d", "M47 67 Q50 69 53 67");
        eyeL.setAttribute("r", "4"); eyeR.setAttribute("r", "4");
        eyeL.setAttribute("fill", "#38ef7d"); eyeR.setAttribute("fill", "#38ef7d");
      } else if(faceId==='joyful'){mouth.setAttribute('d','M43 64 Q50 79 57 64');eyeL.setAttribute('r','3.6');eyeR.setAttribute('r','3.6');eyeL.setAttribute('fill','#241408');eyeR.setAttribute('fill','#241408');
      } else if(faceId==='sleepy'){mouth.setAttribute('d','M46 68 Q50 71 54 68');eyeL.setAttribute('r','1.8');eyeR.setAttribute('r','1.8');eyeL.setAttribute('fill','#41352b');eyeR.setAttribute('fill','#41352b');
      } else if(faceId==='fierce'){mouth.setAttribute('d','M45 69 L54 68');eyeL.setAttribute('r','2.8');eyeR.setAttribute('r','2.8');eyeL.setAttribute('fill','#cc6532');eyeR.setAttribute('fill','#cc6532');
      } else if(faceId==='sly'){mouth.setAttribute('d','M44 67 Q53 72 56 63');eyeL.setAttribute('r','3');eyeR.setAttribute('r','4');eyeL.setAttribute('fill','#241408');eyeR.setAttribute('fill','#241408');
      } else if (faceId === "brave") {
        mouth.setAttribute("d", "M46 68 Q50 67 54 65");
        eyeL.setAttribute("r", "3.2"); eyeR.setAttribute("r", "3.2");
        eyeL.setAttribute("fill", "#241408"); eyeR.setAttribute("fill", "#241408");
      }
    }

    // 3. Camada de Chapéu (SVG)
    const chosenHat = rpgItems.find(x=>x.id===rpgState.equipped.head);
    const hatId=chosenHat&&!chosenHat.serverHat?chosenHat.id:(typeof draft!=="undefined"&&draft.h?draft.h:(rpgState.equipped.head||"sprout-pin"));
    const hatShape = $("hatShape");
    if (hatShape) {
      if (hatId === "none") {
        hatShape.setAttribute("fill", "none");
        hatShape.setAttribute("d", "M0 0");
      } else if(hatId==="astral-beret"||hatId==="guardian-helm"||hatId==="eclipse-horns"||hatId==="sunflower-band"){const shapes={ "astral-beret":["M21 28 Q22 13 45 13 Q76 8 78 29 L71 33 L25 33 Z","#3c5e92"],"guardian-helm":["M28 35 L29 21 L43 15 L58 15 L72 21 L72 35 Z M47 15 L50 5 L53 15 Z","#8aa49b"],"eclipse-horns":["M23 36 Q17 17 22 3 L38 29 L50 33 L64 29 L79 3 Q83 18 77 36 Z","#8573cb"],"sunflower-band":["M27 32 Q50 24 73 32 L73 36 Q50 27 27 36 Z M45 27 L50 18 L55 27 Z","#e8b44a"]};const shape=shapes[hatId];hatShape.setAttribute("d",shape[0]);hatShape.setAttribute("fill",shape[1]);hatShape.setAttribute("stroke","#362b35");
      } else if (hatId === "starlit-circlet" || hatId === "storm-crown") {hatShape.setAttribute('d','M25 32 L33 25 L42 29 L50 18 L58 29 L67 25 L75 32 Z M25 33 L75 33 L75 37 L25 37 Z');hatShape.setAttribute('fill',hatId==='storm-crown'?'#78e1f0':'#efc371');hatShape.setAttribute('stroke','#75517e');
      } else if(hatId==='forest-hood'||hatId==='mushroom-cap'){hatShape.setAttribute('d',hatId==='mushroom-cap'?'M16 32 Q50 2 84 32 L75 38 L25 38 Z':'M29 27 Q50 9 71 27 L71 43 L29 43 Z');hatShape.setAttribute('fill',hatId==='mushroom-cap'?'#795394':'#42634b');hatShape.setAttribute('stroke','#312442');
      } else if (hatId === "sprout-pin") {
        hatShape.setAttribute("d", "M50 20 C46 14 48 8 52 6 C54 10 52 16 50 20 Z");
        hatShape.setAttribute("fill", "#cd7f32");
        hatShape.setAttribute("stroke", "#8c4f1c");
      } else if (hatId === "witch-hat" || hatId === "wizard") {
        hatShape.setAttribute("d", "M24 34 L76 34 L66 30 L55 4 L45 4 L34 30 Z M18 34 C30 31 70 31 82 34 C72 38 28 38 18 34 Z");
        hatShape.setAttribute("fill", "#281b38");
        hatShape.setAttribute("stroke", "#5e3c84");
      } else if (hatId === "ghost-hood" || hatId === "capuz") {
        hatShape.setAttribute("d", "M30 25 C40 12 60 12 70 25 C74 40 70 50 68 56 C64 45 36 45 32 56 C30 50 26 40 30 25 Z");
        hatShape.setAttribute("fill", "#382c47");
        hatShape.setAttribute("stroke", "#6a5286");
      } else if (hatId === "pact-crown" || hatId === "crown") {
        hatShape.setAttribute("d", "M28 32 L36 20 L50 26 L64 20 L72 32 Z M26 33 L74 33 L72 37 L28 37 Z");
        hatShape.setAttribute("fill", "#f5a623");
        hatShape.setAttribute("stroke", "#8c5600");
      } else {
        // Chapéu padrão / estilizado
        hatShape.setAttribute("d", "M24 32 C36 22 64 22 76 32 Z");
        hatShape.setAttribute("fill", "#5a3a20");
        hatShape.setAttribute("stroke", "#3a200a");
      }
    }

    // 4. Camada de Máscara
    const maskLayer = $("layerMask");
    if (maskLayer) {
      maskLayer.setAttribute('opacity',rpgState.equipped.face?'1':'0');const mp=$('maskPath');if(mp){mp.setAttribute('fill',rpgState.equipped.face==='star-spectacles'?'#ab875c':rpgState.equipped.face==='prism-visor'?'#60abc5':rpgState.equipped.face==='forest-goggles'?'#61905b':rpgState.equipped.face==='heart-glasses'?'#eb7898':rpgState.equipped.face==='raven-mask'?'#252d4b':'#6a4c28');mp.setAttribute('opacity',rpgState.equipped.face==='star-spectacles'?'0.72':'1')}
    }

    // 5. Camada de Armadura de Raízes
    const bodyLayer = $("layerBody");
    if (bodyLayer) {
      bodyLayer.setAttribute('opacity',rpgState.equipped.body?'1':'0');const bodyPath=$('bodyArmorPath');if(bodyPath)bodyPath.setAttribute('fill',rpgState.equipped.body==='prism-armor'?'#536fa8':rpgState.equipped.body==='amber-coat'?'#b47d38':rpgState.equipped.body==='lunar-vest'?'#9baade':rpgState.equipped.body==='knight-bark'?'#567350':'#4a2f18');
    }

    // 6. Camada de Capa
    const capeLayer = $("capePath");
    if (capeLayer) {
      const capeId = rpgState.equipped.cape;
      if (capeId === "leaf-cape") {
        capeLayer.setAttribute("opacity", "1");
        capeLayer.setAttribute("fill", "#8c441c");
      } else if(['petal-cloak','galaxy-cloak','ember-mantle'].includes(capeId)){capeLayer.setAttribute('opacity','.9');capeLayer.setAttribute('fill',{'petal-cloak':'#c47ca1','galaxy-cloak':'#2e467d','ember-mantle':'#ad4e36'}[capeId]);
      } else if(capeId==='night-cape'||capeId==='aurora-cape'){capeLayer.setAttribute('opacity','1');capeLayer.setAttribute('fill',capeId==='aurora-cape'?'#349c98':'#34285b');
      } else if (capeId === "secret-veil") {
        capeLayer.setAttribute("opacity", "0.85");
        capeLayer.setAttribute("fill", "#4a286a");
      } else if (capeId === "dawn-cape") {
        capeLayer.setAttribute("opacity", "0.95");
        capeLayer.setAttribute("fill", "#c47a22");
      } else {
        capeLayer.setAttribute("opacity", "0");
      }
    }

    // 7. Aura Animada
    const auraEl = $("dollAura");
    if (auraEl) {
      auraEl.className = "doll-aura";
      if (rpgState.equipped.aura === "leaf-aura") auraEl.classList.add("leaves");
      else if (rpgState.equipped.aura === "secret-veil"||rpgState.equipped.aura==='aurora-aura') auraEl.classList.add('veil');else if(rpgState.equipped.aura==='ember-aura')auraEl.classList.add('spectral');
      else if(rpgState.equipped.aura==='rainbow-aura')auraEl.classList.add('veil');else if(rpgState.equipped.aura==='moonfire-aura')auraEl.classList.add('spectral');else if (rpgState.equipped.cape === "dawn-cape") auraEl.classList.add("spectral");
    }

    // 8. Companheiro Familiar
    const companionEl = $("dollCompanion");
    if (companionEl) {
      companionEl.style.display = rpgState.equipped.companion ? 'block' : 'none';companionEl.style.color=rpgState.equipped.companion==='owl-familiar'?'#aaa4ff':rpgState.equipped.companion==='shadow-fox'?'#ac94ff':rpgState.equipped.companion==='butterfly-buddy'?'#f5a5e7':'#ffdc83';
    }

    // 8b. O item segurado agora aparece de verdade no personagem.
    const handLayer=$('layerHand');if(handLayer){handLayer.setAttribute('opacity',rpgState.equipped.hand?'1':'0');const hand=$('handItemG');if(hand){const id=rpgState.equipped.hand||'';hand.querySelector('rect')?.setAttribute('fill',id==='moon-staff'?'#85d6ed':id==='orchard-torch'?'#ffb953':id==='jade-wand'?'#54b883':id==='mango-banner'?'#ffe381':id==='crystal-lamp'?'#9e88f2':'#e9c66e');}}
    // 9. Banner de Título
    const titleBanner = $("dollTitleBanner");
    if (titleBanner) {
      const activeTitle = rpgItems.find(x => x.id === rpgState.equipped.title);
      const isOwnerTitle = activeTitle && activeTitle.id === "title-owner" && rpgOwner();
      titleBanner.textContent = isOwnerTitle ? "👑 Dono" : activeTitle && activeTitle.id !== "title-owner" ? activeTitle.name : "Explorador do Pomar";
      titleBanner.classList.toggle("owner-title", !!isOwnerTitle);
    }

    // 10. Atualiza Canvas de Pixel Art em paralelo
    if (typeof drawAv === "function" && $("pAv")) {
      drawAv($("pAv"), typeof draft !== "undefined" ? draft : { c: fruitIdx, h: hatId });
    }
  }

  function wardrobeRender() {
    const grid = $("inventoryGrid");
    if (!grid) return;

    // Filtra itens conforme aba ativa
    const term=($("sm20WardrobeSearch")?.value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const onlyOwned=!!$("sm20WardrobeOwned")?.checked;
    const filtered = rpgItems.filter(item => {
      if(onlyOwned&&!rpgCanOwn(item))return false;
      if(term&&![item.name,item.desc,item.rarity,item.from].join(" ").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().includes(term))return false;
      if (wardrobeFilter === "all") return true;
      if (wardrobeFilter === "head") return item.slot === "head";
      if (wardrobeFilter === "face") return item.slot === "face";
      if (wardrobeFilter === "body") return item.slot === "body" || item.slot === "cape";
      if (wardrobeFilter === "hand") return item.slot === "hand" || item.kind === "relic" || item.kind === "record";
      if (wardrobeFilter === "aura") return item.slot === "aura" || item.slot === "companion";
      if (wardrobeFilter === "title") return item.kind === "title";
      return true;
    });

    const visible=filtered.filter(item=>!item.ownerOnly||rpgOwner());
    const stat=$("sm20WardrobeStat");if(stat)stat.textContent=visible.filter(rpgCanOwn).length+" desbloqueados de "+visible.length+" visíveis";
    grid.innerHTML = visible.map(item => {
      const isOwned = rpgCanOwn(item);
      const isEquipped = item.slot ? rpgState.equipped[item.slot] === item.id : (item.kind === "title" && rpgState.equipped.title === item.id);
      const icon = item.icon || "star";

      let actionButtons = "";
      if (isOwned) {
        if (item.slot || item.kind === "title") {
          actionButtons = `
            <button type="button" class="btn-item try" data-try-item="${item.id}">Experimentar</button>
            <button type="button" class="btn-item ${isEquipped ? "unequip" : "equip"}" data-toggle-equip="${item.id}">
              ${isEquipped ? "Desequipar" : "Equipar"}
            </button>
          `;
        } else {
          actionButtons = `<span style="font-size:0.75rem;color:var(--muted)">No relicário</span>`;
        }
      } else {
        actionButtons = `<span style="font-size:0.72rem;color:var(--muted)">Bloqueado • ${rpgEsc(item.from)}</span>`;
      }

      return `
        <article class="item-card ${isOwned ? "is-owned" : "is-locked"} ${isEquipped ? "is-equipped" : ""}">
          <div class="item-icon-box">
            <svg class="ic"><use href="#rpg-icon-${icon}"/></svg>
          </div>
          <div class="item-info">
            <h4 class="item-name">${rpgEsc(item.name)}</h4>
            <div class="item-badges">
              <span class="rarity-pill" data-rarity="${rpgEsc(item.rarity)}">${rpgEsc(item.rarity)}</span>
              ${item.slot ? `<span style="font-size:0.68rem;color:var(--faint)">${rpgEsc(item.slot)}</span>` : ""}
            </div>
            <p class="item-desc">${rpgEsc(item.desc)}</p>
          </div>
          <div class="item-actions">${actionButtons}</div>
        </article>
      `;
    }).join("")||'<p class="state">Nenhum item encontrado. Tente outro nome ou filtro.</p>';

    // Atualiza Seletores de Expressão
    document.querySelectorAll(".expression-btn").forEach(btn => {
      btn.classList.toggle("on", btn.dataset.face === rpgState.face);
    });

    // Atualiza Seletores de Cor da Manga
    const swatches = $("colors");
    if (swatches && typeof COLS !== "undefined") {
      const curC = typeof draft !== "undefined" ? draft.c : 0;
      swatches.innerHTML = COLS.map((c, i) => `
        <button type="button" class="swatch-btn ${curC === i ? "on" : ""}" data-color-idx="${i}" style="background:${c[1]}" title="${c[0]}" aria-label="${c[0]}"></button>
      `).join("");
    }

    // Renderiza Boneca SVG
    dollRender();
  }

  function rpgRenderAll() {
    rpgMapRender();
    rpgSceneRender();
    wardrobeRender();
  }

  // =========================================================================
  // LISTENERS E EVENTOS GLOBAIS DO RPG E GUARDA-ROUPA
  // =========================================================================
  $("sm20WardrobeSearch")?.addEventListener("input",wardrobeRender);
  $("sm20WardrobeOwned")?.addEventListener("change",wardrobeRender);
  document.addEventListener("click", e => {
    // 1. Clique nos Nós do Mapa
    const node = e.target.closest("[data-rpg-area]");
    if (node) {
      const areaId = node.dataset.rpgArea;
      if (rpgCanVisit(areaId)) {
        rpgState.area = areaId;
        rpgPushUnique(rpgState.visited, areaId);
        rpgSave();
        rpgMapRender();
        rpgSceneRender();
      } else {
        if (typeof toast === "function") toast("Esta região está bloqueada pela névoa. Conclua os marcos anteriores.", 3500);
      }
      return;
    }

    // 2. Abas de Categoria do Guarda-Roupa
    const wtab = e.target.closest("[data-wtab]");
    if (wtab) {
      (wtab.parentElement||document).querySelectorAll(".wardrobe-tab").forEach(t => t.classList.remove("on"));
      wtab.classList.add("on");
      wardrobeFilter = wtab.dataset.wtab;
      wardrobeRender();
      return;
    }

    // 3. Seleção de Expressão
    const faceBtn = e.target.closest("[data-face]");
    if (faceBtn) {
      rpgState.face = faceBtn.dataset.face;
      rpgSave();
      wardrobeRender();
      return;
    }

    // 4. Seleção de Cor
    const colorBtn = e.target.closest("[data-color-idx]");
    if (colorBtn) {
      const idx = Number(colorBtn.dataset.colorIdx);
      if (typeof draft !== "undefined") draft.c = idx;
      rpgState.fruit = idx;
      rpgSave();
      wardrobeRender();
      return;
    }

    // 5. Experimentar Item (Preview)
    const tryBtn = e.target.closest("[data-try-item]");
    if (tryBtn) {
      const item = rpgItems.find(x => x.id === tryBtn.dataset.tryItem);
      if (item && item.slot) {
        rpgState.equipped[item.slot] = item.id;
        if (item.serverHat && typeof draft !== "undefined") draft.h = item.serverHat;
        dollRender();
        if (typeof toast === "function") toast("Experimentando " + item.name + ". Salve o visual para confirmar.", 3000);
      }
      return;
    }

    // 6. Equipar / Desequipar Item
    const equipBtn = e.target.closest("[data-toggle-equip]");
    if (equipBtn) {
      const item = rpgItems.find(x => x.id === equipBtn.dataset.toggleEquip);
      if (item && rpgCanOwn(item)) {
        if (item.slot) {
          const isEquipped = rpgState.equipped[item.slot] === item.id;
          rpgState.equipped[item.slot] = isEquipped ? "" : item.id;
          if (item.serverHat && typeof draft !== "undefined") {
            draft.h = isEquipped ? "none" : item.serverHat;
          }
        } else if (item.kind === "title") {
          const isEquipped = rpgState.equipped.title === item.id;
          rpgState.equipped.title = isEquipped ? "" : item.id;
        }
        rpgSave();
        dollRender();
        wardrobeRender();
        if (typeof toast === "function") toast(rpgState.equipped[item.slot || "title"] === item.id ? "Equipado: " + item.name : "Desequipado.", 2500);
      }
      return;
    }

    // 7. Enigma da Estufa: Escolha da Semente
    const seedAct = e.target.closest("[data-seed-act]");
    if (seedAct) {
      rpgState.seedChoice = seedAct.dataset.seedAct;
      rpgComplete("greenhouse");
      return;
    }

    // 8. Enigma da Trilha: Detecção de Mentira
    const lieBtn = e.target.closest("[data-lie-index]");
    if (lieBtn) {
      const idx = Number(lieBtn.dataset.lieIndex);
      if (idx === 1) { // A mentira é a frase 2 (raízes para o céu)
        rpgComplete("trail");
      } else {
        if (typeof toast === "function") toast("Essa afirmação é verdadeira! Olhe com atenção os bilhetes.", 3500);
      }
      return;
    }

    // 9. Clímax do Coração: Escolha Final
    const endAct = e.target.closest("[data-ending-act]");
    if (endAct) {
      rpgState.ending = endAct.dataset.endingAct;
      rpgComplete("heart");
      return;
    }

    // 10. Links data-go
    const goBtn = e.target.closest("[data-go]");
    if (goBtn) {
      const target = goBtn.dataset.go;
      if (typeof showPane === "function") showPane(target);
      return;
    }

    // 11. Botão Adentrar Pomar (Hero)
    if (e.target.closest("#eventLaunch")) {
      if (typeof showPane === "function") showPane("eventDlg");
      return;
    }
  });

  // Submissão de Formulários de Enigmas
  document.addEventListener("submit", e => {
    // Portão: LESTE
    if (e.target.id === "formGate") {
      e.preventDefault();
      const val = $("ansGate").value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toUpperCase();
      if (val === "LESTE") {
        rpgComplete("gate");
      } else {
        if (typeof toast === "function") toast("O portão continua trancado. O vento sopra para o oriente (LESTE)...", 4000);
      }
      return;
    }

    // Árvore: RAIZ
    if (e.target.id === "formTree") {
      e.preventDefault();
      const val = $("ansTree").value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toUpperCase();
      if (val === "RAIZ" || val === "RAIZES") {
        rpgComplete("tree");
      } else {
        if (typeof toast === "function") toast("A casca não reagiu. Lembre-se do que fica sob a terra (RAIZ)...", 4000);
      }
      return;
    }

    // Santuário: CASCA
    if (e.target.id === "formSanctuary") {
      e.preventDefault();
      const val = $("ansSanctuary").value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toUpperCase();
      if (val === "CASCA") {
        rpgComplete("sanctuary");
      } else {
        if (typeof toast === "function") toast("A gaveta permanece trancada. É a proteção da fruta (CASCA)...", 4000);
      }
      return;
    }
  });

  // Salvar Visual Oficial (Integrado com Supabase set_avatar + LocalStorage)
  const saveBtn = $("saveAv");
  if (saveBtn) {
    saveBtn.onclick = async () => {
      saveBtn.disabled = true;
      try {
        if (typeof me !== "undefined" && me && typeof tok !== "undefined" && tok && typeof rpc === "function") {
          const res = await rpc("set_avatar", {
            p_handle: me,
            p_token: tok,
            p_avatar: typeof draft !== "undefined" ? draft : { c: rpgState.fruit || 0, h: rpgState.equipped.head || "none" }
          });
          if (typeof setProf === "function") setProf(res);
        }
        rpgSave();
        if (typeof toast === "function") toast("✦ Visual oficial e equipamentos salvos com sucesso!", 4500);
      } catch(err) {
        rpgSave();
        if (typeof toast === "function") toast("✦ Visual salvo localmente no aparelho!", 4000);
      } finally {
        saveBtn.disabled = false;
        wardrobeRender();
      }
    };
  }

  // Intercepta showPane para re-renderizar quando as abas abrem
  const origShowPane = window.showPane;
  window.showPane = function(id) {
    if (typeof origShowPane === "function") origShowPane(id);
    if (id === "eventDlg") {
      rpgMapRender();
      rpgSceneRender();
    }
    if (id === "profDlg") {
      wardrobeRender();
    }
  };

  // Inicialização Inicial
  rpgRenderAll();
})();
