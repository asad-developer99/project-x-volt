"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useFramePlayer } from "@/components/engine/useFramePlayer";
import Button from "@/components/ui/Button";
import { onReveal } from "./ClockLoader";
import { anatomy, FRAMES, hero } from "../content";

const PIN = 5; // screens of scroll while pinned
const GROW = 0.14; // part of the scroll where the plate grows to full screen
const VIDEO_END = 0.95; // the video is fully exploded here; the rest is a short hold
const RADIUS = 22;

// Where the watch dial sits in the first frame (fractions of the frame) and how tall it is.
const WATCH = { x: 0.7, y: 0.53, h: 0.71 };

const BAND = 150; // laptop: dark space kept above and below the video for the callouts
const CALLOUT_W = 240;

/**
 * Where the exploded video sits once the plate is full screen.
 * Laptop: scaled down so the callouts live in the dark bands above/below it, never on the watch.
 * Phone: scaled up and centred between the heading (top) and the caption (bottom).
 */
function frameLayout(W: number, H: number, end = false) {
  const dw = Math.min(W, (H * 16) / 9);
  const dh = (dw * 9) / 16;
  const mobile = W < 768;
  const scale = mobile ? (end ? 1.08 : 1.3) : Math.min(0.8, (H - 2 * BAND) / dh);
  const y = mobile ? (250 + (H - 140)) / 2 - H / 2 : 0;
  // Phone: start centred on the watch, pan back to the middle (and zoom out a little) as it opens
  const x = mobile && !end ? -scale * (WATCH.x - 0.5) * dw : 0;
  const fw = dw * scale;
  const fh = dh * scale;
  return { scale, x, y, endScale: mobile ? 1.08 : scale, fl: (W - fw) / 2, ft: (H - fh) / 2 + y, fw, fh };
}

/** Put the frame box on an element as CSS variables (used by the callouts). */
function setFrameVars(el: HTMLElement, end = false) {
  const f = frameLayout(el.clientWidth, el.clientHeight, end);
  el.style.setProperty("--fl", `${f.fl}px`);
  el.style.setProperty("--fw", `${f.fw}px`);
  el.style.setProperty("--ft", `${f.ft}px`);
  el.style.setProperty("--fh", `${f.fh}px`);
  return f;
}

// Soft edges so the scaled-down video melts into the plate
const EDGE_MASK = {
  maskImage: "linear-gradient(to bottom, transparent, #000 8%, #000 92%, transparent), linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
  maskComposite: "intersect",
  WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 8%, #000 92%, transparent), linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
  WebkitMaskComposite: "source-in",
} as const;

type Part = (typeof anatomy.parts)[number];

function Callout({ p, i, show = false }: { p: Part; i: number; show?: boolean }) {
  const top = p.side === "top";
  return (
    <div
      data-part={i}
      className={`absolute hidden -translate-x-1/2 text-center md:block ${show ? "" : "opacity-0"}`}
      style={{
        width: CALLOUT_W,
        left: `clamp(${CALLOUT_W / 2 + 8}px, calc(var(--fl) + var(--fw) * ${p.x}), calc(100% - ${CALLOUT_W / 2 + 8}px))`,
        ...(top ? { bottom: "calc(100% - var(--ft) + 6px)" } : { top: "calc(var(--ft) + var(--fh) + 6px)" }),
      }}
    >
      {!top && <span className="part-line mx-auto mb-2.5 block h-4 w-px origin-top bg-[#f3ece1]/60" />}
      <p className="text-[12px] font-semibold tracking-[0.2em] text-[#d9b48f] uppercase">
        <span className="tnum">{p.n}</span> · {p.name}
      </p>
      <p className="mt-1.5 text-[13px] leading-snug text-[#f3ece1]/75">{p.text}</p>
      {top && <span className="part-line mx-auto mt-2.5 block h-4 w-px origin-bottom bg-[#f3ece1]/60" />}
    </div>
  );
}

/**
 * Hero (H8): headline on paper + the watch inside a framed dark plate + spec bar.
 * Scrolling grows the plate to full screen, then scrubs the exploded video with numbered callouts.
 */
export default function PlateHero() {
  const outer = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const specs = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const player = useFramePlayer(FRAMES, canvas, { fit: "contain", blockLoader: true });
  const [still, setStill] = useState(false);

  useEffect(() => {
    // Keep the elements (React dev mode detaches refs before cleanup runs)
    const stageEl = stage.current!;
    const slotEl = slot.current!;

    // Plate window + the transform that centres the watch in it
    const plate = () => {
      const s = stageEl.getBoundingClientRect();
      const r = slotEl.getBoundingClientRect();
      const W = s.width;
      const H = s.height;
      const dw = Math.min(W, (H * 16) / 9);
      const dh = (dw * 9) / 16;
      const px = (W - dw) / 2 + WATCH.x * dw;
      const py = (H - dh) / 2 + WATCH.y * dh;
      const scale = (0.8 * r.height) / (WATCH.h * dh);
      const cx = r.left - s.left + r.width / 2;
      const cy = r.top - s.top + r.height / 2;
      return {
        clipPath: `inset(${r.top - s.top}px ${s.right - r.right}px ${s.bottom - r.bottom}px ${r.left - s.left}px round ${RADIUS}px)`,
        x: cx - (W / 2 + scale * (px - W / 2)),
        y: cy - (H / 2 + scale * (py - H / 2)),
        scale,
      };
    };

    if (prefersReducedMotion()) {
      setStill(true);
      player.current.seek(0);
      const apply = () => {
        const p = plate();
        gsap.set(clip.current, { clipPath: p.clipPath });
        gsap.set(canvas.current, { x: p.x, y: p.y, scale: p.scale });
      };
      apply();
      window.addEventListener("resize", apply);
      return () => window.removeEventListener("resize", apply);
    }

    const parts = anatomy.parts.map((p) => GROW + p.at * (VIDEO_END - GROW));
    const full = () => setFrameVars(stageEl);
    full();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: outer.current, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
        onUpdate: () => {
          const t = tl.progress();
          player.current.seek(Math.min(1, Math.max(0, (t - GROW) / (VIDEO_END - GROW))));
          if (counter.current) counter.current.textContent = String(parts.filter((a) => t >= a).length).padStart(2, "0");
        },
      });
      tl.to({}, { duration: 1 });
      tl.fromTo(clip.current, { clipPath: () => plate().clipPath }, { clipPath: "inset(0px 0px 0px 0px round 0px)", duration: GROW, ease: "power2.inOut" }, 0);
      tl.fromTo(
        canvas.current,
        { x: () => plate().x, y: () => plate().y, scale: () => plate().scale },
        { x: () => full().x, y: () => full().y, scale: () => full().scale, duration: GROW, ease: "power2.inOut" },
        0,
      );
      tl.to(canvas.current, { x: 0, scale: () => full().endScale, duration: VIDEO_END - GROW, ease: "power1.inOut" }, GROW);
      tl.to(copy.current, { opacity: 0, x: -60, duration: GROW * 0.6 }, 0);
      tl.to(specs.current, { opacity: 0, y: 30, duration: GROW * 0.5 }, 0);
      tl.fromTo(head.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.05 }, GROW);
      tl.to(head.current, { opacity: 0, y: -20, duration: 0.05 }, parts[0] - 0.03);
      tl.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, duration: VIDEO_END - GROW }, GROW);
      tl.fromTo("[data-hud]", { opacity: 0 }, { opacity: 1, duration: 0.04 }, GROW);

      anatomy.parts.forEach((_, i) => {
        const at = parts[i];
        tl.fromTo(`[data-part="${i}"]`, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.04 }, at);
        tl.fromTo(`[data-part="${i}"] .part-line`, { scaleY: 0 }, { scaleY: 1, duration: 0.05 }, at);
        tl.fromTo(`[data-part-m="${i}"]`, { opacity: 0 }, { opacity: 1, duration: 0.03 }, at);
        if (i < parts.length - 1) tl.to(`[data-part-m="${i}"]`, { opacity: 0, duration: 0.03 }, parts[i + 1] - 0.02);
      });
    }, outer);

    const off = onReveal(() => {
      gsap.from(outer.current!.querySelectorAll(".hero-line > span"), { yPercent: 110, duration: 1.2, ease: "power4.out", stagger: 0.1 });
      gsap.from(outer.current!.querySelectorAll("[data-hero-fade]"), { opacity: 0, y: 20, duration: 1, delay: 0.4, stagger: 0.1, ease: "power3.out" });
      gsap.from(clip.current, { opacity: 0, duration: 1.4, ease: "power2.out" });
    });

    return () => {
      off();
      ctx.revert();
    };
  }, [player]);

  return (
    <>
      <section ref={outer} id="top" className="relative" style={{ height: still ? "100vh" : `${(PIN + 1) * 100}vh` }}>
        {!still && <div data-nav-dark className="pointer-events-none absolute inset-x-0 bottom-0" style={{ top: `${GROW * 0.85 * PIN * 100}vh` }} />}
        <div id="anatomy" className="absolute inset-x-0" style={{ top: `${(GROW + 0.02) * PIN * 100}vh` }} />
        {/* ?record=1 section timeline (seconds): see docs/RECORDING.md */}
        {!still && (
          <>
            <div data-record-label="Hero" data-record-time="0" data-record-hold="3" className="pointer-events-none absolute inset-x-0 top-0" />
            <div data-record-label="Anatomy" data-record-time="1.5" className="pointer-events-none absolute inset-x-0" style={{ top: `${GROW * PIN * 100}vh` }} />
            <div data-record-label="Anatomy: all 5 parts" data-record-time="7" className="pointer-events-none absolute inset-x-0" style={{ top: `${PIN * 100}vh` }} />
          </>
        )}

        <div ref={stage} className="sticky top-0 h-screen w-full overflow-hidden" >
          {/* The plate: a full-screen canvas seen through a rounded window */}
          <div ref={clip} className="absolute inset-0 bg-[var(--plate)]" style={{ clipPath: "inset(96px 80px 120px 46% round 22px)" }}>
            <canvas ref={canvas} className="absolute inset-0 h-full w-full" style={EDGE_MASK} />
          </div>
          <div ref={slot} aria-hidden className="pointer-events-none absolute inset-x-5 top-[max(40vh,340px)] bottom-[96px] md:inset-x-auto md:right-[clamp(20px,5vw,80px)] md:left-[46%] md:top-[96px] md:bottom-[120px]" />

          {/* Copy on paper */}
          <div ref={copy} className="container-x absolute inset-x-0 top-[96px] md:top-[72px] md:bottom-[120px] md:flex md:items-center">
            <div className="max-w-[40vw] max-md:max-w-none">
              <p data-hero-fade className="ref mb-6">
                {hero.eyebrow}
              </p>
              <h1 className="font-display text-[clamp(52px,7.2vw,124px)]">
                {hero.title.map((line, i) => (
                  <span key={i} className={`hero-line block overflow-hidden pb-[0.05em] ${i === 2 ? "italic" : ""}`}>
                    <span className="block">{line}</span>
                  </span>
                ))}
              </h1>
              <p data-hero-fade className="mt-7 hidden max-w-sm text-[15px] leading-relaxed text-muted md:block">
                {hero.text}
              </p>
              <div data-hero-fade className="mt-9 hidden flex-wrap items-center gap-4 md:flex">
                <Button href="#collection" label={`Reserve · ${hero.price}`} />
                <a href="#anatomy" className="link-underline pb-0.5 text-[12px] font-semibold tracking-[0.16em] uppercase">
                  See inside ↓
                </a>
              </div>
            </div>
          </div>

          {/* Spec bar */}
          <div ref={specs} data-hero-fade className="container-x absolute inset-x-0 bottom-0 h-[96px] md:h-[120px]">
            <div className="grid h-full grid-cols-3 content-center items-start border-t border-line md:grid-cols-5">
              {hero.specs.map((s, i) => (
                <div key={s.label} className={`${i > 2 ? "hidden md:block" : ""} ${i > 0 ? "md:border-l md:border-line md:pl-6" : ""}`}>
                  <p className="ref text-[12px]">{s.label}</p>
                  <p className="tnum mt-1 text-[14px] font-medium md:text-[15px]">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {!still && (
            <>
              <div ref={head} className="container-x absolute inset-x-0 top-[96px] text-[#f3ece1] opacity-0 md:top-1/2 md:-translate-y-1/2">
                <p className="eyebrow mb-5 !text-[#d9b48f]">{anatomy.eyebrow}</p>
                <h2 className="font-display max-w-[30vw] text-[clamp(36px,4.2vw,76px)] max-md:max-w-none">{anatomy.heading}</h2>
              </div>

              {anatomy.parts.map((p, i) => (
                <Callout key={p.n} p={p} i={i} />
              ))}
              {anatomy.parts.map((p, i) => (
                <div key={p.n} data-part-m={i} className="absolute inset-x-5 bottom-[64px] text-[#f3ece1] opacity-0 md:hidden">
                  <p className="text-[12px] font-semibold tracking-[0.2em] text-[#d9b48f] uppercase">
                    {p.n} · {p.name}
                  </p>
                  <p className="mt-1 text-sm text-[#f3ece1]/80">{p.text}</p>
                </div>
              ))}

              <div data-hud className="container-x absolute inset-x-0 bottom-6 flex items-center gap-5 text-[#f3ece1]/70 opacity-0">
                <span className="tnum text-[12px] font-semibold tracking-[0.2em]">
                  PART <span ref={counter}>00</span> / 0{anatomy.parts.length}
                </span>
                <div className="h-px flex-1 bg-[#f3ece1]/15">
                  <div ref={bar} className="h-full origin-left scale-x-0 bg-[#d9b48f]" />
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {still && <StillAnatomy />}
    </>
  );
}

/** ?static=1 version of the anatomy: the fully exploded frame with every callout showing. */
function StillAnatomy() {
  const ref = useRef<HTMLElement>(null);
  const [box, setBox] = useState<ReturnType<typeof frameLayout> | null>(null);

  useEffect(() => {
    const el = ref.current!;
    const apply = () => setBox(setFrameVars(el, true));
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  return (
    <section ref={ref} data-nav-dark className="relative h-screen overflow-hidden bg-[var(--plate)] text-[#f3ece1]">
      {box && (
        <img
          src={`${FRAMES}/frame_0160.webp`}
          alt="Meridian watch taken apart into its parts"
          className="absolute max-w-none"
          style={{ left: box.fl, top: box.ft, width: box.fw, height: box.fh, ...EDGE_MASK }}
        />
      )}
      <div className="container-x absolute inset-x-0 top-[96px] md:hidden">
        <p className="eyebrow mb-4 !text-[#d9b48f]">{anatomy.eyebrow}</p>
        <h2 className="font-display text-[36px]">{anatomy.heading}</h2>
      </div>
      {anatomy.parts.map((p, i) => (
        <Callout key={p.n} p={p} i={i} show />
      ))}
      <div className="container-x absolute inset-x-0 bottom-6 md:hidden">
        {anatomy.parts.map((p) => (
          <p key={p.n} className="text-[12px] font-semibold tracking-[0.16em] text-[#d9b48f] uppercase">
            {p.n} · {p.name}
          </p>
        ))}
      </div>
    </section>
  );
}
