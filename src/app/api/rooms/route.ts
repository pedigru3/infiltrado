import { NextResponse } from 'next/server';
import { createRoom, getRoom } from '@/lib/roomStore';

export async function POST() {
  try {
    const room = await createRoom();
    return NextResponse.json({
      success: true,
      roomCode: room.code
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

  const room = await getRoom(code);
  if (!room) {
    return NextResponse.json(
      { success: false, message: 'Sala não encontrada ou expirada' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    code: room.code,
    playersCount: room.players.length
  });
}
