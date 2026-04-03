
import React, { useState, useEffect, useCallback } from 'react';
import { EquipmentCategory, EquipmentItem, InventoryStats, User, Vendor, Location, AuditLog, SystemUser, ThemeConfig } from './types';
import { inventoryService } from './services/inventoryService';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CategoryView from './components/CategoryView';
import InventoryManager from './components/InventoryManager';
import UserManager from './components/UserManager';
import VendorManager from './components/VendorManager';
import LogManager from './components/LogManager';
import ThemeManager from './components/ThemeManager';
import SystemUserManager from './components/SystemUserManager';

const App: React.FC = () => {
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [sysUsers, setSysUsers] = useState<SystemUser[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [theme, setTheme] = useState<ThemeConfig>(inventoryService.getTheme());
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'manage' | 'users' | 'vendors' | 'locations' | 'logs' | 'theme' | 'logins'>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategory | null>(null);
  
  const [currentUser, setCurrentUser] = useState<SystemUser | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const loadData = useCallback(async () => {
    setIsDataLoading(true);
    try {
      const [i, u, v, l, lg, su] = await Promise.all([
        inventoryService.getItems(),
        inventoryService.getUsers(),
        inventoryService.getVendors(),
        inventoryService.getLocations(),
        inventoryService.getLogs(),
        inventoryService.getSystemUsers()
      ]);
      setItems(i);
      setUsers(u);
      setVendors(v);
      setLocations(l);
      setLogs(lg);
      setSysUsers(su);
      setStats(inventoryService.getStats(i));
    } catch (error) {
      console.error("Data fetch error", error);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  useEffect(() => {
    const loggedUser = sessionStorage.getItem('logged_user');
    if (loggedUser) setCurrentUser(JSON.parse(loggedUser));
    loadData();
  }, [loadData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const su = await inventoryService.getSystemUsers();
      const user = su.find(u => u.id === loginForm.username && u.password === loginForm.password);
      if (user) {
        setCurrentUser(user);
        sessionStorage.setItem('logged_user', JSON.stringify(user));
        await inventoryService.addLog(user, 'Auth Success', 'Operator verified');
        await loadData();
      } else {
        alert('Invalid Secure Credentials');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('End current session?')) {
      if (currentUser) await inventoryService.addLog(currentUser, 'Auth Logout', 'Session ended');
      setCurrentUser(null);
      sessionStorage.removeItem('logged_user');
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50">
        <style>{`
          :root {
            --primary: ${theme.primaryColor};
            --text-main: ${theme.textColor};
            --text-muted: ${theme.secondaryTextColor};
          }
        `}</style>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
           <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400 rounded-full blur-[120px]"></div>
           <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-400 rounded-full blur-[120px]"></div>
        </div>

        <div className="w-full max-w-sm relative z-10">
           <div className="flex flex-col items-center mb-10">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 mb-6" style={{ backgroundColor: 'var(--primary)' }}>
                 <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <h1 className="text-3xl font-black tracking-tighter" style={{ color: 'var(--text-main)' }}>StudioPro</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-3 text-center" style={{ color: 'var(--primary)' }}>Cloud Registry Access</p>
           </div>
           
           <div className="bg-white p-10 rounded-[2.5rem] shadow-soft border border-slate-100">
             <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Operator Token</label>
                   <input 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:bg-white focus:border-blue-500 transition-all" 
                      value={loginForm.username} 
                      onChange={e => setLoginForm({...loginForm, username: e.target.value})} 
                      placeholder="Username" 
                      required 
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Secure Passkey</label>
                   <input 
                      type="password" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:bg-white focus:border-blue-500 transition-all" 
                      value={loginForm.password} 
                      onChange={e => setLoginForm({...loginForm, password: e.target.value})} 
                      placeholder="••••••••" 
                      required 
                   />
                </div>
                <button 
                  disabled={isLoggingIn} 
                  className="w-full text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all mt-4 flex items-center justify-center"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  {isLoggingIn ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'Establish Secure Link'}
                </button>
             </form>
           </div>
           <p className="text-center text-[10px] font-bold text-slate-400 mt-12 uppercase tracking-[0.3em]">Authorized Access Only</p>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onHomeClick={() => setSelectedCategory(null)} onLogout={handleLogout} theme={theme} currentUser={currentUser}>
      <style>{`
        :root {
          --primary: ${theme.primaryColor};
          --bg-main: ${theme.backgroundColor};
          --bg-surface: ${theme.surfaceColor};
          --bg-sidebar: ${theme.sidebarColor};
          --text-main: ${theme.textColor};
          --text-muted: ${theme.secondaryTextColor};
          --border-main: ${theme.borderColor};
        }

        /* Unified CSS Variable Application */
        body { color: var(--text-main); background-color: var(--bg-main); }
        h1, h2, h3, h4, .text-slate-900, .text-slate-800 { color: var(--text-main) !important; }
        p, span, .text-slate-500, .text-slate-400 { color: var(--text-muted) !important; }
        .border, .border-slate-100, .border-slate-200, .divide-slate-100 { border-color: var(--border-main) !important; }
        
        /* Layout specific overrides */
        aside { background-color: var(--bg-sidebar) !important; border-color: var(--border-main) !important; }
        main { background-color: var(--bg-main) !important; }
        .bg-white, .shadow-soft { background-color: var(--bg-surface) !important; }
        
        /* Accent overrides */
        .text-blue-600, .text-blue-500 { color: var(--primary) !important; }
        .bg-blue-600, .bg-blue-500 { background-color: var(--primary) !important; }
        .border-blue-600, .border-blue-500 { border-color: var(--primary) !important; }
      `}</style>

      <div className="relative h-full">
        {isDataLoading && (
          <div className="fixed top-8 right-8 z-[100] flex items-center gap-4 bg-slate-800 px-6 py-3 rounded-2xl border border-white/20 shadow-2xl animate-in fade-in slide-in-from-right-8">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="text-[11px] font-black uppercase tracking-widest text-white">Registry Sync</span>
          </div>
        )}
        
        <div className={`transition-all duration-700 ${isDataLoading ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
          {activeTab === 'dashboard' && (
            selectedCategory ? (
              <CategoryView category={selectedCategory} items={items} onBack={() => setSelectedCategory(null)} theme={theme} />
            ) : (
              stats && <Dashboard stats={stats} theme={theme} onCategoryClick={(c) => setSelectedCategory(c as EquipmentCategory)} allItemData={items} />
            )
          )}
          {activeTab === 'manage' && (
            <InventoryManager items={items} users={users} vendors={vendors} locations={locations} theme={theme}
              onSave={async i => { await inventoryService.saveItem(i, currentUser); await loadData(); }}
              onDelete={async id => { if(confirm('Delete this asset record permanent?')){ await inventoryService.deleteItem(id, currentUser); await loadData(); }}}
              onExport={inventoryService.exportToCSV}
              onImport={async (text) => { if(await inventoryService.importFromCSV(text, currentUser)) await loadData(); else alert('Import Failure'); }}
            />
          )}
          {activeTab === 'users' && <UserManager users={users} theme={theme} onAdd={async u => { await inventoryService.saveUser(u); await loadData(); }} onDelete={async id => { if(confirm('Revoke staff access?')) { await inventoryService.deleteUser(id); await loadData(); } }} />}
          {activeTab === 'vendors' && <VendorManager vendors={vendors} theme={theme} onAdd={async v => { await inventoryService.saveVendor(v); await loadData(); }} onDelete={async id => { if(confirm('Purge vendor record?')) { await inventoryService.deleteVendor(id); await loadData(); } }} />}
          {activeTab === 'locations' && (
            <div className="p-10 lg:p-14 rounded-[3rem] border border-slate-200 shadow-soft animate-in fade-in duration-500">
               <div className="mb-12">
                 <h3 className="text-4xl font-black tracking-tighter">Storage Zones</h3>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-3">Geographical Asset Staging</p>
               </div>
               <div className="flex flex-col sm:flex-row gap-4 mb-12">
                 <input id="loc-input" className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-blue-500 transition-all text-sm font-bold" placeholder="Zone ID (e.g. Rack A1, Studio B)" />
                 <button 
                  onClick={async () => { 
                    const el = document.getElementById('loc-input') as HTMLInputElement;
                    if(el.value){ await inventoryService.saveLocation({id: 'LOC-'+Date.now(), name: el.value}); el.value = ''; await loadData(); }
                  }} 
                  className="px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all text-white"
                  style={{ backgroundColor: 'var(--primary)' }}
                >Register Area</button>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {locations.map(l => (
                   <div key={l.id} className="flex justify-between items-center p-6 bg-slate-50/20 rounded-[2rem] border border-slate-100 group transition-all hover:bg-white/40">
                      <div className="flex items-center gap-4">
                         <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></div>
                         <span className="font-bold text-sm tracking-tight">{l.name}</span>
                      </div>
                      <button onClick={async () => { if(confirm('Purge this staging zone?')) { await inventoryService.deleteLocation(l.id); await loadData(); } }} className="text-rose-500 p-2.5 opacity-0 group-hover:opacity-100 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                   </div>
                 ))}
               </div>
            </div>
          )}
          {activeTab === 'logs' && <LogManager logs={logs} theme={theme} />}
          {activeTab === 'theme' && <ThemeManager theme={theme} onSave={async (t) => { await inventoryService.saveTheme(t); setTheme(t); }} />}
          {activeTab === 'logins' && <SystemUserManager users={sysUsers} theme={theme} onSave={async u => { await inventoryService.saveSystemUser(u, currentUser); await loadData(); }} onDelete={async id => { if(confirm('Terminate account?')) { await inventoryService.deleteSystemUser(id, currentUser); await loadData(); } }} />}
        </div>
      </div>
    </Layout>
  );
};
export default App;
