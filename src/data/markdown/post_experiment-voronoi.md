<!--
  date: 2014-08-26
  modified: 2015-10-25
  slug: experiment-voronoi
  type: post
  tags: Perlin Noise, cool shit, experiment, prng
  related: experiment-*
-->

# Experiment: Voronoi

<p>A <a href="http://en.m.wikipedia.org/wiki/Voronoi_diagram">Voronoi diagram</a> is a way divide point scattered space into equal cells. I used an <a href="https://github.com/gorhill/JavaScript-Voronoi">open source lib</a> that computes the cell data for a given set of points.</p>
<p><!--more--></p>
<p>This experiment is similar to the <a href="/experiment-snow/" title="Experiment: snow">snow experiment</a> in the sense that it uses the same particle scattering technique enabling an endless Voronoi field (drag it). Instead of Perlin noise I used a regular prng to scatter the points.</p>
<pre><code data-language="javascript" data-src="/static/experiment/voronoi.js"></code></pre>
