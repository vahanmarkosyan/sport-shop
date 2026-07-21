"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useLang } from "@/lib/lang";

function useTilt(strength: number) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 120, damping: 18 });
  const sy = useSpring(y, { stiffness: 120, damping: 18 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-strength, strength]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [strength, -strength]);
  return { x, y, rotateX, rotateY };
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const left = useTilt(9);
  const middle = useTilt(6);
  const right = useTilt(9);

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    for (const tilt of [left, middle, right]) {
      tilt.x.set(px);
      tilt.y.set(py);
    }
  };

  const onMouseLeave = () => {
    for (const tilt of [left, middle, right]) {
      tilt.x.set(0);
      tilt.y.set(0);
    }
  };

  // Entrance animations move panels but never hide them (no opacity),
  // so the hero stays visible even if animations fail to run.
  const panel =
    "relative w-full h-full rounded-2xl overflow-hidden border border-line bg-surface shadow-2xl shadow-black/60 will-change-transform";

  return (
    <section
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative overflow-hidden"
      style={{ perspective: 1400 }}
    >
      {/* subtle monochrome glow behind */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[50vh] rounded-full bg-white/4 blur-3xl" />
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-10 pt-14 md:pt-20 pb-16">
        <motion.div
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-14 md:mb-20"
        >
          <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-muted mb-4">
            {t("hero.est")}
          </p>
          <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold uppercase tracking-tight">
            {t("hero.title")}
          </h1>
        </motion.div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 xl:gap-8 items-stretch">
          {/* Left video */}
          <motion.div
            initial={{ x: -40 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            className="aspect-[3/4] md:aspect-auto md:h-[78vh] md:min-h-130"
          >
            <motion.div
              style={{ rotateX: left.rotateX, rotateY: left.rotateY, transformStyle: "preserve-3d" }}
              className={panel}
            >
              <video
                src="/media/hero-left.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover grayscale-25"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </motion.div>
          </motion.div>

          {/* Middle image */}
          <motion.div
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
            className="aspect-[3/4] md:aspect-auto md:h-[78vh] md:min-h-130 -mt-2 mb-2 md:-mt-8 md:mb-8 z-10"
          >
            <motion.div
              style={{ rotateX: middle.rotateX, rotateY: middle.rotateY, transformStyle: "preserve-3d" }}
              className={panel}
            >
              <Image
                src="/media/hero-arman.jpg"
                alt="Arman in DN8 tracksuit"
                fill
                priority
                sizes="(max-width: 768px) 34vw, 34vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              {/* CTA inside the panel — desktop only; on mobile it moves below the grid */}
              <div
                className="hidden md:block absolute bottom-0 inset-x-0 p-6 md:p-8 text-center"
                style={{ transform: "translateZ(40px)" }}
              >
                <Link
                  href="/collections"
                  className="inline-block px-8 py-3 md:px-10 md:py-3.5 rounded-full bg-foreground text-background text-sm font-semibold uppercase tracking-wider hover:scale-105 active:scale-95 transition-transform"
                >
                  {t("hero.shopNow")}
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* Right video */}
          <motion.div
            initial={{ x: 40 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            className="aspect-[3/4] md:aspect-auto md:h-[78vh] md:min-h-130"
          >
            <motion.div
              style={{ rotateX: right.rotateX, rotateY: right.rotateY, transformStyle: "preserve-3d" }}
              className={panel}
            >
              <video
                src="/media/hero-right.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover grayscale-25"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <p className="hidden md:block absolute bottom-4 inset-x-0 text-center text-xs uppercase tracking-[0.3em] text-white/70">
                @dn8team
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile CTA below the 3-column grid */}
        <div className="md:hidden mt-8 text-center">
          <Link
            href="/collections"
            className="inline-block px-10 py-3.5 rounded-full bg-foreground text-background text-sm font-semibold uppercase tracking-wider active:scale-95 transition-transform"
          >
            {t("hero.shopNow")}
          </Link>
        </div>
      </div>
    </section>
  );
}
