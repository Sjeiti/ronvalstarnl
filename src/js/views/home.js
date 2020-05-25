import {add} from '../router'
import {MEDIA_URI} from '../config'
import {fetchJSONFiles, stickiesFirst, todayOlderFilter} from '../utils'
import {getProjectThumbZen} from './projects'

add(
  ''
  , 'home'
  , (view, route)=>{
    return fetchJSONFiles(`page_${route}`, 'posts-list', 'fortpolio-list')
      .then(([page, posts, projects])=>{
        view.appendString(page.content)
        //
        // projects // todo duplicate code in `view/projects.js`
        const projectHighlight = ['strange-attractors-javascript', 'kees-kroot', 'disconnect', 'project-invoice'].map(slug=>projects.filter(p=>p.slug===slug).pop())
        view.expandAppend(`section.built>(h2.section-title>small{projects}+{built})+ul.unstyled.projects>(${projectHighlight.map(getProjectThumbZen).join('+')})`, false)
        //
        // clients
        view.expandAppend('section.for>(h2.section-title>small{worked}+{for})+ul.unstyled.svg-list.clients', false)
        const clients = ['sikkens', '72', 'uva', 'resn', 'tddb', 'novartis', 'randstad', '2x4', 'vodafone', 'bia', 'philips']
        Promise.all(clients.map(s=>fetch(`${MEDIA_URI}clients_${s}.svg`).then(rs=>rs.text())))
            .then(clients=>{
              view.querySelector('.clients').insertAdjacentHTML('beforeend', clients.map(s=>`<li>${s}</li>`).join(''))
            })
        //
        // won
        view.expandAppend('section.won>(h2.section-title>small{prizes}+{won})+ul.unstyled.svg-list.prizes', false)
        const prizes = ['fwa', 'adcn', 'webby']
        Promise.all(prizes.map(s=>fetch(`${MEDIA_URI}prizes_${s}.svg`).then(rs=>rs.text())))
            .then(clients=>{
              view.querySelector('.prizes').insertAdjacentHTML('beforeend', clients.map(s=>`<li>${s}</li>`).join(''))
            })
        //
        // blog
        //   console.log('st', posts.filter(p=>p.sticky)) // todo: remove log
        const currentPast = stickiesFirst(posts.filter(todayOlderFilter))
          // console.log('st', currentPast.filter(p=>p.sticky)) // todo: remove log
        const firstTen = currentPast.slice(0, 10)
        const getLi = post=>`(li>a[href="/${post.slug}"]>(time{${post.date.split('T').shift()}}+{${post.title}}))`
        const stickies = `(.paper>div>ul.unstyled.link-list>(${firstTen.filter(p=>p.sticky).map(getLi).join('+')}))`
        const others = `ul.unstyled.link-list>(${firstTen.filter(p=>!p.sticky).map(getLi).join('+')})`
        view.expandAppend(`section.written>(h2.section-title>small{articles}+{written})+${stickies}+${others}`, false)
        return page
      })
  })
