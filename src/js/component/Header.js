import * as experiments from 'experiments/src/experiment/index.js'

import {create} from './index.js'
import {BaseComponent} from './BaseComponent.js'
import fullscreen from '../signal/fullscreen.js'
import {scroll} from '../signal/scroll.js'
import {signal} from '../signal/index.js'
import {routeChange} from '../router.js'
import {clean, markdownLinks, selectEach} from '../utils/html.js'
import {MEDIA_URI_HEADER} from '../config.js'

create('[data-header]', class extends BaseComponent{

  _$
  _seldo
  _experiment
  _experimentUI
  _experimentLink
  _background
  _colofon
  _stuck = signal()
  _requestFullScreen = signal()
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

    //
    const {_requestFullScreen:requestFullScreen} = this
    signal.requestFullScreen = this._requestFullScreen
    //
    fullscreen.add(this._onFullscreenChange.bind(this))
    //

    this._initExperiments()
    this._background = this._$('.background')
    this._colofon = this._$('.colofon')

    this._initColorScheme()
  }

  /**
   * Initialise experiments
   */
  _initExperiments(){
    this._experimentWrapper = this._select('.experiment-wrapper')
    this._experimentUI = this._select('.experiment-ui')
    //
    this._experimentLink = this._experimentUI.querySelector('[data-link]')
    this._experimentLink.addEventListener('click', this._onClickLink.bind(this))
    this._requestFullScreen.add(this._onClickLink.bind(this))
    //
    this._experimentSave = this._experimentUI.querySelector('[data-save]')
    this._experimentSave.addEventListener('click', this._onMouseDownSave.bind(this),true)
    this._experimentSave.addEventListener('click', this._onMouseUpSave.bind(this),true)
    //
    clean(this._experimentWrapper)
    this._stuck.add(is=>this._experiment?.pause(is))
  }

  /**
   * Initialise color scheme switching
   * @see `index.html` for initial setup
   */
  _initColorScheme(){
    const key = 'color-scheme'
    const dark = 'dark'
    const light = 'light'
    const schemeDark = `${key}-${dark}`
    const schemeLight = `${key}-${light}`
    const {classList} = document.documentElement
    this._select(`[data-${key}]`).addEventListener('click', ()=>{
      const isLight = classList.toggle(schemeDark)
      classList.toggle(schemeLight, !isLight)
      localStorage.setItem(key, isLight?dark:light)
    })
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
    } else if (name&&this._experiment){
      this._experiment.exit()
      this._experiment = null
    } else if (!name&&!this._experiment){
      const exp = Object.values(experiments)
      this._experiment = exp[Math.floor(Math.random()*exp.length)]
      //this._experiment = Object.values(experiments).sort(()=>Math.random()<0.5?1:-1).pop()
      this._experiment?.init(this._experimentWrapper)
    }
    // this._experimentUI.classList.toggle('experiment-ui-hide', !this._experiment)
    const hasExperiment = !!this._experiment
    this._experimentUI.classList.toggle('experiment-ui-hide', !hasExperiment)
    hasExperiment?this._experimentLink.removeAttribute('inert'):this._experimentLink.setAttribute('inert', '')

    this._experimentLink.href = this._experiment?`/experiment-${this._experiment.name}`:'#'
    this._experimentLink.title = name||'experiment'
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
   * @private
   */
  _onClickLink(){
    document.body.matches('[data-pathname^="experiment-"]')
      &&this._experimentWrapper.requestFullscreen()
  }

  /**
   * Handle mousedown event on save link
   * @private
   */
  _onMouseDownSave(){
    const canvas = this._experimentWrapper.querySelector('canvas')
    canvas
      ?this._downloadFromAnchor(canvas)
      :this._htmlScreenshot()
  }

  /**
   * Handle mouseup event on save link
   * @param {MouseEvent} e
   */
  _onMouseUpSave(e){
    e.preventDefault()
    e.stopImmediatePropagation()
  }

  /**
   * Handle fullscreen change event
   * @param {boolean} fullscreen
   * @private
   */
  _onFullscreenChange(fullscreen){
    if (fullscreen) this._experimentWrapper.appendChild(this._experimentSave)
    else this._experimentSave.remove()
  }

  /**
   * Create an HTML anchor and click it to download canvasData
   * @param {HTMLCanvasElement} canvas
   * @private
   */
  _downloadFromAnchor(canvas){
    const anchor = document.createElement('a')
    anchor.setAttribute('download', location.href.substr(8).replace(/[/#]/g, '_').replace(/\.nl/, '-nl')+'.png')
    anchor.href = `${canvas.toDataURL()}`
    anchor.click()
  }

  /**
   * Take screenshot of experiment HTML when no canvas is present
   * @private
   */
  _htmlScreenshot(){
    const elm = this._experimentWrapper
    const {offsetWidth:w, offsetHeight:h} = elm

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = w
    canvas.height = h

    const iframe = elm.querySelector('iframe')

    const clone = (iframe?.contentDocument.body||elm).cloneNode(true)
    clone.querySelectorAll('form,input,a').forEach(elm=>elm.remove())

    const xhtml = new XMLSerializer().serializeToString(clone)

    const contentString = xhtml
        .replace(/\n|\r/g, '')
        .replace(/\s{2}/g, ' ')

    const SVGstring = `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="${w}px"
        height="${h}px">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          <style>
            .experiment-wrapper{
              width:${w}px;
              height:${h}px;
            }
          </style>
          ${contentString}
        </div>
      </foreignObject>
    </svg>`.replace(/\s+/g, ' ').replace(/,\s+/g, ',')

    const tempImg = document.createElement('img')

    tempImg.addEventListener('load', this._onLoadTempImg.bind(this, canvas, context), true)
    tempImg.addEventListener('error', (error)=>{
      console.log('image save error', error)
      console.log('\tcontentString', contentString)
    })
    tempImg.src = 'data:image/svg+xml,' + encodeURIComponent(SVGstring)
  }

  /**
   * Handle temporary image load and force download
   * @param {HTMLCanvasElement} canvas
   * @param {RenderingContext} context
   * @param {Event} e
   * @private
   */
  _onLoadTempImg(canvas, context, e){
    context.drawImage(e.target, 0, 0)
    this._downloadFromAnchor(canvas)
  }
})
