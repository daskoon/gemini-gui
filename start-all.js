const { spawn } = require('child_process');
const path = require('path');

const serverPath = path.join(__dirname, 'server');
const clientPath = path.join(__dirname, 'client');

console.log('🚀 Starting Gemini Station...');

// Start Server
console.log('Starting Backend Server...');
const server = spawn('npm', ['start'], { // Using npm start to handle nodemon if configured or just node
  cwd: serverPath,
  stdio: 'inherit',
  shell: true
});

// Start Client
console.log('Starting Frontend Client...');
const client = spawn('npm', ['run', 'dev'], {
  cwd: clientPath,
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  server.kill();
  client.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

server.on('close', (code) => console.log(`Server exited with code ${code}`));
client.on('close', (code) => console.log(`Client exited with code ${code}`));
