import type { Metadata } from 'next';
import Link from 'next/link';
import { getPuzzleBySlug, getAllPuzzleSlugs } from '@/lib/puzzles';
import { getDailyPuzzleSlug } from '@/lib/utils/daily';
import { DailyPuzzleClient } from '@/components/game/DailyPuzzleClient';
import { getTranslations } from '@/i18n';
import type { Locale } from '@/i18n/config';

const NON_FR_LOCALES = ['en', 'es', 'ja'] as const;

export async function generateStaticParams() {
  const slugs = await getAllPuzzleSlugs();
  return NON_FR_LOCALES.flatMap(locale =>
    slugs.map(slug => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = getTranslations(locale);
  const puzzle = await getPuzzleBySlug(slug);
  const difficulty = t.difficulty[puzzle.difficulty as keyof typeof t.difficulty] ?? puzzle.difficulty;

  return {
    title: t.seo.puzzleTitle(puzzle.name, puzzle.size),
    description: t.seo.puzzleDescription(puzzle.name, difficulty, puzzle.size),
    alternates: {
      canonical: `https://nonogramme.com/${locale}/puzzle/${slug}`,
      languages: {
        fr: `https://nonogramme.com/puzzle/${slug}`,
        en: `https://nonogramme.com/en/puzzle/${slug}`,
        es: `https://nonogramme.com/es/puzzle/${slug}`,
        ja: `https://nonogramme.com/ja/puzzle/${slug}`,
      },
    },
  };
}

export default async function LocalePuzzlePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
  searchParams: Promise<{ level?: string }>;
}) {
  const [{ locale, slug }, { level }] = await Promise.all([params, searchParams]);
  const t = getTranslations(locale);
  const prefix = `/${locale}`;
  const levelNumber = level ? parseInt(level) : undefined;

  const [puzzle, allSlugs] = await Promise.all([getPuzzleBySlug(slug), getAllPuzzleSlugs()]);
  const isDaily = getDailyPuzzleSlug(new Date(), allSlugs) === slug;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Link href={prefix} style={{ color: '#8892a4', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
        {levelNumber ? `← ${t.game.backToProgress}` : `← ${t.game.allPuzzles}`}
      </Link>
      <DailyPuzzleClient puzzle={puzzle} isDaily={isDaily} levelNumber={levelNumber} locale={locale} />
    </div>
  );
}
