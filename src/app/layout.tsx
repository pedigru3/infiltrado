import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Infiltrado - Jogo Multiplayer Secreto',
  description: 'Descubra quem é o impostor! Jogo social moderno e dinâmico, otimizado para celulares.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#07090e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="antialiased selection:bg-cyan-500 selection:text-black">
        <main className="min-h-screen min-h-[100dvh] flex flex-col justify-between max-w-md mx-auto px-4 py-6 sm:py-8 relative">
          {children}
        </main>
      </body>
    </html>
  );
}
