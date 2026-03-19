import { getLineClues } from './clues';

export function checkSolution(grid: number[][], solution: number[][]): boolean {
  return solution.every((row, r) =>
    row.every((cell, c) => cell === 0 || grid[r][c] === 1)
  );
}

export function getCompletedRows(grid: number[][], clues: number[][]): boolean[] {
  return grid.map((row, r) => {
    const line = row.map(v => (v === 1 ? 1 : 0));
    return JSON.stringify(getLineClues(line)) === JSON.stringify(clues[r]);
  });
}

export function getCompletedCols(grid: number[][], clues: number[][]): boolean[] {
  const size = grid.length;
  return Array.from({ length: size }, (_, c) => {
    const line = grid.map(row => (row[c] === 1 ? 1 : 0));
    return JSON.stringify(getLineClues(line)) === JSON.stringify(clues[c]);
  });
}
