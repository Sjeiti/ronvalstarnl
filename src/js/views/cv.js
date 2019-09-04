import {add} from '../router'

const data = ['page_cv', 'fortpolio-list', 'taxonomies']

add(
  'cv'
  , (view, route, params)=>{
    console.log('cv', view, route, params)
    return Promise.all(data.map(n=>fetch(`/data/json/${n}.json`).then(rs=>rs.json())))
      .then(([page, projects, taxonomies])=>{
        //
        //
        const taxonomyMap = Object.values(taxonomies)
          .reduce((acc, list)=>{
            list.forEach(item=>acc[item.id]=item)
            return acc
          }, {})
        //
        view.appendString(page.content.rendered)
        //
        const cvProjects = projects
          .filter(p=>p.inCv)
          .sort((a, b)=>a.dateFrom>b.dateFrom?-1:1)
        view.expandAppend(`ul.unstyled.cv-projects>(${cvProjects.map(
            project=>`(li${project.categories.map(c=>`.cat-${c}`).join('')}`
              +`>(.date>time.date-from{${project.dateFrom.replace(/-\d\d$/, '')}}`
              +`+time.date-to{${project.dateTo.replace(/-\d\d$/, '')}})`
              +(project.inPortfolio?`+(h3>a[href="/project/${project.slug}"]{${project.title}})`:`+h3{${project.title}}`)
              // +`+{${project.content}}` // todo: it should be content
              +`+{${project.excerpt}}`
              +`+(ul.tags>(${project.tags.map(id=>`li{${taxonomyMap[id].name}}`).join('+')}))`
              /*+`+{${project['meta-cvcopy']}}`*/
            +')'
          ).join('+')})`, false)
        //
        return page
      })
  }
)
