import {searchView} from './search'
import {setDefault} from '../router'
import {nextTick, scrollToTop} from '../utils'
import {prismToRoot} from '../utils/prism'
import {componentOf} from '../component'

setDefault((view, route, params)=>fetch(`/data/json/post_${route}.json`)
    .then(rs=>rs.json(), searchView.bind(null, view, route, params))
    .then(post=>{
      const {date, title, content, header} = post
      if (header){
        const headerElm = componentOf(document.querySelector('[data-header]'))
        headerElm&&nextTick(headerElm.setImage.bind(headerElm, header))
      }
      const time = date.split('T').shift()
      view
          .expandAppend(`time.blog{${time}}+h1{${title}}`)
          .appendString(content, false)

      Array.from(view.querySelectorAll('iframe')).forEach(iframe=>{
        const {innerHTML, contentWindow: {document}} = iframe
        document.writeln(innerHTML)
      })

      nextTick(()=>{
        prismToRoot(view)
        !/^experiment-/.test(route)&&scrollToTop(document.querySelector('[data-header]'), 0)
      })
      return Object.assign(post, {parentSlug:'blog'})
    }, searchView.bind(null, view, route, params)))
