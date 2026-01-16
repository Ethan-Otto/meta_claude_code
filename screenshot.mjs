import puppeteer from 'puppeteer';

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 400 });
await page.goto('file:///Users/ethanotto/Documents/Data_Science/claude_meta/banner_export.html', { waitUntil: 'networkidle0' });
await page.screenshot({
  path: '/Users/ethanotto/Documents/Data_Science/claude_meta/claude_code_banner.png',
  clip: { x: 0, y: 0, width: 1200, height: 400 }
});
await browser.close();
console.log('Screenshot saved!');
