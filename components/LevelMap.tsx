'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { type LevelEntry, getUserCurrentLevel } from '@/lib/levels';

interface LevelMapProps {
  levels: LevelEntry[];
  completedLevelIndices: number[];  // 0-indexed: [0, 1, 2] = levels 1,2,3 done
  isAuthenticated: boolean;
}

export function LevelMap({ levels, completedLevelIndices, isAuthenticated }: LevelMapProps) {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentNodeRef = useRef<HTMLDivElement>(null);

  // Hydrate from localStorage for non-auth users (runs only on client)
  const [completed, setCompleted] = useState<number[]>(completedLevelIndices);

  useEffect(() => {
    if (!isAuthenticated) {
      try {
        const stored: number[] = JSON.parse(localStorage.getItem('completedLevels') || '[]');
        setCompleted(stored);
      } catch {}
    }
  }, [isAuthenticated]);

  // Auto-scroll current level into view
  useEffect(() => {
    if (currentNodeRef.current) {
      currentNodeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [completed]);

  const currentLevelIdx = getUserCurrentLevel(completed);

  function handleLevelClick(level: LevelEntry) {
    const isCompleted = completed.includes(level.index);
    const isCurrent = level.index === currentLevelIdx;
    if (!isCompleted && !isCurrent) return;
    if (level.isPremium && !isAuthenticated) return;
    router.push(`/puzzle/${level.slug}?level=${level.number}`);
  }

  return (
    <div className="w-full">
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4ecdc4' }}>
          Ma progression
        </h2>
        <span style={{ fontSize: '0.75rem', color: '#3d6080' }}>
          {completed.length} / {levels.length} niveaux
        </span>
      </div>

      {/* Global progress bar */}
      <div style={{ width: '100%', height: 6, borderRadius: 999, backgroundColor: '#1e3048', marginBottom: '1.5rem', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          borderRadius: 999,
          background: 'linear-gradient(90deg, #4ecdc4, #45b7d1)',
          width: `${(completed.length / levels.length) * 100}%`,
          transition: 'width 0.7s ease',
        }} />
      </div>

      {/* Horizontal scrolling level map */}
      <div ref={scrollContainerRef} style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 'max-content' }}>
          {levels.map((level) => {
            const isCompleted = completed.includes(level.index);
            const isCurrent = level.index === currentLevelIdx;
            const isLocked = !isCompleted && !isCurrent;
            const nodeSize = isCurrent ? 60 : 48;

            return (
              <div key={level.number} style={{ display: 'flex', alignItems: 'center' }}>
                {/* Connector line */}
                {level.index > 0 && (
                  <div style={{
                    width: 20,
                    height: 2,
                    flexShrink: 0,
                    backgroundColor: isCompleted ? '#4ecdc4' : '#1e3048',
                    transition: 'background-color 0.5s',
                  }} />
                )}

                {/* Level node */}
                <div
                  ref={isCurrent ? currentNodeRef : undefined}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}
                >
                  <button
                    onClick={() => handleLevelClick(level)}
                    disabled={isLocked}
                    style={{
                      position: 'relative',
                      width: nodeSize,
                      height: nodeSize,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      border: isCompleted
                        ? '2px solid #3ab5ad'
                        : isCurrent
                          ? '3px solid #4ecdc4'
                          : level.isPremium
                            ? '1.5px solid rgba(192,132,252,0.4)'
                            : '1.5px solid #1e3048',
                      backgroundColor: isCompleted
                        ? '#4ecdc4'
                        : isCurrent
                          ? '#132035'
                          : level.isPremium
                            ? 'rgba(192,132,252,0.1)'
                            : '#0d1728',
                      color: isCompleted ? '#070d17' : isCurrent ? '#4ecdc4' : '#3d6080',
                      fontSize: isCurrent ? 18 : 13,
                      opacity: isLocked && !level.isPremium ? 0.4 : 1,
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      flexShrink: 0,
                      outline: 'none',
                    }}
                    aria-label={`Niveau ${level.number} — ${level.name}`}
                  >
                    {isCompleted ? '✓' : isLocked && level.isPremium ? '💎' : isLocked ? '🔒' : level.number}

                    {/* Pulse ring on current */}
                    {isCurrent && (
                      <span style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        border: '2px solid #4ecdc4',
                        opacity: 0.3,
                        animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite',
                        pointerEvents: 'none',
                      }} />
                    )}

                    {/* Play arrow badge */}
                    {isCurrent && (
                      <span style={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        backgroundColor: '#ffd93d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 8,
                        color: '#070d17',
                        fontWeight: 900,
                        pointerEvents: 'none',
                      }}>
                        ▶
                      </span>
                    )}
                  </button>

                  {/* Label */}
                  <div style={{ width: 60, textAlign: 'center' }}>
                    <div style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: isCompleted ? '#4ecdc4' : isCurrent ? '#ffd93d' : '#3d6080',
                    }}>
                      {isCurrent ? `Niv. ${level.number}` : level.number}
                    </div>
                    <div style={{
                      fontSize: 9,
                      color: '#3d6080',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: 56,
                    }}>
                      {level.name}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA button */}
      <button
        onClick={() => handleLevelClick(levels[currentLevelIdx])}
        style={{
          width: '100%',
          padding: '0.875rem',
          borderRadius: '0.75rem',
          fontWeight: 700,
          fontSize: '1rem',
          marginTop: '0.5rem',
          background: 'linear-gradient(135deg, #4ecdc4, #45b7d1)',
          color: '#070d17',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        ▶ Jouer le niveau {levels[currentLevelIdx].number} — {levels[currentLevelIdx].name}
      </button>

      {/* Ping animation keyframes */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
