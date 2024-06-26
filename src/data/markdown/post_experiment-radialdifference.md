<!--
  date: 2016-09-06
  modified: 2017-01-14
  slug: experiment-radialdifference
  type: post
  categories: code, JavaScript
  tags: JavaScript, cool shit, particles
  description: Another pretty simple idea with a really cool result. These are radial gradients drawn on top of each other with a 'difference' blend mode.
  thumbnail: experiments/ocalhost_7047_experiment-radialdifference.jpg
  related: experiment-*
-->

# Experiment: difference with radial gradients in canvas

<p>Another pretty simple idea with a really cool result (above). These are radial gradients drawn on top of each other with a &#8216;difference&#8217; blend mode.</p>
<p><!--more--></p>
<p>Way way way back I read a blog post on how to create crumpled paper in Photoshop (I think <a href="http://www.myjanee.com/tuts/crumple/crumple.htm">it was this one</a>). A few years back I used the technique <a href="https://www.filterforge.com/filters/8780.html">in Filter Forge</a>. This year I was on vacation, in a garden, under a tree, looking out over the sea. And because I&#8217;m a coding addict I thought I&#8217;d create an interactive version, on my phone. Coding on a phone is slow and feels a bit 1999 in terms of error feedback. But I had all the time in the world.</p>
<p>The idea is simple, but there is a bit more to it than that of course. The gradients attract each other, repel each other, and move around a bit. A nice emergence is that it just keeps on moving without any random motion used.</p>
<p>The coloring is random but always from black to a full color, so the centers are #0FF, #F00, #FFF etc. And because we&#8217;re drawing the difference (<code>context.globalCompositeOperation = 'difference';</code>) we get all the colors in between.</p>
<p>When I started I thought I would draw a lot more particles than the 17 that are in there now, but after tweaking it just looks nicer with 17. So for optimization overkill I used an object chain of prototyped particles (=gradients).</p>
<h3>Prototype versus closure</h3>
<p>Object prototypes have the advantage that the instance methods are only created once (in memory), as opposed to methods added to object literals. Normally I would code it without prototypes using closures because I don&#8217;t like -this-. This would surmount to roughly the same memory wise, but you would have extra scope lookups <a href="http://marijnhaverbeke.nl/blog/closure-vs-object-performance.html">which are a bit slower</a>.</p>
<h3>Object chaining</h3>
<p>Another performance design pattern is object chaining. Instead of having an array with instances each instance has a reference to the next one. Nothing fancy, just a tad faster. Although I wonder with these present day engines&#8230; but jsperf is still offline.</p>
<p>Anyway, here&#8217;s the code. You&#8217;ll notice I&#8217;ve separated the actual drawing from the math calculations. Time willing, I&#8217;m going alter it to a version that uses shaders (here&#8217;s <a href="https://www.shadertoy.com/view/4lyGzh">a rough</a>). </p>
<pre><code data-language="javascript" data-src="/static/experiment/radialdifference.js"></code></pre>
