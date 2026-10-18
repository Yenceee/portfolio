// components/sections/Projects.tsx  (PALITAN ANG BUONG FILE)
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { projects } from "@/data/projects";

const detailSlugs = new Set(["armor", "dnms", "enov8tive", "evergreen"]);
const CELL = 28;

interface SectionProps {
  /** true kapag nasa loob ng sphere panel */
  embedded?: boolean;
  /** true kapag ang panel na ito ang nasa harap ng sphere */
  active?: boolean;
}

export default function Projects({
  embedded = false,
  active = false,
}: SectionProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef(null);
  const viewed = useInView(headerRef, { once: true, margin: "-80px" });
  const headerInView = embedded ? active : viewed;
  const [mounted, setMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  // Sa sphere, tumatakbo lang ang wave kapag nasa harap ang panel (para hindi bumigat).
  const running = !embedded || active;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = rowRef.current;
    if (!el) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftPos(el.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const el = rowRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.2;
    if (Math.abs(walk) > 5) setHasDragged(true);
    el.scrollLeft = scrollLeftPos - walk;
  };

  useEffect(() => {
    if (!running) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Touch devices: kalahati ng frame rate para gumaan
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const GAP = coarse ? 50 : 0;
    let last = 0;

    let animId: number,
      w = 0,
      h = 0,
      cols = 0,
      rows = 0;
    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      cols = Math.ceil(w / CELL) + 1;
      rows = Math.ceil(h / CELL) + 1;
    };
    const draw = (t: number) => {
      animId = requestAnimationFrame(draw);
      if (GAP && t - last < GAP) return;
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const wave =
            Math.sin(col * 0.35 + t * 0.0008 + row * 0.2) * 0.5 +
            Math.sin(col * 0.18 - t * 0.0005 + row * 0.35) * 0.5;
          const brightness = Math.round(14 + ((wave + 1) / 2) * 22);
          ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
          ctx.fillRect(col * CELL, row * CELL, CELL - 1, CELL - 1);
        }
      }
    };
    resize();
    animId = requestAnimationFrame(draw);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [running]);

  return (
    <section
      id={embedded ? undefined : "projects"}
      className={`relative overflow-hidden select-none ${
        embedded
          ? "px-4 py-8 sm:px-8 sm:py-10"
          : "bg-surface px-6 py-20 md:px-16"
      }`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ pointerEvents: "none", opacity: 0.9 }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background: "linear-gradient(to bottom, #14161A, transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{ background: "linear-gradient(to top, #14161A, transparent)" }}
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <p className="text-xs font-medium tracking-[0.14em] text-muted">
            SELECTED WORK
          </p>
          <h2 className="mt-2 font-display text-3xl font-medium text-ink">
            Projects
          </h2>
        </motion.div>

        <div
          ref={rowRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ scrollBehavior: mounted && isDragging ? "auto" : "smooth" }}
          className={`hover-scroll -mx-4 mt-6 flex cursor-grab gap-4 overflow-x-auto px-4 pb-4 pt-6 active:cursor-grabbing sm:gap-6 ${mounted && isDragging ? "snap-none" : "snap-x"}`}
        >
          {projects.map((p, i) => {
            const card = (
              <>
                <div
                  className={`relative aspect-16/7 overflow-hidden rounded-lg border border-border ${p.thumbBg}`}
                >
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={`${p.title} preview`}
                      fill
                      sizes="320px"
                      className="object-cover object-top pointer-events-none"
                    />
                  ) : (
                    <div
                      className={`flex h-full items-center justify-center font-display text-xl font-medium tracking-widest ${p.thumbText}`}
                    >
                      {p.thumbLabel}
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="font-display text-xs font-semibold text-accent opacity-50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <h3 className="mt-2 font-display text-lg font-medium leading-snug text-ink">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                  {p.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-accent bg-elevated px-3 py-1 text-xs text-accent"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </>
            );
            // Phone: 78vw para may sumisilip na kasunod na card. sm pataas: 320px.
            const cls =
              "group block w-[78vw] max-w-80 shrink-0 snap-start rounded-2xl border border-border bg-elevated p-4 transition-all duration-300 hover:-translate-y-2 hover:border-accent hover:shadow-[0_20px_50px_-10px_rgba(0,229,184,0.4)] sm:w-80";
            return detailSlugs.has(p.slug) ? (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                onClick={(e) => {
                  if (hasDragged) e.preventDefault();
                }}
                className={cls}
              >
                {card}
              </Link>
            ) : (
              <article key={p.slug} className={cls}>
                {card}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
