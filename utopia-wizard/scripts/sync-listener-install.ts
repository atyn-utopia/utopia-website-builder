#!/usr/bin/env -S npx tsx
/**
 * Install/uninstall the sync-listener as a launchd LaunchAgent so it
 * survives reboots and restarts when it crashes.
 *
 *   npm run sync-listener:install
 *   npm run sync-listener:uninstall
 *
 * The plist is written to ~/Library/LaunchAgents/com.utopia-wizard.sync-listener.plist
 * and logs go to /tmp/utopia-wizard-sync.{out,err}.log.
 */

import { execFile } from 'child_process'
import { promisify } from 'util'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import os from 'os'

const exec = promisify(execFile)

const LABEL = 'com.utopia-wizard.sync-listener'
const HOME = os.homedir()
const PLIST_PATH = path.join(HOME, 'Library', 'LaunchAgents', `${LABEL}.plist`)
const LOG_OUT = '/tmp/utopia-wizard-sync.out.log'
const LOG_ERR = '/tmp/utopia-wizard-sync.err.log'

function repoRoot(): string {
  return path.resolve(process.cwd(), '..')
}

async function whichNode(): Promise<string> {
  // Resolve the absolute path to the Node binary so launchd doesn't depend on $PATH.
  const { stdout } = await exec('which', ['node'])
  return stdout.trim()
}

function plistXml(nodeBin: string, repoCwd: string, scriptPath: string): string {
  // ProgramArguments uses absolute paths only. KeepAlive restarts on crash.
  // RunAtLoad makes it start immediately on `launchctl load`.
  // scriptPath here is the COMPILED .mjs — running plain JS avoids the
  // hang we hit when launchd-spawned Node tried to use either tsx or
  // --experimental-strip-types for the TS source. The compile step in
  // install() builds the .mjs from the .ts source via esbuild before
  // writing the plist.
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${nodeBin}</string>
    <string>${scriptPath}</string>
  </array>
  <key>WorkingDirectory</key>
  <string>${repoCwd}</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin</string>
  </dict>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>${LOG_OUT}</string>
  <key>StandardErrorPath</key>
  <string>${LOG_ERR}</string>
  <key>ThrottleInterval</key>
  <integer>10</integer>
</dict>
</plist>
`
}

async function install(): Promise<void> {
  const repoCwd = process.cwd()
  const tsSource = path.join(repoCwd, 'scripts', 'sync-listener.ts')
  const compiledScript = path.join(repoCwd, 'scripts', 'sync-listener.compiled.mjs')
  if (!existsSync(tsSource)) {
    throw new Error(`sync-listener.ts not found at ${tsSource}`)
  }
  const esbuild = path.join(repoCwd, 'node_modules', '.bin', 'esbuild')
  if (!existsSync(esbuild)) {
    throw new Error(`esbuild not found at ${esbuild} — run \`npm install\` first.`)
  }
  // Compile the TS source to ESM JS so launchd can run plain Node without
  // tsx or --experimental-strip-types (both hang under launchd for reasons
  // we couldn't pin down — see plistXml comment).
  console.log(`Compiling ${tsSource} → ${path.basename(compiledScript)}…`)
  await exec(esbuild, [
    tsSource,
    '--bundle',
    '--platform=node',
    '--format=esm',
    '--packages=external',
    `--outfile=${compiledScript}`,
  ])
  const nodeBin = await whichNode()
  const plist = plistXml(nodeBin, repoCwd, compiledScript)

  await mkdir(path.dirname(PLIST_PATH), { recursive: true })
  await writeFile(PLIST_PATH, plist, 'utf-8')
  console.log(`✓ Wrote launchd plist → ${PLIST_PATH}`)

  // Unload first in case an older version is loaded.
  await exec('launchctl', ['unload', '-w', PLIST_PATH]).catch(() => {})
  await exec('launchctl', ['load', '-w', PLIST_PATH])
  console.log(`✓ Loaded ${LABEL} into launchd`)
  console.log(`  stdout → ${LOG_OUT}`)
  console.log(`  stderr → ${LOG_ERR}`)
  console.log(`  uninstall: npm run sync-listener:uninstall`)

  // Quick health check — confirm it's running.
  await new Promise((r) => setTimeout(r, 1500))
  try {
    const { stdout } = await exec('launchctl', ['list', LABEL])
    console.log('\nlaunchctl reports:')
    console.log(stdout)
  } catch {
    console.warn('  (launchctl list found nothing yet — check logs in a few seconds)')
  }

  // Verify the daemon actually does work — wait up to 15s for the first
  // pushStatus() to land in /tmp/utopia-wizard-sync.out.log. If it doesn't,
  // macOS TCC has almost certainly silently blocked Node from reading the
  // repo (which sits under ~/Documents). Print actionable instructions.
  console.log('\nWaiting up to 15s for the first heartbeat…')
  const deadline = Date.now() + 15_000
  let firstByte = false
  while (Date.now() < deadline) {
    try {
      const stat = await import('fs').then((m) => m.statSync(LOG_OUT))
      if (stat.size > 0) { firstByte = true; break }
    } catch { /* file might not exist yet */ }
    await new Promise((r) => setTimeout(r, 1000))
  }

  if (firstByte) {
    console.log('✓ Daemon is alive — heartbeat detected in', LOG_OUT)
  } else {
    console.warn(`
⚠ Daemon launched but produced no output in 15s.

This almost certainly means macOS blocked Node from reading the repo
(TCC silently denies background daemons access to ~/Documents,
~/Desktop, ~/Downloads, etc.).

Fix: grant Full Disk Access to Node, then re-run install:

  1. Open System Settings → Privacy & Security → Full Disk Access
  2. Click + and add /usr/local/bin/node
  3. Toggle it ON
  4. Re-run: npm run sync-listener:install

Alternative: run the daemon manually in a terminal whenever you need it:
  cd utopia-wizard && npm run sync-listener

Logs: ${LOG_OUT}, ${LOG_ERR}
`)
  }
}

async function uninstall(): Promise<void> {
  if (!existsSync(PLIST_PATH)) {
    console.log('Nothing to uninstall — plist not present.')
    return
  }
  await exec('launchctl', ['unload', '-w', PLIST_PATH]).catch(() => {})
  await unlink(PLIST_PATH)
  console.log(`✓ Unloaded ${LABEL} and removed ${PLIST_PATH}`)
}

const cmd = process.argv[2]
if (cmd === 'install') {
  install().catch((err) => { console.error(err.message); process.exit(1) })
} else if (cmd === 'uninstall') {
  uninstall().catch((err) => { console.error(err.message); process.exit(1) })
} else {
  console.error('Usage: tsx scripts/sync-listener-install.ts [install|uninstall]')
  process.exit(1)
}

// Silence "repoRoot unused" lint — kept for symmetry with sync-listener.ts.
void repoRoot
