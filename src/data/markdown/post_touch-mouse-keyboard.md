<!--
  slug: to-determine-touch-mouse-or-keyboard
  date: 2022-12-24
  modified: 2022-12-24
  type: post
  header: mousekey.jpg
  headerColofon: image by [DeepAI](https://deepai.org)
  headerClassName: no-blur darken
  category: code
  tag: ux input
-->

# To determine touch-, mouse- or keyboard input and use it

The DOM in Gecko, Blink and Webkit has no easy way to determine device capabilities or physical user input state.

<small>Gecko, Blink and Webkit are the engines running Firefox, Chrome and Safari respectively. All other browsers use one of these engines (mostly Blink).</small>

The way a user controls a device should determine the feedback it produces. Unfortunately this is often neglected. Not having an easy way to get the input state **touch**, **mouse** or **keyboard** does not help of course.

## For example

You'll often see a touch input triggering the `:hover` state. A state that is really meant for mouse interaction. In some cases this causes a flicker of movement or change, making things look sloppy.

Other times you'll see the default `:focus` state on buttons and links disabled without an alternative. The undesired side effect is that tabbing through a form sometimes has no indication where the current focus is at.


## No W3C standard

The difficulty is that browsers have no standard to determine input environment. Devices may support multiple types of input. A user may even switch from one to the other while browsing.

What's more, the state of a component is often programmed to be determined by the width of the window, not by feature detection and the width of the component.

We do have the [CSS pointer media query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) but this is a static mechanism. A laptop with a touch screen will have `pointer:coarse` even when using a mouse.


## A JavaScript solution

Luckily we can fix this with a small set of JavaScript methods.

Most issues may be solved by some strategically placed CSS classNames. 

So for instance placing `html.user-input--mouse` is enough to use in a CSS preprocessor with a parent-selector. Like in this mobile-first approach:

```scss
.button:hover {
  outline: none;
  .user-input--mouse & {
    outline: lightskyblue solid 0.125rem;
  }
}
```

The above shows the hover effect *only* when interacting with a mouse.

Some implementations might require a bit more logic. Apart from exposing the state with classNames we can use getters and event dispatchers (or observables) to communicate the physical interaction state.

### Proper feature detection

There are a lot of examples online that use `window.innerWidth` or `navigator.userAgent` to determine a mobile environment. Which is a prejudiced way of going about it, not to mention the convoluted regex that is required (and outdated as soon as used).

The only way to be sure the user is navigating by touch, mouse, or keyboard is to use event listeners for `mousemove`, `touchstart` and `keyup`.
This means you'll only know for sure once the events fire. Which is why it pays to also store this state in `sessionStorage` to persist after (re)load.

The module below adds classNames to the documentElement and exposes callback methods for when the input state changes. A bit further down is an implementation example.

```JavaScript
/**
 * Module to check for user input mouse, touch and keyboard
 * Sets the input-state as a className onto the documentElement.
 * Stores the input-state in localStorage.
 * Has an API in form of getters and event dispatchers.
 */

const {documentElement} = document||globalThis.document
const {classList} = documentElement

const addEventListener = documentElement.addEventListener.bind(documentElement)
const removeEventListener = documentElement.removeEventListener.bind(documentElement)

const block = 'user-input'
const className = {
  mouse: `${block}--mouse`,
  touch: `${block}--touch`,
  keyboard: `${block}--keyboard`
}
const event = {
  mousemove: 'mousemove',
  touchstart: 'touchstart',
  keyup: 'keyup',
  click: 'click'
}

const call = fn => fn()

const navigationKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape', 'Enter', 'Tab']

const storageName = 'userInput'
const sessionStorage = window.sessionStorage
const getItem = sessionStorage.getItem.bind(sessionStorage)
const setItem = sessionStorage.setItem.bind(sessionStorage, storageName)

const userInputDefault = {mouse: null, touch: null}
const state = JSON.parse(getItem(storageName)||'null')||userInputDefault

const mouseListeners = []
const touchListeners = []
const keyboardListeners = []

const mouseMoves = new Array(10).fill(0).map((v, i) => i * 1E9)

setDocumentElementClasses()

!state.mouse && addEventListener(event.mousemove, onMouseMove, true)
!state.touch && addEventListener(event.touchstart, onTouchStart, true)

addEventListener(event.keyup, onKeyUp, true)
addEventListener(event.click, onClick, true)

/**
 * Returns whether the device has mouse input
 * @returns {boolean}
 */
export function isUsingMouse() {
  return state.mouse
}

/**
 * Returns whether the device has touch input
 * @returns {boolean}
 */
export function isUsingTouch() {
  return state.touch
}

/**
 * Check if keyboard is used over mouse
 * @returns {boolean}
 */
export function isUsingKeyboard() {
  return state.keyboard
}

/**
 * Callback when mouse input is detected
 * @param {Function} fn
 */
export function whenMouse(fn) {
  fn && !state.mouse && mouseListeners.push(fn) || fn()
}

/**
 * Callback when touch input is detected
 * @param {Function} fn
 */
export function whenTouch(fn) {
  fn && !state.touch && touchListeners.push(fn) || fn()
}

/**
 * Callback when touch input is detected
 * @param {Function} fn
 */
export function whenKeyboard(fn) {
  fn && keyboardListeners.push(fn) || fn()
}

/**
 * MouseMove event listener (because touch devices can fire mouse events too)
 * Is removed when delta T falls below 50 milliseconds
 */
function onMouseMove() {
  mouseMoves.unshift(Date.now())
  mouseMoves.pop()
  const dist = mouseMoves
      .map((val, i, a) => Math.abs(val - a[i + 1]) || 0)
      .reduce((a, b) => a + b, 0) / (mouseMoves.length - 1)
  if (dist < 50) {
    removeEventListener(event.mousemove, onMouseMove, true)
    state.mouse = true
    store()
    mouseListeners.forEach(call)
  }
}

/**
 * TouchStart event listener
 * Removed when dispatched
 */
function onTouchStart() {
  removeEventListener(event.touchstart, onTouchStart, true)
  state.touch = true
  store()
  touchListeners.forEach(call)
}

/**
 * Add keyboard className for keyboard interaction
 * @param {KeyboardEvent} e
 */
function onKeyUp(e) {
  if (!isUsingKeyboard() && navigationKeys.includes(e.key)){
    state.keyboard = true
    store()
    keyboardListeners.forEach(call)
  }
}

/**
 * Remove focuseable className for mouse interaction
 */
function onClick() {
  if (isUsingKeyboard()) {
    state.keyboard = false
    store()
  }
}

/**
 * Session storage for user input mouse and touch
 */
function store() {
  setItem(JSON.stringify(state))
  setDocumentElementClasses()
}

/**
 * Set classes to the body for css usage
 */
function setDocumentElementClasses() {
  classList.toggle(className.mouse, state.mouse)
  classList.toggle(className.touch, state.touch)
  classList.toggle(className.keyboard, state.keyboard)
}
```

### Things to note

The above script can be seen at work in [this fiddle](https://jsfiddle.net/Sjeiti/x1vwu6at/) or in the example below.

Note that keyboard interaction will not automatically toggle the keyboard state. A lot of people will navigate a form using a mouse, type something, and navigate to the next field using the mouse. In this module the keyboard-state is only set when the keyboard is used to navigate (ie by pressing TAB or arrows).

Some assumptions are made that can easily be adjusted if needed.

For one the storage used is `sessionStorage`. It is smart to always default to `sessionStorage` to circumvent the mandatory cookie notification. Should you decide to use `localStorage` make sure to clear it after testing.

The other assumption is that you either use touch *or* mouse. There are indeed devices that are capable of both touch *and* mouse, and fewer users that actually switch between the two. Should you want both you'll have to remove the conditional before  `addEventListener`, remove `removeEventListener` and add a toggle between the two.

### Example implementation

A login screen with indicators below to show what state it is in, and also light up when the callbacks are fired:

```html 
<!--example-->
<style>

:root {
  --shade-inner: 1px 1px 0.375rem silver inset, 0 0 1px silver inset;
  --focus-halo: 0 0 0.25rem dodgerblue;
}
* {
  outline: none;
}
html {
  color: #333;
  background-color: whitesmoke;
}
body {
  padding: 0.5rem;
  font-family: sans-serif;
}
fieldset {
  border: none;
  box-shadow: 2px 2px 8px silver;
  padding: 1.5rem;
  margin: 0 auto;
  max-width: 32rem;
  background-color: white;
}
legend {
  font-weight: bold;
  color: #666;
}
.label {
  display: flex;
  margin-bottom: 1rem;
  line-height: 160%;
}
.label>* {
  flex: 1 1 auto;
}
.input {
  border: 0;
  box-shadow: var(--shade-inner);
  font-size: inherit;
  padding: 0 0.5rem;
  margin-left: 0.5rem;
  max-width: 50vw;
}
.wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.wrap a {
  font-size: 0.75rem;
}
.button {
  line-height: 150%;
  transition: background-color 300ms linear;
  border: 1px solid #666;
  border-radius: 0.25rem;
  text-align: right;
  margin-bottom: 1rem;
  font-size: inherit;
}
.button:active {
  border-color: dodgerblue;
}
.button:focus {
  border-color: green;
}
.user-input--touch .button {
  font-size: 1rem;
}
.user-input--mouse .button:hover {
  background-color: powderblue;
}
.user-input--keyboard .input:focus {
  box-shadow: var(--shade-inner), var(--focus-halo);
}
.user-input--keyboard .button:focus {
  box-shadow: var(--focus-halo);
}
.user-input--keyboard a:focus {
  text-shadow: var(--focus-halo);
}
.indicator {
  max-width: 8rem;
  margin: 2rem auto;
  padding: 0 1rem;
  text-align: center;
  line-height: 160%;
  border-radius: 2rem;
  transition: background-color 300ms linear;
  box-shadow: 0 0.125rem 1rem darkgray;
  color: gray;
  background-color: #eee;
}
.indicator.indicator.indicator--event {
  transition: none;
  background-color: cyan;
}
.user-input--touch .indicator--touch,
.user-input--mouse .indicator--mouse,
.user-input--keyboard .indicator--keyboard {
  background-color: lightcyan;
  color: darkcyan;
}
</style>
<form>
  <fieldset>
    <legend>login</legend>
    <label class="label"><span>username</span><input class="input" type="text" autofocus /></label>
    <label class="label"><span>password</span><input class="input" type="password" /></label>
    <div class="wrap">
      <button class="button" type="button">submit</button>
      <a href="#">forgot password</a>
    </div>
  </fieldset>
</form>
<div class="indicator indicator--mouse">using mouse</div>
<div class="indicator indicator--touch">using touch</div>
<div class="indicator indicator--keyboard">using keyboard</div>
<script>
/**
 * Module to check for user input mouse, touch and keyboard
 * Sets the input-state as a className onto the documentElement.
 * Stores the input-state in localStorage.
 * Has an API in form of getters and event dispatchers.
 */

const {documentElement} = document||globalThis.document
const {classList} = documentElement

const addEventListener = documentElement.addEventListener.bind(documentElement)
const removeEventListener = documentElement.removeEventListener.bind(documentElement)

const block = 'user-input'
const className = {
  mouse: `${block}--mouse`,
  touch: `${block}--touch`,
  keyboard: `${block}--keyboard`
}
const event = {
  mousemove: 'mousemove',
  touchstart: 'touchstart',
  keyup: 'keyup',
  click: 'click'
}

const call = fn => fn()

const navigationKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape', 'Enter', 'Tab']

const storageName = 'userInput'
const sessionStorage = window.sessionStorage
const getItem = sessionStorage.getItem.bind(sessionStorage)
const setItem = sessionStorage.setItem.bind(sessionStorage, storageName)

const userInputDefault = {mouse: null, touch: null}
const state = JSON.parse(getItem(storageName)||'null')||userInputDefault

const mouseListeners = []
const touchListeners = []
const keyboardListeners = []

const mouseMoves = new Array(10).fill(0).map((v, i) => i * 1E9)

setDocumentElementClasses()

!state.mouse && addEventListener(event.mousemove, onMouseMove, true)
!state.touch && addEventListener(event.touchstart, onTouchStart, true)

addEventListener(event.keyup, onKeyUp, true)
addEventListener(event.click, onClick, true)

/**
     * Returns whether the device has mouse input
     * @returns {boolean}
     */
/*export*/ function isUsingMouse() {
  return state.mouse
}

/**
     * Returns whether the device has touch input
     * @returns {boolean}
     */
/*export*/ function isUsingTouch() {
  return state.touch
}

/**
     * Check if keyboard is used over mouse
     * @returns {boolean}
     */
/*export*/ function isUsingKeyboard() {
  return state.keyboard
}

/**
     * Callback when mouse input is detected
     * @param {Function} fn
     */
/*export*/ function whenMouse(fn) {
  fn && !state.mouse && mouseListeners.push(fn) || fn()
}

/**
     * Callback when touch input is detected
     * @param {Function} fn
     */
/*export*/ function whenTouch(fn) {
  fn && !state.touch && touchListeners.push(fn) || fn()
}

/**
     * Callback when touch input is detected
     * @param {Function} fn
     */
/*export*/ function whenKeyboard(fn) {
  fn && keyboardListeners.push(fn) || fn()
}

/**
     * MouseMove event listener (because touch devices can fire mouse events too)
     * Is removed when delta T falls below 50 milliseconds
     */
function onMouseMove() {
  mouseMoves.unshift(Date.now())
  mouseMoves.pop()
  const dist = mouseMoves
  .map((val, i, a) => Math.abs(val - a[i + 1]) || 0)
  .reduce((a, b) => a + b, 0) / (mouseMoves.length - 1)
  if (dist < 50) {
    removeEventListener(event.mousemove, onMouseMove, true)
    state.mouse = true
    store()
    mouseListeners.forEach(call)
  }
}

/**
     * TouchStart event listener
     * Removed when dispatched
     */
function onTouchStart() {
  removeEventListener(event.touchstart, onTouchStart, true)
  state.touch = true
  store()
  touchListeners.forEach(call)
}

/**
     * Add keyboard className for keyboard interaction
     * @param {KeyboardEvent} e
     */
function onKeyUp(e) {
  if (!isUsingKeyboard() && navigationKeys.includes(e.key)){
    state.keyboard = true
    store()
    keyboardListeners.forEach(call)
  }
}

/**
     * Remove focuseable className for mouse interaction
     */
function onClick() {
  if (isUsingKeyboard()) {
    state.keyboard = false
    store()
  }
}

/**
     * Session storage for user input mouse and touch
     */
function store() {
  setItem(JSON.stringify(state))
  setDocumentElementClasses()
}

/**
     * Set classes to the body for css usage
     */
function setDocumentElementClasses() {
  classList.toggle(className.mouse, state.mouse)
  classList.toggle(className.touch, state.touch)
  classList.toggle(className.keyboard, state.keyboard)
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

// import {whenMouse, whenTouch, whenKeyboard} from './ally.js'

window.addEventListener('load', ()=>{
  const indicatorEvent = 'indicator--event'
  function showEvent(type) {
    const elm = document.querySelector('.indicator--'+type)
    elm.classList.add(indicatorEvent)
    requestAnimationFrame(()=>requestAnimationFrame(()=>elm.classList.remove(indicatorEvent)))
  }
  whenMouse(()=>showEvent('mouse'))
  whenTouch(()=>showEvent('touch'))
  whenKeyboard(()=>showEvent('keyboard'))
})
</script>
```

## &mldr;

I hope the module and example will help you with detecting the physical user input to create a more consistent user experience.
