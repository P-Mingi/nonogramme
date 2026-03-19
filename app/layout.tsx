import type { Metadata, Viewport } from 'next';
import { DeepSpaceLayout } from '@/components/ui/DeepSpaceLayout';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#4ecdc4',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://nonogramme.com'),
  title: {
    default: 'Nonogramme.com — Jeux de logique gratuits',
    template: '%s | Nonogramme.com',
  },
  description: 'Révèle des dessins cachés en résolvant des puzzles de logique japonais. Nonogrammes, picross et logimages gratuits en ligne — facile, moyen, difficile, expert.',
  keywords: [
    'nonogramme', 'picross', 'logimage', 'hanjie', 'griddler',
    'jeu de logique', 'puzzle gratuit', 'jeu en ligne', 'casse-tête',
    'nonogramme facile', 'nonogramme difficile', 'picross en ligne',
  ],
  authors: [{ name: 'Nonogramme.com' }],
  creator: 'Nonogramme.com',
  publisher: 'Nonogramme.com',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://nonogramme.com',
    siteName: 'Nonogramme.com',
    title: 'Nonogramme.com — Jeux de logique gratuits',
    description: 'Révèle des dessins cachés. Puzzles de logique gratuits — nonogramme, picross, logimage.',
    images: [{
      url: '/og-image.svg',
      width: 1200,
      height: 630,
      alt: 'Nonogramme.com — Jeux de logique gratuits',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nonogramme.com — Jeux de logique gratuits',
    description: 'Révèle des dessins cachés. Puzzles de logique gratuits.',
    images: ['/og-image.svg'],
  },
  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icon.svg', color: '#4ecdc4' },
    ],
  },
  manifest: '/site.webmanifest',
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
  alternates: {
    canonical: 'https://nonogramme.com',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Nonogramme.com',
              url: 'https://nonogramme.com',
              description: 'Jeux de nonogramme gratuits en ligne',
              inLanguage: 'fr-FR',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://nonogramme.com/puzzle/{search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <DeepSpaceLayout>{children}</DeepSpaceLayout>
      </body>
    </html>
  );
}
