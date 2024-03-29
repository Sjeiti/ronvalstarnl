<!--
  date: 2012-04-25
  modified: 2014-08-15
  slug: javascript-performance-testing
  type: post
  categories: code, JavaScript, link
  tags: crossbrowser, performance, test
  description: A JavaScript speed test normally looks something like this: count how many times we can do the same calculation in a fixed amount of time.
-->

# JavaScript performance testing

<p>&#8216;All roads lead to Rome&#8217; is a saying in Dutch that means there are multiple ways to accomplish the same thing. Very true in real life but maybe even more so in programming. You&#8217;d think the fastest code is the best, but a lot of times readability is chosen over speed (or, as in most cases, speed isn&#8217;t just that important).</p>
<p><!--more--><br />
A JavaScript speed test will normally look something like this:<br />
<em>calculate elapsed time while doing the same calculation a fixed number of times</em><br />
Or like this:<br />
<em>count how many times we can do the same calculation in a fixed amount of time</em></p>
<p>Simple enough. But for a solid test result you have to test in multiple browsers, operating systems and machines. Luckily for us, in this day and age of cloud computing, there is something out there that does just that. But more importantly, whatever you were planning to test, chances are that somebody else already beat you to it.<br />
Enter <a href="http://jsperf.com">jsperf</a>, a great online benchmarking application build with <a href="http://benchmarkjs.com/">benchmarkjs</a>. You can create your own tests, or run existing ones. You can even revise existing tests.</p>
<p>For instance: I know a lot of developers who don&#8217;t like switches because it makes their code unreadable <!--(Crockford, Clean code)-->. Some don&#8217;t even us ternary statements. Tests like these should make them reconcider:<br />
<a href="http://jsperf.com/ifswitch/4">if vs switch</a><br />
<a href="http://jsperf.com/if-else-vs-arrays-vs-switch-vs-ternary/6">if switch indexed ternary</a></p>
<p>Here is a list of JavaScript tests that you might find useful or surprising.</p>
<ul>
<li><a href="http://jsperf.com/fastest-array-loops-in-javascript/4">looping</a></li>
<li><a href="http://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/3">chars in long strings</a></li>
<li><a href="http://jsperf.com/math-floor-vs-math-round-vs-parseint/9">floor vs bitwise not</a></li>
<li><a href="http://jsperf.com/join-versus-string-concatination/10">string concatenation</a></li>
<li><a href="http://jsperf.com/one-time-iife-or-everytime-boolean-conversion">if else vs notnot</a></li>
<li><a href="http://jsperf.com/for-while-test/3">for while</a></li>
<li><a href="http://jsperf.com/localstorage-vs-objects">localstorage vs object lookup</a></li>
<li><a href="http://jsperf.com/isarray-shim/2">isArray</a></li>
<li><a href="http://jsperf.com/math-pow-vs-bitwise/2">pow vs bitwise</a></li>
<li><a href="http://jsperf.com/math-pow-vs-multiplication">pow vs multiplication</a></li>
<li><a href="http://jsperf.com/prefix-or-postfix-increment/3">icrement prefix postfix or add/store</a></li>
<li><a href="http://jsperf.com/array-splice-vs-array-length-0/2">empty an array</a></li>
<li><a href="http://jsperf.com/min-max-compare">min max</a></li>
</ul>
<p>&#8230;now get back to work!</p>
