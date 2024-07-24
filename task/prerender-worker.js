import fs from 'fs'
import {JSDOM} from 'jsdom'
//const { parentPort, workerData } =  require('worker_threads')
import {parentPort, workerData} from 'worker_threads'

const {promises:{readFile, writeFile,mkdir},readFileSync} = fs // require('node:fs')

const baseUri = 'https://ronvalstar.nl'
const index = 'src/index.html'

const noop = ()=>({})

;(async ()=>{

  const { uri, html } =  workerData
   
  //parentPort.postMessage('__uri '+uri);
  
  globalThis.prerendering = true

  const dom = getJSDOM(html, uri)
  const {window} = dom

  await import('../src/js/views/index.js')
  const {open} = await import('../src/js/router.js')

  const {href} = window.location
  try {
    await open(href)
  } catch(err) {
    console.log('error',err)
  }
  await new Promise(r=>setTimeout(r,99))

  const targetPath = './dist'+uri.replace(baseUri,'')
  const target = targetPath+'/index.html'
  await mkdir(targetPath,{recursive:true})

  document.documentElement.classList.add('prerendered')
  
  const htmlResult = dom.serialize()

  await writeFile(target,htmlResult)

  const title = document.querySelector('title')?.textContent

  console.log(
      uri.replace(/^\w*:\/\/[^/]*/,'')
      ,green(title)
  )
  parentPort.postMessage({done:true});

})()

//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////

function getJSDOM(html, url){

  const dom = new JSDOM(html,{url})

  const {window, window:{document}} = dom

  window.scrollTo = noop

  window.HTMLCanvasElement.prototype.getContext = noop

  globalThis.requestAnimationFrame = fn=>globalThis.setTimeout(fn,30)
  globalThis.cancelAnimationFrame = id=>globalThis.clearTimeout(id)

  globalThis.fetch = s=>{
    let body = '{"content":""}'
    const file = './dist'+s
    try {
      body = readFileSync(file)
    } catch(err) {
      console.log(`File not found: '${file}', ${err}`)
    }
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
  ].forEach(key=>{
    try {
      globalThis[key] = window[key]||noop
    } catch(err) {
      console.info(`Failed setting \`globalThis[${key}]\`: ${err}`)
    }
  })

  return dom
}

function green(s){
  return `\x1b[32m${s}\x1b[0m`
}
