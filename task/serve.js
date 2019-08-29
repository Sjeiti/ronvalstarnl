/**
 * node task/serve dist 8383
 */

const express    = require('express')
const serveStatic = require('serve-static')
const openBrowser = require('open')
const root = process.argv[2]||'doc'
const port = process.argv[3]||8183
const dontOpen = process.argv.join(' ').includes(' -s')||false
console.log('dontOpen',dontOpen) // todo: remove log

express()
  .use(serveStatic(`./${root}/`))
  .get('*',(request,response) => {
    response.sendFile('index.html',{root: `${__dirname}/../${root}/`})
  })
  .listen(port)

!dontOpen&&openBrowser('http://localhost:'+port)