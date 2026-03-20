import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { CommunauteClient } from '@/components/CommunauteClient';

export const metadata: Metadata = {
  title: 'Puzzles communautaires - Nonogramme.com',
  description: 'Jouez aux nonogrammes créés par la communauté. Des centaines de puzzles originaux à découvrir, classés par popularité, catégorie et difficulté.',
  alternates: { canonical: 'https://nonogramme.com/communaute' },
};

export const revalidate = 60;

export interface CommunityPuzzle {
  slug: string;
  name: string;
  category: string;
  size: number;
  difficulty: string;
  color: string | null;
  play_count: number;
  created_at: string;
  creator_username: string | null;
}

export default async function CommunautePage() {
  const supabase = await createClient();

  const { data: puzzles } = await supabase
    .from('puzzles')
    .select('slug, name, category, size, difficulty, color, play_count, created_at, profiles!created_by(username)')
    .eq('is_community', true)
    .eq('status', 'approved')
    .order('play_count', { ascending: false })
    .limit(200);

  const normalized: CommunityPuzzle[] = (puzzles ?? []).map((p: {
    slug: string;
    name: string;
    category: string;
    size: number;
    difficulty: string;
    color: string | null;
    play_count: number;
    created_at: string;
    profiles: { username: string } | { username: string }[] | null;
  }) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    size: p.size,
    difficulty: p.difficulty,
    color: p.color,
    play_count: p.play_count ?? 0,
    created_at: p.created_at,
    creator_username: Array.isArray(p.profiles)
      ? (p.profiles[0]?.username ?? null)
      : (p.profiles?.username ?? null),
  }));

  return <CommunauteClient puzzles={normalized} />;
}
