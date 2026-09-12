import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function PasswordGeneratorInput({ register, setValue, errors }) {
  const [showGenOptions, setShowGenOptions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [genLength, setGenLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);

  // Secure Password Generator Logic
  const generatePassword = useCallback(() => {
    let chars = '';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

    let result = '';
    const array = new Uint32Array(genLength);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < genLength; i++) {
      result += chars[array[i] % chars.length];
    }

    setValue('password', result, { shouldValidate: true, shouldDirty: true });
  }, [genLength, useUpper, useLower, useNumbers, useSymbols, setValue]);

  useEffect(() => {
    if (showGenOptions) {
      generatePassword();
    }
  }, [genLength, useUpper, useLower, useNumbers, useSymbols, showGenOptions, generatePassword]);

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="block text-xs font-mono uppercase text-[#8a8a8a]">
          Password *
        </label>
        <button
          type="button"
          onClick={() => setShowGenOptions(!showGenOptions)}
          className="text-[10px] font-mono uppercase text-[#c8ff00] hover:underline flex items-center gap-1"
        >
          <span>⚡</span> {showGenOptions ? 'Hide Generator' : 'Generator Options'}
        </button>
      </div>

      <div className="relative flex items-center">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••••••"
          {...register('password', { required: 'Password is required' })}
          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded pl-3 pr-20 py-2 text-sm text-white placeholder-[#444] focus:border-[#c8ff00] outline-none font-mono"
        />
        <div className="absolute right-1 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-1 text-[#8a8a8a] hover:text-white transition-colors"
            title={showPassword ? "Hide password" : "Show password"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
            </svg>
          </button>
          <button
            type="button"
            onClick={generatePassword}
            className="bg-[#2a2a2a] hover:bg-[#c8ff00] text-white hover:text-[#0a0a0a] text-[10px] font-mono px-2 py-1 rounded transition-colors"
            title="Generate Password"
          >
            Generate
          </button>
        </div>
      </div>
      {errors.password && <span className="text-red-500 text-[10px] font-mono">{errors.password.message}</span>}

      {/* Generator Controls */}
      <AnimatePresence>
        {showGenOptions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-3 p-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded space-y-3"
          >
            <div>
              <div className="flex justify-between text-xs font-mono text-[#8a8a8a] mb-1">
                <span>Length:</span>
                <span className="text-[#c8ff00] font-bold">{genLength} characters</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={genLength}
                onChange={(e) => setGenLength(Number(e.target.value))}
                className="w-full accent-[#c8ff00] cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#8a8a8a]">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={useUpper}
                  onChange={(e) => setUseUpper(e.target.checked)}
                  className="accent-[#c8ff00] rounded"
                />
                Uppercase (A-Z)
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={useLower}
                  onChange={(e) => setUseLower(e.target.checked)}
                  className="accent-[#c8ff00] rounded"
                />
                Lowercase (a-z)
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={useNumbers}
                  onChange={(e) => setUseNumbers(e.target.checked)}
                  className="accent-[#c8ff00] rounded"
                />
                Numbers (0-9)
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={useSymbols}
                  onChange={(e) => setUseSymbols(e.target.checked)}
                  className="accent-[#c8ff00] rounded"
                />
                Symbols (!@#$)
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PasswordGeneratorInput;