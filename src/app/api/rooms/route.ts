import { NextResponse } from 'next/server';
import { createRoom, getRoom, GameMode } from '@/lib/roomStore';

export async function POST(request: Request) {
  try {
    let gameMode: GameMode = 'infiltrado';
    try {
      const body = await request.json();
      if (body.gameMode === 'twin' || body.gameMode === 'infiltrado') {
        gameMode = body.gameMode;
      }
    } catch {
      // No body or empty body, default to 'infiltrado'
    }

    const room = createRoom(gameMode);
    return NextResponse.json({
      success: true,
      roomCode: room.code,
      gameMode: room.gameMode
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao criar sala' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { success: false, message: 'Código não fornecido' },
      { status: 400 }
    );
  }

  const room = getRoom(code);
  if (!room) {
    return NextResponse.json(
      { success: false, message: 'Sala não encontrada ou expirada' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    code: room.code,
    gameMode: room.gameMode,
    playersCount: room.players.length
  });
}
