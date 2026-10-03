import Button from "@/components/ui/Button";
import { boutiques } from "../content";

/** Split + Cta, restyled: walnut box on a dark plate, city list with hairlines, viewing button. */
export default function Boutiques() {
  return (
    <section id="boutiques" className="section-y" data-record-label="Boutiques" data-record-time="2.5" data-record-align="center">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div data-reveal className="plate relative aspect-[4/5] max-h-[80vh] w-full">
          <img src={boutiques.image} alt="Meridian watch in its walnut presentation case" data-zoom className="absolute inset-0 h-full w-full object-cover object-[68%_50%]" />
        </div>
        <div>
          <p data-reveal className="eyebrow mb-5">
            {boutiques.eyebrow}
          </p>
          <h2 data-reveal className="font-display text-[clamp(40px,4.2vw,72px)]">
            {boutiques.heading}
          </h2>
          <p data-reveal className="mt-6 max-w-md text-[15px] leading-relaxed text-muted">
            {boutiques.text}
          </p>
          <ul data-reveal="stagger" className="mt-10 border-b border-line">
            {boutiques.cities.map((c) => (
              <li key={c.city} className="group flex items-baseline justify-between border-t border-line py-5">
                <span className="font-display text-[clamp(26px,2.2vw,36px)] transition-transform duration-500 group-hover:translate-x-2">{c.city}</span>
                <span className="ref">{c.note} →</span>
              </li>
            ))}
          </ul>
          <div data-reveal className="mt-10 flex flex-wrap items-center gap-6">
            <Button href="#" label={boutiques.cta} />
            <a href="#collection" className="link-underline pb-0.5 text-[12px] font-semibold tracking-[0.16em] uppercase">
              Or reserve online
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
