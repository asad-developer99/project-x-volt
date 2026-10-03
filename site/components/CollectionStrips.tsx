"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { collections } from "../content";

const AUTO_MS = 2200;
const EASE = "cubic-bezier(.65,0,.35,1)";

/**
 * ExpandingPanels, restyled: four slanted strips (parallelograms) with vertical Anton labels.
 * One is open at a time; while on screen they open one by one by themselves (hover also opens one).
 * ?record=1: steps Road → Street across the timeline hold. Phones: the strips stack as rows.
 */
export default function CollectionStrips() {
  const items = collections.items;
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const hovering = useRef(false);
  const recording = useRef(false);
  const still = useRef(false);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    still.current = prefersReducedMotion();
    recording.current = new URLSearchParams(window.location.search).has("record");
    const el = stage.current!;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    let timers: ReturnType<typeof setTimeout>[] = [];
    const onHold = (e: Event) => {
      const step = ((e as CustomEvent<{ duration: number }>).detail.duration * 1000) / items.length;
      timers.forEach(clearTimeout);
      setActive(0);
      timers = items.slice(1).map((_, k) => setTimeout(() => setActive(k + 1), step * (k + 0.7)));
    };
    el.addEventListener("record:hold", onHold);
    return () => {
      io.disconnect();
      el.removeEventListener("record:hold", onHold);
      timers.forEach(clearTimeout);
    };
  }, [items]);

  useEffect(() => {
    if (!visible || still.current || recording.current) return;
    const t = setInterval(() => !hovering.current && setActive((a) => (a + 1) % items.length), AUTO_MS);
    return () => clearInterval(t);
  }, [visible, items.length]);

  const motion = still.current ? "none" : `flex-grow 0.9s ${EASE}`;

  return (
    <section id="collections" className="section-y relative z-[1] overflow-hidden !pt-[clamp(56px,9vh,110px)]">
      <div className="container-x">
        <div data-reveal className="mb-10 flex flex-wrap items-end justify-between gap-6 lg:mb-14">
          <div>
            <p className="eyebrow">{collections.eyebrow}</p>
            <h2 className="font-display mt-4 text-[clamp(52px,6vw,108px)]">
              <span className="lean">{collections.heading}</span>
            </h2>
          </div>
          <p className="label">62 styles · 4 terrains</p>
        </div>

        <div ref={stage} className="relative">
          {/* ?record=1 stop: the strips open one by one during the hold */}
          <div aria-hidden data-record-label="Collections (hold)" data-record-time="2" data-record-hold="2.5" data-record-align="center" className="pointer-events-none absolute inset-0" />
          <div
            className="flex h-[min(78svh,620px)] flex-col gap-2 md:h-[clamp(420px,62vh,600px)] md:flex-row md:gap-0 md:px-[4vw]"
            onMouseLeave={() => (hovering.current = false)}
          >
            {items.map((it, k) => {
              const on = k === active;
              return (
                <a
                  key={it.name}
                  href="#drop"
                  data-cursor="Shop"
                  onMouseEnter={() => {
                    if (recording.current) return;
                    hovering.current = true;
                    setActive(k);
                  }}
                  className="strip relative block min-h-0 min-w-0 overflow-hidden md:-mx-[calc(1.4vw-4px)]"
                  style={{ flexGrow: on ? 5 : 1, flexBasis: 0, transition: motion }}
                >
                  <img
                    src={it.image}
                    alt={`${it.name} running shoes`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s]"
                    style={{ objectPosition: it.pos, transform: on ? "scale(1.02)" : "scale(1.18)" }}
                  />
                  <div className={`absolute inset-0 transition-colors duration-700 ${on ? "bg-[linear-gradient(0deg,rgba(8,9,10,.85),transparent_55%)]" : "bg-bg/55"}`} />
                  {/* closed: vertical label */}
                  <p
                    className="font-display absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(30px,3vw,52px)] whitespace-nowrap transition-opacity duration-500 md:[writing-mode:vertical-rl] md:rotate-180"
                    style={{ opacity: on ? 0 : 1 }}
                  >
                    {it.name}
                  </p>
                  {/* open: name, count, line */}
                  <div
                    className="absolute right-6 bottom-5 left-6 transition-[opacity,transform] duration-700 md:right-[3vw] md:bottom-8 md:left-[3vw]"
                    style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(18px)" }}
                  >
                    <p className="flex items-center gap-3 text-[12px] font-bold tracking-[0.18em] text-accent uppercase">
                      <span className="tnum">0{k + 1}</span>
                      <span className="h-[2px] w-6 bg-accent" />
                      {it.count}
                    </p>
                    <p className="font-display lean mt-2 text-[clamp(52px,6vw,104px)]">{it.name}</p>
                    <p className="mt-1 flex items-center justify-between gap-4 text-[14px] text-fg/80">
                      {it.text}
                      <span className="hidden text-[13px] font-bold tracking-[0.14em] text-fg uppercase md:inline">Shop →</span>
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
