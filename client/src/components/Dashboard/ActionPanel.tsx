import type { Extension } from '../../config/extensions';
import { Play, AlertTriangle } from 'lucide-react';
import { socket } from '../../services/socket';
import { clsx } from 'clsx';

interface ActionPanelProps {
  extension: Extension;
}

export const ActionPanel = ({ extension }: ActionPanelProps) => {
  const handleAction = (command: string) => {
    // Add carriage return to simulate "Enter"
    socket.emit('input', command + '\r');
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-8 flex items-center gap-4">
        <div className="p-4 rounded-2xl bg-[#00ff9f]/10 text-[#00ff9f] border border-[#00ff9f]/20">
          <extension.icon size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{extension.name}</h2>
          <p className="text-[#00ff9f]/60">{extension.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {extension.actions.map((action) => (
          <button
            key={action.label}
            onClick={() => handleAction(action.command)}
            className={clsx(
              "group relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-300",
              action.dangerous
                ? "border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10"
                : "border-[#00ff9f]/20 hover:border-[#00ff9f]/50 hover:bg-[#00ff9f]/5"
            )}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={clsx(
                "font-bold",
                action.dangerous ? "text-red-400" : "text-[#00ff9f]"
              )}>
                {action.label}
              </span>
              {action.dangerous ? (
                <AlertTriangle size={16} className="text-red-400 opacity-50 group-hover:opacity-100" />
              ) : (
                <Play size={16} className="text-[#00ff9f] opacity-50 group-hover:opacity-100" />
              )}
            </div>
            <p className="text-sm text-gray-400 mb-3">{action.description}</p>
            <div className="text-[10px] font-mono opacity-30 group-hover:opacity-60 transition-opacity">
              {action.command}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
