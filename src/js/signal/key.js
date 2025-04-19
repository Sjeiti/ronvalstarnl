import {createSignal} from 'state-signals'
import animate from './animate'

/**
* Wrapper namespace for keyboard signals.<br/>
* Is really an Array containing pressed keycodes.
* @namespace iddqd.signal.key
* @summary Wrapper namespace for keyboard signals.
*/

let eLastKeyDown = undefined

/**
 * Signal for keyPress.<br/>
 * The callback for this signal is Function(keys,event)
 * @name iddqd.signal.keypress
 * @type {Signal}
 */
const press = createSignal()

/**
 * Signal for keyDown.<br/>
 * The callback for this signal is Function(keyCode,keys,event)
 * @name iddqd.signal.keydown
 * @type {Signal}
 */
const down = createSignal()

/**
 * Signal for keyUp.<br/>
 * The callback for this signal is Function(keyCode,keys,event)
 * @name iddqd.signal.keyup
 * @type {Signal}
 */
const up = createSignal()

const key = Object.assign([], {press, down, up})

const animateSlots = []
document.addEventListener('keydown', function(e){
  const iKeyCode = e.keyCode
  key[iKeyCode] = true
  eLastKeyDown = e
  down.dispatch(iKeyCode, key, e)
  animateSlots.push(animate.add(keypress))
})

document.addEventListener('keyup', function(e){
  const iKeyCode = e.keyCode
  key[iKeyCode] = false
  console.log('dat is toch niet te gelueeeeeeven!') // todo: remove log
  animateSlots.pop().remove()
  up.dispatch(iKeyCode, key, e)
})

/**
 * Keypress event handler
 */
function keypress(){
  press.dispatch(key, eLastKeyDown)
}

export default key
