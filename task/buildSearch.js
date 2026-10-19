import {promisify} from 'util'
import _glob from 'glob'
import {save, read} from './util/utils.js'
import common from './commonWords.json' with {type:'json'}

import { existsSync } from 'node:fs'
import {readdir, unlink} from 'node:fs/promises'
import {join} from 'node:path'

import {markdown2object} from './util/markdown2object.js'

const glob = promisify(_glob)

const basePath = './src/data/search/'
;(async ()=>{

  if (existsSync(basePath)) {
    const files = await readdir(basePath)
    await Promise.all(files.map(file=>unlink(join(basePath, file))))
  }

  glob('src/data/markdown/@(post|page|fortpolio)_*.md')
      .then(files=>Promise.all(files.map(read)))
      .then(files=>files.map(markdown2object))
      .then(files=>{
        const validFiles = files.filter(file=>!isNaN(file.date)) // year === 9999
        const index = createIndex(validFiles)
        mapIndex(validFiles, index)
      })
})()

/**
 * Create the index file with all searchable words
 * @param {object[]} files
 * @return {string[]}
 */
function createIndex(files){
  const words = files
    .map(file=>{
      const {title, content, excerpt, categories, tags, clients, collaboration, prizes} = file
      //
      return [title, content, excerpt, ...(categories||[]), ...(tags||[]), ...(clients||[]), ...(collaboration||[]), ...(prizes||[])]
        .join(' ')
        .replace(/```.*```/gs, ' ') // no multiline markdown code blocks
        .replace(/<pre><code[^>]*>.*\n.*<\/code><\/pre>/gs, ' ') // no multiline HTML code blocks
        .replace(/<\/?[^>]+(>|$)/gs, ' ') // no HTML tags
        .replace(/\([^)]+\)/g, ' ') // no markdown links
        .replace(/[^\w\s]/g, ' ') // no special chars
        .replace(/https?:\/\/[^\s]+/g, ' ') // no hyperlinks
        .toLowerCase()
        .split(/\s+/g)
    })
    .reduce((acc, a)=>(acc.push(...a), acc), [])
  const text = words
    .filter(s=>s) // not empty
    .filter((s, i, a)=>a.indexOf(s)===i) // unique
    .filter(s=>s.length>2&&s.length<13) // min/max length
    .filter(s=>!/^\d{3}$|^\d+\w+$|^_/.test(s)) // no numbers, underscores, or 3-digit words
    .filter(s=>!common.includes(s)) // no common words
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
    .forEach(word=>{
      const slugs = files
        .reduce((acc,file)=>{
          const {title, content, excerpt, categories, tags, clients, collaboration, prizes} = file
          const string = [title, content, excerpt, ...(categories||[]), ...(tags||[]), ...(clients||[]), ...(collaboration||[]), ...(prizes||[])]
            .join(' ')
            .replace(/<\/?[^>]+(>|$)/g, ' ')
            .replace(/[^\w\s]/g, ' ')
            .toLowerCase()
          //
          const count = string.match(new RegExp(word,'g'))?.length||0
          count>0 && acc.push({[file.type+'_'+file.slug]: count})
          return acc
        }, [])
          .sort((a,b)=>Object.values(a).pop()>Object.values(b).pop()?-1:1)
          .reduce((acc,o)=>Object.assign(acc, o), {})
      save(basePath+`s_${word}.json`, JSON.stringify(slugs), true)
    })
  console.log('saved', index.length, 'word files.')
}