const {promisify} = require('util')

const glob = promisify(require('glob'))
const utils = require('./util/utils.js')
const {read, save} = utils

const dir = './src/data/json/'
// const types = ['post','fortpolio']

// posts
glob(dir+'post_*.json', {})
.then(files=>Promise.all(files.map(read)))
.then(files=>files.map(file=>{
  const {date, slug, title:{rendered:title}} = JSON.parse(file)
  return {date, slug, title}
}))
.then(files=>files.sort((a, b)=>new Date(a.date)<new Date(b.date)?1:-1))
.then(files=>save(dir+'posts-list.json', JSON.stringify(files)))
.catch(console.warn.bind(console, 'fuuuu'))

// pages
glob(dir+'page_*.json', {})
.then(files=>Promise.all(files.map(read)))
.then(files=>files.map(file=>{
  const {slug, title:{rendered:title}} = JSON.parse(file)
  return {slug, title}
}))
.then(files=>save(dir+'pages-list.json', JSON.stringify(files)))
.catch(console.warn.bind(console, 'fuuuu'))

// portfolio
glob(dir+'fortpolio_*.json', {})
.then(files=>Promise.all(files.map(read)))
.then(files=>files.sort((a, b)=>a.order<b.order?-1:1))
.then(files=>files.map(file=>{
  const {
    slug
    ,title
    ,excerpt
    ,content
    ,'meta-datefrom':dateFrom
    ,'meta-dateto':dateTo
    ,'meta-featured':featured
    ,'meta-incv':inCv // on||''
    ,'meta-inportfolio':inPortfolio
    ,image
    ,media
    ,tags
    ,categories
  } = JSON.parse(file)
  return {
    slug
    ,title
    ,excerpt
    ,content
    ,dateFrom
    ,dateTo
    ,featured: featured==='on'
    ,inCv: inCv==='on'
    ,inPortfolio: inPortfolio==='on'
    ,thumbnail: image&&image.thumbnail
    ,image: image&&image.full
    ,images: media.map(m=>m.medium_large)
    ,tags
    ,categories
  }
}))
.then(files=>save(dir+'fortpolio-list.json', JSON.stringify(files)))
.catch(console.warn.bind(console, 'fuuuu'))
