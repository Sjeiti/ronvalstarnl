const {promisify} = require('util')
const glob = promisify(require('glob'))
const utils = require('./util/utils.js')
const {save} = utils

const taxonomies = [...Object.values(require('../src/data/json/taxonomies.json'))].reduce((acc, o)=>{
  o.forEach(tx=>acc[tx.id] = tx.name||tx.slug)
  return acc
}, [])

glob('src/data/json/+(post|fortpolio|page)_*.json').then(files=>{
  files.forEach(fileGlob=>{
    const fileMarkdown = `src/data/markdown/${fileGlob.split(/\//g).pop().replace(/.json$/, '')}.md`
    const file = require(`../${fileGlob}`)
    const {id, ID, date, modified, slug, type, excerpt, content, categories, tags} = file
    const isFortpolio = type==='fortpolio'
    const meta = {
      id: id||ID
      ,date
      ,modified
      ,slug
      ,type
      ,excerpt: (excerpt.rendered&&excerpt.rendered||excerpt).toString().replace(/\s/g, ' ')
      ,content: (content.rendered&&content.rendered||content).toString().replace(/\s/g, ' ')
      ,categories: categories&&categories.map(id=>taxonomies[id])||''
      ,tags: tags&&tags.map(id=>taxonomies[id])||''
    }
    if (type==='fortpolio') {
      const {'meta-datefrom':datefrom, 'meta-dateto':dateto, 'meta-incv':incv, 'meta-inportfolio':inportfolio, clients, collaboration, prizes, media, image} = file
      Object.assign(meta, {
        datefrom
        ,dateto
        ,incv: isFortpolio?incv==='on':''
        ,inportfolio: isFortpolio?inportfolio==='on':''
        ,clients: clients&&clients.map(id=>taxonomies[id])||''
        ,collaboration: collaboration&&collaboration.map(id=>taxonomies[id])||''
        ,prizes: prizes&&prizes.map(id=>taxonomies[id])||''
        ,thumbnail: image&&image.full.split(/\//g).pop()
        ,image: image&&image.full.split(/\//g).pop()
        ,images: media.map(image=>image.full.split(/\//g).pop())
      })||''
    }

    save(fileMarkdown, `<!--
${Object.entries(meta).filter(([key, value])=>value!==undefined&&value!=='').map(([key, value])=>`  ${key}: ${value}`).join('\n')}
-->

# ${file.title.rendered||file.title}

${file.content.rendered||file.content}
`)
  })
})