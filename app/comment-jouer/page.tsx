import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comment jouer au Nonogramme - Règles et tutoriel',
  description: 'Apprends à jouer au nonogramme (picross, logimage) en quelques minutes. Règles simples, exemple illustré et conseils pour débutants.',
  keywords: [
    'comment jouer nonogramme', 'règles nonogramme', 'règles picross',
    'tutoriel nonogramme', 'apprendre nonogramme', 'logimage règles',
    'comment jouer picross', 'nonogramme débutant', 'hanjie règles',
  ],
  alternates: { canonical: 'https://nonogramme.com/comment-jouer' },
  openGraph: {
    title: 'Comment jouer au Nonogramme - Règles et tutoriel',
    description: 'Règles du nonogramme expliquées simplement avec un exemple illustré.',
    url: 'https://nonogramme.com/comment-jouer',
  },
};

// Simple 5×5 example puzzle: a house / maison
// solution:
//  0 0 1 0 0
//  0 1 1 1 0
//  1 1 1 1 1
//  1 0 0 0 1
//  1 1 1 1 1
const EXAMPLE_SOLUTION = [
  [0, 0, 1, 0, 0],
  [0, 1, 1, 1, 0],
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1],
];
const ROW_CLUES = ['1', '3', '5', '1 1', '5'];
const COL_CLUES = ['3', '2', '4', '2', '3'];

export default function HowToPlayPage() {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Back */}
      <Link href="/" style={{ color: '#8892a4', fontSize: '0.8rem', textDecoration: 'none' }}>
        ← Accueil
      </Link>

      {/* Hero */}
      <header>
        <h1 style={{ color: '#e2e8f0', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Comment jouer au Nonogramme ?
        </h1>
        <p style={{ color: '#8892a4', fontSize: '0.95rem', lineHeight: 1.7 }}>
          Le <strong style={{ color: '#e2e8f0' }}>nonogramme</strong> (aussi appelé <strong style={{ color: '#e2e8f0' }}>picross</strong>, logimage ou hanjie)
          est un puzzle de logique japonais. Le but : colorier les bonnes cases d'une grille pour révéler un dessin caché.
          Aucun hasard - que de la logique pure.
        </p>
      </header>

      {/* Rule 1 */}
      <section>
        <H2>1. Lis les indices</H2>
        <p style={{ color: '#8892a4', fontSize: '0.9rem', lineHeight: 1.7 }}>
          Chaque ligne et chaque colonne est accompagnée de nombres. Ces nombres indiquent les <strong style={{ color: '#e2e8f0' }}>groupes de cases remplies</strong>, dans l'ordre, de gauche à droite (ou de haut en bas pour les colonnes).
        </p>
        <ul style={{ color: '#8892a4', fontSize: '0.9rem', lineHeight: 2, marginTop: '0.75rem', paddingLeft: '1.25rem' }}>
          <li><Highlight>3</Highlight> → un seul groupe de 3 cases remplies</li>
          <li><Highlight>2 1</Highlight> → un groupe de 2, puis un groupe de 1</li>
          <li><Highlight>1 1 1</Highlight> → trois cases isolées (au moins 1 vide entre chaque)</li>
        </ul>
        <InfoBox>
          Il y a <strong>obligatoirement au moins 1 case vide</strong> entre deux groupes consécutifs.
        </InfoBox>
      </section>

      {/* Rule 2 */}
      <section>
        <H2>2. Remplis et marque</H2>
        <p style={{ color: '#8892a4', fontSize: '0.9rem', lineHeight: 1.7 }}>
          Tu as deux actions disponibles :
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
          <ActionRow color="#4ecdc4" label="Remplir" icon="■">
            Case <strong style={{ color: '#4ecdc4' }}>remplie</strong> - fait partie du dessin
          </ActionRow>
          <ActionRow color="#ff6b6b" label="Marquer ✕" icon="✕">
            Case <strong style={{ color: '#ff6b6b' }}>vide</strong> - sert de repère pour ne pas se tromper
          </ActionRow>
        </div>
      </section>

      {/* Example */}
      <section>
        <H2>3. Exemple illustré</H2>
        <p style={{ color: '#8892a4', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
          Voici un nonogramme 5×5. Les indices sont affichés sur les lignes et colonnes. Essaie de déduire la solution avant de regarder la réponse !
        </p>

        {/* Puzzle grid */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <ExampleGrid solution={EXAMPLE_SOLUTION} rowClues={ROW_CLUES} colClues={COL_CLUES} />
        </div>

        <details style={{ cursor: 'pointer' }}>
          <summary style={{ color: '#4ecdc4', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', listStyle: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>▶</span> Voir la solution
          </summary>
          <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center' }}>
            <ExampleGrid solution={EXAMPLE_SOLUTION} rowClues={ROW_CLUES} colClues={COL_CLUES} revealed />
          </div>
          <p style={{ textAlign: 'center', color: '#8892a4', fontSize: '0.8rem', marginTop: '0.75rem' }}>
            C'est une maison ! 🏠
          </p>
        </details>
      </section>

      {/* Tips */}
      <section>
        <H2>4. Conseils pour débuter</H2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { title: 'Commence par les plus grands groupes', text: 'Un groupe de 5 dans une grille de 5 remplit toute la ligne - c\'est un cadeau !' },
            { title: 'Utilise le recoupement', text: 'Si un groupe de 4 doit tenir dans 5 cases, la case du milieu est forcément remplie.' },
            { title: 'Place des croix', text: 'Marquer les cases vides (✕) évite de remplir une case que tu as déjà exclue par logique.' },
            { title: 'Travaille ligne par ligne et colonne par colonne', text: 'Alterne entre lignes et colonnes - chaque information nouvelle aide à progresser sur l\'autre axe.' },
          ].map(tip => (
            <div key={tip.title} style={{
              backgroundColor: '#1a2540', border: '1px solid #2d3f5e',
              borderRadius: '0.5rem', padding: '0.875rem 1rem',
            }}>
              <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                {tip.title}
              </div>
              <div style={{ color: '#8892a4', fontSize: '0.85rem', lineHeight: 1.5 }}>{tip.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        backgroundColor: '#1a2540', border: '1px solid #4ecdc4',
        borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center',
      }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.5rem' }}>
          Prêt à jouer ?
        </div>
        <p style={{ color: '#8892a4', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          Plus de 100 puzzles gratuits, du niveau débutant à expert.
        </p>
        <Link href="/" style={{
          display: 'inline-block',
          backgroundColor: '#4ecdc4', color: '#0d1528',
          fontWeight: 700, fontSize: '0.95rem',
          padding: '0.6rem 1.75rem', borderRadius: '0.5rem',
          textDecoration: 'none',
        }}>
          Jouer maintenant →
        </Link>
      </section>

      {/* Schema.org HowTo */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Comment jouer au Nonogramme',
            description: 'Guide complet pour apprendre les règles du nonogramme (picross) et résoudre votre premier puzzle.',
            step: [
              { '@type': 'HowToStep', name: 'Lis les indices', text: 'Chaque ligne et colonne indique les groupes de cases à remplir dans l\'ordre.' },
              { '@type': 'HowToStep', name: 'Déduis les cases obligatoires', text: 'Utilise la logique pour trouver les cases forcément remplies ou vides.' },
              { '@type': 'HowToStep', name: 'Remplis et marque', text: 'Colorie les cases remplies et place des croix sur les cases vides.' },
              { '@type': 'HowToStep', name: 'Révèle le dessin', text: 'Complète la grille pour découvrir l\'image cachée.' },
            ],
          }),
        }}
      />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ color: '#4ecdc4', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem' }}>
      {children}
    </h2>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      backgroundColor: '#1a2540', border: '1px solid #2d3f5e',
      color: '#f6c90e', padding: '0.1rem 0.4rem', borderRadius: '0.25rem',
      fontSize: '0.85rem', fontFamily: 'monospace',
    }}>
      {children}
    </code>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: '#4ecdc410', border: '1px solid #4ecdc440',
      borderRadius: '0.5rem', padding: '0.75rem 1rem',
      color: '#8892a4', fontSize: '0.85rem', marginTop: '0.75rem', lineHeight: 1.6,
    }}>
      ℹ️ {children}
    </div>
  );
}

function ActionRow({ color, icon, label, children }: { color: string; icon: string; label: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      backgroundColor: '#1a2540', border: '1px solid #2d3f5e',
      borderRadius: '0.5rem', padding: '0.625rem 0.875rem',
    }}>
      <span style={{
        width: 28, height: 28, borderRadius: 4,
        backgroundColor: `${color}20`, border: `1px solid ${color}50`,
        color, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: '0.9rem', flexShrink: 0,
      }}>
        {icon}
      </span>
      <div>
        <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.85rem' }}>{label}</div>
        <div style={{ color: '#8892a4', fontSize: '0.8rem' }}>{children}</div>
      </div>
    </div>
  );
}

function ExampleGrid({ solution, rowClues, colClues, revealed = false }: {
  solution: number[][];
  rowClues: string[];
  colClues: string[];
  revealed?: boolean;
}) {
  const CELL = 36;
  const CLUE_W = 40;

  return (
    <div style={{ fontFamily: 'monospace', userSelect: 'none' }}>
      {/* Column clues row */}
      <div style={{ display: 'flex', paddingLeft: CLUE_W }}>
        {colClues.map((clue, c) => (
          <div key={c} style={{
            width: CELL, textAlign: 'center',
            fontSize: '0.75rem', fontWeight: 700, color: '#8892a4',
            paddingBottom: 4,
          }}>
            {clue.split(' ').map((n, i) => <div key={i}>{n}</div>)}
          </div>
        ))}
      </div>
      {/* Rows */}
      {solution.map((row, r) => (
        <div key={r} style={{ display: 'flex', alignItems: 'center' }}>
          {/* Row clue */}
          <div style={{
            width: CLUE_W, textAlign: 'right', paddingRight: 8,
            fontSize: '0.75rem', fontWeight: 700, color: '#8892a4',
          }}>
            {rowClues[r]}
          </div>
          {/* Cells */}
          {row.map((cell, c) => (
            <div key={c} style={{
              width: CELL, height: CELL,
              border: '1px solid #2d3f5e',
              backgroundColor: revealed && cell === 1 ? '#4ecdc4' : '#0d1528',
              borderRadius: 3, margin: 1,
              transition: 'background-color 0.2s',
            }} />
          ))}
        </div>
      ))}
    </div>
  );
}
