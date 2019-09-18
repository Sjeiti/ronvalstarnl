<!--
  id: 3044
  slug: strange-attractors-javascript
  type: fortpolio
  excerpt: <p>A pure Javascript strange attractor renderer with a WebGL preview. Renders images and animated gifs from mathematical formulas with interpolated variables.</p>
  categories: javascript, 3D, video, open source
  tags: Javascript, interaction design, math, cool shit, particles, webgl, concept
  clients: 
  collaboration: 
  prizes: 
  thumbnail: attractors01.jpg
  image: attractors01.jpg
  images: attractors00.png, attractors01.jpg, attractors02.jpg, Lorenz-84-52.gif, Lorenz-84-31.gif, Lorenz-84-57.png
  inCv: true
  inPortfolio: true
  dateFrom: 2016-03-04
  dateTo: 2016-07-14
-->

# Strange attractors in Javascript

<p>Over ten years ago I made a strange attractor renderer in Java (and P55). Back then Java applets were still the only way to get raw computing power to the client-side of the web. A strange attractor is not complicated, but because it is deterministic it needs a few billion iterations for a proper result. September last year Chrome dropped support for Java applets. Since Javascript has come a long way I thought I&#8217;d try a remake in Nodejs. I compared a rough to a client-side implementation and found the speed difference negligible enough to bring the entire implementation to client-side Javascript.<br />
Contrary to the old Java applet <a href="http://attractors.ronvalstar.nl" target="_blank">this Javascript version</a> can burp out animated gifs and webm videos.</p>