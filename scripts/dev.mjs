import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';

let port = '3000';
try {
  const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
  const match = envContent.match(/^PORT=(\d+)/m);
  if (match) {
    port = match[1];
  }
} catch (err) {
  // Ignore if .env doesn't exist
}

console.log(`\n\x1b[32m\x1b[1m[System_Ctrl] Booting dashboard telemetry on port ${port}...\x1b[0m\n`);

spawn('npx', ['next', 'dev', '-p', port], { stdio: 'inherit', shell: true });
