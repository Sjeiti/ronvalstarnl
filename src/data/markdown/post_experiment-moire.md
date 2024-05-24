<!--
  date: 2022-08-06
  modified: 2022-08-06
  slug: experiment-moire
  type: post
  categories: code, JavaScript
  tags: JavaScript, cool shit, gradient
  description: A single background with repeating gradients exhibit moire interference patterns and glitches.
  thumbnail: experiments/ocalhost_7047_experiment-moire__22clr_22_22_ff0044_22_22bclr_22_22_000000_22_22type_22_22bulge_22_22part_22_220.437_22_22total_22_220.884_22.png
  related: experiment-*
-->

# Moire and glitches

Sometimes you assume the wrong thing your entire life. I always thought Moiré was some old french dude who studied interference patterns. It is in fact the name of a type of silk weave that exhibits these patterns. 

When I first learned the word at school it was in the context of CMYK printing where colors where printed under precise angles to prevent moire patterns.

```html
<!--example-->
<div class="cmyk">
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</div>
<style>
body { margin: 0; }
.cmyk {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.cmyk div {
  --color: #f0f;
  --point: 50%;
  --size: 2rem;
  --sizeh: calc(0.5*var(--size));
  --dim: max(100vw, 100vh);
  --deg: 0;
  border: 1px solid red;
  position: absolute;
  left: 50%;
  top: 50%;
  width: var(--dim);
  height: var(--dim);
  background: radial-gradient(circle at 50%, var(--color) 0 var(--point), transparent var(--point) 100%);
  background-size: var(--size) var(--size);
  background-position: 25% 75%;
  transform: translate(-50%, -50%) rotate(var(--deg));
  mix-blend-mode: multiply;
}
.cmyk div:nth-child(1){
  --color: #0ff;
  --deg: 0;
  background-position: 0 0;
}
.cmyk div:nth-child(2){
  --color: #f0f;
  --deg: 15deg;
  background-position: var(--sizeh) 0;
}
.cmyk div:nth-child(3){
  --color: #ff0;
  --deg: 30deg;
  background-position: 0 var(--sizeh);
}
.cmyk div:nth-child(4){
  --color: #000;
  --point: 30%;
  --deg: 45deg;
  background-position: var(--sizeh) var(--sizeh);
}
</style>
```

We don't print as much as we used to but interference patterns are never far away. These are some nice CSS backgrounds showing off moire.

```html
<!--example-->
<style>
  html {
  }
  body { 
    --part: 0.4;
    --total: 0.15;
    --t: 7991111;
    --x: 1;
    --y: 1;
    --clr: #f04;
    --bclr: #fff;
    --radial-total: calc(20%*var(--total));
    --radial-part: calc(var(--part)*var(--radial-total));
    margin: 0; 
    height: 100%;
    background: repeating-radial-gradient(
      circle at calc(50%*var(--x) + 25%) calc(50%*var(--y) + 25%),
      var(--clr) 0% var(--radial-part),
      transparent var(--radial-part) var(--radial-total)
    ), repeating-linear-gradient(
      calc(30deg + var(--t)*-0.01deg),
      var(--clr) 0% var(--radial-part),
      var(--bclr) var(--radial-part) var(--radial-total)
    );
  }
</style>
<div></div>
<script>
function step(t){
  document.body.style.setProperty(`--t`, Date.now()-t)
  requestAnimationFrame(()=>step(t))
}
step(Date.now())
</script>
```

```html
<!--example-->
<style>
  html {
  }
  body { 
    --part: 0.4;
    --total: 0.15;
    --t: 7991111;
    --x: 1;
    --y: 1;
    --clr: #f04;
    --bclr: #fff;
    --radial-total: calc(20%*var(--total));
    --radial-part: calc(var(--part)*var(--radial-total));
    margin: 0; 
    height: 100%;
    --tt: calc(var(--t)*0.0001deg);
    --radial-total: calc(20%*var(--total));
    --radial-part: calc(var(--part)*var(--radial-total));
    background: repeating-radial-gradient(
      circle at calc(45% + 15%*var(--x)) calc(100%*var(--y)),
      var(--clr) 0 var(--radial-part),
      transparent var(--radial-part) var(--radial-total)
    ),repeating-radial-gradient(
      circle at 50% 50%,
      var(--clr) 0 var(--radial-part),
      var(--bclr) var(--radial-part) var(--radial-total)
    );
  }
</style>
<div></div>
<script>
const t = Date.now()
const {style} = document.body
const setProperty = style.setProperty.bind(style)
function step(){
  const tt = Date.now()-t
  setProperty(`--t`, tt)
  setProperty('--x', Math.sin(1E-3*tt))
  setProperty('--y', Math.cos(1E-3*tt))
  requestAnimationFrame(step)
}
step()
</script>
```

```html
<!--example-->
<style>
  html {
  }
  body { 
    --part: 0.4;
    --total: 0.15;
    --t: 7991111;
    --x: 1;
    --y: 1;
    --clr: #f04;
    --clr: #000;
    --bclr: #fff;
    --tt: calc(var(--t)*0.0001deg);
    --radial-total: calc(6%*var(--total));
    --radial-part: calc(var(--part)*var(--radial-total));
    --end: calc(var(--total)*20deg);
    --start: calc(var(--part)*var(--end));
    margin: 0; 
    height: 100%;
    background: repeating-conic-gradient(
      from calc(0.01deg*var(--t)) at calc(50% + 20%*var(--x)) calc(45% + 40%*var(--y)),
      var(--clr) 0deg var(--start),
      transparent var(--start) var(--end)
    ),repeating-linear-gradient(
      calc(var(--t)*-0.01deg),
      var(--clr) 0% var(--radial-part),
      var(--bclr) var(--radial-part) var(--radial-total)
    );
  }
  div {
    width: 100%;
    height: 100%;
    background: linear-gradient(33deg, #f09, #0ff);
    mix-blend-mode: lighten;
  }
</style>
<div></div>
<script>
const t = Date.now()
const {style} = document.body
const setProperty = style.setProperty.bind(style)
function step(){
  const tt = Date.now()-t
  setProperty(`--t`, tt)
  setProperty('--x', Math.sin(1E-3*tt))
  setProperty('--y', Math.cos(1E-3*tt))
  requestAnimationFrame(step)
}
step()
</script>
```

With CSS gradients there are three types we can use and combine to generate lines.
There is `repeating-linear-gradient` for straight perpendicular lines. `repeating-radial-gradient` to create circles and ovals. And `repeating-conic-gradient` to create lines that radiate from a center.

The gradients are defined in such a way that we get hard lines, ie: `#FF0 0% 1%, transparent 1% 2%`.

<script>
function showInterference(){
  alert('poepjes')
  const range = document.querySelector('.moire input[type=range]:last-child')
  range.value = 0.5

}
</script>

On smaller scales the patterns go a bit [beyond mere line interference](javascript:showInterference()). At a certain point it goes into the realm of pixels, antialising and floating point rounding.
Which is where it becomes more glitch-art than moire.

```html
<!--example-->
<style>
  html {
  }
  body { 
    --part: 0.5;
    --total: 0.01;
    --t: 7991111;
    --x: 1;
    --y: 1;
    --clr: #f04;
    --clr: #fd0;
    --bclr: #000;
    --tt: calc(var(--t)*0.0001deg);
    --radial-total: calc(6%*var(--total));
    --radial-part: calc(var(--part)*var(--radial-total));
    --end: calc(var(--total)*20deg);
    --start: calc(var(--part)*var(--end));
    margin: 0; 
    height: 100%;
    --end: calc(var(--total)*36deg);
    --start: calc(var(--part)*var(--end));
    background: repeating-conic-gradient(
      from calc(0.0001deg*var(--t)) at 50% 50%,
      var(--clr) 0deg var(--start),
      var(--bclr) var(--start) var(--end)
    );
  }
</style>
<div></div>
<script>
const t = Date.now()
const {style} = document.body
const setProperty = style.setProperty.bind(style)
function step(){
  const tt = Date.now()-t
  setProperty(`--t`, tt)
  setProperty('--x', Math.sin(1E-3*tt))
  setProperty('--y', Math.cos(1E-3*tt))
  requestAnimationFrame(step)
}
step()
</script>
```

```html
<!--example-->
<style>
  html {
  }
  body { 
    --part: 0.09;
    --total: 0.01;
    --t: 7991111;
    --x: 1;
    --y: 1;
    --clr: #f04;
    --clr: #fd0;
    --bclr: #000;
    --tt: calc(var(--t)*0.0001deg);
    --radial-total: calc(6%*var(--total));
    --radial-part: calc(var(--part)*var(--radial-total));
    --end: calc(var(--total)*20deg);
    --start: calc(var(--part)*var(--end));
    margin: 0; 
    height: 100%;
    --tt: calc(var(--t)*0.0001deg);
    --radial-total: calc(50%*var(--total));
    --radial-part: calc(var(--part)*var(--radial-total));
    background: repeating-radial-gradient(
      circle at calc(50% + 0.1%*var(--x)) calc(50% + 0.1%*var(--y)),
      var(--clr) 0 var(--radial-part),
      var(--bclr) var(--radial-part) var(--radial-total)
    );
  }
</style>
<div></div>
<script>
const t = Date.now()
const {style} = document.body
const setProperty = style.setProperty.bind(style)
function step(){
  const tt = Date.now()-t
  setProperty(`--t`, tt)
  setProperty('--x', Math.sin(1E-3*tt))
  setProperty('--y', Math.cos(1E-3*tt))
  setProperty('--total', 0.02 + 0.01* Math.cos(1E-4*tt))
  requestAnimationFrame(step)
}
step()
</script>
```

```html
<!--example-->
<style>
  html {
  }
  body { 
    --part: 0.017;
    --total: 0.075;
    --t: 7991111;
    --x: 1;
    --y: 1;
    --clr: #f04;
    --clr: #fd0;
    --bclr: #000;
    --tt: calc(var(--t)*0.0001deg);
    --radial-total: calc(6%*var(--total));
    --radial-part: calc(var(--part)*var(--radial-total));
    --end: calc(var(--total)*20deg);
    --start: calc(var(--part)*var(--end));
    margin: 0; 
    height: 100%;
    --end: calc(var(--total)*36deg);
    --start: calc(var(--part)*var(--end));
    background: repeating-conic-gradient(
      from calc(0.0001deg*var(--t)) at 50% 50%,
      var(--clr) 0deg var(--start),
      var(--bclr) var(--start) var(--end)
    );
  }
</style>
<div></div>
<script>
const t = Date.now()
const {style} = document.body
const setProperty = style.setProperty.bind(style)
function step(){
  const tt = Date.now()-t
  setProperty(`--t`, tt)
  setProperty('--x', Math.sin(1E-3*tt))
  setProperty('--y', Math.cos(1E-3*tt))
  requestAnimationFrame(step)
}
step()
</script>
```

One small pity is that in the world of browsers we really have only two: [Gecko](https://developer.mozilla.org/en-US/docs/Glossary/Gecko) and [Blink](https://www.chromium.org/blink/). Gecko is the render engine used in Firefox, and sadly Blink is the one used in everything else.
In terms of rendering CSS gradients Gecko does a much better job and shows much more interesting artifacts at low scales. It even displays self-replication in some cases. Whereas Blink just floodfills the element at some point.

So here is a screenshot for all you unbelievers. This is a conical gradient with about onehundred repeats.

![moire fractal](https://res.cloudinary.com/dn1rmdjs5/image/upload/v1659644344/rv/Screenshot_20220804-202142_3.png)

As always: here's some source:

<pre><code data-language="javascript" data-src="/static/experiment/moire.js"></code></pre>
