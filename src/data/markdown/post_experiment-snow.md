<!--
  date: 2014-04-26
  modified: 2017-01-17
  slug: experiment-snow
  type: post
  tags: Perlin Noise, cool shit, experiment, particles
  description: A simple implementation of procedural particle scattering: an infinite field of snow falling upward.
  related: experiment-*
-->

# Experiment: snow

<p>This might look simple but it is actually a simple implementation of a more complex solution. Normally particles are deterministic. This means a position of a single particle in time can only be determined by extrapolating from it&#8217;s previous position.<br />
The particles you see here are procedural: their position in time is predetermined plus their number is infinite.<br />
You can check this by dragging left or right which also reverses time. The particles will go in exact reverse, even the ones that were already off-screen.<br />
<!--more--><br />
The technique used for particle scattering is relatively simple. The starting point is a grid. If we take a grid size of ten pixels in a hundred pixel field the number of particles will be around 10&#215;10=100 (or possibly 11&#215;11=121 if you round the edges correctly). The x/y position of each gridpoint will act as seed for a psuedo random number generator. The result is used for offsetting the original point.</p>
<p><img src="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/Artboard-1.png" alt="" width="760" height="400" class="alignnone size-full" srcset="https://ronvalstar.nlhttps://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/Artboard-1.png 760w, https://ronvalstar.nlhttps://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/Artboard-1-300x158.png 300w" sizes="(max-width: 760px) 100vw, 760px" /></p>
<p>In the example I used the prng result as a directional offset: random radians with a fixed radius. You could use the same prng result for a random radius.</p>
<p>For speed optimisation you can make a lookup table for the sine and cosine calculations. The optimal size of the table is 2*Pi*r.</p>
<p>Instead of an actual prng I used Perlin noise, which makes the movement possible (and takes multiple arguments). If you need static particle scattering it will be faster to use a regular prng. But you&#8217;ll have to turn the x and y values into a single seed without mirroring the field diagonally (for instance: x+1E6*y).</p>
<p>Lastly we have to enlarge the gridfield a bit to accommodate for the offset radius. Normally a 100&#215;100 field with a gridsize of 10 wil hold a maximum of 121 points. But with an offset radius points that are normally outside the viewport could suddenly appear inside. So we also enlarge the grid with the offset radius.</p>
<pre><code data-language="javascript" data-src="/static/experiment/snow.js"></code></pre>
