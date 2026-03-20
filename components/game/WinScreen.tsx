'use client';
import { useRouter } from 'next/navigation';
import { getTimeUntilNextPuzzle } from '@/lib/utils/daily';
import { Logo } from '@/components/ui/Logo';
import { PixelReveal } from './PixelReveal';
import { ShareButton } from '@/components/ShareButton';
import { getTranslations } from '@/i18n';
import type { Locale } from '@/i18n/config';
import type { LevelEntry } from '@/lib/levels';
import type { Puzzle } from '@/types/puzzle';

interface WinScreenProps {
  puzzleName: string;
  score: number;
  timeSeconds: number;
  errors: number;
  xpEarned?: number;
  solution?: number[][];
  filledColor?: string;
  nextLevel?: LevelEntry;
  puzzle?: Puzzle;
  levelNumber?: number;
  locale?: Locale;
  onClose: () => void;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function WinScreen({ puzzleName, score, timeSeconds, errors, xpEarned, solution, filledColor, nextLevel, puzzle, levelNumber, locale = 'fr', onClose }: WinScreenProps) {
  const router = useRouter();
  const t = getTranslations(locale);
  const timeUntilNext = getTimeUntilNextPuzzle();
  const prefix = locale === 'fr' ? '' : `/${locale}`;

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
            {t.win.title}
          </h2>
          <p className="text-sm" style={{ color: '#8892a4' }}>{puzzleName}</p>
        </div>

        <div className="flex gap-6 text-center">
          <div>
            <div className="text-2xl font-bold font-mono" style={{ color: '#e2e8f0' }}>
              {score}
            </div>
            <div className="text-xs" style={{ color: '#8892a4' }}>{t.win.points}</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono" style={{ color: '#e2e8f0' }}>
              {formatTime(timeSeconds)}
            </div>
            <div className="text-xs" style={{ color: '#8892a4' }}>{t.win.time}</div>
          </div>
          {errors > 0 && (
            <div>
              <div className="text-2xl font-bold font-mono" style={{ color: '#ff6b6b' }}>
                {errors}
              </div>
              <div className="text-xs" style={{ color: '#8892a4' }}>{t.win.errors}</div>
            </div>
          )}
        </div>

        {xpEarned !== undefined && (
          <div className="text-sm font-semibold" style={{ color: '#f6c90e' }}>
            +{xpEarned} XP
          </div>
        )}

        <p className="text-sm text-center" style={{ color: '#8892a4' }}>
          {t.win.nextDailyIn} <span style={{ color: '#4ecdc4' }}>{timeUntilNext}</span>
        </p>

        {puzzle && (
          <ShareButton
            puzzle={puzzle}
            levelNumber={levelNumber}
            timeSeconds={timeSeconds}
            score={score}
            errors={errors}
          />
        )}

        {nextLevel && !nextLevel.isPremium && (
          <button
            onClick={() => router.push(`${prefix}/puzzle/${nextLevel.slug}?level=${nextLevel.number}`)}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: 'linear-gradient(135deg, #4ecdc4, #45b7d1)', color: '#070d17' }}
          >
            ▶ {t.win.nextLevel} {nextLevel.number} — {nextLevel.name}
          </button>
        )}

        <button
          onClick={() => nextLevel ? router.push(`${prefix}/`) : onClose()}
          className="w-full py-2.5 rounded-lg text-sm font-medium"
          style={{ backgroundColor: nextLevel ? 'transparent' : '#4ecdc4', color: nextLevel ? '#8892a4' : '#0d1528', border: nextLevel ? '1px solid #2d3f5e' : 'none' }}
        >
          {nextLevel ? `← ${t.win.home}` : t.win.continue}
        </button>
      </div>
    </div>
  );
}
