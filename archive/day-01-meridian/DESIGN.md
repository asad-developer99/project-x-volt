# Design direction: Meridian (Day 1 redesign)

**Brief:** Meridian, a luxury watch maison. Audience: people who buy premium watches. Mood: precise, elegant, timeless. Must look nothing like the Aurex demo, and must include shop sections (collection with prices, dial/strap options) next to the cinematic moment.

**The idea in one line:** a *printed Swiss horology catalogue*. Ivory paper, ink-black Bodoni, hairline rules and reference numbers. The dark, rose-gold footage sits on the page like **framed photographic plates** (inset rounded panels), so every cinematic moment "opens up" from the paper.

## Choices (codes from docs/DESIGN-MENU.md)

| | Choice | Why |
|---|---|---|
| Look | **L2 Warm editorial**, catalogue style: ivory paper + dark "night plates" for the footage | Aurex was all-black. A light page makes the dark rose-gold footage glow like prints in a book, and says "precise" |
| Palette | **Cream editorial**: bg `#f6f1e9` · surface `#ffffff` · text `#1d1a16` · muted `#6b645b` · accent `#8b5e34` (bronze, matches the rose gold). Plates: `#0d0b0a` | One warm accent that belongs to the watch itself; no gold-on-black |
| Type pair | **T4 Bodoni Moda + Manrope** (Manrope tabular numerals for refs, specs and prices) | Bodoni's hairline contrast = precision engraving. Aurex used Cormorant + Inter |
| Nav | **N3 Split**: Collection · Atelier · Boutiques left / **MERIDIAN** wordmark centre / search · bag (2) right, hairline under it | Feels like a real maison shop; Aurex had a transparent bar |
| Hero | **H8 variant: product on a plate + spec bar.** Big Bodoni headline on paper, the watch inside a framed dark plate, spec bar under it (calibre · 42 mm · 18k rose gold · 72 h · price). On scroll the plate **grows to full-screen** and hands over to the exploded view | Not a full-screen video with captions (that was Aurex). Shop info is there from the first second |
| Section shape | **S5 Rounded panels** (inset plates, radius ~24px, paper visible around them) + hairline rules between paper sections | Catalogue page rhythm; Aurex was straight full-bleed |
| Cards | **C3 Pop-out**: the watch head rises above an ivory card with ref no., name, specs, price | Real shop feel; Aurex had sharp bordered cards |
| Signature moment | **Exploded parts with labelled callouts** (scroll-scrubbed: crystal → bezel → hands → movement → caseback, hairline leader lines draw in). Supporting: **dial & strap configurator** that switches by itself + **text-mask reveal** ("HAND FINISHED" filled with the atelier photo) | Aurex's moment was a desert drive + car spin |
| Loader | **I3 counter, as a clock**: a thin ring draws while the time runs 00:00 → 12:00, then the ring opens into the page | Brand-specific; Aurex used letters rise + wipe |

## Section plan (11)

| # | Section | Kind | Starts from | How it's restyled |
|---|---|---|---|---|
| 1 | **Nav** (split) | — | Nav → `MaisonNav` | New layout: links left, wordmark centre, search + bag count right, ivory with hairline; mobile = "Menu" sheet |
| 2 | **Hero: "Time, taken apart."** | cinematic | FrameHero → `PlateHero` | Headline on paper above, video frame 1 inside a rounded dark plate, spec bar + "Reserve · ₹12,90,000" under it. Plate scales to full-bleed as you scroll |
| 3 | **Anatomy** (signature) | cinematic | FrameScrub → `Anatomy` | Pinned full-screen scrub of the exploded video; 5 numbered callouts with hairline leader lines (01 Sapphire crystal … 05 Exhibition caseback), counter "Part 03 / 05" |
| 4 | **Statement**: "Two hundred and eleven parts. One heartbeat." | cinematic | Statement → `Heartbeat` | Word-by-word on paper, Bodoni italic for "one heartbeat", tiny ticking seconds hand beside it |
| 5 | **The Collection** | shop | ProductGrid (pop) → `CollectionCase` | 4 pop-out watches on ivory cards, ref numbers "M-01", specs line, ₹ prices, "Reserve" link; asymmetric grid (1 big + 3) instead of a row |
| 6 | **Configurator: "Make it yours."** | shop | VariantHero → `DialStudio` | Light version: watch on a paper disc, left column = dial chips, right = strap swatches, price updates, "Add to bag". **While on screen it switches every ~1.8 s** and the section pins briefly (~1 screen of scroll) so a filmed scroll shows at least 3 watches |
| 7 | **Hand finished** (text mask) | cinematic | custom → `MaskReveal` | Giant Bodoni "HAND FINISHED" filled with atelier.webp, zooms out into the full photo + 2-line story |
| 8 | **Numbers** | cinematic | Stats → `Specsheet` | Not big counters: a catalogue spec table with hairlines — 72 h reserve · 211 parts · 21,600 vph · 400 hours per watch (counts up) |
| 9 | **Details & privileges** | shop | Bento → `PrivilegeBento` | Rounded plates: tourbillon close-up, caseback, on the wrist + ivory offer tiles: complimentary engraving, 5-year warranty, private viewing |
| 10 | **Boutiques + private viewing** | shop | Split + Cta → `Boutiques` | box.webp plate left; right = city list (Mumbai · New Delhi · Dubai · Geneva, city names only) + "Book a private viewing" |
| 11 | **Questions** | shop | Faq → `CareFaq` | Hairline accordion: servicing, warranty, sizing, delivery & insurance; first item opens by itself on screen |
| 12 | **Footer** | — | WordmarkFooter → `MeridianFooter` | Huge MERIDIAN wordmark in Bodoni, newsletter line, links, "Concept website by <studio>" |

Unchanged patterns imported: 0 (everything copied + restyled).

## Assets

**Have**
- `raw/hero.mp4` (8 s, 1920×1080): rose-gold skeleton watch **exploding into its parts**, watch on the right, calm space left. Used for both hero (first frame) and Anatomy (full scrub) → `npm run frames -- raw/hero.mp4 frames/meridian-exploded --zoom 1.2 --max 160` (zoom hides the "Veo" watermark).
- `public/images/meridian/`: `atelier` (watchmaker at bench), `back` (caseback), `box` (walnut box), `tourbillon` (macro), `wrist` (on the wrist, city at night). All 2752×1536, same warm dark grade. ✅ one mood.
- Note: every image has the small ✦ sparkle in the bottom-right corner. I'll crop it out with framing (object-position / slight scale) in Round 1, or you can remove it before then.

**Still needed** (for the Collection cards + Configurator; same angle for all)
1. **4 cut-out watches**, front view, transparent PNG → `public/images/meridian/watch-rose.png`, `watch-midnight.png`, `watch-ivory.png`, `watch-onyx.png`
   - Nano Banana Pro, first image:
     `Luxury mechanical wristwatch product photo, the complete watch standing upright with the strap closed in a loop as if worn on a wrist (buckle at the bottom, whole strap visible, nothing cut off), straight front view of the dial, 42mm 18k rose gold case, open skeleton dial showing gears and a tourbillon at 6 o'clock, blue steel hands, brown alligator strap, centred, plain pure white background, soft studio light, sharp, no shadow, no text, no logo`
   - Same prompt, "same watch, same angle", with:
     - `midnight blue sunray dial, rose gold case, navy leather strap`
     - `ivory grand-feu enamel dial with thin black numerals, rose gold case, black calf strap`
     - `black onyx dial, blackened steel case, black rubber strap`
   - Whole watch in frame with the looped strap (it floats above the cards, so nothing may be cropped). Leave a little empty space around it.
   - Remove backgrounds (remove.bg / Photoroom) → drop the PNGs in `public/images/meridian/`.
   - The configurator will use these 4 as ready combinations (dial + strap change together). True mix-and-match would need extra strap images; not worth it for the reel.

**Optional**
- A second video, "reveal from darkness" (template E), only if you want a different hero from the exploded shot. Not needed: the plan uses the one video for both.

## Copy + prices (samples)

- Currency **₹** (studio's Indian audience). Collection: Tourbillon Rosé M-01 ₹48,50,000 · Squelette 42 M-02 ₹12,90,000 · Nocturne M-03 ₹9,75,000 · Heure Classique M-04 ₹6,40,000.
- Footer note: "Concept website by <studio>. Meridian is a fictional brand."

## Different from the last sites

| | Aurex (demo) | Meridian | Different? |
|---|---|---|---|
| Look | L1 dark luxury | L2 editorial catalogue (ivory + dark plates) | ✅ |
| Palette | Gold noir | Cream editorial + bronze | ✅ |
| Type pair | T1 Cormorant + Inter | T4 Bodoni Moda + Manrope | ✅ |
| Nav | N1 transparent bar | N3 split, shop icons | ✅ |
| Hero | H1 full-screen video + captions | H8 plate + spec bar, grows into video | ✅ |
| Section shape | S1 straight | S5 rounded panels | ✅ |
| Cards | C1 sharp border | C3 pop-out | ✅ |
| Signature | Scroll video + 360° spin | Exploded parts + callouts | ✅ |

**8 / 8 different.**

## Round 1 notes (what changed while building)

- **Hero + Anatomy are one pinned section** (`PlateHero`): the plate grows to full screen, then the same canvas scrubs the exploded video. Two separate sections would show a seam.
- **Hero watch = M-01 Tourbillon Rosé at ₹48,50,000** (it's the watch in the video), not Squelette 42.
- **Collection mapping:** rose → M-01 Tourbillon Rosé · onyx → M-02 Squelette Onyx · midnight → M-03 Nocturne · ivory (plain enamel) → M-04 Heure Classique.
- **Frames:** made from `raw/hero.mp4` with 3% trimmed off the right and bottom first (the zoom alone left the tip of the AI sparkle at the edge), then `--zoom 1.2 --max 160 --quality 66` → 15 MB.
- **Photos:** web copies in `public/images/meridian/web/` (16:9 crop that removes the ✦ sparkle, 1920 px). Originals untouched.
- **Watch cut-outs** are only ~220×290 px after trimming. Fine on cards; slightly soft in the configurator. A re-export at ≥ 1000 px tall would fix it.
- **Loader:** `site/components/ClockLoader.tsx` (I3 clock) with `meta.loader = false`, so the engine loader can't add waiting time. Always ~2.4 s, then a hole opens from the ring. Hero + nav intros wait for its `onReveal`. `meta.record.delay` = 4.5 s (loader + 2 s on the hero).
- Nav turns light over any `data-nav-dark` area (hero video, atelier photo, footer).

## Round 2 notes (motion)

- **Anatomy, laptop:** once full screen, the video scales down (max 0.8, keeps 150 px dark bands) and the callouts sit in those bands, never on the watch. Soft masked edges.
- **Anatomy, phone:** heading at the top, video ×1.3 centred between heading and caption, pans from the watch to the middle and eases to ×1.08 as it opens.
- **Configurator:** first switch after ~1.1 s on screen, then every 1.8 s. Measured in `?record=1`: 4 watches shown.
- **FAQ:** first answer slides open by itself when the list is on screen.
- **Record run (36 s):** scroll starts ~2 s after the loader and reaches the footer at 36 s.
