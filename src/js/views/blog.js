import {expand} from '../utils/html.js'
import {add} from '../router.js'
import {fetchJSONFiles, scrollToTop, stickiesFirst, todayOlderFilter} from '../utils/index.js'

add('blog', view=>
    fetchJSONFiles('posts-list')
      .then(([posts])=>{
        const currentPast = stickiesFirst(posts.filter(todayOlderFilter))
        // const currentPast = posts.filter(todayOlderFilter)
        const firstTen = currentPast.slice(0, 10)
        const theRest = currentPast.slice(10)
        const getLi = post=>`(li${post.sticky&&'.sticky'||''}>a[href="/${post.slug}"]>(time{${post.date.split('T').shift()}}+{${post.title}}))`
        const ul = view.expandAppend(`ul.unstyled.link-list>(${firstTen.map(getLi).join('+')})`).querySelector('ul.link-list')
        requestAnimationFrame(()=>ul.insertAdjacentHTML('beforeend', expand(theRest.map(getLi).join('+'))))
        scrollToTop(document.querySelector('[data-header]'), 0)
        return {title:'blog'}
      })
)
