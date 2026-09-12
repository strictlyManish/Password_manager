function Marquee({ children, duration = 24, className = "" }) {
  return (
    <div 
      className={`overflow-hidden whitespace-nowrap select-none ${className}`}
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
      }}
    >
      <div 
        className="marquee-track inline-flex items-center hover:[animation-play-state:paused]" 
        style={{ animationDuration: `${duration}s` }}
      >
        {/* Primary content */}
        <div className="flex shrink-0 items-center">
          {children}
        </div>

        {/* Hidden decorative duplicate for seamless looping */}
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Marquee;