import React from 'react';
import { Cpu, FileText, ChevronRight, Circle } from 'lucide-react';
import { socket } from '../services/socket';

interface MCPServer {
  name: string;
  status: 'online' | 'offline';
}

interface ProjectFile {
  name: string;
  path: string;
}

export const SystemMonitor: React.FC = () => {
  const handleContextClick = (file: ProjectFile) => {
    console.log(`Injecting context from ${file.name}`);
    socket.emit('input', `inject_context ${file.path}\r`);
  };

  const mcpServers: MCPServer[] = [
    { name: 'google-search', status: 'online' },
    { name: 'github-api', status: 'online' },
    { name: 'cloud-run', status: 'online' },
    { name: 'firebase', status: 'online' },
    { name: 'performance', status: 'online' },
    { name: 'screenshare', status: 'offline' },
    { name: 'vision', status: 'online' },
    { name: 'dev-flow', status: 'online' },
    { name: 'design-lab', status: 'online' },
    { name: 'email-notifier', status: 'online' },
    { name: 'open-aware', status: 'online' },
  ];

  const projectFiles: ProjectFile[] = [
    { name: 'GEMINI.md (Root)', path: 'GEMINI.md' },
    { name: 'blueprint.md', path: 'extensions/blueprint/blueprint.md' },
    { name: 'cloud-run.md', path: 'extensions/cloud-run/GEMINI.md' },
    { name: 'design-lab.md', path: 'extensions/design-lab/GEMINI.md' },
    { name: 'dev-flow.md', path: 'extensions/dev-flow/GEMINI.md' },
    { name: 'email-notifier.md', path: 'extensions/email-notifier/GEMINI.md' },
    { name: 'extension-browser.md', path: 'extensions/extension-browser/GEMINI.md' },
    { name: 'firebase.md', path: 'extensions/firebase/FIREBASE.md' },
    { name: 'ralph-loop.md', path: 'extensions/gemini-cli-ralph/GEMINI.md' },
    { name: 'gemini-kit.md', path: 'extensions/gemini-kit/GEMINI.md' },
    { name: 'open-aware.md', path: 'extensions/open-aware/GEMINI.md' },
    { name: 'performance.md', path: 'extensions/performance/GEMINI.md' },
    { name: 'screenshare.md', path: 'extensions/screenshare/GEMINI.md' },
    { name: 'vision.md', path: 'extensions/vision.disabled/GEMINI.md' },
  ];

  return (
    <aside className="w-64 h-full bg-[#0d0d0d] border-l border-[#00ff9f]/20 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
      {/* MCP Status */}
      <div className="p-4 border-b border-[#00ff9f]/10">
        <div className="flex items-center gap-2 mb-4">
          <Cpu size={16} className="text-[#00ff9f]" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/70">MCP Servers</h3>
          <span className="ml-auto text-[10px] bg-[#00ff9f]/20 text-[#00ff9f] px-1.5 py-0.5 rounded">
            {mcpServers.filter(s => s.status === 'online').length}/{mcpServers.length}
          </span>
        </div>
        <div className="space-y-2">
          {mcpServers.map((server) => (
            <div key={server.name} className="flex items-center justify-between group cursor-default">
              <span className="text-[11px] text-white/50 group-hover:text-white/80 transition-colors font-mono">
                {server.name}
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] uppercase font-bold ${server.status === 'online' ? 'text-[#00ff9f]' : 'text-red-500'}`}>
                  {server.status}
                </span>
                <Circle 
                  size={6} 
                  fill={server.status === 'online' ? '#00ff9f' : '#ef4444'} 
                  className={server.status === 'online' ? 'animate-pulse text-[#00ff9f]' : 'text-red-500'} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Context */}
      <div className="p-4 flex-1">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={16} className="text-[#00d0ff]" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/70">Project Context</h3>
        </div>
        <div className="space-y-1">
          {projectFiles.map((file) => (
            <button
              key={file.name}
              onClick={() => handleContextClick(file)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5 group transition-all duration-300 text-left border border-transparent hover:border-[#00d0ff]/20"
            >
              <ChevronRight size={10} className="text-white/20 group-hover:text-[#00d0ff] transition-colors" />
              <span className="text-[11px] text-white/40 group-hover:text-white/80 transition-colors truncate font-mono">
                {file.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-black/40 border-t border-white/5">
        <div className="text-[10px] text-white/20 uppercase font-bold tracking-tighter">
          System Core: v4.4.0-alpha
        </div>
        <div className="text-[9px] text-white/10 font-mono mt-1">
          BDP-0923-CYBER-CORE
        </div>
      </div>
    </aside>
  );
};
