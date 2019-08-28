// <pre line-numbers><code data-language="glsl" data-src="http://...

import {component, BaseComponent} from '../Component'
import {prismToElement} from '../utils/prism'
import {nextTick} from '../utils'

component.create('code[data-src]', class extends BaseComponent{

  constructor(...args){
    super(...args)

    const src = this._element.getAttribute('data-src')
    console.log('code src', src)
    fetch(src)
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
