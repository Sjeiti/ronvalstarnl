---
date: 2026-07-12
modified: 2026-07-12
slug: experiment-condens
type: post
categories: [code]
tags: [cool shit]
thumbnail: experiments/condens
description: Condens on a window pane in pure CSS
related: [experiment-*]
---

# Experiment: Condens

This started out as plain water droplets. With rotation and corner-radius you can [make elements look fairly natural](/experiment-eggs).

<div role="img" aria-label="A blob shape by rotation and border-radius" class="illustration condens-blob">
<style>
.condens-blob{
    position: relative;
    width: calc(100% - 2rem);
    padding-bottom: 30%;
    overflow: hidden;
    div{
        position: absolute;
        left: 50%;
        top: 50%;
        width: 20vw;
        height: 16vw;
        box-shadow: 0 0 0 1px var(--color-text);
        transform: translate(-50%,-50%) rotate(25deg);
        &:before,&:after{
            content: '';
            display: block;
            width: 100%;
            height: 100%;
        }
        &:before{
            border-radius: 30% 60% 50% 80%;
            box-shadow: 0 0 0 1px var(--color-main);
        }
    }
}
</style>
<div></div>
</div>

If you've ever had a good look at water droplets on a window pane you must have noticed they all reflect the outside world inverted.
A normal CSS background cannot be rotated, but [a CSS gradient can be](/experiment-pinkcheese)! So that was the starting point.

The following linear gradient is rotated by degrees: `linear-gradient(25deg,[color1],[color2])`, the radial gradient is rotated by converting the degrees to position using sine and cosine.

```css
// --deg is the rotation of the drop, --degSun the rotation of the sun
--rad: calc((var(--deg) + var(--degSun)) * var(--pi) / 180);
--distance: 50%;
--x: calc(var(--distance) * cos(var(--rad)));
--y: calc(var(--distance) * sin(var(--rad)));
```

A similar calculation is needed for the `drop-shadow` on the drop. It is not meant as a shadow but more as some extra light breaking that makes everything look a tad more realistic.

```html
<!--example-->
<div role="img" aria-label="A blob shape with a rotated background and drop-shadow" class="illustration condens-drp">
<style>
html,body{margin:0;padding:0;}
.condens-drp{

    --pi: 3.14159;
    --color-ground: hsl(206 17% 10%); 
    --color-sky: hsl(180 23% 56%); 
    --color-sun: hsl(2 36% 90%); 
    --degSun: 15;
    --t: 0;

    --deg: 180;

    --rad: calc((var(--deg) + var(--degSun)) * var(--pi) / 180);
    --p1-rad: calc(var(--rad) + 0.00005*var(--t) + 0*var(--pi));
    --p1-d: 50%;
    --p1-x: calc(50% + var(--p1-d) * cos(var(--p1-rad)));
    --p1-y: calc(50% + var(--p1-d) * sin(var(--p1-rad)));
    --bg:
      linear-gradient(calc(var(--deg)*1deg),transparent 40%,var(--color-ground) 80%),
      radial-gradient(circle at var(--p1-x) var(--p1-y), #fffb 0 15%, var(--color-sun) 20%, transparent 30%),
      var(--color-sky)
    ;

    position: relative;
    width: calc(100% - 2rem);
    width: 100%;
    padding-bottom: 30%;
    overflow: hidden;
    background: var(--bg);
    div{
        --deg: -25;
        --rad: calc((var(--deg) + var(--degSun)) * var(--pi) / 180);
        --p1-rad: calc(var(--rad) + 0.00005*var(--t) + 0*var(--pi));
        --p1-d: 50%;
        --p1-x: calc(50% + var(--p1-d) * cos(var(--p1-rad)));
        --p1-y: calc(50% + var(--p1-d) * sin(var(--p1-rad)));
        --bg:
          linear-gradient(calc(var(--deg)*1deg),transparent 40%,var(--color-ground) 80%),
          radial-gradient(circle at var(--p1-x) var(--p1-y), #fffb 0 15%, var(--color-sun) 20%, transparent 30%),
          var(--color-sky)
        ;

        --ps-rad: calc(var(--rad) + 0.5*var(--pi));
        --ps-d: 4px;
        --ps-x: calc(var(--ps-d) * cos(var(--ps-rad)));
        --ps-y: calc(var(--ps-d) * sin(var(--ps-rad)));

        position: absolute;
        left: 50%;
        top: 40%;
        width: 20vw;
        height: 16vw;
        box-shadow: 0 0 0 1px var(--color-text);
        transform: translate(-50%,-50%) rotate(calc(-1deg * var(--deg)));
        &:before, &:after{
            content: '';
            display: block;
            width: 100%;
            height: 100%;
        }
        &:before{
            border-radius: 30% 60% 50% 80%;
            box-shadow: var(--ps-x) var(--ps-y) 0 var(--color-ground);
            background: var(--bg);
        }
    }
}
</style>
<div></div>
</div>
```

At first I thought I'd just add elements, position them, and that would be that.

## A good grid

Positioning is tricky enough; we want them spaced out evenly, without showing a pattern, and without overlap.

<style>.illustration{box-shadow: 0 0 0 1px var(--color-gray);}</style>

So a grid like this:

<div role="img" aria-label="A rectangular grid" class="illustration condens-grid">
<style>
.condens-grid{
    width: calc(100% - 2rem);
    padding-bottom: 30%;
    background: radial-gradient(circle, var(--color-text) 0 12%, transparent 12%);
    background-size: 10vw 10vw;
    background-position: 1vw 1vw;
}
</style>
</div>

But better with Pythagoras and square roots and stuff:

<div role="img" aria-label="A triangular grid" class="illustration condens-grid-better">
<style>
.condens-grid-better{
    width: calc(100% - 2rem);
    padding-bottom: 30%;
    background:
      radial-gradient(circle, var(--color-text) 0 8%, transparent 8%),
      radial-gradient(circle, var(--color-text) 0 8%, transparent 8%)
    ;
    background-size: 10vw calc(10vw * 1.732);
    background-position: 1vw 1vw, calc(1vw + 5vw) calc(1vw + 5vw * 1.732);
}
</style>
</div>

At this point a randomised offset maxed out to the grid size (minus half the drop size) would prevent any overlaps.

<svg aria-label="Triangular grid with one point randomly translated " class="illustration condens-grid-random" viewbox="0 0 100 30">
<style>
.condens-grid-random{
    circle {
      fill: var(--color-text);
    }
    g:nth-of-type(1) { transform: translate(5px,5px); }
    g:nth-of-type(2) { transform: translate(17.5px,23px); }
    rect {
      stroke: var(--color-main);
      stroke-width: 0.5px;
      fill: none;
      stroke-dasharray: 1;
    }
}
</style>
<g>
    <circle cx="0" cy="0" r="2%" style="fill:var(--color-gray)" />
    <circle cx="25%" r="2%" />
    <circle cx="50%" r="2%" />
    <circle cx="75%" r="2%" />
    <rect width="10%" height="20%" />
    <circle cx="10%" cy="20%" r="2%" />
</g>
<g>
    <circle cx="0" cy="0" r="2%" />
    <circle cx="25%" r="2%" />
    <circle cx="50%" r="2%" />
    <circle cx="75%" r="2%" />
</g>
</svg>

I could have used a radial calculation for the offset here, so all possible positions are within a circle from the original point. But simply randomising x and y looks good enough; so all possible positions are within a square from the original point.

## Deterministic chaos

I was going to leave it at that because I thought animating it would either be too complex, or would look unrealistic. Besides, these doodles should contain as little JavaScript as possible, or even [no JavaScript](/experiment-leafs).
I'd like to do an initial setup, maybe a resize adjustment, but the rest should all be running off a custom CSS property `--t` that is increased to the maximum of 2<sup>31</sup> − 1 (the eighth Mersenne prime) over a period of one million seconds (or eleven days).
Nothing more than a ticking clock.

```css
@property --t {
    syntax: "<number>";
    initial-value: 0;
    inherits: true;
}

@keyframes tick {
    from { --t: 0; }
    to { --t: 2147483647; }
}

html {
    animation: tick 1000000s linear infinite;
}
```

The animations should be deterministic: we must be able to calculate a state in one go. Normally gravitational computations are dependent on the previous state. For CSS it hard to store a state. So it is better to set positions without having to calculate all previous or intermediate states.

But CSS has functions we can use, about twenty of them are mathematical functions, among which are the generic trigonometric functions. We already used them to rotate the radial-gradient and the box-shadow.


There is one function that I rarely ever use, but matches the exact motion I need.

The tan function:

<svg aria-label="Approximation of the tangent function over the x and y axea" class="illustration condens-grid-tan" viewbox="0 0 100 30">
  <style>
    .condens-grid-tan {
      line,path,use{
        stroke: var(--color-main);
        fill: none;
        stroke-width: 0.5px;
      }
      line{stroke: var(--color-text);}
      line[stroke-dasharray]{
        stroke: var(--color-gray);
        stroke-width: 0.25px;
      }
    }
  </style>

  <defs>
    <path id="branch" d="M -11 15 C -8 0, 8 0, 11 -15" />
  </defs>

  <line x1="0" y1="15" x2="100" y2="15" />
  <line x1="50" y1="0" x2="50" y2="30" />
  <line x1="35" y1="0" x2="35" y2="30" stroke-dasharray="1" />
  <line x1="65" y1="0" x2="65" y2="30" stroke-dasharray="1" />
  <line x1="5" y1="0" x2="5" y2="30" stroke-dasharray="1" />
  <line x1="95" y1="0" x2="95" y2="30" stroke-dasharray="1" />

  <use href="#branch" x="50" y="15" />
  <use href="#branch" x="20" y="15" />
  <use href="#branch" x="80" y="15" /> 
  <use href="#branch" x="-10" y="15" />
  <use href="#branch" x="110" y="15" /> 
</svg>

The beauty is that it is asymptotic; it becomes infinitely large near the dashed lines (half PI at PI intervals) but never quite reaches it. If we vertically offset our drops by this value we can make them move from top to bottom, while taking a little rest in the middle. And we can increase this rest by simply multiplying the tangent.

<svg aria-label="The tan function condensed onto the x axis" class="illustration condens-grid-tan" viewbox="0 0 100 30">
  <defs>
    <path id="branc" d="M -13 15 C -10 -14, 10 14, 13 -15" />
  </defs>

  <line x1="0" y1="15" x2="100" y2="15" />
  <line x1="50" y1="0" x2="50" y2="30" />
  <line x1="35" y1="0" x2="35" y2="30" stroke-dasharray="1" />
  <line x1="65" y1="0" x2="65" y2="30" stroke-dasharray="1" />
  <line x1="5" y1="0" x2="5" y2="30" stroke-dasharray="1" />
  <line x1="95" y1="0" x2="95" y2="30" stroke-dasharray="1" />

  <use href="#branc" x="50" y="15" />
  <use href="#branc" x="20" y="15" />
  <use href="#branc" x="80" y="15" /> 
  <use href="#branc" x="-10" y="15" />
  <use href="#branc" x="110" y="15" /> 
</svg>

And if we also offset each drop tangent timing with [a (pseudo) random number](/randomness-in-generative-code) they will not drop all at once. The repeating nature of the tangent will cause a drop to start at the top once it drops out of sight.

Here is that offset in CSS:

```css
--dripOffset: calc(10px*tan(0.00001*var(--t) + var(--seed)/var(--mod)*var(--pi)));
```

The `0.00001*var(--t)` determines how often a drop wil fall. The `10px` is the actual speed. And the rest is to ensure the drops don't fall all at once.
The tangent function has a period of PI so a random number between 0 and PI is chosen, with `--seed` as the random number and `--mod` as the prng modulus.
    
The same `--dripOffset` variable can also be used to set the height of the water trail.
In real life this trail is never straight of course. Plus water drops rolling down will always take other water drops with them. That will not happen here as it would require a lot more computation1.

To draw the trail it is easier to use a second element. Both the visual drop and the trail are drawn using the pseudo elemens `:before` and `:after`.
The size and position are set on the 'real' element.

The trail is drawn slightly thinner. Its colors are the sky and ground color as a radial gradient positioned left and right with the vertical center on the drop. This way the trail tapers off when higher (faster). The positions are static, the sun is used as a color but not animated, but it looks real enough.


```html
<!--example-->
<div role="img" aria-label="A blob shape with a rotated background and drop-shadow" class="illustration condens-drp">
<style>
html,body{margin:0;padding:0;}
.condens-drp{

    --pi: 3.14159;
    --color-ground: hsl(206 17% 10%); 
    --color-sky: hsl(180 23% 56%); 
    --color-sun: hsl(2 36% 90%); 
    --degSun: 15;
    --t: 0;

    --deg: 180;

    --rad: calc((var(--deg) + var(--degSun)) * var(--pi) / 180);
    --p1-rad: calc(var(--rad) + 0.00005*var(--t) + 0*var(--pi));
    --p1-d: 50%;
    --p1-x: calc(50% + var(--p1-d) * cos(var(--p1-rad)));
    --p1-y: calc(50% + var(--p1-d) * sin(var(--p1-rad)));
    --bg:
      linear-gradient(calc(var(--deg)*1deg),transparent 40%,var(--color-ground) 80%),
      radial-gradient(circle at var(--p1-x) var(--p1-y), #fffb 0 15%, var(--color-sun) 20%, transparent 30%),
      var(--color-sky)
    ;

    position: relative;
    width: 100%;
    padding-bottom: 30%;
    overflow: hidden;
    background: var(--bg);
    div{
        --deg: -25;
        --rad: calc((var(--deg) + var(--degSun)) * var(--pi) / 180);
        --p1-rad: calc(var(--rad) + 0.00005*var(--t) + 0*var(--pi));
        --p1-d: 50%;
        --p1-x: calc(50% + var(--p1-d) * cos(var(--p1-rad)));
        --p1-y: calc(50% + var(--p1-d) * sin(var(--p1-rad)));
        --bg:
          linear-gradient(calc(var(--deg)*1deg),transparent 40%,var(--color-ground) 80%),
          radial-gradient(circle at var(--p1-x) var(--p1-y), #fffb 0 15%, var(--color-sun) 20%, transparent 30%),
          var(--color-sky)
        ;

        --ps-rad: calc(var(--rad) + 0.5*var(--pi));
        --ps-d: 4px;
        --ps-x: calc(var(--ps-d) * cos(var(--ps-rad)));
        --ps-y: calc(var(--ps-d) * sin(var(--ps-rad)));

        position: absolute;
        left: 50%;
        top: 90%;
        width: 20vw;
        height: 16vw;
        box-shadow: 0 0 0 1px var(--color-text);
        &:before, &:after{
            content: '';
            display: block;
            width: 100%;
            height: 100%;
        }
        &:after{
            border-radius: 30% 60% 50% 80%;
            box-shadow: var(--ps-x) var(--ps-y) 0 var(--color-ground);
            background: var(--bg);
            transform: translate(-50%,-50%) rotate(calc(-1deg * var(--deg)));
        }
        &:before {

          --color-ground-a: rgb(from var(--color-ground) r g b / 0.3);
          --color-sky-a: rgb(from var(--color-sky) r g b / 0.05);
          --color-sky-aa: rgb(from var(--color-sky) r g b / 0.3);

          content: '';
          display: block;
          width: 90%;
          height: 120px;
          position: absolute;
          left: 4%;
          bottom: 0;
          -index: 1;
          background:
            radial-gradient(circle at bottom center, var(--color-ground), transparent 14vw),
            radial-gradient(ellipse at bottom left, var(--color-ground-a), transparent 70%),
            radial-gradient(ellipse at bottom right, var(--color-sky-aa), transparent 70%)
          ;
          background:
            radial-gradient(circle at bottom center, var(--color-ground), transparent 14vw),
            radial-gradient(ellipse at bottom left, red, transparent 70%),
            radial-gradient(ellipse at bottom right, lime, transparent 70%)
          ;
          border-radius: var(--borderRadius);
          ox-shadow: 0 0 0 1px lime;
          transform: translate(-50%,-50%);
        }
    }
}
</style>
<div></div>
</div>
```

That is really all there is to it. <a data-request-fullscreen href="#">Here is a link</a> to the full-screen experiment again, and here is the full source if you want to tinker with it.

<pre><code data-language="javascript" data-src="/static/html/condens.html"></code></pre>


