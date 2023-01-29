const {promisify} = require('util')
const glob = promisify(require('glob'))
const utils = require('./util/utils.js')
const {markdown2object} = require('./util/markdown2object')
const {read, save} = utils

const {target} = require('commander')
    .usage('[options] <files ...>')
    .option('--target [target]', 'Target path')
    .parse(process.argv)
    .opts()

;(async function(){
  const list = await glob('src/data/markdown/fortpolio_*.md')
  const files = await Promise.all(list.map(read))
  const objects = files.map(markdown2object)
      .filter(({dateTo})=>{
        return parseInt(dateTo.substring(0, 4), 10)>=2007
      })

  const filtered = objects.map(({dateFrom, dateTo, tags})=>({dateFrom, dateTo, tags}))

  await save((target||'temp')+'/tags.json', JSON.stringify(filtered))
})()
