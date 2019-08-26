import {expand} from '@emmetio/expand-abbreviation'
import {add} from '../router'

add('blog', (view/*, route*/)=>
    fetch('/data/json/posts-list.json')
      .then(rs=>rs.json())
      .then(posts=>{
        console.log('blogfetched', JSON.stringify(posts[0]), posts)
        const firstTen = posts.slice(0, 10)
        const theRest = posts.slice(9)
        const getLi = post=>`(li>a[href="/${post.slug}"]>(time{${post.date.split('T').shift()}}+{${post.title}}))`

        const ul = view.expandAppend(`ul.unstyled.link-list>(${firstTen.map(getLi).join('+')})`).querySelector('ul.link-list')
        requestAnimationFrame(()=>{
          ul.insertAdjacentHTML('beforeend', expand(theRest.map(getLi).join('+')))
        })
        return {title:'blog'}
      })
)
