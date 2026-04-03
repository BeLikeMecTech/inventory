
import React from 'react';
import { AuditLog, ThemeConfig } from '../types';

interface Props {
  logs: AuditLog[];
  theme: ThemeConfig;
}

// Add theme to props to fix assignment error in App.tsx
const LogManager: React.FC<Props> = ({ logs, theme }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black tracking-tighter text-slate-800">Audit Logs</h2>
        <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Tracking Active</span>
      </div>
      <div 
        className="border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-soft"
        style={{ backgroundColor: theme.surfaceColor }}
      >
        <div className="overflow-x-auto max-h-[600px] scrollbar-hide">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 sticky top-0 z-10 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="px-8 py-4 text-[10px] font-mono font-bold text-slate-400">{log.timestamp}</td>
                  <td className="px-8 py-4 text-sm font-bold text-slate-800" style={{ color: theme.primaryColor }}>{log.userName}</td>
                  <td className="px-8 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                      log.action.includes('Delete') ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                      log.action.includes('Update') ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-sm font-bold text-slate-500">{log.details}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">No activity recorded yet</span>
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
export default LogManager;
