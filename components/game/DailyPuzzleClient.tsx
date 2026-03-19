'use client';
import { useState } from 'react';
import { NonogramBoard } from './NonogramBoard';
import { WinScreen } from './WinScreen';
import type { Puzzle } from '@/types/puzzle';

interface WinData {
  score: number;
  time: number;
  errors: number;
  hintsUsed: number;
  xpEarned?: number;
}

export function DailyPuzzleClient({ puzzle, isDaily = false }: { puzzle: Puzzle; isDaily?: boolean }) {
  const [winData, setWinData] = useState<WinData | null>(null);

  async function handleComplete(score: number, time: number, errors: number, hintsUsed: number) {
    const data: WinData = { score, time, errors, hintsUsed };

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
          onClose={() => setWinData(null)}
        />
      )}
    </div>
  );
}
