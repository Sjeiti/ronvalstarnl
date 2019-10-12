import {expand} from '../utils/html'
import {add} from '../router'
// import html2pdf from 'html2pdf.js'
import {slugify} from '../utils/string'

const data = ['page_cv', 'fortpolio-list']

add(
  'cv'
  , (/**View*/view/*, route, params*/)=>{
    return Promise.all(data.map(n=>fetch(`/data/json/${n}.json`).then(rs=>rs.json())))
      .then(([page, projects])=>{
        view.appendString(page.content)
        // view.addEventListener('click', onClickPDF)
        // projects
        const cvProjects = projects
          .filter(p=>p.inCv)
          .sort((a, b)=>a.dateFrom>b.dateFrom?-1:1)
        let projectString = expand(`ul.unstyled.cv-projects>(${cvProjects.map(
            (project, i)=>`(
              li${project.categories.map(c=>`.cat-${slugify(c)}`).join('')}
                >(.date>time.date-from{${project.dateFrom.replace(/-\d\d$/, '')}}
                +time.date-to{${project.dateTo.replace(/-\d\d$/, '')}})
                +(h3${(project.inPortfolio?`>a[href="/project/${project.slug}"]{${project.title}}`:`{${project.title}}`)})
                +{replaceContent${i}}
                ${(project.clients.length?`+dl>(dt{client}+dd{${project.clients.join(', ')}})`:'')}
                +(ul.tags>(${project.tags.map(tag=>`li{${tag}}`).join('+')}))
             )`
          ).join('+')})`)
        cvProjects.forEach((project, i) => projectString = projectString.replace('replaceContent'+i, project.excerpt&&`<p>${project.excerpt}</p>`||project.content))
        view.appendString(projectString, false)
        return page
      })
  }
)

// /**
//  * Download pdf if correct anchor is clicked
//  * @param {MouseEvent} e
//  * @todo: add print style
//  */
// function onClickPDF(e){
//   const {target} = e
//   if (target.matches('a[href$=".pdf"]')){
//     e.preventDefault()
//     html2pdf(document.querySelector('main'), {
//       filename: target.getAttribute('href').split(/\//g).pop()
//       , image: {type: 'png', quality: 0.95}
//     })
//   }
// }
