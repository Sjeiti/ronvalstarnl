import express from 'express'

import {marked} from 'marked'
import {promisify} from 'util'
import _glob from 'glob'
import matter from 'gray-matter'
import yaml from 'js-yaml'

import {save, read} from './util/utils.js'
import {markdown2object} from './util/markdown2object.js'

const glob = promisify(_glob)


export const api = express.Router()
    .get('/', getApi)
    .post('/post', postPost)

/**
 * @param {Request} req
 * @param {Response} res
 */
function getApi(req, res) {
  res?.status(200).json({
    message: 'success'
    , now: Date.now()
  })  
}

/**
 * @param {Request} req
 * @param {Response} res
 */
async function postPost(req, res) {

  const {id,options} = req.body

  const files = await glob('src/data/markdown/+(post|fortpolio|page)_*.md')

  const pathAndContents = await Promise.all(files.map(async path=>{
    const raw = await read(path)
    const { data, content } = matter(raw, {
      engines: {
        yaml: (str) => yaml.load(str, { schema: yaml.JSON_SCHEMA }) // Use JSON_SCHEMA to avoid date parsing
      }
    })
    return { data, content, path, raw }
  }))

  const found = pathAndContents.find(o=>o.data?.slug===id)
  const {path,raw} = found

  const newLine = '\n'
  const newCat = 'categories: ['+options.join(',')+']'+newLine
  const catReg = /\ncategories:\s?\[.*]\n/
  const frtReg = /\n---\n\n/
  const hasCat = catReg.test(raw)
  const newContents = hasCat
    ?raw.replace(catReg,newLine+newCat)
    :raw.replace(frtReg,newLine+newCat+'---'+newLine+newLine)
  
  await save(found.path, newContents, true)

  res.json({
    success:true
    ,path
    ,options
  })
}

