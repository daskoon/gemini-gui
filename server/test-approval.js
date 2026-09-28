const { io } = require('socket.io-client');

const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('Connected to server');
  
  // Trigger a tool call
  console.log('Simulating tool call trigger...');
  socket.emit('input', 'CALL_TOOL: write_file');
});

socket.on('PENDING_APPROVAL', (tool) => {
  console.log('SUCCESS: Received PENDING_APPROVAL event');
  console.log('Tool:', JSON.stringify(tool, null, 2));
  
  // Approve the tool
  console.log('Approving tool...');
  socket.emit('CONFIRMED', tool.id);
});

socket.on('TOOL_EXECUTED', (data) => {
  console.log('SUCCESS: Received TOOL_EXECUTED event');
  console.log('Data:', data);
  process.exit(0);
});

socket.on('connect_error', (err) => {
  console.error('Connection error:', err.message);
  process.exit(1);
});

// Timeout after 5 seconds
setTimeout(() => {
  console.error('FAILED: Test timed out');
  process.exit(1);
}, 5000);
