<!--
  slug: to-determine-touch-mouse-or-keyboard
  date: 9999-99-99
  modified: 2022-07-22
  type: post
  header: mousekey.jpg
  headerColofon: image by [DeepAI](https://deepai.org)
  headerClassName: no-blur darken
  category: code
  tag: ux input
-->

# To determine touch-, mouse- or keyboard input and use it

The DOM in Gecko, Blink and Webkit has no good way to determine device capabilities or user input state.

<small>Gecko, Blink and Webkit are the engines running Firefox, Chrome and Safari respectively. All other browsers use one of these engines (mostly Blink).</small>

The way a user controls a device should determine the feedback it produces. Unfortunately this is often neglected. Not having an easy way to get the input state **touch**, **mouse** or **keyboard** does not help of course.

## For example

You'll often see a touch input triggering the `:hover` state. A state that is really meant for mouse interaction. In some cases this causes a flicker of movement or change making things look sloppy.

Other times you'll see the default `:focus` state disabled without an alternative. Often done for buttons or links. The undesired side effect is that tabbing through a form sometimes has no indication where the current focus is at.


## No W3C standard

The difficulty is that browsers have no standard to determine input environment. Devices may support multiple types of input. A user may even switch from one to the other while browsing.

We do have the [CSS pointer media query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) but this is a static mechanism. A laptop with a touch screen will have `pointer:coarse` even when using a mouse.


## A JavaScript solution

Luckily we can fix this with a small set of JavaScript methods.

### What the result could be

Most issues may be solved by some strategically placed CSS class names. 

So for instance placing `html.user-input--mouse` is enough to use in a CSS preprocessor with a parent-selector like this:

```scss
.btn:hover {
  outline: none;
  .user-input--mouse & {
    outline: lightskyblue solid 0.125rem;
  }
}
```

The above shows the hover effect *only* when interacting with a mouse.

Some implementations might require a bit more logic. Apart from exposing the state with classNames we can use getters and event dispatchers (or observables) as well.

### Proper feature detection

There are enough examples online that use `window.innerWidth` or `navigator.userAgent` to determine a mobile environment. But matching the useragent string with a giant regex is never up-to-date.

The only way to be really sure the user is navigating by touch, mouse, or keyboard is to use feature detection. That means adding listeners for these events: `mousemove`, `touchstart` and `keyup`.
This also means you'll only know for sure once the events fire. This is why it pays to also store this state in `localStorage` to persist after (re)load.


<!--
Even though a device is capable, a user can one use one form of input at the time.
-->


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

const className = {
  mouse: 'userinput-mouse',
  touch: 'userinput-touch',
  keyboard: 'userinput-keyboard'
}
const event = {
  mousemove: 'mousemove',
  touchstart: 'touchstart',
  keyup: 'keyup',
  click: 'click'
}

const navigationKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape', 'Enter', 'Tab']

const storageName = 'userInput'

const sessionStorage = window.sessionStorage
const getItem = sessionStorage.getItem.bind(sessionStorage)
const setItem = sessionStorage.setItem.bind(sessionStorage, storageName)

const userInputDefault = {mouse: null, touch: null}
const storedObj = JSON.parse(getItem(storageName)||'null')||userInputDefault

const mouseListeners = []
const touchListeners = []

const mouseMoves = new Array(10).fill(0).map((v, i) => i * 1E9)

setBodyClasses()

!storedObj.mouse && addEventListener(event.mousemove, onMouseMove, true)
!storedObj.touch && addEventListener(event.touchstart, onTouchStart, true)

addEventListener(event.keyup, onKeyUp, true)
addEventListener(event.click, onClick, true)

/**
 * Returns whether the device has mouse input
 * @returns {boolean}
 */
export function hasMouse() {
  return storedObj.mouse
}

/**
 * Returns whether the device has touch input
 * @returns {boolean}
 */
export function hasTouch() {
  return storedObj.touch
}

/**
 * Callback when mouse input is detected
 * @param {Function} fn
 */
export function whenMouse(fn) {
  fn && !storedObj.mouse && mouseListeners.push(fn) || fn()
}

/**
 * Callback when touch input is detected
 * @param {Function} fn
 */
export function whenTouch(fn) {
  fn && !storedObj.touch && touchListeners.push(fn) || fn()
}

/**
 * Check if keyboard is used over mouse
 * @returns {boolean}
 */
export function isUsingKeyboard() {
  return classList.contains(className.keyboard)
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
    storedObj.mouse = true
    store()
    mouseListeners.forEach(fn => fn())
  }
}

/**
 * TouchStart event listener
 * Removed when dispatched
 */
function onTouchStart() {
  removeEventListener(event.touchstart, onTouchStart, true)
  storedObj.touch = true
  store()
  touchListeners.forEach(fn => fn())
}

/**
 * Add keyboard className for keyboard interaction
 * @param {KeyboardEvent} e
 */
function onKeyUp(e:KeyboardEvent) {
  !isUsingKeyboard() && navigationKeys.includes(e.key) && classList.add(className.keyboard)
}

/**
 * Remove focuseable className for mouse interaction
 */
function onClick() {
  isUsingKeyboard() && classList.remove(className.keyboard)
}

/**
 * Session storage for user input mouse and touch
 */
function store() {
  setItem(JSON.stringify(storedObj))
  setBodyClasses()
}

/**
 * Set classes to the body for css usage
 */
function setBodyClasses() {
  classList.toggle(className.mouse, storedObj.mouse)
  classList.toggle(className.touch, storedObj.touch)
}
```

### Some assumptions

The above script can be seen at work in [this fiddle](https://jsfiddle.net/Sjeiti/x1vwu6at/).
Some assumptions are made that can easily be adjusted.

For one the storage used is `sessionStorage`. I always default to `sessionStorage` to circumvent the mandatory cookie notification. Should you decide to use `localStorage` make sure to clear it after testing.

The other assumption is that mouse or touch is either/or. 
