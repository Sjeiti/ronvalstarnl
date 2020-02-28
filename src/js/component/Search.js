import {create,initialise} from './index'
import {BaseComponent} from './BaseComponent'
import {signal} from '../signal'
import {clean} from '../utils/html'
import {select} from '../utils/style'

export const change = signal()
export const search = signal()

const RETURN = 13
const UP = 38
const DOWN = 40
const ESC = 27

/**
 * Search component
 */
create('[data-search]', class extends BaseComponent{

  _input
  _autoComplete
  _suggestionIndex = -1
  _suggestions = []
  _selectedRule = select('.search ul > li:nth-child(999) a')

  constructor(...args){
    super(...args)
    clean(this._element)
    const options = Object.assign({
      id: 'search'+Date.now()
      , label: 'Search'
      , placeholder: 'keyword'
      , submit: 'Search'
      , autoSuggest: false
    }, this._parseOptions(this._element.getAttribute('data-search')))
    this._element.classList.add('search')
    this._append(`
      label[for=${options.id}]{${options.label}}
      +input#${options.id}[name=${options.id} type=search placeholder="${options.placeholder}"]
      +button>svg[data-icon=search]
    `)
    this._input = this._select('input')
    this._input.addEventListener('keyup', this._onKeyUp.bind(this))
    const button = this._select('button')
    button.addEventListener('click', this._onSubmit.bind(this, this._input))
    //
    change.add(this._onChange.bind(this, this._input))
    //
    if(options.autoSuggest){
      //
      this._autoComplete = this._append('ul.unstyled'+(options.autoSuggestTop&&'.top'||''))
      //
      fetch('/data/search/words.json')
        .then(res=>res.json(), console.warn)
        .then(words=>this._words = words)
        .catch(console.error.bind(console, 'bloody'))
      //
      change.add(this._suggest.bind(this))
    }
  }

  /**
   * Setter for the search value
   * @param {string} s
   */
  set value(s){
    this._input.value = s
  }

  /**
   * Key up event handler
   * @param {KeyboardEvent} e
   * @private
   */
  _onKeyUp(e){
    const {target:{value}, keyCode} = e
    this._lastValue!==value&&change.dispatch(value)
    this._lastValue = value
    keyCode===RETURN&&this._onSubmit({value})
    ||keyCode===UP&&this._selectSuggestion(true)
    ||keyCode===DOWN&&this._selectSuggestion(false)
    ||keyCode===ESC&&this._deselectSuggestion()
  }

  /**
   * Set the input field value on change
   * @param {HTMLInputElement} input
   * @param {string} value
   * @private
   */
  _onChange(input, value){
    input.value!==value&&(input.value = value)
  }

  /**
   * Submit (dispatch) the search
   * @param {string} input
   * @returns {Search}
   * @private
   */
  _onSubmit(input){
    const {value} = input
    const hasSuggestion = this._suggestionIndex!==-1
    search.dispatch(hasSuggestion?this._suggestions[this._suggestionIndex]:value)
    hasSuggestion&&this._deselectSuggestion()
    return this
  }

  /**
   * Select up/down
   * @param {boolean} up
   * @returns {Search}
   * @private
   */
  _selectSuggestion(up){
    this._suggestionIndex = Math.min(Math.max(this._suggestionIndex + (up?-1:1), 0), this._suggestions.length)
    this._setSuggestionStyle()
    return this
  }

  /**
   * Deselect selection
   * @returns {Search}
   * @private
   */
  _deselectSuggestion(){
    this._suggestionIndex = -1
    this._setSuggestionStyle()
    return this
  }

  /**
   * Set the index of the suggestion to that of the CSSRule
   * @private
   */
  _setSuggestionStyle(){
    this._selectedRule&&(this._selectedRule.selectorText = this._selectedRule.selectorText.replace(/\(-?\d+\)/, `(${this._suggestionIndex+1})`))
  }

  /**
   * Search suggestions
   * @todo: memoize/cache
   * @param {string} value
   * @private
   */
  _suggest(value){
    if (this._words&&value.length>2){
      this._suggestionIndex = -1
      this._suggestions = this._words.filter(word=>word.includes(value))
      clean(this._autoComplete)
      const fragment = document.createDocumentFragment()
      this._suggestions.forEach(suggestion=>{
        const li = document.createElement('li')
        const a = document.createElement('a')
        a.href = `/search/${suggestion}`
        a.innerHTML = suggestion.replace(value, `<span>${value}</span>`)
        li.appendChild(a)
        fragment.appendChild(li)
      })
      this._autoComplete.appendChild(fragment)
    } else if (!value){
      clean(this._autoComplete)
    }
  }
})
