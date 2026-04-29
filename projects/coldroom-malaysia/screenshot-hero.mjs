import puppeteer from 'puppeteer'
import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

const base = process.argv[2] ? new URL(process.argv[2]).origin : 'http://localhost:3009'
const urls = [
  { url: `${base}/en`, name: 'hero-en', viewport: { width: 1440, height: 900 } },
  { url: `${base}/en`, name: 'hero-mobile-en', viewport: { width: 390, height: 844 } },
  { url: `${base}/en/cold-room/cheras`, name: 'hero-location', viewport: { width: 1440, height: 900 } },
  { url: `${base}/ms`, name: 'hero-ms', viewport: { width: 1440, height: 900 } },
  { url: `${base}/zh`, name: 'hero-zh', viewport: { width: 1440, height: 900 } },
]

const outDir = join(process.cwd(), 'temporary screenshots')
if (!existsSync(outDir)) await mkdir(outDir, { recursive: true })

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })

for (const { url, name, viewport } of urls) {
  const page = await browser.newPage()
  await page.setViewport(viewport)
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
  await new Promise(r => setTimeout(r, 800))
  const path = join(outDir, `${name}.png`)
  await page.screenshot({ path, fullPage: false })
  console.log(`Saved: ${path}`)
  await page.close()
}

await browser.close()
console.log('Done.')
