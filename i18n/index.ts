import type { Locale } from './config';
import { fr } from './translations/fr';
import { en } from './translations/en';
import { es } from './translations/es';
import { ja } from './translations/ja';

const translations = { fr, en, es, ja };

export function getTranslations(locale: Locale) {
  return translations[locale] ?? translations.fr;
}

export type { Translations } from './translations/fr';
