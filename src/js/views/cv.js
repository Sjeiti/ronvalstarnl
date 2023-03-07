import {createElement, expand} from '../utils/html'
import {add} from '../router'
import {slugify} from '../utils/string'
import {fetchJSONFiles} from '../utils'
import {initialise} from '../component'

add(
  'cv'
  , async(/**View*/view/*, route, params*/) => {

      const response = await fetchJSONFiles('page_cv', 'fortpolio-list', 'tags')
      const [page, projects, tags] = response

      view.appendString(page.content)
      view.addEventListener('click', onClickDownload)

      buildSkillsTable(tags, view.querySelector('#skillsWrapper'))

      buildProjects(projects, view)

      return page
    }
)

/**
 * Build a project list and append it to the view
 * @param {any[]} projects
 * @param {View} target
 */
function buildProjects(projects, target){
  target.appendString(expand('h2#projects{projects}'), false)
  const cvProjects = projects
      .filter(p => p.inCv)
      .sort((a, b) => new Date(a.dateTo)>new Date(b.dateTo)?-1:1)

  let projectString = expand(`ul.unstyled.cv-projects>(${cvProjects.map((project, i) => `(
          li${project.categories.map(c => `.cat-${slugify(c)}`).join('')}
            >(header
              >(h3${(project.inPortfolio?`>a[href="/project/${project.slug}"]{${project.title}}`:`{${project.title}}`)})
              +(.date>time.date-from{${project.dateFrom.replace(/-\d\d$/, '')}}
              +time.date-to{${project.dateTo.replace(/-\d\d$/, '')}})
            )
            +{replaceContent${i}}
            ${(project.clients?.length?`+dl>(dt{client}+dd{${project.clients.join(', ')}})`:'')}
            +(ul.tags>(${project.tags.map(tag => `li{${tag}}`).join('+')}))
         )`).join('+')})`)
  cvProjects.forEach((project, i) => projectString = projectString.replace('replaceContent' + i, project.excerpt && `<p>${project.excerpt}</p>` || project.content))
  target.appendString(projectString, false)
}

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

    const skills = html.querySelector('#skillsWrapper')
    const table = skills.querySelector('.skillsTable')
    table.remove()
    skills.textContent = Array.from(table.querySelectorAll('tbody>tr')).map(tr=>{
          const th = tr.querySelector('th')
          const text = th.textContent
          const skill = Math.round(parseFloat(th.dataset.skill))
          // return `- ${'U+02605'.repeat(skill)+'U+02606'.repeat(5-skill)} ${text}`
          // return `- ${'&#9733;'.repeat(skill)+'&#9734;'.repeat(5-skill)} ${text}`
          // return `- ${'★'.repeat(skill)+'☆'.repeat(5-skill)} ${text}`
          return `- ${'*'.repeat(skill)+'_'.repeat(5-skill)} ${text}`
        }).join('\n')

    const text = html.textContent
        .replace(/^[ \t]+|[ \t]+$/gm, '')
        .replace(/\n\n\n+/gm, '\n\n')
        .replace(/\nclient\n/gm, '\nclient: ')
    target.setAttribute('href', 'data:text/plain;charset=utf-8;base64,' + encodeURI(btoa(text)))
  }
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

/**
 * Build a skills table and append it to the view
 * @param {object[]} projects
 * @param {HTMLElement} target
 * @returns {HTMLElement}
 */
function buildSkillsTable(projects, target){

  const desc = 'desc'
  const classSkillsTable = 'skillsTable'
  const classCurrentSort = 'currentSort'
  const currentSortSelector = `.${classCurrentSort}`

  const result = projects.reduce((acc, project)=>{
    const {tags, dateFrom, dateTo} = project

    const [yearFrom, yearTo] = [dateFrom, dateTo].map(s=>parseInt(s.split(/-/)[0], 10))

    tags?.forEach(tag=>{

      const tagged = acc[tag]||(acc[tag] = [])
      for(let i=yearFrom;i<=yearTo;i++) tagged.includes(i)||tagged.push(i)

    })
    return acc
  }, {})

  const lowest = Math.min(...Object.values(result).map(a=>Math.min(...a)))
  const highest = Math.max(...Object.values(result).map(a=>Math.max(...a)))

  const table = createElement('table')
  const thead = createElement('thead', null, table)
  const theadtr = createElement('tr', null, thead)
  const tbody = createElement('tbody', null, table)

  const first = createElement('td', null, theadtr)
  for(let year=lowest;year<=highest;year++){
    const span = createElement('span', null, createElement('th', null, theadtr), null, year)
    const add = s=>span.classList.add(s)
    add('year')
    add('year--'+year)
    year===lowest&&add('year--lowest')
    year===highest&&add('year--highest')
  }

  const trxp = Object.entries(result).map(([title, years])=>{
    const slug = slugify(title)
    const tr = createElement('tr', null, tbody)
    createElement('th', null, tr, null, title)
    //
    let xp = 0
    for(let year=lowest;year<=highest;year++){
      const index = year - lowest
      const includes = years.includes(year)
      createElement('td', null, tr, null,  includes?'1':'')
      includes&&(xp = xp + 1 + 0.5*index)
    }
    tr.dataset.xp = xp.toFixed(1)
    return {tr, xp, slug}
  })

  const xps = target.dataset.skills
      .toLowerCase()
      .split(/\|/g)
      .reduce((acc, s, i)=>{
        const [key, value] = s.split(':')
        value&&(acc[key] = parseFloat(value))
        const tr = trxp.find(tr=>tr.slug===key)?.tr
        tr&&(tr.dataset.index = i)
        return acc
      }, {})

  const maxXp = Math.max(...trxp.map(o=>o.xp))
  trxp.forEach(({slug, tr, xp})=>{
    tr.firstChild.dataset.skill = xps[slug]||(1 + xp/maxXp*4.4) // Math.ceil(1 + (1-((1-(xp/maxXp))**2))*4)
    initialise(tr)
  })

  const entryList = trxp.map(o=>o.tr)

  const menu = createElement('menu')
  createElement('button', null, menu, null, 'sort by weight').addEventListener('click', sortAscDesc(sortXP))
  createElement('button', null, menu, null, 'sort by A-Z').addEventListener('click', sortAscDesc(sortAZ))
  const input = createElement('input', null, first)
  input.addEventListener('input', onInputFilter)
  input.addEventListener('dblclick', ()=>menu.style.display='block')

  // sortXP()()
  sortIndex()()
  // requestAnimationFrame(()=>sortIndex()())

  const {skills} = target.dataset
  skills&&onInputFilter({currentTarget:{value:skills}})

  const skillsTable = createElement('div')
  skillsTable.classList.add(classSkillsTable)
  skillsTable.appendChild(menu)
  skillsTable.appendChild(table)
  target.appendChild(skillsTable)

  return skillsTable

  //////////////////////////////////////////////////////////////////////////////////////

  /**
   * Event handler to sort skills table
   * @param {Event} e
   */
  function onInputFilter(e){
    const {currentTarget: {value}} = e
    const fragment = document.createDocumentFragment()
    const filters = value.toLowerCase()
      .split(/\|/g).map(s=>s.split(':').shift().trim())
    clearBody()
    entryList.forEach(tr=>
      filters.forEach(filter=>
        tr.querySelector('th').textContent.toLowerCase().includes(filter)
            &&fragment.appendChild(tr)
      )
    )
    tbody.appendChild(fragment)
  }

  /**
   * Sorting for table rows
   * @param {Function} sortMethod
   * @returns {Function}
   */
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

  /**
   * Clear the table body
   * @returns {Element[]}
   */
  function clearBody(){
    const children = Array.from(tbody.children)
    children.forEach(child=>child.remove())
    return children
  }

  /**
   * Sort by experience
   * @param {boolean} asc
   * @returns {Function}
   */
  function sortXP(asc=true){
    return sort((a, b)=>(asc?-1:1)*(parseFloat(a.dataset.xp)>parseFloat(b.dataset.xp)?1:-1))
  }

  /**
   * Sort by Markdown index
   * @param {boolean} asc
   * @returns {Function}
   */
  function sortIndex(asc=false){
    // return sort((a, b)=>(asc?-1:1)*(parseInt(a.dataset.index, 10)>parseInt(b.dataset.index, 10)?1:-1))
    return sort((a, b)=>{
      const va = parseInt(a.dataset.index>-1?a.dataset.index:1E9, 10)
      const vb = parseInt(b.dataset.index>-1?b.dataset.index:1E9, 10)
      // (asc?-1:1)*(parseInt(a.dataset.index, 10)>parseInt(b.dataset.index, 10)?1:-1)
      return (asc?-1:1)*(va>vb?1:(va<vb?-1:0))
    })
  }

  /**
   * Sort alfabetically
   * @param {boolean} asc
   * @returns {Function}
   */
  function sortAZ(asc=true){
    return sort((a, b)=>(asc?1:-1)*(a.firstChild.textContent>b.firstChild.textContent?1:-1))
  }

  /**
   * Sort ascending or descending
   * @param {Function} method
   * @returns {Function}
   */
  function sortAscDesc(method){
    return (e)=>{
      const current = document.querySelector(currentSortSelector)
      const {currentTarget} = e
      if (current===currentTarget){
        currentTarget.classList.toggle(desc)
      } else {
        current?.classList.remove(classCurrentSort)
        currentTarget.classList.add(classCurrentSort)
      }
      method(!currentTarget.classList.contains(desc))()
    }
  }
}
