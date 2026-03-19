import { createClient } from '@/lib/supabase/server';
import { getLevelFromXP, LEVELS } from '@/lib/utils/xp';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ProfileEditForm } from '@/components/ProfileEditForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mon profil — Nonogramme.com',
};

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

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/');

  const [{ data: profile }, { data: completions }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('completions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  if (!profile) redirect('/');

  const levelInfo = getLevelFromXP(profile.xp);
  const nextLevel = LEVELS.find(l => l.level === levelInfo.level + 1);
  const prevXP = levelInfo.xpRequired;
  const nextXP = nextLevel?.xpRequired ?? profile.xp;
  const xpProgress = nextLevel
    ? Math.round(((profile.xp - prevXP) / (nextXP - prevXP)) * 100)
    : 100;

  const username =
    profile.username ??
    user.user_metadata?.user_name ??
    user.email?.split('@')[0] ??
    'Joueur';
  const avatarUrl = profile.avatar_url ?? user.user_metadata?.avatar_url;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 560 }}>

      {/* Back link */}
      <Link href="/" style={{ color: '#8892a4', fontSize: '0.8rem', textDecoration: 'none' }}>
        ← Accueil
      </Link>

      {/* Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={username}
            width={56}
            height={56}
            style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
        ) : (
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            backgroundColor: '#2d3f5e',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 700, color: '#8892a4', flexShrink: 0,
          }}>
            {username[0].toUpperCase()}
          </div>
        )}
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#e2e8f0' }}>{username}</div>
          <div style={{ fontSize: '0.8rem', color: '#4ecdc4', marginTop: '0.15rem' }}>
            Niveau {profile.level} — {levelInfo.name}
          </div>
        </div>
      </div>

      {/* Edit form */}
      <ProfileEditForm currentUsername={username} currentAvatarUrl={avatarUrl ?? null} />

      {/* XP bar */}
      <div style={{
        backgroundColor: '#1a2540', border: '1px solid #2d3f5e',
        borderRadius: '0.5rem', padding: '1rem 1.25rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#8892a4' }}>Expérience</span>
          <span style={{ fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 600 }}>
            {profile.xp.toLocaleString()} XP
          </span>
        </div>
        <div style={{ backgroundColor: '#0d1528', borderRadius: 4, height: 8, overflow: 'hidden' }}>
          <div style={{
            width: `${xpProgress}%`, height: '100%',
            backgroundColor: '#4ecdc4', borderRadius: 4,
          }} />
        </div>
        {nextLevel ? (
          <div style={{ fontSize: '0.7rem', color: '#8892a4', marginTop: '0.5rem', textAlign: 'right' }}>
            {(nextXP - profile.xp).toLocaleString()} XP avant le niveau {nextLevel.level} ({nextLevel.name})
          </div>
        ) : (
          <div style={{ fontSize: '0.7rem', color: '#f6c90e', marginTop: '0.5rem', textAlign: 'right' }}>
            Niveau maximum atteint !
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        <StatCard label="Série actuelle" value={`${profile.streak_current} 🔥`} />
        <StatCard label="Meilleure série" value={`${profile.streak_best} 🔥`} />
        <StatCard label="Puzzles résolus" value={String(profile.puzzles_completed)} />
      </div>

      {/* Recent completions */}
      <section>
        <h2 style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Parties récentes
        </h2>
        {!completions?.length ? (
          <p style={{ color: '#8892a4', fontSize: '0.875rem' }}>Aucune partie encore.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {completions.map(c => (
              <Link
                key={c.id}
                href={`/puzzle/${c.puzzle_slug}`}
                style={{ textDecoration: 'none' }}
              >
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
                      {c.is_daily && (
                        <span style={{ color: '#4ecdc4', fontSize: '0.65rem', marginLeft: '0.4rem' }}>★ jour</span>
                      )}
                    </div>
                    <div style={{ color: '#8892a4', fontSize: '0.7rem', marginTop: '0.1rem' }}>
                      {relativeDate(c.created_at)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ color: '#f6c90e', fontWeight: 700, fontSize: '0.875rem' }}>
                      +{c.xp_earned} XP
                    </div>
                    <div style={{ color: '#8892a4', fontSize: '0.7rem', marginTop: '0.1rem' }}>
                      {c.score} pts · {formatTime(c.time_seconds)}
                      {c.errors > 0 ? ` · ${c.errors} err` : ''}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      backgroundColor: '#1a2540', border: '1px solid #2d3f5e',
      borderRadius: '0.5rem', padding: '0.875rem', textAlign: 'center',
    }}>
      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#e2e8f0' }}>{value}</div>
      <div style={{ fontSize: '0.7rem', color: '#8892a4', marginTop: '0.25rem' }}>{label}</div>
    </div>
  );
}
