import {create} from './index'
import {BaseComponent} from './BaseComponent'

/**
 * JSFiddle component
 */
create('[data-jsfiddle]', class extends BaseComponent{

  constructor(...args){
    super(...args)
    const {_element} = this
    const hash = _element.dataset.jsfiddle
    const iframe = document.createElement('iframe')
    // //fiddle.jshell.net/Sjeiti/EaNPh/show/dark/
    requestAnimationFrame(()=>iframe.src = `//jsfiddle.net/Sjeiti/${hash}/embedded/result/dark/`)
    _element.appendChild(iframe)
  }

})
