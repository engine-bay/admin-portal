import polyglotI18nProvider from 'ra-i18n-polyglot';
import { TranslationMessages, resolveBrowserLocale } from 'react-admin';
import { en, nl } from './translations';

const translations: Record<string, TranslationMessages> = { en, nl };

export const i18nProvider = polyglotI18nProvider(
    locale => translations[locale] ? translations[locale] : translations.en,
    resolveBrowserLocale(), // default locale
    [
        { locale: 'en', name: 'English' },
        { locale: 'nl', name: 'Dutch' }
    ],
);