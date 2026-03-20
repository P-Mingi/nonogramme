import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} - Profil Nonogramme.com`,
    description: `Découvrez les nonogrammes créés par ${username} sur Nonogramme.com.`,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, level, xp, streak_current, puzzles_completed, created_at')
    .eq('username', username)
    .single();

  if (!profile) notFound();

  const [{ data: createdPuzzles }, { data: completions }] = await Promise.all([
    supabase
      .from('puzzles')
      .select('slug, name, category, size, difficulty, play_count, created_at')
      .eq('created_by', profile.id)
      .eq('is_community', true)
      .order('play_count', { ascending: false })
      .limit(20),
    supabase
      .from('completions')
      .select('puzzle_slug, puzzle_name, score, time_seconds, completed_at')
      .eq('user_id', profile.id)
      .order('completed_at', { ascending: false })
      .limit(10),
  ]);

  const totalPlays = createdPuzzles?.reduce((sum, p) => sum + (p.play_count || 0), 0) ?? 0;

  return (
    <div>
      {/* Profile header */}
      <div style={{
        background: '#1a2540', border: '1px solid #2d3f5e',
        borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem',
        display: 'flex', alignItems: 'center', gap: '1.25rem',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          overflow: 'hidden', background: '#1e3048', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#4ecdc4' }}>
              {profile.username?.[0]?.toUpperCase()}
            </span>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem', color: '#e2e8f0' }}>
            {profile.username}
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#4ecdc4', margin: '0 0 0.75rem', fontWeight: 600 }}>
            Niveau {profile.level}
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            {[
              { value: profile.xp.toLocaleString('fr'), label: 'XP TOTAL', color: '#ffd93d' },
              { value: String(createdPuzzles?.length ?? 0), label: 'PUZZLES CRÉÉS', color: '#4ecdc4' },
              { value: totalPlays.toLocaleString('fr'), label: 'FOIS JOUÉS', color: '#c084fc' },
              { value: `🔥 ${profile.streak_current}`, label: 'SÉRIE', color: '#ff6b6b' },
            ].map(({ value, label, color }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color }}>{value}</div>
                <div style={{ fontSize: '0.65rem', color: '#3d6080', letterSpacing: '0.05em' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Created puzzles */}
      {createdPuzzles && createdPuzzles.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4ecdc4', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Puzzles créés
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {createdPuzzles.map(puzzle => (
              <Link key={puzzle.slug} href={`/puzzle/${puzzle.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#1a2540', border: '1px solid #2d3f5e',
                  borderRadius: '0.75rem', padding: '0.875rem 1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '2px' }}>
                      {puzzle.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#3d6080' }}>
                      {puzzle.size}×{puzzle.size} · {puzzle.difficulty}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#4ecdc4' }}>
                      {puzzle.play_count || 0}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#3d6080' }}>plays</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent completions */}
      {completions && completions.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7aa8cc', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Puzzles récents
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {completions.map((c, i) => (
              <Link key={i} href={`/puzzle/${c.puzzle_slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#1a2540', border: '1px solid #2d3f5e',
                  borderRadius: '0.625rem', padding: '0.625rem 0.875rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: '0.825rem', color: '#7aa8cc' }}>{c.puzzle_name}</span>
                  <span style={{ fontSize: '0.75rem', color: '#ffd93d', fontWeight: 700 }}>
                    {c.score.toLocaleString('fr')} pts
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center' }}>
        <Link href="/create" style={{
          display: 'inline-block', padding: '0.875rem 2rem',
          background: 'linear-gradient(135deg, #4ecdc4, #45b7d1)',
          borderRadius: '0.75rem', color: '#070d17',
          fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none',
        }}>
          ✏️ Créer un puzzle
        </Link>
      </div>
    </div>
  );
}
