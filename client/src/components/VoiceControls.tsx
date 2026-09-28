import { useEffect } from 'react';
import { useVoice } from '../hooks/useVoice';
import { socket } from '../services/socket';
import { Mic } from 'lucide-react';
import { clsx } from 'clsx';

export const VoiceControls = () => {
  const { isListening, transcript, startListening, stopListening, hasSupport } = useVoice();

  // Send command on silence/stop
  useEffect(() => {
    if (!isListening && transcript) {
      console.log('Sending voice command:', transcript);
      socket.emit('input', transcript + '\r'); // \r for enter
    }
  }, [isListening, transcript]);

  if (!hasSupport) {
    return <div className="text-red-500 text-xs">Voice not supported</div>;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {transcript && isListening && (
        <div className="absolute bottom-20 bg-black/80 text-[#00ff9f] px-4 py-2 rounded-lg border border-[#00ff9f]/30 backdrop-blur-md animate-fade-in">
          {transcript}
        </div>
      )}
      
      <button
        onMouseDown={startListening}
        onMouseUp={stopListening}
        // Add touch events for mobile
        onTouchStart={startListening}
        onTouchEnd={stopListening}
        className={clsx(
          "group relative flex items-center justify-center w-14 h-14 rounded-full border transition-all duration-300",
          isListening 
            ? "bg-[#00ff9f]/10 border-[#00ff9f] shadow-[0_0_20px_#00ff9f] scale-110" 
            : "bg-transparent border-[#00ff9f]/30 hover:border-[#00ff9f] hover:shadow-[0_0_15px_rgba(0,255,159,0.3)]"
        )}
      >
        {isListening ? (
          <Mic className="text-[#00ff9f] animate-pulse" size={24} />
        ) : (
          <Mic className="text-[#00ff9f] opacity-70 group-hover:opacity-100" size={24} />
        )}
      </button>
      <span className="text-[10px] text-[#00ff9f]/50 uppercase tracking-widest">
        {isListening ? "Listening..." : "Hold to Speak"}
      </span>
    </div>
  );
};
