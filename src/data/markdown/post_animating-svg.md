<!--
  slug: animating-svg
  date: 2222-04-30
  modified: 2222-04-30
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

So Flash won, and then *lost* because it couldn't adapt to mobile. And although we now have WegGL for 3D and the SVG format for vector graphics, it is a pity that we have to reinvent the wheel again for vector animation.

Last week I needed an animated rolling cloud icon, to indicate an ongoing XMLHTTPRequest. Fifteen years ago a vector animation like that would have been trivial: just motion tween some circles along a bezier curve, create a symbol from that animation to duplicate and offset in time, et voila.
Yet now, 2020, I could not figure out how to get the same result with SVG.
In the end I just installed an old Macromedia Flash version, exported the frames to import into Illustrator, exported to SVG from there, and then cleaned up and animated the raw SVG ASCII.

There must be better ways than that.

## Searching

So what are the current tools with which you can create an animated SVG?

### Adobe Animate

[Adobe Animate](https://www.adobe.com/products/animate.html) is used to animate and in fact looks like an exact clone of what once was called Flash <small>(they must have rebranded it because somebody gave it a bad name)</small>. But strangely it does not export to SVG.

There is a possibility to export to animated SVG using a plugin called [Flash2Svg](https://github.com/TomByrne/Flash2Svg)

There are also traces of a plugin for Flash CC called [Snap.svg Animator](http://cjgammon.github.io/SnapSVG-Animator/) but it is discontinued (or turned into [something completely different](http://snapsvg.io/)).

### SVGator

Is a good candidate, but it is not as good as Flash (but two dollars cheaper). You can try it out but the 14-day trial sucks a bit because it doesn't reflect all the possibilities.

/*
https://app.svgator.com/pricing#/
https://github.com/TomByrne/Flash2Svg
*/