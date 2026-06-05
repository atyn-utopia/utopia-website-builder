import puppeteer from 'puppeteer'
import { join } from 'path'

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto('http://localhost:3009/en', { waitUntil: 'networkidle2' })
await new Promise(r => setTimeout(r, 1500))

await page.evaluate(() => {
  const el = document.querySelector('.risk-bullets')
  if (el) {
    const r = el.getBoundingClientRect()
    window.scrollTo(0, window.scrollY + r.top - 120)
  }
})
await new Promise(r => setTimeout(r, 1500))
await page.screenshot({ path: join(process.cwd(), 'temporary screenshots', 'risk-section.png'), fullPage: false })

// Mobile
await page.setViewport({ width: 390, height: 844 })
await page.goto('http://localhost:3009/en', { waitUntil: 'networkidle2' })
await new Promise(r => setTimeout(r, 1500))
await page.evaluate(() => {
  const el = document.querySelector('.risk-bullets')
  if (el) {
    const r = el.getBoundingClientRect()
    window.scrollTo(0, window.scrollY + r.top - 100)
  }
})
await new Promise(r => setTimeout(r, 1000))
await page.screenshot({ path: join(process.cwd(), 'temporary screenshots', 'risk-section-mobile.png'), fullPage: false })

console.log('Done')
await browser.close()
