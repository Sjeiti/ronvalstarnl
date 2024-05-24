import {add} from '../router'
import {fetchJSONFiles} from '../utils'
import {MEDIA_URI_THUMB, MEDIA_URI_VIDEO/*, PROBABLY_MOBILE*/} from '../config'
import {makeClassNames, slugify} from '../utils/string'

const classNames = makeClassNames({
    current: 'current'
  , projectCategory: 'project-category'
  , projects: 'projects'
  , project: 'project'
})

add(
    'experiments'
  , (view/*, route, params*/)=>{
    let title = 'experiments'
    let parentSlug = 'experiments'
    return fetchJSONFiles('posts-list')
      .then(([posts])=>{
        const experiments = posts
          .filter(p=>/^experiment-/.test(p.slug)&&p.thumbnail)
          .sort((a, b)=>new Date(a.dateFrom)<new Date(b.dateFrom)?1:-1)
        view.expandAppend(`ul.unstyled${classNames.projects}>(${experiments.map(getProjectThumbZen).join('+')})`)
        return {title, parentSlug}
      }
    )
  }
)

/**
 * Create Zen selector for a project thumb
 * @param {Fortpolio} project
 * @return {string}
 */
export function getProjectThumbZen(project){
  const ext = project.thumbnail?.split(/\./)?.pop()
  const liAttr = `[style="background-image:url(${MEDIA_URI_THUMB+project.thumbnail})"]`
  const hasVideo = !!project.thumbnailVideo // && !PROBABLY_MOBILE // don't show video thumbs on mobile ???
  const videoSrc = `[src=${MEDIA_URI_VIDEO+project.thumbnailVideo}]`
  const video = hasVideo?`+video${videoSrc}[autoplay][loop][muted][aria-hidden=true]>source${videoSrc}[type=video/${ext}]`:''
  return `(li${(project.categories||[]).map(c=>`.cat-${slugify(c)}`).join('')}${liAttr}>a[href="/${project.slug}"]>(div{${project.title.replace(/experiment:?\s?/i,'')}}${video}))`
}
