"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { limited } from "../content";

/** Next opening (weekday + hour, device time). Every device with a synced clock gets the same moment. */
function nextOpening(day: number, hour: number) {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  d.setDate(d.getDate() + ((day - d.getDay() + 7) % 7));
  if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 7);
  return d.getTime();
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Days : hours : min : sec until the draw opens. Ticks on the real second, so two synced devices tick together. */
function useCountdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const target = nextOpening(limited.opensDay, limited.opensHour);
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      setLeft(Math.max(0, target - Date.now()));
      t = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    };
    tick();
    return () => clearTimeout(t);
  }, []);
  if (left === null) return ["--", "--", "--", "--"];
  const s = Math.floor(left / 1000);
  return [pad(Math.floor(s / 86400)), pad(Math.floor(s / 3600) % 24), pad(Math.floor(s / 60) % 60), pad(s % 60)];
}

/**
 * The colour flip: a full lime band with black type and slanted top/bottom edges.
 * Big cut-out racer, live countdown to the draw, 500 numbered pairs, ₹ price.
 */
export default function LimitedDrop() {
  const parts = useCountdown();
  const labels = ["Days", "Hrs", "Min", "Sec"];

  return (
    <section
      id="limited"
      className="on-lime slant-both relative z-[1] overflow-hidden bg-accent py-[calc(var(--slant)+clamp(64px,9vw,140px))] text-accent-fg"
      data-record-label="Limited drop (hold)"
      data-record-time="1.5"
      data-record-hold="2"
      data-record-align="center"
    >
      {/* background: outlined MONSOON rows drifting */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex -rotate-[4deg] flex-col justify-center gap-2 opacity-[0.11] select-none">
        {[0, 1, 2].map((r) => (
          <div key={r} className="volt-ticker flex w-max whitespace-nowrap" style={{ animationDuration: `${60 + r * 14}s`, animationDirection: r % 2 ? "reverse" : "normal" }}>
            {Array.from({ length: 8 }, (_, k) => (
              <span key={k} className="font-display outline-text px-6 text-[clamp(90px,11vw,200px)] leading-[1.05] text-accent-fg">
                Monsoon 01
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="container-x relative grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        {/* the shoe */}
        <div data-reveal className="relative order-2 lg:order-1">
          <p aria-hidden className="font-display absolute -top-[6%] left-0 text-[clamp(44px,5vw,84px)] leading-none">
            <span className="lean">#001</span>
          </p>
          <img
            src={limited.image}
            alt={`${limited.name.join(" ")}, limited edition racing shoe`}
            className="relative w-full -rotate-[8deg] object-contain md:drop-shadow-[0_50px_40px_rgba(0,0,0,.45)]"
            data-parallax="0.08"
          />
        </div>

        {/* the drop */}
        <div className="relative z-[1] order-1 lg:order-2">
          <p className="inline-flex items-center gap-2 bg-bg px-3 py-1.5 text-[12px] font-bold tracking-[0.16em] text-accent uppercase">
            {limited.eyebrow} · {limited.pairs}
          </p>
          <h2 className="font-display mt-5 text-[clamp(64px,7.4vw,136px)]">
            {limited.name.map((l) => (
              <span key={l} className="lean block">
                {l}
              </span>
            ))}
          </h2>
          <p className="mt-5 max-w-[440px] text-[16px] leading-relaxed font-medium text-accent-fg/80">{limited.text}</p>

          <p className="label mt-8 !text-accent-fg/70">Draw opens in</p>
          <div className="mt-3 flex gap-2" aria-live="off">
            {parts.map((p, k) => (
              <div key={labels[k]} className="chamfer flex w-[clamp(68px,6vw,92px)] flex-col items-center bg-bg py-3 text-accent" style={{ "--cut": "10px" } as React.CSSProperties}>
                <span className="font-display tnum text-[clamp(36px,3.4vw,54px)] leading-none">{p}</span>
                <span className="mt-1.5 text-[12px] font-semibold tracking-[0.14em] text-fg/80 uppercase">{labels[k]}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
            <Button href="#limited" label={`${limited.cta} · ${limited.price}`} />
            <div className="text-[13px] font-semibold">
              <p>{limited.numbered}</p>
              <p className="text-accent-fg/70">
                <span className="tnum" data-count={limited.entries}>
                  {limited.entries.toLocaleString("en-US")}
                </span>{" "}
                runners entered
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
