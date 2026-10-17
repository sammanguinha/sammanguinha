/* A Crônica da Primeira Mangueira — expansão V13. Integração local com o mundo V12. */
const EPIC_CLASSES={
 guardiao:{name:'Guardião das Raízes',element:'nature',stats:{vig:5,for:4,int:2,agi:2},hp:67,mp:7,skill:'Raízes Enredantes',skillInfo:'Natureza · dano e defesa reforçada',description:'Proteção, resistência e raízes que enfraquecem ataques.'},
 arcanista:{name:'Arcanista da Lua',element:'light',stats:{vig:2,for:2,int:6,agi:3},hp:55,mp:13,skill:'Clarão Lunar',skillInfo:'Luz · dano mágico e quebra de maldições',description:'Magia luminosa que causa dano extra contra sombras.'},
 rastreador:{name:'Rastreador das Brasas',element:'fire',stats:{vig:3,for:5,int:2,agi:5},hp:60,mp:9,skill:'Flecha de Brasa',skillInfo:'Fogo · ataque veloz com queimadura',description:'Velocidade e golpes críticos; queimaduras contra plantas.'}
};
const EPIC_ARTIFACTS={
 escudo_colheita:{name:'Escudo da Colheita',rarity:'Raro',element:'nature',desc:'Conquistado vencendo o Defesa do Pomar. Reduz 2 pontos do dano recebido.',effect:'harvest'},
 selo_sombras:{name:'Selo das Sete Sombras',rarity:'Lendário',element:'shadow',desc:'A aventura de Halloween aumenta seu poder contra inimigos sombrios em 15%.',effect:'halloween'},
 semente_guardia:{name:'Semente do Primeiro Pomar',rarity:'Comum',element:'nature',desc:'Aumenta a vida máxima em 12 e restaura 2 HP no início do combate.',effect:'vigor'},
 amuleto_bento:{name:'Amuleto das Raízes',rarity:'Raro',element:'nature',desc:'Reduz em 3 o dano recebido em combate.',effect:'defense'},
 brasa_eterna:{name:'Brasa do Vidro',rarity:'Raro',element:'fire',desc:'Golpes comuns passam a ter chance de causar Queimadura.',effect:'burn'},
 espinho_soberano:{name:'Espinho da Rainha',rarity:'Épico',element:'nature',desc:'Aumenta o dano dos golpes em 3.',effect:'attack'},
 prisma_eco:{name:'Prisma das Profundezas',rarity:'Épico',element:'storm',desc:'Suas habilidades custam 1 energia a menos.',effect:'mana'},
 laco_memoria:{name:'Laço das Memórias',rarity:'Épico',element:'light',desc:'Recupera 3 HP por turno enquanto não estiver envenenado.',effect:'regen'},
 lente_lunar:{name:'Lente de Selene',rarity:'Lendário',element:'light',desc:'Habilidades têm 30% mais dano.',effect:'spell'},
 coroa_semente:{name:'Coroa da Última Colheita',rarity:'Lendário',element:'light',desc:'Mais 20 de vida e bônus contra o Rei das Pragas.',effect:'royal'}
};
const EPIC_ELEMENTS={nature:'Natureza',fire:'Fogo',water:'Água',light:'Luz',shadow:'Sombra',earth:'Terra',storm:'Raio'};
const EPIC_ADV={nature:'earth',fire:'nature',water:'fire',light:'shadow',shadow:'light',earth:'storm',storm:'water'};
const EPIC_ENEMIES={
 larva:{name:'Larva da Ferrugem',element:'nature',hp:45,atk:7,def:2,xp:85,gold:24,weak:'fire',sprite:'larva_grande',intro:'Da seiva envenenada emerge uma larva, marcada com o símbolo das brasas. A estufa não será purificada enquanto ela viver.'},
 rainha:{name:'Rainha das Aranhas',element:'shadow',hp:92,atk:13,def:3,xp:140,gold:35,weak:'light',sprite:'aranha_rainha_v14',intro:'A Rainha das Aranhas veste raízes mortas como uma coroa. Sua teia se contrai enquanto uma memória infantil chama por socorro.'},
 besouro:{name:'Besouro Prismático',element:'earth',hp:120,atk:15,def:5,xp:190,gold:55,weak:'nature',sprite:'besouro_alado',intro:'Cristais brotam da carapaça do besouro. Seus pontos cegos refletem uma luz azul: o núcleo está fragilizado.'},
 espectro:{name:'O Colecionador de Vozes',element:'shadow',hp:135,atk:17,def:4,xp:230,gold:70,weak:'light',sprite:'fantasminha_ataque',intro:'Ele carrega todas as palavras que os habitantes esqueceram. Cada corrente que arrasta é o nome de alguém.'},
 sentinela:{name:'Sentinela do Eclipse',element:'storm',hp:155,atk:19,def:5,xp:300,gold:90,weak:'earth',sprite:'rei_das_pragas_andando',intro:'Sob a lua partida, a sentinela examina seu coração. O combate decidirá se você é digno de entrar no Coração do Pomar.'},
 rei:{name:'Rei das Pragas',element:'shadow',hp:170,atk:20,def:5,xp:480,gold:180,weak:'light',sprite:'rei_das_pragas_completo',intro:'O Rei das Pragas se ergue do tronco primordial. Ele não quer destruir apenas o pomar: quer fazer todos esquecerem que ele existiu.',phases:[{hp:170,element:'shadow',title:'Fase I · O Trono Apodrecido'},{hp:210,element:'nature',title:'Fase II · A Fome das Raízes'},{hp:255,element:'storm',title:'Fase III · O Último Trovão'}]}
};
const EPIC_CHAPTERS=[
 {title:'Prólogo · A Luz das Três Sementes',objective:'Recupere as três sementes, acione o altar e obtenha a Relíquia do Guardião.',next:'O passado começa sob o vidro da estufa.'},
 {title:'I · A Estufa das Brasas',objective:'Ouça Maíra, encontre dois componentes, derrote a Larva e purifique a fornalha.',next:'O caminho das raízes aponta para o bosque.'},
 {title:'II · A Teia dos Nomes',objective:'Leia três pedras, reconstrua o juramento e derrote a Rainha das Aranhas.',next:'A trilha subterrânea revelou uma antiga mina.'},
 {title:'III · As Minas do Prisma Partido',objective:'Recupere três cristais, ajuste o prisma e enfrente o Besouro Prismático.',next:'O pântano sussurra vozes desaparecidas.'},
 {title:'IV · O Pântano das Memórias',objective:'Ouça três ecos, escolha o destino das lembranças e liberte o Colecionador.',next:'Selene observa o alto da torre.'},
 {title:'V · A Vigília da Lua',objective:'Descubra a sequência das fases lunares e vença a Sentinela do Eclipse.',next:'A última porta leva ao coração ancestral.'},
 {title:'VI · A Última Colheita',objective:'Desvende a origem do Rei das Pragas, vença suas três fases e decida o futuro.',next:'Toda história termina com uma semente.'},
 {title:'Epílogo · O Pomar que Ficou',objective:'Converse com os habitantes, explore as regiões e descubra os segredos restantes.',next:'O pomar lembra de você.'}
];
const EPIC_DIALOGUES={
 intro:[['Narrador','A primeira mangueira nasceu antes dos caminhos, quando a terra ainda falava pelos frutos. Cada manga guardava uma lembrança de quem a havia plantado.'],['Narrador','Então chegou uma fome que não queria colher. Queria apagar nomes, promessas e rostos. O povo chamou essa fome de Maldição das Pragas.'],['Guardião Bento','As três sementes e a relíquia são apenas o começo. O pomar escolheu seu guardião — mas ninguém nasceu sabendo enfrentar uma maldição.'],['Guardião Bento','As decisões que tomarão forma na sua jornada não serão medidas apenas por vitórias. Conheça sua classe, cuide de seus companheiros e escute até seus inimigos.']],
 maira:[['Maíra, a Vidreira','A Estufa das Brasas era onde Eldra cultivava sementes impossíveis: algumas cresciam sob o sol, outras em noites sem estrelas.'],['Maíra, a Vidreira','O Rei das Pragas colocou ferrugem dentro das raízes. Preciso de uma gota de orvalho solar e um fragmento de vidro-lua para limpar a fornalha.'],['Maíra, a Vidreira','Não confunda fogo com crueldade. O fogo que aquece conserva; o que devora apenas deixa cinzas. A sua escolha será lembrada.']],
 bosque:[['Eldra, em eco','As três pedras pertenciam a crianças que juraram proteger o pomar juntas. Uma prometeu cuidar da raiz. Outra, ouvir a folha. A terceira, preservar o orvalho.'],['Eldra, em eco','Quando a mentira chegou, as crianças se esqueceram umas das outras. Só um guardião capaz de ouvir o juramento inteiro pode atravessar as teias.']],
 miner:[['Dário, o Mineiro','Antigamente, o minério cantava quando encontrava a luz certa. Agora só ecoa o som das asas de besouros gigantes.'],['Dário, o Mineiro','Três cristais ficaram espalhados: azul como chuva, âmbar como manhã e branco como promessa. Monte-os na ordem do nascimento de uma tempestade.'],['Dário, o Mineiro','A fraqueza do Besouro é a Natureza. O poder não mora numa espada forte: mora no elemento certo e na paciência de observar.']],
 pantano:[['Voz sem rosto','A primeira lembrança era um nome escrito em um galho. A segunda, uma criança devolvendo uma manga roubada. A terceira, Eldra prometendo que ninguém seria esquecido.'],['Voz sem rosto','O Colecionador não nasceu maldito. Ele era o escrivão que tentou salvar lembranças enquanto o Rei as devorava. Seu amor se tornou prisão.']],
 selene:[['Selene, Astrônoma','Na torre, a lua não mostra o futuro; mostra aquilo que fomos incapazes de enfrentar.'],['Selene, Astrônoma','Cada ciclo exige três reconhecimentos: o início crescente, o auge cheio e o repouso minguante. Só então a sentinela despertará.'],['Selene, Astrônoma','Não tema perder. A experiência fica com quem levanta. Seus artefatos mudam a batalha; suas escolhas, o destino de todos.']],
 heart:[['Eldra','O primeiro pomar nasceu da esperança de uma família faminta. Eu não criei árvores para serem eternas. Criei árvores para que ninguém atravessasse a fome sozinho.'],['Rei das Pragas','E eu fui a fome que eles esconderam! Cada fruta dividida me roubava um lugar à mesa. Se apagasse a memória da partilha, todos me pertenceriam.'],['Eldra','Não existe cura sem memória. Um guardião pode destruir uma criatura — ou romper o ciclo que a alimenta. Decida quando chegar a hora.']]
};
window.SamEpicData={classes:EPIC_CLASSES,artifacts:EPIC_ARTIFACTS,enemies:EPIC_ENEMIES,chapters:EPIC_CHAPTERS};
