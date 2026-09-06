import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";

/* ================================================================
   Home.jsx — Credentials · Password Manager
   Editorial / brutalist security aesthetic, fully responsive
   ================================================================ */

const FONT_SOURCES = [
  "https://cdn.jsdelivr.net/fontsource/fonts/instrument-serif@latest/latin-400-normal.css",
  "https://cdn.jsdelivr.net/fontsource/fonts/instrument-serif@latest/latin-400-italic.css",
  "https://cdn.jsdelivr.net/fontsource/fonts/ibm-plex-mono@latest/latin-400-normal.css",
  "https://cdn.jsdelivr.net/fontsource/fonts/ibm-plex-mono@latest/latin-500-normal.css",
  "https://cdn.jsdelivr.net/fontsource/fonts/archivo@latest/latin-400-normal.css",
  "https://cdn.jsdelivr.net/fontsource/fonts/archivo@latest/latin-500-normal.css",
  "https://cdn.jsdelivr.net/fontsource/fonts/archivo@latest/latin-700-normal.css",
];

const PALETTE = {
  bg: "#0B0B0C",
  ink: "#E9E6DD",
  lime: "#D6FF3F",
  coral: "#FF6B4A",
  mut: "#8B8C86",
  line: "rgba(233,230,221,0.14)",
};

function useFonts() {
  useEffect(() => {
    FONT_SOURCES.forEach((href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const lnk = document.createElement("link");
        lnk.rel = "stylesheet";
        lnk.href = href;
        document.head.appendChild(lnk);
      }
    });
  }, []);
}

/* ---------------- Grain overlay ---------------- */

function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] opacity-[0.05] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

/* ---------------- Marquee ---------------- */

function Marquee({ children, duration = 24, className = "" }) {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className="marquee-track inline-flex items-center" style={{ animationDuration: `${duration}s` }}>
        {children}
        {children}
      </div>
    </div>
  );
}

/* ---------------- Terminal typing script ---------------- */

const SESSION_SCRIPT = [
  { type: "cmd", text: "credentials unlock --biometric" },
  { type: "out", text: "✓ identity verified · 0.31s", tone: "ok", delay: 500 },
  { type: "cmd", text: "credentials fetch github.com" },
  { type: "out", text: "· decrypting ·········· done", tone: "dim", delay: 420 },
  { type: "out", text: "→ autofilled as kai@Credentials.io", tone: "ok", delay: 320 },
  { type: "cmd", text: "credentials audit --breaches" },
  { type: "out", text: "✓ 0 credentials found in known breaches", tone: "ok", delay: 520 },
  { type: "out", text: "✓ vault sealed · 47 secrets protected", tone: "dim", delay: 340 },
];

function useTypedSession() {
  const [lines, setLines] = useState([]);
  const [typingText, setTypingText] = useState("");

  useEffect(() => {
    let alive = true;
    const timers = [];
    const wait = (ms) =>
      new Promise((res) => {
        timers.push(setTimeout(res, ms));
      });

    (async () => {
      while (alive) {
        setLines([]);
        setTypingText("");
        await wait(700);
        for (const item of SESSION_SCRIPT) {
          if (!alive) return;
          if (item.type === "cmd") {
            for (let idx = 1; idx <= item.text.length; idx++) {
              if (!alive) return;
              setTypingText(item.text.slice(0, idx));
              await wait(26);
            }
            await wait(220);
            if (!alive) return;
            setLines((prev) => [...prev, item]);
            setTypingText("");
          } else {
            await wait(item.delay || 320);
            if (!alive) return;
            setLines((prev) => [...prev, item]);
          }
        }
        await wait(2800);
      }
    })();

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  return { lines, typingText };
}

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
      {/* title bar */}
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

      {/* body */}
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

      {/* footer strip */}
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

/* ---------------- Password forge (generator) ---------------- */

const LOWER_SET = "abcdefghijklmnopqrstuvwxyz";
const UPPER_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGIT_SET = "0123456789";
const SYMBOL_SET = "!@#$%^&*()-_=+[]{};:,.<>?/~";

function randomInt(max) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

function forgePassword(length, flags) {
  let pool = "";
  const requiredSets = [];
  if (flags.lower) { pool += LOWER_SET; requiredSets.push(LOWER_SET); }
  if (flags.upper) { pool += UPPER_SET; requiredSets.push(UPPER_SET); }
  if (flags.digits) { pool += DIGIT_SET; requiredSets.push(DIGIT_SET); }
  if (flags.symbols) { pool += SYMBOL_SET; requiredSets.push(SYMBOL_SET); }
  if (!pool) pool = LOWER_SET;

  const out = [];
  requiredSets.forEach((set) => {
    if (out.length < length) out.push(set[randomInt(set.length)]);
  });
  while (out.length < length) out.push(pool[randomInt(pool.length)]);
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out.join("");
}

function scorePassword(pwd) {
  let poolSize = 0;
  if (/[a-z]/.test(pwd)) poolSize += 26;
  if (/[A-Z]/.test(pwd)) poolSize += 26;
  if (/[0-9]/.test(pwd)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(pwd)) poolSize += 25;
  const entropy = pwd.length * Math.log2(Math.max(poolSize, 2));
  const blocks = Math.max(1, Math.min(10, Math.round(entropy / 14)));
  let label = "WEAK", color = PALETTE.coral;
  if (entropy >= 90) { label = "ELITE"; color = PALETTE.lime; }
  else if (entropy >= 65) { label = "STRONG"; color = PALETTE.lime; }
  else if (entropy >= 42) { label = "FAIR"; color = "#E8B84B"; }
  return { blocks, label, color, entropy: Math.round(entropy) };
}

function charClass(ch) {
  if (/[0-9]/.test(ch)) return PALETTE.lime;
  if (/[^a-zA-Z0-9]/.test(ch)) return PALETTE.coral;
  return PALETTE.ink;
}

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

        {/* console */}
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

          {/* output */}
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

            {/* entropy blocks */}
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

          {/* controls */}
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

/* ---------------- Capabilities index rows ---------------- */

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
              {/* mobile description */}
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

/* ---------------- Stats ---------------- */

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

/* ---------------- Nav ---------------- */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Capabilities", href: "#capabilities" },
    { label: "Forge", href: "#forge" },
    { label: "Manifesto", href: "#manifesto" },
    { label: "Pricing", href: "#manifesto" },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(11,11,12,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${PALETTE.line}` : "1px solid transparent",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <a href="#" className="font-display text-xl tracking-tight" style={{ color: PALETTE.ink }}>
            Credentials<span style={{ color: PALETTE.lime }}>®</span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((lnk) => (
              <a
                key={lnk.label}
                href={lnk.href}
                className="mono text-[11px] tracking-[0.18em] transition-colors hover:text-[#D6FF3F]"
                style={{ color: PALETTE.mut }}
              >
                {lnk.label.toUpperCase()}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href="#" className="mono text-[11px] tracking-[0.18em] transition-colors hover:text-[#D6FF3F]" style={{ color: PALETTE.ink }}>
              SIGN IN
            </a>
            <motion.a
              href="#manifesto"
              whileHover={{ x: 2 }}
              className="mono text-[11px] tracking-[0.18em] px-4 py-2.5 border rounded-sm transition-colors"
              style={{ borderColor: PALETTE.lime, color: PALETTE.lime }}
              onMouseEnter={(e) => { e.currentTarget.style.background = PALETTE.lime; e.currentTarget.style.color = "#0B0B0C"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = PALETTE.lime; }}
            >
              GET THE KEY →
            </motion.a>
          </div>

          <button className="md:hidden mono text-xs" style={{ color: PALETTE.ink }} onClick={() => setMenuOpen(true)}>
            MENU +
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex flex-col justify-center px-8"
            style={{ background: PALETTE.bg }}
          >
            <button
              className="absolute top-5 right-5 mono text-xs"
              style={{ color: PALETTE.ink }}
              onClick={() => setMenuOpen(false)}
            >
              CLOSE ×
            </button>
            {links.map((lnk, i) => (
              <motion.a
                key={lnk.label}
                href={lnk.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="font-display text-4xl py-3 border-b"
                style={{ color: PALETTE.ink, borderColor: PALETTE.line }}
              >
                {lnk.label}
              </motion.a>
            ))}
            <motion.a
              href="#manifesto"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-8 mono text-xs tracking-[0.2em] py-4 text-center border rounded-sm"
              style={{ background: PALETTE.lime, color: "#0B0B0C", borderColor: PALETTE.lime }}
            >
              GET THE KEY →
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------- Hero ---------------- */

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
        setSpot({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
      }}
    >
      {/* mouse spotlight */}
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

        <div className="grid lg:grid-cols-[1.35fr_1fr] gap-10 lg:gap-14 items-end">
          <motion.div style={{ y: drift }}>
            <h1 className="font-display leading-[0.95] text-[15vw] sm:text-7xl lg:text-[6.4rem] tracking-tight" style={{ color: PALETTE.ink }}>
              <motion.span
                className="relative inline-block"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                Remember
                {/* animated strike-through */}
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
                href="#manifesto"
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
              <span>60-SECOND SETUP</span>
              <span style={{ color: PALETTE.line }}>|</span>
              <span>FREE TIER, FOREVER</span>
            </motion.div>
          </motion.div>

          <TerminalCard />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Manifesto / CTA ---------------- */

function Manifesto() {
  const underlineRef = useRef(null);
  const underlineInView = useInView(underlineRef, { once: true, margin: "-80px" });

  return (
    <section id="manifesto" className="border-t relative overflow-hidden" style={{ borderColor: PALETTE.line }}>
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-20 sm:py-32 text-center">
        <p className="mono text-xs tracking-[0.22em] mb-8" style={{ color: PALETTE.mut }}>
          SEC. 03 / MANIFESTO
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.04] tracking-tight"
          style={{ color: PALETTE.ink }}
        >
          The best password
          <br />
          is the one you{" "}
          <span className="relative inline-block italic">
            never type.
            <svg ref={underlineRef} className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none">
              <motion.path
                d="M4 8 C 60 2, 150 12, 296 5"
                stroke={PALETTE.lime}
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={underlineInView ? { pathLength: 1 } : {}}
                transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
              />
            </svg>
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-8 max-w-xl mx-auto text-sm sm:text-base leading-relaxed"
          style={{ color: PALETTE.mut }}
        >
          Join 2.4 million people who stopped recycling “Password123!” across the internet.
          Free for personal vaults. No credit card. No tricks.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <motion.a
            href="#"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mono text-xs tracking-[0.2em] px-9 py-4 rounded-sm"
            style={{ background: PALETTE.lime, color: "#0B0B0C" }}
          >
            CREATE MY VAULT — FREE
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mono text-xs tracking-[0.2em] px-9 py-4 rounded-sm border transition-colors"
            style={{ borderColor: PALETTE.line, color: PALETTE.ink }}
          >
            TALK TO SECURITY TEAM
          </motion.a>
        </motion.div>
      </div>

      {/* big serif marquee */}
      <div className="border-t py-6" style={{ borderColor: PALETTE.line }}>
        <Marquee duration={30}>
          {[0, 1, 2].map((k) => (
            <span key={k} className="font-display text-3xl sm:text-5xl mx-6" style={{ color: PALETTE.ink }}>
              remember nothing <span className="italic" style={{ color: PALETTE.lime }}>·</span> trust the vault{" "}
              <span className="italic" style={{ color: PALETTE.lime }}>·</span> own your keys{" "}
              <span className="italic" style={{ color: PALETTE.lime }}>·</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */

function Footer() {
  const cols = [
    { head: "PRODUCT", items: ["Vaults", "Forge", "Breach radar", "Passkeys", "Pricing"] },
    { head: "COMPANY", items: ["About", "Journal", "Careers", "Press kit"] },
    { head: "RESOURCES", items: ["Docs", "Security model", "Whitepaper", "Status"] },
    { head: "LEGAL", items: ["Privacy", "Terms", "GDPR", "Bug bounty"] },
  ];

  return (
    <footer className="border-t" style={{ borderColor: PALETTE.line }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14 sm:mb-20">
          {cols.map((col) => (
            <div key={col.head}>
              <p className="mono text-[10px] tracking-[0.22em] mb-4" style={{ color: PALETTE.mut }}>{col.head}</p>
              <ul className="space-y-2.5">
                {col.items.map((it) => (
                  <li key={it}>
                    <a href="#" className="text-sm transition-colors hover:text-[#D6FF3F]" style={{ color: PALETTE.ink }}>
                      {it}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-12 mono text-[10px] tracking-[0.16em]" style={{ color: PALETTE.mut }}>
          <span>© {new Date().getFullYear()} Credentials SECURITY GMBH</span>
          <span>AES-256 · ARGON2ID · SOC 2 TYPE II · AUDITED ANNUALLY</span>
        </div>

        <div className="overflow-hidden select-none" aria-hidden>
          <p
            className="font-display text-[18vw] leading-[0.85] text-center transition-colors duration-500 hover:text-[#D6FF3F]"
            style={{ color: "transparent", WebkitTextStroke: `1px ${PALETTE.line}` }}
          >
            Credentials
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Root ---------------- */

export default function Home() {
  useFonts();
  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: PALETTE.bg, color: PALETTE.ink, fontFamily: "'Archivo', system-ui, sans-serif" }}>
      <style>{`
        .font-display { font-family: 'Instrument Serif', Georgia, serif; }
        .mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        ::selection { background: ${PALETTE.lime}; color: #0B0B0C; }
        html { scroll-behavior: smooth; }
        @keyframes marqueeSlide { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { animation: marqueeSlide 24s linear infinite; width: max-content; }
        @keyframes cursorBlink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .cursor-blink { animation: cursorBlink 1s step-end infinite; }
      `}</style>

      {/* scroll progress hairline */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[90]"
        style={{ scaleX: scrollYProgress, background: PALETTE.lime }}
      />

      <Grain />

      

      <Nav />
      <Hero />
      <CapabilityRows />
      <ForgeSection />
      <StatsBand />
      <Manifesto />
      <Footer />
    </div>
  );
}
