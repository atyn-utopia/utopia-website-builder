import puppeteer from 'puppeteer'
import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

const base = process.argv[2] || 'http://localhost:3002'
const outDir = join(process.cwd(), 'temporary screenshots')
if (!existsSync(outDir)) await mkdir(outDir, { recursive: true })

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(base, { waitUntil: 'networkidle0', timeout: 30000 })
await new Promise(r => setTimeout(r, 2000))
const path = join(outDir, 'homepage.png')
await page.screenshot({ path, fullPage: true })
console.log(`Saved: ${path}`)
await page.close()
await browser.close()
console.log('Done.')
