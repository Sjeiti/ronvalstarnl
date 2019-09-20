const fetch = require('node-fetch')
const turndownInstance = new require('turndown')({headingStyle:'atx'})
const turndown = turndownInstance.turndown.bind(turndownInstance)
const marked = require('marked')
const matter = require('gray-matter')
const {promisify} = require('util')
const glob = promisify(require('glob'))
const utils = require('./util/utils.js')
const {read,save} = utils

const dir = './src/data/json/'

const files = [
  'post_strong-password-generator-bookmarklet.json'
  ,'fortpolio_ome-willem.json'
  ,'page_about.json'
]

read(dir+'taxonomies.json')
.then(JSON.parse)
.then(tx=>Object.values(tx)
  .reduce((acc,list)=>{
    list.forEach(item=>acc[item.id]=item)
    return acc
  },{})
)
.then(taxonomies=>{
  //.then(console.log)
  //
  glob(dir+'@(page|fortpolio|post)_*.json')
  //.then(a=>a.map)
  .then(console.log)
  //
  //
  files.forEach(file=>{
    Promise.all([
      read(dir+file).then(JSON.parse)
      ,Promise.resolve(dir+file)
    ])
      .then(([page,file])=>{
        const type = file.match(/\/([^_\/]+)_[^\/]+\.json/).pop()
        const fileName = file.split('/').pop()
        const {
          id
          ,date
          ,slug
          ,tags
          ,categories
          ,collaboration
          ,prizes
          ,'meta-datefrom':dateFrom
          ,'meta-dateTo':dateTo
          ,'meta-incv':inCv
          ,'meta-inportfolio':inPortfolio
          ,'meta-cvcopy': cvCopy
          ,'meta-uri':uri
          ,media
          ,image
        } = page
        const title = page.title.rendered||page.title
        const content = page.content.rendered||page.content
        const excerpt = turndown(page.excerpt.rendered||page.excerpt)

        tags&&tags.forEach((id,i,a)=>a[i]=taxonomies[id].name)
        categories&&categories.forEach((id,i,a)=>a[i]=taxonomies[id].name)
        prizes&&prizes.forEach((id,i,a)=>a[i]=taxonomies[id].name)
        collaboration&&collaboration.forEach((id,i,a)=>a[i]=taxonomies[id].name)
        
        const metaObj = {type,slug}
        if (type==='post'){
          Object.assign(metaObj,{
            date
          })
        }
        if (type==='post'||type==='fortpolio'){
          Object.assign(metaObj,{
            tags: tags&&tags.join(', ')
            ,categories: categories.join(', ')
            ,excerpt
          })
        }
        if (type==='fortpolio'){
          Object.assign(metaObj,{
            dateFrom
            ,dateTo
            ,inCv
            ,inPortfolio
            ,cvCopy
            ,uri
            ,prizes: prizes.join(', ')
            ,collaboration: collaboration.join(', ')
            ,image: image.full.split('/').pop()
            ,media: media.map(m=>m.full.split('/').pop()).join(', ')
          })
        }

        const meta = Object.entries(metaObj)
          .map(a=>a.join(': '))
          .join(`
`)

        const md = generateMd(meta,title,content)
        save('temp/'+fileName.replace(/json$/,'md'),md)

        return md

      })
      //.then(o=>save('temp/'+fileName.replace(/json$/,'md'),o))

      //.then(o=>(console.log(o),o))
/*
      .then(matter)
      .then(o=>(console.log(o),o.content))
      .then(marked)
      .then(console.log)
*/
      .catch(console.error)
  })
})
.catch(console.error)


function generateMd(meta,title,content){
  return `---
${meta}
---

# ${title}

${turndown(content)}`
}
