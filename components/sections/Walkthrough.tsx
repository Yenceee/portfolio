// components/sections/Walkthrough.tsx  (PALITAN ANG BUONG FILE)
"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface WalkthroughImage {
  src: string;
  caption?: string;
}
export interface WalkthroughGroup {
  label: string;
  images: WalkthroughImage[];
}

const ZOOM = 2.5;
const LENS = 168;
const ARROW_ZONE = 56;
// Minimum na layo ng swipe (px)
const SWIPE_MIN = 40;

interface LensState {
  x: number;
  y: number;
  bgW: number;
  bgH: number;
  bgX: number;
  bgY: number;
  nx: number;
  ny: number;
}

export default function Walkthrough({
  groups,
}: {
  groups: WalkthroughGroup[];
}) {
  const [g, setG] = useState(0);
  const [i, setI] = useState(0);
  const [lens, setLens] = useState<LensState | null>(null);
  // true lang kapag may totoong mouse (hindi touch)
  const [canHover, setCanHover] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const natRef = useRef({ w: 16, h: 9 });
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const group = groups[g];
  const images = group?.images ?? [];
  const total = images.length;
  const current = images[i];

  // Alamin kung may mouse o touch lang
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Ilagay sa gitna ang aktibong thumbnail sa filmstrip
  useEffect(() => {
    const strip = stripRef.current;
    const el = thumbRefs.current[i];
    if (!strip || !el) return;
    strip.scrollTo({
      left: el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2,
      behavior: "smooth",
    });
  }, [i, g]);

  if (!group || !current) return null;

  const go = (dir: number) => {
    setLens(null);
    setI((prev) => (prev + dir + total) % total);
  };
  const pickGroup = (idx: number) => {
    setLens(null);
    setG(idx);
    setI(0);
  };

  // Magnifier: mouse lang (hindi touch)
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { w: nw, h: nh } = natRef.current;
    const scale = Math.min(rect.width / nw, rect.height / nh);
    const cw = nw * scale;
    const ch = nh * scale;
    const ox = (rect.width - cw) / 2;
    const oy = (rect.height - ch) / 2;
    const ix = x - ox;
    const iy = y - oy;
    const outside =
      ix < 0 ||
      iy < 0 ||
      ix > cw ||
      iy > ch ||
      (total > 1 && (x < ARROW_ZONE || x > rect.width - ARROW_ZONE));
    if (outside) {
      setLens(null);
      return;
    }
    setLens({
      x,
      y,
      bgW: cw * ZOOM,
      bgH: ch * ZOOM,
      bgX: -(ix * ZOOM - LENS / 2),
      bgY: -(iy * ZOOM - LENS / 2),
      nx: Math.round((ix / cw) * nw),
      ny: Math.round((iy / ch) * nh),
    });
  };

  // Swipe sa stage (touch)
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || total < 2) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    // Pahalang lang na swipe ang bibilangin
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    go(dx < 0 ? 1 : -1);
  };

  const fileName = current.src.split("/").pop() ?? "";
  const folder = group.label.toLowerCase().replace(/\s+/g, "-");
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
      className="rounded-xl outline-none focus-visible:ring-1 focus-visible:ring-accent/50"
    >
      {/* Tabs */}
      {groups.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {groups.map((grp, idx) => (
            <button
              key={grp.label}
              type="button"
              onClick={() => pickGroup(idx)}
              className={`cursor-pointer rounded-md border px-3 py-2 text-xs transition-all duration-150 sm:py-1.5 ${
                idx === g
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-elevated text-ink-2 hover:border-accent/60 hover:text-ink"
              }`}
            >
              {grp.label}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-surface/80">
        {/* Window bar */}
        <div className="flex items-center gap-2 border-b border-border bg-elevated px-3 py-2.5 sm:gap-3 sm:px-4">
          <div className="flex shrink-0 gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
            <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
            <span className="h-3 w-3 rounded-full bg-[#28CA41]" />
          </div>
          <p className="min-w-0 flex-1 truncate font-mono text-xs text-ink-2">
            {folder}/{fileName}
          </p>
          <p className="shrink-0 font-mono text-xs text-accent">
            {pad(i + 1)} / {pad(total)}
          </p>
        </div>

        {/* Stage */}
        <div
          ref={stageRef}
          onPointerMove={onMove}
          onPointerLeave={() => setLens(null)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{ touchAction: "pan-y" }}
          className={`relative aspect-video w-full overflow-hidden bg-bg ${
            canHover ? "cursor-crosshair" : ""
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={current.src}
              src={current.src}
              alt={current.caption ?? `${group.label} screenshot ${i + 1}`}
              draggable={false}
              onLoad={(e) => {
                const t = e.currentTarget;
                if (t.naturalWidth && t.naturalHeight) {
                  natRef.current = { w: t.naturalWidth, h: t.naturalHeight };
                }
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 h-full w-full select-none object-contain"
            />
          </AnimatePresence>

          {/* Full-height hover arrows (mouse lang) */}
          {canHover && total > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous screenshot"
                onClick={() => go(-1)}
                className="absolute inset-y-0 left-0 flex w-14 cursor-pointer items-center justify-center bg-linear-to-r from-bg/80 to-transparent text-accent opacity-0 transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100"
              >
                <ChevronLeft size={26} />
              </button>
              <button
                type="button"
                aria-label="Next screenshot"
                onClick={() => go(1)}
                className="absolute inset-y-0 right-0 flex w-14 cursor-pointer items-center justify-center bg-linear-to-l from-bg/80 to-transparent text-accent opacity-0 transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100"
              >
                <ChevronRight size={26} />
              </button>
            </>
          )}

          {/* Magnifier lens (mouse lang) */}
          {canHover && lens && (
            <div
              className="pointer-events-none absolute z-10"
              style={{
                left: lens.x - LENS / 2,
                top: lens.y - LENS / 2,
                width: LENS,
                height: LENS,
              }}
            >
              <div
                className="relative h-full w-full overflow-hidden rounded-full border border-accent bg-bg shadow-[0_0_24px_rgba(0,229,184,0.35)]"
                style={{
                  backgroundImage: `url("${current.src}")`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: `${lens.bgW}px ${lens.bgH}px`,
                  backgroundPosition: `${lens.bgX}px ${lens.bgY}px`,
                }}
              >
                <span className="absolute left-1/2 top-0 h-full w-px bg-accent/40" />
                <span className="absolute left-0 top-1/2 h-px w-full bg-accent/40" />
              </div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border border-accent/40 bg-bg/90 px-1.5 py-0.5 font-mono text-[10px] text-accent">
                x {lens.nx} · y {lens.ny}
              </span>
            </div>
          )}

          {/* Hint */}
          {!lens && (
            <p className="pointer-events-none absolute bottom-2 left-3 font-mono text-[10px] text-muted sm:bottom-3 sm:left-4">
              {canHover
                ? `hover to inspect · ${ZOOM}×`
                : total > 1
                  ? "swipe to browse · tap a thumbnail"
                  : ""}
            </p>
          )}
        </div>

        {/* Caption */}
        {current.caption && (
          <p className="border-t border-border px-4 py-3 text-sm text-ink-2">
            {current.caption}
          </p>
        )}

        {/* Filmstrip */}
        {total > 1 && (
          <div
            ref={stripRef}
            className="film-scroll relative flex gap-2 overflow-x-auto border-t border-border bg-elevated/60 p-3"
          >
            {images.map((img, idx) => (
              <button
                key={img.src}
                ref={(el) => {
                  thumbRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => {
                  setLens(null);
                  setI(idx);
                }}
                aria-label={`Go to screenshot ${idx + 1}`}
                className={`relative aspect-video w-20 shrink-0 cursor-pointer overflow-hidden rounded-md border transition-all duration-150 sm:w-28 ${
                  idx === i
                    ? "border-accent opacity-100 shadow-[0_0_12px_rgba(0,229,184,0.3)]"
                    : "border-border opacity-50 hover:opacity-100"
                }`}
              >
                <img
                  src={img.src}
                  alt=""
                  draggable={false}
                  className="h-full w-full object-cover object-top"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
