import catalogData from '@/data/puzzles/index.json';

interface CatalogEntry {
  slug: string;
  category: string;
  size: number;
  difficulty: string;
}

export interface LevelEntry {
  number: number;   // 1-indexed display number
  index: number;    // 0-indexed array position
  slug: string;
  category: string;
  size: number;
  difficulty: string;
  name: string;
  isPremium: boolean;
}

function nameFromSlug(slug: string): string {
  return slug
    .replace(/-\d+x\d+$/, '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function buildLevelOrder(puzzles: CatalogEntry[]): CatalogEntry[] {
  const buckets = {
    small_easy:   puzzles.filter(p => p.size === 5  && p.difficulty === 'facile'),
    large_easy:   puzzles.filter(p => p.size === 10 && p.difficulty === 'facile'),
    small_medium: puzzles.filter(p => p.size === 5  && p.difficulty === 'moyen'),
    large_medium: puzzles.filter(p => p.size === 10 && p.difficulty === 'moyen'),
    large_hard:   puzzles.filter(p => p.size === 10 && p.difficulty === 'difficile'),
    expert:       puzzles.filter(p => p.difficulty === 'expert'),
  };

  const ordered: CatalogEntry[] = [];

  // First 5: small easy (quick wins, hook the user)
  ordered.push(...buckets.small_easy.slice(0, 5));

  // Then alternate: large easy + remaining small easy
  const remaining_small_easy = buckets.small_easy.slice(5);
  buckets.large_easy.forEach((p, i) => {
    ordered.push(p);
    if (remaining_small_easy[i]) ordered.push(remaining_small_easy[i]);
  });

  // Then alternate: small medium + large medium
  buckets.small_medium.forEach((p, i) => {
    ordered.push(p);
    if (buckets.large_medium[i]) ordered.push(buckets.large_medium[i]);
  });
  // Any remaining large_medium not paired
  const remaining_large_medium = buckets.large_medium.slice(buckets.small_medium.length);
  ordered.push(...remaining_large_medium);

  // Hard + expert
  ordered.push(...buckets.large_hard);
  ordered.push(...buckets.expert);

  // Deduplicate (preserve first occurrence)
  const seen = new Set<string>();
  return ordered.filter(p => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });
}

const catalog = catalogData.puzzles as CatalogEntry[];

export const LEVELS: LevelEntry[] = buildLevelOrder(catalog).map((p, index) => ({
  number: index + 1,
  index,
  slug: p.slug,
  category: p.category,
  size: p.size,
  difficulty: p.difficulty,
  name: nameFromSlug(p.slug),
  isPremium: index >= 20,
}));

/** Returns the 0-indexed position of the next level to play. */
export function getUserCurrentLevel(completedIndices: number[]): number {
  for (let i = 0; i < LEVELS.length; i++) {
    if (!completedIndices.includes(i)) return i;
  }
  return LEVELS.length - 1;
}
