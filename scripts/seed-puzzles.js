#!/usr/bin/env node
// Generates all seed puzzles and updates the catalog.
// Usage: node scripts/seed-puzzles.js

const fs = require('fs');
const path = require('path');

// Grid format: rows separated by '/', 0=empty 1=filled
const PUZZLES = [
  // ── 5×5 ANIMAUX ──────────────────────────────────────────────────────
  { name:'Lapin',      category:'animaux',     size:5,  grid:'01010/01110/11111/01110/00100' },
  { name:'Oiseau',     category:'animaux',     size:5,  grid:'01010/01110/11111/00100/00100' },
  { name:'Poisson',    category:'animaux',     size:5,  grid:'10000/11110/11111/11110/10000' },
  { name:'Papillon',   category:'animaux',     size:5,  grid:'10101/11111/01110/11111/10101' },
  { name:'Grenouille', category:'animaux',     size:5,  grid:'10001/01110/11111/10001/10001' },
  { name:'Araignee',   category:'animaux',     size:5,  grid:'10101/01110/11111/01010/10001' },
  // ── 5×5 NATURE ───────────────────────────────────────────────────────
  { name:'Arbre',      category:'nature',      size:5,  grid:'01110/11111/01110/00100/00100' },
  { name:'Champignon', category:'nature',      size:5,  grid:'01110/11011/11111/00100/00100' },
  { name:'Fleur',      category:'nature',      size:5,  grid:'01010/11111/01110/00100/00100' },
  { name:'Montagne',   category:'nature',      size:5,  grid:'00100/01110/01110/11111/11111' },
  { name:'Lune',       category:'nature',      size:5,  grid:'01100/11000/10000/11000/01100' },
  // ── 5×5 OBJETS ───────────────────────────────────────────────────────
  { name:'Cle',        category:'objets',      size:5,  grid:'01110/11011/01110/00100/00100' },
  { name:'Ampoule',    category:'objets',      size:5,  grid:'01110/11111/11111/01110/00100' },
  { name:'Tasse',      category:'objets',      size:5,  grid:'11110/10011/10010/10010/11110' },
  { name:'Cloche',     category:'objets',      size:5,  grid:'00100/01110/11111/11111/01010' },
  { name:'Loupe',      category:'objets',      size:5,  grid:'01100/10010/10011/01110/00010' },
  { name:'Cadenas',    category:'objets',      size:5,  grid:'01110/10001/11111/10001/11111' },
  { name:'Eclair',     category:'objets',      size:5,  grid:'11100/01000/01100/00100/00111' },
  // ── 5×5 PERSONNAGES ──────────────────────────────────────────────────
  { name:'Bonhomme',   category:'personnages', size:5,  grid:'01110/01110/00100/01110/10101' },
  { name:'Chapeau',    category:'personnages', size:5,  grid:'00100/00100/01110/11111/11111' },
  { name:'Couronne',   category:'personnages', size:5,  grid:'10101/11111/11111/01110/01110' },
  { name:'Fantome',    category:'personnages', size:5,  grid:'01110/11111/10101/11111/10101' },
  // ── 5×5 SPECIAL ──────────────────────────────────────────────────────
  { name:'Croix',      category:'special',     size:5,  grid:'00100/00100/11111/00100/00100' },
  { name:'Fleche',     category:'special',     size:5,  grid:'00100/00010/11111/00010/00100' },
  { name:'Diamant',    category:'special',     size:5,  grid:'00100/01110/11111/01110/00100' },
  // ── 10×10 ANIMAUX ────────────────────────────────────────────────────
  { name:'Pingouin', category:'animaux', size:10, grid:
    '0011111100/0111111110/1100111011/0111111110/'+
    '0110110110/0110110110/0111111110/0011111100/0011001100/0011001100' },
  { name:'Hibou',    category:'animaux', size:10, grid:
    '0011001100/0111111110/1100110011/0111111110/'+
    '0110000110/0111111110/1011111101/1111111111/0111111110/0011111100' },
  { name:'Renard',   category:'animaux', size:10, grid:
    '1000000001/1100000011/0110000110/0011111100/'+
    '0111111110/1101111011/1111001111/0111111110/0011111100/0001111000' },
  { name:'Baleine',  category:'animaux', size:10, grid:
    '0011111000/0111111110/1111111111/1111111111/'+
    '1111111110/0111111110/0011111100/0000110000/0001111000/0011001100' },
  { name:'Elephant', category:'animaux', size:10, grid:
    '0011111100/0111111110/1111111111/1111001111/'+
    '1111111111/1111111111/0111111110/0110011110/0110001100/1110001110' },
  { name:'Panda',    category:'animaux', size:10, grid:
    '0011111100/0111111110/1001111001/1001111001/'+
    '1111111111/1110001111/1111111111/0111111110/0110110110/0110110110' },
  // ── 10×10 NATURE ─────────────────────────────────────────────────────
  { name:'Cactus',   category:'nature',  size:10, grid:
    '0000010000/0000110000/0100110000/0100111100/'+
    '0000111100/0000111110/0001111110/0001111100/0001111000/0011111000' },
  { name:'Sapin',    category:'nature',  size:10, grid:
    '0000100000/0001110000/0011111000/0111111100/'+
    '1111111110/0011111000/0111111100/1111111110/0000100000/0000100000' },
  { name:'Feuille',  category:'nature',  size:10, grid:
    '0000100000/0001110000/0011111000/0111111100/'+
    '1111111110/1111111100/0111111000/0001111000/0000110000/0001000000' },
  { name:'Volcan',   category:'nature',  size:10, grid:
    '0000110000/0001111000/0011111100/0011111100/'+
    '0111111110/0111111110/1111111111/1111111111/1111111111/1111111111' },
  { name:'Nuage',    category:'nature',  size:10, grid:
    '0011100000/0111110000/1111111100/1111111110/'+
    '1111111111/1111111111/1111111110/1111111100/0000000000/0010010010' },
  // ── 10×10 OBJETS ─────────────────────────────────────────────────────
  { name:'Voiture',  category:'objets',  size:10, grid:
    '0001111100/0011111110/0111111111/1111111111/'+
    '1111111111/1111111111/0111111110/0110001100/0110001100/0000000000' },
  { name:'Avion',    category:'objets',  size:10, grid:
    '0000100000/0001110000/0011111000/1111111111/'+
    '1111111111/0011111000/0001110000/0000100000/0000011000/0000001110' },
  { name:'Fusee',    category:'objets',  size:10, grid:
    '0000110000/0001111000/0011111100/0011111100/'+
    '0111111110/1111111111/1111111111/0110110110/1001001001/1001001001' },
  { name:'Telephone',category:'objets',  size:10, grid:
    '0111111110/1111111111/1100000011/1011111101/'+
    '1011111101/1011111101/1011111101/1100000011/1111111111/0111111110' },
  { name:'Livre',    category:'objets',  size:10, grid:
    '1111111111/1000000011/1011111011/1010101011/'+
    '1010101011/1010101011/1011111011/1000000011/1111111111/0111111110' },
  { name:'Trophee',  category:'objets',  size:10, grid:
    '1111111111/1111111111/0111111110/0011111100/'+
    '0001111000/0001111000/0011111100/0001111000/0111111110/1111111111' },
  { name:'Horloge',  category:'objets',  size:10, grid:
    '0011111100/0111111110/1100110011/1101001011/'+
    '1100001011/1100011011/1100110011/1100000011/0111111110/1111111111' },
  // ── 10×10 PERSONNAGES ────────────────────────────────────────────────
  { name:'Robot',    category:'personnages', size:10, grid:
    '0011111100/0101111010/1111111111/1100110011/'+
    '1111111111/0111111110/1111111111/1100000011/1100000011/1111001111' },
  { name:'Crane',    category:'personnages', size:10, grid:
    '0011111100/0111111110/1110000111/1101001011/'+
    '1110000111/0111111110/0011111100/0011111100/0101010110/0011111100' },
  { name:'Superheros',category:'personnages',size:10, grid:
    '0011111100/0111111110/1111111111/1100110011/'+
    '1111111111/1111111111/0111111110/0110110110/1110001110/1100000011' },
  { name:'Astronaute',category:'personnages',size:10, grid:
    '0011111100/0111111110/1111111111/1100000011/'+
    '1101111011/1101111011/1100000011/1111111111/0111111110/0100000010' },
  // ── 10×10 SPECIAL ────────────────────────────────────────────────────
  { name:'Coeur',    category:'special',     size:10, grid:
    '0110110000/1111111100/1111111110/0111111111/'+
    '0011111111/0001111110/0000111100/0000011000/0000001000/0000000000' },
  { name:'Yin Yang', category:'special',     size:10, grid:
    '0011111100/0111111110/1111111111/1111100111/'+
    '1111100011/1111100001/1110011111/1100111111/0111111110/0011111100' },
  { name:'Gamepad',  category:'special',     size:10, grid:
    '0111111110/1111111111/1100110011/1111111111/'+
    '1111111111/1100110011/1110001110/0111111110/0011111100/0001111000' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseGrid(str, size) {
  return str.split('/').map(row =>
    row.split('').map(Number)
  );
}

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
  return {
    rows: solution.map(row => getLineClues(row)),
    cols: Array.from({ length: size }, (_, c) =>
      getLineClues(solution.map(r => r[c]))
    ),
  };
}

function slugify(name, size) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + `-${size}x${size}`;
}

function guessDifficulty(fillRate, size) {
  if (size <= 5) return 'facile';
  if (fillRate > 60) return 'facile';
  if (fillRate > 40) return 'moyen';
  if (fillRate > 25) return 'difficile';
  return 'expert';
}

const COLORS = {
  animaux: '#4ecdc4', nature: '#6bcb77',
  objets: '#4d9de0', personnages: '#ff6b9d', special: '#f6c90e',
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const CATALOG_PATH = path.join(__dirname, '../data/puzzles/index.json');
const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
const existingSlugs = new Set(catalog.puzzles.map(p => p.slug));

let added = 0;
let skipped = 0;

for (const def of PUZZLES) {
  const slug = slugify(def.name, def.size);

  if (existingSlugs.has(slug)) {
    process.stdout.write(`⏭  ${slug}\n`);
    skipped++;
    continue;
  }

  const solution = parseGrid(def.grid, def.size);

  // Validate grid dimensions
  if (solution.length !== def.size || solution.some(r => r.length !== def.size)) {
    console.error(`❌ Grid size mismatch for ${slug}`);
    continue;
  }

  const clues = calculateClues(solution);
  const totalFilled = solution.flat().filter(c => c === 1).length;
  const fillRate = (totalFilled / (def.size * def.size) * 100).toFixed(1);
  const difficulty = guessDifficulty(parseFloat(fillRate), def.size);

  const puzzle = {
    id: slug, slug,
    name: def.name,
    category: def.category,
    size: def.size,
    difficulty,
    author: 'seed-v1',
    solution,
    clues,
    colors: { filled: COLORS[def.category] || '#4ecdc4', background: '#0d1528' },
    stats: { total_filled: totalFilled, difficulty_score: parseFloat((totalFilled / (def.size * def.size)).toFixed(2)) },
    meta: {
      tags: [def.name.toLowerCase(), def.category],
      og_description: `Révèle ${def.name} dans ce nonogramme ${def.size}x${def.size}`,
    },
  };

  const dir = path.join(__dirname, `../data/puzzles/${def.category}`);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${slug}.json`), JSON.stringify(puzzle, null, 2));

  catalog.puzzles.push({ slug, category: def.category, size: def.size, difficulty });
  existingSlugs.add(slug);
  added++;
  process.stdout.write(`✅ ${slug} (${fillRate}% filled, ${difficulty})\n`);
}

fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2));
console.log(`\nDone: ${added} added, ${skipped} skipped. Total: ${catalog.puzzles.length} puzzles.`);
