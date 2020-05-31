<!--
  id: 934
  description: I wanted to use Oliver Hunt's fluid solver as an interactive particle flowfield. But the fluid dynamics worked wrongly for on square images.
  date: 2012-05-25
  modified: 2020-05-31
  slug: interactive-fluid-dynamics-in-javascript
  type: post
  excerpt: <p>Don&#8217;t know why, but after seeing Oliver Hunt&#8217;s fluid solver I wanted to use fluid dynamics on my site as an interactive particle flowfield.</p>
  categories: code, JavaScript, nature
  tags: fluid dynamics, port
  metaKeyword: fluid dynamics
  metaTitle: Interactive fluid dynamics in JavaScript
  metaDescription: I wanted to use Oliver Hunt's fluid solver as an interactive particle flowfield. But the fluid dynamics worked wrongly for on square images.
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Interactive fluid dynamics in JavaScript

<p>Don&#8217;t know why, but after seeing <a href="http://nerget.com/fluidSim/">Oliver Hunt&#8217;s</a> fluid solver I wanted to use fluid dynamics on my site as an interactive particle flowfield.</p>
<p><!--more--></p>
<p>As you might suspect fluid dynamics is really complex stuff. In computational programming it is mimicked by using <a href="http://en.m.wikipedia.org/wiki/Navier%E2%80%93Stokes_equations">Navier-Stokes equations</a>. Olivers fluid solver is based on a 2003 paper by <a href="http://www.dgp.toronto.edu/people/stam/reality/Research/pdf/GDC03.pdf">Jos Stam</a> describing a fast implementation for realtime use.</p>
<p>The first thing I did is grab his script and implement it roughly. Only it worked wrongly for non square images. So I looked around some more for other implementations of fluid dynamics and found one in ActionScript by <a href="http://blog.inspirit.ru/?p=248">Eugene Zatepyakin</a>. Since ActionScript is my second language and Eugene is an excellent programmer I decided I&#8217;d port his code to JavaScript (+Eugenes version had viscosity implemented).</p>
<p>When I got the port up and running it ran faster than Olivers script but it had the same vertical vs horizontal discrepancy. Luckily, while optimizing, I found out why and fixed it.</p>
<p>Porting stuff from C++ to Java to ActionScript to JavaScript does not go by unpunished. The Webkit browers will run it quite nicely but Firefox really sucks at it (even moreso than IE).</p>
<p>Here it is:</p>
<p><iframe src="https://test.ronvalstar.nl/fluidSolver" width="100%" height="200px"></iframe></p>
<p>In the above implementation I&#8217;ve used the raw fluid in a canvas, and the red dots are tiny 1px divs above it. You can also watch it fullscreen from <a href="https://test.ronvalstar.nl/fluidSolver">https://test.ronvalstar.nl/fluidSolver</a> or <a href="https://test.ronvalstar.nl/fluidSolver/fluidSolver.zip">download the source</a>.</p>
<p>With it I&#8217;ve made a minimal dusty look on <a href="/">ronvalstar.nl</a> (only Webkit since Firefox and IE aren&#8217;t fast enough). It uses only the velocity field for the dust particles. It starts with a low number of particles that is in- or decremented depending on the framerate. The dust particles are influenced by mouse movement, but also by interacting with the menu and/or projects.</p>
