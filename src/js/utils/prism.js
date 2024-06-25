import Prism from 'prismjs'
import {createElement} from './html.js'
import {initialise} from '../component/index.js'
import {nextFrame} from './index.js'

Prism.languages.insertBefore('javascript', 'comment', {
  'cut': /\s*\(\.\.\.\)\s*/
})
Prism.languages.insertBefore('javascript', 'comment', {
  'jsdoc': /\/\*\*\s*\n([^*]*(\*[^/])?)*\*\//
})

const codeSelector = 'pre>code'

/**
 * Match elements and apply Prism
 * @param {HTMLElement} root
 */
export function prismToRoot(root){
  Array.from(root.querySelectorAll(codeSelector))
    .forEach(prismToElement)
}

/**
 * Apply Prism to element
 * @param {HTMLElement} elm
 */
export function prismToElement(elm){

  const pres = Array.from(document.querySelectorAll('pre'))

  const {parentNode:pre, parentNode: {parentNode}, textContent, dataset: {language}} = elm

  const index = pres.indexOf(pre)

  let contents = textContent
      .replace(/\n/g, '\r\n').replace(/\r+/g, '\r')
      .replace(/\r/g, '\r\n').replace(/\n+/g, '\n')

  const className = elm.getAttribute('class')
  const lang = language
      ||className?.match(/language-(\w+)/)?.pop()
      ||''
  const [, , ...props] = className?.match(/language(-\w*)*/g)?.pop()?.split(/-/)||[]

  const matchFirstComment = contents.match(/^<!--(.*)-->/)
  const type = matchFirstComment&&matchFirstComment.pop()||lang

  const isExample = type==='example'
  const isEmbed = type==='embed'
  const isIllustration = type==='illustration'
  if (isExample||isIllustration){

    //include
    const matchIncludes = contents.match(/<!--include:(\w+)-->/g)
    matchIncludes?.forEach(inc=>{
      const id = inc.match(/<!--include:(\w+)-->/).pop()
      const template = document.getElementById?.(id)
      const div = document.createElement('div')
      div.appendChild(template.content.cloneNode(true))
      contents = contents.replace(`<!--include:${id}-->`, div.innerHTML)
    })

    // createElement(type, classes, parent, attributes, text, click)
    const exampleUI = isExample&&getJSFiddleButton(contents)

    const iframe = document.createElement('iframe')
    iframe.classList.add(type)
    exampleUI&&parentNode.insertBefore(exampleUI, pre)
    parentNode.insertBefore(iframe, pre)
    parentNode.removeChild(pre)

    const matchHeight = contents.match(/<!--height:(\d+\.?\d*\w+)-->/g)
    const matchedHeight = matchHeight&&contents.match(/<!--height:(\d+\.?\d*\w+)-->/).pop()

    nextFrame(()=>{
      const {contentWindow: {document}} = iframe
      document.writeln(contents) // document.body.innerHTML breaks JS execution
      const height = matchedHeight||`${document.body.scrollHeight}px`
      requestAnimationFrame(()=>iframe.style.height = height)
    }, 6)

  } else if (isEmbed){
    pre.insertAdjacentHTML('beforebegin', contents)
    parentNode.removeChild(pre)

  } else {
    const lineNumbers = 'line-numbers'
    const pre = elm.parentElement
    const maybeComment = pre.previousSibling.previousSibling
    maybeComment.nodeType===8&&maybeComment.textContent==='line-numbers'&&pre.setAttribute(lineNumbers, '')

    elm.setAttribute('data-language', lang)
    lang&&(elm.dataset.language = lang)
    const prismLang = Prism.languages[lang]||Prism.languages.javascript
    /*const highlighted = */Prism.highlight(contents, prismLang)
    elm.innerHTML = Prism.highlight(contents, prismLang)
    pre.hasAttribute(lineNumbers)&&addLineNumbers(elm, index, contents)
    elm.classList.add('highlighted')
    props.forEach(prop=>pre.classList.add('code--'+prop))
  }
}

/**
 * Creates a form with button to post to JSFiddle
 * @param {string} contents
 * @return {HTMLElement}
 */
function getJSFiddleButton(contents){
  const wrapper = document.createElement('div')
  wrapper.innerHTML = contents

  const resources = []
  const [css, js] = [':scope > style', ':scope > script'].map(name=>Array.from(wrapper.querySelectorAll(name)).reduce((acc, elm)=>{
    wrapper.removeChild(elm)
    elm.hasAttribute('src')&&resources.push(elm.getAttribute('src'))
    return acc + elm.innerText
  }, ''))

  const html = wrapper.innerHTML

  const ui = createElement('form', 'example-ui', null, {
    method: 'post'
    , action: 'http://jsfiddle.net/api/post/library/pure/'
    , target: 'check'
  })
  const button = createElement('button', null, ui, {type:'submit'}, 'jsfiddle')
  button.innerHTML = '<svg data-icon="jsfiddle"><title>JSFiddle</title></svg>'
  initialise(button)

  Object.entries({css, html, js, resources}).forEach(([name, value]) => createElement('input', null, ui, {type: 'hidden', name, value}))

  return ui
}

/**
 * Add line numbers to code
 * @param {HTMLElement} elm
 * @param {number} index
 * @param {string} code
 */
function addLineNumbers(elm, index, code){
  const match = code.match(/\n(?!$)/g)
  const linesNum = match ? match.length + 1 : 1
  const lineNumbersWrapper = document.createElement('ol')
  for (let i=0;i<linesNum;i++){
    const line = document.createElement('li')
    line.setAttribute('id', `code-${index}-${i+1}`)
    lineNumbersWrapper.appendChild(line)
  }
  lineNumbersWrapper.setAttribute('aria-hidden', 'true')
  lineNumbersWrapper.className = 'line-numbers-rows'
  elm.parentNode.appendChild(lineNumbersWrapper)
  // todo timeout scrollto if route has #code-\d+
}

/*
lineHighlighted.add((from,to)=>{
  let highlight = 'highlight'
      ,elmFrom = document.getElementById(from)
      ,elmTo = to&&document.getElementById(to)
      ,elmOl = elmFrom&&elmFrom.parentNode
  Array.prototype.forEach.call(elmOl.getElementsByClassName(highlight),elm=>elm.classList.remove(highlight))
  elmFrom&&elmFrom.classList.add(highlight)
  if (elmTo) {
    let nextNode = elmFrom
    while (nextNode) {
      nextNode.classList.add(highlight)
      nextNode = elmTo===nextNode?null:nextNode.nextSibling
    }
  }
})
*/
