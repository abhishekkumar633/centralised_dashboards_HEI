import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Locate directories
let backendDir = path.join(__dirname, 'backend');
let frontendDir = path.join(__dirname, 'frontend');

if (!fs.existsSync(backendDir)) {
  backendDir = path.join(__dirname, 'SkillVault-main', 'backend');
  frontendDir = path.join(__dirname, 'SkillVault-main', 'frontend');
}

if (!fs.existsSync(backendDir) || !fs.existsSync(frontendDir)) {
  console.error('Could not locate backend or frontend directory.');
  process.exit(1);
}

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('\x1b[36m================================================\x1b[0m');
console.log('\x1b[36m   Starting SkillVault Backend and Frontend...  \x1b[0m');
console.log('\x1b[36m================================================\x1b[0m\n');

function runService(name, color, cwd) {
  const child = spawn(npmCmd, ['run', 'dev'], {
    cwd,
    shell: true,
    env: process.env,
  });

  const prefix = `\x1b[${color}m[${name}]\x1b[0m `;

  child.stdout.on('data', (data) => {
    const lines = data.toString().split(/\r?\n/);
    for (const line of lines) {
      if (line.trim()) console.log(prefix + line);
    }
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().split(/\r?\n/);
    for (const line of lines) {
      if (line.trim()) console.error(prefix + line);
    }
  });

  child.on('exit', (code) => {
    console.log(`${prefix} exited with code ${code}`);
  });

  return child;
}

const backend = runService('backend', '32', backendDir);
const frontend = runService('frontend', '35', frontendDir);

function cleanup() {
  console.log('\nShutting down SkillVault services...');
  backend.kill();
  frontend.kill();
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
