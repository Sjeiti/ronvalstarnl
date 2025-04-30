import {add} from '../router.js'
import {fetchJSONFiles} from '../utils/index.js'

add(
  'contact'
  , 'colofon'
  , 'about'
  , 'history'
  , (view, route)=>{
    return fetchJSONFiles(`page_${route}`)
      .then(([page])=>(view.appendString(page.content), page))
  })
