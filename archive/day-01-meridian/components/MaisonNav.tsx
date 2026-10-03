"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { onSiteReady } from "@/lib/loading";
import { onReveal } from "./ClockLoader";

type Props = { logo: string; links: { label: string; href: string }[]; bag: number };

const Search = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5 21 21" />
  </svg>
);

/**
 * N3 split nav: links left · wordmark centre · search + bag right.
 * Ivory with a hairline on paper; turns light while any [data-nav-dark] area is under it.
 */
export default function MaisonNav({ logo, links, bag }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const active = new Set<Element>();
    let triggers: ScrollTrigger[] = [];
    let raf = 0;
    const offIntro = onReveal(() => {
      if (!prefersReducedMotion()) gsap.from(ref.current, { y: -24, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out" });
    });
    const off = onSiteReady(() => {
      // next frame: sections that swap layout on mount (?static=1) have rendered by then
      raf = requestAnimationFrame(() => {
        triggers = gsap.utils.toArray<HTMLElement>("[data-nav-dark]").map((el) =>
          ScrollTrigger.create({
            trigger: el,
            start: "top 36px",
            end: "bottom 36px",
            onToggle: (self) => {
              if (self.isActive) active.add(el);
              else active.delete(el);
              setDark(active.size > 0);
            },
          }),
        );
      });
    });
    return () => {
      offIntro();
      off();
      cancelAnimationFrame(raf);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) window.__lenis?.stop();
    else if (wasOpen.current) window.__lenis?.start();
    wasOpen.current = open;
  }, [open]);

  return (
    <>
      <header
        ref={ref}
        className={`maison-nav fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md ${dark ? "is-dark" : ""}`}
      >
        <div className="container-x grid h-[72px] grid-cols-[1fr_auto_1fr] items-center">
          <nav className="hidden items-center gap-9 lg:flex">
            {links.map((l) => (
              <a key={l.label} href={l.href} className="link-underline pb-0.5 text-[12px] font-medium tracking-[0.14em] uppercase">
                {l.label}
              </a>
            ))}
          </nav>
          <button onClick={() => setOpen(true)} className="justify-self-start text-[12px] font-medium tracking-[0.14em] uppercase lg:hidden">
            Menu
          </button>

          <a href="#" className="font-display text-[22px] tracking-[0.32em] md:text-[26px]" aria-label={logo}>
            {logo}
          </a>

          <div className="flex items-center justify-end gap-6 text-[12px] font-medium tracking-[0.14em] uppercase">
            <button aria-label="Search" className="hidden opacity-80 transition-opacity hover:opacity-100 sm:block">
              <Search />
            </button>
            <a href="#collection" className="link-underline pb-0.5">
              Bag <span className="tnum">({bag})</span>
            </a>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-bg">
          <div className="container-x grid h-[72px] grid-cols-[1fr_auto_1fr] items-center border-b border-line">
            <button onClick={() => setOpen(false)} className="justify-self-start text-[12px] font-medium tracking-[0.14em] uppercase">
              Close
            </button>
            <span className="font-display text-[22px] tracking-[0.32em]">{logo}</span>
            <span />
          </div>
          <nav className="container-x flex flex-1 flex-col justify-center">
            {links.map((l, i) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="flex items-baseline gap-5 border-b border-line py-6">
                <span className="ref">0{i + 1}</span>
                <span className="font-display text-5xl">{l.label}</span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
