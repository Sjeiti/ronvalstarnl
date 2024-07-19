import fs from 'fs'
import {JSDOM} from 'jsdom'
//const { parentPort, workerData } =  require('worker_threads')
import {parentPort, workerData} from 'worker_threads'

const {promises:{readFile, writeFile,mkdir},readFileSync} = fs // require('node:fs')

const baseUri = 'https://ronvalstar.nl'
const index = 'src/index.html'

;(async ()=>{

  const { uri, html } =  workerData
   
  parentPort.postMessage('__uri '+uri);
  //////
  //////

  const {window} = getJSDOM(html, uri)

  await import('../src/js/views/index.js')
  const {open} = await import('../src/js/router.js')

  const {href} = window.location
  await open(href)
  await new Promise(r=>setTimeout(r,99))

  const targetPath = './dist'+uri.replace(baseUri,'')
  const target = targetPath+'/index.html'
  await mkdir(targetPath,{recursive:true})

  const {outerHTML} = document.documentElement

  await writeFile(
    target,
    outerHTML
      //.replace('<script src="/js/index.js"></script>','')
      //.replace(/script/g,'div')
      //.replace('<html class="no-js" lang="en">','<html class="no-js prerendered" lang="en">')
      //.replace(/<html class="(.*)" lang="en">/','<html class="$1 prerendered" lang="en">')
  )

  const content = document.querySelector('.content')
  const contentHTML = content.outerHTML
  const firstH2 = content.querySelector('h2')?.textContent

  console.log(
      '_\nuri',uri
      ,'\n  html',outerHTML.length
      ,'\n  firstH2',green(firstH2)
      //,'\n  _content',green(contentHTML.split(/\n/).slice(0,5).join('\n').replace(/\s+/g,' '))
      ,'\n  includes',outerHTML.includes(contentHTML)
      ,'\n  html',document.documentElement.getAttribute('class')
      ,'\n  title',document.querySelector('title').textContent
      ,'\n  target',target
      ,'\n'
  )
  //throw new Error('foo')

  //////
  //////

  // sharp(imagePath).metadata().then((res)=>{

  // sending message back to main thread
  parentPort.postMessage({done:true});

})()

//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////

function getJSDOM(html, url){

  const doc = new JSDOM(html,{url})

  const fetchPkg = 'node_modules/whatwg-fetch/dist/fetch.umd.js'
  doc.window.eval(fs.readFileSync(fetchPkg, 'utf-8'))

  const {window, window:{document}} = doc

  globalThis.prerendering = true

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
    ,'navigator'
    ,'_VERSION'
    ,'_ENV'
  ,'matchMedia'
  ].forEach(key=>{
    globalThis[key] = window[key]||{}
  })

  //console.log('globalThis.Element',globalThis.Element)
  //globalThis.Element = doc.Element
  //console.log('doc.Element',doc.Element,window.Element)

  return doc
}

function green(s){
  return `\x1b[32m${s}\x1b[0m`
}
