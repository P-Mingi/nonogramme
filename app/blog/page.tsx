import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog Nonogramme — Guides, tutoriels et astuces | Nonogramme.com',
  description: 'Guides, tutoriels et astuces pour maîtriser les nonogrammes et picross. Apprenez les règles, les techniques avancées et les bienfaits de ce jeu de logique.',
  alternates: { canonical: 'https://nonogramme.com/blog' },
};

const ARTICLES = [
  {
    slug: 'comment-jouer-nonogramme',
    title: 'Comment jouer au nonogramme — guide complet pour débutants',
    description: 'Apprenez les règles du nonogramme en 5 minutes avec des exemples illustrés.',
    date: '2026-03-20',
    readTime: '5 min',
    category: 'Guide',
  },
  {
    slug: 'techniques-avancees-nonogramme',
    title: 'Techniques avancées pour résoudre les nonogrammes difficiles',
    description: 'Les méthodes des experts : chevauchement, forçage, élimination et déduction.',
    date: '2026-03-20',
    readTime: '8 min',
    category: 'Stratégie',
  },
  {
    slug: 'nonogramme-vs-picross',
    title: 'Nonogramme ou Picross — quelle est la différence ?',
    description: 'Logimage, hanjie, griddler, picross... tous les noms de ce jeu expliqués.',
    date: '2026-03-20',
    readTime: '3 min',
    category: 'Culture',
  },
  {
    slug: 'meilleurs-jeux-nonogramme-en-ligne',
    title: 'Les meilleurs jeux de nonogramme en ligne gratuits (2026)',
    description: 'Comparatif des meilleures plateformes pour jouer au nonogramme gratuitement.',
    date: '2026-03-20',
    readTime: '6 min',
    category: 'Comparatif',
  },
  {
    slug: 'nonogramme-bienfaits-cerveau',
    title: 'Les bienfaits du nonogramme pour le cerveau',
    description: 'Mémoire, concentration, logique — pourquoi les puzzles sont bons pour la santé mentale.',
    date: '2026-03-20',
    readTime: '4 min',
    category: 'Santé',
  },
  {
    slug: 'logimage-en-ligne-gratuit',
    title: 'Logimage en ligne gratuit — jouez maintenant',
    description: 'Tout sur le logimage : règles, techniques et où jouer gratuitement en ligne.',
    date: '2026-03-20',
    readTime: '5 min',
    category: 'Guide',
  },
  {
    slug: 'picross-gratuit-en-ligne',
    title: 'Picross gratuit en ligne — le guide complet',
    description: 'Histoire du picross, différences avec le nonogramme, et où jouer sans payer.',
    date: '2026-03-20',
    readTime: '4 min',
    category: 'Guide',
  },
  {
    slug: 'nonogramme-enfant',
    title: 'Nonogramme enfant — puzzles logiques dès 6 ans',
    description: 'Grilles adaptées par tranche d\'âge et conseils pour jouer en famille.',
    date: '2026-03-20',
    readTime: '5 min',
    category: 'Éducation',
  },
  {
    slug: 'creer-nonogramme',
    title: 'Comment créer un nonogramme',
    description: 'Guide étape par étape pour concevoir votre propre puzzle avec une solution unique.',
    date: '2026-03-20',
    readTime: '6 min',
    category: 'Création',
  },
  {
    slug: 'nonogramme-imprimer',
    title: 'Nonogramme à imprimer — grilles gratuites',
    description: 'Comment imprimer des nonogrammes pour jouer sans écran, à l\'école ou en voyage.',
    date: '2026-03-20',
    readTime: '4 min',
    category: 'Ressources',
  },
  {
    slug: 'histoire-nonogramme',
    title: 'Histoire du nonogramme — l\'origine du picross',
    description: 'De Tokyo à Nintendo en passant par la France : l\'histoire complète du nonogramme.',
    date: '2026-03-20',
    readTime: '6 min',
    category: 'Culture',
  },
];

export default function BlogPage() {
  return (
    <>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#e2e8f0' }}>
        Blog Nonogramme
      </h1>
      <p style={{ color: '#8892a4', marginBottom: '3rem' }}>
        Guides, tutoriels et astuces pour maîtriser les puzzles de logique
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {ARTICLES.map(article => (
          <Link key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#1a2540',
              border: '1px solid #2d3f5e',
              borderRadius: '1rem',
              padding: '1.5rem',
            }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <span style={{
                  backgroundColor: 'rgba(78,205,196,0.1)',
                  color: '#4ecdc4',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {article.category}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#3d6080' }}>{article.readTime} de lecture</span>
              </div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#e2e8f0', margin: '0 0 0.5rem' }}>
                {article.title}
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#8892a4', margin: 0 }}>
                {article.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
