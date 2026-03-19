'use client';
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface LeaderRow {
  id: string;
  username: string;
  avatar_url: string | null;
  level: number;
  xp?: number;
  streak_best?: number;
  streak_current?: number;
  puzzles_completed?: number;
  weekly_score?: number;
  puzzles_this_week?: number;
  rank: number;
}

interface Props {
  initialWeekly: LeaderRow[];
  initialGlobal: LeaderRow[];
  currentUserId?: string;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export function LeaderboardClient({ initialWeekly, initialGlobal, currentUserId }: Props) {
  const [tab, setTab] = useState<'weekly' | 'global'>('weekly');
  const [weekly, setWeekly] = useState(initialWeekly);
  const [global, setGlobal] = useState(initialGlobal);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [flashId, setFlashId] = useState<string | null>(null);

  const supabase = createClient();

  const refetchWeekly = useCallback(async () => {
    const { data } = await supabase
      .from('leaderboard_weekly')
      .select('*')
      .order('rank')
      .limit(50);
    if (data) { setWeekly(data as LeaderRow[]); setLastUpdate(new Date()); }
  }, [supabase]);

  const refetchGlobal = useCallback(async () => {
    const { data } = await supabase
      .from('leaderboard_global')
      .select('*')
      .order('rank')
      .limit(50);
    if (data) setGlobal(data as LeaderRow[]);
  }, [supabase]);

  useEffect(() => {
    const channel = supabase
      .channel('leaderboard-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'completions' }, (payload) => {
        const userId = (payload.new as { user_id?: string }).user_id;
        if (userId) { setFlashId(userId); setTimeout(() => setFlashId(null), 3000); }
        refetchWeekly();
        refetchGlobal();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase, refetchWeekly, refetchGlobal]);

  const entries = tab === 'weekly' ? weekly : global;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Title + live badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ color: '#4ecdc4', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Classement</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <span style={{
            display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
            backgroundColor: '#4ade80',
            animation: 'pulse-dot 2s ease-in-out infinite',
          }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#4ade80', letterSpacing: '0.05em' }}>
            EN DIRECT
          </span>
        </div>
      </div>

      <p style={{ fontSize: '0.75rem', color: '#3d6080', margin: 0 }}>
        Mis à jour à {lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </p>

      {/* Tabs */}
      <div style={{
        display: 'flex', backgroundColor: '#1a2540', borderRadius: '0.75rem',
        padding: '4px', gap: '4px',
      }}>
        {(['weekly', 'global'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '0.625rem', borderRadius: '0.5rem', border: 'none',
              backgroundColor: tab === t ? '#4ecdc4' : 'transparent',
              color: tab === t ? '#0d1528' : '#8892a4',
              fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer',
            }}
          >
            {t === 'weekly' ? '📅 Cette semaine' : '🌍 Global'}
          </button>
        ))}
      </div>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {entries.length === 0 && (
          <p style={{ color: '#8892a4', fontSize: '0.875rem' }}>
            {tab === 'weekly' ? 'Aucune partie cette semaine encore.' : 'Aucun joueur encore.'}
          </p>
        )}
        {entries.map(row => {
          const rank = Number(row.rank);
          const isMe = row.id === currentUserId;
          const isFlash = row.id === flashId;
          const medal = rank <= 3 ? MEDALS[rank - 1] : null;

          return (
            <div
              key={row.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '36px 36px 1fr auto',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.625rem',
                backgroundColor: isMe ? 'rgba(78,205,196,0.07)' : '#1a2540',
                border: `1px solid ${isMe ? 'rgba(78,205,196,0.35)' : isFlash ? 'rgba(74,222,128,0.4)' : '#2d3f5e'}`,
                transition: 'all 0.3s',
                transform: isFlash ? 'scale(1.01)' : 'scale(1)',
              }}
            >
              {/* Rank */}
              <span style={{
                textAlign: 'center', fontWeight: 700,
                fontSize: medal ? '1.1rem' : '0.875rem',
                color: rank <= 3 ? '#ffd93d' : '#8892a4',
              }}>
                {medal ?? rank}
              </span>

              {/* Avatar */}
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                backgroundColor: '#2d3f5e', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {row.avatar_url
                  ? <img src={row.avatar_url} alt={row.username} width={32} height={32} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ color: '#8892a4', fontSize: '0.875rem', fontWeight: 700 }}>{row.username?.[0]?.toUpperCase() ?? '?'}</span>
                }
              </div>

              {/* Name + level */}
              <div style={{ minWidth: 0 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  color: isMe ? '#4ecdc4' : '#e2e8f0',
                  fontWeight: 600, fontSize: '0.875rem',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.username || 'Anonyme'}</span>
                  {isMe && <span style={{ fontSize: '0.65rem', color: '#4ecdc4', fontWeight: 700, flexShrink: 0 }}>TOI</span>}
                  {isFlash && <span style={{ fontSize: '0.65rem', color: '#4ade80', fontWeight: 700, flexShrink: 0 }}>NEW</span>}
                </div>
                <div style={{ color: '#8892a4', fontSize: '0.7rem' }}>
                  Niv. {row.level}
                  {tab === 'weekly' && row.puzzles_this_week ? ` · ${row.puzzles_this_week} puzzle${Number(row.puzzles_this_week) > 1 ? 's' : ''}` : ''}
                  {tab === 'global' && row.puzzles_completed ? ` · ${row.puzzles_completed} puzzles` : ''}
                </div>
              </div>

              {/* Score */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ color: '#ffd93d', fontWeight: 800, fontSize: '1rem' }}>
                  {tab === 'weekly'
                    ? Number(row.weekly_score ?? 0).toLocaleString('fr')
                    : Number(row.xp ?? 0).toLocaleString('fr')}
                </div>
                <div style={{ color: '#8892a4', fontSize: '0.65rem' }}>{tab === 'weekly' ? 'pts' : 'XP'}</div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
