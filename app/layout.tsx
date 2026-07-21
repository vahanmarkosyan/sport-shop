import type { Metadata } from "next";
import { Geist, Noto_Sans_Armenian } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "@/lib/lang";
import { DEFAULT_LOCALE, LOCALE_COOKIE } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const notoArmenian = Noto_Sans_Armenian({
  variable: "--font-noto-armenian",
  subsets: ["armenian", "latin"],
});

// Catalog and collections are managed from the admin panel in MongoDB,
// so every page must render with fresh data.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "DN8 — Հայկական պրեմիում հագուստի բրենդ",
  description:
    "DN8 — հայկական հագուստի բրենդ։ Շապիկներ, հուդիներ, սպորտային հանդերձանք և աքսեսուարներ։ Երևան, Բաղրամյան պողոտա 2։",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const store = await cookies();
  const locale = store.get(LOCALE_COOKIE)?.value ?? DEFAULT_LOCALE;

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${notoArmenian.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider initial={locale}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
