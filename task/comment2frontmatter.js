import { promises as fs } from 'fs'
import _glob from 'glob'
import {marked} from 'marked'
import matter from 'gray-matter'
import yaml from 'js-yaml'
import Ajv from 'ajv'

import schema from '../frontmatter.config.js'
import {promisify} from 'util'
import {save} from './util/utils.js'

const ajv = new Ajv()
const validate = ajv.compile(schema)

const glob = promisify(_glob)
const { readFile } = fs




const arrayKeys = ['tags', 'categories', 'collaboration', 'clients', 'prizes', 'images','headerClassName','related']
const booleanKeys = ['inCv', 'inPortfolio', 'sticky']
const markdownKeys = ['excerpt', 'excerptNl']
const map = {
  tag: 'tags',
  category: 'categories'
}


;(async ()=>{

  const markdowns = await glob('./src/data/markdown/*.md')
  for (let i=0,l=markdowns.length;i<l;i++){
    const fileName = markdowns[i]
    const fileContents = await readFile(fileName, 'utf8')
    const { data, content } = matter(fileContents, {
      engines: {
        yaml: (str) => yaml.load(str, { schema: yaml.JSON_SCHEMA }) // Use JSON_SCHEMA to avoid date parsing
      }
    })

    const hasFrontmattersData = Object.entries(data).length>0
    if(!hasFrontmattersData){
      const data = getCommentData(content)
      if (!data.hasOwnProperty('type')) data.type = 'post'
      const newLine = '\n'
      const yaml = Object.entries(data).reduce((acc, [key,value])=>{

        key = map[key]||key

        const isEmpty = value==='' || (Array.isArray(value)&&value.length===0)
        if (isEmpty) return acc

        const trimmed = value.trim?.()||value

        const asComment = ['excerptNl'].includes(key)
        const ifComment = asComment?'#':''

        const block = `|\n${ifComment}  `

        const hasLinebreak = /[\n]/.test(trimmed)
        const hasColon = /[:]/.test(trimmed)

        const isArray = arrayKeys.includes(key)

        const isClass = key==='headerClassName'

        const formattedValue = 
          isArray?`[${isClass?value[0].split(/\s/):value}]`
          :(
            hasLinebreak
            ?block+trimmed.replace(/\n\r?\s*/g,`\n${ifComment}  `)
            :(hasColon?block+value:value)
          )

        return acc 
          + (acc&&newLine) 
          + ifComment + key
          + ': '
          + formattedValue
      }, '')
      const fmDel = '---'+newLine
      const newFileContents = fmDel+yaml+newLine+fmDel+newLine+content.replace(/^[\s\r\n]*<!--[\s\S]*?-->[\s\r\n]*/,'')
      const tempFile = fileName.replace('./src/data/', './temp/data/')
      await save(tempFile, newFileContents, true)
    }
  }
})()


/**
 * Read markdown contents HTML comment data
 * @param {string} contents
 * @returns {object}
 */
function getCommentData(contents){

  const lines = contents.trim().split(/\r\n|\r|\n/g)

  const hasComments = /^\s*<!--\s*$/.test(lines[0])
  const endComments = hasComments?firstMatchIndex(lines, /^\s*-->\s*$/):-1

  const metaLines = hasComments&&lines.slice(1, endComments)
      .reduce((acc, line)=>{
        const isKeyVal = /\s\s\w+:\s*/.test(line)
        isKeyVal
            ?acc.push(line)
            :acc[acc.length-1] += '\n'+line
        return acc
      }, [])||[]

  const meta = metaLines.reduce((acc, line)=>{
    const [, key, value] = line?.match(/^\s\s(\w+):\s*([\s\S]*)\s*$/)
    if (arrayKeys.includes(key)) acc[key] = value.split(/,\s*/).filter(o=>o)
    else if (booleanKeys.includes(key)) acc[key] = value.trim()==='true'
    else if (markdownKeys.includes(key)||value.includes('\n')) acc[key] = marked(value)
    else acc[key] = value
    return acc
  }, {})

  return meta
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
