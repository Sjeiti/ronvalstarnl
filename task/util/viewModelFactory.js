/**
 * Small utility method for quickly creating elements.
 * @name createElement
 * @param {String} [type='div'] The element type
 * @param {String|Array} classes An optional string or list of classes to be added
 * @param {HTMLElement} parent An optional parent to add the element to
 * @param {Object} attributes An optional click event handler
 * @param {String} text An optional click event handler
 * @param {Function} click An optional click event handler
 * @returns {HTMLElement} Returns the newly created element
 */
export function createElement(type, classes, parent, attributes, text, click){
  const mElement = document.createElement(type||'div')
  if (attributes) for (let attr in attributes) mElement.setAttribute(attr, attributes[attr])
  if (classes){
    const oClassList = mElement.classList
      , aArguments = typeof(classes)==='string'?classes.split(' '):classes
    oClassList.add.apply(oClassList, aArguments)
  }
  if (text) mElement.textContent = text
  click&&mElement.addEventListener('click', click)
  parent&&parent.appendChild(mElement)
  return mElement
}

/**
 * @typedef {Object} View
 */

/**
 * A factory method for the view that is parsed with each route change
 * @param {HTMLElement} element
 * @returns {View}
 */
export function viewModelFactory(element){
  /** @lends View.prototype */
  return Object.create({
    init(){
      this._removeAndCleanPastContent()
      return this
    }
    /**
     * Start page transition, clear the view elements
     * @returns {View}
     */
    , clean(){
      const {element, _content, _contentPast} = this
      if (doAnimateRoute){
        _contentPast.parentNode===element && this._removeAndCleanPastContent()
        _content.classList.add(className.CONTENT_ANIMATE_IN)
        _contentPast.classList.add(className.CONTENT_ANIMATE_OUT)
        while (_content.firstChild) _contentPast.appendChild(_content.firstChild)
        element.appendChild(_contentPast)
        nextFrame(() => {
          _content.classList.add(className.CONTENT_ANIMATE_IN_START)
          _contentPast.classList.add(className.CONTENT_ANIMATE_OUT_START)
          this._contentPastTimer = setTimeout(this._removeAndCleanPastContent.bind(this), ms)
        })
      } else {
        while (_content.firstChild) _contentPast.appendChild(_content.firstChild)
        element.appendChild(_contentPast)
        this._removeAndCleanPastContent()
        doAnimateRoute = true
      }
      return this
    }
    /**
     * Add and track eventListener to main element
     * @param {object[]} args
     */
    , addEventListener(...args){
      this._events.push(args)
      this.element.addEventListener(...args)
    }
    /**
     * Remove all added listeners
     */
    , removeEventListeners(){
      let args
      while (args = this._events.pop()) this.element.removeEventListener(...args)
    }
    /**
     * Append a child element to the content view
     * @param {HTMLElement} child
     * @return {HTMLElement}
     * @returns {View}
     */
    , appendChild(child){
      this._content.appendChild(child)
      return this
    }
    /**
     * InsertAdjacentHTML to the content view
     * @param {string} position
     * @param {string} text
     * @returns {View}
     */
    , insertAdjacentHTML(position, text){
      this._content.insertAdjacentHTML(position, text)
      return this
    }
    /**
     * QuerySelector the content view
     * @param {string} selector
     * @return {HTMLElement}
     */
    , querySelector(selector){
      return this._content.querySelector(selector)
    }
    /**
     * QuerySelectorAll the content view
     * @param {string} selector
     * @return {NodeList}
     */
    , querySelectorAll(selector){
      return this._content.querySelectorAll(selector)
    }
    /**
     * Append an HTML string to the view
     * @param {string} htmlstring
     * @param {boolean} doClean
     * @return {View}
     */
    , appendString(htmlstring, doClean=true){
      doClean&&this.clean()
      this.insertAdjacentHTML('beforeend', htmlstring)
      initialise(this._content)
      return this
    }
    /**
     * Append an abbreviation string to the view
     * @param {string} abbreviation
     * @param {boolean} doClean
     * @return {View}
     */
    , expandAppend(abbreviation, doClean=true){
      abbreviation&&this.appendString(expand(abbreviation), doClean)
      return this
    }
    /**
     * Append an abbreviation string to the view
     * @param {string} name
     * @return {View}
     */
    , setViewName(name){
      const {_content, _contentPast} = this
      _contentPast.setAttribute('data-pathname', _content.getAttribute('data-pathname'))
      _content.setAttribute('data-pathname', name)

      const {ownerDocument} = _content
      ownerDocument.body.setAttribute('data-pathname', name) // todo may not be good idea

      //document.body.setAttribute('data-pathname', name) // todo may not be good idea
      return this
    }
    /**
     * Get the name of the current view
     * @return {String}
     */
    , getViewName(){
      return this._content.getAttribute('data-pathname')
    }
    /**
     * Remove pastContent from view and clean it
     * @return {View}
     */
    , _removeAndCleanPastContent(){
      const {element, _content, _contentPast} = this
      _contentPast.parentNode&&element.removeChild(_contentPast)
      clean(_contentPast)
      _contentPast.classList.remove(className.CONTENT_ANIMATE_OUT)
      _contentPast.classList.remove(className.CONTENT_ANIMATE_OUT_START)
      _content.classList.remove(className.CONTENT_ANIMATE_IN)
      _content.classList.remove(className.CONTENT_ANIMATE_IN_START)
      clearTimeout(this._contentPastTimer)
      return this
    }
  }, {
    /**
     * The main container HTMLElement
     * @type {HTMLElement}
     */
    element: {
      value: element
      , writable: false
    }
    /**
     * The main view HTMLElement
     * @type {HTMLElement}
     */
    , _content: {
      value: element.querySelector('.content:not(.content--past)')||createElement('div', 'content', element)
      , writable: false
    }
    /**
     * The views HTMLElement for out- animation
     * @type {HTMLElement}
     */
    , _contentPast: {
      value: element.querySelector('.content--past')||createElement('div', 'content content--past')
      , writable: false
    }
    /**
     * The timer must be reset
     * @type {number}
     */
    , _contentPastTimer: {
      value: 0
      , writable: true
    }
    /**
     * The views added event listeners
     * @type {Function[]}
     */
    , _events: {
      value: []
      , writable: false
    }
  })
}




