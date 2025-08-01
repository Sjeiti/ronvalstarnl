import {add} from '../router.js'
import {clean, expand} from '../utils/html.js'
import {fetchJSONFiles, getZenIcon, nextTick} from '../utils/index.js'
import {search, change} from '../component/Search.js'
import {open} from '../router.js'
import {initialise} from '../component/index.js'

search.add(query=>open(`/search/${encodeURIComponent(query)}`))

add('search/:query', 'search', searchView)

/**
 * View method for search
 * @param {View} view
 * @param {string} route
 * @param {object} params
 * @param {object} error
 * @returns {Promise<{title: string}>}
 */
export function searchView(view, route, params, error){
  const is404 = !!error
  let title = is404?'404':'search'
  //
  const data = ['fortpolio-list', 'posts-list', 'pages-list']
  Promise.all(data.map(s=>fetch(`/data/json/${s}.json`).then(r=>r.json())))
      .then(([fortpolio, posts, pages])=>{
        const query = !is404?decodeURIComponent(params?.query)||'':location.pathname.replace(/[^a-zA-Z]+/g, ' ').trim() // todo 404 ... why are params not set?
        const querySplit = query.split(/\s+/g)
        // todo portfolio items, posts and page slugs might collide in search results (fix by prefixing slug)
        const slugPosts = [...fortpolio, ...posts, ...pages].reduce((acc, o)=>(acc[o.slug]=o, acc), {})
        const sortyQueryTitle = sortSlugByTitleAndQuery.bind(null, querySplit, slugPosts)
        //
        const querySelector = view.querySelector.bind(view)
        const existingSearch = querySelector('[data-search]+ul.unstyled.link-list')
        const exists = !!existingSearch
        //
        !exists&&view.expandAppend(`h1.page404{404}
          +[data-search="{
            label:''
            ,submit:''
            ,placeholder:'search'
            ,autoSuggest:true
          }"]
          +ul.unstyled.link-list
          +.no-result.hidden{No results for '${query}'.}
        `)
        //
        const result = querySelector('.link-list')
        const noResult = querySelector('.no-result')
        querySelector('h1').classList.toggle('hidden', !is404)
        nextTick(change.dispatch.bind(change, query))
        //
        const baseUri = '/data/search/'
        fetch(baseUri+'words.json')
          .then(rs=>rs.json())
          .then(words=>words.filter(word=>querySplit.reduce((acc, q)=>acc||word.includes(q.toLowerCase()), false)))
          .then(words=>Promise.all(words.map(word=>fetch(`${baseUri}s_${word}.json`).then(r=>r.json()))))
          // merge and add slugs and sort by amount
          .then(allSlugs=>allSlugs.reduce((acc, slugs)=>{
            Object.entries(slugs).forEach(([key, amount])=>{
              const has = acc.hasOwnProperty(key)
              if (has) acc[key] += amount
              else     acc[key] = amount
            })
            return Object.fromEntries(Object.entries(acc)
                .sort(([,a],[,b]) => b - a))
          },{}))
          //
          .then(slugs=>{
            const entries = Object.entries(slugs)
            const maxAmount = Math.max(...entries.map(([,amount])=>amount))
            const {length} = entries
            noResult.classList.toggle('hidden', !!length)
            noResult.textContent = noResult.textContent.replace(/'.*'/, `'${query}'`)
            clean(result).insertAdjacentHTML('beforeend', expand(
                entries
                  .map(([slug, amount])=>{
                    const uri = getSlugUri(slug)
                    const splitSlug = slug.split('_')
                    const key = splitSlug.pop()
                    const type = splitSlug.shift()
                    const icon = getZenIcon(type)
                    const amountRelativeValue = Math.ceil(amount/maxAmount*5)
                    return `li.amnt${amountRelativeValue}>a[href="${uri}"]>((${icon})+{${slugPosts[key]?.title}})`
                  }).join('+')
            ))
            initialise(result)
            fetchJSONFiles()
          })
          .catch(console.warn.bind(console, 'eerr'))
        })
  //
  return Promise.resolve({title})
}

export async function searchWords(words){
  const baseUri = '/data/search/'
  const allWords = await fetch(baseUri+'words.json').then(rs=>rs.json())
  const w = allWords.filter(word=>words.reduce((acc, q)=>acc||word.includes(q.toLowerCase()), false))
  return (await Promise.all(w.map(word=>fetch(`${baseUri}s_${word}.json`).then(r=>r.json()))))
    .reduce((acc, slugs)=>{
      Object.entries(slugs).forEach(([key, amount])=>{
        const has = acc.hasOwnProperty(key)
        if (has) acc[key] += amount
        else     acc[key] = amount
      })
      return Object.fromEntries(Object.entries(acc)
          .sort(([,a],[,b]) => b - a))
    },{})
}

/**
 * Sort a list of slugs by the amount the query words occur in the slugs title
 * @param {string[]} querySplit
 * @param {object} slugPosts
 * @param {string} slugA
 * @param {string} slugB
 * @return {number}
 */
function sortSlugByTitleAndQuery(querySplit, slugPosts, slugA, slugB){
  const titleA = slugPosts[slugA.split('_').pop()]?.title.toLowerCase()||''
  const titleB = slugPosts[slugB.split('_').pop()]?.title.toLowerCase()||''
  let pointsA = 0
  let pointsB = 0
  querySplit.map(s=>s.toLowerCase()).forEach(word=>{
    titleA.includes(word)&&pointsA++
    titleB.includes(word)&&pointsB++
  })
  return pointsA>pointsB?-1:1
}

/**
 * Convert an underscore delimited slug to an uri
 * @param {string} slug
 * @return {string}
 */
function getSlugUri(slug){
  const [type, key] = slug.split('_')
  return `${type==='fortpolio'?'/project':''}/${key}`
}
