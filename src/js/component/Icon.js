import {create} from './index'
import {BaseComponent} from './BaseComponent'
import {NS_SVG, NS_XLINK} from '../config'
import root from '!!raw-loader!../../../temp/icomoon/symbol-defs.svg'

document.body.insertAdjacentHTML('beforeend', root)

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
