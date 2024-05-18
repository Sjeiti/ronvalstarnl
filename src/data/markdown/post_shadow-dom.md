<!--
  date: 9999-99-99
  modified: 9999-99-99
  slug: shadow-dom
  type: post
  header: barn-images-t5YUoHW6zRo-unsplash.jpg
  headerColofon: photo by [Barn images](https://unsplash.com/@barnimages)
  headerClassName: no-blur darken
  categories: code, work
  tags: frameworks, ide, libraries, software, tools
  description: 
-->

# Shadow DOM

About six years ago I gave a little talk on shadow DOM in the front-end guild at Randstad (for whom I was working freelance at that time). Last week I was asked to give a similar talk at my current employers front-end guild. The reason being that we had recently switched some of our components to shadow DOM due to style bleeds.

So I dusted off some old example code I had made back then, noticed there were some significant changes, read up on the current state, and thought it would make a nice post.


## So why and what is shadow DOM?

In ancient times when websites were just starting to get larger, people started noticing annoying differences in styling for the same elements. New additions would have the unexpected side-effect of affecting existing elements.
This side-effect was dubbed style bleeds. Because of CSS inheritance and specificity it was a real problem, riddling many stylesheets with repeated selector hacks and `!important`.

People came up with strict styling strategies to combat style bleeds; OOCSS, BEM, SMACSS, Atomic design, ITCSS to name a few. They come with the added benefit that they also help structuring components semantically (not Atomic design though, Atomic design is just stupid).

I mentioned components, these were the most imporant effect front-end frameworks had. In due time all major front-end frameworks would add some form of CSS scoping, rendering all those styling strategies obsolete (were it not for the semanticsXXXXX).
But what these frameworks were really anticipating was shadow DOM.

Shadow DOM is a technique that allows encapsulation in DOM and CSSOM.

This had always been part of browsers in the form of, say, input elements. But with shadow DOM it became available for us mere mortals.


## How does it work?

Contrary to what you might think: shadow DOM *does* inherit CSS from its parent nodes. What the parent cannot do is target elements in the shadow DOM directly. Conversely, the CSS inside the shadow DOM has no effect whatsoever on the rest of the document.

There are however several ways we can control shadow DOM from the outside: the host selector, slots, parts and CSS properties.

### Custom elements

### host selector

### slots

### parts

### CSS properties



<ul>
  <li>shadow DOM <em>does</em> inherit CSS</li>
  <li>CSS inside shadow DOM does not affect outside.</li>
  <li>CSS outside shadow DOM cannot directly target inside, except when using --cssProperties, slots and/or ::parts.</li>
  <li><code>:host(selector)</code> can be used to react to outside</li>
</ul>

<p>Selectors <code>::shadow</code> and <code>/deep/</code> are deprecated in favor of JS manipulation.</p>

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

<!-- custom element template ---------------------------------------------------------->

<template id="tmpl">
  <style>
                :host {
      /*////////////////////*/
                        all: initial;
                        font-family: monospace;
                        font-size: 0.75rem;
                        line-height: 130%;
                        /*////////////////////*/

                        color: green;
      box-shadow: 0 0 0 0.125rem green inset;

                        box-sizing: border-box;
                        *, *:before, *:after { box-sizing: inherit; }

                        * { white-space: pre; }
                        p { margin: 0; }
                        h2 {
        text-decoration: inherit;
      }
                }

                :host(.shadow) { transform: skewY(10deg); transform-origin: 0 0; }
                :host(.wrapper__right.shadow) { padding: 2rem; }

                .cssProperty {
                        color: var(--color);
                }

                ::slotted(*) {
                        background-color: lightgoldenrodyellow;
                }
    .slot, [slot], .slot-content {
                        text-decoration: underline;
                        box-shadow: 0 0 0 0.125rem yellow inset;
    }

  </style>
  <h2>shadow root</h2>
  <p>     nodeName</p>
  <div title="attribute">     [attribute]</div>
  <div class="className">     .className</div>
  <div class="cssProperty">---&gt; --cssProperty</div>
  <slot name="mySlot">--</slot>
  <div part="myPart">---&gt; ::part</div>
  <div class="js">---&gt; JavaScript</div>
</template>


<!-- global style ---------------------------------------------------------->

<style>
        :root {
                --color: #F04;
        }

        html {
    font-size: 48px;
    font-size: 16px;
  }

        html { box-sizing: border-box; }
        *, *:before, *:after { box-sizing: inherit; }

        body {
    margin: 1rem;
                font-size: 0.75rem;
                line-height: 130%;
                color: black;
        }
        .wrapper h2, my-shadow>h2 {
                text-decoration: underline;
                text-align: center;
        }
  p { margin: 0; }

        .wrapper {
                font-family: monospace;
    margin: 2rem 0;
                display: flex;
        }
        .wrapper__left, .wrapper__right {
                padding: 0.5rem;
        }

  /* blocked styling */


  my-shadow >>> .className:after {
                content: '?';
        }
  ::shadow div {
                font-weight: bold;
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


<!-- JavaScript -->

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

<h2>JavaScript</h2>

<pre><code>
const myShadow = document.querySelector('my-shadow');
const shadowRoot = myShadow.shadowRoot;
const innerElement = shadowRoot.querySelector('.inner-element');
innerElement.style.color = '#f04';
</code></pre>


<h2>Links</h2>

<ul>
  <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM">MDN: Using shadow DOM</a></li>
  <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements">MDN: Using custom elements</a></li>
</ul>

