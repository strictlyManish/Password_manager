import React from "react";
import { motion } from "framer-motion";
import { PALETTE } from "../constants/theme";
import { useTypedSession } from "../hooks/useTypedSession";

function TerminalCard() {
  const { lines, typingText } = useTypedSession();
  const toneColor = { ok: PALETTE.lime, dim: PALETTE.mut, warn: PALETTE.coral };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative border rounded-sm"
      style={{ borderColor: PALETTE.line, background: "#0F0F11", boxShadow: "12px 12px 0 rgba(214,255,63,0.06)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ borderColor: PALETTE.line }}
      >
        <span className="mono text-[11px] tracking-[0.18em]" style={{ color: PALETTE.mut }}>
          TTY-01 — SESSION ENCRYPTED
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PALETTE.lime }} />
          <span className="mono text-[10px]" style={{ color: PALETTE.lime }}>LIVE</span>
        </span>
      </div>

      <div className="px-4 sm:px-5 py-5 min-h-[280px] sm:min-h-[300px] mono text-[12.5px] sm:text-[13px] leading-[1.9]">
        {lines.map((ln, i) =>
          ln.type === "cmd" ? (
            <div key={i} style={{ color: PALETTE.ink }}>
              <span style={{ color: PALETTE.lime }}>❯ </span>
              {ln.text}
            </div>
          ) : (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="pl-5"
              style={{ color: toneColor[ln.tone] || PALETTE.mut }}
            >
              {ln.text}
            </motion.div>
          )
        )}
        <div style={{ color: PALETTE.ink }}>
          <span style={{ color: PALETTE.lime }}>❯ </span>
          {typingText}
          <span className="cursor-blink inline-block w-[7px] h-[15px] align-middle ml-0.5" style={{ background: PALETTE.lime }} />
        </div>
      </div>

      <div
        className="flex items-center justify-between px-4 py-2 border-t mono text-[10px] tracking-[0.14em]"
        style={{ borderColor: PALETTE.line, color: PALETTE.mut }}
      >
        <span>ARGON2ID · KDF</span>
        <span>XCHACHA20-POLY1305</span>
      </div>
    </motion.div>
  );
}


export default TerminalCard