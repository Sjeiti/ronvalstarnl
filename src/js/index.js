//window.onerror = err=>alert(err)

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

initialise()
document.documentElement.classList.remove('no-js')

import './signal/scroll'

/**
 * A page can be a page, post or portfolio item
 * @typedef {Object} Page
 * @property {string} id
 * @property {string} date
 * @property {string} modified
 * @property {string} slug
 * @property {string} type
 * @property {string} excerpt
 * @property {string} categories
 * @property {string} tags
 * @property {string} metaKeyword - obsolete
 * @property {string} metaDescription - obsolete
 */

/**
 * A page of type post
 * @typedef {Page} Post
 * @property {string} header
 * @property {string} headerColofon
 * @property {string} headerClassName
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
 */

/**
 * A pageindex used in listings
 * @typedef {Object} PageIndex
 * @property {string} date
 * @property {string} slug
 * @property {string} title
 */
