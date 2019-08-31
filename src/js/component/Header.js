import experiments from 'Experiments/src/experiment/index.js'

import {component, BaseComponent} from '../Component'
import {scroll} from '../signal/scroll'
import {signal} from '../signal'
import {routeChange} from '../router'
import {clean, selectEach} from '../utils/html'

component.create('[data-header]', class extends BaseComponent{

  _seldo
  _experiment
  _background
  _stuck = signal()
  _lastScrollTop = 0
  _lastHeaderTop = 0

  constructor(...args){
    super(...args)

    this._seldo = selectEach.bind(null, this._element)

    scroll.add(this._onScroll.bind(this))
    routeChange.add(this._onRouteChange.bind(this))

    this._initExperiments()
    this._background = this._element.querySelector('.background')
  }

  _initExperiments(){
    this._experimentWrapper = this._select('.experiment-wrapper')
    clean(this._experimentWrapper)
    this._stuck.add(is=>this._experiment?.pause(is))
    //location.pathname==='/'&&for (let name in experiments)console.log(name)
  }

  setImage(src){
    console.log('setImage', src) // todo: remove log
    if (src){
      this._background.style.backgroundImage = `url("${src}")`
    } else {
      this._background.style.removeProperty('background-image')
    }
  }

  _onScroll(e, w, h){
    const header = this._element//document.querySelector('header')
    const headerTop = header.getBoundingClientRect().top
    if (this._lastScrollTop!==h){
      const isStuck = h>0&&headerTop===this._lastHeaderTop
      const wasStuck = header.classList.contains('stuck')
      if (wasStuck!==isStuck){
        header.classList.toggle('stuck', isStuck)
        this._stuck.dispatch(isStuck)
      }
    }
    this._lastHeaderTop = headerTop
    this._lastScrollTop = h
    //
    header.style.backgroundPosition = `0 ${h/2}px`
  }

  _onRouteChange(name, page, oldName){
    console.log('Header:routeChange', name)
    const current = 'current'
    const select = page.parentSlug||name
    this._seldo('.'+current, elm=>elm.classList.remove(current))
    this._seldo(`a[href="/${select}"]`, elm=>elm.classList.add(current))
    this._setExperiment(name, oldName)
    this.setImage()
  }

  _setExperiment(name){
    console.log('\txp', name, !!this._experiment)
    if (/^experiment-.+/.test(name)){
      this._experiment&&this._experiment.exit()
      this._experiment = experiments[name.replace(/^experiment-/, '')]
      this._experiment&&this._experiment.init(this._experimentWrapper)
    }else if (name&&this._experiment){
      this._experiment.exit()
      this._experiment = null
    } else if (!name&&!this._experiment){
      this._experiment = Object.values(experiments).sort(()=>Math.random()<0.5?1:-1).pop()
      this._experiment.init(this._experimentWrapper)
    }
  }

})
