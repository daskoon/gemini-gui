require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const PTYService = require('./services/PTYService');
const ProjectService = require('./services/ProjectService');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store pending tool calls
const pendingTools = new Map();

io.on('connection', async (socket) => {
  console.log('Client connected:', socket.id);
  const pty = new PTYService(socket);
  pty.start();

  // Send Project Info
  const projectService = new ProjectService();
  const info = await projectService.getInfo();
  socket.emit('project-info', info);

  // Mock function call detection for demonstration
  // In a real scenario, this would be parsed from PTY output or a direct API
  const detectFunctionCall = (data) => {
    // This is a placeholder for the logic that detects a tool call in the stream
    // For now, we'll simulate one if the user types a specific "trigger"
    if (data.includes('CALL_TOOL:')) {
      const toolName = data.split('CALL_TOOL:')[1].trim();
      const toolId = Math.random().toString(36).substring(7);
      
      const toolCall = {
        id: toolId,
        name: toolName,
        args: { path: './test.txt', content: 'Hello World' }, // Mock args
        status: 'pending'
      };
      
      pendingTools.set(toolId, { socket, toolCall });
      socket.emit('PENDING_APPROVAL', toolCall);
      return true; // Indicate we intercepted it
    }
    return false;
  };

  socket.on('input', (data) => {
    // If we detect a mock tool call, don't send to PTY yet
    if (!detectFunctionCall(data)) {
      pty.write(data);
    }
  });

  socket.on('CONFIRMED', (toolId) => {
    const pending = pendingTools.get(toolId);
    if (pending) {
      console.log(`Tool ${toolId} confirmed`);
      pending.toolCall.status = 'approved';
      // In a real app, you'd resume the process here
      // For mock, we just tell the PTY to "continue" or simulate the effect
      socket.emit('TOOL_EXECUTED', { id: toolId, result: 'Success' });
      pendingTools.delete(toolId);
    }
  });

  socket.on('DENIED', (toolId) => {
    const pending = pendingTools.get(toolId);
    if (pending) {
      console.log(`Tool ${toolId} denied`);
      socket.emit('TOOL_DENIED', { id: toolId });
      pendingTools.delete(toolId);
    }
  });

  socket.on('resize', (data) => {
    if (data && data.cols && data.rows) {
      pty.resize(data.cols, data.rows);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    pty.kill();
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
