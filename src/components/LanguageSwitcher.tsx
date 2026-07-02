'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useI18n, LOCALES, type Locale } from '@/i18n';

/**
 * Language switcher — dropdown con los 5 idiomas soportados.
 * Persiste la elección en localStorage y actualiza <html lang>.
 */
export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LOCALES.find(l => l.code === locale) ?? LOCALES[0];

  // Cerrar al click fuera
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Cambiar idioma"
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                    ${open ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
      >
        <Globe size={compact ? 16 : 14} />
        {!compact && <span className="font-medium uppercase tracking-wider text-xs">{current.code}</span>}
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Selecciona idioma"
          className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-[#0a0a0f] border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden z-50"
        >
          {LOCALES.map(l => (
            <button
              key={l.code}
              onClick={() => {
                setLocale(l.code as Locale);
                setOpen(false);
              }}
              role="option"
              aria-selected={l.code === locale}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                          ${l.code === locale ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-300 hover:bg-white/5'}`}
            >
              <span className="text-base">{l.flag}</span>
              <span className="flex-1 text-left">{l.native}</span>
              {l.code === locale && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
