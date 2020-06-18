const _componentClasses = {}
const _instances = new Map()
const _body = document.body
const _eventNames = 'mousedown,mouseup,click,dblclick,submit,focus,blur,keydown,keyup,keypress'.split(/,/g)
const _eventHandlers = _eventNames.map(name=>'on'+name.substr(0, 1).toUpperCase()+name.substr(1))
const _eventInstances = _eventNames.map(()=>[])
const _eventInitialised = _eventNames.map(()=>false)

/**
 * Create a component by binding it to a specific selector
 * @param {string} componentSelector
 * @param {function} componentClass
 */
export function create(componentSelector, componentClass){
  if (_componentClasses[componentSelector]){
    throw new Error(`Component with selector '${componentSelector}' already initialised`)
  } else {
    _componentClasses[componentSelector] = componentClass
  }
}

/**
 * Initialise manually so clear the next tick timeout
 * @param {HTMLElement} [rootElement]
 */
export function initialise(rootElement){
  _initialise(rootElement||_body)
  _initEvents()
  _initScripts(rootElement)
  _dispatchOnInit()
}

/**
 * Find and return the component instance for an element
 * @param {HTMLElement} element
 * @returns {object}
 */
export function componentOf(element){
  return _instances.get(element)
}

/**
 * Loop through all possible component-attributes, querySelect them all and instantiate their related class
 * @param {HTMLElement} rootElement
 * @param {string} [childOfAttr]
 * @todo childOfAttr should be array of all recursed attrs
 * @private
 */
function _initialise(rootElement, childOfAttr){
  for (const attr in _componentClasses){
    const elements = Array.from(rootElement.querySelectorAll(attr))
    const isRecursive = attr===childOfAttr&&elements.length
    if (isRecursive){
      console.warn('Recursive component detected', rootElement, attr)
      throw new Error(`Recursive component detected on ${rootElement} and ${attr}`, rootElement)
    } else {
      elements.map(element=>_initElement(element, attr))
    }
  }
}

/**
 * Initialise a single element component
 * @param {HTMLElement} element
 * @param {string} attr
 * @private
 */
function _initElement(element, attr){
  if (!componentOf(element)){
    const componentClass = _componentClasses[attr]
    const instance = new componentClass(element)
    _initialise(instance.element, attr)
    _eventHandlers.forEach((handler, i)=>{
      instance[handler]&&_eventInstances[i].push(instance)
    })
    element.component = instance
    _instances.set(element, instance)
  }
}

/**
 * Check event instances and apply all events too root element
 * @todo may not need this._eventInitialised
 * @private
 */
function _initEvents(){
  _eventInstances.forEach((list, i)=>{
    const hasTargets = list.length
        , isInitialised = _eventInitialised[i]
    if (hasTargets&&!isInitialised){
      _body.addEventListener(_eventNames[i], _onEvent.bind(this, list, _eventHandlers[i]))
      _eventInitialised[i] = true
    }
  })
}

/**
 * Because router uses 'insertAdjacentHTML' the scripts are not run
 * So we re-add them to fix it (with an IIFE).
 * @param {HTMLElement} rootElement
 * @private
 */
function _initScripts(rootElement){
  Array.from(rootElement.querySelectorAll('script'))
      .filter(m=>m.parentNode===rootElement)
      .forEach(m=>{
        const script = document.createElement('script')
        script.innerText = `(function(){\n${m.innerText}\n})()`
        rootElement.insertBefore(script, m)
        rootElement.removeChild(m)
      })
}

/**
 * Call onInit on instances after all instances are created
 * @private
 */
function _dispatchOnInit(){
  for (const instance of _instances.values()){
    instance.onInit&&instance.onInit()
  }
}

/**
 * Global event handler proxy delegating events to subscribed components
 * @param {BaseComponent[]} list
 * @param {function} handler
 * @param {Event} e
 * @private
 */
function _onEvent(list, handler, e){
  let target = e.target
  const parents = []
  while (target&&target!==_body){
      parents.unshift(target)
      target = target.parentNode
  }
  list.forEach(comp=>{
    parents.includes(comp.element)&&comp[handler](e)
  })
}
