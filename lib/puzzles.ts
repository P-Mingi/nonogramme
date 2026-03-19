import type { Puzzle } from '@/types/puzzle';
import catalogData from '@/data/puzzles/index.json';
import { getDailyPuzzleSlug } from '@/lib/utils/daily';

interface CatalogEntry {
  slug: string;
  category: string;
  size: number;
  difficulty: string;
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
