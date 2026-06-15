import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../mock/mockAuth';
import { LogOut, RefreshCw, Bell, Menu, User, ChevronDown, Check } from 'lucide-react';

interface TopbarProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const { user, switchProfile, allAvailableProfiles, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [debugSwitcherOpen, setDebugSwitcherOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const switcherRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setDebugSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-900 h-16 px-4 md:px-6 flex items-center justify-between">
      {/* Brand Branding & Toggle Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 ml-1">
          <div className="w-8 h-8 bg-gitam-green rounded-lg flex items-center justify-center font-black text-sm text-white select-none shadow-[0_0_12px_rgba(0,115,103,0.3)]">
            P
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-black tracking-widest text-white leading-none">PRAJNA</h1>
            <span className="text-[9px] text-gitam-antique-white font-bold tracking-wider block mt-0.5 select-none">
              GITAM DEEMED TO BE UNIVERSITY
            </span>
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications Icon (Mock badge) */}
        <button className="p-2 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-white transition relative cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gitam-coral rounded-full border border-slate-950"></span>
        </button>

        {/* Debug/Testing Switcher Dropdown (Self-contained in topbar) */}
        <div className="relative" ref={switcherRef}>
          <button
            onClick={() => setDebugSwitcherOpen(!debugSwitcherOpen)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-semibold text-slate-350 hover:text-white cursor-pointer transition select-none"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gitam-beige animate-spin-slow" />
            <span>Switch Role ({user?.campus})</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>
          
          {debugSwitcherOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-scaleUp">
              <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-800 mb-1">
                Select Test Profile (Tenant Test)
              </div>
              {allAvailableProfiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    switchProfile(p.id);
                    setDebugSwitcherOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-850 transition text-xs flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <p className={`font-bold ${user?.facultyId === p.id ? 'text-gitam-green' : 'text-white'}`}>{p.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{p.role} • {p.campus}</p>
                  </div>
                  {user?.facultyId === p.id && <Check className="w-4 h-4 text-gitam-green shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1 hover:bg-slate-900 rounded-xl transition cursor-pointer select-none"
            >
              <img
                src={user.profilePhotoUrl}
                alt={user.firstName}
                className="w-8 h-8 rounded-full border border-gitam-antique-gold object-cover shadow-[0_0_8px_rgba(165,130,85,0.2)]"
              />
              <ChevronDown className="w-4 h-4 text-slate-500 hidden md:block" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-scaleUp">
                <div className="px-4 py-2 border-b border-slate-800 mb-2">
                  <p className="text-sm font-bold text-white leading-tight">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                  <span className="inline-block mt-2 text-[9px] font-extrabold px-2 py-0.5 bg-gitam-green/20 text-gitam-green border border-gitam-green/30 rounded">
                    {user.campus} CAMPUS
                  </span>
                </div>
                
                {/* Mobile-only profile switcher in main menu */}
                <div className="block sm:hidden px-2 pb-2 mb-2 border-b border-slate-800">
                  <div className="px-2 py-1 text-[9px] font-bold text-slate-500 uppercase">
                    Change Context
                  </div>
                  {allAvailableProfiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        switchProfile(p.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-slate-850 transition flex items-center justify-between ${
                        user.facultyId === p.id ? 'text-gitam-green font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <span>{p.name} ({p.campus})</span>
                      {user.facultyId === p.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>

                <a
                  href="/profile/me"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full text-left px-4 py-2 hover:bg-slate-850 transition text-xs text-slate-300 hover:text-white flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  My Dashboard
                </a>

                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gitam-coral/10 hover:text-gitam-coral transition text-xs text-slate-350 flex items-center gap-2 mt-1 border-t border-slate-850 pt-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
export default Topbar;
