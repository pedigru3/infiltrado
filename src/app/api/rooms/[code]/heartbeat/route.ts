import { NextResponse } from 'next/server';
import { updateHeartbeat, getClientState } from '@/lib/roomStore';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await request.json();
    const { playerId, playerName } = body;

    if (!playerId) {
      return NextResponse.json(
        { success: false, message: 'ID do jogador não fornecido' },
        { status: 400 }
      );
    }

    const room = await updateHeartbeat(code, playerId, playerName);

    if (!room) {
      return NextResponse.json(
        { success: false, message: 'Você foi desconectado da sala por inatividade' },
        { status: 404 }
      );
    }

    const clientState = getClientState(room, playerId);

    return NextResponse.json({
      success: true,
      state: clientState
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: error.message || 'Erro no heartbeat' },
      { status: 500 }
    );
  }
}
