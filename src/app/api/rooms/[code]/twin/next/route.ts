import { NextResponse } from 'next/server';
import { nextTwinRound, getClientState } from '@/lib/roomStore';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await request.json();
    const { playerId } = body;

    const room = nextTwinRound(code);
    const clientState = getClientState(room, playerId || '');

    return NextResponse.json({
      success: true,
      state: clientState
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao avançar rodada' },
      { status: 400 }
    );
  }
}
