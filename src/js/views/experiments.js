import {add} from '../router'
import {selectEach, expand} from '../utils/html'
import {addRule, removeRule} from '../utils/style'
import {fetchJSONFiles, nextTick, scrollToTop} from '../utils'
import {componentOf} from '../component'
import {MEDIA_URI_PROJECT, MEDIA_URI_THUMB, MEDIA_URI_VIDEO/*, PROBABLY_MOBILE*/} from '../config'
import {makeClassNames, slugify} from '../utils/string'
import {open} from '../router'

const classNames = makeClassNames({
    current: 'current'
  , projectCategory: 'project-category'
  , projects: 'projects'
  , project: 'project'
})

add(
    'experiments'
  //, 'experiments/:category'
  , (view, route, params)=>{
    const {project:projectSlug, category} = params
    let title = 'experiments'
    let parentSlug = 'experiments'
    return fetchJSONFiles('posts-list')
      .then(([posts])=>{
        const portfolioProjects = posts
          .filter(p=>/^experiment-/.test(p.slug))
          .sort((a, b)=>new Date(a.dateFrom)<new Date(b.dateFrom)?1:-1)
        buildPage(view, portfolioProjects)
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
function buildPage(view, portfolioProjects){
  const querySelector = ::view.querySelector
  view.expandAppend(`ul.unstyled${classNames.projects}>(${portfolioProjects.map(getProjectThumbZen).join('+')})`)
}

/**
 * Create Zen selector for a project thumb
 * @param {Fortpolio} project
 * @return {string}
 */
export function getProjectThumbZen(project){
  console.log('project',project)
  const ext = project.thumbnail?.split(/\./)?.pop()
  const liAttr = `[style="background-image:url(${MEDIA_URI_THUMB+project.thumbnail})"]`
  const hasVideo = !!project.thumbnailVideo // && !PROBABLY_MOBILE // don't show video thumbs on mobile ???
  const videoSrc = `[src=${MEDIA_URI_VIDEO+project.thumbnailVideo}]`
  const video = hasVideo?`+video${videoSrc}[autoplay][loop][muted][aria-hidden=true]>source${videoSrc}[type=video/${ext}]`:''
  return `(li${(project.categories||[]).map(c=>`.cat-${slugify(c)}`).join('')}${liAttr}>a[href="/${project.slug}"]>(div{${project.title.replace(/experiment:?\s?/i,'')}}${video}))`
}
