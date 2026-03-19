import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { AuthButton } from '@/components/AuthButton';
import { Logo } from '@/components/ui/Logo';

export async function DeepSpaceLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let displayName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();
    displayName = profile?.username ?? null;
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#0d1528', color: '#e2e8f0' }}
    >
      <header style={{ borderBottom: '1px solid #2d3f5e', backgroundColor: '#0d1528' }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo variant="wordmark" theme="dark" size="sm" />
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link href="/comment-jouer" style={{ color: '#8892a4', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>
              Comment jouer
            </Link>
            <Link href="/blog" style={{ color: '#8892a4', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>
              Blog
            </Link>
            <Link href="/leaderboard" style={{ color: '#8892a4', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>
              Classement
            </Link>
            <AuthButton user={user} displayName={displayName} />
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  );
}
