"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { craft } from "../content";

/**
 * Text-mask reveal: "HAND FINISHED" filled with the atelier photo; scrolling pulls the
 * letters apart into the full photograph, then the story fades in.
 */
export default function MaskReveal() {
  const outer = useRef<HTMLElement>(null);
  const words = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const story = useRef<HTMLDivElement>(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setStill(true);
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: outer.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
      tl.to({}, { duration: 1 });
      tl.to(words.current, { scale: 1.6, opacity: 0, duration: 0.45, ease: "power2.in" }, 0.1);
      tl.fromTo(photo.current, { opacity: 0, scale: 1.25 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }, 0.2);
      tl.fromTo(story.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.15 }, 0.62);
    }, outer);
    return () => ctx.revert();
  }, []);

  const Words = (
    <div ref={words} className="flex h-full flex-col items-center justify-center">
      {craft.words.map((w) => (
        <span
          key={w}
          className="font-display mask-text block text-center text-[clamp(72px,15.5vw,300px)] leading-[0.86] font-extrabold tracking-[-0.02em]"
          style={{ backgroundImage: `url(${craft.image})` }}
        >
          {w}
        </span>
      ))}
    </div>
  );

  const Story = (
    <div ref={story} className={`container-x absolute inset-x-0 bottom-[10vh] text-[#f3ece1] ${still ? "" : "opacity-0"}`}>
      <p className="eyebrow mb-5 !text-[#d9b48f]">{craft.eyebrow}</p>
      <h2 className="font-display max-w-[min(620px,44vw)] text-[clamp(40px,4.4vw,76px)] max-md:max-w-none">{craft.heading}</h2>
      <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#f3ece1]/80">{craft.text}</p>
    </div>
  );

  if (still) {
    return (
      <section id="atelier" data-record-label="Hand finished + atelier" data-record-time="4" data-record-align="bottom">
        <div className="h-screen pt-[72px]">{Words}</div>
        <div data-nav-dark className="relative h-screen overflow-hidden bg-[var(--plate)]">
          <img src={craft.image} alt="A Meridian watchmaker at the bench" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 via-45% to-transparent to-75%" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 via-35% to-transparent to-65% md:hidden" />
          {Story}
        </div>
      </section>
    );
  }

  return (
    <section ref={outer} id="atelier" data-record-label="Hand finished + atelier" data-record-time="4" data-record-align="bottom" className="relative h-[280vh]">
      <div data-nav-dark className="pointer-events-none absolute inset-x-0 bottom-0 top-[70vh]" />
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 pt-[72px]">{Words}</div>
        <div ref={photo} className="absolute inset-0 bg-[var(--plate)] opacity-0">
          <img src={craft.image} alt="A Meridian watchmaker at the bench" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 via-45% to-transparent to-75%" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 via-35% to-transparent to-65% md:hidden" />
        </div>
        {Story}
      </div>
    </section>
  );
}
