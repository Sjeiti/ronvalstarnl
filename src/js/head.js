import {routeChange} from './router.js'
import {stringToElement, expand} from './utils/html.js'
import {getCanonical} from './utils/index.js'
import {MEDIA_URI_HEADER} from './config.js'

const siteName = 'Ron Valstar - front-end developer'

/**
 * Head controller for meta properties
 */
routeChange.add((slug, page)=>{
  const title = page.title
  const {description, date, dateFrom, modified} = page
  const link = getCanonical(page)

  const image = page.header&&(MEDIA_URI_HEADER+page.header)
  const [imageW, imageH] = getSizeFromURI(MEDIA_URI_HEADER)

  const twitterUser = '@Sjeiti'
  //
  document.title = title+(title?' - ':'')+siteName
  //
  setSelector('link[rel="canonical"]', 'href', link)
  setSelector('meta[name="description"]', 'content', description)
  // Opengraph
  setSelector('meta[property="og:locale"]', 'content', 'en_US')
  setSelector('meta[property="og:type"]', 'content', 'article')
  setSelector('meta[property="og:title"]', 'content', title)
  setSelector('meta[property="og:description"]', 'content', description)
  setSelector('meta[property="og:url"]', 'content', link)
  setSelector('meta[property="og:site_name"]', 'content', siteName)
  setSelector('meta[property="og:updated_time"]', 'content', modified)
  setSelector('meta[property="og:image"]', 'content', image)
  image&&setSelector('meta[property="og:image:width"]', 'content', imageW)
  image&&setSelector('meta[property="og:image:height"]', 'content', imageH)
  // Facebook
  // setSelector('meta[property="article:tag"]','content','foo') // todo implement setSelector multiple
  // setSelector('meta[property="article:tag"]','content','foo') // todo implement setSelector multiple
  // setSelector('meta[property="article:section"]','content','foo') // todo implement setSelector multiple
  setSelector('meta[property="article:published_time"]', 'content', date)
  setSelector('meta[property="article:modified_time"]', 'content', modified)
  // Twitter
  setSelector('meta[property="twitter:card"]', 'content', 'summary')
  setSelector('meta[property="twitter:description"]', 'content', description)
  setSelector('meta[property="twitter:title"]', 'content', title)
  setSelector('meta[property="twitter:site"]', 'content', twitterUser)
  setSelector('meta[property="twitter:image"]', 'content', image)
  setSelector('meta[property="twitter:creator"]', 'content', twitterUser)
  // rss
  setSelector('link[rel="alternate"][href="https://ronvalstar.nl/feed.rss"]')
  //
  // robots
  const isNoIndex = /^search\//.test(slug)
    ||title==='404'
    ||date?.includes('9999')
    ||dateFrom?.includes('9999')
  if (isNoIndex){
    setSelector('meta[property="robots"]', 'content', 'noindex,follow')
  } else {
    const robots = document.querySelector('meta[property="robots"]')
    robots?.remove()
  }
})

/**
 * Update or create an element/value
 * @param {string} selector
 * @param {string} key
 * @param {string} value
 * @todo: key/value could be superfluous
 */
function setSelector(selector, key, value){
  if (value){
    const elm = selectOrCreate(document.head, selector)
    key&&elm.setAttribute(key, value)
  } else {
    const elm = document.head.querySelector(selector)
    elm?.remove()
  }
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

/**
 * Determine image width and height from uri params
 * @param {string} uri
 * @return {string[]}
 */
function getSizeFromURI(uri){
  const w = uri.match(/,?w_(\d+)/).pop()||''
  const h = uri.match(/,?h_(\d+)/).pop()||''
  return [w, h]
}
