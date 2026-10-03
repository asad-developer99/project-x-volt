"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { onReveal } from "./RaceLoader";
import { nav } from "../content";

/** Tell the nav a pair went into the bag (the size picker's demo does this). */
export const addToBag = () => window.dispatchEvent(new Event("volt:bag"));

const Icon = ({ d }: { d: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <path d={d} />
  </svg>
);
/** The brand mark: a slanted lime bolt. */
export const Bolt = ({ className = "h-[0.62em] w-auto text-accent" }: { className?: string }) => (
  <svg viewBox="0 0 10 14" className={className} aria-hidden>
    <path d="M7 0 0 8h4.2L3 14l7-8.2H5.8L7 0Z" fill="currentColor" />
  </svg>
);

const SEARCH = "M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13ZM15.5 15.5 21 21";
const BAG = "M5 8h14l-1.2 12H6.2L5 8Zm4 0V6a3 3 0 0 1 6 0v2";

/** N5: lime offer ticker on top + a black shop bar (wordmark · links · search · size · bag count). */
export default function DropNav() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [bag, setBag] = useState(0);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    const offIntro = onReveal(() => {
      if (!prefersReducedMotion()) gsap.from(ref.current, { yPercent: -100, duration: 0.9, delay: 0.35, ease: "expo.out" });
    });
    const onBag = () => {
      setBag((n) => n + 1);
      setBump((n) => n + 1);
    };
    window.addEventListener("volt:bag", onBag);
    return () => {
      offIntro();
      window.removeEventListener("volt:bag", onBag);
    };
  }, []);

  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) window.__lenis?.stop();
    else if (wasOpen.current) window.__lenis?.start();
    wasOpen.current = open;
  }, [open]);

  const items = [...nav.ticker, ...nav.ticker];

  return (
    <>
      <header ref={ref} className="fixed inset-x-0 top-0 z-50">
        {/* Offer ticker */}
        <div className="h-7 overflow-hidden bg-accent text-accent-fg md:h-8" aria-label={nav.ticker.join(" · ")}>
          <div className="volt-ticker flex h-full w-max items-center whitespace-nowrap" aria-hidden>
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0 items-center">
                {items.map((t, i) => (
                  <span key={i} className="flex items-center gap-6 px-6 text-[12px] font-bold tracking-[0.18em] uppercase">
                    {t}
                    <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden>
                      <path d="M6 0 0 7h4l-1 5 7-7H6l1-5Z" fill="currentColor" />
                    </svg>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Shop bar */}
        <div className="border-b border-line bg-bg/95 md:bg-bg/80 md:backdrop-blur-md">
          <div className="container-x flex h-14 items-center gap-8 md:h-16">
            <a href="#" aria-label="Volt Runners, home" className="font-display lean flex items-center gap-1.5 text-[28px] md:text-[32px]">
              {nav.logo}
              <Bolt />
            </a>
            <nav className="hidden items-center gap-7 lg:flex">
              {nav.links.map((l) => (
                <a key={l.label} href={l.href} className="link-underline pb-0.5 text-[13px] font-semibold tracking-[0.08em] uppercase">
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-5 md:gap-6">
              <button aria-label="Search" className="hidden items-center gap-2.5 border border-line px-3.5 py-2 text-[12px] text-muted transition-colors hover:border-fg hover:text-fg md:flex">
                <Icon d={SEARCH} />
                <span className="w-28 text-left">Search shoes</span>
              </button>
              <a href="#fit" className="hidden text-[12px] font-semibold tracking-[0.12em] uppercase transition-colors hover:text-accent sm:block">
                Size: UK <span className="tnum">9</span>
              </a>
              <a href="#drop" aria-label={`Bag, ${bag} items`} className="relative flex items-center">
                <Icon d={BAG} />
                <span
                  key={bump}
                  className={`tnum absolute -top-2 -right-2.5 grid h-[19px] min-w-[19px] place-items-center rounded-full px-1 text-[12px] leading-none font-bold ${
                    bag ? "bg-accent text-accent-fg" : "bg-surface text-muted"
                  } ${bump ? "bag-bump" : ""}`}
                >
                  {bag}
                </span>
              </a>
              <button onClick={() => setOpen(true)} className="text-[12px] font-bold tracking-[0.16em] uppercase lg:hidden">
                Menu
              </button>
            </div>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-bg">
          <div className="container-x flex h-[84px] items-center justify-between border-b border-line">
            <span className="font-display lean flex items-center gap-1.5 text-[28px]">
              {nav.logo}
              <Bolt />
            </span>
            <button onClick={() => setOpen(false)} className="text-[12px] font-bold tracking-[0.16em] uppercase">
              Close
            </button>
          </div>
          <nav className="container-x flex flex-1 flex-col justify-center">
            {nav.links.map((l, i) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="flex items-baseline gap-5 border-b border-line py-5">
                <span className="tnum text-[12px] font-semibold text-accent">0{i + 1}</span>
                <span className="font-display lean text-[52px]">{l.label}</span>
              </a>
            ))}
          </nav>
          <p className="container-x pb-8 text-[12px] font-semibold tracking-[0.16em] text-muted uppercase">{nav.ticker[1]}</p>
        </div>
      )}
    </>
  );
}
