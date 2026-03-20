import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPuzzleBySlug, getAllPuzzleSlugs, isPuzzleInCatalog, communityRowToPuzzle } from '@/lib/puzzles';
import { getDailyPuzzleSlug } from '@/lib/utils/daily';
import { DailyPuzzleClient } from '@/components/game/DailyPuzzleClient';
import { createClient } from '@/lib/supabase/server';
import { CreatedBanner } from '@/components/CreatedBanner';
import type { Puzzle } from '@/types/puzzle';

async function loadPuzzle(slug: string): Promise<Puzzle | null> {
  if (isPuzzleInCatalog(slug)) {
    return getPuzzleBySlug(slug);
  }
  // Try community puzzles in Supabase
  const supabase = await createClient();
  const { data } = await supabase
    .from('puzzles')
    .select('*, profiles!created_by(username)')
    .eq('slug', slug)
    .eq('is_community', true)
    .eq('status', 'approved')
    .single();

  if (!data) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row = { ...data, creator_username: (data as any).profiles?.username };
  return communityRowToPuzzle(row);
}

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
  const puzzle = await loadPuzzle(slug);
  if (!puzzle) return { title: 'Puzzle introuvable' };

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
    },
    alternates: { canonical: `https://nonogramme.com/puzzle/${slug}` },
  };
}

export default async function PuzzlePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ level?: string; created?: string }>;
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const levelNumber = sp.level ? parseInt(sp.level) : undefined;
  const justCreated = sp.created === 'true';

  const [puzzle, allSlugs] = await Promise.all([loadPuzzle(slug), getAllPuzzleSlugs()]);

  if (!puzzle) notFound();

  const isDaily = getDailyPuzzleSlug(new Date(), allSlugs) === slug;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Link href="/" style={{
        color: '#8892a4', fontSize: '0.8rem', textDecoration: 'none',
        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
      }}>
        {levelNumber ? '← Retour à la progression' : '← Accueil'}
      </Link>
      {justCreated && <CreatedBanner slug={slug} />}
      <DailyPuzzleClient puzzle={puzzle} isDaily={isDaily} levelNumber={levelNumber} />
    </div>
  );
}
