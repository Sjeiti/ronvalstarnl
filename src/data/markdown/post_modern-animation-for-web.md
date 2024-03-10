<!--
  slug: modern-animation-for-web
  date: 9999-04-30
  modified: 9999-04-30
  type: post
  header: boxbox.jpg
  category: SVG
  tag: animation
-->

# Modern animation for web

A while back I needed an animated rolling cloud icon, to indicate an ongoing XMLHTTPRequest. Fifteen years ago a vector animation like that would have been trivial: with Flash you'd just motion tween some circles along a bezier-curve, create a symbol from that animation to duplicate and offset in time, et voilà.
Yet now, I could not figure out how to get the same result with SVG.

More recently I had to animate an infographic and add some interaction. A start was already made in Adobe Animate, but the export size was a whopping 2.5MB. So I decided to handcode everything in HTML/CSS for less than 10% of that. Plain HTML/CSS is also accessible as opposed to the canvas/JavaScript black box export from Adobe Animate.
For brevity I will not go into detail about HTML/CSS animations but there is a lot of overlap. 

Coding animations might give better quality results, but a good gui, like Animate has, makes it so much easier to create and tweak movement.
So what are the current tools with which to create animated images for web?

### Not Adobe Animate

[Adobe Animate](https://www.adobe.com/products/animate.html) is what once was Flash. Somewhere end last century Macromedia brought vector graphics to the masses in the form of [Flash](https://en.m.wikipedia.org/wiki/Adobe_Flash) (originally FutureSplash Animator). This was [before SVG](https://en.m.wikipedia.org/wiki/SVG) even existed. The Flash format was not only very small, the timeline keyframe editor was very easy to work with.
Adobe must have rebranded it because [somebody gave it a bad name](https://en.m.wikipedia.org/wiki/Thoughts_on_Flash). But strangely it does not export to SVG. The result is a canvas element with a lot of JavaScript. A major disappointment especially considering a major obstacle in the heydays of Flash was accessibility and SEO. One would think this issue would be solved for HTML5 exports.

<!--
There is a possibility to export to animated SVG using a plugin called [Flash2Svg](https://github.com/TomByrne/Flash2Svg), but it is for Flash, not Animate.
There are also traces of a plugin for Flash CC called [Snap.svg Animator](http://cjgammon.github.io/SnapSVG-Animator/), but it is discontinued (or turned into [something completely different](http://snapsvg.io/)).
-->

### SVGator

One option for creating web animations is [SVGator](https://app.svgator.com); not as easy to use as Adobe Animate, but it is two dollars cheaper and exports SVG. It is an online web application. You can try it out, although the 14-day trial leaves to be desired because it doesn't unlock all the features.

You cannot draw things, so you have to start your SVG creation in something like Illustrator or Inkscape and import it.

The user interface really lacks in UX. This makes animating itself rather unintuitive. It has some bugs among which non-working keyboard shortcuts.

The resulting animations don't run without JavaScript. Each SVG export comes with a minimum of 30KB JavaScript (but there are examples that have as much as 80KB).

Strangely the resulting output is not optimised for web. My imported SVG had digits with an accuracy of one floating point (ie 231.3). But SVGator turns all those into six, and in most cases with five trailing zeroes (ie 231.300000). Which is really accurate, but when I ran my simple animation through an optimiser I got more than 50% reduction in filesize.

So SVGator isn't ideal, but I guess you could get used to these things.


### Lottie

(dot)[Lottie](https://dotlottie.io/) is an open-source JSON file format, not something to use directly.
It started with the AfterEffects plugin [Bodymovin](https://exchange.adobe.com/apps/cc/12557/bodymovin) along with a JavaScript player for use in websites. This was in 2015 but the official dotLottie format was standardised in 2020.

Since Lottie is not officially recognized by the W3C you will need JavaScript to run it.

My only issue with Lottie is lack of editors. There are a lot of free animations but they often have a very recognisable style: fat limbs small head.

#### Lottiefiles

[LottieFiles](https://lottiefiles.com) has [several integrations](https://lottiefiles.com/integrations) among which plugins for: AfterEffects, Animate and Figma.
The people behind Lottiefiles are also developing a standalone editor called Lottie Creator.

[Lottie Creator](https://lottiefiles.com/lottie-creator) is an editor that is currently in private beta. To use it you must join a waiting list and be patient. According to the wayback-machine the waiting list is there since April 2023. You can check your current position, by which you can calculate it will take about fifty years.

#### Lottielab

If you do not want to wait that long you may want to try [Lottielab](https://lottielab.com/). It is a well-designed, intuitive editor for simple animations.
It doesn't seem to be able to reuse elements though.

### GSAP

The GreenSock Animation Platform is another remnant of the Flash era. Ported in 2012 to JavaScript it allows for DOM animations, so not only SVG but also other elements and even `canvas`. Using the `Timeline` object you can create sequenced animations that can be paused, resumed and reversed.


### Stale editors

#### Animator (by Haiku)

[Haiku Animator](https://www.haikuanimator.com/) is an open-source, Lottie based editor that looked promising in 2021. But development seems to have stopped at IOS.
The [master on Github](https://github.com/HaikuTeam/animator) should work on Windows but fails.

#### Anigen

Anigen is an editor that outputs pure SVG (no JS). But it seems to be discontinued: no anigen.org and [a stale Github repo](https://github.com/aibosan/anigen).
It easily runs locally but the gui fails.

### SnapSVG

[SnapSVG](http://snapsvg.io/) is not an editor but a code abstraction. Their words: "makes working with your SVG assets as easy as jQuery". Unfortunately it looks to be a dead project, old code, old issues and wonky examples.


### Small tools

Then there are a variety of small tools that might help a very specific use case but should not be categorized as complete animation software. I'll just list them without too much detail: [Vivus JS](https://maxwellito.github.io/vivus/) for `stroke` animations, [SVG Artista](https://svgartista.net/), for `stroke` and `fill`  animations, [SVG circus](https://svgcircus.com/) for loading spinners.


### Do it by hand with SVG (and CSS)

The alternative is to code it yourself. You don't need JavaScript and browsers simply support it.
It might look complicated, especially SVG paths, but it really is not difficult when somebody like [Nanda Syahrasyad explains it](https://www.nan.fyi/svg-paths).

For the actual animation you can either use native SVG native [`animate`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animate) or use CSS.

The simplest solution might be to use CSS because chances are you already know everything you need to know.
But SVG has capabilities that cannot be replicated with CSS: for instance `animateMotion`, to make an object follow a bezier curve.

Here are three examples with the cloud animation mentioned earlier.

#### Flash export

When I found Adobe Animate could not export to SVG my initial solution was to create keyframes for the entire bezier animation. This meant all keyframes were exported in one go, I just had to toggle their visibility.

It looks somewhat choppy, but fine for a small icon.
The final size is 2.97 KB.

```html
<!--example-->
<style>
  svg {
    width: 256px;
    height: 256px;
  }
</style>
<svg width="32" height="32" viewBox="0 0 32 32">
  <style>
    :root {
      --t: 500ms;
    }
    @keyframes toggelVisibility {
      0% {     visibility: visible; }
      14.29% { visibility: visible; }
      14.29% { visibility: hidden; }
      100% {   visibility: hidden; }
    }
    #c1 { animation: toggelVisibility var(--t) linear calc(1*var(--t)/7 - var(--t)) infinite; }
    #c2 { animation: toggelVisibility var(--t) linear calc(2*var(--t)/7 - var(--t)) infinite; }
    #c3 { animation: toggelVisibility var(--t) linear calc(3*var(--t)/7 - var(--t)) infinite; }
    #c4 { animation: toggelVisibility var(--t) linear calc(4*var(--t)/7 - var(--t)) infinite; }
    #c5 { animation: toggelVisibility var(--t) linear calc(5*var(--t)/7 - var(--t)) infinite; }
    #c6 { animation: toggelVisibility var(--t) linear calc(6*var(--t)/7 - var(--t)) infinite; }
    #c7 { animation: toggelVisibility var(--t) linear calc(7*var(--t)/7 - var(--t)) infinite; }
    .paused g { animation-play-state: paused!important; }
  </style>
	<path d="M25,25.6l-7.3-11.6l-12.6,7l-1.3,4.6H25z"/>
	<g id="c1">
    <circle cx="3.8" cy="23.6" r="2.0"/>
		<circle cx="6.0" cy="19.9" r="3.1"/>
		<circle cx="11.6" cy="15.8" r="4.6"/>
		<circle cx="22.1" cy="13.9" r="7.0"/>
		<circle cx="25.0" cy="20.9" r="4.6"/></g>
	<g id="c2">
    <circle cx="4.0" cy="22.1" r="2.2"/>
		<circle cx="6.8" cy="19.2" r="3.5"/>
		<circle cx="12.7" cy="15.3" r="5.0"/>
		<circle cx="22.8" cy="14.3" r="6.8"/>
		<circle cx="24.8" cy="21.3" r="4.4"/>
		<circle cx="3.8" cy="24.9" r="0.7"/></g>
	<g id="c3">
    <circle cx="4.0" cy="22.3" r="2.0"/>
		<circle cx="7.2" cy="18.1" r="3.4"/>
		<circle cx="13.4" cy="14.4" r="4.9"/>
		<circle cx="23.5" cy="14.8" r="6.5"/>
		<circle cx="24.9" cy="21.6" r="4.0"/>
		<circle cx="4.0" cy="24.8" r="1.1"/></g>
	<g id="c4">
    <circle cx="4.4" cy="21.3" r="2.2"/>
		<circle cx="8.1" cy="17.4" r="3.6"/>
		<circle cx="14.8" cy="13.7" r="5.3"/>
		<circle cx="24.0" cy="15.7" r="6.3"/>
		<circle cx="25.0" cy="22.0" r="3.7"/>
		<circle cx="4.0" cy="24.4" r="1.3"/></g>
	<g id="c5">
    <circle cx="5.3" cy="22.6" r="2.1"/>
		<circle cx="8.8" cy="16.9" r="3.9"/>
		<circle cx="16.4" cy="13.3" r="5.6"/>
		<circle cx="24.6" cy="17.1" r="6.0"/>
		<circle cx="25.0" cy="22.4" r="3.2"/>
		<circle cx="4.0" cy="24.2" r="1.4"/></g>
	<g id="c6">
    <circle cx="5.3" cy="20.5" r="2.7"/>
		<circle cx="10.0" cy="16.1" r="4.3"/>
		<circle cx="18.3" cy="13.1" r="5.9"/>
		<circle cx="24.8" cy="18.4" r="5.6"/>
		<circle cx="25.1" cy="22.9" r="2.7"/>
		<circle cx="3.9" cy="24.1" r="1.6"/></g>
	<g id="c7">
    <circle cx="5.6" cy="20.3" r="3.0"/>
		<circle cx="11.1" cy="15.8" r="4.5"/>
		<circle cx="20.9" cy="12.8" r="5.8"/>
		<circle cx="24.8" cy="19.4" r="5.3"/>
		<circle cx="25.0" cy="23.4" r="2.2"/>
		<circle cx="3.9" cy="23.8" r="1.8"/></g>
</svg>
```

#### Animate SVG with CSS

The previous solution requires a lot of steps and if you want to tweak the end result you have to start over.
It might be easier to do this by hand with a CSS `@keyframes` animation. What is especially nice about this technique is that we can use CSS properties (or variables) inside the animation to overwrite specific properties per animation instance. In this example `--t` is used to calculate an offsetted delay.

The final size is 2.61 KB.

```html
<!--example-->
<style>
  svg {
    width: 256px;
    height: 256px;
  }
</style>
<svg width="32" height="32" viewBox="0 0 32 32">
  <style>
        @keyframes rotate180 {
            0% {    transform: translate(16px,25px) rotate(0deg); }
            100% {  transform: translate(16px,25px) rotate(177deg); }
        }
        @keyframes scaleUpDown {
            0% {    transform:  translate(-12px,0) scale(0.05); }
            50% {   transform:  translate(-10px,0) scale(0.8); }
            100% {  transform:  translate(-9px,0) scale(0.05); }
        }
        #n {
      --t: 3500ms;
      --curveRotation: cubic-bezier(.4,0,.4,1);
      --curveScale: cubic-bezier(.2,0,.7,1);
    }
    #n1 {        animation: rotate180   var(--t) var(--curveRotation) calc(0*var(--t)/7 - var(--t)) infinite; }
    #n1 circle { animation: scaleUpDown var(--t) var(--curveScale)    calc(0*var(--t)/7 - var(--t)) infinite; }
    #n2 {        animation: rotate180   var(--t) var(--curveRotation) calc(1*var(--t)/7 - var(--t)) infinite; }
    #n2 circle { animation: scaleUpDown var(--t) var(--curveScale)    calc(1*var(--t)/7 - var(--t)) infinite; }
    #n3 {        animation: rotate180   var(--t) var(--curveRotation) calc(2*var(--t)/7 - var(--t)) infinite; }
    #n3 circle { animation: scaleUpDown var(--t) var(--curveScale)    calc(2*var(--t)/7 - var(--t)) infinite; }
    #n4 {        animation: rotate180   var(--t) var(--curveRotation) calc(3*var(--t)/7 - var(--t)) infinite; }
    #n4 circle { animation: scaleUpDown var(--t) var(--curveScale)    calc(3*var(--t)/7 - var(--t)) infinite; }
    #n5 {        animation: rotate180   var(--t) var(--curveRotation) calc(4*var(--t)/7 - var(--t)) infinite; }
    #n5 circle { animation: scaleUpDown var(--t) var(--curveScale)    calc(4*var(--t)/7 - var(--t)) infinite; }
    #n6 {        animation: rotate180   var(--t) var(--curveRotation) calc(5*var(--t)/7 - var(--t)) infinite; }
    #n6 circle { animation: scaleUpDown var(--t) var(--curveScale)    calc(5*var(--t)/7 - var(--t)) infinite; }
    #n7 {        animation: rotate180   var(--t) var(--curveRotation) calc(6*var(--t)/7 - var(--t)) infinite; }
    #n7 circle { animation: scaleUpDown var(--t) var(--curveScale)    calc(6*var(--t)/7 - var(--t)) infinite; }
  </style>
	<g id="n">
    <g id="n1"><circle r="8"/></g>
		<g id="n2"><circle r="8"/></g>
		<g id="n3"><circle r="8"/></g>
		<g id="n4"><circle r="8"/></g>
		<g id="n5"><circle r="8"/></g>
		<g id="n6"><circle r="8"/></g>
		<g id="n7"><circle r="8"/></g>
  </g>
  <path d="M25,25.6l-7.3-11.6l-12.6,7l-1.3,4.6H25z" />
</svg>

```


#### Animate SVG with SMIL

There is another way to animate SVG called [SMIL](https://www.w3.org/TR/SMIL3/). The specification stems from 1998 and covers more than just SVG animations (for reference: SVG is from 1999).
The possibilities of SMIL extend beyond what can be done with mere CSS. If you like to know more here is [an extensive article by Sarah Soueidan](https://css-tricks.com/guide-svg-animations-smil/), and here is [a Stackoverflow answer with good examples](https://stackoverflow.com/a/64558513/695734).
For the clouds animation I made use of an awesome feature, namely `animateMotion[calcMode="spline"]` which lets you move elements along a bezier-curve.
One downside of SMIL is that you cannot reuse an animation (as in `defs`) and only overwrite a property. As you can see here, all animations are exactly the same except for the `begin` attribute. So that results in a lot of repetitive code. But to be honest: for both the SMIL and the CSS example I generated the repetitive parts with JavaScript and used the output.

The final size is 2.67 KB.
 
```html
<!--example-->
<style>
  svg {
    width: 256px;
    height: 256px;
  }
</style>
<svg width="32" height="32" viewBox="0 0 32 32">
  <path d="M5 25C6 20 25 7 25 25Z"></path>
  <circle>
    <animateMotion dur="3500ms" begin="0ms" repeatCount="indefinite" path="M5 25C4 20 25 7 25 25" calcMode="spline" keySplines=".4,.1,.4,.9" keyTimes="0;1"></animateMotion>
    <animate dur="3500ms" begin="0ms" attributeName="r" values=".1;5;.1" repeatCount="indefinite" calcMode="spline" keySplines=".1,0,.6,1;.7,0,.4,1"></animate>
  </circle>
  <circle>
    <animateMotion dur="3500ms" begin="-500ms" repeatCount="indefinite" path="M5 25C4 20 25 7 25 25" calcMode="spline" keySplines=".4,.1,.4,.9" keyTimes="0;1"></animateMotion>
    <animate dur="3500ms" begin="-500ms" attributeName="r" values=".1;5;.1" repeatCount="indefinite" calcMode="spline" keySplines=".1,0,.6,1;.7,0,.4,1"></animate>
  </circle>
  <circle>
    <animateMotion dur="3500ms" begin="-1000ms" repeatCount="indefinite" path="M5 25C4 20 25 7 25 25" calcMode="spline" keySplines=".4,.1,.4,.9" keyTimes="0;1"></animateMotion>
    <animate dur="3500ms" begin="-1000ms" attributeName="r" values=".1;5;.1" repeatCount="indefinite" calcMode="spline" keySplines=".1,0,.6,1;.7,0,.4,1"></animate>
  </circle>
  <circle>
    <animateMotion dur="3500ms" begin="-1500ms" repeatCount="indefinite" path="M5 25C4 20 25 7 25 25" calcMode="spline" keySplines=".4,.1,.4,.9" keyTimes="0;1"></animateMotion>
    <animate dur="3500ms" begin="-1500ms" attributeName="r" values=".1;5;.1" repeatCount="indefinite" calcMode="spline" keySplines=".1,0,.6,1;.7,0,.4,1"></animate>
  </circle>
  <circle>
    <animateMotion dur="3500ms" begin="-2000ms" repeatCount="indefinite" path="M5 25C4 20 25 7 25 25" calcMode="spline" keySplines=".4,.1,.4,.9" keyTimes="0;1"></animateMotion>
    <animate dur="3500ms" begin="-2000ms" attributeName="r" values=".1;5;.1" repeatCount="indefinite" calcMode="spline" keySplines=".1,0,.6,1;.7,0,.4,1"></animate>
  </circle>
  <circle>
    <animateMotion dur="3500ms" begin="-2500ms" repeatCount="indefinite" path="M5 25C4 20 25 7 25 25" calcMode="spline" keySplines=".4,.1,.4,.9" keyTimes="0;1"></animateMotion>
    <animate dur="3500ms" begin="-2500ms" attributeName="r" values=".1;5;.1" repeatCount="indefinite" calcMode="spline" keySplines=".1,0,.6,1;.7,0,.4,1"></animate>
  </circle>
  <circle>
    <animateMotion dur="3500ms" begin="-3000ms" repeatCount="indefinite" path="M5 25C4 20 25 7 25 25" calcMode="spline" keySplines=".4,.1,.4,.9" keyTimes="0;1"></animateMotion>
    <animate dur="3500ms" begin="-3000ms" attributeName="r" values=".1;5;.1" repeatCount="indefinite" calcMode="spline" keySplines=".1,0,.6,1;.7,0,.4,1"></animate>
  </circle>
</svg>
```

<style>
  #smil {
    width: 256px;
    height: 256px;
  }
</style>
<svg id="smil" width="32" height="32" viewBox="0 0 32 32">
  <path d="M5 25C6 20 25 7 25 25Z"></path>
  <circle>
    <animateMotion dur="3500ms" begin="0ms" repeatCount="indefinite" path="M5 25C4 20 25 7 25 25" calcMode="spline" keySplines=".4,.1,.4,.9" keyTimes="0;1"></animateMotion>
    <animate dur="3500ms" begin="0ms" attributeName="r" values=".1;5;.1" repeatCount="indefinite" calcMode="spline" keySplines=".1,0,.6,1;.7,0,.4,1"></animate>
  </circle>
  <circle>
    <animateMotion dur="3500ms" begin="-500ms" repeatCount="indefinite" path="M5 25C4 20 25 7 25 25" calcMode="spline" keySplines=".4,.1,.4,.9" keyTimes="0;1"></animateMotion>
    <animate dur="3500ms" begin="-500ms" attributeName="r" values=".1;5;.1" repeatCount="indefinite" calcMode="spline" keySplines=".1,0,.6,1;.7,0,.4,1"></animate>
  </circle>
  <circle>
    <animateMotion dur="3500ms" begin="-1000ms" repeatCount="indefinite" path="M5 25C4 20 25 7 25 25" calcMode="spline" keySplines=".4,.1,.4,.9" keyTimes="0;1"></animateMotion>
    <animate dur="3500ms" begin="-1000ms" attributeName="r" values=".1;5;.1" repeatCount="indefinite" calcMode="spline" keySplines=".1,0,.6,1;.7,0,.4,1"></animate>
  </circle>
  <circle>
    <animateMotion dur="3500ms" begin="-1500ms" repeatCount="indefinite" path="M5 25C4 20 25 7 25 25" calcMode="spline" keySplines=".4,.1,.4,.9" keyTimes="0;1"></animateMotion>
    <animate dur="3500ms" begin="-1500ms" attributeName="r" values=".1;5;.1" repeatCount="indefinite" calcMode="spline" keySplines=".1,0,.6,1;.7,0,.4,1"></animate>
  </circle>
  <circle>
    <animateMotion dur="3500ms" begin="-2000ms" repeatCount="indefinite" path="M5 25C4 20 25 7 25 25" calcMode="spline" keySplines=".4,.1,.4,.9" keyTimes="0;1"></animateMotion>
    <animate dur="3500ms" begin="-2000ms" attributeName="r" values=".1;5;.1" repeatCount="indefinite" calcMode="spline" keySplines=".1,0,.6,1;.7,0,.4,1"></animate>
  </circle>
  <circle>
    <animateMotion dur="3500ms" begin="-2500ms" repeatCount="indefinite" path="M5 25C4 20 25 7 25 25" calcMode="spline" keySplines=".4,.1,.4,.9" keyTimes="0;1"></animateMotion>
    <animate dur="3500ms" begin="-2500ms" attributeName="r" values=".1;5;.1" repeatCount="indefinite" calcMode="spline" keySplines=".1,0,.6,1;.7,0,.4,1"></animate>
  </circle>
  <circle>
    <animateMotion dur="3500ms" begin="-3000ms" repeatCount="indefinite" path="M5 25C4 20 25 7 25 25" calcMode="spline" keySplines=".4,.1,.4,.9" keyTimes="0;1"></animateMotion>
    <animate dur="3500ms" begin="-3000ms" attributeName="r" values=".1;5;.1" repeatCount="indefinite" calcMode="spline" keySplines=".1,0,.6,1;.7,0,.4,1"></animate>
  </circle>
</svg>



## TLDR

If you're well versed in SVG and CSS I'd really recommend just opening your favorite ASCII editor and type or copy/paste it all in (with the help of a vector editor). It is not that hard.
For more complex animations with long timelines it could be useful to make it with SVGator. But it does require you to create the assets in another application, and you really should clean up the resulting animation.
