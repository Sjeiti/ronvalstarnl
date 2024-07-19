//require = require("esm")(module/*, options*/)
//module.exports = require("./main.js")

import fs from 'fs'
import {JSDOM} from 'jsdom'
// import {viewModelFactory} from './util/viewModelFactory.js'

//import posts from '../src/data/json/posts-list.json' assert { type: 'json' }
//import pages from '../src/data/json/pages-list.json' assert { type: 'json' }
//import portfolio from '../src/data/json/fortpolio-list.json' assert { type: 'json' }

const baseUri = 'https://ronvalstar.nl'

// currentPast
// portfolio / project
// pages
// console.log('pages', currentPast.map(o=>o.slug).join(',')) // todo: remove log
// console.log('currentPast', currentPast.map(o=>'project/'+o.slug).join(',')) // todo: remove log
// console.log('portfolio', currentPast.map(o=>o.slug).join(',')) // todo: remove log

const {promises:{readFile, writeFile,mkdir},readFileSync} = fs // require('node:fs')
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

//import posts from '../src/data/json/posts-list.json' assert { type: 'json' }
//import pages from '../src/data/json/pages-list.json' assert { type: 'json' }
//import portfolio from '../src/data/json/fortpolio-list.json' assert { type: 'json' }
//const today = new Date
//const currentPast = posts.filter(({date})=>(new Date(date))<=today)

  /*
  getJSDOM('', 'http://0')
  const router = await import('../src/js/router.js')
  const {open} = router
  console.log(233)
  await import('../src/js/views/index.js')
  */

  const pages = JSON.parse((await readFile('src/data/json/pages-list.json')).toString()) 
  const testPages = 
    [baseUri, ...pages.map(o=>baseUri+'/'+o.slug)]
    //['https://ronvalstar.nl/blog']
  console.log('testPages', testPages) // todo: remove log
  await Promise.all(testPages.map(async uri=>{

    const {window} = getJSDOM(html, uri)

    // console.log('doc', Object.keys(doc))
    // console.log('window', Object.keys(doc.window).sort().join(', '))
    // console.log('document', Object.keys(document))
    // console.log('location', Object.keys(document.location))
    // console.log('history', doc.window.history)

    /*
    const router = await import('../src/js/router.js')
    const views = ['pages','blog','cv','posts','experiments','projects','home','search']
    await Promise.all(views.map(name=>import(`../src/js/views/${name}.js`)))

    const {open} = router
    const {href} = window.location

    console.log('open before',href) // todo: remove log
    await open(href)
    console.log('open after') // todo: remove log
    */
    
    await import('../src/js/views/index.js')
    const {open} = await import('../src/js/router.js')
    
    const {href} = window.location
    await open(href)
    await new Promise(r=>setTimeout(r,99))

    const targetPath = './dist/rnd'+uri.replace(baseUri,'')
    const target = targetPath+'/index.html'
    await mkdir(targetPath,{recursive:true})
    
    const {outerHTML} = document.documentElement
    
    await writeFile(
      target,
      outerHTML
        .replace('<script src="/js/index.js"></script>','')
        //.replace(/script/g,'div')
    )

    const content = document.querySelector('.content')
    const contentHTML = content.outerHTML

    console.log(
        'uri',uri
        ,'\n  html',outerHTML.length
        ,'\n  _content',green(contentHTML.split(/\n/).slice(0,5).join('\n').replace(/\s+/g,' '))
        ,'\n  includes',outerHTML.includes(contentHTML)
        ,'\n  html',document.documentElement.getAttribute('class')
        ,'\n  title',document.querySelector('title').textContent
        ,'\n  target',target
        ,'\n'
    )
    //throw new Error('foo')
  
  }))
})()

function getJSDOM(html, url){

  const doc = new JSDOM(html,{url})

  const fetchPkg = 'node_modules/whatwg-fetch/dist/fetch.umd.js'
  doc.window.eval(fs.readFileSync(fetchPkg, 'utf-8'))

  const {window, window:{document}} = doc

  //globalThis.document = document
  
  window.scrollTo = ()=>{}

  window.HTMLCanvasElement.prototype.getContext = ()=>{}

  globalThis.requestAnimationFrame = fn=>globalThis.setTimeout(fn,30)
  globalThis.cancelAnimationFrame = id=>globalThis.clearTimeout(id)

  const _fetch = globalThis.fetch
  globalThis.fetch = s=>{
    //return _fetch('src'+s)
    const body = readFileSync('dist'+s)
    return Promise.resolve(new Response(body))
    //return readFile('src'+s)
  }

  //globalThis.history = doc.window.history

  //Object.entries(window).forEach(([key,value])=>{
  //  globalThis.hasOwnProperty(key)
  //    ||(globalThis[key] = value)
  //})
  //globalThis.Element = window.Element
  ;[
    'Element'
    ,'HTMLAnchorElement'
    ,'location'
    ,'history'
    ,'document'
    ,'window'
    ,'_VERSION'
    ,'_ENV'
  ,'matchMedia'
  ].forEach(key=>{
    globalThis[key] = window[key]
  })

  //console.log('globalThis.Element',globalThis.Element)
  //globalThis.Element = doc.Element
  //console.log('doc.Element',doc.Element,window.Element)

  return doc
}

function green(s){
  return `\x1b[32m${s}\x1b[0m`
}
