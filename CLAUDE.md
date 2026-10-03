# Showreel Kit — playbook for Claude Code

This repo builds **one showcase website per day**. The team films the laptop screen with a phone held **vertically (9:16 Instagram reel)** while the site scrolls itself, and posts it to win clients. Two things matter most:

1. **Every site must look like a different designer made it.** New layout, nav, typography, cards and page flow every day. Only the engine underneath stays the same.
2. It must look **premium and real**: a cinematic moment (scroll video, product spin, colour switch) **plus** real-business sections (products, prices, offers, categories), so a client can picture their own brand.

Desktop (1440×900 and 1920×1080) is the priority; phones (375px) must not break.

## How the kit is organised

| Folder | What | Change per site? |
|---|---|---|
| `components/engine/` | Loader, SmoothScroll (Lenis ↔ GSAP), Animations (data attributes), RecordMode, Cursor, useFramePlayer | **No** |
| `lib/` | gsap setup, frame loading, loader tracker, site types | **No** |
| `components/patterns/` | Library of ready sections (stock + patterns from the reference reels). **Starting points, not templates.** See them live at `/patterns` | No: copy them, then restyle |
| `components/ui/` | SplitText, Magnetic, Button, TiltCard | Rarely |
| `site/` | **Everything about today's site**: `DESIGN.md`, `site.ts` (meta + theme), `fonts.ts`, `site.css`, `content.ts`, `components/`, `Page.tsx` | **Yes, rewritten every day** |
| `archive/` | Finished sites (`npm run archive -- <name>`, `npm run restore -- <name>`) | — |
| `docs/` | `DESIGN-MENU.md` (the variety engine), `SITES-LOG.md`, AI prompts, filming guide | Update the log |

`app/page.tsx` renders the engine + `site/Page.tsx`. `app/layout.tsx` reads `site/site.ts` (colours → CSS variables) and imports `site/fonts.ts` + `site/site.css`.

**Engine features you get for free**
- Scroll videos are image sequences: `npm run frames -- raw/<video>.mp4 frames/<slug>-<name>` → `/frames/<slug>-<name>`. Use them with `FrameHero` / `FrameScrub` / `useFramePlayer`.
- Animations by data attribute (`components/engine/Animations.tsx`): `data-reveal`, `data-reveal="stagger"`, `data-split` (with `<SplitText>`), `data-parallax="0.15"`, `data-zoom`, `data-count="850"`.
- `data-cursor="View"` on anything shows a label on the custom cursor.
- Theme tokens as Tailwind colours: `bg-bg`, `bg-surface`, `text-fg`, `text-muted`, `text-accent`, `bg-accent`, `text-accent-fg`, `border-line`; classes `font-display`, `eyebrow`, `container-x`, `section-y`, `btn btn-solid|btn-outline`. Override or add styles in `site/site.css`.
- `?static=1` = no motion (layout review) · `?record=1` = auto-scroll for filming.
- Record timeline: put `data-record-time` / `data-record-hold` (+ `-align`, `-offset`, `-mobile`) on sections so `?record=1` gives every section fixed seconds, identical on laptop and phone; `&at=HH:MM:SS` starts two devices together. See `docs/RECORDING.md`.

## Building a new site — Round 0 + 3 rounds

Stop after **every** round, tell the user in plain simple language what to check, and wait for their "ok".

### Round 0 — Design direction (no code yet)
1. **Read the brief** (brand, what it sells, audience, mood, assets in `raw/` and `public/images/`).
2. **Read `docs/SITES-LOG.md`** (what the last sites looked like) and **`docs/DESIGN-MENU.md`**.
3. **Pick one option from each menu**: look, palette, type pair, nav, hero, section shape, card style, signature moment, loader. Follow the uniqueness rule (≥ 6 of 8 different from each of the last 3 sites; never the same type pair or hero two days in a row).
4. **Plan 9–12 sections**: 1 hero + ~3 cinematic + ~5 shop-style + footer. For each: name, pattern it starts from (or "custom"), and *how it will be restyled*.
5. **Write `site/DESIGN.md`** with: the choices + a one-line reason each, the section plan, the assets still needed (with prompts from `docs/AI-VIDEO-PROMPTS.md`), and a "different from last sites" table.
6. **Ask the user**: approve the direction, and generate any missing assets.

### Round 1 — Structure (build it)
1. **Save the old site first**: `npm run archive -- <day-NN-slug>` (if not already saved), then clear `site/` except `DESIGN.md`.
2. **Assets**: put images in `public/images/<slug>/`. For every video: `npm run frames -- raw/<video>.mp4 frames/<slug>-<name> --zoom 1.2 --max 160` (< 15 MB each). Cut-out product images (transparent PNG/WebP) for pop cards / colour switcher.
3. **Fonts**: `npm i` the chosen pair, import them in `site/fonts.ts`.
4. **Write** `site/site.ts` (meta, theme, record), `site/site.css` (brand-specific styles: buttons, eyebrow, special effects), `site/content.ts` (all text/data), `site/components/*` and `site/Page.tsx`.
   - Copy each pattern you use into `site/components/` under a brand-specific name and **restyle it** (see the end of DESIGN-MENU.md). Import **at most 3 patterns unchanged** from `components/patterns/`.
   - Build the nav and footer for this site too (copy `Nav`, `NavPill`, `Footer` or `WordmarkFooter` and restyle, or make new ones).
   - Never edit `components/engine/` or `components/patterns/` for one site's needs; copy instead.
5. **Copy**: short, premium headlines (2–6 words per line). Real-sounding product names; sample prices in the brand's currency (₹ for Indian brands).
6. `npm run check` and `npm run build` must pass.
7. **Ask the user to review with motion off**: `http://localhost:3000/?static=1` on the laptop and at phone size. They check: every section shows, text is readable, nothing is cut or overlapping, it looks like the DESIGN.md direction and **not like the previous site**.

### Round 2 — Motion
1. **Hero**: tune the scroll length / switch timing; captions must have time to be read.
2. **Signature moment**: make it great. Supporting motion stays calm.
3. **Auto-motion for filming**: nobody touches the mouse on camera, so anything that needs hover/click must also play by itself while on screen (like `ExpandingPanels`, `ProductShowcase`, `VariantHero`).
4. **Ask the user to screen-record a slow scroll** and send it. Fix anything jumpy, too fast, empty-looking or overlapping.

### Round 3 — Polish (ready to film)
1. Readability (small text ≥ 12px, contrast), headings not breaking badly at 1440px.
2. Hover states, phone check (menu opens/closes, nothing cut off).
3. Loader shows the brand, then reveals the site.
4. No console errors; `npm run build` passes.
5. Set `meta.record.duration` so the **whole page scrolls in 25–40 s** (reel length). Test: `npm run build && npm start` → `http://localhost:3000/?record=1`.
6. **Add a row to `docs/SITES-LOG.md`** and run `npm run archive -- <day-NN-slug>`.
7. Report back in plain simple language: the section list, anything skipped, and the filming command (see `docs/RECORDING.md`).

## House style

- Big headings, generous spacing, few words. Never cram.
- One accent colour per site (a section may flip to a colour band on purpose).
- All images in one site share one mood and colour grade.
- Motion is smooth and confident, never bouncy or messy.
- **Prices**: sample prices are fine (it's a concept). Always keep a footer note like "Concept website by <studio>".
- No fake phone numbers, addresses of real people, or legal text.
- Real brand names are OK for concept sites, but never use the brand's real logo file or copy their real website; the design is ours.

## Adding to the pattern library

If you build something on a site that would be useful again (a new nav, hero, card or section), **also** add a clean, generic version to `components/patterns/`, show it on `app/patterns/page.tsx`, and add it to `docs/DESIGN-MENU.md`.

## Commands

- `npm run dev` / `npm run build && npm start` (use production for filming)
- `npm run frames -- <video> <folder> [--zoom 1.2] [--max 160] [--start s] [--end s] [--reverse]`
- `npm run check`: all images/frames used in `site/` exist
- `npm run archive -- <name>` / `npm run restore -- <name>`
- `/patterns`: pattern catalogue · `?static=1`: no motion · `?record=1`: auto-scroll (`&duration=30` or `&speed=200`)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
