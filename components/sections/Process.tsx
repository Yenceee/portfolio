// components/sections/Process.tsx  (PALITAN ANG BUONG FILE)
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Discover & Research",
    text: "Understanding users, business goals, and constraints before a single pixel is placed.",
  },
  {
    n: "02",
    title: "Wireframe & UX Flow",
    text: "Structuring the skeleton: navigation, hierarchy, and logic.",
  },
  {
    n: "03",
    title: "UI Design & Systems",
    text: "Building a cohesive visual language with reusable components.",
  },
  {
    n: "04",
    title: "Interactive Figma Prototyping",
    text: "Bringing it to life with real transitions clients and users can click through.",
  },
];

interface SectionProps {
  /** true kapag nasa loob ng sphere panel */
  embedded?: boolean;
  /** true kapag ang panel na ito ang nasa harap ng sphere */
  active?: boolean;
}

export default function Process({
  embedded = false,
  active = false,
}: SectionProps) {
  const ref = useRef(null);
  const viewed = useInView(ref, { once: true, margin: "-80px" });
  const inView = embedded ? active : viewed;

  return (
    <section className={embedded ? "" : "bg-surface px-6 py-20 md:px-16"}>
      <div className="mx-auto max-w-5xl" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="font-display text-3xl font-medium text-ink"
        >
          My Design Process
        </motion.h2>
        <div
          className={
            embedded
              ? "mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2"
              : "mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          }
        >
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            >
              <p className="font-display text-lg font-medium text-accent">
                {s.n}
              </p>
              <h3 className="mt-2 font-display text-base font-medium text-ink">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">
                {s.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
