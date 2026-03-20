export const locales = ['fr', 'en', 'es', 'ja'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'fr';

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  ja: '日本語',
};

export const localeFlags: Record<Locale, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
  es: '🇪🇸',
  ja: '🇯🇵',
};
