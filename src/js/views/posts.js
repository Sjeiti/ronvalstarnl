import {searchView} from './search'
import {setDefault} from '../router'
import {nextTick} from '../utils'
import {prismToRoot} from '../utils/prism'
import {component} from '../Component'
import {MEDIA_URI_HEADER} from '../config'

setDefault((view, route, params)=>fetch(`/data/json/post_${route}.json`)
    .then(rs=>rs.json(), searchView.bind(null, view, route, params))
    .then(post=>{
      const {date, title, content, featured_media_file} = post
      if (featured_media_file){
        const header = component.of(document.querySelector('[data-header]'))
        header&&nextTick(header.setImage.bind(header, MEDIA_URI_HEADER+featured_media_file))
      }
      const time = date.split('T').shift()
      view
          .expandAppend(`time.blog{${time}}+h1{${title}}`)
          .appendString(content, false)

      nextTick(()=>prismToRoot(view))
      return Object.assign(post, {parentSlug:'blog'})
    }, searchView.bind(null, view, route, params)))
