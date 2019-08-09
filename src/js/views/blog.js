import {expand} from '@emmetio/expand-abbreviation'
import {add} from '../router'
import {clean} from '../utils/html'

add('blog',(view,route)=>
    fetch('/data/json/posts-list.json')
      .then(rs=>rs.json())
      .then(posts=>{
        console.log('blogfetched',JSON.stringify(posts[0]),posts)
        const firstTen = posts.slice(0,10)
        const theRest = posts.slice(9)
        const getLi = post=>`(li>a[href="/${post.slug}"]>(time{${post.date.split('T').shift()}}+{${post.title}}))`
        clean(view)
        view.insertAdjacentHTML('beforeend', expand(`ul.unstyled.blog>(${firstTen.map(getLi).join('+')})`))
        const ul = view.querySelector('ul.blog')
        requestAnimationFrame(()=>{
          ul.insertAdjacentHTML('beforeend', expand(theRest.map(getLi).join('+')))
        })
        return {title:'blog'}
      })
)
