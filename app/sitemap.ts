import { MetadataRoute } from 'next';
import catalogData from '@/data/puzzles/index.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const puzzlePages = (catalogData.puzzles as { slug: string }[]).map(p => ({
    url: `https://nonogramme.com/puzzle/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://nonogramme.com',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://nonogramme.com/leaderboard',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    },
    {
      url: 'https://nonogramme.com/comment-jouer',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    ...puzzlePages,
  ];
}
