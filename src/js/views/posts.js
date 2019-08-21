import {expand} from '@emmetio/expand-abbreviation'
import {stringToElement,clean} from '../utils/html'
import {setDefault} from '../router.js'
import {nextTick} from '../utils'
import {prismToRoot} from '../utils/prism'

setDefault(
    (view,route)=>Promise.all([`/data/json/post_${route}.json`,'/data/json/media_map.json'].map(s=>fetch(s)))
      .then(results=>Promise.all(results.map(rs=>rs.json())).then(([post,media])=>{
          console.log('media',media); // todo: remove log
          console.log('post',post) // todo: remove log
              // todo; post main image to header (post.featured_media: 3427)
          clean(view)
          const time = post.date.split('T').shift()
          const title = post.title.rendered
          view.appendChild(stringToElement(
            expand(`time.blog{${time}}+h1{${title}}`)
            +post.content.rendered
          ))
          nextTick(()=>prismToRoot(view))
          return Object.assign(post,{parentSlug:'blog'})
        }),resolve404.bind(null,view,route))
)

function resolve404(view,route,error){
  console.error('resolve404 error',error)
  clean(view)
  view.appendChild(stringToElement(expand('h1.page404{404}')))
  return {title:'404'}
}
