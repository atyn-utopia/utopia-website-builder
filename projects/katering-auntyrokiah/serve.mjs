import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const cwd = dirname(fileURLToPath(import.meta.url))

const child = spawn('npm', ['run', 'dev'], {
  cwd,
  stdio: 'inherit',
  env: { ...process.env },
})

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  process.exit(code ?? 0)
})
