import Prism from 'prismjs'

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
  const prismLang = Prism.languages[lang]||Prism.languages.javascript
  /*const highlighted = */Prism.highlight(contents, prismLang)
  elm.innerHTML = Prism.highlight(contents, prismLang)
  elm.parentNode.hasAttribute('line-numbers')&&addLineNumbers(elm, contents)
  elm.classList.add('highlighted')
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
  console.log('lineHighlighted',from,to); // todo: remove log
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
