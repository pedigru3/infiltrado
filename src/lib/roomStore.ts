import { Redis } from '@upstash/redis';
import { THEMES, getRandomWordFromTheme } from '@/data/themes';
import { getUndercoverWordPair } from '@/data/wordClusters';

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  lastSeen: number;
  role?: 'player' | 'impostor';
}

export type RoomStatus = 'lobby' | 'drawing' | 'playing' | 'ended';
export type GameMode = 'classic' | 'undercover';

export interface Room {
  code: string;
  createdAt: number;
  hostId: string;
  selectedThemeId: string;
  impostorCount: number;
  gameMode: GameMode;
  status: RoomStatus;
  currentThemeName: string | null;
  currentWord: string | null;
  impostorWord: string | null;
  impostorId: string | null;
  impostorIds: string[];
  roundStartedAt: number | null;
  players: Player[];
}

export interface ClientRoomState {
  code: string;
  hostId: string;
  isHost: boolean;
  selectedThemeId: string;
  impostorCount: number;
  gameMode: GameMode;
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
  secretWord: string | null; // null if classic impostor, impostorWord if undercover
  civilianWord?: string | null; // revealed when ended
  impostorWord?: string | null; // revealed when ended
  impostorName?: string | null; // only revealed when status === 'ended'
  impostorNames?: string[];
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

// 60 segundos de tolerância para quedas temporárias de rede e trocas de app no celular no Lobby
const LOBBY_HEARTBEAT_TIMEOUT_MS = 60000;
// 30 minutos de silêncio absoluto de todos os jogadores para encerrar e limpar salas abandonadas
const ABANDONED_ROOM_TIMEOUT_MS = 30 * 60 * 1000;
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateRandomCode(): string {
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
  }
  return code;
}

function isRoomAbandoned(room: Room): boolean {
  const now = Date.now();
  if (room.players.length === 0) {
    return now - room.createdAt > 10 * 60 * 1000;
  }
  const latestSeen = Math.max(...room.players.map((p) => p.lastSeen || 0));
  return now - latestSeen > ABANDONED_ROOM_TIMEOUT_MS;
}

async function fetchRoom(code: string): Promise<Room | null> {
  const cleanCode = code.toUpperCase().trim();
  let room: Room | null = null;

  if (redis) {
    try {
      const data = await redis.get<Room>(`infiltrado:room:${cleanCode}`);
      if (data) {
        room = data;
        memoryRooms.set(cleanCode, data);
      }
    } catch (err) {
      console.error('Erro ao ler sala no Redis:', err);
    }
  }

  if (!room) {
    room = memoryRooms.get(cleanCode) || null;
  }

  if (room && isRoomAbandoned(room)) {
    await deleteRoom(cleanCode);
    return null;
  }

  return room;
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
    selectedThemeId: 'aleatorio',
    impostorCount: 1,
    gameMode: 'classic',
    status: 'lobby',
    currentThemeName: null,
    currentWord: null,
    impostorWord: null,
    impostorId: null,
    impostorIds: [],
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
  // Durante a partida (drawing, playing ou ended), NUNCA expulsar jogadores e NUNCA cancelar a rodada por inatividade de ping!
  if (room.status !== 'lobby') {
    return false;
  }

  const now = Date.now();
  const activePlayers = room.players.filter((p) => now - p.lastSeen <= LOBBY_HEARTBEAT_TIMEOUT_MS);
  let changed = false;

  if (activePlayers.length !== room.players.length) {
    room.players = activePlayers;
    changed = true;

    // Se o líder saiu do lobby, passa liderança para o próximo jogador online
    if (activePlayers.length > 0) {
      const currentHostExists = activePlayers.some((p) => p.id === room.hostId);
      if (!currentHostExists) {
        activePlayers[0].isHost = true;
        room.hostId = activePlayers[0].id;
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

export async function changeImpostorCount(roomCode: string, playerId: string, count: number): Promise<Room> {
  const cleanCode = roomCode.toUpperCase().trim();
  const room = await fetchRoom(cleanCode);
  if (!room) throw new Error('Sala não encontrada');

  const safeCount = Math.max(1, Math.min(count, 3));
  room.impostorCount = safeCount;
  await saveRoom(room);
  return room;
}

export async function changeGameMode(roomCode: string, playerId: string, gameMode: GameMode): Promise<Room> {
  const cleanCode = roomCode.toUpperCase().trim();
  const room = await fetchRoom(cleanCode);
  if (!room) throw new Error('Sala não encontrada');

  room.gameMode = gameMode === 'undercover' ? 'undercover' : 'classic';
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

  const requestedCount = Math.max(1, Math.min(room.impostorCount || 1, 3));
  // Limite máximo: garante que haja pelo menos 1 jogador inocente com a palavra secreta
  const maxImpostors = Math.max(1, room.players.length - 1);
  const effectiveCount = Math.min(requestedCount, maxImpostors);

  // Embaralha e seleciona exatamente a quantidade solicitada de infiltrados aleatórios
  const shuffled = [...room.players].sort(() => Math.random() - 0.5);
  const impostors = shuffled.slice(0, effectiveCount);
  const impostorIds = impostors.map((imp) => imp.id);

  room.impostorIds = impostorIds;
  room.impostorId = impostorIds[0] || null;

  if (room.gameMode === 'undercover') {
    const pair = getUndercoverWordPair(room.selectedThemeId);
    room.currentWord = pair.civilianWord;
    room.impostorWord = pair.impostorWord;
    room.currentThemeName = pair.themeName;
  } else {
    const { word, themeName } = getRandomWordFromTheme(room.selectedThemeId);
    room.currentWord = word;
    room.impostorWord = null;
    room.currentThemeName = themeName;
  }

  room.status = 'drawing';
  room.roundStartedAt = Date.now();

  room.players.forEach((p) => {
    p.role = impostorIds.includes(p.id) ? 'impostor' : 'player';
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
  room.impostorWord = null;
  room.impostorId = null;
  room.impostorIds = [];
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

  const impostorIds = room.impostorIds && room.impostorIds.length > 0
    ? room.impostorIds
    : (room.impostorId ? [room.impostorId] : []);

  const isImpostor = impostorIds.includes(playerId) || player?.role === 'impostor';

  let impostorNames: string[] = [];
  if (room.status === 'ended') {
    impostorNames = room.players
      .filter((p) => impostorIds.includes(p.id))
      .map((p) => p.name);
  }

  const myRole = room.status === 'lobby'
    ? null
    : (room.gameMode === 'undercover' && room.status !== 'ended'
        ? 'player'
        : (isImpostor ? 'impostor' : 'player'));

  let secretWord: string | null = null;
  if (room.status !== 'lobby') {
    if (isImpostor) {
      secretWord = room.gameMode === 'undercover' ? room.impostorWord : null;
    } else {
      secretWord = room.currentWord;
    }
  }

  return {
    code: room.code,
    hostId: room.hostId,
    isHost,
    selectedThemeId: room.selectedThemeId,
    impostorCount: room.impostorCount || 1,
    gameMode: room.gameMode || 'classic',
    status: room.status,
    roundStartedAt: room.roundStartedAt,
    players: room.players.map((p) => ({
      id: p.id,
      name: p.name,
      isHost: p.id === room.hostId,
      isCurrent: p.id === playerId
    })),
    myRole,
    themeName: room.currentThemeName,
    secretWord,
    civilianWord: room.status === 'ended' ? room.currentWord : null,
    impostorWord: room.status === 'ended' ? room.impostorWord : null,
    impostorName: impostorNames.length > 0 ? impostorNames.join(' e ') : null,
    impostorNames
  };
}
