import {create} from './index'
import {BaseComponent} from './BaseComponent'

/**
 * JSFiddle component
 */
create('[data-jsfiddle]', class extends BaseComponent{

  constructor(...args){
    super(...args)
    const {_element, _element:{dataset:{jsfiddle}}} = this
    const [hash, height] = jsfiddle.split(/:/g)
    const iframe = document.createElement('iframe')
    height&&(iframe.style.height = height+'rem')
    requestAnimationFrame(()=>iframe.src = `//jsfiddle.net/Sjeiti/${hash}/embedded/result/`)
    _element.appendChild(iframe)
  }

})
