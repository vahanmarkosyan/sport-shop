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
    for (const t of [left, middle, right]) {
      t.x.set(px);
      t.y.set(py);
    }
  };

  const onMouseLeave = () => {
    for (const t of [left, middle, right]) {
      t.x.set(0);
      t.y.set(0);
    }
  };

  const panel =
    "relative rounded-2xl overflow-hidden border border-line bg-surface shadow-2xl shadow-black/60 will-change-transform";

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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14 md:mb-20"
        >
          <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-muted mb-4">
            {t("hero.est")}
          </p>
          <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold uppercase tracking-tight">
            {t("hero.title")}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 xl:gap-8 items-stretch">
          {/* Left video */}
          <motion.div
            initial={{ opacity: 0, x: -60, rotateY: 20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ rotateX: left.rotateX, rotateY: left.rotateY, transformStyle: "preserve-3d" }}
            className={`${panel} hidden md:block md:h-[78vh] md:min-h-130`}
          >
            <video
              src="/media/hero-left.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover grayscale-25"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>

          {/* Middle image */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ rotateX: middle.rotateX, rotateY: middle.rotateY, transformStyle: "preserve-3d" }}
            className={`${panel} aspect-[3/4] md:aspect-auto md:h-[78vh] md:min-h-130 md:-mt-8 md:mb-8 z-10`}
          >
            <Image
              src="/media/hero-arman.jpg"
              alt="Arman in DN8 tracksuit"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 34vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 text-center" style={{ transform: "translateZ(40px)" }}>
              <Link
                href="/collections"
                className="inline-block px-8 py-3 md:px-10 md:py-3.5 rounded-full bg-foreground text-background text-sm font-semibold uppercase tracking-wider hover:scale-105 active:scale-95 transition-transform"
              >
                {t("hero.shopNow")}
              </Link>
            </div>
          </motion.div>

          {/* Right video */}
          <motion.div
            initial={{ opacity: 0, x: 60, rotateY: -20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ rotateX: right.rotateX, rotateY: right.rotateY, transformStyle: "preserve-3d" }}
            className={`${panel} aspect-[3/4] md:aspect-auto md:h-[78vh] md:min-h-130`}
          >
            <video
              src="/media/hero-right.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover grayscale-25"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <p className="absolute bottom-4 inset-x-0 text-center text-xs uppercase tracking-[0.3em] text-white/70">
              @dn8team
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
