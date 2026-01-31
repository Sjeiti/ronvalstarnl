import {create, initialise} from './index.js'
import {BaseComponent} from './BaseComponent.js'
import {signal} from '../signal/index.js'
import {clean,createElement} from '../utils/html.js'
import {select} from '../utils/style.js'
import {nextTick} from '../utils/index.js'

export const change = signal()

/**
 * Theme component
 */
create('[data-theme]', class extends BaseComponent{

  constructor(...args){
    super(...args)

    ///////
    this._element.remove()
    return // because darkmode switching breaks after re-adding HTMLStyleElement
    ///////

    clean(this._element)

    this.initState()
    this.initElements()
    this.initEvents()

    this.setTheme()
  }

  initState(){
    this.options = Object.assign({
      id: 'theme'+Date.now()
    }, this._parseOptions(this._element.getAttribute('data-theme')))
    this.theme = localStorage.theme||'default'

    this.link = document.querySelector('head>link[rel=stylesheet]')
    this.styles = document.querySelectorAll('head>style')
  }

  initElements(){
    this._element.classList.add('theme')
    this._append(`label>(svg[data-icon=star]+select>(${Object.entries(this.options.options).map(([value,textContent])=>
        `option[value=${value}]${value===this.theme?'[selected]':''}{${textContent}}`
    ).join('+')}))`)
    this.select = this.element.querySelector('select')
  }

  initEvents(){
    this.select.addEventListener('change',this.onSelectChange.bind(this))
  }

  onSelectChange(e){
    this.theme = localStorage.theme = e.target.value
    this.setTheme()
  }

  setTheme(){
    this.link.href = `/${this.theme}.css`
    const styles = Array.from(this.styles)
    if (this.theme==='screen'){
      const {head} = document
      // styles.forEach(style=>style.parentElement!==head&&head.insertBefore(style,this.link))
      styles.forEach(style=> style.parentElement!==head&&head.insertBefore(style,this.link))
      // document.body.offsetHeight; // Force reflow
    } else {
      styles.forEach(style=>style.remove())
    }
  }

})
