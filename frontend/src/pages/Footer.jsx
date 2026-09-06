
function Footer() {
    const cols = [
        { head: "PRODUCT", items: ["Vaults", "Forge", "Breach radar", "Passkeys", "Pricing"] },
        { head: "RESOURCES", items: ["Docs", "Security model", "Whitepaper", "Status"] },
    ];
    
    const PALETTE = {
      bg: "#0B0B0C",
      ink: "#E9E6DD",
      lime: "#D6FF3F",
      coral: "#FF6B4A",
      mut: "#8B8C86",
      line: "rgba(233,230,221,0.14)",
    };

    
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
            className="font-display text-[12vw] leading-[0.85] text-center transition-colors duration-500 hover:text-[#D6FF3F]"
            style={{ color: "transparent", WebkitTextStroke: `1px ${PALETTE.line}` }}
          >
            Credentials
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer