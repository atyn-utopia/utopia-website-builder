import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'

const cwd = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(cwd, 'temporary screenshots', 'references')
await fs.mkdir(outDir, { recursive: true })

const refs = [
  { name: 'cateringservice-my', url: 'https://www.cateringservice.my/ms' },
  { name: 'pichaeats',          url: 'https://pichaeats.com/en/' },
  { name: 'canapecatering-my',  url: 'https://canapecatering.my/' },
]

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

for (const r of refs) {
  for (const vp of [
    { tag: 'desktop', w: 1440, h: 900 },
    { tag: 'mobile',  w: 390,  h: 844 },
  ]) {
    const page = await browser.newPage()
    await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 1 })
    try {
      await page.goto(r.url, { waitUntil: 'networkidle2', timeout: 60000 })
      // give lazy images a beat
      await new Promise(res => setTimeout(res, 2500))
      await page.screenshot({
        path: path.join(outDir, `${r.name}-${vp.tag}.png`),
        fullPage: true,
      })
      console.log(`[ref] ${r.name}-${vp.tag} ✓`)
    } catch (e) {
      console.error(`[ref] ${r.name}-${vp.tag} ✗`, e.message)
    } finally {
      await page.close()
    }
  }
}

await browser.close()
console.log(`Saved reference shots to ${outDir}`)
