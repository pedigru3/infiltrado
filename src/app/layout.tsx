import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Infiltrado - Jogo de Dedução Secreta',
  description: 'Descubra quem é o impostor! Jogo social moderno, simples e otimizado para celulares.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#f5f5f0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#f5f5f0] text-[#141518] antialiased selection:bg-[#c8f560] selection:text-black">
        <main className="min-h-screen min-h-[100dvh] flex flex-col justify-between max-w-[430px] mx-auto px-4 py-5 sm:py-7 relative">
          {children}
        </main>
      </body>
    </html>
  );
}
