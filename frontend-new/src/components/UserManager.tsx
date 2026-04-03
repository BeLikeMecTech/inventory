
import React, { useState } from 'react';
import { User, ThemeConfig } from '../types';

interface Props {
  users: User[];
  onAdd: (u: User) => void;
  onDelete: (id: string) => void;
  theme: ThemeConfig;
}

const UserManager: React.FC<Props> = ({ users, onAdd, onDelete, theme }) => {
  const [name, setName] = useState('');
  return (
    <div 
      className="p-8 lg:p-14 rounded-[3rem] border border-slate-200 shadow-soft animate-in fade-in duration-500"
      style={{ backgroundColor: theme.surfaceColor }}
    >
      <div className="mb-12">
        <h3 className="text-4xl font-black tracking-tighter text-slate-800">Technical Staff</h3>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-3">Authorized Technical Operators</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <input 
          className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-blue-500 transition-all text-sm font-bold" 
          placeholder="Operator Full Name (e.g. John Smith)"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button 
          onClick={() => { if(name){onAdd({id: 'USR-'+Date.now(), name}); setName('');} }}
          className="px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all text-white"
          style={{ backgroundColor: theme.primaryColor }}
        >Enroll Operator</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {users.map(u => (
          <div key={u.id} className="flex justify-between items-center p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group transition-all hover:bg-white hover:shadow-soft">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black shadow-sm" style={{ color: theme.primaryColor }}>
                {u.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-sm block truncate text-slate-800">{u.name}</span>
                <span className="text-[9px] font-mono text-slate-400 uppercase mt-0.5">{u.id}</span>
              </div>
            </div>
            <button onClick={() => onDelete(u.id)} className="text-rose-500 p-2.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 rounded-xl">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        ))}
        {users.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-[0.4em]">Zero Enrolled Operators</div>
        )}
      </div>
    </div>
  );
};
export default UserManager;
