import React from "react";
import { motion } from "framer-motion";
import { PALETTE } from "../constants/theme";

const CAPABILITIES = [
  { n: "01", title: "Instant autofill", desc: "One tap signs you in everywhere — apps, browsers, and hardware keys handled." },
  { n: "02", title: "Breach radar", desc: "Continuous dark-web sweeps alert you the moment a secret of yours surfaces." },
  { n: "03", title: "Passkeys & 2FA", desc: "TOTP codes and passkeys live beside your passwords. One app, zero tabs." },
  { n: "04", title: "Sealed sync", desc: "Ciphertext-only sync across devices. We move noise — you hold the key." },
  { n: "05", title: "Dead-man switch", desc: "Grant a trusted contact time-locked access if you ever can't respond." },
  { n: "06", title: "Team vaults", desc: "Share expiring, revocable credentials with your team or your family." },
];

function CapabilityRows() {
  return (
    <section id="capabilities" className="border-t" style={{ borderColor: PALETTE.line }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <p className="mono text-xs tracking-[0.22em] mb-4" style={{ color: PALETTE.mut }}>
              SEC. 01 / CAPABILITIES
            </p>
            <h2 className="font-display text-4xl sm:text-5xl leading-[1.05]" style={{ color: PALETTE.ink }}>
              Six ways we<br />
              <span className="italic">keep the door shut.</span>
            </h2>
          </div>
          <p className="mono text-xs max-w-[240px] leading-relaxed sm:text-right" style={{ color: PALETTE.mut }}>
            EVERY FEATURE SHIPS ENCRYPTED-BY-DEFAULT. NO TOGGLES. NO FINE PRINT.
          </p>
        </div>

        <div className="border-t" style={{ borderColor: PALETTE.line }}>
          {CAPABILITIES.map((cap, idx) => (
            <motion.div
              key={cap.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="group border-b cursor-default"
              style={{ borderColor: PALETTE.line }}
            >
              <div
                className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[70px_1.1fr_1.6fr_40px] items-baseline gap-x-4 sm:gap-x-8 py-6 sm:py-7 px-2 sm:px-4 transition-colors duration-200 group-hover:bg-[#D6FF3F] group-hover:text-black"
              >
                <span className="mono text-xs sm:text-sm" style={{ color: PALETTE.mut }}>
                  <span className="group-hover:text-black/60 transition-colors">{cap.n}</span>
                </span>
                <h3 className="font-display text-2xl sm:text-3xl transition-colors" style={{ color: PALETTE.ink }}>
                  <span className="group-hover:text-black transition-colors">{cap.title}</span>
                </h3>
                <p className="hidden sm:block text-sm leading-relaxed transition-colors" style={{ color: PALETTE.mut }}>
                  <span className="group-hover:text-black/75 transition-colors">{cap.desc}</span>
                </p>
                <span className="justify-self-end text-xl transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">
                  <span className="group-hover:text-black transition-colors" style={{ color: PALETTE.mut }}>↗</span>
                </span>
              </div>
              <p className="sm:hidden pb-5 px-2 text-sm leading-relaxed" style={{ color: PALETTE.mut }}>
                {cap.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CapabilityRows