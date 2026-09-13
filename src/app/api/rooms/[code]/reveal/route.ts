import { NextResponse } from 'next/server';
import { revealImpostor, getClientState } from '@/lib/roomStore';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await request.json();
    const { playerId } = body;

    const room = revealImpostor(code);
    const clientState = getClientState(room, playerId || '');

    return NextResponse.json({
      success: true,
      state: clientState
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao revelar resultado' },
      { status: 400 }
    );
  }
}
