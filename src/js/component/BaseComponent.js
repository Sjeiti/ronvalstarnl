import {expand} from '../utils/html'

/**
 * A base component
 */
export class BaseComponent{

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

  /**
   * Append abbreviation to main element or target
   * @param {string} abbreviation
   * @param {HTMLElement} [target]
   * @private
   */
  _append(abbreviation, target){
    const parentNode = target||this._element
    parentNode.insertAdjacentHTML('beforeend', expand(abbreviation))
  }

  /**
   * QuerySelector component element
   * @param {string} selector
   * @return {HTMLElement}
   * @private
   */
  _select(selector){
    return this?._element.querySelector(selector)
  }

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