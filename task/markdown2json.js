const marked = require('marked')
const {promisify} = require('util')
const glob = promisify(require('glob'))
const utils = require('./util/utils.js')
const {save, read} = utils

const arrayKeys = ['tags', 'categories', 'collaboration', 'clients', 'prizes', 'images']
const booleanKeys = ['inCv', 'inPortfolio', 'sticky']
const t = s=>(new Date(s)).getTime()||Number.MAX_VALUE

glob('src/data/markdown/+(post|fortpolio|page)_*.md')
    .then(files=>Promise.all(files.map(read)))
    .then(files=>files.map(markdown2object))

    .then(posts=>{
      posts.sort((p1, p2)=>t(p1.date)>t(p2.date)?1:-1)
      console.log('posts', posts.filter(o=>o.type==='post').map(p=>p.date +' '+ p.slug).join('\n')) // todo: remove log
      return posts
    })

    .then(saveObjectsToJSON)
    .then(saveObjectsToLists)

/**
 * Convert markdown string data to an object literal with meta data
 * @param {string} contents
 * @returns {object}
 */
function markdown2object(contents){
  const lines = contents.trim().split(/\r\n|\r|\n/g)
  const hasComments = /^\s*<!--\s*$/.test(lines[0])
  const endComments = hasComments?firstMatchIndex(lines, /^\s*-->\s*$/):-1
  const metaLines = hasComments&&lines.slice(1, endComments)||[]
  const meta = metaLines.reduce((acc, line)=>{
    const [key, value] = line.trim().split(/\s*:\s*(.*)/)
    if (arrayKeys.includes(key)) acc[key] = value.split(/,\s*/).filter(o=>o)
    else if (booleanKeys.includes(key)) acc[key] = value==='true'
    else acc[key] = value
    return acc
  }, {})
  const contentLines = lines.slice(endComments+1)
  const titleIndex = firstMatchIndex(contentLines, /^\s*#\s(.*)$/)
  const title = (titleIndex!==-1&&contentLines[titleIndex].match(/#(.*)/).pop()||'').trim()
  const content = marked(contentLines.slice(titleIndex+1).join('\n').trim(), {breaks: true})
  return Object.assign(meta, {title, content})
}

/**
 * Search an array for the first index to match
 * @param {Array} a
 * @param {RegExp} r
 * @returns {number}
 */
function firstMatchIndex(a, r){
  let matchedIndex = -1
  for (let i=0, l=a.length;i<l;i++){
    if (r.test(a[i])){
      matchedIndex = i
      break
    }
  }
  return matchedIndex
}

/**
 * Save the page-object to json
 * @param {object[]} objects
 * @returns {object[]}
 */
function saveObjectsToJSON(objects){
  objects.forEach(obj=>{
    if (obj.slug&&obj.type){
      const fileName = `src/data/json/${obj.type}_${obj.slug}.json`
      save(fileName, JSON.stringify(obj), true)
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
  save('src/data/json/posts-list.json', JSON.stringify(listPosts.map(({date, slug, title, sticky})=>({date, slug, title, sticky})).sort((a, b)=>new Date(a.date)>new Date(b.date)?-1:1)))
  save('src/data/json/fortpolio-list.json', JSON.stringify(listProjects))
  return objects
}
