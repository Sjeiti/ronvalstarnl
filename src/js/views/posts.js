import {searchView} from './search.js'
import {setDefault} from '../router.js'
import {fetchJSONFiles, getZenIcon, nextTick, nextFrame, scrollToTop, todayOlderFilter} from '../utils/index.js'
import {prismToRoot} from '../utils/prism.js'
import {componentOf} from '../component/index.js'
import {signal} from '../signal/index.js'
import {searchWords} from './search.js'

setDefault((view, route, params)=>fetchJSONFiles(`post_${route}`, 'posts-list', 'fortpolio-list')
    .then(([post, posts, fortpolios])=>{

      setHeaderImage(post)

      view
          .expandAppend(getBlogHeading(post))
          .appendString(post.content, false)
          .expandAppend('[data-comment]', false)
          .expandAppend(getRelatedLinks(post, posts, fortpolios), false)
          .expandAppend(getBottomNavigation(post, posts), false)

      Array.from(view.querySelectorAll('iframe')).forEach(iframe=>{
        const {innerHTML, contentWindow: {document}} = iframe
        document.writeln(innerHTML)
      })

      view.querySelector('[data-request-fullscreen]')?.addEventListener('click',()=>{
        signal?.requestFullScreen.dispatch()
      })

      nextTick(()=>{
        prismToRoot(view)
        nextFrame(()=>{
          !(/^experiment-/.test(route))&&scrollToTop(document.querySelector('[data-header]'), 0)
        },10)
      })

      return Object.assign(post, {
        parentSlug: /^experiment-/.test(post.slug)?'experiments':'blog'
      })
    }, searchView.bind(null, view, route, params)))

/**
 * Set the header image if present
 * @param {Post} post
 * @return {boolean}
 */
function setHeaderImage(post){
  const {header, headerColofon, headerClassName} = post
  if (header){
    const headerComp = componentOf(document.querySelector('[data-header]'))
    headerComp&&nextTick(headerComp.setImage.bind(headerComp, header, headerColofon, headerClassName))
  }
  return !!header
}

/**
 * Create the post heading
 * @param {Post} post
 * @return {string}
 */
function getBlogHeading(post){
  const {date, title, slug} = post
  const time = date.split('T').shift()
  const isExperiment = /^experiment-/.test(slug)

  const fullscreen = isExperiment?'+button.btn.request-fullscreen[data-request-fullscreen]{fullscreen experiment}':''

  return `time.blog[datetime=${time}]{${time}}${fullscreen}+h1{${title}}`
}

/**
 * Create a list of related elements
 * @param {Post} post
 * @param {PageIndex[]} posts
 * @param {PageIndex[]} fortpolios
 * @return {string}
 */
async function getRelatedLinks(post, posts, fortpolios){

  let returnvalue = ''
  const {slug, related} = post

  function getSlugRelations(slug/*, posts, fortpolios*/){
    const slog = slug.replace(/^project\//, '')
    const regex = new RegExp(slug.replace('*','.*'))
    return [
        ...posts.filter(p => p.slug===slug || regex.test(p.slug))
      , ...fortpolios.filter(p => p.slug===slug || p.slug===slog)
    ]
  }

  if (related){

    const relatedDocs = related.split(/\s/g)
          .map(slug=> {
            const slog = slug.replace(/^project\//, '')
            const regex = new RegExp(slug.replace('*','.*'))
            return [
                ...posts.filter(p => p.slug===slug || regex.test(p.slug))
              , fortpolios.find(p => p.slug===slug || p.slug===slog)
            ]
          })
          .reduce((acc, docs)=>(acc.push(...docs),acc), [])
          .filter(p=>p&&p.slug!==slug)
    relatedDocs.length>5&&relatedDocs.sort(()=>Math.random()<0.5?-1:1).splice(5, 1E9)
    const relatedLi = relatedDocs
          .map(({slug, title, type})=>`li>a[href="/${type==='fortpolio'?'project/':''}${slug}"]>((${getZenIcon(type)})+{${title}})`)
          .join('+')
    returnvalue = `.related>(h4{Related:}+ul.unstyled.link-list.related__list>${relatedLi})`

  } else {

    // search
    if (post.tags) {
      const tags = post.tags.reduce((acc,s)=>{
        acc.push(...s.split(/\s/))  
        return acc
      },[]).filter(n=>n)
      //
      const slugs = await searchWords(tags)
      // not current
      const postSlug = post.type+'_'+post.slug
      delete slugs[postSlug]
      // highest values
      const [highest] = Object.values(slugs)
      const slugsTop = Object.entries(slugs)
        .filter((key,value)=>value>(highest/2))
        .map(([key])=>key)
        .slice(0,5)
      //
      const pages = slugsTop
        .map(slug=>getSlugRelations(slug.replace(/^\w+_/,'')/*, posts, portfolios*/))
        .reduce((acc,a)=>{
          acc.push(...a)
          return acc
        },[])
        .filter(n=>n)
        .slice(0,5)
      //
      const hasRelated = pages.length>0
      const relatedLi = pages//relatedDocs
            .map(({slug, title, type})=>`li>a[href="/${type==='fortpolio'?'project/':''}${slug}"]>((${getZenIcon(type)})+{${title}})`)
            .join('+')
      returnvalue = hasRelated && `.related>(h4{Related:}+ul.unstyled.link-list.related__list>${relatedLi})` || ''

    }

  }

  return returnvalue
}

/**
 * The bottom navigation are the previous/next links in time
 * @param {string} post
 * @param {Array} posts
 * @return {string}
 */
function getBottomNavigation(post, posts){
  const {slug} = post
  const currentPast = posts.filter(todayOlderFilter)
  const listing = currentPast.find(p => p.slug === slug)
  const listingIndex = currentPast.indexOf(listing)
  const hasPrev = listingIndex<(currentPast.length-1)
  const hasNext = listingIndex>0
  const prev = hasPrev&&currentPast[listingIndex+1]
  const next = hasNext&&currentPast[listingIndex-1]
  const prevLink = prev&&`a.prev[href="/${prev.slug}"]{${prev.title}}`||''
  const nextLink = next&&`a.next[href="/${next.slug}"]{${next.title}}`||''
  return `(nav.prevnext>(${prevLink}${prev&&next?'+':''}${nextLink}))`
}
