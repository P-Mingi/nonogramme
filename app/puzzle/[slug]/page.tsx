import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPuzzleBySlug, getAllPuzzleSlugs, isPuzzleInCatalog, communityRowToPuzzle } from '@/lib/puzzles';
import { getDailyPuzzleSlug } from '@/lib/utils/daily';
import { DailyPuzzleClient } from '@/components/game/DailyPuzzleClient';
import { createClient } from '@/lib/supabase/server';
import { CreatedBanner } from '@/components/CreatedBanner';
import { getTranslations } from '@/i18n';
import type { Locale } from '@/i18n/config';
import type { Puzzle } from '@/types/puzzle';

async function loadPuzzle(slug: string): Promise<Puzzle | null> {
  if (isPuzzleInCatalog(slug)) {
    return getPuzzleBySlug(slug);
  }
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
  const [puzzle, h] = await Promise.all([loadPuzzle(slug), headers()]);
  if (!puzzle) return { title: 'Puzzle introuvable' };

  const locale = (h.get('x-locale') || 'fr') as Locale;
  const t = getTranslations(locale);

  return {
    title: t.seo.puzzleTitle(puzzle.name, puzzle.size),
    description: t.seo.puzzleDescription(puzzle.name, t.difficulty[puzzle.difficulty as keyof typeof t.difficulty] ?? puzzle.difficulty, puzzle.size),
    keywords: ['nonogramme', 'picross', 'logimage', puzzle.name, `nonogramme ${puzzle.size}x${puzzle.size}`, ...puzzle.meta.tags],
    openGraph: {
      title: t.seo.puzzleTitle(puzzle.name, puzzle.size),
      description: `${puzzle.name} — ${puzzle.size}×${puzzle.size}`,
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
  const [{ slug }, sp, h] = await Promise.all([params, searchParams, headers()]);
  const locale = (h.get('x-locale') || 'fr') as Locale;
  const t = getTranslations(locale);

  const levelNumber = sp.level ? parseInt(sp.level) : undefined;
  const justCreated = sp.created === 'true';

  const [puzzle, allSlugs] = await Promise.all([loadPuzzle(slug), getAllPuzzleSlugs()]);

  if (!puzzle) notFound();

  const isDaily = getDailyPuzzleSlug(new Date(), allSlugs) === slug;
  const backLabel = levelNumber ? `← ${t.game.backToProgress}` : `← ${t.game.allPuzzles}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Link href="/" style={{
        color: '#8892a4', fontSize: '0.8rem', textDecoration: 'none',
        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
      }}>
        {backLabel}
      </Link>
      {justCreated && <CreatedBanner slug={slug} />}
      <DailyPuzzleClient puzzle={puzzle} isDaily={isDaily} levelNumber={levelNumber} locale={locale} />
    </div>
  );
}
