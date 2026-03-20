import { ImageResponse } from 'next/og';
import { getPuzzleBySlug } from '@/lib/puzzles';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const DIFFICULTY_LABELS: Record<string, string> = {
  facile: 'Facile',
  moyen: 'Moyen',
  difficile: 'Difficile',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  facile: '#6bcb77',
  moyen: '#f6c90e',
  difficile: '#ff6b6b',
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const puzzle = await getPuzzleBySlug(slug);

  const gridSize = puzzle.size;
  const cellPx = gridSize <= 5 ? 48 : 28;
  const filledColor = puzzle.colors?.filled ?? '#4ecdc4';
  const diffColor = DIFFICULTY_COLORS[puzzle.difficulty] ?? '#8892a4';

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: '#0d1528',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Left: text */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingRight: 60 }}>
          <div style={{
            fontSize: 20,
            color: '#4ecdc4',
            fontWeight: 700,
            letterSpacing: 3,
            marginBottom: 28,
          }}>
            NONOGRAMME.COM
          </div>

          <div style={{
            fontSize: puzzle.name.length > 14 ? 58 : 72,
            fontWeight: 800,
            color: '#e2e8f0',
            lineHeight: 1.1,
            marginBottom: 28,
          }}>
            {puzzle.name}
          </div>

          <div style={{ display: 'flex', marginBottom: 36 }}>
            <div style={{
              backgroundColor: '#1a2540',
              color: '#8892a4',
              fontSize: 20,
              fontWeight: 600,
              padding: '7px 18px',
              borderRadius: 8,
              border: '1px solid #2d3f5e',
              marginRight: 12,
            }}>
              {gridSize}×{gridSize}
            </div>
            <div style={{
              backgroundColor: `${diffColor}22`,
              color: diffColor,
              fontSize: 20,
              fontWeight: 600,
              padding: '7px 18px',
              borderRadius: 8,
              border: `1px solid ${diffColor}55`,
            }}>
              {DIFFICULTY_LABELS[puzzle.difficulty] ?? puzzle.difficulty}
            </div>
          </div>

          <div style={{ fontSize: 24, color: '#8892a4' }}>
            Révèle l'image cachée - puzzle gratuit
          </div>
        </div>

        {/* Right: pixel grid */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1a2540',
          padding: 18,
          borderRadius: 14,
          border: '1px solid #2d3f5e',
          flexShrink: 0,
        }}>
          {puzzle.solution.map((row, r) => (
            <div key={r} style={{ display: 'flex' }}>
              {row.map((cell, c) => (
                <div
                  key={c}
                  style={{
                    width: cellPx,
                    height: cellPx,
                    margin: 2,
                    borderRadius: 3,
                    backgroundColor: cell === 1 ? filledColor : '#0d1528',
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
