import { NextResponse } from 'next/server';
import { removePlayer } from '@/lib/roomStore';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    let playerId: string | null = null;

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      playerId = body.playerId;
    } else {
      const text = await request.text();
      try {
        const parsed = JSON.parse(text);
        playerId = parsed.playerId;
      } catch {
        playerId = text;
      }
    }

    if (playerId) {
      removePlayer(code, playerId);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao sair da sala' },
      { status: 400 }
    );
  }
}
