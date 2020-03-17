import {create} from './index'
import {BaseComponent} from './BaseComponent'
import {NS_SVG} from '../config'

/**
 * Search component
 */
create('[data-skill]', class extends BaseComponent{

  constructor(...args){
    super(...args)
    const {_element} = this
    Array.from(new Array(5)).forEach(()=>{
      const svg = document.createElementNS(NS_SVG, 'svg')
      svg.setAttribute('data-icon', 'star')
      _element.insertBefore(svg, _element.firstChild)
    })
  }

})
