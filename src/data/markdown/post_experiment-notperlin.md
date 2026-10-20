---
date: 2026-10-20
modified: 2026-10-20
slug: experiment-notperlin
type: post
categories: [code]
tags: [cool shit]
thumbnail: experiments/notperlin
description: Noise with CSS backgrounds
related: [experiment-*]
---

# Experiment: Not Perlin

İ wanted some noise. Not Perlin noise, but unprocessed noise, to give [these villages](/experiment-villages) some foliage and grass.

There is a way to generate [Perlin noise with SVG](#). But that is overkill for what İ really need. So what İ ended up doing is create a simple method that turns a randomised canvas element into a data-url so it can easily be used as a CSS background.


## CSS interpolates

Playing around with this İ noticed that upscaled backgrounds are interpolated.

The image on the left (scaled defaul) is the same image as the one on the right, but interpolated (the right has CSS `image-rendering: pixelated;`).


<div style="display:flex;gap:4rem;">
<div class="notperlin__noise">
<style>
.notperlin__noise{
  --s: 8rem;
  width: var(--s);
  height: var(--s);
  margin-bottom: 1rem;
  background: var(--noise);
  background-size: var(--s);
}
</style>
</div>

<div class="notperlin__noise-pixelated">
<style>
.notperlin__noise-pixelated{
  --s: 8rem;
  width: var(--s);
  height: var(--s);
  margin-bottom: 1rem;
  background: var(--noise);
  background-size: var(--s);
  image-rendering: pixelated;
}
</style>
</div>
</div>

<!--
You can clearly see the bilinear interpolation when we add a linear gradientwith a difference and a contrast:

<div class="notperlin__noise-int">
<style>
.notperlin__noise-int{
  --s: 8rem;
  position: relative;
  width: var(--s);
  height: var(--s);
  margin-bottom: 1rem;
  background: var(--noise);
  background-size: var(--s);
  filter: contrast(100000%);
  &:before{
    content: '';
    display: block;
    width: var(--s);
    height: var(--s);
    background: repeating-linear-gradient(in hsl to bottom,#0008,#fff8 calc(var(--s)/4));
    -mix-blend-mode: difference;
    -mix-blend-mode: color-dodge;
    -mix-blend-mode: exclusion;
    -mix-blend-mode: multiply;
    -mix-blend-mode: screen;
  }
}
</style>
</div>
-->

Real Perlin (and Simplex) noise use a smoothstep variant for interpolation. Browsers use bilinear interpolation for images. The -bi- is both horizontal and vertical. This looks fine but does have clear artifacts (crosses).

İn terms of random noise, here is what linear interpolation looks like for the first row of pixels in that image. (<button data-rerender>click here</button> to rerender)

<div class="notperlin__linear">
<svg viewbox="0,0,768,256">
  <style>
    .notperlin__linear svg {
      width: 100%;
      overflow: visible;
      stroke: var(--color-text);
      stroke-width: 3px;
      fill: transparent;
    }
    .notperlin__linear path {
      d: var(--d);
    }
  </style>
  <path />
</svg>
</div>

And here it is in (a) smoothstep.

<div class="notperlin__smoothstep">
<svg viewbox="0,0,768,256">
  <style>
    .notperlin__smoothstep svg {
      width: 100%;
      overflow: visible;
      stroke: var(--color-text);
      stroke-width: 3px;
      fill: transparent;
    }
    .notperlin__smoothstep path {
      d: var(--ds);
    }
  </style>
  <path />
</svg>
</div>

You can see that smoothstepping random numbers turns out quite nice. <button data-rerender="0,85,170,256">Sequential numbers</button> are a bit weird though, but it's less off an 'artifact' than plain linear.

> Small sidenote here: Perlin noise is really just the single octave noise interpolation. Stacking noises is really called fractal noise, or fractal Brownian motion. But Perlin noise is often used to denominate everything, even Simplex noise, because it is easier to generalise.


## Linear works fine

But even with those linear artifacts we can still create something that resembles Perlin/noise by stacking and multiplying different images.

Early implementations speak off 'octaves' and 'falloff'. Octaves are the number of images, where each next image is doubled in size. Falloff is the weight of each image or octave; we can add either more of the upscaled image for a smoother look, or more of the original size for more grain.

<div class="notperlin__fractal">
<style>
.notperlin__fractal{
  --size: 8rem;
  --step: 2rem;
  position: relative;
  width: var(--size);
  height: calc(2.2*var(--size));
  div{
    position: absolute;
    top: calc(5*var(--step) - var(--index)*var(--step));
    width: var(--size);
    height: var(--size);
    background: var(--noise-l);
    background-size: calc(200% * pow(2,var(--index)));
    background-position: calc(127300% * var(--index)) calc(87531% * var(--index));
    transform: rotate(-50deg) skew(20deg,25deg);
    transform-origin: 0 0;
    ox-shadow: 0 0 0 1px var(--color-main) inset;
    transition: all 300ms ease;
  }
  &:has(input:checked){
    width: calc(2*var(--size));
    height: calc(2*var(--size));
    background: var(--color-main);
    background: #fff;
  }
  labe:has(input:checked)~div{
    transform: initial;
    top: 0;
    width: calc(2*var(--size));
    height: calc(2*var(--size));
    mix-blend-mode: multiply;
    opacity: calc(0.25*var(--index));
  }
  label {
    position: relative;
    z-index: 1;
    &:has(input[type=checkbox]){
      &:has(input:checked)~div{
        transform: initial;
        top: 0;
        width: calc(2*var(--size));
        height: calc(2*var(--size));
        mix-blend-mode: multiply;
        opacity: calc(0.25*var(--index));
      }
    }
    /*&:has(input[type=range]){border:1px solid red;}*/
  }
}
</style>
<label>stack <input type="checkbox" id="stacktoggle" /></label>
<!--<label><input type="range" /></label>-->
<div style="--index:0;"></div>
<div style="--index:1;"></div>
<div style="--index:2;"></div>
<div style="--index:3;"></div>
</div>

<script>
const multiplier = 1664525
const increment = 1013904223
const modulus = 4294967296
//let seed = 217197374//(Math.random()*multiplier)<<0
let seed = (Math.random()*multiplier)<<0
const firstRow = []

Array.from(document.querySelectorAll('[data-rerender]'))
  .forEach(elm=>{
    const firsts = elm.dataset.rerender.split(',').filter(s=>s!=='').map(parseFloat)
    elm.addEventListener('click',()=>reset(...firsts))
  })

document.documentElement.addEventListener('change',e=>{
  if(e.target.matches('input[type=range]')){
    console.log(e.target.value)
  }
})

function random(_seed){
  return seed = ( (_seed||seed) * multiplier + increment ) % modulus
}
function rand(_seed){
  return random(_seed)/modulus
}
function makeNoiseDataURL(size = 128, fn, seed) {
  if (size===4) firstRow.length = 0
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const imgData = ctx.createImageData(size, size)
  const data = imgData.data

  for (let i = 0; i < data.length; i += 4) {
    const rndNum = (fn?fn(rand()):rand()) * 255
    size===4
      &&firstRow.length<size
      &&firstRow.push(rndNum)
    data[i] =
      data[i + 1] =
      data[i + 2] = rndNum
    data[i + 3] = 255
  }
  ctx.putImageData(imgData, 0, 0)
  return canvas.toDataURL('image/png')
}

function reset(_p1,_p2,_p3,_p4){
  const {style} = document.body
  style.setProperty('--noise', `url(${makeNoiseDataURL(4)})`)
  style.setProperty('--noise-l', `url(${makeNoiseDataURL(128)})`)
  const [p1,p2,p3,p4] = isNaN(_p1+_p2+_p3+_p4)
     ?firstRow.map(f=>`${256-f<<0}`)
     :[_p1,_p2,_p3,_p4]
  
  style.setProperty('--d', `path("m 0,${p1} L 256,${p2} L 512,${p3} L 768,${p4} ")`)
  
  style.setProperty('--ds', `path("m 0,${p1} C 128,${p1} 128,${p2} 256,${p2} C 384,${p2} 384,${p3} 512,${p3} C 640,${p3} 640,${p4} 768,${p4} ")`)

  console.log(`path("m 0,${p1} C 128,${p1} 128,${p2} 256,${p2} L 512,${p3} L 768,${p4} ")`)

}

function whenTrue(condition,callback){
  condition()
    ?callback()
    :requestAnimationFrame(()=>whenTrue(condition,callback))
}

whenTrue(
  ()=>!!document.body,
  reset
)

</script>

<button data-rerender>click here</button> to rerender, or click the <label for="stacktoggle">checkbox</label> to stack/unstack.


## It moves

Those are the basics. For the experiment example in the header I also animated the noise by simply moving layers. <button data-request-fullscreen>click to fullscreen</button>
That code is below and should just work when you save it to HTML.

<pre><code data-language="javascript" data-src="/static/html/notperlin.html"></code></pre>

