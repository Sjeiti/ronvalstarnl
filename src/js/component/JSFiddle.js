import {create} from './index'
import {BaseComponent} from './BaseComponent'

/**
 * JSFiddle component
 */
create('[data-jsfiddle]', class extends BaseComponent{

  constructor(...args){
    super(...args)
    const {_element, _element:{dataset:{jsfiddle}}} = this

    const iframe = document.createElement('iframe')
    requestAnimationFrame(()=>iframe.src = `//jsfiddle.net/Sjeiti/${jsfiddle}/embedded/result/`)
    // iframe.src = `//jsfiddle.net/Sjeiti/${jsfiddle}/embedded/result/`

    _element.appendChild(iframe)
  }

})
