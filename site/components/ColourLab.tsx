"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { onSiteReady } from "@/lib/loading";
import Button from "@/components/ui/Button";
import { lab } from "../content";

const LIME = "#c8ff1a";
const setGlow = (c: string) => document.documentElement.style.setProperty("--glow", c);

/**
 * The signature moment (VariantHero, rebuilt): one shoe, five colourways. The section pins while you scroll
 * and the colourway follows the scroll: the shoe slides out, the next slides in, the giant name behind it
 * changes, and the page-wide glow (--glow on <html>) takes the colourway's colour.
 * Scroll-driven, so a ?record=1 laptop and phone show the same colour at the same second.
 */
export default function ColourLab() {
  const cws = lab.colourways;
  const [i, setI] = useState(0);
  const [still, setStill] = useState(false);
  const root = useRef<HTMLElement>(null);
  const live = useRef(false); // the lab is (or has been) on screen: the page glow follows it
  const cur = useRef(cws[0].glow);
  const cw = cws[i];

  useEffect(() => {
    if (prefersReducedMotion()) {
      setStill(true);
      return;
    }
    let st: ScrollTrigger[] = [];
    const off = onSiteReady(() => {
      // index: the pinned stretch is split into 5 equal parts
      st.push(
        ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => setI(Math.min(cws.length - 1, Math.floor(self.progress * cws.length))),
        }),
      );
      // page glow: follows the colourway from when the lab comes into view; back to lime above it
      st.push(
        ScrollTrigger.create({
          trigger: root.current,
          start: "top 70%",
          onEnter: () => {
            live.current = true;
            setGlow(cur.current);
          },
          onLeaveBack: () => {
            live.current = false;
            setGlow(LIME);
          },
        }),
      );
    });
    return () => {
      off();
      st.forEach((t) => t.kill());
      st = [];
    };
  }, [cws.length]);

  // layout effect: the glow starts changing in the same frame as the shoe and the labels
  useLayoutEffect(() => {
    cur.current = cw.glow;
    if (!still && live.current) setGlow(cw.glow);
  }, [cw, still]);

  // clicking a swatch scrolls to that colourway's part of the pin
  const pick = (k: number) => {
    if (still || !root.current || !window.__lenis) return setI(k);
    const r = root.current.getBoundingClientRect();
    const top = r.top + window.scrollY;
    const run = r.height - window.innerHeight;
    window.__lenis.scrollTo(top + ((k + 0.5) / cws.length) * run, { duration: 1.1 });
  };

  return (
    <section
      ref={root}
      id="lab"
      aria-label={`${lab.eyebrow}: ${lab.model}`}
      className={`relative z-[1] ${still ? "" : "h-[340vh] md:h-[320vh]"}`}
      style={{ "--cw": cw.color } as React.CSSProperties}
    >
      {/* ?record=1: arrive at the start of the pin, then scroll through all five colourways */}
      <div aria-hidden data-record-label="Colour Lab: start" data-record-time="1" className="pointer-events-none absolute inset-x-0 top-0 h-px" />
      <div aria-hidden data-record-label="Colour Lab: all 5 colours" data-record-time="7" data-record-align="bottom" className="pointer-events-none absolute inset-x-0 bottom-0 h-px" />

      <div className={`${still ? "relative min-h-[100svh] py-28" : "sticky top-0 h-[100svh]"} flex flex-col overflow-hidden pt-[var(--nav-h)]`}>
        {/* the lab's own light, in the page glow colour (animates with --glow) */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[54%] left-1/2 h-[min(120vh,1100px)] w-[min(120vh,1100px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--glow) 34%, transparent), color-mix(in srgb, var(--glow) 8%, transparent) 55%, transparent)" }}
        />

        {/* giant colourway name behind the shoe */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[50%] -translate-y-1/2 select-none">
          {cws.map((c, k) => (
            <p
              key={c.id}
              className={`cw-swap ${k === i ? "" : "cw-out"} font-display outline-text absolute inset-x-0 -translate-y-1/2 text-center text-[clamp(120px,24vw,420px)] leading-none whitespace-nowrap`}
              style={{ WebkitTextStroke: `1.5px ${c.color}`, opacity: k === i ? 0.55 : 0, transform: `translateY(-50%) skewX(-8deg) translateX(${k === i ? 0 : k < i ? -5 : 5}%)` }}
            >
              {c.name.replace("Volt ", "")}
            </p>
          ))}
        </div>

        <div className="container-x relative grid flex-1 grid-rows-[auto_1fr_auto] items-center gap-4 py-5 lg:grid-cols-[minmax(0,300px)_1fr_minmax(0,300px)] lg:grid-rows-1 lg:gap-8 lg:py-8">
          {/* left: heading + swatches */}
          <div className="flex flex-col gap-4 lg:gap-7">
            <div>
              <p className="eyebrow">
                {lab.eyebrow} ·{" "}
                <span key={i} className="cw-in tnum">
                  0{i + 1} / 0{cws.length}
                </span>
              </p>
              <h2 className="font-display mt-3 text-[clamp(44px,5vw,88px)]">
                {lab.heading.map((l, k) => (
                  <span key={l} className={`lean block ${k === 1 ? "cw-swap" : ""}`} style={k === 1 ? { color: cw.color } : undefined}>
                    {l}
                  </span>
                ))}
              </h2>
            </div>
            <ul className="hidden flex-col lg:flex">
              {cws.map((c, k) => (
                <li key={c.id}>
                  <button onClick={() => pick(k)} className="group flex w-full items-center gap-4 border-b border-line py-3 text-left">
                    <span
                      className="cw-swap h-6 w-6 shrink-0 rounded-full"
                      style={{ background: c.color, transform: k === i ? "scale(1.15)" : "scale(.8)", boxShadow: k === i ? `0 0 0 3px var(--bg), 0 0 0 4px ${c.color}, 0 0 18px ${c.color}` : "none" }}
                    />
                    <span className="flex flex-col">
                      <span className={`cw-swap text-[15px] font-semibold ${k === i ? "text-fg" : "text-muted group-hover:text-fg"}`}>{c.name}</span>
                      <span className="text-[12px] text-muted">{c.note}</span>
                    </span>
                    <span className="cw-swap ml-auto h-[2px]" style={{ width: k === i ? 28 : 0, background: c.color }} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* centre: the shoe */}
          <div className="relative h-full min-h-[220px] w-full">
            <div className="lab-float absolute inset-0">
              {cws.map((c, k) => (
                <img
                  key={c.id}
                  src={c.image}
                  alt={k === i ? `${lab.model} in ${c.name}` : ""}
                  aria-hidden={k !== i}
                  className={`lab-shoe ${k === i ? "" : "cw-out"} absolute inset-0 m-auto h-full max-h-[min(52vh,560px)] w-full object-contain md:drop-shadow-[0_40px_36px_rgba(0,0,0,.65)] lg:max-h-[min(62vh,620px)]`}
                  style={{
                    opacity: k === i ? 1 : 0,
                    transform: `translateX(${k === i ? 0 : k < i ? -16 : 16}%) rotate(${k === i ? 0 : k < i ? -3 : 3}deg) scale(${k === i ? 1.04 : 0.96})`,
                  }}
                />
              ))}
            </div>
            {/* floor shadow in the colourway colour */}
            <div
              aria-hidden
              className="cw-swap absolute bottom-[6%] left-1/2 h-10 w-[62%] -translate-x-1/2 rounded-[50%] blur-2xl"
              style={{ background: `color-mix(in srgb, ${cw.color} 32%, transparent)` }}
            />
          </div>

          {/* right: model, specs, price */}
          <div className="flex flex-col gap-4 lg:gap-6">
            {/* phone: swatch dots */}
            <div className="flex items-center justify-between gap-2 lg:hidden">
              {cws.map((c, k) => (
                <button key={c.id} onClick={() => pick(k)} aria-label={c.name} className="flex flex-1 flex-col items-center gap-1.5">
                  <span
                    className="cw-swap h-6 w-6 rounded-full"
                    style={{ background: c.color, transform: k === i ? "scale(1.15)" : "scale(.8)", boxShadow: k === i ? `0 0 0 3px var(--bg), 0 0 0 4px ${c.color}` : "none" }}
                  />
                  <span className={`cw-swap text-[12px] font-semibold whitespace-nowrap ${k === i ? "text-fg" : "text-muted"}`}>{c.name}</span>
                </button>
              ))}
            </div>
            <div className="flex items-end justify-between gap-4 lg:block">
              <div>
                <p className="label">{lab.model}</p>
                <p key={i} className="cw-in font-display lean mt-2 text-[clamp(32px,2.8vw,48px)]" style={{ color: cw.color }}>
                  {cw.name}
                </p>
              </div>
              <p className="tnum text-[clamp(26px,2.3vw,38px)] font-bold lg:mt-5">{lab.price}</p>
            </div>
            <dl className="hidden grid-cols-2 gap-px bg-line lg:grid">
              {lab.specs.map((s) => (
                <div key={s.label} className="bg-bg/90 p-3.5">
                  <dt className="label">{s.label}</dt>
                  <dd className="mt-1 text-[15px] font-semibold">{s.value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex items-center gap-4">
              <Button href="#fit" label="Choose size" />
            </div>
          </div>
        </div>

        {/* progress: 5 segments */}
        <div className="container-x relative pb-6 lg:pb-8">
          <div className="flex gap-2" aria-hidden>
            {cws.map((c, k) => (
              <span key={c.id} className="h-[3px] flex-1 bg-line">
                <span className="cw-swap block h-full origin-left" style={{ background: c.color, transform: `scaleX(${k <= i ? 1 : 0})` }} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
