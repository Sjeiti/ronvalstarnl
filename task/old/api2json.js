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

//////////////////////////////////////////////////////////////
// const perPage = 100
// const mediaUri = `http://ronvalstar.nl/api/wp/v2/media?per_page=${perPage}&page=`
//
// getMedia().then(media=>{
//   save(`./temp/media.json`,JSON.stringify(media,null,2))
//   save(`./temp/media_map.json`,JSON.stringify(media.map(o=>({id:o.id,file:o.source_url.split('/').pop()})),null,2))
// })
//
// function getMedia(nr=1,fullList=[]){
// 	return fetch(mediaUri+nr)
//       .then(rs=>rs.json())
//       .then(list=>list&&list.length&&getMedia(nr+1,[...fullList,...list])||fullList)
// }
//////////////////////////////////////////////////////////////
// return


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

read('src/data/json/media_map.json')
  .then(media=>{
    const mediaMap = Object.values(JSON.parse(media)).reduce((acc,{id,file})=>acc.set(id,file),new Map())
    saveEndpoints.forEach(p=>{
      fetch(baseApiUri+p+paging)
        .then(rs=>rs.json())
        .then(s=>{
          // console.log('s',s) // todo: remove log
          s.forEach(item=>{
            const {id,type,slug} = item
            if (type==='post'&&item.featured_media) {
              item.header = mediaMap.get(item.featured_media)
            }
            save(`./temp/${type}_${slug}.json`,JSON.stringify(item,null,2))
          })
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
