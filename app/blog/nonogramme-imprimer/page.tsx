import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nonogramme à imprimer - grilles gratuites PDF | Nonogramme.com',
  description: 'Téléchargez et imprimez des nonogrammes gratuits. Grilles 5×5, 10×10 et 15×15 en PDF, parfaites pour les enfants, l\'école ou les voyages.',
  alternates: { canonical: 'https://nonogramme.com/blog/nonogramme-imprimer' },
  openGraph: {
    title: 'Nonogramme à imprimer - grilles gratuites',
    description: 'Grilles nonogramme à imprimer gratuitement pour jouer sans écran.',
  },
};

const s = {
  h1: { fontSize: '2rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.5rem' } as React.CSSProperties,
  h2: { fontSize: '1.375rem', fontWeight: 700, color: '#4ecdc4', marginTop: '2.5rem', marginBottom: '1rem' } as React.CSSProperties,
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
  tip: {
    backgroundColor: '#1a2540',
    border: '1px solid #2d3f5e',
    borderLeft: '3px solid #4ecdc4',
    borderRadius: '0 0.5rem 0.5rem 0',
    padding: '0.875rem 1rem',
    marginBottom: '1rem',
    color: '#c8d8e8',
    fontSize: '0.9rem',
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
      <p style={s.em}>Ressources · 4 min de lecture</p>
      <h1 style={s.h1}>Nonogramme à imprimer - grilles gratuites</h1>
      <p style={{ ...s.p, color: '#8892a4' }}>Publié le 20 mars 2026</p>

      <p style={s.p}>
        Vous souhaitez jouer au nonogramme sans écran - en voyage, à l&apos;école, dans la salle
        d&apos;attente ou simplement pour le plaisir du papier-crayon ? Les nonogrammes à imprimer
        sont une excellente alternative aux versions numériques. Ce guide vous explique comment
        trouver, télécharger et imprimer des grilles de qualité, gratuitement.
      </p>

      <div style={s.highlight}>
        📄 <strong>Rappel :</strong> les grilles nonogramme en ligne sur Nonogramme.com sont
        également disponibles sur mobile et tablette sans impression. Elles fonctionnent même
        hors connexion une fois la page chargée.
      </div>

      <h2 style={s.h2}>Créer ses propres grilles à imprimer</h2>

      <p style={s.p}>
        La méthode la plus fiable pour obtenir des nonogrammes imprimables de qualité est de les
        créer vous-même. Voici comment procéder :
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>1. Choisir une image simple.</strong> Sur papier
        millimétré ou dans un tableur, dessinez votre image en cochant les cases noires.
        Pour une grille 10×10, comptez 10 colonnes et 10 lignes - chaque case mesure idéalement
        0,5 à 1 cm pour être confortable à remplir au stylo.
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>2. Calculer les indices.</strong> Pour chaque ligne,
        notez les groupes de cases noires consécutives (ex : 2, 4, 1). Même chose pour les colonnes.
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>3. Mettre en page.</strong> Créez un tableau dans Word,
        LibreOffice ou Google Docs : la première ligne contient les indices de colonnes (un par cellule),
        et la première colonne contient les indices de lignes. Les cellules intérieures forment la grille de jeu.
      </p>

      <div style={s.tip}>
        💡 Dans Google Sheets, utilisez des cellules carrées (largeur et hauteur identiques) pour avoir une grille
        visuellement correcte. Ajoutez une bordure fine sur toutes les cellules et une bordure épaisse
        tous les 5 cases pour faciliter le comptage.
      </div>

      <h2 style={s.h2}>Format recommandé pour l&apos;impression</h2>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Format A4, orientation portrait.</strong> Pour les grilles 5×5,
        vous pouvez en mettre 4 par page. Pour les 10×10, 2 par page est confortable. Les 15×15 occupent
        idéalement une page entière.
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Cases de 8mm minimum.</strong> En dessous de 8mm, les cases
        deviennent difficiles à remplir proprement avec un stylo standard. Pour les enfants ou les personnes
        âgées, 10-12mm est plus confortable.
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Imprimer en noir et blanc.</strong> Les nonogrammes classiques
        n&apos;utilisent que deux couleurs (noir et blanc). L&apos;impression en noir et blanc sur papier
        blanc ordinaire est parfaite et économique.
      </p>

      <h2 style={s.h2}>Nonogrammes à imprimer pour l&apos;école</h2>

      <p style={s.p}>
        Les enseignants utilisent régulièrement les nonogrammes comme exercice de logique et de
        concentration en classe. Voici quelques idées d&apos;utilisation :
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Activité de début de cours.</strong> Un nonogramme 5×5
        en guise d&apos;échauffement cérébral (5 minutes) prépare les élèves à la concentration.
        Très utilisé en cours de mathématiques ou de sciences.
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Atelier autonomie.</strong> Pour les élèves qui terminent
        leur travail en avance, une feuille de 4 nonogrammes 5×5 peut occuper 15 à 20 minutes.
        Aucune assistance requise - le puzzle est auto-corrigé (l&apos;image apparaît quand c&apos;est
        juste).
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Compétition amicale.</strong> Distribuez la même grille à
        tous les élèves en même temps et voyez qui la résout le premier correctement. Crée une
        émulation positive.
      </p>

      <h2 style={s.h2}>La différence avec la version en ligne</h2>

      <p style={s.p}>
        La version papier a ses avantages : pas de distractions numériques, sensation tactile du crayon,
        et possibilité d&apos;emporter le puzzle partout. Mais la version en ligne offre des fonctionnalités
        impossibles sur papier : validation automatique, marquage des cases vides, undo illimité,
        et le plaisir de voir l&apos;image finale animée.
      </p>

      <p style={s.p}>
        Pour débuter ou enseigner, le papier est excellent. Pour la pratique régulière et progressive
        (niveaux, séries quotidiennes, classements), le numérique prend le dessus.
      </p>

      <Link href="/" style={s.cta}>
        Jouer en ligne gratuitement →
      </Link>
    </article>
  );
}
