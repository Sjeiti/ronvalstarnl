import {save} from './util/utils.js'
import commander from 'commander'

import posts from '../src/data/json/posts-list.json' with { type: 'json' }
import pages from '../src/data/json/pages-list.json' with { type: 'json' }
import portfolio from '../src/data/json/fortpolio-list.json' with { type: 'json' }

const {target} = commander
        .usage('[options] <files ...>')
        .option('--target [target]', 'Target path')
        .parse(process.argv)
        .opts()

const base = 'https://ronvalstar.nl'
const lastmod = new Date().toISOString()


const today = new Date
const currentPast = posts.filter(({date})=>(new Date(date))<=today)


const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <url>
      <loc>${base}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>1</priority>
   </url>
   ${currentPast.map(post=>`
   <url>
      <loc>${base}/${post.slug}</loc>
      <lastmod>${post.date}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.9</priority>
   </url>`).join('')}
   ${portfolio.map(project=>`
   <url>
      <loc>${base}/project/${project.slug}</loc>
      <lastmod>${new Date(project.dateTo).toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
   </url>`).join('')}
   ${pages.map(page=>`
   <url>
      <loc>${base}/${page.slug}</loc>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
   </url>`).join('')}
</urlset>`

save((target||'temp')+'/sitemap.xml',sitemap)
