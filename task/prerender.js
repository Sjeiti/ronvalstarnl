//require = require("esm")(module/*, options*/)
//module.exports = require("./main.js")

import fs from 'fs'
import {JSDOM} from 'jsdom'
// import {viewModelFactory} from './util/viewModelFactory.js'

import posts from '../src/data/json/posts-list.json' assert { type: 'json' }
import pages from '../src/data/json/pages-list.json' assert { type: 'json' }
import portfolio from '../src/data/json/fortpolio-list.json' assert { type: 'json' }

const baseUri = 'https://ronvalstar.nl'

const today = new Date
const currentPast = posts.filter(({date})=>(new Date(date))<=today)

// currentPast
// portfolio / project
// pages
// console.log('pages', currentPast.map(o=>o.slug).join(',')) // todo: remove log
// console.log('currentPast', currentPast.map(o=>'project/'+o.slug).join(',')) // todo: remove log
// console.log('portfolio', currentPast.map(o=>o.slug).join(',')) // todo: remove log

const testPages = [baseUri, ...pages.slice(0,3).map(o=>baseUri+'/'+o.slug)]
console.log('testPages', testPages) // todo: remove log

const {promises:{readFile, writeFile},readFileSync} = fs // require('node:fs')
//const {JSDOM} = require('jsdom')

//import {open} from '../src/js/router.js'
//import '../src/js/views/home.js'

//const {promises:{readFile}} = require('node:fs')
//const {JSDOM} = require('jsdom')
//viewModelFactory(element)

console.log('prerender')

/*
const commander = require('commander')
        .usage('[options] <files ...>')
        .option('--entry [entry]', 'Entry url')
        .option('--target [target]', 'Target path')
        .parse(process.argv)
        .opts()
*/

const index = 'src/index.html'

;(async ()=>{

  const html = (await readFile(index)).toString()


  testPages.forEach(uri=>{
    //todo
  })

  const {window} = getJSDOM(html, baseUri)

  // console.log('doc', Object.keys(doc))
  // console.log('window', Object.keys(doc.window).sort().join(', '))
  // console.log('document', Object.keys(document))
  // console.log('location', Object.keys(document.location))
  // console.log('history', doc.window.history)

//jsdom.reconfigure({
//  url: 'https://www.test.com/whatever/url/you/want',
//});

  console.log(document.querySelector('h1').textContent)

  //open(location.href)
  //const module = await import(path);

  //import {open} from '../src/js/router.js'
  //import '../src/js/views/home.js'
  //
  const router = await import('../src/js/router.js')
  await import('../src/js/views/home.js')

  const {open} = router
  const {href} = window.location

  console.log('open before',href) // todo: remove log
  const openResult = await open(href)
  console.log('open after', openResult) // todo: remove log

  // console.log('globalThis.vmContent', globalThis.vmContent) // todo: remove log
  // console.log('globalThis.vmContent', globalThis.vmContent===document.querySelector('.content')) // todo: remove log
  // console.log('globalThis.vmContent.documentElement', globalThis.vmContent.documentElement) // todo: remove log

  // console.log('href',href)
  //console.log(document.body.textContent)
  const {outerHTML} = document.documentElement
  await writeFile('./dist/foo.html',outerHTML)
  console.log('html',outerHTML.length
      ,'\n  incl "content"',outerHTML.includes('class="content"')
      ,'\n  incl "built"',outerHTML.includes('class="built"'))
  throw new Error('foo')
})()

function getJSDOM(html, url){

  const doc = new JSDOM(html,{url})

  const fetchPkg = 'node_modules/whatwg-fetch/dist/fetch.umd.js'
  doc.window.eval(fs.readFileSync(fetchPkg, 'utf-8'))

  const {window, window:{document}} = doc

  globalThis.document = document

  globalThis.requestAnimationFrame = fn=>globalThis.setTimeout(fn,30)
  //console.log('raf',globalThis)

  const _fetch = globalThis.fetch
  globalThis.fetch = s=>{
    //return _fetch('src'+s)
    const body = readFileSync('src'+s)
    return Promise.resolve(new Response(body))
    //return readFile('src'+s)
  }

  globalThis.history = doc.window.history

  return doc
}
