import { NextResponse } from 'next/server';
import { changeRoomTheme, getClientState } from '@/lib/roomStore';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await request.json();
    const { playerId, themeId } = body;

    if (!playerId || !themeId) {
      return NextResponse.json(
        { success: false, message: 'Dados insuficientes' },
        { status: 400 }
      );
    }

    const room = await changeRoomTheme(code, playerId, themeId);
    const clientState = getClientState(room, playerId);

    return NextResponse.json({
      success: true,
      state: clientState
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao alterar tema' },
      { status: 400 }
    );
  }
}
