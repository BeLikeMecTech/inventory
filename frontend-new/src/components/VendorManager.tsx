
import React, { useState } from 'react';
import { Vendor, ThemeConfig } from '../types';

interface Props {
  vendors: Vendor[];
  onAdd: (v: Vendor) => void;
  onDelete: (id: string) => void;
  theme: ThemeConfig;
}

// Add theme to props to fix assignment error in App.tsx
const VendorManager: React.FC<Props> = ({ vendors, onAdd, onDelete, theme }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Vendor>>({ companyName: '', contactPerson: '', contactNumber: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.companyName) {
      onAdd({ id: 'VND-' + Date.now(), companyName: formData.companyName, contactPerson: formData.contactPerson || '', contactNumber: formData.contactNumber || '' });
      setFormData({ companyName: '', contactPerson: '', contactNumber: '' });
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-black tracking-tighter">Vendors</h2>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)} 
            className="px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all text-white"
            /* Fix: 'shadowColor' is not a valid CSS property. Using 'boxShadow' for the intended colored shadow effect. */
            style={{ backgroundColor: theme.primaryColor, boxShadow: `0 20px 25px -5px ${theme.primaryColor}33` }}
          >
            + Add Vendor
          </button>
        )}
      </div>

      {isAdding && (
        <div 
          className="border border-slate-200 p-8 rounded-[3rem] shadow-2xl"
          style={{ backgroundColor: theme.surfaceColor }}
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase px-2 tracking-widest">Company Name</label>
              <input value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full bg-black/5 border border-slate-200 rounded-2xl px-5 py-4 text-sm outline-none focus:border-indigo-500/50" placeholder="e.g. Apple Inc." required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase px-2 tracking-widest">Contact Person</label>
              <input value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="w-full bg-black/5 border border-slate-200 rounded-2xl px-5 py-4 text-sm outline-none focus:border-indigo-500/50" placeholder="e.g. Tim Cook" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase px-2 tracking-widest">Contact Number</label>
              <input value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} className="w-full bg-black/5 border border-slate-200 rounded-2xl px-5 py-4 text-sm outline-none focus:border-indigo-500/50" placeholder="+1..." />
            </div>
            <div className="col-span-full flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-3 bg-slate-100 rounded-xl text-xs font-black uppercase text-slate-500">Cancel</button>
              <button 
                type="submit" 
                className="px-10 py-3 rounded-xl text-xs font-black uppercase shadow-lg text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                Register Vendor
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map(v => (
          <div 
            key={v.id} 
            className="p-8 rounded-[2.5rem] border border-slate-100 flex justify-between items-start group shadow-soft transition-all hover:shadow-xl"
            style={{ backgroundColor: theme.surfaceColor }}
          >
            <div>
              <p className="font-black text-xl text-slate-800 tracking-tight">{v.companyName}</p>
              <p className="text-[10px] font-mono uppercase mt-1 tracking-tighter" style={{ color: theme.primaryColor }}>{v.id}</p>
              <div className="mt-6 space-y-2">
                 <div className="flex items-center gap-2.5">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span className="text-xs font-bold text-slate-500">{v.contactPerson || 'No contact person'}</span>
                 </div>
                 <div className="flex items-center gap-2.5">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <span className="text-xs font-bold text-slate-500">{v.contactNumber || 'No phone recorded'}</span>
                 </div>
              </div>
            </div>
            <button onClick={() => onDelete(v.id)} className="text-rose-500 p-2 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 rounded-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        ))}
        {vendors.length === 0 && (
          <div className="col-span-full py-24 text-center bg-slate-50 rounded-[3.5rem] border border-dashed border-slate-200">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">No Vendors Registered</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default VendorManager;
