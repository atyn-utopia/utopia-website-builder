import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'

const cwd = path.dirname(fileURLToPath(import.meta.url))
const requestedUrl = process.argv[2] || 'http://localhost:3024'
const url = requestedUrl.replace('http://localhost:', 'http://127.0.0.1:')
const outDir = path.join(cwd, 'temporary screenshots')

await fs.mkdir(outDir, { recursive: true })

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

const base = url.replace(/\/$/, '')
const runs = [
  { name: 'desktop-home-ms', width: 1440, height: 1100, url: `${base}/ms` },
  { name: 'mobile-home-ms', width: 390, height: 1200, url: `${base}/ms` },
  { name: 'desktop-home-en', width: 1440, height: 1100, url: `${base}/en` },
  {
    name: 'desktop-location-shah-alam',
    width: 1440,
    height: 1100,
    url: `${base}/ms/pakej-katering/shah-alam`,
  },
]

for (const run of runs) {
  const page = await browser.newPage()
  await page.setViewport({ width: run.width, height: run.height, deviceScaleFactor: 1 })
  try {
    await page.goto(run.url, { waitUntil: 'networkidle2', timeout: 90000 })
    await page.screenshot({
      path: path.join(outDir, `${run.name}.png`),
      fullPage: true,
    })
    console.log(`[screenshot] ${run.name} ✓`)
  } catch (err) {
    console.error(`[screenshot] ${run.name} failed:`, err.message)
  }
  await page.close()
}

await browser.close()
console.log(`Saved screenshots to ${outDir}`)
