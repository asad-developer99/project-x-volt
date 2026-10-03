"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { faq } from "../content";

/**
 * Faq, restyled: no boxes, hairline rows, Bodoni questions, a thin + that turns to ×.
 * For filming, the first answer opens by itself when the list comes on screen.
 */
export default function CareFaq() {
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const first = list.current!.querySelector("details")!;
    first.open = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setTimeout(() => (first.open = true), 500);
        io.disconnect();
      },
      { threshold: 0.6 },
    );
    io.observe(list.current!);
    return () => io.disconnect();
  }, []);

  return (
    <section className="section-y !pt-0" data-record-label="FAQ" data-record-time="2.5" data-record-align="center">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.6fr]">
        <div data-reveal>
          <p className="eyebrow mb-5">{faq.eyebrow}</p>
          <h2 className="font-display text-[clamp(40px,4.2vw,72px)]">{faq.heading}</h2>
        </div>
        <div ref={list} data-reveal="stagger" className="border-b border-line">
          {faq.items.map((it, i) => (
            <details key={it.q} open={i === 0} className="care-faq group border-t border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-8 py-7">
                <span className="font-display text-[clamp(22px,1.9vw,30px)]">{it.q}</span>
                <span className="relative h-4 w-4 shrink-0 transition-transform duration-500 group-open:rotate-45" aria-hidden>
                  <span className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-accent" />
                  <span className="absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 bg-accent" />
                </span>
              </summary>
              <p className="max-w-2xl pb-8 text-[15px] leading-relaxed text-muted">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
