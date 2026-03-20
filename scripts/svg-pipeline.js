#!/usr/bin/env node
/**
 * SVG Icon → Nonogram Pipeline
 *
 * Converts SVG icons to nonogram puzzles using sharp for rasterization.
 * Best sources for nonogram-quality icons:
 *   - https://fonts.google.com/icons — use "Filled" variants
 *   - https://heroicons.com — use "Solid" variants
 *   - https://svgrepo.com — filter by "Monocolor"
 *
 * Usage:
 *   node scripts/svg-pipeline.js --file=icon.svg --name="Camera" --category=tech
 *   node scripts/svg-pipeline.js --dir=downloads/ --category=tech --yes
 *
 * Options:
 *   --file=<path>        Single SVG file to process
 *   --dir=<path>         Directory of SVG files to batch process
 *   --name=<string>      Puzzle name (single file mode)
 *   --category=<string>  Category (default: objets)
 *   --size=<number>      Grid size: 5, 10, or 15 (default: 10)
 *   --threshold=<0-255>  Darkness threshold (default: 128)
 *   --yes                Skip confirmation prompts
 *   --dry-run            Preview without saving
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Check for sharp
let sharp;
try {
  sharp = require('sharp');
} catch {
  console.error('❌ sharp not installed. Run: npm install sharp');
  process.exit(1);
}

const args = process.argv.slice(2);
const getArg = (name) => args.find(a => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');

const size = parseInt(getArg('size') || '10');
const category = getArg('category') || 'objets';
const inputDir = getArg('dir');
const inputFile = getArg('file');
const threshold = parseInt(getArg('threshold') || '128');
const AUTO_CONFIRM = args.includes('--yes');
const DRY_RUN = args.includes('--dry-run');

function getClues(line) {
  const c = []; let count = 0;
  for (const v of line) {
    if (v) count++;
    else if (count) { c.push(count); count = 0; }
  }
  if (count) c.push(count);
  return c.length ? c : [0];
}

function asciiPreview(solution) {
  return solution.map(r => r.map(v => v ? '██' : '  ').join('')).join('\n');
}

function validate(solution, n) {
  const flat = solution.flat();
  const rate = flat.filter(v => v).length / flat.length;
  if (rate < 0.08) return { valid: false, reason: `Too sparse (${(rate * 100).toFixed(0)}%)` };
  if (rate > 0.92) return { valid: false, reason: `Too dense (${(rate * 100).toFixed(0)}%)` };
  for (let r = 0; r < n; r++) {
    const s = solution[r].reduce((a, b) => a + b, 0);
    if (s === 0 || s === n) return { valid: false, reason: `Row ${r} all same value` };
  }
  return { valid: true, rate };
}

function toSlug(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function svgToSolution(svgPath, targetSize) {
  const svgBuffer = fs.readFileSync(svgPath);
  const { data, info } = await sharp(svgBuffer)
    .resize(targetSize, targetSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const solution = [];
  for (let r = 0; r < targetSize; r++) {
    const row = [];
    for (let c = 0; c < targetSize; c++) {
      row.push(data[r * info.width + c] < threshold ? 1 : 0);
    }
    solution.push(row);
  }
  return solution;
}

function confirm(question) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, answer => { rl.close(); resolve(answer.trim().toLowerCase() === 'y'); });
  });
}

function savePuzzle(slug, name, solution) {
  const clues = {
    rows: solution.map(r => getClues(r)),
    cols: Array.from({ length: size }, (_, c) => getClues(solution.map(r => r[c]))),
  };
  const rate = solution.flat().filter(v => v).length / (size * size);
  const difficulty = rate < 0.35 ? 'difficile' : rate < 0.55 ? 'moyen' : 'facile';

  const puzzle = {
    id: slug, slug, name, category, size, difficulty,
    color: '#4ecdc4',
    solution, clues,
    tags: [name.toLowerCase(), category],
    colors: { filled: '#4ecdc4' },
    meta: {
      tags: [name.toLowerCase(), category],
      og_description: `Révèle "${name}" dans ce nonogramme ${size}×${size}`,
      source: 'svg',
    },
  };

  const dir = path.join(__dirname, '..', 'data', 'puzzles', category);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const outPath = path.join(dir, `${slug}.json`);
  fs.writeFileSync(outPath, JSON.stringify(puzzle, null, 2));
  return outPath;
}

async function processSingle(filePath, name) {
  console.log(`\n▶ ${path.basename(filePath)} → "${name}"`);

  const solution = await svgToSolution(filePath, size);
  console.log(asciiPreview(solution));

  const v = validate(solution, size);
  const rate = v.rate ?? solution.flat().filter(x => x).length / (size * size);
  console.log(`Fill: ${(rate * 100).toFixed(0)}% — ${v.valid ? '✅ Valid' : `❌ ${v.reason}`}`);

  if (!v.valid) return null;
  if (DRY_RUN) { console.log('[dry-run] Would save.'); return 'dry-run'; }

  if (!AUTO_CONFIRM) {
    const ok = await confirm('Save this puzzle? (y/n): ');
    if (!ok) return null;
  }

  const slug = toSlug(name) + `-${size}x${size}`;
  const outPath = savePuzzle(slug, name, solution);
  console.log(`✅ Saved: ${outPath}`);
  return slug;
}

async function main() {
  if (!inputFile && !inputDir) {
    console.log('SVG → Nonogram Pipeline\n');
    console.log('Usage:');
    console.log('  node scripts/svg-pipeline.js --file=icon.svg --name="Camera" --category=objets');
    console.log('  node scripts/svg-pipeline.js --dir=downloads/ --category=tech --yes');
    console.log('  node scripts/svg-pipeline.js --file=icon.svg --name="Camera" --size=15');
    return;
  }

  if (inputFile) {
    const name = getArg('name') || path.basename(inputFile, '.svg').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    await processSingle(inputFile, name);
    return;
  }

  // Batch directory mode
  if (!fs.existsSync(inputDir)) { console.error(`❌ Directory not found: ${inputDir}`); process.exit(1); }
  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.svg'));
  if (!files.length) { console.error('❌ No SVG files found in directory'); process.exit(1); }

  console.log(`Processing ${files.length} SVG files from ${inputDir}...\n`);
  let saved = 0, rejected = 0;

  for (const file of files) {
    const name = path.basename(file, '.svg').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const result = await processSingle(path.join(inputDir, file), name);
    if (result) saved++; else rejected++;
  }

  console.log(`\n✅ Done: ${saved} saved, ${rejected} rejected/skipped`);
}

main().catch(console.error);
