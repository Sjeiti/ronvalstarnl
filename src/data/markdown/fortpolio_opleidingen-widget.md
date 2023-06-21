<!--
  id: 2716
  slug: opleidingen-widget
  type: fortpolio
  excerpt: For Studiekeuze123 I created a widget that searches all available educations in the Netherlands. We pulled data from existing endpoints into Elasticsearch for speed. Source-generated documentation and examples were created so people could easily implement and style the widget.
  categories: JavaScript, HTML/CSS, framework, UX, mobile
  tags: CSS, HTML, JavaScript, Grunt, Elasticsearch, Bootstrap, JSDoc, Python
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

The total of educations that can be followed in the Netherlands amount to a reasonable pile of data. Studiekeuze123 wanted something with which to search this data. It also had to be easy to implement and customiseable. The result is a single script that connects to an [Elasticsearch](http://www.elasticsearch.org/) server.

Our reason for choosing Elasticsearch was speed. Elasticsearch is extremely fast. The downside is that it takes a whole different mindset because it seems limited compared to regular databases where you can easily execute a joined query for instance.

We used Python to pull everything from existing endpoints into Elasticsearch at regular intervals.

The final result is relatively small. CSS and HTML are parsed into the script through the build process using the headless browser [PhantomJS](http://phantomjs.org/). For other dependencies CDN&#8217;s are used.

Bootstrap is used for the CSS basis but this can be disabled at will. The layout is very easy to override since the CSS the script provides is injected to [document.styleSheets](https://developer.mozilla.org/en-US/docs/Web/API/document.styleSheets) rather than simply added to the DOM.

The build process also generates documentation and examples using Markdown with [JSDoc](http://usejsdoc.org/).
