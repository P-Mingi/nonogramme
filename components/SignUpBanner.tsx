'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getTranslations } from '@/i18n';
import type { Locale } from '@/i18n/config';

const GOOGLE_ICON = (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const DISCORD_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#5865F2" style={{ flexShrink: 0 }}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.053a19.906 19.906 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
  </svg>
);

async function signIn(provider: 'google' | 'discord') {
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
}

interface Props {
  completedCount: number;
  locale?: Locale;
}

const STORAGE_KEY = 'signup_banner_dismissed';
const SHOW_AFTER = 3;

export function SignUpBanner({ completedCount, locale = 'fr' }: Props) {
  const [visible, setVisible] = useState(false);
  const t = getTranslations(locale);

  useEffect(() => {
    if (completedCount < SHOW_AFTER) return;
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {}
  }, [completedCount]);

  function dismiss() {
    setVisible(false);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
  }

  if (!visible) return null;

  return (
    <div style={{
      backgroundColor: '#0f1e35',
      border: '1px solid #4ecdc4',
      borderRadius: '0.75rem',
      padding: '1.25rem',
      marginBottom: '1rem',
      position: 'relative',
    }}>
      <button
        onClick={dismiss}
        aria-label={t.home.close}
        style={{
          position: 'absolute', top: '0.75rem', right: '0.75rem',
          background: 'none', border: 'none', color: '#8892a4',
          fontSize: '1rem', cursor: 'pointer', lineHeight: 1,
        }}
      >
        ✕
      </button>

      <div style={{ marginBottom: '1rem', paddingRight: '1.5rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#e2e8f0', marginBottom: '0.3rem' }}>
          {t.home.completedLevels(completedCount)}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#8892a4', lineHeight: 1.4 }}>
          {t.home.saveProgress}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => signIn('google')}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            backgroundColor: '#1a2540', border: '1px solid #2d3f5e',
            color: '#e2e8f0', fontSize: '0.8rem', fontWeight: 600,
            padding: '0.4rem 0.8rem', borderRadius: '0.375rem', cursor: 'pointer',
          }}
        >
          {GOOGLE_ICON} {t.home.continueWithGoogle}
        </button>
        <button
          onClick={() => signIn('discord')}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            backgroundColor: '#1a2540', border: '1px solid #2d3f5e',
            color: '#e2e8f0', fontSize: '0.8rem', fontWeight: 600,
            padding: '0.4rem 0.8rem', borderRadius: '0.375rem', cursor: 'pointer',
          }}
        >
          {DISCORD_ICON} {t.home.continueWithDiscord}
        </button>
      </div>
    </div>
  );
}
