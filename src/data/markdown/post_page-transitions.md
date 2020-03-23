<!--
  date: 2022-03-16
  modified: 2022-03-18
  slug: the-basics-of-css-page-transitions
  type: post
  header: colorbox.jpg
  excerpt: 
  categories: Javascript
  tags: CSS, transitions
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
The second indication should feel short and natural. You could give the transition some sort of order (left/right) or hirarchy (top/bottom) but nothing fancy.

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

There are rare situations where you must primarily animate by script (with WebGL for instance). In most cases however a simple CSS animation wil suffice.
To use the CSS `transition` we simply toggle classes on the content elements. This adds up to four classes in total: for each element we set the initial state and the final state.

We'll use the following className naming convention: `[name]-[type]-[state]` which amounts to the following:

```css
.page-enter { opacity: 0; }
.page-enter-active { opacity: 1; }
.page-leave { opacity: 1; }
.page-leave-active { opacity: 0; }
```

<small>(and yes: you could combine them for brevity)</small>

Upon transition `page-enter` is added and one tick later `page-enter-active` (same for `leave`). When the animation is finished the classes are to be removed.
We can determine the finished state with the `animationend` event.

```example
<style>
  article {
    position: relative;
  }
  .page-enter {
    position: absolute;
    opacity: 0;
  }
  .page-enter-to { opacity: 1; }
  .page-leave { opacity: 1; }
  .page-leave-to { opacity: 0; }
</style>
<article>
  <div>lorem ipsum</div>
</article>
<button>next</button>
<script>
  const className = {
    pageEnter: 'page-enter'
    ,pageEnterTo: 'page-enter-to'
    ,pageLeave: 'page-leave'
    ,pageLeaveTo: 'page-leave-to'
  }
  const article = document.querySelector('article')
  document.querySelector('button').addEventListener('click', ()=>{
    const contentOld = article.firstChildElement
    const contentNew = document.createElement('div')
    contentNew.textContent = Date.now().toString(16)
    article.appendChild(contentNew)
    //
    contentOld.classList.add('page-leave')
    contentNew.classList.add('page-enter')
    requestAnimationFrame(()=>{
      contentOld.classList.add('page-leave-to')
      contentNew.classList.add('page-enter-to')
    })
    //
    contentOld.addEventListener('animationend', ()=>{
      article.removeChild(contentOld)
      contentNew.classList.remove('page-enter', 'page-enter-to')
    })
  })
</script>
```

The tricky thing is the animation target. If your enter animation is this

```css
.page-enter div { opacity: 0; }
.page-enter-to div { opacity: 1; }
```


---

Lets have a look at the existing frameworks for a naming convention.

[Vue transitions](https://vuejs.org/v2/guide/transitions.html)
```css
.fade-enter-active, .fade-leave-active { transition: opacity .5s; }
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ { opacity: 0; }
```



