import {expand} from '../utils/html'
import {add} from '../router'
import {scrollToTop} from '../utils'

add('blog', (view/*, route*/)=>
    fetch('/data/json/posts-list.json')
      .then(rs=>rs.json())
      .then(posts=>{
        const today = new Date
        const currentPast = posts.filter(({date})=>(new Date(date))<=today)
        const firstTen = currentPast.slice(0, 10)
        const theRest = currentPast.slice(9)
        const getLi = post=>`(li>a[href="/${post.slug}"]>(time{${post.date.split('T').shift()}}+{${post.title}}))`
        const ul = view.expandAppend(`ul.unstyled.link-list>(${firstTen.map(getLi).join('+')})`).querySelector('ul.link-list')
        requestAnimationFrame(()=>ul.insertAdjacentHTML('beforeend', expand(theRest.map(getLi).join('+'))))
        scrollToTop(document.querySelector('[data-header]'), 0)
        return {title:'blog'}
      })
)
