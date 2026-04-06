import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, 'flowchart.html');

const browser = await puppeteer.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  headless: 'new'
});
const page = await browser.newPage();
await page.setViewport({ width: 1850, height: 1750 });
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({
  path: path.join(__dirname, 'flowchart_screenshot.png'),
  fullPage: true
});
await browser.close();
console.log('Screenshot saved to flowchart_screenshot.png');
