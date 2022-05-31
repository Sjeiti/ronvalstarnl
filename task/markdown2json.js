const marked = require('marked')
const {promisify} = require('util')
const glob = promisify(require('glob'))
const utils = require('./util/utils.js')
const {save, read} = utils

const arrayKeys = ['tags', 'categories', 'collaboration', 'clients', 'prizes', 'images']
const booleanKeys = ['inCv', 'inPortfolio', 'sticky']
const t = s=>(new Date(s)).getTime()||Number.MAX_VALUE


// const renderer = {
//   html(html) {
//     const match = html.match(/^(<template[^>]+>)(.*)(<\/template>)$/);
//     return match&&match.join('')||html;
//   }
// };
marked.use({ renderer: { html: s => s } })


glob('src/data/markdown/+(post|fortpolio|page)_*.md')
    .then(files=>Promise.all(files.map(read)))
    .then(files=>files.map(markdown2object))

    .then(posts=>{
      posts.sort((p1, p2)=>t(p1.date)>t(p2.date)?1:-1)
      return posts
    })

    .then(saveObjectsToJSON)
    .then(saveObjectsToLists)

/**
 * Convert markdown string data to an object literal with meta data
 * @param {string} contents
 * @returns {object}
 */
function markdown2object(contents){
  const lines = contents.trim().split(/\r\n|\r|\n/g)
  const hasComments = /^\s*<!--\s*$/.test(lines[0])
  const endComments = hasComments?firstMatchIndex(lines, /^\s*-->\s*$/):-1
  const metaLines = hasComments&&lines.slice(1, endComments)||[]
  const meta = metaLines.reduce((acc, line)=>{
    const [key, value] = line.trim().split(/\s*:\s*(.*)/)
    if (arrayKeys.includes(key)) acc[key] = value.split(/,\s*/).filter(o=>o)
    else if (booleanKeys.includes(key)) acc[key] = value==='true'
    else acc[key] = value
    return acc
  }, {})
  const contentLines = lines.slice(endComments+1)
  const titleIndex = firstMatchIndex(contentLines, /^\s*#\s(.*)$/)
  const title = (titleIndex!==-1&&contentLines[titleIndex].match(/#(.*)/).pop()||'').trim()
  const content = marked(contentLines.slice(titleIndex+1).join('\n').trim(), {breaks: true/*, gfm: true*/})
      .replace(/<!--jsfiddle:(\w+)-->/g, `
        <div data-jsfiddle="$1"></div>
        <!--<div>
        <iframe src="//jsfiddle.net/Sjeiti/$1/embedded/result/"></iframe>
        <a href="https://jsfiddle.net/Sjeiti/$1/">https://jsfiddle.net/Sjeiti/$1/</a>
        <script async src="//jsfiddle.net/Sjeiti/$1/embed/js,html,css,result/dark/"></script>
        </div>-->
      `)
  return Object.assign(meta, {title, content})
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

/**
 * Save the page-object to json
 * @param {object[]} objects
 * @returns {object[]}
 */
function saveObjectsToJSON(objects){
  objects.forEach(obj=>{
    if (obj.slug&&obj.type){
      const fileName = `src/data/json/${obj.type}_${obj.slug}.json`
      save(fileName, JSON.stringify(obj), true)
    }
  })
  return objects
}

/**
 * Save the page-object to json
 * @param {object[]} objects
 * @returns {object[]}
 */
function saveObjectsToLists(objects){
  const listPages = objects.filter(o=>o.type==='page')
  const listPosts = objects.filter(o=>o.type==='post')
  const listProjects = objects.filter(o=>o.type==='fortpolio'&&(o.inCv||o.inPortfolio))
  save('src/data/json/pages-list.json', JSON.stringify(listPages.map(({slug, title})=>({slug, title}))))
  save('src/data/json/posts-list.json', JSON.stringify(listPosts.map(({date, slug, title, sticky})=>({date, slug, title, sticky})).sort((a, b)=>{
    const aa = new Date(a.date)
    const bb = new Date(b.date)
    return aa>bb?-1:(aa<bb?1:0)
  })))
  save('src/data/json/fortpolio-list.json', JSON.stringify(listProjects))
  return objects
}
