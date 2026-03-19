#!/usr/bin/env node
// Unified pipeline for creating nonograms from emoji or image files.
//
// Usage:
//   node scripts/pipeline.js emoji 🦊 --name="Renard" --category=animaux --size=10
//   node scripts/pipeline.js image path/to/file.png --name="Chat" --category=animaux --size=10
//
// Options:
//   --name        Puzzle display name (default: derived from emoji/filename)
//   --category    animaux | nature | objets | personnages | special (default: animaux)
//   --size        Grid size: 5, 10, 15, 20 (default: 10)
//   --threshold   Pixel darkness threshold 0-255 (default: 128)
//   --difficulty  facile | moyen | difficile | expert (default: auto-detected)
//   --no-validate Skip unique-solution check

const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const readline = require('readline');
const os = require('os');

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORIES = ['animaux', 'nature', 'objets', 'personnages', 'special'];
const COLORS = {
  animaux:     '#4ecdc4',
  nature:      '#6bcb77',
  objets:      '#4d9de0',
  personnages: '#ff6b9d',
  special:     '#f6c90e',
};
const TWEMOJI_BASE = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72';
const CATALOG_PATH = path.join(__dirname, '../data/puzzles/index.json');

// ─── Arg parsing ──────────────────────────────────────────────────────────────

function parseArgs(args) {
  const getName = key => args.find(a => a.startsWith(`--${key}=`))?.split('=').slice(1).join('=');
  const hasFlag = key => args.includes(`--${key}`);
  return { getName, hasFlag };
}

// ─── Emoji → codepoint ────────────────────────────────────────────────────────

function emojiToCodepoint(emoji) {
  const points = [];
  for (const char of emoji) {
    const cp = char.codePointAt(0);
    if (cp !== 0xFE0F && cp !== 0x200D) { // skip variation selector and ZWJ
      points.push(cp.toString(16).toLowerCase());
    }
  }
  return points.join('-');
}

// ─── Download helper (follows redirects) ─────────────────────────────────────

function download(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);

    function get(u) {
      protocol.get(u, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          get(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(destPath);
          reject(new Error(`HTTP ${res.statusCode} for ${u}`));
          return;
        }
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(destPath); });
      }).on('error', err => {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        reject(err);
      });
    }

    get(url);
  });
}

// ─── Image → solution matrix ─────────────────────────────────────────────────

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

// ─── Unique solution checker ──────────────────────────────────────────────────

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

// ─── Shared processing pipeline ──────────────────────────────────────────────

async function processPuzzle(imagePath, opts) {
  const { name, category, size, threshold, validate, difficulty: forcedDifficulty } = opts;

  console.log(`\n📐 ${imagePath}  →  ${size}x${size}  (seuil: ${threshold})`);

  const solution = await imageToSolution(imagePath, size, threshold);
  const clues    = calculateClues(solution);

  printPreview(solution);

  const totalFilled = solution.flat().filter(c => c === 1).length;
  const fillRate    = (totalFilled / (size * size) * 100).toFixed(1);
  console.log(`\nFilled: ${totalFilled}/${size * size} (${fillRate}%)`);

  if (totalFilled === 0) {
    console.error('❌ Image trop claire — aucun pixel rempli. Essaie --threshold=64.');
    process.exit(1);
  }
  if (totalFilled === size * size) {
    console.error('❌ Image trop sombre — tous les pixels sont remplis. Essaie --threshold=192.');
    process.exit(1);
  }

  if (validate) {
    process.stdout.write('🔍 Vérification solution unique... ');
    const unique = hasUniqueSolution(clues, size);
    if (unique) {
      console.log('✅ Solution unique!');
    } else {
      console.log('❌ Plusieurs solutions — puzzle rejeté.');
      console.log('   → Essaie un seuil différent, ou --no-validate pour forcer.');
      process.exit(1);
    }
  } else {
    console.log('⚠️  Vérification solution unique ignorée (--no-validate).');
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('\nValider ce puzzle ? (y/n): ', answer => {
    rl.close();
    if (answer.toLowerCase() !== 'y') {
      console.log('Puzzle rejeté.');
      return;
    }

    const slug       = slugify(name, size);
    const difficulty = forcedDifficulty || guessDifficulty(parseFloat(fillRate), size);

    const catalog = loadCatalog();
    if (catalog.puzzles.some(p => p.slug === slug)) {
      console.error(`❌ Un puzzle avec le slug "${slug}" existe déjà.`);
      console.error('   → Utilise un nom différent (--name="Renard v2").');
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

    const filePath = savePuzzle(puzzle);
    console.log(`✅ Puzzle sauvegardé: ${filePath}`);

    catalog.puzzles.push({ slug, category, size, difficulty });
    saveCatalog(catalog);
    console.log(`📋 Catalog mis à jour (${catalog.puzzles.length} puzzles total)`);
    console.log(`\nPour jouer: http://localhost:3015/puzzle/${slug}`);
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const rawArgs = process.argv.slice(2);
  const mode    = rawArgs[0];

  if (!mode || mode === '--help' || mode === '-h') {
    console.log(`
Usage:
  node scripts/pipeline.js emoji <emoji> [options]
  node scripts/pipeline.js image <path> [options]

Options:
  --name=<n>        Puzzle display name
  --category=<c>    animaux | nature | objets | personnages | special  (default: animaux)
  --size=<n>        5 | 10 | 15 | 20  (default: 10)
  --threshold=<n>   Pixel darkness threshold 0-255  (default: 128)
  --difficulty=<d>  facile | moyen | difficile | expert  (default: auto)
  --no-validate     Skip unique-solution check

Examples:
  node scripts/pipeline.js emoji 🦊 --name="Renard" --category=animaux
  node scripts/pipeline.js emoji 🌵 --name="Cactus" --category=nature --size=5
  node scripts/pipeline.js image assets/cat.png --name="Chat" --size=10
`);
    process.exit(0);
  }

  if (mode !== 'emoji' && mode !== 'image') {
    console.error(`❌ Mode inconnu: "${mode}". Utilise "emoji" ou "image".`);
    process.exit(1);
  }

  const subject = rawArgs[1];
  if (!subject || subject.startsWith('--')) {
    console.error(`❌ Argument manquant: node scripts/pipeline.js ${mode} <${mode === 'emoji' ? 'emoji' : 'path'}>`);
    process.exit(1);
  }

  const rest      = rawArgs.slice(2);
  const { getName, hasFlag } = parseArgs(rest);

  const category  = getName('category') || 'animaux';
  const size      = parseInt(getName('size') || '10');
  const threshold = parseInt(getName('threshold') || '128');
  const validate  = !hasFlag('no-validate');
  const forcedDifficulty = getName('difficulty') || null;

  if (!CATEGORIES.includes(category)) {
    console.error(`❌ Catégorie invalide: "${category}". Choisir parmi: ${CATEGORIES.join(', ')}`);
    process.exit(1);
  }

  if (![5, 10, 15, 20].includes(size)) {
    console.error(`❌ Taille invalide: ${size}. Choisir parmi: 5, 10, 15, 20`);
    process.exit(1);
  }

  let imagePath;
  let derivedName;

  if (mode === 'emoji') {
    const emoji     = subject;
    const codepoint = emojiToCodepoint(emoji);
    const url       = `${TWEMOJI_BASE}/${codepoint}.png`;
    const tmpPath   = path.join(os.tmpdir(), `twemoji-${codepoint}.png`);

    derivedName = getName('name') || `Emoji ${emoji}`;

    console.log(`\n🔍 Emoji: ${emoji}  →  codepoint: ${codepoint}`);
    console.log(`⬇️  Téléchargement: ${url}`);

    try {
      await download(url, tmpPath);
      console.log(`✅ Image téléchargée: ${tmpPath}`);
    } catch (err) {
      console.error(`❌ Échec du téléchargement: ${err.message}`);
      console.error(`   URL: ${url}`);
      console.error(`   Vérifie que l'emoji est supporté par Twemoji 14.`);
      process.exit(1);
    }

    imagePath = tmpPath;

  } else {
    // image mode
    imagePath   = path.resolve(subject);
    derivedName = getName('name') || path.basename(imagePath, path.extname(imagePath));

    if (!fs.existsSync(imagePath)) {
      console.error(`❌ Fichier introuvable: ${imagePath}`);
      process.exit(1);
    }
  }

  const name = (() => {
    const n = getName('name') || derivedName;
    return n.charAt(0).toUpperCase() + n.slice(1);
  })();

  await processPuzzle(imagePath, { name, category, size, threshold, validate, difficulty: forcedDifficulty });
}

main().catch(err => {
  console.error('Erreur:', err.message);
  process.exit(1);
});
