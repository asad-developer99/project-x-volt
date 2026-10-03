# Design direction: Aurex Motors (demo)

**Brief:** Aurex Motors, once-in-a-lifetime supercar drives through desert landscapes. Audience: wealthy travellers. Mood: cinematic, golden, powerful.

## Choices (codes from docs/DESIGN-MENU.md)

| | Choice | Why |
|---|---|---|
| Look | L1 Dark luxury | supercars + golden-hour desert |
| Palette | Gold noir: bg `#0b0907`, accent `#c9a063` | matches the sunset footage |
| Type pair | T1 Cormorant Garamond (caps) + Inter | classic, expensive |
| Nav | N1 transparent bar → solid | stays out of the video's way |
| Hero | H1 full-screen scroll video + captions | the desert drive is the star |
| Section shape | S1 straight | calm, luxury |
| Cards | C1 sharp + thin border | luxury |
| Signature moment | Scroll-scrubbed hero video (+ 360° car spin) | |
| Loader | I1 letters rise then wipe | |

## Section plan

| # | Section | Starts from | How it's restyled |
|---|---|---|---|
| 1 | Hero: desert drive | FrameHero | captions left / centre / right |
| 2 | Statement | Statement | — |
| 3 | Numbers | Stats | — |
| 4 | The car: 360° spin | FrameScrub | spec callouts |
| 5 | Marquee | Marquee | outline words |
| 6 | Journeys | HorizontalGallery | — |
| 7 | Story | Split | — |
| 8 | Club perks | Features | — |
| 9 | Band | Parallax | — |
| 10 | Voices | Testimonials | — |
| 11 | Inquire | Cta | — |

(The demo uses stock patterns unchanged. Real sites restyle them; see CLAUDE.md.)

## Assets

- `raw/hero.mp4` → `/frames/hero` (desert drive, push-in)
- `raw/car-spin.mp4` → `/frames/car-spin` (360° turntable of a 3D model)
- `public/images/road-*.webp`, `studio-*.webp`

## Different from the last sites

First site, so no comparison.
