/**
 * OpenGravity — i18n context.
 *
 * Sistema ligero sin dependencias externas:
 *   - 5 idiomas: es, en, pt, fr, it
 *   - Detección automática desde navigator.language
 *   - Persistencia en localStorage
 *   - Cambio en runtime sin reload
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { es, type Dictionary } from './locales/es';
import { en } from './locales/en';
import { pt } from './locales/pt';
import { fr } from './locales/fr';
import { it } from './locales/it';

export type Locale = 'es' | 'en' | 'pt' | 'fr' | 'it';

export const LOCALES: { code: Locale; label: string; flag: string; native: string }[] = [
  { code: 'es', label: 'Español', flag: '🇪🇸', native: 'Español' },
  { code: 'en', label: 'English', flag: '🇬🇧', native: 'English' },
  { code: 'pt', label: 'Português', flag: '🇧🇷', native: 'Português' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', native: 'Français' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹', native: 'Italiano' },
];

const DICTS: Record<Locale, Dictionary> = { es, en, pt, fr, it };

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'og_locale';

function detectInitialLocale(): Locale {
  // 1. localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && DICTS[saved]) return saved;
  }

  // 2. navigator.language
  if (typeof navigator !== 'undefined') {
    const nav = navigator.language.toLowerCase();
    if (nav.startsWith('es')) return 'es';
    if (nav.startsWith('pt')) return 'pt';
    if (nav.startsWith('fr')) return 'fr';
    if (nav.startsWith('it')) return 'it';
    if (nav.startsWith('en')) return 'en';
  }

  // 3. default
  return 'es';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // SSR-safe: empezar en 'es' (default) y migrar a detectado en useEffect
  const [locale, setLocaleState] = useState<Locale>('es');

  useEffect(() => {
    const detected = detectInitialLocale();
    setLocaleState(detected);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, l);
      // Actualizar lang del <html> para accessibility
      document.documentElement.lang = l;
    }
  }, []);

  // Actualizar lang en mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const value: I18nContextValue = {
    locale,
    setLocale,
    t: DICTS[locale],
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Fallback para componentes que se renderizan fuera del provider
    return { locale: 'es', setLocale: () => {}, t: es };
  }
  return ctx;
}
