import { footer } from "../content";

/** WordmarkFooter, restyled: an ink plate inset on the paper, letter sign-up, huge Bodoni wordmark. */
export default function MeridianFooter() {
  return (
    <footer className="px-[clamp(8px,1vw,16px)] pb-[clamp(8px,1vw,16px)]" data-record-label="Footer" data-record-time="1" data-record-hold="1" data-record-align="bottom">
      <div data-nav-dark className="plate on-plate relative overflow-hidden !bg-fg pt-20">
        <div className="container-x grid gap-14 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <form data-reveal className="max-w-sm" action="#">
            <p className="font-display text-[clamp(28px,2.4vw,40px)]">{footer.letter}</p>
            <div className="mt-6 flex items-end gap-4">
              <input type="email" placeholder="Your email" aria-label="Email" className="letter-input w-full py-3 text-[15px]" />
              <button type="submit" className="shrink-0 pb-3 text-[12px] font-semibold tracking-[0.16em] uppercase">
                Subscribe →
              </button>
            </div>
          </form>
          {footer.columns.map((c) => (
            <div key={c.title} data-reveal>
              <p className="mb-4 text-[12px] font-semibold tracking-[0.2em] text-[#d9b48f] uppercase">{c.title}</p>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="link-underline text-[14px] text-[#f3ece1]/80 hover:text-[#f3ece1]">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="container-x mt-16 flex flex-wrap justify-between gap-3 border-t border-[#f3ece1]/15 py-6 text-[12px] text-[#f3ece1]/60">
          <p>
            © {new Date().getFullYear()} {footer.name}
          </p>
          <p>{footer.note}</p>
        </div>
        <p
          aria-hidden
          data-reveal
          className="font-display -mb-[0.16em] select-none text-center leading-none whitespace-nowrap text-[#f3ece1]"
          style={{ fontSize: "min(15.5vw, 40vh)", letterSpacing: "0.02em" }}
        >
          {footer.logo}
        </p>
      </div>
    </footer>
  );
}
