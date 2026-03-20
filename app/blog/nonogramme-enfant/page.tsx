import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nonogramme enfant - puzzles logiques adaptés | Nonogramme.com',
  description: 'Des nonogrammes faciles pour les enfants dès 6 ans. Grilles 5×5 avec images amusantes, idéales pour apprendre la logique par le jeu.',
  alternates: { canonical: 'https://nonogramme.com/blog/nonogramme-enfant' },
  openGraph: {
    title: 'Nonogramme enfant - puzzles adaptés aux 6-12 ans',
    description: 'Nonogrammes faciles pour apprendre la logique par le jeu, dès 6 ans.',
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
  ageCard: {
    backgroundColor: '#1a2540',
    border: '1px solid #2d3f5e',
    borderRadius: '0.5rem',
    padding: '1rem 1.25rem',
    marginBottom: '0.75rem',
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
      <p style={s.em}>Éducation · 5 min de lecture</p>
      <h1 style={s.h1}>Nonogramme enfant - puzzles logiques dès 6 ans</h1>
      <p style={{ ...s.p, color: '#8892a4' }}>Publié le 20 mars 2026</p>

      <p style={s.p}>
        Le nonogramme est l&apos;un des rares jeux qui combine plaisir immédiat et bénéfices cognitifs
        profonds - et qui fonctionne aussi bien pour les enfants que pour les adultes. Les grilles 5×5
        sont parfaitement adaptées aux enfants dès 6 ans : simples à comprendre, rapides à résoudre
        (2 à 5 minutes), et suffisamment satisfaisantes pour maintenir l&apos;attention.
      </p>

      <div style={s.highlight}>
        🧒 <strong>À partir de 6 ans :</strong> les grilles 5×5 représentent des animaux, des objets
        du quotidien et des symboles facilement reconnaissables. La récompense visuelle (découvrir
        l&apos;image) motive naturellement les enfants à persévérer.
      </div>

      <h2 style={s.h2}>Pourquoi les nonogrammes sont excellents pour les enfants</h2>

      <h3 style={s.h3}>Ils apprennent à raisonner sans mémoriser</h3>
      <p style={s.p}>
        Contrairement aux quiz ou aux exercices scolaires classiques, un nonogramme ne demande
        aucune connaissance préalable. L&apos;enfant doit <strong style={{ color: '#e2e8f0' }}>déduire</strong>
        chaque case à partir des indices. Ce type de raisonnement - &quot;si A est vrai, alors B
        est nécessairement vrai&quot; - est exactement ce que l&apos;école enseigne en mathématiques,
        mais rarement de façon aussi ludique.
      </p>

      <h3 style={s.h3}>Ils développent la concentration</h3>
      <p style={s.p}>
        Pour résoudre une grille, l&apos;enfant doit garder en tête plusieurs contraintes simultanément.
        Cette &quot;mémoire de travail&quot; est directement liée aux performances scolaires en lecture
        et en calcul. Des études montrent qu&apos;un entraînement régulier (15 à 20 minutes par jour)
        améliore significativement cette capacité chez les 6-12 ans.
      </p>

      <h3 style={s.h3}>Ils apprennent à gérer l&apos;échec</h3>
      <p style={s.p}>
        Un nonogramme peut se résoudre toujours logiquement - il n&apos;y a jamais besoin de deviner.
        Si l&apos;enfant fait une erreur, il peut revenir en arrière et comprendre <em>pourquoi</em>
        son raisonnement était faux. C&apos;est une excellente introduction à la démarche scientifique :
        formuler une hypothèse, la tester, corriger.
      </p>

      <h2 style={s.h2}>Guide par tranches d&apos;âge</h2>

      <div style={s.ageCard}>
        <div style={{ fontWeight: 700, color: '#6bcb77', marginBottom: '0.5rem' }}>6-7 ans - Grilles 5×5</div>
        <p style={{ ...s.p, marginBottom: 0 }}>
          Commencez par les grilles les plus simples (indice &quot;5&quot; sur une ligne de 5 = toute la ligne est noire).
          Expliquez le principe avec votre doigt sur l&apos;écran. L&apos;enfant comprend vite que
          c&apos;est un &quot;puzzle dessin&quot;.
        </p>
      </div>

      <div style={s.ageCard}>
        <div style={{ fontWeight: 700, color: '#f6c90e', marginBottom: '0.5rem' }}>8-10 ans - Grilles 5×5 et 10×10 faciles</div>
        <p style={{ ...s.p, marginBottom: 0 }}>
          À cet âge, l&apos;enfant peut utiliser la technique du chevauchement et commencer les
          grilles 10×10 de niveau facile. Il est souvent plus rapide que les adultes sur les petites grilles !
        </p>
      </div>

      <div style={s.ageCard}>
        <div style={{ fontWeight: 700, color: '#ff6b6b', marginBottom: '0.5rem' }}>11-12 ans - Grilles 10×10 toutes difficultés</div>
        <p style={{ ...s.p, marginBottom: 0 }}>
          Les pré-ados peuvent aborder les grilles 10×10 moyennes et difficiles. Introduisez la technique
          d&apos;élimination (marquer les cases vides avec ×). Les grilles difficiles demandent
          10 à 15 minutes de concentration soutenue.
        </p>
      </div>

      <h2 style={s.h2}>Conseils pour jouer avec votre enfant</h2>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Laissez-le échouer.</strong> La tentation est de montrer
        la solution dès que l&apos;enfant bloque, mais c&apos;est précisément dans le blocage que
        l&apos;apprentissage se fait. Posez-lui des questions : &quot;Qu&apos;est-ce que tu sais
        avec certitude sur cette ligne ?&quot;
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Jouez en parallèle.</strong> Prenez chacun une grille
        de même difficulté et voyez qui finit le premier. La compétition amicale maintient l&apos;engagement
        même sur des grilles plus difficiles.
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Valorisez le raisonnement.</strong> Quand votre enfant
        résout une case, demandez-lui de l&apos;expliquer à voix haute. Cette &quot;verbalisation&quot;
        consolide la compréhension et développe la capacité à structurer un discours logique.
      </p>

      <Link href="/" style={s.cta}>
        Essayer les grilles pour enfants →
      </Link>
    </article>
  );
}
