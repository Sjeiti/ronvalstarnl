<!--
  date: 2017-01-14
  modified: 2017-01-24
  slug: experiment-spiralmap
  type: post
  categories: code, GLSL
  tags: WebGL, shader
  description: The first WebGL shader I published was 3D Perlin noise dripping from the ceiling. But one of the first WebGL shaders I made was a simple displacement map.
  thumbnail: experiments/ff615409-e9be-48ea-8b96-5fbf041b1c3b.jpg
  related: experiment-*
-->

# Experiment: spiral map

<p>A year ago I started to get into glsl. A good way to learn this is by looking at other peoples code and <a href="http://shadertoy.com" target="_blank">Shadertoy</a> is an excellent resource for that. My Shadertoy account consists mostly of unpublished stuff I tried trying to learn WebGL. The first WebGL experiment I published here was <a href="/experiment-blob">this blob thing</a> but it was not the first thing I made of course.</p>
<p>What I started with was plain flat displacement mapping; just moving pixels around.<br />
So I thought it would be nice to port some of those Shadertoy things over to here.<br />
This is one of those first doodles: a spiral displacement map.</p>
<p>Dragging it controls the amount of spiraling and also shows you the displacement map used.</p>
<pre><code data-language="glsl" data-src="/static/glsl/spiralmap.glsl"></code></pre>
