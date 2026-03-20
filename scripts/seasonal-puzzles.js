#!/usr/bin/env node
/**
 * Seasonal puzzle pack generator
 * Generates puzzle JSON files from hand-crafted 10x10 binary grids
 * Run: node scripts/seasonal-puzzles.js
 */

const fs = require('fs');
const path = require('path');

function getClues(line) {
  const c = []; let count = 0;
  for (const v of line) {
    if (v) count++;
    else if (count) { c.push(count); count = 0; }
  }
  if (count) c.push(count);
  return c.length ? c : [0];
}

function calculateAllClues(solution) {
  const n = solution.length;
  return {
    rows: solution.map(row => getClues(row)),
    cols: Array.from({ length: n }, (_, c) => getClues(solution.map(r => r[c]))),
  };
}

function fillRate(solution) {
  const flat = solution.flat();
  return flat.filter(v => v).length / flat.length;
}

const SEASONAL_PUZZLES = {
  noel: [
    {
      name: 'Sapin de Noël', slug: 'sapin-noel', difficulty: 'facile', color: '#4ade80',
      solution: [
        [0,0,0,0,1,0,0,0,0,0],
        [0,0,0,1,1,1,0,0,0,0],
        [0,0,1,1,1,1,1,0,0,0],
        [0,1,1,1,1,1,1,1,0,0],
        [1,1,1,1,1,1,1,1,1,0],
        [0,0,0,1,1,1,0,0,0,0],
        [0,0,0,1,1,1,0,0,0,0],
        [0,0,1,1,1,1,1,0,0,0],
        [0,0,0,0,1,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
      ],
    },
    {
      name: 'Père Noël', slug: 'pere-noel', difficulty: 'moyen', color: '#ff6b6b',
      solution: [
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1],
        [0,1,1,0,0,0,0,1,1,0],
        [0,1,1,0,0,0,0,1,1,0],
        [0,0,0,0,0,0,0,0,0,0],
      ],
    },
    {
      name: 'Étoile de Noël', slug: 'etoile-noel', difficulty: 'facile', color: '#ffd93d',
      solution: [
        [0,0,0,0,1,1,0,0,0,0],
        [0,0,0,0,1,1,0,0,0,0],
        [0,1,0,0,1,1,0,0,1,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,0,0,1,1,0,0,1,0],
        [0,0,0,0,1,1,0,0,0,0],
        [0,0,0,0,1,1,0,0,0,0],
      ],
    },
    {
      name: 'Bonhomme de Neige', slug: 'bonhomme-neige', difficulty: 'facile', color: '#e2f0ff',
      solution: [
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,0,1,0,1,1,0,1,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,0,0,1,1,1,1,0,0,0],
        [0,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1],
        [0,1,1,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,0,0,1,1,1,1,0,0,0],
      ],
    },
    {
      name: 'Cadeau de Noël', slug: 'cadeau-noel', difficulty: 'facile', color: '#ff6b6b',
      solution: [
        [0,0,0,0,1,1,0,0,0,0],
        [0,0,0,1,1,1,1,0,0,0],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,0,0,1,1,0,0,1,1],
        [1,1,0,0,1,1,0,0,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0],
      ],
    },
    {
      name: 'Cloche de Noël', slug: 'cloche-noel', difficulty: 'moyen', color: '#ffd93d',
      solution: [
        [0,0,0,0,1,1,0,0,0,0],
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [0,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,1,1,0,0,0,0],
        [0,0,0,1,1,1,1,0,0,0],
      ],
    },
    {
      name: 'Flocon de Neige', slug: 'flocon-neige', difficulty: 'difficile', color: '#93c5fd',
      solution: [
        [0,0,0,0,1,1,0,0,0,0],
        [0,1,0,0,1,1,0,0,1,0],
        [0,0,1,0,1,1,0,1,0,0],
        [0,0,0,1,1,1,1,0,0,0],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,1,0,1,1,0,1,0,0],
        [0,1,0,0,1,1,0,0,1,0],
        [0,0,0,0,1,1,0,0,0,0],
      ],
    },
    {
      name: 'Bougie de Noël', slug: 'bougie-noel', difficulty: 'facile', color: '#f6c90e',
      solution: [
        [0,0,0,0,1,0,0,0,0,0],
        [0,0,0,1,1,1,0,0,0,0],
        [0,0,0,0,1,0,0,0,0,0],
        [0,0,0,1,1,1,0,0,0,0],
        [0,0,0,1,1,1,0,0,0,0],
        [0,0,0,1,1,1,0,0,0,0],
        [0,0,0,1,1,1,0,0,0,0],
        [0,0,0,1,1,1,0,0,0,0],
        [0,0,1,1,1,1,1,0,0,0],
        [0,1,1,1,1,1,1,1,0,0],
      ],
    },
  ],

  halloween: [
    {
      name: 'Citrouille', slug: 'citrouille-halloween', difficulty: 'facile', color: '#f97316',
      solution: [
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,1,0,1,1,0,1,1,0],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,0,0,0,0,0,0,1,1],
        [1,1,1,0,0,0,0,1,1,1],
        [0,1,1,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
      ],
    },
    {
      name: 'Fantôme', slug: 'fantome-halloween', difficulty: 'facile', color: '#e2f0ff',
      solution: [
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,1,0],
        [1,1,0,1,1,1,1,0,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,1,0,1,1,0,1,0,1],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
      ],
    },
    {
      name: 'Chauve-souris', slug: 'chauve-souris-halloween', difficulty: 'moyen', color: '#7c3aed',
      solution: [
        [0,0,0,0,0,0,0,0,0,0],
        [1,1,0,0,0,0,0,0,1,1],
        [1,1,1,0,0,0,0,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [0,1,1,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,0,0,1,1,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
      ],
    },
    {
      name: 'Araignée', slug: 'araignee-halloween', difficulty: 'difficile', color: '#1a1a2e',
      solution: [
        [1,0,0,0,0,0,0,0,0,1],
        [0,1,0,0,0,0,0,0,1,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,1,0,1,1,0,1,1,0],
        [0,1,1,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,0,0,1,1,0,0,1,0],
        [1,0,0,0,1,1,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,0],
      ],
    },
    {
      name: 'Lune d\'Halloween', slug: 'lune-halloween', difficulty: 'facile', color: '#fbbf24',
      solution: [
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,1,1,0,0,1,1,1,0],
        [1,1,1,0,0,0,0,1,1,1],
        [1,1,1,0,0,0,0,1,1,1],
        [1,1,1,0,0,0,0,1,1,1],
        [0,1,1,1,0,0,1,1,1,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
      ],
    },
    {
      name: 'Chapeau de Sorcière', slug: 'chapeau-sorciere', difficulty: 'facile', color: '#7c3aed',
      solution: [
        [0,0,0,0,1,0,0,0,0,0],
        [0,0,0,1,1,1,0,0,0,0],
        [0,0,0,1,1,1,0,0,0,0],
        [0,0,1,1,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,0,0,0],
        [0,1,1,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0,0],
        [1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0],
      ],
    },
  ],

  paques: [
    {
      name: 'Œuf de Pâques', slug: 'oeuf-paques', difficulty: 'facile', color: '#a78bfa',
      solution: [
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,1,0],
        [1,1,1,0,0,0,0,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,0,0,0,0,0,0,1,1],
        [0,1,1,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,0,0,1,1,1,1,0,0,0],
      ],
    },
    {
      name: 'Lapin de Pâques', slug: 'lapin-paques', difficulty: 'moyen', color: '#f9a8d4',
      solution: [
        [0,1,0,0,0,0,0,1,0,0],
        [0,1,0,0,0,0,0,1,0,0],
        [0,1,1,0,0,0,1,1,0,0],
        [0,0,1,1,1,1,1,0,0,0],
        [0,1,1,1,1,1,1,1,0,0],
        [0,1,0,1,1,1,0,1,0,0],
        [0,1,1,1,1,1,1,1,0,0],
        [0,0,1,1,0,1,1,0,0,0],
        [0,0,1,0,0,0,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
      ],
    },
    {
      name: 'Poussin', slug: 'poussin-paques', difficulty: 'facile', color: '#fde68a',
      solution: [
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,0,1,0,1,1,0,1,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,1,1,0],
        [0,0,1,0,0,0,0,1,0,0],
        [0,0,1,0,0,0,0,1,0,0],
      ],
    },
    {
      name: 'Panier de Pâques', slug: 'panier-paques', difficulty: 'moyen', color: '#92400e',
      solution: [
        [0,0,0,0,1,1,0,0,0,0],
        [0,0,0,1,0,0,1,0,0,0],
        [0,0,1,0,0,0,0,1,0,0],
        [0,1,1,1,1,1,1,1,1,0],
        [1,1,0,1,0,1,0,1,0,1],
        [1,1,1,0,1,0,1,0,1,1],
        [1,1,0,1,0,1,0,1,0,1],
        [1,1,1,1,1,1,1,1,1,1],
        [0,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0],
      ],
    },
  ],

  saint_valentin: [
    {
      name: 'Cœur Valentin', slug: 'coeur-valentin', difficulty: 'facile', color: '#ff6b6b',
      solution: [
        [0,0,0,0,0,0,0,0,0,0],
        [0,1,1,0,0,0,1,1,0,0],
        [1,1,1,1,0,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,1,0,0],
        [0,0,1,1,1,1,1,0,0,0],
        [0,0,0,1,1,1,0,0,0,0],
        [0,0,0,0,1,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
      ],
    },
    {
      name: 'Rose', slug: 'rose-valentin', difficulty: 'moyen', color: '#ff6b9d',
      solution: [
        [0,0,0,0,0,1,0,0,0,0],
        [0,0,0,0,1,1,1,0,0,0],
        [0,0,0,1,1,1,1,1,0,0],
        [0,0,1,1,1,1,1,1,1,0],
        [0,0,0,0,1,1,0,0,0,0],
        [0,0,0,0,1,1,0,0,0,0],
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,0,0,1,1,0,0,0,0],
        [0,0,0,0,1,1,0,0,0,0],
        [0,0,0,0,1,1,0,0,0,0],
      ],
    },
    {
      name: 'Double Cœur', slug: 'double-coeur-valentin', difficulty: 'moyen', color: '#ff6b6b',
      solution: [
        [0,1,1,0,0,0,1,1,0,0],
        [1,1,1,1,0,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,1,0,0],
        [0,0,1,1,1,1,1,0,0,0],
        [0,0,0,1,1,1,0,0,0,0],
        [0,0,0,0,1,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
      ],
    },
  ],
};

function savePuzzle(puzzle, season) {
  const clues = calculateAllClues(puzzle.solution);
  const rate = fillRate(puzzle.solution);
  const full = {
    id: puzzle.slug,
    slug: puzzle.slug,
    name: puzzle.name,
    category: season,
    size: 10,
    difficulty: puzzle.difficulty,
    color: puzzle.color,
    solution: puzzle.solution,
    clues,
    tags: [season, puzzle.name.toLowerCase()],
    colors: { filled: puzzle.color },
    meta: {
      tags: [season, puzzle.name.toLowerCase()],
      og_description: `Révèle "${puzzle.name}" dans ce nonogramme 10×10`,
    },
  };

  const dir = path.join(__dirname, '..', 'data', 'puzzles', season);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const outPath = path.join(dir, `${puzzle.slug}.json`);
  fs.writeFileSync(outPath, JSON.stringify(full, null, 2));
  console.log(`  ✓ ${puzzle.name} (fill: ${(rate * 100).toFixed(0)}%)`);
  return puzzle.slug;
}

function updateCatalog(slugsToAdd) {
  const catalogPath = path.join(__dirname, '..', 'data', 'puzzles', 'index.json');
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const existingSlugs = new Set(catalog.puzzles.map(p => p.slug));

  let added = 0;
  for (const { slug, season, difficulty } of slugsToAdd) {
    if (!existingSlugs.has(slug)) {
      catalog.puzzles.push({ slug, category: season, size: 10, difficulty });
      added++;
    }
  }

  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
  console.log(`\nCatalog: added ${added} new puzzles (${slugsToAdd.length - added} already existed)`);
}

console.log('Generating seasonal puzzle packs...\n');
const catalogEntries = [];

for (const [season, puzzles] of Object.entries(SEASONAL_PUZZLES)) {
  console.log(`📦 ${season} (${puzzles.length} puzzles)`);
  for (const puzzle of puzzles) {
    savePuzzle(puzzle, season);
    catalogEntries.push({ slug: puzzle.slug, season, difficulty: puzzle.difficulty });
  }
}

updateCatalog(catalogEntries);
console.log('\n✅ Done! All seasonal puzzles generated.');
