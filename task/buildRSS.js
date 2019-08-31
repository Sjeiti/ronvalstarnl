// see http://www.rssboard.org/rss-profile

const utils = require('./util/utils.js')
const {save} = utils
const {target} = require('commander')
        .usage('[options] <files ...>')
        .option('--target [target]', 'Target path')
        .parse(process.argv)

const path = '../src/data/json/'
const base = 'https://ronvalstar.nl'
const posts = require(path+'posts-list.json')
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
    <!--link>${base}/blog</link-->
    <description>Foo, bar and a lot of baz</description>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
    <!--image>
        <url>https://www.xul.fr/xul-icon.gif</url>
        <link>https://www.xul.fr/en/index.php</link>
    </image-->
    ${posts.map(({title, slug, date})=>`<item>
        <title>${title||'blank'}</title>
        <link>${base}/${slug}</link>
        <guid>${base}/${slug}</guid>
        <description>${describe(require(`${path}post_${slug}.json`).excerpt.rendered)}</description>
        <pubDate>${stringDate(date)}</pubDate>
    </item>`).join('')}
  <!--/channel>
  <channel>
    <title>Ron Valstar - projects</title>
    <link>${base}/projects</link>
    <description>Foo, bar and a lot of baz</description>
    <image>
        <url>https://www.xul.fr/xul-icon.gif</url>
        <link>https://www.xul.fr/en/index.php</link>
    </image-->
    ${portfolio.filter(({inPortfolio})=>inPortfolio).map(({title, slug, dateFrom:date})=>`<item>
        <title>${title||'blank'}</title>
        <link>${base}/project/${slug}</link>
        <guid>${base}/project/${slug}</guid>
        <description>${describe(require(`${path}fortpolio_${slug}.json`).excerpt)}</description>
        <pubDate>${stringDate(date)}</pubDate>
    </item>`).join('')}
  </channel>
</rss>`

save((target||'temp')+'/feed.rss', rss)