import {searchView} from './search'
import {setDefault} from '../router'
import {nextTick, scrollToTop} from '../utils'
import {prismToRoot} from '../utils/prism'
import {component} from '../Component'

setDefault((view, route, params)=>fetch(`/data/json/post_${route}.json`)
    .then(rs=>rs.json(), searchView.bind(null, view, route, params))
    .then(post=>{
      const {date, title, content, header} = post
      if (header){
        const headerElm = component.of(document.querySelector('[data-header]'))
        headerElm&&nextTick(headerElm.setImage.bind(headerElm, header))
      }
      const time = date.split('T').shift()
      view
          .expandAppend(`time.blog{${time}}+h1{${title}}`)
          .appendString(content, false)

      nextTick(()=>{
        prismToRoot(view)
        scrollToTop(document.querySelector('[data-header]'), 0)
      })
      return Object.assign(post, {parentSlug:'blog'})
    }, searchView.bind(null, view, route, params)))
