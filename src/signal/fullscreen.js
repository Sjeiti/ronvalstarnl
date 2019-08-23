import Signal from 'signals'

const fullScreen = new Signal
    , vendorPrefixes = ['', 'webkit', 'moz', 'ms']

export default fullScreen

/**
 * Dispatched when the viewport fullscreen state changes.
 * @name signals.fullScreen
 * @type Signal
 */

vendorPrefixes.forEach(prefix=>document.addEventListener(prefix+'fullscreenchange', onFullscreenEvent, false))

/**
 * Handle fullscreen event
 */
function onFullscreenEvent(){
  let fullscreenElement = getFullscreenElement()
  fullScreen.dispatch(!!fullscreenElement, fullscreenElement)
}

/**
 * Return the fullscreen element
 * @returns {Element}
 */
function getFullscreenElement(){
  return document.fullscreenElement
    ||document.mozFullScreenElement
    ||document.webkitFullscreenElement
    ||document.msFullscreenElement
}

/**
 * Return the fullscreen state
 * @returns {boolean}
 */
function getFullscreenState(){
  return !!getFullscreenElement()
}

Object.defineProperty(fullScreen, 'element', {
  enumerable: false
  , configurable: false
  , get: getFullscreenElement
})

Object.defineProperty(fullScreen, 'state', {
  enumerable: false
  , configurable: false
  , get: getFullscreenState
})