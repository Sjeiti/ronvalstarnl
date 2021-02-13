<!--
  id: 2905
  date: 2015-10-25
  modified: 2017-01-14
  slug: experiment-blob
  type: post
  excerpt: <p>This is an experiment with WebGL shaders. The JavaScript code is nothing much; just a scaffold to load GLSL scripts, run the shader program and some events to parse mouse- and keyboard input. The cool bit is the shader code itself.</p>
  categories: code, JavaScript
  tags: WebGL
  metaKeyword: WebGL
  metaTitle: Blob, a WebGL experiment.
  metaDescription: This is an experiment with WebGL shaders. The JavaScript code is nothing much. The cool bit is the shader code itself.
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
  related: experiment-bezier experiment-blob experiment-boids experiment-clouds experiment-ff experiment-fire experiment-flowfield experiment-glass experiment-grid experiment-heart experiment-marbles experiment-plasma experiment-radialdifference experiment-snow experiment-spiralmap experiment-starzoom experiment-touches experiment-vertical experiment-voronoi
-->

# Experiment: WebGL blob

<p>This is an experiment with WebGL shaders. The JavaScript code is nothing much; just a scaffold to load GLSL scripts, run the shader program and some events to parse mouse- and keyboard input. The cool bit is the shader code itself.<br />
<!--more--></p>
<p>WebGL shaders are written in GLSL, a C-like language. This takes some getting used to if you&#8217;ve only coded JavaScript. Functions and variables aren&#8217;t hoisted: you have to declare methods and variables before you use them. GLSL is typed, so you have to explicitly declare the type of variables, parameters and return values. And since the GLSL code is parsed to the canvas as one string this will result in extremely long files that end with the main method.</p>
<p>This sucks a bit, even normal C has directive called #include which, well, it includes bits and pieces. But GLSL is parsed  as a string before interpretation, so we can do stuff. If you&#8217;ve used JavaScript, probably you&#8217;ve used Grunt, and possibly you&#8217;ve written build scripts. Which is what I&#8217;ve done here <small>(sort of)</small>: loaded the GLSL script, search it for #include references, load and include them&#8230; and finally parse the GLSL script.</p>
<p>The shader technique used is called raycasting. I won&#8217;t elaborate on the technical details but the result is a space where objects no longer have to be defined by vertices and polygons but by &#8216;simple&#8217; formulae. A sphere is a point in space with a radius. This means naturally smooth objects.</p>
<p>My first go at this is quite simple really; a distance to the y axis to create an infinite horizontal cavern, a sphere modulated over a distance on the x and z axis to populate the cavern with pillars, and a 3-D simplex noise moving downward along the y-axis. Rules are multiplied rather than added so the pillars seem embedded into the cave and the ceiling seems to be dripping. And the same noise field to add some colour.</p>
<pre><code data-language="javascript" data-src="/static/experiment/blob.js"></code></pre>
<pre><code data-language="glsl" data-src="/static/glsl/blob.glsl"></code></pre>
