import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendPushNotification } from '@/lib/webpush';
import { getDailyPuzzle } from '@/lib/puzzles';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];
  const puzzle = await getDailyPuzzle();

  // Find users with push subscriptions who haven't completed today's puzzle
  const { data: completedUserIds } = await supabase
    .from('completions')
    .select('user_id')
    .eq('puzzle_slug', puzzle.slug)
    .gte('completed_at', `${today}T00:00:00Z`);

  const doneIds = new Set((completedUserIds ?? []).map((r: { user_id: string }) => r.user_id));

  const { data: subscriptions } = await supabase
    .from('push_subscriptions')
    .select('user_id, endpoint, p256dh, auth');

  if (!subscriptions?.length) return NextResponse.json({ sent: 0 });

  const pending = subscriptions.filter((s: { user_id: string }) => !doneIds.has(s.user_id));

  const results = await Promise.allSettled(
    pending.map((sub: { endpoint: string; p256dh: string; auth: string }) =>
      sendPushNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        {
          title: 'Nonogramme du jour 🧩',
          body: 'Votre puzzle quotidien vous attend - maintenez votre série !',
          url: '/',
        }
      ).catch(async (err: { statusCode?: number }) => {
        // Remove invalid subscriptions (410 Gone)
        if (err.statusCode === 410) {
          await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
        }
        throw err;
      })
    )
  );

  const sent = results.filter(r => r.status === 'fulfilled').length;
  return NextResponse.json({ sent, total: pending.length });
}
