import { NextResponse } from 'next/server';
import { joinRoom, getClientState } from '@/lib/roomStore';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await request.json();
    const { playerId, playerName, isHost } = body;

    if (!playerId || !playerName || !playerName.trim()) {
      return NextResponse.json(
        { success: false, message: 'ID e Nome do jogador são obrigatórios' },
        { status: 400 }
      );
    }

    const { room } = joinRoom(code, playerId, playerName, isHost);
    const clientState = getClientState(room, playerId);

    return NextResponse.json({
      success: true,
      state: clientState
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao entrar na sala' },
      { status: 400 }
    );
  }
}
