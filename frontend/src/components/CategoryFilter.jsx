function CategoryFilter({ categories, activeCategory, onSelectCategory }) {
  return (
    <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6 sm:mb-8 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-200 shrink-0 ${
            activeCategory === cat
              ? 'bg-[#c8ff00] text-[#0a0a0a]'
              : 'bg-[#111111] text-[#8a8a8a] border border-[#2a2a2a] hover:border-[#c8ff00] hover:text-[#c8ff00]'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;