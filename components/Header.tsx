"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_SLUGS } from "@/lib/i18n";
import { useLang } from "@/lib/lang";
import { useCart } from "@/lib/cart";
import {
  BagIcon,
  ChevronDownIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
} from "@/components/Icons";
import { SearchOverlay } from "@/components/SearchOverlay";
import { LanguageSelector } from "@/components/LanguageSelector";

type Dropdown = {
  title: string;
  href: string;
  items: { title: string; href: string }[];
};

function NavDropdown({ menu, soonLabel }: { menu: Dropdown; soonLabel: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={menu.href}
        className="flex items-center gap-1 px-3 py-2 text-sm uppercase tracking-wider text-foreground/80 hover:text-foreground transition-colors"
      >
        {menu.title}
        <ChevronDownIcon
          className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </Link>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, rotateX: -12 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: 8, rotateX: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{ transformPerspective: 800, transformOrigin: "top center" }}
            className="absolute left-0 top-full pt-2 z-50"
          >
            <div className="min-w-64 bg-surface border border-line rounded-xl shadow-2xl shadow-black/60 overflow-hidden py-2">
              {menu.items.length === 0 ? (
                <p className="px-5 py-3 text-sm text-muted">{soonLabel}</p>
              ) : (
                menu.items.map((item, i) => (
                  <motion.div
                    key={item.href + item.title}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * i, duration: 0.18 }}
                  >
                    <Link
                      href={item.href}
                      className="block px-5 py-2.5 text-sm text-foreground/75 hover:text-foreground hover:bg-surface-2 hover:pl-6 transition-all duration-200"
                    >
                      {item.title}
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header({
  customCollections = [],
}: {
  customCollections?: { title: string; href: string }[];
}) {
  const { count, openDrawer } = useCart();
  const { t, tc } = useLang();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const colItem = (slug: string) => ({
    title: tc(slug, slug),
    href: `/collections/${slug}`,
  });

  const clothingMenu: Dropdown = {
    title: t("nav.clothing"),
    href: "/collections/new-in",
    items: NAV_SLUGS.clothing.map(colItem),
  };
  const collectionsMenu: Dropdown = {
    title: t("nav.collections"),
    href: "/collections",
    items: customCollections,
  };
  const accessoriesMenu: Dropdown = {
    title: t("nav.accessories"),
    href: "/collections/caps",
    items: NAV_SLUGS.accessories.map(colItem),
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-lg border-b border-line pb-3 md:pb-4">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16 md:h-20">
            {/* Left: nav (desktop) / hamburger (mobile) */}
            <nav className="hidden lg:flex items-center -ml-3">
              <Link
                href="/collections/new-in"
                className="px-3 py-2 text-sm uppercase tracking-wider text-foreground/80 hover:text-foreground transition-colors"
              >
                {t("nav.newIn")}
              </Link>
              <NavDropdown menu={clothingMenu} soonLabel={t("nav.soon")} />
              <NavDropdown menu={collectionsMenu} soonLabel={t("nav.soon")} />
              <NavDropdown menu={accessoriesMenu} soonLabel={t("nav.soon")} />
              <Link
                href="/about"
                className="px-3 py-2 text-sm uppercase tracking-wider text-foreground/80 hover:text-foreground transition-colors"
              >
                {t("nav.about")}
              </Link>
            </nav>
            <button
              className="lg:hidden justify-self-start p-2 text-foreground/80 hover:text-foreground"
              onClick={() => setMobileOpen(true)}
              aria-label={t("nav.openMenu")}
            >
              <MenuIcon />
            </button>

            {/* Center: logo */}
            <Link href="/" className="justify-self-center group" aria-label="DN8">
              <motion.div whileHover={{ scale: 1.06, rotate: 2 }} whileTap={{ scale: 0.95 }}>
                <Image
                  src="/media/logo.jpg"
                  alt="DN8"
                  width={52}
                  height={52}
                  priority
                  className="invert rounded-full w-11 h-11 md:w-13 md:h-13 object-cover ring-1 ring-line group-hover:ring-muted transition-all"
                />
              </motion.div>
            </Link>

            {/* Right: language + search + basket */}
            <div className="flex items-center justify-self-end gap-1">
              <div className="hidden sm:block mr-2">
                <LanguageSelector />
              </div>
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-foreground/80 hover:text-foreground transition-colors"
                aria-label={t("ui.search")}
              >
                <SearchIcon />
              </button>
              <button
                onClick={openDrawer}
                className="relative p-2.5 text-foreground/80 hover:text-foreground transition-colors"
                aria-label={t("ui.cart")}
              >
                <BagIcon />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-foreground text-background text-[11px] font-bold flex items-center justify-center"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className="fixed left-0 top-0 bottom-0 z-50 w-80 max-w-[85vw] bg-surface border-r border-line p-6 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <Image src="/media/logo.jpg" alt="DN8" width={40} height={40} className="invert rounded-full" />
                <button onClick={() => setMobileOpen(false)} aria-label={t("nav.close")}>
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="mb-6">
                <LanguageSelector />
              </div>
              <nav className="flex flex-col gap-1" onClick={() => setMobileOpen(false)}>
                <Link href="/collections/new-in" className="py-2.5 text-sm uppercase tracking-wider">
                  {t("nav.newIn")}
                </Link>
                {[clothingMenu, collectionsMenu, accessoriesMenu].map((menu) => (
                  <div key={menu.title} className="py-2">
                    <p className="text-sm uppercase tracking-wider text-muted mb-2">{menu.title}</p>
                    <div className="flex flex-col border-l border-line">
                      {menu.items.length === 0 ? (
                        <span className="pl-4 py-1.5 text-sm text-muted">{t("nav.soon")}</span>
                      ) : (
                        menu.items.map((item) => (
                          <Link
                            key={item.href + item.title}
                            href={item.href}
                            className="pl-4 py-1.5 text-sm text-foreground/75 hover:text-foreground"
                          >
                            {item.title}
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                ))}
                <Link href="/about" className="py-2.5 text-sm uppercase tracking-wider">
                  {t("nav.about")}
                </Link>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
