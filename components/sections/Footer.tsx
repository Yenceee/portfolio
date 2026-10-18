"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EMAIL = "pinto.larencemcdale.salas@gmail.com";
const PHONES = ["+639978809937", "+639238690325"];

interface SectionProps {
  /** true kapag nasa loob ng sphere panel */
  embedded?: boolean;
  /** true kapag ang panel na ito ang nasa harap ng sphere */
  active?: boolean;
}

export default function Footer({
  embedded = false,
  active = false,
}: SectionProps) {
  const ref = useRef(null);
  const viewed = useInView(ref, { once: true, margin: "-80px" });
  const inView = embedded ? active : viewed;

  const Wrapper = embedded ? "div" : "footer";

  return (
    <Wrapper
      className={
        embedded ? "text-center" : "bg-elevated px-6 py-20 text-center md:px-16"
      }
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-medium text-ink">
          Let&apos;s Turn Your Idea Into an Interface.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-2">
          Available for freelance UI/UX projects with apps, mobile interfaces,
          and design systems.
        </p>
        <p
          className={`mt-6 text-sm text-ink ${
            embedded
              ? "flex flex-col items-center gap-2"
              : "flex flex-wrap items-center justify-center gap-x-2 gap-y-1"
          }`}
        >
          <a
            href={`mailto:${EMAIL}`}
            className="break-all transition-colors hover:text-accent"
          >
            {EMAIL}
          </a>
          {!embedded && <span className="text-muted">|</span>}
          <span>
            {PHONES.map((phone, i) => (
              <span key={phone}>
                {i > 0 && <span className="mx-1.5 text-muted">/</span>}
                <a
                  href={`tel:${phone}`}
                  className="transition-colors hover:text-accent"
                >
                  {phone}
                </a>
              </span>
            ))}
          </span>
        </p>
        <div className="mx-auto mt-10 max-w-5xl border-t border-border pt-6">
          <p className="text-xs text-muted">
            © 2026 Larence Mcdale S. Pinto — UI/UX Designer
          </p>
        </div>
      </motion.div>
    </Wrapper>
  );
}
