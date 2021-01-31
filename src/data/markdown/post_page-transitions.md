<!--
  date: 2020-07-29
  modified: 2020-07-29
  slug: the-basics-of-css-page-transitions
  type: post
  header: sincerely-media-IKzmglo7JLk-unsplash.jpg
  headerColofon: photo by [Sincerely Media](https://unsplash.com/@sincerelymedia)
  headerClassName: no-blur darken
  excerpt: 
  categories: Javascript
  tags: CSS, transitions
  related: front-end-logic-without-javascript
-->

# The basics of CSS page transitions

With single page applications comes the need for page transitions.
Actually page transitions are possible for non SPA but SPAs just make it more obvious to implement.

The reason to have these transitions is to have explicit visual indication that the page has loaded. When you swap pages instantly your brain sometimes fails to register the change, especially with blinking eyes and a slow connection. So it is genuine UX at that.

The transition itself should be nothing more than an indication; we wouldn't want to bore our users with a long cool animation. It should only last a few hundred milliseconds at most.

## What happens

Let's first have a look at what really happens before we change something. Let's say you have an `<article>` element housing the current content and you click an internal link. This is what happens:

- click anchor (preventDefault)
- network request (fetch/XHR)
- network response
- remove old `<article>` contents
- place response in `<article>`

## What should happen

In the old days (before SPA) an HTTP request would just unload the page and you'd be staring at a blank screen for a second before the new page was loaded and painted.
Browsers these days are 'smarter' and will not unload the page before a server response. This way you can cancel midflight while staying on the current page.
The downside is that the only indication anything is happening is a tiny spinner inside the tab at the top of the window (depending on your OS and browser of course). And that is for direct HTTP requests only. Your own XHR doesn't show anything (hey, you started it, it's your responsibility).

So that means two UX issues to fix.
- indication of a pending XHR
- indication of an XHR response

The first should be a clear continuous animation for the duration of the load but not so obvious that it obscures the content. Plus it should not be visible immediately; with fast loads showing a spinner for a single frame looks really sloppy.
The second indication should feel short and natural. You could give the transition some sort of order (left/right) or hierarchy (top/bottom) but nothing fancy.

Now our  timeline becomes

- click anchor
- show delayed XHR indication
- network request
- network response
- remove XHR indication
- place response in `<article>`
- transition between old and new contents
- remove old `<article>` contents

## In practice

When the content has loaded the two articles will exist simultaneously for some time. The two cannot occupy the same space so one of them must be `position:absolute;`. This creates the problem that the containing element will only take the height of the `static` element. We also need to animate the height of the containing element to that of the new content.

### CSS animation

There are rare situations where you must primarily animate by script (with WebGL for instance). In most cases however a simple CSS animation wil suffice. This also keeps your logic and styling separated.
To use the CSS `transition` we simply toggle classes on the content elements. This adds up to four classes in total: for each element we set the initial state and the final state.

We'll use the following className naming convention: `[name]-[type]-[state]` which amounts to the following:

```css
.page-enter { opacity: 0; }
.page-enter-to { opacity: 1; }
.page-leave { opacity: 1; }
.page-leave-to { opacity: 0; }
```

<small>(and yes: you could combine them for brevity but beware of specificity)</small>

Upon transition `page-enter` is added and two ticks later `page-enter-to` (same for `leave`). The two tick interval is for the browser to settle down; if we were to add the `page-enter-to` immediately it would seem both classes were set simultaneously and no transition would occur.
When the animation is finished the classes are to be removed.
We can determine the finished state with the `transitionend` event. This event *will* bubble up so you *can* apply transitions to child elements if you want to.

```html
<!--example-->
<link href="https://fonts.googleapis.com/css?family=Quicksand:300,500" rel="stylesheet">
<style>
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  body {
    padding: 1rem;
    height: 12rem;
    font-family: 'Quicksand', sans-serif;
    font-weight: 300;
  }
  article {
    position: relative;
  }
  article>* {
    padding: 1px 2rem 0;
  }
  h1, p {
  }
  h1 { 
    margin-top: 2rem; 
    font-weight: 500;
  }
  h1:first-letter, p:first-letter {
    text-transform: uppercase;
  }
  p:after { content: '.'; }
  .page-enter {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    transition: opacity 1000ms linear;
  }
  .page-enter-to { opacity: 1; }
  .page-leave { 
    opacity: 1;
    transition: opacity 1000ms linear;
  }
  .page-leave-to { opacity: 0; }
</style>
<button>next</button>
<article>
  <div><h1>lorem ipsum</h1><p>dolor sit amet consectetur adipiscing elit curabitur vel hendrerit</p></div>
</article>
<script>
  const pageEnter = 'page-enter'
  const pageEnterTo = 'page-enter-to'
  const pageLeave = 'page-leave'
  const pageLeaveTo = 'page-leave-to'
  const article = document.querySelector('article')
  const button = document.querySelector('button')
  const lipsum = 'lorem ipsum dolor sit amet consectetur adipiscing elit curabitur vel hendrerit libero eleifend blandit nunc ornare odio ut orci gravida imperdiet nullam purus lacinia a pretium quis congue praesent sagittis laoreet auctor mauris non velit eros dictum proin accumsan sapien nec massa volutpat venenatis sed eu molestie lacus quisque porttitor ligula dui mollis tempus at magna vestibulum turpis ac diam tincidunt id condimentum enim sodales in hac habitasse platea dictumst aenean neque fusce augue leo eget semper mattis tortor scelerisque nulla interdum tellus malesuada rhoncus porta sem aliquet et nam suspendisse potenti vivamus luctus fringilla erat donec justo vehicula ultricies varius ante primis faucibus ultrices posuere cubilia curae etiam cursus aliquam quam dapibus nisl feugiat egestas class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos phasellus nibh pulvinar vitae urna iaculis lobortis nisi viverra arcu morbi pellentesque metus commodo ut facilisis felis tristique ullamcorper placerat aenean convallis sollicitudin integer rutrum duis est etiam bibendum donec pharetra vulputate maecenas mi fermentum consequat suscipit aliquam habitant senectus netus fames quisque euismod curabitur lectus elementum tempor risus cras'.split(' ')
  const random = ()=>Math.random()<0.5?1:-1
  const randomText = (len=2,vr=4)=>lipsum.slice(0).sort(random).splice(0, len+Math.round(vr*Math.random())).join(' ')
  const nexFrame = (num, fn)=>fn()
  button.addEventListener('click', ()=>{
    const contentOld = article.firstElementChild
    const contentNew = document.createElement('div')
    const title = document.createElement('h1')
    title.textContent = randomText()
    const body = document.createElement('p')
    body.textContent = randomText(10, 10)
    contentNew.appendChild(title)
    contentNew.appendChild(body)
    article.appendChild(contentNew)
    button.disabled = true
    //
    contentOld.classList.add(pageLeave)
    contentNew.classList.add(pageEnter)
    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        contentOld.classList.add(pageLeaveTo)
        contentNew.classList.add(pageEnterTo)
      })
    })
    //
    contentOld.addEventListener('transitionend', ()=>{
      article.removeChild(contentOld)
      contentNew.classList.remove(pageEnter, pageEnterTo)
      button.disabled = false
    })
  })
</script>
```

A tricky part is the padding and margin to the parent `<section>` and the first child in the new content element respectively. Padding onto the `<section>` is not wanted here because the absolute positioned child element simply ignores it. Less logical is the margin of the first child element of the content. It is so counterintuïtive that there is a name for it and an [MDN article](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing). So either don't give that first child a top margin *or* give that content element somewhat of a top padding so that the first child margin doesn't collapse.

### Adding time

If you read the previous code you'll notice the pages are not really loaded, they are created from random lorem-ipsum words and shown immediately (because we were keeping it simple and concentrating on CSS).
But we have to add our XHR indication (or spinner) so for the next example we'll fake the XHR with a random timeout. It's either fast or slow, so you'll notice the effect of a delayed indicator (actually you don't, but that's the point).

```html
<!--example-->
<link href="https://fonts.googleapis.com/css?family=Quicksand:300,500" rel="stylesheet">
<style>

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
body {
  padding: 1rem;
  height: 12rem;
  font-family: 'Quicksand', sans-serif;
  font-weight: 300;
}
nav a {
  padding: 0.25rem 0.5rem;
  font-weight: 500;
  text-decoration: none;
  background-color: #EEE;
  transition: background-color 100ms linear;
}
nav a:hover {
  background-color: #DDD;
}
nav a.current {
  background-color: transparent;
}
article {
  position: relative;
  overflow: hidden;
}
article>* {
  padding: 1px 2rem 0;
}
h1, p {
}
h1 { 
  margin-top: 2rem; 
  font-weight: 500;
}
h1:first-letter, p:first-letter {
  text-transform: uppercase;
}
p:after { content: '.'; }

.page-enter {
  position: absolute;
  left: 0;
  top: 0;
}
.page-enter, .page-leave {
  transition: transform 200ms ease-in-out;
}
.page-enter { 
  transform: translateX(100%);
}
.page-enter-to, .page-leave { 
  transform: translateX(0%);
}
.page-leave-to { 
  transform: translateX(-100%);
}

.spinner {
  position: fixed;
  left: calc(50% - 1rem);
  top:calc(50% - 1rem);
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  overflow: hidden;
  opacity: 0;
  transition: opacity 500ms linear 100ms;
  animation: rotate 1500ms infinite linear;
} 
.spinner:before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: radial-gradient(transparent 0 70%, #888 70%);
  box-shadow: 0 0 0 10rem #888;
  transform: translateX(-5%);
}
.spinner--visible {
  opacity: 1;
}
@keyframes rotate { 100% { transform: rotate(360deg); }}
</style>

<nav>
  <a href="#home" class="current">home</a>
  <a href="#about">about</a>
  <a href="#contact">contact</a>
</nav>

<article>
  <div><h1>home</h1><p>dolor sit amet consectetur adipiscing elit curabitur vel hendrerit</p></div>
</article>
 
<script>
const {body} = document
const pageEnter = 'page-enter'
const pageEnterTo = 'page-enter-to'
const pageLeave = 'page-leave'
const pageLeaveTo = 'page-leave-to'
const current = 'current'
const spinnerVisible = 'spinner--visible'
const article = document.querySelector('article')
const nav = document.querySelector('nav')
const pages = {
  home: 'malesuada lorem vehicula dolor interdum nulla sit ipsum tellus adipiscing amet consectetur justo aliquet in elit donec curabitur sodales'
  ,about: 'ultricies vehicula elit consectetur in amet inceptos lacinia sit odio aenean justo platea purus feugiat conubia interdum himenaeos nisl'
  ,contact: 'aenean ipsum lorem dolor platea sodales sit neque dictumst sem tellus interdum malesuada elit in'
}
const nextFrame = (fn, num=1)=>{
	const a = []
  ;a[num-1] = fn
  const down = ()=>{
  	const fnc = a.shift()
    fnc?fnc():requestAnimationFrame(down)
  }
  requestAnimationFrame(down)
}
const spinner = document.createElement('div')
spinner.classList.add('spinner')

let loading = false

nav.addEventListener('click', e=>{
  e.preventDefault()
  if (!loading){
    const {target, target: {textContent:title}} = e
    const href = target.getAttribute('href')
    const text = pages[title]

    setSpinner(true)

    // XHR or fetch here !!!

    setTimeout(
      onLoad.bind(null, `<h1>${title}</h1><p>${text}</p>`, href)
      ,Math.random()<.5?40:2000
    )
    loading = true
  }
})

function onLoad(content, state){
  setNavCurrent(state)
  const contentOld = article.firstElementChild
  const contentNew = document.createElement('div')
  contentNew.innerHTML = content
  article.appendChild(contentNew)
  contentOld.classList.add(pageLeave)
  contentNew.classList.add(pageEnter)
  nextFrame(()=>{
    contentOld.classList.add(pageLeaveTo)
    contentNew.classList.add(pageEnterTo)
  }, 2)
  contentOld.addEventListener('transitionend', ()=>{
    article.removeChild(contentOld)
    contentNew.classList.remove(pageEnter, pageEnterTo)
  })
  loading = false
  setSpinner(false)
}

function setSpinner(show){
  if (show) {
    body.appendChild(spinner)
    nextFrame(()=>spinner.classList.add(spinnerVisible), 2)
  } else {
    body.removeChild(spinner)
    spinner.classList.remove(spinnerVisible)
  }
}

function setNavCurrent(currentHref){
  const currentA = nav.querySelector('.'+current) 
  currentA&&currentA.classList.remove(current)
  nav.querySelector(`[href="${currentHref}"]`).classList.add(current)
}
</script>
```

In reality this can timeout so you'll have to account for that as well. But that is more on the subject of building a proper router. So you must figure that out yourself.
For now, with the basics out of the way, lets have a look at some easy effects.

### Page height and left or right

It is a bit more difficult to see with an `<iframe />` but we still haven't done anything about the changing page height.

The previous example does look a bit weird when you go from 'contact' to 'home' in that it still animates from right to left. It would be nice to have it change direction depending on the direction of the menu item.

```html 
<!--embed-->
<template id="pageExample">
<link href="https://fonts.googleapis.com/css?family=Quicksand:300,500" rel="stylesheet" />
<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
body {
  height: 12rem;
  font-family: 'Quicksand', sans-serif;
  font-weight: 300;
}
nav {
  position: sticky;
  position: fixed;
  top: 0;
  z-index: 1;
  margin: 1rem 1rem 0;
}
nav a {
  padding: 0.25rem 0.5rem;
  font-weight: 500;
  text-decoration: none;
  background-color: #EEE;
  transition: background-color 100ms linear;
}
nav a:hover {
  background-color: #DDD;
}
nav a.current {
  background-color: transparent;
}
article {
  position: relative;
  overflow: hidden;
}
.page {
  padding: 1rem 1rem 2rem;
}
h1, p {
}
h1 { 
  margin-top: 2rem; 
  font-weight: 500;
}
h1:first-letter, p:first-letter {
  text-transform: uppercase;
}
p:after { content: '.'; }
.page-enter, .right-enter {
  position: absolute;
  left: 0;
  top: 0;
}
.spinner {
  position: fixed;
  left: calc(50% - 1rem);
  top:calc(50% - 1rem);
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  overflow: hidden;
  opacity: 0;
  transition: opacity 500ms linear 100ms;
  animation: rotate 1500ms infinite linear;
} 
.spinner:before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: radial-gradient(transparent 0 70%, #888 70%);
  box-shadow: 0 0 0 10rem #888;
  transform: translateX(-5%);
}
.spinner--visible {
  opacity: 1;
}
@keyframes rotate { 100% { transform: rotate(360deg); }}
</style>

<nav>
  <a href="#home" class="current">home</a>
  <a href="#about">about</a>
  <a href="#contact">contact</a>
</nav>

<article>
  <div class="page"><h1>home</h1><p>dolor sit amet consectetur adipiscing elit curabitur vel hendrerit</p></div>
</article>
 
<script>
const {body} = document
const pageEnter = 'page-enter'
const pageEnterTo = 'page-enter-to'
const pageLeave = 'page-leave'
const pageLeaveTo = 'page-leave-to'
const rightEnter = 'right-enter'
const rightEnterTo = 'right-enter-to'
const rightLeave = 'right-leave'
const rightLeaveTo = 'right-leave-to'
const current = 'current'
const spinnerVisible = 'spinner--visible'
const article = document.querySelector('article')
const nav = document.querySelector('nav')
const pages = {
  home: 'malesuada lorem vehicula dolor interdum nulla sit ipsum tellus adipiscing amet consectetur justo aliquet in elit donec curabitur sodales'
  ,about: 'ultricies vehicula elit consectetur in amet inceptos lacinia sit odio aenean justo platea purus feugiat conubia interdum himenaeos nisl etiam aliquam justo ante lorem dolor donec ultrices hac in sit interdum ipsum posuere consectetur elit cubilia massa adipiscing amet dolor accumsan elit molestie nec ipsum non lorem sit ligula velit consectetur eros mauris non ipsum hac phasellus integer aenean sodales nibh augue proin lorem pulvinar vitae nisi iaculis in ullamcorper felis odio morbi viverra arcu auctor ut ipsum nibh pulvinar orci dolor lorem nullam pellentesque facilisis vitae imperdiet'
  ,contact: 'aenean ipsum lorem dolor platea sodales sit neque dictumst sem tellus interdum malesuada elit in'
}
const nextFrame = (fn, num=1)=>{
	const a = []
  ;a[num-1] = fn
  const down = ()=>{
  	const fnc = a.shift()
    fnc?fnc():requestAnimationFrame(down)
  }
  requestAnimationFrame(down)
}
const spinner = document.createElement('div')
spinner.classList.add('spinner')

let loading = false
let currentState = ''

const states = Array.from(nav.querySelectorAll('a')).map(m=>m.getAttribute('href'))

nav.addEventListener('click', e=>{
  e.preventDefault()
  if (!loading){
    const {target, target: {textContent:title}} = e
    const href = target.getAttribute('href')
    const text = pages[title]
    
    const oldStateIndex = states.indexOf(currentState)
    const newStateIndex = states.indexOf(href)
    const hasRight = nav.hasAttribute('data-has-right')
    const pageClassName = `page-${title.toLowerCase().replace(/[^a-z]/g,'-')}`
    const toLeft = hasRight ? newStateIndex>oldStateIndex : true
    currentState = href

    setSpinner(true)

    // XHR or fetch here !!! 

    setTimeout(
      onLoad.bind(null, `<h1>${title}</h1><p>${text}</p>`, href, pageClassName, toLeft)
      ,Math.random()<.5?40:200
    )
    loading = true
  }
})

function onLoad(content, state, pageClassName, toLeft){
  setNavCurrent(state)
  const contentOld = article.firstElementChild
  const contentNew = document.createElement('div')
  contentNew.classList.add('page', pageClassName)
  contentNew.innerHTML = content
  article.appendChild(contentNew)
  
  const leave = toLeft?pageLeave:rightLeave
  const enter = toLeft?pageEnter:rightEnter
  const leaveTo = toLeft?pageLeaveTo:rightLeaveTo
  const enterTo = toLeft?pageEnterTo:rightEnterTo

  contentOld.classList.add(leave)
  contentNew.classList.add(enter)
  nextFrame(()=>{
    contentOld.classList.add(leaveTo)
    contentNew.classList.add(enterTo)
  }, 2)
  contentOld.addEventListener('transitionend', ()=>{
    contentOld.parentNode===article&&article.removeChild(contentOld)
    contentOld.classList.remove(leave, leaveTo)
    contentNew.classList.remove(enter, enterTo)
  })
  loading = false
  setSpinner(false)
}

function setSpinner(show){
  if (show) {
    body.appendChild(spinner)
    nextFrame(()=>spinner.classList.add(spinnerVisible), 2)
  } else {
    body.removeChild(spinner)
    spinner.classList.remove(spinnerVisible)
  }
}
function setNavCurrent(currentHref){
  const currentA = nav.querySelector('.'+current) 
  currentA&&currentA.classList.remove(current)
  nav.querySelector(`[href="${currentHref}"]`).classList.add(current)
}
</script>
</template>
```

```html
<!--example-->
<!--include:pageExample-->
<script>document.querySelector('nav').setAttribute('data-has-right','1')</script>
<style>
.page-enter, .page-leave, .right-enter, .right-leave {
  transition: transform 200ms ease-in-out;
}

.page-enter { 
  transform: translateX(100%);
}
.page-enter-to, .page-leave { 
  transform: translateX(0%);
}
.page-leave-to { 
  transform: translateX(-100%);
}

.right-enter { 
  transform: translateX(-100%);
}
.right-enter-to, .right-leave { 
  transform: translateX(0%);
}
.right-leave-to { 
  transform: translateX(100%);
}
</style>

```

### Other easy effects

The examples above use opacity or translation, which is what is mostly used for transitions. Below are some other things you can try.

#### box-shadow and color

Not many people realise you can use `box-shadow` for something else than shadows.

```html
<!--example-->
<!--include:pageExample-->
<style>
  .page-enter, .page-leave {
    transition: box-shadow 500ms ease-in-out;
  }
  .page-enter>*, .page-leave>* {
    transition: opacity 500ms ease-in-out;
  }

  article {
    perspective: 100px;
  }

  .page-enter, .page-leave {
    box-shadow: 0 0 0 0 black inset;
  }
  .page-enter-to, .page-leave-to {
    box-shadow: 100vw 0 0 0 transparent inset;
  }
  
  .page-enter>* {
    opacity: 0;
  }
  .page-enter-to>*, .page-leave>* {
    opacity: 1;
  }
  .page-leave-to>* {
    opacity: 0;
  }
</style>
```

#### masked elements

One nice thing about the more recent CSS capabilities is masking. This can be done by using a property called `clip-path` and it's values can of course be animated.

```html
<!--example-->
<!--include:pageExample-->
<style>
.page-enter, .page-leave {
  transition: clip-path 500ms ease-in-out;
}

.page-enter { 
  clip-path: circle(1% at 50% 50%);
}
.page-enter-to, .page-leave { 
  clip-path: circle(70.7% at 50% 50%);
}
.page-leave-to { 
  clip-path: circle(1% at 50% 50%);
}
</style>
```

#### stretching and combining

Another easy way to animate is to stretch the content by setting the `transform:scale`. You can make it even better if you combine different types of movement. Here we translate the header and scale the content. Also note that the header transition is timing function is a [cubic-bezier](https://cubic-bezier.com/#.5,-0.5,.5,.5) to create a slight bounce.

```html
<!--example-->
<!--include:pageExample-->
<style>
.page-enter, .page-leave {
  transition: opacity 500ms linear;
}
.page-enter *, .page-leave * {
  transition: transform 500ms ease-in-out;
}
.page-enter h1, .page-leave h1 {
  transition: transform 500ms cubic-bezier(.5,-0.5,.5,.5);
}

.page-enter.page-enter-to, .page-leave { 
  opacity: 1;
}
.page-enter, .page-leave-to { 
  opacity: 0;
}
.page-enter.page-enter-to h1, .page-leave h1 { 
  transform: translateX(0);
}
.page-enter h1, .page-leave-to h1 { 
  transform: translateX(-10rem);
}
.page-enter.page-enter-to p, .page-leave p { 
  transform: scaleX(1);
}
.page-enter p, .page-leave-to p { 
  transform: scaleX(22);
}
</style>
```

#### zoom

Here is a different use of `transform:scale` that makes it look as though you're zooming in.

```html
<!--example-->
<!--include:pageExample-->
<style>
.page-enter, .page-leave {
  transform-origin: center 3rem;
  transition: opacity 500ms linear, transform 500ms ease-in-out;
}
.page-enter.page-enter-to, .page-leave { 
  opacity: 1;
  transform: scale(1);
}
.page-enter, .page-leave-to { 
  opacity: 0;
}
.page-enter { 
  transform: scale(0.1);
}
.page-leave-to { 
  transform: scale(4);
}
</style>
```

#### 3D rotation

A transition onto `transform:rotate3d`. Note you have to set `perspective` onto the parent for this to show actual depth.


```html
<!--example-->
<!--include:pageExample-->
<style>
  .page-enter, .page-leave {
    transition: transform 500ms ease-in-out;
  }
  .page-enter>*, .page-leave>* {
    transition: opacity 500ms ease-in-out;
  }

  article {
    perspective: 100px;
  }

  .page {
    transform-origin: 50% 3rem;
  }
  
  .page-enter {
    transform: rotate3d(1, 0, 0, 90deg);
  }
  .page-enter-to, .page-leave {
    transform: rotate3d(1, 0, 0, 0deg);
  }
  .page-leave-to {
    transform: rotate3d(1, 0, 0, -90deg);
  }
  
  .page-enter>* {
    opacity: 0;
  }
  .page-enter-to>*, .page-leave>* {
    opacity: 1;
  }
  .page-leave-to>* {
    opacity: 0;
  }
</style>
```

## conclusion

As you can see you can go far with this before having to resort to JavaScript. Just make sure your transitions are of the same length, if they are not you cannot rely on the transitionEnd event but must use a fixed duration or traverse the stylesheets to calculate the exact duration.
