const pty = require('node-pty');
const os = require('os');
const path = require('path');

class PTYService {
  constructor(socket) {
    this.socket = socket;
    this.ptyProcess = null;
    this.shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
    this.cwd = process.cwd(); // Track CWD
  }

  start() {
    this.ptyProcess = pty.spawn(this.shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: this.cwd,
      env: process.env
    });

    // Emit initial CWD
    this.socket.emit('cwd', this.cwd);

    this.ptyProcess.onData((data) => {
      this.socket.emit('output', data);
    });

    this.ptyProcess.onExit(({ exitCode, signal }) => {
      this.socket.emit('exit', { exitCode, signal });
    });
  }

  write(data) {
    if (this.ptyProcess) {
      this.ptyProcess.write(data);
      
      // Basic CWD tracking (Best effort)
      const trimmed = data.trim();
      if (trimmed.startsWith('cd ')) {
        const target = trimmed.substring(3).trim();
        // Handle common cases
        if (target === '..') {
            this.cwd = path.resolve(this.cwd, '..');
        } else if (target === '~') {
            this.cwd = os.homedir();
        } else if (path.isAbsolute(target)) {
            this.cwd = target;
        } else {
            this.cwd = path.resolve(this.cwd, target);
        }
        this.socket.emit('cwd', this.cwd);
      }
    }
  }

  resize(cols, rows) {
    if (this.ptyProcess) {
      this.ptyProcess.resize(cols, rows);
    }
  }

  kill() {
    if (this.ptyProcess) {
      this.ptyProcess.kill();
    }
  }
}

module.exports = PTYService;
