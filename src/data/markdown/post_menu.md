---
date: 9999-99-99
modified: 9999-99-99
slug: menu
type: post
categories: []
---

# menu

A subtle change the menu above makes a lot of difference.
Here is a before and after:

<div class="menu-old-new">
    <div></div>
    <input type="range" min=0 max=100 value=50 oninput="document.body.style.setProperty('--menu-old-new', this.value)">
</div>
<style>
:root {
  --menu-old-new: 50;
}
.menu-old-new {
  position: relative;
  width: calc(100% - 2rem);
  padding-bottom: 21%;
  background-image: url(https://res.cloudinary.com/dn1rmdjs5/image/upload/v1781888154/rv/menu_old.jpg);
  background-size: 100%;
  background-position: 0 60%;
  div {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-image: url(https://res.cloudinary.com/dn1rmdjs5/image/upload/v1781888154/rv/menu_new.jpg);
      background-size: inherit;
      background-position: inherit;
      clip-path: xywh(0 0 calc(var(--menu-old-new) * 1%) 100%);
  }
  input {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      margin: 0;
      transform: translateY(50%);
  }
}
</style>

It used to be straight and boring, now it is slanted and boring. But it animates differently! And has some perspective.

You'd think CSS transforms would be handy because you can easily create perspective with it, like I did in [this box example at the bottom here](/front-end-logic-without-javascript#its-easier-with-variables). But its hard to control the exact height and angle, plus there would be z-position isseus with the text. I wanted finer control so I used `:before` and `:after` skewed and masked. So it looks 3D but really isn't.  

<div class="two-skewed-rects"><style>
.two-skewed-rects {
  position: relative;
  width: calc(100% - 2rem);
  padding-bottom: 30%;
  overflow: hidden;
  &:before, &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #888;
    box-shadow: 0 0 0 1rem #666 inset;
    transform-origin: 0 100%;
    transform: skew(-30deg);
    clip-path: xywh(0 0 50% 100%);
  }
  &:after {
    box-shadow: 0 0 0 1rem #AAA inset;
    transform: skew(10deg);
    clip-path: xywh(50% 0 50% 100%);
  }
}
</style></div>

This works fine, even with differen sizes of text. It is not even that big of an issue to calculate when using custom CSS properties.

```CSS
--degStep: 15deg;

&:nth-child(2):before { transform: skew(calc(-2 * var(--degStep))); }
&:nth-child(2):after  { transform: skew(calc(-1 * var(--degStep))); }

&:nth-child(3):before { transform: skew(calc(-1 * var(--degStep))); }
&:nth-child(3):after  { transform: skew(calc(0.25 * var(--degStep))); }

&:nth-child(4):before { transform: skew(calc(0.25 * var(--degStep))); }
&:nth-child(4):after  { transform: skew(calc(1 * var(--degStep))); }

&:nth-child(5):before { transform: skew(calc(1 * var(--degStep))); }
&:nth-child(5):after  { transform: skew(calc(2 * var(--degStep))); }
```

lorem ipsum dolir sit amet 

<div class="two-skewed-rects two-skewed-rects--animated"><span>about</span><style>
:root {
  --two-skewed-rects: 45%;
}
.two-skewed-rects--animated {
  padding: 2% 0 0;
  text-align: center;
  span {
    position: relative;
    z-index: 2;
    color: white;
    font-size: 4rem;
    line-height: 140%;
    text-transform: uppercase;
  }
  &:before, &:after {
    background: #F04;
    box-shadow: calc(var(--two-skewed-rects) * 1vw) 0 0 #111 inset;
  }
  &+input {
      osition: absolute;
      eft: 0;
      ottom: 0;
      width: calc(100% - 2rem);
      argin: 0;
      transform: translateY(50%);
      z-index: 5;
  }
}
</style></div>
<input type="range" min=0 max=100 value=50 oninput="document.body.style.setProperty('--two-skewed-rects', this.value)">

For the animation I wanted a color swiping from right to left, or the other way around depending on the active menu-item.

A true 3D transform would look best of course. But the menu-items are small(ish), the background is obscured by text, and the animation duration is only a couple of milliseconds. So we can get away with the above.

For a hover state the animation can easily be done in pure CSS, because you can check `:hover:not(.current):has(~a.current)` as well as the negation. For the actual active animation some JavaScript is needed because as soon as the `.current` className is removed, so is the state of direction.

The logic seems simple enough but the order of actions is important. It is comparable to that of [page transitions](/the-basics-of-css-page-transitions).

We first find the index of the `.current` menu-item (not removing the className just yet.

<pre><code data-language="javascript" data-src="/static/experiment/blob.js"></code></pre>
