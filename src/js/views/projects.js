import {add} from '../router.js'
import {selectEach, expand} from '../utils/html.js'
import {addRule, removeRule} from '../utils/style.js'
import {fetchJSONFiles,nextFrame,nextTick,scrollToTop} from '../utils/index.js'
import {componentOf} from '../component/index.js'
import {MEDIA_URI_PROJECT, MEDIA_URI_THUMB, MEDIA_URI_VIDEO/*, PROBABLY_MOBILE*/} from '../config.js'
import {dateStringToYearMonth,makeClassNames,slugify} from '../utils/string.js'
import {open} from '../router.js'

const classNames = makeClassNames({
    current: 'current'
  , projects: 'projects'
  , project: 'project'
})

add(
    'projects'
  , 'projects/:category'
  , 'project/:project'
  , (view, route, params)=>{
    const {project:projectSlug, category} = params
    let title = 'projects'
    let parentSlug
    return fetchJSONFiles('fortpolio-list')
      .then(([projects])=>{
        const portfolioProjects = projects.filter(p=>p.inPortfolio).sort((a, b)=>new Date(a.dateFrom)<new Date(b.dateFrom)?1:-1)
        const categories = portfolioProjects.reduce((acc, p)=>(p.categories.forEach(c=>!acc.includes(c)&&acc.push(c)), acc), []).map(c=>({name:c, slug:slugify(c)}))
        //
        //const querySelector = ::view.querySelector
        const querySelector = view.querySelector.bind(view)
        let existingCategories = querySelector('[data-filter]')
        let existingProjects = querySelector(classNames.projects)
        const existingProject = querySelector(classNames.project)
        //
        // page setup (categories and projects)
        if(!(existingCategories&&existingProjects)){
          const [elmCat, elmProj] = buildPage(view, categories, portfolioProjects)
          existingCategories = elmCat
          existingProjects = elmProj
        }
        // selected project
        existingProject?.remove()
        if(projectSlug){
          const currentProject = projects.filter(p=>p.slug===projectSlug).pop()
          // todo make project 404 page
          // currentProject||searchView(view, route, params)
          if (currentProject){
            buildCurrentProject(view, currentProject, existingProjects)
            title = currentProject.title
            parentSlug = 'projects'
            nextFrame(()=>scrollToTop(existingCategories),14)

          }
        }
        //
        // project filtering
        // const current = 'current'
        const seldo = selectEach.bind(null, existingCategories)
        existingCategories&&seldo(classNames.current, elm=>elm.classList.remove(classNames.current.name))
        removeRule('ul.projects > li:not(.cat-')
        if(category){
          title = `${category} projects`
          parentSlug = 'projects'
          //
          const select = `projects/${category}`
          const categoryID = categories.filter(c=>c.slug===category).pop()?.slug
          addRule(`ul.projects>li:not(.cat-${categoryID}){max-width:0%;}`)
          seldo(`a[href="/${select}"]`, elm=>elm.classList.add(classNames.current.name))
        }
        //
        return {title, parentSlug}
      }
    )
  }
)

/**
 * Build categories and project list
 * @param {View} view
 * @param {object[]} categories
 * @param {object[]} portfolioProjects
 * @return {HTMLElement[]}
 */
function buildPage(view, categories, portfolioProjects){
  //const querySelector = ::view.querySelector
  const querySelector = view.querySelector.bind(view)

  view.expandAppend(`${_initFilterZen(view,categories)}+${_initProjectListZen(portfolioProjects)}`)

  return [querySelector('[data-filter]'), querySelector(classNames.projects)]
}

function _initFilterZen(view,categories){
  const data = JSON.stringify({list:categories,pathnamePrefix:'/projects/'})
      .replace(/"/g,'&quot;')
  return `div[data-filter="${data}"]`
}

function _initProjectListZen(portfolioProjects){
  return `ul.unstyled${classNames.projects}>(${portfolioProjects.map(getProjectThumbZen).join('+')})`
}

/**
 * Build the current selected project
 * @param {View} view
 * @param {object} project
 * @param {object[]} existingProjects
 */
function buildCurrentProject(view, project, existingProjects){
  const {
    content
    , images=[]
    , dateFrom
    , dateTo
    , title
    , headerColofon, headerClassName
  } = project
  const image = project?.thumbnail
  if (image){
    const header = componentOf(document.querySelector('[data-header]'))
    header&&nextTick(header.setImage.bind(header, image, headerColofon, headerClassName))
  }
  existingProjects.insertAdjacentHTML('beforebegin', expand(`
    div${classNames.project}>
      (
        .text>(.date>time.date-from{${dateStringToYearMonth(dateFrom)}}
          +time.date-to{${dateStringToYearMonth(dateTo)}})
          +h2{${title}}
          +{${content}}
      )
    +${images.map(m => [MEDIA_URI_PROJECT + m, m.replace(/\..+$/, '').replace(/[^a-z0-9]/gi, ' ')]).map(([m, s]) => `(div.img[style="background-image:linear-gradient(#000 0,rgba(0,0,0,0.2) 0),url(${m})"]>img[alt="${s}"][src="${m}"])`).join('+')}`
  ))
  selectEach(view.querySelector(classNames.project), 'img', img=>{
    img.addEventListener('load', ()=>img.naturalHeight>img.naturalWidth&&img.parentNode.classList.add('portrait'))
  })
}

/**
 * Create Zen selector for a project thumb
 * @param {Fortpolio} project
 * @return {string}
 */
export function getProjectThumbZen(project){
  const ext = project.thumbnail?.split(/\./).pop()
  const liAttr = `[style="background-image:url(${MEDIA_URI_THUMB+project.thumbnail})"]`
  const hasVideo = !!project.thumbnailVideo // && !PROBABLY_MOBILE // don't show video thumbs on mobile ???
  const videoSrc = `[src=${MEDIA_URI_VIDEO+project.thumbnailVideo}]`
  const video = hasVideo?`+video${videoSrc}[autoplay][loop][muted][aria-hidden=true]>source${videoSrc}[type=video/${ext}]`:''
  return `(li${project.categories.map(c=>`.cat-${slugify(c)}`).join('')}${liAttr}>a[href="/project/${project.slug}"]>(div{${project.title}}${video}))`
}
