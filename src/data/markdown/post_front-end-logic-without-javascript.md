<!--
  slug: front-end-logic-without-javascript
  date: 2020-02-23
  modified: 2020-03-24
  type: post
  header: vanveenjf-Ou36eroE7k0-unsplash.jpg
  category: JavaScript
  tag: code quality, string
-->

# Front-end logic without Javascript

It is surprising how few front-end developers are aware of this little trick (but maybe I meet the wrong ones).
There is an easy way to manage the state of a user interface using *only* HTML and CSS.
You can easily make expanders, tabs, hamburger menus or even apply multiple complex states onto an HTML element, and everything without a single line of JavaScript.

## The basics

To get started you use the CSS pseudo selector `input:checked` in combination with a sibling selector `+` or `~`. This can be used to have a different element reflect the state of the input.

For instance if you check the checkbox the text in the div will turn red:

```html
<input type="checkbox">
<div>red</div>
```

```css
input:checked + div { 
  color: red;
}
```

```html
<!--example-->
<style>
    html { font-size: 2rem; font-family: Arial, sans; }
    input {
        width: 2rem;
        height: 2rem;
        transform: scale(2);
    }
    input:checked + div { 
      color: red;
    }
</style>
<input type="checkbox">
<div>red</div>
```

The `input:checked` state applies only to `checkbox`  and `radio` types.
You can do this with other siblings as wel or their children. 

## Add a label

The input must always precede the targeted element. But we can get around that by hiding the input and triggering it with a label. But we cannot simply `display:none` the input because that would make it stop working. Instead we add a class called `visuallyhidden` ([by convention](https://duckduckgo.com/?q=visuallyhidden)).


```html
<input type="checkbox" id="you" class="visuallyhidden">
<div>red</div>
<label for="you">green</label>
```

```css
input:checked + div { 
  color: red;
}
.visuallyhidden {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
}
```

```html
<!--example-->
<style>
    html { font-size: 2rem; font-family: Arial, sans; }
    input:checked + div { 
      color: red;
    }
    .visuallyhidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
    }
</style>
<input type="checkbox" id="you" class="visuallyhidden">
<div>red</div>
<label for="you">click</label>
```

## Simple examples

At this point you know enough to apply this to numerous UX patterns. Here are some examples.

### An expander

An element that reveals more content when clicked.

```html
<!--example-->
<style>
    html { font-family: Arial, sans; }
    label {
        display: flex;
        justify-content: space-between;
        width: 8rem;
        padding: 0.5rem;
        background-color: #888;
        color: white;
        cursor: pointer;
    }
    label:after {
        content: '^';
        font-weight: bold;
        transform: translateY(0.25rem);
    }
    .expand {
        width: 8rem;
        padding: 0 0.5rem;
        max-height: 0;
        transition: max-height 200ms ease;
        background-color: #BBB;
        overflow: hidden;
    }
    input:checked ~ label { 
        max-height: 4rem;
    }
    input:checked ~ label:after { 
        transform: translateY(-0.125rem) scaleY(-1);
    }
    input:checked ~ .expand { 
        max-height: 4rem;
        padding: 0.5rem;
    }
    .visuallyhidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
    }
</style>
<input type="checkbox" id="you" class="visuallyhidden">
<label for="you">click</label>
<div class="expand">more content</div>
```

### Tabbed panels

To created a tabbed interface we use a `radio` instead of a `checkbox`. If you check the source you might notice that the sections all have the className `visuallyhidden`. The reason is that, contrary to `display:none`, hiding it this way still allows for search engines to read it's content.


```html
<!--example-->
<style>
    html { font-family: Arial, sans; }
    header, label, main { padding: 0.5rem; }
    label { background-color: #EEE; }
    section { display: none; }
    input#tab1:checked ~ header label[for=tab1],
    input#tab2:checked ~ header label[for=tab2],
    input#tab3:checked ~ header label[for=tab3] { 
        font-weight: bold;
        background-color: transparent;
    }
    input#tab1:checked ~ main section.tab1,
    input#tab2:checked ~ main section.tab2,
    input#tab3:checked ~ main section.tab3 {
        position: static; 
        display: block;
        max-width: 12rem;
        width: auto;
        height: auto;
    }
    .visuallyhidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
    }
</style>
<input type="radio" name="tab" id="tab1" class="visuallyhidden" checked />
<input type="radio" name="tab" id="tab2" class="visuallyhidden" />
<input type="radio" name="tab" id="tab3" class="visuallyhidden" />
<header>
    <label for="tab1">Foo 1</label>
    <label for="tab2">Foo 2</label>
    <label for="tab3">Foo 3</label>
</header>
<main>
    <section class="tab1 visuallyhidden">Ad alias ea iure magni minima nostrum possimus quasi repudiandae rerum suscipit, ullam voluptatem.</section>
    <section class="tab2 visuallyhidden">Aliquid amet est illo labore magnam officia omnis tempora vero, voluptatem.</section>
    <section class="tab3 visuallyhidden">Deleniti earum in praesentium quas tenetur vero.</section>
</main>
```

### A hamburger menu

This is really just an expander. But just for examples sake: here is a nested one. And a bit of UX advice on hamburgers: try not to use them especially if you only have three menu items.

Here we have is also a small issue that is hard to resolve without resorting to Javascript. The submenus in this example use `input[type=radio]` and unlike `type=checkbox` radios cannot be disabled when clicking the selected one. Resolving this issue requires adding an extra unrelated input which will be checked by Javascript when a checked radio is clicked.

```html
<!--example-->
<style>
    a, a:hover { color: #333; }
    html { font-family: Arial, sans; }
    body { height: 10rem; }
    [for=hamburger] {
        position: fixed;
        right: 0;
        top: 0;
        z-index: 1;
        display: block;
        width: 2rem;
        height: 2rem;
        background-image: repeating-linear-gradient(#333,#333 20%,transparent 20%,transparent 40%,#333 40%,#333 60%,transparent 60%,transparent 80%,#333 80%);
        cursor: pointer;
        transition: transform 200ms ease;
    }
    .menu {
        position: fixed;
        right: 0;
        top: 0;
        height: 100vh;
        padding: 0 0.5rem;
        background-color: #DDD;
        box-shadow: 0 0 1rem transparent;
        transform: translateX(100%);
        transition: transform 200ms ease, box-shadow 200ms linear;
    }
    
    input#hamburger:checked ~ [for=hamburger] {
        transform: rotate(90deg);
        transform-origin: 50%;
    }
    input#hamburger:checked ~ .menu {
        box-shadow: 0 0 1rem rgba(0,0,0,0.5);
        transform: translateX(0);
    }
    input.submenu+label:after {
        content: '+';
    }
    input.submenu+label+menu {
        max-height: 0;
        overflow: hidden;
        transition: max-height 200ms ease;
    }
    input.submenu:checked+label:after {
        content: '-';
    }
    
    input.submenu:checked+label+menu {
        max-height: 6rem;
    }
    
    .visuallyhidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
    }
</style>
<input type="checkbox" id="hamburger" class="visuallyhidden" />
<label for="hamburger"></label>
<div class="menu">
    <input class="visuallyhidden submenu" name="menu" type="radio" id="menu1" checked />
    <label for="menu1">menu 1</label>
    <menu>
        <div><a href="#">menu item 1</a></div>
        <div><a href="#">menu item 2</a></div>
        <div><a href="#">menu item 3</a></div>
        <div><a href="#">menu item 4</a></div>
    </menu>
    <input class="visuallyhidden submenu" name="menu" type="radio" id="menu2" />
    <label for="menu2">menu 2</label>
    <menu>
        <div><a href="#">menu item 5</a></div>
        <div><a href="#">menu item 6</a></div>
        <div><a href="#">menu item 7</a></div>
        <div><a href="#">menu item 8</a></div>
    </menu>
</div>
```

### A carousel

Note that this example is merely to illustrate the technique. There are better ways of showing content than [using a carousel](http://shouldiuseacarousel.com/).

```html
<!--example-->
<style>
    html, body, ul, li { padding: 0; margin: 0; }
    .wrapper {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }
    ul {
        width: 400vw;
        height: 100vh;
        white-space: nowrap;
        list-style: none;
      transition: transform 400ms ease;
    }
    ul:after {
      content: '';
      display: table;
      clear: both;
    }
    li {
        position: relative;
        display: block;
        float: left;
        width: 100vw;
        height: 100vh;
        box-shadow: 0 0 4rem black;
        text-align: center;
        font-size: 2rem;
        line-height: 100vh;
    }
    label {
      position: absolute;
      right: 0;
      top: 25%;
      width: 2rem;
      height: 50%;
      background-color: #888;
      cursor: pointer;
    }
    label.left {
      right: auto;
      left: 0;
    }
    
    #crs1:checked~.wrapper ul { transform: translateX(0); }
    #crs2:checked~.wrapper ul { transform: translateX(-100vw); }
    #crs3:checked~.wrapper ul { transform: translateX(-200vw); }
    #crs4:checked~.wrapper ul { transform: translateX(-300vw); }
    
    .visuallyhidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
    }
</style>

<input type="radio" class="visuallyhidden" name="crs" id="crs1" checked  class="visuallyhidden"/>
<input type="radio" class="visuallyhidden" name="crs" id="crs2"/>
<input type="radio" class="visuallyhidden" name="crs" id="crs3"/>
<input type="radio" class="visuallyhidden" name="crs" id="crs4"/>
<div class="wrapper">
  <ul>
      <li>
        element 1
        <label for="crs2"></label>
      </li>
      <li>
        element 2
        <label for="crs1" class="left"></label>
        <label for="crs3"></label>
      </li>
      <li>
        element 3
        <label for="crs2" class="left"></label>
        <label for="crs4"></label>
      </li>
      <li>
        element 4
        <label for="crs3" class="left"></label>
      </li>
  </ul>
</div>
```


## It's easier with variables

These sibling>child selectors can get a bit tedious or complex. And what if you start moving stuff around, or try to generalise it into a component.

Luckily CSS also has variables. We can also use those and make things even more interesting.

```css
:root {
  --color: green;
}
input:checked ~ main { 
  --color: red;
}
.text {
  color: var(--color);
}
```

This might not look much different from what we started with but variables allow you to have only one `:checked` declaration that applies to multiple `var(...)` implementations and (even better) multiple different `:checked` declarations can be used in a single rule: `transform: translate(var(--x), var(--y));`.

If you use variables you can declare them as high as possible and never worry about moving your variable affected components around. So put your hidden inputs at `body>input` and overwrite them at `body>input~main` for instance.

Here's a little box. It is a relatively simple example how three individual states can amount to sixteen possibilities. Click on the side to rotate it. Click on the top to open it. And click the inside to look inside.

The topleft checkbox shows all the labels and checkboxes.

```html
<!--example-->
<style>
* {
  box-sizing: border-box; }

body {
  font-family: sans-serif; }

:root {
  --translate-z: -100px;
  --rotate-x: -22deg;
  --rotate-y: 33deg;
  --open: 3deg; }

input#front:checked ~ .scene {
  --rotate-y: 20deg; }

input#left:checked ~ .scene {
  --rotate-y: 70deg; }

input#back:checked ~ .scene {
  --rotate-y: 160deg; }

input#right:checked ~ .scene {
  --rotate-y: -60deg; }

input#up:checked ~ .scene {
  --rotate-x: -65deg; }

input#lid:checked ~ .scene {
  --open: 115deg;
  --top-light: 0.05; }

:root {
  --size: 200px;
  --sizeh: calc(var(--size) / 2);
  --sizeq: calc(var(--size) / 4);
  --color-box: #BF8363;
  --color-box-dark: #964D24;
  --inside-offset: 0.999;
  --top-light: 0.2; }

.scene {
  width: var(--size);
  height: var(--size);
  margin: var(--sizeh) auto;
  perspective: 400px; }

.cube {
  width: var(--size);
  height: var(--size);
  position: relative;
  transform-style: preserve-3d;
  transition: transform 1s ease;
  transform: translateZ(var(--translate-z)) rotateX(var(--rotate-x)) rotateY(var(--rotate-y)); }
  .cube__face {
    position: absolute;
    width: var(--size);
    height: var(--size);
    line-height: var(--size);
    font-size: 2rem;
    font-weight: bold;
    color: #855237;
    text-align: center;
    background-color: #BF8363; }
    .cube__face.-top {
      box-shadow: 2rem 4rem 8rem rgba(255, 255, 255, 0.2) inset, 0 2px 2px #964D24 inset, 0 -2px 2px #964D24 inset;
      background-image: linear-gradient(90deg, transparent 49%, #964D24 49%, #964D24 51%, transparent 51%);
      text-indent: 6rem; }
    .cube__face.-right {
      box-shadow: 0 -4rem 8rem rgba(0, 0, 0, 0.2) inset; }
    .cube__face.-left {
      box-shadow: 0 -4rem 8rem rgba(0, 0, 0, 0.2) inset; }
    .cube__face.-bottom {
      box-shadow: 0 0 1rem rgba(0, 0, 0, 0.4); }
    .cube__face.-top:after, .cube__face.-top-half:after, .cube__face.-front:after, .cube__face.-back:after {
      content: '';
      position: absolute;
      left: 42%;
      top: 0;
      display: block;
      height: 100%;
      width: 16%;
      background-color: rgba(255, 255, 255, 0.1); }
    .cube__face.-front:after, .cube__face.-back:after {
      height: 30%; }
    .cube__face.-top {
      display: none; }
    .cube__face.-front {
      transform: rotateY(0deg) translateZ(var(--sizeh)); }
    .cube__face.-right {
      transform: rotateY(90deg) translateZ(var(--sizeh)); }
    .cube__face.-back {
      transform: rotateY(180deg) translateZ(var(--sizeh)); }
    .cube__face.-left {
      transform: rotateY(-90deg) translateZ(var(--sizeh)); }
    .cube__face.-top {
      transform: rotateX(90deg) translateZ(var(--sizeh)); }
    .cube__face.-bottom {
      transform: rotateX(-90deg) translateZ(var(--sizeh)); }
    .cube__face.-inside {
      box-shadow: 0 -2rem 8rem rgba(0, 0, 0, 0.4) inset; }
      .cube__face.-inside:after {
        content: initial; }
    .cube__face.-inside.-front {
      transform: rotateY(0deg) translateZ(calc(var(--inside-offset)*var(--sizeh))); }
    .cube__face.-inside.-right {
      transform: rotateY(90deg) translateZ(calc(var(--inside-offset)*var(--sizeh))); }
    .cube__face.-inside.-back {
      transform: rotateY(180deg) translateZ(calc(var(--inside-offset)*var(--sizeh))); }
    .cube__face.-inside.-left {
      transform: rotateY(-90deg) translateZ(calc(var(--inside-offset)*var(--sizeh))); }
    .cube__face.-inside.-top {
      transform: rotateX(90deg) translateZ(calc(var(--inside-offset)*var(--sizeh))); }
    .cube__face.-inside.-bottom {
      transform: rotateX(-90deg) translateZ(calc(var(--inside-offset)*var(--sizeh))); }
    .cube__face.-top-half {
      box-shadow: 2rem 4rem 8rem rgba(255, 255, 255, var(--top-light)) inset;
      transform: rotateX(90deg) translateZ(var(--sizeh)) translateX(calc(-1*var(--sizeq))) rotateY(calc(-1 * var(--open))) translateX(var(--sizeq));
      width: var(--sizeh);
      transition: transform 1000ms ease, box-shadow 1000ms linear; }
      .cube__face.-top-half:after {
        left: auto;
        right: 0; }
      .cube__face.-top-half + .-top-half {
        transform: rotateX(90deg) translateZ(var(--sizeh)) translateX(calc( var(--size) - 1*var(--sizeq))) rotateY(calc(-180deg + var(--open))) translateX(var(--sizeq)); }

label {
  display: block;
  width: 50%;
  height: 100%;
  float: left;
  cursor: pointer; }
  label:after {
    content: '';
    display: table;
    clear: left; }
  label:first-child:last-child {
    width: 100%; }

input#debug:checked ~ .scene .cube__face:before {
  content: attr(data-side);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -30%); }

input#debug:checked ~ .scene label {
  --sqrt: calc(141.4213562373095px/2);
  --sqrth: calc(var(--sqrt)/2);
  background-image: repeating-linear-gradient(45deg, transparent, transparent var(--sqrth), rgba(255, 255, 0, 0.2) var(--sqrth), rgba(255, 255, 0, 0.2) var(--sqrt)); }
  input#debug:checked ~ .scene label:before {
    content: attr(for);
    font-size: 1rem; }
  input#debug:checked ~ .scene label:hover {
    background-color: rgba(0, 0, 0, 0.1); }

input#debug:not(:checked) ~ .visuallyhidden {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px; }
</style>


<input type="checkbox" id="debug">

<input class="visuallyhidden" type="radio" name="foo" id="front">
<input class="visuallyhidden" type="radio" name="foo" id="left">
<input class="visuallyhidden" type="radio" name="foo" id="back">
<input class="visuallyhidden" type="radio" name="foo" id="right">

<input class="visuallyhidden" type="checkbox" id="up">

<input class="visuallyhidden" type="checkbox" id="lid">

<div class="scene">
  <div class="cube">
  <div class="cube__face -front" data-side="front"><label for="left"></label><label for="right"></label></div>
    <div class="cube__face -back" data-side="back"><label for="right"></label><label for="left"></label></div>
    <div class="cube__face -right" data-side="right"><label for="front"></label><label for="back"></label></div>
    <div class="cube__face -left" data-side="left"><label for="back"></label><label for="front"></label></div>
    <div class="cube__face -top" data-side="top"></div>
    <div class="cube__face -bottom" data-side="bottom"></div>
    
    <div class="cube__face -inside -front"><label for="up"></label></div>
    <div class="cube__face -inside -back"><label for="up"></label></div>
    <div class="cube__face -inside -right"><label for="up"></label></div>
    <div class="cube__face -inside -left"><label for="up"></label></div>
    <div class="cube__face -inside -bottom"><label for="up"></label></div>
    
    <div class="cube__face -top-half"><label for="lid"></label></div>
    <div class="cube__face -top-half"><label for="lid"></label></div>
  </div>
</div>
```
