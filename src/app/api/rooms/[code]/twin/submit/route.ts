import { NextResponse } from 'next/server';
import { submitTwinWord, getClientState } from '@/lib/roomStore';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await request.json();
    const { playerId, word } = body;

    if (!playerId || !word || !word.trim()) {
      return NextResponse.json(
        { success: false, message: 'Palavra e jogador são obrigatórios' },
        { status: 400 }
      );
    }

    const room = submitTwinWord(code, playerId, word);
    const clientState = getClientState(room, playerId);

    return NextResponse.json({
      success: true,
      state: clientState
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao enviar palavra' },
      { status: 400 }
    );
  }
}
