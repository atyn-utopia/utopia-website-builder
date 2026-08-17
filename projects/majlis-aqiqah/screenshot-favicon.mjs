import puppeteer from 'puppeteer'
import { join } from 'path'

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 600, height: 600 })
await page.goto('http://localhost:3012/icon.svg', { waitUntil: 'networkidle0' })
await page.screenshot({
  path: join(process.cwd(), 'temporary screenshots/favicon-preview.png'),
  fullPage: false,
})
await browser.close()
console.log('Saved favicon preview')
