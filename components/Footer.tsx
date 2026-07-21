"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/lang";

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t border-line bg-surface mt-auto">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <Image
            src="/media/logo.jpg"
            alt="DN8"
            width={56}
            height={56}
            className="invert rounded-full mb-4"
          />
          <p className="text-sm text-muted max-w-xs leading-relaxed">{t("footer.desc")}</p>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-widest text-muted mb-4">{t("footer.shop")}</h3>
          <nav className="flex flex-col gap-2 text-sm">
            <Link href="/collections/new-in" className="text-foreground/75 hover:text-foreground transition-colors">
              {t("nav.newIn")}
            </Link>
            <Link href="/collections/t-shirts" className="text-foreground/75 hover:text-foreground transition-colors">
              {t("nav.clothing")}
            </Link>
            <Link href="/collections/caps" className="text-foreground/75 hover:text-foreground transition-colors">
              {t("nav.accessories")}
            </Link>
            <Link href="/about" className="text-foreground/75 hover:text-foreground transition-colors">
              {t("nav.about")}
            </Link>
          </nav>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-widest text-muted mb-4">
            {t("footer.storeAddress")}
          </h3>
          <p className="text-sm text-foreground/75 leading-relaxed">
            {t("store.address")}
            <br />
            {t("store.addressAlt")}
          </p>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
          <p>© {new Date().getFullYear()} DN8 Team. {t("footer.rights")}</p>
          <p className="uppercase tracking-widest">#MENQDN8</p>
        </div>
      </div>
    </footer>
  );
}
