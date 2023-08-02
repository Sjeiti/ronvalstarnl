<!--
  date: 2023-03-14
  modified: 2023-08-02
  slug: scrollbar-thickness
  type: post
  header: photo-1580501170888-80668882ca0c.jpg
  headerColofon: image by [Taylor Flowe](https://unsplash.com/@taypaigey)
  headerClassName: no-blur
  category: code
  tag: DOM, CSS, JavaScript
  description: A simple solution to determining the scrollbar thickness for the current browser or device.
-->


# Scrollbar thickness

Every so often the thickness of the scrollbar is needed.
This might differ per browser or device, so knowing the thickness in CSS is very useful.

There is no browser property to request, but it can be easily inferred by some measuring with JavaScript. The code is so simple I wouldn't bother creating an NPM package and mostly just code it on the go.

In plain old JavaScript:

```JavaScript
const {body, documentElement: {style}} = document
const size = 64
const div = document.createElement('div')
Object.assign(div.style, {
  width: size+'px'
  , height: size+'px'
  , overflow: 'auto'
})
div.textContent = 'a '.repeat(1E2)
body.appendChild(div)
const scrollBarThickness = size - div.scrollWidth
style.setProperty('--scrollbar-thickness', scrollBarThickness+'px')
body.removeChild(div)
```

You could save it as a state, but mostly you'll only need this in CSS, so a CSS property would suffice.
Just make sure to set a proper default.

```CSS
:root { --scrollbar-thickness: 0; }
```

Zero is the default for mobile. If most of your users are on desktop you'll need something like `17px`.

Here's also a [fiddle](https://jsfiddle.net/Sjeiti/ygsoa3mt) if you want to see it in action.
