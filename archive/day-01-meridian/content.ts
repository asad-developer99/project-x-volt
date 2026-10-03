// All text + data for Meridian. Prices are samples (concept site).

export const STUDIO = "Triozen Tech";

export const FRAMES = "/frames/meridian-exploded";

export const nav = {
  logo: "MERIDIAN",
  links: [
    { label: "Collection", href: "#collection" },
    { label: "Atelier", href: "#atelier" },
    { label: "Boutiques", href: "#boutiques" },
  ],
  bag: 2,
};

export const hero = {
  eyebrow: "Ref. M-01 · Tourbillon Rosé",
  title: ["Time,", "taken", "apart."],
  text: "A skeleton tourbillon in 18k rose gold, finished by hand in our atelier, one piece at a time.",
  price: "₹48,50,000",
  specs: [
    { label: "Calibre", value: "M-01, hand-wound" },
    { label: "Case", value: "42 mm" },
    { label: "Material", value: "18k rose gold" },
    { label: "Reserve", value: "72 hours" },
    { label: "Water", value: "30 m" },
  ],
};

export const anatomy = {
  eyebrow: "The anatomy",
  heading: "Five layers, one second.",
  // x = position across the video (0–1) where the part ends up; at = video progress when it separates
  parts: [
    { n: "01", name: "Sapphire crystal", text: "Domed, anti-reflective both sides.", x: 0.05, at: 0.24, side: "top" },
    { n: "02", name: "Bezel & blued hands", text: "Hands flame-blued at 290 °C.", x: 0.21, at: 0.4, side: "bottom" },
    { n: "03", name: "Skeleton movement", text: "211 parts, bevelled by hand.", x: 0.45, at: 0.56, side: "top" },
    { n: "04", name: "The case", text: "18k rose gold, 11-step polish.", x: 0.67, at: 0.7, side: "bottom" },
    { n: "05", name: "Exhibition caseback", text: "Screwed down, sapphire window.", x: 0.88, at: 0.84, side: "top" },
  ],
};

export const heartbeat = {
  eyebrow: "M-01 calibre",
  text: "Two hundred and eleven parts. *One heartbeat.*",
};

export type Watch = {
  ref: string;
  name: string;
  image: string;
  specs: string;
  price: string;
  tag?: string;
};

export const collection = {
  eyebrow: "The collection",
  heading: "Four references.",
  filters: ["All", "Tourbillon", "Skeleton", "Classique"],
  items: [
    { ref: "M-01", name: "Tourbillon Rosé", image: "/images/meridian/web/watch-rose.webp", specs: "42 mm · 18k rose gold · Tourbillon", price: "₹48,50,000", tag: "Flagship" },
    { ref: "M-02", name: "Squelette Onyx", image: "/images/meridian/web/watch-onyx.webp", specs: "42 mm · Blackened steel · Rubber", price: "₹12,90,000" },
    { ref: "M-03", name: "Nocturne", image: "/images/meridian/web/watch-midnight.webp", specs: "42 mm · Midnight dial · Navy alligator", price: "₹9,75,000" },
    { ref: "M-04", name: "Heure Classique", image: "/images/meridian/web/watch-ivory.webp", specs: "40 mm · Enamel dial · Black alligator", price: "₹6,40,000", tag: "New" },
  ] satisfies Watch[],
};

export type Build = {
  dial: string;
  dialColor: string;
  strap: string;
  strapColor: string;
  caseMetal: string;
  image: string;
  ref: string;
  price: string;
};

export const studio = {
  eyebrow: "Configure",
  heading: "Make it *yours.*",
  text: "Choose a dial and a strap. Every Meridian is assembled to order and engraved free of charge.",
  builds: [
    { dial: "Rosé skeleton", dialColor: "#c89a74", strap: "Cognac alligator", strapColor: "#6b3a22", caseMetal: "18k rose gold", image: "/images/meridian/web/watch-rose.webp", ref: "M-01", price: "₹48,50,000" },
    { dial: "Midnight skeleton", dialColor: "#1f2f5c", strap: "Navy alligator", strapColor: "#1c2440", caseMetal: "18k rose gold", image: "/images/meridian/web/watch-midnight.webp", ref: "M-03", price: "₹9,75,000" },
    { dial: "Grand-feu enamel", dialColor: "#efe9dc", strap: "Black alligator", strapColor: "#161412", caseMetal: "18k rose gold", image: "/images/meridian/web/watch-ivory.webp", ref: "M-04", price: "₹6,40,000" },
    { dial: "Onyx skeleton", dialColor: "#2a2826", strap: "Black rubber", strapColor: "#0f0f0f", caseMetal: "Blackened steel", image: "/images/meridian/web/watch-onyx.webp", ref: "M-02", price: "₹12,90,000" },
  ] satisfies Build[],
  interval: 1800,
};

export const craft = {
  words: ["HAND", "FINISHED"],
  image: "/images/meridian/web/atelier.webp",
  eyebrow: "The atelier",
  heading: "Four hundred hours at one bench.",
  text: "One watchmaker builds each Meridian from the first screw to the last, then signs the movement.",
};

export const figures = {
  eyebrow: "In figures",
  heading: "Measured, not *guessed.*",
  rows: [
    { n: "i.", value: 72, suffix: " h", label: "Power reserve", note: "Two barrels in series. Wind on Monday, wear until Thursday." },
    { n: "ii.", value: 211, suffix: "", label: "Parts per movement", note: "Each one bevelled, polished or blued by hand." },
    { n: "iii.", value: 21600, suffix: "", label: "Beats per hour", note: "3 Hz, the rhythm of a classic tourbillon." },
    { n: "iv.", value: 400, suffix: " h", label: "To build one watch", note: "By a single watchmaker, start to finish." },
  ],
};

export const privileges = {
  eyebrow: "Details & privileges",
  heading: "Look closer.",
  tiles: {
    tourbillon: { image: "/images/meridian/web/tourbillon.webp", title: "The tourbillon", text: "One turn every sixty seconds." },
    wrist: { image: "/images/meridian/web/wrist.webp", title: "Worn at 42 mm", text: "Sits low, wears light." },
    back: { image: "/images/meridian/web/back.webp", title: "Through the back", text: "Côtes de Genève, blued screws." },
  },
  perks: [
    { mark: "Aa", title: "Complimentary engraving", text: "Up to 12 characters on the caseback." },
    { mark: "5", title: "Five-year warranty", text: "Plus a first service on us." },
    { mark: "◎", title: "Private viewing", text: "In a boutique, or at your home." },
  ],
};

export const boutiques = {
  image: "/images/meridian/web/box.webp",
  eyebrow: "Boutiques",
  heading: "Arrives in walnut. Delivered by hand.",
  text: "Every Meridian comes in a solid walnut case, hand-delivered and insured to your door.",
  cities: [
    { city: "Mumbai", note: "Private salon" },
    { city: "New Delhi", note: "Private salon" },
    { city: "Dubai", note: "By appointment" },
    { city: "Geneva", note: "Atelier & salon" },
  ],
  cta: "Book a private viewing",
};

export const faq = {
  eyebrow: "Care",
  heading: "Questions, answered.",
  items: [
    { q: "How often does a Meridian need servicing?", a: "Every five to seven years. Your first service is complimentary and takes about six weeks at our atelier." },
    { q: "What does the warranty cover?", a: "Five years on the movement and case against any defect in materials or workmanship." },
    { q: "Will a 42 mm case fit my wrist?", a: "It suits wrists from about 16 cm. Book a viewing and we will bring both sizes to you." },
    { q: "How is my watch delivered?", a: "Hand-delivered in its walnut case, fully insured, usually within three weeks of order." },
  ],
};

export const footer = {
  name: "Meridian",
  logo: "MERIDIAN",
  letter: "Letters from the atelier",
  columns: [
    { title: "Collection", links: ["Tourbillon Rosé", "Squelette Onyx", "Nocturne", "Heure Classique"] },
    { title: "Maison", links: ["Atelier", "Boutiques", "Journal"] },
    { title: "Care", links: ["Servicing", "Warranty", "Contact"] },
  ],
  note: `Concept website by ${STUDIO}. Meridian is a fictional brand.`,
};
