const puppeteer = require('puppeteer')

const utils = require('./util/utils.js')
const {save} = utils

async function run() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto('http://localhost:7047')
  // await page.screenshot({ path: 'temp/screenshot.png' })

  const text = await page.evaluate(() => [...document.querySelectorAll('a')].map(m=>m.getAttribute('href')).filter(uri=>!/^https?:\/\//i.test(uri)))
  console.log('anchors',text.join(' | ')) // todo: remove log

  const renderedContent = await page.evaluate(() => new XMLSerializer().serializeToString(document))
  save('temp/renders/index.html', renderedContent)

  browser.close()
}

run()