import type { SiteMeta, Theme } from "@/lib/site";

// Settings for THIS site: Volt Runners, a (concept) performance sneaker brand from India. Direction: site/DESIGN.md.

export const meta: SiteMeta = {
  name: "Volt Runners",
  title: "Volt Runners — Run loud.",
  description: "Performance running shoes built for Indian roads: carbon-plated racers, daily trainers and trail shoes. Drop 07 is live.",
  loaderText: "VOLT RUNNERS",
  loader: false, // site/components/RaceLoader.tsx replaces the engine loader
  // ?record=1 uses the section timeline (data-record-* attributes on the sections, docs/RECORDING.md)
};

export const theme: Theme = {
  bg: "#08090a",
  surface: "#121417",
  text: "#f3f5ef",
  muted: "#9da39a",
  accent: "#c8ff1a",
  accentText: "#08090a",
  line: "#262a2e",
  fontDisplay: "'Anton', 'Impact', sans-serif",
  fontBody: "'Space Grotesk Variable', sans-serif",
  radius: 0,
  uppercaseHeadings: true,
  heroText: "#f3f5ef",
};
