import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Award, Layers, ShieldCheck, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { useAuth } from '../../mock/mockAuth';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapse,
}) => {
  useAuth();

  const navLinks = [
    { to: '/profile/me', label: 'Profile Overview', icon: User },
    { to: '/profile/edit', label: 'Edit Profile', icon: Layers },
    { to: '/profile/qualifications', label: 'Qualifications', icon: Award },
    { to: '/profile/hierarchy', label: 'Approver Hierarchy', icon: ShieldCheck },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-900 select-none">
      {/* Header section (Logo overlay inside drawer or toggle container) */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-900 shrink-0">
        {!collapsed && (
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
            Module 7 Directory
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-white transition cursor-pointer mx-auto"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onCloseMobile}
              title={collapsed ? link.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition relative group border ${
                  isActive
                    ? 'bg-gitam-green/10 text-gitam-green border-gitam-green/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/40 border-transparent'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
              
              {/* Tooltip on collapse hover */}
              {collapsed && (
                <div className="absolute left-16 scale-0 group-hover:scale-100 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-800 shadow-2xl font-semibold select-none transition-all duration-150 origin-left whitespace-nowrap z-50">
                  {link.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-900 space-y-1 shrink-0">
        <a
          href="/docs/Module7-API-contracts.md"
          className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/40 border border-transparent transition relative group ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'API Contracts' : undefined}
        >
          <FileText className="w-5 h-5 text-slate-500 shrink-0" />
          {!collapsed && <span>API Contracts</span>}
          {collapsed && (
            <div className="absolute left-16 scale-0 group-hover:scale-100 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-800 shadow-2xl font-semibold transition-all duration-150 origin-left whitespace-nowrap z-50">
              API Contracts
            </div>
          )}
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:block transition-all duration-300 shrink-0 ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay and Menu container) */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop overlay */}
        <div
          onClick={onCloseMobile}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        ></div>
        
        {/* Sliding menu panel */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-64 transform transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
};
export default Sidebar;
