import { readFile, access } from 'fs/promises'
import { execFile } from 'child_process'
import path from 'path'

/**
 * Extract the port from a project's package.json dev script.
 * Falls back to 3000 (Next.js default) if no --port flag is found.
 */
export async function getDevPort(projectDir: string): Promise<number> {
  try {
    const pkg = JSON.parse(await readFile(path.join(projectDir, 'package.json'), 'utf-8'))
    const devScript: string = pkg?.scripts?.dev || ''
    const match = devScript.match(/--port\s+(\d+)/)
    if (match) return parseInt(match[1], 10)
  } catch {
    // No package.json or invalid JSON
  }
  return 3000
}

/**
 * Check if a localhost URL is actually reachable.
 */
export async function isReachable(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(2000) })
    return res.ok || res.status === 307 || res.status === 308 || res.status === 302
  } catch {
    return false
  }
}

/**
 * Use lsof to find which ports have a process whose cwd matches projectDir.
 * Returns the first matching port, or null.
 */
async function findPortByProcess(projectDir: string): Promise<number | null> {
  try {
    const realProjectDir = await new Promise<string>((resolve, reject) => {
      execFile('realpath', [projectDir], (err, stdout) => {
        if (err) reject(err)
        else resolve(stdout.trim())
      })
    })

    // Find all node processes listening on TCP ports
    const lsofOutput = await new Promise<string>((resolve) => {
      execFile('lsof', ['-i', 'TCP', '-P', '-n', '-sTCP:LISTEN'], (err, stdout) => {
        resolve(stdout || '')
      })
    })

    // Extract PIDs of node processes
    const pids = new Set<string>()
    for (const line of lsofOutput.split('\n')) {
      if (line.startsWith('node')) {
        const parts = line.split(/\s+/)
        if (parts[1]) pids.add(parts[1])
      }
    }

    // Check each PID's cwd against our project dir, collect all matching ports
    const matchingPorts: number[] = []

    for (const pid of pids) {
      try {
        const cwdOutput = await new Promise<string>((resolve) => {
          execFile('lsof', ['-p', pid, '-Fn'], (err, stdout) => {
            resolve(stdout || '')
          })
        })

        if (cwdOutput.includes(realProjectDir)) {
          for (const line of lsofOutput.split('\n')) {
            const parts = line.split(/\s+/)
            if (parts[1] === pid && line.includes('LISTEN')) {
              const addrPort = parts[8] || ''
              const portMatch = addrPort.match(/:(\d+)$/)
              if (portMatch) matchingPorts.push(parseInt(portMatch[1], 10))
            }
          }
        }
      } catch { /* skip this pid */ }
    }

    if (matchingPorts.length > 0) {
      // Return the highest port — when Next.js auto-increments, the latest
      // (actual serving) port is the highest one
      matchingPorts.sort((a, b) => b - a)
      for (const port of matchingPorts) {
        if (await isReachable(`http://localhost:${port}`)) return port
      }
    }
  } catch { /* lsof not available or failed */ }

  return null
}

/**
 * Find the local URL for a project.
 * 1. Check local-url.txt (explicit override)
 * 2. Check configured port from package.json
 * 3. Use lsof to find the actual port by matching process cwd to project dir
 */
export async function findLocalUrl(projectDir: string): Promise<string | null> {
  // 1. Explicit override
  try {
    const explicit = (await readFile(path.join(projectDir, 'local-url.txt'), 'utf-8')).trim()
    if (await isReachable(explicit)) return explicit
  } catch { /* no local-url.txt */ }

  // 2. Check configured port
  let configuredPort = 3000
  try {
    await access(path.join(projectDir, 'package.json'))
    configuredPort = await getDevPort(projectDir)
  } catch {
    return null // no package.json, can't detect
  }

  const configuredUrl = `http://localhost:${configuredPort}`
  if (await isReachable(configuredUrl)) {
    // Verify this port actually belongs to this project via lsof
    const processPort = await findPortByProcess(projectDir)
    if (processPort === configuredPort) return configuredUrl
    // If lsof says a different port, use that instead
    if (processPort) return `http://localhost:${processPort}`
    // If lsof can't determine, trust the configured port
    return configuredUrl
  }

  // 3. Configured port not reachable — find actual port via process detection
  const processPort = await findPortByProcess(projectDir)
  if (processPort) return `http://localhost:${processPort}`

  return null
}
