import { NextResponse } from 'next/server';
import { changeImpostorCount, getClientState } from '@/lib/roomStore';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await request.json();
    const { playerId, count } = body;

    if (!playerId || typeof count !== 'number') {
      return NextResponse.json(
        { success: false, message: 'Dados insuficientes' },
        { status: 400 }
      );
    }

    const room = await changeImpostorCount(code, playerId, count);
    const clientState = getClientState(room, playerId);

    return NextResponse.json({
      success: true,
      state: clientState
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao alterar quantidade de infiltrados' },
      { status: 400 }
    );
  }
}
