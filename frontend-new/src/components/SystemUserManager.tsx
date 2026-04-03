
import React, { useState } from 'react';
import { SystemUser, ThemeConfig } from '../types';

interface Props {
  users: SystemUser[];
  onSave: (u: SystemUser) => void;
  onDelete: (id: string) => void;
  theme: ThemeConfig;
}

// Add theme to props to fix assignment error in App.tsx
const SystemUserManager: React.FC<Props> = ({ users, onSave, onDelete, theme }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<SystemUser>>({ id: '', name: '', password: '', role: 'staff' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.name || !formData.password) return;
    onSave(formData as SystemUser);
    setIsEditing(false);
    setFormData({ id: '', name: '', password: '', role: 'staff' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black tracking-tighter text-slate-800">User Access Control</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)} 
            className="px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all text-white"
            style={{ backgroundColor: theme.primaryColor }}
          >
            + New Login
          </button>
        )}
      </div>

      {isEditing ? (
        <div 
          className="p-10 rounded-[2.5rem] border border-slate-200 shadow-soft animate-in zoom-in-95 duration-200"
          style={{ backgroundColor: theme.surfaceColor }}
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Username (Login ID)</label>
              <input value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:bg-white focus:border-blue-500 transition-all" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
              <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:bg-white focus:border-blue-500 transition-all" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Password</label>
              <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:bg-white focus:border-blue-500 transition-all" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">System Role</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold appearance-none outline-none focus:bg-white focus:border-blue-500 transition-all">
                <option value="staff">Staff (Editor)</option>
                <option value="admin">Administrator (Full Control)</option>
              </select>
            </div>
            <div className="col-span-full flex justify-end gap-3 pt-8 border-t border-slate-100">
              <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3 text-slate-400 font-bold text-xs uppercase tracking-widest">Cancel</button>
              <button 
                type="submit" 
                className="px-10 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                Save User
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(u => (
            <div 
              key={u.id} 
              className="p-8 rounded-[2rem] border border-slate-100 flex justify-between items-center group shadow-soft transition-all hover:shadow-xl"
              style={{ backgroundColor: theme.surfaceColor }}
            >
              <div>
                <p className="font-black text-xl text-slate-800 tracking-tight">{u.name}</p>
                <p className="text-xs font-mono font-bold mt-1" style={{ color: theme.primaryColor }}>@{u.id}</p>
                <span className="inline-block mt-4 text-[9px] bg-slate-50 px-3 py-1 rounded-full uppercase text-slate-400 font-black border border-slate-100 tracking-widest">{u.role}</span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                <button onClick={() => { setFormData(u); setIsEditing(true); }} className="text-blue-500 p-2 hover:bg-blue-50 rounded-xl transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                {u.id !== 'admin' && (
                  <button onClick={() => onDelete(u.id)} className="text-rose-500 p-2 hover:bg-rose-50 rounded-xl transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SystemUserManager;
