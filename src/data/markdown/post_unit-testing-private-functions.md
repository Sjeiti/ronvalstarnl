<!--
  id: 879
  description: For some time now I've been unit testing my Javascript. But how to test those private functions?
  date: 2012-01-31T13:47:35
  modified: 2012-08-24T15:40:32
  slug: unit-testing-private-functions
  type: post
  excerpt: <p>For some time now I&#8217;ve been unit testing my Javascript with qUnit. Not only good practice, it also saves you an incredible amount of time when it comes to crossbrowser testing your scripts. The only problem I was testing private functions that are hidden within closures.</p> 
  content: <p>For some time now I&#8217;ve been unit testing my Javascript with <a href="http://docs.jquery.com/QUnit" rel="external">qUnit</a>. Not only good practice, it also saves you an incredible amount of time when it comes to crossbrowser testing your scripts. The only problem I was testing private functions that are hidden within closures. </p> <p><!--more--><br /> The bulk of the functions you want to test are not (and should not be) accessible from the global scope. So what I used to do is add a function that would expose the private functions I wanted to test, test them, and if all went well I&#8217;d comment out the expose-function. A bit of a hassle really&#8230;</p> <p>While I was working on the documentation for <a href="http://tinysort.ronvalstar.nl/">TinySort</a> when I had an idea. In the qUnit test page I don&#8217;t load the script in the head but do it via an ajax request. Then I alter the script exposing the desired private functions and then start the test&#8230; piece of cake really&#8230;</p> <p>Just <a href="view-source:http://tinysort.ronvalstar.nl/test/">view the source</a> of the <a href="http://tinysort.ronvalstar.nl/test/">TinySort unit test</a>.<br /> Somewhere around line 22 you&#8217;ll see this:</p> <pre><code data-language="javascript">$.ajax({   url:'scripts/jquery.tinysort.js'   ,dataFilter: function(data) {    return data.replace(/$.tinysorts*=s*{/g,'$.tinysort={expose:function(){return{toLowerCase:toLowerCase,isNum:isNum,contains:contains};},');   }   ,success: startTest  });  </code></pre> <p>When using $.ajax() jQuery will automatically inject your code into the DOM. But with that property &#8216;dataFilter&#8217; you can alter the result right before injection. So with a little regular expression I look for &#8216;$.tinysort = {&#8216; to append a function that exposes the private functions that need testing, which is nothing more than this:</p> <pre><code data-language="javascript">function(){   return{    toLowerCase: toLowerCase    ,isNum: isNum    ,contains: contains   };  }</code></pre> <p>You can test this by calling up the console in both <a href="http://tinysort.ronvalstar.nl/">TinySort</a> and it&#8217;s <a href="http://tinysort.ronvalstar.nl/test/">unit test</a> and calling the expose function on both pages:</p> <pre><code data-language="javascript">$.tinysort.expose()</code></pre> 
  categories: code,Javascript,jQuery
  tags: Qunit,Tinysort
-->

# Unit testing private functions in Javascript

<p>For some time now I&#8217;ve been unit testing my Javascript with <a href="http://docs.jquery.com/QUnit" rel="external">qUnit</a>. Not only good practice, it also saves you an incredible amount of time when it comes to crossbrowser testing your scripts. The only problem I was testing private functions that are hidden within closures. </p>
<p><!--more--><br />
The bulk of the functions you want to test are not (and should not be) accessible from the global scope. So what I used to do is add a function that would expose the private functions I wanted to test, test them, and if all went well I&#8217;d comment out the expose-function. A bit of a hassle really&#8230;</p>
<p>While I was working on the documentation for <a href="http://tinysort.ronvalstar.nl/">TinySort</a> when I had an idea. In the qUnit test page I don&#8217;t load the script in the head but do it via an ajax request. Then I alter the script exposing the desired private functions and then start the test&#8230; piece of cake really&#8230;</p>
<p>Just <a href="view-source:http://tinysort.ronvalstar.nl/test/">view the source</a> of the <a href="http://tinysort.ronvalstar.nl/test/">TinySort unit test</a>.<br />
Somewhere around line 22 you&#8217;ll see this:</p>
<pre><code data-language="javascript">$.ajax({
	url:'scripts/jquery.tinysort.js'
	,dataFilter: function(data) {
		return data.replace(/$.tinysorts*=s*{/g,'$.tinysort={expose:function(){return{toLowerCase:toLowerCase,isNum:isNum,contains:contains};},');
	}
	,success: startTest
});
</code></pre>
<p>When using $.ajax() jQuery will automatically inject your code into the DOM. But with that property &#8216;dataFilter&#8217; you can alter the result right before injection. So with a little regular expression I look for &#8216;$.tinysort = {&#8216; to append a function that exposes the private functions that need testing, which is nothing more than this:</p>
<pre><code data-language="javascript">function(){
	return{
		toLowerCase: toLowerCase
		,isNum: isNum
		,contains: contains
	};
}</code></pre>
<p>You can test this by calling up the console in both <a href="http://tinysort.ronvalstar.nl/">TinySort</a> and it&#8217;s <a href="http://tinysort.ronvalstar.nl/test/">unit test</a> and calling the expose function on both pages:</p>
<pre><code data-language="javascript">$.tinysort.expose()</code></pre>
