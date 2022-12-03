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
  , (/**View*/view/*, route, params*/)=>{
    return fetchJSONFiles('page_cv', 'fortpolio-list')
      .then(([page, projects])=>{
        view.appendString(page.content)
        // view.addEventListener('click', onClickPDF)
        view.addEventListener('click', onClickDownload)
        // projects
        const cvProjects = projects
          .filter(p=>p.inCv)
          // .sort((a, b)=>new Date(a.dateFrom)>new Date(b.dateFrom)?-1:1)
          .sort((a, b)=>new Date(a.dateTo)>new Date(b.dateTo)?-1:1)

        // cvProjects
        const tagList = cvProjects.reduce((acc, project)=>{
          project.tags.forEach(tag=>acc.includes(tag)||acc.push(tag))
          return acc
        }, [])
        const tagUl = expand(`ul.tags>(${tagList.map(tag=>`li{${tag}}`).join('+')})`)
        // view.appendString(tagUl, false)
        console.log('tagList', tagList) // todo: remove log

        let projectString = expand(`ul.unstyled.cv-projects>(${cvProjects.map(
            (project, i)=>`(
              li${project.categories.map(c=>`.cat-${slugify(c)}`).join('')}
                >(header
                  >(h3${(project.inPortfolio?`>a[href="/project/${project.slug}"]{${project.title}}`:`{${project.title}}`)})
                  +(.date>time.date-from{${project.dateFrom.replace(/-\d\d$/,'')}}
                  +time.date-to{${project.dateTo.replace(/-\d\d$/,'')}})
                )
                +{replaceContent${i}}
                ${(project.clients?.length?`+dl>(dt{client}+dd{${project.clients.join(', ')}})`:'')}
                +(ul.tags>(${project.tags.map(tag=>`li{${tag}}`).join('+')}))
             )`
          ).join('+')})`)
        cvProjects.forEach((project, i) => projectString = projectString.replace('replaceContent'+i, project.excerpt&&`<p>${project.excerpt}</p>`||project.content))
        view.appendString(projectString, false)
        return page
      })
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
