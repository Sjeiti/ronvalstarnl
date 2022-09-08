// <pre line-numbers><code data-language="glsl" data-src="http://...

import {create} from './index'
import {BaseComponent} from './BaseComponent'
import {prismToElement} from '../utils/prism'
import {nextTick} from '../utils'

create('code[data-src]', class extends BaseComponent{

  constructor(...args){
    super(...args)

    const src = this._element.getAttribute('data-src')
    // For some reason Netlify minifies js automatically.
    // To circumvent we copy/rename the `.js` extension with an underscore suffix.
    fetch(src.includes('static/experiment')?src+'_':src)
      .then(res=>res.text())
      .then(text=>{
        // gist results are JSON
        try {
          const obj = JSON.parse(text)
          const {content} = obj.files&&Object.values(obj.files).pop()
          if (content) text = content
        } catch (err){ /*silent fail*/ }

        this._element.textContent = text

        // todo: can be done without nextTick/redraw
        nextTick(()=>prismToElement(this._element))
      })
  }
})
