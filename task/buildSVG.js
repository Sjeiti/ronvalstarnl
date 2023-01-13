const {promisify} = require('util')
const glob = promisify(require('glob'))
const utils = require('./util/utils.js')
const {markdown2object} = require('./util/markdown2object')
const {read, save} = utils
const { DOMImplementation, XMLSerializer } = require('xmldom')

//const subjects = ['PureMVC', 'JavaScript', 'jQuery', 'Angular', 'React', 'Vue', 'Backbone']
//const sbjescts = ['#2980B9', '#FF0044', '#0769AD', '#E23137', '#149ECA', '#41B783', '#0071B5']

const subjects = [
  {name:'JavaScript',color:'#FF0044'}, 
  //,{name:'PureMVC',color:'#2980B9'}, 
  ,{name:'jQuery',color:'#0769AD'}, 
  ,{name:'Angular',color:'#E23137'}, 
  ,{name:'React',color:'#149ECA'}, 
  ,{name:'Vue',color:'#41B783'}, 
  ,{name:'Backbone',color:'#0071B5'}
]

writeSVG()

/**
 * Write an SVG based on markdown data
 * @returns {Promise<void>}
 */
async function writeSVG() {
  const list = await glob('src/data/markdown/fortpolio_*.md')
  const files = await Promise.all(list.map(read))
  const objects = files.map(markdown2object)
      .filter(({tags})=>{
        return tags.filter(value => subjects.includes(value)).length>0
      })

  const data = subjects
    .reduce((acc, {name, color})=>{
      acc[name] = {name, color, ranges: []}
      return acc
    }, {})

  const allRanges = []

  objects.forEach(({dateFrom, dateTo, tags})=>{
    const from = getMillis(dateFrom)
    const to = getMillis(dateTo)
    allRanges.push(from, to)
    // todo here
    tags.forEach(tag=>data[tag]?.ranges.push({from, to}))
  })

  const min = Math.min(...allRanges)
  const max = Math.max(...allRanges)

  const xmlSerializer = new XMLSerializer()
  const markupSVG = xmlSerializer.serializeToString(drawSVG(data, min, max))
  console.log('markupSVG', markupSVG) // todo: remove log
  await save('temp/graph.svg', markupSVG)
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
  console.log('data',data) // todo: remove log
  const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null)
  const svgns = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(svgns, 'svg')
  const width = 256
  svg.setAttributeNS(null, 'width', width)
  svg.setAttributeNS(null, 'height', 128)
  // document.body.appendChild(svg)
  //
  const shape = document.createElementNS(svgns, 'circle')
  shape.setAttributeNS(null, 'cx', 25)
  shape.setAttributeNS(null, 'cy', 25)
  shape.setAttributeNS(null, 'r',  20)
  shape.setAttributeNS(null, 'fill', 'green')

  //svg.appendChild(shape)

  //path.setAttributeNS(null, 'd',  'M 0 128 C 64 128, 64 30, 128 30 C 128 30, 256 30, 256 30')
  const margin = 16
  const y = 128 - 2
  function drawPath(svg, from, to, size, color) {
    const path = document.createElementNS(svgns, 'path')
    //path.setAttributeNS(null, 'd',  'M 0 128 C 64 128, 64 30, 128 30 L 256 30')
    path.setAttributeNS(null, 'd',  `M ${from} ${y} C ${from+margin} ${y}, ${from+margin} ${y-size}, ${from+2*margin} ${y-size} L ${to-2*margin} ${y-size} C ${to-margin} ${y-size} ${to-margin} ${y} ${to} ${y} `)
    path.setAttributeNS(null, 'fill', 'transparent')
    path.setAttributeNS(null, 'stroke', color)
    path.setAttributeNS(null, 'stroke-width', '2')
    svg.appendChild(path)
  }
  drawPath(svg, 0,256,30, 'red')
  drawPath(svg, 10,128,50, 'green')
  drawPath(svg, 10,256,47, 'blue')

  console.log('data', data) // todo: remove log

  ////////////////////
  Object.values(data).forEach(({name, color, ranges})=>{
    ranges.forEach(({from, to})=>{
      const size = max - min
      const x1 = (from - min)/size*width
      const x2 = (to - min)/size*width
      drawPath(svg, x1, x2, 30, 'lime')
    })
    console.log('objects', name) // todo: remove log
  })
  ////////////////////

  return svg
}
