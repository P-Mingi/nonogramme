import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Comment jouer au nonogramme - Guide complet débutant | Nonogramme.com',
  description: 'Apprenez les règles du nonogramme (picross, logimage) en 5 minutes. Guide illustré avec exemples pour comprendre les indices et résoudre votre première grille.',
  alternates: { canonical: 'https://nonogramme.com/blog/comment-jouer-nonogramme' },
  openGraph: {
    title: 'Comment jouer au nonogramme - Guide débutant',
    description: 'Apprenez les règles du nonogramme en 5 minutes avec des exemples illustrés.',
  },
};

const s = {
  h1: { fontSize: '2rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.5rem' } as React.CSSProperties,
  h2: { fontSize: '1.375rem', fontWeight: 700, color: '#4ecdc4', marginTop: '2.5rem', marginBottom: '1rem' } as React.CSSProperties,
  h3: { fontSize: '1.125rem', fontWeight: 700, color: '#e2e8f0', marginTop: '1.5rem', marginBottom: '0.5rem' } as React.CSSProperties,
  p: { color: '#c8d8e8', marginBottom: '1rem', lineHeight: 1.8 } as React.CSSProperties,
  em: { color: '#8892a4', fontSize: '0.9rem' } as React.CSSProperties,
  grid: {
    fontFamily: 'monospace',
    backgroundColor: '#0d1528',
    border: '1px solid #2d3f5e',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginBottom: '1rem',
    lineHeight: 1.6,
    fontSize: '1.1rem',
  } as React.CSSProperties,
  tip: {
    backgroundColor: 'rgba(78,205,196,0.08)',
    border: '1px solid rgba(78,205,196,0.25)',
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
      <p style={s.em}>Guide · 5 min de lecture</p>
      <h1 style={s.h1}>Comment jouer au nonogramme - guide complet pour débutants</h1>
      <p style={{ ...s.p, color: '#8892a4' }}>Publié le 20 mars 2026</p>

      <p style={s.p}>
        Le nonogramme est un puzzle de logique dans lequel vous révélez une image cachée en remplissant des cases
        sur une grille, guidé uniquement par des indices numériques. Pas besoin de chance, pas de hasard :
        chaque case se déduit par la logique pure. C&apos;est ce qui rend ce jeu aussi satisfaisant à résoudre.
      </p>

      <p style={s.p}>
        En France, ce jeu est souvent appelé <strong style={{ color: '#e2e8f0' }}>logimage</strong> ou
        <strong style={{ color: '#e2e8f0' }}> nonogramme</strong>. Au Japon et dans les jeux vidéo Nintendo,
        on parle de <strong style={{ color: '#e2e8f0' }}>picross</strong>. En anglais, vous rencontrerez
        aussi les termes <em>hanjie</em> ou <em>griddler</em>. Mais les règles sont toujours identiques.
      </p>

      <h2 style={s.h2}>La grille et les indices</h2>

      <p style={s.p}>
        Une grille de nonogramme se présente sous la forme d&apos;un tableau vide. Sur le côté gauche,
        chaque ligne possède un ou plusieurs indices. En haut, chaque colonne possède ses propres indices.
        Ces indices décrivent les groupes de cases consécutives remplies.
      </p>

      <p style={s.p}>
        Par exemple, l&apos;indice <strong style={{ color: '#ffd93d' }}>3</strong> sur une ligne signifie
        qu&apos;il y a exactement 3 cases remplies consécutives sur cette ligne.
        L&apos;indice <strong style={{ color: '#ffd93d' }}>2 1</strong> signifie qu&apos;il y a d&apos;abord
        un groupe de 2 cases remplies, puis au moins une case vide, puis un groupe de 1 case remplie.
      </p>

      <div style={s.grid}>
        <div>Ligne avec indice <span style={{ color: '#ffd93d' }}>3</span> :</div>
        <div style={{ marginTop: '0.25rem' }}>⬜ ⬜ ⬛ ⬛ ⬛ ⬜ ⬜ &nbsp;← une seule possibilité ici</div>
        <div style={{ marginTop: '0.75rem' }}>Ligne avec indice <span style={{ color: '#ffd93d' }}>2 1</span> :</div>
        <div style={{ marginTop: '0.25rem' }}>⬛ ⬛ ⬜ ⬛ ⬜ ⬜ ⬜ &nbsp;← ou d&apos;autres positions</div>
      </div>

      <h2 style={s.h2}>Règle essentielle : les espaces obligatoires</h2>

      <p style={s.p}>
        Entre deux groupes de cases remplies, il doit toujours y avoir <strong style={{ color: '#e2e8f0' }}>au moins une case vide</strong>.
        C&apos;est la règle fondamentale. Si une ligne a l&apos;indice &quot;2 3&quot;, les 2 cases et les 3 cases ne peuvent pas se toucher.
      </p>

      <div style={s.tip}>
        💡 <strong>Règle d&apos;or</strong> : entre deux groupes, minimum 1 case vide. Ce principe vous permettra
        de déduire de nombreuses cases sans hésitation.
      </div>

      <h2 style={s.h2}>Exemple complet : résoudre une grille 5×5</h2>

      <p style={s.p}>
        Voici une grille 5×5 simple pour illustrer la méthode. Les indices des lignes sont indiqués à gauche,
        les indices des colonnes en haut.
      </p>

      <div style={s.grid}>
        <div style={{ color: '#8892a4' }}>Indices colonnes : &nbsp; 1 &nbsp;3 &nbsp;5 &nbsp;3 &nbsp;1</div>
        <div style={{ marginTop: '0.5rem' }}>Ligne 1 &nbsp;<span style={{ color: '#ffd93d' }}>1</span> : ⬜ ⬜ ⬛ ⬜ ⬜</div>
        <div>Ligne 2 &nbsp;<span style={{ color: '#ffd93d' }}>3</span> : ⬜ ⬛ ⬛ ⬛ ⬜</div>
        <div>Ligne 3 &nbsp;<span style={{ color: '#ffd93d' }}>5</span> : ⬛ ⬛ ⬛ ⬛ ⬛</div>
        <div>Ligne 4 &nbsp;<span style={{ color: '#ffd93d' }}>3</span> : ⬜ ⬛ ⬛ ⬛ ⬜</div>
        <div>Ligne 5 &nbsp;<span style={{ color: '#ffd93d' }}>1</span> : ⬜ ⬜ ⬛ ⬜ ⬜</div>
      </div>

      <p style={s.p}>
        La ligne 3 a l&apos;indice <strong style={{ color: '#ffd93d' }}>5</strong> et la grille fait 5 colonnes : toutes les cases sont donc
        remplies. C&apos;est toujours par les contraintes les plus fortes qu&apos;on commence. Ensuite, la colonne
        du milieu (colonne 3) a l&apos;indice 5 - elle aussi est entièrement remplie. On peut alors déduire les
        autres cases par recoupement.
      </p>

      <h2 style={s.h2}>Comment commencer : la méthode des débutants</h2>

      <h3 style={s.h3}>1. Commencez par les contraintes les plus fortes</h3>
      <p style={s.p}>
        Une ligne avec l&apos;indice &quot;7&quot; dans une grille 10×10 laisse peu de liberté : le groupe de 7 ne peut
        pas se déplacer de beaucoup. Les 4 cases centrales (de la 2e à la 8e position) sont forcément remplies.
        Commencez toujours par les lignes et colonnes dont les indices couvrent la majorité de la longueur.
      </p>

      <h3 style={s.h3}>2. Utilisez les colonnes pour vérifier les lignes</h3>
      <p style={s.p}>
        Une fois que vous avez déduit quelques cases sur des lignes, revenez sur les colonnes concernées.
        Ces nouvelles informations peuvent invalider certaines positions et confirmer d&apos;autres. Cette
        interaction croisée entre lignes et colonnes est au cœur de la méthode de résolution.
      </p>

      <h3 style={s.h3}>3. Marquez les cases vides (×)</h3>
      <p style={s.p}>
        Quand vous êtes certain qu&apos;une case doit être vide, marquez-la avec un ×. Cela évite de revenir
        dessus et clarifie le puzzle. Sur Nonogramme.com, l&apos;outil &quot;Marquer&quot; (ou clic droit) permet
        de placer ces marques.
      </p>

      <h3 style={s.h3}>4. Ne devinez jamais</h3>
      <p style={s.p}>
        Un vrai nonogramme possède une solution unique, déductible entièrement par la logique. Si vous vous
        retrouvez à devoir &quot;essayer&quot; une case sans certitude, c&apos;est qu&apos;il reste des déductions à faire
        ailleurs. Revenez sur les lignes et colonnes que vous n&apos;avez pas encore analysées.
      </p>

      <h2 style={s.h2}>Les outils disponibles sur Nonogramme.com</h2>

      <p style={s.p}>
        Notre interface propose trois outils : <strong style={{ color: '#e2e8f0' }}>Remplir</strong> (cliquez pour noircir une case),
        <strong style={{ color: '#e2e8f0' }}> Marquer</strong> (placez un × pour indiquer qu&apos;une case est vide) et
        <strong style={{ color: '#e2e8f0' }}> Effacer</strong> (corrigez une erreur). Vous pouvez aussi maintenir le bouton de
        la souris enfoncé et glisser pour remplir ou marquer plusieurs cases d&apos;un coup - particulièrement
        pratique sur les grandes grilles.
      </p>

      <p style={s.p}>
        Si vous êtes bloqué, l&apos;outil <strong style={{ color: '#e2e8f0' }}>Indice</strong> révèle une case correcte au
        hasard - à utiliser avec parcimonie pour préserver le plaisir de la découverte.
      </p>

      <h2 style={s.h2}>Prêt à jouer ?</h2>

      <p style={s.p}>
        Les puzzles 5×5 sont idéaux pour débuter : ils se résolvent en 2 à 5 minutes et permettent de
        comprendre les mécanismes sans se perdre. Passez ensuite aux grilles 10×10 pour plus de challenge.
        Chaque puzzle résolu révèle un dessin pixel art - des animaux, des objets, des scènes du quotidien.
      </p>

      <Link href="/" style={s.cta}>
        Commencer à jouer - c&apos;est gratuit →
      </Link>
    </article>
  );
}
