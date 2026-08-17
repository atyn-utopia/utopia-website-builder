import puppeteer from 'puppeteer'
import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

const url = process.argv[2] || 'http://localhost:3011/en'
const name = process.argv[3] || 'top'
const h = parseInt(process.argv[4] || '900', 10)

const outDir = join(process.cwd(), 'temporary screenshots')
if (!existsSync(outDir)) await mkdir(outDir, { recursive: true })

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: h })
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise(r => setTimeout(r, 2000))
await page.screenshot({ path: join(outDir, `${name}.png`), fullPage: false })
console.log('Saved:', join(outDir, `${name}.png`))
await browser.close()
