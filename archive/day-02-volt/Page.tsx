import RaceLoader from "./components/RaceLoader";
import DropNav from "./components/DropNav";
import NightHero from "./components/NightHero";
import SpeedBand from "./components/SpeedBand";
import ColourLab from "./components/ColourLab";
import DropRail from "./components/DropRail";
import SizeLab from "./components/SizeLab";
import TechStack from "./components/TechStack";
import CollectionStrips from "./components/CollectionStrips";
import LimitedDrop from "./components/LimitedDrop";
import RunClub from "./components/RunClub";
import VoltFooter from "./components/VoltFooter";
import { meta } from "./site";

const ICON = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#08090a"/><path d="M19 4 8 18h7l-2 10 11-14h-7l2-10Z" fill="#c8ff1a"/></svg>',
)}`;

/** Volt Runners: a night race in the city. Plan + reasons: site/DESIGN.md. */
export default function Page() {
  return (
    <>
      {/* never restore the old scroll position on reload · ?record=1: hide the mouse arrow from the very first frame */}
      <script
        dangerouslySetInnerHTML={{
          __html: `history.scrollRestoration="manual";if(/[?&]record/.test(location.search)){var s=document.createElement("style");s.textContent="*,*::before,*::after{cursor:none!important}html{scrollbar-width:none}html::-webkit-scrollbar{display:none}";document.head.appendChild(s)}`,
        }}
      />
      <link rel="icon" type="image/svg+xml" href={ICON} />
      <RaceLoader name={meta.loaderText ?? meta.name} />
      {/* the page glow: takes the Colour Lab's colourway (--glow) */}
      <div aria-hidden className="page-glow" />
      <DropNav />
      <main className="relative z-[1] overflow-x-clip">
        <NightHero />
        <SpeedBand />
        <ColourLab />
        <DropRail />
        <SizeLab />
        <TechStack />
        <CollectionStrips />
        <LimitedDrop />
        <RunClub />
      </main>
      <VoltFooter />
    </>
  );
}
