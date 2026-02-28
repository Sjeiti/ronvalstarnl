import { promises as fs } from 'fs'
import _glob from 'glob'
import matter from 'gray-matter'
//import validate from 'yaml-schema-validator'
import Ajv from 'ajv'

import schema from '../frontmatter.config.js'
import {promisify} from 'util'

const ajv = new Ajv()
/*const schema = {
  type: "object",
  properties: {
    foo: {type: "integer"},
    bar: {type: "string"}
  },
  required: ["foo"],
  additionalProperties: false
}*/
const validate = ajv.compile(schema)

const glob = promisify(_glob)
const { readFile } = fs

const fileName = 'src/data/markdown/fortpolio_asn.md'

;(async ()=>{

  const mds = await glob('./src/data/markdown/*.md')
  //console.log('mds', mds)

  const fileContents = await readFile(fileName, 'utf8')
  const { data } = matter(fileContents)
  if (data) {
    //const result = validate(data, { schema })
    //console.error(result)
    const valid = validate(data)
if (!valid) console.log(validate.errors)
  }
})()

