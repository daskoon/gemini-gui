import { useEffect, useState } from 'react';
import { socket } from '../services/socket';
import { Wifi, WifiOff } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-sm">
      <div className="relative flex items-center justify-center w-3 h-3">
        <span
          className={twMerge(
            "absolute w-full h-full rounded-full opacity-75 animate-ping",
            isConnected ? "bg-green-500" : "bg-red-500"
          )}
        />
        <span
          className={twMerge(
            "relative inline-flex rounded-full w-2 h-2",
            isConnected ? "bg-green-500" : "bg-red-500"
          )}
        />
      </div>
      <div className={clsx("text-xs font-mono font-medium", isConnected ? "text-green-400" : "text-red-400")}>
        {isConnected ? (
          <div className="flex items-center gap-2">
            <span>ONLINE</span>
            <Wifi size={14} />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>OFFLINE</span>
            <WifiOff size={14} />
          </div>
        )}
      </div>
    </div>
  );
};
