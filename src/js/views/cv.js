import {expand} from '../utils/html'
import {add} from '../router'
// import html2pdf from 'html2pdf.js'
import {slugify} from '../utils/string'
import {fetchJSONFiles} from '../utils'
// import htmlDocx from 'html-docx-js/dist/html-docx'
// import {saveAs} from 'file-saver'
// import turndown from 'turndown'

add(
  'cv'
  ,async (/**View*/view/*, route, params*/) => {

      const response = await fetchJSONFiles('page_cv', 'fortpolio-list', 'tags')
      const [page,projects,tags] = response
      console.log('{page, projects, tags}',{page,projects,tags}) // todo: remove log

      view.appendString(page.content)
      // try { // A Shrodingers error here
      view.addEventListener('click', onClickDownload)
      // }catch(err){/**/}


      // skills
      view.appendString(expand('h2{skills by year}'), false)
      view.appendChild(buildSkillsTable(tags), false)


      // projects
      view.appendString(expand('h2{projects}'),false)
      const cvProjects = projects
          .filter(p => p.inCv)
          // .sort((a, b)=>new Date(a.dateFrom)>new Date(b.dateFrom)?-1:1)
          .sort((a,b) => new Date(a.dateTo)>new Date(b.dateTo)?-1:1)

      // cvProjects
      // const tagList = cvProjects.reduce((acc, project)=>{
      //   project.tags.forEach(tag=>acc.includes(tag)||acc.push(tag))
      //   return acc
      // }, [])
      // const tagUl = expand(`ul.tags>(${tagList.map(tag=>`li{${tag}}`).join('+')})`)
      // view.appendString(tagUl, false)

      let projectString = expand(`ul.unstyled.cv-projects>(${cvProjects.map((project,i) => `(
          li${project.categories.map(c => `.cat-${slugify(c)}`).join('')}
            >(header
              >(h3${(project.inPortfolio?`>a[href="/project/${project.slug}"]{${project.title}}`:`{${project.title}}`)})
              +(.date>time.date-from{${project.dateFrom.replace(/-\d\d$/,'')}}
              +time.date-to{${project.dateTo.replace(/-\d\d$/,'')}})
            )
            +{replaceContent${i}}
            ${(project.clients?.length?`+dl>(dt{client}+dd{${project.clients.join(', ')}})`:'')}
            +(ul.tags>(${project.tags.map(tag => `li{${tag}}`).join('+')}))
         )`).join('+')})`)
      cvProjects.forEach((project,i) => projectString = projectString.replace('replaceContent' + i,project.excerpt && `<p>${project.excerpt}</p>` || project.content))
      view.appendString(projectString,false)

      return page
    }
)

/**
 * Download doc if correct anchor is clicked
 * @param {MouseEvent} e
 */
function onClickDownload(e){
  const {target} = e
  if (target.matches('a[data-download-txt]')){
    const html = getHTMLToParse()
    Array.from(html.querySelectorAll('div.date')).forEach(div=>{
      const [timeF, timeT] = div.children
      const span = document.createElement('span')
      span.appendChild(document.createTextNode(` (${timeF.textContent} _ ${timeT.textContent})`))
      div.nextElementSibling?.appendChild(span)
      div.parentNode.removeChild(div)
    })
    Array.from(html.querySelectorAll('h1,h2,h3')).forEach(elm=>{
      elm.textContent = `${elm.textContent}\n\n`
    })
    Array.from(html.querySelectorAll('ul.tags')).forEach(ul=>{
      const span = document.createElement('span')
      span.appendChild(document.createTextNode('tags: '+ul.textContent.replace(/^[ \t]+|[ \t]+$/gm, '').replace(/^\n*|\n*$/g, '').replace(/\n/g, ', ')))
      ul.insertAdjacentElement('afterend', span)
      ul.parentNode.removeChild(ul)
    })
    Array.from(html.querySelectorAll('li')).forEach(li=>{
      const span = document.createElement('span')
      span.appendChild(document.createTextNode(' - '))
      li.insertAdjacentElement('afterbegin', span)
    })
    const text = html.textContent
        .replace(/^[ \t]+|[ \t]+$/gm, '')
        .replace(/\n\n\n+/gm, '\n\n')
        .replace(/\nclient\n/gm, '\nclient: ')
    target.setAttribute('href', 'data:text/plain;charset=utf-8;base64,' + btoa(text))
  }/* else if (target.matches('a[data-download-md]')){
    const td = new turndown()
    const md = td.turndown(getHTMLToParse().outerHTML)
    target.setAttribute('href', 'data:text/plain;charset=utf-8;base64,'+btoa(md))
  } else if (target.matches('a[data-pdf]')){
    e.preventDefault()
    html2pdf(getHTMLToParse(), {
      filename: target.getAttribute('href').split(/\//g).pop()
      , image: {type: 'png', quality: 0.95}
    })
  } else if (target.matches('a[data-doc]')){
    e.preventDefault()
    const data = getHTMLToParse()
    const converted = htmlDocx.asBlob(data)
    saveAs(converted, 'test.docx')
  }*/
}

/**
 * Get the HTML to convert to document
 * @return {HTMLElement}
 */
function getHTMLToParse(){
  const main = document.querySelector('main').cloneNode(true)
  const download = main.querySelector('[data-download]')
  download.parentNode.removeChild(download)
  return main
}

////////////////////////////////////////////////////////////////////////

function buildSkillsTable(projects){

  const desc = 'desc'
  const classSkillsTable = 'skillsTable'
  const classCurrentSort = 'currentSort'
  const currentSortSelector = `.${classCurrentSort}`

  const result = projects.reduce((acc, project)=>{
    const {tags, dateFrom, dateTo} = project

    const [yearFrom, yearTo] = [dateFrom, dateTo].map(s=>parseInt(s.split(/-/)[0],10))

    tags?.forEach(tag=>{

      const tagged = acc[tag]||(acc[tag] = [])
      for(let i=yearFrom;i<=yearTo;i++) tagged.includes(i)||tagged.push(i)

    })
    return acc
  }, {})

  const lowest = Math.min(...Object.values(result).map(a=>Math.min(...a)))
  const highest = Math.max(...Object.values(result).map(a=>Math.max(...a)))

  const table = elm('table')
  const thead = elm('thead', table)
  const theadtr = elm('tr', thead)
  const tbody = elm('tbody', table)

  const first = elm('td', theadtr)
  for(let year=lowest;year<=highest;year++) {
    elm('th', theadtr).textContent = year
  }

  Object.entries(result).forEach(([title,years])=>{
    const tbodytr = elm('tr', tbody)
    elm('th', tbodytr).textContent = title
    let xp = 0
    for(let year=lowest;year<=highest;year++) {
      const includes = years.includes(year)
      elm('td', tbodytr).textContent = includes?'1':''
      includes&&(xp = xp + 1 + year - lowest)
    }
    tbodytr.dataset.xp = xp
  })

  const entryList = Array.from(tbody.querySelectorAll('tr'))

  const menu = elm('menu')
  elm('button', menu, 'sort by weight').addEventListener('click', sortAscDesc(sortXP))
  elm('button', menu, 'sort by A-Z').addEventListener('click', sortAscDesc(sortAZ))
  elm('input', first).addEventListener('input', onInputFilter)

  sortXP()()

  const skillsTable = elm('div')
  skillsTable.classList.add(classSkillsTable)
  skillsTable.appendChild(menu)
  skillsTable.appendChild(table)
  return skillsTable

  //////////////////////////////////////////////////////////////////////////////////////

  function onInputFilter(e){
    const {currentTarget: {value}} = e
    const fragment = document.createDocumentFragment()
    const filters = value.toLowerCase().split(/\|/g).map(s=>s.trim())
    clearBody()
    entryList.forEach(tr=>
      filters.forEach(filter=>
        tr.querySelector('th').textContent.toLowerCase().includes(filter)
            &&fragment.appendChild(tr)
      )
    )
    tbody.appendChild(fragment)
  }

  function sort(sortMethod){
    return ()=>{
      const children = clearBody()
      const fragment = document.createDocumentFragment()
      entryList
          .sort(sortMethod||(()=>{}))
          .forEach(tr=>children.includes(tr)&&fragment.appendChild(tr))
      tbody.appendChild(fragment)
    }
  }

  function clearBody(){
    const children = Array.from(tbody.children)
    children.forEach(child=>child.remove())
    return children
  }

  function sortXP(asc=true){
    return sort((a,b)=>(asc?-1:1)*(parseInt(a.dataset.xp, 10)>parseInt(b.dataset.xp, 10)?1:-1))
  }

  function sortAZ(asc=true){
    return sort((a,b)=>(asc?1:-1)*(a.firstChild.textContent>b.firstChild.textContent?1:-1))
  }

  function sortAscDesc(method){
    return (e)=>{
      const current = document.querySelector(currentSortSelector)
      const {currentTarget} = e
      if (current===currentTarget) {
        currentTarget.classList.toggle(desc)
      } else {
        current?.classList.remove(classCurrentSort)
        currentTarget.classList.add(classCurrentSort)
      }
      method(!currentTarget.classList.contains(desc))()
    }
  }

  function elm(name, parent, text){
    const m = document.createElement(name)
    text&&m.appendChild(document.createTextNode(text))
    parent?.appendChild(m)
    return m
  }
}