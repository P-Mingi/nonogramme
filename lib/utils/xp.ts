import type { Difficulty } from '@/types/puzzle';

export function calculateScore(
  timeSeconds: number,
  errors: number,
  hintsUsed: number,
  puzzleSize: number,
  puzzleDifficulty: Difficulty
): number {
  const baseScore = { facile: 100, moyen: 200, difficile: 400, expert: 800 }[puzzleDifficulty];
  const sizeBonus = puzzleSize * 10;
  const timePenalty = Math.max(0, timeSeconds - 60) * 0.5;
  const errorPenalty = errors * 50;
  const hintPenalty = hintsUsed * 30;

  return Math.max(10, Math.round(baseScore + sizeBonus - timePenalty - errorPenalty - hintPenalty));
}

export function calculateXP(score: number, isDaily: boolean, isTournament: boolean): number {
  let xp = Math.floor(score / 10);
  if (isDaily) xp *= 2;
  if (isTournament) xp *= 3;
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
