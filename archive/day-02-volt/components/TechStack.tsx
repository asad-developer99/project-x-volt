"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { onSiteReady } from "@/lib/loading";
import { tech } from "../content";

/**
 * Stacking cards: each card sticks under the nav and the next one slides over it at a slant
 * (it arrives tilted −3° and straightens), while the card underneath shrinks back and dims.
 */
export default function TechStack() {
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let ctx: gsap.Context | undefined;
    const off = onSiteReady(() => {
      ctx = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>(".tech-card", list.current);
        cards.forEach((card, k) => {
          const holder = card.parentElement!;
          // arrive at a slant, fully bright
          if (k > 0)
            gsap.fromTo(card, { rotate: -2.5 }, { rotate: 0, ease: "none", scrollTrigger: { trigger: holder, start: "top bottom", end: "top 45%", scrub: true } });
          // step back a little once the next card is half way up (never goes dark: the stack stays readable)
          const next = cards[k + 1]?.parentElement;
          if (next)
            {
            const st = { trigger: next, start: "top 60%", end: "top 25%", scrub: true };
            gsap.to(card, { scale: 0.95, ease: "none", scrollTrigger: st });
            gsap.to(card.querySelector(".tech-dim"), { opacity: 0.28, ease: "none", scrollTrigger: st });
          }
        });
      }, list);
    });
    return () => {
      off();
      ctx?.revert();
    };
  }, []);

  return (
    <section id="tech" className="section-y relative z-[1] !pb-[clamp(40px,6vh,72px)]">
      {/* ?record=1: one move from the size picker to the last card settled */}
      <div aria-hidden data-record-label="Tech stack (all 3 cards)" data-record-time="4.5" data-record-align="bottom" className="pointer-events-none absolute inset-x-0 bottom-0 h-px" />

      <div className="container-x">
        <div data-reveal className="mb-12 flex flex-wrap items-end justify-between gap-6 lg:mb-16">
          <div>
            <p className="eyebrow">{tech.eyebrow}</p>
            <h2 className="font-display mt-4 text-[clamp(52px,6vw,108px)]">
              <span className="lean">{tech.heading}</span>
            </h2>
          </div>
          <p className="label">Foam · Plate · Grip</p>
        </div>

        <div ref={list}>
          {tech.cards.map((c, k) => (
            <div
              key={c.n}
              className="sticky mb-[6vh] last:mb-0"
              style={{ top: `calc(var(--nav-h) + 16px + ${k * 18}px)` }}
            >
              <article className="tech-card chamfer relative h-[min(76svh,640px)] origin-top bg-line p-px will-change-transform">
                <div className="chamfer grid h-full grid-rows-[40%_1fr] overflow-hidden bg-surface md:grid-cols-[1.3fr_1fr] md:grid-rows-1">
                  <div className="relative overflow-hidden">
                    <img src={c.image} alt={`${c.name}: ${c.part}`} className="absolute inset-0 h-full w-full object-cover brightness-[1.18] contrast-[1.05]" />
                    <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,transparent_60%,var(--surface))] max-md:bg-[linear-gradient(180deg,transparent_55%,var(--surface))]" />
                    <span className="sticker absolute top-5 left-5">{c.part}</span>
                  </div>
                  <div className="flex flex-col justify-between p-6 md:p-10">
                    <div>
                      <p className="tnum text-[13px] font-semibold tracking-[0.2em] text-muted">
                        <span className="text-accent">{c.n}</span> / 0{tech.cards.length}
                      </p>
                      <h3 className="font-display lean mt-3 text-[clamp(44px,4.6vw,84px)] md:mt-5">{c.name}</h3>
                      <p className="mt-3 max-w-[380px] text-[15px] leading-relaxed text-fg/75 md:mt-5 md:text-[16px]">{c.text}</p>
                    </div>
                    <div className="border-t border-line pt-4 md:pt-6">
                      <p
                        className="font-display tnum text-[clamp(56px,6vw,112px)] text-accent"
                        data-count={c.stat}
                        data-decimals={c.decimals}
                        data-suffix={c.suffix}
                      >
                        {c.stat.toLocaleString("en-US", { minimumFractionDigits: c.decimals })}
                        {c.suffix}
                      </p>
                      <p className="label mt-1">{c.label}</p>
                    </div>
                  </div>
                </div>
                {/* dims the card as the next one covers it (opacity only: cheap on phones) */}
                <div aria-hidden className="tech-dim chamfer pointer-events-none absolute inset-0 bg-black opacity-0" />
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
