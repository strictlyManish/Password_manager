import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { PALETTE } from "../constants/theme";
import { logoutUser } from "../app/features/authSlice";

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const links = [
    { label: "Capabilities", href: "#capabilities" },
    { label: "Forge", href: "#forge" },
    { label: "Manifesto", href: "#manifesto" },
    { label: "Pricing", href: "#pricing" },
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
            {isAuthenticated ? (
              <>
                <a href="/dashboard" className="mono text-[11px] tracking-[0.18em] transition-colors hover:text-[#D6FF3F]" style={{ color: PALETTE.ink }}>
                  DASHBOARD
                </a>
                <button
                  onClick={handleLogout}
                  className="mono text-[11px] tracking-[0.18em] transition-colors hover:text-[#D6FF3F]"
                  style={{ color: PALETTE.ink, background: "transparent", border: "none", cursor: "pointer" }}
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <a href="/register" className="mono text-[11px] tracking-[0.18em] transition-colors hover:text-[#D6FF3F]" style={{ color: PALETTE.ink }}>
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
              </>
            )}
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
            {isAuthenticated ? (
              <>
                <motion.a
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="mt-8 mono text-xs tracking-[0.2em] py-4 text-center border rounded-sm"
                  style={{ background: PALETTE.lime, color: "#0B0B0C", borderColor: PALETTE.lime }}
                >
                  DASHBOARD →
                </motion.a>
                <motion.button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="mt-4 mono text-xs tracking-[0.2em] py-4 text-center border rounded-sm"
                  style={{ background: "transparent", color: PALETTE.ink, borderColor: PALETTE.line }}
                >
                  LOGOUT
                </motion.button>
              </>
            ) : (
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
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Nav