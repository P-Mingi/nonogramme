'use client';
import { useRouter } from 'next/navigation';
import { getTimeUntilNextPuzzle } from '@/lib/utils/daily';
import { Logo } from '@/components/ui/Logo';
import { PixelReveal } from './PixelReveal';
import type { LevelEntry } from '@/lib/levels';

interface WinScreenProps {
  puzzleName: string;
  score: number;
  timeSeconds: number;
  errors: number;
  xpEarned?: number;
  solution?: number[][];
  filledColor?: string;
  nextLevel?: LevelEntry;
  onClose: () => void;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function WinScreen({ puzzleName, score, timeSeconds, errors, xpEarned, solution, filledColor, nextLevel, onClose }: WinScreenProps) {
  const router = useRouter();
  const timeUntilNext = getTimeUntilNextPuzzle();

  function handleShare() {
    const text = `J'ai résolu "${puzzleName}" sur Nonogramme.com !\nScore: ${score} pts — Temps: ${formatTime(timeSeconds)}${errors > 0 ? ` — ${errors} erreur${errors > 1 ? 's' : ''}` : ''}`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => alert('Copié dans le presse-papier !')).catch(() => {});
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(13, 21, 40, 0.92)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="flex flex-col items-center gap-5 p-8 rounded-2xl max-w-sm w-full mx-4"
        style={{ backgroundColor: '#1a2540', border: '1px solid #2d3f5e', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', opacity: 0.6 }}>
          <Logo variant="icon-mark" size="sm" href="" />
        </div>
        {solution ? (
          <PixelReveal solution={solution} color={filledColor} size={160} />
        ) : (
          <div className="text-5xl">⭐</div>
        )}

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-1" style={{ color: '#4ecdc4' }}>
            Puzzle résolu !
          </h2>
          <p className="text-sm" style={{ color: '#8892a4' }}>{puzzleName}</p>
        </div>

        <div className="flex gap-6 text-center">
          <div>
            <div className="text-2xl font-bold font-mono" style={{ color: '#e2e8f0' }}>
              {score}
            </div>
            <div className="text-xs" style={{ color: '#8892a4' }}>points</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono" style={{ color: '#e2e8f0' }}>
              {formatTime(timeSeconds)}
            </div>
            <div className="text-xs" style={{ color: '#8892a4' }}>temps</div>
          </div>
          {errors > 0 && (
            <div>
              <div className="text-2xl font-bold font-mono" style={{ color: '#ff6b6b' }}>
                {errors}
              </div>
              <div className="text-xs" style={{ color: '#8892a4' }}>erreurs</div>
            </div>
          )}
        </div>

        {xpEarned !== undefined && (
          <div className="text-sm font-semibold" style={{ color: '#f6c90e' }}>
            +{xpEarned} XP
          </div>
        )}

        <p className="text-sm text-center" style={{ color: '#8892a4' }}>
          Prochain puzzle dans <span style={{ color: '#4ecdc4' }}>{timeUntilNext}</span>
        </p>

        {nextLevel && !nextLevel.isPremium && (
          <button
            onClick={() => router.push(`/puzzle/${nextLevel.slug}?level=${nextLevel.number}`)}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: 'linear-gradient(135deg, #4ecdc4, #45b7d1)', color: '#070d17' }}
          >
            ▶ Niveau {nextLevel.number} — {nextLevel.name}
          </button>
        )}

        <div className="flex gap-3 w-full">
          <button
            onClick={handleShare}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{ backgroundColor: '#0d1528', border: '1px solid #4ecdc4', color: '#4ecdc4' }}
          >
            Partager
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{ backgroundColor: nextLevel ? 'transparent' : '#4ecdc4', color: nextLevel ? '#8892a4' : '#0d1528', border: nextLevel ? '1px solid #2d3f5e' : 'none' }}
          >
            {nextLevel ? '← Accueil' : 'Continuer'}
          </button>
        </div>
      </div>
    </div>
  );
}
