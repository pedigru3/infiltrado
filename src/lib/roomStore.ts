import { Redis } from '@upstash/redis';
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

const memoryRooms: Map<string, Room> = globalThis.__infiltrado_rooms__ || new Map<string, Room>();
globalThis.__infiltrado_rooms__ = memoryRooms;

// Inicializa cliente Upstash Redis se configurado
let redis: Redis | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } catch (err) {
    console.error('Falha ao conectar com Upstash Redis, usando fallback de memória:', err);
  }
}

// 45 segundos de tolerância para quedas temporárias de rede e trocas de app no celular
const HEARTBEAT_TIMEOUT_MS = 45000;
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateRandomCode(): string {
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
  }
  return code;
}

async function fetchRoom(code: string): Promise<Room | null> {
  const cleanCode = code.toUpperCase().trim();
  if (redis) {
    try {
      const data = await redis.get<Room>(`infiltrado:room:${cleanCode}`);
      if (data) {
        memoryRooms.set(cleanCode, data);
        return data;
      }
    } catch (err) {
      console.error('Erro ao ler sala no Redis:', err);
    }
  }
  return memoryRooms.get(cleanCode) || null;
}

async function saveRoom(room: Room): Promise<void> {
  const cleanCode = room.code.toUpperCase().trim();
  memoryRooms.set(cleanCode, room);

  if (redis) {
    try {
      // 24h de TTL para expirar salas abandonadas automaticamente
      await redis.set(`infiltrado:room:${cleanCode}`, room, { ex: 86400 });
    } catch (err) {
      console.error('Erro ao salvar sala no Redis:', err);
    }
  }
}

async function deleteRoom(code: string): Promise<void> {
  const cleanCode = code.toUpperCase().trim();
  memoryRooms.delete(cleanCode);

  if (redis) {
    try {
      await redis.del(`infiltrado:room:${cleanCode}`);
    } catch (err) {
      console.error('Erro ao deletar sala no Redis:', err);
    }
  }
}

export async function createRoom(): Promise<Room> {
  let code = '';
  let attempts = 0;
  while (attempts < 10) {
    code = generateRandomCode();
    const existing = await fetchRoom(code);
    if (!existing) break;
    attempts++;
  }

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

  await saveRoom(room);
  return room;
}

export async function getRoom(code: string): Promise<Room | undefined> {
  const room = await fetchRoom(code);
  if (room) {
    const changed = cleanOfflinePlayers(room);
    if (changed) {
      await saveRoom(room);
    }
    return room;
  }
  return undefined;
}

export function cleanOfflinePlayers(room: Room): boolean {
  const now = Date.now();
  const activePlayers = room.players.filter((p) => now - p.lastSeen <= HEARTBEAT_TIMEOUT_MS);
  let changed = false;

  if (activePlayers.length !== room.players.length) {
    room.players = activePlayers;
    changed = true;

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

  return changed;
}

export async function joinRoom(
  roomCode: string,
  playerId: string,
  playerName: string,
  isHostReq = false
): Promise<{ room: Room; player: Player }> {
  const cleanCode = roomCode.toUpperCase().trim();
  const room = await fetchRoom(cleanCode);

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

  await saveRoom(room);
  return { room, player: existingPlayer };
}

export async function updateHeartbeat(
  roomCode: string,
  playerId: string,
  playerName?: string
): Promise<Room | null> {
  const cleanCode = roomCode.toUpperCase().trim();
  const room = await fetchRoom(cleanCode);
  if (!room) return null;

  let player = room.players.find((p) => p.id === playerId);
  if (player) {
    player.lastSeen = Date.now();
  } else if (playerName && playerName.trim()) {
    // Auto-reconexão do jogador caso tenha suspendido
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
  await saveRoom(room);
  return room;
}

export async function removePlayer(roomCode: string, playerId: string): Promise<void> {
  const cleanCode = roomCode.toUpperCase().trim();
  const room = await fetchRoom(cleanCode);
  if (!room) return;

  room.players = room.players.filter((p) => p.id !== playerId);
  cleanOfflinePlayers(room);
  if (room.players.length === 0 && Date.now() - room.createdAt > 10 * 60 * 1000) {
    await deleteRoom(cleanCode);
  } else {
    await saveRoom(room);
  }
}

export async function changeRoomTheme(roomCode: string, playerId: string, themeId: string): Promise<Room> {
  const cleanCode = roomCode.toUpperCase().trim();
  const room = await fetchRoom(cleanCode);
  if (!room) throw new Error('Sala não encontrada');

  const themeExists = THEMES.some((t) => t.id === themeId);
  if (!themeExists) throw new Error('Tema inválido');

  room.selectedThemeId = themeId;
  await saveRoom(room);
  return room;
}

export async function startGameRound(roomCode: string, playerId: string): Promise<Room> {
  const cleanCode = roomCode.toUpperCase().trim();
  const room = await fetchRoom(cleanCode);
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

  await saveRoom(room);
  return room;
}

export async function resetRound(roomCode: string): Promise<Room> {
  const cleanCode = roomCode.toUpperCase().trim();
  const room = await fetchRoom(cleanCode);
  if (!room) throw new Error('Sala não encontrada');

  room.status = 'lobby';
  room.currentWord = null;
  room.impostorId = null;
  room.roundStartedAt = null;
  room.players.forEach((p) => {
    p.role = undefined;
  });

  await saveRoom(room);
  return room;
}

export async function revealImpostor(roomCode: string): Promise<Room> {
  const cleanCode = roomCode.toUpperCase().trim();
  const room = await fetchRoom(cleanCode);
  if (!room) throw new Error('Sala não encontrada');

  room.status = 'ended';
  await saveRoom(room);
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
