import React, { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from '../app/features/authSlice';

import VaultHeader from '../components/VaultHeader';
import CategoryFilter from '../components/CategoryFilter';
import VaultCard from '../components/VaultCard';
import Footer from "./Footer";

// Lazy load modal because it isn't needed until the user clicks "Add Entry"
const AddEntryModal = lazy(() => import('../components/AddEntryModal'));

const INITIAL_VAULT_ITEMS = [
  { id: 1, name: "GitHub", username: "kai_dev", url: "github.com", category: "Development", lastUsed: "2 hours ago" },
  { id: 2, name: "AWS Console", username: "root@credentials.io", url: "aws.amazon.com", category: "Cloud", lastUsed: "1 day ago" },
  { id: 3, name: "Stripe Dashboard", username: "finance_team", url: "dashboard.stripe.com", category: "Finance", lastUsed: "3 days ago" },
  { id: 4, name: "Vercel", username: "kai_vercel", url: "vercel.com", category: "Development", lastUsed: "5 days ago" },
  { id: 5, name: "Linear", username: "product_lead", url: "linear.app", category: "Productivity", lastUsed: "1 week ago" }
];

const CATEGORIES = [
  'All',
  'Development',
  'Cloud',
  'Finance',
  'Productivity'
];

function Dashboard() {
  const [vaultItems, setVaultItems] = useState(INITIAL_VAULT_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user);

  const filteredItems = vaultItems.filter((item) => {
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.username.toLowerCase().includes(query);

    const matchesCategory =
      activeCategory === 'All' ||
      item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCopy = (id) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      navigate("/");
    }
  };

  const handleAddEntry = (formData) => {
    const newItem = {
      id: Date.now(),
      name: formData.name,
      username: formData.username,
      password: formData.password,
      url: formData.url || "#",
      category: formData.category,
      lastUsed: "Just now"
    };

    setVaultItems((prev) => [newItem, ...prev]);
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
            {filteredItems.length} secured credentials · Zero-knowledge active
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

        {/* Credentials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <VaultCard
                key={item.id}
                item={item}
                isCopied={copiedId === item.id}
                onCopy={handleCopy}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
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