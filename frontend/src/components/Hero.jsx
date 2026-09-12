import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PALETTE } from "../constants/theme.js";
import  TerminalCard  from "../components/TerminalCard";

function Hero() {
  const sectionRef = useRef(null);
  const [spot, setSpot] = useState({ x: 50, y: 40 });
  const { scrollYProgress } = useScroll();
  const drift = useTransform(scrollYProgress, [0, 0.4], [0, -60]);

  return (
    <section
      ref={sectionRef}
      className="relative pt-28 sm:pt-36 pb-14 sm:pb-20 overflow-hidden"
      onMouseMove={(e) => {
        const rect = sectionRef.current.getBoundingClientRect();
        setSpot({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: `radial-gradient(560px circle at ${spot.x}% ${spot.y}%, rgba(214,255,63,0.05), transparent 65%)`,
        }}
      />

      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mono text-[11px] sm:text-xs tracking-[0.26em] mb-8 flex items-center gap-3"
          style={{ color: PALETTE.mut }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: PALETTE.lime }} />
          Credentials — A VAULT FOR THE POST-PASSWORD ERA · EST. 2019
        </motion.p>

        <div className="grid lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-12 items-center">
          <motion.div style={{ y: drift }}>
            <h1 className="font-display leading-[0.95] text-[15vw] sm:text-7xl lg:text-[6.4rem] tracking-tight" style={{ color: PALETTE.ink }}>
              <motion.span
                className="relative inline-block"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                Remember
                <motion.span
                  className="absolute left-0 top-[54%] h-[0.08em] w-full"
                  style={{ background: PALETTE.coral }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.5, ease: "easeInOut" }}
                />
              </motion.span>
              <br />
              <motion.span
                className="italic"
                style={{ color: PALETTE.lime }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                nothing.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-8 max-w-lg text-sm sm:text-base leading-relaxed"
              style={{ color: PALETTE.mut }}
            >
              Credentials seals every password, passkey and secret inside a zero-knowledge
              vault on your device. Your memory was never the safe —{" "}
              <span style={{ color: PALETTE.ink }}>we are.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7 }}
              className="mt-9 flex flex-col sm:flex-row gap-3"
            >
              <motion.a
                href="/register"
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                className="mono text-xs tracking-[0.2em] px-7 py-4 rounded-sm text-center"
                style={{ background: PALETTE.lime, color: "#0B0B0C" }}
              >
                OPEN YOUR VAULT →
              </motion.a>
              <motion.a
                href="#forge"
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                className="mono text-xs tracking-[0.2em] px-7 py-4 rounded-sm border text-center transition-colors"
                style={{ borderColor: PALETTE.line, color: PALETTE.ink }}
              >
                TRY THE FORGE
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-12 flex flex-wrap gap-x-8 gap-y-2 mono text-[10px] sm:text-[11px] tracking-[0.16em]"
              style={{ color: PALETTE.mut }}
            >
              <span>NO CARD REQUIRED</span>
              <span style={{ color: PALETTE.line }}>|</span>
              <span>ZERO KNOWLEDGE</span>
            </motion.div>
          </motion.div>

          <TerminalCard />
        </div>
      </div>
    </section>
  );
}

export default Hero