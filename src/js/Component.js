import {expand} from '@emmetio/expand-abbreviation'

/**
 * A component factory
 */
class Component{

  _componentClasses = {}
  _instances = new Map()
  _body = document.body
  _eventNames = 'mousedown,mouseup,click,dblclick,submit,focus,blur,keydown,keyup,keypress'.split(/,/g)
  _eventHandlers = this._eventNames.map(name=>'on'+name.substr(0, 1).toUpperCase()+name.substr(1))
  _eventInstances = this._eventNames.map(()=>[])
  _eventInitialised = this._eventNames.map(()=>false)

  /**
   * Create a component by binding it to a specific selector
   * @param {string} componentSelector
   * @param {function} componentClass
   */
  create(componentSelector, componentClass){
    if (this._componentClasses[componentSelector]){
      throw new Error(`Component with selector '${componentSelector}' already initialised`)
    } else {
      this._componentClasses[componentSelector] = componentClass
    }
  }

  /**
   * Initialise manually so clear the next tick timeout
   * @param {HTMLElement} rootElement
   */
  initialise(rootElement){
    this._initialise(rootElement||this._body)
    this._initEvents()
    this._dispatchOnInit()
  }

  /**
   * Find and return the component instance for an element
   * @param {HTMLElement} element
   * @returns {object}
   */
  of(element){
    return this._instances.get(element)
  }

  /**
   * Loop through all possible component-attributes, querySelect them all and instantiate their related class
   * @param {HTMLElement} rootElement
   * @param {string} [childOfAttr]
   * @todo childOfAttr should be array of all recursed attrs
   * @private
   */
  _initialise(rootElement, childOfAttr){
    for (const attr in this._componentClasses){
      const elements = Array.from(rootElement.querySelectorAll(attr))
      const isRecursive = attr===childOfAttr&&elements.length
      if (isRecursive){
        console.warn('Recursive component detected', rootElement, attr)
        throw new Error(`Recursive component detected on ${rootElement} and ${attr}`, rootElement)
      } else {
        elements.map(element=>this._initElement(element, attr))
      }
    }
  }

  /**
   * Initialise a single element component
   * @param {HTMLElement} element
   * @param {string} attr
   * @private
   */
  _initElement(element, attr){
    if (!this.of(element)){
      const componentClass = this._componentClasses[attr]
      const instance = new componentClass(element)
      this._initialise(instance.element, attr)
      this._eventHandlers.forEach((handler, i)=>{
        instance[handler]&&this._eventInstances[i].push(instance)
      })
      element.component = instance
      this._instances.set(element, instance)
    }
  }

  /**
   * Check event instances and apply all events too root element
   * @todo may not need this._eventInitialised
   * @private
   */
  _initEvents(){
    this._eventInstances.forEach((list, i)=>{
      const hasTargets = list.length
          , isInitialised = this._eventInitialised[i]
      if (hasTargets&&!isInitialised){
        this._body.addEventListener(this._eventNames[i], this._onEvent.bind(this, list, this._eventHandlers[i]))
        this._eventInitialised[i] = true
      }
    })
  }

  /**
   * Call onInit on instances after all instances are created
   * @private
   */
  _dispatchOnInit(){
    for (const instance of this._instances.values()){
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
  _onEvent(list, handler, e){
    let target = e.target
    const parents = []
    while (target&&target!==this._body){
        parents.unshift(target)
        target = target.parentNode
    }
    list.forEach(comp=>{
      parents.includes(comp.element)&&comp[handler](e)
    })
  }
}
const component = new Component()

/**
 * A base component
 */
class BaseComponent{

  /**
   * Initialise element with options
   * @param {HTMLElement} element
   */
  constructor(element){
    this._element = element
  }

  /**
   * Getter for associated element
   * @returns {HTMLElement}
   */
  get element(){
    return this._element
  }

  _append(zen, target){
    const parentNode = target||this._element
    const abbr = zen.replace(/\r|\n|\s{2,}/g, '')
    parentNode.insertAdjacentHTML('beforeend', expand(abbr))
  }

  _select(selector){
    return this?._element.querySelector(selector)
  }

  // _selectAll(selector){
  //   return this?._element.querySelectorAll(selector)
  // }

  /**
   * Try parsing the options to an object
   * @param {string} options
   * @returns {object}
   * @private
   */
  _parseOptions(options){
    if (BaseComponent._isJSONString(options)){
      options = JSON.parse(options)
    } else if (BaseComponent._isObjectString(options)){
      options = (new Function(`return ${options}`))()
    }
    return options
  }

  /**
   * Test if string is valid JSON
   * @param {string} str
   * @returns {boolean}
   * @private
   */
  static _isJSONString(str){
    if ( /^\s*$/.test(str) ) return false
    str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@') // eslint-disable-line no-useless-escape
             .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']') // eslint-disable-line no-useless-escape
             .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
    return (/^[\],:{}\s]*$/).test(str)
  }

  /**
   * Test if string is valid object
   * @param {string} str
   * @returns {boolean}
   * @private
   */
  static _isObjectString(str){
    return /^\s?[[{]/.test(str)
  }
}

export {
  BaseComponent,
  component
}
