/** Signal for scrolling.<br/>
 * The callback for this signal is Function(scrollLeft,scrollTop)
 * @type Signal
 */
import {signal} from './index.js'
import {getScrollX, getScrollY} from '../utils/index.js'

export const scroll = signal()
const {documentElement} = document
// const body = document.body
const capture = true
const passive = true
const listenerOptions = {capture, passive}

window.addEventListener('touchmove', handleScroll, listenerOptions)
window.addEventListener('scroll', handleScroll, listenerOptions)

/**
 * Handle the scroll event
 * @param {Event} e
 */
function handleScroll(e){
  const x = getScrollX()
  const y = getScrollY()
  const maxx = documentElement.scrollWidth - documentElement.clientWidth
  const maxxp = x/maxx
  const maxy = documentElement.scrollHeight - documentElement.clientHeight
  const maxyp = y/maxy
  documentElement.style.setProperty('--scroll-part', maxyp.toFixed(4))
  scroll.dispatch(e, x, y, maxxp, maxyp)
}
