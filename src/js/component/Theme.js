import {create, initialise} from './index.js'
import {BaseComponent} from './BaseComponent.js'
import {signal} from '../signal/index.js'
import {clean,createElement} from '../utils/html.js'
import {select} from '../utils/style.js'

export const change = signal()

/**
 * Theme component
 */
create('[data-theme]', class extends BaseComponent{

  constructor(...args){
    super(...args)
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
    this._append(`button[aria-label=theme]>svg[data-icon=star][width=1.5rem][height=1.5rem]>title{Search icon}`)
    this._append(`
      select>(${Object.entries(this.options.options).map(([value,textContent])=>
        `option[value=${value}]${value===this.theme?'[selected]':''}{${textContent}}`
      ).join('+')})
    `)
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
      styles.forEach(style=>document.head.insertBefore(style,this.link))
    } else {
      styles.forEach(style=>style.remove())
    }
  }

})
