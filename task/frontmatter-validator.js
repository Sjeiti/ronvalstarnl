import { promises as fs } from 'fs'
import _glob from 'glob'
import matter from 'gray-matter'
import yaml from 'js-yaml'
import Ajv from 'ajv'

import schema from '../frontmatter.config.js'
import {promisify} from 'util'

const ajv = new Ajv()
const validate = ajv.compile(schema)

const glob = promisify(_glob)
const { readFile } = fs

;(async ()=>{

  const markdowns = await glob('./src/data/markdown/*.md')

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
        console.log(validate.errors)
      }
    }
  }
})()

