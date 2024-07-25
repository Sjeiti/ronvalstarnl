import {Worker} from 'worker_threads'
import fs from 'fs'
import {JSDOM} from 'jsdom'
import {cpus} from 'os'

import {exit} from 'node:process'

import commander from 'commander'

const {target} = commander
        .usage('[options] <files ...>')
        .option('--target [target]', 'Target uri')
        .parse(process.argv)
        .opts()

const maxWorkers = Math.max(4, cpus().length-1)
console.log('maxWorkers',maxWorkers)

const baseUri = 'https://ronvalstar.nl'

const {promises:{readFile, writeFile,mkdir},readFileSync} = fs // require('node:fs')

console.log('prerender',target||'')

const index = 'src/index.html'

;(async ()=>{

  const html = (await readFile(index)).toString()

  const types = ['pages','posts','fortpolio']
  const lists = await Promise.all(types.map(async type=>JSON.parse((await readFile(`src/data/json/${type}-list.json`)).toString())
      .map(o=>baseUri+'/'+(type==='fortpolio'?'project/':'')+o.slug)
      //.slice(0,4)
  ))
  const pages = (target?[baseUri+'/'+target]:[
      ...lists.reduce((acc,o)=>(acc.push(...o),acc))
  ])
  console.log('pages', pages.map(uri=>uri.replace(/^https:\/\/[^/]*/,'')).join(',')) // todo: remove log

  function getWorkerGenerator(uris){
    return function(){
      const uri = uris.pop()
      return uri&&createWorker(uri,html)
    }
  }
  await dynamicPromiseAll(getWorkerGenerator(pages.slice(0)), maxWorkers)
  console.log('prerender done') // todo: remove log
  exit(0)
})()

function dynamicPromiseAll(generator, max){
  return new Promise((resolve)=>{
    let num = 0
    for(let i=0;i<max;i++) addPromise()
    function resolvePromise(){
      num--
      addPromise()
        ||num<=0
        &&resolve()
    }
    function addPromise(){
      const promise = generator()
      if (promise) {
        promise
          .then(resolvePromise)
          .catch(console.log.bind(console,'Catch err'))
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
    ,'_VERSION'
    ,'_ENV'
  ,'matchMedia'
  ].forEach(key=>{
    globalThis[key] = window[key]
  })

  return doc
}

function green(s){
  return `\x1b[32m${s}\x1b[0m`
}
