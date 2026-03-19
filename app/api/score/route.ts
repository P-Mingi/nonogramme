import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateXP, getLevelFromXP } from '@/lib/utils/xp';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();
  const { puzzle_slug, puzzle_name, time_seconds, errors, hints_used, score, is_daily } = body;

  // Save completion (upsert — one entry per puzzle per user)
  const { error: completionError } = await supabase.from('completions').upsert({
    user_id: user.id,
    puzzle_slug,
    puzzle_name,
    time_seconds,
    errors,
    hints_used,
    score,
    is_daily,
    completed_at: new Date().toISOString(),
  }, { onConflict: 'user_id,puzzle_slug' });

  if (completionError) {
    return NextResponse.json({ error: completionError.message }, { status: 500 });
  }

  // Fetch current profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, streak_current, streak_best, streak_last_date, puzzles_completed')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const xpEarned = calculateXP(score, is_daily, false);
  const newXP = profile.xp + xpEarned;
  const newLevel = getLevelFromXP(newXP);

  // Streak logic
  const today = new Date().toISOString().split('T')[0];
  const lastDate = profile.streak_last_date;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let newStreak = profile.streak_current;
  if (lastDate === today) {
    // Already played today — no streak change
  } else if (lastDate === yesterday) {
    newStreak = profile.streak_current + 1;
  } else {
    newStreak = 1;
  }
  const newStreakBest = Math.max(profile.streak_best, newStreak);

  await supabase.from('profiles').update({
    xp: newXP,
    level: newLevel.level,
    streak_current: newStreak,
    streak_best: newStreakBest,
    streak_last_date: today,
    puzzles_completed: profile.puzzles_completed + 1,
  }).eq('id', user.id);

  return NextResponse.json({ xp_earned: xpEarned, new_xp: newXP, new_level: newLevel, streak: newStreak });
}
