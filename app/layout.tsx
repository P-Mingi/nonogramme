import type { Metadata } from 'next';
import { DeepSpaceLayout } from '@/components/ui/DeepSpaceLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nonogramme.com — Jeu de logique gratuit',
  description: 'Révèle des dessins cachés en résolvant des puzzles de logique. Nonogrammes gratuits en ligne — facile, moyen, difficile, expert.',
  keywords: ['nonogramme', 'picross', 'logimage', 'jeu de logique', 'puzzle gratuit'],
  openGraph: {
    title: 'Nonogramme.com — Jeu de logique gratuit',
    description: 'Révèle des dessins cachés. Puzzles de logique gratuits.',
    url: 'https://nonogramme.com',
    siteName: 'Nonogramme.com',
    locale: 'fr_FR',
    type: 'website',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://nonogramme.com' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        <DeepSpaceLayout>{children}</DeepSpaceLayout>
      </body>
    </html>
  );
}
