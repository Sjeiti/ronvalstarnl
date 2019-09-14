import {add} from '../router'

add(
  'contact'
  , 'about'
  , (view, route)=>{
    return fetch(`/data/json/page_${route}.json`)
      .then(rs=>rs.json())
      .then(page=>(view.appendString(page.content.rendered), page))
  })
