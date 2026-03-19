// Deterministic — same date = same puzzle for everyone

export function getDailyPuzzleSlug(date: Date, puzzleSlugs: string[]): string {
  const dateStr = date.toISOString().split('T')[0]; // "2026-03-19"

  // Deterministic hash of the date
  let hash = 0;
  for (const char of dateStr) {
    hash = ((hash << 5) - hash) + char.charCodeAt(0);
    hash = hash & hash; // 32bit
  }

  const index = Math.abs(hash) % puzzleSlugs.length;
  return puzzleSlugs[index];
}

// Time remaining until next puzzle
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
