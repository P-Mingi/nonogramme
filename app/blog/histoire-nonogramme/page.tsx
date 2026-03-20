import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Histoire du nonogramme — origine du picross | Nonogramme.com',
  description: 'L\'histoire complète du nonogramme : inventé simultanément au Japon et en Israël, popularisé par Nintendo, devenu un classique mondial.',
  alternates: { canonical: 'https://nonogramme.com/blog/histoire-nonogramme' },
  openGraph: {
    title: 'Histoire du nonogramme — origine et évolution',
    description: 'Du Japon à Nintendo en passant par les magazines français, l\'histoire fascinante du nonogramme.',
  },
};

const s = {
  h1: { fontSize: '2rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.5rem' } as React.CSSProperties,
  h2: { fontSize: '1.375rem', fontWeight: 700, color: '#4ecdc4', marginTop: '2.5rem', marginBottom: '1rem' } as React.CSSProperties,
  h3: { fontSize: '1.125rem', fontWeight: 700, color: '#e2e8f0', marginTop: '1.75rem', marginBottom: '0.5rem' } as React.CSSProperties,
  p: { color: '#c8d8e8', marginBottom: '1rem', lineHeight: 1.8 } as React.CSSProperties,
  em: { color: '#8892a4', fontSize: '0.9rem' } as React.CSSProperties,
  timeline: {
    borderLeft: '2px solid #2d3f5e',
    paddingLeft: '1.5rem',
    marginBottom: '2rem',
  } as React.CSSProperties,
  timelineItem: {
    position: 'relative' as const,
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  timelineDot: {
    position: 'absolute' as const,
    left: '-1.875rem',
    top: '0.375rem',
    width: 10, height: 10,
    borderRadius: '50%',
    backgroundColor: '#4ecdc4',
  } as React.CSSProperties,
  year: { color: '#4ecdc4', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' } as React.CSSProperties,
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
      <p style={s.em}>Histoire · 6 min de lecture</p>
      <h1 style={s.h1}>Histoire du nonogramme — l&apos;origine du picross</h1>
      <p style={{ ...s.p, color: '#8892a4' }}>Publié le 20 mars 2026</p>

      <p style={s.p}>
        Le nonogramme est l&apos;un des rares jeux de puzzle à avoir été inventé de façon totalement
        indépendante par deux personnes sur deux continents différents, à quelques années d&apos;intervalle.
        Son histoire mêle Tokyo, Tel Aviv, Nintendo et les magazines français des années 1990 — une
        trajectoire fascinante pour un jeu en apparence si simple.
      </p>

      <h2 style={s.h2}>Les origines : une invention parallèle</h2>

      <h3 style={s.h3}>Non Ishida — Tokyo, 1987</h3>
      <p style={s.p}>
        En 1987, <strong style={{ color: '#e2e8f0' }}>Non Ishida</strong>, artiste graphique japonaise,
        découvre dans les panneaux de néons de Tokyo une inspiration inattendue. Elle remarque que
        les néons — qui s&apos;allument et s&apos;éteignent en séquences — forment des images
        reconnaissables à partir de simples grilles de carrés lumineux.
      </p>

      <p style={s.p}>
        Elle développe un système de puzzles basé sur ce principe et remporte en 1988 le
        <em> concours de puzzles du magazine Window Art Puzzles</em>. Son jeu est publié
        au Japon sous le nom <strong style={{ color: '#e2e8f0' }}>お絵かきロジック</strong>
        (oekaki logic — &quot;logique dessin&quot;).
      </p>

      <h3 style={s.h3}>Tetsuya Nishio — Tokyo, 1988</h3>
      <p style={s.p}>
        La même année, <strong style={{ color: '#e2e8f0' }}>Tetsuya Nishio</strong>, architecte de
        formation, publie indépendamment un système de puzzle identique dans le magazine japonais
        <em> Nikoli</em> (célèbre pour avoir popularisé le sudoku). Les deux inventeurs se disputeront
        longtemps la paternité du jeu — la question reste débattue aujourd&apos;hui.
      </p>

      <h2 style={s.h2}>Chronologie</h2>

      <div style={s.timeline}>
        {[
          { year: '1987', text: 'Non Ishida crée les premiers puzzles &quot;néon&quot; à Tokyo.' },
          { year: '1988', text: 'Tetsuya Nishio publie ses puzzles dans Nikoli. Le format se standardise au Japon.' },
          { year: '1990', text: 'Publication en Angleterre dans le Sunday Telegraph sous le nom &quot;Nonogram&quot; (contraction de Non Ishida + Diagram).' },
          { year: '1993', text: 'Apparition en France dans les magazines de puzzles sous le nom &quot;logimage&quot; (contraction de &quot;logique&quot; + &quot;image&quot;).' },
          { year: '1995', text: 'Nintendo publie Mario\'s Picross sur Game Boy — premier jeu vidéo nonogramme commercial. Le terme &quot;picross&quot; (picture + cross) entre dans le vocabulaire mondial.' },
          { year: '1999', text: 'Picross NP sur Super Famicom (SNES), premier picross en couleurs à grande diffusion.' },
          { year: '2007', text: 'Picross DS sur Nintendo DS — le jeu le plus vendu de la série, avec plus de 150 puzzles intégrés et une fonctionnalité de création.' },
          { year: '2013', text: 'Picross e sur Nintendo 3DS — début d\'une longue série de DLC et extensions. Plus de 10 volumes sortiront jusqu\'en 2018.' },
          { year: '2017', text: 'Picross S sur Nintendo Switch — la série continue sur la nouvelle console avec des grilles jusqu\'à 20×15.' },
          { year: '2024', text: 'Le nonogramme est l\'un des puzzles logiques les plus joués en ligne, avec des dizaines de millions de joueurs actifs.' },
        ].map(({ year, text }) => (
          <div key={year} style={s.timelineItem}>
            <div style={s.timelineDot} />
            <div style={s.year}>{year}</div>
            <p style={{ ...s.p, marginBottom: 0 }} dangerouslySetInnerHTML={{ __html: text }} />
          </div>
        ))}
      </div>

      <h2 style={s.h2}>L&apos;étymologie des noms</h2>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Nonogramme</strong> : contraction de &quot;Non Ishida&quot;
        (l&apos;inventrice) et &quot;diagramme&quot;. C&apos;est le terme utilisé dans le Sunday Telegraph
        en 1990 par James Dalgety, le premier éditeur occidental du puzzle.
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Picross</strong> : contraction de &quot;picture&quot;
        (image) et &quot;cross&quot; (croisé). Inventé par Nintendo pour nommer son adaptation du jeu
        sur console.
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Logimage</strong> : terme français créé par les éditeurs
        de magazines de puzzles des années 1990, contraction de &quot;logique&quot; et &quot;image&quot;.
        Utilisé principalement en France et en Belgique.
      </p>

      <p style={s.p}>
        <strong style={{ color: '#e2e8f0' }}>Hanjie</strong> : terme anglais utilisé par les journaux
        britanniques (notamment The Guardian), d&apos;origine japonaise — 判じ絵 signifie &quot;image
        à deviner&quot;.
      </p>

      <h2 style={s.h2}>L&apos;ère numérique</h2>

      <p style={s.p}>
        L&apos;essor d&apos;internet dans les années 2000 a libéré le nonogramme des contraintes
        du papier et du jeu vidéo commercial. Des milliers de créateurs amateurs ont publié leurs
        propres puzzles en ligne — certains sites en proposent aujourd&apos;hui plus de 100 000.
      </p>

      <p style={s.p}>
        Les applications mobiles ont ensuite rendu le picross accessible à des audiences encore plus
        larges. Picross Touch, Nonogram.com, et des dizaines d&apos;autres jeux ont introduit le puzzle
        à une nouvelle génération — souvent sans qu&apos;ils connaissent l&apos;histoire derrière ce
        simple jeu de cases noires et blanches.
      </p>

      <p style={s.p}>
        Aujourd&apos;hui, le nonogramme est reconnu comme un puzzle de logique &quot;classique&quot;
        au même titre que le sudoku ou les mots croisés — un statut que peu auraient prédit pour
        un jeu inventé dans les années 1980 par deux personnes qui ne se connaissaient pas.
      </p>

      <Link href="/" style={s.cta}>
        Jouer au nonogramme maintenant →
      </Link>
    </article>
  );
}
