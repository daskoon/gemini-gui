import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { socket } from '../services/socket';

const CYBERPUNK_THEME = {
  background: '#050505', // Very dark grey/black
  foreground: '#00ff9f', // Neon Green
  cursor: '#ff003c',     // Neon Red
  cursorAccent: '#000000',
  selectionBackground: 'rgba(252, 238, 10, 0.3)', // Neon Yellow with opacity
  black: '#000000',
  red: '#ff003c',
  green: '#00ff9f',
  yellow: '#fcee0a',
  blue: '#00e1ff', // Neon Blue
  magenta: '#ff00ff', // Neon Magenta
  cyan: '#00d0ff',
  white: '#ffffff',
  brightBlack: '#808080',
  brightRed: '#ff4d6d',
  brightGreen: '#66ffc2',
  brightYellow: '#ffff80',
  brightBlue: '#80f0ff',
  brightMagenta: '#ff80ff',
  brightCyan: '#80e8ff',
  brightWhite: '#ffffff',
};

interface TerminalProps {
  className?: string;
}

export const Terminal = ({ className }: TerminalProps) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize Terminal
    const term = new XTerm({
      cursorBlink: true,
      fontFamily: '"Fira Code", monospace',
      fontSize: 14,
      theme: CYBERPUNK_THEME,
      allowProposedApi: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Handle Resize
    const handleResize = () => {
      fitAddon.fit();
      if (xtermRef.current) {
        socket.emit('resize', {
          cols: xtermRef.current.cols,
          rows: xtermRef.current.rows
        });
      }
    };
    window.addEventListener('resize', handleResize);

    // Socket Integration
    // Incoming data from PTY -> Terminal
    const handleOutput = (data: string) => {
      term.write(data);
    };

    socket.on('output', handleOutput);

    // Terminal Input -> PTY
    term.onData((data) => {
      socket.emit('input', data);
    });

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      socket.off('output', handleOutput);
      term.dispose();
    };
  }, []);

  return (
    <div 
      className={`w-full h-full p-4 bg-black/90 rounded-lg border border-[#00ff9f]/20 shadow-[0_0_15px_rgba(0,255,159,0.1)] overflow-hidden ${className || ''}`}
    >
      <div 
        ref={terminalRef} 
        className="w-full h-full"
      />
    </div>
  );
};