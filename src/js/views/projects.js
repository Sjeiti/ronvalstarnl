import {expand} from '@emmetio/expand-abbreviation'
import {add} from '../router'
import {selectEach} from '../utils/html'
import {addRule, removeRule} from '../utils/style'
import {scrollTo, nextTick} from '../utils'
import {component} from '../Component'
import {MEDIA_URI_PROJECT, MEDIA_URI_THUMB} from '../config'
import {slugify} from '../utils/string'

const data = ['fortpolio-list', 'taxonomies'] // todo fix taxonomies

add(
  'projects'
  , 'projects/:category'
  , 'project/:project'
  , (view, route, params)=>{
    const {project:projectSlug, category} = params
    let title = 'projects'
    let parentSlug
    return Promise.all(data.map(n=>fetch(`/data/json/${n}.json`).then(rs=>rs.json())))
      .then(([projects, taxonomies])=>{
        const categories = taxonomies['fortpolio_category']
        const portfolioProjects = projects.filter(p=>p.inPortfolio).sort((a,b)=>new Date(a.dateFrom)<new Date(b.dateFrom)?1:-1)
        //
        const querySelector = ::view.querySelector
        const existingCategories = querySelector('.project-category')
        const existingProjects = querySelector('.projects')
        const existingProject = querySelector('.project')
        const exists = !!(existingCategories&&existingProjects)
        //316 240
        //
        if(!exists){
          view.expandAppend(`(ul.unstyled.project-category>(${categories.map(
              o=>`(li>a[href="/projects/${o.slug}"]{${o.name}})`
            ).join('+')}))+ul.unstyled.projects>(${portfolioProjects.map(
              project=>`(li${project.categories.map(c=>`.cat-${slugify(c)}`).join('')}[style="background-image:url(${MEDIA_URI_THUMB+project.thumbnail})"]>a[href="/project/${project.slug}"]>(div{${project.title}}))`
            ).join('+')})`)
        }
        // project selected
        existingProject&&existingProject.parentNode.removeChild(existingProject )
        if(projectSlug){
          const currentProject = projects.filter(p=>p.slug===projectSlug).pop()
          title = currentProject.title
          const {
            content
            , images
            , dateFrom
            , dateTo
          } = currentProject
          const image = currentProject?.thumbnail
          if (image){
            const header = component.of(document.querySelector('[data-header]'))
            header&&nextTick(header.setImage.bind(header, image))
          }
          parentSlug = 'projects'
          ;(existingProjects||querySelector('.projects')).insertAdjacentHTML('beforebegin', expand(
            'div.project>'
            +`(.text>(.date>time.date-from{${dateFrom.replace(/-\d\d$/, '')}}`
            +`+time.date-to{${dateTo.replace(/-\d\d$/, '')}})`
            +`+h2{${title}}`
            +`+{${content}})`
            +`+${images.map(m=>MEDIA_URI_PROJECT+m).map(m=>`(div.img[style="background-image:linear-gradient(#000 0,rgba(0,0,0,0.2) 0),url(${m})"]>img[src="${m}"])`).join('+')}`
          ))
          selectEach(querySelector('.project'), 'img', img=>{
            img.addEventListener('load', ()=>{
              img.naturalHeight>img.naturalWidth
                &&img.parentNode.classList.add('portrait')
            })
          })
          const top = (existingCategories||querySelector('.project-category')).getBoundingClientRect().bottom
          const {body} = document
          const bodyTop = body.getBoundingClientRect().top
          scrollTo(body, 1000, null, top-16-bodyTop)
        }
        // category
        const current = 'current'
        const seldo = selectEach.bind(null, existingCategories||querySelector('.project-category'))
        existingCategories&&seldo('.'+current, elm=>elm.classList.remove(current))
        removeRule('ul.projects > li:not(.cat-')
        if(category){
          title = `${category} projects`
          parentSlug = 'projects'
          //
          const select = `projects/${category}`
          const categoryID = categories.filter(c=>c.slug===category).pop()?.id
          addRule(`ul.projects>li:not(.cat-${categoryID}){display:none;}`)
          seldo(`a[href="/${select}"]`, elm=>elm.classList.add(current))
        }
        //
        return {title, parentSlug}
      })
  }
)
