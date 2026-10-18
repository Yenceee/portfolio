// components/sections/UiLab.tsx  (PALITAN ANG BUONG FILE)
"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function ToggleSwitch() {
  const [on, setOn] = useState(false);
  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOn(!on)}
          className={`relative h-6 w-11 rounded-full border transition-all duration-300 cursor-pointer ${on ? "border-accent bg-accent/20" : "border-border bg-elevated"}`}
        >
          <span
            className={`absolute top-0.75 h-4 w-4 rounded-full transition-all duration-300 ${on ? "left-5.75 bg-accent shadow-[0_0_8px_rgba(0,229,184,0.8)]" : "left-0.75 bg-muted"}`}
          />
        </button>
        <span
          className={`text-xs transition-colors duration-200 ${on ? "text-accent" : "text-muted"}`}
        >
          {on ? "On" : "Off"}
        </span>
      </div>
    </div>
  );
}

function AnalyticsWidget() {
  const bars = [
    { h: 40, val: "1.2k" },
    { h: 65, val: "2.1k" },
    { h: 100, val: "3.4k" },
    { h: 55, val: "1.8k" },
    { h: 80, val: "2.7k" },
    { h: 45, val: "1.5k" },
    { h: 70, val: "2.3k" },
  ];
  const [hovered, setHovered] = useState<number | null>(null);
  const maxH = 80;
  return (
    <div className="mt-6">
      <div className="flex items-end gap-1.5" style={{ height: `${maxH}px` }}>
        {bars.map((b, i) => (
          <div
            key={i}
            className="relative flex h-full flex-1 flex-col items-center justify-end"
          >
            {hovered === i && (
              <div className="absolute -top-6 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-accent bg-elevated px-2 py-0.5 text-[10px] text-accent">
                {b.val}
              </div>
            )}
            <div
              // Mouse: hover. Touch: tap para ipakita ang value.
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") setHovered(i);
              }}
              onPointerLeave={(e) => {
                if (e.pointerType === "mouse") setHovered(null);
              }}
              onClick={() => setHovered(i)}
              className={`w-full cursor-pointer rounded-t transition-all duration-200 ${hovered === i ? "bg-accent shadow-[0_0_10px_rgba(0,229,184,0.5)]" : "bg-elevated border border-border hover:bg-accent/30"}`}
              style={{ height: `${(b.h / 100) * maxH}px` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ComponentVariants() {
  const [pressed, setPressed] = useState<string | null>(null);
  const btn = (label: string, style: string) => (
    <button
      key={label}
      type="button"
      onPointerDown={() => setPressed(label)}
      onPointerUp={() => setPressed(null)}
      onPointerLeave={() => setPressed(null)}
      onPointerCancel={() => setPressed(null)}
      className={`cursor-pointer rounded-md border px-3 py-2 text-xs transition-all duration-150 sm:py-1.5 ${style} ${pressed === label ? "scale-95" : "scale-100"}`}
    >
      {label}
    </button>
  );
  return (
    <div className="mt-6 flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {btn(
          "Default",
          "border-border bg-elevated text-ink hover:border-accent hover:text-accent",
        )}
        {btn(
          "Primary",
          "border-accent bg-accent/10 text-accent hover:bg-accent hover:text-bg",
        )}
        {btn(
          "Danger",
          "border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20",
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {btn(
          "Ghost",
          "border-transparent bg-transparent text-ink-2 hover:border-border hover:text-ink",
        )}
        <span className="cursor-not-allowed rounded-md border border-border bg-bg px-3 py-2 text-xs text-muted opacity-40 sm:py-1.5">
          Disabled
        </span>
      </div>
    </div>
  );
}

interface SectionProps {
  /** true kapag nasa loob ng sphere panel */
  embedded?: boolean;
  /** true kapag ang panel na ito ang nasa harap ng sphere */
  active?: boolean;
}

export default function UiLab({
  embedded = false,
  active = false,
}: SectionProps) {
  const ref = useRef(null);
  const viewed = useInView(ref, { once: true, margin: "-80px" });
  const inView = embedded ? active : viewed;
  const [tab, setTab] = useState(0);

  const cards = [
    {
      short: "Toggle",
      title: "Animated Toggle Switch",
      desc: "Componentized states: Off, On, Disabled.",
      component: <ToggleSwitch />,
      delay: 0.1,
    },
    {
      short: "Analytics",
      title: "Dashboard Analytics Widget",
      desc: "Data visualization built for clarity.",
      component: <AnalyticsWidget />,
      delay: 0.2,
    },
    {
      short: "Variants",
      title: "Component Variant Library",
      desc: "Every state, systematically designed.",
      component: <ComponentVariants />,
      delay: 0.3,
    },
  ];

  /* ---- Panel version: isang component lang kada tab para kasya sa panel ---- */
  if (embedded) {
    const card = cards[tab];
    return (
      <div ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <p className="text-xs font-medium tracking-[0.14em] text-muted">
            INTERACTIVE
          </p>
          <h2 className="mt-2 font-display text-3xl font-medium text-ink">
            UI Lab
          </h2>
          <p className="mt-2 text-sm text-ink-2">
            Live components — click and interact.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {cards.map((c, i) => (
              <button
                key={c.short}
                type="button"
                onClick={() => setTab(i)}
                className={`cursor-pointer rounded-md border px-3 py-2 text-xs transition-all duration-150 sm:py-1.5 ${
                  tab === i
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-elevated text-ink-2 hover:border-accent/60 hover:text-ink"
                }`}
              >
                {c.short}
              </button>
            ))}
          </div>

          <div
            key={card.title}
            className="mt-4 rounded-xl border border-border bg-elevated p-5"
          >
            <h3 className="font-display text-base font-medium text-ink">
              {card.title}
            </h3>
            <p className="mt-1 text-sm text-ink-2">{card.desc}</p>
            {card.component}
          </div>
        </motion.div>
      </div>
    );
  }

  /* ---- Normal section version (hindi gagamitin sa sphere) ---- */
  return (
    <section className="bg-bg px-6 py-20 md:px-16">
      <div className="mx-auto max-w-5xl" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <p className="text-xs font-medium tracking-[0.14em] text-muted">
            INTERACTIVE
          </p>
          <h2 className="mt-2 font-display text-3xl font-medium text-ink">
            UI Lab
          </h2>
          <p className="mt-2 text-sm text-ink-2">
            Live components — click and interact.
          </p>
        </motion.div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {cards.map((card) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: card.delay, ease: "easeOut" }}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <h3 className="font-display text-base font-medium text-ink">
                {card.title}
              </h3>
              <p className="mt-1 text-sm text-ink-2">{card.desc}</p>
              {card.component}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
