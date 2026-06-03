// Screenshot tool using headless Chrome
// Usage: node screenshot.mjs <url> [label]
// Saves to ./temporary screenshots/screenshot-N[-label].png

import { spawnSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SHOTS_DIR = join(__dirname, 'temporary screenshots');

if (!existsSync(SHOTS_DIR)) mkdirSync(SHOTS_DIR, { recursive: true });

const url = process.argv[2] || 'http://localhost:3015';
const label = process.argv[3] ? `-${process.argv[3]}` : '';

const existing = readdirSync(SHOTS_DIR).filter(
  (f) => f.startsWith('screenshot-') && f.endsWith('.png'),
);
const nums = existing
  .map((f) => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0'))
  .filter(Boolean);
const n = nums.length ? Math.max(...nums) + 1 : 1;

const outFile = join(SHOTS_DIR, `screenshot-${n}${label}.png`);

console.log(`Screenshotting ${url} → screenshot-${n}${label}.png`);

const result = spawnSync(
  CHROME,
  [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--window-size=1440,900',
    `--screenshot=${outFile}`,
    url,
  ],
  { timeout: 30000, stdio: 'inherit' },
);

if (result.status === 0 || existsSync(outFile)) {
  console.log(`Saved: ${outFile}`);
} else {
  console.error('Screenshot failed');
  process.exit(1);
}
