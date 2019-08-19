import {expand} from '@emmetio/expand-abbreviation'
import {add} from '../router'
import {clean,selectEach} from '../utils/html'
import {addRule,removeRule} from '../utils/style'
import {scrollTo} from '../utils'

const data = ['fortpolio-list','taxonomies']

add(
  'projects'
  ,'projects/:category'
  ,'project/:project'
  ,(view,route,params)=>{
    console.log('project',view,route,params)
    const {project:projectSlug,category} = params
    let title = 'projects'
    let parentSlug
    return Promise.all(data.map(n=>fetch(`/data/json/${n}.json`).then(rs=>rs.json())))
      .then(([projects,taxonomies])=>{
        console.log('\tloaded')
        const categories = taxonomies['fortpolio_category']
        const portfolioProjects = projects.filter(p=>p.inPortfolio)
        //
        const qs = view.querySelector.bind(view)
        const existingCategories = qs('.project-category')
        const existingProjects = qs('.projects')
        const existingProject = qs('.project')
        const exists = !!(existingCategories&&existingProjects)
        console.log('\texists',exists)
        //
        if(!exists){
          clean(view)
          view.insertAdjacentHTML('beforeend', expand(
            `ul.unstyled.project-category>(${categories.map(
              o=>`(li>a[href="/projects/${o.slug}"]{${o.name}})`
            ).join('+')})`
          ))
          view.insertAdjacentHTML('beforeend', expand(
            `ul.unstyled.projects>(${portfolioProjects.map(
              project=>`(li${project.categories.map(c=>`.cat-${c}`).join('')}[style="background-image:url(${project.thumbnail})"]>a[href="/project/${project.slug}"]>(div{${project.title}}))`
            ).join('+')})`
          ))
        }
        //
        //
        console.log('__________',existingProjects,'2',qs('.projects'))
        //
        //
        // project selected
        existingProject&&existingProject.parentNode.removeChild(existingProject )
        if(projectSlug){
          console.log('\tprojectSlug',projectSlug)
          const currentProject = projects.filter(p=>p.slug===projectSlug).pop()
          title = currentProject.title
          const {
            content
            ,images
            ,dateFrom
            ,dateTo
          } = currentProject
          parentSlug = 'projects'
          ;(existingProjects||qs('.projects')).insertAdjacentHTML('beforebegin', expand(
            'div.project>'
            +`(.text>(.date>time.date-from{${dateFrom.replace(/-\d\d$/,'')}}`
            +`+time.date-to{${dateTo.replace(/-\d\d$/,'')}})`
            +`+h2{${title}}`
            +`+{${content}})`
            +`+${images.map(m=>`(div.img[style="background-image:linear-gradient(#000 0,rgba(0,0,0,0.2) 0),url(${m})"]>img[src="${m}"])`).join('+')}`
          ))
          selectEach(qs('.project'),'img',img=>{
            img.addEventListener('load',e=>{
              img.naturalHeight>img.naturalWidth
                &&img.parentNode.classList.add('portrait')
            })
          })
          const top = (existingCategories||qs('.project-category')).getBoundingClientRect().bottom
          const {body} = document
          const bodyTop = body.getBoundingClientRect().top
          scrollTo(body,1000,null,top-16-bodyTop)
          //console.log(JSON.stringify(currentProject,null,1))
        }
        // category
        const current = 'current'
        const seldo = selectEach.bind(null,existingCategories||qs('.project-category'))
        existingCategories&&seldo('.'+current,elm=>elm.classList.remove(current))
        removeRule(`ul.projects > li:not(.cat-`)
        console.log('\tproject category:',category)
        if(category){
          title = `${category} projects`
          parentSlug = 'projects'
          //
          const select = `projects/${category}`
          const categoryID = categories.filter(c=>c.slug===category).pop()?.id
          // ul.projects > li:not(.cat-239) { display: none; }
          addRule(`ul.projects>li:not(.cat-${categoryID}){display:none;}`)
          console.log('\tselect',select)
          console.log('\tcategoryID',categoryID)
          //console.log('\tcategories',JSON.stringify(categories,null,1))
          seldo(`a[href="/${select}"]`,elm=>elm.classList.add(current))
        }
        //
        return {title,parentSlug}
      })
  }
)
