import { THEMES, getRandomWordFromTheme } from '@/data/themes';

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  lastSeen: number;
  role?: 'player' | 'impostor';
}

export type RoomStatus = 'lobby' | 'drawing' | 'playing' | 'ended';

export interface Room {
  code: string;
  createdAt: number;
  hostId: string;
  selectedThemeId: string;
  status: RoomStatus;
  currentThemeName: string | null;
  currentWord: string | null;
  impostorId: string | null;
  roundStartedAt: number | null;
  players: Player[];
}

export interface ClientRoomState {
  code: string;
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
  // Player specific secrets:
  myRole: 'player' | 'impostor' | null;
  themeName: string | null;
  secretWord: string | null; // null if impostor!
  impostorName?: string | null; // only revealed when status === 'ended'
}

declare global {
  // eslint-disable-next-line no-var
  var __infiltrado_rooms__: Map<string, Room> | undefined;
}

const rooms: Map<string, Room> = globalThis.__infiltrado_rooms__ || new Map<string, Room>();
globalThis.__infiltrado_rooms__ = rooms;

// 45 segundos de tolerância para quedas temporárias de rede e trocas de app no celular
const HEARTBEAT_TIMEOUT_MS = 45000;
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

export function createRoom(): Room {
  const code = generateUniqueCode();
  const room: Room = {
    code,
    createdAt: Date.now(),
    hostId: '',
    selectedThemeId: 'comidas',
    status: 'lobby',
    currentThemeName: null,
    currentWord: null,
    impostorId: null,
    roundStartedAt: null,
    players: []
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

    // Se o líder saiu, passa liderança para o próximo jogador online
    if (activePlayers.length > 0) {
      const currentHostExists = activePlayers.some((p) => p.id === room.hostId);
      if (!currentHostExists) {
        activePlayers[0].isHost = true;
        room.hostId = activePlayers[0].id;
      }
    }

    // Se o infiltrado saiu durante o jogo, volta para o lobby
    if (room.status !== 'lobby' && room.impostorId) {
      const impostorOnline = activePlayers.some((p) => p.id === room.impostorId);
      if (!impostorOnline) {
        room.status = 'lobby';
        room.currentWord = null;
        room.impostorId = null;
      }
    }
  }

  // Deleta salas vazias apenas se tiverem mais de 10 minutos de inatividade (protege criação recente)
  if (room.players.length === 0 && now - room.createdAt > 10 * 60 * 1000) {
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
    throw new Error('Sala não encontrada ou encerrada');
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
    // Auto-reconexão do jogador caso a aba tenha suspendido
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

export function startGameRound(roomCode: string, playerId: string): Room {
  const cleanCode = roomCode.toUpperCase().trim();
  const room = rooms.get(cleanCode);
  if (!room) throw new Error('Sala não encontrada');

  cleanOfflinePlayers(room);

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

  return room;
}

export function revealImpostor(roomCode: string): Room {
  const cleanCode = roomCode.toUpperCase().trim();
  const room = rooms.get(cleanCode);
  if (!room) throw new Error('Sala não encontrada');

  room.status = 'ended';
  return room;
}

export function getClientState(room: Room, playerId: string): ClientRoomState {
  const isHost = room.hostId === playerId;
  const player = room.players.find((p) => p.id === playerId);
  const isImpostor = player?.role === 'impostor';

  let impostorName: string | null = null;
  if (room.status === 'ended' && room.impostorId) {
    const imp = room.players.find((p) => p.id === room.impostorId);
    impostorName = imp ? imp.name : null;
  }

  return {
    code: room.code,
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
    impostorName
  };
}
