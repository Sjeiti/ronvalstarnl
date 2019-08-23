/**
 * Append an element to another one
 * @param {HTMLElement} parent
 * @param {string} nodeName
 * @param {string} content
 * @param {object} attrs
 * @returns {HTMLDivElement}
 */
export function appendChild(parent, nodeName='div', content, attrs){
  attrs
  const elm = document.createElement(nodeName)
  if (typeof content === 'string'){
    elm.innerHTML = content
  } else {
    elm.appendChild(content)
  }
  parent && parent.appendChild(elm)
  return elm
}

/**
 * Parse string into element
 * @param {string} s
 * @returns {DocumentFragment}
 */
export function stringToElement(s){
  const tmpl = document.createElement('div')
  tmpl.innerHTML = s
  const frag = document.createDocumentFragment()
  while (tmpl.children.length) frag.appendChild(tmpl.firstChild)
  return frag
}

/**
 * Queryselect all the parents
 * @param {HTMLElement} elm
 * @param {string} query
 * @param {boolean} inclusive
 * @returns {HTMLElement}
 */
export function parentQuerySelector(elm, query, inclusive=false){
  const closest = elm.closest(query)
  const isChild = closest&&closest.contains(elm)
  return isChild&&closest||inclusive&&elm.matches(query)
}

/**
 * Remove all children
 * @param {HTMLElement} elm
 * @returns {HTMLElement}
 */
export function clean(elm){
  while (elm.firstChild) elm.removeChild(elm.firstChild)
  return elm
}

/**
 * Apply method to each of the selected elements
 * @param {HTMLElement} root
 * @param {string} selector
 * @param {function} fn
 */
export function selectEach(root, selector, fn){
  Array.from(root.querySelectorAll(selector)).forEach(fn)
}
