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

```illustration
    <style>
    html,body{padding:0;margin:0;}

    .layers {
      display: flex;
    }
    
    .layered {
      position: relative;
      width: 16rem;
      height: 16rem;
      background: #EEE;
    }
    .layered:before, .layered:after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      display: block;
      width: 100%;
      height: 100%;
      box-shadow: 0 0 0 1px #333;
    }
    .layered:before {
      transform: scale(0.9) scale(0.7, 0.35) translateY(4rem) rotate(-45deg);
      background-image: linear-gradient(90deg, white, red);
    }
    .layered:after {
      transform: scale(0.9) scale(0.7, 0.35) translateY(-4rem) rotate(-45deg);
      background-image: linear-gradient(0deg, black, transparent);
    }
    
    .layered2 {
      width: 16rem;
      height: 16rem;
      background-image: linear-gradient(0deg, black, transparent), linear-gradient(90deg, white, red);
    }
    </style>
    <div class="layers">
      <div class="layered"></div>
      <div class="layered2"></div>
    </div>
```


## Stacking gradients

The trick is layered CSS gradients. Some CSS properties like `background` and `box-shadow` can have multiple, comma-separates values. It is quite amazing what you can do with a single HTMLElement if you style it smartly.
We could even add the hue gradient into the saturation/lightness but it's easier with event listeners to let each have its own element.

So the gradient looks something like this:

```scss
.panel {
  background:
    linear-gradient(to top, black, rgba(0,0,0,0)
    ,linear-gradient(to left, red, white)
  ;
}
```

And with Javascript we can easily adjust any CSSRule especially if we add them ourselves:

```javascript
document.body.appendChild(document.createElement('style'))
const sheet = document.styleSheets[document.styleSheets.length-1]
sheet.insertRule('.foo { color: red; }', 0)
const rule = sheet.rules[0]
```


## Pseudo before and after

For quite some time now we can have two fake elements per real element controlled by the CSS pseudo selecors `:before` and `:after`. This is as close as we can currently get to shadow DOM.
Mind you these fake elements are *inside* the real element so you can never place them behind the real element because they are children, not siblings.
Since we only need event listeners on the main element the pseudo after is perfect for just reflecting the saturation/lightness position.


## Altogether now

With that we can have a color picker that looks like this

```html
<div class="mcpicker">
  <div></div>
  <div></div>
  <input>
  <input type="number" min="0" max="255">
  <input type="number" min="0" max="255">
  <input type="number" min="0" max="255">
</div>
```

...ehr, I mean this

```illustration
<style type="text/css">.mcpicker {
  position: relative;
  width: 14rem;
  height: 8rem;
  margin-bottom: 0.5rem;
  z-index: 99;
  background-color: #631ACF;
  box-shadow: 0 0 0 1px white, 0 2px 4px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.3);
}
.mcpicker > div:first-child {
  position: relative;
  width: 100%;
  height: calc(100% - 2rem);
  user-select: none;
  background: linear-gradient(to top, black, rgba(0, 0, 0, 0)), linear-gradient(to left, rgb(103, 0, 255), white);
}
.mcpicker > div:first-child:after {
  content: '';
  display: block;
  position: absolute;
  left: 87.69%;
  bottom: 81.27%;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 1rem;
  box-shadow: 0 0 0 1px black inset, 0 0 0 2px white inset;
  transform: translate(-50%, 50%);
  pointer-events: none;
}
.mcpicker > div:first-child + div {
  position: relative;
  height: 1rem;
  user-select: none;
  background: linear-gradient(to right, #F00, #FF0, #0F0, #0FF, #00F, #F0F, #F00);
}
.mcpicker > div:first-child + div:after {
  content: '';
  display: block;
  position: absolute;
  left: 73.41%;
  top: 0;
  width: 3px;
  transform: translateX(-2px);
  height: inherit;
  box-shadow: 0 0 0 1px black inset, 0 0 0 2px white inset;
  pointer-events: none;
}
.mcpicker input {
  width: 40%;
  height: 1rem;
  display: block;
  float: left;
  margin: 0;
  padding: 0.125rem 0.25rem;
  border: 0;
  border-radius: 0;
  box-sizing: border-box;
  outline: none;
  box-shadow: none;
  background-color: transparent;
  font-size: 1rem;
  line-height: 1rem;
  font-family: monospace;
  font-weight: 600;
  text-align: center;
  color: white;
}
.mcpicker input::-webkit-outer-spin-button,
.mcpicker input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.mcpicker input[type=number] {
  -moz-appearance: textfield;
  box-shadow: 1px 0 0 rgba(255, 255, 255, 0.5) inset;
}
.mcpicker input + input,
.mcpicker input + input + input,
.mcpicker input + input + input,
.mcpicker input + input + input + input {
  width: 20%;
}
</style>
<div class="mcpicker">
  <div></div>
  <div></div>
  <input value="#631ACF">
  <input type="number" value="99">
  <input type="number" value="26">
  <input type="number" value="207">
</div>
```

Note that the `box-shadow` on the main element is also stacked, you can make your shadows look a lot more realistic that way.


## Smaller and smaller and smaller

This makes the entire source of HTML/CSS/JS about 23KB (minified).
Which kind of bugged me because my unminified source was about 13KB. I was using a third party library called [color-js](https://github.com/brehaut/color-js) for the actual color calculations. The library works perfectly but it's a bit large, and not only because it contains the entire list of CSS color strings. This is a pity if you only use a tiny portion, and the sources are setup in such a way that tree shaking fails.
Better rewrite that color module. 

## Three dimensions

This requires some understanding of the color models at play. The screen you are watching now uses the additive RGB model. The red, green and blue are actually teeny tiny light bulbs that, together, can display any color depending on the amount of light emitted.
This is straightforward enough but rather difficult when it comes to visual representation in a user interface. If you put each color on it's own axis you get a simple three dimensional cube like this:

```illustration
<style type="text/css">
    html,body{margin:0;padding:0;}
    :root {
      --size: 16rem;
      --sizeh: calc(0.5*var(--size));
      --sceneSize: calc(1.6*var(--size));
      --sizep: calc(0.259*1.11803*var(--size));
      --translate-x: calc(0.3*var(--size));
      --translate-y: calc(0.25*var(--size));
      --translate-z: calc(-0.5*var(--size));
      --rotate-x: 150deg;
      --rotate-y: 3deg;
      --perspective: 1600px;
    }
    
    .scene {
      width: var(--sceneSize);
      height: var(--sceneSize);
      perspective: var(--perspective);
      overflow: hidden;
    }
    
    .cube {
      width: var(--size);
      height: var(--size);
      position: relative;
      transform-style: preserve-3d;
      transform: translateZ(var(--translate-z)) translateX(var(--translate-x)) rotateX(var(--rotate-x)) rotateY(var(--rotate-y));
      transform: translate3d(var(--translate-x),var(--translate-y),var(--translate-z)) rotateX(var(--rotate-x)) rotateY(var(--rotate-y));
    }
    .face {
      position: absolute;
      width: var(--size);
      height: var(--size);
      float: left;
      transform-style: preserve-3d;
      transition: opacity 300ms linear;
    }
    .face:hover { opacity: 0; }
    .face svg {
      width: 100%;
      height: 100%;
    }
    
    .f { transform: rotateY(  0deg) translateZ(var(--sizeh)); }
    .r { transform: rotateY( 90deg) translateZ(var(--sizeh)); }
    .b { transform: rotateY(180deg) translateZ(var(--sizeh)); }
    .l { transform: rotateY(270deg) translateZ(var(--sizeh)); }
    
    .t { transform: rotateX( 90deg) translateZ(var(--sizeh)); }
    .g { transform: rotateX(-90deg) translateZ(var(--sizeh)); }
</style>
<div class="scene">
  <div class="cube">
    <div class="face f"><svg><use xlink:href="#rmyw"></use></svg></div>
    <div class="face r"><svg><use xlink:href="#mbyw"></use></svg></div>
    <div class="face b"><svg><use xlink:href="#bkgc"></use></svg></div>
    <div class="face l"><svg><use xlink:href="#kryg"></use></svg></div>
    
    <div class="face t"><svg><use xlink:href="#kbmr"></use></svg></div>
    <div class="face g"><svg><use xlink:href="#ywcg"></use></svg></div>
  </div>
</div>
<svg aria-hidden="true" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id='ww'>
      <stop offset='0' stop-color='#fff' stop-opacity='0'></stop>
      <stop offset='1' stop-color='#fff' stop-opacity='1'></stop>
    </linearGradient>
    <mask id='m'><rect x='0' y='0' width='1' height='1' fill='url(#ww)'></rect></mask>
    <linearGradient id='mw' gradientTransform='rotate(90)'>
      <stop offset='0' stop-color='magenta'></stop>
      <stop offset='1' stop-color='white'></stop>
    </linearGradient>
    <linearGradient id='yr' gradientTransform='rotate(90)'>
      <stop offset='0' stop-color='yellow'></stop>
      <stop offset='1' stop-color='red'></stop>
    </linearGradient>
    <linearGradient id='bc' gradientTransform='rotate(90)'>
      <stop offset='0' stop-color='blue'></stop>
      <stop offset='1' stop-color='cyan'></stop>
    </linearGradient>
    <linearGradient id='kg' gradientTransform='rotate(90)'>
      <stop offset='0' stop-color='black'></stop>
      <stop offset='1' stop-color='green'></stop>
    </linearGradient>
    <linearGradient id='bm' gradientTransform='rotate(90)'>
      <stop offset='0' stop-color='blue'></stop>
      <stop offset='1' stop-color='magenta'></stop>
    </linearGradient>
    <linearGradient id='rk' gradientTransform='rotate(90)'>
      <stop offset='0' stop-color='red'></stop>
      <stop offset='1' stop-color='black'></stop>
    </linearGradient>
    <linearGradient id='wc' gradientTransform='rotate(90)'>
      <stop offset='0' stop-color='white'></stop>
      <stop offset='1' stop-color='cyan'></stop>
    </linearGradient>
    <linearGradient id='gy' gradientTransform='rotate(90)'>
      <stop offset='0' stop-color='green'></stop>
      <stop offset='1' stop-color='yellow'></stop>
    </linearGradient>
    <symbol id="rmyw" viewBox="0 0 1 1">
      <rect x='0' y='0' width='1' height='1' fill='url(#mw)' mask='url(#m)'></rect>
      <rect x='0' y='0' width='1' height='1' fill='url(#yr)' mask='url(#m)' transform='translate(1,1) rotate(180)'></rect>
    </symbol>
    <symbol id="mbyw" viewBox="0 0 1 1">
      <rect x='0' y='0' width='1' height='1' fill='url(#mw)' mask='url(#m)' transform='scale(1,-1) translate(1,0) rotate(180)'></rect>
      <rect x='0' y='0' width='1' height='1' fill='url(#bc)' mask='url(#m)'></rect>
    </symbol>
    <symbol id="bkgc" viewBox="0 0 1 1">
      <rect x='0' y='0' width='1' height='1' fill='url(#bc)' mask='url(#m)' transform='scale(1,-1) translate(1,0) rotate(180)'></rect>
      <rect x='0' y='0' width='1' height='1' fill='url(#kg)' mask='url(#m)'></rect>
    </symbol>
    <symbol id="kryg" viewBox="0 0 1 1">
      <rect x='0' y='0' width='1' height='1' fill='url(#kg)' mask='url(#m)' transform='scale(1,-1) translate(1,0) rotate(180)'></rect>
      <rect x='0' y='0' width='1' height='1' fill='url(#yr)' mask='url(#m)' transform='scale(1,-1) translate(0,-1)'></rect>
    </symbol>
    <symbol id="kbmr" viewBox="0 0 1 1">
      <rect x='0' y='0' width='1' height='1' fill='url(#bm)' mask='url(#m)'></rect>
      <rect x='0' y='0' width='1' height='1' fill='url(#rk)' mask='url(#m)' transform='translate(1,1) rotate(180)'></rect>
    </symbol>
    <symbol id="ywcg" viewBox="0 0 1 1">
      <rect x='0' y='0' width='1' height='1' fill='url(#wc)' mask='url(#m)'></rect>
      <rect x='0' y='0' width='1' height='1' fill='url(#gy)' mask='url(#m)' transform='translate(1,1) rotate(180)'></rect>
    </symbol>
  </defs>
</svg>
<script>
    const {documentElement:{style}} = document
    function run(){
      style.setProperty('--rotate-y', `${(0.02*Date.now())%360}deg`)
        requestAnimationFrame(run)
    }
    run()
</script>
```

It looks nice becomes difficult if you need a color from somewhere inside.
Which is why some people, a long long time ago devised a cunning plan to display this differently.

Instead of a red green and blue scale, we use color, intensity and lightness. Now lightness is easy, it's the diagonal line from black to white in the cube. The color scale (or hue) is a bit more tricky: apart from rgb you also see the subtractive colors cyan, magenta and yellow (cmy). So the hue range is cbmryg, zigzagging along the cube. We can slant the cube so that black is on the bottom and white at the top, and pull all the hue colors into the same plane in between. Now the hue range has become a radial one and the intensity (or saturation or chroma) the distance of the radius to the vertical center.

```illustration
<style type="text/css">
html,body{margin:0;padding:0;}
:root {
  --size: 16rem;
  --sizeh: calc(0.5*var(--size));
  --sceneSize: calc(1.6*var(--size));
  --sizep: calc(0.259*1.11803*var(--size));
  --translate-x: calc(0.3*var(--size));
  --translate-y: calc(-0.13*var(--size));
  --translate-z: calc(-1*var(--size));
  --rotate-x: -22deg;
  --rotate-y: 33deg;
  --perspective: 1600px;
}
.scene {
  width: var(--sceneSize);
  height: var(--sceneSize);
  perspective: var(--perspective);
  box-shadow: 0 0 0 1px gray inset;
  overflow: hidden;
}
.tetahedra {
  width: var(--size);
  height: var(--size);
  position: relative;
  transform-style: preserve-3d;
  transform: translateZ(var(--translate-z)) translateX(var(--translate-x)) rotateX(var(--rotate-x)) rotateY(var(--rotate-y));
  transform: translate3d(var(--translate-x),var(--translate-y),var(--translate-z)) rotateX(var(--rotate-x)) rotateY(var(--rotate-y));
}
.face {
  position: absolute;
  width: var(--size);
  height: var(--size);
  float: left;
  clip-path: polygon(100% 100%, 100% 0%, 0% 100%);
  transform-origin: bottom center;
  transform-style: preserve-3d;
}
  
.wbg { background-image: linear-gradient(90deg, blue, transparent), linear-gradient(0deg, green, white); }
.wgr { background-image: linear-gradient(90deg, green, transparent), linear-gradient(0deg, red, white); }
.wrb { background-image: linear-gradient(90deg, red, transparent), linear-gradient(0deg, blue, white); }
.kbg { background-image: linear-gradient(90deg, blue, transparent), linear-gradient(0deg, green, black); }
.kgr { background-image: linear-gradient(90deg, green, transparent), linear-gradient(0deg, red, black); }
.krb { background-image: linear-gradient(90deg, red, transparent), linear-gradient(0deg, blue, black); }

.wbg { transform: rotateY(  0deg) translateZ(var(--sizep)) rotateX(19deg) scaleY(0.894427) skewX(26.5deg); }
.wgr { transform: rotateY(120deg) translateZ(var(--sizep)) rotateX(19deg) scaleY(0.894427) skewX(26.5deg); }
.wrb { transform: rotateY(240deg) translateZ(var(--sizep)) rotateX(19deg) scaleY(0.894427) skewX(26.5deg); }

.kbg { transform: rotateY(  0deg) translateZ(var(--sizep)) rotateX(161deg) scaleY(0.894427) skewX(26.5deg); }
.kgr { transform: rotateY(120deg) translateZ(var(--sizep)) rotateX(161deg) scaleY(0.894427) skewX(26.5deg); }
.krb { transform: rotateY(240deg) translateZ(var(--sizep)) rotateX(161deg) scaleY(0.894427) skewX(26.5deg); }
</style>
<div class="scene">
  <div class="tetahedra">
    <div class="face wbg"></div>
    <div class="face wgr"></div>
    <div class="face wrb"></div>
    <div class="face kbg"></div>
    <div class="face kgr"></div>
    <div class="face krb"></div>
  </div>
</div>
<script>
const {documentElement:{style}} = document
function run(){
  style.setProperty('--rotate-y', `${(0.02*Date.now())%360}deg`)
	requestAnimationFrame(run)
}
run()
</script>
```

By rewriting the color functions I shaved it down to 17KB minified. 

<!--
https://stackoverflow.com/questions/18452885/building-a-4-corners-colors-css3-gradient
https://www.shadertoy.com/view/wtlSzN
https://www.shadertoy.com/view/4lByzD
https://www.shadertoy.com/view/4tXGDf
https://www.shadertoy.com/user/paniq/sort=popular&from=72&num=8
https://en.wikipedia.org/wiki/HSL_and_HSV#/media/File:Hsl-and-hsv.svg
-->