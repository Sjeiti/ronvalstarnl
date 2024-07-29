// see http://www.rssboard.org/rss-profile

import {read, save} from './util/utils.js'
import commander from 'commander'

import posts from '../src/data/json/posts-list.json' with { type: 'json' }
console.log('Builing RSS for',posts.length,'pages')

const {target} = commander
        .usage('[options] <files ...>')
        .option('--target [target]', 'Target path')
        .parse(process.argv)
        .opts()

const base = 'https://ronvalstar.nl'

const today = new Date
const currentPast = posts.filter(({date})=>(new Date(date))<=today)

const stripHTML = htmlString=>htmlString.replace(/<[^>]*>?/gm, '')
const encodedStr = rawStr=>rawStr.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
   return '&#'+i.charCodeAt(0)+';'
})
const describe = string=>{
  const newString = stripHTML(string).substr(0, 255)
  return encodedStr(newString)+(string.length!==newString.length?' &#8230;':'')
}
const stringDate = date=>new Date(date).toGMTString()

;(async ()=>{
  const list = await (Promise.all(currentPast.map(async ({slug})=>{
      const path = `src/data/json/post_${slug}.json`
      const post = await read(path)
      return JSON.parse(post)
  })))
 
  const rss = `<?xml version="1.0" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ron Valstar</title>
    <link>${base}</link>
    <description>Blog posts and articles about front-end development</description>
    <atom:link href="${base}/feed.rss" rel="self" type="application/rss+xml" />
    ${list.map(({slug, title, date, description})=>
      `<item>
        <title>${title||'blank'}</title>
        <link>${base}/${slug}</link>
        <guid>${base}/${slug}</guid>
        <description>${describe(description||'')}</description>
        <pubDate>${stringDate(date)}</pubDate>
      </item>`
  ).join('')}
  </channel>
</rss>`

  await save((target||'temp')+'/feed.rss', rss)
  console.log('saved')

})()

/*

  <channel>
    <title>Ron Valstar - projects</title>
    <link>${base}/projects</link>
    <description>Portfolio projects by Ron Valstar</description>
    ${portfolio.filter(({inPortfolio})=>inPortfolio).map(({title, slug, dateFrom:date})=>{
      const item = require(`${path}fortpolio_${slug}.json`)
      return `<item>
        <title>${title||'blank'}</title>
        <link>${base}/project/${slug}</link>
        <guid>${base}/project/${slug}</guid>
        <description>${describe(item.description||item.metaDescription||'')}</description>
        <pubDate>${stringDate(date)}</pubDate>
      </item>`
    }).join('')}
  </channel>

<link>${base}/blog</link>

<image>
    <url>https://www.xul.fr/xul-icon.gif</url>
    <link>https://www.xul.fr/en/index.php</link>
</image>

*/
