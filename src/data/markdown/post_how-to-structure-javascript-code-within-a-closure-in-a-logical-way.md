<!--
  id: 2606
  date: 2015-10-22T20:40:18
  modified: 2016-12-14T09:56:07
  slug: how-to-structure-javascript-code-within-a-closure-in-a-logical-way
  type: post
  excerpt: <p>Having a good coding structure increases maintainability. This is true for the structure of files as well as the structure within a file. This post handles about the latter: structuring within a closure. A closure being a revealing-object, IIFE, module or whatever floats your boat.</p>
  categories: code, Javascript
  tags: Javascript
  metaKeyword: structure
  metaDescription: Having a good coding structure increases maintainability. This is true for the structure of files as well as the structure within a file.
  metaTitle: How to logically structure Javascript code within closures
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# How to structure Javascript code within a closure in a logical way

<p>Having a good coding structure increases maintainability. This is true for the structure of files as well as the structure within a file. This post handles about the latter: structuring within a closure. A closure being a <a href="https://www.google.com/search?q=javascript+%22revealing+object+pattern%22" target="_blank">revealing-object</a>, <a href="https://www.google.com/search?q=javascript+IIFE" target="_blank">IIFE</a>, <a href="https://www.google.com/search?q=javascript+modules" target="_blank">module</a> or whatever floats your boat.</p>
<p><!--more--></p>
<h3>Revealing object</h3>
<p>As a basis I&#8217;ll use the revealing object pattern (or revealing module pattern if you will). It looks like this:</p>
<pre><code data-language="javascript">var window.globalObject = (function(){
	var privateVar = 254;
	function privateFunction() {
		return 2*privateVar;
	}
	function exposedFunction() {
		return 3*privateFunction();
	}
	return {
		exposedFunction: exposedFunction
	};
})();</code></pre>
<p>The returned object literal exposes a private function.</p>
<p>You might argue a shorter way would be to write &#8216;exposedFunction&#8217; as an anonymous one right inside the returned object literal but this could lead to messy code. Suppose some of the exposed functions are used by private functions and some are not, then your return object would be a mix of anonymous functions and function references&#8230; not very clean. Also: checkout object literals in es6!</p>
<h3>Variable declaration</h3>
<p>It&#8217;s good practise to always declare all the variables at the start of your script. You should know why but if you don&#8217;t: <a href="http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html">the reason is hoisting</a>.<br />
A common way of declaration is a single var statement with comma separated variables. A lesser common style is prefixing your commas. I know most people don&#8217;t like this but we&#8217;re not writing literature and prefixing commas has very valid advantages. Watch:</p>
<pre><code data-language="javascript">var greatMethod = someNamespace.greatMethod
	,boringCamelCasedInteger = 1
	,happyString = 'happy' // 'unhappy'
	,somethingUndefined
;</code></pre>
<p>Code changes, and most changes occur at the end of the variable statement (or array or object declaration). If you suffix your commas and add lines or swap some around you will always have to check that last line (which is why there are so many sloppy arrays with trailing commas out there in the wild).<br />
Prefixed commas also form a neat vertical column, making it very easy to spot if you missed one.<br />
Having no comma at the end of the line makes it easier to comment a value.</p>
<p>I also always cache methods from other namespaces first. Es5 is missing the import declaration other languages have. So the top of the variable declaration is a good substitute (at least it beats the hell out of parsing them as parameters in your IIFE).</p>
<h3>Structuring functions</h3>
<p>We covered the beginning and the end, now for the in between. Most of the in between stuff will be functions. If it is not a function add it right after the variable declaration and before the first function definition.</p>
<p>We can distuinguish a couple of function types that will make it easier to order them. A logical order is chronological, but that is just the way humans think, not how a machine runs through code. The order I try to keep is:</p>
<ul>
<li>initialisation</li>
<li>event handlers</li>
<li>other functions</li>
</ul>
<p>Some also split the last category into public and private methods but you can easily see what is exposed in the return object (so I tend not to).<br />
Within this order I try to be chronological. I&#8217;ll often do this for instance:</p>
<pre><code data-language="javascript">function init(){
	initVariables();
	initSomething();
	initEvents();
	initView();
}</code></pre>
<p>The methods are all prefixed &#8216;init&#8217; and appear in chronological order. The method above, being the first function declared, will read like the index of a book: a glance will give you some idea of what is happening within our closure.<br />
Similarly all the event handlers are prefixed &#8216;handle&#8217;. Prefixing this way makes your code readable because it reflects the purpose of the function. For instance: a click handler for a submit button would be called &#8216;handleSubmitButtonClick&#8217;, which reads like an imperative sentence.</p>
<h3>Know when to split</h3>
<p>One of the biggest issues that can make code hard to read is the size of it: 50 methods is harder to grasp than 20 methods. Similarly 2000 lines are harder to grasp than 300.<br />
So when functions get too big they should be split up. When modules (or classes) get too big they should be split up.</p>
<p>Without thinking I always split event handlers to separate (named) functions. The biggest reason being they are deferred calls.<br />
I do not always split up array handlers (forEach, map,.. etc) unless they are larger.</p>
<p>When to split a function is a bit arbitrary. Some adhere fervently to the <a href="https://en.wikipedia.org/wiki/Single_responsibility_principle" target="_blank">single responsibility principle</a>: a function or method should only do one thing. Good intent but then: a module with one method doing thirty things is just as hard to read as a module with thirty methods doing one thing. So its better to stick to the not-too-much-responsibility rule (I just made that up).</p>
<p>Another thing to watch for is repeated patterns: if two methods do something very similar extract the similarity to a third method. This principle is known as <a href="https://en.wikipedia.org/wiki/Don%27t_repeat_yourself" target="_blank">don&#8217;t repeat yourself</a>.</p>
<p>Then there&#8217;s the arbitrary point you reach where you have to refactor your module (or class) into several smaller ones. Mostly (but now always) you can see in advance how many modules you need (single responsibility). I mostly start scratching behing my ears when I reach the 400 line mark (or 20 methods).</p>
<h3>Documentation</h3>
<p>Another very important part is documentation. I try to use jsdoc syntax for all functions. This serves two purposes. Function names cannot convey everything, sometimes it requires some elaboration. This is not only for others to understand your code but also for yourself. I don&#8217;t know about you but sometimes when I revisit old code it&#8217;s as if I&#8217;m reading someone else&#8217;s.<br />
The other advantage of documentation is that modern IDE&#8217;s pick up on it and use it for autocompletion and redirection.<br />
And with that comes another great advantage: <a href="http://usejsdoc.org/tags-typedef.html" target="_blank">type definitions</a>. This is especially useful when dealing with JSON callbacks from REST API&#8217;s.<br />
Well there&#8217;s also the fact that you can render project documentation from it.</p>
<h3>Naming conventions</h3>
<p>We all know the regular naming conventions: functions start lowercase, class names start uppercase, constants are capitalised, etc.<br />
I used to write systems Hungarian notation but I&#8217;ve relented to a sparse app notation. Hungarian notation is prefixing variables to reflect the type or intended use (<a href="https://en.m.wikipedia.org/wiki/Hungarian_notation">see system versus apps notation</a>).<br />
A boolean is prefixed with &#8216;has&#8217; or &#8216;is&#8217;, an HTMLElement is prefixed &#8216;elm&#8217;.<br />
When dealing with multiple variables for a single subject it is also clearer to prefix the subject than it is to suffix it (think of imageWidth, imageName, imageUri etc&#8230;).<br />
And don&#8217;t be sparse with characters, we have minifiers for that. Be descriptive in your naming, especially for functions.</p>
<h3>Conclusion</h3>
<p>Above views of course have a somewhat personal flavor, so take from it what you feel is right for you.<br />
The most important thing is to be consistent&#8230; and to refactor&#8230; and to have fun.</p>
<p>Oh yeah&#8230; here&#8217;s everything in one file:</p>
<pre><code data-language="javascript" data-src="/wordpress/wp-content/themes/sjeiti/static/example/structure.js"></code></pre>