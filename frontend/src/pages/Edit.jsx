import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import PasswordGeneratorInput from '../components/PasswordGeneratorInput';
import { getCollectionById, updateCollection } from '../app/features/vaultSlice';

const CATEGORIES = ['Development', 'Cloud', 'Finance', 'Productivity', 'Social'];

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { collection, isLoading, isError, message } = useSelector((state) => state.vault);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: 'Development',
      name: '',
      username: '',
      password: '',
      url: '',
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(getCollectionById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (collection) {
      reset({
        category: collection.category || 'Development',
        name: collection.name || '',
        username: collection.username || '',
        password: collection.password || '',
        url: collection.url || '',
      });
    }
  }, [collection, reset]);

  const onSubmit = async (data) => {
    try {
      await dispatch(updateCollection({ id, data })).unwrap();
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update credential:', error);
    }
  };

  if (isLoading && !collection) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#c8ff00] font-mono text-sm">
        Loading credential...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl rounded-2xl border border-[#2a2a2a] bg-[#111111] p-6 sm:p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-[#2a2a2a] pb-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8a8a8a]">
              Update Entry
            </p>
            <h1 className="font-serif text-3xl text-white tracking-tight">Edit credential</h1>
          </div>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="rounded border border-[#2a2a2a] px-3 py-2 text-[10px] font-mono uppercase text-[#8a8a8a] transition-colors hover:border-[#c8ff00] hover:text-[#c8ff00]"
          >
            Back
          </button>
        </div>

        {isError && (
          <div className="mb-4 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300 font-mono">
            {message || 'Something went wrong while updating this credential.'}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-[10px] font-mono uppercase tracking-[0.2em] text-[#8a8a8a]">
              Service Name *
            </label>
            <input
              type="text"
              placeholder="e.g., GitHub"
              {...register('name', { required: 'Name is required' })}
              className="w-full rounded border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2.5 text-sm text-white placeholder-[#444] outline-none transition focus:border-[#c8ff00]"
            />
            {errors.name && (
              <span className="mt-1 block text-[10px] text-red-500 font-mono">{errors.name.message}</span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-mono uppercase tracking-[0.2em] text-[#8a8a8a]">
              Username / Email *
            </label>
            <input
              type="text"
              placeholder="e.g., user@example.com"
              {...register('username', { required: 'Username is required' })}
              className="w-full rounded border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2.5 text-sm text-white placeholder-[#444] outline-none transition focus:border-[#c8ff00]"
            />
            {errors.username && (
              <span className="mt-1 block text-[10px] text-red-500 font-mono">{errors.username.message}</span>
            )}
          </div>

          <PasswordGeneratorInput register={register} setValue={setValue} errors={errors} />

          <div>
            <label className="mb-1 block text-[10px] font-mono uppercase tracking-[0.2em] text-[#8a8a8a]">
              URL *
            </label>
            <input
              type="url"
              placeholder="e.g., github.com"
              {...register('url', { required: 'URL is required' })}
              className="w-full rounded border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2.5 text-sm text-white placeholder-[#444] outline-none transition focus:border-[#c8ff00]"
            />
            {errors.url && (
              <span className="mt-1 block text-[10px] text-red-500 font-mono">{errors.url.message}</span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-mono uppercase tracking-[0.2em] text-[#8a8a8a]">
              Category
            </label>
            <select
              {...register('category')}
              className="w-full rounded border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#c8ff00]"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 border-t border-[#2a2a2a] pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="rounded border border-[#2a2a2a] px-4 py-2 text-[10px] font-mono uppercase text-[#8a8a8a] transition-colors hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded bg-[#c8ff00] px-4 py-2 text-[10px] font-mono uppercase font-semibold text-[#0a0a0a] transition-colors hover:bg-[#d9ff4d] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? 'Updating...' : 'Update Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Edit;