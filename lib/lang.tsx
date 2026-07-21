"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  collectionTitle,
  isLocale,
  t,
  type Locale,
} from "@/lib/i18n";

type LangContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  tc: (slug: string, fallback: string) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({
  initial,
  children,
}: {
  initial: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(
    isLocale(initial) ? initial : DEFAULT_LOCALE
  );

  const setLocale = useCallback(
    (l: Locale) => {
      document.cookie = `${LOCALE_COOKIE}=${l};path=/;max-age=31536000;samesite=lax`;
      setLocaleState(l);
      // re-render server components with the new cookie
      router.refresh();
    },
    [router]
  );

  const value = useMemo<LangContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, vars) => t(locale, key, vars),
      tc: (slug, fallback) => collectionTitle(locale, slug, fallback),
    }),
    [locale, setLocale]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
