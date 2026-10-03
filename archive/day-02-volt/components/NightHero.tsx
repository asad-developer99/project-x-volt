"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import { onReveal } from "./RaceLoader";
import { hero } from "../content";

// Light streaks that shoot right → left behind the runner, in the photo's own colours.
// top = % from the top of the hero (the photo's streaks sit at ~30–45%), dur/delay in seconds.
const STREAKS = [
  { top: 31, w: 34, color: "#5fe0e6", o: 0.75, dur: 1.6, delay: 0.2 },
  { top: 36.5, w: 22, color: "#ff3b3b", o: 0.8, dur: 2.1, delay: 1.1 },
  { top: 40, w: 28, color: "#ffa640", o: 0.7, dur: 1.9, delay: 0.6 },
  { top: 33.5, w: 18, color: "#c8ff1a", o: 0.9, dur: 1.3, delay: 1.9 },
  { top: 43, w: 40, color: "#5fe0e6", o: 0.55, dur: 2.4, delay: 2.6 },
  { top: 38.5, w: 16, color: "#ff3b3b", o: 0.7, dur: 1.5, delay: 3.3 },
];

type Drop = { x: number; y: number; len: number; speed: number; alpha: number; width: number };

/** Falling rain on a canvas: 3 depths, slight slant, a few splash sparks near the front shoe. Pauses off-screen. */
function useRain(canvas: React.RefObject<HTMLCanvasElement | null>, box: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const SLANT = -0.22; // x per y: drops drift left, with the runner's direction
    let w = 0;
    let h = 0;
    let drops: Drop[] = [];
    let sparks: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
    let raf = 0;
    let visible = true;
    let last = 0;

    const make = (anyY: boolean): Drop => {
      const depth = Math.random(); // 0 = far, 1 = close
      return {
        x: Math.random() * (w + h * 0.3),
        y: anyY ? Math.random() * h : -40 - Math.random() * h * 0.3,
        len: 10 + depth * 26,
        speed: 700 + depth * 1100,
        alpha: 0.12 + depth * 0.32,
        width: 0.6 + depth * 0.9,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = w < 768 ? 70 : 160;
      drops = Array.from({ length: count }, () => make(true));
    };

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, last ? (t - last) / 1000 : 0.016);
      last = t;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      for (const d of drops) {
        d.y += d.speed * dt;
        d.x += d.speed * dt * SLANT;
        if (d.y - d.len > h || d.x < -40) Object.assign(d, make(false));
        ctx.strokeStyle = `rgba(214,236,240,${d.alpha})`;
        ctx.lineWidth = d.width;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.len * SLANT, d.y - d.len);
        ctx.stroke();
      }
      // splash sparks where the front shoe hits the road (~66% / 70% of the photo)
      if (Math.random() < 0.35) {
        sparks.push({ x: w * (0.6 + Math.random() * 0.14), y: h * (0.7 + Math.random() * 0.04), vx: (Math.random() - 0.5) * 160, vy: -90 - Math.random() * 180, life: 1 });
      }
      sparks = sparks.filter((s) => s.life > 0);
      for (const s of sparks) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vy += 520 * dt;
        s.life -= dt * 1.8;
        ctx.fillStyle = `rgba(230,250,210,${Math.max(0, s.life) * 0.7})`;
        ctx.fillRect(s.x, s.y, 1.6, 1.6);
      }
    };

    const play = () => {
      cancelAnimationFrame(raf);
      last = 0;
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    resize();
    play();
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      play();
    });
    io.observe(box.current!);
    const onVis = () => play();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
    };
  }, [canvas, box]);
}

/**
 * H6 variant: the brand wordmark over a living photo. hero-run.jpg is animated in code
 * (slow zoom, light streaks, rain, pulsing lime glow) and loops forever. Bottom: the live drop strip.
 */
export default function NightHero() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useRain(canvas, root);

  useEffect(() => {
    return onReveal(() => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root.current);
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(q(".hw"), { yPercent: 105, duration: 1.1, stagger: 0.08 }, 0.05)
        .from(q(".hi"), { y: 26, opacity: 0, duration: 0.9, stagger: 0.07 }, 0.35)
        .from(q(".hs"), { xPercent: -8, opacity: 0, duration: 1 }, 0.5);
    });
  }, []);

  return (
    <section ref={root} id="top" className="slant-bottom relative h-[100svh] min-h-[640px] overflow-hidden bg-bg" style={{ "--slant": "3.5vw" } as React.CSSProperties}>
      {/* ?record=1: first stop, 3 s on the hero */}
      <div aria-hidden data-record-label="Hero" data-record-time="0" data-record-hold="3" className="pointer-events-none absolute inset-x-0 top-0 h-px" />

      {/* 1. the photo, slowly zooming toward the shoes */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={hero.image}
          alt="Runner in lime Volt Runners shoes splashing across a wet city road at night"
          fetchPriority="high"
          className="hero-zoom absolute inset-0 h-full w-full object-cover object-[72%_50%] md:object-center"
        />
      </div>

      {/* 2. light streaks */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {STREAKS.map((s, i) => (
          <span
            key={i}
            className="streak"
            style={
              {
                top: `${s.top}%`,
                width: `${s.w}vw`,
                background: `linear-gradient(90deg, ${s.color}, ${s.color}00)`,
                boxShadow: `0 0 12px 1px ${s.color}88`,
                animationDuration: `${s.dur}s`,
                animationDelay: `${s.delay}s`,
                "--o": s.o,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* 3. rain */}
      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* 4. pulsing lime glow around the front shoe + a wash on the road reflection */}
      <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-screen">
        <div className="hero-glow absolute top-[48%] left-[70%] h-[46vw] w-[46vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(200,255,26,.42),rgba(200,255,26,.12)_45%,transparent)] max-md:top-[52%] max-md:left-[74%] max-md:h-[90vw] max-md:w-[90vw]" />
        <div className="hero-glow absolute right-[8%] bottom-[-8%] h-[34vh] w-[42vw] rounded-full bg-[radial-gradient(closest-side,rgba(200,255,26,.22),transparent)]" style={{ animationDelay: "-1.6s" }} />
      </div>

      {/* 5. readability: dark from the left, vignette */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,10,.92)_0%,rgba(8,9,10,.7)_30%,rgba(8,9,10,.1)_58%,transparent_75%)] max-md:bg-[linear-gradient(180deg,rgba(8,9,10,.6)_0%,rgba(8,9,10,.2)_40%,rgba(8,9,10,.85)_100%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_180px_40px_rgba(0,0,0,.65)]" />

      {/* Words */}
      <div className="container-x relative z-10 flex h-full flex-col justify-end pt-[var(--nav-h)] pb-[calc(3.5vw+92px)] md:justify-center md:pb-[calc(3.5vw+56px)]">
        <p className="hi eyebrow mb-5">{hero.eyebrow}</p>
        <h1 className="font-display text-[clamp(84px,12.6vw,232px)] leading-[0.84]" aria-label={hero.words.join(" ")}>
          {hero.words.map((w, i) => (
            <span key={w} className="block overflow-hidden pr-[0.1em]">
              <span className={`hw lean block ${i === 1 ? "text-accent" : ""}`}>{w}</span>
            </span>
          ))}
        </h1>
        <div className="mt-7 flex max-w-[560px] flex-col gap-6 md:mt-9">
          <p className="hi flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="font-display lean text-[clamp(30px,2.6vw,44px)]">{hero.line}</span>
            <span className="max-w-[380px] text-[15px] leading-relaxed text-fg/75">{hero.text}</span>
          </p>
          <div className="hi flex flex-wrap gap-3">
            <Button href={hero.primary.href} label={hero.primary.label} />
            <Button href={hero.secondary.href} label={hero.secondary.label} style="outline" />
          </div>
        </div>
      </div>

      {/* Bottom: live drop strip (sits above the slanted edge) */}
      <div className="hs absolute inset-x-0 bottom-[calc(3.5vw+18px)] z-10 md:bottom-[calc(3.5vw+10px)]">
        <div className="container-x">
          <div className="chamfer flex items-center gap-4 overflow-hidden bg-[rgba(8,9,10,.85)] px-4 py-3 md:bg-[rgba(8,9,10,.72)] md:backdrop-blur-md md:inline-flex md:gap-6 md:px-6" style={{ "--cut": "12px" } as React.CSSProperties}>
            <span className="flex items-center gap-2 text-[12px] font-bold tracking-[0.18em] whitespace-nowrap text-accent uppercase">
              <span className="live-dot h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(200,255,26,.7)]" />
              {hero.strip[4]}
            </span>
            {hero.strip.slice(0, 4).map((s, i) => (
              <span key={s} className={`tnum text-[12px] font-semibold tracking-[0.14em] whitespace-nowrap uppercase md:text-[13px] ${i === 2 ? "text-fg" : "text-fg/70"} ${i === 0 || i === 3 ? "hidden sm:inline" : ""}`}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
