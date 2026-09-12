import React, { useState, useRef, useEffect } from 'react';

function VaultHeader({ 
  searchQuery, 
  setSearchQuery, 
  user, 
  onOpenModal, 
  onLogout 
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Added user?.fullname check to match backend payload
  const displayName = user?.fullname || user?.name || user?.username || user?.email || 'User';
  const initial = displayName.charAt(0).toUpperCase();
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      console.error(
        'VaultHeader: onLogout prop is missing or not a function. ' +
        'Pass a handler from the parent that dispatches logoutUser().'
      );
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#2a2a2a] bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-serif text-lg text-white tracking-tight">Credentials</span>
          <span className="text-[#c8ff00] font-mono text-[10px] border border-[#c8ff00] rounded-full w-4 h-4 flex items-center justify-center font-bold">R</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <input 
            type="text" 
            placeholder="Search vault..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#111111] border border-[#2a2a2a] text-sm text-white placeholder-[#555] px-4 py-1.5 rounded-md outline-none focus:border-[#c8ff00] transition-colors w-56 font-mono"
          />
          
          <button 
            onClick={onOpenModal}
            className="bg-[#c8ff00] hover:bg-[#d4ff33] text-[#0a0a0a] text-xs font-mono tracking-[0.1em] uppercase px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 shrink-0"
          >
            <span>+</span> New Entry
          </button>

          {/* User Profile Dropdown */}
          <div className="relative z-50 border-l border-[#2a2a2a] pl-3" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 bg-[#111111] hover:bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-1.5 rounded-md transition-colors"
            >
              <div 
                className="w-6 h-6 rounded-full bg-[#1a1a1a] border border-[#c8ff00]/40 flex items-center justify-center text-xs font-mono font-bold text-[#c8ff00] shrink-0"
                title={displayName}
              >
                {initial}
              </div>
              <span className="text-xs font-mono text-[#e0e0e0] truncate max-w-[110px]" title={displayName}>
                {displayName}
              </span>
              <span className="text-[#8a8a8a] text-[10px]">▼</span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#111111] border border-[#2a2a2a] rounded-md shadow-lg py-1 z-60">
                <div className="px-4 py-2 border-b border-[#2a2a2a]">
                  <p className="text-[10px] font-mono text-[#8a8a8a] uppercase">Signed in as</p>
                  <p className="text-xs font-mono text-white truncate">{displayName}</p>
                </div>
                <button 
                  onClick={handleLogoutClick}
                  className="w-full text-left px-4 py-2 text-xs font-mono text-[#ff6b4a] hover:bg-[#ff3c0011] transition-colors flex items-center gap-2"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <div 
            className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#c8ff00]/40 flex items-center justify-center text-xs font-mono font-bold text-[#c8ff00] shrink-0"
            title={displayName}
          >
            {initial}
          </div>
          <button 
            onClick={onOpenModal}
            className="bg-[#c8ff00] text-[#0a0a0a] text-xs font-mono px-3 py-1.5 rounded-md font-bold"
          >
            + New
          </button>
          <button 
            onClick={handleLogoutClick} 
            className="border border-[#ff3c00]/50 text-[#ff3c00] text-xs font-mono px-2.5 py-1.5 rounded-md"
          >
            Exit
          </button>
        </div>
      </div>
    </header>
  );
}

export default VaultHeader;