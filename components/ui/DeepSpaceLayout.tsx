import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { AuthButton } from '@/components/AuthButton';
import { Logo } from '@/components/ui/Logo';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { getTranslations } from '@/i18n';
import type { Locale } from '@/i18n/config';

interface Props {
  children: React.ReactNode;
  locale?: Locale;
}

export async function DeepSpaceLayout({ children, locale = 'fr' }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const t = getTranslations(locale);

  let displayName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();
    displayName = profile?.username ?? null;
  }

  // Build locale-aware paths
  const prefix = locale === 'fr' ? '' : `/${locale}`;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#0d1528', color: '#e2e8f0' }}
    >
      <header style={{ borderBottom: '1px solid #2d3f5e', backgroundColor: '#0d1528' }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`${prefix}/`}>
            <Logo variant="wordmark" theme="dark" size="sm" />
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href={`${prefix}/comment-jouer`} style={{ color: '#8892a4', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>
              {t.nav.howToPlay}
            </Link>
            <Link href={`${prefix}/blog`} style={{ color: '#8892a4', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>
              {t.nav.blog}
            </Link>
            <Link href={`${prefix}/leaderboard`} style={{ color: '#8892a4', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>
              {t.nav.leaderboard}
            </Link>
            <Link href={`${prefix}/communaute`} style={{ color: '#8892a4', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>
              Communauté
            </Link>
            {user && (
              <Link href="/create" style={{ color: '#4ecdc4', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 700 }}>
                ✏️ Créer
              </Link>
            )}
            <AuthButton user={user} displayName={displayName} />
            <LanguageSwitcher currentLocale={locale} />
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  );
}
