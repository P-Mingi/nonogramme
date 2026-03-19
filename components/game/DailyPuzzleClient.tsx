'use client';
import { useState } from 'react';
import { NonogramBoard } from './NonogramBoard';
import { WinScreen } from './WinScreen';
import type { Puzzle } from '@/types/puzzle';

interface WinData {
  score: number;
  time: number;
  errors: number;
}

export function DailyPuzzleClient({ puzzle }: { puzzle: Puzzle }) {
  const [winData, setWinData] = useState<WinData | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <NonogramBoard
        puzzle={puzzle}
        onComplete={(score, time, errors) => setWinData({ score, time, errors })}
      />
      {winData && (
        <WinScreen
          puzzleName={puzzle.name}
          score={winData.score}
          timeSeconds={winData.time}
          errors={winData.errors}
          onClose={() => setWinData(null)}
        />
      )}
    </div>
  );
}
