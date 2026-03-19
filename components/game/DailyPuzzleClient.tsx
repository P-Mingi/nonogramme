'use client';
import { useState } from 'react';
import { NonogramBoard } from './NonogramBoard';
import { WinScreen } from './WinScreen';
import type { Puzzle } from '@/types/puzzle';
import { LEVELS } from '@/lib/levels';

interface WinData {
  score: number;
  time: number;
  errors: number;
  hintsUsed: number;
  xpEarned?: number;
}

interface Props {
  puzzle: Puzzle;
  isDaily?: boolean;
  levelNumber?: number; // 1-indexed level number, if coming from level map
}

export function DailyPuzzleClient({ puzzle, isDaily = false, levelNumber }: Props) {
  const [winData, setWinData] = useState<WinData | null>(null);

  // Pre-compute next level (levelNumber is 1-indexed, LEVELS is 0-indexed)
  const nextLevel = levelNumber !== undefined ? LEVELS[levelNumber] : undefined;

  async function handleComplete(score: number, time: number, errors: number, hintsUsed: number) {
    const data: WinData = { score, time, errors, hintsUsed };

    // Save level completion to localStorage (works for auth + non-auth users)
    if (levelNumber !== undefined) {
      try {
        const stored: number[] = JSON.parse(localStorage.getItem('completedLevels') || '[]');
        const levelIndex = levelNumber - 1; // convert to 0-indexed
        if (!stored.includes(levelIndex)) {
          stored.push(levelIndex);
          localStorage.setItem('completedLevels', JSON.stringify(stored));
        }
      } catch {}
    }

    // Fire-and-forget — save to Supabase if logged in
    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puzzle_slug: puzzle.slug,
          puzzle_name: puzzle.name,
          time_seconds: time,
          errors,
          hints_used: hintsUsed,
          score,
          is_daily: isDaily,
          level_number: levelNumber ?? null,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        data.xpEarned = json.xp_earned;
      }
    } catch {}

    setWinData(data);
  }

  return (
    <div className="flex flex-col gap-4">
      <NonogramBoard puzzle={puzzle} onComplete={handleComplete} />
      {winData && (
        <WinScreen
          puzzleName={puzzle.name}
          score={winData.score}
          timeSeconds={winData.time}
          errors={winData.errors}
          xpEarned={winData.xpEarned}
          solution={puzzle.solution}
          filledColor={puzzle.colors?.filled}
          nextLevel={nextLevel}
          onClose={() => setWinData(null)}
        />
      )}
    </div>
  );
}
