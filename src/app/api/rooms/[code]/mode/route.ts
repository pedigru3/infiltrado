import { NextResponse } from 'next/server';
import { changeGameMode, getClientState, GameMode } from '@/lib/roomStore';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await request.json();
    const { playerId, gameMode } = body;

    if (!playerId || !gameMode) {
      return NextResponse.json(
        { success: false, message: 'Dados insuficientes' },
        { status: 400 }
      );
    }

    const validMode: GameMode = gameMode === 'undercover' ? 'undercover' : 'classic';
    const room = await changeGameMode(code, playerId, validMode);
    const clientState = getClientState(room, playerId);

    return NextResponse.json({
      success: true,
      state: clientState
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao alterar modo de jogo' },
      { status: 400 }
    );
  }
}
