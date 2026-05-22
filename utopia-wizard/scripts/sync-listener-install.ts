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
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${nodeBin}</string>
    <string>${path.join(repoCwd, 'node_modules', '.bin', 'tsx')}</string>
    <string>${scriptPath}</string>
  </array>
  <key>WorkingDirectory</key>
  <string>${repoCwd}</string>
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
  const scriptPath = path.join(repoCwd, 'scripts', 'sync-listener.ts')
  if (!existsSync(scriptPath)) {
    throw new Error(`sync-listener.ts not found at ${scriptPath}`)
  }
  const tsxBin = path.join(repoCwd, 'node_modules', '.bin', 'tsx')
  if (!existsSync(tsxBin)) {
    throw new Error(`tsx not found at ${tsxBin} — run \`npm install\` first.`)
  }
  const nodeBin = await whichNode()
  const plist = plistXml(nodeBin, repoCwd, scriptPath)

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
