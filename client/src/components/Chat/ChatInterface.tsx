import { useEffect, useRef, useState } from 'react';
import { socket } from '../../services/socket';
import { stripAnsi } from '../../utils/text';
import { Send, Bot, User, AlertCircle, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { parseOutput } from '../../utils/parser';
import { ProgressBar } from './ProgressBar';

interface Message {
  id: string;
  role: 'system' | 'user';
  content: string;
  timestamp: Date;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const bufferRef = useRef<string>('');
  const timeoutRef = useRef<any>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle incoming data
  useEffect(() => {
    const handleOutput = (data: string) => {
      const cleanData = stripAnsi(data);
      if (!cleanData.trim()) return;

      bufferRef.current += cleanData;
      setIsTyping(true);

      // Debounce the buffer commit
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        const text = bufferRef.current;
        if (text.trim()) {
          setMessages(prev => {
            const lastMsg = prev[prev.length - 1];
            // If the last message was less than 2 seconds ago and is system, append to it
            // This prevents fragmentation
            if (lastMsg && lastMsg.role === 'system' && (Date.now() - lastMsg.timestamp.getTime() < 2000)) {
               return [
                 ...prev.slice(0, -1),
                 { ...lastMsg, content: lastMsg.content + text }
               ];
            }
            return [
              ...prev,
              {
                id: Date.now().toString(),
                role: 'system',
                content: text,
                timestamp: new Date()
              }
            ];
          });
        }
        bufferRef.current = '';
        setIsTyping(false);
      }, 100); // 100ms buffer window
    };

    socket.on('output', handleOutput);
    return () => {
      socket.off('output', handleOutput);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    // Add user message immediately
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }]);

    socket.emit('input', input + '\r');
    setInput('');
  };

  const renderContent = (content: string) => {
    const tokens = parseOutput(content);
    return (
      <div className="flex flex-col gap-1">
        {tokens.map((token, idx) => {
          if (token.type === 'progress') {
            return <ProgressBar key={idx} percent={token.metadata.percent} label={token.content.split('[')[0]} />;
          }
          if (token.type === 'error') {
            return (
              <div key={idx} className="flex items-start gap-2 text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20 my-1">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <span className="font-mono text-xs whitespace-pre-wrap break-all">{token.content}</span>
              </div>
            );
          }
          if (token.type === 'success') {
            return (
              <div key={idx} className="flex items-center gap-2 text-green-400 my-1">
                <CheckCircle size={14} />
                <span className="font-mono text-xs">{token.content}</span>
              </div>
            );
          }
          // Default Text
          return (
             <pre key={idx} className="font-mono whitespace-pre-wrap bg-transparent p-0 m-0 text-xs md:text-sm text-[#00ff9f]/90 break-all">
               {token.content}
             </pre>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] relative overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#00ff9f]/20 scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-[#00ff9f]/30">
            <Bot size={48} className="mb-4" />
            <p>System Ready. Waiting for command...</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={clsx(
              "flex gap-3 max-w-4xl",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.role === 'user' ? "bg-[#00ff9f] text-black" : "bg-[#00ff9f]/10 text-[#00ff9f]"
            )}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={clsx(
              "px-4 py-3 rounded-2xl max-w-[80%]",
              msg.role === 'user' 
                ? "bg-[#00ff9f]/10 text-[#00ff9f] rounded-tr-none" 
                : "bg-[#1a1a1a] text-gray-300 rounded-tl-none border border-[#00ff9f]/10"
            )}>
              <div className="prose prose-invert prose-p:my-1 prose-pre:bg-black/50 prose-pre:p-2 prose-pre:rounded-lg text-sm break-words">
                {msg.role === 'system' ? (
                   renderContent(msg.content)
                ) : (
                   <p>{msg.content}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-[#00ff9f]/10 flex items-center justify-center animate-pulse">
               <Bot size={16} className="text-[#00ff9f]" />
             </div>
             <div className="bg-[#1a1a1a] px-4 py-3 rounded-2xl rounded-tl-none border border-[#00ff9f]/10 flex items-center gap-1">
               <div className="w-1.5 h-1.5 bg-[#00ff9f] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
               <div className="w-1.5 h-1.5 bg-[#00ff9f] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
               <div className="w-1.5 h-1.5 bg-[#00ff9f] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#0d0d0d] border-t border-[#00ff9f]/10">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command..."
            className="flex-1 bg-[#050505] border border-[#00ff9f]/20 rounded-lg px-4 py-3 text-[#00ff9f] placeholder-[#00ff9f]/30 focus:outline-none focus:border-[#00ff9f] transition-colors font-mono"
          />
          <button
            type="submit"
            className="bg-[#00ff9f] text-black px-4 py-3 rounded-lg hover:bg-[#00ff9f]/90 transition-colors font-bold flex items-center gap-2"
          >
            <Send size={18} />
            <span className="hidden md:inline">SEND</span>
          </button>
        </form>
      </div>
    </div>
  );
};
