'use client';
import { usePathname, useRouter } from 'next/navigation';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';
import { Analytics } from '@/lib/analytics';
import { useState } from 'react';

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(locale: Locale) {
    setOpen(false);
    Analytics.languageSwitched(currentLocale, locale);

    // Remove current locale prefix if present
    const segments = pathname.split('/');
    const hasLocale = (locales as readonly string[]).includes(segments[1]);
    const pathWithoutLocale = hasLocale ? '/' + segments.slice(2).join('/') : pathname;

    const newPath = locale === 'fr'
      ? pathWithoutLocale || '/'
      : `/${locale}${pathWithoutLocale || '/'}`;

    router.push(newPath);
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'transparent',
          border: '1px solid #2d3f5e',
          borderRadius: '8px',
          padding: '5px 9px',
          color: '#8892a4',
          fontSize: '0.8rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        {localeFlags[currentLocale]} <span style={{ fontSize: '9px' }}>▾</span>
      </button>

      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 40 }}
            onClick={() => setOpen(false)}
          />
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '4px',
            background: '#0d1528',
            border: '1px solid #2d3f5e',
            borderRadius: '10px',
            padding: '4px',
            zIndex: 50,
            minWidth: '150px',
          }}>
            {locales.map(locale => (
              <button
                key={locale}
                onClick={() => switchLocale(locale)}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  background: locale === currentLocale ? 'rgba(78,205,196,0.1)' : 'transparent',
                  border: 'none',
                  borderRadius: '7px',
                  color: locale === currentLocale ? '#4ecdc4' : '#c8d8e8',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {localeFlags[locale]} {localeNames[locale]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
