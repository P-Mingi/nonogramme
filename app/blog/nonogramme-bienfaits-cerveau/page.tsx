import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Les bienfaits du nonogramme pour le cerveau | Nonogramme.com',
  description: 'Mémoire, concentration, logique déductive — découvrez pourquoi les nonogrammes sont excellents pour la santé mentale, pour tous les âges.',
  alternates: { canonical: 'https://nonogramme.com/blog/nonogramme-bienfaits-cerveau' },
  openGraph: {
    title: 'Bienfaits du nonogramme pour le cerveau',
    description: 'Pourquoi jouer au nonogramme est bon pour votre santé mentale et cognitive.',
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
  stat: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  statCard: {
    backgroundColor: '#1a2540',
    border: '1px solid #2d3f5e',
    borderRadius: '0.5rem',
    padding: '1rem',
    textAlign: 'center' as const,
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
      <p style={s.em}>Santé · 4 min de lecture</p>
      <h1 style={s.h1}>Les bienfaits du nonogramme pour le cerveau</h1>
      <p style={{ ...s.p, color: '#8892a4' }}>Publié le 20 mars 2026</p>

      <p style={s.p}>
        On sait depuis longtemps que les puzzles et jeux de logique ont des effets positifs sur le cerveau.
        Mais qu&apos;en est-il spécifiquement des nonogrammes ? Ce jeu, qui combine déduction logique, mémoire de
        travail et visualisation spatiale, s&apos;avère particulièrement complet sur le plan cognitif.
        Voici pourquoi intégrer quelques puzzles à votre quotidien peut réellement bénéficier à votre cerveau.
      </p>

      <div style={s.stat}>
        {[
          { value: '15 min', label: 'par jour suffisent', color: '#4ecdc4' },
          { value: '3 zones', label: 'cérébrales activées', color: '#f6c90e' },
          { value: 'Tout âge', label: 'dès 6 ans', color: '#6bcb77' },
        ].map(({ value, label, color }) => (
          <div key={label} style={s.statCard}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color, marginBottom: '0.25rem' }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: '#8892a4' }}>{label}</div>
          </div>
        ))}
      </div>

      <h2 style={s.h2}>1. La logique déductive</h2>

      <p style={s.p}>
        Chaque nonogramme est un exercice pur de <strong style={{ color: '#e2e8f0' }}>raisonnement déductif</strong>.
        Contrairement aux mots croisés (qui font appel à la culture générale) ou au sudoku (qui relève
        davantage de la combinatoire), le nonogramme requiert de construire un raisonnement de type
        &quot;si A est vrai, alors B est nécessairement vrai&quot;.
      </p>

      <p style={s.p}>
        Ce type de raisonnement active le cortex préfrontal, région du cerveau associée à la planification,
        à la prise de décision et à la résolution de problèmes complexes. Le pratiquer régulièrement
        renforce ces connexions neuronales, un processus que les chercheurs appellent la neuroplasticité.
      </p>

      <h2 style={s.h2}>2. La mémoire de travail</h2>

      <p style={s.p}>
        Pour résoudre un nonogramme, vous devez simultanément <strong style={{ color: '#e2e8f0' }}>retenir
        les contraintes de plusieurs lignes et colonnes</strong> tout en les croisant mentalement.
        C&apos;est la définition même de la mémoire de travail — la capacité à maintenir et manipuler des
        informations à court terme.
      </p>

      <p style={s.p}>
        Des études sur des jeux de logique similaires (puzzles visuels, sudoku, échecs) montrent
        que leur pratique régulière améliore la capacité de mémoire de travail et peut ralentir son
        déclin naturel avec l&apos;âge. Un bénéfice particulièrement précieux pour les personnes de plus de 50 ans.
      </p>

      <h2 style={s.h2}>3. La visualisation spatiale</h2>

      <p style={s.p}>
        Avant même de remplir la première case, votre cerveau essaie de deviner à quoi ressemblera
        l&apos;image finale. Cette capacité à imaginer un résultat visuel à partir d&apos;informations abstraites
        (les indices numériques) fait appel au cortex visuel et aux zones de traitement spatial du cerveau.
      </p>

      <p style={s.p}>
        Cette compétence — la <strong style={{ color: '#e2e8f0' }}>rotation mentale et la visualisation
        2D</strong> — est étroitement liée à l&apos;aptitude aux mathématiques, aux sciences et aux arts.
        Elle est souvent citée comme l&apos;un des facteurs prédictifs de la réussite dans les domaines STEM.
      </p>

      <h2 style={s.h2}>4. La concentration et l&apos;état de flow</h2>

      <p style={s.p}>
        Les joueurs expérimentés connaissent bien ce phénomène : au bout de quelques minutes de jeu,
        le monde extérieur disparaît. On entre dans un état de <strong style={{ color: '#e2e8f0' }}>concentration
        profonde</strong>, appelé &quot;flow&quot; par le psychologue Mihaly Csikszentmihalyi. Cet état est
        caractérisé par une absorption totale dans la tâche et une suspension du sentiment du temps.
      </p>

      <p style={s.p}>
        Pour atteindre le flow, la tâche doit être ni trop facile (ennui) ni trop difficile (frustration),
        mais juste à la limite de vos capacités. C&apos;est précisément ce que permet un système de niveaux
        progressifs : chaque puzzle est un défi calibré qui vous maintient dans cette zone idéale.
      </p>

      <div style={s.highlight}>
        🧠 <strong>Le saviez-vous ?</strong> L&apos;état de flow libère de la dopamine, le neurotransmetteur
        du plaisir et de la motivation. C&apos;est pourquoi résoudre un nonogramme procure cette satisfation
        particulière à chaque puzzle complété.
      </div>

      <h2 style={s.h2}>5. La réduction du stress</h2>

      <p style={s.p}>
        Les puzzles de logique, en demandant une attention focalisée sur un problème concret et résolvable,
        ont un effet documenté de réduction du stress. Ils détournent l&apos;attention des préoccupations
        anxiogènes et occupent le &quot;bruit mental&quot; par une activité productive et satisfaisante.
      </p>

      <p style={s.p}>
        Contrairement au scrolling sur les réseaux sociaux, qui stimule sans jamais satisfaire vraiment,
        un nonogramme a un <strong style={{ color: '#e2e8f0' }}>début, un milieu et une fin</strong>.
        Cette structure narrative simple — problème, résolution, satisfaction — nourrit le sentiment de
        compétence et de maîtrise, deux piliers du bien-être psychologique.
      </p>

      <h2 style={s.h2}>Pour tous les âges</h2>

      <h3 style={s.h3}>Enfants (6-12 ans)</h3>
      <p style={s.p}>
        Les grilles 5×5 sont parfaites pour introduire la logique déductive. Elles renforcent la
        persévérance, l&apos;attention aux détails et la pensée structurée — des compétences transversales
        utiles à l&apos;école.
      </p>

      <h3 style={s.h3}>Adultes (20-50 ans)</h3>
      <p style={s.p}>
        Le nonogramme constitue un complément idéal à un travail intellectuellement intense. Il
        mobilise des circuits cognitifs différents de ceux sollicités par la lecture ou l&apos;écriture.
        C&apos;est aussi une pause &quot;active&quot; — plus ressourçante que les réseaux sociaux.
      </p>

      <h3 style={s.h3}>Seniors (60+ ans)</h3>
      <p style={s.p}>
        Les études sur la prévention du déclin cognitif soulignent l&apos;importance de &quot;utiliser son
        cerveau&quot; tout au long de la vie. Les puzzles qui combinent logique et visualisation spatiale
        sont particulièrement recommandés. Les grilles 5×5 et 10×10 offrent un défi adapté sans
        frustration excessive.
      </p>

      <Link href="/" style={s.cta}>
        Commencer votre entraînement cérébral aujourd&apos;hui →
      </Link>
    </article>
  );
}
