import Link from 'next/link';
import { getCatalog } from '@/lib/puzzles';
import { getDailyPuzzleSlug, getTimeUntilNextPuzzle } from '@/lib/utils/daily';
import { Logo } from '@/components/ui/Logo';

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

export default function HomePage() {
  const catalog = getCatalog();
  const slugs = catalog.map(p => p.slug);
  const dailySlug = getDailyPuzzleSlug(new Date(), slugs);
  const daily = catalog.find(p => p.slug === dailySlug)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

      {/* Hero */}
      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', paddingTop: '0.5rem' }}>
        <Logo variant="icon" theme="dark" size="md" href="" />
        <p style={{ color: '#7aa8cc', fontSize: '0.9rem', textAlign: 'center' }}>
          Révèle des dessins cachés en résolvant des puzzles de logique
        </p>
      </section>

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
      </section>

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
