"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { drop } from "../content";

const AUTO_MS = 1500;

/**
 * ProductGrid, restyled: dark glass cards with a cut corner, the shoe breaking out of the top edge,
 * sticker tags and ₹ prices. One wider feature card + three. While on screen the "hot" card
 * (lime border, lifted shoe) moves along by itself; in ?record=1 the timeline hold drives it.
 */
export default function DropRail() {
  const [hot, setHot] = useState(0);
  const [visible, setVisible] = useState(false);
  const hovering = useRef(false);
  const recording = useRef(false);
  const still = useRef(false);
  const stage = useRef<HTMLDivElement>(null);
  const n = drop.items.length;

  useEffect(() => {
    still.current = prefersReducedMotion();
    recording.current = new URLSearchParams(window.location.search).has("record");
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 });
    io.observe(stage.current!);

    // ?record=1: step through all four cards across the hold
    let timers: ReturnType<typeof setTimeout>[] = [];
    const el = stage.current!;
    const onHold = (e: Event) => {
      const step = ((e as CustomEvent<{ duration: number }>).detail.duration * 1000) / n;
      timers.forEach(clearTimeout);
      setHot(0);
      timers = Array.from({ length: n - 1 }, (_, k) => setTimeout(() => setHot(k + 1), step * (k + 1)));
    };
    el.addEventListener("record:hold", onHold);
    return () => {
      io.disconnect();
      el.removeEventListener("record:hold", onHold);
      timers.forEach(clearTimeout);
    };
  }, [n]);

  useEffect(() => {
    if (!visible || still.current || recording.current) return;
    const t = setInterval(() => !hovering.current && setHot((h) => (h + 1) % n), AUTO_MS);
    return () => clearInterval(t);
  }, [visible, n]);

  return (
    <section id="drop" className="section-y relative z-[1] overflow-x-clip">
      <div className="container-x">
        <div data-reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{drop.eyebrow}</p>
            <h2 className="font-display mt-4 text-[clamp(64px,8vw,150px)]">
              <span className="lean">{drop.heading}</span>
            </h2>
          </div>
          <div className="flex max-w-[340px] flex-col items-start gap-4 pb-2">
            <p className="text-[15px] leading-relaxed text-muted">{drop.text}</p>
            <a href="#collections" className="link-underline text-[13px] font-bold tracking-[0.14em] uppercase">
              Shop all 62 styles →
            </a>
          </div>
        </div>

        <div ref={stage} className="relative mt-[clamp(90px,10vw,150px)]">
          {/* ?record=1 stop: cards centred on screen */}
          <div
            aria-hidden
            data-record-label="New drop (hold)"
            data-record-time="1.5"
            data-record-hold="2.5"
            data-record-hold-mobile="1.5"
            data-record-align="center"
            data-record-align-mobile="top"
            data-record-offset-mobile="-150"
            className="pointer-events-none absolute inset-0"
          />
          <div
            className="grid gap-x-5 gap-y-24 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr] lg:gap-x-4"
            onMouseLeave={() => (hovering.current = false)}
          >
            {drop.items.map((s, k) => {
              const on = k === hot;
              const big = k === 0;
              return (
                <article
                  key={s.id}
                  data-cursor="Shop"
                  onMouseEnter={() => {
                    if (recording.current) return;
                    hovering.current = true;
                    setHot(k);
                  }}
                  className={`group relative ${on ? "is-hot" : ""}`}
                  style={{ containerType: "inline-size" }}
                >
                  {/* glass body with the cut corner */}
                  <div className="glass-edge chamfer absolute inset-0">
                    <div className="glass-fill chamfer" />
                  </div>
                  {big && (
                    <p aria-hidden className="font-display outline-text pointer-events-none absolute right-4 bottom-[88px] text-[clamp(70px,7vw,120px)] leading-none text-fg/10 select-none">
                      07
                    </p>
                  )}

                  <div className="relative flex h-full flex-col px-5 pt-[38%] pb-5">
                    {/* the shoe, breaking out of the top */}
                    <img
                      src={s.image}
                      alt={s.name}
                      className="pointer-events-none absolute left-1/2 w-[112%] max-w-none object-contain md:drop-shadow-[0_28px_22px_rgba(0,0,0,.6)] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
                      style={{
                        top: big ? "-24cqw" : "-30cqw",
                        transform: `translateX(-50%) translateY(${on ? -10 : 0}px) rotate(${on ? -6 : -2}deg) scale(${on ? 1.04 : 1})`,
                      }}
                    />
                    <div className="flex items-center justify-between gap-3">
                      <span className="label">{s.kind}</span>
                      {s.tag && <span className="sticker">{s.tag}</span>}
                    </div>
                    <h3 className="font-display lean mt-3 text-[clamp(28px,2.3vw,40px)]">{s.name}</h3>
                    <p className="mt-2 text-[13px] text-muted">{s.specs}</p>
                    <div className="mt-auto flex items-end justify-between gap-3 pt-6">
                      <div>
                        <div className="mb-3 flex gap-1.5">
                          {s.dots.map((d) => (
                            <span key={d} className="h-3 w-3 rounded-full ring-1 ring-white/15" style={{ background: d }} />
                          ))}
                        </div>
                        <p className="tnum text-[22px] font-bold">
                          {s.price}
                          {s.was && <span className="ml-2 text-[14px] font-medium text-muted line-through">{s.was}</span>}
                        </p>
                      </div>
                      <span
                        aria-hidden
                        className={`grid h-11 w-11 place-items-center text-[22px] font-bold transition-colors duration-500 ${on ? "bg-accent text-accent-fg" : "bg-white/8 text-fg"}`}
                        style={{ clipPath: "polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)" }}
                      >
                        +
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
