<!--
  id: 2716
  slug: opleidingen-widget
  type: fortpolio
  excerpt: <p>An Elasticsearch Javascript widget comprised of CDN dependencies, with source-generated documentation and examples.</p>
  categories: javascript, frontend, HTML/CSS, framework, interaction design, backend, mobile
  tags: CSS, HTML, Javascript, Grunt, Elasticsearch, Bootstrap, JSDoc
  clients: Studiekeuze123
  collaboration: 
  prizes: 
  thumbnail: sk123ow.png
  image: sk123ow.png
  images: sk123ow.png, Opleidingen-Widget.png
  inCv: true
  inPortfolio: true
  dateFrom: 2014-12-08
  dateTo: 2014-12-31
-->

# Education widget

<p>The total of educations that can be followed in the Netherlands amount to a reasonable pile of data. Studiekeuze123 wanted something with which to search this data. It also had to be easy to implement and customiseable. The result is a single script that connects to an <a href="http://www.elasticsearch.org/">Elasticsearch</a> server.</p>
<p><!--more--></p>
<p>Our reason for choosing Elasticsearch was speed. Elasticsearch is extremely fast. The downside is that it takes a whole different mindset because it seems limited compared to regular databases where you can easily execute a joined query for instance.</p>
<p>The script itself is relatively small. CSS and HTML are parsed into the script through the build process using the headless browser <a href="http://phantomjs.org/">PhantomJS</a>. For other dependencies CDN&#8217;s are used.</p>
<p>Bootstrap is used for the CSS basis but this can be disabled at will. The layout is very easy to override since the CSS the script provides is injected to <a href="https://developer.mozilla.org/en-US/docs/Web/API/document.styleSheets">document.styleSheets</a> rather than simply added to the DOM.</p>
<p>The build process also generates documentation and examples using Markdown with <a href="http://usejsdoc.org/">JSDoc</a>.</p>