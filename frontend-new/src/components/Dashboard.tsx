
import React from 'react';
import { EquipmentCategory, EquipmentItem, InventoryStats, ThemeConfig } from '../types';

interface DashboardProps {
  stats: InventoryStats;
  onCategoryClick: (category: EquipmentCategory) => void;
  allItemData: EquipmentItem[];
  theme: ThemeConfig;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onCategoryClick, allItemData, theme }) => {
  const categories = Object.values(EquipmentCategory);

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      {/* Visual KPI Summaries */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="Total Assets" value={stats.totalItems} subText="Full Registry Count" color="text-slate-900" theme={theme} />
        <KPICard label="Ready for Use" value={stats.byStatus['Available']} subText="Available Equipment" color="text-emerald-600" theme={theme} />
        <KPICard label="Active Use" value={stats.byStatus['In Use']} subText="Equipment Deployed" color="text-blue-600" theme={theme} />
        <KPICard label="In Repair" value={stats.byStatus['In Repair'] || 0} subText="Maintenance Cycle" color="text-rose-600" theme={theme} />
      </section>

      {/* Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-black tracking-tighter text-slate-900">Equipment Categories</h2>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{categories.length} Groups</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
           {categories.map(cat => (
             <button 
               key={cat} 
               onClick={() => onCategoryClick(cat)}
               className="group p-7 rounded-[2.5rem] border border-slate-100 shadow-soft card-hover transition-all text-left relative overflow-hidden"
               style={{ backgroundColor: theme.surfaceColor }}
             >
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                   <svg className="w-7 h-7 text-slate-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={ { color: theme.primaryColor + '88'} }><path strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                </div>
                <h3 className="font-extrabold text-slate-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">{cat}</h3>
                <p className="text-xs font-bold text-slate-400 mt-1">{stats.byCategory[cat] || 0} Assets</p>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full scale-0 group-hover:scale-100 transition-transform opacity-10" style={{ backgroundColor: theme.primaryColor }}></div>
             </button>
           ))}
        </div>
      </section>

      {/* Registry Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div 
          className="lg:col-span-2 p-8 rounded-[2.5rem] border border-slate-100 shadow-soft"
          style={{ backgroundColor: theme.surfaceColor }}
        >
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-800">Recent Movements</h3>
              <button className="text-xs font-bold text-blue-600 hover:underline">View Ledger</button>
           </div>
           <div className="space-y-6">
              {allItemData.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-[10px] font-bold text-slate-400">
                        {item.photos?.[0] ? <img src={item.photos[0]} className="w-full h-full object-cover" /> : idx+1}
                      </div>
                      <div>
                         <p className="font-bold text-slate-800 leading-tight">{item.name}</p>
                         <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{item.id}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-extrabold text-slate-800">{item.quantity} Units</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme.primaryColor }}>{item.status}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div 
          className="p-8 rounded-[2.5rem] border border-slate-100 shadow-soft flex flex-col items-center justify-center text-center"
          style={{ backgroundColor: theme.surfaceColor }}
        >
           <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: theme.primaryColor }}><path strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
           </div>
           <h3 className="text-xl font-bold text-slate-800 mb-2">Health Metrics</h3>
           <p className="text-sm text-slate-500 max-w-[200px] mb-8 font-medium">Registry sync health is optimal at 98.4%.</p>
           <button 
             className="w-full py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest text-white shadow-lg shadow-blue-600/10 active:scale-95 transition-all"
             style={{ backgroundColor: theme.primaryColor }}
           >Analyze Sync</button>
        </div>
      </section>
    </div>
  );
};

const KPICard = ({ label, value, subText, color, theme }: any) => (
  <div 
    className="p-8 rounded-[2.5rem] border border-slate-100 shadow-soft"
    style={{ backgroundColor: theme.surfaceColor }}
  >
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{label}</p>
    <div className="flex items-baseline gap-2 mb-1">
      <span className={`text-4xl font-black tracking-tighter ${color}`}>{value}</span>
    </div>
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{subText}</p>
  </div>
);

export default Dashboard;
