
import React, { useState } from 'react';
import { ThemeConfig } from '../types';
import { inventoryService } from '../services/inventoryService';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'manage' | 'users' | 'vendors' | 'locations' | 'logs' | 'theme' | 'logins';
  setActiveTab: (tab: any) => void;
  onHomeClick: () => void;
  onLogout: () => void;
  theme: ThemeConfig;
  currentUser: any;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onHomeClick, onLogout, theme, currentUser }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  const handleBackup = async () => {
    setIsBackingUp(true);
    await inventoryService.backupDatabase();
    setTimeout(() => setIsBackingUp(false), 1500);
  };

  return (
    <div className="flex min-h-screen transition-colors duration-500 overflow-x-hidden" style={{ backgroundColor: theme.backgroundColor }}>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 z-[60] flex items-center justify-between px-4 border-b border-slate-800/10 backdrop-blur-xl" style={{ backgroundColor: `${theme.surfaceColor}EE` }}>
        <div className="flex items-center gap-2" onClick={() => { onHomeClick(); closeSidebar(); }}>
          <div className="p-1.5 rounded-xl shadow-lg" style={{ backgroundColor: theme.primaryColor }}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <span className="font-black text-sm tracking-tighter uppercase text-slate-800">Studio<span style={{ color: theme.primaryColor }}>Pro</span></span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 rounded-xl bg-slate-100 text-slate-600 active:scale-95 transition-all">
          {isSidebarOpen ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
        </button>
      </header>

      {isSidebarOpen && <div className="lg:hidden fixed inset-0 bg-black/40 z-[45] backdrop-blur-sm transition-all" onClick={closeSidebar} />}

      {/* Dynamic Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 w-72 border-r border-slate-200 p-6 flex flex-col z-50 transition-all duration-500 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`} 
        style={{ backgroundColor: theme.surfaceColor }}
      >
        <div className="hidden lg:flex items-center gap-3 mb-10 cursor-pointer group" onClick={onHomeClick}>
          <div className="p-2.5 rounded-2xl shadow-xl transition-transform group-hover:scale-110" style={{ backgroundColor: theme.primaryColor }}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <h1 className="text-xl font-black tracking-tighter text-slate-800">Studio<span style={{ color: theme.primaryColor }}>Pro</span></h1>
        </div>

        <nav className="space-y-1.5 flex-1 overflow-y-auto pr-2 scrollbar-hide lg:mt-0 mt-16">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-3 px-4 tracking-[0.2em]">Registry</p>
          <NavItem icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a2 2 0 002 2h10a2 2 0 002-2V10M9 21V9h6v12" /></svg>} label="Dashboard" active={activeTab === 'dashboard'} theme={theme} onClick={() => { setActiveTab('dashboard'); onHomeClick(); closeSidebar(); }} />
          <NavItem icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} label="Asset Log" active={activeTab === 'manage'} theme={theme} onClick={() => { setActiveTab('manage'); closeSidebar(); }} />
          
          <p className="text-[10px] font-black text-slate-400 uppercase mt-8 mb-3 px-4 tracking-[0.2em]">Resources</p>
          <NavItem icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} label="Technical Staff" active={activeTab === 'users'} theme={theme} onClick={() => { setActiveTab('users'); closeSidebar(); }} />
          <NavItem icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} label="Vendors" active={activeTab === 'vendors'} theme={theme} onClick={() => { setActiveTab('vendors'); closeSidebar(); }} />
          <NavItem icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} label="Storage Zones" active={activeTab === 'locations'} theme={theme} onClick={() => { setActiveTab('locations'); closeSidebar(); }} />
          <NavItem icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Audit Logs" active={activeTab === 'logs'} theme={theme} onClick={() => { setActiveTab('logs'); closeSidebar(); }} />

          <p className="text-[10px] font-black text-slate-400 uppercase mt-8 mb-3 px-4 tracking-[0.2em]">System</p>
          <NavItem icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>} label="Theme Engine" active={activeTab === 'theme'} theme={theme} onClick={() => { setActiveTab('theme'); closeSidebar(); }} />
          {currentUser?.role === 'admin' && <NavItem icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} label="Operators" active={activeTab === 'logins'} theme={theme} onClick={() => { setActiveTab('logins'); closeSidebar(); }} />}
        </nav>

        <div className="pt-6 border-t border-slate-100 space-y-4">
          <button onClick={handleBackup} disabled={isBackingUp} className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-500 transition-all active:scale-95">
            {isBackingUp ? <div className="w-3 h-3 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>}
            Local Archive
          </button>
          <div className="flex items-center gap-3 px-4">
             <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs uppercase shadow-inner border border-slate-100" style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor }}>{currentUser?.name?.charAt(0)}</div>
             <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate leading-none text-slate-800">{currentUser?.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{currentUser?.role}</p>
             </div>
             <button onClick={onLogout} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></button>
          </div>
        </div>
      </aside>

      <main className="flex-1 lg:ml-72 p-4 lg:p-10 min-h-screen pt-24 lg:pt-10 transition-all duration-500">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick, theme }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 ${active ? 'text-white shadow-xl shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-800'}`} style={active ? { backgroundColor: theme.primaryColor } : {}}>
    <span className={`${active ? 'scale-110' : ''}`}>{icon}</span>
    <span className="font-bold text-sm tracking-tight">{label}</span>
  </button>
);

export default Layout;
