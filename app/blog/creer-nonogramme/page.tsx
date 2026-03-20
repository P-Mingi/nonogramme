import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Comment créer un nonogramme | Guide complet | Nonogramme.com',
  description: 'Apprenez à créer votre propre nonogramme étape par étape - choisir une image, calculer les indices, vérifier l\'unicité de la solution.',
  alternates: { canonical: 'https://nonogramme.com/blog/creer-nonogramme' },
  openGraph: {
    title: 'Comment créer un nonogramme',
    description: 'Guide complet pour créer votre propre puzzle nonogramme.',
  },
};

const s = {
  h1: { fontSize: '2rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.5rem' } as React.CSSProperties,
  h2: { fontSize: '1.375rem', fontWeight: 700, color: '#4ecdc4', marginTop: '2.5rem', marginBottom: '1rem' } as React.CSSProperties,
  h3: { fontSize: '1.125rem', fontWeight: 700, color: '#e2e8f0', marginTop: '1.75rem', marginBottom: '0.5rem' } as React.CSSProperties,
  p: { color: '#c8d8e8', marginBottom: '1rem', lineHeight: 1.8 } as React.CSSProperties,
  em: { color: '#8892a4', fontSize: '0.9rem' } as React.CSSProperties,
  code: {
    backgroundColor: '#1a2540', border: '1px solid #2d3f5e',
    borderRadius: '0.25rem', padding: '0.125rem 0.375rem',
    fontFamily: 'monospace', fontSize: '0.875rem', color: '#4ecdc4',
  } as React.CSSProperties,
  step: {
    display: 'flex', gap: '1rem', alignItems: 'flex-start',
    backgroundColor: '#1a2540', border: '1px solid #2d3f5e',
    borderRadius: '0.5rem', padding: '1rem', marginBottom: '0.75rem',
  } as React.CSSProperties,
  stepNum: {
    flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
    backgroundColor: '#4ecdc4', color: '#0d1528',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: '0.875rem',
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
      <p style={s.em}>Création · 6 min de lecture</p>
      <h1 style={s.h1}>Comment créer un nonogramme</h1>
      <p style={{ ...s.p, color: '#8892a4' }}>Publié le 20 mars 2026</p>

      <p style={s.p}>
        Créer un nonogramme est un exercice créatif accessible à tous. Il n&apos;y a pas besoin de
        logiciel spécialisé - un peu de papier millimétré et quelques règles suffisent.
        Ce guide vous explique comment concevoir un puzzle nonogramme de A à Z, depuis le dessin
        jusqu&apos;au calcul des indices, en passant par la vérification de l&apos;unicité de la solution.
      </p>

      <h2 style={s.h2}>Étape par étape</h2>

      <div style={s.step}>
        <div style={s.stepNum}>1</div>
        <div>
          <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '0.25rem' }}>Choisir la taille de la grille</div>
          <p style={{ ...s.p, marginBottom: 0 }}>
            Pour un premier nonogramme, commencez par une grille <strong style={{ color: '#e2e8f0' }}>5×5 ou 10×10</strong>.
            Les grilles plus petites sont plus faciles à concevoir et à vérifier. Les grilles 15×15
            offrent plus de liberté artistique mais sont plus complexes à valider.
          </p>
        </div>
      </div>

      <div style={s.step}>
        <div style={s.stepNum}>2</div>
        <div>
          <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '0.25rem' }}>Dessiner l&apos;image pixel art</div>
          <p style={{ ...s.p, marginBottom: 0 }}>
            Sur papier millimétré, noircissez les cases pour former une image reconnaissable.
            Pensez &quot;pixel art&quot; : des formes simples, contrastées, avec une silhouette claire.
            Un chat, un cœur, une maison, un arbre - les meilleures images nonogramme ont une
            silhouette immédiatement identifiable une fois révélée.
          </p>
        </div>
      </div>

      <div style={s.step}>
        <div style={s.stepNum}>3</div>
        <div>
          <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '0.25rem' }}>Calculer les indices de lignes</div>
          <p style={{ ...s.p, marginBottom: 0 }}>
            Pour chaque ligne, lisez les groupes de cases noires consécutives de gauche à droite.
            Notez leur longueur dans l&apos;ordre. Exemple : une ligne <code style={s.code}>■■ □ ■■■</code>
            donne l&apos;indice <code style={s.code}>2 3</code>.
            Une ligne entièrement vide donne l&apos;indice <code style={s.code}>0</code> (certains
            éditeurs omettent le 0 ou écrivent un tiret).
          </p>
        </div>
      </div>

      <div style={s.step}>
        <div style={s.stepNum}>4</div>
        <div>
          <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '0.25rem' }}>Calculer les indices de colonnes</div>
          <p style={{ ...s.p, marginBottom: 0 }}>
            Même processus, mais de haut en bas pour chaque colonne.
          </p>
        </div>
      </div>

      <div style={s.step}>
        <div style={s.stepNum}>5</div>
        <div>
          <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '0.25rem' }}>Vérifier l&apos;unicité de la solution</div>
          <p style={{ ...s.p, marginBottom: 0 }}>
            C&apos;est l&apos;étape la plus importante - et la plus souvent oubliée par les débutants.
            Un nonogramme valide doit avoir <strong style={{ color: '#e2e8f0' }}>exactement une solution</strong>.
            Si deux grilles différentes satisfont les mêmes indices, votre puzzle est invalide.
            Vérifiez manuellement en essayant de résoudre votre propre puzzle à partir des indices seulement
            (sans regarder votre image de référence).
          </p>
        </div>
      </div>

      <h2 style={s.h2}>L&apos;unicité : le défi principal</h2>

      <p style={s.p}>
        La plupart des images pixel art naïves génèrent des puzzles avec plusieurs solutions - ce qui
        les rend insatisfaisants à résoudre (impossible de savoir si on a &quot;la bonne&quot; réponse).
        Pour garantir l&apos;unicité, suivez ces règles :
      </p>

      <h3 style={s.h3}>Évitez les zones entièrement vides</h3>
      <p style={s.p}>
        Une colonne ou ligne avec l&apos;indice <code style={s.code}>0</code> ne pose pas de problème.
        Mais une grande zone vide entourée de lignes peu contraintes crée souvent des ambiguïtés.
        Ajoutez un détail (un petit point) pour ancrer la solution.
      </p>

      <h3 style={s.h3}>Préférez des groupes asymétriques</h3>
      <p style={s.p}>
        Un indice <code style={s.code}>3 3</code> sur une ligne de 10 crée une ambiguïté
        (le groupe peut être décalé de plusieurs façons). Un indice
        <code style={s.code}> 2 4</code> est beaucoup plus contraignant - les deux groupes
        ne peuvent pas s&apos;échanger.
      </p>

      <h3 style={s.h3}>Validez avec la méthode logique</h3>
      <p style={s.p}>
        Résolvez votre puzzle en utilisant <em>uniquement</em> la déduction logique, sans suppositions.
        Si vous devez à un moment &quot;deviner&quot; (tester une hypothèse et voir si elle
        se contredit), soit votre puzzle manque d&apos;unicité, soit il nécessite une technique
        avancée non adaptée à la difficulté voulue.
      </p>

      <div style={s.highlight}>
        💡 <strong>Conseil :</strong> La plupart des créateurs de nonogrammes expérimentés commencent
        par l&apos;image, puis itèrent - modifiant un ou deux pixels - jusqu&apos;à obtenir un puzzle
        avec une solution unique. C&apos;est un vrai processus créatif.
      </div>

      <h2 style={s.h2}>Conseils pour de belles images</h2>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>La silhouette prime.</strong> Une image nonogramme est
        souvent vue en négatif - la forme globale doit être reconnaissable avant même d&apos;être
        colorée. Pensez à la silhouette en noir sur fond blanc.
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Évitez le trop plein.</strong> Une grille à 80% noire
        est difficile à lire visuellement. Les meilleures images oscillent entre 40% et 60% de cases noires.
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Testez sur plusieurs tailles.</strong> Une image qui
        fonctionne bien en 10×10 peut être trop vague en 5×5 ou trop simple en 15×15.
        Adaptez le niveau de détail à la taille choisie.
      </p>

      <Link href="/" style={s.cta}>
        Résoudre des nonogrammes →
      </Link>
    </article>
  );
}
