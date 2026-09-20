export interface ThemeWordCluster {
  themeId: string;
  themeName: string;
  emoji: string;
  description: string;
  clusters: string[][];
}

export const THEME_WORD_CLUSTERS: ThemeWordCluster[] = [
  // =========================================================================
  // 1. OBJETOS DO COTIDIANO
  // =========================================================================
  {
    themeId: 'objetos',
    themeName: 'Objetos',
    emoji: '📦',
    description: 'Itens domésticos, acessórios e objetos do dia a dia.',
    clusters: [
      ['Garfo', 'Colher', 'Faca de Mesa'],
      ['Caneta', 'Lápis', 'Lapiseira', 'Canetinha'],
      ['Óculos de Grau', 'Óculos de Sol', 'Lente de Contato'],
      ['Guarda-Chuva', 'Capa de Chuva', 'Sombrinha'],
      ['Caderno', 'Bloco de Notas', 'Agenda', 'Diário'],
      ['Sofá', 'Poltrona', 'Puff', 'Cadeira de Balanço'],
      ['Travesseiro', 'Almofada', 'Edredom', 'Cobertor'],
      ['Toalha de Banho', 'Roupão', 'Toalha de Rosto'],
      ['Xícara', 'Caneca', 'Copo de Vidro', 'Taça'],
      ['Prato', 'Tigela', 'Travessa', 'Bowl'],
      ['Escova de Dente', 'Fio Dental', 'Pasta de Dente'],
      ['Sabonete', 'Shampoo', 'Condicionador', 'Sabonete Líquido'],
      ['Espelho', 'Vidro', 'Janela'],
      ['Relógio de Pulso', 'Smartwatch', 'Despertador'],
      ['Mochila', 'Bolsa', 'Mala de Viagem', 'Pochete'],
      ['Chave', 'Cadeado', 'Fechadura', 'Trinco'],
      ['Fone de Ouvido', 'Headset', 'AirPods', 'Caixa de Som'],
      ['Notebook', 'Computador', 'Tablet', 'iPad'],
      ['Celular', 'Telefone Fixo', 'Walkie-Talkie'],
      ['Ventilador', 'Ar Condicionado', 'Umidificador'],
      ['Televisão', 'Monitor', 'Projetor / Telão'],
      ['Geladeira', 'Freezer', 'Frigobar'],
      ['Micro-ondas', 'Forno Elétrico', 'Air Fryer'],
      ['Liquidificador', 'Batedeira', 'Processador de Alimentos'],
      ['Tênis', 'Sapato', 'Bota', 'Chuteira'],
      ['Chinelo', 'Sandália', 'Pantufa'],
      ['Boné', 'Chapéu', 'Gorro', 'Viseira'],
      ['Jaqueta', 'Moletom', 'Casaco', 'Sobretudo'],
      ['Carregador de Celular', 'Powerbank', 'Cabo USB'],
      ['Vassoura', 'Rodo', 'Mop', 'Aspirador de Pó'],
      ['Luminária', 'Abajur', 'Lanterna', 'Vela'],
      ['Tesoura', 'Estilete', 'Alicate'],
      ['Perfume', 'Desodorante', 'Colônia', 'Body Splash'],
      ['Guardanapo', 'Papel Toalha', 'Lenço de Papel'],
      ['Panela de Pressão', 'Frigideira', 'Caçarola']
    ]
  },

  // =========================================================================
  // 2. LUGARES E LOCAIS
  // =========================================================================
  {
    themeId: 'lugares',
    themeName: 'Lugares',
    emoji: '📍',
    description: 'Cidades, estabelecimentos, pontos turísticos e ambientes.',
    clusters: [
      ['Praia', 'Piscina', 'Parque Aquático', 'Lago'],
      ['Cinema', 'Teatro', 'Auditório', 'Circo'],
      ['Hospital', 'Posto de Saúde', 'Pronto-Socorro', 'Clínica Médica'],
      ['Escola', 'Faculdade', 'Colégio', 'Curso'],
      ['Supermercado', 'Mercearia', 'Hipermercado', 'Feira Livre'],
      ['Restaurante', 'Pizzaria', 'Lanchonete', 'Hamburgueria'],
      ['Padaria', 'Confeitaria', 'Cafeteria'],
      ['Academia', 'Crossfit', 'Centro Esportivo'],
      ['Aeroporto', 'Rodoviária', 'Estação de Trem', 'Estação de Metrô'],
      ['Hotel', 'Pousada', 'Resort', 'Hostel'],
      ['Shopping Center', 'Galeria Comercial', 'Centro Comercial'],
      ['Museu', 'Galeria de Arte', 'Exposição'],
      ['Biblioteca', 'Livraria', 'Sala de Estudos'],
      ['Igreja', 'Catedral', 'Templo', 'Santuário'],
      ['Zoológico', 'Aquário', 'Parque Safari', 'Fazendinha'],
      ['Parque de Diversões', 'Parque Temático', 'Playground'],
      ['Estádio de Futebol', 'Arena', 'Ginásio'],
      ['Cemitério', 'Crematório', 'Jazigo'],
      ['Delegacia', 'Presídio', 'Tribunal de Justiça'],
      ['Posto de Gasolina', 'Lava-Rápido', 'Oficina Mecânica'],
      ['Consultório Dentário', 'Consultório Médico', 'Laboratório de Exames'],
      ['Banco / Agência Bancária', 'Caixa Eletrônico', 'Casa de Câmbio'],
      ['Boate', 'Pub', 'Bar / Boteco', 'Balada'],
      ['Spa', 'Salão de Beleza', 'Barbearia'],
      ['Paris', 'Roma', 'Londres', 'Veneza'],
      ['Nova York', 'Tóquio', 'Dubai', 'Hong Kong'],
      ['Rio de Janeiro', 'Salvador', 'Fortaleza', 'Florianópolis'],
      ['Pirâmides do Egito', 'Muralha da China', 'Coliseu', 'Torre Eiffel'],
      ['Cachoeira', 'Rio', 'Riacho', 'Nascente'],
      ['Vulcão', 'Deserto', 'Montanha', 'Cânion']
    ]
  },

  // =========================================================================
  // 3. PROFISSÕES E OCUPAÇÕES
  // =========================================================================
  {
    themeId: 'profissoes',
    themeName: 'Profissões',
    emoji: '💼',
    description: 'Ocupações, carreiras, trabalhos e ofícios.',
    clusters: [
      ['Médico', 'Enfermeiro', 'Cirurgião', 'Paramédico'],
      ['Dentista', 'Ortodontista', 'Protético'],
      ['Policial', 'Detetive', 'Segurança', 'Guarda Municipal'],
      ['Bombeiro', 'Salva-Vidas', 'Brigadista'],
      ['Piloto de Avião', 'Astronauta', 'Piloto de Helicóptero', 'Comissário de Bordo'],
      ['Chef de Cozinha', 'Cozinheiro', 'Padeiro', 'Pizzaiolo'],
      ['Garçom', 'Barman', 'Barista', 'Sommelier'],
      ['Professor', 'Tutor', 'Instrutor', 'Palestrante'],
      ['Advogado', 'Juiz', 'Promotor de Justiça', 'Delegado'],
      ['Veterinário', 'Biólogo Marinho', 'Zootecnista'],
      ['Arquiteto', 'Engenheiro Civil', 'Designer de Interiores'],
      ['Programador', 'Hacker', 'Engenheiro de Software', 'Cientista de Dados'],
      ['Cantor', 'Músico', 'Compositor', 'DJ'],
      ['Ator de Cinema', 'Dublador', 'Apresentador de TV', 'Comediante'],
      ['Fotógrafo', 'Cinegrafista', 'Editor de Vídeo'],
      ['Youtuber', 'Influencer Digital', 'Streamer', 'Tiktoker'],
      ['Jogador de Futebol', 'Jogador de Basquete', 'Tenista', 'Atleta Olímpico'],
      ['Personal Trainer', 'Preparador Físico', 'Instrutor de Pilates'],
      ['Psicólogo', 'Psiquiatra', 'Terapeuta'],
      ['Mecânico', 'Eletricista', 'Encanador', 'Serralheiro'],
      ['Barbeiro', 'Cabeleireiro', 'Maquiador', 'Manicure'],
      ['Jornalista', 'Repórter', 'Apresentador de Notícias'],
      ['Mágico', 'Palhaço', 'Malabarista', 'Ilusionista'],
      ['Astrônomo', 'Astrofísico', 'Cientista'],
      ['Arqueólogo', 'Historiador', 'Antropólogo'],
      ['Jardineiro', 'Paisagista', 'Agricultor']
    ]
  },

  // =========================================================================
  // 4. ALIMENTOS E BEBIDAS
  // =========================================================================
  {
    themeId: 'comidas',
    themeName: 'Alimentos',
    emoji: '🍕',
    description: 'Comidas, pratos típicos, sobremesas e bebidas.',
    clusters: [
      ['Café', 'Chá', 'Capuccino', 'Chocolate Quente'],
      ['Hambúrguer', 'Cachorro-Quente', 'Sanduíche', 'Misto-Quente'],
      ['Pizza', 'Lasanha', 'Calzone', 'Macarronada'],
      ['Sorvete', 'Picolé', 'Açaí', 'Gelato'],
      ['Coxinha', 'Pastel', 'Empada', 'Esfiha', 'Kibe'],
      ['Pão de Queijo', 'Bolo de Cenoura', 'Croissant', 'Muffin'],
      ['Chocolate ao Leite', 'Chocolate Branco', 'Trufa', 'Brigadeiro'],
      ['Pipoca', 'Batata Frita', 'Nachos', 'Amendoim'],
      ['Churrasco', 'Picanha', 'Costela', 'Linguiça'],
      ['Sushi', 'Sashimi', 'Temaki', 'Yakisoba'],
      ['Maçã', 'Pêra', 'Pêssego', 'Ameixa'],
      ['Laranja', 'Tangerina', 'Limão', 'Mexerica'],
      ['Banana', 'Abacaxi', 'Manga', 'Mamão'],
      ['Morango', 'Framboesa', 'Amora', 'Mirtilo'],
      ['Cerveja', 'Chopp', 'Vinho', 'Espumante'],
      ['Refrigerante', 'Suco Natural', 'Água com Gás', 'Energético'],
      ['Feijoada', 'Moqueca', 'Vatapá', 'Baião de Dois'],
      ['Strogonoff', 'Frango Grelhado', 'Bife Acebolado', 'Parmegiana'],
      ['Pudim', 'Mousse de Maracujá', 'Torta Holandesa', 'Cheesecake'],
      ['Arroz e Feijão', 'Farofa', 'Mandioca Frita', 'Polenta Frita'],
      ['Panqueca', 'Waffle', 'Crepe', 'Tapioca']
    ]
  },

  // =========================================================================
  // 5. ANIMAIS E NATUREZA
  // =========================================================================
  {
    themeId: 'animais',
    themeName: 'Animais',
    emoji: '🦁',
    description: 'Mamíferos, aves, répteis, insetos e vida marinha.',
    clusters: [
      ['Leão', 'Tigre', 'Leopardo', 'Onça Pintada'],
      ['Cachorro', 'Lobo', 'Raposa', 'Chacal'],
      ['Gato', 'Gato Siames', 'Lince', 'Guepardo'],
      ['Cavalo', 'Zebra', 'Pônei', 'Burro'],
      ['Elefante', 'Rinoceronte', 'Hipopótamo'],
      ['Girafa', 'Camelo', 'Dromedário', 'Lhama'],
      ['Urso Polar', 'Urso Pardo', 'Urso Panda'],
      ['Golfinho', 'Baleia', 'Orca', 'Tubarão'],
      ['Macaco', 'Chimpanzé', 'Gorila', 'Orangotango'],
      ['Águia', 'Gavião', 'Falcão', 'Coruja'],
      ['Pinguim', 'Gaivota', 'Pelicano'],
      ['Cobra', 'Jacaré', 'Lagarto', 'Camaleão'],
      ['Sapo', 'Rã', 'Perereca'],
      ['Tubarão Branco', 'Tubarão Martelo', 'Arraia'],
      ['Polvo', 'Lula', 'Água-Viva'],
      ['Abelha', 'Vespa', 'Marimbondo'],
      ['Formiga', 'Cupim', 'Besouro'],
      ['Coelho', 'Hamster', 'Porquinho da Índia', 'Chinchila'],
      ['Canguru', 'Coala', 'Uombate'],
      ['Papagaio', 'Arara', 'Tucano', 'Calopsita'],
      ['Tartaruga', 'Jabuti', 'Cágado'],
      ['Pato', 'Marreco', 'Ganso', 'Cisne']
    ]
  },

  // =========================================================================
  // 6. FILMES, SÉRIES & CULTURA POP
  // =========================================================================
  {
    themeId: 'filmes',
    themeName: 'Filmes & Séries',
    emoji: '🎬',
    description: 'Personagens icônicos, franquias de cinema e séries famosas.',
    clusters: [
      ['Harry Potter', 'O Senhor dos Anéis', 'Percy Jackson', 'As Crônicas de Nárnia'],
      ['Vingadores', 'Liga da Justiça', 'Guardiões da Galáxia', 'X-Men'],
      ['Star Wars', 'Star Trek', 'Duna', 'Matrix'],
      ['Stranger Things', 'Dark', 'Black Mirror', 'Arquivo X'],
      ['La Casa de Papel', 'Round 6 / Squid Game', 'Lupin', 'Prison Break'],
      ['Game of Thrones', 'House of the Dragon', 'The Witcher', 'Vikings'],
      ['Breaking Bad', 'Better Call Saul', 'Peaky Blinders', 'Narcos'],
      ['Friends', 'How I Met Your Mother', 'The Big Bang Theory', 'Modern Family'],
      ['The Office', 'Brooklyn Nine-Nine', 'Parks and Recreation', 'Community'],
      ['Toy Story', 'Monstros S.A.', 'Procurando Nemo', 'Carros'],
      ['O Rei Leão', 'Madagascar', 'A Era do Gelo', 'Kung Fu Panda'],
      ['Shrek', 'Gato de Botas', 'Megamente', 'Minions'],
      ['Titanic', 'Avatar', 'Interestelar', 'Gravidade'],
      ['Coringa', 'Charada', 'Pinguim', 'Duas-Caras'],
      ['Voldemort', 'Sauron', 'Darth Vader', 'Thanos'],
      ['Bob Esponja', 'Patrick Estrela', 'Lula Molusco', 'Seu Siriguejo'],
      ['Mickey Mouse', 'Pato Donald', 'Pateta', 'Pluto'],
      ['Chaves', 'Seu Madruga', 'Quico', 'Dona Florinda'],
      ['Scooby-Doo', 'Salsicha', 'Fred', 'Velma']
    ]
  },

  // =========================================================================
  // 7. ESPORTES
  // =========================================================================
  {
    themeId: 'esportes',
    themeName: 'Esportes',
    emoji: '⚽',
    description: 'Modalidades esportivas, atletismo, artes marciais e esportes radicais.',
    clusters: [
      ['Futebol', 'Futsal', 'Futebol de Areia', 'Society'],
      ['Basquete', 'Vôlei', 'Handebol', 'Queimada'],
      ['Tênis', 'Tênis de Mesa / Ping-Pong', 'Beach Tennis', 'Badminton'],
      ['Natação', 'Polo Aquático', 'Salto Ornamental', 'Nado Sincronizado'],
      ['Fórmula 1', 'Kart', 'Stock Car', 'MotoGP'],
      ['Boxe', 'UFC / MMA', 'Muay Thai', 'Jiu-Jitsu', 'Judô'],
      ['Skate', 'Patins', 'Longboard', 'BMX'],
      ['Surf', 'Bodyboard', 'Windsurf', 'Kitesurf'],
      ['Ciclismo', 'Mountain Bike', 'Spinning', 'Triatlo'],
      ['Atletismo', 'Corrida de Rua', 'Maratona', 'Salto em Altura'],
      ['Ginástica Artística', 'Ginástica Rítmica', 'Crossfit'],
      ['Golfe', 'Sinuca / Bilhar', 'Boliche', 'Dardos'],
      ['Rugby', 'Futebol Americano', 'Beisebol', 'Críquete'],
      ['Esqui na Neve', 'Snowboard', 'Patinação no Gelo', 'Hóquei no Gelo'],
      ['Escalada', 'Rapel', 'Tirolesa', 'Paraquedismo']
    ]
  },

  // =========================================================================
  // 8. JOGOS & GAMES
  // =========================================================================
  {
    themeId: 'jogos',
    themeName: 'Jogos & Games',
    emoji: '🎮',
    description: 'Jogos de tabuleiro, cartas, cartas clássicas e videogames populares.',
    clusters: [
      ['Xadrez', 'Damas', 'Gamão', 'Trilha'],
      ['Monopoly / Banco Imobiliário', 'Jogo da Vida', 'War', 'Detetive (Jogo)'],
      ['Uno', 'Truco', 'Pôquer', 'Blackjack / 21'],
      ['Dominó', 'Baralho', 'Buraco', 'Canastra'],
      ['Catan', 'Carcassonne', 'Ticket to Ride', 'Dixit'],
      ['Fifa / EA Sports FC', 'PES / eFootball', 'Rocket League'],
      ['Counter-Strike', 'Valorant', 'Call of Duty', 'Overwatch'],
      ['League of Legends', 'Dota 2', 'Smite'],
      ['Fortnite', 'Free Fire', 'PUBG', 'Apex Legends'],
      ['Minecraft', 'Roblox', 'Terraria'],
      ['GTA V', 'Red Dead Redemption', 'Cyberpunk 2077'],
      ['God of War', 'The Last of Us', 'Uncharted', 'Elden Ring'],
      ['Super Mario', 'Sonic', 'Crash Bandicoot', 'Donkey Kong'],
      ['Pokémon', 'Digimon', 'Yu-Gi-Oh! (Cartas)'],
      ['Among Us', 'Fall Guys', 'Gartic', 'Stop / Adedonha']
    ]
  },

  // =========================================================================
  // 8. TECNOLOGIA & GADGETS
  // =========================================================================
  {
    themeId: 'tecnologia',
    themeName: 'Tecnologia',
    emoji: '💻',
    description: 'Aparelhos eletrônicos, inteligência artificial, redes e inovação.',
    clusters: [
      ['Smartphone', 'Tablet', 'Smartwatch', 'Smartband'],
      ['Notebook', 'Computador Desktop', 'All-in-One', 'MacBook'],
      ['Teclado Mecânico', 'Mouse Gamer', 'Headset Gamer', 'Mousepad RGB'],
      ['Óculos VR', 'Realidade Aumentada', 'Metaverso'],
      ['PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'Steam Deck'],
      ['Inteligência Artificial', 'ChatGPT', 'Robô Humanoide', 'Algoritmo'],
      ['Drone', 'Câmera GoPro', 'Gimbal / Estabilizador'],
      ['Assistente Virtual / Alexa', 'Google Home', 'Siri'],
      ['Wi-Fi', 'Bluetooth', '5G', 'Fibra Óptica'],
      ['Criptomoeda', 'Bitcoin', 'Ethereum', 'Blockchain'],
      ['Netflix', 'Amazon Prime Video', 'Disney+', 'HBO Max'],
      ['Spotify', 'Apple Music', 'YouTube Music', 'Deezer'],
      ['Instagram', 'TikTok', 'Twitter / X', 'Threads'],
      ['WhatsApp', 'Telegram', 'Discord', 'Signal'],
      ['Carro Elétrico', 'Tesla', 'Patinete Elétrico', 'Bicicleta Elétrica']
    ]
  },

  // =========================================================================
  // 9. SUPER-HERÓIS E VILÕES
  // =========================================================================
  {
    themeId: 'superherois',
    themeName: 'Super-Heróis',
    emoji: '🦸‍♂️',
    description: 'Heróis, vilões, mutantes e personagens dos quadrinhos.',
    clusters: [
      ['Batman', 'Homem de Ferro', 'Arqueiro Verde'],
      ['Superman', 'Capitão Pátria', 'Thor', 'Shazam'],
      ['Homem-Aranha', 'Deadpool', 'Homem-Formiga'],
      ['Flash', 'Mercúrio', 'Sonic', 'A-Train'],
      ['Mulher-Maravilha', 'Capitã Marvel', 'Tempestade', 'Gamora'],
      ['Hulk', 'O Coisa', 'Colossus', 'Juggernaut'],
      ['Doutor Estranho', 'Feiticeira Escarlate', 'Zatanna', 'Constantine'],
      ['Wolverine', 'Deadpool', 'Dentes de Sabre'],
      ['Aquaman', 'Namor', 'Abe Sapien'],
      ['Pantera Negra', 'Asa Noturna', 'Demolidor', 'Cavaleiro da Lua'],
      ['Magneto', 'Professor Xavier', 'Ciclope', 'Wolverine'],
      ['Thanos', 'Darkseid', 'Galactus', 'Apocalipse'],
      ['Coringa', 'Charada', 'Duas-Caras', 'Pinguim'],
      ['Venom', 'Carnificina', 'Knull', 'Anti-Venom'],
      ['Capitão América', 'Soldado Invernal', 'Falcão']
    ]
  }
];

/**
 * Retorna um par de palavras semelhantes sorteadas aleatoriamente dentro de um cluster
 * para o modo Undercover (Infiltrado com Avançado).
 */
export function getUndercoverWordPair(themeId: string): {
  civilianWord: string;
  impostorWord: string;
  themeName: string;
} {
  let themeCluster = THEME_WORD_CLUSTERS.find((t) => t.themeId === themeId);

  // Se o tema selecionado for 'aleatorio' ou inválido, sorteia um tema aleatório
  if (!themeCluster || themeId === 'aleatorio') {
    const validThemes = THEME_WORD_CLUSTERS.filter((t) => t.themeId !== 'aleatorio');
    const randomThemeIndex = Math.floor(Math.random() * validThemes.length);
    themeCluster = validThemes[randomThemeIndex] || THEME_WORD_CLUSTERS[0];
  }

  const clusters = themeCluster.clusters;
  if (!clusters || clusters.length === 0) {
    return {
      civilianWord: 'Café',
      impostorWord: 'Chá',
      themeName: themeCluster.themeName
    };
  }

  // Sorteia um cluster aleatório
  const randomClusterIndex = Math.floor(Math.random() * clusters.length);
  const selectedCluster = clusters[randomClusterIndex];

  if (selectedCluster.length < 2) {
    return {
      civilianWord: selectedCluster[0] || 'Café',
      impostorWord: selectedCluster[0] || 'Chá',
      themeName: themeCluster.themeName
    };
  }

  // Embaralha as palavras do cluster para escolher 2 distintas aleatoriamente
  const shuffledWords = [...selectedCluster].sort(() => Math.random() - 0.5);

  return {
    civilianWord: shuffledWords[0],
    impostorWord: shuffledWords[1],
    themeName: themeCluster.themeName
  };
}
