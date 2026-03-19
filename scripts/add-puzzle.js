#!/usr/bin/env node
// Adds a new puzzle from a pixel grid string.
// Usage:
//   node scripts/add-puzzle.js \
//     --name "Lion" \
//     --category animaux \
//     --difficulty moyen \
//     --grid "01110/11111/11111/01110/00100"
//
// Grid format: rows separated by "/", 1=filled 0=empty.
// The script computes clues, validates uniqueness, and writes the JSON + updates index.json.

const fs = require('fs');
const path = require('path');

// ── Parse CLI args ──────────────────────────────────────────────────────────

const args = process.argv.slice(2);
function getArg(flag) {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
}

const name       = getArg('--name');
const category   = getArg('--category');
const difficulty = getArg('--difficulty') || 'facile';
const gridStr    = getArg('--grid');
const color      = getArg('--color') || '#4ecdc4';

if (!name || !category || !gridStr) {
  console.error('Usage: node scripts/add-puzzle.js --name "..." --category "..." --grid "rows/separated/by/slashes" [--difficulty facile|moyen|difficile] [--color #hex]');
  process.exit(1);
}

// ── Parse grid ───────────────────────────────────────────────────────────────

const rows = gridStr.split('/').map(row => row.split('').map(Number));
const size = rows.length;

// Validate square
if (rows.some(r => r.length !== size)) {
  console.error(`❌ Grid is not square: got ${size} rows but row lengths are [${rows.map(r => r.length).join(', ')}]`);
  process.exit(1);
}
if (rows.some(r => r.some(c => c !== 0 && c !== 1))) {
  console.error('❌ Grid may only contain 0 and 1');
  process.exit(1);
}

// ── Clue helpers (same as validate-puzzles.js) ───────────────────────────────

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

function generateValidRows(clue, sz) {
  if (clue.length === 1 && clue[0] === 0) return [new Array(sz).fill(0)];
  const results = [];
  function place(pos, clueIdx, current) {
    if (clueIdx === clue.length) {
      const row = [...current];
      while (row.length < sz) row.push(0);
      if (row.length === sz) results.push(row);
      return;
    }
    const blockLen = clue[clueIdx];
    const remaining = clue.slice(clueIdx + 1).reduce((a, b) => a + b, 0)
                    + clue.slice(clueIdx + 1).length;
    for (let start = pos; start <= sz - blockLen - remaining; start++) {
      const row = [...current];
      while (row.length < start) row.push(0);
      for (let i = 0; i < blockLen; i++) row.push(1);
      if (start + blockLen < sz) row.push(0);
      place(start + blockLen + 1, clueIdx + 1, row);
    }
  }
  place(0, 0, []);
  return results;
}

function partialColOk(grid, colClues, sz) {
  const row = grid.length - 1;
  for (let c = 0; c < sz; c++) {
    const clue = colClues[c];
    let ci = 0, run = 0, inRun = false;
    for (let r = 0; r <= row; r++) {
      if (grid[r][c] === 1) {
        run++; inRun = true;
      } else {
        if (inRun) {
          if (ci >= clue.length || run !== clue[ci]) return false;
          ci++; run = 0; inRun = false;
        }
      }
    }
    if (inRun && (ci >= clue.length || run > clue[ci])) return false;
  }
  return true;
}

function hasUniqueSolution(clues, sz) {
  let count = 0;
  function solve(grid, row) {
    if (count > 1) return;
    if (row === sz) {
      for (let c = 0; c < sz; c++) {
        const col = grid.map(r => r[c]);
        if (JSON.stringify(getLineClues(col)) !== JSON.stringify(clues.cols[c])) return;
      }
      count++;
      return;
    }
    for (const candidate of generateValidRows(clues.rows[row], sz)) {
      grid.push(candidate);
      if (partialColOk(grid, clues.cols, sz)) solve(grid, row + 1);
      grid.pop();
      if (count > 1) return;
    }
  }
  solve([], 0);
  return count === 1;
}

// ── Compute clues ────────────────────────────────────────────────────────────

const rowClues = rows.map(getLineClues);
const colClues = Array.from({ length: size }, (_, c) =>
  getLineClues(rows.map(r => r[c]))
);
const clues = { rows: rowClues, cols: colClues };

// ── Validate uniqueness ──────────────────────────────────────────────────────

process.stdout.write(`Validating uniqueness of "${name}" (${size}x${size})... `);
const unique = hasUniqueSolution(clues, size);
if (!unique) {
  console.log('❌');
  console.error('This puzzle does not have a unique solution. Adjust the grid.');
  process.exit(1);
}
console.log('✅');

// ── Generate slug ────────────────────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const slug = `${slugify(name)}-${size}x${size}`;

// ── Check for duplicates ─────────────────────────────────────────────────────

const indexPath = path.join(__dirname, '../data/puzzles/index.json');
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

if (index.puzzles.some(p => p.slug === slug)) {
  console.error(`❌ Slug "${slug}" already exists in index.json`);
  process.exit(1);
}

// ── Build puzzle JSON ─────────────────────────────────────────────────────────

const totalFilled = rows.reduce((sum, row) => sum + row.reduce((s, c) => s + c, 0), 0);
const difficultyScore = parseFloat((totalFilled / (size * size)).toFixed(2));

const puzzle = {
  id: slug,
  slug,
  name,
  category,
  size,
  difficulty,
  author: 'pipeline-v1',
  solution: rows,
  clues,
  colors: {
    filled: color,
    background: '#0d1528',
  },
  stats: {
    total_filled: totalFilled,
    difficulty_score: difficultyScore,
  },
  meta: {
    tags: [slugify(name), category],
    og_description: `Révèle ${name} dans ce nonogramme ${size}x${size}`,
  },
};

// ── Write files ───────────────────────────────────────────────────────────────

const dir = path.join(__dirname, `../data/puzzles/${category}`);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const filePath = path.join(dir, `${slug}.json`);
fs.writeFileSync(filePath, JSON.stringify(puzzle, null, 2) + '\n');
console.log(`✅ Written: data/puzzles/${category}/${slug}.json`);

index.puzzles.push({ slug, category, size, difficulty });
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');
console.log(`✅ Updated: data/puzzles/index.json (${index.puzzles.length} puzzles total)`);
