import puppeteer from 'puppeteer'
import { join } from 'path'

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto('http://localhost:3009/en#products', { waitUntil: 'networkidle2' })
await new Promise(r => setTimeout(r, 2500))
const products = await page.$('#products')
if (products) {
  await products.screenshot({ path: join(process.cwd(), 'temporary screenshots', 'products-section.png') })
}
await page.evaluate(() => {
  const el = document.querySelector('.gallery-grid')
  if (el) el.scrollIntoView()
})
await new Promise(r => setTimeout(r, 4000))
await page.screenshot({ path: join(process.cwd(), 'temporary screenshots', 'gallery-section.png'), fullPage: false })
console.log('Done')
await browser.close()
