import React, { useState, lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from '../app/features/authSlice';

import VaultHeader from '../components/VaultHeader';
import Footer from "./Footer";
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import DashboardContent from '../components/DashboardContent';
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
  const [deletingId, setDeletingId] = useState(null);

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

  const handleCopy = (id, password) => {
    if (navigator.clipboard && password) {
      navigator.clipboard.writeText(password);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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

      <DashboardContent
        categories={CATEGORIES}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoading={isLoading}
        filteredItems={filteredItems}
        collectionsCount={collections?.length || 0}
        copiedId={copiedId}
        handleCopy={handleCopy}
        handleDeleteClick={(id) => setDeletingId(id)}
      />

      <DeleteConfirmationModal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
      />

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