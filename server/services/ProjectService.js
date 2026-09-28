const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class ProjectService {
  constructor() {
    this.cwd = process.cwd();
  }

  async getInfo() {
    const info = {
      name: 'Unknown',
      version: '0.0.0',
      branch: 'unknown'
    };

    try {
      const packageJsonPath = path.join(this.cwd, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        info.name = pkg.name || 'Unknown';
        info.version = pkg.version || '0.0.0';
      }
    } catch (e) {
      console.error('Failed to read package.json', e);
    }

    try {
      info.branch = await new Promise((resolve) => {
        exec('git branch --show-current', { cwd: this.cwd }, (err, stdout) => {
          if (err) resolve('no-git');
          else resolve(stdout.trim());
        });
      });
    } catch (e) {
      console.error('Failed to get git info', e);
    }

    return info;
  }
}

module.exports = ProjectService;
