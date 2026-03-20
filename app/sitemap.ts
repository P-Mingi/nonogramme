import { MetadataRoute } from 'next';
import catalogData from '@/data/puzzles/index.json';

const BASE = 'https://nonogramme.com';
const LOCALES = ['en', 'es', 'ja'] as const;

function withAlternates(path: string) {
  return {
    languages: {
      fr: `${BASE}${path}`,
      ...Object.fromEntries(LOCALES.map(l => [l, `${BASE}/${l}${path}`])),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const puzzlePages = (catalogData.puzzles as { slug: string }[]).flatMap(p => [
    {
      url: `${BASE}/puzzle/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: withAlternates(`/puzzle/${p.slug}`),
    },
    ...LOCALES.map(locale => ({
      url: `${BASE}/${locale}/puzzle/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]);

  const blogSlugs = [
    'comment-jouer-nonogramme',
    'techniques-avancees-nonogramme',
    'nonogramme-vs-picross',
    'meilleurs-jeux-nonogramme-en-ligne',
    'nonogramme-bienfaits-cerveau',
    'logimage-en-ligne-gratuit',
    'picross-gratuit-en-ligne',
    'nonogramme-enfant',
    'creer-nonogramme',
    'nonogramme-imprimer',
    'histoire-nonogramme',
  ];

  const blogPages = blogSlugs.map(slug => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
      alternates: withAlternates(''),
    },
    ...LOCALES.map(locale => ({
      url: `${BASE}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    })),
    {
      url: `${BASE}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    },
    {
      url: `${BASE}/comment-jouer`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    ...blogPages,
    ...puzzlePages,
  ];
}
