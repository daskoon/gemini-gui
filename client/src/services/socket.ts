import { io, Socket } from 'socket.io-client';

// Create a singleton socket instance
// We assume the server is running on localhost:3001 (based on Phase 2 .env)
const SOCKET_URL = 'http://localhost:3001';

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false, // We'll connect explicitly in App.tsx
  transports: ['websocket'],
});
