import SplitText from "@/components/ui/SplitText";
import { heartbeat } from "../content";

/** Small seconds dial: 60 hairline ticks and a hand that steps once a second. */
function SecondsDial() {
  return (
    <svg viewBox="0 0 100 100" className="h-16 w-16 text-fg" aria-hidden>
      {Array.from({ length: 60 }, (_, i) => (
        <line
          key={i}
          x1="50"
          y1={i % 5 === 0 ? 4 : 6}
          x2="50"
          y2="10"
          stroke="currentColor"
          strokeWidth={i % 5 === 0 ? 1.2 : 0.6}
          transform={`rotate(${i * 6} 50 50)`}
        />
      ))}
      <g className="tick-hand">
        <line x1="50" y1="58" x2="50" y2="14" stroke="var(--accent)" strokeWidth="1.2" />
      </g>
      <circle cx="50" cy="50" r="2.2" fill="var(--accent)" />
    </svg>
  );
}

/** Statement, restyled: centred Bodoni on paper, italic bronze ending, a ticking dial above. */
export default function Heartbeat() {
  return (
    <section className="section-y" data-record-label="Two hundred and eleven parts" data-record-time="2" data-record-align="center">
      <div className="container-x flex flex-col items-center text-center">
        <div data-reveal className="mb-10 flex flex-col items-center gap-5">
          <SecondsDial />
          <p className="ref">{heartbeat.eyebrow}</p>
        </div>
        <SplitText text={heartbeat.text} as="p" className="font-display max-w-5xl text-[clamp(38px,5.4vw,92px)] leading-[1.04]" />
      </div>
    </section>
  );
}
