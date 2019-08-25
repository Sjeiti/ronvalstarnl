import {add} from '../router'

add(
  'contact'
  , 'about'
  , (view, route)=>{
    console.log(`fetch: /data/json/page_${route}.json`)
    return fetch(`/data/json/page_${route}.json`)
      .then(rs=>rs.json())
      .then(page=>(view.appendString(page.content.rendered), page))
  })
