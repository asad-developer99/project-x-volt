import Nav from "@/components/patterns/Nav";
import Footer from "@/components/patterns/Footer";
import Sections from "./components/Sections";
import { footer, nav, sections } from "./content";

/** The page for THIS site. Demo: Aurex Motors, built from the stock patterns. */
export default function Page() {
  return (
    <>
      <Nav {...nav} />
      <main>
        <Sections sections={sections} />
      </main>
      <Footer {...footer} />
    </>
  );
}
