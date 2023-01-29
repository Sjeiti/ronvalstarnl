const {marked} = require('marked')

const arrayKeys = ['tags', 'categories', 'collaboration', 'clients', 'prizes', 'images']
const booleanKeys = ['inCv', 'inPortfolio', 'sticky']

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
  const content = marked(contentLines.slice(titleIndex+1).join('\n').trim(), {breaks: true/*, gfm: true*/})
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

module.exports = {markdown2object}