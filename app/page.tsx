import Link from 'next/link';
import { getCatalog } from '@/lib/puzzles';
import { getDailyPuzzleSlug, getTimeUntilNextPuzzle } from '@/lib/utils/daily';
import { Logo } from '@/components/ui/Logo';
import { createClient } from '@/lib/supabase/server';
import { LEVELS } from '@/lib/levels';
import { LevelMap } from '@/components/LevelMap';

const DIFFICULTY_COLORS: Record<string, string> = {
  facile: '#6bcb77',
  moyen: '#f6c90e',
  difficile: '#ff6b6b',
  expert: '#c77dff',
};

const CATEGORY_COLORS: Record<string, string> = {
  animaux: '#4ecdc4',
  nature: '#6bcb77',
  objets: '#4d9de0',
  personnages: '#ff6b9d',
  special: '#f6c90e',
};

function nameFromSlug(slug: string): string {
  return slug
    .replace(/-\d+x\d+$/, '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default async function HomePage() {
  const catalog = getCatalog();
  const slugs = catalog.map(p => p.slug);
  const dailySlug = getDailyPuzzleSlug(new Date(), slugs);
  const daily = catalog.find(p => p.slug === dailySlug)!;

  // Fetch user data
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: { username: string | null; streak_current: number; xp: number; level: number } | null = null;
  let dailyCompletion: { score: number; time_seconds: number; xp_earned: number; errors: number } | null = null;
  let completedLevelIndices: number[] = [];

  if (user) {
    const [{ data: profileData }, { data: completionsData }] = await Promise.all([
      supabase.from('profiles').select('username, streak_current, xp, level').eq('id', user.id).single(),
      supabase.from('completions')
        .select('puzzle_slug, score, time_seconds, xp_earned, errors, created_at, level_number')
        .eq('user_id', user.id),
    ]);

    if (profileData) profile = profileData;

    if (completionsData) {
      // Daily completed today?
      const today = new Date().toISOString().slice(0, 10);
      const todayDaily = completionsData.find(c =>
        c.puzzle_slug === dailySlug && c.created_at.slice(0, 10) === today
      );
      if (todayDaily) dailyCompletion = todayDaily;

      // Completed level indices (convert 1-indexed level_number to 0-indexed)
      completedLevelIndices = completionsData
        .filter(c => c.level_number != null)
        .map(c => (c.level_number as number) - 1);
    }
  }

  const username = profile?.username ?? user?.user_metadata?.user_name ?? user?.email?.split('@')[0] ?? null;
  const dailyCategoryColor = CATEGORY_COLORS[daily.category] ?? '#4ecdc4';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Hero */}
      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', paddingTop: '0.5rem' }}>
        <Logo variant="icon" theme="dark" size="md" href="" />
        {user && username ? (
          <p style={{ color: '#7aa8cc', fontSize: '0.9rem', textAlign: 'center' }}>
            Bonjour, <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{username}</span> !
          </p>
        ) : (
          <p style={{ color: '#7aa8cc', fontSize: '0.9rem', textAlign: 'center' }}>
            Révèle des dessins cachés en résolvant des puzzles de logique
          </p>
        )}
      </section>

      {/* Stats row for logged-in users */}
      {profile && (
        <section style={{ display: 'flex', gap: '0.75rem' }}>
          {[
            { label: 'Série', value: `${profile.streak_current} 🔥`, color: '#f6c90e' },
            { label: 'XP', value: profile.xp.toLocaleString(), color: '#4ecdc4' },
            { label: 'Niveau', value: String(profile.level), color: '#e2e8f0' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              flex: 1, backgroundColor: '#1a2540', border: '1px solid #2d3f5e',
              borderRadius: '0.5rem', padding: '0.875rem', textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: '0.7rem', color: '#8892a4', marginTop: '0.2rem' }}>{label}</div>
            </div>
          ))}
        </section>
      )}

      {/* Daily puzzle */}
      <section>
        <div style={{ marginBottom: '0.75rem' }}>
          <h1 style={{ color: '#4ecdc4', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            Puzzle du jour
          </h1>
          <p style={{ color: '#8892a4', fontSize: '0.875rem' }}>
            Prochain puzzle dans {getTimeUntilNextPuzzle()}
          </p>
        </div>

        {dailyCompletion ? (
          <div style={{
            backgroundColor: '#1a2540', border: '1px solid #2d3f5e',
            borderTop: '3px solid #4ecdc4', borderRadius: '0.5rem', padding: '1.25rem 1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#e2e8f0' }}>
                  {nameFromSlug(daily.slug)}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                  <Badge>{daily.size}×{daily.size}</Badge>
                  <Badge color={DIFFICULTY_COLORS[daily.difficulty]}>{daily.difficulty}</Badge>
                </div>
              </div>
              <div style={{
                backgroundColor: '#4ecdc420', border: '1px solid #4ecdc440',
                color: '#4ecdc4', fontWeight: 700, fontSize: '0.8rem',
                padding: '0.4rem 0.9rem', borderRadius: '0.375rem',
              }}>
                ✓ Complété
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <Stat label="points" value={String(dailyCompletion.score)} />
              <Stat label="temps" value={formatTime(dailyCompletion.time_seconds)} />
              {dailyCompletion.errors > 0 && <Stat label="erreurs" value={String(dailyCompletion.errors)} color="#ff6b6b" />}
              <Stat label="XP" value={`+${dailyCompletion.xp_earned}`} color="#f6c90e" />
            </div>
          </div>
        ) : (
          <Link href={`/puzzle/${dailySlug}`} style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#1a2540', border: '1px solid #2d3f5e',
              borderTop: `3px solid ${dailyCategoryColor}`, borderRadius: '0.5rem',
              padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1.125rem', color: '#e2e8f0' }}>
                  {nameFromSlug(daily.slug)}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Badge>{daily.size}×{daily.size}</Badge>
                  <Badge color={DIFFICULTY_COLORS[daily.difficulty]}>{daily.difficulty}</Badge>
                </div>
              </div>
              <div style={{
                backgroundColor: '#4ecdc4', color: '#0d1528', fontWeight: 700,
                fontSize: '0.875rem', padding: '0.5rem 1.25rem',
                borderRadius: '0.375rem', whiteSpace: 'nowrap',
              }}>
                Jouer →
              </div>
            </div>
          </Link>
        )}
      </section>

      {/* Level map */}
      <section>
        <LevelMap
          levels={LEVELS}
          completedLevelIndices={completedLevelIndices}
          isAuthenticated={!!user}
        />
      </section>

    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      display: 'inline-block', fontSize: '0.7rem', fontWeight: 600,
      padding: '0.1rem 0.4rem', borderRadius: '0.25rem',
      backgroundColor: color ? `${color}20` : '#2d3f5e',
      color: color ?? '#8892a4',
      border: `1px solid ${color ? `${color}40` : '#3d4f6e'}`,
    }}>
      {children}
    </span>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <div style={{ fontWeight: 700, color: color ?? '#e2e8f0', fontSize: '1rem' }}>{value}</div>
      <div style={{ fontSize: '0.7rem', color: '#8892a4' }}>{label}</div>
    </div>
  );
}
