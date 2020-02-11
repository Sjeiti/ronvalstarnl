<!--
  slug: animating-svg
  date: 2020-04-30
  modified: 2020-04-30
  type: post
  header: boxbox.jpg
  category: SVG
  tag: animation
-->

# Modern animation with SVG

I've programmed the web long enough to know that the wheel is continuously being reinvented. This new wheel is not necessarily rounder but it is what it currently is.

## Before Flash

For instance 3D on the web is old. Our current hardware accelerated webGL is better than the software accelerated 3D we had with Flash. But most people don't know we *had* hardware accelerated 3D before that, better and faster than what was possible with Flash. It's just that Flash won the plugin race because it was insanely good at animation.

## 

So Flash won and then lost because it couldn't adapt to mobile. And although we now have wegGL for 3D and the SVG format for vector graphics, it is a pity that we have to reinvent the wheel again for vector animation.

Last week I needed an animated rolling cloud icon, to indicate an ongoing XMLHTTPRequest. Fifteen years ago a vector animation like that would have been trivial: just motion tween some circles along a bezier curve, create a symbol from that animation to duplicate and offset in time, et voila.
Yet now, 2020, I could not figure out how to get the same result with SVG.
In the end I just installed an old Flash version, exported the frames to import into Illustrator, exported to SVG from there, and then cleaned up and animated the raw SVG ASCII.

There must be better ways than that.
