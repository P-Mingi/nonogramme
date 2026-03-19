import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nonogramme ou Picross — quelle est la différence ? | Nonogramme.com',
  description: 'Nonogramme, picross, logimage, hanjie, griddler... Découvrez l\'origine et l\'histoire de ce jeu de logique japonais et pourquoi il porte autant de noms.',
  alternates: { canonical: 'https://nonogramme.com/blog/nonogramme-vs-picross' },
  openGraph: {
    title: 'Nonogramme vs Picross — histoire et différences',
    description: 'Tous les noms de ce puzzle de logique expliqués : origine japonaise, Nintendo Picross, logimage français.',
  },
};

const s = {
  h1: { fontSize: '2rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.5rem' } as React.CSSProperties,
  h2: { fontSize: '1.375rem', fontWeight: 700, color: '#4ecdc4', marginTop: '2.5rem', marginBottom: '1rem' } as React.CSSProperties,
  p: { color: '#c8d8e8', marginBottom: '1rem', lineHeight: 1.8 } as React.CSSProperties,
  em: { color: '#8892a4', fontSize: '0.9rem' } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
  } as React.CSSProperties,
  th: {
    backgroundColor: '#1a2540',
    color: '#4ecdc4',
    fontWeight: 700,
    padding: '0.625rem 1rem',
    textAlign: 'left' as const,
    border: '1px solid #2d3f5e',
  } as React.CSSProperties,
  td: {
    padding: '0.625rem 1rem',
    border: '1px solid #2d3f5e',
    color: '#c8d8e8',
    backgroundColor: '#0d1528',
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
      <p style={s.em}>Culture · 3 min de lecture</p>
      <h1 style={s.h1}>Nonogramme ou Picross — quelle est la différence ?</h1>
      <p style={{ ...s.p, color: '#8892a4' }}>Publié le 20 mars 2026</p>

      <p style={s.p}>
        Si vous avez cherché des puzzles de ce type en ligne, vous avez certainement rencontré de nombreux
        noms différents : nonogramme, picross, logimage, hanjie, griddler, paint by numbers, crucipixel...
        La bonne nouvelle : ce sont tous <strong style={{ color: '#e2e8f0' }}>exactement le même jeu</strong>.
        Les règles sont identiques, seul le nom change. Voici pourquoi.
      </p>

      <h2 style={s.h2}>L&apos;origine japonaise : les années 1980</h2>

      <p style={s.p}>
        Le jeu a été inventé indépendamment par deux Japonais dans les années 1980.
        <strong style={{ color: '#e2e8f0' }}> Non Ishida</strong>, graphiste à Tokyo, publie en 1987 des
        puzzles de ce type dans le magazine de mots croisés Window Art Puzzles. La même année,
        <strong style={{ color: '#e2e8f0' }}> Tetsuya Nishio</strong>, champion japonais de mots croisés,
        développe un concept similaire qu&apos;il appelle &quot;お絵かきロジック&quot; (oekaki logic, soit
        &quot;logique de dessin&quot;).
      </p>

      <p style={s.p}>
        Le terme <strong style={{ color: '#e2e8f0' }}>nonogramme</strong> (ou &quot;nonogram&quot; en anglais) a été
        créé par le mathématicien britannique <strong style={{ color: '#e2e8f0' }}>James Dalgety</strong> dans
        les années 1990, lorsque ces puzzles ont été introduits au Royaume-Uni via le magazine The Sunday Telegraph.
        Le préfixe &quot;nono-&quot; vient du nom &quot;Non Ishida&quot;. Le terme &quot;hanjie&quot; est aussi employé dans la presse
        britannique.
      </p>

      <h2 style={s.h2}>Nintendo Picross : la grande popularisation</h2>

      <p style={s.p}>
        Le grand saut vers la popularité mondiale vient de <strong style={{ color: '#e2e8f0' }}>Nintendo</strong>.
        En 1995, la firme japonaise publie <em>Mario&apos;s Picross</em> sur Game Boy, introduisant le terme
        &quot;Picross&quot; (contraction de &quot;Picture Crossword&quot; — mots croisés en images). La série Picross de
        Nintendo a depuis vendu des millions de copies sur toutes les consoles portables, de la Game Boy
        à la Nintendo Switch.
      </p>

      <p style={s.p}>
        Aujourd&apos;hui, Picross est souvent utilisé comme terme générique, surtout par les joueurs de jeux vidéo,
        bien qu&apos;il s&apos;agisse techniquement d&apos;une marque Nintendo.
      </p>

      <h2 style={s.h2}>En France : le logimage</h2>

      <p style={s.p}>
        En France, ces puzzles sont traditionnellement appelés <strong style={{ color: '#e2e8f0' }}>logimage</strong> —
        contraction de &quot;logique&quot; et &quot;image&quot;. Le terme est particulièrement utilisé dans les magazines de
        jeux et les livres de puzzles français. Vous trouverez aussi le terme &quot;coloriages mystères&quot; dans
        certaines publications destinées aux enfants.
      </p>

      <h2 style={s.h2}>Tableau récapitulatif des noms</h2>

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Nom</th>
            <th style={s.th}>Pays / Contexte</th>
            <th style={s.th}>Origine</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Nonogramme / Nonogram', 'International', 'Du nom de Non Ishida, mathématicien britannique Dalgety'],
            ['Picross', 'Jeux vidéo, Nintendo', 'Contraction de "Picture Crossword" (Nintendo, 1995)'],
            ['Logimage', 'France', 'Contraction de "logique" + "image"'],
            ['Hanjie', 'Royaume-Uni', 'Presse britannique (Sunday Telegraph)'],
            ['Griddler / Griddlers', 'International', 'Site Griddlers.net, version multi-couleurs'],
            ['Paint by numbers', 'USA', 'Analogie avec les coloriages numérotés'],
            ['Oekaki / Oekaki Logic', 'Japon', 'Terme original japonais (お絵かきロジック)'],
            ['Crucipixel', 'Italie', 'Terme utilisé dans la presse italienne'],
          ].map(([nom, pays, origine]) => (
            <tr key={nom}>
              <td style={{ ...s.td, fontWeight: 600, color: '#e2e8f0' }}>{nom}</td>
              <td style={s.td}>{pays}</td>
              <td style={{ ...s.td, fontSize: '0.8rem' }}>{origine}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={s.h2}>Y a-t-il vraiment aucune différence ?</h2>

      <p style={s.p}>
        Presque. La grande majorité de ces jeux utilisent des grilles noir et blanc avec des indices
        numériques — c&apos;est ce que vous trouverez sur Nonogramme.com. Il existe cependant des variantes :
        les <strong style={{ color: '#e2e8f0' }}>griddlers en couleur</strong> utilisent plusieurs couleurs,
        avec des indices colorés. Les <strong style={{ color: '#e2e8f0' }}>Picross 3D</strong> de Nintendo
        étendent le concept à trois dimensions. Mais le jeu classique en noir et blanc reste le plus
        répandu et le plus apprécié.
      </p>

      <p style={s.p}>
        Sur Nonogramme.com, chaque puzzle révèle un dessin pixel art coloré une fois terminé, mais les
        règles restent celles du nonogramme classique : indices de lignes et de colonnes, cases noires
        et blanches.
      </p>

      <Link href="/" style={s.cta}>
        Jouer au nonogramme français →
      </Link>
    </article>
  );
}
