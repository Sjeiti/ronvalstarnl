const {promisify} = require('util')
const glob = promisify(require('glob'))
const utils = require('./util/utils.js')
const {save,read} = utils

glob('src/data/markdown/+(post|fortpolio|page)_*.md')
    .then(files=>Promise.all(files.map(read)))
    .then(files=>files.map(markdown2object))
    .then(saveObjectsToJSON)
    .then(saveObjectsToMarkdown)

// read('src/data/markdown/post_tissue.md').then(markdown2object)
// read('src/data/markdown/page_about.md').then(markdown2object)
// read('src/data/markdown/fortpolio_dustin-kershaw.md').then(markdown2object)

const markdownKeys = ['title','content']
const arrayKeys = ['tags','categories','collaboration','clients','prizes','images']

function markdown2object(contents){
  const lines = contents.trim().split(/\r\n|\r|\n/g)
  const hasComments = /^\s*<!--\s*$/.test(lines[0])
  const endComments = hasComments?firstMatchIndex(lines, /^\s*-->\s*$/):-1
  const metaLines = hasComments&&lines.slice(1, endComments)||[]
  const meta = metaLines.reduce((acc,line)=>{
    const [key,value] = line.trim().split(/\s*:\s*/)
    acc[key] = arrayKeys.includes(key)?value.split(/,/).filter(o=>o):value
    return acc
  }, {})
  const contentLines = lines.slice(endComments+1)
  const titleIndex = firstMatchIndex(contentLines, /^\s*#\s(.*)$/)
  const title = titleIndex!==-1&&contentLines[titleIndex].match(/#(.*)/).pop()||''
  const content = contentLines.slice(titleIndex+1).join('\n').trim()
  return Object.assign(meta,{title,content})
}

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

function saveObjectsToJSON(objects){
  objects.forEach(obj=>{
    if (obj.slug&&obj.type){
      const fileName = `temp/json/${obj.type}_${obj.slug}.json`
      save(fileName,JSON.stringify(obj))
    }
  })
  return objects
}

function saveObjectsToMarkdown(objects){
  objects.forEach(obj=>{
    if (obj.slug&&obj.type){
      const {title, content} = obj
      const markdown = `<!--
${Object.entries(obj).filter(([key])=>!markdownKeys.includes(key)).map(n=>{
  const [key, value] = n
  if (arrayKeys.includes(key)) n[1] = value.join(',')
  return '  '+n.join(': ')
      }).join('\n')}
-->

# ${title}

${content}`
      const fileName = `temp/markdown/${obj.type}_${obj.slug}.md`
      save(fileName,markdown)
    }
  })
  return objects
}