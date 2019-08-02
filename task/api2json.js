const fetch = require('node-fetch')
const utils = require('./util/utils.js')
const {read,save} = utils

const baseApiUri = 'https://ronvalstar.nl/api'
const saveEndpoints = [
  /*'/rv/v1/fortpolio'
  ,'/wp/v2/types'
  ,'/wp/v2/taxonomies'
  ,'/wp/v2/categories'
  ,'/wp/v2/tags'*/
  '/wp/v2/posts'
  ,'/wp/v2/pages'
  ,'/rv/v1/fortpolio'

  ,'/rv/v1/taxonomies'

  //,'/wp/v2/posts/3366'
]

const paging = '?per_page=99&page=3' 

false&&fetch(baseApiUri)
  .then(rs=>rs.json())
  .then(api=>{
    const routes = Object.keys(api.routes)
      //.filter(r=>r.methods.includes('GET'))
      //.map(r=>r.endpoints[0])
    console.log(routes)
    //console.log(JSON.stringify(routes[24]))
    //console.log(api.routes)
    //for (var s in api.routes[0])console.log(s)
  })

saveEndpoints.forEach(p=>{
  fetch(baseApiUri+p+paging)
    .then(rs=>rs.json())
    .then(s=>{
      s.forEach(item=>{
        const {id,type,slug} = item
        save(`./temp/${type}_${slug}.json`,JSON.stringify(item,null,2))
      })
    })
})

// posts-list
false&&fetch(baseApiUri+'/wp/v2/posts?per_page=99')
  .then(rs=>rs.json())
  .then(posts=>posts.map(post=>({
    id: post.id
    ,date: post.date
    ,title: post.title.rendered
    ,slug: post.slug
  })))
  .then(posts=>{
    save('temp/posts-list.json',JSON.stringify(posts))
  })
