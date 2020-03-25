import {searchView} from './search'
import {setDefault} from '../router'
import {fetchJSONFiles,nextTick,scrollToTop,todayOlderFilter} from '../utils'
import {prismToRoot} from '../utils/prism'
import {componentOf} from '../component'

setDefault((view, route, params)=>fetchJSONFiles(`post_${route}`, 'posts-list')
    .then(([post, posts])=>{
      const {date, title, content, header, headerColofon, headerClassName, slug} = post
      if (header){
        const headerComp = componentOf(document.querySelector('[data-header]'))
        headerComp&&nextTick(headerComp.setImage.bind(headerComp, header, headerColofon, headerClassName))
      }

      const time = date.split('T').shift()

      const currentPast = posts.filter(todayOlderFilter)
      const listing = currentPast.find(p => p.slug === slug)
      const listingIndex = currentPast.indexOf(listing)
      const hasPrev = listingIndex<(currentPast.length-1)
      const hasNext = listingIndex>0
      const prev = hasPrev&&currentPast[listingIndex+1]
      const next = hasNext&&currentPast[listingIndex-1]
      const prevLink = prev&&`a.prev[href="/${prev.slug}"]{< ${prev.title}}`||''
      const nextLink = next&&`a.next[href="/${next.slug}"]{${next.title} >}`||''

      view
          .expandAppend(`(nav.prevnext>(${prevLink}+${nextLink}))+time.blog{${time}}+h1{${title}}`)
          .appendString(content, false)

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
