import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryFilter from './CategoryFilter';
import VaultCard from './VaultCard';

function DashboardContent({
  categories,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  isLoading,
  filteredItems,
  collectionsCount,
  copiedId,
  handleCopy,
  handleDeleteClick
}) {
  return (
    <main className="flex-1 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-12 w-full">
      {/* Vault Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-10"
      >
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-2">
          Your <span className="italic text-[#c8ff00]">Vault</span>
        </h1>
        <p className="text-[#8a8a8a] font-mono text-xs sm:text-sm">
          {collectionsCount} secured credentials · Zero-knowledge active
        </p>
      </motion.div>

      {/* Mobile Search */}
      <div className="block md:hidden mb-6">
        <input
          type="text"
          placeholder="Search vault..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#111111] border border-[#2a2a2a] text-sm text-white placeholder-[#555] px-4 py-2.5 rounded-md outline-none focus:border-[#c8ff00] font-mono"
        />
      </div>

      {/* Category Filters */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Loading State */}
      {isLoading && (
        <p className="text-[#c8ff00] font-mono text-center my-10">Loading vault...</p>
      )}

      {/* Credentials Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const itemId = item._id || item.id;
              return (
                <VaultCard
                  key={itemId}
                  item={item}
                  isCopied={copiedId === itemId}
                  onCopy={() => handleCopy(itemId, item.password)}
                  onDelete={() => handleDeleteClick(itemId)}
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-[#8a8a8a] font-mono text-base">
            No credentials found matching your search.
          </p>
        </motion.div>
      )}
    </main>
  );
}

export default DashboardContent