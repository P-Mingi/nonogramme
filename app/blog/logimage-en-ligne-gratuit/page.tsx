import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Logimage en ligne gratuit | Nonogramme.com',
  description: 'Jouez au logimage en ligne gratuitement. Des centaines de grilles logimage classées par difficulté, sans inscription, depuis votre navigateur.',
  alternates: { canonical: 'https://nonogramme.com/blog/logimage-en-ligne-gratuit' },
  openGraph: {
    title: 'Logimage en ligne gratuit',
    description: 'Des centaines de grilles logimage à résoudre directement dans votre navigateur.',
  },
};

const s = {
  h1: { fontSize: '2rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.5rem' } as React.CSSProperties,
  h2: { fontSize: '1.375rem', fontWeight: 700, color: '#4ecdc4', marginTop: '2.5rem', marginBottom: '1rem' } as React.CSSProperties,
  h3: { fontSize: '1.125rem', fontWeight: 700, color: '#e2e8f0', marginTop: '1.75rem', marginBottom: '0.5rem' } as React.CSSProperties,
  p: { color: '#c8d8e8', marginBottom: '1rem', lineHeight: 1.8 } as React.CSSProperties,
  em: { color: '#8892a4', fontSize: '0.9rem' } as React.CSSProperties,
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
      <p style={s.em}>Puzzle logique · 5 min de lecture</p>
      <h1 style={s.h1}>Logimage en ligne gratuit — jouez maintenant</h1>
      <p style={{ ...s.p, color: '#8892a4' }}>Publié le 20 mars 2026</p>

      <p style={s.p}>
        Le <strong style={{ color: '#e2e8f0' }}>logimage</strong> est l&apos;un des jeux de réflexion les
        plus populaires en France. Connu sous le nom de nonogramme en anglais et de picross au Japon,
        ce puzzle de logique consiste à colorier des cases dans une grille pour révéler une image cachée.
        Bonne nouvelle : vous pouvez y jouer gratuitement en ligne, sans téléchargement ni inscription.
      </p>

      <div style={s.highlight}>
        🎮 <strong>Jouez maintenant :</strong> notre collection propose des logimages de niveaux 5×5,
        10×10 et 15×15 — classés de facile à expert, avec un nouveau puzzle chaque jour.
      </div>

      <h2 style={s.h2}>Qu&apos;est-ce qu&apos;un logimage ?</h2>

      <p style={s.p}>
        Un logimage (ou grille logimage) est un puzzle visuel inventé indépendamment dans les années 1980
        par le Japonais Non Ishida et l&apos;Israélien Tetsuya Nishio. Le principe est simple :
      </p>

      <p style={s.p}>
        Vous avez une grille vide avec, en marge de chaque ligne et de chaque colonne, des <strong style={{ color: '#e2e8f0' }}>séquences de chiffres</strong>.
        Ces chiffres indiquent la longueur et l&apos;ordre des groupes de cases à noircir. En combinant
        les informations de toutes les lignes et colonnes, vous déduisez logiquement quelles cases
        colorier — sans jamais avoir à deviner.
      </p>

      <h2 style={s.h2}>Comment résoudre un logimage ?</h2>

      <h3 style={s.h3}>Lire les indices</h3>
      <p style={s.p}>
        Chaque chiffre représente un groupe de cases noires consécutives. Par exemple, &quot;3 2&quot;
        signifie : un groupe de 3 cases noires, puis (au moins une case vide), puis un groupe de 2 cases noires.
        L&apos;ordre est toujours respecté de gauche à droite pour les lignes, et de haut en bas pour les colonnes.
      </p>

      <h3 style={s.h3}>La technique du chevauchement</h3>
      <p style={s.p}>
        C&apos;est la technique de base. Si un groupe doit tenir dans une ligne de 10 cases et que l&apos;indice
        est &quot;7&quot;, les cases 4 à 7 sont <em>obligatoirement</em> noires, car le groupe de 7 doit couvrir
        au moins ces positions quel que soit son placement. Plus le groupe est grand par rapport à la ligne,
        plus les cases certaines sont nombreuses.
      </p>

      <h3 style={s.h3}>Élimination progressive</h3>
      <p style={s.p}>
        Une fois quelques cases fixées, chaque nouvelle information réduit les possibilités restantes.
        Traitez les lignes et colonnes les plus contraintes en premier — elles vous donnent les certitudes
        qui débloquent les autres.
      </p>

      <h2 style={s.h2}>Logimage en ligne vs papier</h2>

      <p style={s.p}>
        Jouer au logimage en ligne présente plusieurs avantages par rapport aux versions papier ou en magazine :
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Pas d&apos;erreurs permanentes.</strong> En ligne, vous pouvez
        effacer et corriger sans abîmer votre grille. Le mode &quot;marquer&quot; permet d&apos;indiquer les
        cases vides que vous avez déjà raisonnées, ce qui simplifie la lecture.
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Validation automatique.</strong> Dès que votre solution est
        complète et correcte, le jeu vous le confirme instantanément avec l&apos;image révélée.
        Pas de doute possible — c&apos;est résolu ou ce ne l&apos;est pas.
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Accès illimité, gratuit.</strong> Les magazines de logimage
        coûtent plusieurs euros et contiennent une dizaine de grilles. En ligne, vous avez accès à des
        centaines de puzzles instantanément — et un nouveau chaque jour.
      </p>

      <h2 style={s.h2}>Choisir sa difficulté</h2>

      <p style={s.p}>
        Si vous débutez, commencez par les <strong style={{ color: '#e2e8f0' }}>grilles 5×5</strong>.
        Elles se résolvent en 2 à 5 minutes et vous apprendrez toutes les techniques de base.
        Une fois à l&apos;aise, les <strong style={{ color: '#e2e8f0' }}>grilles 10×10</strong> offrent
        un beau défi intermédiaire — 10 à 20 minutes pour les plus difficiles.
        Les <strong style={{ color: '#e2e8f0' }}>grilles 15×15</strong> sont réservées aux joueurs
        expérimentés : elles demandent une combinaison de toutes les techniques avancées.
      </p>

      <Link href="/" style={s.cta}>
        Jouer au logimage gratuitement →
      </Link>
    </article>
  );
}
