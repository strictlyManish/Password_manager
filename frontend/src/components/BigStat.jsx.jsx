import React, { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { PALETTE } from "../constants/theme";

function BigStat({ value, suffix, label, decimals = 0, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start, raf;
    const dur = 1600;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setVal(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <div ref={ref} className="border-l pl-5 sm:pl-7 py-2" style={{ borderColor: PALETTE.line }}>
      <p className="font-display text-4xl sm:text-6xl" style={{ color: PALETTE.ink }}>
        {decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString()}
        <span style={{ color: PALETTE.lime }}>{suffix}</span>
      </p>
      <p className="mt-2 mono text-[11px] tracking-[0.18em]" style={{ color: PALETTE.mut }}>{label}</p>
    </div>
  );
}

export default BigStat