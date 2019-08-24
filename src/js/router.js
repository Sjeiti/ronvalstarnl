import {expand} from '@emmetio/expand-abbreviation'
import {parentQuerySelector,clean} from './utils/html'
import {signal} from './signal'
import {component} from './Component'

export const routeChange = signal()

const view = document.querySelector('main')

let defaultRouteResolve
const routes = {}

window.addEventListener('popstate', onPopstate)

let url = ''//location.href
// let currentRouteResolve

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
 */
function onClick(e){
  //e.preventDefault()
  const target = e.touches&&e.touches.length&&e.touches[0].target||e.target
  //console.log('t',!!target,target&&parentQuerySelector(target,'a',true))
  const anchor = target&&parentQuerySelector(target, 'a[href^="/"]', true)
  //console.log(anchor&&'####################################')
  if (anchor){
    e.preventDefault()
    // todo ?s= replace
    open(anchor.getAttribute('href').replace(/search\?s=/, 'search/'))
  }
}

/**
 * Set the default route
 * @param {function} fn
 */
export function setDefault(fn){
  defaultRouteResolve = fn
}

/**
 * Add a route to the router
 * @param {string|function[]} names
 */
export function add(...names){//,callback
  const callback = names.pop()
  console.log('router.add', names)
  names.forEach(name=>routes[name]=callback)
}

/**
 * Open an uri
 * @param {string} uri
 */
export function open(uri){
  console.log('open', uri)
  const pathname = getPathname(uri)
  const oldUrl = url
  const oldName = getName(getPathname(oldUrl))
  url = getURL(pathname)
  const name = getName(pathname)
  console.log('\tname', name, 'empty', name==='', /^\s*$/.test(name))
  let routeKey = ''
  let routeResolve = defaultRouteResolve
  let routeParams
  for (let route in routes){
    const params = getParams(route, pathname)
    if(params){
      routeKey = route
      routeParams = params
      routeResolve = routes[route]
      break
    }
  }
  console.log('\turl', url, 'old', oldUrl, !!routeResolve)
  if (url!==oldUrl){
    console.log('\tresolving', name)
    Object.assign(view,{expandAppend:expandAppend.bind(null,view)})
    routeResolve(view, name||'home', routeParams)
      .then(page=>{
        //console.clear()
        console.log('\tresolved', {page:JSON.stringify(page)})
        console.log('\troute', routeKey)
        console.log('\tpathname', name)
        console.log('\tparams', JSON.stringify(routeParams))
        const title = page.title.rendered||page.title
        history.pushState({}, title, (name[0]==='/'?'':'/')+name)
        console.log('\tpushState', title, name)
        routeChange.dispatch(name, page, oldName)
        component.initialise(view)
        document.body.setAttribute('data-pathname', name)
      })
      .catch(console.error)
  }
}

function expandAppend(element,abbreviation){
  clean(element)
  element.insertAdjacentHTML('beforeend', expand(abbreviation))
  component.initialise(element)
  return element
}

/**
 * Get parameters from the route and pathname
 * @param {string} route
 * @param {string} pathname
 * @returns {object}
 */
function getParams(route, pathname){
  const routeReg = new RegExp(`^${route.replace(/:[a-zA-Z0-9-]+/g, '([a-zA-Z0-9-]+)')}$`)
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
