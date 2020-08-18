<!-- 
  date: 9999-99-99
  modified: 9999-99-99
  slug: fast-giant-lists
  type: post
  header: allie-GA3_Rp-m9jc-unsplash.jpg
  headerColofon: photo by [Allie](https://unsplash.com/@acreativegangster)
  headerClassName: no-blur darken
  excerpt: 
  categories: Javascript, HTML, CSS
  tags: CSS, speed, performance
-->

# fast giant lists

A while back I was asked to fix a page speed issue. This was an online application with several pages with lists. There wasn't just one implementation either: one was an actual unordered list, the other was more table-like but implemented with divs.

Mostly it would run fine with about two hundred to eight hundred lines. But there were edge cases with up to three *thousand* lines. Which would simply make the browser completely unresponsive.
Funny thing was that the current implementation was already a 'better' version. So prior to that the performance was even worse.

Now normally I'm not sure about infinite scroll. In most cases I would simply recommend pagination. Not only because of speed, but also because pagination gives you a clear sense of how large the actual set is.
But infinite scroll was already in place. Only if I couldn't fix the problem I would send it back to the UX drawing board.

## To frame or not to work

It must be pointed out that these speed issues are hardly related to framework or absence of one. If you have three thousand rows you'll run into the same issues regardless.

## What happens inside your machine

When you are improving performance it is good to have some idea of what happens inside the browser the moment you load an URL. So you know where to look for problems. I'll not repeat the details, [enough articles  on that](https://duckduckgo.com/?q=html+dom+cssom+render).
When a browser requests a website it will contact a server which responds by sending an HTML file, which is just text. It parses the text into DOM and then loads CSS (mostly). It parses that into CSSOM and together with the DOM it cooks up the first paint.

In our case we first expected it to be a server-side issue; it loaded the three thousand lines all at once. This took a bit longer than normal but it was still within reason. After some devtools inspection it became clear that it was the paint that was the problem.

## Don't reinvent the wheel 

Like any self respecting developer I first searched the web because others are sure to have solved this in a much cleverder way than I ever could. And then coded it myself because other people cannot code. Ha no, I make a joke.
I did look online but not for code: I looked for popular sites with infinite scroll and checked how they did it technically. Pick a random social network and it has infinite scroll: Facebook, Youtube, Twitter, Pinterest, 9GAG, everything.

The trend in most of these is toggling the visibility of an element once it is outside the viewport. They all differ in complexity and size though. Which is why a solution that works for one would not work for the other.

Facebook hides items depending on viewport position. But it starts slowing down at about three hundred items, even though it still churns out requests every second. I never use Facebook anymore so I might be wrong on this, it could be a fluke.

Youtube stops loading at six hundred thirty four items and it doesn't toggle any viewport related visibility. Yet it still performs ok when scrolling.

I tried reaching the end at Reddit but I do no think there is. At eight hundred items it slowed down to a crawl even though it did toggle the item visibility.

Twitter and Pinterest have a list of *n* visible items (where *n* is a number depending on your screen size). When you scroll they change the DOM by simply adding and removing elements. The invisible elements are kept in memory. Which makes it difficult to count the maximum number of items without checking the code but it is roughly seven hundred for Twitter and one thousand for Pinterest (`document.body.scrollHeight/window.innerHeight*averageItemsInView`).
Changing the DOM this way works, but it is a bit heavy on memory and calculation. Which is probably why both capped the maximum number.

The big surprise was 9GAG. Like with the other sites I just added this lousy line to console `setInterval(()=>window.scrollTo(0,document.body.scrollHeight),2000)` which output ID can be used to stop it. Which I did while it was still quite responsive at about three thousand items.
They also just toggle item visibility but they do it in chunks. A chunk being the amount of items that fit into a page wrapped by an element. At any given moment only two of these wrappers have to be visible.

## Test all the things! 

With all these different implementations there is not really one best solution, some work well, some not so much. And it all depends on a lot of factors: how complex is the HTML of the item, the width and height of the item, how far do people scroll on average, how are the items stacked, are they the same size.

What does seem to work a bit better however is toggling visibility as opposed to toggling DOM presence. It is also less complex programmatically because the visibility toggle is on the content, the element wrapper is still visible so it can be used to measure intersection with the viewport. This is harder for items that are not in the DOM especially when they differ in height because otherwise you could just multiply the number of preceding items with a value.

But this is theory, before implementing a final solution to our problem we want to test it with a stripped down example.

### Testing DOM removal

This first test is one where DOM elements are removed and added. This fairly works well but does require some work for calculating the top and bottom padding because right now the scrollbar does not work as it should. 

```html
<!--embed-->
<template id="listDOM">
<template><li>foo</li></template>
<div><ul></ul></div>
<style>
html, body {
  width: 100%;
  height: 20rem; 
  height: 100%;
  margin: 0;
  padding: 0;
}
body { font-family: monospace; }
div {
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  box-shadow: 0 0 0 1px green;
}
ul {
  list-style: none;
  padding: 0;
}
li { line-height: 32px; }
.row0 { background-color: #FFF; }
.row1 { background-color: #EEE; }
.row2 { background-color: #DDD; }
.row3 { background-color: #CCC; }
</style>
<script>
const template = document.querySelector('template')
const div = document.querySelector('div')
const ul = document.querySelector('ul')
const cache = document.createDocumentFragment()
const ciche = []
const increment = 50
const edge = 0.05
let index = 0

requestAnimationFrame(()=>{
  div.addEventListener('scroll', onScroll, {passive:true})
  ul.appendChild(getRows(index, index = 2 * increment))
})

function getRows(ind, amount) {
  const fragment = document.createDocumentFragment()
  for (let i = 0; i < amount; i++) fragment.appendChild(getRow(ind + i))
  return fragment
}

function getRow(ind) {
  let row = ciche[ind]
  if (!row) {
    row = document.importNode(template.content, true)
    const rowElm = row.childNodes[0]
    rowElm.textContent = ind
    rowElm.setAttribute('value', ind)
    rowElm.classList.add(`row${ind%4}`)
    ciche[ind] = rowElm
  }
  return row
}

function onScroll(e) {
  const {
    target
  } = e
  const {
    scrollHeight,
    offsetHeight,
    scrollTop
  } = target
  const scrollMax = scrollHeight - offsetHeight
  const scrollPosition = scrollTop / scrollMax
  if (scrollPosition > 1 - edge) {
    incrementList()
  } else if (scrollPosition < edge && index > 2 * increment) {
    decrementList()
  }
}
 
function incrementList() {
  ul.appendChild(getRows(index, increment))
  for (let i = 0; i < increment; i++) cache.appendChild(ul.firstChild)
  index += increment
}

function decrementList() {
  ul.insertBefore(getRows(index - 3 * increment, increment), ul.firstElementChild)
  for (let i = 0; i < increment; i++) cache.appendChild(ul.lastChild)
  if (div.scrollTop === 0) div.scrollTop = 1
  index -= increment
}
</script>
</template>
```

```html 
<!--example-->
<!--include:listDOM-->
<!--height:20rem-->
```

### Testing chunk visibility

This second test makes use of turning chunk visibility on- and off. So the rows are grouped into chunks of x rows.
This is faster than the previous method for two reasons.
We're not calculating the visibility of individual rows but two chunks of rows. This is where the pinch method comes in which you can read about [here](/javascript-generators-iterators-use-case).
The other reason is that the scroll handling is debounced. The downside is that when debouncing the handling takes place after the events stop firing (throttling is rather pointless in this cas). This shows as empty space prior to the chunk turned visible again. We can make it easier on the eyes by setting a repeating backround image.


```html 
<!--embed-->
<template id="listChunk">
<template id="stream">
  <li>
    <ul class="stream"></ul>
  </li>
</template>
<template id="li">
  <li>foo</li>
</template>
<div><ul></ul></div>
<style>
html, body {
  width: 100%;
  height: 20rem;
  height: 100%;
  margin: 0;
  padding: 0;
}
body { font-family: monospace; }
div {
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  box-shadow: 0 0 0 1px green;
}
ul {
  list-style: none;
  padding: 0;
}
div>ul {
  background-image: linear-gradient(
    180deg
    , #FFF 0% 20%
    , #EEE 20% 40%
    , #DDD 40% 60%
    , #CCC 60% 80%
    , #BBB 80% 100%
  );
  background-size: 160px 160px;
}
li li {
  line-height: 32px;
  height: 32px;
}
.row0 { background-color: #FFF; }
.row1 { background-color: #EEE; }
.row2 { background-color: #DDD; }
.row3 { background-color: #CCC; }
.row4 { background-color: #BBB; }
</style>
<script>
const templateStream = document.querySelector('template#stream')
const templateLi = document.querySelector('template#li')
const div = document.querySelector('div')
const ul = document.querySelector('ul')
const visibles = []
const increment = 64
const edge = 200
let scrollTimeoutId
let index = 0

requestAnimationFrame(()=>{
  div.addEventListener('scroll',onScroll,{passive:true,capture:true})
  for (let i=0,l=11;i<l;i++) incrementList()
  div.dispatchEvent(new CustomEvent('scroll', {target:div}))
})

function onScroll(e){
    clearTimeout(scrollTimeoutId)
    scrollTimeoutId = setTimeout(scrolled.bind(null,e),60)
}

function scrolled(e){
    const {target} = e
    const {scrollHeight,offsetHeight,scrollTop} = target
    const scrollMax = scrollHeight - offsetHeight
    if (scrollMax - scrollTop<edge) {
        incrementList()
    } else {
        checkStreamVisibility(scrollHeight,offsetHeight,scrollTop)
    }
}

function checkStreamVisibility(scrollHeight,offsetHeight,scrollTop){
    const part = scrollTop / (scrollHeight - offsetHeight)
    const pinched = pinch(Array.from(ul.children), part)
    let inViewport = 0
    const inView = []
    for (let i=0,l=pinched.length;i<l;i++) {
        const elm = pinched[i];
        const liTop = elm.offsetTop
        const liHeight = elm.offsetHeight
        const isInView = (liTop + liHeight > scrollTop) && (liTop < scrollTop + offsetHeight)
        isInView&&inView.push(elm)
        if (inViewport===-1&&isInView) {
            inViewport = i
        } else if (i>inViewport+1) { // because second visible is not more than twice removed from first
            break;
        }
    }
    inView.forEach(elm=>{
        const isVisible = elm.firstElementChild.offsetParent!==null
        if (isVisible) {
            const visiblesIndex = visibles.indexOf(elm)
            if (visiblesIndex!==-1) visibles.splice(visiblesIndex,1)
        } else {
            toggleVisibility(elm,true)
        }
    })
    visibles.forEach(elm=>toggleVisibility(elm,false))
    visibles.length = 0
    visibles.push(...inView)
}

function incrementList(){
    ul.lastElementChild&&ul.lastElementChild.previousElementSibling&&toggleVisibility(ul.lastElementChild.previousElementSibling,false)
    ul.appendChild(getRows(index,increment))
    index += increment
}

function toggleVisibility(elm,show){
    if (show) {
        elm.firstElementChild.style.removeProperty('display')
    } else {
        if (elm.style.minHeight==='') elm.style.minHeight = `${elm.offsetHeight}px`
        elm.firstElementChild.style.display = 'none'
    }
}

function getRows(ind,amount) {
    const stream = document.importNode(templateStream.content, true)
    const streamUl = stream.children[0].querySelector('ul')
    for (let i=0;i<amount;i++) streamUl.appendChild(getRow(ind + i))
    return stream
}

function getRow(ind){
    const row = document.importNode(templateLi.content, true)
    const rowElm = row.children[0]
    rowElm.textContent += ind
    rowElm.setAttribute('value', ind)
    rowElm.classList.add(`row${ind%5}`)
    return row
}

function pinch(a,p){
    const pIndex = Math.round(p*a.length)
    const a1 = a.slice(0,pIndex).reverse()
    const a2 = a.slice(pIndex)
    const returnA = [];
    for(let i=0,l=Math.max(a1.length,a2.length);i<l;i++) {
        const v2 = a2[i];
        v2!==undefined && returnA.push(v2);
        const v1 = a1[i];
        v1!==undefined && returnA.push(v1);
    }
    return returnA
}
</script>
</template>
```

```html
<!--example-->
<!--include:listChunk-->
<!--height:20rem-->
```

### Testing complex content

The above examples are fine technically, but in real life we have more complex content. Maybe a heading with an image, some body text, an anchor or even a button.

Speaking of buttons, you know what is a drain on giant lists? Form elements: for some reason form elements (with a parent HTMLFormElement) are so expensive to render that it pays to swap them with a fake them until they receive focus.

Anyway, complex content might also differ in height. This makes it harder to create a good preview, but not impossible with SVG backgrounds.


```html
<!--example-->
<!--include:listChunk-->
<!--height:30rem-->
<template id="liComplex">
  <li>
    <img/>
    <h3>foo</h3>
    <p></p>
    <input type="button"/>
  </li>
</template>
<!--<svg viewBox="0 0 640 160">
  <rect width="640" height="160" fill="#EEE" />
  <rect x="16" y="16" width="192" height="128" fill="#CCC" />
  <rect x="192" y="16" width="416" height="128" fill="#FFF" />
  <rect x="208" y="32" width="192" height="16" fill="#BBB" />
  <rect x="208" y="64" width="384" height="32" fill="#DDD" />
  <rect x="208" y="64" width="224" height="48" fill="#DDD" />
  <rect x="528" y="112" width="64" height="16" fill="#BBB" />
</svg>-->
<style>
  div>ul {
    background-image:
        url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 160'><rect width='640' height='160' fill='%23EEE' /><rect x='16' y='16' width='192' height='128' fill='%23CCC' /><rect x='192' y='16' width='416' height='128' fill='%23FFF' /><rect x='208' y='32' width='192' height='16' fill='%23BBB' /><rect x='208' y='64' width='384' height='32' fill='%23DDD' /><rect x='208' y='64' width='224' height='48' fill='%23DDD' /><rect x='528' y='112' width='64' height='16' fill='%23BBB' /></svg>");
    /*background-size: 100% 1.5625%;*/
    background-size: 100%;
  }
  li li {
    padding: 1rem;
    box-shadow: 0 0 0 1rem #EEE inset;
    background-color: #FFF;
    line-height: 130%;
    height: auto;
  }
  li li:after {
    content: '';
    display: table;
    clear: both;
  }
  img {
    float: left;
    margin-right: 1rem;
  }
  p {
    margin-right: 1rem;
  }
  input {
    float: right;
    margin: 0 1rem 1rem 0;
  }
</style>
<script>
const imgBasePath = 'https://res.cloudinary.com/dn1rmdjs5/image/upload/c_thumb,w_200,g_face/v1566568767/rv/'
const imgs = ['jurida0','studio01','02_wake-up','yoleo_0','kosmonaut3','Experiment-glass-Ron-Valstar-8','clouds','Clipboard35','ill_schelp','noiseCubeMap3D1','gridfloored','disconnectLoop','hypnosis','HSO-App-students','marbles','ill_nherengrachtalt','Lorenz84-1235-655-946-484-356','ill_lorenz','5410177218_d28d7c8f42_o','jurida3','elephant','PIMockup','kleurenspeuren']
const lorem = ['a','ab','accusamus','accusantium','ad','adipisci','adipiscing','alias','aliqua','aliquam','aliquid','aliquip','amet','anim','animi','aperiam','architecto','asperiores','aspernatur','assumenda','at','atque','aut','aute','autem','beatae','blanditiis','cillum','commodi','commodo','consectetur','consequat','consequatur','consequuntur','corporis','corrupti','culpa','cum','cumque','cupidatat','cupiditate','debitis','delectus','deleniti','deserunt','dicta','dignissimos','distinctio','do','dolor','dolore','dolorem','doloremque','dolores','doloribus','dolorum','ducimus','duis','ea','eaque','earum','eius','eiusmod','eligendi','elit','enim','eos','error','esse','est','et','eu','eum','eveniet','ex','excepteur','excepturi','exercitation','exercitationem','expedita','explicabo','facere','facilis','fuga','fugiat','fugit','harum','hic','id','illo','illum','impedit','in','incididunt','incidunt','inventore','ipsa','ipsam','ipsum','irure','iste','itaque','iure','iusto','labore','laboriosam','laboris','laborum','laudantium','libero','lorem','magna','magnam','magni','maiores','maxime','minim','minima','minus','modi','molestiae','molestias','mollit','mollitia','nam','natus','necessitatibus','nemo','neque','nesciunt','nihil','nisi','nobis','non','nostrud','nostrum','nulla','numquam','occaecat','occaecati','odio','odit','officia','officiis','omnis','optio','pariatur','perferendis','perspiciatis','placeat','porro','possimus','praesentium','proident','provident','quae','quaerat','quam','quas','quasi','qui','quia','quibusdam','quidem','quis','quisquam','quo','quod','quos','ratione','recusandae','reiciendis','rem','repellat','repellendus','reprehenderit','repudiandae','rerum','saepe','sapiente','sed','sequi','similique','sint','sit','soluta','sunt','suscipit','tempor','tempora','tempore','temporibus','tenetur','totam','ullam','ullamco','unde','ut','vel','velit','veniam','veritatis','vero','vitae','voluptas','voluptate','voluptatem','voluptates','voluptatibus','voluptatum']
let seed = 3124
const rnd = _seed => seed = (25214903917*(_seed||seed||0)+11)%2E48
const random = _seed => rnd(_seed)/2E48
const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)
const getLinePart = (max=25) => {
  const min = Math.max(Math.round(0.3*max), 1)
  const rest = max - min
  return lorem.sort(()=>rnd()<1E48?-1:1).slice(0,min + random()*rest<<0).join(' ')
}
const getLine = () => capitalize(getLinePart())+'.'
const getParagraph = (max=10) => {
  const min = Math.max(Math.round(0.3*max), 1)
  const rest = max - min
  return Array.from(new Array(min + random()*rest<<0)).map(getLine).join(' ')
}
const getImg = ()=>{
	return imgBasePath+imgs[rnd()%imgs.length]+'.jpg'
}

let liIndex = 0
const $ = document.querySelector.bind(document)
const templateLiComplex = $('template#liComplex')

function getRow(liIndex){
  const row = document.importNode(templateLiComplex.content, true)
  const li = row.children[0]
  const _$ = li.querySelector.bind(li)
  _$('h3').textContent = (liIndex++) + ' ' + capitalize(getLinePart(6))
  _$('p').textContent = getParagraph(3)
  _$('input').setAttribute('value', capitalize(getLinePart(3)))
  _$('img').setAttribute('src', getImg())
  return row
}
</script>
```



```html 
<!--example-->
<!--include:listDOM-->
<!--height:30rem-->

<template id="liComplex">
  <li>
    <img/>
    <h3>foo</h3>
    <p></p>
    <input type="button"/>
  </li>
</template>
<style>
  div>ul {
    background-image: none;
  }
  li {
    padding: 1rem;
    box-shadow: 0 0 0 1rem #EEE inset;
    background-color: #FFF;
    line-height: 130%;
    height: auto;
  }
  li:after {
    content: '';
    display: table;
    clear: both;
  }
  img {
    float: left;
    margin-right: 1rem;
  }
  p {
    margin-right: 1rem;
  }
  input {
    float: right;
    margin: 0 1rem 1rem 0;
  }
</style>
<script>
// document.body.insertBefore(document.querySelector('svg'),div) // todo remove
const imgBasePath = 'https://res.cloudinary.com/dn1rmdjs5/image/upload/c_thumb,w_200,g_face/v1566568767/rv/'
const imgs = ['jurida0','studio01','02_wake-up','yoleo_0','kosmonaut3','Experiment-glass-Ron-Valstar-8','clouds','Clipboard35','ill_schelp','noiseCubeMap3D1','gridfloored','disconnectLoop','hypnosis','HSO-App-students','marbles','ill_nherengrachtalt','Lorenz84-1235-655-946-484-356','ill_lorenz','5410177218_d28d7c8f42_o','jurida3','elephant','PIMockup','kleurenspeuren']
const lorem = ['a','ab','accusamus','accusantium','ad','adipisci','adipiscing','alias','aliqua','aliquam','aliquid','aliquip','amet','anim','animi','aperiam','architecto','asperiores','aspernatur','assumenda','at','atque','aut','aute','autem','beatae','blanditiis','cillum','commodi','commodo','consectetur','consequat','consequatur','consequuntur','corporis','corrupti','culpa','cum','cumque','cupidatat','cupiditate','debitis','delectus','deleniti','deserunt','dicta','dignissimos','distinctio','do','dolor','dolore','dolorem','doloremque','dolores','doloribus','dolorum','ducimus','duis','ea','eaque','earum','eius','eiusmod','eligendi','elit','enim','eos','error','esse','est','et','eu','eum','eveniet','ex','excepteur','excepturi','exercitation','exercitationem','expedita','explicabo','facere','facilis','fuga','fugiat','fugit','harum','hic','id','illo','illum','impedit','in','incididunt','incidunt','inventore','ipsa','ipsam','ipsum','irure','iste','itaque','iure','iusto','labore','laboriosam','laboris','laborum','laudantium','libero','lorem','magna','magnam','magni','maiores','maxime','minim','minima','minus','modi','molestiae','molestias','mollit','mollitia','nam','natus','necessitatibus','nemo','neque','nesciunt','nihil','nisi','nobis','non','nostrud','nostrum','nulla','numquam','occaecat','occaecati','odio','odit','officia','officiis','omnis','optio','pariatur','perferendis','perspiciatis','placeat','porro','possimus','praesentium','proident','provident','quae','quaerat','quam','quas','quasi','qui','quia','quibusdam','quidem','quis','quisquam','quo','quod','quos','ratione','recusandae','reiciendis','rem','repellat','repellendus','reprehenderit','repudiandae','rerum','saepe','sapiente','sed','sequi','similique','sint','sit','soluta','sunt','suscipit','tempor','tempora','tempore','temporibus','tenetur','totam','ullam','ullamco','unde','ut','vel','velit','veniam','veritatis','vero','vitae','voluptas','voluptate','voluptatem','voluptates','voluptatibus','voluptatum']
let seed = 3124
const rnd = _seed => seed = (25214903917*(_seed||seed||0)+11)%2E48
const random = _seed => rnd(_seed)/2E48
const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)
const getLinePart = (max=25) => {
  const min = Math.max(Math.round(0.3*max), 1)
  const rest = max - min
  return lorem.sort(()=>rnd()<1E48?-1:1).slice(0,min + random()*rest<<0).join(' ')
}
const getLine = () => capitalize(getLinePart())+'.'
const getParagraph = (max=10) => {
  const min = Math.max(Math.round(0.3*max), 1)
  const rest = max - min
  return Array.from(new Array(min + random()*rest<<0)).map(getLine).join(' ')
}
const getImg = ()=>{
	return imgBasePath+imgs[rnd()%imgs.length]+'.jpg'
}

const $ = document.querySelector.bind(document)
const templateLiComplex = $('template#liComplex')

function getRow(index){
  const row = document.importNode(templateLiComplex.content, true)
  const li = row.children[0]
  const _$ = li.querySelector.bind(li)
  _$('h3').textContent = index + ' ' + capitalize(getLinePart(6))
  _$('p').textContent = getParagraph(3)
  _$('input').setAttribute('value', capitalize(getLinePart(3)))
  _$('img').setAttribute('src', getImg())
  return row
}
</script>
```
