"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/lang";

export default function AboutPage() {
  const { t } = useLang();

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-14 md:py-20">
      <div className="text-center mb-12">
        <Image
          src="/media/logo.jpg"
          alt="DN8"
          width={96}
          height={96}
          className="invert rounded-full mx-auto mb-6"
        />
        <p className="text-xs uppercase tracking-[0.35em] text-muted mb-3">{t("hero.est")}</p>
        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight">
          {t("about.title")}
        </h1>
      </div>

      <div className="space-y-6 text-lg leading-relaxed text-foreground/80">
        <p>{t("about.p1")}</p>
        <p>{t("about.p2")}</p>
        <p>{t("about.p3")}</p>
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/collections/new-in"
          className="inline-block px-8 py-3.5 rounded-full bg-foreground text-background text-sm font-semibold uppercase tracking-wider hover:scale-105 active:scale-95 transition-transform"
        >
          {t("about.cta")}
        </Link>
      </div>
    </main>
  );
}
