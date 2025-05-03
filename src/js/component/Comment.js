import {create, initialise} from './index.js'
import {BaseComponent} from './BaseComponent.js'
import {signal} from '../signal/index.js'
import {clean} from '../utils/html.js'
import {select} from '../utils/style.js'

export const change = signal()
export const search = signal()

const RETURN = 13
const UP = 38
const DOWN = 40
const ESC = 27

/**
 * Comment component
 */
create('[data-comment]', class extends BaseComponent{

  _textarea
  _anchor

  constructor(...args){
    super(...args)
    clean(this._element)
    this._element.classList.add('comment')
    this._append(`
      hr+details.comment>(
        summary{comment}
        +textarea
        +a.btn{send comment}
    )`)
    //
    this._textarea = this._select('textarea')
    this._anchor = this._select('a')
    //
    this._textarea.addEventListener('change', this._setHref.bind(this))
    this._anchor.addEventListener('mousedown', this._setHref.bind(this))
    //
    this._setHref()
  }

  _setHref(){
    const toMail = 'comment@ronvalstar.nl'
    const subject = 'Comment on '+location.href
    const body = encodeURIComponent(this._textarea.value)
    if (body) {
      this._anchor.href = `mailto:${toMail}?subject=${subject}&body=${body}`
      console.log('setHref',this._anchor.href)
    } else {
      this._anchor.href = 'javascript:()=>{}'
    }
  }

})
