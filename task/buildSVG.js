const {promisify} = require('util')
const glob = promisify(require('glob'))
const utils = require('./util/utils.js')
const {markdown2object} = require('./util/markdown2object')
const {read, save} = utils
const { DOMImplementation, XMLSerializer } = require('xmldom')

//const subjects = ['PureMVC', 'JavaScript', 'jQuery', 'Angular', 'React', 'Vue', 'Backbone']
//const sbjescts = ['#2980B9', '#FF0044', '#0769AD', '#E23137', '#149ECA', '#41B783', '#0071B5']

const subjects = [
  {name:'JavaScript', color:'#FF0044', skill:10},
  //,{name:'PureMVC', color:'#2980B9', skill:10},
  ,{name:'jQuery',    color:'#0769AD', skill:6},
  ,{name:'Angular',   color:'#E23137', skill:9},
  ,{name:'React',     color:'#149ECA', skill:8},
  ,{name:'Vue',       color:'#41B783', skill:7},
  ,{name:'Backbone',  color:'#0071B5', skill:5}
]

const svgns = 'http://www.w3.org/2000/svg'
const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null)

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

  const min = Math.min(...allRanges)
  const max = Math.max(...allRanges)

  const xmlSerializer = new XMLSerializer()
  const markupSVG = xmlSerializer.serializeToString(drawSVG(data, min, max))
  console.log('markupSVG', markupSVG) // todo: remove log
  await save('temp/graph.svg', markupSVG)
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

/**
 * Draw graph based on data
 * @param {object} data
 * @param {number} min
 * @param {number} max
 * @returns {Element}
 */
function drawSVG(data, min, max){

  console.log('data', JSON.stringify(data, null, '  ')) // todo: remove log

  const svg = document.createElementNS(svgns, 'svg')
  const width = 512
  svg.setAttributeNS(null, 'width', width)
  svg.setAttributeNS(null, 'height', 128)
  // document.body.appendChild(svg)

  // const shape = document.createElementNS(svgns, 'circle')
  // shape.setAttributeNS(null, 'cx', 25)
  // shape.setAttributeNS(null, 'cy', 25)
  // shape.setAttributeNS(null, 'r',  20)
  // shape.setAttributeNS(null, 'fill', 'green')
  //svg.appendChild(shape)

  //path.setAttributeNS(null, 'd',  'M 0 128 C 64 128, 64 30, 128 30 C 128 30, 256 30, 256 30')
  // drawPath(svg, 0,256,30, 'red')
  // drawPath(svg, 10,128,50, 'green')
  // drawPath(svg, 10,256,47, 'blue')

  ////////////////////
  Object.values(data).forEach(({name, color, skill, ranges})=>{
    ranges.forEach(({from, to})=>{
      const size = max - min
      const x1 = (from - min)/size*width
      const x2 = (to - min)/size*width
      drawPath(svg, x1, x2, 30+8*skill, color)
    })
    console.log('objects', name) // todo: remove log
  })
  ////////////////////

  return svg
}

/**
 * Draw path onto SVG document
 * @param {SVGElement} svg
 * @param {number} x1
 * @param {number} x2
 * @param {number} size
 * @param {string} color
 */
function drawPath(svg, x1, x2, size, color) {
  const margin = Math.min((x2-x1)/2, 8)
  const y = 128 - 2
  const path = document.createElementNS(svgns, 'path')
  //path.setAttributeNS(null, 'd',  'M 0 128 C 64 128, 64 30, 128 30 L 256 30')
  path.setAttributeNS(null, 'd',  `M ${x1} ${y} C ${x1+margin} ${y}, ${x1+margin} ${y-size}, ${x1+2*margin} ${y-size} L ${x2-2*margin} ${y-size} C ${x2-margin} ${y-size} ${x2-margin} ${y} ${x2} ${y} `)
  path.setAttributeNS(null, 'fill', 'transparent')
  path.setAttributeNS(null, 'stroke', color)
  path.setAttributeNS(null, 'stroke-width', '2')
  svg.appendChild(path)
}