//require = require("esm")(module/*, options*/)
//module.exports = require("./main.js")

import fs from 'fs'
import {JSDOM} from 'jsdom'
import {viewModelFactory} from './util/viewModelFactory.js'

const {promises:{readFile},readFileSync} = fs // require('node:fs')
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

  const doc = new JSDOM(html,{
    url: 'https://ronvalstar.nl'
  })

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

  const view = document.querySelector('main')
  const viewModel = viewModelFactory(view)

  console.log('doc', Object.keys(doc))
  console.log('window', Object.keys(doc.window).sort().join(', '))
  console.log('document', Object.keys(document))
  console.log('location', Object.keys(document.location))
  console.log('history', doc.window.history)

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

  open(window.location.href)
  
  //

  console.log(window.location.href)
  //console.log(document.body.textContent)
})()


