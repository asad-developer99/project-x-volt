import type { SiteMeta, Theme } from "@/lib/site";

// Settings for THIS site: Meridian, a (fictional) watch maison. Direction: site/DESIGN.md.

export const meta: SiteMeta = {
  name: "Meridian",
  title: "Meridian — Time, taken apart.",
  description: "Meridian makes hand-finished mechanical watches: skeleton tourbillons, enamel dials and a movement you can see through.",
  loaderText: "MERIDIAN",
  loader: false, // site/components/ClockLoader.tsx replaces the engine loader
  // ?record=1 uses the section timeline (data-record-* attributes on the sections, docs/RECORDING.md)
};

export const theme: Theme = {
  bg: "#f6f1e9",
  surface: "#fffcf7",
  text: "#1d1a16",
  muted: "#6b645b",
  accent: "#8b5e34",
  accentText: "#f6f1e9",
  line: "#ddd3c4",
  fontDisplay: "'Bodoni Moda Variable', serif",
  fontBody: "'Manrope Variable', sans-serif",
  radius: 0,
  uppercaseHeadings: false,
  heroText: "#f3ece1",
};
