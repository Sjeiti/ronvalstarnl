import {searchView} from './search'
import {setDefault} from '../router'
import {fetchJSONFiles, getZenIcon, nextTick, scrollToTop, todayOlderFilter} from '../utils'
import {prismToRoot} from '../utils/prism'
import {componentOf} from '../component'

setDefault((view, route, params)=>fetchJSONFiles(`post_${route}`, 'posts-list', 'fortpolio-list')
    .then(([post, posts, fortpolios])=>{

      setHeaderImage(post)

      view
          .expandAppend(getBlogHeading(post))
          .appendString(post.content, false)
          .expandAppend(getRelatedLinks(post, posts, fortpolios), false)
          .expandAppend(getBottomNavigation(post, posts), false)

      Array.from(view.querySelectorAll('iframe')).forEach(iframe=>{
        const {innerHTML, contentWindow: {document}} = iframe
        document.writeln(innerHTML)
      })

      nextTick(()=>{
        prismToRoot(view)
        !(/^experiment-/.test(route))&&scrollToTop(document.querySelector('[data-header]'), 0)
      })

      return Object.assign(post, {parentSlug:'blog'})
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
  const {date, title} = post
  const time = date.split('T').shift()
  return `time.blog{${time}}+h1{${title}}`
}

/**
 * Create a list of related elements
 * @param {Post} post
 * @param {PageIndex[]} posts
 * @param {PageIndex[]} fortpolios
 * @return {string}
 */
function getRelatedLinks(post, posts, fortpolios){
  let returnvalue = ''
  const {slug, related} = post
  if (related){
    const relatedDocs = related.split(/\s/g)
          .map(slug=> {
            const slog = slug.replace(/^project\//, '')
            return posts.find(p => p.slug===slug) || fortpolios.find(p => p.slug===slug || p.slug===slog)
          })
          .filter(p=>p&&p.slug!==slug)
    relatedDocs.length>5&&relatedDocs.sort(()=>Math.random()<0.5?-1:1).splice(5, 1E9)
    const relatedLi = relatedDocs
          .map(({slug, title, type})=>`li>a[href="/${type==='fortpolio'?'project/':''}${slug}"]>((${getZenIcon(type)})+{${title}})`)
          .join('+')
    returnvalue = `.related>(h4{Related:}+ul.unstyled.link-list.related__list>${relatedLi})`
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
  return `(nav.prevnext>(${prevLink}+${nextLink}))`
}
