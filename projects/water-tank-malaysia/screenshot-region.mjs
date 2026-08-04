import puppeteer from 'puppeteer'
import { join } from 'path'

const url = process.argv[2] || 'http://localhost:3012/en'
const name = process.argv[3] || 'region'
const fromY = parseInt(process.argv[4] || '0', 10)
const height = parseInt(process.argv[5] || '900', 10)

const outDir = join(process.cwd(), 'temporary screenshots')

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise(r => setTimeout(r, 1500))
await page.evaluate(async () => {
  const delay = ms => new Promise(r => setTimeout(r, ms))
  for (let y = 0; y < document.body.scrollHeight; y += 400) {
    window.scrollTo(0, y); await delay(60)
  }
  window.scrollTo(0, 0)
})
await new Promise(r => setTimeout(r, 1200))
await page.screenshot({
  path: join(outDir, `${name}.png`),
  clip: { x: 0, y: fromY, width: 1440, height }
})
console.log('Saved:', join(outDir, `${name}.png`))
await browser.close()
