import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Infiltrado - Jogo de Dedução Secreta';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#141518',
          position: 'relative',
          padding: '60px',
        }}
      >
        {/* Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            backgroundColor: 'rgba(200, 245, 96, 0.12)',
            filter: 'blur(90px)',
          }}
        />

        {/* Top Secret Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 24px',
            borderRadius: '999px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#c8f560',
            fontSize: '18px',
            fontWeight: 800,
            letterSpacing: '3px',
            marginBottom: '32px',
          }}
        >
          ● JOGO DE DEDUÇÃO • ONLINE
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: '76px',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-2px',
            lineHeight: 1.1,
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          Descubra o <span style={{ color: '#c8f560', marginLeft: '16px' }}>Infiltrado</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '26px',
            color: '#9498a4',
            maxWidth: '750px',
            textAlign: 'center',
            lineHeight: 1.4,
            marginBottom: '40px',
          }}
        >
          Todos recebem a palavra secreta, exceto o espião. Blefe, faça perguntas discretas e jogue com seus amigos no celular!
        </div>

        {/* Pill Tags */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
          }}
        >
          <div
            style={{
              padding: '12px 28px',
              borderRadius: '999px',
              backgroundColor: '#c8f560',
              color: '#141518',
              fontSize: '20px',
              fontWeight: 800,
            }}
          >
            👥 3 a 12 Jogadores
          </div>
          <div
            style={{
              padding: '12px 28px',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: 700,
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            ⚡ Sem Download • No Navegador
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
