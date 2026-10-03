"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { onSiteReady } from "@/lib/loading";
import { Bolt } from "./DropNav";
import { footer } from "../content";

/** WordmarkFooter, restyled: a giant outlined, slanted VOLT that fills with lime as the footer scrolls in. */
export default function VoltFooter() {
  const root = useRef<HTMLElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let tween: gsap.core.Tween | undefined;
    const off = onSiteReady(() => {
      tween = gsap.fromTo(
        fill.current,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", ease: "none", scrollTrigger: { trigger: root.current, start: "top 85%", end: "bottom bottom", scrub: true } },
      );
    });
    return () => {
      off();
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, []);

  return (
    <footer
      ref={root}
      className="slant-top relative z-[1] overflow-hidden border-t border-line bg-surface pt-[calc(var(--slant)+clamp(36px,4.5vw,64px))]"
      data-record-label="Footer"
      data-record-time="1"
      data-record-hold="1"
      data-record-align="bottom"
    >
      <div className="container-x grid gap-9 lg:grid-cols-[1.2fr_2fr] lg:gap-12">
        <div>
          <p className="font-display lean text-[clamp(36px,3.4vw,56px)]">{footer.newsletter.title}</p>
          <p className="mt-3 max-w-[360px] text-[14px] text-muted">{footer.newsletter.text}</p>
          <form className="mt-7 flex max-w-[420px] items-end gap-3" onSubmit={(e) => e.preventDefault()}>
            <label className="sr-only" htmlFor="mail">
              Email
            </label>
            <input id="mail" type="email" placeholder={footer.newsletter.placeholder} className="letter-input flex-1 py-3 text-[15px]" />
            <button type="submit" className="btn btn-solid !px-5 !py-3">
              Join
            </button>
          </form>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          {footer.columns.map((c) => (
            <div key={c.title}>
              <p className="label">{c.title}</p>
              <ul className="mt-3 space-y-1.5 md:mt-4 md:space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="link-underline text-[14px] md:text-[15px]">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* the wordmark */}
      <div aria-hidden className="relative mt-8 select-none lg:mt-6">
        <p className="font-display relative text-center text-[clamp(120px,25vw,440px)] leading-[0.8]">
          <span className="lean outline-text text-fg/25">{footer.word}</span>
          <span ref={fill} className="absolute inset-0 text-accent">
            <span className="lean">{footer.word}</span>
          </span>
        </p>
      </div>

      <div className="container-x flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-line py-4 text-[12px] text-muted md:py-5">
        <p className="flex items-center gap-2">
          <Bolt className="h-3.5 w-auto text-accent" />© 2026 Volt Runners (concept)
        </p>
        <p>{footer.note}</p>
      </div>
    </footer>
  );
}
