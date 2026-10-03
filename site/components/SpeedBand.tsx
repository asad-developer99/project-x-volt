"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { Bolt } from "./DropNav";
import { speed } from "../content";

/**
 * Marquee, restyled as two crossing tapes: a lime band tilted −3° with black caps running left,
 * and a dark band tilted +2° behind it with outlined city names running right. Scrolling speeds both up.
 */
export default function SpeedBand() {
  const lime = useRef<HTMLDivElement>(null);
  const dark = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const a = gsap.to(lime.current, { xPercent: -50, duration: 16, ease: "none", repeat: -1 });
    const b = gsap.fromTo(dark.current, { xPercent: -50 }, { xPercent: 0, duration: 22, ease: "none", repeat: -1 });
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const boost = 1 + Math.min(5, Math.abs(self.getVelocity()) / 350);
        gsap.to([a, b], { timeScale: boost, duration: 0.25, overwrite: true });
        gsap.to([a, b], { timeScale: 1, duration: 1.4, delay: 0.3, overwrite: false });
      },
    });
    return () => {
      a.kill();
      b.kill();
      st.kill();
    };
  }, []);

  const words = [...speed.words, ...speed.words, ...speed.words];
  const cities = [...speed.outline, ...speed.outline];

  return (
    <section
      aria-label={speed.words.join(", ")}
      data-record-label="Speed band"
      data-record-time="1.5"
      data-record-align="center"
      className="relative z-[2] -mt-[3.5vw] overflow-hidden py-[clamp(56px,7vw,110px)]"
    >
      {/* dark tape, behind */}
      <div className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rotate-[2deg] border-y border-line bg-surface py-3 md:py-4">
        <div ref={dark} className="flex w-max whitespace-nowrap" aria-hidden>
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {cities.map((c, i) => (
                <span key={i} className="font-display outline-text px-7 text-[clamp(34px,4.2vw,64px)] text-fg/60">
                  {c}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* lime tape, in front */}
      <div className="relative mx-[-5%] -rotate-[3deg] bg-accent py-2 text-accent-fg shadow-[0_24px_60px_-20px_rgba(200,255,26,.45)] md:py-3">
        <div ref={lime} className="flex w-max whitespace-nowrap" aria-hidden>
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {words.map((w, i) => (
                <span key={i} className="font-display flex items-center gap-[clamp(20px,2.4vw,40px)] px-[clamp(12px,1.4vw,22px)] text-[clamp(52px,7.4vw,124px)]">
                  <span className="lean">{w}</span>
                  <Bolt className="h-[0.42em] w-auto text-accent-fg" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
