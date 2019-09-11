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
export function searchView(view, route, params, error){
  console.log('search', {view, route, params, error})
  const query = decodeURIComponent(params.query)||'' // todo 404 ... why are params not set?
  const querySplit = query.split(/\s+/g)
  const is404 = !!error
  let title = is404?'404':'search'
  //
  console.log('\tquery',query) // todo: remove log
  //
  const data = ['fortpolio-list', 'posts-list', 'pages-list']
  Promise.all(data.map(s=>fetch(`/data/json/${s}.json`).then(r=>r.json())))
      .then(([fortpolio, posts, pages])=>{
        const slugPosts = [...fortpolio, ...posts, ...pages].reduce((acc,o)=>(acc[o.slug]=o,acc),{})
        console.log('\tslugPosts',slugPosts) // todo: remove log
        //
        const querySelector = ::view.querySelector
        const existingSearch = querySelector('[data-search]')
        const exists = !!(existingSearch)
        console.log('\texists', exists)
        //
        !exists&&view.expandAppend(`h1.page404{404}+[data-search="{
            label:''
            ,submit:''
            ,placeholder:'search'
            ,autoSuggest:true
          }"]+ul.unstyled.link-list+.no-result.hidden{No results for '${query}'.}`)
        //
        const result = querySelector('.link-list')
        const noResult = querySelector('.no-result')
        querySelector('h1').classList.toggle('hidden', !is404)
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
          // .then(words=>words.filter(word=>word.includes(query.toLowerCase())))
          .then(words=>words.filter(word=>querySplit.reduce((acc,q)=>acc||word.includes(q.toLowerCase()),false)))
          .then(words=>Promise.all(words.map(word=>fetch(`${baseUri}s_${word}.json`).then(r=>r.json()))))
          // .then(a=>(console.log('alSlugs', a), a))
          .then(allSlugs=>allSlugs.reduce((acc, slugs)=>(acc.push(...slugs), acc), []))
          .then(a=>(console.log('alSlugs', a), a))

          .then(slugs=>{
            const slugAmount = slugs.reduce((acc,s)=>(acc[s]++||(acc[s]=1),acc),{})
            slugs = slugs.sort((a,b)=>slugAmount[a]>slugAmount[b]?-1:1).filter((s,i,a)=>a.indexOf(s)===i)
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
        })
  //
  return Promise.resolve({title})
}