const {marked} = require('marked')
const {promisify} = require('util')
const glob = promisify(require('glob'))
const utils = require('./util/utils.js')
const {markdown2object} = require('./util/markdown2object')
const {save, read} = utils

const t = s=>(new Date(s)).getTime()||Number.MAX_VALUE

marked.use({ renderer: { html: s => s } })

;(async()=>{
  const files = await glob('src/data/markdown/+(post|fortpolio|page)_*.md')
  const contents = await Promise.all(files.map(read))
  const objects = contents.map(markdown2object)
      .sort((p1, p2)=>t(p1.date)>t(p2.date)?1:-1)
  saveObjectsToJSON(objects)
  saveObjectsToLists(objects)
})()

/**
 * Save the page-object to json
 * @param {object[]} objects
 * @returns {object[]}
 */
function saveObjectsToJSON(objects){
  objects.forEach(obj=>{
    if (obj.slug&&obj.type){
      const data = JSON.stringify(obj)
      const subPath = `/data/json/${obj.type}_${obj.slug}.json`
      ;['src', 'dist'].forEach(basePath=>save(basePath+subPath, data, true))
    } else {
      console.log('ignored', obj.title, obj.slug, obj.type)
    }
  })
  return objects
}

/**
 * Save the page-object to json
 * @param {object[]} objects
 * @returns {object[]}
 */
function saveObjectsToLists(objects){
  const listPages = objects.filter(o=>o.type==='page')
  const listPosts = objects.filter(o=>o.type==='post')
  const listProjects = objects.filter(o=>o.type==='fortpolio'&&(o.inCv||o.inPortfolio))
  save('src/data/json/pages-list.json', JSON.stringify(listPages.map(({slug, title})=>({slug, title}))))
  save('src/data/json/posts-list.json', JSON.stringify(listPosts.map(({date, slug, title, sticky, thumbnail})=>({date, slug, title, sticky, thumbnail})).sort((a, b)=>{
    const aa = new Date(a.date)
    const bb = new Date(b.date)
    return aa>bb?-1:(aa<bb?1:0)
  })))
  save('src/data/json/fortpolio-list.json', JSON.stringify(listProjects))
  return objects
}
