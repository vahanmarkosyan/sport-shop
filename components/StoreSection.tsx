"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLang } from "@/lib/lang";
import { MapPinIcon } from "@/components/Icons";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=DN8+Store+Baghramyan+Avenue+2+Yerevan";

export function StoreSection() {
  const { t } = useLang();
  return (
    <section className="border-t border-line bg-surface/50">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-16 grid gap-10 md:grid-cols-2 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] rounded-2xl overflow-hidden border border-line shadow-2xl shadow-black/50"
        >
          <Image
            src="/media/store.jpg"
            alt="DN8 store"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover hover:scale-105 transition-transform duration-700"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center flex flex-col items-center"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-muted mb-3">{t("store.visit")}</p>
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-6">
            {t("store.title")}
          </h2>
          <div className="flex items-start justify-center gap-3 text-foreground/85 mb-8">
            <MapPinIcon className="w-6 h-6 mt-0.5 shrink-0 text-muted" />
            <div className="text-left">
              <p className="text-lg">{t("store.address")}</p>
              <p className="text-muted">{t("store.addressAlt")}</p>
            </div>
          </div>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-foreground text-background text-sm font-semibold uppercase tracking-wider hover:scale-105 active:scale-95 transition-transform"
          >
            <MapPinIcon className="w-4 h-4" />
            {t("store.map")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
