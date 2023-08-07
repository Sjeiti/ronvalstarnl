import {create} from './index'
import {BaseComponent} from './BaseComponent'
import {NS_SVG} from '../config'
import {createElement} from '../utils/html'

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
    svg.setAttribute('aria-label', 'star')
    svg.setAttribute('inert', '')
    parent.insertBefore(svg, parent.firstChild)
  })
  //
  const skill = parseFloat(parent.dataset.skill)
  const skillPercentage = skill*20
  const wrap = createElement('div', null, parent)

  wrap.style.clipPath = `polygon(0 0, ${skillPercentage}% 0, ${skillPercentage}% 100%, 0% 100%)`
  Array.from(new Array(5)).forEach(()=>{
    const svg = document.createElementNS(NS_SVG, 'svg')
    svg.setAttribute('data-icon', 'star')
    svg.setAttribute('aria-label', 'star')
    svg.setAttribute('inert', '')
    // svg.setAttribute('role', 'none')
    // svg.setAttribute('aria-hidden', 'true')
    wrap.appendChild(svg)
  })

  createElement('span', 'visually-hidden', wrap, null, skill+' stars')
}
