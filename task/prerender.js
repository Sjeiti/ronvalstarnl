import {Worker} from 'worker_threads'
import fs from 'fs'
import {JSDOM} from 'jsdom'
import {cpus} from 'os'

console.log('cpu',cpus())

const baseUri = 'https://ronvalstar.nl'

const {promises:{readFile, writeFile,mkdir},readFileSync} = fs // require('node:fs')

console.log('prerender')

const index = 'src/index.html'

;(async ()=>{

  const html = (await readFile(index)).toString()

  const toBase = o=>baseUri+'/'+o.slug

  const types = ['pages','posts','fortpolio']
  const lists = await Promise.all(types.map(async type=>JSON.parse((await readFile(`src/data/json/${type}-list.json`)).toString())
      //.map(toBase)
      .map(o=>baseUri+'/'+(type==='fortpolio'?'project/':'')+o.slug)
      //.slice(0,3)
  ))
  const pages = [
      //baseUri,
      ...lists.reduce((acc,o)=>(acc.push(...o),acc))
  ]
  console.log('pages', pages.join(',')) // todo: remove log

  //await Promise.all(pages.map(uri=>createWorker(uri,html)))

  function getWorkerGenerator(uris){
    return function(){
      const uri = uris.pop()
      console.log('uri', uri) // todo: remove log
      return uri&&createWorker(uri,html)
    }
  }

  //const g =  getWorkerGenerator(pages.slice(0))
  //console.log('gen',g()) // todo: remove log
  //console.log('gen',g()) // todo: remove log
  await dynamicPromiseAll(getWorkerGenerator(pages.slice(0)), 10)

})()

function dynamicPromiseAll(generator, max){
  return new Promise((resolve)=>{
    let num = 0
    for(let i=0;i<max;i++) addPromise()
    function resolvePromise(){
      num--
      console.log('resolvePromise',num) // todo: remove log
      addPromise()
        &&num<=0
        &&resolve()
    }
    function addPromise(){
      const promise = generator()
      console.log('addPromise',num,max,promise) // todo: remove log
      if (promise) {
        promise.then(resolvePromise)
        num++
      }
      return promise
    }
  })
}

function createWorker(uri,html){
  const worker = new Worker('./task/prerender-worker.js', {
    workerData: {uri,html}
  })

  return new Promise((resolve, reject)=>{
    worker.on('message', msg=>{
      msg.done
        ?resolve()
        :console.log('message',msg)// todo rem
    })
    worker.on('error', reject)
    worker.on('exit', code  => {
      if (code!==0) {
          reject(new  Error(`Worker stopped with exit code ${code}`))
      }
    })
  })
}

/**
 * Instantiate JSDOM and apply globals
 */
function getJSDOM(html, url){

  const doc = new JSDOM(html,{url})

  const fetchPkg = 'node_modules/whatwg-fetch/dist/fetch.umd.js'
  doc.window.eval(fs.readFileSync(fetchPkg, 'utf-8'))

  const {window, window:{document}} = doc

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
