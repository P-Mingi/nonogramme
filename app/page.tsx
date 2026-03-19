import Link from 'next/link';
import { getCatalog } from '@/lib/puzzles';
import { getDailyPuzzleSlug, getTimeUntilNextPuzzle } from '@/lib/utils/daily';
import { Logo } from '@/components/ui/Logo';
import { createClient } from '@/lib/supabase/server';

const CATEGORY_LABELS: Record<string, string> = {
  animaux: 'Animaux',
  nature: 'Nature',
  objets: 'Objets',
  personnages: 'Personnages',
  special: 'Spécial',
};

const CATEGORY_COLORS: Record<string, string> = {
  animaux: '#4ecdc4',
  nature: '#6bcb77',
  objets: '#4d9de0',
  personnages: '#ff6b9d',
  special: '#f6c90e',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  facile: '#6bcb77',
  moyen: '#f6c90e',
  difficile: '#ff6b6b',
  expert: '#c77dff',
};

const CATEGORIES = ['animaux', 'nature', 'objets', 'personnages', 'special'];

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

function relativeDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 2) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'hier';
  return `il y a ${days}j`;
}

export default async function HomePage() {
  const catalog = getCatalog();
  const slugs = catalog.map(p => p.slug);
  const dailySlug = getDailyPuzzleSlug(new Date(), slugs);
  const daily = catalog.find(p => p.slug === dailySlug)!;

  // Fetch user data for personalized section
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: { username: string | null; streak_current: number; xp: number; level: number } | null = null;
  let dailyCompletion: { score: number; time_seconds: number; xp_earned: number; errors: number } | null = null;
  let recentCompletions: { puzzle_slug: string; puzzle_name: string; score: number; time_seconds: number; xp_earned: number; created_at: string }[] = [];

  if (user) {
    const [{ data: profileData }, { data: completionsData }] = await Promise.all([
      supabase.from('profiles').select('username, streak_current, xp, level').eq('id', user.id).single(),
      supabase.from('completions').select('puzzle_slug, puzzle_name, score, time_seconds, xp_earned, errors, created_at, is_daily')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    if (profileData) profile = profileData;

    if (completionsData) {
      // Check if daily already completed today
      const today = new Date().toISOString().slice(0, 10);
      const todayDaily = completionsData.find(c =>
        c.puzzle_slug === dailySlug && c.created_at.slice(0, 10) === today
      );
      if (todayDaily) dailyCompletion = todayDaily;

      // Last 3 completions (excluding today's daily if shown)
      recentCompletions = completionsData.slice(0, 3);
    }
  }

  const username = profile?.username ?? user?.user_metadata?.user_name ?? user?.email?.split('@')[0] ?? null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

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

      {/* Personalized stats for logged-in users */}
      {profile && (
        <section style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{
            flex: 1, backgroundColor: '#1a2540', border: '1px solid #2d3f5e',
            borderRadius: '0.5rem', padding: '0.875rem', textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f6c90e' }}>
              {profile.streak_current} 🔥
            </div>
            <div style={{ fontSize: '0.7rem', color: '#8892a4', marginTop: '0.2rem' }}>Série</div>
          </div>
          <div style={{
            flex: 1, backgroundColor: '#1a2540', border: '1px solid #2d3f5e',
            borderRadius: '0.5rem', padding: '0.875rem', textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4ecdc4' }}>
              {profile.xp.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#8892a4', marginTop: '0.2rem' }}>XP</div>
          </div>
          <div style={{
            flex: 1, backgroundColor: '#1a2540', border: '1px solid #2d3f5e',
            borderRadius: '0.5rem', padding: '0.875rem', textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e2e8f0' }}>
              {profile.level}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#8892a4', marginTop: '0.2rem' }}>Niveau</div>
          </div>
        </section>
      )}

      {/* Daily puzzle banner */}
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
          /* Already completed today — show result */
          <div style={{
            backgroundColor: '#1a2540',
            border: '1px solid #2d3f5e',
            borderTop: `3px solid #4ecdc4`,
            borderRadius: '0.5rem',
            padding: '1.25rem 1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#e2e8f0' }}>
                  {nameFromSlug(daily.slug)}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.4rem' }}>
                  <Badge>{daily.size}×{daily.size}</Badge>
                  <Badge color={DIFFICULTY_COLORS[daily.difficulty]}>{daily.difficulty}</Badge>
                </div>
              </div>
              <div style={{
                backgroundColor: '#4ecdc420',
                border: '1px solid #4ecdc440',
                color: '#4ecdc4',
                fontWeight: 700,
                fontSize: '0.8rem',
                padding: '0.4rem 0.9rem',
                borderRadius: '0.375rem',
              }}>
                ✓ Complété
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '1rem' }}>{dailyCompletion.score}</div>
                <div style={{ fontSize: '0.7rem', color: '#8892a4' }}>points</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '1rem' }}>{formatTime(dailyCompletion.time_seconds)}</div>
                <div style={{ fontSize: '0.7rem', color: '#8892a4' }}>temps</div>
              </div>
              {dailyCompletion.errors > 0 && (
                <div>
                  <div style={{ fontWeight: 700, color: '#ff6b6b', fontSize: '1rem' }}>{dailyCompletion.errors}</div>
                  <div style={{ fontSize: '0.7rem', color: '#8892a4' }}>erreurs</div>
                </div>
              )}
              <div>
                <div style={{ fontWeight: 700, color: '#f6c90e', fontSize: '1rem' }}>+{dailyCompletion.xp_earned}</div>
                <div style={{ fontSize: '0.7rem', color: '#8892a4' }}>XP</div>
              </div>
            </div>
          </div>
        ) : (
          /* Not completed yet */
          <Link href={`/puzzle/${dailySlug}`} style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#1a2540',
              border: '1px solid #2d3f5e',
              borderTop: `3px solid ${CATEGORY_COLORS[daily.category]}`,
              borderRadius: '0.5rem',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1.125rem', color: '#e2e8f0' }}>
                  {nameFromSlug(daily.slug)}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Badge>{daily.size}×{daily.size}</Badge>
                  <Badge color={DIFFICULTY_COLORS[daily.difficulty]}>{daily.difficulty}</Badge>
                  <Badge color={CATEGORY_COLORS[daily.category]}>{CATEGORY_LABELS[daily.category]}</Badge>
                </div>
              </div>
              <div style={{
                backgroundColor: '#4ecdc4',
                color: '#0d1528',
                fontWeight: 700,
                fontSize: '0.875rem',
                padding: '0.5rem 1.25rem',
                borderRadius: '0.375rem',
                whiteSpace: 'nowrap',
              }}>
                Jouer →
              </div>
            </div>
          </Link>
        )}
      </section>

      {/* Recent activity for logged-in users */}
      {recentCompletions.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h2 style={{ color: '#e2e8f0', fontSize: '1rem', fontWeight: 700 }}>
              Parties récentes
            </h2>
            <Link href="/profile" style={{ color: '#4ecdc4', fontSize: '0.8rem', textDecoration: 'none' }}>
              Voir tout →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {recentCompletions.map((c, i) => (
              <Link key={i} href={`/puzzle/${c.puzzle_slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  backgroundColor: '#1a2540', border: '1px solid #2d3f5e',
                  borderRadius: '0.5rem', padding: '0.625rem 1rem',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      color: '#e2e8f0', fontWeight: 600, fontSize: '0.875rem',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {c.puzzle_name}
                    </div>
                    <div style={{ color: '#8892a4', fontSize: '0.7rem', marginTop: '0.1rem' }}>
                      {relativeDate(c.created_at)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ color: '#f6c90e', fontWeight: 700, fontSize: '0.875rem' }}>
                      +{c.xp_earned} XP
                    </div>
                    <div style={{ color: '#8892a4', fontSize: '0.7rem' }}>
                      {c.score} pts · {formatTime(c.time_seconds)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Puzzle catalog by category */}
      {CATEGORIES.map(cat => {
        const puzzles = catalog.filter(p => p.category === cat);
        if (puzzles.length === 0) return null;
        return (
          <section key={cat}>
            <h2 style={{
              color: CATEGORY_COLORS[cat],
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: CATEGORY_COLORS[cat] }} />
              {CATEGORY_LABELS[cat]}
              <span style={{ color: '#8892a4', fontWeight: 400, fontSize: '0.8rem', textTransform: 'none', letterSpacing: 0 }}>
                ({puzzles.length})
              </span>
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '0.625rem',
            }}>
              {puzzles.map(p => (
                <Link key={p.slug} href={`/puzzle/${p.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    backgroundColor: p.slug === dailySlug ? '#1f2e4a' : '#1a2540',
                    border: `1px solid ${p.slug === dailySlug ? CATEGORY_COLORS[cat] : '#2d3f5e'}`,
                    borderTop: `2px solid ${CATEGORY_COLORS[cat]}`,
                    borderRadius: '0.375rem',
                    padding: '0.625rem 0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                  }}>
                    <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.3 }}>
                      {nameFromSlug(p.slug)}
                      {p.slug === dailySlug && (
                        <span style={{ color: '#4ecdc4', fontSize: '0.7rem', marginLeft: '0.35rem' }}>★</span>
                      )}
                    </span>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      <Badge>{p.size}×{p.size}</Badge>
                      <Badge color={DIFFICULTY_COLORS[p.difficulty]}>{p.difficulty}</Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      display: 'inline-block',
      fontSize: '0.7rem',
      fontWeight: 600,
      padding: '0.1rem 0.4rem',
      borderRadius: '0.25rem',
      backgroundColor: color ? `${color}20` : '#2d3f5e',
      color: color ?? '#8892a4',
      border: `1px solid ${color ? `${color}40` : '#3d4f6e'}`,
    }}>
      {children}
    </span>
  );
}
