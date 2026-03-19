'use client';

interface GameHeaderProps {
  puzzleName: string;
  seconds: number;
  progress: number; // 0-100
  errors: number;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function GameHeader({ puzzleName, seconds, progress, errors }: GameHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-base" style={{ color: '#e2e8f0' }}>
          {puzzleName}
        </span>
        <div className="flex items-center gap-4 text-sm font-mono">
          <span style={{ color: '#8892a4' }}>
            {formatTime(seconds)}
          </span>
          {errors > 0 && (
            <span style={{ color: '#ff6b6b' }}>
              {errors} erreur{errors > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
      <div
        className="h-1 rounded-full overflow-hidden"
        style={{ backgroundColor: '#1a2540' }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%`, backgroundColor: '#4ecdc4' }}
        />
      </div>
    </div>
  );
}
