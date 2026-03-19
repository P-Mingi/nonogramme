import { createClient } from '@/lib/supabase/server';
import { getLevelFromXP } from '@/lib/utils/xp';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Classement — Nonogramme.com',
  description: 'Classement des meilleurs joueurs de nonogramme.',
  alternates: { canonical: 'https://nonogramme.com/leaderboard' },
};

export const revalidate = 60; // refresh every minute

interface LeaderRow {
  id: string;
  username: string;
  avatar_url: string | null;
  level: number;
  xp: number;
  streak_best: number;
  puzzles_completed: number;
  rank: number;
}

interface WeeklyRow {
  id: string;
  username: string;
  avatar_url: string | null;
  level: number;
  streak_current: number;
  weekly_score: number;
  puzzles_this_week: number;
  rank: number;
}

const MEDALS = ['🥇', '🥈', '🥉'];

function Avatar({ url, username }: { url: string | null; username: string }) {
  if (url) {
    return <img src={url} alt={username} width={32} height={32} style={{ borderRadius: '50%', width: 32, height: 32, objectFit: 'cover' }} />;
  }
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%',
      backgroundColor: '#2d3f5e',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#8892a4', fontSize: '0.875rem', fontWeight: 700,
    }}>
      {username?.[0]?.toUpperCase() ?? '?'}
    </div>
  );
}

export default async function LeaderboardPage() {
  const supabase = await createClient();

  const [{ data: global }, { data: weekly }] = await Promise.all([
    supabase.from('leaderboard_global').select('*').order('rank').limit(50),
    supabase.from('leaderboard_weekly').select('*').order('rank').limit(50),
  ]);

  const globalRows = (global ?? []) as LeaderRow[];
  const weeklyRows = (weekly ?? []) as WeeklyRow[];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1 style={{ color: '#4ecdc4', fontSize: '1.5rem', fontWeight: 700 }}>Classement</h1>

      {/* Weekly */}
      <section>
        <h2 style={{ color: '#e2e8f0', fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Cette semaine
        </h2>
        {weeklyRows.length === 0 ? (
          <p style={{ color: '#8892a4', fontSize: '0.875rem' }}>Aucune partie cette semaine encore.</p>
        ) : (
          <Table>
            {weeklyRows.map(row => (
              <Row key={row.id}>
                <Rank rank={Number(row.rank)} />
                <Avatar url={row.avatar_url} username={row.username} />
                <Name username={row.username} level={row.level} />
                <Stat label="score" value={Number(row.weekly_score).toLocaleString()} />
                <Stat label="puzzles" value={String(row.puzzles_this_week)} />
                <Stat label="streak" value={`🔥 ${row.streak_current}`} />
              </Row>
            ))}
          </Table>
        )}
      </section>

      {/* Global */}
      <section>
        <h2 style={{ color: '#e2e8f0', fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Classement général
        </h2>
        {globalRows.length === 0 ? (
          <p style={{ color: '#8892a4', fontSize: '0.875rem' }}>Aucun joueur encore.</p>
        ) : (
          <Table>
            {globalRows.map(row => {
              const levelInfo = getLevelFromXP(row.xp);
              return (
                <Row key={row.id}>
                  <Rank rank={Number(row.rank)} />
                  <Avatar url={row.avatar_url} username={row.username} />
                  <Name username={row.username} level={row.level} levelName={levelInfo.name} />
                  <Stat label="XP" value={Number(row.xp).toLocaleString()} />
                  <Stat label="puzzles" value={String(row.puzzles_completed)} />
                  <Stat label="streak record" value={`🔥 ${row.streak_best}`} />
                </Row>
              );
            })}
          </Table>
        )}
      </section>
    </div>
  );
}

function Table({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      backgroundColor: '#1a2540', border: '1px solid #2d3f5e',
      borderRadius: '0.5rem', padding: '0.625rem 1rem',
    }}>
      {children}
    </div>
  );
}

function Rank({ rank }: { rank: number }) {
  return (
    <span style={{ minWidth: 28, textAlign: 'center', fontSize: rank <= 3 ? '1.2rem' : '0.875rem', color: '#8892a4', fontWeight: 700 }}>
      {rank <= 3 ? MEDALS[rank - 1] : rank}
    </span>
  );
}

function Name({ username, level, levelName }: { username: string; level: number; levelName?: string }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {username}
      </div>
      {levelName && (
        <div style={{ color: '#8892a4', fontSize: '0.7rem' }}>Niv. {level} — {levelName}</div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'right', minWidth: 60 }}>
      <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.875rem' }}>{value}</div>
      <div style={{ color: '#8892a4', fontSize: '0.65rem' }}>{label}</div>
    </div>
  );
}
