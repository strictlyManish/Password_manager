import { motion, AnimatePresence } from 'framer-motion';

function VaultCard({ item, isCopied, onCopy, onEdit, onDelete }) {
  const itemId = item._id || item.id;

  const handleCopy = (e) => {
    e.stopPropagation();
    if (onCopy) onCopy(itemId);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(itemId);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group bg-[#111111] border border-[#2a2a2a] rounded-lg p-5 sm:p-6 hover:border-[#c8ff00]/50 transition-colors duration-300 relative overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-xl font-bold text-white group-hover:border-[#c8ff00]/30 transition-colors">
            {item.name ? item.name.charAt(0).toUpperCase() : '?'}
          </div>
          <span className="text-[10px] font-mono text-[#8a8a8a] uppercase tracking-wider bg-[#0a0a0a] px-2 py-1 rounded border border-[#2a2a2a]">
            {item.category || 'General'}
          </span>
        </div>

        <h3 className="font-serif text-lg sm:text-xl text-white mb-1 tracking-tight truncate">
          {item.name}
        </h3>
        <p className="text-[#8a8a8a] text-xs sm:text-sm font-mono mb-4 truncate">
          {item.username}
        </p>
      </div>

      {/* Footer & Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a] mt-2">
        <span className="text-[10px] font-mono text-[#555] truncate max-w-[120px]">
          {item.url ? item.url.replace(/^https?:\/\//, '') : (item.lastUsed || 'Secured')}
        </span>

        <div className="flex gap-1 sm:gap-2">
          {/* Copy Button */}
          <button 
            type="button"
            onClick={handleCopy}
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
                  className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#c8ff00] text-[#0a0a0a] text-[10px] font-mono px-2 py-1 rounded whitespace-nowrap z-20 font-semibold shadow-md"
                >
                  Copied!
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Delete Button */}
          <button 
            type="button"
            onClick={handleDelete}
            className="p-2.5 sm:p-2 rounded-md hover:bg-[#2a2a2a] text-[#8a8a8a] hover:text-red-400 transition-colors"
            title="Delete Credential"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default VaultCard;