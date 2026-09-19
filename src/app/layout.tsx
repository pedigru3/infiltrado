import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Infiltrado • Jogo de Espião e Dedução Online com Amigos',
  description: 'Descubra quem é o Infiltrado na sala! Jogo multiplayer online gratuito para celular e navegador. Todos recebem a palavra secreta, exceto o espião.',
  applicationName: 'Infiltrado',
  keywords: [
    'infiltrado',
    'jogo infiltrado',
    'jogo do espião',
    'jogo do impostor',
    'spyfall online',
    'spyfall portugues',
    'undercover online',
    'party game online',
    'jogos de blefe',
    'jogos para jogar com amigos',
    'jogos no celular sem instalar',
    'palavra secreta',
    'jogo de dedução',
    'jogos de festa'
  ],
  authors: [{ name: 'Infiltrado Game' }],
  creator: 'Infiltrado Game',
  publisher: 'Infiltrado Game',
  formatDetection: {
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://infiltrado.app',
    siteName: 'Infiltrado Game',
    title: 'Infiltrado • Descubra quem é o Espião na Sala',
    description: 'Jogo multiplayer gratuito no navegador. Todos recebem a palavra secreta, exceto um. Descubra quem está fingindo!',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Infiltrado • Jogo de Dedução e Espionagem',
    description: 'Jogue online com seus amigos sem precisar baixar nenhum app. Descubra o infiltrado na sala!',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#141518',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Infiltrado',
  url: 'https://infiltrado.app',
  description: 'Jogo social multiplayer online gratuito de dedução e espionagem.',
  applicationCategory: 'GameApplication',
  genre: 'Party Game, Dedução, Blefe',
  operatingSystem: 'All',
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'BRL',
  },
  inLanguage: 'pt-BR',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W4T3J37TK5"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W4T3J37TK5');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#f5f5f0] text-[#141518] antialiased selection:bg-[#c8f560] selection:text-black">
        <main className="min-h-screen min-h-[100dvh] flex flex-col justify-between max-w-[430px] mx-auto px-4 py-5 sm:py-7 relative">
          {children}
        </main>
      </body>
    </html>
  );
}
