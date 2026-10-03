import type { FooterProps, NavProps, Section } from "@/components/patterns/types";

// Text + images for this site. Demo: Aurex Motors (fictional supercar brand).
// Every new site replaces this whole folder (site/) — see CLAUDE.md.

export const nav: NavProps = {
  logo: "AUREX",
  links: [
    { label: "Experience", href: "#experience" },
    { label: "The Car", href: "#the-car" },
    { label: "Journeys", href: "#journeys" },
    { label: "Club", href: "#club" },
  ],
  cta: { label: "Member Access", href: "#contact" },
};

export const sections: Section[] = [
  {
    type: "frameHero",
    id: "experience",
    frames: "/frames/hero",
    length: 4,
    eyebrow: "Drive beyond",
    title: ["Desert roads.", "Extraordinary", "destinations."],
    subtitle: "Once-in-a-lifetime supercar experiences across the world's most captivating landscapes.",
    buttons: [
      { label: "Explore", href: "#journeys", style: "solid" },
      { label: "View the car", href: "#the-car", style: "outline" },
    ],
    captions: [
      { at: 0.28, title: "Born in the canyon.", text: "Every curve of the road was chosen by hand.", position: "left" },
      { at: 0.58, title: "Silence. Then 850 horsepower.", position: "center" },
      { at: 0.8, title: "Chase the last light.", text: "Golden hour belongs to you.", position: "right" },
    ],
  },
  {
    type: "statement",
    eyebrow: "Our philosophy",
    text: "We don't sell cars. We curate *moments* — the road, the light, the silence, and the machine that makes them *unforgettable*.",
  },
  {
    type: "stats",
    items: [
      { value: 850, suffix: " HP", label: "Twin turbo V8" },
      { value: 2.6, decimals: 1, suffix: "s", label: "0 – 100 km/h" },
      { value: 355, suffix: " km/h", label: "Top speed" },
      { value: 100, label: "Units worldwide" },
    ],
  },
  {
    type: "frameScrub",
    id: "the-car",
    frames: "/frames/car-spin",
    length: 3.5,
    eyebrow: "The flagship",
    heading: "Meet the Aurex One",
    text: "Sculpted in bronze. Every angle designed to catch the last light of day.",
    callouts: [
      { at: 0.12, label: "Powertrain", text: "V12 hybrid, 1,450 Nm of torque", side: "right", top: "22%" },
      { at: 0.42, label: "Chassis", text: "Carbon monocoque, 1,280 kg", side: "right", top: "22%" },
      { at: 0.7, label: "Wheels", text: "22-inch forged, carbon-ceramic brakes", side: "right", top: "22%" },
    ],
  },
  {
    type: "marquee",
    words: ["Desert", "Canyon", "Oasis", "Dunes", "Sunset"],
    outline: true,
  },
  {
    type: "horizontalGallery",
    id: "journeys",
    eyebrow: "Journeys curated to inspire",
    heading: "The Aurex desert route",
    items: [
      { image: "/images/road-1.webp", title: "Arrival", caption: "Private airport welcome" },
      { image: "/images/road-2.webp", title: "Canyon Drive", caption: "Scenic mountain passes" },
      { image: "/images/road-3.webp", title: "Oasis Escape", caption: "Private lunch & relaxation" },
      { image: "/images/road-4.webp", title: "Dune Road", caption: "High-speed desert run" },
      { image: "/images/studio-2.webp", title: "Sunset Retreat", caption: "5-star camp & fine dining" },
    ],
  },
  {
    type: "split",
    id: "club",
    image: "/images/studio-3.webp",
    eyebrow: "Exclusive by invitation",
    heading: "The Aurex Club",
    text: "A private circle for those who collect moments, not miles.",
    bullets: ["Priority access to experiences", "Invitation-only events", "Global concierge service"],
    button: { label: "Apply for membership", href: "#contact" },
  },
  {
    type: "features",
    eyebrow: "Beyond driving",
    heading: "It's a lifestyle",
    items: [
      { title: "Private stays", text: "Desert villas with infinity pools, reserved for members.", image: "/images/road-3.webp" },
      { title: "Fine dining", text: "Candlelit tables under the stars, cooked by guest chefs.", image: "/images/road-4.webp" },
      { title: "The machine", text: "Hand-built, numbered, and delivered anywhere in the world.", image: "/images/studio-1.webp" },
    ],
  },
  {
    type: "parallax",
    image: "/images/road-2.webp",
    eyebrow: "Chapter two",
    heading: "Where the road *ends*, the story begins.",
  },
  {
    type: "testimonials",
    eyebrow: "Trusted",
    heading: "By those who expect more",
    items: [
      { quote: "The Desert Route was the most extraordinary drive of my life.", name: "David M.", role: "Entrepreneur" },
      { quote: "Every detail, from the runway to the final dinner, was flawless.", name: "Sophia L.", role: "Collector" },
      { quote: "Discreet, precise and genuinely thrilling.", name: "James T.", role: "Investor" },
    ],
  },
  {
    type: "cta",
    id: "contact",
    image: "/images/road-4.webp",
    eyebrow: "Begin your journey",
    heading: "Your road is waiting.",
    text: "Tell us where you'd like to go. Our team will craft something exceptional, just for you.",
    button: { label: "Inquire now", href: "mailto:hello@example.com" },
  },
];

export const footer: FooterProps = {
  name: "Aurex Motors",
  logo: "AUREX",
  tagline: "Desert roads. Extraordinary destinations.",
  columns: [
    { title: "Explore", links: [{ label: "Experience", href: "#experience" }, { label: "The Car", href: "#the-car" }, { label: "Journeys", href: "#journeys" }] },
    { title: "Company", links: [{ label: "About", href: "#" }, { label: "Press", href: "#" }, { label: "Contact", href: "#contact" }] },
    { title: "Follow", links: [{ label: "Instagram", href: "#" }, { label: "YouTube", href: "#" }] },
  ],
  note: "Concept website — fictional brand.",
};
