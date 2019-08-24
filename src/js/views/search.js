import {expand} from '@emmetio/expand-abbreviation'
import {add} from '../router'
import {clean} from '../utils/html'
import {nextTick} from '../utils'
import {search, change} from '../component/Search'
import {open} from '../router'

search.add(query=>open(`/search/${encodeURIComponent(query)}`))

add('search/:query', 'search', searchView)

/**
 * View method for search
 * @param {HTMLElement} view
 * @param {string} route
 * @param {object} params
 * @param {object} error
 * @returns {{title: string}}
 */
export function searchView(view, route, params, error) {
  console.log('search', view, route, params, error)
  const {query} = params||{} // todo 404 ... why are params not set?
  const is404 = !!error
  let title = is404?'404':'search'
  //
  //
  const slugPosts = {}
  const data = ['fortpolio-list', 'posts-list', 'pages-list']
  Promise.all(data.map(s=>fetch(`/data/json/${s}.json`).then(r=>r.json())))
    .then(([fortpolio, posts])=>{
      //[...fortpolio,...posts].forEach(o=>console.log(o.slug))
      ;[...fortpolio, ...posts].forEach(o=>slugPosts[o.slug]=o)
    })
  //
  //
  const qs = view.querySelector.bind(view)
  const existingSearch = qs('[data-search]')
  const exists = !!(existingSearch)
  console.log('\texists', exists)
  //
  !exists&&view.expandAppend(`h1.page404{404}+[data-search="{
      label:''
      ,submit:''
      ,placeholder:'search'
      ,autoSuggest:true
    }"]+ul.unstyled.page-lis.page-list.result+.no-result.hidden{No results for '${query}'.}`)
  //
  const result = qs('.result')
  const noResult = qs('.no-result')
  qs('h1').classList.toggle('hidden',!is404)
  nextTick(change.dispatch.bind(change, query))
  //
  //
  const getSlugUri = slug=>{
    const [type, key] = slug.split('_')
    return `${type==='fortpolio'?'/project':''}/${key}`
  }
  //
  const baseUri = '/data/search/'
  fetch(baseUri+'words.json')
    .then(rs=>rs.json())
    .then(words=>words.filter(word=>word.includes(query.toLowerCase())))
    .then(words=>Promise.all(words.map(word=>fetch(`${baseUri}s_${word}.json`).then(r=>r.json()))))
    .then(a=>(console.log('alSlugs', a), a))
    .then(allSlugs=>allSlugs.reduce((acc, slugs)=>(acc.push(...slugs), acc), []))
    .then(slugs=>{
      const {length} = slugs
      noResult.classList.toggle('hidden', !!length)
      noResult.textContent = noResult.textContent.replace(/'.*'/, `'${query}'`)
      clean(result).insertAdjacentHTML('beforeend', expand(
        slugs.map(slug=>{
          const uri = getSlugUri(slug)
          const key = slug.split('_').pop()
          return `li>a[href="${uri}"]{${slugPosts[key]?.title}}`
        }).join('+')
      ))
    })
    .catch(console.warn.bind(console, 'eerr'))
  //
  return Promise.resolve({title})
}