const {promisify} = require('util')
const glob = promisify(require('glob'))
const utils = require('./util/utils.js')
const {save, read} = utils

const postmeta = require('../temp/rv_postmeta')
const metaMap = {_yoast_wpseo_title:'metaTitle', _yoast_wpseo_metadesc:'metaDescription', _yoast_wpseo_focuskw:'metaKeyword'}
const validMetas = ['_yoast_wpseo_title', '_yoast_wpseo_metadesc', '_yoast_wpseo_focuskw']
const data = postmeta[2].data.filter(({meta_key, meta_value})=>meta_value&&validMetas.includes(meta_key))

const markdownKeys = ['title', 'content']
const arrayKeys = ['tags', 'categories', 'collaboration', 'clients', 'prizes', 'images']
const booleanKeys = ['inCv', 'inPortfolio']

glob('src/data/markdown/+(post|fortpolio|page)_*.md')
    .then(files=>Promise.all(files.map(read)))
    .then(files=>files.map(markdown2object))

    // .then(addMetaData)
    // .then(swapKeys)
    // .then(saveObjectsToMarkdown)

    .then(saveObjectsToJSON)
    .then(saveObjectsToLists)

// read('src/data/markdown/post_tissue.md').then(markdown2object)
// read('src/data/markdown/page_about.md').then(markdown2object)
// read('src/data/markdown/fortpolio_dustin-kershaw.md').then(markdown2object)

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
  const content = contentLines.slice(titleIndex+1).join('\n').trim()
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
      save(fileName, JSON.stringify(obj))
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
  save('src/data/json/posts-list.json', JSON.stringify(listPosts.map(({date, slug, title})=>({date, slug, title})).sort((a, b)=>new Date(a.date)>new Date(b.date)?-1:1)))
  save('src/data/json/fortpolio-list.json', JSON.stringify(listProjects))
  return objects
}

/**
 * Add metadata to page-objects and adds meta-data
 * @param {object[]} objects
 * @returns {object[]}
 */
function addMetaData(objects){ // eslint-disable-line no-unused-vars
  objects.forEach(obj=>{
    const {id} = obj
    const meta = data.filter(n=>n.post_id===id)
    meta.forEach(metaObj=>{
      obj[metaMap[metaObj.meta_key]] = metaObj.meta_value
    })
  })
  return objects
}

const keysToSwap = {
  'incv':'inCv'
  , 'inportfolio':'inPortfolio'
  , 'datefrom':'dateFrom'
  , 'dateto':'dateTo'
}

/**
 * Change key names
 * @param {object[]} objects
 * @return {object[]}
 */
function swapKeys(objects){ // eslint-disable-line no-unused-vars
  objects.forEach(obj=>{
    Object.entries(keysToSwap).forEach(([keyFrom, keyTo])=>{
      obj[keyTo] = obj[keyFrom]
      delete obj[keyFrom]
    })
  })
  return objects
}

/**
 * Save page-objects to markdown
 * @param {object[]} objects
 * @returns {object[]}
 */
function saveObjectsToMarkdown(objects){ // eslint-disable-line no-unused-vars
  objects.forEach(obj=>{
    if (obj.slug&&obj.type){
      const {title, content} = obj
      const markdown = `<!--
${Object.entries(obj).filter(([key])=>!markdownKeys.includes(key)).map(n=>{
  const [key, value] = n
  if (arrayKeys.includes(key)) n[1] = value.join(', ')
  return '  '+n.join(': ')
      }).join('\n')}
-->

# ${title}

${content}`
      const fileName = `src/data/markdown/${obj.type}_${obj.slug}.md`
      save(fileName, markdown)
    }
  })
  return objects
}