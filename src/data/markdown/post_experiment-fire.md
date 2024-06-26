<!--
  date: 2017-01-24
  modified: 2017-01-24
  slug: experiment-fire
  type: post
  categories: code, GLSL
  tags: cool shit, noise, WebGL, GLSL, fire, shader
  description: Here's a hot shader: fire with sparks. The fire is Simplex noise, nothing special. But the sparks might need some explanation.
  thumbnail: experiments/ocalhost_7047_experiment-fire.jpg
  related: experiment-*
-->

# Experiment: procedural fire with sparks in GLSL

<p>Here&#8217;s a hot shader: fire with sparks. The fire is <a href="#code-36" to="#code-47"> Simplex noise</a>, nothing special apart from some displacement to fake realism. But the sparks might need some explanation.<br />
<!--more--><br />
The shader is entirely procedural. So the sparks flying upward are calculated for each pixel. We could calculate the sparks in advance as particles and put them into the shader by uniform. But there&#8217;s no fun in that.<br />
The technique I wanted to implement here is similar to one I previously used in plain JavaScript in <a href="/experiment-snow">an earlier experiment</a>.</p>
<h2>A grid, a prng and some trigonometry</h2>
<p>The gist of it is as follows: calculate a grid, feed the grid positions into a pseudo random number generator (prng), use the random number to rotate a particle inside the grid.<br />
Compared to <a href="/experiment-snow">the snow experiment</a> the mental approach is a bit like coding it the other way around (we don&#8217;t really displace particles, we displace the input variables). Plus we cannot exceed the grid boundaries (we&#8217;re calculating pixels, not particles). If you click without dragging you will see the displaced grid. Notice the sparks are moving in circles within each grid cell.</p>
<p>First we create a grid. To do that we use modulo grid-size on the xy position: <code>mod(gl_FragCoord,40.0)</code>, <a href="#code-68">line 68</a>. This will give us a grid of linear gradients (from zero to one) that we can use to create a spherical gradient.<br />
If you change the very last line to: <code>gl_FragColor = vec4(mod(gl_FragCoord,40.0)/40.0,0.0,1.0);</code> you&#8217;ll see a pattern like this. The green and red are going from zero to one every 40 pixels.</p>
<p><img src="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/gridmodulus.png" alt="modulo grid" width="199" height="159" class="alignnone size-full" /></p>
<p>The axes are divided by the size of the grid and floored to get the seeds for the random number. So the coordinates for the bottom left grid cell become 0,0 (the default origin for gl_FragCoord is the bottom left corner). Defining the grid index is done <a href="#code-63">here</a>.<br />
Again a simple example: <code>gl_FragColor = vec4(floor(gl_FragCoord.x/40.0)/4.0,floor(gl_FragCoord.y/40.0)/3.0,0.0,1.0);</code> makes this:</p>
<p><img src="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/gridfloored.png" alt="grid indices" width="200" height="160" class="alignnone size-full wp-image-3194" /></p>
<p>The floored indices are the numbers we&#8217;ll use as input for our prng. The prng we&#8217;ll be using is <a href="https://www.shadertoy.com/view/4djSRW">one by David Hoskins</a> who says: <q>The magic numbers were chosen by mashing the number pad, until it looked OK!</q>. Haha, well fractional parts beats LCG and Mersenne Twister in this case.<br />
This gets us the following <code>gl_FragColor = vec4(prng(floor(gl_FragCoord.xy/40.0)),0.0,0.0,1.0);</code>:</p>
<p><img src="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/gridrng.png" alt="random grid indices" width="200" height="160" class="alignnone size-full" /></p>
<h2>Let there be sparks</h2>
<p>This random number is used to <a href="#code-68">define the size</a> of the spark as well as <a href="#code-69" to="#code-72">it&#8217;s rotation</a> and it&#8217;s <a href="#code-65">life expectancy</a>. The input derived from <code>gl_FragCoord</code> is also <a href="#code-59" to="#code-61">displaced around a bit</a> to create some flow direction and randomness.</p>
<p>And that is really all there is to it.<br />
The source code is below. I&#8217;ve also <a href="https://www.shadertoy.com/view/MlKSWm" target="_blank">ported this over to Shadertoy</a> (with minor some adjustments to get it working there) so you can easily tweak and/or fork it.</p>
<pre line-numbers><code data-language="glsl" data-src="/static/glsl/fire.glsl"></code></pre>
