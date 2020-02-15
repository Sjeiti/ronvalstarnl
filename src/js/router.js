import {parentQuerySelector, expand, createElement} from './utils/html'
import {signal} from './signal'
import {initialise} from './component'

export const routeChange = signal()

const view = document.querySelector('main')
const viewModel = viewModelFactory(view)

let defaultRouteResolve
const routes = {}

window.addEventListener('popstate', onPopstate)

let url = ''

document.body.addEventListener('click', onClick, true)

/**
 * Popstate event handler
 */
function onPopstate(){
  open(location.href)
}

/**
 * Click event handler to detect anchor clicks to local
 * @param {MouseEvent} e
 * @todo add better solution for hrefs that are not routes, ie downloads
 */
function onClick(e){
  const target = e.touches&&e.touches.length&&e.touches[0].target||e.target
  const anchor = target&&parentQuerySelector(target, 'a[href^="/"]', true)
  const href = anchor?.getAttribute?.('href')
  if (anchor&&!/\.\w+$/.test(href)){
    e.preventDefault()
    // todo ?s= replace
    open(href.replace(/search\?s=/, 'search/'))
  }
}

/**
 * Callback for adding routes
 * @callback routeCallback
 * @param {View} view
 * @param {string} [route]
 * @param {string[]} [params]
 * @returns {Promise<object>}
 */

/**
 * Set the default route
 * @param {routeCallback} fn
 */
export function setDefault(fn){
  defaultRouteResolve = fn
}

/**
 * Add a route to the router
 * @param {Array<string|routeCallback>} names
 */
export function add(...names){//,callback
  const callback = names.pop()
  names.forEach(name=>routes[name]=callback)
}

/**
 * Open an uri
 * @param {string} uri
 */
export function open(uri){
  const pathname = getPathname(uri)
  const oldUrl = url
  const oldName = getName(getPathname(oldUrl))
  url = getURL(pathname)
  const name = getName(pathname)
  let routeResolve = defaultRouteResolve
  let routeParams
  for (let route in routes){
    const params = getParams(route, pathname)
    if(params){
      routeParams = params
      routeResolve = routes[route]
      break
    }
  }
  if (url!==oldUrl){
    viewModel.removeEventListeners()
    routeResolve(viewModel, name||'home', routeParams)
      .then(page=>{
        const title = page.title
        history.pushState({}, title, (name[0]==='/'?'':'/')+name)
        routeChange.dispatch(name, page, oldName)
        initialise(view)
        document.body.setAttribute('data-pathname', name)
      })
      .catch(console.error)
  }
}


/**
 * A factory method for the view that is parsed with each route change
 * @param {HTMLElement} element
 * @returns {View}
 * @todo check usages of methods
 */
function viewModelFactory(element){
  //
  //
  //
  //
  /** @lends View.prototype */
  return Object.create({
    /**
     * Clear the view element contents
     * @returns {View}
     */
    clean(){
      const {element, _pastContent} = this
      while (element.firstChild) element.removeChild(element.firstChild)
      //while (element.firstChild) _pastContent.appendChild(element.firstChild)
      element.appendChild(_pastContent)
      // if anim
      // element.appendChild(_pastContent)
      setTimeout(()=>{
         element.removeChild(_pastContent)
         while (_pastContent.firstChild) _pastContent.removeChild(_pastContent.firstChild)
      }, 2111)
      //
      //
      return this
    }
    /**
     * Add and track eventListener to main element
     * @param {object[]} args
     */
    , addEventListener(...args){
      this._events.push(args)
      this.element.addEventListener(...args)
    }
    /**
     * Remove all added listeners
     */
    , removeEventListeners(){
      let args
      while (args = this._events.pop()) this.element.removeEventListener(...args)
    }
    /**
     * Append a child element to the component element
     * @param {HTMLElement} child
     * @return {HTMLElement}
     * @returns {View}
     */
    , appendChild(child){
      this.element.appendChild(child)
      return this
    }
    /**
     * InsertAdjacentHTML to the component element
     * @param {string} position
     * @param {string} text
     * @returns {View}
     */
    , insertAdjacentHTML(position, text){
      this.element.insertAdjacentHTML(position, text)
      return this
    }
    /**
     * QuerySelector the component element
     * @param {string} selector
     * @return {HTMLElement}
     */
    , querySelector(selector){
      return this.element.querySelector(selector)
    }
    /**
     * QuerySelectorAll the component element
     * @param {string} selector
     * @return {NodeList}
     */
    , querySelectorAll(selector){
      return this.element.querySelectorAll(selector)
    }
    /**
     * Append an HTML string to the view
     * @param {string} htmlstring
     * @param {boolean} doClean
     * @return {View}
     */
    , appendString(htmlstring, doClean=true){
      doClean&&this.clean()
      this.insertAdjacentHTML('beforeend', htmlstring)
      initialise(this.element)
      return this
    }
    /**
     * Append an abbreviation string to the view
     * @param {string} abbreviation
     * @param {boolean} doClean
     * @return {View}
     */
    , expandAppend(abbreviation, doClean=true){
      this.appendString(expand(abbreviation), doClean)
      return this
    }
  }, {
    /**
     * The views HTMLElement
     * @type {HTMLElement}
     */
    element: {
      value: element
      , writable: false
    }
    /**
     * The views HTMLElement for out- animation
     * @type {HTMLElement}
     */
    ,_pastContent: {
      value: createElement('div', 'past-content')
      , writable: false
    }
    /**
     * The views added event listeners
     * @type {Function[]}
     */
    , _events: {
      value: []
      , writable: false
    }
  })
}

/**
 * Get parameters from the route and pathname
 * @param {string} route
 * @param {string} pathname
 * @returns {object}
 */
function getParams(route, pathname){
  const routeReg = new RegExp(`^${route.replace(/:[a-zA-Z0-9-%]+/g, '([a-zA-Z0-9-%]+)')}$`)
  const routeMatch = pathname.replace(/^\//, '').match(routeReg)
  return routeMatch&&route
    .split('/')
    .reduce((acc, k, i)=>{
      if(k[0]===':'){
        acc[k.substr(1)] = routeMatch[i]
      }
      return acc
    }, {})
}

/**
 * Get a name from the pathname
 * @param {string} pathname
 * @returns {string}
 */
function getName(pathname){
  return pathname.replace(/^\/|\/$/g, '')
}

/**
 * Get the url from the pathname
 * @param {string} pathname
 * @returns {string}
 */
function getURL(pathname){
  return  location.origin+pathname
}

/**
 * Get the pathname
 * @param {string} uri
 * @returns {string}
 */
function getPathname(uri){
  return new URL(getIsFullURI(uri)?uri:getURL(uri)).pathname
}

/**
 * Is the uri a full uri
 * @param {string} uri
 * @returns {boolean}
 */
function getIsFullURI(uri){
  return /^(\w+:)?\/\//.test(uri)
}
