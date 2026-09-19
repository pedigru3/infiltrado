export interface Theme {
  id: string;
  name: string;
  emoji: string;
  description: string;
  words: string[];
}

export const THEMES: Theme[] = [
  {
    id: 'objetos',
    name: 'Objetos',
    emoji: '📦',
    description: 'Itens do cotidiano, utilidades, ferramentas e acessórios.',
    words: [
      'Óculos', 'Guarda-Chuva', 'Espelho', 'Lanterna', 'Mochila', 'Chave',
      'Carteira', 'Relógio de Pulso', 'Tesoura', 'Livro', 'Caneta', 'Lápis',
      'Borracha', 'Caderno', 'Cafeteira', 'Ventilador', 'Controle Remoto', 'Garrafa Térmica',
      'Cadeira', 'Abajur', 'Travesseiro', 'Martelo', 'Cadeado', 'Vassoura',
      'Secador de Cabelo', 'Ferro de Passar', 'Micro-ondas', 'Air Fryer', 'Grampeador',
      'Cofre', 'Isqueiro', 'Vela', 'Panela', 'Prato', 'Copo',
      'Garfo', 'Colher', 'Escova de Dentes', 'Toalha de Banho', 'Mala de Viagem', 'Sapato',
      'Boné', 'Cinto', 'Almofada', 'Fita Adesiva', 'Balde', 'Pente',
      'Guarda-Sol', 'Binóculos', 'Quadro de Parede', 'Chave de Fenda', 'Alicate', 'Trena',
      'Pregador de Roupa', 'Abridor de Garrafas', 'Saca-Rolhas', 'Cabide', 'Tapete', 'Cortina',
      'Cobertor', 'Liquidificador', 'Batedeira', 'Ralador', 'Jarra de Vidro', 'Xícara',
      'Caneca', 'Chaleira', 'Termômetro', 'Despertador', 'Fósforo', 'Porta-Retrato',
      'Vaso de Planta', 'Lâmpada', 'Pinça', 'Cortador de Unha', 'Escova de Cabelo', 'Perfume',
      'Saboneteira', 'Chinelo', 'Cachecol', 'Gravata', 'Bolsa', 'Estojo',
      'Apontador', 'Régua', 'Clips de Papel', 'Pasta de Documentos', 'Fechadura', 'Maçaneta'
    ]
  },
  {
    id: 'comidas',
    name: 'Comidas & Bebidas',
    emoji: '🍔',
    description: 'Pratos deliciosos, lanches, sobremesas e bebidas.',
    words: [
      'Pizza', 'Hambúrguer', 'Sushi', 'Coxinha', 'Pastel', 'Churrasco', 'Lasanha',
      'Brigadeiro', 'Açaí', 'Feijoada', 'Pão de Queijo', 'Torta de Limão', 'Tapioca',
      'Batata Frita', 'Fondue', 'Risoto', 'Café Expresso', 'Guaraná', 'Sorvete',
      'Milkshake', 'Pipoca', 'Hot Dog', 'Churros', 'Panqueca', 'Waffle', 'Brownie',
      'Strogonoff', 'Yakisoba', 'Empada', 'Esfiha', 'Kibe', 'Quindim', 'Pudim de Leite',
      'Mousse de Maracujá', 'Água de Coco', 'Caipirinha', 'Suco de Laranja', 'Tacos',
      'Burrito', 'Macarrão Carbonara', 'Moqueca', 'Baião de Dois', 'Farofa', 'Bolo de Cenoura',
      'Croissant', 'Cappuccino', 'Doce de Leite', 'Paçoca', 'Nuggets', 'Cheesecake'
    ]
  },
  {
    id: 'animais',
    name: 'Animais',
    emoji: '🐾',
    description: 'Animais selvagens, aquáticos, aves e domésticos.',
    words: [
      'Leão', 'Tubarão', 'Pinguim', 'Elefante', 'Camaleão', 'Golfinho', 'Urso Panda',
      'Águia', 'Lobo', 'Canguru', 'Bicho Preguiça', 'Coruja', 'Gorila', 'Zebra',
      'Girafa', 'Polvo', 'Arara', 'Onça Pintada', 'Jacaré', 'Cavalo Marinho',
      'Gato', 'Cachorro', 'Tartaruga', 'Rinoceronte', 'Foca', 'Pavão', 'Hipopótamo',
      'Urso Polar', 'Flamingo', 'Capivara', 'Tamanduá', 'Camelo', 'Raposa', 'Morcego',
      'Esquilo', 'Castor', 'Orangotango', 'Cobra Naja', 'Baleia Azul', 'Lontra',
      'Cervo', 'Hamster', 'Porquinho-da-Índia', 'Hiena', 'Suricato', 'Avestruz',
      'Papagaio', 'Touro', 'Rã', 'Caranguejo'
    ]
  },
  {
    id: 'lugares',
    name: 'Lugares & Cidades',
    emoji: '🌍',
    description: 'Locais turísticos, estabelecimentos e destinos famosos.',
    words: [
      'Praia', 'Cinema', 'Hospital', 'Aeroporto', 'Estádio de Futebol', 'Shopping',
      'Parque de Diversões', 'Museu', 'Hotel de Luxo', 'Navio Pirata', 'Restaurante',
      'Supermercado', 'Escola', 'Biblioteca', 'Prisão', 'Estação Espacial',
      'Castelo Medieval', 'Ilha Deserta', 'Balada', 'Igreja', 'Academia', 'Farmácia',
      'Paris', 'Nova York', 'Rio de Janeiro', 'Disney', 'Pirâmides do Egito', 'Tóquio',
      'Roma', 'Londres', 'Zoológico', 'Pizzaria', 'Rodoviária', 'Cassino',
      'Posto de Gasolina', 'Delegacia', 'Cemitério', 'Padaria', 'Consultório Dentário',
      'Escape Room', 'Parque Aquático', 'Muralha da China', 'Teatro', 'Feira Livre',
      'Banco / Caixa Forte', 'Spa', 'Circo', 'Cachoeira', 'Submarino', 'Vulcão'
    ]
  },
  {
    id: 'profissoes',
    name: 'Profissões',
    emoji: '💼',
    description: 'Ocupações, carreiras, trabalhos e personagens.',
    words: [
      'Detetive', 'Astronauta', 'Cirurgião', 'Piloto de Avião', 'Bombeiro', 'Chef de Cozinha',
      'Mágico', 'Espião Secreto', 'Youtuber', 'Jogador de Futebol', 'Cientista',
      'Professor', 'Advogado', 'Policial', 'Veterinário', 'Arquiteto', 'Cantor',
      'Fotógrafo', 'Ator de Cinema', 'Dentista', 'Juiz', 'Programador', 'Psicólogo',
      'Garçom', 'DJ', 'Dançarino', 'Pintor', 'Jornalista', 'Mecânico',
      'Motorista de Aplicativo', 'Barbeiro', 'Modelo', 'Carteiro', 'Salva-Vidas',
      'Eletricista', 'Guia Turístico', 'Dublador', 'Biólogo Marinho', 'Personal Trainer',
      'Arqueólogo', 'Sommelier', 'Padeiro', 'Jardineiro', 'Palhaço', 'Astrônomo',
      'Segurança', 'Tatuador', 'Juiz de Futebol', 'Costureiro', 'Marinheiro'
    ]
  },
  {
    id: 'pop',
    name: 'Filmes, Séries & Games',
    emoji: '🎬',
    description: 'Universo Geek, cinema, séries famosas e videogames.',
    words: [
      'Harry Potter', 'Star Wars', 'Batman', 'Vingadores', 'Matrix', 'Homem-Aranha',
      'Jurassic Park', 'Titanic', 'Stranger Things', 'Barbie', 'Shrek', 'Bob Esponja',
      'O Senhor dos Anéis', 'Minecraft', 'Super Mario', 'Fortnite', 'Pokémon',
      'Game of Thrones', 'De Volta Para o Futuro', 'Toy Story', 'O Rei Leão',
      'GTA', 'The Witcher', 'Piratas do Caribe', 'Os Simpsons', 'Peaky Blinders',
      'Round 6', 'Velozes e Furiosos', 'Avatar', 'Coringa', 'La Casa de Papel',
      'Friends', 'Breaking Bad', 'Sonic', 'Zelda', 'God of War', 'Interestelar',
      'Carros (Pixar)', 'Monstros S.A.', 'Wandinha', 'Homem de Ferro', 'Deadpool',
      'Attack on Titan', 'Naruto', 'Dragon Ball', 'O Poderoso Chefão', 'Pânico',
      'The Last of Us', 'Scooby-Doo', 'Liga da Justiça'
    ]
  },
  {
    id: 'lazer',
    name: 'Lazer',
    emoji: '⚽',
    description: 'Atividades recreativas, esportes, passeios e passatempos.',
    words: [
      'Futebol', 'Basquete', 'Vôlei de Praia', 'Surfe', 'Skate', 'Natação', 'Boliche',
      'Ciclismo', 'Sinuca', 'Xadrez', 'Corrida', 'Videogame', 'Tênis', 'Boxe',
      'Paintball', 'Dança', 'Piquenique', 'Pesca', 'Acampamento', 'Passeio no Parque',
      'Ping-Pong', 'Escalada', 'Kart', 'Mergulho', 'Trilha', 'Canoagem', 'Yoga',
      'Churrasco com Amigos', 'Cinema', 'Karaokê', 'Andar de Patins', 'Tiro ao Alvo',
      'Stand Up Paddle', 'Tênis de Mesa', 'Stand Up Comedy', 'Windsurf', 'Luau na Praia',
      'Passeio de Barco', 'Assistir Série', 'Jogar Baralho', 'Frescobol', 'Caminhada',
      'Tirolesa', 'Quadriciclo', 'Roda de Samba', 'Beach Tennis', 'Patinação no Gelo',
      'Festa na Piscina', 'Passeio a Cavalo', 'Pular de Paraquedas'
    ]
  },
  {
    id: 'infancia',
    name: 'Infância',
    emoji: '🧸',
    description: 'Jogos de infância, brinquedos, doces e nostalgia.',
    words: [
      'Esconde-esconde', 'Pega-pega', 'Queimada', 'Amarelinha', 'Pipa', 'Lego',
      'Massinha de Modelar', 'Pula Corda', 'Carrinho de Rolimã', 'Pião', 'Taco / Bete',
      'Bolha de Sabão', 'Estátua', 'Cabra-Cega', 'Dança das Cadeiras', 'Telefone Sem Fio',
      'Bambolê', 'Castelo de Areia', 'Balanço do Parque', 'Escorregador', 'Gangorra',
      'Piscina de Bolinhas', 'Algodão Doce', 'Pirulito', 'Desenho Animado', 'Lancheira',
      'Boneca', 'Carrinho de Brinquedo', 'Bexiga d’Água', 'Pique-Bandeira', 'Cinco Marias',
      'Bolinha de Gude', 'Álbum de Figurinhas', 'Casa na Árvore', 'Fortim de Lençol',
      'Pular Elástico', 'Carrinho de Controle Remoto', 'Jogo da Velha', 'Quebra-Cabeça',
      'Uno', 'Dominó', 'Videogame Retrô', 'Bicicleta com Rodinhas', 'Chupeta',
      'Mamadeira', 'Berço', 'Fralda', 'Pijama de Bichinho', 'Ciranda', 'Mímica'
    ]
  },
  {
    id: 'superherois',
    name: 'Super-Heróis',
    emoji: '🦸‍♂️',
    description: 'Heróis, heroínas e vigilantes dos quadrinhos.',
    words: [
      'Homem-Aranha', 'Batman', 'Homem de Ferro', 'Superman', 'Mulher-Maravilha',
      'Thor', 'Capitão América', 'Wolverine', 'Hulk', 'Flash', 'Deadpool',
      'Doutor Estranho', 'Pantera Negra', 'Aquaman', 'Viúva Negra', 'Robin',
      'Lanterna Verde', 'Arqueiro Verde', 'Shazam', 'Ciclope', 'Tempestade',
      'Homem-Formiga', 'Demolidor', 'Noturno', 'Motoqueiro Fantasma', 'Gavião Arqueiro',
      'Feiticeira Escarlate', 'Visão', 'Capitã Marvel', 'Senhor das Estrelas', 'Groot',
      'Rocket Raccoon', 'Soldado Invernal', 'Ciborgue', 'Ravena', 'Estelar',
      'Mutano', 'Supergirl', 'Batgirl', 'Besouro Azul', 'Justiceiro', 'Blade',
      'Gambit', 'Venom', 'Goku', 'Saitama', 'Ben 10', 'Meninas Superpoderosas',
      'Super Choque', 'Homem-Borracha'
    ]
  },
  {
    id: 'tecnologia',
    name: 'Tecnologia',
    emoji: '💻',
    description: 'Gadgets, inovações, inteligência artificial e universo digital.',
    words: [
      'Smartphone', 'Notebook', 'Inteligência Artificial', 'Drone', 'Videogame',
      'Smartwatch', 'Impressora 3D', 'Óculos VR (Realidade Virtual)', 'Fone Bluetooth', 'Robô',
      'Satélite', 'Câmera Digital', 'Tablet', 'Roteador Wi-Fi', 'Processador',
      'Holograma', 'Carro Elétrico', 'Powerbank', 'Pendrive', 'Teclado Mecânico',
      'Mouse sem Fio', 'Placa de Vídeo', 'Nuvem (Cloud)', 'Ring Light', 'Alexa (Assistente Virtual)',
      'Caixa de Som Inteligente', 'GPS', 'Bitcoin', 'Algoritmo', 'Fibra Óptica',
      'Antena 5G', 'Monitor Gamer', 'Scanner Biométrico', 'Webcam', 'Painel Solar',
      'Patinete Elétrico', 'Foguete Espacial', 'Carregador por Indução', 'Smart TV', 'Firewall',
      'Supercomputador', 'Headset Gamer', 'Sensor de Movimento', 'Reconhecimento Facial', 'Nanotecnologia',
      'Criptografia', 'Smartband', 'Microfone Condensador', 'Bateria de Lítio', 'Projetor Laser'
    ]
  }
];

export function getRandomWordFromTheme(themeId: string): { word: string; themeName: string } {
  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const randomIndex = Math.floor(Math.random() * theme.words.length);
  return {
    word: theme.words[randomIndex],
    themeName: theme.name
  };
}
