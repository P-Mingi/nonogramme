export function getLineClues(line: number[]): number[] {
  const clues: number[] = [];
  let count = 0;
  line.forEach(cell => {
    if (cell === 1) count++;
    else if (count > 0) { clues.push(count); count = 0; }
  });
  if (count > 0) clues.push(count);
  return clues.length ? clues : [0];
}

export function calculateClues(solution: number[][]): { rows: number[][]; cols: number[][] } {
  const size = solution.length;
  const rowClues = solution.map(row => getLineClues(row));
  const colClues = Array.from({ length: size }, (_, c) =>
    getLineClues(solution.map(r => r[c]))
  );
  return { rows: rowClues, cols: colClues };
}
