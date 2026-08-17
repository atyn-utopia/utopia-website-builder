import puppeteer from 'puppeteer'
import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

const url = process.argv[2]
const section = process.argv[3] || '#reviews'
const name = process.argv[4] || 'section'

const outDir = join(process.cwd(), 'temporary screenshots')
if (!existsSync(outDir)) await mkdir(outDir, { recursive: true })

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise(r => setTimeout(r, 1500))
await page.evaluate((sel) => {
  const el = document.querySelector(sel)
  if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' })
}, section)
await new Promise(r => setTimeout(r, 1500))
await page.screenshot({ path: join(outDir, `${name}.png`), fullPage: false })
console.log('Saved:', join(outDir, `${name}.png`))
await browser.close()
