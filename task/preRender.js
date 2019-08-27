const puppeteer = require('puppeteer')
const {URL} = require('url')

const utils = require('./util/utils.js')
const {save} = utils

const targetPath = 'temp/renders/'
const baseUri = 'http://localhost:7047'

const siteMap = new Map()
const todos = []

async function run(currentUri) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto(currentUri)
  const renderedContent = await page.evaluate(() => new XMLSerializer().serializeToString(document))
  const uris = await page.evaluate(() => [...document.querySelectorAll('a')].map(m=>m.getAttribute('href')).filter(uri=>!/^https?:\/\//i.test(uri)))
  // await page.screenshot({ path: 'temp/screenshot.png' })
  browser.close()

  // todo: no 404's
  // todo: no searches?

  save(`${targetPath}${currentUri.replace(baseUri,'')}/index.html`, renderedContent)
  siteMap.set(currentUri, renderedContent)

  uris.forEach(uri=>{
    // const isValid = !/^mailto:|^tel:/.test(uri)
    const isValid = /^\//.test(uri)
    const uriConcat = (baseUri+uri)
    const isMapped = !!siteMap.get(uriConcat)
    if(isValid&&!isMapped){
      siteMap.set(currentUri, true) // awaiting... to prevent concurrent fetches
      todos.push(uriConcat)
    }
    // console.log('uri',isMapped,uri) // todo: remove log
  })

  const todoUri = todos.pop()
  todoUri&&run(todoUri)
}

run(baseUri)