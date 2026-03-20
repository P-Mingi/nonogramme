import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import { LeaderboardClient } from '@/components/LeaderboardClient';

export const metadata: Metadata = {
  title: 'Classement - Nonogramme.com',
  description: 'Classement en direct des meilleurs joueurs de nonogramme. Qui résout le plus de puzzles cette semaine ?',
  alternates: { canonical: 'https://nonogramme.com/leaderboard' },
};

export const revalidate = 60;

export default async function LeaderboardPage() {
  const supabase = await createClient();

  const [{ data: global }, { data: weekly }, { data: { user } }] = await Promise.all([
    supabase.from('leaderboard_global').select('*').order('rank').limit(50),
    supabase.from('leaderboard_weekly').select('*').order('rank').limit(50),
    supabase.auth.getUser(),
  ]);

  return (
    <LeaderboardClient
      initialGlobal={global ?? []}
      initialWeekly={weekly ?? []}
      currentUserId={user?.id}
    />
  );
}
