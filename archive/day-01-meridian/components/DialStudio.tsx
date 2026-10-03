"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import SplitText from "@/components/ui/SplitText";
import { collection, studio } from "../content";

/** 60 hairline ticks around the paper disc, like a chapter ring. */
function ChapterRing() {
  return (
    <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full text-fg/40" aria-hidden>
      <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="0.3" />
      {Array.from({ length: 60 }, (_, i) => (
        <line
          key={i}
          x1="100"
          y1="4"
          x2="100"
          y2={i % 5 === 0 ? 11 : 7.5}
          stroke="currentColor"
          strokeWidth={i % 5 === 0 ? 0.7 : 0.35}
          transform={`rotate(${i * 6} 100 100)`}
        />
      ))}
    </svg>
  );
}

/**
 * Configurator (VariantHero, restyled light): watch on a paper disc, dials left, straps right,
 * price updates. Pins for about a screen and switches by itself every ~1.8 s while on screen.
 */
export default function DialStudio() {
  const builds = studio.builds;
  const [i, setI] = useState(0);
  const [live, setLive] = useState(false);
  const [still, setStill] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const watch = useRef<HTMLDivElement>(null);
  const holdUntil = useRef(0);
  const b = builds[i];
  const name = collection.items.find((w) => w.ref === b.ref)?.name ?? "";

  // Only switch while the section is on screen
  useEffect(() => {
    if (prefersReducedMotion()) {
      setStill(true);
      return;
    }
    // "on screen" = crossing the middle of the viewport (works for the tall stacked phone layout too)
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { rootMargin: "-35% 0px -35% 0px" });
    io.observe(stage.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!live) return;
    const next = () => {
      if (Date.now() < holdUntil.current) return;
      setI((n) => (n + 1) % builds.length);
    };
    // first switch comes a little sooner, so a steady filmed scroll catches 3+ watches
    let t: ReturnType<typeof setInterval> | undefined;
    const first = setTimeout(() => {
      next();
      t = setInterval(next, studio.interval);
    }, studio.interval * 0.6);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, [live, builds.length]);

  useEffect(() => {
    if (still || !watch.current) return;
    gsap.fromTo(watch.current, { opacity: 0, rotate: -10, scale: 0.9 }, { opacity: 1, rotate: 0, scale: 1, duration: 0.8, ease: "power3.out" });
  }, [i, still]);

  const pick = (k: number) => {
    holdUntil.current = Date.now() + 6000;
    setI(k);
  };

  const option = (k: number, label: string, color: string, active: boolean) => (
    <button key={label} onClick={() => pick(k)} className="group flex w-full items-center gap-4 border-b border-line py-3.5 text-left">
      <span
        className={`h-5 w-5 shrink-0 rounded-full border transition-transform duration-500 ${active ? "scale-110 border-fg" : "border-line"}`}
        style={{ background: color }}
      />
      <span className={`text-[14px] transition-colors duration-500 ${active ? "font-semibold text-fg" : "text-muted group-hover:text-fg"}`}>{label}</span>
      <span className={`ml-auto h-px bg-accent transition-all duration-500 ${active ? "w-8" : "w-0"}`} />
    </button>
  );

  return (
    <section id="configure" data-record-label="Configurator" data-record-time="5" data-record-align="bottom" className={`relative ${still ? "" : "lg:h-[200vh]"}`}>
      <div ref={stage} className="flex items-center py-24 lg:sticky lg:top-0 lg:h-screen lg:py-0 lg:pt-[72px]">
        <div className="container-x grid w-full items-center gap-12 lg:grid-cols-[1fr_1.25fr_1fr]">
          {/* Dials */}
          <div>
            <p className="eyebrow mb-5">{studio.eyebrow}</p>
            <SplitText text={studio.heading} className="font-display text-[clamp(44px,4.6vw,80px)]" />
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-muted">{studio.text}</p>
            <p className="ref mt-10 mb-1">Dial</p>
            {builds.map((x, k) => option(k, x.dial, x.dialColor, k === i))}
          </div>

          {/* Watch on the paper disc */}
          <div className="flex flex-col items-center">
            <div className="relative aspect-square w-[min(100%,58vh,540px)] rounded-full bg-surface shadow-[inset_0_0_0_1px_var(--line),0_40px_80px_-50px_rgba(29,26,22,.35)]">
              <ChapterRing />
              <div ref={watch} key={b.ref} className="absolute inset-[12%] flex items-center justify-center">
                <img src={b.image} alt={`Meridian ${name}, ${b.dial} dial, ${b.strap} strap`} className="h-full w-full object-contain drop-shadow-[0_26px_24px_rgba(29,26,22,.3)]" />
              </div>
            </div>
            <p className="mt-7 text-center">
              <span className="ref">Ref. {b.ref}</span>
              <span className="font-display ml-3 text-[22px]">{name}</span>
            </p>
            <div className="mt-4 flex w-40 gap-1.5" aria-hidden>
              {builds.map((x, k) => (
                <span key={x.ref} className="h-[2px] flex-1 overflow-hidden bg-line">
                  {k === i && (
                    <span
                      key={`${i}-${live}`}
                      className={`block h-full bg-accent ${live ? "dial-progress" : ""}`}
                      style={{ animationDuration: `${studio.interval}ms` }}
                    />
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Straps + price */}
          <div>
            <p className="ref mb-1">Strap</p>
            {builds.map((x, k) => option(k, x.strap, x.strapColor, k === i))}
            <div className="mt-8 flex items-baseline justify-between border-b border-line pb-3.5">
              <span className="ref">Case</span>
              <span className="text-[14px] font-medium">{b.caseMetal}</span>
            </div>
            <p className="tnum mt-8 text-[clamp(32px,2.6vw,44px)] font-light tracking-[-0.01em]">{b.price}</p>
            <p className="mt-1 text-[12px] text-muted">Incl. taxes · engraving included</p>
            <div className="mt-7">
              <Button href="#collection" label="Add to bag" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
