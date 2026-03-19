#!/usr/bin/env node
// Usage:
//   node scripts/image-to-nonogram.js input.png --name="Chat" --category=animaux --size=10
//   node scripts/image-to-nonogram.js input.png --name="Chat" --size=15 --threshold=100
//
// Options:
//   --name        Puzzle display name (required)
//   --category    animaux | nature | objets | personnages | special (default: animaux)
//   --size        Grid size: 5, 10, 15, 20 (default: 10)
//   --threshold   Pixel darkness threshold 0-255 (default: 128, lower = only very dark pixels filled)
//   --no-validate Skip unique-solution check (faster, use for large grids)

const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ─── Config ──────────────────────────────────────────────────────────────────

const CATEGORIES = ['animaux', 'nature', 'objets', 'personnages', 'special'];
const COLORS = {
  animaux:     '#4ecdc4',
  nature:      '#6bcb77',
  objets:      '#4d9de0',
  personnages: '#ff6b9d',
  special:     '#f6c90e',
};

// ─── Image → solution matrix ──────────────────────────────────────────────────

async function imageToSolution(inputPath, size, threshold) {
  const image = await Jimp.read(inputPath);
  image.resize(size, size).greyscale();

  const solution = [];
  for (let row = 0; row < size; row++) {
    const rowData = [];
    for (let col = 0; col < size; col++) {
      const pixel = Jimp.intToRGBA(image.getPixelColor(col, row));
      rowData.push(pixel.r < threshold ? 1 : 0);
    }
    solution.push(rowData);
  }
  return solution;
}

// ─── Clue calculation ─────────────────────────────────────────────────────────

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

function calculateClues(solution) {
  const size = solution.length;
  const rowClues = solution.map(row => getLineClues(row));
  const colClues = Array.from({ length: size }, (_, c) =>
    getLineClues(solution.map(r => r[c]))
  );
  return { rows: rowClues, cols: colClues };
}

// ─── Unique solution checker (backtracking) ───────────────────────────────────

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
      solve(grid, row + 1);
      grid.pop();
      if (count > 1) return;
    }
  }

  solve([], 0);
  return count === 1;
}

// ─── Catalog helpers ──────────────────────────────────────────────────────────

const CATALOG_PATH = path.join(__dirname, '../data/puzzles/index.json');

function loadCatalog() {
  if (!fs.existsSync(CATALOG_PATH)) return { puzzles: [] };
  return JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
}

function saveCatalog(catalog) {
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2));
}

function savePuzzle(puzzle) {
  const dir = path.join(__dirname, `../data/puzzles/${puzzle.category}`);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${puzzle.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(puzzle, null, 2));
  return filePath;
}

function slugify(name, size) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + `-${size}x${size}`;
}

// ─── ASCII preview ────────────────────────────────────────────────────────────

function printPreview(solution) {
  console.log('\nAperçu:');
  solution.forEach(row => {
    console.log(row.map(c => c ? '██' : '  ').join(''));
  });
}

// ─── Difficulty heuristic ─────────────────────────────────────────────────────

function guessDifficulty(fillRate, size) {
  if (size <= 5) return 'facile';
  if (fillRate > 60) return 'facile';
  if (fillRate > 40) return 'moyen';
  if (fillRate > 25) return 'difficile';
  return 'expert';
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  if (!args[0] || args[0].startsWith('--')) {
    console.error('Usage: node scripts/image-to-nonogram.js <input.png> [options]');
    console.error('Options: --name="Chat" --category=animaux --size=10 --threshold=128 --no-validate');
    process.exit(1);
  }

  const inputPath = args[0];
  const getName  = key => args.find(a => a.startsWith(`--${key}=`))?.split('=').slice(1).join('=');
  const hasFlag  = key => args.includes(`--${key}`);

  const rawName   = getName('name') || path.basename(inputPath, path.extname(inputPath));
  const name      = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const category  = getName('category') || 'animaux';
  const size      = parseInt(getName('size') || '10');
  const threshold = parseInt(getName('threshold') || '128');
  const validate  = !hasFlag('no-validate');

  if (!CATEGORIES.includes(category)) {
    console.error(`Catégorie invalide. Choisir parmi: ${CATEGORIES.join(', ')}`);
    process.exit(1);
  }

  console.log(`\n📐 ${inputPath}  →  ${size}x${size}  (seuil: ${threshold})`);

  // 1. Convert image
  const solution = await imageToSolution(inputPath, size, threshold);
  const clues    = calculateClues(solution);

  // 2. Preview
  printPreview(solution);

  const totalFilled = solution.flat().filter(c => c === 1).length;
  const fillRate    = (totalFilled / (size * size) * 100).toFixed(1);
  console.log(`\nFilled: ${totalFilled}/${size * size} (${fillRate}%)`);

  if (totalFilled === 0) {
    console.error('❌ Image trop claire — aucun pixel rempli. Essaie un seuil plus bas (--threshold=64).');
    process.exit(1);
  }
  if (totalFilled === size * size) {
    console.error('❌ Image trop sombre — tous les pixels sont remplis. Essaie un seuil plus haut (--threshold=192).');
    process.exit(1);
  }

  // 3. Unique solution check
  if (validate) {
    process.stdout.write('🔍 Vérification solution unique... ');
    const unique = hasUniqueSolution(clues, size);
    if (unique) {
      console.log('✅ Solution unique!');
    } else {
      console.log('❌ Plusieurs solutions — puzzle rejeté.');
      console.log('   → Essaie une image plus contrastée, ou utilise --no-validate pour forcer.');
      process.exit(1);
    }
  } else {
    console.log('⚠️  Vérification solution unique ignorée (--no-validate).');
  }

  // 4. Confirm
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('\nValider ce puzzle ? (y/n): ', answer => {
    rl.close();
    if (answer.toLowerCase() !== 'y') {
      console.log('Puzzle rejeté.');
      return;
    }

    const slug       = slugify(name, size);
    const difficulty = guessDifficulty(parseFloat(fillRate), size);

    // Check for duplicate slug
    const catalog = loadCatalog();
    if (catalog.puzzles.some(p => p.slug === slug)) {
      console.error(`❌ Un puzzle avec le slug "${slug}" existe déjà.`);
      console.error('   → Utilise un nom différent (--name="Chat v2").');
      return;
    }

    const puzzle = {
      id: slug,
      slug,
      name,
      category,
      size,
      difficulty,
      author: 'pipeline-v1',
      solution,
      clues,
      colors: { filled: COLORS[category], background: '#0d1528' },
      stats: {
        total_filled: totalFilled,
        difficulty_score: parseFloat((totalFilled / (size * size)).toFixed(2)),
      },
      meta: {
        tags: [name.toLowerCase(), category],
        og_description: `Révèle ${name} dans ce nonogramme ${size}x${size}`,
      },
    };

    // Save puzzle file
    const filePath = savePuzzle(puzzle);
    console.log(`✅ Puzzle sauvegardé: ${filePath}`);

    // Update catalog
    catalog.puzzles.push({ slug, category, size, difficulty });
    saveCatalog(catalog);
    console.log(`📋 Catalog mis à jour (${catalog.puzzles.length} puzzles total)`);
    console.log(`\nPour jouer: http://localhost:3015/puzzle/${slug}`);
  });
}

main().catch(err => {
  console.error('Erreur:', err.message);
  process.exit(1);
});
