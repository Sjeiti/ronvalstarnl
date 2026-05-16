import { promises as fs } from 'fs'
import _glob from 'glob'
import matter from 'gray-matter'
import yaml from 'js-yaml'
import Ajv from 'ajv'
import path from 'node:path'
import schema from '../frontmatter.config.js'
import {promisify} from 'util'

import commander from 'commander'



const {target} = commander
        .usage('[options] <files ...>')
        .option('--target [target]', 'Target path', './src/data/markdown')
        .parse(process.argv)
        .opts()

const targetGlob = path.normalize(target+'/*.md')


const ajv = new Ajv()
const validate = ajv.compile(schema)

const glob = promisify(_glob)
const { readFile } = fs

;(async ()=>{

  const markdowns = await glob(targetGlob)

  for (const fileName of markdowns) {
    const fileContents = await readFile(fileName, 'utf8')
    const { data } = matter(fileContents, {
      engines: {
        yaml: (str) => yaml.load(str, { schema: yaml.JSON_SCHEMA }) // Use JSON_SCHEMA to avoid date parsing
      }
    })
    if (data&&Object.keys(data).length > 0) {
      const valid = validate(data)
      if (!valid) {
        console.error(fileName.replace(/^\./, '')+':0')
        console.log(JSON.stringify(validate.errors, null, '  '))
      }
    }
  }
})()

