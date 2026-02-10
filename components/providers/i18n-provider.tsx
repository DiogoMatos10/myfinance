'use client';

import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  type Locale,
  type TranslationDictionary,
  translations,
} from '@/lib/i18n/translations';

export type Translator = (
  key: string,
  params?: Record<string, string | number>
) => string;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translator;
}

const DEFAULT_LOCALE: Locale = 'en';

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const getStoredLocale = (): Locale | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = window.localStorage.getItem('locale');
  if (stored === 'pt-PT' || stored === 'en') {
    return stored;
  }

  const browserLocale = window.navigator.language.toLowerCase();
  if (browserLocale.startsWith('pt')) {
    return 'pt-PT';
  }

  return null;
};

const resolveTranslation = (
  dictionary: TranslationDictionary,
  key: string
): string | undefined => {
  return key.split('.').reduce<unknown>((result, segment) => {
    if (typeof result !== 'object' || result === null) {
      return undefined;
    }
    return (result as Record<string, unknown>)[segment];
  }, dictionary) as string | undefined;
};

const interpolate = (
  value: string,
  params?: Record<string, string | number>
) => {
  if (!params) {
    return value;
  }

  return Object.entries(params).reduce((current, [key, param]) => {
    return current.replaceAll(`{${key}}`, String(param));
  }, value);
};

export function I18nProvider({ children }: PropsWithChildren) {
  const [locale, setLocale] = useState<Locale>(
    () => getStoredLocale() ?? DEFAULT_LOCALE
  );

  useEffect(() => {
    window.localStorage.setItem('locale', locale);
    document.documentElement.lang = locale === 'pt-PT' ? 'pt-PT' : 'en';
  }, [locale]);

  const t: Translator = useCallback(
    (key, params) => {
      const dictionary = translations[locale] as TranslationDictionary;
      const fallback = translations[DEFAULT_LOCALE] as TranslationDictionary;
      const value =
        resolveTranslation(dictionary, key) ??
        resolveTranslation(fallback, key) ??
        key;
      return interpolate(value, params);
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};
