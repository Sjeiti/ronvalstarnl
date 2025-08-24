/* This project is licensed under the GNU General Public License v3.0. */

document.documentElement.classList.remove('no-js')

import './views/index.js'
import './head.js'
import {initialise} from './component/index.js'
import './component/Search.js'
import './component/Header.js'
import './component/Code.js'
import './component/Comment.js'
import './component/Icon.js'
import './component/Skill.js'
import './component/Now.js'
import './component/JSFiddle.js'
import './component/Theme.js'

initialise()

import './signal/scroll.js'

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
