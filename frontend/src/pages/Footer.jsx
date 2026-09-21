function Footer() {
  
  return (
    <footer className="border-t border-[#E9E6DD]/14 bg-[#0B0B0C] text-[#E9E6DD]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-8">

        {/* Copyright & Security Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-12 font-mono text-[10px] tracking-[0.16em] text-[#8B8C86]">
          <span>© {new Date().getFullYear()} Credentials SECURITY GMBH</span>
          <span>AES-256 · ARGON2ID · SOC 2 TYPE II · AUDITED ANNUALLY</span>
        </div>

        {/* Giant Brand Text */}
        <div className="overflow-hidden select-none" aria-hidden>
          <p className="font-display text-[12vw] leading-[0.85] text-center text-transparent transition-colors duration-500 hover:text-[#D6FF3F]"
             style={{ WebkitTextStroke: "1px rgba(233,230,221,0.14)" }}>
            Credentials
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;