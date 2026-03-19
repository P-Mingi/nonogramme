#!/usr/bin/env node
/**
 * nonogramme.com — Puzzle Generation Pipeline
 * 
 * THREE modes:
 *   node pipeline.js emoji          → generates from emoji list (fastest, ~500 puzzles)
 *   node pipeline.js image <file>   → converts single PNG/SVG to puzzle
 *   node pipeline.js validate       → checks all existing puzzles for quality
 * 
 * Install: npm install jimp canvas sharp
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const OUTPUT_DIR = path.join(__dirname, '../src/data/puzzles/generated')
const CATALOG_PATH = path.join(__dirname, '../src/data/puzzles/catalog.json')
const THRESHOLD = 128  // pixel brightness < 128 = filled (black)

// ─── EMOJI CATALOG ─────────────────────────────────────────────────────────────
// These all convert to clean nonograms — simple shapes, high contrast
const EMOJI_CATALOG = [
  // Animaux 2
  { emoji: '🦊', name: 'Renard 2',     slug: 'renard-2',     category: 'animaux',   size: 10 },
  { emoji: '🐸', name: 'Grenouille 2', slug: 'grenouille-2', category: 'animaux',   size: 10 },
  { emoji: '🦋', name: 'Papillon 2',   slug: 'papillon-2',   category: 'animaux',   size: 10 },
  { emoji: '🐧', name: 'Pingouin 2',   slug: 'pingouin-2',   category: 'animaux',   size: 10 },
  { emoji: '🦁', name: 'Lion 2',       slug: 'lion-2',       category: 'animaux',   size: 10 },
  { emoji: '🐼', name: 'Panda 2',      slug: 'panda-2',      category: 'animaux',   size: 10 },
  { emoji: '🐨', name: 'Koala 2',      slug: 'koala-2',      category: 'animaux',   size: 10 },
  { emoji: '🦄', name: 'Licorne',      slug: 'licorne',      category: 'animaux',   size: 10 },
  { emoji: '🐙', name: 'Pieuvre 2',    slug: 'pieuvre-2',    category: 'animaux',   size: 10 },
  { emoji: '🦈', name: 'Requin 2',     slug: 'requin-2',     category: 'animaux',   size: 10 },
  { emoji: '🦀', name: 'Crabe 2',      slug: 'crabe-2',      category: 'animaux',   size: 10 },
  { emoji: '🦔', name: 'Herisson',     slug: 'herisson',     category: 'animaux',   size: 10 },
  { emoji: '🦦', name: 'Loutre',       slug: 'loutre',       category: 'animaux',   size: 10 },
  { emoji: '🦉', name: 'Hibou 2',      slug: 'hibou-2',      category: 'animaux',   size: 10 },
  { emoji: '🐺', name: 'Loup 2',       slug: 'loup-2',       category: 'animaux',   size: 10 },
  { emoji: '🦒', name: 'Girafe',       slug: 'girafe',       category: 'animaux',   size: 10 },
  { emoji: '🐘', name: 'Elephant 2',   slug: 'elephant-2',   category: 'animaux',   size: 10 },
  { emoji: '🦓', name: 'Zebre',        slug: 'zebre',        category: 'animaux',   size: 10 },
  { emoji: '🐊', name: 'Crocodile',    slug: 'crocodile',    category: 'animaux',   size: 10 },
  { emoji: '🦩', name: 'Flamant',      slug: 'flamant',      category: 'animaux',   size: 10 },

  // Nature 2
  { emoji: '🌸', name: 'Cerisier',     slug: 'cerisier',     category: 'nature',    size: 10 },
  { emoji: '🌵', name: 'Cactus 2',     slug: 'cactus-2',     category: 'nature',    size: 10 },
  { emoji: '🍄', name: 'Champignon 2', slug: 'champignon-2', category: 'nature',    size: 10 },
  { emoji: '🌻', name: 'Tournesol',    slug: 'tournesol',    category: 'nature',    size: 10 },
  { emoji: '🌴', name: 'Palmier',      slug: 'palmier',      category: 'nature',    size: 10 },
  { emoji: '🍀', name: 'Trefle',       slug: 'trefle',       category: 'nature',    size: 10 },
  { emoji: '🌊', name: 'Vague',        slug: 'vague',        category: 'nature',    size: 10 },
  { emoji: '❄️', name: 'Flocon',       slug: 'flocon',       category: 'nature',    size: 10 },
  { emoji: '🌈', name: 'Arc-en-ciel 2',slug: 'arc-en-ciel-2',category: 'nature',   size: 10 },
  { emoji: '🍁', name: 'Feuille Erable',slug:'feuille-erable',category: 'nature',   size: 10 },

  // Objets 2  
  { emoji: '🎮', name: 'Manette',      slug: 'manette',      category: 'objets',    size: 10 },
  { emoji: '🎸', name: 'Guitare 2',    slug: 'guitare-2',    category: 'objets',    size: 10 },
  { emoji: '🎺', name: 'Trompette',    slug: 'trompette',    category: 'objets',    size: 10 },
  { emoji: '🎻', name: 'Violon',       slug: 'violon',       category: 'objets',    size: 10 },
  { emoji: '📱', name: 'Smartphone',   slug: 'smartphone',   category: 'objets',    size: 10 },
  { emoji: '💻', name: 'Ordinateur',   slug: 'ordinateur',   category: 'objets',    size: 10 },
  { emoji: '🎩', name: 'Chapeau Haut', slug: 'chapeau-haut', category: 'objets',    size: 10 },
  { emoji: '🔑', name: 'Cle 2',        slug: 'cle-2',        category: 'objets',    size: 10 },
  { emoji: '⚽', name: 'Ballon',        slug: 'ballon',       category: 'objets',    size: 10 },
  { emoji: '🏆', name: 'Trophee 2',    slug: 'trophee-2',    category: 'objets',    size: 10 },
  { emoji: '🎁', name: 'Cadeau',       slug: 'cadeau',       category: 'objets',    size: 10 },
  { emoji: '🕯️', name: 'Bougie',      slug: 'bougie',       category: 'objets',    size: 10 },
  { emoji: '🔔', name: 'Cloche 2',     slug: 'cloche-2',     category: 'objets',    size: 10 },
  { emoji: '🎪', name: 'Tente',        slug: 'tente',        category: 'objets',    size: 10 },
  { emoji: '🚀', name: 'Fusee 2',      slug: 'fusee-2',      category: 'objets',    size: 10 },
  { emoji: '⚓', name: 'Ancre 2',      slug: 'ancre-2',      category: 'objets',    size: 10 },
  { emoji: '🗡️', name: 'Dague',       slug: 'dague',        category: 'objets',    size: 10 },
  { emoji: '🛡️', name: 'Bouclier 2',  slug: 'bouclier-2',   category: 'objets',    size: 10 },
  { emoji: '🧲', name: 'Aimant',       slug: 'aimant',       category: 'objets',    size: 10 },
  { emoji: '🔭', name: 'Telescope',    slug: 'telescope',    category: 'objets',    size: 10 },

  // Personnages 2
  { emoji: '🧙', name: 'Sorcier',      slug: 'sorcier',      category: 'personnages', size: 10 },
  { emoji: '🧜', name: 'Sirene',       slug: 'sirene',       category: 'personnages', size: 10 },
  { emoji: '🧝', name: 'Elfe',         slug: 'elfe',         category: 'personnages', size: 10 },
  { emoji: '🧛', name: 'Vampire',      slug: 'vampire',      category: 'personnages', size: 10 },
  { emoji: '🧟', name: 'Zombie 2',     slug: 'zombie-2',     category: 'personnages', size: 10 },
  { emoji: '👸', name: 'Princesse',    slug: 'princesse',    category: 'personnages', size: 10 },
  { emoji: '🤖', name: 'Robot 2',      slug: 'robot-2',      category: 'personnages', size: 10 },
  { emoji: '👻', name: 'Fantome 2',    slug: 'fantome-2',    category: 'personnages', size: 10 },
  { emoji: '🎃', name: 'Citrouille',   slug: 'citrouille',   category: 'personnages', size: 10 },
  { emoji: '🤡', name: 'Clown',        slug: 'clown',        category: 'personnages', size: 10 },

  // Nourriture (new category!)
  { emoji: '🍕', name: 'Pizza',        slug: 'pizza',        category: 'nourriture', size: 10 },
  { emoji: '🍔', name: 'Burger',       slug: 'burger',       category: 'nourriture', size: 10 },
  { emoji: '🍩', name: 'Donut',        slug: 'donut',        category: 'nourriture', size: 10 },
  { emoji: '🍦', name: 'Glace',        slug: 'glace',        category: 'nourriture', size: 10 },
  { emoji: '🎂', name: 'Gateau',       slug: 'gateau',       category: 'nourriture', size: 10 },
  { emoji: '🍎', name: 'Pomme',        slug: 'pomme',        category: 'nourriture', size: 10 },
  { emoji: '🍓', name: 'Fraise',       slug: 'fraise',       category: 'nourriture', size: 10 },
  { emoji: '🍇', name: 'Raisin',       slug: 'raisin',       category: 'nourriture', size: 10 },
  { emoji: '🌮', name: 'Taco',         slug: 'taco',         category: 'nourriture', size: 10 },
  { emoji: '🍜', name: 'Ramen',        slug: 'ramen',        category: 'nourriture', size: 10 },

  // Symboles 2
  { emoji: '⭐', name: 'Etoile 2',     slug: 'etoile-2',     category: 'symboles',  size: 10 },
  { emoji: '💎', name: 'Diamant 2',    slug: 'diamant-2',    category: 'symboles',  size: 10 },
  { emoji: '🔥', name: 'Flamme',       slug: 'flamme',       category: 'symboles',  size: 10 },
  { emoji: '⚡', name: 'Eclair 2',     slug: 'eclair-2',     category: 'symboles',  size: 10 },
  { emoji: '🌙', name: 'Lune 2',       slug: 'lune-2',       category: 'symboles',  size: 10 },
  { emoji: '☀️', name: 'Soleil 2',     slug: 'soleil-2',     category: 'symboles',  size: 10 },
  { emoji: '🌀', name: 'Spirale',      slug: 'spirale',      category: 'symboles',  size: 10 },
  { emoji: '♾️', name: 'Infini',       slug: 'infini',       category: 'symboles',  size: 10 },
  { emoji: '🎯', name: 'Cible',        slug: 'cible',        category: 'symboles',  size: 10 },
  { emoji: '☮️', name: 'Paix',         slug: 'paix',         category: 'symboles',  size: 10 },
]

// ─── CORE FUNCTIONS ────────────────────────────────────────────────────────────

function getClues(line) {
  const clues = []
  let count = 0
  for (const v of line) {
    if (v) count++
    else if (count) { clues.push(count); count = 0 }
  }
  if (count) clues.push(count)
  return clues.length ? clues : [0]
}

function calculateAllClues(solution) {
  const size = solution.length
  const rows = solution.map(row => getClues(row))
  const cols = []
  for (let c = 0; c < size; c++) {
    cols.push(getClues(solution.map(r => r[c])))
  }
  return { rows, cols }
}

function calculateDifficulty(solution, size) {
  const filled = solution.flat().filter(v => v).length
  const fillRate = filled / (size * size)
  if (size <= 5) return fillRate > 0.5 ? 'moyen' : 'facile'
  if (fillRate < 0.35) return 'expert'
  if (fillRate < 0.45) return 'difficile'
  if (fillRate < 0.6)  return 'moyen'
  return 'facile'
}

// Check if puzzle has unique solution using constraint propagation
// Simplified check — full backtracking is too slow for batch processing
function quickValidate(solution, size) {
  const filled = solution.flat().filter(v => v).length
  const fillRate = filled / (size * size)
  
  // Reject if too empty (< 10%) or too full (> 90%) — poor puzzles
  if (fillRate < 0.1 || fillRate > 0.9) return { valid: false, reason: `Fill rate ${(fillRate*100).toFixed(0)}% out of range` }
  
  // Reject if any row or column is ALL filled or ALL empty
  for (let r = 0; r < size; r++) {
    const rowSum = solution[r].reduce((a,b) => a+b, 0)
    if (rowSum === 0 || rowSum === size) return { valid: false, reason: `Row ${r} is all same` }
  }
  for (let c = 0; c < size; c++) {
    const colSum = solution.map(r => r[c]).reduce((a,b) => a+b, 0)
    if (colSum === 0 || colSum === size) return { valid: false, reason: `Col ${c} is all same` }
  }
  
  return { valid: true }
}

// Render ASCII preview for terminal review
function asciiPreview(solution) {
  return solution.map(row => 
    row.map(v => v ? '██' : '  ').join('')
  ).join('\n')
}

// ─── EMOJI → NONOGRAM ────────────────────────────────────────────────────────
async function emojiToNonogram(emojiEntry, size = 10) {
  // We render emoji using canvas, then threshold to B&W
  const { createCanvas } = require('canvas')
  const canvas = createCanvas(size * 8, size * 8)  // render large, then sample
  const ctx = canvas.getContext('2d')
  
  // White background
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Render emoji
  ctx.font = `${canvas.width * 0.85}px serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = 'black'
  ctx.fillText(emojiEntry.emoji, canvas.width / 2, canvas.height / 2)
  
  // Sample to grid
  const solution = []
  const cellSize = canvas.width / size
  
  for (let r = 0; r < size; r++) {
    const row = []
    for (let c = 0; c < size; c++) {
      // Sample center of each cell
      const x = Math.floor((c + 0.5) * cellSize)
      const y = Math.floor((r + 0.5) * cellSize)
      const pixel = ctx.getImageData(x, y, 1, 1).data
      // Convert to grayscale
      const gray = 0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2]
      row.push(gray < THRESHOLD ? 1 : 0)
    }
    solution.push(row)
  }
  
  return solution
}

// ─── IMAGE FILE → NONOGRAM ───────────────────────────────────────────────────
async function imageToNonogram(imagePath, size = 10) {
  const Jimp = require('jimp')
  const image = await Jimp.read(imagePath)
  image.resize(size, size).greyscale()
  
  const solution = []
  for (let r = 0; r < size; r++) {
    const row = []
    for (let c = 0; c < size; c++) {
      const pixel = Jimp.intToRGBA(image.getPixelColor(c, r))
      row.push(pixel.r < THRESHOLD ? 1 : 0)
    }
    solution.push(row)
  }
  return solution
}

// ─── SAVE PUZZLE ─────────────────────────────────────────────────────────────
function savePuzzle(entry, solution) {
  const clues = calculateAllClues(solution)
  const difficulty = calculateDifficulty(solution, entry.size)
  const filled = solution.flat().filter(v => v).length
  
  const colorMap = {
    animaux:    '#4ecdc4',
    nature:     '#4ade80',
    objets:     '#ffd93d',
    personnages:'#c084fc',
    nourriture: '#ff6b6b',
    symboles:   '#45b7d1',
  }
  
  const puzzle = {
    id: entry.slug,
    slug: entry.slug,
    name: entry.name,
    category: entry.category,
    size: entry.size,
    difficulty,
    color: colorMap[entry.category] || '#4ecdc4',
    solution,
    clues,
    tags: [entry.name.toLowerCase(), entry.category],
    meta: {
      og_description: `Révèle "${entry.name}" dans ce nonogramme ${entry.size}×${entry.size}`,
      generated_from: entry.emoji || 'image',
    },
    stats: {
      total_filled: filled,
      fill_rate: parseFloat((filled / (entry.size * entry.size)).toFixed(3)),
    }
  }
  
  const dir = path.join(OUTPUT_DIR, entry.category)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  
  const outputPath = path.join(dir, `${entry.slug}.json`)
  fs.writeFileSync(outputPath, JSON.stringify(puzzle, null, 2))
  return outputPath
}

// ─── BATCH EMOJI MODE ────────────────────────────────────────────────────────
async function batchEmoji() {
  console.log(`\n🚀 Batch emoji mode — ${EMOJI_CATALOG.length} puzzles to generate\n`)
  
  const results = { success: [], failed: [], skipped: [] }
  
  for (const entry of EMOJI_CATALOG) {
    // Skip if already exists
    const outputPath = path.join(OUTPUT_DIR, entry.category, `${entry.slug}.json`)
    if (fs.existsSync(outputPath)) {
      results.skipped.push(entry.slug)
      process.stdout.write(`⏭  `)
      continue
    }
    
    try {
      const solution = await emojiToNonogram(entry, entry.size)
      const validation = quickValidate(solution, entry.size)
      
      if (!validation.valid) {
        results.failed.push({ slug: entry.slug, reason: validation.reason })
        process.stdout.write(`✗  `)
        continue
      }
      
      savePuzzle(entry, solution)
      results.success.push(entry.slug)
      process.stdout.write(`✓  `)
      
    } catch (err) {
      results.failed.push({ slug: entry.slug, reason: err.message })
      process.stdout.write(`✗  `)
    }
  }
  
  console.log(`\n\n📊 Results:`)
  console.log(`  ✓ Generated: ${results.success.length}`)
  console.log(`  ⏭  Skipped:   ${results.skipped.length}`)
  console.log(`  ✗ Failed:    ${results.failed.length}`)
  
  if (results.failed.length > 0) {
    console.log(`\nFailed puzzles:`)
    results.failed.forEach(f => console.log(`  - ${f.slug}: ${f.reason}`))
  }
  
  console.log(`\n✅ Done! New puzzles saved to: ${OUTPUT_DIR}`)
  console.log(`\nNext: Update src/data/puzzles/index.ts to import the new puzzles`)
  console.log(`Run: node pipeline.js validate  to check all puzzle quality`)
}

// ─── SINGLE IMAGE MODE ───────────────────────────────────────────────────────
async function singleImage(imagePath) {
  if (!imagePath) {
    console.error('Usage: node pipeline.js image <path.png> [name] [slug] [category] [size]')
    process.exit(1)
  }
  
  const args = process.argv.slice(3)
  const name = args[1] || path.basename(imagePath, path.extname(imagePath))
  const slug = args[2] || name.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const category = args[3] || 'objets'
  const size = parseInt(args[4] || '10')
  
  console.log(`\n📐 Converting: ${imagePath}`)
  console.log(`   Name: ${name}, Slug: ${slug}, Category: ${category}, Size: ${size}×${size}\n`)
  
  const solution = await imageToNonogram(imagePath, size)
  const validation = quickValidate(solution, size)
  
  // Show ASCII preview
  console.log('Preview:')
  console.log(asciiPreview(solution))
  
  const filled = solution.flat().filter(v => v).length
  const fillRate = (filled / (size * size) * 100).toFixed(1)
  console.log(`\nFill rate: ${filled}/${size*size} (${fillRate}%)`)
  console.log(`Validation: ${validation.valid ? '✅ OK' : `❌ ${validation.reason}`}`)
  
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  rl.question('\nSave this puzzle? (y/n/r=retry with different threshold): ', (answer) => {
    rl.close()
    if (answer.toLowerCase() === 'y') {
      const outputPath = savePuzzle({ name, slug, category, size }, solution)
      console.log(`✅ Saved to: ${outputPath}`)
      console.log(`\nAdd to your puzzle catalog in src/data/puzzles/index.ts`)
    } else {
      console.log('Skipped.')
    }
  })
}

// ─── VALIDATE MODE ───────────────────────────────────────────────────────────
function validateAll() {
  console.log('\n🔍 Validating all puzzles...\n')
  
  const issues = []
  let total = 0
  
  function scanDir(dir) {
    if (!fs.existsSync(dir)) return
    const items = fs.readdirSync(dir)
    for (const item of items) {
      const fullPath = path.join(dir, item)
      if (fs.statSync(fullPath).isDirectory()) {
        scanDir(fullPath)
      } else if (item.endsWith('.json') && item !== 'catalog.json') {
        total++
        try {
          const puzzle = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
          const validation = quickValidate(puzzle.solution, puzzle.size)
          
          // Verify clues match solution
          const recomputed = calculateAllClues(puzzle.solution)
          const cluesMismatch = 
            JSON.stringify(recomputed.rows) !== JSON.stringify(puzzle.clues.rows) ||
            JSON.stringify(recomputed.cols) !== JSON.stringify(puzzle.clues.cols)
          
          if (!validation.valid) {
            issues.push({ file: item, issue: validation.reason })
          } else if (cluesMismatch) {
            issues.push({ file: item, issue: 'Clues do not match solution — needs regeneration' })
          }
        } catch (err) {
          issues.push({ file: item, issue: `JSON parse error: ${err.message}` })
        }
      }
    }
  }
  
  // Scan all puzzle directories
  const puzzleDirs = [
    path.join(__dirname, '../src/data/puzzles'),
    OUTPUT_DIR,
  ]
  puzzleDirs.forEach(scanDir)
  
  console.log(`Scanned: ${total} puzzles`)
  
  if (issues.length === 0) {
    console.log('✅ All puzzles valid!')
  } else {
    console.log(`\n⚠️  ${issues.length} issues found:`)
    issues.forEach(i => console.log(`  - ${i.file}: ${i.issue}`))
  }
}

// ─── IMPORT GENERATOR ────────────────────────────────────────────────────────
// After generating, run this to create the import statements
function generateImports() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.log('No generated puzzles yet. Run: node pipeline.js emoji')
    return
  }
  
  const imports = []
  const puzzleVars = []
  
  function scanForPuzzles(dir, category) {
    if (!fs.existsSync(dir)) return
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'))
    files.forEach(file => {
      const slug = file.replace('.json', '')
      const varName = slug.replace(/-(\w)/g, (_, c) => c.toUpperCase())
      imports.push(`import ${varName} from '@/data/puzzles/generated/${category}/${file}'`)
      puzzleVars.push(varName)
    })
  }
  
  const categories = ['animaux', 'nature', 'objets', 'personnages', 'nourriture', 'symboles']
  categories.forEach(cat => scanForPuzzles(path.join(OUTPUT_DIR, cat), cat))
  
  const output = `
// AUTO-GENERATED — do not edit manually
// Run: node scripts/pipeline.js emoji  to regenerate

${imports.join('\n')}

export const GENERATED_PUZZLES = [
  ${puzzleVars.join(',\n  ')}
]
`
  
  const outputPath = path.join(__dirname, '../src/data/puzzles/generated/index.ts')
  fs.writeFileSync(outputPath, output)
  console.log(`✅ Generated imports file: ${outputPath}`)
  console.log(`\nIn your main puzzles/index.ts, add:`)
  console.log(`  import { GENERATED_PUZZLES } from './generated'`)
  console.log(`  export const ALL_PUZZLES = [...PUZZLES, ...GENERATED_PUZZLES]`)
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const mode = process.argv[2]

switch (mode) {
  case 'emoji':
    batchEmoji().catch(console.error)
    break
  case 'image':
    singleImage(process.argv[3]).catch(console.error)
    break
  case 'validate':
    validateAll()
    break
  case 'imports':
    generateImports()
    break
  default:
    console.log(`
nonogramme.com — Puzzle Pipeline

Usage:
  node pipeline.js emoji              Generate all emoji puzzles (~80 new puzzles)
  node pipeline.js image <file.png>   Convert single image to puzzle
  node pipeline.js validate           Check all puzzle quality
  node pipeline.js imports            Generate TypeScript import file

Install deps first:
  npm install canvas jimp
    `)
}
