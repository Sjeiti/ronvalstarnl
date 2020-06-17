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

I've programmed the web long enough to know that the wheel is continuously being reinvented. This new wheel is not necessarily rounder but it is what it currently is.

## Way back

For instance 3D on the web is old. Our current hardware accelerated webGL is better than the software accelerated 3D we had with Flash. But we *had* hardware accelerated 3D before that, better and faster than what was possible with Flash. It's just that Flash won the plugin race because it was insanely good at animation.

## Back to start

So Flash won, and then *lost* because it couldn't adapt to mobile. And although we now have WebGL for 3D and the SVG format for vector graphics, it is a pity that we have to reinvent the wheel again for vector animation.

Last week I needed an animated rolling cloud icon, to indicate an ongoing XMLHTTPRequest. Fifteen years ago a vector animation like that would have been trivial: just motion tween some circles along a bezier curve, create a symbol from that animation to duplicate and offset in time, et voila.
Yet now, 2020, I could not figure out how to get the same result with SVG.
In the end I just installed an old Macromedia Flash version, exported the frames to import into Illustrator, exported to SVG from there, and then cleaned up and animated the raw SVG ASCII.

There must be better ways than that.

## Searching

So what are the current tools with which you can create an animated SVG?

### Adobe Animate

[Adobe Animate](https://www.adobe.com/products/animate.html) looks like an exact clone of what once was called Flash <small>(they must have rebranded it because somebody gave it a bad name)</small>. But strangely it does not export to SVG.

There is a possibility to export to animated SVG using a plugin called [Flash2Svg](https://github.com/TomByrne/Flash2Svg)

There are also traces of a plugin for Flash CC called [Snap.svg Animator](http://cjgammon.github.io/SnapSVG-Animator/) but it is discontinued (or turned into [something completely different](http://snapsvg.io/)).

### SVGator

SVGator is a possibility, but it is not as good as Flash (two dollars cheaper though). It is an online web application. You can try it out but the 14-day trial sucks a bit because it doesn't reflect all the possibilities.

You cannot draw things so you have to start your SVG creation in something like Illustrator or Inkscape and import it.

The user interface really lacks in UX. For instance the button that collapse the animation row is the size of the tiny icon. And a lot of icon buttons lack the title attribute, so you have to guess at their functionality.
This makes animating itself rather unintuitive. It's also a pity that animation is divided into properties: you cannot simply transform an element, you have to scale, rotate and translate separately.
There is an annoying bug where the interface can flip into a state where it cannot drag-select items anymore (because of a JS error blocking execution).
It has keyboard shortcuts, but they don't always work. But maybe that is because they assume Apple users.

It's also a pity that the resulting output is not optimised for web. My imported SVG had digits with an accuracy of one floating point (ie 231.3). But SVGator turns all those into six, and in most cases with five trailing zeroes (ie 231.300000). Which is really accurate, but when I ran my simple animation through an optimiser I got more than 50% reduction in filesize.

Once you get used to these things
It makes Adobe Animate well worth the two dollar difference.


/*
https://app.svgator.com/pricing#/
https://github.com/TomByrne/Flash2Svg
*/
