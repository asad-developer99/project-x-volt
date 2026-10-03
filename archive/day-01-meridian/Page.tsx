import ClockLoader from "./components/ClockLoader";
import MaisonNav from "./components/MaisonNav";
import PlateHero from "./components/PlateHero";
import Heartbeat from "./components/Heartbeat";
import CollectionCase from "./components/CollectionCase";
import DialStudio from "./components/DialStudio";
import MaskReveal from "./components/MaskReveal";
import Specsheet from "./components/Specsheet";
import PrivilegeBento from "./components/PrivilegeBento";
import Boutiques from "./components/Boutiques";
import CareFaq from "./components/CareFaq";
import MeridianFooter from "./components/MeridianFooter";
import { FRAMES, nav } from "./content";

const LOADER_FRAMES = [FRAMES]; // preloaded behind the frozen loader with &at=

const ICON = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#f6f1e9" stroke="#1d1a16" stroke-width="2"/><path d="M16 16V7M16 16l5 4" stroke="#8b5e34" stroke-width="2.2" stroke-linecap="round"/></svg>',
)}`;

/** Meridian: a printed horology catalogue. Plan + reasons: site/DESIGN.md. */
export default function Page() {
  return (
    <>
      {/* ?record=1: hide the mouse arrow from the very first frame (before React and RecordMode load) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `if(/[?&]record/.test(location.search)){var s=document.createElement("style");s.textContent="*,*::before,*::after{cursor:none!important}html{scrollbar-width:none}html::-webkit-scrollbar{display:none}";document.head.appendChild(s)}`,
        }}
      />
      {/* Site icon (React hoists it into <head>): a small bronze clock */}
      <link rel="icon" type="image/svg+xml" href={ICON} />
      <ClockLoader name={nav.logo} frames={LOADER_FRAMES} />
      <MaisonNav {...nav} />
      <main>
        <PlateHero />
        <Heartbeat />
        <CollectionCase />
        <DialStudio />
        <MaskReveal />
        <Specsheet />
        <PrivilegeBento />
        <Boutiques />
        <CareFaq />
      </main>
      <MeridianFooter />
    </>
  );
}
