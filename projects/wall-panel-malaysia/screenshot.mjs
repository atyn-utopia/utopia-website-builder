import puppeteer from 'puppeteer'
import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

const url = process.argv[2] || 'http://localhost:3010/ms'
const name = process.argv[3] || (new URL(url).pathname.replace(/\//g, '_') || 'homepage').replace(/^_/, '') || 'homepage'

const outDir = join(process.cwd(), 'temporary screenshots')
if (!existsSync(outDir)) await mkdir(outDir, { recursive: true })

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise(r => setTimeout(r, 1500))
// Scroll to trigger lazy-loaded images
await page.evaluate(async () => {
  const delay = ms => new Promise(r => setTimeout(r, ms))
  for (let y = 0; y < document.body.scrollHeight; y += 400) {
    window.scrollTo(0, y)
    await delay(80)
  }
  window.scrollTo(0, 0)
})
await new Promise(r => setTimeout(r, 2000))
const path = join(outDir, `${name}.png`)
await page.screenshot({ path, fullPage: true })
console.log(`Saved: ${path}`)
await page.close()
await browser.close()
console.log('Done.')
