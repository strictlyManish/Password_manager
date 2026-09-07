import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname || "/";

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-30 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-2xl w-full text-center"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <span className="font-serif text-lg text-white tracking-tight">
            Credentials
          </span>
          <span className="text-[#c8ff00] font-mono text-[10px] border border-[#c8ff00] rounded-full w-4 h-4 flex items-center justify-center font-bold">
            R
          </span>
        </div>

        {/* Big 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mb-8"
        >
          <h1 className="font-serif text-[140px] md:text-[220px] leading-none tracking-tighter text-white/90 relative">
            <span className="relative inline-block">
              4
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 text-[#c8ff00] blur-sm"
              >
                4
              </motion.span>
            </span>
            <span className="relative inline-block mx-2">
              0
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                className="absolute inset-0 text-[#c8ff00] blur-sm"
              >
                0
              </motion.span>
            </span>
            <span className="relative inline-block">
              4
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                className="absolute inset-0 text-[#c8ff00] blur-sm"
              >
                4
              </motion.span>
            </span>
          </h1>
          {/* Strikethrough line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[4px] bg-[#ff5733] origin-center"
          />
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-10"
        >
          <h2 className="font-serif text-3xl md:text-5xl text-white tracking-tight mb-4">
            This page{" "}
            <span className="italic text-[#c8ff00]">doesn't exist</span>
          </h2>
          <p className="text-[#8a8a8a] text-sm md:text-base font-mono max-w-md mx-auto leading-relaxed">
            Either it never did, or someone moved it. Either way, it's not here.
          </p>
        </motion.div>

        {/* Terminal showing the failed route */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-[#111111] border border-[#2a2a2a] rounded-lg overflow-hidden mb-10 text-left"
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a2a2a] bg-[#1a1a1a]/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500/80" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
              <div className="w-2 h-2 rounded-full bg-green-500/80" />
            </div>
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#8a8a8a] uppercase">
              TTY-01 — Route not found
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-[10px] text-red-400 tracking-wider">
                ERR
              </span>
            </div>
          </div>
          <div className="p-6 font-mono text-sm">
            <div className="text-[#c8ff00] mb-2">
              <span className="text-[#8a8a8a] mr-2">›</span>
              vault.fetch("{path}")
            </div>
            <div className="text-red-400 pl-6 mb-2">
              ✗ 404 · resource not found
            </div>
            <div className="text-[#8a8a8a] pl-6 mb-2">
              · scanned 0 nodes · 0 matches
            </div>
            <div className="text-[#c8ff00]">
              <span className="text-[#8a8a8a] mr-2">›</span>
              <span className="animate-pulse">▌</span>
            </div>
          </div>
          <div className="px-5 py-2.5 border-t border-[#2a2a2a] bg-[#1a1a1a]/30 flex items-center justify-between font-mono text-[10px] text-[#8a8a8a] tracking-wider">
            <span>HTTP · 404</span>
            <span>{path}</span>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <motion.button
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden bg-[#c8ff00] text-[#0a0a0a] px-8 py-3.5 font-mono text-xs tracking-[0.2em] uppercase font-medium flex items-center gap-3"
          >
            <span className="relative z-10">Return to vault</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="relative z-10"
            >
              →
            </motion.span>
          </motion.button>
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="border border-[#2a2a2a] text-white px-8 py-3.5 font-mono text-xs tracking-[0.2em] uppercase hover:border-[#c8ff00] hover:text-[#c8ff00] transition-colors duration-300"
          >
            Go back
          </motion.button>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-12 font-mono text-[10px] tracking-[0.2em] text-[#8a8a8a] uppercase"
        >
          If you think this is a mistake,{" "}
          <a href="#" className="text-[#c8ff00] hover:underline">
            tell us
          </a>
          .
        </motion.p>
      </motion.div>
    </div>
  );
}

export default NotFound