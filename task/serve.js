/**
 * node task/serve dist 8383
 */

import express from 'express'
import serveStatic from 'serve-static'
import openBrowser from 'open'
const __dirname = import.meta.dirname;
const root = process.argv[2]||'doc'
const port = process.argv[3]||8183
const dontOpen = process.argv.join(' ').includes(' -s')||false

express()
  .use(serveStatic(`./${root}/`))
  .get('*', (request, response) => {
    response.sendFile('index.html', {root: `${__dirname}/../${root}/`})
  })
  .listen(port)

!dontOpen&&openBrowser('http://localhost:'+port)
