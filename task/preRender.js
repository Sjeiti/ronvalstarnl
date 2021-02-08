const puppeteer = require('puppeteer')
const minify = require('html-minifier').minify
const {save} = require('./util/utils.js')
const commander = require('commander')
        .usage('[options] <files ...>')
        .option('--entry [entry]', 'Entry url')
        .option('--target [target]', 'Target path')
        .parse(process.argv)
        .opts()
const {entry, target} = commander
const entryUri = entry||'http://localhost:7047'
preRender(entryUri, target||'temp/renders', new Map, [])

/**
 * Instantiate puppeteer and recursively load and render all local HTML
 * @param {string} currentUri
 * @param {string} target
 * @param {Map} siteMap
 * @param {string[]} todos
 * @param {object} browser
 */
async function preRender(currentUri, target, siteMap, todos, browser) {
  console.log('preRender', currentUri) // todo: remove log
  try {
    if (!browser){
      browser = await puppeteer.launch()
      browser.on('disconnected', console.warn.bind(console, 'Browser disconnected'))
    }
    const page = await browser.newPage()
    page.on('error', console.error.bind(console, 'Page error:'))
    page.on('pageerror', console.error.bind(console, 'Page error:'))
    await page.goto(currentUri, {waitUntil: 'domcontentloaded'})
    await page.waitForFunction(()=>!!document.querySelector('main>*'))
    // below should work, but does not
    /*await page.waitForFunction(()=>{
      const main = document.querySelector('main>*')
      const contentPast = main&&main.querySelector('.content--past')
      contentPast&&main.removeChild(contentPast)
      return !!main
    }, {})*/
    // await new Promise(r=>setTimeout(r,30))
    const renderedContent = await page.evaluate(() => new XMLSerializer().serializeToString(document))
    const uris = await page.evaluate(() => [...document.querySelectorAll('a')].map(m => m.getAttribute('href')).filter(uri => !/^https?:\/\//i.test(uri)))
    const robots = await page.evaluate(() => document.querySelector('meta[property="robots"]'))
    await page.close()
    // await page.screenshot({ path: 'temp/screenshot.png' })
    if (!robots){
      const collapseBooleanAttributes = removeAttributeQuotes = collapseInlineTagWhitespace = collapseWhitespace = minifyCSS = removeComments = true
      const minifiedContent = minify(renderedContent, {collapseBooleanAttributes, removeAttributeQuotes, collapseInlineTagWhitespace, collapseWhitespace, minifyCSS, removeComments})
      currentUri!==entryUri&&save(`${target}${currentUri.replace(entry, '')}/index.html`.replace(/\/+/g, '/'), minifiedContent)
      siteMap.set(currentUri, renderedContent)
      uris.forEach(uri => {
        const isValid = /^\//.test(uri)&&!/\.\w+$|^\/search|^\/\?p=/.test(uri)
        if (isValid) {
          const uriConcat = (entry + uri.replace(/\/+/g, '/')).replace(/\/+$/, '')
          const isMapped = siteMap.get(uriConcat)
          if (!isMapped) {
            siteMap.set(uriConcat, true) // awaiting... to prevent concurrent fetches
            todos.push(uriConcat)
          }
        }
      })
    }
    const todoUri = todos.pop()
    todoUri && preRender(todoUri, target, siteMap, todos, browser) || browser.close()
  }catch(err){
    console.error('try/catch', err)
    browser&&browser.close()
  }
}
