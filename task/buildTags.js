const {promisify} = require('util')
const glob = promisify(require('glob'))
const utils = require('./util/utils.js')
const {markdown2object} = require('./util/markdown2object')
const {read, save} = utils
const { DOMImplementation, XMLSerializer } = require('xmldom')

const {target} = require('commander')
    .usage('[options] <files ...>')
    .option('--target [target]', 'Target path')
    .parse(process.argv)
    .opts()

//const subjects = ['PureMVC', 'JavaScript', 'jQuery', 'Angular', 'React', 'Vue', 'Backbone']
//const sbjescts = ['#2980B9', '#FF0044', '#0769AD', '#E23137', '#149ECA', '#41B783', '#0071B5']

const subjects = [
  {name:'JavaScript', color:'#FF0044', skill:10},
  //,{name:'PureMVC', color:'#2980B9', skill:10},
  ,{name:'jQuery',    color:'#0769AD', skill:6},
  ,{name:'Angular',   color:'#E23137', skill:9},
  ,{name:'React',     color:'#149ECA', skill:8},
  ,{name:'Vue',       color:'#41B783', skill:7},
  ,{name:'Backbone',  color:'#005485', skill:5} // 0071B5
]

writeSVG()

/**
 * Write an SVG based on markdown data
 * @returns {Promise<void>}
 */
async function writeSVG() {
  const list = await glob('src/data/markdown/fortpolio_*.md')
  const files = await Promise.all(list.map(read))
  const names = subjects.map(subject=>subject.name)
  const objects = files.map(markdown2object)
      .filter(({tags})=>{
        return tags.filter(value => names.includes(value)).length>0
      })
      .sort((object1,object2)=>{
        const from1 = getMillis(object1.from)
        const from2 = getMillis(object2.from)
        return from1>from2?1:(from1===from2?0:-1)
      })

  const data = subjects
    .reduce((acc, {name, color, skill})=>{
      acc[name] = {name, color, skill, ranges: []}
      return acc
    }, {})

  const allRanges = []

  // console.log('objects',objects) // todo: remove log

  objects.forEach(({dateFrom, dateTo, tags})=>{
    const from = getMillis(dateFrom)
    const to = getMillis(dateTo)
    allRanges.push(from, to)
    // todo here
    // console.log('tag',tag,data[tag]) // todo: remove log
    // tags.forEach(tag=>data[tag]?.ranges.push({from, to}))
    tags.forEach(tag=>addToRanges(data[tag]?.ranges,{from, to}))
  })

  // const min = Math.min(...allRanges)
  // const max = Math.max(...allRanges)

  const filtered = objects.map(({dateFrom, dateTo, tags})=>({dateFrom, dateTo, tags}))

  console.log('filtered',filtered) // todo: remove log
  await save((target||'temp')+'/tags.json', JSON.stringify(filtered))
}

/**
 * typedef {object} range
 * property {number} from
 * property {number} to
 */

/**
 * Add range to range list and merge if overlapping
 * @param {range[]} ranges
 * @param {range} range
 */
function addToRanges(ranges, range){
  const {from, to} = range
  let merged = false
  ranges?.forEach(checkRange=>{
    const {from:checkFrom, to:checkTo} = checkRange
    if (from>=checkFrom&&from<=checkTo||to>=checkFrom&&to<=checkTo) {
      checkRange.from = Math.min(from, checkFrom)
      checkRange.to = Math.max(to, checkTo)
      merged = true
    }
  })
  merged||ranges?.push(range)
}

/**
 * Convert date string to millis number
 * @param {string} date
 * @returns {number}
 */
function getMillis(date){
  return new Date(date).getTime()
}
