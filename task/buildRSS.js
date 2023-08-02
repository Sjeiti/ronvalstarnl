// see http://www.rssboard.org/rss-profile

const utils = require('./util/utils.js')
const {save} = utils
const {target} = require('commander')
        .usage('[options] <files ...>')
        .option('--target [target]', 'Target path')
        .parse(process.argv)
        .opts()

const path = '../src/data/json/'
const base = 'https://ronvalstar.nl'
const posts = require(path+'posts-list.json')

const today = new Date
const currentPast = posts.filter(({date})=>(new Date(date))<=today)

const portfolio = require(path+'fortpolio-list.json')
const stripHTML = htmlString=>htmlString.replace(/<[^>]*>?/gm, '')
const encodedStr = rawStr=>rawStr.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
   return '&#'+i.charCodeAt(0)+';';
})
const describe = string=>{
  const newString = stripHTML(string).substr(0, 255)
  return encodedStr(newString)+(string.length!==newString.length?' &#8230;':'')
}
const stringDate = date=>new Date(date).toGMTString()

const rss = `<?xml version="1.0" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ron Valstar</title>
    <link>${base}</link>
    <description>Blog posts and articles about front-end development</description>
    <atom:link href="${base}/feed.rss" rel="self" type="application/rss+xml" />
    ${currentPast.map(({title, slug, date})=>{
      const post = require(`${path}post_${slug}.json`)
      return `<item>
        <title>${title||'blank'}</title>
        <link>${base}/${slug}</link>
        <guid>${base}/${slug}</guid>
        <description>${describe(post.description||'')}</description>
        <pubDate>${stringDate(date)}</pubDate>
      </item>`
    }).join('')}
  </channel>
</rss>`

save((target||'temp')+'/feed.rss', rss)

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
