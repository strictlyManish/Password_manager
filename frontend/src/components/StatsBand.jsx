import React from "react";
import { PALETTE } from "../constants/theme";
import  BigStat from "../components/BigStat.jsx";

function StatsBand() {
  return (
    <section className="border-t" style={{ borderColor: PALETTE.line }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
        <BigStat value={0} suffix="" label="BREACHES ON RECORD" />
        <BigStat value={2.4} suffix="M" decimals={1} label="VAULTS SEALED" delay={0.1} />
        <BigStat value={190} suffix="ms" label="MEDIAN UNLOCK" delay={0.2} />
        <BigStat value={99.99} suffix="%" decimals={2} label="UPTIME, 5 YEARS" delay={0.3} />
      </div>
    </section>
  );
}

export default StatsBand