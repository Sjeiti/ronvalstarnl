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

  await writeFile(target,outerHTML)

  const content = document.querySelector('.content')
  const contentHTML = content.outerHTML
  const firstH2 = content.querySelector('h2')?.textContent
  const title = document.querySelector('title')?.textContent

  console.log(
      '_\nuri',uri
      ,'\n  title:',green(title)
  )
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

  window.scrollTo = ()=>{}

  window.HTMLCanvasElement.prototype.getContext = ()=>{}

  globalThis.requestAnimationFrame = fn=>globalThis.setTimeout(fn,30)
  globalThis.cancelAnimationFrame = id=>globalThis.clearTimeout(id)

  const _fetch = globalThis.fetch
  globalThis.fetch = s=>{
    const body = readFileSync('dist'+s)
    return Promise.resolve(new Response(body))
  }

  ;[
    'Element'
    ,'HTMLAnchorElement'
    ,'location'
    ,'history'
    ,'document'
    ,'window'
    ,'matchMedia'
    ,'_VERSION'
    ,'_ENV'
    //,'navigator'
  ].forEach(key=>{
    try {
      globalThis[key] = window[key]||(()=>({}))
    } catch(err) {
      console.info(`Failed setting \`globalThis[${key}]\`: ${err}`)
    }
  })

  return doc
}

function green(s){
  return `\x1b[32m${s}\x1b[0m`
}
