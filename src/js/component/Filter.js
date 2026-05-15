import {create, initialise} from './index.js'
import {BaseComponent} from './BaseComponent.js'
import {signal} from '../signal/index.js'
import {clean} from '../utils/html.js'
import {select} from '../utils/style.js'
import {slugify} from '../utils/string.js'
import {open,routeChange} from '../router.js'
import {nextFrame} from '../utils/index.js'

/**
 * Filter component
 */
create('[data-filter]', class extends BaseComponent{

  constructor(...args){
    super(...args)

    const {list,pathnamePrefix} = this._parseOptions(this._element.getAttribute('data-filter'))

    const ul = this._append(`
      ul>(${list.map(filterItem=>{
        const {name, slug} = filterItem
        const pathname = pathnamePrefix+slugify(slug)
        return `li>a[href="${pathname}"]{${name}}`
      }).join('+')})
    `)
    ul.addEventListener('click',this._onListClick.bind(this,pathnamePrefix.replace(/\/$/,'')), true)

    routeChange.add(this._onRouteChange.bind(this))
  }

  _onListClick(pathNamePrefix,e){
    const {target} = e
    const href = target.getAttribute('href')
    if(location.pathname===href){
      open(pathNamePrefix)
      e.preventDefault()
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
