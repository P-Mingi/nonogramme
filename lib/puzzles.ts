import type { Puzzle, Difficulty } from '@/types/puzzle';
import catalogData from '@/data/puzzles/index.json';
import { getDailyPuzzleSlug } from '@/lib/utils/daily';

interface CatalogEntry {
  slug: string;
  category: string;
  size: number;
  difficulty: string;
}

export function isPuzzleInCatalog(slug: string): boolean {
  return (catalogData.puzzles as CatalogEntry[]).some(p => p.slug === slug);
}

function getCategoryForSlug(slug: string): string {
  const entry = (catalogData.puzzles as CatalogEntry[]).find(p => p.slug === slug);
  if (!entry) throw new Error(`Puzzle not found: ${slug}`);
  return entry.category;
}

export async function getPuzzleBySlug(slug: string): Promise<Puzzle> {
  const category = getCategoryForSlug(slug);
  const mod = await import(`@/data/puzzles/${category}/${slug}.json`);
  return mod.default as Puzzle;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function communityRowToPuzzle(row: Record<string, any>): Puzzle {
  return {
    id: row.id ?? row.slug,
    slug: row.slug,
    name: row.name,
    category: row.category,
    size: row.size,
    difficulty: row.difficulty as Difficulty,
    author: row.creator_username ?? 'Communauté',
    solution: row.solution,
    clues: row.clues,
    colors: { filled: row.color ?? '#4ecdc4', background: '#0f1e30' },
    stats: { total_filled: 0, difficulty_score: 0 },
    meta: { tags: [], og_description: `Nonogramme communautaire : ${row.name}` },
  };
}

export async function getAllPuzzleSlugs(): Promise<string[]> {
  return (catalogData.puzzles as CatalogEntry[]).map(p => p.slug);
}

export async function getDailyPuzzle(): Promise<Puzzle> {
  const slugs = await getAllPuzzleSlugs();
  const slug = getDailyPuzzleSlug(new Date(), slugs);
  return getPuzzleBySlug(slug);
}

export function getCatalog(): CatalogEntry[] {
  return catalogData.puzzles as CatalogEntry[];
}
