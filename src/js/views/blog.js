import {expand} from '../utils/html.js'
import {add} from '../router.js'
import {fetchJSONFiles, scrollToTop, stickiesFirst, todayOlderFilter} from '../utils/index.js'
import {routeChange} from '../router.js'
import {slugify} from '../utils/string.js'

const {search,hostname} = location
const params = new URLSearchParams(search)
const cms = hostname==='localhost'&&params.has('cms')

const allowedCategories = [
  'code',
  'technique',
  'project',
  'experiment',
  'illustration',
  'rant',
  'birds',
  'microscopy',
  'tools',
  'work'
]

add(
  'blog'
  , 'blog/:category'
  , (view,route,params)=>
    fetchJSONFiles('posts-list')
      .then(([posts])=>{

        const {category} = params
        let title = 'blog'
        let parentSlug

        // existing
        const querySelector = view.querySelector.bind(view)
        let existingFilter = querySelector('[data-filter]')
        let existingList = querySelector('.link-list')

        if(!existingFilter||!existingList){
          _initFilter(view,posts)
          const list = _initList(view,posts)
          _initEvents.call(this, list)
          list.addEventListener('change',onSelectChange)
        }

        if (category) parentSlug = title
        return {title, parentSlug}
      })
)

function _initFilter(view,posts){
  const cats = posts
      .reduce((acc,post)=>{
        post.categories?.forEach(cat=>{
          acc.includes(cat)||acc.push(cat)
        })
        return acc
      },[])
      .map(cat=>({name: cat, slug: slugify(cat)}))
  _initFilterCSS(cats)
  const data = JSON.stringify({list:cats,pathnamePrefix:'/blog/'})
     .replace(/"/g,'&quot;')
  return view.expandAppend(`div[data-filter="${data}"]`)
}

function _initFilterCSS(categories){
  const blogStyle = 'blog-style'
  if (!document.querySelector(`.${blogStyle}`)){
    const style = document.createElement('style')
    style.classList.add(blogStyle)
    style.textContent = `.content[data-pathname^=blog] ul.link-list {
      ${
        categories
          .map(cat=>cat.name.toLowerCase())
          .map(cat=>`
&.category-${cat} {
  li {
    transform: translateX(-120%);
    max-height: 0;
    margin-bottom: 0;
    &.category-${cat} { 
      transform: translateX(0);
      max-height: 4rem;
      margin-bottom: 1rem;
    }
  }
}`
        ).join('')
      }
    }` 
    document.head.appendChild(style)
  }
}

function _initList(view,posts){
  const currentPast = stickiesFirst(posts.filter(todayOlderFilter))
  const firstTen = currentPast.slice(0, 10)
  const theRest = currentPast.slice(10)
  const getLi = post=>{
    const classSticky = post.sticky&&'.sticky'||''
    const classCategories = post.categories?.map(s=>`.category-${slugify(s)}`).join('')||''
    return `(li${classSticky+classCategories}>(a[href="/${post.slug}"]>(time{${post.date.split('T').shift()}}+{${post.title}}))+${getSelect(post.slug,post.categories||[])})`
  }
  const ul = view.expandAppend(`ul.unstyled.link-list>(${firstTen.map(getLi).join('+')})`,false).querySelector('ul.link-list')
  requestAnimationFrame(()=>ul.insertAdjacentHTML('beforeend', expand(theRest.map(getLi).join('+'))))
  scrollToTop(document.querySelector('[data-header]'), 0)
  return ul
}

function _initEvents(list){
  routeChange.add(_onRouteChange.bind(this,list))
}

/**
 * Route change signal handler
 * @param {string} pathName
 * @private
 */
function _onRouteChange(list, pathName){
  const {classList} = list
  Array.from(classList).forEach(
    className=>/^category/.test(className)
      &&classList.remove(className)
  )
  if (pathName!=='blog'){
    const classCategory = slugify(pathName).replace(/^blog/,'category')
    list.classList.add(classCategory)
  }
}

function getSelect(id,cat){
  return cms?`select[name=${id}][id=${id}][multiple]>(${
    allowedCategories.map(c=>`option${cat.includes(c)?'[selected]':''}{${c}}`).join('+')
  })`:''
}

function onSelectChange(e){
  console.log('onSelectChange',e)
  const {target} = e
  console.log('\t',target.nodeName)
  //console.log('\t',target.outerHTML)
  console.log('\t',target.value)
  console.log('\t',target.name)
  console.log('\t',target.options)
  console.log('\t',Array.from(target.options).filter(o=>o.selected).map(o=>o.value||o.text).join(','))
  
  const data = {
    id:target.id
    ,options: Array.from(target.options).filter(o=>o.selected).map(o=>o.value||o.text)
  }
  fetch('/api/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    console.log('Success:', result);
  })
  .catch(error => {
    console.error('Error:', error);
  });

}

