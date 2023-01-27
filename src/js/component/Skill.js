import {create} from './index'
import {BaseComponent} from './BaseComponent'
import {NS_SVG} from '../config'

/**
 * Search component
 */
create('[data-skill]', class extends BaseComponent{

  constructor(...args){
    super(...args)
    applySkillSVG(this._element)
  }

})

/**
 * Create five star SVG elements as part of data-skill attribute in parent
 * @param {HTMLElement} parent
 */
export function applySkillSVG(parent){
  Array.from(new Array(5)).forEach(()=>{
    const svg = document.createElementNS(NS_SVG, 'svg')
    svg.setAttribute('data-icon', 'star')
    parent.insertBefore(svg, parent.firstChild)
  })
}
