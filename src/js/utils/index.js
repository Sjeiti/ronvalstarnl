import {TweenMax, Power1} from 'gsap'


// get css rule
// const rootCSS = [...document.styleSheets].map(sheet=>!sheet.href&&sheet.rules).filter(o=>o).map(rules=>[...rules].filter(rule=>rule.selectorText===':root').pop()).filter(o=>o).pop()


/**
 * Returns the hash for a scoped module
 * @param {HTMLElement} elm
 * @returns {string}
 */
export function getHash(elm){
  let attrs = elm.attributes
      , hash = ''
  for (let i = attrs.length - 1; i>=0; i--){
    let name = attrs[i].name
        , isHash = /^data-v-\w+$/.test(name)
    if (isHash) hash = name
  }
  return hash
}

/**
 * Scroll
 * @param {HTMLElement} elm
 * @param {number} [t=1000] time in milliseconds
 * @param {function} [ease=Power1.easeInOut] easing
 * @param {number} [offset=0]
 * @returns {object}
 */
export function scrollTo(elm, t=1000, ease=Power1.easeInOut, offset=0){
  const currentY = getScrollY()
  const animObj = {y:currentY}
  const elmTop = elm.getBoundingClientRect().top
  const y = currentY + elmTop + offset
  return TweenMax.to(
      animObj
      , t/1000
      , {
        y
        , ease
        , onUpdate: () => window.scrollTo(0, animObj.y)
      }
  )
}

/**
 * Scroll to the top of the page
 * @param {HTMLElement} [topTarget]
 * @param {number} [t=1000] time in milliseconds
 * @returns {object}
 */
export function scrollToTop(topTarget, t=1000){
  const top = topTarget?.getBoundingClientRect().bottom||0
  const {body} = document
  const bodyTop = body.getBoundingClientRect().top
  console.log('scrollToTop', top-16-bodyTop) // todo: remove log
  return scrollTo(body, t, null, top-16-bodyTop)
}

/**
 * Retreive current vertical scroll position
 * @returns {Number}
 */
export function getScrollY(){
  return (window.pageYOffset!==null)?window.pageYOffset:(html.scrollTop!==null)?html.scrollTop:document.body.scrollTop
}

/**
 * Retreive current vertical scroll position
 * @returns {Number}
 */
export function getScrollX(){
  return (window.pageXOffset!==null)?window.pageXOffset:(html.scrollLeft!==null)?html.scrollLeft:document.body.scrollLeft
}

//export function parseLocalUri(uri) {
// return uri.replace('http://localhost.ronvalstar','').replace('http://'+location.host,'')
//}

/**
 * Toggle fullschreen mode for an element
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function toggleFullScreen(element){
  let isNotFullscreen = !document.fullscreenElement
    &&!document.mozFullScreenElement
    &&!document.webkitFullscreenElement
    &&!document.msFullscreenElement

  if (isNotFullscreen){
    if (element.requestFullscreen){
      element.requestFullscreen()
    } else if (element.msRequestFullscreen){
      element.msRequestFullscreen()
    } else if (element.mozRequestFullScreen){
      element.mozRequestFullScreen()
    } else if (element.webkitRequestFullscreen){
      element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
    }
  } else {
    if (document.exitFullscreen){
      document.exitFullscreen()
    } else if (document.msExitFullscreen){
      document.msExitFullscreen()
    } else if (document.mozCancelFullScreen){
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen){
      document.webkitExitFullscreen()
    }
  }
  return isNotFullscreen
}

/**
 * Recursive Object.freeze
 * @param {Object} o
 * @returns {Object}
 */
export function deepFreeze(o){
  Object.freeze(o)
  Object.getOwnPropertyNames(o).forEach(function(prop){
    if (
        o.hasOwnProperty(prop)&&
        o[prop] !== null&&
        (typeof o[prop] === 'object' || typeof o[prop] === 'function')&&
        !Object.isFrozen(o[prop])
    ){
      deepFreeze(o[prop])
    }
  })
  return o
}

/**
 * Load an image by promise
 * @param {string} src
 * @returns {Promise<any>}
 */
export function loadImage(src){
  return new Promise((resolve, reject)=>{
    let img = new Image()
    img.addEventListener('load', resolve)
    img.addEventListener('error', reject)
    img.src = src
  })
}

/**
 * @param {number} n
 * @param {number} [min=0]
 * @param {number} [max=1]
 * @returns {number}
 */
export function clamp(n, min=0, max=1){
  return Math.min(Math.max(n, min), max)
}

/**
 * Load javascript file
 * @param {string} src
 * @returns {Promise<any>}
 */
export function loadScript(src){
  return new Promise((resolve, reject)=>{
    let script = document.createElement('script')
    document.body.appendChild(script)
    script.addEventListener('load', resolve)
    script.addEventListener('error', reject)
    script.setAttribute('src', src)
  })
}

/**
 * Next tick
 * @param {function} fn
 * @returns {number}
 */
export function nextTick(fn){
  return requestAnimationFrame(fn)
}

/**
 * Reduce canonical uri from page/post/project item
 * @param {object} page
 * @return {string}
 * @todo define object
 */
export function getCanonical(page){
  return 'https://ronvalstar.nl/'+(page.type==='fortpolio'?'project/':'')+page.slug
}