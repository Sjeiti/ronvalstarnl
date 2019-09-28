import experiments from 'Experiments/src/experiment/index.js'

import {component, BaseComponent} from '../Component'
import {scroll} from '../signal/scroll'
import {signal} from '../signal'
import {routeChange} from '../router'
import {clean, selectEach} from '../utils/html'
import {MEDIA_URI_HEADER} from '../config'

component.create('[data-header]', class extends BaseComponent{

  _seldo
  _experiment
  _experimentUI
  _experimentLink
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
    this._experimentUI = this._select('.experiment-ui')
    this._experimentLink = this._experimentUI.querySelector('[data-link]')
    this._experimentLink.addEventListener('click', ::this._onClickLink)
    clean(this._experimentWrapper)
    this._stuck.add(is=>this._experiment?.pause(is))
  }

  setImage(src){
    console.log('setImage src',src) // todo: remove log
    if (src){
      this._background.style.backgroundImage = `url("${MEDIA_URI_HEADER+src}")`
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
    const current = 'current'
    const select = page.parentSlug||name
    this._seldo('.'+current, elm=>elm.classList.remove(current))
    this._seldo(`a[href="/${select}"]`, elm=>elm.classList.add(current))
    this._setExperiment(name, oldName)
    this.setImage()
  }

  _setExperiment(name){
    const isExperiment = this._isExperiment(name)
    const experimentName = isExperiment&&name.replace(/^experiment-/, '')
    if (isExperiment){
      const hasExperiment = !!this._experiment
      if (hasExperiment&&this._experiment.name!==experimentName||!hasExperiment){
        hasExperiment&&this._experiment.exit()
        this._experiment = experiments[experimentName]
        this._experiment&&this._experiment.init(this._experimentWrapper)
      }
    }else if (name&&this._experiment){
      this._experiment.exit()
      this._experiment = null
    } else if (!name&&!this._experiment){
      this._experiment = Object.values(experiments).sort(()=>Math.random()<0.5?1:-1).pop()
      this._experiment?.init(this._experimentWrapper)
    }
    this._experimentUI.classList.toggle('experiment-ui-hide', !this._experiment)
    this._experimentLink.href = this._experiment?`/experiment-${this._experiment.name}`:'#'
  }

  _isExperiment(name){
    return /^experiment-.+/.test(name)
  }

  _onClickLink(){
    console.log('_onClickLink') // todo: remove log
    document.body.matches('[data-pathname^="experiment-"]')
      &&this._experimentWrapper.requestFullscreen()
  }

})
