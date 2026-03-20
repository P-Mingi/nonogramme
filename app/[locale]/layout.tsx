import type { Locale } from '@/i18n/config';

// Only generate static params for non-French locales
// French is served at root (/) without locale prefix
export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
    { locale: 'ja' },
  ];
}

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  // Root layout (app/layout.tsx) handles html/body/DeepSpaceLayout
  // The x-locale header (set by proxy.ts) controls the locale in DeepSpaceLayout
  return <>{children}</>;
}
