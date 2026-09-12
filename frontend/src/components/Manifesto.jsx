import { motion } from "framer-motion";
import Marquee from "./Marquee";

const PALETTE = {
  bg: "#0B0B0C",
  ink: "#E9E6DD",
  lime: "#D6FF3F",
  coral: "#FF6B4A",
  mut: "#8B8C86",
  line: "rgba(233,230,221,0.14)",
};

function Manifesto() {
  return (
    <section
      id="manifesto"
      className="border-t relative overflow-hidden"
      style={{ borderColor: PALETTE.line }}
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-20 sm:py-32 text-center">
        <p
          className="mono text-xs tracking-[0.22em] mb-8"
          style={{ color: PALETTE.mut }}
        >
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
            <svg
              className="absolute -bottom-2 left-0 w-full overflow-visible pointer-events-none"
              viewBox="0 0 300 12"
              fill="none"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M4 8 C 60 2, 150 12, 296 5"
                stroke={PALETTE.lime}
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
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
          Join 2.4 million people who stopped recycling “Password123!” across
          the internet. Free for personal vaults. No credit card. No tricks.
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

      <div className="border-t py-6" style={{ borderColor: PALETTE.line }}>
        <Marquee duration={30}>
          {[0, 1, 2].map((k) => (
            <span
              key={k}
              className="font-display text-3xl sm:text-5xl mx-6"
              style={{ color: PALETTE.ink }}
            >
              remember nothing{" "}
              <span className="italic" style={{ color: PALETTE.lime }}>
                ·
              </span>{" "}
              trust the vault{" "}
              <span className="italic" style={{ color: PALETTE.lime }}>
                ·
              </span>{" "}
              own your keys{" "}
              <span className="italic" style={{ color: PALETTE.lime }}>
                ·
              </span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

export default Manifesto;