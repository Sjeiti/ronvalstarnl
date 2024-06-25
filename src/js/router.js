import {parentQuerySelector, expand, createElement, clean} from './utils/html.js'
import {signal} from './signal/index.js'
import {initialise} from './component/index.js'
import {nextFrame, nextTick} from './utils/index.js'
import {applyDirectives} from './directives/index.js'

export const routeChange = signal()

let doAnimateRoute = false
let defaultRouteResolve
const routes = {}

globalThis.window?.addEventListener('popstate', onPopstate)

const ms = getPageTransitionTime()

let url = ''

const className = {
  CONTENT_ANIMATE_OUT: 'content--animate-out'
  , CONTENT_ANIMATE_OUT_START: 'content--animate-out-start'
  , CONTENT_ANIMATE_IN: 'content--animate-in'
  , CONTENT_ANIMATE_IN_START: 'content--animate-in-start'
}

const view = globalThis.document?.querySelector('main')
const viewModel = viewModelFactory(view).init()
document.body.addEventListener('click', onClick, true)

/**
 * Popstate event handler
 */
function onPopstate(){
  open(location.href, true)
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
 * @param {boolean} [popped=false]
 */
export function open(uri, popped){
  const [hash=''] = uri.match(/#\w+/)||[]
  const pathname = getPathname(uri.replace(/\/$/, ''))
  const oldUrl = url
  const oldName = getName(getPathname(oldUrl))
  url = getURL(pathname)
  const name = getName(pathname)
  const currentName = viewModel.getViewName()
  if (name!==currentName){
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
          const urlNew = (name[0]==='/'?'':'/')+name
          popped||history.pushState({}, title, urlNew)
          routeChange.dispatch(name, page, oldName)
          initialise(view)
          applyDirectives(view)
          viewModel.setViewName(name)
          hash&&nextTick(()=>{
            history.replaceState({}, title, urlNew+hash)
            location.hash = hash
          })
          // All loaded. set prerenderReady (https://answers.netlify.com/t/support-guide-understanding-and-debugging-prerendering/150)
          window.prerenderReady||(window.prerenderReady = true)
        })
        .catch(console.error)
    }
  }
}

/**
 * @typedef {Object} View
 */

/**
 * A factory method for the view that is parsed with each route change
 * @param {HTMLElement} element
 * @returns {View}
 */
function viewModelFactory(element){
  /** @lends View.prototype */
  return Object.create({
    init(){
      this._removeAndCleanPastContent()
      return this
    }
    /**
     * Start page transition, clear the view elements
     * @returns {View}
     */
    , clean(){
      const {element, _content, _contentPast} = this
      if (doAnimateRoute){
        _contentPast.parentNode===element && this._removeAndCleanPastContent()
        _content.classList.add(className.CONTENT_ANIMATE_IN)
        _contentPast.classList.add(className.CONTENT_ANIMATE_OUT)
        while (_content.firstChild) _contentPast.appendChild(_content.firstChild)
        element.appendChild(_contentPast)
        nextFrame(() => {
          _content.classList.add(className.CONTENT_ANIMATE_IN_START)
          _contentPast.classList.add(className.CONTENT_ANIMATE_OUT_START)
          this._contentPastTimer = setTimeout(this._removeAndCleanPastContent.bind(this), ms)
        })
      } else {
        while (_content.firstChild) _contentPast.appendChild(_content.firstChild)
        element.appendChild(_contentPast)
        this._removeAndCleanPastContent()
        doAnimateRoute = true
      }
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
     * Append a child element to the content view
     * @param {HTMLElement} child
     * @return {HTMLElement}
     * @returns {View}
     */
    , appendChild(child){
      this._content.appendChild(child)
      return this
    }
    /**
     * InsertAdjacentHTML to the content view
     * @param {string} position
     * @param {string} text
     * @returns {View}
     */
    , insertAdjacentHTML(position, text){
      this._content.insertAdjacentHTML(position, text)
      return this
    }
    /**
     * QuerySelector the content view
     * @param {string} selector
     * @return {HTMLElement}
     */
    , querySelector(selector){
      return this._content.querySelector(selector)
    }
    /**
     * QuerySelectorAll the content view
     * @param {string} selector
     * @return {NodeList}
     */
    , querySelectorAll(selector){
      return this._content.querySelectorAll(selector)
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
      initialise(this._content)
      return this
    }
    /**
     * Append an abbreviation string to the view
     * @param {string} abbreviation
     * @param {boolean} doClean
     * @return {View}
     */
    , expandAppend(abbreviation, doClean=true){
      abbreviation&&this.appendString(expand(abbreviation), doClean)
      return this
    }
    /**
     * Append an abbreviation string to the view
     * @param {string} name
     * @return {View}
     */
    , setViewName(name){
      const {_content, _contentPast} = this
      _contentPast.setAttribute('data-pathname', _content.getAttribute('data-pathname'))
      _content.setAttribute('data-pathname', name)
      document.body.setAttribute('data-pathname', name) // todo may not be good idea
      return this
    }
    /**
     * Get the name of the current view
     * @return {String}
     */
    , getViewName(){
      return this._content.getAttribute('data-pathname')
    }
    /**
     * Remove pastContent from view and clean it
     * @return {View}
     */
    , _removeAndCleanPastContent(){
      const {element, _content, _contentPast} = this
      _contentPast.parentNode&&element.removeChild(_contentPast)
      clean(_contentPast)
      _contentPast.classList.remove(className.CONTENT_ANIMATE_OUT)
      _contentPast.classList.remove(className.CONTENT_ANIMATE_OUT_START)
      _content.classList.remove(className.CONTENT_ANIMATE_IN)
      _content.classList.remove(className.CONTENT_ANIMATE_IN_START)
      clearTimeout(this._contentPastTimer)
      return this
    }
  }, {
    /**
     * The main container HTMLElement
     * @type {HTMLElement}
     */
    element: {
      value: element
      , writable: false
    }
    /**
     * The main view HTMLElement
     * @type {HTMLElement}
     */
    , _content: {
      value: element?.querySelector('.content:not(.content--past)')||createElement('div', 'content', element)
      , writable: false
    }
    /**
     * The views HTMLElement for out- animation
     * @type {HTMLElement}
     */
    , _contentPast: {
      value: element.querySelector('.content--past')||createElement('div', 'content content--past')
      , writable: false
    }
    /**
     * The timer must be reset
     * @type {number}
     */
    , _contentPastTimer: {
      value: 0
      , writable: true
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

/**
 * Traverse styleSheets to calculate total animation duration
 * @return {number}
 */
function getPageTransitionTime(){
  let time = 500
  Array.from(globalThis.document?.styleSheets||[]).forEach(sheet=>{
    try {
      Array.from(sheet.rules).forEach(rule => {
        if (rule.selectorText?.includes('animate-out-start')&&rule.cssText?.includes('transition')){
          const {style:{transitionDuration, transitionDelay}} = rule
          if (transitionDuration&&transitionDelay){
            const durations = transitionDuration.split(',').map(parseFloat)
            const delays = transitionDelay.split(',').map(parseFloat)
            time = Math.max(...durations.map((t, i)=>t+(delays[i]||0)))
          }
        }
      })
    }catch(err){/*fails for sheet.rules on external sheets (fonts)*/}
  })
  return time
}
