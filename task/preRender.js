// const {promisify} = require('util')
const puppeteer = require('puppeteer')
// const minify = require('minify')

// const minifyHTML = promisify(minify.html)
const minify = require('html-minifier').minify

const utils = require('./util/utils.js')
const {save} = utils

const targetPath = 'temp/renders'
const baseUri = 'http://localhost:7047'

preRender(baseUri,new Map,[])

/**
 * Instantiate puppeteer and recursively load and render all local HTML
 * @param {string} currentUri
 * @param {object} browser
 * @return {Promise<void>}
 */
async function preRender(currentUri, siteMap, todos, browser) {
  try {
    if (!browser) {
      browser = await puppeteer.launch()
      browser.on('disconnected', console.log.bind(console,'Browser disconnected:'))
    }
    //
    const page = await browser.newPage()
    page.on('error',console.log.bind(console, 'Page error:'))
    await page.goto(currentUri, {waitUntil: 'domcontentloaded'})
    await page.waitForFunction(()=>!!document.querySelector('main>*'), {})
    // await new Promise(r=>setTimeout(r,30))
    const renderedContent = await page.evaluate(() => new XMLSerializer().serializeToString(document))
    const uris = await page.evaluate(() => [...document.querySelectorAll('a')].map(m => m.getAttribute('href')).filter(uri => !/^https?:\/\//i.test(uri)))
    const robots = await page.evaluate(() => document.querySelector('meta[property="robots"]'))
    await page.close()
    // await page.screenshot({ path: 'temp/screenshot.png' })
    if (!robots) {
      const collapseBooleanAttributes = removeAttributeQuotes = collapseInlineTagWhitespace = collapseWhitespace = minifyCSS = removeComments = true
      const minifiedContent = minify(renderedContent, {collapseBooleanAttributes, removeAttributeQuotes, collapseInlineTagWhitespace, collapseWhitespace, minifyCSS, removeComments})
      save(`${targetPath}${currentUri.replace(baseUri,'')}/index.html`.replace(/\/+/g,'/'),minifiedContent)
      siteMap.set(currentUri,renderedContent)
      uris.forEach(uri => {
        const isValid = /^\//.test(uri)&&!/\.\w+$|^\/search|^\/\?p=/.test(uri)
        if (isValid) {
          const uriConcat = (baseUri + uri.replace(/\/+/g,'/'))
          const isMapped = siteMap.get(uriConcat)
          if (!isMapped) {
            siteMap.set(uriConcat,true) // awaiting... to prevent concurrent fetches
            todos.push(uriConcat)
          }
        }
      })
    }
    const todoUri = todos.pop()
    todoUri && preRender(todoUri,siteMap,todos,browser) || browser.close()
  }catch(err){
    console.log('err',err) // todo: remove log
    browser&&browser.close()
  }
}