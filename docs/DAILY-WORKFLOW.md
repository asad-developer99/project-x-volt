# One site a day: the workflow

| Step | Time | Who (team of 3) |
|---|---|---|
| 1. Pick the brand, write a one-line brief | 10 min | anyone |
| 2. **Round 0:** `/new-site <brief>` → Claude Code writes `site/DESIGN.md` (look, fonts, layout plan, missing assets) → approve | 15 min | Person B |
| 3. Generate the assets DESIGN.md asks for (Google Flow: key images → videos; cut-out product images) | 60 min | Person A |
| 4. `npm run frames` for each video, images into `public/images/<slug>/` | 10 min | Person B |
| 5. **Round 1** structure → review `?static=1` | 45 min | Person B |
| 6. **Round 2** motion → send a slow screen recording | 30 min | Person B |
| 7. **Round 3** polish → archive + log | 20 min | Person B |
| 8. Film vertical in a dark room (`docs/RECORDING.md`) | 20 min | Person C |
| 9. Edit (top text, trending song), post Reel + Story | 45 min | Person C |

## The one-line brief

```
Day [N] — [Brand], [what it sells]. Audience: [who]. Mood: [3 words]. Colours: [optional]. Assets: [what's ready].
```
Example: *"Day 5 — Kanchi Silks, a premium saree store in Chennai. Audience: brides and families. Mood: festive, rich, graceful. Assets: none yet."*

Leave the look to Round 0: Claude Code picks from `docs/DESIGN-MENU.md` so it doesn't repeat the last sites.

## Keeping every site

- `npm run archive -- day-05-kanchi-silks` saves `site/` into `archive/`.
- `npm run restore -- day-05-kanchi-silks` brings it back (e.g. to film again or show a client).
- Keep each site's images and frames in their own folders (`public/images/kanchi/`, `public/frames/kanchi-hero`) so restoring an old site still finds its assets.

## Mix of niches

Their page wins clients with **local businesses** (saree stores, bike showrooms, ice-cream brands, restaurants, fashion stores) as much as luxury. Alternate: 1 luxury/cinematic → 1 local shop → 1 food/fun → 1 tech/sport.
