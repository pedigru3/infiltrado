import { THEMES, getRandomWordFromTheme } from '@/data/themes';

export type GameMode = 'infiltrado' | 'twin';

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  lastSeen: number;
  role?: 'player' | 'impostor';
}

export type RoomStatus =
  | 'lobby'
  | 'drawing'
  | 'playing'
  | 'ended'
  | 'twin_playing'
  | 'twin_revealed'
  | 'twin_matched';

export interface TwinRoundHistory {
  round: number;
  p1Name: string;
  p1Word: string;
  p2Name: string;
  p2Word: string;
  matched: boolean;
}

export interface Room {
  code: string;
  gameMode: GameMode;
  createdAt: number;
  hostId: string;
  selectedThemeId: string;
  status: RoomStatus;
  currentThemeName: string | null;
  currentWord: string | null;
  impostorId: string | null;
  roundStartedAt: number | null;
  players: Player[];

  // Palavra Gêmea state:
  twinRound: number;
  twinInitialPrompt: string | null;
  twinSubmissions: Record<string, string>;
  twinHistory: TwinRoundHistory[];
  twinMatched: boolean;
}

export interface ClientRoomState {
  code: string;
  gameMode: GameMode;
  hostId: string;
  isHost: boolean;
  selectedThemeId: string;
  status: RoomStatus;
  roundStartedAt: number | null;
  players: {
    id: string;
    name: string;
    isHost: boolean;
    isCurrent: boolean;
  }[];
  // Infiltrado specific:
  myRole: 'player' | 'impostor' | null;
  themeName: string | null;
  secretWord: string | null;
  impostorName?: string | null;

  // Palavra Gêmea specific:
  twinRound: number;
  twinInitialPrompt: string | null;
  twinSubmitted: boolean;
  twinPartnerSubmitted: boolean;
  twinHistory: TwinRoundHistory[];
  twinCurrentWords: { p1Name: string; p1Word: string; p2Name: string; p2Word: string } | null;
  twinMatched: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var __infiltrado_rooms__: Map<string, Room> | undefined;
}

const rooms: Map<string, Room> = globalThis.__infiltrado_rooms__ || new Map<string, Room>();
globalThis.__infiltrado_rooms__ = rooms;

const HEARTBEAT_TIMEOUT_MS = 60000;
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateUniqueCode(): string {
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
  }
  if (rooms.has(code)) {
    return generateUniqueCode();
  }
  return code;
}

export function createRoom(gameMode: GameMode = 'infiltrado'): Room {
  const code = generateUniqueCode();
  const room: Room = {
    code,
    gameMode,
    createdAt: Date.now(),
    hostId: '',
    selectedThemeId: 'comidas',
    status: 'lobby',
    currentThemeName: null,
    currentWord: null,
    impostorId: null,
    roundStartedAt: null,
    players: [],
    twinRound: 1,
    twinInitialPrompt: null,
    twinSubmissions: {},
    twinHistory: [],
    twinMatched: false
  };
  rooms.set(code, room);
  return room;
}

export function getRoom(code: string): Room | undefined {
  const room = rooms.get(code.toUpperCase());
  if (room) {
    cleanOfflinePlayers(room);
  }
  return room;
}

export function cleanOfflinePlayers(room: Room): void {
  const now = Date.now();
  const activePlayers = room.players.filter((p) => now - p.lastSeen <= HEARTBEAT_TIMEOUT_MS);

  if (activePlayers.length !== room.players.length) {
    room.players = activePlayers;

    if (activePlayers.length > 0) {
      const currentHostExists = activePlayers.some((p) => p.id === room.hostId);
      if (!currentHostExists) {
        activePlayers[0].isHost = true;
        room.hostId = activePlayers[0].id;
      }
    }

    if (room.status !== 'lobby' && room.impostorId) {
      const impostorOnline = activePlayers.some((p) => p.id === room.impostorId);
      if (!impostorOnline) {
        room.status = 'lobby';
        room.currentWord = null;
        room.impostorId = null;
      }
    }
  }

  if (room.players.length === 0 && now - room.createdAt > 30 * 60 * 1000) {
    rooms.delete(room.code);
  }
}

export function joinRoom(
  roomCode: string,
  playerId: string,
  playerName: string,
  isHostReq = false
): { room: Room; player: Player } {
  const cleanCode = roomCode.toUpperCase().trim();
  const room = rooms.get(cleanCode);

  if (!room) {
    throw new Error('Sala não encontrada');
  }

  cleanOfflinePlayers(room);

  let existingPlayer = room.players.find((p) => p.id === playerId);
  const isFirstPlayer = room.players.length === 0;
  const isHost = isHostReq || isFirstPlayer || room.hostId === playerId;

  if (existingPlayer) {
    existingPlayer.name = playerName.trim();
    existingPlayer.lastSeen = Date.now();
    if (isHost) {
      existingPlayer.isHost = true;
      room.hostId = existingPlayer.id;
    }
  } else {
    existingPlayer = {
      id: playerId,
      name: playerName.trim(),
      isHost,
      lastSeen: Date.now()
    };
    room.players.push(existingPlayer);
    if (isHost) {
      room.hostId = playerId;
    }
  }

  return { room, player: existingPlayer };
}

export function updateHeartbeat(
  roomCode: string,
  playerId: string,
  playerName?: string
): Room | null {
  const cleanCode = roomCode.toUpperCase().trim();
  const room = rooms.get(cleanCode);
  if (!room) return null;

  let player = room.players.find((p) => p.id === playerId);
  if (player) {
    player.lastSeen = Date.now();
  } else if (playerName && playerName.trim()) {
    player = {
      id: playerId,
      name: playerName.trim(),
      isHost: room.players.length === 0,
      lastSeen: Date.now()
    };
    room.players.push(player);
    if (room.players.length === 1) {
      room.hostId = playerId;
    }
  } else {
    return null;
  }

  cleanOfflinePlayers(room);
  return room;
}

export function removePlayer(roomCode: string, playerId: string): void {
  const cleanCode = roomCode.toUpperCase().trim();
  const room = rooms.get(cleanCode);
  if (!room) return;

  room.players = room.players.filter((p) => p.id !== playerId);
  cleanOfflinePlayers(room);
}

export function changeRoomTheme(roomCode: string, playerId: string, themeId: string): Room {
  const cleanCode = roomCode.toUpperCase().trim();
  const room = rooms.get(cleanCode);
  if (!room) throw new Error('Sala não encontrada');

  const themeExists = THEMES.some((t) => t.id === themeId);
  if (!themeExists) throw new Error('Tema inválido');

  room.selectedThemeId = themeId;
  return room;
}

// =======================
// INFILTRADO GAME LOGIC
// =======================

export function startGameRound(roomCode: string, playerId: string): Room {
  const cleanCode = roomCode.toUpperCase().trim();
  const room = rooms.get(cleanCode);
  if (!room) throw new Error('Sala não encontrada');

  cleanOfflinePlayers(room);

  if (room.gameMode === 'twin') {
    return startTwinGame(roomCode);
  }

  if (room.players.length < 3) {
    throw new Error('São necessários no mínimo 3 jogadores online para iniciar a partida.');
  }

  const randomIndex = Math.floor(Math.random() * room.players.length);
  const impostor = room.players[randomIndex];
  room.impostorId = impostor.id;

  const { word, themeName } = getRandomWordFromTheme(room.selectedThemeId);
  room.currentWord = word;
  room.currentThemeName = themeName;
  room.status = 'drawing';
  room.roundStartedAt = Date.now();

  room.players.forEach((p) => {
    p.role = p.id === impostor.id ? 'impostor' : 'player';
  });

  return room;
}

export function resetRound(roomCode: string): Room {
  const cleanCode = roomCode.toUpperCase().trim();
  const room = rooms.get(cleanCode);
  if (!room) throw new Error('Sala não encontrada');

  room.status = 'lobby';
  room.currentWord = null;
  room.impostorId = null;
  room.roundStartedAt = null;
  room.players.forEach((p) => {
    p.role = undefined;
  });

  // Reset twin state as well
  room.twinRound = 1;
  room.twinInitialPrompt = null;
  room.twinSubmissions = {};
  room.twinHistory = [];
  room.twinMatched = false;

  return room;
}

export function revealImpostor(roomCode: string): Room {
  const cleanCode = roomCode.toUpperCase().trim();
  const room = rooms.get(cleanCode);
  if (!room) throw new Error('Sala não encontrada');

  room.status = 'ended';
  return room;
}

// ===========================
// PALAVRA GÊMEA (TWIN) LOGIC
// ===========================

function normalizeWord(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export function startTwinGame(roomCode: string): Room {
  const cleanCode = roomCode.toUpperCase().trim();
  const room = rooms.get(cleanCode);
  if (!room) throw new Error('Sala não encontrada');

  cleanOfflinePlayers(room);

  if (room.players.length < 2) {
    throw new Error('São necessários 2 jogadores online para o modo Palavra Gêmea.');
  }

  const theme = THEMES.find((t) => t.id === room.selectedThemeId) || THEMES[0];
  room.twinRound = 1;
  room.twinInitialPrompt = `${theme.emoji} ${theme.name}`;
  room.twinSubmissions = {};
  room.twinHistory = [];
  room.twinMatched = false;
  room.status = 'twin_playing';
  room.roundStartedAt = Date.now();

  return room;
}

export function submitTwinWord(roomCode: string, playerId: string, word: string): Room {
  const cleanCode = roomCode.toUpperCase().trim();
  const room = rooms.get(cleanCode);
  if (!room) throw new Error('Sala não encontrada');

  if (!word.trim()) throw new Error('Palavra não pode ser vazia');

  room.twinSubmissions[playerId] = word.trim();

  // Check if both players (2 players) have submitted
  if (room.players.length >= 2) {
    const p1 = room.players[0];
    const p2 = room.players[1];
    const w1 = room.twinSubmissions[p1.id];
    const w2 = room.twinSubmissions[p2.id];

    if (w1 && w2) {
      const isMatch = normalizeWord(w1) === normalizeWord(w2);
      room.twinMatched = isMatch;
      room.twinHistory.push({
        round: room.twinRound,
        p1Name: p1.name,
        p1Word: w1,
        p2Name: p2.name,
        p2Word: w2,
        matched: isMatch
      });

      room.status = isMatch ? 'twin_matched' : 'twin_revealed';
    }
  }

  return room;
}

export function nextTwinRound(roomCode: string): Room {
  const cleanCode = roomCode.toUpperCase().trim();
  const room = rooms.get(cleanCode);
  if (!room) throw new Error('Sala não encontrada');

  room.twinRound += 1;
  room.twinSubmissions = {};
  room.status = 'twin_playing';
  room.roundStartedAt = Date.now();

  return room;
}

// =======================
// CLIENT STATE SERIALIZER
// =======================

export function getClientState(room: Room, playerId: string): ClientRoomState {
  const isHost = room.hostId === playerId;
  const player = room.players.find((p) => p.id === playerId);
  const isImpostor = player?.role === 'impostor';

  let impostorName: string | null = null;
  if (room.status === 'ended' && room.impostorId) {
    const imp = room.players.find((p) => p.id === room.impostorId);
    impostorName = imp ? imp.name : null;
  }

  // Palavra Gêmea calculations:
  const isTwinRevealed =
    room.status === 'twin_revealed' || room.status === 'twin_matched';
  const partner = room.players.find((p) => p.id !== playerId);
  const twinSubmitted = Boolean(room.twinSubmissions[playerId]);
  const twinPartnerSubmitted = Boolean(partner && room.twinSubmissions[partner.id]);

  let twinCurrentWords = null;
  if (isTwinRevealed && room.players.length >= 2) {
    const p1 = room.players[0];
    const p2 = room.players[1];
    twinCurrentWords = {
      p1Name: p1.name,
      p1Word: room.twinSubmissions[p1.id] || '',
      p2Name: p2.name,
      p2Word: room.twinSubmissions[p2.id] || ''
    };
  }

  return {
    code: room.code,
    gameMode: room.gameMode,
    hostId: room.hostId,
    isHost,
    selectedThemeId: room.selectedThemeId,
    status: room.status,
    roundStartedAt: room.roundStartedAt,
    players: room.players.map((p) => ({
      id: p.id,
      name: p.name,
      isHost: p.id === room.hostId,
      isCurrent: p.id === playerId
    })),
    myRole: player?.role || null,
    themeName: room.currentThemeName,
    secretWord: isImpostor ? null : room.currentWord,
    impostorName,

    twinRound: room.twinRound,
    twinInitialPrompt: room.twinInitialPrompt,
    twinSubmitted,
    twinPartnerSubmitted,
    twinHistory: room.twinHistory,
    twinCurrentWords,
    twinMatched: room.twinMatched
  };
}
