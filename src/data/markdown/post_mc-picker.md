<!--
  id: 20
  date: 2222-01-07T12:43:20
  modified: 2222-01-07T12:43:20
  slug: mc-picker
  type: post
  excerpt: <p>Normally you would use Perlin Noise for surfaces, textures, movements or any other form that is continious and irregular. But what if you want points that are spread irregularly, a forest for instance or a starfield. This can be done with Perlin noise as well. You take a grid, place it over the noise field. [&hellip;]</p>
  categories: uncategorized
  tags: 
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# MC Picker

I have a React project that needed [a color picker](https://sjeiti.github.com/clr). Actually I already use `input[type=color]` but the native implementations really suck (both on Windows and OSX). So I set out to find a minimal implementation. After about fifteen minutes I gave up. Most were setup too complex and I am pedantic when it comes to front-end code.

## One element

That coloured panel for saturation and lightness that you see used everywhere (combined with one for hue) can be done with a single element (including circle selector). And the same goes for the hue panel.

<div style="
  height: 4rem;
  background:
    linear-gradient(to top, black, rgba(0,0,0,0)),
    linear-gradient(to left, red, white)
  ;
"></div>
<div style="
  height: 1rem;
  background: linear-gradient(to right, #F00, #FF0, #0F0, #0FF, #00F, #F0F, #F00);
"></div>


## Stacking gradients

The trick is layered CSS gradients. Some CSS properties like `background` and `box-shadow` can have multiple, comma-separates values. It is quite amazing what you can do with a single HTMLElement if you style it smartly.
We could even add the hue gradient into the saturation/lightness but it's easier with event listeners to let each have its own element.

So the gradient looks something like this:

```
.panel {
  background:
    linear-gradient(to top, black, rgba(0,0,0,0)
    ,linear-gradient(to left, red, white)
  ;
}
```

And with Javascript we can easily adjust any CSSRule especially if we add them ourselves:

```
document.body.appendChild(document.createElement('style'))
const sheet = document.styleSheets[document.styleSheets.length-1])
sheet.insertRule('.foo { color: red; }', 0)
const rule = sheet.rules[0]
```

## Pseudo before and after

Since XXXX we can have two fake elements per real element controlled by the CSS pseudo selecors `:before` and `:after`. This is as close as we can currently get to shadow DOM.
Mind you these fake elements are *inside* the real element so you can never place them behind the real element because they are children, not siblings.
Since we only need event listeners on the main element the pseudo after is perfect for just reflecting the saturation/lightness position.

## Altogether now


