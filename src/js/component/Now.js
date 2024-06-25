import {create} from './index.js'
import {BaseComponent} from './BaseComponent.js'

/**
 * Now component
 */
create('[data-now]', class extends BaseComponent{

  constructor(...args){
    super(...args)
    const {_element} = this
    _element.textContent = (new Date).getFullYear()
  }

})
