import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from "./Footer";
import { useDispatch } from "react-redux";
import { logoutUser } from '../app/features/authSlice';
// Mock data for the dashboard
const MOCK_VAULT_ITEMS = [
  { id: 1, name: 'GitHub', username: 'kai_dev', url: 'github.com', category: 'Development', lastUsed: '2 hours ago' },
  { id: 2, name: 'AWS Console', username: 'root@credentials.io', url: 'aws.amazon.com', category: 'Cloud', lastUsed: '1 day ago' },
  { id: 3, name: 'Stripe Dashboard', username: 'finance_team', url: 'dashboard.stripe.com', category: 'Finance', lastUsed: '3 days ago' },
  { id: 4, name: 'Vercel', username: 'kai_vercel', url: 'vercel.com', category: 'Development', lastUsed: '5 days ago' },
  { id: 5, name: 'Linear', username: 'product_lead', url: 'linear.app', category: 'Productivity', lastUsed: '1 week ago' },
];

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);
  const dispatch = useDispatch();

  const categories = ['All', 'Development', 'Cloud', 'Finance', 'Productivity'];

  const filteredItems = MOCK_VAULT_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (id) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-30 z-0" style={{
        backgroundImage: 'linear-gradient(rgba(200,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Header */}
      <header className="relative z-10 border-b border-[#2a2a2a] bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg text-white tracking-tight">Credentials</span>
            <span className="text-[#c8ff00] font-mono text-[10px] border border-[#c8ff00] rounded-full w-4 h-4 flex items-center justify-center font-bold">R</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <input 
              type="text" 
              placeholder="Search vault..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#111111] border border-[#2a2a2a] text-sm text-white placeholder-[#555] px-4 py-1.5 rounded-md outline-none focus:border-[#c8ff00] transition-colors w-64 font-mono"
            />
            <button className="bg-[#c8ff00] hover:bg-[#d4ff33] text-[#0a0a0a] text-xs font-mono tracking-[0.1em] uppercase px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2">
              <span>+</span> New Entry
            </button>
            <button onClick={()=>dispatch(logoutUser())} className="bg-[#ff3c00ad] hover:bg-[#d4ff33] text-[#0a0a0a] text-xs font-mono tracking-[0.1em] uppercase px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2">
              logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-12 w-full">
        
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-serif text-4xl md:text-5xl text-white tracking-tight mb-2">
            Your <span className="italic text-[#c8ff00]">Vault</span>
          </h1>
          <p className="text-[#8a8a8a] font-mono text-sm">
            {filteredItems.length} secured credentials · Zero-knowledge encryption active
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-200 ${
                activeCategory === cat 
                  ? 'bg-[#c8ff00] text-[#0a0a0a]' 
                  : 'bg-[#111111] text-[#8a8a8a] border border-[#2a2a2a] hover:border-[#c8ff00] hover:text-[#c8ff00]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Vault Items List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode='popLayout'>
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={item.id}
                className="group bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#c8ff00]/50 transition-colors duration-300 relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-xl group-hover:border-[#c8ff00]/30 transition-colors">
                    {item.name.charAt(0)}
                  </div>
                  <span className="text-[10px] font-mono text-[#8a8a8a] uppercase tracking-wider bg-[#0a0a0a] px-2 py-1 rounded border border-[#2a2a2a]">
                    {item.category}
                  </span>
                </div>

                <h3 className="font-serif text-xl text-white mb-1 tracking-tight">{item.name}</h3>
                <p className="text-[#8a8a8a] text-sm font-mono mb-4 truncate">{item.username}</p>

                <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
                  <span className="text-[10px] font-mono text-[#555]">{item.lastUsed}</span>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleCopy(item.id)}
                      className="p-2 rounded-md hover:bg-[#2a2a2a] text-[#8a8a8a] hover:text-[#c8ff00] transition-colors relative"
                      title="Copy Password"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      
                      <AnimatePresence>
                        {copiedId === item.id && (
                          <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#c8ff00] text-[#0a0a0a] text-[10px] font-mono px-2 py-1 rounded whitespace-nowrap"
                          >
                            Copied!
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                    
                    <button className="p-2 rounded-md hover:bg-[#2a2a2a] text-[#8a8a8a] hover:text-[#c8ff00] transition-colors" title="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredItems.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-[#8a8a8a] font-mono text-lg">No credentials found matching your search.</p>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;