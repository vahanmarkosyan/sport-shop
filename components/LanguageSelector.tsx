"use client";

import { LOCALES } from "@/lib/i18n";
import { useLang } from "@/lib/lang";

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLang();

  return (
    <div
      className={`flex items-center rounded-full border border-line overflow-hidden ${
        compact ? "text-[10px]" : "text-[11px]"
      }`}
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          className={`px-2.5 py-1.5 font-semibold tracking-wider transition-colors ${
            locale === l.code
              ? "bg-foreground text-background"
              : "text-muted hover:text-foreground"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
