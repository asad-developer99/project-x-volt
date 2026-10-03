"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { addToBag } from "./DropNav";
import { fit } from "../content";

type Step = "idle" | "size" | "width" | "added";

const PERK_ICONS = [
  "M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  "M12 3a9 9 0 1 0 9 9M12 7v5l3 2M17 3l4 4-4 4",
  "M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4",
];

/**
 * Size picker. Plays by itself (nobody touches the mouse on camera): UK 8 → UK 9 → Wide → Add to bag,
 * and the bag in the nav counts up. Normal visit: plays once each time it comes on screen.
 * ?record=1: plays across the timeline hold, scaled to its length.
 */
export default function SizeLab() {
  const [size, setSize] = useState<string | null>(null);
  const [width, setWidth] = useState(fit.widths[0]);
  const [step, setStep] = useState<Step>("idle");
  const [tap, setTap] = useState<string | null>(null); // key of the element showing the tap ring
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stage = useRef<HTMLDivElement>(null);
  const touched = useRef(false);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const press = (key: string, fn: () => void) => {
    setTap(`${key}-${Date.now()}`);
    fn();
  };

  /** The hands-free demo, spread over `total` seconds. */
  const play = (total: number) => {
    clear();
    setSize(null);
    setWidth(fit.widths[0]);
    setStep("idle");
    const at = (f: number, fn: () => void) => timers.current.push(setTimeout(fn, total * 1000 * f));
    at(0.08, () => press("size-8", () => setSize("8")));
    at(0.3, () => press(`size-${fit.demo.size}`, () => (setSize(fit.demo.size), setStep("size"))));
    at(0.52, () => press(`width-${fit.demo.width}`, () => (setWidth(fit.demo.width), setStep("width"))));
    at(0.74, () =>
      press("add", () => {
        setStep("added");
        addToBag();
      }),
    );
  };

  useEffect(() => {
    const el = stage.current!;
    const recording = new URLSearchParams(window.location.search).has("record");
    const onHold = (e: Event) => play((e as CustomEvent<{ duration: number }>).detail.duration);
    el.addEventListener("record:hold", onHold);

    let io: IntersectionObserver | undefined;
    if (!recording && !prefersReducedMotion()) {
      io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting && !touched.current) play(4);
          if (!e.isIntersecting) clear();
        },
        { threshold: 0.55 },
      );
      io.observe(el);
    }
    return () => {
      el.removeEventListener("record:hold", onHold);
      io?.disconnect();
      clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // a real click stops the demo
  const user = (fn: () => void) => {
    touched.current = true;
    clear();
    fn();
  };

  const left = size ? fit.low[size] : undefined;
  const ring = (key: string) => (tap?.startsWith(`${key}-`) ? <span key={tap} className="tap-ring" aria-hidden /> : null);

  return (
    <section id="fit" className="section-y relative z-[1]">
      <div ref={stage} className="container-x relative">
        {/* ?record=1 stop: the picker centred, the demo plays during the hold */}
        <div aria-hidden data-record-label="Size picker (demo)" data-record-time="1.5" data-record-hold="4" data-record-align="center" className="pointer-events-none absolute inset-0" />

        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* the shoe on a sizing pad */}
          <div data-reveal className="relative">
            <div className="glass-edge chamfer relative aspect-[4/3] w-full">
              <div className="glass-fill chamfer" />
              {/* ruler */}
              <div aria-hidden className="absolute inset-x-6 bottom-6 flex items-end justify-between">
                {Array.from({ length: 41 }, (_, k) => (
                  <span key={k} className={`w-px ${k % 5 === 0 ? "h-4 bg-fg/50" : "h-2 bg-fg/25"}`} />
                ))}
              </div>
              <p aria-hidden className="tnum absolute top-5 left-6 text-[12px] font-semibold tracking-[0.16em] text-muted uppercase">
                Foot length · <span className="text-fg">{size ? `${(22.4 + (Number(size) - 6) * 0.85).toFixed(1)} cm` : "—"}</span>
              </p>
              <p aria-hidden className="font-display outline-text absolute right-5 top-2 text-[clamp(90px,10vw,170px)] leading-none text-accent/40">
                {size ?? "UK"}
              </p>
              <img src={fit.image} alt={fit.model} className="absolute inset-x-[4%] top-[18%] w-[92%] -rotate-[4deg] object-contain md:drop-shadow-[0_36px_30px_rgba(0,0,0,.6)]" />
            </div>
          </div>

          {/* the picker */}
          <div>
            <p className="eyebrow">{fit.eyebrow}</p>
            <h2 className="font-display mt-4 text-[clamp(52px,6vw,108px)]">
              {fit.heading.map((l, k) => (
                <span key={l} className={`lean block ${k === 1 ? "text-accent" : ""}`}>
                  {l}
                </span>
              ))}
            </h2>
            <p className="mt-5 text-[14px] font-semibold tracking-[0.1em] text-muted uppercase">{fit.model}</p>

            <div className="mt-8 flex items-baseline justify-between">
              <span className="label">Size (UK)</span>
              <a href="#fit" className="link-underline text-[12px] font-semibold text-muted">
                Size guide
              </a>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-7 lg:grid-cols-5 xl:grid-cols-7">
              {fit.sizes.map((s) => {
                const out = fit.soldOut.includes(s);
                return (
                  <button
                    key={s}
                    disabled={out}
                    onClick={() => user(() => setSize(s))}
                    aria-pressed={size === s}
                    className={`size-btn tnum h-12 text-[15px] font-semibold ${size === s ? "is-on" : ""}`}
                  >
                    {s}
                    {ring(`size-${s}`)}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className="label w-16">Width</span>
              <div className="flex gap-2">
                {fit.widths.map((w) => (
                  <button key={w} onClick={() => user(() => setWidth(w))} aria-pressed={width === w} className={`size-btn h-11 px-5 text-[13px] font-semibold tracking-[0.08em] uppercase ${width === w ? "is-on" : ""}`}>
                    {w}
                    {ring(`width-${w}`)}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-6 flex min-h-6 items-center gap-2 text-[14px] font-semibold">
              {left ? (
                <>
                  <span className="live-dot h-2 w-2 rounded-full bg-[#ff5a1f]" />
                  <span>
                    Only <span className="tnum">{left}</span> left in UK {size}
                  </span>
                </>
              ) : size ? (
                <span className="text-muted">In stock · ships in 24 hours</span>
              ) : (
                <span className="text-muted">Pick a size to see stock</span>
              )}
            </p>

            <button
              onClick={() => user(() => (setStep("added"), addToBag()))}
              className="btn btn-solid relative mt-6 w-full justify-center !py-5 text-[14px]"
            >
              {step === "added" ? "Added to bag ✓" : `Add to bag · ${fit.price}`}
              {ring("add")}
            </button>
          </div>
        </div>

        {/* perks */}
        <ul className="mt-16 grid gap-px border-y border-line bg-line sm:grid-cols-3 lg:mt-20">
          {fit.perks.map((p, k) => (
            <li key={p.title} className="flex items-center gap-4 bg-bg px-2 py-6 sm:px-6">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" aria-hidden>
                <path d={PERK_ICONS[k]} />
              </svg>
              <div>
                <p className="text-[15px] font-bold">{p.title}</p>
                <p className="text-[13px] text-muted">{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
