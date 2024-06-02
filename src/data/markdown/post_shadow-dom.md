<!--
  date: 2024-06-02
  modified: 2024-06-02
  slug: shadow-dom
  type: post
  header: vino-li-55nuS2rUYmQ-unsplash.jpg
  headerColofon: photo by [Vino Li](https://unsplash.com/@vinomamba24)
  categories: code, work
  tags: frameworks, ide, libraries, software, tools
  description: 
-->

# Shadow DOM

About six years ago I gave a little talk on [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) in the front-end guild at Randstad (for whom I was working freelance at that time). Last week I was asked to give a similar talk at my current employers front-end guild because we had recently switched some of our components to shadow DOM due to style bleeds.

So I dusted off some old example code I had made way back, noticed there were some significant changes, read up on the current state, and thought it would make a nice post.


## So why and what is shadow DOM?

In ancient times when websites were just starting to get larger, people started noticing annoying differences: new additions would cause unexpected changes to existing elements.
These side effects were dubbed style bleeds. CSS inheritance and specificity made this an annoying problem, riddling many stylesheets with [repeated selector hacks](https://www.w3.org/TR/selectors-3/#specificity) and [`!important`](https://developer.mozilla.org/en-US/docs/Web/CSS/important).

People came up with (strict) styling strategies to combat style bleeds; [OOCSS](http://oocss.org/), [BEM](https://getbem.com/), [SMACSS](https://smacss.com/), [ITCSS](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/) to name a few. They come with the added benefit that they also help structuring components semantically.

Speaking of components; they are a major advantage front-end frameworks brought us. In due time all major front-end frameworks would add some form of CSS scoping, rendering all those styling strategies more or less obsolete (although they do add logical structure).

But what these frameworks were really anticipating was shadow DOM: a technique that allows encapsulation in DOM and CSSOM.


## What does shadow DOM really do?

Contrary to what you might think: shadow DOM *does* inherit CSS from its parent nodes. What the parent *cannot* do is target elements in the shadow DOM directly. Conversely, the CSS inside the shadow DOM has no effect whatsoever on the rest of the document.

There are however several ways we can control shadow DOM from outside: through the host selector, with slots, parts and CSS properties.
<small>We used to have the selectors `::shadow` and `/deep/`, but these were deprecated in favor of JS manipulation.</small>

### Example

Below is a working example that features these techniques (click the top right icon for editable source):

```html
<!--example-->

<div class="wrapper">
  <div class="wrapper__left">
    <h2>outside</h2>
    <p>nodeName --------x</p>
    <div title="attribute">[attribute] -----x</div>
    <div class="className">.className ------x</div>
    <div class="cssProperty">--cssProperty ----</div>
    <div>slot -------------</div>
    <div>::part -----------</div>
    <div>JavaScript -------</div>
  </div>
  <!-- add `.shadow` to `my-shadow` below -->
  <my-shadow class="wrapper__right"><span slot="mySlot" class="slot">---&gt; <span class="slot-content">slot</span></span></my-shadow>
</div>

<template id="tmpl">
  <style>
    :host {
      /*////////////////////*/
      all: initial;
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
      /*////////////////////*/
      
      color: green;
      box-shadow: 0 0 0 0.125rem green inset;
      
      box-sizing: border-box;
      
      *, *:before, *:after { box-sizing: inherit; }
      
      * { white-space: pre; }
      
      p { margin: 0; }
      
      h2 { text-decoration: inherit; }
    }
    
    :host(.shadow) {
      transform: skewY(10deg);
      transform-origin: 0 0;
    }
    
    :host(.wrapper__right.shadow) { padding: 2rem; }
    
    .cssProperty { color: var(--color); }
    
    ::slotted(*) { background-color: lightgoldenrodyellow; }
    
    .slot, [slot], .slot-content {
      text-decoration: underline;
      box-shadow: 0 0 0 0.125rem yellow inset;
    }
  </style>
  <h2>shadow root</h2>
  <p> nodeName</p>
  <div title="attribute"> [attribute]</div>
  <div class="className"> .className</div>
  <div class="cssProperty">---&gt; --cssProperty</div>
  <slot name="mySlot">--</slot>
  <div part="myPart">---&gt; ::part</div>
  <div class="js">---&gt; JavaScript</div>
</template>

<style>
  :root {
    --color: #F04;
  }
  
  html {
    font-size: 4.75vw;
  }
  
  html {
    box-sizing: border-box;
  }
  
  *, *:before, *:after {
    box-sizing: inherit;
  }
  
  body {
    margin: 1rem;
    font-size: 0.75rem;
    line-height: 130%;
    color: black;
  }
  
  .wrapper h2, my-shadow > h2 {
    text-decoration: underline;
    text-align: center;
  }
  
  p {
    margin: 0;
  }
  
  .wrapper {
    font-family: monospace;
    margin: 2rem 0;
    display: flex;
  }
  
  .wrapper__left, .wrapper__right {
    padding: 0.5rem;
  }
  
  
  /* blocked styling */
  
  my-shadow .className:after {
    content: '?';
  }
  
  ::shadow div {
    font-weight: bold;
  }
  
  /deep/ div {
    font-style: italic;
  }
  
  my-shadow div,
  p,
  [title=attribute],
  .className {
    color: purple;
  }
  
  
  /* passes styling */
  
  ::part(myPart),
  .slot {
    color: #f04;
  }
  
  my-shadow {
    font-style: italic;
    /*font-family: inherit;*/
    /*font-size: inherit;*/
    /*line-height: inherit;*/
  }
</style>

<script>
  const tmpl = document.getElementById('tmpl')
  window.customElements.define('my-shadow', class Foo extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
          .appendChild(tmpl.content.cloneNode(true))
    }
  })
  const myShadow = document.querySelector('my-shadow');
  const shadowRoot = myShadow.shadowRoot;
  const innerElement = shadowRoot.querySelector('.js');
  innerElement.style.color = '#f04';
</script>
```

## Custom elements

At this point it might be a good time to mention [custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements). Which is something different, but it generally goes hand in hand with shadow DOM. Yes, you can simply say

```JavaScript
document.querySelector('#host')
    .attachShadow({ mode: 'open' })
    .appendChild(document.createTextNode('I am the terror that flaps in the night'))
```

But there's no fun in that.

## host element, selector and function

The `:host` pseudo-class selector is used from inside the shadow DOM to style the host element. It can be used to combine the outside- with the inside state. The host element itself is not really part of the shadow DOM; it can be styled by both document and shadow. So don't put any styling in there you don't want overridden.

For example: when a class is set onto the host element, you can use the host selector *function* inside the shadow DOM styling like this `:host(.host-class-name) .inner { color: #F04; }`:

```html
<!--example-->
<style>
    .host {
      margin-bottom: 1rem;
      &:first-letter { font-size: 1.5rem; }
    }
    .pink { color: lime; }
</style>
  
Host element:
<div class="host"></div>
Host element with extra className:
<div class="host pink"></div>
<script>
         
Array.from(document.querySelectorAll('.host')).forEach(host=>{
    host.attachShadow({ mode: 'open' }).innerHTML = `
        <style>
            :host(.pink) .inner { color: #F04; }
            .pink {
                font-style: italic;
            }
            .inner {
                font-family: monospace;
            }
        </style>
        <span class="inner">I am the terror that flaps in the night</span>`
})
</script>
```

Since shadow DOM *does* inherit CSS rules, a common rule inside the shadow DOM styling is [`all: initial;`](https://developer.mozilla.org/en-US/docs/Web/CSS/all), and only let specific properties inherit. Like a sieve:

```CSS
:host {
    all: initial;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
}
```

One thing to remember is that outside styling of the host element takes precedence over host styling from within the shadow DOM.


## slots

Slots can be seen as bubbles through which outside elements and styling can be placed inside the shadow DOM. Slots are the interface through which content can be placed in the shadow DOM.
A custom element can have multiple, named slots. The way to style it inside the shadow is by its name: `::slotted([slot=name]) { color: lime; }`.
Since slots are implemented (not defined) outside the shadow they can also be styled from without: `[slot=name] { font-style: italic; }`.

```html
<!--example-->
<style>
    .host {
        margin-bottom: 1rem;
        &:first-letter { font-size: 1.5rem; }
    }
    [slot=when] { font-style: italic; }
    /* below doesn't work, above does */
    [name=when] { text-decoration: underline; }
</style>

Shadow with default slot contents:
<div class="host"></div>
Shadow with custom slot contents:
<div class="host"><span slot="when">day</span></div>
<script>
         
Array.from(document.querySelectorAll('.host')).forEach(host=>{
    host.attachShadow({ mode: 'open' }).innerHTML = `
        <style>
            :host { font-family: monospace; }
            [name=when] {
                color: lime;
            }
            ::slotted([slot=when]) {
                color: #F04;
            }
        </style>
        <span class="inner">I am the terror that flaps in the <slot name="when">night</slot></span>`
})
</script>
```

## parts

Parts are a way for the shadow element to designate specific areas to be accessible for styling from the outside. Inside the shadow you say `<span part="label">Hello</span>` which makes it possible for the document stylesheet to have `::part(label) { color: lime; }`.

```html
<!--example-->
<style>
  .host+.host::part(when) {
    color: #f04;
  }
</style>

Shadow with default part:
<div class="host"></div>
Shadow with custom part styling:
<div class="host">asdf</div>
<script>
         
Array.from(document.querySelectorAll('.host')).forEach(host=>{
    host.attachShadow({ mode: 'open' }).innerHTML = `
        <style>
            :host { 
                font-family: monospace;
                margin-bottom: 1rem;
            }
            [part=when] {
                color: lime;
            }
        </style>
        <span class="inner">I am the terror that flaps in the <span part="when">night</span></span>`
})
</script>
```

## CSS properties

CSS properties are unaffected by shadow. All properties defined in `:root` are accessible in shadow DOM. This also makes it possible to specify properties on the host element, as a more restrictive 'parts' implementation.

```html
<!--example-->
<style>
  .host {
    --color: #f04;
  }
  .host+.host {
--color: lime;
  }
</style>

Shadow with CSS property:
<div class="host"></div>
Shadow with overriden CSS property:
<div class="host">asdf</div>
<script>
         
Array.from(document.querySelectorAll('.host')).forEach(host=>{
    host.attachShadow({ mode: 'open' }).innerHTML = `
        <style>
            :host { 
                font-family: monospace;
                margin-bottom: 1rem;
            }
            .inner {
                color: var(--color);
            }
        </style>
        <span class="inner">I am the terror that flaps in the <span part="when">night</span></span>`
})
</script>
```

## JavaScript

There use to be a way to pierce through the shadow with CSS, but that was deprecated because you really shouldn't want to. JavaScript is the way to go if you really must have access. You might want to test an effect for instance. All you really need is access the `shadowRoot` property, and from there on out you can proceed inside the shadow as you would in your normal `documentElement` root.

```JavaScript
const myShadow = document.querySelector('my-shadow')
const {shadowRoot} = myShadow
const innerElement = shadowRoot.querySelector('.inner-element')
innerElement.style.color = '#f04'
```

## Thats it

You'll probably never use all this because your framework takes care of shadow DOM for you. But at least now you now know its not really magic.



