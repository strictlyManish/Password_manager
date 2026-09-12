import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import PasswordGeneratorInput from './PasswordGeneratorInput';

function AddEntryModal({ isOpen, onClose, onSave, categories }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: 'Development',
      password: '',
    },
  });

  const onSubmit = (data) => {
    onSave(data);
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#2a2a2a]">
              <h2 className="font-serif text-2xl text-white tracking-tight">Add Credential</h2>
              <button
                onClick={onClose}
                className="text-[#8a8a8a] hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Service Name */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#8a8a8a] mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., GitHub"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#c8ff00] outline-none font-mono"
                />
                {errors.name && <span className="text-red-500 text-[10px] font-mono">{errors.name.message}</span>}
              </div>

              {/* Username / Email */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#8a8a8a] mb-1">
                  Username / Email *
                </label>
                <input
                  type="text"
                  placeholder="e.g., user@example.com"
                  {...register('username', { required: 'Username is required' })}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#c8ff00] outline-none font-mono"
                />
                {errors.username && <span className="text-red-500 text-[10px] font-mono">{errors.username.message}</span>}
              </div>

              {/* Password Generator Component */}
              <PasswordGeneratorInput
                register={register}
                setValue={setValue}
                errors={errors}
              />

              {/* URL */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#8a8a8a] mb-1">
                  URL
                </label>
                <input
                  type="text"
                  placeholder="e.g., github.com"
                  {...register('url')}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#c8ff00] outline-none font-mono"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#8a8a8a] mb-1">
                  Category
                </label>
                <select
                  {...register('category')}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-white focus:border-[#c8ff00] outline-none font-mono"
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-mono uppercase text-[#8a8a8a] hover:text-white border border-transparent hover:border-[#2a2a2a] rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#c8ff00] hover:bg-[#d4ff33] text-[#0a0a0a] text-xs font-mono font-medium uppercase px-4 py-2 rounded transition-colors"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AddEntryModal;