import type { Metadata } from 'next';
import Link from 'next/link';
import { getPuzzleBySlug, getAllPuzzleSlugs } from '@/lib/puzzles';
import { getDailyPuzzleSlug } from '@/lib/utils/daily';
import { DailyPuzzleClient } from '@/components/game/DailyPuzzleClient';

export async function generateStaticParams() {
  const slugs = await getAllPuzzleSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const puzzle = await getPuzzleBySlug(slug);

  return {
    title: `${puzzle.name} — Nonogramme ${puzzle.size}×${puzzle.size}`,
    description: `Jouez au nonogramme "${puzzle.name}" — ${puzzle.difficulty}, ${puzzle.size}×${puzzle.size}. Révèle l'image cachée gratuitement.`,
    keywords: [
      'nonogramme', 'picross', 'logimage', puzzle.name,
      `nonogramme ${puzzle.size}x${puzzle.size}`,
      ...puzzle.meta.tags,
    ],
    openGraph: {
      title: `${puzzle.name} — Nonogramme ${puzzle.size}×${puzzle.size}`,
      description: `Puzzle de logique gratuit — ${puzzle.difficulty}`,
      images: [{ url: '/og-image.svg', width: 1200, height: 630 }],
    },
    alternates: { canonical: `https://nonogramme.com/puzzle/${slug}` },
  };
}

export default async function PuzzlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [puzzle, allSlugs] = await Promise.all([getPuzzleBySlug(slug), getAllPuzzleSlugs()]);
  const isDaily = getDailyPuzzleSlug(new Date(), allSlugs) === slug;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Link href="/" style={{
        color: '#8892a4',
        fontSize: '0.8rem',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
      }}>
        ← Tous les puzzles
      </Link>
      <DailyPuzzleClient puzzle={puzzle} isDaily={isDaily} />
    </div>
  );
}
