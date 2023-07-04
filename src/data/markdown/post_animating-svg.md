<!--
  slug: animating-svg
  date: 9999-04-30
  modified: 9999-04-30
  type: post
  header: boxbox.jpg
  category: SVG
  tag: animation
-->

# Modern animation with SVG

I've programmed the web long enough to know that the wheel is continuously being reinvented. This new wheel is not necessarily rounder, but it is what it currently is.


## Way back

For instance 3D on the web is old. Our current hardware accelerated webGL is better than the software accelerated 3D we had with Flash. But we *had* hardware accelerated 3D before that, better and faster than what was possible with Flash. It's just that Flash won the plugin race because it was insanely good at animation.


## Back to start

So Flash won, and then *lost* because it couldn't adapt to mobile. And although we now have WebGL for 3D and the SVG format for vector graphics, it is a pity that we have to reinvent the wheel again for vector animation.


## Animation example

A while back I needed an animated rolling cloud icon, to indicate an ongoing XMLHTTPRequest. Fifteen years ago a vector animation like that would have been trivial: just motion tween some circles along a bezier curve, create a symbol from that animation to duplicate and offset in time, et voilà.
Yet now, I could not figure out how to get the same result with SVG.
In the end I just installed an older Flash version, exported the frames to import into Illustrator, exported to SVG from there, and then cleaned up and animated the raw SVG ASCII.

There must be better ways than that.


## Searching

So what are the current tools with which you can create an animated SVG?

### Not Adobe Animate

[Adobe Animate](https://www.adobe.com/products/animate.html) is what once was Flash. Somewhere end last century Macromedia brought vector graphics to the masses in the form of [Flash](https://en.m.wikipedia.org/wiki/Adobe_Flash). This was [before SVG](https://en.m.wikipedia.org/wiki/SVG) even existed. The Flash format was not only very small, the timeline keyframe editor was very easy to work with.
They must have rebranded it because [somebody gave it a bad name](https://en.m.wikipedia.org/wiki/Thoughts_on_Flash). But strangely it does not export to SVG. The result is a canvas element with a lot of JavaScript. A major disappointment especially considering a major obstacle in the heydays of Flash was accessibility and SEO. One would think this issue would be solved for HTML5 exports.

There is a possibility to export to animated SVG using a plugin called [Flash2Svg](https://github.com/TomByrne/Flash2Svg), but it is for Flash, not Animate.
There are also traces of a plugin for Flash CC called [Snap.svg Animator](http://cjgammon.github.io/SnapSVG-Animator/), but it is discontinued (or turned into [something completely different](http://snapsvg.io/)).


### SVGator

[SVGator](https://app.svgator.com) is a good option, although it is not as easy to use as Adobe Animate (and only two dollars cheaper). It is an online web application. You can try it out, although the 14-day trial leaves to be desired because it doesn't unlock all the features.

You cannot draw things, so you have to start your SVG creation in something like Illustrator or Inkscape and import it.

The user interface really lacks in UX. For instance the button that collapse the animation row is the size of the tiny icon. And a lot of icon buttons lack the title attribute, so you have to guess at their functionality.
This makes animating itself rather unintuitive. It's also a pity that animation is divided into properties: you cannot simply transform an element, you have to scale, rotate and translate separately.
There is an annoying bug where the interface can flip into a state where it cannot drag-select items anymore (because of a JS error blocking execution).
It has keyboard shortcuts, but they don't always work. But maybe that is because they assume Apple users.

The resulting animations also don't run without JavaScript enabled. Each SVG export comes with a minimum of 30KB JavaScript (but there are examples that have as much as 80KB).

Strangely the resulting output is not optimised for web. My imported SVG had digits with an accuracy of one floating point (ie 231.3). But SVGator turns all those into six, and in most cases with five trailing zeroes (ie 231.300000). Which is really accurate, but when I ran my simple animation through an optimiser I got more than 50% reduction in filesize.

So SVGator isn't ideal, but I guess you could get used to these things.

### SnapSVG

[SnapSVG](http://snapsvg.io/) is not an editor but a code abstraction. Their words: "makes working with your SVG assets as easy as jQuery".

### Lottie

Lottie is not something to use directly but a JSON animation format (developed at Airbnb).


### Stale editors

#### Animator (by Haiku)

[Haiku Animator](https://www.haikuanimator.com/) is an open-source, Lottie based editor that looked promising in 2021. But development stopped at IOS.

#### Anigen

Anigen is an editor that outputs pure SVG (no JS). But it seems to be discontinued: no anigen.org and [a stale Github repo](https://github.com/aibosan/anigen).
It easily runs locally but the gui fails.

### Small tools

Then there are a variety of small tools that might help a very specific use case but should not be categorized as animation software. I'll just list them without too much detail: [Vivus JS](https://maxwellito.github.io/vivus/) for `stroke` animations, [SVG Artista](https://svgartista.net/), for `stroke` and `fill`  animations, [SVG circus](https://svgcircus.com/) for loading spinners.

### ... more?

GSAP, Lottie (=AfterEffects+Bodymovin), Yewcraft

### Do it by hand with SVG and CSS

https://www.nan.fyi/svg-paths
XXXXXXXXXXXXXXXX

---

```html
<!--example-->
<style>
  .svg-example {
    box-shadow: 0 0 0 1px red;
    width: 256px;
    height: 256px;
  }
</style>

<svg class="svg-example" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" width="32" height="32" viewBox="0 0 32 32" xml:space="preserve">
  <style>
        @keyframes www {
          0% {
            transform: translate(16px, 25px) rotate(0deg);
          }
          100% {
            transform: translate(16px, 25px) rotate(177deg);
          }
        }

        @keyframes wwr {
          0% {
            transform: translate(-12px, 0) scale(0.05);
          }
          50% {
            transform: translate(-10px, 0) scale(0.8);
          }
          100% {
            transform: translate(-9px, 0) scale(0.05);
          }
        }

        #n {
          --t: 3500ms;
          --curve: cubic-bezier(.4, 0, .4, 1);
          --curvr: cubic-bezier(.2, 0, .7, 1);
        }

        #n1 {
          animation: www var(--t) var(--curve) calc(0 * var(--t) / 7 - var(--t)) infinite;
        }

        #n1 circle {
          animation: wwr var(--t) var(--curvr) calc(0 * var(--t) / 7 - var(--t)) infinite;
        }

        #n2 {
          animation: www var(--t) var(--curve) calc(1 * var(--t) / 7 - var(--t)) infinite;
        }

        #n2 circle {
          animation: wwr var(--t) var(--curvr) calc(1 * var(--t) / 7 - var(--t)) infinite;
        }

        #n3 {
          animation: www var(--t) var(--curve) calc(2 * var(--t) / 7 - var(--t)) infinite;
        }

        #n3 circle {
          animation: wwr var(--t) var(--curvr) calc(2 * var(--t) / 7 - var(--t)) infinite;
        }

        #n4 {
          animation: www var(--t) var(--curve) calc(3 * var(--t) / 7 - var(--t)) infinite;
        }

        #n4 circle {
          animation: wwr var(--t) var(--curvr) calc(3 * var(--t) / 7 - var(--t)) infinite;
        }

        #n5 {
          animation: www var(--t) var(--curve) calc(4 * var(--t) / 7 - var(--t)) infinite;
        }

        #n5 circle {
          animation: wwr var(--t) var(--curvr) calc(4 * var(--t) / 7 - var(--t)) infinite;
        }

        #n6 {
          animation: www var(--t) var(--curve) calc(5 * var(--t) / 7 - var(--t)) infinite;
        }

        #n6 circle {
          animation: wwr var(--t) var(--curvr) calc(5 * var(--t) / 7 - var(--t)) infinite;
        }

        #n7 {
          animation: www var(--t) var(--curve) calc(6 * var(--t) / 7 - var(--t)) infinite;
        }

        #n7 circle {
          animation: wwr var(--t) var(--curvr) calc(6 * var(--t) / 7 - var(--t)) infinite;
        }
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
  <path d="M25,25.6l-7.3-11.6l-12.6,7l-1.3,4.6H25z"/>
</svg>

<svg class="svg-example" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" width="32" height="32" viewBox="0 0 32 32" xml:space="preserve">
  <style>
    :root {
      --t: 500ms;
    }

    @keyframes vvv {
      0% {
        visibility: visible;
      }
      14.29% {
        visibility: visible;
      }
      14.29% {
        visibility: hidden;
      }
      100% {
        visibility: hidden;
      }
    }

    #c1 {
      animation: vvv var(--t) linear calc(1 * var(--t) / 7 - var(--t)) infinite;
    }

    #c2 {
      animation: vvv var(--t) linear calc(2 * var(--t) / 7 - var(--t)) infinite;
    }

    #c3 {
      animation: vvv var(--t) linear calc(3 * var(--t) / 7 - var(--t)) infinite;
    }

    #c4 {
      animation: vvv var(--t) linear calc(4 * var(--t) / 7 - var(--t)) infinite;
    }

    #c5 {
      animation: vvv var(--t) linear calc(5 * var(--t) / 7 - var(--t)) infinite;
    }

    #c6 {
      animation: vvv var(--t) linear calc(6 * var(--t) / 7 - var(--t)) infinite;
    }

    #c7 {
      animation: vvv var(--t) linear calc(7 * var(--t) / 7 - var(--t)) infinite;
    }

    .paused g {
      animation-play-state: paused !important;
    }
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





## TLDR

If you're well versed in SVG and CSS I'd really recommend just opening your favorite ASCII editor and type or copy/paste it all in. It is not that hard.
For more complex animations with long timelines it could be useful to make it with SVGator. But it does require you to create the assets in another application, and you really should clean up the resulting animation.
