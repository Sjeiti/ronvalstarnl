const {promisify} = require('util')
const glob = promisify(require('glob'))
const utils = require('./util/utils.js')
const {read, save} = utils

const common = require('./commonWords')
const basePath = './src/data/search/'

glob('src/data/markdown/@(post|page|fortpolio)_*.md')
  .then(files=>Promise.all(files.map(read)))
  .then(files=>files.map(markdown2object))
  .then(files=>{
    const index = createIndex(files)
    mapIndex(files, index)
  })

// todo: research/fix project titles do not search (ie boids or marbles)

/**
 * Create the index file with all searchable words
 * @param {object[]} files
 * @return {string[]}
 */
function createIndex(files){
  const words = files
    .map(file=>{
      const {title, content, excerpt, categories, tags, clients, collaboration, prizes} = file
      return [title, content, excerpt, ...(categories||[]), ...(tags||[]), ...(clients||[]), ...(collaboration||[]), ...(prizes||[])]
        .join(' ')
        .replace(/<\/?[^>]+(>|$)/g, ' ')
        .replace(/[^\w\s]/g, ' ')
        .replace(/s\s/g, ' ')
        .toLowerCase()
        .split(/\s+/g)
    })
    .reduce((acc, a)=>(acc.push(...a), acc), [])
  const text = words
    .filter(s=>s)
    .filter((s, i, a)=>a.indexOf(s)===i)
    .filter(s=>s.length>2&&s.length<13)
    .filter(s=>!/^\d{3}$|^\d+\w+$|^_/.test(s))
    .filter(s=>!common.includes(s))
    .sort((a, b)=>a.length>b.length?1:-1)
  save(basePath+'words.json', JSON.stringify(text))
  return text
}

/**
 * Map all searchable words to files
 * @param {object[]} files
 * @param {string[]} index
 */
function mapIndex(files, index){
  index
    //.slice(0,132)
    .forEach(word=>{
      const slugs = files
        .filter(file=>{
          const {title, content, excerpt, categories, tags, clients, collaboration, prizes} = file
          const string = [title, content, excerpt, ...(categories||[]), ...(tags||[]), ...(clients||[]), ...(collaboration||[]), ...(prizes||[])]
            .join(' ')
            .replace(/<\/?[^>]+(>|$)/g, ' ')
            .replace(/[^\w\s]/g, ' ')
            .toLowerCase()
          return string.includes(word)
        })
        .map(file=>file.type+'_'+file.slug)
      save(basePath+`s_${word}.json`, JSON.stringify(slugs), true)
      //console.log(word,slugs)
    })
  console.log('saved', index.length, 'word files.')
}

////////////////////////////////////////////////////////////////////////////////

const arrayKeys = ['tags', 'categories', 'collaboration', 'clients', 'prizes', 'images'] // todo is duplicate from markdown2json
const booleanKeys = ['inCv', 'inPortfolio'] // todo is duplicate from markdown2json

/**
 * Convert markdown string data to an object literal with meta data
 * @param {string} contents
 * @returns {object}
 * @todo: is duplicate from markdown2json
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
 * @todo: is duplicate from markdown2json
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