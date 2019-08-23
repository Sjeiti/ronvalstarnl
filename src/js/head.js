// import {expand} from '@emmetio/expand-abbreviation'
import {routeChange} from './router'

const siteName= 'Ron Valstar - frontend developer'
// const q = document.querySelector.bind(document)
// const qh = q.bind(q('head'))

routeChange.add((slug, page)=>{
  console.log('head')
  const title = page.title.rendered||page.title
  //
  document.title = title+(title?' - ':'')+siteName
  /*
  setSelector('link[rel="canonical"]','href',page.link)
  setSelector('meta[name="description"]','content',page.description)
  setSelector('meta[property="og:locale"]','content','en_US')
  */
})

// function setSelector(selector,key,value){
//   const elm = selectOrCreate(document.head,selector)
//   elm.setAttribute(key,value)
// }

// function selectOrCreate(root,selector){
//   const selected = root.querySelector(selector)
//   const created = !selected&&expand(selector)
//   created&&root.appendChild(created)
//   return selected||created
// }

/*
<link rel="canonical" href="http://ronvalstar.nl/updating-a-cypress-alias" />
<meta name="description" content="To update a Cypress alias on the fly we can create and overwrite Cypress commands to update DOM aliases by traversing up the selector tree."/>
<meta property="og:locale" content="en_US" />
<meta property="og:type" content="article" />
<meta property="og:title" content="Updating a Cypress alias - Ron Valstar" />
<meta property="og:description" content="To update a Cypress alias on the fly we can create and overwrite Cypress commands to update DOM aliases by traversing up the selector tree." />
<meta property="og:url" content="http://ronvalstar.nl/updating-a-cypress-alias" />
<meta property="og:site_name" content="Ron Valstar" />

<meta property="article:tag" content="test" />
<meta property="article:tag" content="end to end" />
<meta property="article:section" content="work" />

<meta property="article:published_time" content="2018-12-24T15:16:38+00:00" />
<meta property="article:modified_time" content="2018-12-24T15:16:46+00:00" />

<meta property="og:updated_time" content="2018-12-24T15:16:46+00:00" />
<meta property="og:image" content="http://ronvalstar.nl/wordpress/wp-content/uploads/Vincent_van_Gogh_-_Green_Field_-_Google_Art_Project-1024x841.jpg" />
<meta property="og:image:width" content="1024" />
<meta property="og:image:height" content="841" /
>
<meta name="twitter:card" content="summary" />
<meta name="twitter:description" content="To update a Cypress alias on the fly we can create and overwrite Cypress commands to update DOM aliases by traversing up the selector tree." />
<meta name="twitter:title" content="Updating a Cypress alias - Ron Valstar" />
<meta name="twitter:site" content="@Sjeiti" />
<meta name="twitter:image" content="http://ronvalstar.nl/wordpress/wp-content/uploads/Vincent_van_Gogh_-_Green_Field_-_Google_Art_Project.jpg" />
<meta name="twitter:creator" content="@Sjeiti" />
*/
