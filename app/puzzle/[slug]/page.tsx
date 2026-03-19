import type { Metadata } from 'next';
import Link from 'next/link';
import { getPuzzleBySlug, getAllPuzzleSlugs } from '@/lib/puzzles';
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
    title: `${puzzle.name} — Nonogramme ${puzzle.size}×${puzzle.size} | Nonogramme`,
    description: `Jouez gratuitement au nonogramme "${puzzle.name}" (${puzzle.difficulty}, ${puzzle.size}×${puzzle.size}). ${puzzle.meta.og_description}`,
    keywords: [
      'nonogramme', 'picross', 'logimage', puzzle.name,
      `nonogramme ${puzzle.size}x${puzzle.size}`,
      ...puzzle.meta.tags,
    ],
  };
}

export default async function PuzzlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const puzzle = await getPuzzleBySlug(slug);
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
      <DailyPuzzleClient puzzle={puzzle} />
    </div>
  );
}
