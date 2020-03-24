import Prism from 'prismjs'
import {createElement} from './html'
import {initialise} from '../component'

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
  const contents = elm.textContent
  const lang = elm.getAttribute('data-language')
      ||elm.getAttribute('class').match(/language-(\w+)/).pop()
      ||'javascript'

  const matchFirstComment = contents.match(/^<!--(.*)-->/)
  const type = matchFirstComment&&matchFirstComment.pop()||lang

  const isExample = type==='example'
  const isIllustration = type==='illustration'
  if (isExample||isIllustration){

    // createElement(type, classes, parent, attributes, text, click)
    const exampleUI = isExample&&getJSFiddleButton(contents)

    const {parentNode:pre, parentNode: {parentNode}, textContent} = elm
    const iframe = document.createElement('iframe')
    iframe.classList.add(type)
    exampleUI&&parentNode.insertBefore(exampleUI, pre)
    parentNode.insertBefore(iframe, pre)
    parentNode.removeChild(pre)
    requestAnimationFrame(()=>{
      const {contentWindow: {document}} = iframe
      document.writeln(textContent)
      requestAnimationFrame(()=>iframe.style.height = `${document.body.scrollHeight}px`)
    })

  } else {
    elm.setAttribute('data-language', lang)
    const prismLang = Prism.languages[lang]||Prism.languages.javascript
    /*const highlighted = */Prism.highlight(contents, prismLang)
    elm.innerHTML = Prism.highlight(contents, prismLang)
    elm.parentNode.hasAttribute('line-numbers')&&addLineNumbers(elm, contents)
    elm.classList.add('highlighted')
  }
}

/**
 * Creates a form with button to post to JSFiddle
 * @param contents
 * @return {HTMLElement}
 */
function getJSFiddleButton(contents){
  const wrapper = document.createElement('div')
  wrapper.innerHTML = contents
  const style = wrapper.querySelector('style')
  const script = wrapper.querySelector('script')

  const css = style?.innerText||''
  const js = script?.innerText||''

  style&&wrapper.removeChild(style)
  script&&wrapper.removeChild(script)
  const html = wrapper.innerHTML
  //
  const ui = createElement('form', 'example-ui', null, {
    method: 'post'
    , action: 'http://jsfiddle.net/api/post/library/pure/'
    , target: 'check'
  })
  const button = createElement('button', null, ui, {type:'submit'}, 'jsfiddle')
  button.innerHTML = '<svg data-icon="jsfiddle"><title>JSFiddle</title></svg>'
  initialise(button)

  createElement('input', null, ui, {type:'hidden', name:'css', value:css})
  createElement('input', null, ui, {type:'hidden', name:'html', value:html})
  createElement('input', null, ui, {type:'hidden', name:'js', value:js})
  return ui
}

/**
 * Add line numbers to code
 * @param {HTMLElement} elm
 * @param {string} code
 */
function addLineNumbers(elm, code){
  const match = code.match(/\n(?!$)/g)
  const linesNum = match ? match.length + 1 : 1
  const lineNumbersWrapper = document.createElement('ol')
  for (let i=0;i<linesNum;i++){
    const line = document.createElement('li')
    line.setAttribute('id', 'code-'+(i+1)) // todo: fix id for multiple code instances
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
