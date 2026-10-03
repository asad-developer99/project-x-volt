import { privileges } from "../content";

type Tile = { image: string; title: string; text: string };

function Photo({ t, className = "" }: { t: Tile; className?: string }) {
  return (
    <a href="#" data-cursor="View" className={`plate group relative min-h-[260px] ${className}`}>
      <img src={t.image} alt={t.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute inset-x-6 bottom-6">
        <p className="font-display text-[clamp(24px,2vw,34px)]">{t.title}</p>
        <p className="mt-1 text-[13px] text-[#f3ece1]/75">{t.text}</p>
      </div>
    </a>
  );
}

/** Bento, restyled: dark photo plates mixed with ivory privilege tiles, all rounded panels. */
export default function PrivilegeBento() {
  const { tourbillon, wrist, back } = privileges.tiles;
  const [engrave, warranty, viewing] = privileges.perks;
  const Perk = ({ p }: { p: (typeof privileges.perks)[number] }) => (
    <div className="flex min-h-[220px] flex-col justify-between rounded-[var(--plate-radius)] border border-line bg-surface p-7">
      <span className="font-display text-[44px] leading-none text-accent italic">{p.mark}</span>
      <div>
        <p className="text-[15px] font-semibold">{p.title}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">{p.text}</p>
      </div>
    </div>
  );
  return (
    <section className="section-y !pt-0" data-record-label="Look closer" data-record-time="2.5" data-record-align="center">
      <div className="container-x">
        <div data-reveal className="mb-12 flex items-end justify-between gap-6 border-b border-line pb-8">
          <div>
            <p className="eyebrow mb-5">{privileges.eyebrow}</p>
            <h2 className="font-display text-[clamp(44px,5vw,88px)]">{privileges.heading}</h2>
          </div>
        </div>
        <div data-reveal="stagger" className="grid gap-4 md:grid-cols-4 md:auto-rows-[clamp(220px,19vw,300px)]">
          <Photo t={tourbillon} className="md:col-span-2" />
          <Photo t={wrist} className="md:row-span-2" />
          <Perk p={engrave} />
          <Photo t={back} />
          <Perk p={warranty} />
          <Perk p={viewing} />
        </div>
      </div>
    </section>
  );
}
