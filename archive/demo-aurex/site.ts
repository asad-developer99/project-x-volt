import type { SiteMeta, Theme } from "@/lib/site";

// Settings for THIS site. Demo: Aurex Motors.
// A new site replaces the whole site/ folder — see CLAUDE.md.

export const meta: SiteMeta = {
  name: "Aurex Motors",
  title: "Aurex Motors — Desert roads. Extraordinary destinations.",
  description: "Aurex Motors crafts once-in-a-lifetime supercar experiences across the world's most captivating landscapes.",
  loaderText: "AUREX",
  record: { duration: 40, delay: 2.5 },
};

export const theme: Theme = {
  bg: "#0b0907",
  surface: "#16120e",
  text: "#ede3d1",
  muted: "#a89c8a",
  accent: "#c9a063",
  accentText: "#0b0907",
  line: "#2e2720",
  fontDisplay: "'Cormorant Garamond', serif",
  fontBody: "'Inter Variable', sans-serif",
  radius: 0,
  uppercaseHeadings: true,
};
