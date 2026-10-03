# Design direction: Volt Runners (Day 2)

**Brief:** Volt Runners, a performance sneaker brand from India. Audience: young runners and sneaker fans, 18–30. Mood: fast, bold, energetic. Must look nothing like Day 1 (Meridian): dark background, one neon accent, bold sport type. Signature moment: **colour switcher**: the shoe changes colour and the page glow changes with it (no exploded view). Shop sections: new drop with ₹ prices, size picker, collection cards, "limited drop".

*(This folder started as a copy of Day 1. The Meridian plan that was here is fully replaced; Meridian itself is saved in `archive/day-01-meridian`.)*

**The idea in one line:** *a night race in the city.* Near-black asphalt, one volt-lime light, huge condensed type that leans forward. The page is built on **diagonals**: sections meet on a slant, the marquee is skewed and the headlines lean. Everything should feel like it's already moving.

## Choices (codes from docs/DESIGN-MENU.md)

| | Choice | Why |
|---|---|---|
| Look | **L4 Neon sport / tech** with **L7 street** edges (hard corners, stickers, big condensed caps) | Meridian was a light, quiet paper catalogue. This is loud, dark and fast |
| Palette | **Volt night** (Neon lime, tuned): bg `#08090a` · surface `#121417` · text `#f3f5ef` · muted `#9da39a` · accent `#c8ff1a` (volt lime) · accent-fg `#08090a` | One neon accent that *is* the brand name. Muted passes 4.5:1 on bg |
| Type pair | **T7 Anton + Space Grotesk**. Anton in caps with a CSS forward slant (`skewX(-8deg)`) for headings; Space Grotesk tabular numbers for prices, sizes, the countdown | Condensed sport poster type. Meridian used Bodoni + Manrope |
| Nav | **N5 Offer ticker + shop bar**: thin lime ticker on top ("DROP 07 LIVE · FREE DELIVERY ACROSS INDIA · 30-DAY RUN TEST"), then a black bar: VOLT wordmark · Run · Train · Collections · Drops · search · size · bag (0). The bag number **bumps** when the size picker "adds to bag" | Looks like a real sneaker store; Meridian had a centred split nav |
| Hero | **H6 variant: wordmark over a living photo** (no video) + bottom drop strip. `hero-run.jpg` (lime shoes splashing on a wet night road) animated in code: slow cinematic zoom, moving light streaks, falling rain, pulsing lime glow, looping forever. Huge slanted "VOLT / RUNNERS" in Anton on the dark left side, line "Run loud." + 2 buttons, bottom strip: "DROP 07 · VOLT SPRINT · ₹12,999 · LIVE NOW" | Meridian's hero was a framed plate that grew; this is full-bleed and loud from the first frame. A code-animated still loops perfectly, has no watermark and stays sharp at any size |
| Section shape | **S6 Tilted**: sections meet on a ~3° slant (clip-path), the marquee band is tilted, the limited-drop band flips to full lime on purpose | Speed. Meridian used rounded inset panels |
| Cards | **C5 Glass**, sport version: dark frosted cards with a **chamfered (cut) corner**, thin line border that turns lime on hover, shoe breaks out of the top edge | Meridian used ivory pop-out cards |
| Signature moment | **Colour switch** (`VariantHero` → `ColourLab`): side-profile shoe, 5 colourways. The shoe slides out and the next one slides in, the giant name behind it changes, and a **page-wide glow** (a fixed `--glow` layer) takes the colourway's colour and carries into the sections below. Supporting: **skewed speed marquee** + **stacking tech cards** | Meridian's signature was an exploded view |
| Loader | **Race start** (new, based on I3 counter): 3 red start lights come on one by one, all turn lime → a lime bar sweeps across and opens the page. **Fixed 2.5 s**, `data-loader` on the overlay, supports `&at=` via `lib/atTime.ts` (first frame frozen = black screen, 3 dark lights, VOLT RUNNERS) | Brand-specific; Meridian was a clock counter. Same sync behaviour as Day 1's `ClockLoader` |

**About "one accent":** the UI accent (buttons, prices, ticker, links) is always volt lime. Only the ambient glow and the shoe follow the colourway. Buttons never change colour, so the site still reads as one brand.

**Motion feel: energetic but smooth.** Fast-looking, never jerky. Moves use `power3/expo.out` eases (no bounce, no elastic). Speed comes from the diagonals, the slanted type and the fast marquee, not from shaking things. One thing moves at a time per section. Colour changes cross-fade over ~0.6 s.

## Section plan (11)

| # | Section | Kind | Starts from | How it's restyled |
|---|---|---|---|---|
| 1 | **Nav** (ticker + shop bar) | — | Ticker + Nav → `DropNav` | Lime ticker strip on top, black shop bar under it with search / size / bag count. Mobile: wordmark + bag + "Menu" full-screen sheet with huge Anton links |
| 2 | **Hero: "Run loud."** | cinematic | custom → `NightHero` | `hero-run.jpg` full-bleed, animated in code (see "Hero animation" below). Slanted Anton wordmark "VOLT / RUNNERS" over the dark left side (the shoes stay clear on the right), headline + "Shop the drop" / "Find your size", bottom drop strip with a pulsing "LIVE" dot. The bottom edge is cut on a slant |
| 3 | **Speed marquee** | cinematic | Marquee → `SpeedBand` | Lime band tilted −3°, black Anton "FASTER · LIGHTER · LOUDER ·" moving fast, with a second outlined row going the other way. Scroll speeds it up |
| 4 | **Colour Lab** (signature) | cinematic + shop | VariantHero → `ColourLab` | Pinned (~2 screens). Side-profile shoe centre, giant colourway name behind it (Anton, outlined), swatch rail left (5 dots), spec + price right ("Volt Sprint · 212 g · ₹12,999"), counter "03 / 05". The colourway **follows the scroll through the pin** (5 equal parts: Ember → Ice → Pulse → Ghost → Volt Lime), so it plays by itself during any scroll and is frame-identical on laptop + phone in `?record=1`; swatch clicks scroll to that colour; sets the page `--glow` |
| 5 | **New drop** | shop | ProductGrid → `DropRail` | 4 glass chamfer cards in a row (1 wider feature card + 3), shoe breaking out of the top, tags ("NEW", "−20%", "RUNNER'S PICK"), weight + drop spec, ₹ price, colour dots |
| 6 | **Size picker: "Find your fit."** | shop | custom → `SizeLab` | Shoe left; right: UK 6–12 grid (sold-out sizes crossed out), Regular / Wide toggle, "Only 3 left in UK 9", "Add to bag · ₹12,999". **Plays by itself**: the cursor-less demo picks UK 9 → Wide → Add to bag, nav bag bumps to 1. Perk row under it: free delivery · 30-day run test · free size exchange |
| 7 | **Tech stack** | cinematic | custom → `TechStack` | 3 stacking cards (each pins, the next slides over at a slant): VOLTFOAM midsole / CARBON plate / GRIPLINE outsole. Each: macro photo, one line, one big counting stat (82% energy return, 3.2 mm plate, 1,000 km grip) |
| 8 | **Collections** | shop | ExpandingPanels → `CollectionStrips` | 4 tall slanted strips: ROAD · TRAIL · TRACK · STREET, vertical Anton labels, "24 styles →". Opens one by one by itself while on screen |
| 9 | **Limited drop** | shop | custom → `LimitedDrop` | **Colour flip**: full lime band, black text. "VOLT MONSOON 01", big cut-out shoe, live countdown (days : hrs : min : sec), "Only 500 pairs · numbered #001–#500", "Enter the draw · ₹17,999". Slanted top and bottom edges |
| 10 | **Run club** | cinematic | Stats → `RunClub` | Two photos (dawn run club, Marine Drive vibe) + counters: 12 cities · 40,000 runners · 1.2 M km logged. "Sunday 5:30 AM. Be there." |
| 11 | **Footer** | — | WordmarkFooter → `VoltFooter` | Huge outlined slanted VOLT that fills lime on scroll, newsletter "Join the 5 AM club", link columns, "Concept website by <studio>" |

Unchanged patterns imported: 0 (everything copied + restyled).

## Hero animation (code only, loops forever)

Source: `public/images/volt/hero-run.jpg` (2752×1536 ✅): shoes on the right, calm dark road and light streaks on the left, which is where the text goes. Converted to WebP (~2400 px wide) and preloaded so it's there the moment the loader opens.

Layers, back to front (all GPU-friendly: only `transform` / `opacity`, one small canvas):

1. **Slow cinematic zoom:** the photo scales 1.04 → 1.12 and drifts slightly toward the shoes (origin ~70% / 60%), 18 s, then eases back (`sine.inOut` yoyo), so the loop has no jump. It never zooms below 1.04, so no edges ever show.
2. **Moving light streaks:** 6 thin blurred lines in the photo's own colours (teal, tail-light red, sodium orange, one lime) at the height of the existing streaks (~30–45% from the top). They shoot right → left at different speeds and delays (1.2–2.4 s each, `screen` blend), like cars passing behind the runner.
3. **Falling rain:** a canvas of ~160 thin slanted drops (~70 on phones), 3 depths (small/slow/faint far away, long/fast/brighter close up), falling at a slight angle to match the running direction, and wrapping endlessly. A few tiny splash sparks pop near the front shoe. The canvas pauses when the hero is off-screen or the tab is hidden.
4. **Pulsing lime glow:** a soft radial lime light around the front shoe (~68% / 66%) plus a faint wash on the road reflection, breathing 0.35 → 0.65 opacity over 3.2 s (`sine.inOut`, yoyo). The same glow colour becomes the page `--glow` that the Colour Lab takes over later.
5. **Readability:** a dark gradient from the left (behind the wordmark) + a soft vignette + film grain.

Calm, not busy: the zoom is slow, the rain is thin, and only the streaks are fast. With `?static=1` or reduced motion it's the still photo + glow, with no canvas. On phones the image is cropped to keep the front shoe in view (`object-position ~70%`).

## Record timeline (same system as Day 1)

`?record=1` uses the section timeline: `data-record-time` / `data-record-hold` (+ `-align`, `-offset`, `-mobile`) on the sections, identical seconds on laptop and phone, and `&at=HH:MM:SS` for a synced two-device start (docs/RECORDING.md). Planned timeline, **~38.5 s after the 2.5 s loader**:

| Stop | Move (s) | Hold (s) | Arrives at | What plays |
|---|---|---|---|---|
| Hero | 0 | 3 | 0 | zoom, streaks, rain and glow loop; "LIVE" dot pulses |
| Speed band | 1.5 | | 4.5 | marquee speeds up with the scroll |
| Colour Lab: start of pin | 1.0 | | 5.5 | |
| Colour Lab: end of pin | 7 | | 12.5 | the colour follows the pin progress (5 colourways, ~1.4 s each), so both devices show the same colour at the same second |
| New drop | 1.5 | 2.5 (phone 1.5) | 14.0 | |
| Size picker | 1.5 | 4 | 18.0 | `record:hold` plays the demo: UK 9 → Wide → Add to bag → nav bag 0 → 1 |
| Tech stack: end of pin | 4.5 | | 26.5 | 3 cards stack |
| Collections | 2 | 2.5 | 28.5 | `record:hold` opens the 4 strips one by one |
| Limited drop | 1.5 | 2 | 32.5 | countdown ticks |
| Run club | 2 | | 36.5 | counters count up |
| Footer | 1 | 1 | 37.5 → done 38.5 | VOLT fills lime |

These numbers get fine-tuned in Round 2. Time-driven content (the colour switch, the size demo, the countdown) is tied to scroll progress or `record:hold`, not to free-running timers, so the laptop and phone stay frame-matched.

## Different from the last sites

| | demo · Aurex | Day 1 · Meridian | **Day 2 · Volt Runners** |
|---|---|---|---|
| Look | L1 dark luxury | L2 warm editorial | **L4 neon sport + L7 street** |
| Palette | Gold noir | Cream editorial | **Volt night (lime on black)** |
| Type | T1 Cormorant + Inter | T4 Bodoni + Manrope | **T7 Anton + Space Grotesk** |
| Nav | N1 bar | N3 split | **N5 ticker + shop bar** |
| Hero | H1 scroll video | H8 plate + spec bar | **H6 wordmark over a code-animated photo** |
| Shape | S1 straight | S5 rounded panels | **S6 tilted** |
| Cards | C1 sharp | C3 pop-out | **C5 glass + chamfer** |
| Signature | Scroll video + spin | Exploded parts | **Colour switch + page glow** |

8 of 8 different from both. ✅

## Assets

**Have (checked 28 Sep)**
- `hero-run.jpg`: 2752×1536 ✅ (hero, replaces the video)
- `cw-lime.png`, `cw-ember.png`, `cw-ice.png`, `cw-pulse.png`, `cw-ghost.png`: ~1678×937. ⚠️ **Below the 1500 px-tall target.** For a side-profile shoe the width is what matters, and 1678 px wide is sharp enough on a 1440 laptop, but may look slightly soft on a 1920 screen. Re-export bigger (or upscale before removing the background) if you can; otherwise I'll use them as they are.

**Still needed: 14 images** (prompts below): 4 new-drop cut-outs, 1 limited cut-out, 3 tech macros, 4 collection photos, 2 run-club photos.

Tool: **Google Flow**. Make images with **Nano Banana Pro**.

**Style words for every photo** (so they share one mood): `night, wet asphalt, deep black shadows, neon lime rim light, cool teal-black colour grade, cinematic, photorealistic, film grain, no text, no logos`

**No video needed.** The hero is `hero-run.jpg` animated in code (see "Hero animation"). The earlier `night-run.mp4` plan (Veo video, watermark crop, loop cross-fade) is dropped.

### Cut-out shoes (transparent PNG, background removed with Photoroom / Adobe Express, full size)

**Size: every cut-out at least 1500 px tall** (ideally 2K+ / the biggest Nano Banana Pro gives you; ask for `4K resolution` in the prompt, or upscale before removing the background). Side-profile shoes are wide and short, so for those ask for a **3:4 or square** image with the shoe filling most of the width. After removing the background, download the **full-size** PNG from Photoroom / Adobe Express (not a smaller preview or social size). I'll convert them to WebP in Round 1.

**Colour Lab: the same shoe in 5 colourways** (same angle in all 5!) → `public/images/volt/cw-lime.png`, `cw-ember.png`, `cw-ice.png`, `cw-pulse.png`, `cw-ghost.png`
- First image:
  `Modern performance running shoe product photo, pure side profile facing right, whole shoe in frame with space around it, thick sculpted foam midsole, engineered knit upper, visible carbon plate edge, volt lime upper with black details and a white midsole, centred, plain pure white background, soft studio light, sharp, no shadow, no text, no logo, 4K resolution`
- Then, in the same chat, `same shoe, same angle, same lighting, only the colours change:`
  - `ember orange upper, black details, off-white midsole`
  - `ice blue upper, white details, light grey midsole`
  - `hot magenta upper, black details, white midsole`
  - `ghost white upper, light grey details, white midsole with a thin lime stripe`
- (No black colourway: it would disappear on the black page.)

**New drop: 4 different models**, three-quarter front view, same angle → `public/images/volt/sprint.png`, `tempo.png`, `trail.png`, `glide.png`
- `[MODEL] product photo, three-quarter front view facing right, whole shoe in frame, centred, plain pure white background, soft studio light, sharp, no shadow, no text, no logo, 4K resolution` with [MODEL] =
  - `Carbon-plated racing running shoe, very thick light foam midsole, thin mesh upper, volt lime and black`
  - `Everyday cushioned running trainer, knit upper, white with ice blue accents`
  - `Rugged trail running shoe, deep lug grip outsole, ember orange and charcoal`
  - `Soft recovery running shoe, chunky rocker midsole, all grey with a magenta heel tab`

**Limited drop** → `public/images/volt/monsoon.png`
- `Limited edition carbon-plated racing running shoe, three-quarter side view facing left, whole shoe in frame, translucent smoky upper showing a rain-drop pattern, glossy black midsole with a thin volt lime stripe, centred, plain pure white background, soft studio light, sharp, no shadow, no text, no logo, 4K resolution`

### Photos (16:9, 2K+, all with the style words above)

**Tech stack macros** → `public/images/volt/tech-foam.jpg`, `tech-plate.jpg`, `tech-grip.jpg`
- `Extreme macro close-up of a running shoe's thick foam midsole being compressed, fine foam texture, [style words]`
- `Extreme macro of a thin carbon fibre plate inside a cut-away running shoe midsole, woven carbon texture catching the light, [style words]`
- `Extreme macro of a running shoe's rubber outsole grip pattern on wet asphalt, water droplets, [style words]`

**Collections (tall crops work best, so leave the subject in the centre)** → `public/images/volt/col-road.jpg`, `col-trail.jpg`, `col-track.jpg`, `col-street.jpg`
- `Runner sprinting on an empty city road at night, full body, side view, [style words]`
- `Trail runner on a misty Western Ghats mountain path at blue hour, full body, [style words]` (use `rocky trail` instead of `wet asphalt`)
- `Sprinter in starting blocks on a red running track under stadium floodlights at night, full body, [style words]`
- `Young Indian sneaker fan standing under a flyover in the city at night, streetwear, close crop on the shoes and legs, [style words]`

**Run club** → `public/images/volt/club-1.jpg`, `club-2.jpg`
- `Group of young Indian runners running together along a seafront promenade at dawn, city skyline behind, joyful, candid, [style words]` (swap `night` for `blue dawn light`)
- `Close-up of runners high-fiving after a run at dawn, sweat, candid, [style words]` (same swap)

**Total:** 0 videos · 1 hero photo ✅ · 10 cut-outs (5 colourways ✅ + 4 models + 1 limited) · 9 photos = **20 images**, 6 in so far.
Drop them in `public/images/volt/`.
