//window.onerror = err=>alert(err)
document.documentElement.classList.remove('no-js')

import '../style/screen.less'
import './views'
import './head'
import {initialise} from './component'
import './component/Search'
import './component/Header'
import './component/Code'
import './component/Icon'
import './component/Skill'
import './component/Now'
import './component/JSFiddle'

initialise()

import './signal/scroll'

/**
 * A page can be a page, post or portfolio item
 * @typedef {Object} Page
 * @property {string} date
 * @property {string} modified
 * @property {string} slug
 * @property {string} type
 * @property {string} categories
 * @property {string} tags
 * @property {string} description
 */

/**
 * A page of type post
 * @typedef {Page} Post
 * @property {string} header
 * @property {string} headerColofon
 * @property {string} headerClassName
 * @property {string} sticky
 * @property {string} related
 */

/**
 * A page of type fortpolio
 * @typedef {Page} Fortpolio
 * @property {string} clients
 * @property {string} collaboration
 * @property {string} prizes
 * @property {string} thumbnail
 * @property {string} image
 * @property {string} images
 * @property {string} inCv
 * @property {string} inPortfolio
 * @property {string} dateFrom
 * @property {string} dateTo
 * @property {string} excerpt
 */

/**
 * A pageindex used in listings
 * @typedef {Object} PageIndex
 * @property {string} date
 * @property {string} slug
 * @property {string} title
 */
