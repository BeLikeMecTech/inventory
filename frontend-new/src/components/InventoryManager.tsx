
import React, { useState, useRef, useMemo } from 'react';
import { EquipmentItem, EquipmentCategory, EquipmentStatus, User, Vendor, Location, ThemeConfig } from '../types';
import Scanner from './Scanner';
import CameraModal from './CameraModal';

interface Props {
  items: EquipmentItem[];
  users: User[];
  vendors: Vendor[];
  locations: Location[];
  theme: ThemeConfig;
  onSave: (item: EquipmentItem) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
  onImport: (json: string) => void;
}

const InventoryManager: React.FC<Props> = ({ items, users, vendors, locations, theme, onSave, onDelete, onExport, onImport }) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'low'>('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<EquipmentItem> | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const photoUploadRef = useRef<HTMLInputElement>(null);

  const filteredItems = useMemo(() => {
    let res = items;
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(i => i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q));
    }
    if (activeTab === 'low') res = res.filter(i => i.quantity < 5);
    return res;
  }, [items, search, activeTab]);

  const handleEdit = (item: EquipmentItem) => {
    setEditingItem({ ...item, photos: item.photos || [] });
    setIsDrawerOpen(true);
  };

  const handleAdd = () => {
    setEditingItem({
      id: `AST-${Math.floor(10000 + Math.random() * 90000)}`,
      name: '',
      serialNumber: '',
      quantity: 1,
      status: EquipmentStatus.AVAILABLE,
      category: EquipmentCategory.OTHER,
      locationId: '',
      assignedToUserId: '',
      vendorName: '',
      photos: [],
      notes: '',
      lastMaintained: new Date().toISOString().split('T')[0],
      warrantyDate: new Date().toISOString().split('T')[0]
    });
    setIsDrawerOpen(true);
  };

  const addPhoto = (base64: string) => {
    const currentPhotos = editingItem?.photos || [];
    setEditingItem({ ...editingItem, photos: [...currentPhotos, base64] });
  };

  const removePhoto = (index: number) => {
    const currentPhotos = editingItem?.photos || [];
    setEditingItem({ ...editingItem, photos: currentPhotos.filter((_, i) => i !== index) });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => addPhoto(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 animate-in fade-in duration-500">
      {showScanner && (
        <Scanner 
          onScan={(s) => { setEditingItem({ ...editingItem, serialNumber: s }); setShowScanner(false); }} 
          onClose={() => setShowScanner(false)} 
        />
      )}
      {showCamera && (
        <CameraModal 
          onCapture={(b) => { addPhoto(b); setShowCamera(false); }} 
          onClose={() => setShowCamera(false)} 
        />
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Master Asset Registry</h2>
          <p className="text-sm text-slate-400 mt-1 font-semibold tracking-wide underline decoration-blue-100 decoration-2">Broadcast Equipment Management</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <button onClick={onExport} className="flex-1 md:flex-none p-3.5 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-blue-600 hover:border-blue-100 transition-all shadow-soft">
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2.2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
           </button>
           <button onClick={handleAdd} className="flex-2 md:flex-none text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3" style={{ backgroundColor: theme.primaryColor }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
              New Asset
           </button>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-slate-200 shadow-soft overflow-hidden" style={{ backgroundColor: theme.surfaceColor }}>
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-6">
           <div className="flex items-center gap-1 p-1 bg-slate-100/50 rounded-xl">
              <FilterTab active={activeTab === 'all'} label="All Registered" onClick={() => setActiveTab('all')} theme={theme} />
              <FilterTab active={activeTab === 'low'} label="Stock Alerts" onClick={() => setActiveTab('low')} theme={theme} />
           </div>
           
           <div className="flex-1 max-w-md relative group">
              <input 
                type="text" 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Find asset by name, SKU..."
                className="w-full bg-slate-100/30 border border-slate-200 rounded-xl px-12 py-2.5 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto scrollbar-hide">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-8 py-6">Product Details</th>
                    <th className="px-6 py-6">Asset ID</th>
                    <th className="px-6 py-6">Category</th>
                    <th className="px-6 py-6">Availability</th>
                    <th className="px-6 py-6">Status</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                 {filteredItems.map(item => (
                   <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <div className="relative w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-300 shadow-sm">
                               {item.photos?.[0] ? <img src={item.photos[0]} className="w-full h-full object-cover" /> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>}
                               {(item.photos?.length || 0) > 1 && (
                                 <div className="absolute bottom-0 right-0 text-white text-[8px] px-1 rounded-tl-md font-bold" style={{ backgroundColor: theme.primaryColor }}>+{item.photos!.length - 1}</div>
                               )}
                            </div>
                            <div>
                               <p className="font-extrabold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{item.name}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{item.vendorName || 'Generic Supplier'}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-6 font-mono text-[11px] text-slate-400 uppercase font-bold">{item.id}</td>
                      <td className="px-6 py-6">
                         <span className="text-[10px] font-extrabold bg-blue-50 px-3 py-1.5 rounded-lg uppercase tracking-wider" style={{ color: theme.primaryColor }}>{item.category}</span>
                      </td>
                      <td className="px-6 py-6">
                         <div className="flex flex-col gap-1.5 min-w-[140px]">
                            <div className="flex justify-between text-[10px] font-bold uppercase">
                               <span className={item.quantity < 5 ? 'text-rose-600' : 'text-slate-500'}>{item.quantity} Unit Stock</span>
                               <span className="text-slate-300 font-bold">{Math.round((item.quantity / 20) * 100)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                               <div 
                                 className={`h-full rounded-full transition-all duration-1000 ${item.quantity < 5 ? 'bg-rose-500' : 'bg-blue-600'}`} 
                                 style={{ width: `${Math.min(100, (item.quantity / 20) * 100)}%`, backgroundColor: item.quantity >= 5 ? theme.primaryColor : undefined }}
                               />
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-6">
                         <StatusPill status={item.status} />
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex items-center justify-end gap-1">
                           <button onClick={() => handleEdit(item)} className="p-2.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2.2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                           </button>
                           <button onClick={() => onDelete(item.id)} className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2.2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                           </button>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      {/* Asset Form Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden flex justify-end">
           <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm animate-in fade-in" onClick={() => setIsDrawerOpen(false)}></div>
           <div className="relative w-full max-w-2xl h-full shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto p-10 lg:p-14" style={{ backgroundColor: theme.surfaceColor }}>
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{editingItem?.name ? 'Asset Profile' : 'New Registration'}</h3>
                 <button onClick={() => setIsDrawerOpen(false)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
                 </button>
              </div>

              <form onSubmit={e => { e.preventDefault(); onSave(editingItem as EquipmentItem); setIsDrawerOpen(false); }} className="space-y-8 pb-20">
                 {/* Identification Section */}
                 <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest border-b border-blue-50 pb-2" style={{ color: theme.primaryColor }}>Identification</h4>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Designation</label>
                          <input value={editingItem?.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className="w-full bg-black/5 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white outline-none transition-all" required />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Serial Number</label>
                          <div className="flex gap-2">
                             <input value={editingItem?.serialNumber} onChange={e => setEditingItem({...editingItem, serialNumber: e.target.value})} className="flex-1 bg-black/5 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" placeholder="SN-XXXX" />
                             <button type="button" onClick={() => setShowScanner(true)} className="p-3 bg-slate-200/50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                             </button>
                          </div>
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Registry ID</label>
                          <input value={editingItem?.id} onChange={e => setEditingItem({...editingItem, id: e.target.value})} className="w-full bg-black/5 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono outline-none" required />
                       </div>
                    </div>
                 </div>

                 {/* Logistics Section */}
                 <div className="space-y-4 pt-4">
                    <h4 className="text-xs font-black uppercase tracking-widest border-b border-blue-50 pb-2" style={{ color: theme.primaryColor }}>Logistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Assigned To</label>
                          <select value={editingItem?.assignedToUserId} onChange={e => setEditingItem({...editingItem, assignedToUserId: e.target.value})} className="w-full bg-black/5 border border-slate-200 rounded-xl px-4 py-3 text-sm appearance-none outline-none">
                             <option value="">Unassigned</option>
                             {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                          </select>
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Location Zone</label>
                          <select value={editingItem?.locationId} onChange={e => setEditingItem({...editingItem, locationId: e.target.value})} className="w-full bg-black/5 border border-slate-200 rounded-xl px-4 py-3 text-sm appearance-none outline-none">
                             <option value="">Select Zone...</option>
                             {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                          </select>
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Vendor Partner</label>
                          <select value={editingItem?.vendorName} onChange={e => setEditingItem({...editingItem, vendorName: e.target.value})} className="w-full bg-black/5 border border-slate-200 rounded-xl px-4 py-3 text-sm appearance-none outline-none">
                             <option value="">N/A</option>
                             {vendors.map(v => <option key={v.id} value={v.companyName}>{v.companyName}</option>)}
                          </select>
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Classification</label>
                          <select value={editingItem?.category} onChange={e => setEditingItem({...editingItem, category: e.target.value as any})} className="w-full bg-black/5 border border-slate-200 rounded-xl px-4 py-3 text-sm appearance-none outline-none">
                             {Object.values(EquipmentCategory).map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                       </div>
                    </div>
                 </div>

                 {/* Media Section */}
                 <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between border-b border-blue-50 pb-2">
                       <h4 className="text-xs font-black uppercase tracking-widest" style={{ color: theme.primaryColor }}>Media Documentation</h4>
                       <div className="flex gap-2">
                          <button type="button" onClick={() => setShowCamera(true)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                          </button>
                          <button type="button" onClick={() => photoUploadRef.current?.click()} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                          </button>
                          <input ref={photoUploadRef} type="file" multiple className="hidden" accept="image/*" onChange={handleFileUpload} />
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-3">
                       {editingItem?.photos?.map((p, idx) => (
                         <div key={idx} className="relative aspect-square bg-black/5 rounded-xl overflow-hidden group shadow-sm">
                            <img src={p} className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              onClick={() => removePhoto(idx)}
                              className="absolute inset-0 bg-rose-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                         </div>
                       ))}
                       {(!editingItem?.photos || editingItem.photos.length === 0) && (
                         <div className="col-span-4 py-8 bg-black/5 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-300">
                            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            <span className="text-[10px] font-bold uppercase">No Photos Attached</span>
                         </div>
                       )}
                    </div>
                 </div>

                 {/* Notes Section */}
                 <div className="space-y-4 pt-4">
                    <h4 className="text-xs font-black uppercase tracking-widest border-b border-blue-50 pb-2" style={{ color: theme.primaryColor }}>Remarks & Details</h4>
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Technical Notes</label>
                       <textarea 
                          value={editingItem?.notes} 
                          onChange={e => setEditingItem({...editingItem, notes: e.target.value})} 
                          className="w-full bg-black/5 border border-slate-200 rounded-xl px-4 py-3 text-sm min-h-[120px] outline-none focus:bg-white transition-all"
                          placeholder="Condition, custom settings, cable requirements..."
                       />
                    </div>
                 </div>

                 <div className="pt-10 flex gap-4">
                    <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex-1 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Discard</button>
                    <button type="submit" className="flex-2 text-white px-12 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl active:scale-95" style={{ backgroundColor: theme.primaryColor }}>Save</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

const FilterTab = ({ active, label, onClick, theme }: any) => (
  <button 
    onClick={onClick}
    className={`px-5 py-2.5 rounded-xl text-[11px] font-bold transition-all ${active ? 'bg-white shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
    style={active ? { color: theme.primaryColor } : {}}
  >
    {label}
  </button>
);

const StatusPill = ({ status }: { status: EquipmentStatus }) => {
  const themes: Record<string, string> = {
    [EquipmentStatus.AVAILABLE]: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    [EquipmentStatus.IN_USE]: 'bg-blue-50 text-blue-600 border-blue-100',
    [EquipmentStatus.REPAIR]: 'bg-amber-50 text-amber-600 border-amber-100',
    [EquipmentStatus.LOST]: 'bg-rose-50 text-rose-600 border-rose-100',
    [EquipmentStatus.OUT_OF_ORDER]: 'bg-slate-100 text-slate-600 border-slate-200'
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${themes[status] || themes[EquipmentStatus.AVAILABLE]}`}>
       {status}
    </span>
  );
};

export default InventoryManager;
