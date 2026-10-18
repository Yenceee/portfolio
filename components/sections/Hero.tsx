// components/sections/Hero.tsx  (PALITAN ANG BUONG FILE)
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Process from "@/components/sections/Process";
import UiLab from "@/components/sections/UiLab";
import Projects from "@/components/sections/Projects";
import Footer from "@/components/sections/Footer";

interface HeroProps {
  onOpenAbout: () => void;
}

const PANEL_COUNT = 6;
const PANEL = {
  hero: 0,
  background: 1,
  process: 2,
  uiLab: 3,
  projects: 4,
  contact: 5,
} as const;

// Gaano katagal huminto ang scroll bago mag-auto-center (ms)
const SNAP_DELAY = 120;
const SNAP_DELAY_TOUCH = 220;

export default function Hero({ onOpenAbout }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const touching = useRef(false);
  const [activePanel, setActivePanel] = useState(0);
  // null = hindi pa alam (unang render), true = stacked, false = sphere
  const [stacked, setStacked] = useState<boolean | null>(null);
  // true kapag touch ang pangunahing input (mas magaan ang effects)
  const [lite, setLite] = useState(false);

  /* ---------- Breakpoint detect ---------- */
  // Sphere: lapad >= 1024px AT taas >= 640px (desktop, iPad landscape).
  // Stacked: phone at iPad portrait.
  useEffect(() => {
    // Sphere: desktop/tablet landscape, O phone/tablet na naka-landscape (touch).
    const sphereMq = window.matchMedia(
      "((min-width: 1024px) and (min-height: 640px)) or ((orientation: landscape) and (pointer: coarse))",
    );
    const touchMq = window.matchMedia("(pointer: coarse)");
    const update = () => {
      setStacked(!sphereMq.matches);
      setLite(touchMq.matches);
    };
    update();
    sphereMq.addEventListener("change", update);
    touchMq.addEventListener("change", update);
    return () => {
      sphereMq.removeEventListener("change", update);
      touchMq.removeEventListener("change", update);
    };
  }, []);

  /* ---------- Particle canvas (sphere lang) ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mas kaunting particles sa touch devices
    const divisor = lite ? 36000 : 18000;

    let animId: number;
    let w = 0,
      h = 0;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
    }[] = [];

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    const spawn = () => {
      const count = Math.floor((w * h) / divisor);
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.5 + 0.15,
        });
      }
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const grd = ctx.createRadialGradient(
        w * 0.15,
        h * 0.25,
        0,
        w * 0.15,
        h * 0.25,
        w * 0.55,
      );
      grd.addColorStop(0, "rgba(0,229,184,0.07)");
      grd.addColorStop(1, "rgba(0,229,184,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,184,${p.alpha})`;
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,229,184,${0.07 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    resize();
    spawn();
    draw();
    const ro = new ResizeObserver(() => {
      resize();
      spawn();
    });
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [stacked, lite]);

  /* ---------- Orbit math + auto-center (sphere lang) ---------- */
  useEffect(() => {
    if (stacked !== false) return;
    const section = sectionRef.current;
    if (!section) return;

    const STEP = 360 / PANEL_COUNT;
    const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
    const snapDelay = lite ? SNAP_DELAY_TOUCH : SNAP_DELAY;
    let lastActive = 0;
    let snapTimer: number | undefined;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const scrollInSection = window.scrollY - sectionTop;
      const totalScroll = section.offsetHeight - window.innerHeight;
      const raw = clamp(scrollInSection / Math.max(totalScroll, 1));

      // (PANEL_COUNT - 1) steps lang ang ikot: panel 0 center sa simula,
      // huling panel center sa dulo.
      const rawAngle = raw * (PANEL_COUNT - 1) * STEP;

      // Nakabase sa pinakamalapad na panel (Projects) para hindi tumagos ang katabi.
      const widest = Math.min(1120, window.innerWidth * 0.9);
      const RADIUS = Math.max(1200, widest * 1.3);

      // Liliit nang kaunti ang panels kapag maliit ang taas ng screen
      // para hindi maputol ang matatangkad na panel.

      let front = 0;
      let bestCos = -2;

      panelsRef.current.forEach((panel, i) => {
        if (!panel) return;
        // Touch lang: liliit ang panel hanggang kasya sa taas ng screen.
        // Desktop na may mouse: laging buong laki.
        const fit = lite
          ? clamp((window.innerHeight * 0.9) / panel.offsetHeight, 0.35, 1)
          : 1;
        const baseAngle = i * STEP;
        const rotY = ((((baseAngle - rawAngle) % 360) + 540) % 360) - 180;
        const rad = rotY * (Math.PI / 180);
        const x = Math.sin(rad) * RADIUS;
        const z = Math.cos(rad) * RADIUS - RADIUS;
        const cosVal = Math.cos(rad);

        const opacity = clamp((cosVal - 0.6) / 0.35);
        const scale = (0.78 + Math.max(0, cosVal) * 0.22) * fit;

        panel.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${-rotY}deg) scale(${scale})`;
        panel.style.opacity = String(opacity);
        panel.style.pointerEvents = cosVal > 0.95 ? "auto" : "none";
        panel.style.borderColor =
          cosVal > 0.88
            ? `rgba(0,229,184,${(cosVal - 0.88) * 5 * 0.55})`
            : "#2A2D33";
        panel.style.boxShadow =
          cosVal > 0.88
            ? `0 0 48px rgba(0,229,184,${(cosVal - 0.88) * 5 * 0.18})`
            : "none";

        if (cosVal > bestCos) {
          bestCos = cosVal;
          front = i;
        }
      });

      if (front !== lastActive) {
        lastActive = front;
        setActivePanel(front);
      }

      // Auto-center: kapag huminto ang scroll, i-align sa pinakamalapit na panel.
      window.clearTimeout(snapTimer);
      if (scrollInSection >= 0 && scrollInSection <= totalScroll) {
        snapTimer = window.setTimeout(() => {
          // Huwag mag-snap habang nakadikit pa ang daliri
          if (touching.current) return;
          const nearest = Math.round(raw * (PANEL_COUNT - 1));
          const targetScroll =
            sectionTop + (nearest / (PANEL_COUNT - 1)) * totalScroll;
          if (Math.abs(window.scrollY - targetScroll) > 2) {
            window.scrollTo({ top: targetScroll, behavior: "smooth" });
          }
        }, snapDelay);
      }
    };

    const onTouchStart = () => {
      touching.current = true;
      window.clearTimeout(snapTimer);
    };
    const onTouchEnd = () => {
      touching.current = false;
      handleScroll();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    handleScroll();
    return () => {
      window.clearTimeout(snapTimer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [stacked, lite]);

  /* ---------- Stacked: alamin kung aling panel ang active ---------- */
  useEffect(() => {
    if (stacked !== true) return;

    const update = () => {
      const doc = document.documentElement;
      // Nasa dulo na ng page: ang huling panel ang active
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 8) {
        setActivePanel(PANEL_COUNT - 1);
        return;
      }
      // Kung hindi, ang panel na pinakamalapit sa gitna ng screen
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      panelsRef.current.forEach((p, i) => {
        if (!p) return;
        const r = p.getBoundingClientRect();
        const dist =
          mid >= r.top && mid <= r.bottom
            ? 0
            : Math.min(Math.abs(r.top - mid), Math.abs(r.bottom - mid));
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActivePanel(best);
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [stacked]);

  /* ---------- Jump to panel ---------- */
  const scrollToPanel = useCallback(
    (index: number) => {
      if (stacked) {
        panelsRef.current[index]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return;
      }
      const section = sectionRef.current;
      if (!section) return;
      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      const totalScroll = section.offsetHeight - window.innerHeight;
      const target = sectionTop + (index / (PANEL_COUNT - 1)) * totalScroll;
      window.scrollTo({ top: target, behavior: "smooth" });
    },
    [stacked],
  );

  // Galing sa "Back to Projects": /?panel=projects → diretso sa Projects panel
  useEffect(() => {
    if (stacked === null) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("panel") !== "projects") return;

    let tries = 0;
    let timer: number | undefined;
    const jump = () => {
      if (stacked) {
        panelsRef.current[PANEL.projects]?.scrollIntoView({
          behavior: "instant" as ScrollBehavior,
          block: "start",
        });
      } else {
        const section = sectionRef.current;
        if (section) {
          const sectionTop =
            window.scrollY + section.getBoundingClientRect().top;
          const totalScroll = section.offsetHeight - window.innerHeight;
          window.scrollTo({
            top:
              sectionTop + (PANEL.projects / (PANEL_COUNT - 1)) * totalScroll,
            behavior: "instant",
          });
        }
      }
      tries += 1;
      if (tries < 5) timer = window.setTimeout(jump, 120);
      else window.history.replaceState(null, "", window.location.pathname);
    };
    jump();
    return () => window.clearTimeout(timer);
  }, [stacked]);

  /* ---------- Styles ---------- */
  // Walang overflow-y-auto sa panel para ang mouse wheel ay laging
  // nagpapaikot ng sphere. Sa touch, walang backdrop-blur (mabigat).
  const surface = lite ? "bg-surface/95" : "bg-surface/90 backdrop-blur-sm";
  const panelBase = `absolute w-[520px] max-w-[90vw] rounded-2xl border ${surface} px-10 py-10`;
  const panelWide = `absolute w-[1120px] max-w-[90vw] overflow-hidden rounded-2xl border ${surface}`;
  const panelStyle: React.CSSProperties = {
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
    willChange: "transform, opacity",
    borderColor: "#2A2D33",
  };
  // Stacked panels (phone at tablet portrait)
  const stackBase =
    "mx-auto w-full max-w-3xl scroll-mt-4 rounded-2xl border border-border bg-surface/90 px-5 py-8 sm:px-8";
  const stackWide =
    "mx-auto w-full max-w-4xl scroll-mt-4 overflow-hidden rounded-2xl border border-border bg-surface/90";

  const setRef = (i: number) => (el: HTMLDivElement | null) => {
    panelsRef.current[i] = el;
  };

  const btn =
    "cursor-pointer rounded-xl border border-border bg-elevated px-6 py-3.5 text-sm font-medium text-ink transition-all duration-200 hover:bg-accent hover:border-accent hover:text-bg hover:shadow-[0_10px_25px_-5px_rgba(0,229,184,0.6)]";

  /* ---------- Shared content ---------- */
  const heroContent = (
    <>
      <p className="mb-4 text-xs font-medium tracking-[0.14em] text-accent">
        UI/UX DESIGNER · WEB &amp; MOBILE
      </p>
      <h1 className="font-display text-3xl font-medium leading-tight text-ink sm:text-4xl md:text-5xl">
        Designing Interfaces People Actually Enjoy Using.
      </h1>
      <p className="mt-5 text-base leading-relaxed text-ink-2">
        I&apos;m Larence, a UI/UX designer who bridges clean design with real
        front-end execution.
      </p>
      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => scrollToPanel(PANEL.projects)}
          className={btn}
        >
          View Projects
        </button>
        <button type="button" onClick={onOpenAbout} className={btn}>
          Learn More About Me
        </button>
      </div>
    </>
  );

  const backgroundContent = (
    <>
      <p className="mb-3 text-xs font-medium tracking-[0.14em] text-accent">
        BACKGROUND
      </p>
      <h2 className="mb-5 font-display text-3xl font-medium text-ink">
        The Designer Behind the Work.
      </h2>
      <p className="text-sm leading-relaxed text-ink-2">
        4th-year BSIT student at QCU. UI/UX Design Intern at Enov8tive. Co-Owner
        of DNMS Clothing Line. Full-stack developer turned designer who still
        writes his own components.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {[
          "Figma",
          "React.js & Tailwind",
          "Design Systems",
          "Brand Identity",
          "Prototyping",
          "Full-Stack Dev",
        ].map((s) => (
          <span
            key={s}
            className="rounded-full border border-accent/40 px-3 py-1 text-xs text-accent"
          >
            {s}
          </span>
        ))}
      </div>
    </>
  );

  /* ---------- Fade para sa Hero at Background ---------- */
  const fade = (on: boolean) =>
    `transition-all duration-700 ease-out ${
      on ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
    }`;

  const heroNode = (
    <div className={fade(activePanel === PANEL.hero)}>{heroContent}</div>
  );
  const backgroundNode = (
    <div className={fade(activePanel === PANEL.background)}>
      {backgroundContent}
    </div>
  );

  /* ---------- Unang render: wala pang desisyon ---------- */
  if (stacked === null) {
    return <section className="h-screen bg-bg" />;
  }

  /* ---------- STACKED: phone at tablet portrait ---------- */
  if (stacked) {
    return (
      <section className="relative overflow-x-clip bg-bg">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 15% 8%, rgba(0,229,184,0.09), transparent 55%)",
          }}
        />
        <div className="relative flex flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6">
          {/* Hero */}
          <div
            ref={setRef(PANEL.hero)}
            className={`${stackBase} flex min-h-[calc(100svh-3rem)] flex-col justify-center`}
          >
            {heroNode}
          </div>

          {/* Background */}
          <div ref={setRef(PANEL.background)} className={stackBase}>
            {backgroundNode}
          </div>

          {/* Process */}
          <div ref={setRef(PANEL.process)} className={stackBase}>
            <Process embedded active={activePanel === PANEL.process} />
          </div>

          {/* UI Lab */}
          <div ref={setRef(PANEL.uiLab)} className={stackBase}>
            <UiLab embedded active={activePanel === PANEL.uiLab} />
          </div>

          {/* Projects */}
          <div ref={setRef(PANEL.projects)} className={stackWide}>
            <Projects embedded active={activePanel === PANEL.projects} />
          </div>

          {/* Contact */}
          <div ref={setRef(PANEL.contact)} className={stackBase}>
            <Footer embedded active={activePanel === PANEL.contact} />
          </div>
        </div>
      </section>
    );
  }

  /* ---------- SPHERE: desktop at tablet landscape ---------- */
  return (
    <section
      ref={sectionRef}
      className="relative bg-bg overflow-clip"
      style={{ height: `${PANEL_COUNT * 100}vh` }}
    >
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ perspective: "1000px", perspectiveOrigin: "50% 45%" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ pointerEvents: "none", zIndex: 0 }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, #0A0B0D 90%)",
            zIndex: 1,
          }}
        />

        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformStyle: "preserve-3d", zIndex: 2 }}
        >
          {/* Panel 0 — Hero */}
          <div
            ref={setRef(PANEL.hero)}
            className={panelBase}
            style={panelStyle}
          >
            {heroNode}
          </div>

          {/* Panel 1 — Background */}
          <div
            ref={setRef(PANEL.background)}
            className={panelBase}
            style={panelStyle}
          >
            {backgroundNode}
          </div>

          {/* Panel 2 — Process */}
          <div
            ref={setRef(PANEL.process)}
            className={panelBase}
            style={panelStyle}
          >
            <Process embedded active={activePanel === PANEL.process} />
          </div>

          {/* Panel 3 — UI Lab */}
          <div
            ref={setRef(PANEL.uiLab)}
            className={panelBase}
            style={panelStyle}
          >
            <UiLab embedded active={activePanel === PANEL.uiLab} />
          </div>

          {/* Panel 4 — Projects (mas malapad) */}
          <div
            ref={setRef(PANEL.projects)}
            className={panelWide}
            style={panelStyle}
          >
            <Projects embedded active={activePanel === PANEL.projects} />
          </div>

          {/* Panel 5 — Contact */}
          <div
            ref={setRef(PANEL.contact)}
            className={panelBase}
            style={panelStyle}
          >
            <Footer embedded active={activePanel === PANEL.contact} />
          </div>
        </div>
      </div>
    </section>
  );
}
