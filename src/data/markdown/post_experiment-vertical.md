<!--
  id: 2576
  date: 2014-04-24
  modified: 2016-02-24
  slug: experiment-vertical
  type: post
  excerpt: <p>A quick doodle with random images from the Google search API and canvas. Once the image is loaded only one row of pixels is shown per frame and then animated from top to bottom. To make it more aesthetic the copied pixels row is sheared over x and copied a second time with a negative [&hellip;]</p>
  categories: uncategorized
  tags: REST, cool shit, experiment
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
  related: experiment-bezier experiment-blob experiment-boids experiment-clouds experiment-ff experiment-fire experiment-flowfield experiment-glass experiment-grid experiment-heart experiment-marbles experiment-plasma experiment-radialdifference experiment-snow experiment-spiralmap experiment-starzoom experiment-touches experiment-vertical experiment-voronoi
-->

# Experiment: vertical

A quick doodle with random images ~~from the [Google search API](https://developers.google.com/image-search/v1/devguide)~~ and canvas. Once the image is loaded only one row of pixels is shown per frame and then animated from top to bottom. To make it more aesthetic the copied pixels row is sheared over x and copied a second time with a negative shear and a lighten globalCompositeOperation.

You might have noticed the save button, which is a different script that takes the Canvas element, reads the image data with [toDataURL](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement.toDataURL) and tries to save the image. This would work just fine were it not for something called cross domain policy ([CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing)).

When you call toDataURL on a Canvas that has an image from another domain you get the beautifull notice: ‘Tainted canvases may not be exported’. One solution is to set an attribute `crossOrigin="anonymous"` to the IMG element that loads the image. This will load only images where CORS is set, so it will not taint when we draw to Canvas. The downside is that it might take a while to find an image where CORS is set (check console).

~~ps: see that search button/field above? When you enter something without submitting, and then click the Canvas, the Google image search will use that query. Try it with a color.~~

— update —

~~The old Google API no longer works. The new API version only allows a couple of calls per day. I completely ditched the search option and settled for a placeholder image service that has a random in their REST options: [Unsplash](https://unsplash.it/).~~

— update —

Nevermind all that, I'll just use my own images.

<pre><code data-language="javascript" data-src="/static/experiment/vertical.js"></code></pre>
