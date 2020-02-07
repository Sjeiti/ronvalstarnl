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

I am always surprised 
Here is a little trick that few front-end developers know about (but maybe I meet the wrong ones).
There is an easy way to manage the state of a user interface using *only* HTML and CSS.
It is a simple way to make a revealing elements, tabs, hamburger menus or even have more complex states onto an HTML element.

## The basics

The basic is using the CSS pseudo selector `input:checked` in combination with a sibling selector `+` or `~`.

For instance:

```html
<input type="checkbox">
<div>red</div>
```

```css
input:checked + div { 
  color: red;
}
```

You can do this with other siblings as wel or their children. So the input must always preceed the targetted element. But we can get around that by hiding the input and triggering it with a label.


```html
<input type="checkbox" id="you" class="visuallyhidden">
<div>red</div>
<label for="you">green</label>
```

