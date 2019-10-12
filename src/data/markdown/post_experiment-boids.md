<!--
  id: 2555
  date: 2014-04-22T15:38:25
  modified: 2015-10-25T07:01:50
  slug: experiment-boids
  type: post
  categories: uncategorized
  tags: Perlin Noise, cool shit, experiment, particles
-->

# Experiment: boids

<p>A  bunch of fish forming schools by following simple rules. Everything you see is coded.</p>
<p>Boids is the name [Craig Reynolds](http://www.red3d.com/cwr/) came up with to describe <a href="http://www.red3d.com/cwr/boids/">computational flocking behavior</a>. The rules  are simple but getting it up to speed requires some smart coding.</p>
<p>Two of the original rules are merged into one. The rules &#8216;move to the collective center&#8217; and &#8216;prevent collision with others&#8217; are replaced by &#8216;keep optimum distance&#8217;.</p>
<p>For speed optimisation there are two important techniques (or design patterns if you will).</p>
<h3>Object pooling</h3>
<p>The first is object pooling. Extensive object creation can cause strain on your garbage collector when you simply discard them after use. Object pooling counters this by saving the discarded objects and recycling them when new objects are created. There are numerous implementations <a href="http://www.google.nl/search?safe=off&#038;client=chrome-mobile&#038;espv=1&#038;ei=stgpUvr1EImQtAbnhYCYBw&#038;q=object+pooling+javascript&#038;oq=object+pooling+javascript&#038;gs_l=mobile-gws-serp.12..0.9639.11345.0.12975.4.4.0.0.0.0.244.832.0j2j2.4.0....0...1c.1.26.mobile-gws-serp..0.4.823.BVd5b-wQzZ4">to be found online</a> but a lot of them are overcomplicated. The one I used is as simple as possible and looks <a href="https://gist.github.com/Sjeiti/6422815#file-objectpool-js">like this</a> (some added sugar to show where the actual logic might go). The only external interface is the drop method, everything else is handled internally.</p>
<h3>Grid system</h3>
<p>The second technique is a particle grid system. To let the fish interact they must know their mutual distance. But it wouldn&#8217;t interact with all the fish in the sea so it would be overkill to calculate all these distances. Instead the &#8216;sea&#8217; is divided into a grid, where the grid size corresponds to the maximum distance for interaction. Before we do anything we sort all the fish into the grid-array. The only fish that we are concerned with now are those of the neighboring grid cells.</p>
<p><!--Visual assets and seedable prng--></p>
<pre><code data-language="javascript" data-src="/static/experiment/boids.js"></code></pre>
