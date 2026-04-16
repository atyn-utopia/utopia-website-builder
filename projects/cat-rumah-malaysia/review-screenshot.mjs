import puppeteer from 'puppeteer'
import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

const outDir = join(process.cwd(), 'temporary screenshots')
if (!existsSync(outDir)) await mkdir(outDir, { recursive: true })

const pages = [
  { url: 'http://localhost:3010/ms', name: 'desktop-homepage', width: 1440, height: 900 },
  { url: 'http://localhost:3010/ms/cat-rumah/kuala-lumpur', name: 'desktop-location', width: 1440, height: 900 },
  { url: 'http://localhost:3010/ms', name: 'mobile-homepage', width: 390, height: 844 },
  { url: 'http://localhost:3010/ms/cat-rumah/kuala-lumpur', name: 'mobile-location', width: 390, height: 844 },
]

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })

for (const p of pages) {
  const page = await browser.newPage()
  await page.setViewport({ width: p.width, height: p.height })
  await page.goto(p.url, { waitUntil: 'networkidle0', timeout: 60000 })
  await new Promise(r => setTimeout(r, 1500))
  // Scroll to trigger lazy-loaded images
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80))
    }
    window.scrollTo(0, 0)
  })
  await new Promise(r => setTimeout(r, 2000))
  const path = join(outDir, `${p.name}.png`)
  await page.screenshot({ path, fullPage: true })
  console.log(`Saved: ${path}`)
  await page.close()
}

await browser.close()
console.log('All done.')
