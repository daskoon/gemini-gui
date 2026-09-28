import { useEffect, useState, useRef } from 'react';
import { socket } from './services/socket';
import { Terminal } from './components/Terminal';
import { ConnectionStatus } from './components/ConnectionStatus';
import { VoiceControls } from './components/VoiceControls';
import { Sidebar } from './components/Layout/Sidebar';
import { SystemMonitor } from './components/SystemMonitor';
import { ToolCard } from './components/ToolCard';
import { ChatInterface } from './components/Chat/ChatInterface';
import { ExtensionGrid } from './components/Dashboard/ExtensionGrid';
import { ActionPanel } from './components/Dashboard/ActionPanel';
import { useVoice } from './hooks/useVoice';
import { Volume2, VolumeX, ArrowLeft, Mic, Activity } from 'lucide-react';
import { stripAnsi } from './utils/text';
import type { Extension } from './config/extensions';

type ViewState = 'home' | 'chat' | 'terminal';

interface ToolCall {
  id: string;
  name: string;
  args: any;
  status: 'pending' | 'approved' | 'denied' | 'executing' | 'completed';
}

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedExtension, setSelectedExtension] = useState<Extension | null>(null);
  const [autoRead, setAutoRead] = useState(false);
  const [cwd, setCwd] = useState('');
  const [projectInfo, setProjectInfo] = useState({ name: 'Loading...', version: '', branch: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingTools, setPendingTools] = useState<ToolCall[]>([]);
  const [isListening, setIsListening] = useState(false);
  const activityTimeoutRef = useRef<any>(null);
  
  const { speak } = useVoice();

  // Activity Tracker
  const updateActivity = () => {
    setIsProcessing(true);
    if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    activityTimeoutRef.current = setTimeout(() => {
      setIsProcessing(false);
    }, 1000); // 1s idle threshold
  };

  useEffect(() => {
    socket.connect();

    const handleOutput = (data: string) => {
      updateActivity();
      if (autoRead) {
        const cleanText = stripAnsi(data);
        if (cleanText.trim()) {
          speak(cleanText);
        }
      }
    };

    const handleCwd = (path: string) => {
      setCwd(path);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleProjectInfo = (info: any) => {
      setProjectInfo(info);
    };

    const handlePendingApproval = (tool: ToolCall) => {
      setPendingTools(prev => [...prev, tool]);
    };

    const handleToolExecuted = ({ id }: { id: string }) => {
      setPendingTools(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t));
      setTimeout(() => {
        setPendingTools(prev => prev.filter(t => t.id !== id));
      }, 3000);
    };

    socket.on('output', handleOutput);
    socket.on('cwd', handleCwd);
    socket.on('project-info', handleProjectInfo);
    socket.on('PENDING_APPROVAL', handlePendingApproval);
    socket.on('TOOL_EXECUTED', handleToolExecuted);

    return () => {
      socket.off('output', handleOutput);
      socket.off('cwd', handleCwd);
      socket.off('project-info', handleProjectInfo);
      socket.off('PENDING_APPROVAL', handlePendingApproval);
      socket.off('TOOL_EXECUTED', handleToolExecuted);
      socket.disconnect();
    };
  }, [autoRead, speak]);

  const handleApproveTool = (id: string) => {
    socket.emit('CONFIRMED', id);
    setPendingTools(prev => prev.map(t => t.id === id ? { ...t, status: 'approved' } : t));
  };

  const handleDenyTool = (id: string) => {
    socket.emit('DENIED', id);
    setPendingTools(prev => prev.filter(t => t.id !== id));
  };

  const handleExtensionSelect = (ext: Extension) => {
    setSelectedExtension(ext);
  };

  const handleBackToDashboard = () => {
    setSelectedExtension(null);
  };

  return (
    <div className="flex h-screen w-screen bg-[#050505] text-[#00ff9f] font-mono overflow-hidden selection:bg-[#00ff9f] selection:text-black">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={(view) => {
          setCurrentView(view);
          setSelectedExtension(null); // Reset selection when changing main tabs
        }}
      />

      {/* Main Layout */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#050505] relative border-x border-white/5">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-[#00ff9f]/10 bg-[#0d0d0d]/50 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
             {selectedExtension && currentView === 'home' && (
               <button 
                 onClick={handleBackToDashboard}
                 className="p-2 hover:bg-[#00ff9f]/10 rounded-full transition-colors"
               >
                 <ArrowLeft size={20} />
               </button>
             )}
             <h2 className="text-lg font-bold text-white opacity-80 uppercase tracking-tighter">
               {currentView === 'home' && (selectedExtension ? selectedExtension.name : 'System Dashboard')}
               {currentView === 'chat' && 'AI Core Interface'}
               {currentView === 'terminal' && 'Kernel Terminal'}
             </h2>
             {isProcessing && (
                <span className="ml-4 animate-pulse px-2 py-0.5 rounded bg-[#00ff9f]/10 text-[#00ff9f] text-[10px] font-bold border border-[#00ff9f]/30 tracking-wider">
                  SYNCING
                </span>
             )}
          </div>
          
          <div className="flex items-center gap-4">
             <button 
              onClick={() => setAutoRead(!autoRead)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${autoRead ? 'border-[#00ff9f] bg-[#00ff9f]/10 text-[#00ff9f]' : 'border-[#00ff9f]/30 text-[#00ff9f]/50'}`}
              title="Toggle Neural Feedback"
            >
              {autoRead ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <ConnectionStatus />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 relative overflow-hidden">
          
          {/* Dashboard View */}
          <div className={`absolute inset-0 transition-opacity duration-300 overflow-y-auto custom-scrollbar ${currentView === 'home' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
             <div className="p-6 space-y-8">
               {/* Pending Tool Calls Section */}
               {pendingTools.length > 0 && (
                 <section className="space-y-4">
                   <div className="flex items-center gap-2">
                     <Activity size={18} className="text-[#00ff9f]" />
                     <h3 className="text-xs font-bold uppercase tracking-widest text-[#00ff9f]">Awaiting Neutral Authorization</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {pendingTools.map(tool => (
                       <ToolCard 
                         key={tool.id} 
                         {...tool} 
                         onApprove={handleApproveTool} 
                         onDeny={handleDenyTool} 
                       />
                     ))}
                   </div>
                 </section>
               )}

               {selectedExtension ? (
                 <ActionPanel extension={selectedExtension} />
               ) : (
                 <ExtensionGrid onSelect={handleExtensionSelect} projectInfo={projectInfo} />
               )}
             </div>
          </div>

          {/* Chat View */}
          <div className={`absolute inset-0 transition-opacity duration-300 ${currentView === 'chat' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
             <ChatInterface />
          </div>

          {/* Terminal View (Always mounted for persistence, just hidden) */}
          <div className={`absolute inset-0 z-0 ${currentView === 'terminal' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}>
             <Terminal />
          </div>

        </main>
        
        {/* Footer */}
        <footer className="h-14 border-t border-[#00ff9f]/10 bg-[#0d0d0d] flex items-center justify-center relative shrink-0">
           <div className="absolute left-6 text-[10px] text-gray-600 hidden md:flex items-center gap-2">
              <span className="text-[#00ff9f]/40">CORE_CWD:</span>
              <span className="text-[#00ff9f]/60 font-mono italic">{cwd || 'UNSET'}</span>
           </div>
           
           <VoiceControls />
        </footer>

        {/* Floating Mic Button */}
        <div className="absolute bottom-20 right-8 z-50 flex flex-col items-center gap-4">
          {isListening && (
            <div className="flex items-end gap-1 h-8 mb-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div 
                  key={i}
                  className="w-1 bg-[#00ff9f] animate-pulse" 
                  style={{ 
                    height: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.5s'
                  }}
                />
              ))}
            </div>
          )}
          <button 
            onClick={() => setIsListening(!isListening)}
            className={`
              w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500
              ${isListening 
                ? 'bg-[#00ff9f] text-black shadow-[0_0_30px_#00ff9f]' 
                : 'bg-[#1a1a1a] text-[#00ff9f] border-2 border-[#00ff9f]/30 hover:border-[#00ff9f]'}
            `}
          >
            <Mic size={28} className={isListening ? 'animate-bounce' : ''} />
          </button>
        </div>
      </div>

      {/* Right Sidebar - System Monitor */}
      <SystemMonitor />
    </div>
  );
}

export default App;