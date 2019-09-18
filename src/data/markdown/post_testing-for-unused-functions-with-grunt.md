<!--
  id: 2389
  description: Using Grunt to test 5000 lines of code for unused functions.
  date: 2013-08-08T12:48:56
  modified: 2014-05-06T12:37:37
  slug: testing-for-unused-functions-with-grunt
  type: post
  excerpt: <p>I&#8217;m relatively new to Grunt. I had used it before in several projects but it was already set up and working fine, to I didn&#8217;t really look into it. Besides, the sheer amount of options/plugins available put me off a bit. That and time being money.</p>
  categories: code, Javascript, jQuery
  tags: Javascript, Grunt, nodejs, npm
  metaDescription: Using Grunt to test 5000 lines of code for unused functions.
  metaTitle: Testing for unused functions with Grunt
  metaKeyword: unused functions
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Testing for unused functions with Grunt

<p>I&#8217;m relatively new to <a title="Grunt website" href="http://gruntjs.com/">Grunt</a>. I had used it before in several projects but it was already set up and working fine, to I didn&#8217;t really look into it. Besides, the sheer amount of options/plugins available put me off a bit. That and time being money.</p>
<p><!--more--></p>
<p>But in between projects I have a bit of breathing space so the last couple of days I&#8217;ve been getting my hands really dirty.</p>
<p>I&#8217;ve used Ant before, but usually I just write some .bat files to run tasks. Although that always bugged me a bit. I mean DOS, come on&#8230; I used that thirty years ago when I first touched Windows and I&#8217;m still using it! But not any more (well a lot less anyway).</p>
<p>Grunt and Node are my new best friends.</p>
<p>So anyway, after Grunting a dummy project I fixed it for <a title="TinySort" href="http://tinysort.ronvalstar.nl">TinySort</a>. In the lib folder of that project I found jquery.zen.min.js, a script I quickly threw together in the beginning of this year. So I decided to turn that into a new project (removing the jQuery depencency).</p>
<p><a href="http://zen.ronvalstar.nl/">My Zen script</a> is for using <a title="Emmet website" href="http://emmet.io/">Emmet</a> (formerly know as Zen) in your regular browser Javascripts. Emmet, although written in Javascript, is really intended for IDE plugins, and does much more than just expand HTML abbreviations. Which finally brings us to the title of this post.</p>
<p>Even though I just included a subset of the scripts I still ended up with 44kB in my minified result. The subset I used was still about 5000 lines but a lot of it was redundant.<br />
So I needed a way to find out what functions were not used and remove them. And I had to do it automatically so I wouldn&#8217;t have any problems updating to a newer Emmet version (also, I had no intention of sifting through those 5000 lines by hand).</p>
<p>Finding the unused functions was tricky, but relatively simple. I injected a method call to each function telling me the line number it was called from. Then I wrote a test suite using every possible Emmet call that the script could encounter. This told me 274 out of 433 functions were not used.</p>
<p>So now what?</p>
<p>Finding unused functions is one thing, removing them is quite another. We&#8217;re dealing with named and anonymous functions, plus the named ones can be either expressions or declarations (function foo(){} -or- var foo = function(){};). I thought about prepending a dummy function and replacing all the unused functions with the dummy one. But that would not work for declarations because they could be referenced elsewhere.</p>
<p>Then there was the problem of selecting the entire function for removal. A simple regex wouldn&#8217;t cut it because you could can have nested functions, statements, comments and all those can have curly braces. I knew where the function started, so the only thing I could think of was meticulously step through every subsequent character and count up and down for every valid curly brace until I&#8217;d reach zero.</p>
<p>Then I had a brainfart: since it&#8217;s only the minified version that really counts, why not start every redundant function with &#8216;return false;&#8217; and let <a href="https://github.com/mishoo/UglifyJS">Uglify</a> do the heavy lifting? A few minutes later I had gone from 44kB to 26kB.<br />
It left the file littered with occurrences of &#8216;function(a,b){return!1}&#8217;. Replacing those expressions with a dummy shaved off another 3kB.</p>
<p>So there you have it: a 50% decrease in filesize using code injection and Uglify.</p>
<p>The script is called &#8216;unused-functions&#8217; and is up at <a title="NPM" href="https://npmjs.org/package/grunt-unused-functions" target="_blank">NPM</a> and <a href="https://github.com/Sjeiti/grunt-unused-functions">Github</a>.</p>