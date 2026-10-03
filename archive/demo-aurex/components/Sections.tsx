import type { Section } from "@/components/patterns/types";
import FrameHero from "@/components/patterns/FrameHero";
import FrameScrub from "@/components/patterns/FrameScrub";
import Statement from "@/components/patterns/Statement";
import Features from "@/components/patterns/Features";
import Stats from "@/components/patterns/Stats";
import HorizontalGallery from "@/components/patterns/HorizontalGallery";
import Marquee from "@/components/patterns/Marquee";
import Parallax from "@/components/patterns/Parallax";
import Split from "@/components/patterns/Split";
import Testimonials from "@/components/patterns/Testimonials";
import Cta from "@/components/patterns/Cta";

/** Renders a list of stock pattern sections in order (demo only — new sites write their own Page.tsx). */
export default function Sections({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((s, i) => {
        const key = s.id ?? `${s.type}-${i}`;
        switch (s.type) {
          case "frameHero":
            return <FrameHero key={key} s={s} first={i === 0} />;
          case "frameScrub":
            return <FrameScrub key={key} s={s} />;
          case "statement":
            return <Statement key={key} s={s} />;
          case "features":
            return <Features key={key} s={s} />;
          case "stats":
            return <Stats key={key} s={s} />;
          case "horizontalGallery":
            return <HorizontalGallery key={key} s={s} />;
          case "marquee":
            return <Marquee key={key} s={s} />;
          case "parallax":
            return <Parallax key={key} s={s} />;
          case "split":
            return <Split key={key} s={s} />;
          case "testimonials":
            return <Testimonials key={key} s={s} />;
          case "cta":
            return <Cta key={key} s={s} />;
        }
      })}
    </>
  );
}
