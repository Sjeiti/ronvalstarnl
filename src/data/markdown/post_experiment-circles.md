<!--
  date: 2025-08-07
  modified: 2025-08-07
  slug: experiment-circles
  type: post
  categories: code, JavaScript
  tags: cool shit
  thumbnail: experiments/Screenshot_20250807-205419.jpg
  description: Recursive CSS
  related: experiment-*
-->

# Experiment: circles

This one is quite similar to [the rotate experiment](/experiment-rotate) with some technicalities picked from [radial gradient](/experiment-radialgradient).


## recursion

Like 'rotate' it consists of multiple nested elements.
A CSS transformation is applied to each element, but because they are nested each element also has its parents transformations applied. So translate/scale/rotate causes an effect like this:

```html
<!--example-->
<style>
.ill{
  width: calc(100% - 2rem);
  height: 55vw;
  overflow: hidden;
  div {
    width: 90%;
    height: 90%;
    transform: translate(10vw) rotate(15deg);
    box-shadow: 0 0 0 1px #f04;
  }
  &>div {
    width: 30vw;
    height: 30vw;
    margin: 10vw 10vw 0;
    transform: rotate(-15deg);
  }
}
</style>
<div class="ill"><div><div><div><div><div><div><div></div></div></div></div></div></div></div></div>
```


## animation

Animation is done by leveraging custom CSS properties. With each `requestAnimationFrame` the variable `--t` [is set to the elapsed milliseconds](#code-0-animate). In this case with an offset so as not to start at 0.
This CSS property `var(--t)` is the basis of all continuous animation. To make an element wiggle you simply do `left: calc(1rem * sin(0.01 * var(--t));`. The `1rem` is the offset, and the `0.01` the speed.
The beauty of this way of animating is that you can use one variable for multiple properties, and that the animation is completely deterministic. You can set `--t` to any value and always get the same result. You could even pause the animation, or make it run backwards. All with one custom CSS property.


## transitioning

One huge difference between those other experiments and this one is the way the visual appearance is coded. In the others linear and radial backround gradients are used. They look nice and are very versatile, but one big downside is that they do not respond to [CSS transition](https://developer.mozilla.org/en-US/docs/Web/CSS/transition). This experiment uses `box-shadow`, so simply setting a new value will make it transition smoothly when using `transition: box-shadow 3000ms ease;`.


## randomisation

Setting the `box-shadow` colors [is done randomly](#code-0-randomColor). Unfortunately `Math.random()` does not expose the seed we need to make things reproducable. A simple [linear congruential generator](#code-0-random) does the trick for a pseudo random number generator.

The seed is also 'saved' as `location.hash` and read on reload or [hashchange event](#code-0-onHashChange). So when an anchor changes the `location.hash` it will be picked up as the new seed.
For instance [1646235932](#1646235932) is green circles, and [563691680](#563691680) is yellow squares.


## Sourcecode

That's all really. There is some boiler plate in the head to load [Eruda](https://eruda.liriliri.io/) for easier mobile development, but really not much else.

<pre line-numbers><code data-language="html" data-src="/static/html/circles.html"></code></pre>


