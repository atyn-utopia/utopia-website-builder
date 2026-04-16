import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

const URL = 'http://localhost:3010/ms'
const OUT = path.join(process.cwd(), 'temporary screenshots', 'spacing-audit')

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })

async function captureSlices(page, viewportWidth, height, label) {
  await page.setViewport({ width: viewportWidth, height })

  // Scroll to trigger lazy images
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y)
      await new Promise(r => setTimeout(r, 80))
    }
    window.scrollTo(0, 0)
  })
  await new Promise(r => setTimeout(r, 2000))

  const totalHeight = await page.evaluate(() => document.body.scrollHeight)
  console.log(`${label}: total page height = ${totalHeight}px`)

  let idx = 0
  for (let y = 0; y < totalHeight; y += height) {
    const clipHeight = Math.min(height, totalHeight - y)
    await page.screenshot({
      path: path.join(OUT, `${label}-${String(idx).padStart(2, '0')}-y${y}.png`),
      clip: { x: 0, y, width: viewportWidth, height: clipHeight },
    })
    idx++
  }
  console.log(`${label}: captured ${idx} slices`)
}

// Also capture full page
async function captureFullPage(page, viewportWidth, label) {
  await page.setViewport({ width: viewportWidth, height: 900 })
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y)
      await new Promise(r => setTimeout(r, 80))
    }
    window.scrollTo(0, 0)
  })
  await new Promise(r => setTimeout(r, 2000))
  await page.screenshot({
    path: path.join(OUT, `${label}-full.png`),
    fullPage: true,
  })
  console.log(`${label}: full page captured`)
}

const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()
await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 })

// Desktop: 1440px wide, 900px slices
await captureSlices(page, 1440, 900, 'desktop')
await captureFullPage(page, 1440, 'desktop')

// Mobile: 390px wide, 812px slices
await captureSlices(page, 390, 812, 'mobile')
await captureFullPage(page, 390, 'mobile')

await browser.close()
console.log('Done! Screenshots in:', OUT)
