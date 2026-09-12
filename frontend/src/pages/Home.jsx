import { lazy, Suspense } from "react";

import useFonts from "../hooks/useFonts.js";
import { PALETTE } from "../constants/theme.js";

import Grain from "../components/Grain";
import Nav from "../components/Nav.jsx";
import Hero from "../components/Hero";

// Lazy-loaded sections
const CapabilityRows = lazy(() => import("../components/CapabilityRows.jsx"));
const ForgeSection = lazy(() => import("../components/ForgeSection"));
const StatsBand = lazy(() => import("../components/StatsBand"));
const Manifesto = lazy(() => import("../components/Manifesto.jsx"));
const Pricing = lazy(() => import("./Pricing.jsx"));
const Footer = lazy(() => import("../pages/Footer"));

function Home() {
  useFonts();

  return (
    <div
      className="min-h-screen text-[#E9E6DD] selection:bg-[#D6FF3F] selection:text-black relative"
      style={{ background: PALETTE.bg }}
    >
      <Grain />
      <Nav />

      <main>
        <Hero />

        <Suspense fallback={<div className="min-h-[300px]" />}>
          <CapabilityRows />
          <ForgeSection />
          <StatsBand />
          <Manifesto />
          <Pricing />
        </Suspense>
      </main>

      <Suspense fallback={<div className="min-h-[200px]" />}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default Home;