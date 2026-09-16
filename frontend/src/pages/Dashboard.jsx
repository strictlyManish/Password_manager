import React, { useState, lazy, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from '../app/features/authSlice';

import VaultHeader from '../components/VaultHeader';
import CategoryFilter from '../components/CategoryFilter';
import VaultCard from '../components/VaultCard';
import Footer from "./Footer";
import { getAllCollections, createCollection, deleteCollection } from '../app/features/vaultSlice'; 

const AddEntryModal = lazy(() => import('../components/AddEntryModal'));

const CATEGORIES = [
  'All',
  'Development',
  'Cloud',
  'Finance',
  'Productivity',
  'Social'
];

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // Track item queued for deletion

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector((state) => state.auth?.user);
  const { collections = [], isLoading = false } = useSelector((state) => state.vault);

  useEffect(() => {
    dispatch(getAllCollections());
  }, [dispatch]);

  const filteredItems = (collections || []).filter((item) => {
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      item.name?.toLowerCase().includes(query) ||
      item.username?.toLowerCase().includes(query);

    const matchesCategory =
      activeCategory === 'All' ||
      item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Handle Copying Password to Clipboard
  const handleCopy = (id, password) => {
    if (navigator.clipboard && password) {
      navigator.clipboard.writeText(password);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open Delete Confirmation Modal
  const handleDeleteClick = (id) => {
    setDeletingId(id);
  };

  // Confirm and Dispatch Delete
  const handleConfirmDelete = async () => {
    if (deletingId) {
      try {
        await dispatch(deleteCollection(deletingId)).unwrap();
        setDeletingId(null);
      } catch (error) {
        console.error("Failed to delete collection:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAddEntry = async (formData) => {
    try {
      await dispatch(createCollection(formData)).unwrap();
      setIsModalOpen(false); 
    } catch (error) {
      console.error("Failed to add collection:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative overflow-hidden">

      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-30 z-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(200,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      <VaultHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        user={user}
        onOpenModal={() => setIsModalOpen(true)}
        onLogout={handleLogout}
      />

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
            {collections?.length || 0} secured credentials · Zero-knowledge active
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
          categories={CATEGORIES}
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

      {/* Delete Confirmation Popup */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-md bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center gap-3 text-red-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <h3 className="font-serif text-lg font-semibold text-white">Delete Credential</h3>
              </div>

              <p className="text-[#8a8a8a] text-sm font-mono mb-6">
                Are you sure you want to delete this credential? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-[#8a8a8a] hover:text-white hover:border-[#444] text-xs font-mono transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white text-xs font-mono transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lazy-loaded modal */}
      <Suspense fallback={null}>
        {isModalOpen && (
          <AddEntryModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleAddEntry}
            categories={CATEGORIES}
          />
        )}
      </Suspense>

      <Footer />
    </div>
  );
}

export default Dashboard;