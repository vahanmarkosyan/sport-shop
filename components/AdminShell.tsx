"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useLang } from "@/lib/lang";
import { LanguageSelector } from "@/components/LanguageSelector";

const TABS = [
  { href: "/admin/products", key: "admin.products" },
  { href: "/admin/collections", key: "admin.collections" },
  { href: "/admin/orders", key: "admin.orders" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLang();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 py-8">
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <Link href="/" className="flex items-center gap-3" title="DN8">
          <Image
            src="/media/logo.jpg"
            alt="DN8"
            width={40}
            height={40}
            className="invert rounded-full"
          />
          <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">
            {t("admin.title")}
          </h1>
        </Link>
        <nav className="flex gap-2 md:mx-6">
          {TABS.map((tab) => {
            const active = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-5 py-2.5 rounded-full border text-sm uppercase tracking-wider transition-colors ${
                  active
                    ? "bg-foreground text-background border-foreground font-semibold"
                    : "border-line text-foreground/75 hover:text-foreground hover:border-muted"
                }`}
              >
                {t(tab.key)}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3 ml-auto">
          <LanguageSelector />
          <button
            onClick={logout}
            className="px-4 py-2 rounded-full border border-line text-xs uppercase tracking-wider text-muted hover:text-foreground hover:border-muted transition-colors"
          >
            {t("admin.logout")}
          </button>
        </div>
      </div>
      {children}
    </main>
  );
}
