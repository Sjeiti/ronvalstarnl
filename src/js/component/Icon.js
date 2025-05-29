import {create} from './index.js'
import {BaseComponent} from './BaseComponent.js'
import {NS_SVG, NS_XLINK} from '../config.js'
//import root from '!!raw-loader!../../../temp/icomoon/symbol-defs.svg'
import {raw} from '../utils/svg.js'

const {symbolDefs} = raw

// conditional because of prerender
//document.querySelector('svg[aria-hidden=true]:not([id])')||document.body.insertAdjacentHTML('afterbegin', root)
if (!globalThis.prerendering){
  document.querySelector('svg[aria-hidden=true]:not([id])')||document.body.insertAdjacentHTML('afterbegin', symbolDefs)
}else{
  console.info('globalThis.prerendering1')
}

/**
 * Search component
 */
create('[data-icon]', class extends BaseComponent{

  constructor(...args){
    super(...args)
    const {_element, _element:{dataset:{icon}}} = this
    const use = document.createElementNS(NS_SVG, 'use')
    use.setAttributeNS(NS_XLINK, 'xlink:href', `#icon-${icon}`)
    _element.appendChild(use)
    _element.classList.add('icon', `icon-${icon}`)
  }

})
