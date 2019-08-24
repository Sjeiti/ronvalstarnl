import {expand} from '@emmetio/expand-abbreviation'
import {stringToElement, clean} from '../utils/html'
import {searchView} from './search'
import {setDefault} from '../router'
import {nextTick} from '../utils'
import {prismToRoot} from '../utils/prism'
import {component} from '../Component'
import {MEDIA_URI_HEADER} from '../config'

setDefault((view, route, params)=>fetch(`/data/json/post_${route}.json`)
    .then(rs=>rs.json(), resolve404.bind(null, view, route))
    .then(post=>{
      const {date, title:{rendered:title}, content:{rendered:content}, featured_media_file} = post
      if (featured_media_file){
        const header = component.of(document.querySelector('[data-header]'))
        header&&nextTick(header.setImage.bind(header, MEDIA_URI_HEADER+featured_media_file))
      }
      clean(view)
      const time = date.split('T').shift()
      view.appendChild(stringToElement(
        expand(`time.blog{${time}}+h1{${title}}`)
        +content
      ))
      nextTick(()=>prismToRoot(view))
      return Object.assign(post, {parentSlug:'blog'})
    }, searchView.bind(null, view, route, params)))

/**
 * View method when no routes match
 * @param {HTMLElement} view
 * @param {string} route
 * @param {object} error
 * @returns {{title: string}}
 */
function resolve404(view, route, error){
  console.error(error)
  clean(view)
  view.appendChild(stringToElement(expand('h1.page404{404}+[data-search="{label:\'\',submit:\'\',placeholder:\'search\',autoSuggest:true}"]')))
  return {title:'404'}
}
