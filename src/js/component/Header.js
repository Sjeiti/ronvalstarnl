import experiments from 'Experiments/src/experiment/index.js'

import {create} from './index'
import {BaseComponent} from './BaseComponent'
import {scroll} from '../signal/scroll'
import {signal} from '../signal'
import {routeChange} from '../router'
import {clean, markdownLinks, selectEach, getElementIndex} from '../utils/html'
import {MEDIA_URI_HEADER} from '../config'

create('[data-header]', class extends BaseComponent{

  _$
  _seldo
  _experiment
  _experimentUI
  _experimentLink
  _background
  _colofon
  _stuck = signal()
  _lastScrollTop = 0
  _lastHeaderTop = 0
  _className = {
    stuck: 'stuck'
    , current: 'current'
    , currentSmaller: 'current--smaller'
  }

  constructor(...args){
    super(...args)

    this._$ = this._element.querySelector.bind(this._element)
    this._seldo = selectEach.bind(null, this._element)

    scroll.add(this._onScroll.bind(this))
    routeChange.add(this._onRouteChange.bind(this))

    this._initExperiments()
    this._background = this._$('.background')
    this._colofon = this._$('.colofon')
  }

  /**
   * Initialise experiments
   */
  _initExperiments(){
    this._experimentWrapper = this._select('.experiment-wrapper')
    this._experimentUI = this._select('.experiment-ui')
    this._experimentLink = this._experimentUI.querySelector('[data-link]')
    this._experimentLink.addEventListener('click', ::this._onClickLink)
    clean(this._experimentWrapper)
    this._stuck.add(is=>this._experiment?.pause(is))
  }

  /**
   * Set or remove the header image
   * @param {string} src
   * @param {string} colofon
   * @param {string} classNames
   */
  setImage(src, colofon, classNames){
    if (src){
      this._background.style.backgroundImage = `url("${MEDIA_URI_HEADER+src}")`
      classNames&&this._background.classList.add(...classNames.split(' '))
      colofon&&(this._colofon.innerHTML = markdownLinks(colofon))
    } else {
      this._background.style.removeProperty('background-image')
      this._background.setAttribute('class', 'background')
      this._colofon.innerHTML = ''
    }
  }

  /**
   * Reveal header sticky state by adding/removing classNames
   * @param {Event} e
   * @param {number} w
   * @param {number} h
   */
  _onScroll(e, w, h){
    const header = this._element
    const headerTop = header.getBoundingClientRect().top
    if (this._lastScrollTop!==h){
      const isStuck = h>0&&headerTop===this._lastHeaderTop
      const wasStuck = header.classList.contains(this._className.stuck)
      if (wasStuck!==isStuck){
        header.classList.toggle(this._className.stuck, isStuck)
        this._stuck.dispatch(isStuck)
      }
    }
    this._lastHeaderTop = headerTop
    this._lastScrollTop = h
    //
    header.style.backgroundPosition = `0 ${h/2}px`
  }

  /**
   * Handle routeChange signal
   * @param {string} name
   * @param {object} page
   * @param {string} oldName
   */
  _onRouteChange(name, page, oldName){
    const select = page.parentSlug||name

    // const elmCurrent = this._$('.'+this._className.current)
    // const elmNext = this._$(`a[href="/${select}"]`)
    // const isIndexSmaller = getElementIndex(elmNext)<getElementIndex(elmCurrent)
    // elmCurrent.classList.remove(this._className.current, this._className.currentSmaller)
    // elmNext.classList.add(this._className.current)
    // isIndexSmaller&&elmNext.classList.add(this._className.currentSmaller)

    this._seldo('.'+this._className.current, elm=>elm.classList.remove(this._className.current))
    this._seldo(`a[href="/${select}"]`, elm=>elm.classList.add(this._className.current))

    this._setExperiment(name, oldName)
    this.setImage()
  }

  /**
   * Show or hide experiment depending on page
   * @param {string} name
   */
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
      const exp = Object.values(experiments)
      this._experiment = exp[Math.floor(Math.random()*exp.length)]
      //this._experiment = Object.values(experiments).sort(()=>Math.random()<0.5?1:-1).pop()
      this._experiment?.init(this._experimentWrapper)
    }
    this._experimentUI.classList.toggle('experiment-ui-hide', !this._experiment)
    this._experimentLink.href = this._experiment?`/experiment-${this._experiment.name}`:'#'
  }

  /**
   * Test if page is experiment by slug prefix
   * @param {string} name
   * @returns {boolean}
   */
  _isExperiment(name){
    return /^experiment-.+/.test(name)
  }

  /**
   * Handle fullscreen click
   */
  _onClickLink(){
    document.body.matches('[data-pathname^="experiment-"]')
      &&this._experimentWrapper.requestFullscreen()
  }

})
