// components/sections/ProjectDetail.tsx  (PALITAN ANG BUONG FILE)
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { ProjectDetail } from "@/data/projectDetails";
import Walkthrough from "@/components/sections/Walkthrough";

function AnimatedBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Phone / maliit na screen: mas magaan na bersyon
    const small = window.innerWidth < 768;

    let animId: number;
    let w = 0,
      h = 0;

    type Stream = {
      x: number;
      y: number;
      speed: number;
      length: number;
      chars: string[];
      opacity: number;
      width: number;
    };

    const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>/\\|[]{}";
    const COL_W = 22;
    let streams: Stream[] = [];
    const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      const cols = Math.ceil(w / COL_W);
      streams = [];
      for (let i = 0; i < cols; i++) {
        // Sa phone, kalahati lang ng columns
        if (small && i % 2 === 1) continue;
        const len = Math.floor(Math.random() * 18) + 6;
        streams.push({
          x: i * COL_W + COL_W / 2,
          y: Math.random() * -h,
          speed: 0.6 + Math.random() * 1.8,
          length: len,
          chars: Array.from({ length: len }, randomChar),
          opacity: 0.04 + Math.random() * 0.1,
          width: COL_W,
        });
      }
    };

    const HEX_SIZE = 28;
    const HEX_H = HEX_SIZE * Math.sqrt(3);

    const drawHex = (cx: number, cy: number, alpha: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = cx + HEX_SIZE * Math.cos(angle);
        const py = cy + HEX_SIZE * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(0,229,184,${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    };

    let hexPulse = 0;

    const draw = (t: number) => {
      ctx.fillStyle = "rgba(10,11,13,0.18)";
      ctx.fillRect(0, 0, w, h);
      hexPulse += 0.008;

      // Hex grid: desktop/tablet lang (pinakamabigat sa performance)
      if (!small) {
        const hexCols = Math.ceil(w / (HEX_SIZE * 1.5)) + 2;
        const hexRows = Math.ceil(h / HEX_H) + 2;
        for (let row = -1; row < hexRows; row++) {
          for (let col = -1; col < hexCols; col++) {
            const cx = col * HEX_SIZE * 1.73;
            const cy = row * HEX_H + (col % 2 === 0 ? 0 : HEX_H / 2);
            const dist = Math.sqrt((cx - w * 0.5) ** 2 + (cy - h * 0.3) ** 2);
            const pulse = Math.sin(hexPulse - dist * 0.008) * 0.5 + 0.5;
            drawHex(cx, cy, 0.02 + pulse * 0.04);
          }
        }
      }

      const beamX = ((t * 0.025) % (w + 300)) - 150;
      const beamGrd = ctx.createLinearGradient(beamX - 80, 0, beamX + 80, 0);
      beamGrd.addColorStop(0, "rgba(0,229,184,0)");
      beamGrd.addColorStop(0.5, "rgba(0,229,184,0.025)");
      beamGrd.addColorStop(1, "rgba(0,229,184,0)");
      ctx.save();
      ctx.transform(1, 0, -0.4, 1, 0, 0);
      ctx.fillStyle = beamGrd;
      ctx.fillRect(beamX - 80, 0, 160, h * 1.5);
      ctx.restore();

      ctx.font = "bold 11px monospace";
      for (const s of streams) {
        s.y += s.speed;
        if (s.y - s.length * 14 > h) {
          s.y = Math.random() * -200;
          s.speed = 0.6 + Math.random() * 1.8;
          s.chars = Array.from({ length: s.length }, randomChar);
          s.opacity = 0.04 + Math.random() * 0.1;
        }
        if (Math.random() < 0.04) {
          s.chars[Math.floor(Math.random() * s.chars.length)] = randomChar();
        }
        for (let i = 0; i < s.chars.length; i++) {
          const cy = s.y - i * 14;
          if (cy < 0 || cy > h) continue;
          const isHead = i === 0;
          const charAlpha = isHead
            ? s.opacity * 6
            : s.opacity * (1 - i / s.chars.length);
          ctx.fillStyle = isHead
            ? `rgba(180,255,240,${Math.min(charAlpha, 0.55)})`
            : `rgba(0,229,184,${Math.min(charAlpha, 0.35)})`;
          ctx.fillText(s.chars[i], s.x - 5, cy);
        }
      }

      const vig = ctx.createRadialGradient(
        w / 2,
        h / 2,
        h * 0.1,
        w / 2,
        h / 2,
        h * 0.85,
      );
      vig.addColorStop(0, "rgba(10,11,13,0)");
      vig.addColorStop(1, "rgba(10,11,13,0.72)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      animId = requestAnimationFrame(draw);
    };

    resize();
    animId = requestAnimationFrame(draw);

    let lastW = canvas.offsetWidth;
    const ro = new ResizeObserver(() => {
      // Sa phone, nagbabago ang taas kapag nagtago o lumabas ang address bar.
      // Huwag i-reset ang animation kung lapad lang ang mahalaga.
      if (small && canvas.offsetWidth === lastW) return;
      lastW = canvas.offsetWidth;
      resize();
    });
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 h-full w-full"
      style={{ pointerEvents: "none", zIndex: 0 }}
    />
  );
}

// 3D scroll reveal — each section card rises and rotates into view
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.transition =
              "transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.7s ease";
            el.style.transform =
              "perspective(1000px) translateY(0px) rotateX(0deg)";
            el.style.opacity = "1";
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12 },
    );

    els.forEach((el) => {
      el.style.transform =
        "perspective(1000px) translateY(48px) rotateX(10deg)";
      el.style.opacity = "0";
      el.style.transformOrigin = "center bottom";
      el.style.willChange = "transform, opacity";
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}

export default function ProjectDetail({ detail }: { detail: ProjectDetail }) {
  useScrollReveal();

  // Mga tab na may screenshots lang ang ipinapasa sa Walkthrough.
  const groups = detail.tabs
    .filter((t) => t.images && t.images.length > 0)
    .map((t) => ({
      label: t.label,
      images: (t.images ?? []).map((src) => ({ src })),
    }));

  return (
    <div className="relative min-h-screen overflow-x-clip bg-bg text-ink">
      <AnimatedBg />

      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-10 h-16 md:h-32"
        style={{
          background: "linear-gradient(to bottom, #0A0B0D 40%, transparent)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-10 h-16 md:h-32"
        style={{
          background: "linear-gradient(to top, #0A0B0D 40%, transparent)",
        }}
      />

      <div className="relative z-20 mx-auto max-w-5xl px-4 py-10 sm:px-6 md:px-16 md:py-16">
        <Link
          href="/?panel=projects"
          scroll={false}
          className="mb-8 inline-flex items-center gap-2 py-1 text-sm text-muted transition-colors hover:text-accent md:mb-10"
        >
          ← Back to Projects
        </Link>

        {/* Header */}
        <div className="mb-12 md:mb-16" data-reveal>
          <h1 className="wrap-break-word font-display text-3xl font-semibold text-ink sm:text-4xl md:text-5xl">
            {detail.title}
          </h1>
          <p className="mt-2 text-sm font-medium text-accent">{detail.role}</p>
          <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-2 md:gap-8">
            <p className="font-display text-xl font-medium leading-snug text-ink sm:text-2xl md:text-3xl">
              &ldquo;{detail.quote}&rdquo;
            </p>
            <p className="text-sm leading-relaxed text-ink-2">
              {detail.problemStatement}
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-12 md:mb-16" data-reveal>
          <p className="mb-2 text-xs font-medium tracking-[0.14em] text-muted">
            KEY FEATURES
          </p>
          <h2 className="mb-6 font-display text-xl font-semibold text-ink sm:text-2xl">
            What {detail.title.split(" ")[0]} Does
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {detail.features.map((f, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-elevated/80 p-4 backdrop-blur-sm transition-all duration-300 hover:border-accent hover:shadow-[0_0_24px_-4px_rgba(0,229,184,0.35)]"
              >
                <p className="mb-2 font-display text-sm font-semibold text-accent">
                  {f.title}
                </p>
                <p className="text-xs leading-relaxed text-ink-2">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-12 md:mb-16" data-reveal>
          <p className="mb-2 text-xs font-medium tracking-[0.14em] text-muted">
            {detail.techStackLabel ?? "TECH STACK"}
          </p>
          <h2 className="mb-6 font-display text-xl font-semibold text-ink sm:text-2xl">
            {detail.builtWithLabel ?? "Built With"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {detail.techStack.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-elevated/80 px-3 py-1.5 text-xs text-ink-2 backdrop-blur-sm transition-all duration-200 hover:border-accent hover:text-accent sm:px-4"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Walkthrough — Inspector viewer */}
        <div className="mb-12 md:mb-16" data-reveal>
          <p className="mb-2 text-xs font-medium tracking-[0.14em] text-muted">
            {detail.walkthroughLabel ?? "WALKTHROUGH"}
          </p>
          <h2 className="mb-6 font-display text-3xl font-semibold text-ink sm:text-4xl">
            {detail.walkthroughTitle ?? "See It In Action"}
          </h2>

          {groups.length > 0 ? (
            <Walkthrough groups={groups} />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-surface/80">
              <div className="flex items-center gap-3 border-b border-border bg-elevated px-4 py-2.5">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-muted/40" />
                  <span className="h-2.5 w-2.5 rounded-full bg-muted/40" />
                  <span className="h-2.5 w-2.5 rounded-full bg-muted/40" />
                </div>
                <p className="font-mono text-xs text-ink-2">walkthrough/</p>
              </div>
              <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-bg">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/30">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                </div>
                <p className="font-mono text-xs text-muted">
                  screenshots_coming_soon
                </p>
              </div>
            </div>
          )}
        </div>

        {/* What I Did */}
        <div className="mb-12 md:mb-16" data-reveal>
          <p className="mb-2 text-xs font-medium tracking-[0.14em] text-muted">
            MY CONTRIBUTION
          </p>
          <h2 className="mb-6 font-display text-3xl font-semibold text-ink sm:text-4xl">
            What I Did
          </h2>
          <ul className="space-y-3 sm:space-y-4">
            {detail.whatIDid.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-border/50 bg-elevated/60 px-4 py-3 text-sm text-ink-2 backdrop-blur-sm transition-all duration-200 hover:border-accent/40 hover:text-ink sm:gap-4"
              >
                <span className="mt-0.5 shrink-0 font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 wrap-break-word">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
