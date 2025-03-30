import {from} from './from.js'
import {terms} from './terms.js'
import {vimeo} from './vimeo.js'

const directives = {terms, from, vimeo}

/**
 * Apply directives to a view
 * @param {HTMLElement} view
 */
export function applyDirectives(view){
  Object.entries(directives).forEach(([key, directive])=>{
    const list = Array.from(document.querySelectorAll(`[data-${key}]`))
    list.forEach(elm=>{
      const content = elm.dataset[key]
      directive(elm, content)
    })
  })
}
