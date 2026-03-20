'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { CommunityPuzzle } from '@/app/communaute/page';

const CATEGORY_COLORS: Record<string, string> = {
  animaux: '#4ecdc4',
  nature: '#4ade80',
  objets: '#ffd93d',
  personnages: '#c084fc',
  nourriture: '#ff6b6b',
  symboles: '#45b7d1',
};

const CATEGORY_LABELS: Record<string, string> = {
  animaux: 'Animaux',
  nature: 'Nature',
  objets: 'Objets',
  personnages: 'Personnages',
  nourriture: 'Nourriture',
  symboles: 'Symboles',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  facile: '#4ade80',
  moyen: '#ffd93d',
  difficile: '#ff6b6b',
  expert: '#c084fc',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  facile: 'Facile',
  moyen: 'Moyen',
  difficile: 'Difficile',
  expert: 'Expert',
};

type SortKey = 'popular' | 'newest';
type SizeFilter = 'all' | '10' | '15';
type DifficultyFilter = 'all' | 'facile' | 'moyen' | 'difficile';
type CategoryFilter = 'all' | string;

interface Props {
  puzzles: CommunityPuzzle[];
}

export function CommunauteClient({ puzzles }: Props) {
  const [sort, setSort] = useState<SortKey>('popular');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');
  const [size, setSize] = useState<SizeFilter>('all');

  const filtered = useMemo(() => {
    let list = [...puzzles];

    if (category !== 'all') list = list.filter(p => p.category === category);
    if (difficulty !== 'all') list = list.filter(p => p.difficulty === difficulty);
    if (size !== 'all') list = list.filter(p => String(p.size) === size);

    if (sort === 'popular') {
      list.sort((a, b) => b.play_count - a.play_count);
    } else {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return list;
  }, [puzzles, sort, category, difficulty, size]);

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.4rem 0.875rem',
    borderRadius: '0.5rem',
    border: 'none',
    backgroundColor: active ? '#4ecdc4' : '#1a2540',
    color: active ? '#0d1528' : '#8892a4',
    fontWeight: 700,
    fontSize: '0.8rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ color: '#4ecdc4', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem' }}>
            Puzzles communautaires
          </h1>
          <p style={{ color: '#8892a4', fontSize: '0.8rem', margin: 0 }}>
            {puzzles.length} puzzle{puzzles.length > 1 ? 's' : ''} créés par la communauté
          </p>
        </div>
        <Link href="/create" style={{
          display: 'inline-block', padding: '0.625rem 1.25rem',
          background: 'linear-gradient(135deg, #4ecdc4, #45b7d1)',
          borderRadius: '0.625rem', color: '#070d17',
          fontWeight: 800, fontSize: '0.875rem', textDecoration: 'none',
        }}>
          ✏️ Créer un puzzle
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>

        {/* Sort */}
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.7rem', color: '#3d6080', fontWeight: 700, alignSelf: 'center', letterSpacing: '0.05em' }}>TRIER</span>
          {(['popular', 'newest'] as SortKey[]).map(s => (
            <button key={s} onClick={() => setSort(s)} style={tabStyle(sort === s)}>
              {s === 'popular' ? '🔥 Les plus joués' : '✨ Les plus récents'}
            </button>
          ))}
        </div>

        {/* Category */}
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.7rem', color: '#3d6080', fontWeight: 700, alignSelf: 'center', letterSpacing: '0.05em' }}>CAT.</span>
          <button onClick={() => setCategory('all')} style={tabStyle(category === 'all')}>Toutes</button>
          {Object.keys(CATEGORY_LABELS).map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{
              ...tabStyle(category === c),
              ...(category === c ? { backgroundColor: CATEGORY_COLORS[c] } : {}),
            }}>
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        {/* Difficulty + Size */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.7rem', color: '#3d6080', fontWeight: 700, alignSelf: 'center', letterSpacing: '0.05em' }}>DIFF.</span>
            <button onClick={() => setDifficulty('all')} style={tabStyle(difficulty === 'all')}>Toutes</button>
            {(['facile', 'moyen', 'difficile'] as DifficultyFilter[]).filter(d => d !== 'all').map(d => (
              <button key={d} onClick={() => setDifficulty(d)} style={{
                ...tabStyle(difficulty === d),
                ...(difficulty === d ? { backgroundColor: DIFFICULTY_COLORS[d] } : {}),
              }}>
                {DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#3d6080', fontWeight: 700, alignSelf: 'center', letterSpacing: '0.05em' }}>TAILLE</span>
            {(['all', '10', '15'] as SizeFilter[]).map(s => (
              <button key={s} onClick={() => setSize(s)} style={tabStyle(size === s)}>
                {s === 'all' ? 'Toutes' : `${s}×${s}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      {filtered.length !== puzzles.length && (
        <p style={{ fontSize: '0.75rem', color: '#3d6080', margin: 0 }}>
          {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{
          background: '#1a2540', border: '1px solid #2d3f5e',
          borderRadius: '1rem', padding: '2.5rem',
          textAlign: 'center', color: '#8892a4',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧩</div>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>Aucun puzzle ne correspond à ces filtres.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '0.75rem',
        }}>
          {filtered.map(puzzle => {
            const catColor = puzzle.color ?? CATEGORY_COLORS[puzzle.category] ?? '#4ecdc4';
            const diffColor = DIFFICULTY_COLORS[puzzle.difficulty] ?? '#8892a4';

            return (
              <Link key={puzzle.slug} href={`/puzzle/${puzzle.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#1a2540',
                  border: '1px solid #2d3f5e',
                  borderRadius: '0.875rem',
                  padding: '1rem',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.625rem',
                  transition: 'border-color 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = catColor)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#2d3f5e')}
                >
                  {/* Top row: color dot + category */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      display: 'inline-block', width: 8, height: 8,
                      borderRadius: '50%', backgroundColor: catColor, flexShrink: 0,
                    }} />
                    <span style={{ fontSize: '0.65rem', color: catColor, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {CATEGORY_LABELS[puzzle.category] ?? puzzle.category}
                    </span>
                  </div>

                  {/* Name */}
                  <div style={{
                    fontSize: '0.95rem', fontWeight: 700, color: '#e2e8f0',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {puzzle.name}
                  </div>

                  {/* Meta row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 700, color: diffColor,
                      background: `${diffColor}18`, borderRadius: '0.25rem',
                      padding: '0.125rem 0.375rem',
                    }}>
                      {DIFFICULTY_LABELS[puzzle.difficulty] ?? puzzle.difficulty}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#3d6080' }}>
                      {puzzle.size}×{puzzle.size}
                    </span>
                  </div>

                  {/* Footer: creator + plays */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    {puzzle.creator_username ? (
                      <span
                        style={{ fontSize: '0.7rem', color: '#3d6080' }}
                        onClick={e => { e.preventDefault(); window.location.href = `/profil/${puzzle.creator_username}`; }}
                      >
                        par <span style={{ color: '#7aa8cc' }}>{puzzle.creator_username}</span>
                      </span>
                    ) : (
                      <span />
                    )}
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#4ecdc4' }}>
                        {puzzle.play_count.toLocaleString('fr')}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: '#3d6080', marginLeft: '0.25rem' }}>plays</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Bottom CTA */}
      {puzzles.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(78,205,196,0.07), rgba(69,183,209,0.07))',
          border: '1px solid rgba(78,205,196,0.2)',
          borderRadius: '1rem', padding: '1.5rem',
          textAlign: 'center',
        }}>
          <p style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '1rem', margin: '0 0 0.375rem' }}>
            Tu veux contribuer ?
          </p>
          <p style={{ color: '#8892a4', fontSize: '0.8rem', margin: '0 0 1rem' }}>
            Crée ton propre nonogramme et gagne 50 XP a la publication.
          </p>
          <Link href="/create" style={{
            display: 'inline-block', padding: '0.75rem 1.75rem',
            background: 'linear-gradient(135deg, #4ecdc4, #45b7d1)',
            borderRadius: '0.75rem', color: '#070d17',
            fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none',
          }}>
            ✏️ Créer un puzzle
          </Link>
        </div>
      )}
    </div>
  );
}
