import {create, initialise} from './index.js'
import {BaseComponent} from './BaseComponent.js'
import {signal} from '../signal/index.js'
import {clean} from '../utils/html.js'
import {select} from '../utils/style.js'
import {slugify} from '../utils/string.js'
import {routeChange} from '../router.js'

/**
 * Filter component
 */
create('[data-filter]', class extends BaseComponent{

  constructor(...args){
    super(...args)

    const {list,pathnamePrefix} = this._parseOptions(this._element.getAttribute('data-filter'))

    const ul = this._append(`
      ul>(${list.map(s=>{
        const pathname = pathnamePrefix+slugify(s)
        return `li>a[href="${pathname}"]{${s}}`
      }).join('+')})
    `)
    ul.addEventListener('mousedown',this._onListDown.bind(this,pathnamePrefix))

    routeChange.add(this._onRouteChange.bind(this))
  }

  _onListDown(pathNamePrefix,e){
    const {target} = e
    const href = target.getAttribute('href')
    if(location.pathname===href){
      target.setAttribute('href',pathNamePrefix)
      requestAnimationFrame(()=>target.setAttribute('href',href))
    }
  }

  /**
   * Route change signal handler
   * @param {string} pathName
   * @private
   */
  _onRouteChange(pathName){
    this._element.querySelector('.current')?.classList.remove('current')
    this._element.querySelector(`[href="/${pathName}"`)?.classList.add('current')
  }
})
