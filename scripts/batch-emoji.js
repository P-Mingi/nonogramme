#!/usr/bin/env node
// Batch-generates nonogram puzzles from a curated emoji list.
// Usage: node scripts/batch-emoji.js [--dry-run] [--size=10] [--no-validate]
//
// --dry-run    Show what would be generated without saving
// --size=5     Override size for all (default: per entry)

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CATALOG_PATH = path.join(__dirname, '../data/puzzles/index.json');

function loadSlugs() {
  if (!fs.existsSync(CATALOG_PATH)) return new Set();
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  return new Set(catalog.puzzles.map(p => p.slug));
}

function slugify(name, size) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + `-${size}x${size}`;
}

// ─── Curated emoji list ───────────────────────────────────────────────────────
// Format: [emoji, name, category, size]
// size 5 = fast (5x5 facile), 10 = standard, 15 = hard
const EMOJI_LIST = [
  // Animaux 10x10
  ['🦊', 'Renard',       'animaux',    10],
  ['🐺', 'Loup',         'animaux',    10],
  ['🦁', 'Lion',         'animaux',    10],
  ['🐯', 'Tigre',        'animaux',    10],
  ['🐻', 'Ours',         'animaux',    10],
  ['🐼', 'Panda',        'animaux',    10],
  ['🐨', 'Koala',        'animaux',    10],
  ['🦝', 'Raton Laveur', 'animaux',    10],
  ['🦦', 'Loutre',       'animaux',    10],
  ['🦥', 'Paresseux',    'animaux',    10],
  ['🐸', 'Grenouille',   'animaux',    10],
  ['🐊', 'Crocodile',    'animaux',    10],
  ['🦎', 'Lezard',       'animaux',    10],
  ['🐢', 'Tortue',       'animaux',    10],
  ['🦕', 'Diplodocus',   'animaux',    10],
  ['🦖', 'T-Rex',        'animaux',    10],
  ['🐬', 'Dauphin',      'animaux',    10],
  ['🐳', 'Baleine',      'animaux',    10],
  ['🦈', 'Requin',       'animaux',    10],
  ['🐙', 'Pieuvre',      'animaux',    10],
  ['🦑', 'Calmar',       'animaux',    10],
  ['🦀', 'Crabe',        'animaux',    10],
  ['🦞', 'Homard',       'animaux',    10],
  ['🐡', 'Poisson Lune', 'animaux',    10],
  ['🦋', 'Papillon',     'animaux',    10],
  ['🐝', 'Abeille',      'animaux',    10],
  ['🐞', 'Coccinelle',   'animaux',    10],
  ['🦗', 'Grillon',      'animaux',    10],
  ['🦟', 'Moustique',    'animaux',    10],
  ['🦠', 'Microbe',      'animaux',    10],
  ['🐓', 'Coq',          'animaux',    10],
  ['🦚', 'Paon',         'animaux',    10],
  ['🦜', 'Perroquet',    'animaux',    10],
  ['🦩', 'Flamant Rose', 'animaux',    10],
  ['🦉', 'Hibou',        'animaux',    10],
  ['🦅', 'Aigle',        'animaux',    10],

  // Animaux 5x5 (facile)
  ['🐱', 'Chat',         'animaux',     5],
  ['🐶', 'Chien',        'animaux',     5],
  ['🐰', 'Lapin',        'animaux',     5],
  ['🐹', 'Hamster',      'animaux',     5],
  ['🐭', 'Souris',       'animaux',     5],
  ['🐷', 'Cochon',       'animaux',     5],
  ['🐮', 'Vache',        'animaux',     5],
  ['🐴', 'Cheval',       'animaux',     5],
  ['🦊', 'Renard Petit', 'animaux',     5],
  ['🐸', 'Grenouille Petite', 'animaux', 5],

  // Nature 10x10
  ['🌋', 'Volcan',       'nature',     10],
  ['🏔️', 'Montagne',    'nature',     10],
  ['🌊', 'Vague',        'nature',     10],
  ['🌪️', 'Tornade',     'nature',     10],
  ['❄️', 'Flocon',       'nature',     10],
  ['🌈', 'Arc-en-Ciel',  'nature',     10],
  ['⭐', 'Etoile',       'nature',     10],
  ['🌙', 'Lune',         'nature',     10],
  ['☀️', 'Soleil',       'nature',     10],
  ['🌸', 'Fleur de Cerisier', 'nature', 10],
  ['🌺', 'Hibiscus',     'nature',     10],
  ['🌻', 'Tournesol',    'nature',     10],
  ['🍀', 'Trefle',       'nature',     10],
  ['🌴', 'Palmier',      'nature',     10],
  ['🌵', 'Cactus',       'nature',     10],
  ['🍄', 'Champignon',   'nature',     10],
  ['🌾', 'Ble',          'nature',     10],

  // Objets 10x10
  ['🏠', 'Maison',       'objets',     10],
  ['🏰', 'Chateau',      'objets',     10],
  ['⛺', 'Tente',        'objets',     10],
  ['🚗', 'Voiture',      'objets',     10],
  ['🚀', 'Fusee',        'objets',     10],
  ['✈️', 'Avion',        'objets',     10],
  ['⛵', 'Voilier',      'objets',     10],
  ['🚂', 'Train',        'objets',     10],
  ['🎸', 'Guitare',      'objets',     10],
  ['🎹', 'Piano',        'objets',     10],
  ['🎺', 'Trompette',    'objets',     10],
  ['🎻', 'Violon',       'objets',     10],
  ['🔭', 'Telescope',    'objets',     10],
  ['🔬', 'Microscope',   'objets',     10],
  ['💡', 'Ampoule',      'objets',     10],
  ['⚓', 'Ancre',        'objets',     10],
  ['🗝️', 'Cle',         'objets',     10],
  ['🧲', 'Aimant',       'objets',     10],

  // Nourriture 10x10
  ['🍕', 'Pizza',        'nourriture', 10],
  ['🍔', 'Burger',       'nourriture', 10],
  ['🌮', 'Taco',         'nourriture', 10],
  ['🍜', 'Ramen',        'nourriture', 10],
  ['🍣', 'Sushi',        'nourriture', 10],
  ['🍩', 'Donut',        'nourriture', 10],
  ['🎂', 'Gateau',       'nourriture', 10],
  ['🍦', 'Glace',        'nourriture', 10],
  ['🍇', 'Raisins',      'nourriture', 10],
  ['🍓', 'Fraise',       'nourriture', 10],
  ['🍑', 'Peche',        'nourriture', 10],
  ['🥑', 'Avocat',       'nourriture', 10],

  // 15x15 difficile
  ['🦁', 'Lion Royal',     'animaux',    15],
  ['🦋', 'Grand Papillon', 'animaux',    15],
  ['🦅', 'Grand Aigle',    'animaux',    15],
  ['🐬', 'Dauphin Saut',   'animaux',    15],
  ['🌋', 'Grand Volcan',   'nature',     15],
  ['🚀', 'Grande Fusee',   'objets',     15],
  ['🎪', 'Cirque',         'objets',     15],
  ['🏰', 'Grand Chateau',  'objets',     15],
  ['🎭', 'Masque',         'personnages', 15],

  // 15x15 expert
  ['🐉', 'Dragon',         'animaux',    15],
  ['🌍', 'Planete Terre',  'nature',     15],
  ['🗺️', 'Carte',         'objets',     15],
  ['⚔️', 'Epees Croisees', 'objets',     15],
  ['🧙', 'Grand Sorcier',  'personnages', 15],
  ['🌠', 'Etoile Filante', 'nature',     15],

  // Symboles 10x10
  ['❤️', 'Coeur Rouge',  'symboles',  10],
  ['⭐', 'Etoile Jaune', 'symboles',  10],
  ['♟️', 'Pion Echecs',  'symboles',  10],
  ['☯️', 'Yin-Yang',     'symboles',  10],
  ['🔱', 'Trident',      'symboles',  10],
  ['⚡', 'Eclair',       'symboles',  10],
  ['🎯', 'Cible',        'symboles',  10],
  ['♾️', 'Infini',       'symboles',  10],
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args    = process.argv.slice(2);
  const dryRun  = args.includes('--dry-run');
  const noVal   = args.includes('--no-validate');
  const sizeArg = args.find(a => a.startsWith('--size='));
  const overrideSize = sizeArg ? parseInt(sizeArg.split('=')[1]) : null;

  const existingSlugs = loadSlugs();

  const toProcess = EMOJI_LIST.filter(([, name, , size]) => {
    const s = overrideSize || size;
    const slug = slugify(name, s);
    if (existingSlugs.has(slug)) {
      console.log(`⏭️  Skipping (already exists): ${slug}`);
      return false;
    }
    return true;
  });

  console.log(`\n📦 ${toProcess.length} puzzles à générer (${EMOJI_LIST.length - toProcess.length} déjà existants)\n`);

  if (dryRun) {
    toProcess.forEach(([emoji, name, category, size]) => {
      const s = overrideSize || size;
      console.log(`  ${emoji}  ${name.padEnd(20)} ${category.padEnd(12)} ${s}x${s}  → ${slugify(name, s)}`);
    });
    return;
  }

  let ok = 0, fail = 0;

  for (const [emoji, name, category, size] of toProcess) {
    const s = overrideSize || size;
    const extraFlags = noVal ? '--no-validate' : '';
    const cmd = `node scripts/pipeline.js emoji "${emoji}" --name="${name}" --category=${category} --size=${s} --yes ${extraFlags}`;

    console.log(`\n━━━ ${emoji} ${name} (${s}x${s}) ━━━`);
    try {
      execSync(cmd, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
      ok++;
    } catch {
      console.error(`❌ Échec: ${name}`);
      fail++;
    }
  }

  console.log(`\n\n✅ Terminé: ${ok} ajoutés, ${fail} échoués`);
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  console.log(`📋 Catalog total: ${catalog.puzzles.length} puzzles`);
}

main().catch(err => {
  console.error('Erreur:', err.message);
  process.exit(1);
});
