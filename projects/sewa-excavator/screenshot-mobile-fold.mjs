import puppeteer from 'puppeteer'
import { join } from 'path'

const url = process.argv[2] || 'http://localhost:3012/en'
const name = process.argv[3] || 'mobile-fold'
const outDir = join(process.cwd(), 'temporary screenshots')

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 })
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise(r => setTimeout(r, 2000))
await page.screenshot({ path: join(outDir, `${name}.png`), fullPage: false })
console.log('Saved:', join(outDir, `${name}.png`))
await browser.close()
