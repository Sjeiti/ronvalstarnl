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
But it is what was already in place. Only if I couldn't fix the problem I would send it back to the UX drawing board.

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

This first quick test worked but did required more work for calculating the top and bottom padding.

```html
<!--example-->
<template><li>foo</li></template>
<div><ul></ul></div>
<style>
html, body {
  width: 100%;
  height: 20rem;
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

div.addEventListener('scroll', onScroll)
ul.appendChild(getRows(index, index = 2 * increment))

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
```

### Testing chunk visibility

The second test made use of turning chunk visibility on- and off. 

```html
<!--example-->
<template id="stream"><li><ul class="stream"></ul></li></template>
<template id="li"><li>foo</li></template>
<div><ul></ul></div>
<style>
html, body {
  width: 100%;
  height: 20rem;
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
const templateStream = document.querySelector('template#stream')
const templateLi = document.querySelector('template#li')
const div = document.querySelector('div')
const ul = document.querySelector('ul')
const visibles = []
const increment = 64
const edge = 200
let scrollTimeoutId
let index = 0

div.addEventListener('scroll',onScroll,{passive:true,capture:true})
for (let i=0,l=11;i<l;i++) incrementList()

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
    const streamUl = stream.childNodes[0].querySelector('ul')
    for (let i=0;i<amount;i++) streamUl.appendChild(getRow(ind + i))
    return stream
}

function getRow(ind){
    const row = document.importNode(templateLi.content, true)
    const rowElm = row.childNodes[0]
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
```

### Testing content complexity

When the chunk

```html
<!--example-->
<template id="li"><li>foo</li></template>
<template id="slowli"><li><input type="checkbox"/></li></template>
<button data-start>start</button><button data-start-complex>start-complex</button><button data-clear>clear</button>
<div><form><ul></ul></form></div>
<style>
html, body {
  width: 100%;
  height: 20rem;
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
li:nth-child(4n+1) { background-color: #FFF; }
li:nth-child(4n+2) { background-color: #EEE; }
li:nth-child(4n+3) { background-color: #DDD; }
li:nth-child(4n+4) { background-color: #CCC; }
</style>
<script>
const templateLi = document.querySelector('template#li')
const templateSlowLi = document.querySelector('template#slowli')
const ul = document.querySelector('ul')

document.querySelector('[data-start]').addEventListener('click', ()=>{
  for (let i=0,l=3E4;i<l;i++) ul.appendChild(getRow(templateLi, i))
})
document.querySelector('[data-start-complex]').addEventListener('click', ()=>{
  for (let i=0,l=3E4;i<l;i++) ul.appendChild(getRow(templateSlowLi, i))
})
document.querySelector('[data-clear]').addEventListener('click', ()=>{
  ul.innerHTML = ''
})

function getRow(template,ind){
  const row = document.importNode(template.content, true)
  const li = row.childNodes[0]
  li.appendChild(document.createTextNode(ind))
  const input = li.querySelector('input')
  input&&input.setAttribute('name',`i${ind}`)
  return row
}
</script>
```

