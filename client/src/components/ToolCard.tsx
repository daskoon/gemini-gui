import React from 'react';
import { Terminal, Check, X, Code } from 'lucide-react';

interface ToolCardProps {
  id: string;
  name: string;
  args: any;
  status: 'pending' | 'approved' | 'denied' | 'executing' | 'completed';
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ id, name, args, status, onApprove, onDeny }) => {
  return (
    <div className={`
      relative overflow-hidden rounded-xl border transition-all duration-300
      ${status === 'pending' ? 'border-[#00ff9f] bg-[#1a1a1a]/80 shadow-[0_0_20px_rgba(0,255,159,0.1)]' : 'border-white/10 bg-[#111]/50'}
      glassmorphism
    `}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-[#00ff9f]" />
          <span className="text-sm font-bold tracking-wider text-[#00ff9f] uppercase">{name}</span>
        </div>
        <div className="text-[10px] font-mono text-white/40">ID: {id.slice(0, 8)}</div>
      </div>

      {/* Arguments */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Code size={14} className="text-white/40" />
          <span className="text-xs text-white/40 font-semibold uppercase tracking-tight">Parameters</span>
        </div>
        <pre className="bg-black/40 rounded-lg p-3 text-[12px] font-mono text-white/80 overflow-x-auto border border-white/5 custom-scrollbar">
          {JSON.stringify(args, null, 2)}
        </pre>
      </div>

      {/* Footer / Actions */}
      <div className="px-4 py-3 bg-black/20 flex items-center justify-end gap-3">
        {status === 'pending' ? (
          <>
            <button
              onClick={() => onDeny(id)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <X size={14} />
              DENY
            </button>
            <button
              onClick={() => onApprove(id)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold bg-[#00ff9f] text-black hover:bg-[#00cc7e] transition-colors shadow-[0_0_15px_rgba(0,255,159,0.3)]"
            >
              <Check size={14} />
              APPROVE
            </button>
          </>
        ) : (
          <div className="text-xs font-bold uppercase tracking-widest py-1 px-3 rounded border border-white/10 text-white/30 italic">
            {status}
          </div>
        )}
      </div>

      {/* Status Indicators */}
      {status === 'pending' && (
        <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
          <div className="absolute top-4 -right-8 w-32 py-1 bg-[#00ff9f] text-black text-[10px] font-bold text-center rotate-45 shadow-sm">
            AWAITING
          </div>
        </div>
      )}
    </div>
  );
};
