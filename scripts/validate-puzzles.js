#!/usr/bin/env node
// Validates that every puzzle in the catalog has a unique solution.
// Usage: node scripts/validate-puzzles.js

const fs = require('fs');
const path = require('path');

const catalog = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/puzzles/index.json'), 'utf8')
);

function getLineClues(line) {
  const clues = [];
  let count = 0;
  line.forEach(cell => {
    if (cell === 1) count++;
    else if (count > 0) { clues.push(count); count = 0; }
  });
  if (count > 0) clues.push(count);
  return clues.length ? clues : [0];
}

function generateValidRows(clue, size) {
  if (clue.length === 1 && clue[0] === 0) return [new Array(size).fill(0)];
  const results = [];
  function place(pos, clueIdx, current) {
    if (clueIdx === clue.length) {
      const row = [...current];
      while (row.length < size) row.push(0);
      if (row.length === size) results.push(row);
      return;
    }
    const blockLen = clue[clueIdx];
    const remaining = clue.slice(clueIdx + 1).reduce((a, b) => a + b, 0)
                    + clue.slice(clueIdx + 1).length;
    for (let start = pos; start <= size - blockLen - remaining; start++) {
      const row = [...current];
      while (row.length < start) row.push(0);
      for (let i = 0; i < blockLen; i++) row.push(1);
      if (start + blockLen < size) row.push(0);
      place(start + blockLen + 1, clueIdx + 1, row);
    }
  }
  place(0, 0, []);
  return results;
}

// Fast partial-column consistency check: after placing a new row,
// verify no column is already contradicted (prunes bad branches early).
function partialColOk(grid, colClues, size) {
  const row = grid.length - 1;
  for (let c = 0; c < size; c++) {
    const clue = colClues[c];
    let ci = 0, run = 0, inRun = false;
    for (let r = 0; r <= row; r++) {
      if (grid[r][c] === 1) {
        run++;
        inRun = true;
      } else {
        if (inRun) {
          // run just ended — must exactly match the next clue group
          if (ci >= clue.length || run !== clue[ci]) return false;
          ci++; run = 0; inRun = false;
        }
      }
    }
    // ongoing run at end of partial column — must not exceed next clue group
    if (inRun && (ci >= clue.length || run > clue[ci])) return false;
  }
  return true;
}

function hasUniqueSolution(clues, size) {
  let count = 0;
  function solve(grid, row) {
    if (count > 1) return;
    if (row === size) {
      for (let c = 0; c < size; c++) {
        const col = grid.map(r => r[c]);
        if (JSON.stringify(getLineClues(col)) !== JSON.stringify(clues.cols[c])) return;
      }
      count++;
      return;
    }
    for (const candidate of generateValidRows(clues.rows[row], size)) {
      grid.push(candidate);
      if (partialColOk(grid, clues.cols, size)) {
        solve(grid, row + 1);
      }
      grid.pop();
      if (count > 1) return;
    }
  }
  solve([], 0);
  return count === 1;
}

let passed = 0;
let failed = 0;

for (const entry of catalog.puzzles) {
  const filePath = path.join(__dirname, `../data/puzzles/${entry.category}/${entry.slug}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ [MISSING] ${entry.slug}`);
    failed++;
    continue;
  }
  const puzzle = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  process.stdout.write(`   ${entry.slug} (${puzzle.size}x${puzzle.size})... `);
  const unique = hasUniqueSolution(puzzle.clues, puzzle.size);
  if (unique) {
    console.log('✅');
    passed++;
  } else {
    console.log('❌ plusieurs solutions');
    failed++;
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
