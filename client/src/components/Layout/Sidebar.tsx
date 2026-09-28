import { 
  Terminal as TerminalIcon, 
  LayoutGrid, 
  MessageSquare, 
  Settings 
} from 'lucide-react';
import { clsx } from 'clsx';
import { socket } from '../../services/socket';

interface SidebarProps {
  currentView: 'home' | 'chat' | 'terminal';
  onViewChange: (view: 'home' | 'chat' | 'terminal') => void;
}

export const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutGrid },
    { id: 'chat', label: 'Assistant', icon: MessageSquare },
    { id: 'terminal', label: 'Terminal', icon: TerminalIcon },
  ] as const;

  const quickActions = [
    { label: 'Stop Process', command: '\x03' }, // Ctrl+C
    { label: 'Clear', command: 'clear\r' },
  ];

  return (
    <aside className="w-20 md:w-64 h-full bg-[#0d0d0d] border-r border-[#00ff9f]/20 flex flex-col shrink-0">
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-[#00ff9f]/10">
        <div className="w-8 h-8 bg-gradient-to-br from-[#00ff9f] to-[#00d0ff] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,255,159,0.3)]">
          <Settings className="text-black" size={18} />
        </div>
        <span className="hidden md:block ml-3 font-bold text-white tracking-wider">GEMINI</span>
      </div>

      {/* Navigation */}
      <div className="p-3 space-y-2 mt-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={clsx(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300",
              currentView === item.id
                ? "bg-[#00ff9f] text-black font-bold shadow-[0_0_15px_rgba(0,255,159,0.4)]"
                : "text-[#00ff9f]/50 hover:bg-[#00ff9f]/10 hover:text-[#00ff9f]"
            )}
          >
            <item.icon size={20} />
            <span className="hidden md:block">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Quick Actions (Bottom) */}
      <div className="mt-auto p-4 border-t border-[#00ff9f]/10 space-y-2">
        <p className="hidden md:block text-[10px] font-bold text-[#00ff9f]/30 uppercase tracking-widest mb-2 px-2">
          System Control
        </p>
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => socket.emit('input', action.command)}
            className="w-full text-left px-4 py-2 rounded-lg text-xs md:text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            {action.label}
          </button>
        ))}
      </div>
    </aside>
  );
};