"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import { club } from "../content";

const fmt = (v: number, decimals: number, suffix: string) => v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;

/**
 * Counter that starts as soon as it peeks onto the screen and finishes in 1.4 s,
 * so in ?record=1 it has landed on its final number well before the page scrolls on.
 */
function Count({ value, decimals, suffix }: { value: number; decimals: number; suffix: string }) {
  const el = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const node = el.current!;
    const obj = { v: 0 };
    node.textContent = fmt(0, decimals, suffix);
    let tween: gsap.core.Tween | undefined;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      tween = gsap.to(obj, { v: value, duration: 1.4, ease: "power2.out", onUpdate: () => (node.textContent = fmt(obj.v, decimals, suffix)) });
    });
    io.observe(node);
    return () => {
      io.disconnect();
      tween?.kill();
    };
  }, [value, decimals, suffix]);
  return (
    <p ref={el} className="font-display tnum text-[clamp(28px,3.6vw,62px)] whitespace-nowrap">
      {fmt(value, decimals, suffix)}
    </p>
  );
}

/**
 * Stats, restyled as a run-club poster: two dawn photos (cut corners, graded cooler to sit with the
 * night photos), a slanted headline, three counters and the city list as tags.
 */
export default function RunClub() {
  return (
    <section
      id="club"
      className="section-y relative z-[1] overflow-hidden"
      data-record-label="Run club"
      data-record-time="2"
      data-record-hold="1.5"
      data-record-align="center"
      data-record-align-mobile="top"
      data-record-offset-mobile="-40"
    >
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <p className="eyebrow">{club.eyebrow}</p>
          <h2 className="font-display mt-4 text-[clamp(52px,5.8vw,104px)]">
            {club.heading.map((l, k) => (
              <span key={l} className={`lean block ${k === 1 ? "text-accent" : ""}`}>
                {l}
              </span>
            ))}
          </h2>
          <p className="mt-6 max-w-[420px] text-[16px] leading-relaxed text-fg/75">{club.text}</p>

          <div className="mt-10 grid grid-cols-3 gap-px border-y border-line bg-line">
            {club.stats.map((s) => (
              <div key={s.label} className="bg-bg py-5 pr-2">
                <Count value={s.value} decimals={s.decimals} suffix={s.suffix} />
                <p className="label mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <ul className="mt-8 flex flex-wrap gap-2">
            {club.cities.map((c) => (
              <li key={c} className="border border-line px-3 py-1.5 text-[12px] font-semibold tracking-[0.12em] uppercase">
                {c}
              </li>
            ))}
          </ul>
          <div className="mt-9">
            <Button href="#club" label={club.cta} />
          </div>
        </div>

        {/* photos */}
        <div className="relative pb-[18%]">
          <div className="chamfer relative aspect-[16/11] overflow-hidden" style={{ "--cut": "30px" } as React.CSSProperties}>
            <img src={club.images[0]} alt="Volt Run Club runners on a seafront promenade at dawn" className="absolute inset-0 h-full w-full object-cover" data-zoom />
            <div aria-hidden className="absolute inset-0 bg-[#0b2a3a]/30 mix-blend-multiply" />
          </div>
          <div className="chamfer absolute right-[-4%] bottom-0 w-[52%] rotate-[3deg] overflow-hidden border-4 border-bg" data-parallax="0.12">
            <img src={club.images[1]} alt="Two runners high-fiving after a morning run" className="aspect-[4/3] w-full object-cover" />
            <div aria-hidden className="absolute inset-0 bg-[#0b2a3a]/25 mix-blend-multiply" />
          </div>
          <span className="sticker absolute bottom-[8%] left-[4%] !text-[13px]">Sun · 5:30 AM</span>
        </div>
      </div>
    </section>
  );
}
