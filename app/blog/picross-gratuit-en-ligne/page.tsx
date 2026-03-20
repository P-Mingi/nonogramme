import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Picross gratuit en ligne | Nonogramme.com',
  description: 'Jouez au picross en ligne gratuitement dans votre navigateur. Puzzles de toutes tailles, nouveau puzzle chaque jour, sans inscription.',
  alternates: { canonical: 'https://nonogramme.com/blog/picross-gratuit-en-ligne' },
  openGraph: {
    title: 'Picross gratuit en ligne',
    description: 'Le picross classique dans votre navigateur — gratuit, sans pub, nouveau puzzle chaque jour.',
  },
};

const s = {
  h1: { fontSize: '2rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.5rem' } as React.CSSProperties,
  h2: { fontSize: '1.375rem', fontWeight: 700, color: '#4ecdc4', marginTop: '2.5rem', marginBottom: '1rem' } as React.CSSProperties,
  p: { color: '#c8d8e8', marginBottom: '1rem', lineHeight: 1.8 } as React.CSSProperties,
  em: { color: '#8892a4', fontSize: '0.9rem' } as React.CSSProperties,
  table: {
    width: '100%', borderCollapse: 'collapse' as const,
    marginBottom: '1.5rem', fontSize: '0.875rem',
  } as React.CSSProperties,
  th: {
    backgroundColor: '#1a2540', color: '#4ecdc4', fontWeight: 700,
    padding: '0.625rem 1rem', textAlign: 'left' as const,
    borderBottom: '1px solid #2d3f5e',
  } as React.CSSProperties,
  td: {
    padding: '0.625rem 1rem', color: '#c8d8e8',
    borderBottom: '1px solid #1a2540',
  } as React.CSSProperties,
  highlight: {
    backgroundColor: 'rgba(78,205,196,0.08)',
    border: '1px solid rgba(78,205,196,0.25)',
    borderRadius: '0.5rem',
    padding: '1rem 1.25rem',
    marginBottom: '1.5rem',
    color: '#c8d8e8',
  } as React.CSSProperties,
  cta: {
    display: 'block', textAlign: 'center' as const,
    backgroundColor: '#4ecdc4', color: '#0d1528',
    fontWeight: 700, fontSize: '1rem',
    padding: '0.875rem 2rem', borderRadius: '0.75rem',
    textDecoration: 'none', marginTop: '2.5rem',
  } as React.CSSProperties,
};

export default function Page() {
  return (
    <article>
      <p style={s.em}>Puzzle logique · 4 min de lecture</p>
      <h1 style={s.h1}>Picross gratuit en ligne — le guide complet</h1>
      <p style={{ ...s.p, color: '#8892a4' }}>Publié le 20 mars 2026</p>

      <p style={s.p}>
        Le <strong style={{ color: '#e2e8f0' }}>picross</strong> est un jeu de puzzle japonais qui a conquis
        des millions de joueurs dans le monde entier. Connu aussi comme nonogramme, logimage ou hanjie,
        il combine la logique pure et le plaisir de découvrir une image pixel art à la fin de chaque grille.
        Le meilleur : vous pouvez jouer gratuitement en ligne, directement dans votre navigateur.
      </p>

      <div style={s.highlight}>
        🎮 <strong>Disponible maintenant :</strong> des centaines de picross gratuits, de 5×5 à 15×15,
        avec un puzzle quotidien exclusif.
      </div>

      <h2 style={s.h2}>L&apos;histoire du picross</h2>

      <p style={s.p}>
        Le terme &quot;picross&quot; est une contraction de &quot;picture&quot; et &quot;cross&quot;
        (croisé). Il a été popularisé par Nintendo qui a commercialisé une série de jeux sous ce nom
        depuis 1995. La série <em>Mario&apos;s Picross</em> sur Game Boy est considérée comme le jeu
        de référence qui a introduit ce type de puzzle au grand public occidental.
      </p>

      <p style={s.p}>
        Au Japon, il était déjà populaire sous le nom de <strong style={{ color: '#e2e8f0' }}>お絵かきロジック</strong>
        (oekaki logic, &quot;logique dessin&quot;). En France, il était publié dans des magazines sous
        le nom de logimage. Aujourd&apos;hui le terme nonogramme s&apos;est imposé comme standard international.
      </p>

      <h2 style={s.h2}>Picross vs Nonogramme : quelle différence ?</h2>

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Nom</th>
            <th style={s.th}>Origine</th>
            <th style={s.th}>Contexte d&apos;usage</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Picross', 'Nintendo / Japon', 'Jeux vidéo, consoles Nintendo'],
            ['Nonogramme', 'Standard international', 'Sites, apps, livres de puzzles'],
            ['Logimage', 'France / Belgique', 'Magazines de puzzles imprimés'],
            ['Hanjie', 'Angleterre', 'Journaux, magazines'],
            ['Griddler', 'Angleterre', 'Livres de puzzles'],
          ].map(([nom, origine, contexte]) => (
            <tr key={nom}>
              <td style={{ ...s.td, fontWeight: 600, color: '#e2e8f0' }}>{nom}</td>
              <td style={s.td}>{origine}</td>
              <td style={s.td}>{contexte}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={s.p}>
        Quel que soit le nom, les règles sont <strong style={{ color: '#e2e8f0' }}>exactement identiques</strong>.
        Si vous savez jouer au picross, vous savez jouer au nonogramme et au logimage.
      </p>

      <h2 style={s.h2}>Comment jouer au picross en ligne ?</h2>

      <p style={s.p}>
        Notre version en ligne reprend exactement l&apos;interface classique du picross :
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Outil Remplir :</strong> cliquez ou glissez sur une case pour
        la noircir. C&apos;est l&apos;outil principal — utilisez-le pour les cases que vous avez
        <em> déterminé avec certitude</em> qu&apos;elles sont noires.
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Outil Marquer (×) :</strong> cliquez pour marquer une case
        d&apos;un petit X. Cela indique que cette case est <em>certainement vide</em>. Très utile pour
        visualiser les contraintes et éviter de remplir accidentellement une case vide.
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Outil Effacer :</strong> supprime le remplissage ou la marque
        d&apos;une case. Indispensable pour corriger les erreurs.
      </p>

      <h2 style={s.h2}>Pourquoi jouer sur Nonogramme.com ?</h2>

      <p style={s.p}>
        Contrairement aux applications mobiles qui bombardent de publicités, notre site est conçu pour
        une expérience de jeu pure. Pas de pop-ups, pas de compte obligatoire pour commencer.
        L&apos;interface s&apos;adapte parfaitement aux écrans tactiles comme aux souris d&apos;ordinateur.
      </p>

      <Link href="/" style={s.cta}>
        Jouer au picross gratuitement →
      </Link>
    </article>
  );
}
