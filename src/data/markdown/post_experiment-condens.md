---
date: 2026-07-07
modified: 2026-07-07
slug: experiment-condens
type: post
categories: [code]
tags: [cool shit]
thumbnail: experiments/condens
description: Condens on a window
related: [experiment-*]
---

# Experiment: Condens

This started out as plain water droplets. With rotation and corner-radius you can [make elements look fairly natural](/experiment-eggs).

If you've ever had a good look at water droplets on a window pane you must have noticed they all reflect the outside world inverted.
A normal CSS background cannot be rotated, but [a CSS gradient can be](/experiment-pinkcheese)! So that was the starting point.

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

<svg class="illustration condens-grid-random" viewbox="0 0 100 30">
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
I'd like to do an initial setup, maybe a resize adjustment, but the rest should al be running off a custom CSS property `--t` that is increased to the maximum of 2<sup>31</sup> − 1 (the eighth' Mersenne prime) over a period of one million seconds (or eleven days).
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

So the animations should be deterministic, and also a, so called, closed-form-solution: we must be able to calculate a state in one go, without having to calculate all previous or intermediate states.

And all we have is CSS.
But CSS has functions, about twenty mathematical functions, among which are the generic trigonomic functions. We already used them to rotate the box-shadows in the eggs and cheese.

There is one function that I rarely ever use, but matches the exact motion I need.

The tan function:

<svg class="illustration condens-grid-tan" viewbox="0 0 100 30">
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

The beauty is that it is asymtotic; it becomes infinitely large near the dashed lines (half PI at PI intervals) but never quite reaches it. If we vertically offset our drops by this value we can make them move from top to bottom, while taking a little rest in the middle. And we can increase this rest by simply multiplying the tangent.

<svg class="illustration condens-grid-tan" viewbox="0 0 100 30">
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

The same variable can also be used to set the height of the water trail.
