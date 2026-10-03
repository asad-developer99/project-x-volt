import SplitText from "@/components/ui/SplitText";
import { figures } from "../content";

/** Stats, restyled as a catalogue spec table: roman numerals, hairlines, big Bodoni figures. */
export default function Specsheet() {
  return (
    <section className="section-y" data-record-label="Figures" data-record-time="2.5" data-record-align="center">
      <div className="container-x grid gap-14 lg:grid-cols-[0.8fr_1.6fr]">
        <div>
          <p data-reveal className="eyebrow mb-5">
            {figures.eyebrow}
          </p>
          <SplitText text={figures.heading} className="font-display text-[clamp(40px,4.2vw,72px)]" />
        </div>
        <div data-reveal="stagger" className="border-b border-line">
          {figures.rows.map((r) => (
            <div key={r.label} className="grid grid-cols-[40px_1fr] items-baseline gap-x-6 border-t border-line py-7 md:grid-cols-[48px_minmax(0,1.1fr)_minmax(0,1fr)]">
              <span className="font-display text-[18px] text-accent italic">{r.n}</span>
              <div className="flex items-baseline gap-5">
                <span className="font-display tnum text-[clamp(48px,5vw,88px)]" data-count={r.value} data-suffix={r.suffix}>
                  {r.value.toLocaleString("en-US")}
                  {r.suffix}
                </span>
                <span className="ref hidden sm:inline">{r.label}</span>
              </div>
              <p className="col-start-2 mt-2 text-[14px] leading-relaxed text-muted md:col-start-3 md:mt-0">
                <span className="ref mb-1 block sm:hidden">{r.label}</span>
                {r.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
