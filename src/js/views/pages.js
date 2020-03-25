import {add} from '../router'
import {fetchJSONFiles} from '../utils'

add(
  'contact'
  , 'about'
  , (view, route)=>{
    return fetchJSONFiles(`page_${route}`)
      .then(([page])=>(view.appendString(page.content), page))
  })
