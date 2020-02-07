<!--
  slug: codung-without-javascript
  date: 2020-04-30
  modified: 2020-04-30
  type: post
  header: jason-leung-EXYQt40B3KA-unsplash.jpg
  headerColofon: Jason Leung
  category: JavaScript
  tag: code quality, string
-->

# Programming without Javascript

I am always surprised how few front-end developers are aware of this little trick (but maybe I meet the wrong ones).
There is an easy way to manage the state of a user interface using *only* HTML and CSS.
It is a simple way to make a revealing elements, tabs, hamburger menus or even have more complex states onto an HTML element.

## The basics

To get started you use the CSS pseudo selector `input:checked` in combination with a sibling selector `+` or `~`.

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

```example
<style>
    html { font-size: 2rem; font-family: Arial, sans; }
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

```example
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

At this point there are already numerous UX patterns you can apply this to.

### An expander

An element that reveals more content when clicked.

```example
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


```example
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

This is really just an expander but just for examples sake: here is a nested one. And a bit of UX advice on hamburgers: try not to use them especially if you only have three menu items.

Here is also a small issue that is hard to resolve without resorting to Javascript. The submenus in this example use `input[type=radio]` and unlike `type=checkbox` radios cannot be disabled when clicking the selected one. Resolving this issue requires adding an extra unrelated input which will be checked by Javascript when a checked radio is clicked.

```example
<style>
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
        background-image: repeating-linear-gradient(blue,blue 20%,transparent 20%,transparent 40%,blue 40%,blue 60%,transparent 60%,transparent 80%,blue 80%);
        cursor: pointer;
        transition: transform 200ms ease;
    }
    .menu {
        position: fixed;
        right: 0;
        top: 0;
        height: 100vh;
        padding: 0 0.5rem;
        background-color: #BBB;
        transform: translateX(100%);
        transition: transform 200ms ease;
    }
    
    input#hamburger:checked ~ [for=hamburger] {
        transform: rotate(90deg);
        transform-origin: 50%;
    }
    input#hamburger:checked ~ .menu {
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
        <div><a href="#">menu item 5</a></div>
    </menu>
    <input class="visuallyhidden submenu" name="menu" type="radio" id="menu2" />
    <label for="menu2">menu 2</label>
    <menu>
        <div><a href="#">menu item 4</a></div>
        <div><a href="#">menu item 5</a></div>
        <div><a href="#">menu item 6</a></div>
    </menu>
</div>
```

### A carousel

Note that this example is merely to illustrate the technique. There are better ways of showing content than [using a carousel](http://shouldiuseacarousel.com/).

TODO TODO TODO TODO TODO TODO TODO TODO 