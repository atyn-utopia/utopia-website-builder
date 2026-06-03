// Dev-server helper — just spawns `npm run dev` (next dev on port 3015).
import { spawn } from 'child_process';

const child = spawn('npm', ['run', 'dev'], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
