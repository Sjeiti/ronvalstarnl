import {expand} from '@emmetio/expand-abbreviation'
import {stringToElement,clean} from '../utils/html'
import {setDefault} from '../router.js'
import {nextTick} from '../utils'
import {prismToRoot} from '../utils/prism'
import {component} from '../Component'

setDefault((view,route)=>fetch(`/data/json/post_${route}.json`)
    .then(rs=>rs.json(),resolve404.bind(null,view,route))
    .then(post=>{
      const {date, title:{rendered:title}, content:{rendered:content}, featured_media_file} = post
      if (featured_media_file) {
        const header = component.of(document.querySelector('[data-header]'))
        header&&nextTick(header.setImage.bind(header,`http://ronvalstar.nl/wordpress/wp-content/uploads/${featured_media_file}`))
      }
      clean(view)
      const time = date.split('T').shift()
      view.appendChild(stringToElement(
        expand(`time.blog{${time}}+h1{${title}}`)
        +content
      ))
      nextTick(()=>prismToRoot(view))
      return Object.assign(post,{parentSlug:'blog'})
    },resolve404.bind(null,view,route)))

function resolve404(view,route,error){
  console.error(error)
  clean(view)
  view.appendChild(stringToElement(expand('h1.page404{404}')))
  return {title:'404'}
}
