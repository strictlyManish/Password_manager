import { motion, AnimatePresence } from 'framer-motion';

function VaultCard({ item, isCopied, onCopy }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group bg-[#111111] border border-[#2a2a2a] rounded-lg p-5 sm:p-6 hover:border-[#c8ff00]/50 transition-colors duration-300 relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-xl text-white group-hover:border-[#c8ff00]/30 transition-colors">
          {item.name.charAt(0)}
        </div>
        <span className="text-[10px] font-mono text-[#8a8a8a] uppercase tracking-wider bg-[#0a0a0a] px-2 py-1 rounded border border-[#2a2a2a]">
          {item.category}
        </span>
      </div>

      <h3 className="font-serif text-lg sm:text-xl text-white mb-1 tracking-tight">
        {item.name}
      </h3>
      <p className="text-[#8a8a8a] text-xs sm:text-sm font-mono mb-4 truncate">
        {item.username}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
        <span className="text-[10px] font-mono text-[#555]">
          {item.lastUsed}
        </span>

        <div className="flex gap-2">
          {/* Copy Button */}
          <button 
            onClick={() => onCopy(item.id)}
            className="p-2.5 sm:p-2 rounded-md hover:bg-[#2a2a2a] text-[#8a8a8a] hover:text-[#c8ff00] transition-colors relative"
            title="Copy Password"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            
            <AnimatePresence>
              {isCopied && (
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#c8ff00] text-[#0a0a0a] text-[10px] font-mono px-2 py-1 rounded whitespace-nowrap z-20"
                >
                  Copied!
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Edit Button */}
          <button 
            className="p-2.5 sm:p-2 rounded-md hover:bg-[#2a2a2a] text-[#8a8a8a] hover:text-[#c8ff00] transition-colors"
            title="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default VaultCard;