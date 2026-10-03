// All text + data for Volt Runners. Prices are samples (concept site).

export const STUDIO = "Triozen Tech";

export const nav = {
  logo: "VOLT",
  ticker: ["Drop 07 is live", "Free delivery across India", "30-day run test", "Free size exchange", "Volt Monsoon 01 · draw opens Saturday"],
  links: [
    { label: "New drop", href: "#drop" },
    { label: "Colour Lab", href: "#lab" },
    { label: "Collections", href: "#collections" },
    { label: "Limited", href: "#limited" },
    { label: "Run club", href: "#club" },
  ],
};

export const hero = {
  image: "/images/volt/web/hero-run.webp",
  eyebrow: "Drop 07 · Mumbai night series",
  words: ["VOLT", "RUNNERS"],
  line: "Run loud.",
  text: "Carbon-plated speed for Indian roads. Built for monsoon nights, humid mornings and 5 AM starts.",
  primary: { label: "Shop the drop", href: "#drop" },
  secondary: { label: "Find your size", href: "#fit" },
  strip: ["Drop 07", "Volt Sprint 2", "₹12,999", "212 g", "Live now"],
};

export const speed = {
  words: ["Faster", "Lighter", "Louder"],
  outline: ["Mumbai", "Delhi", "Bengaluru", "Pune", "Chennai"],
};

export type Colourway = { id: string; name: string; color: string; glow: string; image: string; note: string };

// Order matters: the lab arrives on Ember (a jolt after the lime hero) and ends on Volt Lime, which carries on down the page.
export const lab = {
  eyebrow: "Colour Lab",
  heading: ["Pick your", "colour."],
  model: "Volt Sprint 2",
  price: "₹12,999",
  specs: [
    { label: "Weight", value: "212 g" },
    { label: "Drop", value: "8 mm" },
    { label: "Plate", value: "Full carbon" },
    { label: "Foam", value: "VoltFoam+" },
  ],
  colourways: [
    { id: "ember", name: "Ember", color: "#ff5a1f", glow: "#ff5a1f", image: "/images/volt/web/cw-ember.webp", note: "Tail-light orange" },
    { id: "ice", name: "Ice", color: "#6ec4ff", glow: "#4db4ff", image: "/images/volt/web/cw-ice.webp", note: "Cold-start blue" },
    { id: "pulse", name: "Pulse", color: "#ff2fa6", glow: "#ff2fa6", image: "/images/volt/web/cw-pulse.webp", note: "Heart-rate magenta" },
    { id: "ghost", name: "Ghost", color: "#e6ebe4", glow: "#cfe3dc", image: "/images/volt/web/cw-ghost.webp", note: "Fog white, lime stripe" },
    { id: "lime", name: "Volt Lime", color: "#c8ff1a", glow: "#c8ff1a", image: "/images/volt/web/cw-lime.webp", note: "The original" },
  ] satisfies Colourway[],
};

export type Shoe = {
  id: string;
  name: string;
  kind: string;
  image: string;
  specs: string;
  price: string;
  was?: string;
  tag?: string;
  dots: string[];
};

export const drop = {
  eyebrow: "Drop 07",
  heading: "New drop.",
  text: "Four shoes, one rule: every gram has to earn its place.",
  items: [
    { id: "sprint", name: "Volt Sprint 2", kind: "Race day", image: "/images/volt/web/sprint.webp", specs: "212 g · 8 mm drop · carbon plate", price: "₹12,999", tag: "New", dots: ["#c8ff1a", "#ff5a1f", "#6ec4ff"] },
    { id: "tempo", name: "Volt Tempo", kind: "Daily trainer", image: "/images/volt/web/tempo.webp", specs: "248 g · 6 mm drop", price: "₹8,499", was: "₹10,599", tag: "−20%", dots: ["#f3f5ef", "#6ec4ff"] },
    { id: "trail", name: "Volt Ghat", kind: "Trail", image: "/images/volt/web/trail.webp", specs: "296 g · 5 mm lugs", price: "₹9,999", tag: "Runner's pick", dots: ["#ff5a1f", "#3b3f44"] },
    { id: "glide", name: "Volt Drift", kind: "Recovery", image: "/images/volt/web/glide.webp", specs: "264 g · rocker sole", price: "₹6,999", dots: ["#9da39a", "#ff2fa6"] },
  ] satisfies Shoe[],
};

export const fit = {
  eyebrow: "Size picker",
  heading: ["Find your", "fit."],
  model: "Volt Sprint 2 · Volt Lime",
  image: "/images/volt/web/cw-lime.webp",
  sizes: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
  soldOut: ["6.5", "11.5"],
  low: { "9": 3, "10.5": 2 } as Record<string, number>,
  widths: ["Regular", "Wide"],
  price: "₹12,999",
  // the hands-free demo: these are picked one after another
  demo: { size: "9", width: "Wide" },
  perks: [
    { title: "Free delivery", text: "Across India, in 2–4 days" },
    { title: "30-day run test", text: "Run in them. Not right? Send them back." },
    { title: "Free size exchange", text: "We pick up, you lace up" },
  ],
};

export const tech = {
  eyebrow: "Inside the shoe",
  heading: "Three layers of fast.",
  cards: [
    { n: "01", name: "VoltFoam+", part: "Midsole", image: "/images/volt/web/tech-foam.webp", text: "A supercritical foam that squashes soft and snaps back hard, even in 35° heat.", stat: 82, suffix: "%", decimals: 0, label: "energy return" },
    { n: "02", name: "Carbon plate", part: "Spine", image: "/images/volt/web/tech-plate.webp", text: "A full-length curved carbon plate that rolls you forward, step after step.", stat: 3.2, suffix: " mm", decimals: 1, label: "thin, full length" },
    { n: "03", name: "GripLine", part: "Outsole", image: "/images/volt/web/tech-grip.webp", text: "Wet-road rubber tested on monsoon tarmac, speed breakers and marble lobbies.", stat: 1000, suffix: " km", decimals: 0, label: "of grip, tested" },
  ],
};

export const collections = {
  eyebrow: "Collections",
  heading: "Where do you run?",
  items: [
    { name: "Road", count: "24 styles", image: "/images/volt/web/col-road.webp", text: "City miles, night runs, race day.", pos: "40% 50%" },
    { name: "Trail", count: "11 styles", image: "/images/volt/web/col-trail.webp", text: "Ghats, mud and monsoon paths.", pos: "50% 45%" },
    { name: "Track", count: "8 styles", image: "/images/volt/web/col-track.webp", text: "Spikes and flats for the fast lane.", pos: "58% 55%" },
    { name: "Street", count: "19 styles", image: "/images/volt/web/col-street.webp", text: "Built to run, styled to stay.", pos: "40% 60%" },
  ],
};

export const limited = {
  eyebrow: "Limited drop",
  name: ["Volt", "Monsoon 01"],
  image: "/images/volt/web/monsoon.webp",
  text: "A smoke-clear upper with a rain-drop print and a carbon racer underneath. Made once, for the rainy season.",
  pairs: "Only 500 pairs",
  numbered: "Numbered #001–#500",
  price: "₹17,999",
  entries: 38214,
  cta: "Enter the draw",
  // the draw opens next Saturday, 10:00 (device time), so two synced devices show the same countdown
  opensDay: 6,
  opensHour: 10,
};

export const club = {
  eyebrow: "Volt Run Club",
  heading: ["Sunday, 5:30\u00a0AM.", "Be there."], // non-breaking space: "AM." never sits alone on a phone
  text: "Free group runs in 12 cities. Every pace welcome. Chai after.",
  images: ["/images/volt/web/club-1.webp", "/images/volt/web/club-2.webp"],
  stats: [
    { value: 12, suffix: "", decimals: 0, label: "Cities" },
    { value: 40000, suffix: "+", decimals: 0, label: "Runners" },
    { value: 1.2, suffix: "M km", decimals: 1, label: "Run together" },
  ],
  cities: ["Mumbai", "Delhi", "Bengaluru", "Pune", "Hyderabad", "Chennai", "Kolkata", "Goa"],
  cta: "Join a run",
};

export const footer = {
  word: "VOLT",
  newsletter: { title: "Join the 5 AM club", text: "Drops, draws and run-club dates. One mail a week.", placeholder: "Your email" },
  columns: [
    { title: "Shop", links: ["Road", "Trail", "Track", "Street", "Gift cards"] },
    { title: "Help", links: ["Size guide", "Delivery", "Returns", "Track order"] },
    { title: "Club", links: ["Group runs", "Events", "Stories", "Ambassadors"] },
  ],
  note: `Concept website by ${STUDIO}. Volt Runners is a design concept; products and prices are samples.`,
};
