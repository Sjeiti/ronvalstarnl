/**
 * node task/serve dist 8383
 */

import express from 'express'
import serveStatic from 'serve-static'
import openBrowser from 'open'
import {api} from './api.js'

const __dirname = import.meta.dirname;
const root = process.argv[2]||'doc'
const port = process.argv[3]||8183
const dontOpen = process.argv.join(' ').includes(' -s')||false

express()
  .use(serveStatic(`./${root}/`))
  .use(express.urlencoded())
  .use(express.json())
  .use('/api', api)

  .get('*', (request, response) => {
    response.sendFile('index.html', {root: `${__dirname}/../${root}/`})
  })
  .listen(port)

(!dontOpen||!process.env.nodemon)
  &&openBrowser('http://localhost:'+port)

