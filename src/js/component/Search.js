import {component, BaseComponent} from '../Component'
import {signal} from '../signal'
import {clean} from '../utils/html'

export const change = signal()
export const search = signal()

component.create('[data-search]', class extends BaseComponent{

  _input

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
      +button.rv-search{${options.submit}}
    `)
    //
    this._input = this._select('input')
    this._input.addEventListener('keyup', this._onKeyUp.bind(this))
    const button = this._select('button')
    button.addEventListener('click', this._onSubmit.bind(this, this._input))
    //
    change.add(this._onChange.bind(this, this._input))
    //
    if(options.autoSuggest){
      //
      this._append('ul.unstyled.autosuggest')
      //
      fetch('/data/search/words.json')
        .then(res=>res.json(), console.warn)
        .then(words=>this._words = words)
        .catch(console.log.bind(console, 'bloody'))
      //
      change.add(this._suggest.bind(this))
    }
  }

  set value(s){
    this._input.value = s
  }

  _onKeyUp(e){
    const {target:{value}, keyCode} = e
    this._lastValue!==value&&change.dispatch(value)
    this._lastValue = value
    keyCode===13&&this._onSubmit({value})
  }

  _onChange(input, value){
    // console.log('_onChange',{input, value}) // todo: remove log
    input.value!==value&&(input.value = value)
  }

  _onSubmit(input){
    const {value} = input
    console.log('searchDispatch', value)
    search.dispatch(value)
  }

  _suggest(value){
    if (this._words){
      this._words.filter(word=>word.includes(value))
    }
  }
})
