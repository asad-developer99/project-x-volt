---
name: new-site
description: Build a new showcase website in this Showreel Kit from a short brief (brand, mood, assets), with a fresh design every time. Use when the user asks for a new site, a new brand, "today's site", or to redesign a site.
---

# New showcase site

The user gives a brief like: *"Day 4 — Volt, a sneaker brand. Black and neon green, energetic. Hero video in raw/hero.mp4."*

Follow `CLAUDE.md` → "Building a new site — Round 0 + 3 rounds". Never skip a round, and stop after each round for the user's "ok". Explain things in plain simple language.

- **Round 0 — Design direction:** read `docs/SITES-LOG.md` + `docs/DESIGN-MENU.md`, pick one option per menu (≥ 6 of 8 different from each of the last 3 sites), plan 9–12 sections (hero + cinematic + shop-style), write `site/DESIGN.md`, list missing assets with prompts. Wait for approval.
- **Round 1 — Structure:** archive the old site, frames + images into per-site folders, install fonts, write `site/` from scratch (copy patterns into `site/components/` and restyle them), `npm run check` + `npm run build`. User reviews `http://localhost:3000/?static=1` (laptop + phone).
- **Round 2 — Motion:** tune hero + signature moment; everything interactive also plays by itself on screen. User sends a slow screen recording.
- **Round 3 — Polish:** readability, hover, phone, loader, console clean, set `meta.record.duration` (25–40 s), add a row to `docs/SITES-LOG.md`, `npm run archive -- <day-NN-slug>`. Reply with the filming steps from `docs/RECORDING.md`.
