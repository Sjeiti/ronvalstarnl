import {add} from '../router'
import {fetchJSONFiles, stickiesFirst, todayOlderFilter} from '../utils'
import {getProjectThumbZen} from './projects'
import {TweenMax, Linear} from 'gsap'
import clientSymbols from '!!raw-loader!../../static/svg/client-symbol-defs.svg'
import prizesSymbols from '!!raw-loader!../../static/svg/prizes-symbol-defs.svg'

// conditional because of prerender
document.querySelector('#client-symbol-defs')||document.body.insertAdjacentHTML('afterbegin', clientSymbols)
document.querySelector('#prize-symbol-defs')||document.body.insertAdjacentHTML('afterbegin', prizesSymbols)

const populateSVGList = (ul, names)=>
  ul.insertAdjacentHTML('beforeend', names.map(s=>`<li><svg><use xlink:href="#${s}"></use></svg></li>`).join(''))

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
            , 'uva'
            , 'tudelft'
            , 'wageningen'
            , 'randstad'
            , 'philips'
            , 'vodafone'
            , '2x4'
            , 'novartis'
            , 'resn'
            , 'buildinamsterdam'
            , '72andsunny'
            , 'tribalddb'
          ]
        const elmClients = view.querySelector('.clients')
        populateSVGList(elmClients, clientNames.map(s=>`client-${s}`))
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
        const elmPrizes = view.querySelector('.prizes')
        populateSVGList(elmPrizes, prizes.map(s=>`prize-${s}`))
        //
        // blog
        const currentPast = stickiesFirst(posts.filter(todayOlderFilter))
        const firstTen = currentPast.slice(0, 10)
        const getLi = post=>`(li>a[href="/${post.slug}"]>(time{${post.date.split('T').shift()}}+{${post.title}}))`
        const stickies = `(.paper>div>ul.unstyled.link-list>(${firstTen.filter(p=>p.sticky).map(getLi).join('+')}))`
        const others = `ul.unstyled.link-list>(${firstTen.filter(p=>!p.sticky).map(getLi).join('+')})`
        view.expandAppend(`section.written>(h2.section-title>small{articles}+{written})+${stickies}+${others}`, false)
        return page
      })
  })
