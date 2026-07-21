"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLang } from "@/lib/lang";

// Full-width video band; the tagline fades and scales in
// as the section scrolls through the viewport.
export function BornToWin() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.15, 0.4, 0.75, 0.95], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.15, 0.45], [0.85, 1]);
  const y = useTransform(scrollYProgress, [0.15, 0.45], [60, 0]);
  const letterSpace = useTransform(scrollYProgress, [0.2, 0.5], ["0.05em", "0.18em"]);

  return (
    <section ref={ref} className="relative w-full h-[70vh] md:h-screen overflow-hidden">
      <video
        src="/media/born-to-win.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
        <motion.p
          style={{ opacity, y }}
          className="text-xs md:text-sm uppercase tracking-[0.4em] text-white/70 mb-4"
        >
          {t("btw.team")}
        </motion.p>
        <motion.h2
          style={{ opacity, scale, y, letterSpacing: letterSpace }}
          className="text-4xl md:text-7xl xl:text-8xl font-black uppercase text-white"
        >
          {t("btw.title")}
        </motion.h2>
        <motion.div
          style={{ opacity, y }}
          className="mt-6 h-px w-40 md:w-64 bg-white/50"
        />
      </div>
    </section>
  );
}
