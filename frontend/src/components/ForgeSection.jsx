import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { PALETTE } from "../constants/theme";
import { forgePassword, scorePassword, charClass } from "../utils/password";

function ForgeSection() {
  const [length, setLength] = useState(16);
  const [flags, setFlags] = useState({ lower: true, upper: true, digits: true, symbols: true });
  const [secret, setSecret] = useState("");
  const [copied, setCopied] = useState(false);
  const [spin, setSpin] = useState(0);

  const reforge = useCallback(() => {
    setSecret(forgePassword(length, flags));
    setSpin((s) => s + 1);
    setCopied(false);
  }, [length, flags]);

  useEffect(() => { reforge(); }, [reforge]);

  const score = scorePassword(secret);

  const copySecret = async () => {
    try { await navigator.clipboard.writeText(secret); }
    catch (e) {
      const ta = document.createElement("textarea");
      ta.value = secret;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const Chip = ({ k, label }) => {
    const on = flags[k];
    return (
      <button
        onClick={() => setFlags((f) => ({ ...f, [k]: !f[k] }))}
        className="mono text-[11px] sm:text-xs px-3 py-2 border rounded-sm transition-colors duration-150"
        style={{
          borderColor: on ? PALETTE.lime : PALETTE.line,
          color: on ? PALETTE.lime : PALETTE.mut,
          background: on ? "rgba(214,255,63,0.06)" : "transparent",
        }}
      >
        [{on ? "×" : " "}] {label}
      </button>
    );
  };

  return (
    <section id="forge" className="border-t" style={{ borderColor: PALETTE.line }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24 grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16">
        <div>
          <p className="mono text-xs tracking-[0.22em] mb-4" style={{ color: PALETTE.mut }}>
            SEC. 02 / THE FORGE
          </p>
          <h2 className="font-display text-4xl sm:text-5xl leading-[1.05]" style={{ color: PALETTE.ink }}>
            Strong keys,
            <br />
            <span className="italic" style={{ color: PALETTE.lime }}>forged locally.</span>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-sm sm:text-base" style={{ color: PALETTE.mut }}>
            This console runs entirely in your browser using the Web Crypto API.
            Nothing you generate here is transmitted, logged, or remembered.
          </p>
          <ul className="mt-8 space-y-3 mono text-xs sm:text-[13px]" style={{ color: PALETTE.mut }}>
            {["CSPRNG — no Math.random(), ever", "Entropy scored against 95-char space", "Zero network calls. View the source."].map((t) => (
              <li key={t} className="flex gap-3">
                <span style={{ color: PALETTE.lime }}>—</span> {t}
              </li>
            ))}
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="border rounded-sm"
          style={{ borderColor: PALETTE.line, background: "#0F0F11" }}
        >
          <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: PALETTE.line }}>
            <span className="mono text-[11px] tracking-[0.18em]" style={{ color: PALETTE.mut }}>
              FORGE v2.4 — OFFLINE
            </span>
            <motion.button
              key={spin}
              onClick={reforge}
              whileTap={{ scale: 0.92 }}
              className="mono text-[11px] px-2.5 py-1 border rounded-sm transition-colors"
              style={{ borderColor: PALETTE.line, color: PALETTE.ink }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = PALETTE.lime; e.currentTarget.style.color = PALETTE.lime; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = PALETTE.line; e.currentTarget.style.color = PALETTE.ink; }}
            >
              ↻ REFORGE
            </motion.button>
          </div>

          <div className="px-4 sm:px-6 py-6 border-b" style={{ borderColor: PALETTE.line }}>
            <motion.div
              key={spin}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mono text-base sm:text-xl break-all leading-relaxed tracking-wide"
            >
              {secret.split("").map((ch, i) => (
                <span key={`${spin}-${i}`} style={{ color: charClass(ch) }}>{ch}</span>
              ))}
            </motion.div>

            <div className="mt-6 flex items-center gap-[3px]">
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-3 flex-1 rounded-[1px]"
                  animate={{ background: i < score.blocks ? score.color : "rgba(233,230,221,0.1)" }}
                  transition={{ delay: i * 0.03 }}
                />
              ))}
            </div>
            <div className="mt-2.5 flex justify-between mono text-[11px]" style={{ color: PALETTE.mut }}>
              <span>
                ENTROPY ≈ <span style={{ color: PALETTE.ink }}>{score.entropy} BITS</span>
              </span>
              <span style={{ color: score.color }}>{score.label}</span>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="mono text-xs" style={{ color: PALETTE.mut }}>LENGTH</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setLength((l) => Math.max(8, l - 2))}
                  className="w-9 h-9 border rounded-sm mono transition-colors hover:border-[#D6FF3F] hover:text-[#D6FF3F]"
                  style={{ borderColor: PALETTE.line, color: PALETTE.ink }}
                >−</button>
                <span className="mono text-lg w-8 text-center" style={{ color: PALETTE.lime }}>{length}</span>
                <button
                  onClick={() => setLength((l) => Math.min(40, l + 2))}
                  className="w-9 h-9 border rounded-sm mono transition-colors hover:border-[#D6FF3F] hover:text-[#D6FF3F]"
                  style={{ borderColor: PALETTE.line, color: PALETTE.ink }}
                >+</button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Chip k="lower" label="abc" />
              <Chip k="upper" label="ABC" />
              <Chip k="digits" label="123" />
              <Chip k="symbols" label="#$%" />
            </div>

            <motion.button
              onClick={copySecret}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 mono text-xs tracking-[0.2em] rounded-sm transition-colors"
              style={{
                background: copied ? "transparent" : PALETTE.lime,
                color: copied ? PALETTE.lime : "#0B0B0C",
                border: `1px solid ${PALETTE.lime}`,
              }}
            >
              {copied ? "COPIED ✓" : "COPY TO CLIPBOARD"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ForgeSection