import puppeteer from 'puppeteer'
import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

const base = process.argv[2] ? new URL(process.argv[2]).origin : 'http://localhost:3001'
const urls = [
  { url: `${base}/en`, name: 'homepage-en' },
  { url: `${base}/ms`, name: 'homepage-ms' },
  { url: `${base}/zh`, name: 'homepage-zh' },
  { url: `${base}/en/cold-room/cheras`, name: 'location-en-cheras' },
  { url: `${base}/en/cold-room/petaling-jaya`, name: 'location-en-pj' },
  { url: `${base}/en/cold-room/johor-bahru`, name: 'location-en-jb' },
  { url: `${base}/en/blog`, name: 'blog-en' },
]

const outDir = join(process.cwd(), 'temporary screenshots')
if (!existsSync(outDir)) await mkdir(outDir, { recursive: true })

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })

for (const { url, name } of urls) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
  await new Promise(r => setTimeout(r, 1000))
  const path = join(outDir, `${name}.png`)
  await page.screenshot({ path, fullPage: true })
  console.log(`Saved: ${path}`)
  await page.close()
}

await browser.close()
console.log('Done.')
