import {expand} from '@emmetio/expand-abbreviation'
import {routeChange} from './router'
import {stringToElement} from './utils/html'

const siteName= 'Ron Valstar - frontend developer'

routeChange.add((slug, page)=>{
  console.log('head')
  const title = page.title.rendered||page.title
  const {description, link, date, modified} = page
  // todo: description
  // todo: fix link by inferring from slug
  const image = 'http://...' // todo implement
  const imageW = 768 // todo implement
  const imageH = 512 // todo implement
  const twitterUser = '@Sjeiti'
  //
  document.title = title+(title?' - ':'')+siteName
  //
  setSelector('link[rel="canonical"]', 'href', link)
  setSelector('meta[name="description"]', 'content', description)
  // og
  setSelector('meta[property="og:locale"]', 'content', 'en_US')
  setSelector('meta[property="og:type"]', 'content', 'article')
  setSelector('meta[property="og:title"]', 'content', title)
  setSelector('meta[property="og:description"]', 'content', description)
  setSelector('meta[property="og:url"]', 'content', link)
  setSelector('meta[property="og:site_name"]', 'content', siteName)
  setSelector('meta[property="og:updated_time"]', 'content', modified)
  setSelector('meta[property="og:image"]', 'content', image)
  setSelector('meta[property="og:image:width"]', 'content', imageW)
  setSelector('meta[property="og:image:height"]', 'content', imageH)
  // article
  // setSelector('meta[property="article:tag"]','content','foo') // todo implement
  // setSelector('meta[property="article:tag"]','content','foo') // todo implement
  // setSelector('meta[property="article:section"]','content','foo') // todo implement
  setSelector('meta[property="article:published_time"]', 'content', date)
  setSelector('meta[property="article:modified_time"]', 'content', modified)
  // twitter
  setSelector('meta[property="twitter:card"]', 'content', 'summary')
  setSelector('meta[property="twitter:description"]', 'content', description)
  setSelector('meta[property="twitter:title"]', 'content', title)
  setSelector('meta[property="twitter:site"]', 'content', twitterUser)
  setSelector('meta[property="twitter:image"]', 'content', image)
  setSelector('meta[property="twitter:creator"]', 'content', twitterUser)
  //
  // todo: add rss
  //
  // <meta name="robots" content="noindex,follow">
})

/**
 * Update or create an element/value
 * @param {string} selector
 * @param {string} key
 * @param {string} value
 */
function setSelector(selector, key, value){
  const elm = selectOrCreate(document.head, selector)
  elm.setAttribute(key, value)
}

/**
 * Return or create an element
 * @param {HTMLElement} root
 * @param {string} selector
 * @returns {HTMLElement}
 */
function selectOrCreate(root, selector){
  const selected = root.querySelector(selector)
  const created = !selected&&stringToElement(expand(selector)).firstChild
  created&&root.appendChild(created)
  return selected||created
}