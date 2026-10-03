"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { atFromUrl, waitForClock } from "@/lib/atTime";

// The engine loader is switched off (meta.loader = false). This one always takes exactly LOADER_SECONDS,
// then tells the page to play its intro. With &at=HH:MM:SS it shows its first frame, frozen, until that
// time, while it preloads every image on the page (docs/RECORDING.md).

const LIGHTS = 1.7; // three red lights, then all lime
const SWEEP = 0.8; // lime bar sweeps in, then out, revealing the page
export const LOADER_SECONDS = LIGHTS + SWEEP; // 2.5

let revealed = false;

/** Run once the race loader has opened (immediately with ?static=1). */
export function onReveal(fn: () => void) {
  if (revealed) {
    fn();
    return () => {};
  }
  const h = () => fn();
  window.addEventListener("volt:reveal", h, { once: true });
  return () => window.removeEventListener("volt:reveal", h);
}

function reveal() {
  if (revealed) return;
  revealed = true;
  window.dispatchEvent(new Event("volt:reveal"));
}

const loadImage = (src: string) =>
  new Promise<void>((done) => {
    const img = new Image();
    img.onload = img.onerror = () => done();
    img.src = src;
  });

/** Every <img> on the page (fetched by URL, so lazy or hidden ones count too) and the fonts. */
async function preloadAll() {
  const urls = [...new Set(Array.from(document.images).map((i) => i.currentSrc || i.src).filter(Boolean))];
  await Promise.all([...urls.map(loadImage), document.fonts.ready]);
}

/**
 * Race start: three red start lights come on one by one, all turn lime (GO),
 * a lime bar sweeps across the screen and slides away, revealing the page.
 */
export default function RaceLoader({ name }: { name: string }) {
  const root = useRef<HTMLDivElement>(null);
  const black = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const lights = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const status = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // ?static=1: a class that stops the CSS loops (hero zoom, streaks, ticker...)
    if (new URLSearchParams(window.location.search).has("static")) document.documentElement.classList.add("is-static");
    if (prefersReducedMotion()) {
      setGone(true);
      reveal();
      return;
    }
    window.scrollTo(0, 0);
    window.__lenis?.stop();

    // &at=: freeze on the first frame (lights off, name visible), preload everything, play at that time
    const target = atFromUrl();
    let ready = !target;
    let cancelClock = () => {};
    if (target) {
      const t0 = performance.now();
      preloadAll().then(() => {
        ready = true;
        console.log(`[record] loader: all images ready in ${((performance.now() - t0) / 1000).toFixed(1)} s`);
      });
    }

    const bulbs = Array.from(lights.current!.children) as HTMLElement[];
    const say = (s: string) => () => {
      if (status.current) status.current.textContent = s;
    };

    // context + revert: React dev mode runs this effect twice
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: !!target });
      if (!target) tl.from(word.current, { opacity: 0, y: 16, duration: 0.6, ease: "power3.out" }, 0);
      bulbs.forEach((b, i) => {
        tl.add(say(["Ready", "Set", "Set"][i]), 0.2 + i * 0.45);
        tl.to(b, { backgroundColor: "#ff2a2a", boxShadow: "0 0 34px 6px rgba(255,42,42,.55)", duration: 0.12, ease: "none" }, 0.2 + i * 0.45);
      });
      tl.addLabel("go", LIGHTS - 0.1)
        .add(() => {
          // &at= and still loading: hold on red until everything is in, then go
          if (ready) return;
          tl.pause();
          const wait = () => (ready ? tl.play() : requestAnimationFrame(wait));
          wait();
        }, "go")
        .add(say("Go"), "go")
        .to(bulbs, { backgroundColor: "#c8ff1a", boxShadow: "0 0 44px 10px rgba(200,255,26,.55)", duration: 0.1, ease: "none" }, "go")
        .addLabel("sweep", LIGHTS)
        .fromTo(bar.current, { xPercent: -101, autoAlpha: 1 }, { xPercent: 0, duration: SWEEP * 0.4, ease: "power3.in" }, "sweep")
        .set([black.current, stage.current], { autoAlpha: 0 }, `sweep+=${SWEEP * 0.4}`)
        .add(() => {
          window.__lenis?.start();
          reveal();
        }, `sweep+=${SWEEP * 0.4}`)
        .to(bar.current, { xPercent: 101, duration: SWEEP * 0.6, ease: "power3.out" }, `sweep+=${SWEEP * 0.4}`)
        .add(() => setGone(true), LOADER_SECONDS);

      if (target) {
        if (Date.now() < target.getTime()) console.log(`[record] loader frozen until ${target.toLocaleTimeString()}`);
        cancelClock = waitForClock(target, () => {
          if (!ready) console.warn("[record] assets not ready at start time: the lights stay red until they are");
          tl.play(0);
        });
      }
    });

    return () => {
      cancelClock();
      ctx.revert();
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} data-loader aria-hidden className="fixed inset-0 z-[100] overflow-hidden">
      <div ref={black} className="absolute inset-0 bg-bg" />
      <div ref={stage} className="absolute inset-0 flex flex-col items-center justify-center gap-10">
        <div className="flex items-center gap-[clamp(14px,2vw,26px)] rounded-[14px] border border-line bg-surface px-[clamp(18px,2.4vw,30px)] py-[clamp(14px,1.8vw,22px)]">
          <div ref={lights} className="flex gap-[clamp(14px,2vw,26px)]">
            {[0, 1, 2].map((i) => (
              <span key={i} className="block h-[clamp(40px,5vw,68px)] w-[clamp(40px,5vw,68px)] rounded-full bg-[#1c1f22] shadow-[inset_0_2px_6px_rgba(0,0,0,.6)]" />
            ))}
          </div>
        </div>
        <div ref={word} className="flex flex-col items-center gap-3">
          <span className="font-display lean text-[clamp(40px,5.4vw,84px)]">{name}</span>
          <span ref={status} className="text-[12px] font-semibold tracking-[0.4em] text-muted uppercase">
            On your marks
          </span>
        </div>
      </div>
      <div ref={bar} className="invisible absolute inset-y-0 -left-[8vw] w-[116vw] bg-accent" style={{ clipPath: "polygon(8vw 0, 100% 0, calc(100% - 8vw) 100%, 0 100%)" }} />
    </div>
  );
}
