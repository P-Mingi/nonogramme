import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Techniques avancées pour résoudre les nonogrammes difficiles | Nonogramme.com',
  description: 'Maîtrisez les nonogrammes difficiles avec les techniques des experts : chevauchement, forçage, élimination et déduction croisée. Exemples détaillés.',
  alternates: { canonical: 'https://nonogramme.com/blog/techniques-avancees-nonogramme' },
  openGraph: {
    title: 'Techniques avancées nonogramme - Guide expert',
    description: 'Les méthodes des experts pour résoudre les nonogrammes difficiles.',
  },
};

const s = {
  h1: { fontSize: '2rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.5rem' } as React.CSSProperties,
  h2: { fontSize: '1.375rem', fontWeight: 700, color: '#4ecdc4', marginTop: '2.5rem', marginBottom: '1rem' } as React.CSSProperties,
  h3: { fontSize: '1.125rem', fontWeight: 700, color: '#e2e8f0', marginTop: '1.75rem', marginBottom: '0.5rem' } as React.CSSProperties,
  p: { color: '#c8d8e8', marginBottom: '1rem', lineHeight: 1.8 } as React.CSSProperties,
  em: { color: '#8892a4', fontSize: '0.9rem' } as React.CSSProperties,
  grid: {
    fontFamily: 'monospace',
    backgroundColor: '#0d1528',
    border: '1px solid #2d3f5e',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginBottom: '1rem',
    lineHeight: 1.8,
    fontSize: '1rem',
    color: '#c8d8e8',
  } as React.CSSProperties,
  tip: {
    backgroundColor: 'rgba(78,205,196,0.08)',
    border: '1px solid rgba(78,205,196,0.25)',
    borderRadius: '0.5rem',
    padding: '1rem 1.25rem',
    marginBottom: '1rem',
    color: '#c8d8e8',
  } as React.CSSProperties,
  warn: {
    backgroundColor: 'rgba(246,201,14,0.08)',
    border: '1px solid rgba(246,201,14,0.25)',
    borderRadius: '0.5rem',
    padding: '1rem 1.25rem',
    marginBottom: '1rem',
    color: '#c8d8e8',
  } as React.CSSProperties,
  cta: {
    display: 'block',
    textAlign: 'center' as const,
    backgroundColor: '#4ecdc4',
    color: '#0d1528',
    fontWeight: 700,
    fontSize: '1rem',
    padding: '0.875rem 2rem',
    borderRadius: '0.75rem',
    textDecoration: 'none',
    marginTop: '2.5rem',
  } as React.CSSProperties,
};

export default function Page() {
  return (
    <article>
      <p style={s.em}>Stratégie · 8 min de lecture</p>
      <h1 style={s.h1}>Techniques avancées pour résoudre les nonogrammes difficiles</h1>
      <p style={{ ...s.p, color: '#8892a4' }}>Publié le 20 mars 2026</p>

      <p style={s.p}>
        Une fois les bases du nonogramme maîtrisées, vous vous retrouvez inévitablement face à des grilles
        qui résistent à l&apos;approche basique. Les grilles 10×10 et 15×15 en difficulté &quot;difficile&quot; ou &quot;expert&quot;
        demandent des techniques plus sophistiquées. Voici les cinq méthodes clés utilisées par les joueurs
        expérimentés.
      </p>

      <h2 style={s.h2}>Technique 1 : Le chevauchement (overlap)</h2>

      <p style={s.p}>
        C&apos;est la technique la plus puissante pour débuter une grille. Elle s&apos;applique quand un indice est
        suffisamment grand par rapport à la taille de la ligne.
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Principe :</strong> Si un groupe de longueur <em>k</em> doit
        tenir dans une ligne de longueur <em>n</em>, les positions possibles pour ce groupe vont de la
        position 1 jusqu&apos;à la position <em>(n - k + 1)</em>. Les cases comprises entre
        la position <em>k</em> et la position <em>(n - k + 1)</em> sont forcément remplies.
      </p>

      <div style={s.grid}>
        <div style={{ color: '#8892a4' }}>Grille 10 cases, indice = <span style={{ color: '#ffd93d' }}>7</span></div>
        <div>Positions possibles : ⬛⬛⬛⬛⬛⬛⬛⬜⬜⬜ (début)</div>
        <div style={{ color: '#8892a4' }}>ou bien :</div>
        <div>⬜⬜⬜⬛⬛⬛⬛⬛⬛⬛ (fin)</div>
        <div style={{ marginTop: '0.5rem', color: '#4ecdc4' }}>→ Cases 4 à 7 (chevauchement) : forcément ⬛⬛⬛⬛</div>
      </div>

      <div style={s.tip}>
        💡 <strong>Formule rapide :</strong> pour un groupe de taille <em>k</em> dans une ligne de <em>n</em> cases,
        le chevauchement fait <em>2k - n</em> cases. Si ce nombre est positif, elles sont toutes remplies.
      </div>

      <h2 style={s.h2}>Technique 2 : Le forçage (forcing)</h2>

      <p style={s.p}>
        Quand les contraintes d&apos;une ligne sont si fortes qu&apos;il ne reste qu&apos;une seule configuration possible,
        on dit que la ligne est &quot;forcée&quot;. Cela arrive souvent quand plusieurs groupes doivent tenir dans un
        espace réduit, ou quand certaines cases sont déjà confirmées ou exclues.
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Exemple :</strong> Une ligne de 10 cases avec l&apos;indice &quot;3 3 2&quot;.
        La somme minimale est 3 + 1 + 3 + 1 + 2 = 10 (les 1 étant les espaces obligatoires). La ligne
        est entièrement déterminée : pas d&apos;ambiguïté possible.
      </p>

      <div style={s.grid}>
        <div style={{ color: '#8892a4' }}>Ligne 10 cases, indice <span style={{ color: '#ffd93d' }}>3 3 2</span> :</div>
        <div>⬛⬛⬛ ⬜ ⬛⬛⬛ ⬜ ⬛⬛ &nbsp;← unique solution</div>
      </div>

      <h2 style={s.h2}>Technique 3 : L&apos;élimination par les bords</h2>

      <p style={s.p}>
        Si vous savez qu&apos;une case proche d&apos;un bord est vide, vous pouvez contraindre davantage
        la position des groupes. Inversement, si une case en bord de grille est remplie, vous savez
        que le premier (ou dernier) groupe &quot;commence ici&quot;.
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Cas pratique :</strong> Ligne de 8 cases, indice &quot;4 2&quot;.
        Si on sait que la case 1 est vide (via une colonne), le groupe de 4 ne peut commencer qu&apos;à
        partir de la case 2. Cela réduit l&apos;ambiguïté et permet de déduire de nouvelles cases.
      </p>

      <div style={s.grid}>
        <div style={{ color: '#8892a4' }}>Ligne 8 cases, indice <span style={{ color: '#ffd93d' }}>4 2</span>, case 1 connue vide :</div>
        <div>✕ ⬛⬛⬛⬛ ⬜ ⬛⬛ &nbsp;← seule possibilité</div>
      </div>

      <h2 style={s.h2}>Technique 4 : La déduction croisée</h2>

      <p style={s.p}>
        C&apos;est le cœur de la résolution des grilles complexes. Chaque information déduite sur une ligne
        informe immédiatement les colonnes qui traversent cette ligne, et vice versa. Le processus est
        itératif : une déduction en entraîne une autre, qui en entraîne une troisième, etc.
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Méthode recommandée :</strong> Commencez par les lignes et colonnes
        avec les indices les plus contraignants. Notez toutes vos déductions. Puis passez aux suivantes en
        tenant compte des nouvelles cases connues. Répétez jusqu&apos;à résolution complète.
      </p>

      <div style={s.warn}>
        ⚠️ <strong>Piège courant :</strong> Ne résolvez pas une seule ligne jusqu&apos;au bout avant de passer
        à la suivante. Analysez d&apos;abord globalement, puis revenez avec les nouvelles informations. Les
        grilles difficiles se résolvent &quot;en couches successives&quot; et non ligne par ligne.
      </div>

      <h2 style={s.h2}>Technique 5 : L&apos;analyse des impossibilités</h2>

      <p style={s.p}>
        Parfois, la clé n&apos;est pas de trouver les cases remplies, mais d&apos;exclure les impossibles.
        Si vous pouvez prouver qu&apos;une case ne peut être dans aucun groupe possible, elle est forcément vide.
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Exemple :</strong> Ligne de 10 cases, indice &quot;2 2&quot;. Les cases
        5 et 6 pourraient sembler ambiguës. Mais si une case voisine est confirmée remplie, et que cela
        forcerait un groupe de 3 au lieu de 2, alors cette hypothèse est impossible - et la case doit être vide.
      </p>

      <h2 style={s.h2}>Exemple pratique : résoudre une grille 5×5 difficile</h2>

      <p style={s.p}>
        Considérons la grille suivante. Lignes (de haut en bas) : 1, 3, 5, 3, 1. Colonnes (de gauche à droite) : 1, 3, 5, 3, 1.
      </p>

      <p style={s.p}>
        Étape 1 : La ligne 3 a l&apos;indice 5, toutes les cases sont remplies. La colonne 3 a aussi l&apos;indice 5.
        Ces deux lignes croisées nous donnent immédiatement 9 cases.
      </p>
      <p style={s.p}>
        Étape 2 : La colonne 2 a l&apos;indice 3, la colonne 4 aussi. Par le chevauchement et les cases déjà
        connues (ligne 3), on déduit les cases 2, 3, 4 de ces colonnes.
      </p>
      <p style={s.p}>
        Étape 3 : Les lignes 2 et 4 (indice 3) sont maintenant contraintes : les colonnes centrales 2, 3, 4
        étant remplies, la déduction est complète. Les coins sont vides.
      </p>

      <h2 style={s.h2}>Entraînez-vous avec les grilles de difficulté croissante</h2>

      <p style={s.p}>
        Ces techniques s&apos;acquièrent avec la pratique. Notre système de niveaux progressifs sur
        Nonogramme.com vous fait passer graduellement des grilles 5×5 faciles aux redoutables 15×15 experts.
        Chaque niveau vous fera renforcer naturellement ces réflexes.
      </p>

      <Link href="/" style={s.cta}>
        Pratiquer avec des puzzles de difficulté croissante →
      </Link>
    </article>
  );
}
