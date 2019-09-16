import {expand} from '@emmetio/expand-abbreviation'
import {add} from '../router'
import {loadScript} from '../utils/html'

const data = ['page_cv', 'fortpolio-list', 'taxonomies']

add(
  'cv'
  , (view/*, route, params*/)=>{
    return Promise.all(data.map(n=>fetch(`/data/json/${n}.json`).then(rs=>rs.json())))
      .then(([page, projects, taxonomies])=>{
        // load html2pdf script only when asked
        // todo: move script on build to somewhere loadable
        view.element.addEventListener('click',e=>{
          const {target} = e
          target.matches('a[href$=".pdf"]')&&loadScript('https://rawgit.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.min.js')
              .then(()=>window.html2pdf(document.body))&&e.preventDefault()
        })
        // content
        view.appendString(page.content.rendered)
        // projects
        const taxonomyMap = Object.values(taxonomies)
          .reduce((acc, list)=>{
            list.forEach(item=>acc[item.id]=item)
            return acc
          }, {})
        const cvProjects = projects
          .filter(p=>p.inCv)
          .sort((a, b)=>a.dateFrom>b.dateFrom?-1:1)
        let projectString = expand(`ul.unstyled.cv-projects>(${cvProjects.map(
            (project,i)=>`(li${project.categories.map(c=>`.cat-${c}`).join('')}`
              +`>(.date>time.date-from{${project.dateFrom.replace(/-\d\d$/, '')}}`
              +`+time.date-to{${project.dateTo.replace(/-\d\d$/, '')}})`
              +(project.inPortfolio?`+(h3>a[href="/project/${project.slug}"]{${project.title}})`:`+h3{${project.title}}`)
              +`+{replaceContent${i}}`
              +`+(ul.tags>(${project.tags.map(id=>`li{${taxonomyMap[id].name}}`).join('+')}))`
            +')'
          ).join('+')})`)
        cvProjects.forEach((project,i) => projectString = projectString.replace('replaceContent'+i, project.excerpt||project.content))
        view.appendString(projectString, false)
        return page
      })
  }
)
