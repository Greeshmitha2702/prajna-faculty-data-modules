import React, { useState, useEffect } from 'react';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Sidebar collapsed state (desktop)
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('prajna_sidebar_collapsed') === 'true';
  });

  // Sidebar drawer open state (mobile)
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('prajna_sidebar_collapsed', String(collapsed));
  }, [collapsed]);

  const handleToggleSidebar = () => {
    // If mobile: toggle drawer. If desktop: toggle collapse.
    if (window.innerWidth < 768) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Topbar onToggleSidebar={handleToggleSidebar} sidebarCollapsed={collapsed} />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
        
        {/* Main Content Area Wrapper */}
        <div className="flex-1 overflow-y-auto min-w-0">
          <main className="px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
export default MainLayout;
