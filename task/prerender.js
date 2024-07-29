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

const {promises:{readFile,writeFile,mkdir},readFileSync} = fs // require('node:fs')

console.log('prerender',target||'')

const index = 'src/index.html'

const noop = ()=>({})

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

  const generator = getWorkerGenerator(pages,html)
  await dynamicPromiseAll(generator, maxWorkers)
  console.log('prerender done')
  exit(0)
})()

function getWorkerGenerator(uris,html){
  const _uris = uris.slice(0)
  return function(){
    const uri = _uris.pop()
    return uri&&createWorker(uri,html)
  }
}

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
    worker.on('message', msg =>
      msg.done
        ?resolve()
        :console.info('message',msg)
    )
    worker.on('error', reject)
    worker.on('exit', code  =>
      code===0
        ||console.info('Worker exit',code)
    )
  })
}

