<!--
  id: 3328
  date: 2017-08-02T08:59:52
  modified: 2017-09-27T05:39:51
  slug: experiment-marbles
  type: post
  excerpt: <p>Last week I saw an old image in my library of something I created back in 2006. It was a few marbles created using Flash and displacement mapping. Remember BitmapData and DisplacementMapFilter? No I didn&#8217;t either. But since I&#8217;m learning GLSL I thought this would be an excellent little experiment to recreate.</p>
  categories: code, game, JavaScript, work
  tags: 3D, WebGL, physics
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Experiment: marbles

<p>Last week I saw an old image in my library of <a href="http://test.sjeiti.com/knikkeren/">something I created</a> back in 2006. It was a few marbles created using Flash and displacement mapping. Remember BitmapData and DisplacementMapFilter? No I didn&#8217;t either.<br />
But since I&#8217;m learning GLSL I thought this would be an excellent little experiment to recreate.<br />
<!--more--><br />
Back then I did the physics myself but this time I wanted to concentrate on the WebGL part so I used Matter.js. Circles in Matter are really just a polygon of vertices, but it works just fine.<br />
So the physics part is plain JavaScript, the view is all GLSL.</p>
<h2>Some goals</h2>
<p>I was going for looks, not creating anatomically correct glass and refraction. So the what you see is not 3D. If you nitpick there are all sorts of things that are off like the rotation of the marbles or the refraction over the hole. But overal it looks good.</p>
<p>What I wanted to learn from this experiment is:<br />
&#8211; more displacement mapping<br />
&#8211; realistic marble colors<br />
&#8211; object lighting<br />
&#8211; JavaScript lists to uniforms</p>
<p>What I also learned was:<br />
&#8211; passing a list of structs from JavaScript to the shader<br />
&#8211; passing uniform data can be faster than using prng in GLSL<br />
&#8211; GLSL operations order<br />
&#8211; environment mapping</p>
<h2>Getting started</h2>
<p>I&#8217;m going to skip the setup because there are enough <a href="https://www.google.com/search?q=WebGL+boilerplate">WebGL boilerplates</a> out there for you to get started with. Or you could fiddle around on <a href="http://shadertoy.com">ShaderToy</a>.<br />
I do want to point out that in most implementations you will see that the <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext">WebGL2RenderingContext</a> derived from <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement">HTMLCanvasElement</a> is simply called <code>gl</code>. So when you see <code>gl</code> it&#8217;s really the context from <code>canvas.getContext()</code>.</p>
<h2>JavaScript arrays to GLSL uniforms</h2>
<p>The crux of the experiment was really getting a list of JavaScript data (marble positions) into the GLSL shader. There are sixteen methods you can use depending on the data.<br />
That might sound overwelming but it&#8217;s simply like this:</p>
<pre><code>gl.uniform[1234][fi][v]()</code></pre>
<p>The digits are the number of variables to pass (float, vec2, vec3, vec4 etc&#8230;).<br />
Followed by the type: Floats or Integers.<br />
And an optional v passing the vector as array.</p>
<p>So for a plain JavaScript number you&#8217;d use <code>gl.uniform1f()</code> to pass it to a <code>uniform float</code>.<br />
For an array of marble positions you&#8217;d use <code>gl.uniform2fv()</code> to pass it to a <code>uniform vec2 myPositions[23]</code>.</p>
<p><small>Here you can immediately see a property of GLSL that is a bit tricky to deal with: the array length must always be of type <code>const int</code>, but a <code>uniform</code> cannot be <code>const</code>. So the array length must fixed.<br />
There are tricks to overcome this if you need the freedom. One is to set the length to a maximum in GLSL and only calculate when properties are set.<br />
This is what I did at first: used <code>gl.uniform3fv()</code> to pass a <code>vec3</code> for marble x, y, radius. In the GLSL loop I&#8217;d first check for <code>marbleRadius!=0.0</code>.<br />
So in JavaScript your array would count 10 but in GLSL it would be 20.</small></p>
<p>To use the <code>gl.uniform[1234][fi][v]()</code> method we first need to get the location:</p>
<pre><code>let uniformLocation = gl.getUniformLocation(program,'myFloat')
gl.uniform1f(uniformLocation,2.3)</code></pre>
<p>Passing an array is slightly different. An array of vec2:</p>
<pre><code>let uniformLocation
uniformLocation = gl.getUniformLocation(program,'myPos[0]')
gl.uniform2f(uniformLocation,2.3,4.5)
uniformLocation = gl.getUniformLocation(program,'myPos[1]')
gl.uniform2f(uniformLocation,3.4,5.6)</code></pre>
<p>And an example using the [v] variant (same effect as above):</p>
<pre><code>let uniformLocation
uniformLocation = gl.getUniformLocation(program,'myPos[0]')
gl.uniform2fv(uniformLocation,[2.3,4.5])
uniformLocation = gl.getUniformLocation(program,'myPos[1]')
gl.uniform2fv(uniformLocation,[3.4,5.6])</code></pre>
<p><small>By the way, <code>program</code> here refers to the <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram">WebGLProgram</a>, the return from <code>gl.createProgram()</code>. This is your vertex- and fragment shader combined.</small></p>
<h2>Onto colored marbles</h2>
<p>What I first did was pass a JavaScript Array to the shader as <code>vec3</code> where <code>vec3.z</code> would be the radius of the marble. I used the index of the array as the seed for a prng to get six floats for two rgb colors. This works but it&#8217;s not very efficient. Because when <code>gl_FragCoord.xy</code> is within radius of the marble it will have to get the two colors for each pixel. To put in perspective: for a marble with a 20 pixel radius we&#8217;d have to call the prng about 7500 times (PI*r&sup2;*6).</p>
<h2>What the struct?!</h2>
<p>While searching on how to get JavaScript arrays to GLSL uniforms I also came upon a solution to pass JavaScript objects to an array of GLSL <a href="https://www.khronos.org/opengl/wiki/Data_Type_(GLSL)#Structs">structs</a>. After reading up on structs (which are like a blueprint collection of properties, like an interface) I decided this was better suited for what I was doing. After implementing and ditching the prng it was indeed way faster.</p>
<p>In GLSL a struct for the marbles could look like this:</p>
<pre><code>const int numMarbles = 16;
struct Marble {
    vec2 position;
    float size;
    vec3 color1;
    vec3 color2;
};
uniform Marble marbles[numMarbles];</code></pre>
<p>And passing the data from JavaScript to GLSL is similar to the stringifying of the array index, you&#8217;d also stringify the property name:</p>
<pre><code>let uniformLocation
uniformLocation = gl.getUniformLocation(program,'marbles[0].position')
gl.uniform2fv(uniformLocation,[position.x,position.y])
uniformLocation = gl.getUniformLocation(program,'marbles[0].size')
gl.uniform1f(uniformLocation,20)
uniformLocation = gl.getUniformLocation(program,'marbles[0].color1')
gl.uniform3fv(uniformLocation,[color1.r,color1.g,color1.b])
uniformLocation = gl.getUniformLocation(program,'marbles[0].color2')
gl.uniform3fv(uniformLocation,[color2.r,color2.g,color2.b])</code></pre>
<p>Yeah this looks convoluted, but it&#8217;s for shows. I&#8217;m sure you can manage something more generic.</p>
<h2>Swirls and rotation</h2>
<p>Like I said; this is not 3D. But I did want stuff to roll around somewhat realisticly. And marbles have these colorfull swirls. So in the end what I&#8217;ve settled for is rotation depending on horizontal direction.</p>
<pre line-numbers><code data-language="glsl" data-src="/static/glsl/marbles.glsl"></code></pre>
<pre line-numbers><code data-language="javascript" data-src="/static/experiment/marbles.js"></code></pre>