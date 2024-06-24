//require = require("esm")(module/*, options*/)
//module.exports = require("./main.js")

import fs from 'fs'
import {JSDOM} from 'jsdom'
import {viewModelFactory} from './util/viewModelFactory.js'

const {promises:{readFile}} = fs // require('node:fs')
//const {JSDOM} = require('jsdom')

import {open} from '../src/js/router.js'
import '../src/js/views/home.js'

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

  const {window:{document}} = doc

  globalThis.document = document

  const view = document.querySelector('main')
  const viewModel = viewModelFactory(view)

  console.log('location', document.location)
  console.log('viewModel', viewModel)

//jsdom.reconfigure({
//  url: 'https://www.test.com/whatever/url/you/want',
//});

  console.log(document.querySelector('h1').textContent)

  //open(location.href)

})()


