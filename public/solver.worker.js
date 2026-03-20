// Runs in a Web Worker — doesn't block UI
// Checks if a nonogram has exactly 1 valid solution

function getClues(line) {
  const c = []; let count = 0;
  for (const v of line) {
    if (v) count++;
    else if (count) { c.push(count); count = 0; }
  }
  if (count) c.push(count);
  return c.length ? c : [0];
}

function generateValidRows(clue, size) {
  const results = [];
  function place(pos, ci, current) {
    if (ci === clue.length) {
      const row = [...current];
      while (row.length < size) row.push(0);
      if (row.length === size) results.push(row);
      return;
    }
    const blockLen = clue[ci];
    const remaining = clue.slice(ci + 1).reduce((a, b) => a + b, 0) + clue.slice(ci + 1).length;
    for (let start = pos; start <= size - blockLen - remaining; start++) {
      const row = [...current];
      while (row.length < start) row.push(0);
      for (let i = 0; i < blockLen; i++) row.push(1);
      if (start + blockLen < size) row.push(0);
      place(start + blockLen + 1, ci + 1, row);
    }
  }
  place(0, 0, []);
  return results;
}

function checkUnique(rowClues, colClues, size) {
  let count = 0;

  function solve(grid, row) {
    if (count > 1) return;
    if (row === size) {
      for (let c = 0; c < size; c++) {
        const col = grid.map(r => r[c]);
        const actual = getClues(col);
        if (JSON.stringify(actual) !== JSON.stringify(colClues[c])) return;
      }
      count++;
      return;
    }
    const validRows = generateValidRows(rowClues[row], size);
    for (const candidate of validRows) {
      let valid = true;
      for (let c = 0; c < size; c++) {
        const partialCol = [...grid.map(r => r[c]), candidate[c]];
        const colClue = colClues[c];
        let runCount = 0, clueIdx = 0;
        for (const v of partialCol) {
          if (v) {
            runCount++;
            if (clueIdx >= colClue.length || runCount > colClue[clueIdx]) {
              valid = false; break;
            }
          } else if (runCount > 0) {
            if (clueIdx >= colClue.length || runCount !== colClue[clueIdx]) {
              valid = false; break;
            }
            clueIdx++;
            runCount = 0;
          }
        }
        if (!valid) break;
      }
      if (!valid) continue;
      grid.push(candidate);
      solve(grid, row + 1);
      grid.pop();
      if (count > 1) return;
    }
  }

  solve([], 0);
  return count === 1;
}

self.onmessage = function(e) {
  const { solution, size } = e.data;

  const rowClues = solution.map(row => getClues(row));
  const colClues = Array.from({length: size}, (_, c) => getClues(solution.map(r => r[c])));

  const filled = solution.flat().filter(v => v).length;
  const fillRate = filled / (size * size);

  if (fillRate < 0.08 || fillRate > 0.92) {
    self.postMessage({ valid: false, reason: 'Trop de cases vides ou trop remplies' });
    return;
  }

  for (let r = 0; r < size; r++) {
    const s = solution[r].reduce((a,b)=>a+b,0);
    if (s === 0) { self.postMessage({ valid: false, reason: `Ligne ${r+1} entièrement vide` }); return; }
    if (s === size) { self.postMessage({ valid: false, reason: `Ligne ${r+1} entièrement remplie` }); return; }
  }

  for (let c = 0; c < size; c++) {
    const col = solution.map(r => r[c]);
    const s = col.reduce((a,b)=>a+b,0);
    if (s === 0) { self.postMessage({ valid: false, reason: `Colonne ${c+1} entièrement vide` }); return; }
    if (s === size) { self.postMessage({ valid: false, reason: `Colonne ${c+1} entièrement remplie` }); return; }
  }

  const isUnique = checkUnique(rowClues, colClues, size);
  self.postMessage({
    valid: isUnique,
    reason: isUnique ? null : 'Ce puzzle a plusieurs solutions possibles — modifie quelques cases',
    rowClues,
    colClues,
    fillRate,
  });
};
