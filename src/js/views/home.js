import {add} from '../router'
import {MEDIA_URI} from '../config'
import {fetchJSONFiles, stickiesFirst, todayOlderFilter} from '../utils'
import {getProjectThumbZen} from './projects'
import {TweenMax, Linear} from 'gsap'
import clientSymbols from '!!raw-loader!../../static/svg/client-symbol-defs.svg'

// conditional because of prerender
document.querySelector('#client-symbol-defs')||document.body.insertAdjacentHTML('afterbegin', clientSymbols)

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
        const clientNames = [
              'sikkens'
            , '72andsunny'
            , 'uva'
            , 'resn'
            , 'tribalddb'
            , 'novartis'
            , 'randstad'
            , '2x4'
            , 'vodafone'
            , 'buildinamsterdam'
            , 'philips'
          ]
        const elmClients = view.querySelector('.clients')
        elmClients.insertAdjacentHTML('beforeend', clientNames.map(s=>`<li><svg><use xlink:href="#client-${s}"></use></svg></li>`).join(''))
        setTimeout(()=>{
            const {children: [{offsetWidth}], style} = elmClients
            elmClients.style.width = `${clientNames.length*offsetWidth}px`
            //
            style.marginLeft = 0
            TweenMax.to(
                style
                , 6
                , {
                  marginLeft: `${-offsetWidth}px`
                  , onRepeat: () => elmClients.appendChild(elmClients.children[0])
                  , repeat: -1
                  , ease: Linear.easeNone
                }
            )
        }, 140)
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
