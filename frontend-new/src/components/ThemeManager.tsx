
import React from 'react';
import { ThemeConfig, EquipmentCategory } from '../types';

interface Props {
  theme: ThemeConfig;
  onSave: (theme: ThemeConfig) => void;
}

const ThemeManager: React.FC<Props> = ({ theme, onSave }) => {
  const accentColors = [
    { name: 'Studio Blue', hex: '#2563eb' },
    { name: 'Live Red', hex: '#f43f5e' },
    { name: 'Ready Green', hex: '#10b981' },
    { name: 'Warning Amber', hex: '#f59e0b' },
    { name: 'Tech Violet', hex: '#8b5cf6' }
  ];

  const handleIconUpload = (category: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSave({
          ...theme,
          customIcons: { ...theme.customIcons, [category]: reader.result as string }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const ColorInput = ({ label, value, onChange, desc }: { label: string, value: string, onChange: (v: string) => void, desc?: string }) => (
    <div className="flex justify-between items-center group">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest">{label}</p>
        {desc && <p className="text-[9px] font-bold opacity-60 mt-0.5">{desc}</p>}
      </div>
      <div className="flex items-center gap-3 bg-black/5 p-1 rounded-xl border border-black/5">
        <span className="text-[10px] opacity-40 font-mono px-2 uppercase">{value}</span>
        <input 
          type="color" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0 overflow-hidden shadow-sm"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black tracking-tighter">Brand Identity</h2>
        <p className="text-sm font-semibold tracking-wide">Completely customize every color of your registry workspace.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Surface Colors */}
        <section className="p-10 rounded-[2.5rem] border border-slate-200 shadow-soft space-y-10">
          <h3 className="text-xl font-black flex items-center gap-3">
            <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></div> 
            Workspace Surfaces
          </h3>
          
          <div className="space-y-8">
            <ColorInput label="Global Background" value={theme.backgroundColor} onChange={(v) => onSave({...theme, backgroundColor: v})} desc="The main page background" />
            <ColorInput label="Card & Panel Surface" value={theme.surfaceColor} onChange={(v) => onSave({...theme, surfaceColor: v})} desc="Inner containers and dashboard tiles" />
            <ColorInput label="Sidebar Background" value={theme.sidebarColor} onChange={(v) => onSave({...theme, sidebarColor: v})} desc="Navigation menu background" />
            <ColorInput label="Border & Divider" value={theme.borderColor} onChange={(v) => onSave({...theme, borderColor: v})} desc="Lines and separation elements" />
          </div>
        </section>

        {/* Brand Accents */}
        <section className="p-10 rounded-[2.5rem] border border-slate-200 shadow-soft space-y-10">
          <h3 className="text-xl font-black flex items-center gap-3">
            <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></div> 
            Primary Accents
          </h3>
          
          <div className="space-y-8">
            <ColorInput label="Accent Color" value={theme.primaryColor} onChange={(v) => onSave({...theme, primaryColor: v})} desc="Buttons, icons, and active states" />
            <div className="flex flex-wrap gap-3 pt-2">
              {accentColors.map(c => (
                <button 
                  key={c.hex} 
                  onClick={() => onSave({...theme, primaryColor: c.hex})} 
                  className={`w-10 h-10 rounded-xl border-2 transition-all ${theme.primaryColor === c.hex ? 'border-blue-500 scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`} 
                  style={{ backgroundColor: c.hex }} 
                />
              ))}
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="p-10 rounded-[2.5rem] border border-slate-200 shadow-soft space-y-10">
          <h3 className="text-xl font-black flex items-center gap-3">
            <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></div> 
            Typography
          </h3>
          
          <div className="space-y-8">
            <ColorInput label="Main Text Color" value={theme.textColor} onChange={(v) => onSave({...theme, textColor: v})} desc="Headings and primary content" />
            <ColorInput label="Muted Text Color" value={theme.secondaryTextColor} onChange={(v) => onSave({...theme, secondaryTextColor: v})} desc="Labels, IDs, and secondary info" />
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => onSave({...theme, textColor: '#0f172a', secondaryTextColor: '#64748b'})}
                className="py-3 bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-800 border border-slate-200"
              >Mode: Light Text</button>
              <button 
                onClick={() => onSave({...theme, textColor: '#f8fafc', secondaryTextColor: '#94a3b8'})}
                className="py-3 bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-white border border-slate-700"
              >Mode: Dark Text</button>
            </div>
          </div>
        </section>

        {/* Icons */}
        <section className="p-10 rounded-[2.5rem] border border-slate-200 shadow-soft space-y-8">
          <h3 className="text-xl font-black flex items-center gap-3">
             <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></div>
             Asset Category Icons
          </h3>
          <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
            {Object.values(EquipmentCategory).map(cat => (
              <div key={cat} className="bg-black/5 p-4 rounded-2xl border border-black/5 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden border border-white/5 shadow-inner">
                  {theme.customIcons[cat] ? (
                    <img src={theme.customIcons[cat]} className="w-full h-full object-cover" />
                  ) : (
                    <div className="opacity-20">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                  )}
                </div>
                <div className="text-center w-full space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-wider truncate opacity-80">{cat}</p>
                  <label className="block w-full text-[9px] font-black text-white py-2 rounded-lg cursor-pointer transition-all hover:brightness-110 active:scale-95 text-center" style={{ backgroundColor: 'var(--primary)' }}>
                    PICK ICON
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleIconUpload(cat, e)} />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
export default ThemeManager;
