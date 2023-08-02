<!--
  slug: less-variables-to-javascript
  date: 2012-06-18
  modified: 2012-08-24
  type: post
  categories: CSS, Director, JavaScript
  tags: 
  description: Here's an easy solution for parsing LESS variables to JavaScript (technique should work with any CSS preprocessor though).
-->

# LESS variables to JavaScript

<p>LESS CSS is great and all but what if you want to use the same LESS variables in JavaScript.</p>
<p><!--more--></p>
<p>Here&#8217;s an easy solution I used for a site I recently made.<br />
In LESS create class rules within a non-existing id. Then read them by traversing the document.styleSheets.</p>
<p>Here&#8217;s a <a href="https://gist.github.com/2948738">Github gist</a> and here&#8217;s a <a href="http://jsfiddle.net/Sjeiti/VHQ8x/">fiddle</a>.</p>
<p>So in my LESS file I have the following:</p>
<pre><code data-language="css">@thumbsWidth: 654px;
@thumbsTop: 123px;
#less {
	.thumbsWidth { width: @thumbsWidth; }
	.thumbsTop { width: @thumbsTop; }
}</code></pre>
<p>Then call the function: <code data-language="javascript">getLessVars('less');</code></p>
<p>Which returns the following object with the LESS variables:</p>
<pre><code data-language="javascript">{
	thumbsWidth: 123,
	thumbsTop: 456
}</code></pre>
<p>easy</p>
