# nonogramme.com — Architecture Complète
## Startup playbook · Stack 0€ · Cible revente 24 mois

---

## 1. STRUCTURE DU REPO

```
nonogramme.com/
├── app/                          # Next.js 14 App Router
│   ├── (game)/
│   │   ├── page.tsx              # Homepage — puzzle du jour
│   │   ├── puzzle/[slug]/
│   │   │   └── page.tsx          # Page puzzle individuelle (SEO)
│   │   ├── categories/
│   │   │   └── [category]/
│   │   │       └── page.tsx      # /animaux, /nature, /objets...
│   │   └── daily/
│   │       └── page.tsx          # Redirect vers puzzle du jour
│   ├── (social)/
│   │   ├── classement/
│   │   │   └── page.tsx          # Leaderboard global
│   │   ├── tournoi/
│   │   │   └── page.tsx          # Tournoi hebdomadaire live
│   │   └── profil/[username]/
│   │       └── page.tsx          # Profil public joueur
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── api/
│   │   ├── puzzle/
│   │   │   ├── daily/route.ts    # GET puzzle du jour
│   │   │   └── [id]/route.ts     # GET puzzle par ID
│   │   ├── score/
│   │   │   └── route.ts          # POST score après completion
│   │   ├── leaderboard/
│   │   │   └── route.ts          # GET classement (global/weekly)
│   │   └── tournament/
│   │       └── route.ts          # GET/POST tournoi
│   └── layout.tsx
├── components/
│   ├── game/
│   │   ├── NonogramBoard.tsx     # Le moteur de jeu principal
│   │   ├── GameHeader.tsx        # Timer, score, niveau
│   │   ├── Toolbar.tsx           # Fill/Mark/Erase + hints
│   │   ├── WinScreen.tsx         # Animation révélation + partage
│   │   └── PixelReveal.tsx       # Animation canvas pixel reveal
│   ├── social/
│   │   ├── Leaderboard.tsx       # Table classement realtime
│   │   ├── TournamentTimer.tsx   # Countdown tournoi
│   │   └── ShareCard.tsx         # Image de partage générable
│   └── ui/
│       ├── DeepSpaceLayout.tsx   # Layout Dark premium
│       └── XPBar.tsx             # Barre XP + niveau joueur
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Client browser
│   │   ├── server.ts             # Client server-side
│   │   └── types.ts              # Types générés auto Supabase
│   ├── game/
│   │   ├── solver.ts             # Vérif solution unique (backtracking)
│   │   ├── validator.ts          # Validation grille joueur
│   │   └── clues.ts              # Calcul indices lignes/colonnes
│   └── utils/
│       ├── daily.ts              # Logique puzzle du jour (date seed)
│       └── xp.ts                 # Calcul XP et niveaux
├── data/
│   └── puzzles/
│       ├── index.json            # Catalogue (id, slug, category, size)
│       ├── animaux/
│       │   ├── chat.json
│       │   ├── chien.json
│       │   └── ...
│       ├── nature/
│       ├── objets/
│       ├── personnages/
│       └── special/              # Saisonnier (noel, halloween...)
├── scripts/
│   ├── image-to-nonogram.js      # Pipeline PNG → JSON puzzle
│   ├── validate-puzzles.js       # Vérifie solution unique tous puzzles
│   └── generate-sitemap.js       # Génère sitemap.xml dynamique
└── public/
    ├── puzzles/                  # Images PNG originales (référence)
    └── og/                       # Open Graph images par puzzle
```

---

## 2. SCHÉMA SUPABASE

```sql
-- USERS (étend auth.users Supabase)
create table profiles (
  id uuid references auth.users primary key,
  username text unique not null,
  avatar_url text,
  xp integer default 0,
  level integer default 1,
  streak_current integer default 0,
  streak_best integer default 0,
  streak_last_date date,
  puzzles_completed integer default 0,
  is_premium boolean default false,
  premium_until timestamptz,
  created_at timestamptz default now()
);

-- PUZZLES (metadata — la grille est dans /data/puzzles/*.json)
create table puzzles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,          -- "chat-mignon-10x10"
  name text not null,                 -- "Chat mignon"
  category text not null,             -- "animaux"
  size integer not null,              -- 10, 15, 20, 25
  difficulty text not null,           -- "facile","moyen","difficile","expert"
  play_count integer default 0,
  avg_time_seconds integer,
  times_completed integer default 0,
  is_daily boolean default false,
  daily_date date,
  is_tournament boolean default false,
  created_at timestamptz default now()
);

-- COMPLETIONS (chaque résolution)
create table completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  puzzle_id uuid references puzzles(id),
  time_seconds integer not null,
  errors integer default 0,
  hints_used integer default 0,
  score integer not null,             -- calculé: base - erreurs*50 - hints*30
  completed_at timestamptz default now(),
  unique(user_id, puzzle_id)          -- un seul score par puzzle par joueur
);

-- LEADERBOARD VIEW (calculé auto)
create view leaderboard_global as
  select
    p.id, p.username, p.avatar_url, p.xp, p.level,
    p.puzzles_completed,
    p.streak_current,
    sum(c.score) as total_score,
    min(c.time_seconds) filter (where pu.size = 10) as best_time_10x10,
    rank() over (order by sum(c.score) desc) as rank
  from profiles p
  join completions c on c.user_id = p.id
  join puzzles pu on pu.id = c.puzzle_id
  group by p.id, p.username, p.avatar_url, p.xp, p.level, p.puzzles_completed, p.streak_current;

-- LEADERBOARD WEEKLY
create view leaderboard_weekly as
  select
    p.id, p.username, p.avatar_url, p.xp, p.level,
    sum(c.score) as weekly_score,
    count(c.id) as weekly_completions,
    rank() over (order by sum(c.score) desc) as rank
  from profiles p
  join completions c on c.user_id = p.id
  where c.completed_at >= date_trunc('week', now())
  group by p.id, p.username, p.avatar_url, p.xp, p.level;

-- TOURNAMENTS
create table tournaments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  puzzle_id uuid references puzzles(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_premium boolean default false,
  entry_price_cents integer default 0,
  prize_description text,
  status text default 'upcoming'      -- upcoming, live, finished
);

create table tournament_entries (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid references tournaments(id),
  user_id uuid references profiles(id),
  score integer,
  time_seconds integer,
  completed_at timestamptz,
  rank integer,
  unique(tournament_id, user_id)
);

-- RLS (Row Level Security) — chaque user voit seulement ses données
alter table profiles enable row level security;
alter table completions enable row level security;

create policy "profiles publics en lecture"
  on profiles for select using (true);

create policy "users peuvent modifier leur profil"
  on profiles for update using (auth.uid() = id);

create policy "completions privées"
  on completions for select using (auth.uid() = user_id);

create policy "insert completion authentifié"
  on completions for insert with check (auth.uid() = user_id);
```

---

## 3. FORMAT PUZZLE JSON

```json
{
  "id": "chat-mignon-10x10",
  "slug": "chat-mignon-10x10",
  "name": "Chat mignon",
  "category": "animaux",
  "size": 10,
  "difficulty": "facile",
  "author": "pipeline-v1",
  "solution": [
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,0,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,0,1,1,1,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,0,0,1,1,0,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,0,1,1,1,1,0,1,0],
    [0,0,0,1,1,1,1,0,0,0]
  ],
  "clues": {
    "rows": [[6],[2,2,2],[10],[2,4,2],[10],[8],[2,2],[2,2,2],[1,4,1],[4]],
    "cols": [[5],[2,4],[1,2,3],[1,6],[2,6],[2,6],[1,6],[1,2,3],[2,4],[5]]
  },
  "colors": {
    "filled": "#4ecdc4",
    "background": "#0d1528"
  },
  "stats": {
    "total_filled": 62,
    "difficulty_score": 0.38
  },
  "meta": {
    "tags": ["chat", "animal", "mignon"],
    "og_description": "Révèle un chat mignon dans ce nonogramme 10x10"
  }
}
```

---

## 4. SCRIPT PIPELINE IMAGE → NONOGRAMME

```javascript
// scripts/image-to-nonogram.js
// Usage: node image-to-nonogram.js input.png output.json --size=10 --name="Chat"

const Jimp = require('jimp');
const readline = require('readline');

async function imageToNonogram(inputPath, size = 10) {
  const image = await Jimp.read(inputPath);
  
  // Resize + convert to B&W
  image.resize(size, size);
  image.greyscale();
  
  // Threshold: pixel < 128 = filled (black), >= 128 = empty (white)
  const solution = [];
  for (let row = 0; row < size; row++) {
    const rowData = [];
    for (let col = 0; col < size; col++) {
      const pixel = Jimp.intToRGBA(image.getPixelColor(col, row));
      rowData.push(pixel.r < 128 ? 1 : 0);
    }
    solution.push(rowData);
  }
  
  return solution;
}

function calculateClues(solution) {
  const size = solution.length;
  
  const rowClues = solution.map(row => {
    const clues = [];
    let count = 0;
    row.forEach(cell => {
      if (cell === 1) count++;
      else if (count > 0) { clues.push(count); count = 0; }
    });
    if (count > 0) clues.push(count);
    return clues.length ? clues : [0];
  });
  
  const colClues = [];
  for (let c = 0; c < size; c++) {
    const col = solution.map(r => r[c]);
    const clues = [];
    let count = 0;
    col.forEach(cell => {
      if (cell === 1) count++;
      else if (count > 0) { clues.push(count); count = 0; }
    });
    if (count > 0) clues.push(count);
    colClues.push(clues.length ? clues : [0]);
  }
  
  return { rows: rowClues, cols: colClues };
}

// CRITICAL: vérifie qu'il y a une seule solution possible (backtracking)
function hasUniqueSolution(clues, size) {
  let solutionCount = 0;
  
  function solve(grid, row) {
    if (solutionCount > 1) return; // early exit
    if (row === size) {
      // Vérifier toutes les colonnes
      for (let c = 0; c < size; c++) {
        const col = grid.map(r => r[c]);
        const actual = getLineClues(col);
        if (JSON.stringify(actual) !== JSON.stringify(clues.cols[c])) return;
      }
      solutionCount++;
      return;
    }
    
    // Générer toutes les combinaisons valides pour cette ligne
    const validRows = generateValidRows(clues.rows[row], size);
    for (const candidate of validRows) {
      grid.push(candidate);
      solve(grid, row + 1);
      grid.pop();
      if (solutionCount > 1) return;
    }
  }
  
  solve([], 0);
  return solutionCount === 1;
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

function generateValidRows(clue, size) {
  // Génère toutes les façons de placer les blocs dans une ligne
  const results = [];
  function place(pos, clueIdx, current) {
    if (clueIdx === clue.length) {
      while (current.length < size) current.push(0);
      if (current.length === size) results.push([...current]);
      return;
    }
    const blockLen = clue[clueIdx];
    const remaining = clue.slice(clueIdx + 1).reduce((a, b) => a + b, 0) +
                      clue.slice(clueIdx + 1).length;
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

// MAIN — avec preview ASCII dans le terminal
async function main() {
  const args = process.argv.slice(2);
  const inputPath = args[0];
  const outputPath = args[1] || 'output.json';
  const size = parseInt(args.find(a => a.startsWith('--size='))?.split('=')[1] || '10');
  const name = args.find(a => a.startsWith('--name='))?.split('=')[1] || 'Puzzle';
  
  console.log(`\n📐 Conversion: ${inputPath} → ${size}x${size}`);
  
  const solution = await imageToNonogram(inputPath, size);
  const clues = calculateClues(solution);
  
  // Preview ASCII
  console.log('\nAperçu:');
  solution.forEach(row => {
    console.log(row.map(c => c ? '██' : '  ').join(''));
  });
  
  // Stats
  const totalFilled = solution.flat().filter(c => c === 1).length;
  const fillRate = (totalFilled / (size * size) * 100).toFixed(1);
  console.log(`\nFilled: ${totalFilled}/${size*size} (${fillRate}%)`);
  
  // Vérification solution unique
  console.log('🔍 Vérification solution unique...');
  const isUnique = hasUniqueSolution(clues, size);
  console.log(isUnique ? '✅ Solution unique!' : '❌ Plusieurs solutions — rejeter');
  
  if (!isUnique) {
    console.log('Ce puzzle a plusieurs solutions. Essaie une autre image.');
    process.exit(1);
  }
  
  // Demander confirmation
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('\nValider ce puzzle ? (y/n): ', (answer) => {
    rl.close();
    if (answer.toLowerCase() === 'y') {
      const slug = name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-') + `-${size}x${size}`;
      
      const puzzle = {
        id: slug,
        slug,
        name,
        category: 'uncategorized',
        size,
        difficulty: fillRate > 60 ? 'facile' : fillRate > 40 ? 'moyen' : 'difficile',
        solution,
        clues,
        colors: { filled: '#4ecdc4', background: '#0d1528' },
        stats: { total_filled: totalFilled, difficulty_score: parseFloat((fillRate/100).toFixed(2)) },
        meta: { tags: [name.toLowerCase()], og_description: `Révèle ${name} dans ce nonogramme ${size}x${size}` }
      };
      
      require('fs').writeFileSync(outputPath, JSON.stringify(puzzle, null, 2));
      console.log(`\n✅ Puzzle sauvegardé: ${outputPath}`);
    } else {
      console.log('Puzzle rejeté.');
    }
  });
}

main().catch(console.error);
```

---

## 5. LOGIQUE PUZZLE DU JOUR

```typescript
// lib/utils/daily.ts
// Déterministe — même date = même puzzle pour tout le monde

export function getDailyPuzzleSlug(date: Date, puzzleSlugs: string[]): string {
  const dateStr = date.toISOString().split('T')[0]; // "2025-03-19"
  
  // Hash déterministe de la date
  let hash = 0;
  for (const char of dateStr) {
    hash = ((hash << 5) - hash) + char.charCodeAt(0);
    hash = hash & hash; // 32bit
  }
  
  const index = Math.abs(hash) % puzzleSlugs.length;
  return puzzleSlugs[index];
}

// Calcule le temps restant avant le prochain puzzle
export function getTimeUntilNextPuzzle(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  
  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  
  return `${hours}h ${mins}min`;
}
```

---

## 6. CALCUL XP ET NIVEAUX

```typescript
// lib/utils/xp.ts

export function calculateScore(
  timeSeconds: number,
  errors: number,
  hintsUsed: number,
  puzzleSize: number,
  puzzleDifficulty: 'facile' | 'moyen' | 'difficile' | 'expert'
): number {
  const baseScore = { facile: 100, moyen: 200, difficile: 400, expert: 800 }[puzzleDifficulty];
  const sizeBonus = puzzleSize * 10;
  const timePenalty = Math.max(0, timeSeconds - 60) * 0.5;  // pénalité après 1min
  const errorPenalty = errors * 50;
  const hintPenalty = hintsUsed * 30;
  
  return Math.max(10, Math.round(baseScore + sizeBonus - timePenalty - errorPenalty - hintPenalty));
}

export function calculateXP(score: number, isDaily: boolean, isTournament: boolean): number {
  let xp = Math.floor(score / 10);
  if (isDaily) xp *= 2;        // double XP pour le puzzle du jour
  if (isTournament) xp *= 3;   // triple XP pour les tournois
  return xp;
}

export const LEVELS = [
  { level: 1, name: 'Novice', xpRequired: 0 },
  { level: 2, name: 'Apprenti', xpRequired: 500 },
  { level: 3, name: 'Joueur', xpRequired: 1500 },
  { level: 4, name: 'Confirmé', xpRequired: 3500 },
  { level: 5, name: 'Expert', xpRequired: 7500 },
  { level: 6, name: 'Maître', xpRequired: 15000 },
  { level: 7, name: 'Grand Maître', xpRequired: 30000 },
  { level: 8, name: 'Légende', xpRequired: 60000 },
  { level: 9, name: 'Pixel Master', xpRequired: 120000 },
  { level: 10, name: 'Nonogramme Dieu', xpRequired: 250000 },
];

export function getLevelFromXP(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) return LEVELS[i];
  }
  return LEVELS[0];
}
```

---

## 7. API ROUTE — SCORE POST

```typescript
// app/api/score/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { calculateScore, calculateXP, getLevelFromXP } from '@/lib/utils/xp';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Non authentifié' }, { status: 401 });
  
  const { puzzleId, puzzleSlug, timeSeconds, errors, hintsUsed } = await request.json();
  
  // Récupérer le puzzle pour la difficulté
  const { data: puzzle } = await supabase
    .from('puzzles')
    .select('difficulty, size, is_daily, is_tournament')
    .eq('id', puzzleId)
    .single();
  
  if (!puzzle) return Response.json({ error: 'Puzzle non trouvé' }, { status: 404 });
  
  // Calculer le score
  const score = calculateScore(timeSeconds, errors, hintsUsed, puzzle.size, puzzle.difficulty);
  const xpEarned = calculateXP(score, puzzle.is_daily, puzzle.is_tournament);
  
  // Sauvegarder la completion
  const { error: completionError } = await supabase
    .from('completions')
    .upsert({
      user_id: user.id,
      puzzle_id: puzzleId,
      time_seconds: timeSeconds,
      errors,
      hints_used: hintsUsed,
      score,
    });
  
  if (completionError) {
    // Puzzle déjà complété — retourner quand même le score sans XP
    return Response.json({ score, xpEarned: 0, alreadyCompleted: true });
  }
  
  // Mettre à jour le profil (XP, streak, puzzles_completed)
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, streak_current, streak_last_date, puzzles_completed')
    .eq('id', user.id)
    .single();
  
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  const isStreak = profile?.streak_last_date === yesterday;
  const newStreak = isStreak ? (profile?.streak_current || 0) + 1 : 1;
  const newXP = (profile?.xp || 0) + xpEarned;
  const newLevel = getLevelFromXP(newXP);
  
  await supabase.from('profiles').update({
    xp: newXP,
    level: newLevel.level,
    streak_current: newStreak,
    streak_last_date: today,
    puzzles_completed: (profile?.puzzles_completed || 0) + 1,
  }).eq('id', user.id);
  
  // Update stats puzzle
  await supabase.rpc('increment_puzzle_stats', { p_id: puzzleId, p_time: timeSeconds });
  
  return Response.json({
    score,
    xpEarned,
    newXP,
    newLevel: newLevel.name,
    newStreak,
    leveledUp: newLevel.level > getLevelFromXP(profile?.xp || 0).level,
  });
}
```

---

## 8. COMPOSANT NONOGRAM BOARD (Core)

```typescript
// components/game/NonogramBoard.tsx
'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { calculateScore } from '@/lib/utils/xp';

type Tool = 'fill' | 'mark' | 'erase';
type CellState = 0 | 1 | 2; // empty | filled | marked

interface Puzzle {
  id: string;
  slug: string;
  name: string;
  size: number;
  difficulty: 'facile' | 'moyen' | 'difficile' | 'expert';
  solution: number[][];
  clues: { rows: number[][], cols: number[][] };
  colors: { filled: string; background: string };
  is_daily?: boolean;
}

export function NonogramBoard({ puzzle, onComplete }: {
  puzzle: Puzzle;
  onComplete: (score: number, time: number, errors: number) => void;
}) {
  const n = puzzle.size;
  const [grid, setGrid] = useState<CellState[][]>(
    () => Array.from({ length: n }, () => Array(n).fill(0))
  );
  const [tool, setTool] = useState<Tool>('fill');
  const [seconds, setSeconds] = useState(0);
  const [errors, setErrors] = useState(0);
  const [hints, setHints] = useState(3);
  const [isComplete, setIsComplete] = useState(false);
  
  const isDragging = useRef(false);
  const dragValue = useRef<CellState>(1);
  const timerRef = useRef<NodeJS.Timeout>();
  
  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);
  
  const applyCell = useCallback((r: number, c: number) => {
    setGrid(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = dragValue.current;
      
      // Check win
      const isWin = puzzle.solution.every((row, ri) =>
        row.every((cell, ci) => cell === 0 || next[ri][ci] === 1)
      );
      
      if (isWin) {
        clearInterval(timerRef.current);
        setIsComplete(true);
        const score = calculateScore(seconds, errors, 3 - hints, n, puzzle.difficulty);
        onComplete(score, seconds, errors);
      }
      
      return next;
    });
  }, [puzzle, seconds, errors, hints, n, onComplete]);
  
  const startDrag = useCallback((r: number, c: number) => {
    isDragging.current = true;
    const cur = grid[r][c];
    if (tool === 'fill') dragValue.current = cur === 1 ? 0 : 1;
    else if (tool === 'mark') dragValue.current = cur === 2 ? 0 : 2;
    else dragValue.current = 0;
    applyCell(r, c);
  }, [grid, tool, applyCell]);
  
  const giveHint = useCallback(() => {
    if (hints <= 0) return;
    setHints(h => h - 1);
    // Révèle une cellule au hasard
    const candidates: [number, number][] = [];
    puzzle.solution.forEach((row, r) => row.forEach((cell, c) => {
      if (cell === 1 && grid[r][c] !== 1) candidates.push([r, c]);
    }));
    if (!candidates.length) return;
    const [r, c] = candidates[Math.floor(Math.random() * candidates.length)];
    dragValue.current = 1;
    applyCell(r, c);
  }, [hints, puzzle, grid, applyCell]);
  
  const isRowComplete = (r: number) => {
    const line = grid[r].map(v => v === 1 ? 1 : 0);
    return JSON.stringify(getLineClues(line)) === JSON.stringify(puzzle.clues.rows[r]);
  };
  
  const isColComplete = (c: number) => {
    const line = grid.map(row => row[c] === 1 ? 1 : 0);
    return JSON.stringify(getLineClues(line)) === JSON.stringify(puzzle.clues.cols[c]);
  };
  
  const progress = Math.round(
    grid.flat().filter((v, i) => v === 1 && puzzle.solution.flat()[i] === 1).length /
    puzzle.solution.flat().filter(v => v === 1).length * 100
  );
  
  // ... JSX avec Deep Space styling
  // (voir implementation complète dans le repo)
}

function getLineClues(line: number[]): number[] {
  const clues: number[] = [];
  let count = 0;
  line.forEach(cell => {
    if (cell === 1) count++;
    else if (count > 0) { clues.push(count); count = 0; }
  });
  if (count > 0) clues.push(count);
  return clues.length ? clues : [0];
}
```

---

## 9. SEO — PAGE PUZZLE INDIVIDUELLE

```typescript
// app/(game)/puzzle/[slug]/page.tsx
import { Metadata } from 'next';
import { getPuzzleBySlug } from '@/lib/puzzles';
import { NonogramBoard } from '@/components/game/NonogramBoard';

export async function generateStaticParams() {
  // Génère toutes les 10 000 pages au build time
  const { getAllPuzzleSlugs } = await import('@/lib/puzzles');
  return (await getAllPuzzleSlugs()).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const puzzle = await getPuzzleBySlug(params.slug);
  
  return {
    title: `${puzzle.name} — Nonogramme ${puzzle.size}×${puzzle.size} | Nonogramme.com`,
    description: `Jouez gratuitement au nonogramme "${puzzle.name}" (${puzzle.difficulty}, ${puzzle.size}×${puzzle.size}). ${puzzle.meta.og_description}`,
    openGraph: {
      title: `${puzzle.name} — Nonogramme gratuit`,
      description: puzzle.meta.og_description,
      images: [`/og/${puzzle.slug}.png`],
    },
    keywords: [
      'nonogramme', 'picross', 'logimage', puzzle.name,
      `nonogramme ${puzzle.size}x${puzzle.size}`,
      `nonogramme ${puzzle.difficulty}`,
      ...puzzle.meta.tags,
    ],
  };
}

export default async function PuzzlePage({ params }: { params: { slug: string } }) {
  const puzzle = await getPuzzleBySlug(params.slug);
  return <NonogramBoard puzzle={puzzle} onComplete={handleComplete} />;
}
```

---

## 10. COMMANDES POUR DÉMARRER AVEC CLAUDE CODE

```bash
# 1. Init projet
npx create-next-app@latest nonogramme --typescript --tailwind --app
cd nonogramme

# 2. Dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install jimp                    # pipeline image→puzzle
npm install next-pwa                # PWA

# 3. Setup Supabase
# → Créer projet sur supabase.com (free)
# → Copier URL + anon key dans .env.local
# → Coller le schéma SQL du §2 dans l'éditeur SQL Supabase

# 4. Variables d'env
echo "NEXT_PUBLIC_SUPABASE_URL=your-url" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key" >> .env.local

# 5. Premier puzzle
npm install jimp
node scripts/image-to-nonogram.js public/images/cat.png data/puzzles/animaux/chat.json --size=10 --name="Chat"

# 6. Dev
npm run dev

# 7. Deploy
# → Push sur GitHub
# → Import repo sur vercel.com
# → Add env vars sur Vercel
# → nonogramme.com → DNS vers Vercel
```

---

## 11. CHECKLIST VALIDATION CONCEPT (avant d'acheter le domaine)

- [ ] Moteur de jeu jouable (drag, fill, mark, win)
- [ ] 1 puzzle du jour fonctionnel
- [ ] Deep Space UI implémentée
- [ ] Deploy sur Vercel (url temporaire suffit)
- [ ] 5 amis/beta testeurs jouent et trouvent ça fun
- [ ] Google Analytics montre > 0 organic en 2 semaines

Si les 6 cases sont cochées → **acheter nonogramme.com immédiatement**.

---

*Document généré le 19/03/2026 — Architecture v1.0*
*Stack: Next.js 14 + Supabase + Vercel — Budget: 0€*
