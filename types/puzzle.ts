export type Difficulty = 'facile' | 'moyen' | 'difficile' | 'expert';
export type CellState = 0 | 1 | 2; // empty | filled | marked (X)
export type Tool = 'fill' | 'mark' | 'erase';

export interface PuzzleColors {
  filled: string;
  background: string;
}

export interface PuzzleMeta {
  tags: string[];
  og_description: string;
}

export interface PuzzleStats {
  total_filled: number;
  difficulty_score: number;
}

export interface Puzzle {
  id: string;
  slug: string;
  name: string;
  category: string;
  size: number;
  difficulty: Difficulty;
  author: string;
  solution: number[][];
  clues: { rows: number[][]; cols: number[][] };
  colors: PuzzleColors;
  stats: PuzzleStats;
  meta: PuzzleMeta;
  is_daily?: boolean;
}
