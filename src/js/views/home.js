import {add} from '../router.js'
import {fetchJSONFiles, stickiesFirst, todayOlderFilter} from '../utils/index.js'
import {getProjectThumbZen} from './projects.js'
import {TweenMax, Linear} from 'gsap'
import {raw} from '../utils/svg.js'

//import clientSymbols from '!!raw-loader!../../static/svg/client-symbol-defs.svg'
//import prizesSymbols from '!!raw-loader!../../static/svg/prizes-symbol-defs.svg'
const {clientSymbolDefs:clientSymbols, prizesSymbolDefs:prizesSymbols} = raw

// conditional because of prerender
if (!globalThis.prerendering){
  document.querySelector('#client-symbol-defs')||document.body.insertAdjacentHTML('afterbegin', clientSymbols)
  document.querySelector('#prize-symbol-defs')||document.body.insertAdjacentHTML('afterbegin', prizesSymbols)
}else{
  console.log('globalThis.prerendering')
}

const populateSVGList = (ul, prefix, names)=>
  ul.insertAdjacentHTML('beforeend', names.map(s=>`<li><svg aria-label="${s}"><use xlink:href="#${prefix+s}"></use></svg></li>`).join(''))

add(
  ''
  , 'home'
  , (view/**View*/, route)=>{
    return fetchJSONFiles(`page_${route}`, 'posts-list', 'fortpolio-list')
      .then(([page, posts, projects])=> {

          view.appendString(page.content)
          //
          // projects // todo duplicate code in `view/projects.js`
          const projectHighlight = ['strange-attractors-javascript','kees-kroot','disconnect','project-invoice'].map(slug => projects.filter(p => p.slug===slug).pop())
          view.expandAppend(`section.built>(h2.section-title>small{projects}+{built})+ul.unstyled.projects>(${projectHighlight.map(getProjectThumbZen).join('+')})`,false)
          //
          // working
          view.expandAppend(`section.at>(h2.section-title>small{working}+{at})+ul.unstyled.svg-list.at>(
            ${['snsbank', 'asnbank', 'volksbank', 'regiobank', 'blgwonen'].map(name=>`(li.client-${name}>svg[aria-label=${name}]>use[xlink:href="#client-${name}"])`).join('+')}
          )`,false)
          //
          // clients
          view.expandAppend('section.for>(h2.section-title>small{worked}+{for})+ul.unstyled.svg-list.clients',false)
          const clientNames = ['sikkens','uva','tudelft','wageningen','randstad','philips','vodafone','2x4','novartis','resn','buildinamsterdam','72andsunny','tribalddb']
          const elmClients = view.querySelector('.clients')
          populateSVGList(elmClients,'client-',clientNames)
          setTimeout(() => {
              const {children: [{offsetWidth}],style} = elmClients
              elmClients.style.width = `${clientNames.length * offsetWidth}px`
              //
              style.marginLeft = 0
              TweenMax.to(style,6,{
                  marginLeft: `${-offsetWidth}px`,
                  onRepeat: () => elmClients.appendChild(elmClients.children[0]),
                  repeat: -1,
                  ease: Linear.easeNone
              })
          },140)
          //
          // won
          view.expandAppend('section.won>(h2.section-title>small{prizes}+{won})+ul.unstyled.svg-list.prizes',false)
          const prizes = ['fwa','adcn','webby']
          const elmPrizes = view.querySelector('.prizes')
          populateSVGList(elmPrizes,'prize-',prizes)
          //
          // blog
          const currentPast = stickiesFirst(posts.filter(todayOlderFilter))
          const firstTen = currentPast.slice(0,10)
          const [first,...rest] = firstTen.filter(p => !p.sticky)
          const sticked = [first,...firstTen.filter(p => p.sticky)]
          const getLi = post => `(li>a[href="/${post.slug}"]>(time{${post.date.split('T').shift()}}+{${post.title}}))`
          const stickies = `(.paper>div>ul.unstyled.link-list>(${sticked.map(getLi).join('+')}))`
          const others = `ul.unstyled.link-list>(${rest.map(getLi).join('+')})`
          view.expandAppend(`section.written>(h2.section-title>small{articles}+{written})+${stickies}+${others}`,false)
          return page
      })
    })
