import {add} from '../router'
import {MEDIA_URI, MEDIA_URI_THUMB} from '../config'
import {slugify} from '../utils/string'

add(
  ''
  , 'home'
  , (view, route)=>{
    return Promise.all([`page_${route}`, 'posts-list', 'fortpolio-list'].map(s=>fetch(`/data/json/${s}.json`).then(rs=>rs.json())))
      .then(([page, posts, projects])=>{
        view.appendString(page.content)
        //
        // projects // todo duplicate code in `view/projects.js`
        const projectHighlight = ['strange-attractors-javascript', 'kees-kroot', 'disconnect', 'project-invoice'].map(slug=>projects.filter(p=>p.slug===slug).pop())
        view.expandAppend(`section.built>(h2.section-title>small{projects}+{built})+ul.unstyled.projects>(${projectHighlight.map(
              project=>`(li${project.categories.map(c=>`.cat-${slugify(c)}`).join('')}[style="background-image:url(${MEDIA_URI_THUMB+project.thumbnail})"]>a[href="/project/${project.slug}"]>(div{${project.title}}))`
            ).join('+')})`, false)
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
        const today = new Date
        const currentPast = posts.filter(({date})=>(new Date(date))<=today)
        const firstTen = currentPast.slice(0, 10)
        const getLi = post=>`(li>a[href="/${post.slug}"]>(time{${post.date.split('T').shift()}}+{${post.title}}))`
        view.expandAppend(`section.written>(h2.section-title>small{articles}+{written})+ul.unstyled.link-list>(${firstTen.map(getLi).join('+')})`, false)
        return page
      })
  })
