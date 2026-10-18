// components/sections/AboutMeDrawer.tsx  (PALITAN ANG BUONG FILE)
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

const skills = [
  "UI/UX Design",
  "Figma",
  "Adobe Creative Suite",
  "Wireframing",
  "Prototyping",
  "Design Systems",
  "Brand Identity",
  "Typography",
  "Color Theory",
  "Auto-Layout",
  "Interactive Prototyping",
  "Social Media Graphics",
  "HTML5 & CSS3",
  "JavaScript",
  "TypeScript",
  "React.js",
  "Tailwind CSS",
  "REST APIs",
  "Git & GitHub",
  "Responsive Web Design",
  "Client Communication",
  "Social Media Management",
  "Google Workspace",
  "Notion & Asana",
  "Project Coordination",
];

const certificates = [
  {
    name: "UI/UX Designer Career Roadmap",
    issuer: "BreakPoint Labs",
    year: "Oct 2026",
    image: "/certificates/cert-uiux.png",
  },
  {
    name: "Frontend Developer Career Roadmap",
    issuer: "BreakPoint Labs",
    year: "Oct 2026",
    image: "/certificates/cert-frontend.png",
  },
  {
    name: "Virtual Assistant Career Roadmap",
    issuer: "BreakPoint Labs",
    year: "Oct 2026",
    image: "/certificates/cert-va.png",
  },
];

const resumePages = [
  "/resume/resume-1.png",
  "/resume/resume-2.png",
  "/resume/resume-3.png",
];

const slides = [
  {
    label: "Fun Facts / Personality",
    cards: [
      "4th-year BSIT student at Quezon City University while working as a UI/UX Designer Intern at Enov8tive Technology Solutions balancing both without slowing down on either.",
      "Based in Quezon City, but comfortable working in fast-paced remote setups — client comms, social media, ops, all in a day's work.",
    ],
  },
  {
    label: "Designer / Developer Duality",
    cards: [
      'Full-stack developer on the A.R.M.O.R. System, but still can\'t resist going back to Figma to fix a "slightly off" 2px spacing.',
      "Lead UI/UX Designer on Space Codessey, where solving real programming problems doubles as gameplay.",
    ],
  },
  {
    label: "Entrepreneurial / Personal Side",
    cards: [
      "Co-Owner and Lead Creative Strategist at DNMS (Dunamis) Clothing Line — handles brand identity, social media, and order fulfillment.",
      "Before UI/UX design, worked as a cafe barista/manager at Cafe De Franz while studying — where the multitasking-under-pressure skills came from.",
    ],
  },
];

// Minimum na layo ng swipe (px) para mabilang
const SWIPE_MIN = 50;

interface LightboxProps {
  images: string[];
  startIndex?: number;
  onClose: () => void;
  downloadHref?: string;
  downloadName?: string;
}

function Lightbox({
  images,
  startIndex = 0,
  onClose,
  downloadHref,
}: LightboxProps) {
  const [current, setCurrent] = useState(startIndex);
  const overlayRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % images.length);
      if (e.key === "ArrowLeft")
        setCurrent((c) => (c - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [images.length, onClose]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null || images.length < 2) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < SWIPE_MIN) return;
    setCurrent((c) =>
      dx < 0
        ? (c + 1) % images.length
        : (c - 1 + images.length) % images.length,
    );
  };

  return createPortal(
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 z-999999 flex items-center justify-center bg-black/90 p-3 backdrop-blur-sm sm:p-4"
    >
      <div className="relative flex max-h-[92dvh] w-full max-w-3xl flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted">
            {images.length > 1 ? `${current + 1} / ${images.length}` : ""}
          </span>
          <div className="flex items-center gap-2">
            {downloadHref && (
              <a
                href={downloadHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-accent bg-accent/10 px-3 py-2 text-xs text-accent transition hover:bg-accent hover:text-bg"
              >
                ↓ Download PDF
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-elevated px-3 py-2 text-xs text-ink-2 transition hover:border-accent hover:text-accent"
            >
              ✕ Close
            </button>
          </div>
        </div>
        <div
          className="relative overflow-hidden rounded-xl border border-border"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <Image
            src={images[current]}
            alt={`Page ${current + 1}`}
            width={1200}
            height={900}
            className="h-auto w-full"
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous"
                onClick={() =>
                  setCurrent((c) => (c - 1 + images.length) % images.length)
                }
                className="absolute inset-y-0 left-0 flex w-10 items-center justify-center bg-black/30 text-xl text-white/60 transition hover:bg-accent/20 hover:text-accent sm:w-12"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => setCurrent((c) => (c + 1) % images.length)}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center bg-black/30 text-xl text-white/60 transition hover:bg-accent/20 hover:text-accent sm:w-12"
              >
                ›
              </button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex justify-center">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to page ${i + 1}`}
                onClick={() => setCurrent(i)}
                className="p-1.5"
              >
                <span
                  className={`block h-1.5 w-1.5 rounded-full transition-colors ${i === current ? "bg-accent" : "bg-border"}`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentSlide: number;
  setCurrentSlide: (n: number) => void;
}

export default function AboutMeDrawer({
  isOpen,
  onClose,
  currentSlide,
  setCurrentSlide,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  // true lang kapag may totoong mouse (hindi touch)
  const [canHover, setCanHover] = useState(false);
  const [lightbox, setLightbox] = useState<{
    images: string[];
    start?: number;
    download?: string;
    dlName?: string;
  } | null>(null);
  const [certHover, setCertHover] = useState<number | null>(null);
  const [resumeHover, setResumeHover] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null,
  );

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Sumusunod lang ang mouse listener kapag may nakabukas na preview
  const previewOn = canHover && (certHover !== null || resumeHover);
  useEffect(() => {
    if (!previewOn) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [previewOn]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape para isara ang drawer (kapag walang lightbox na nakabukas)
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !lightbox) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, lightbox, onClose]);

  if (!isOpen || !mounted) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  const prev = () =>
    setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);
  const next = () => setCurrentSlide((currentSlide + 1) % slides.length);

  // Swipe para sa Fun Facts
  const onSlideTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onSlideTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < SWIPE_MIN) return;
    if (dx < 0) next();
    else prev();
  };

  const arrowClass =
    "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-elevated text-[14px] text-ink-2 transition-all duration-200 hover:border-accent hover:bg-accent hover:text-bg hover:shadow-[0_0_20px_rgba(0,229,184,0.75)] md:h-8 md:w-8";

  const modalContent = (
    <>
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.start}
          onClose={() => setLightbox(null)}
          downloadHref={lightbox.download}
          downloadName={lightbox.dlName}
        />
      )}

      {/* Floating mouse-follow previews (desktop na may mouse lang) */}
      {canHover && certHover !== null && mousePos && (
        <div
          className="pointer-events-none fixed z-999998 w-56 overflow-hidden rounded-xl border border-accent shadow-[0_0_24px_-4px_rgba(0,229,184,0.4)]"
          style={{ left: mousePos.x + 16, top: mousePos.y + 16 }}
        >
          <Image
            src={certificates[certHover].image}
            alt={certificates[certHover].name}
            width={224}
            height={158}
            className="h-auto w-full"
          />
        </div>
      )}

      {canHover && resumeHover && mousePos && (
        <div
          className="pointer-events-none fixed z-999998 w-56 overflow-hidden rounded-xl border border-accent shadow-[0_0_24px_-4px_rgba(0,229,184,0.4)]"
          style={{ left: mousePos.x + 16, top: mousePos.y + 16 }}
        >
          <Image
            src={resumePages[0]}
            alt="Resume preview"
            width={224}
            height={290}
            className="h-auto w-full"
          />
        </div>
      )}

      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className="fixed inset-0 z-99998 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-4 md:p-6"
      >
        <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface text-ink shadow-2xl">
          <div className="soft-scroll max-h-[92dvh] overflow-y-auto">
            {/* Sticky header + close button */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border/50 bg-surface px-5 py-3 sm:px-7 md:px-8">
              <p className="font-display text-[11px] uppercase tracking-[0.12em] text-muted">
                ABOUT ME{" "}
                <span className="hidden text-ink-2 sm:inline">
                  | The Designer Behind the Screens
                </span>
              </p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-elevated text-sm text-ink-2 transition hover:border-accent hover:text-accent"
              >
                ✕
              </button>
            </div>

            <div className="p-5 sm:p-7 md:p-8">
              {/* Photos */}
              <div className="mb-5 flex gap-2.5">
                <Image
                  src="/larence-1.png"
                  alt="Larence photo 1"
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-[10px] border border-border object-cover object-top"
                />
                <Image
                  src="/larence-2.png"
                  alt="Larence photo 2"
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-[10px] border border-border object-cover object-[center_50%]"
                />
              </div>

              {/* Name + GitHub */}
              <h1 className="mb-1.5 font-display text-2xl font-semibold text-ink md:text-[28px]">
                Larence Mcdale S. Pinto
              </h1>
              <a
                href="https://github.com/Yenceee"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-4 inline-flex items-center gap-1.5 py-1 text-[12px] text-muted transition hover:text-accent"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                </svg>
                github.com/Yenceee
              </a>

              {/* Bio */}
              <p className="mb-6 text-[13px] leading-[1.7] text-ink-2">
                Versatile and user-focused UI/UX Designer, Graphic Artist, and
                Virtual Assistant with hands-on expertise in mobile/desktop
                interface design, digital marketing, client management, and
                visual strategy. Proven track record in designing intuitive web
                and mobile applications, creating interactive Figma prototypes,
                and leading brand identity operations. Leverages a strong
                background in full-stack web development to create designs that
                are visually engaging, user-friendly, and technically feasible
                for development teams. Adept at handling administrative
                workflows, social media management, and client communication in
                fast-paced remote environments.
              </p>

              {/* Skills */}
              <div className="mb-8 grid grid-cols-2 gap-2 md:grid-cols-3">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="flex min-h-9 items-center justify-center rounded-full border border-accent px-3 py-1.5 text-center font-display text-[12px] leading-tight text-accent"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Certificates */}
              <div className="mb-8">
                <h2 className="mb-1 font-display text-[16px] font-semibold text-ink">
                  Certificates
                </h2>
                <p className="mb-4 text-[12px] text-muted">
                  {canHover
                    ? "Hover to preview, click to view full certificate."
                    : "Tap a certificate to view it in full."}
                </p>
                <div className="flex flex-col gap-2">
                  {certificates.map((cert, i) => (
                    <button
                      key={i}
                      type="button"
                      onMouseEnter={() => canHover && setCertHover(i)}
                      onMouseLeave={() => setCertHover(null)}
                      onClick={() => {
                        setCertHover(null);
                        setLightbox({ images: [cert.image] });
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-border bg-elevated px-4 py-3 text-left transition-all duration-200 hover:border-accent hover:shadow-[0_0_16px_-4px_rgba(0,229,184,0.3)]"
                    >
                      <div>
                        <p className="font-display text-[13px] font-medium text-ink">
                          {cert.name}
                        </p>
                        <p className="text-[11px] text-muted">
                          {cert.issuer} · {cert.year}
                        </p>
                      </div>
                      <span className="ml-3 shrink-0 text-[11px] text-accent">
                        View →
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resume */}
              <div className="mb-8">
                <h2 className="mb-1 font-display text-[16px] font-semibold text-ink">
                  Resume
                </h2>
                <p className="mb-4 text-[12px] text-muted">
                  {canHover
                    ? "Hover to preview, click to open the resume."
                    : "Tap to download the resume."}
                </p>
                <button
                  type="button"
                  onMouseEnter={() => canHover && setResumeHover(true)}
                  onMouseLeave={() => setResumeHover(false)}
                  onClick={() => {
                    setResumeHover(false);
                    const file = "/Larence_Pinto_ATS_Resume.pdf";
                    if (canHover) {
                      // Desktop: buksan sa bagong tab
                      window.open(file, "_blank");
                    } else {
                      // Phone/tablet: diretsong download
                      const a = document.createElement("a");
                      a.href = file;
                      a.download = "Larence_Pinto_ATS_Resume.pdf";
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                    }
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-elevated px-4 py-3 text-left transition-all duration-200 hover:border-accent hover:shadow-[0_0_16px_-4px_rgba(0,229,184,0.3)]"
                >
                  <div>
                    <p className="font-display text-[13px] font-medium text-ink">
                      Larence Mcdale S. Pinto
                    </p>
                    <p className="text-[11px] text-muted">
                      UI/UX Designer · Frontend Developer · Virtual Assistant
                    </p>
                  </div>
                  <span className="ml-3 shrink-0 text-[11px] text-accent">
                    {canHover ? "View →" : "Download ↓"}
                  </span>
                </button>
              </div>

              {/* Fun Facts */}
              <div>
                <h2 className="mb-1 text-center font-display text-[20px] font-semibold text-ink">
                  Fun Facts / Personality
                </h2>
                <p className="mb-4 text-center text-[12px] text-muted">
                  A few things about me beyond the design skills.
                </p>
                <div
                  className="grid"
                  onTouchStart={onSlideTouchStart}
                  onTouchEnd={onSlideTouchEnd}
                >
                  {slides.map((slide, idx) => (
                    <div
                      key={slide.label}
                      aria-hidden={idx !== currentSlide}
                      className={`col-start-1 row-start-1 ${idx === currentSlide ? "visible" : "invisible"}`}
                    >
                      <p className="mb-3 text-center font-display text-[11px] uppercase tracking-[0.08em] text-muted">
                        {slide.label}
                      </p>
                      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                        {slide.cards.map((text, i) => (
                          <div
                            key={i}
                            className="rounded-[10px] border border-border bg-elevated p-3.5 text-[12px] leading-[1.6] text-ink-2"
                          >
                            {text}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous"
                    className={arrowClass}
                  >
                    ←
                  </button>
                  <div className="flex">
                    {slides.map((_, i) => (
                      <button
                        type="button"
                        key={i}
                        aria-label={`Go to slide ${i + 1}`}
                        onClick={() => setCurrentSlide(i)}
                        className="cursor-pointer p-2"
                      >
                        <span
                          className={`block h-2 w-2 rounded-full transition-colors ${i === currentSlide ? "bg-accent" : "bg-border"}`}
                        />
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next"
                    className={arrowClass}
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
