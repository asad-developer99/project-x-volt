"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { frameUrl, getManifest } from "@/lib/frames";
import { atFromUrl, waitForClock } from "@/lib/atTime";

// The engine loader is switched off (meta.loader = false) so it can't add seconds of waiting.
// This one always takes exactly DRAW + OPEN seconds, then tells the page to play its intro.
// With &at=HH:MM:SS it shows its first frame, frozen, until that time (docs/RECORDING.md).

const DRAW = 1.8; // ring draws, 00:00 → 12:00
const OPEN = 0.7; // hole opens into the page
export const LOADER_SECONDS = DRAW + OPEN; // 2.5

let revealed = false;

/** Run once the clock loader has opened (immediately with ?static=1). */
export function onReveal(fn: () => void) {
  if (revealed) {
    fn();
    return () => {};
  }
  const h = () => fn();
  window.addEventListener("meridian:reveal", h, { once: true });
  return () => window.removeEventListener("meridian:reveal", h);
}

function reveal() {
  if (revealed) return;
  revealed = true;
  window.dispatchEvent(new Event("meridian:reveal"));
}

const loadImage = (src: string) =>
  new Promise<void>((done) => {
    const img = new Image();
    img.onload = img.onerror = () => done();
    img.src = src;
  });

/** Every frame of every sequence, every <img> on the page and the fonts. */
async function preloadAll(frameFolders: string[]) {
  const frames = await Promise.all(
    frameFolders.map(async (f) => {
      const m = await getManifest(f);
      return Array.from({ length: m.count }, (_, i) => frameUrl(f, m, i));
    }),
  );
  const pageImages = Array.from(document.images)
    .filter((img) => !img.complete)
    .map((img) => new Promise<void>((done) => ["load", "error"].forEach((e) => img.addEventListener(e, () => done(), { once: true }))));
  await Promise.all([...frames.flat().map(loadImage), ...pageImages, document.fonts.ready]);
}

const R = 104;
const C = 2 * Math.PI * R;

/**
 * I3 counter as a clock: the ring draws while the time runs 00:00 → 12:00,
 * then a hole opens from the centre of the ring into the page.
 */
export default function ClockLoader({ name, frames = [] }: { name: string; frames?: string[] }) {
  const root = useRef<HTMLDivElement>(null);
  const clock = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const ticks = useRef<SVGGElement>(null);
  const hour = useRef<SVGLineElement>(null);
  const minute = useRef<SVGLineElement>(null);
  const time = useRef<HTMLSpanElement>(null);
  const word = useRef<HTMLParagraphElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setGone(true);
      reveal();
      return;
    }
    window.scrollTo(0, 0);
    window.__lenis?.stop();

    // &at=: freeze on the first frame (00:00, name visible), preload everything, play at that time
    const target = atFromUrl();
    let ready = !target;
    let cancelClock = () => {};
    let idle: gsap.core.Tween | null = null;
    if (target) {
      const t0 = performance.now();
      preloadAll(frames).then(() => {
        ready = true;
        console.log(`[record] loader: all frames and images ready in ${((performance.now() - t0) / 1000).toFixed(1)} s`);
      });
    }

    const t = { m: 0 };
    const hole = { r: 0 };
    const big = Math.hypot(window.innerWidth, window.innerHeight);
    // open the hole from the centre of the ring, not the centre of the screen
    const r = ring.current!.getBoundingClientRect();
    root.current!.style.setProperty("--cx", `${r.left + r.width / 2}px`);
    root.current!.style.setProperty("--cy", `${r.top + r.height / 2}px`);
    const setTime = () => {
      const m = Math.round(t.m);
      time.current!.textContent = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
      hour.current!.setAttribute("transform", `rotate(${(t.m / 720) * 360} 120 120)`);
      minute.current!.setAttribute("transform", `rotate(${(t.m / 720) * 720} 120 120)`);
    };

    // context + revert: React dev mode runs this effect twice; revert undoes the first run's .from() states
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: !!target });
      tl.fromTo(ring.current, { strokeDashoffset: C }, { strokeDashoffset: 0, duration: DRAW, ease: "power2.inOut" }, 0);
      if (!target) {
        // normal load: ticks and name fade in (with &at= they are already showing on the frozen first frame)
        tl.from(ticks.current!.children, { opacity: 0, duration: 0.2, stagger: 0.015 }, 0.05);
        tl.from(word.current, { opacity: 0, y: 14, duration: 0.8, ease: "power3.out" }, 0.15);
      }
      tl.to(t, { m: 720, duration: DRAW, ease: "power2.inOut", onUpdate: setTime }, 0)
        .addLabel("open", DRAW)
        .add(() => {
          // &at= and still loading: keep the clock running until everything is in, then open
          if (ready) return;
          tl.pause();
          const spin = { a: 0 };
          idle = gsap.to(spin, {
            a: 360,
            duration: 1.2,
            ease: "none",
            repeat: -1,
            onUpdate: () => minute.current!.setAttribute("transform", `rotate(${spin.a} 120 120)`),
          });
          const wait = () => {
            if (!ready) return requestAnimationFrame(wait);
            idle?.kill();
            setTime();
            tl.play();
          };
          wait();
        }, "open")
        .to(clock.current, { scale: 2.6, opacity: 0, duration: OPEN, ease: "power3.in" }, "open")
        .to(hole, { r: big, duration: OPEN, ease: "power3.in", onUpdate: () => root.current!.style.setProperty("--hole", `${hole.r}px`) }, "open")
        .add(() => {
          window.__lenis?.start();
          reveal();
        }, `open+=${OPEN * 0.45}`)
        .add(() => setGone(true), DRAW + OPEN);

      if (target) {
        if (Date.now() < target.getTime()) console.log(`[record] loader frozen until ${target.toLocaleTimeString()}`);
        cancelClock = waitForClock(target, () => {
          if (!ready) console.warn("[record] assets not ready at start time: the loader keeps running until they are");
          tl.play(0);
        });
      }
    });

    return () => {
      cancelClock();
      idle?.kill();
      ctx.revert();
    };
  }, [frames]);

  if (gone) return null;

  return (
    <div
      ref={root}
      data-loader
      aria-hidden
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
      style={{
        maskImage: "radial-gradient(circle at var(--cx, 50%) var(--cy, 50%), transparent var(--hole, 0px), #000 calc(var(--hole, 0px) + 1px))",
        WebkitMaskImage: "radial-gradient(circle at var(--cx, 50%) var(--cy, 50%), transparent var(--hole, 0px), #000 calc(var(--hole, 0px) + 1px))",
      }}
    >
      <div ref={clock} className="flex flex-col items-center">
        <svg viewBox="0 0 240 240" className="h-[min(380px,44vh,72vw)] w-[min(380px,44vh,72vw)] text-fg">
          <circle cx="120" cy="120" r={R} fill="none" stroke="var(--line)" strokeWidth="1" />
          <circle
            ref={ring}
            cx="120"
            cy="120"
            r={R}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={C}
            strokeDashoffset={C}
            transform="rotate(-90 120 120)"
          />
          <g ref={ticks}>
            {Array.from({ length: 12 }, (_, i) => (
              <line key={i} x1="120" y1="28" x2="120" y2={i % 3 === 0 ? 44 : 38} stroke="currentColor" strokeWidth={i % 3 === 0 ? 2 : 1.2} transform={`rotate(${i * 30} 120 120)`} />
            ))}
          </g>
          <line ref={hour} x1="120" y1="120" x2="120" y2="72" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <line ref={minute} x1="120" y1="132" x2="120" y2="46" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="120" cy="120" r="4" fill="var(--accent)" />
        </svg>
        <p ref={word} className="mt-8 flex flex-col items-center gap-3">
          <span className="font-display text-[clamp(26px,2.6vw,38px)] tracking-[0.34em]">{name}</span>
          <span ref={time} className="tnum text-[13px] font-semibold tracking-[0.3em] text-muted">
            00:00
          </span>
        </p>
      </div>
    </div>
  );
}
