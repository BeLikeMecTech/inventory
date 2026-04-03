
import React from 'react';
import { EquipmentCategory, EquipmentItem, EquipmentStatus, ThemeConfig } from '../types';

interface CategoryViewProps {
  category: EquipmentCategory;
  items: EquipmentItem[];
  onBack: () => void;
  theme: ThemeConfig;
}

const CategoryView: React.FC<CategoryViewProps> = ({ category, items, onBack, theme }) => {
  const filteredItems = items.filter(i => i.category === category);

  const getStatusStyle = (status: EquipmentStatus) => {
    switch (status) {
      case EquipmentStatus.AVAILABLE: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case EquipmentStatus.IN_USE: return 'bg-blue-50 text-blue-600 border-blue-100';
      case EquipmentStatus.REPAIR: return 'bg-amber-50 text-amber-600 border-amber-100';
      case EquipmentStatus.LOST: return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-4 lg:space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-600 transition-all active:scale-95 shadow-sm"
        >
          <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h2 className="text-3xl font-black text-slate-900 leading-none tracking-tight">{category}</h2>
          <p className="text-[11px] text-slate-400 uppercase font-black tracking-widest mt-2">{filteredItems.length} Registered Records</p>
        </div>
      </div>

      <div 
        className="border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-soft"
        style={{ backgroundColor: theme.surfaceColor }}
      >
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[320px] lg:min-w-0">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Details</th>
                <th className="hidden md:table-cell px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Serial</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lifecycle</th>
                <th className="hidden sm:table-cell px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Zone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.length > 0 ? filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] font-bold text-slate-400 mb-0.5 uppercase tracking-tighter">{item.id}</span>
                      <span className="font-bold text-slate-800 text-sm lg:text-base">{item.name}</span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-8 py-6">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase">{item.serialNumber || 'Unmarked'}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest shadow-sm ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-8 py-6">
                    <span className="text-xs lg:text-sm text-slate-500 font-bold">{item.locationId || 'Central Storage'}</span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                      </div>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Assets Found in Category</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryView;
