import {create} from './index'
import {BaseComponent} from './BaseComponent'

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
