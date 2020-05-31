<!--
  id: 2764
  date: 2015-02-19
  modified: 2016-12-07
  slug: javascript-inheritance-protected-methods
  type: post
  excerpt: <p>I really like JavaScript, but it&#8217;s far from perfect. One of it&#8217;s imperfections is that you&#8217;ll have to resort to trickery to create private variables (iife). So what aboutinheritance and protected variables?</p>
  categories: code, JavaScript
  tags: JavaScript
  metaKeyword: protected
  metaDescription: A JavaScript design pattern for prototypal inheritance with protected variables and methods.
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# JavaScript inheritance and protected methods

<p>I really like JavaScript, but it&#8217;s far from perfect. One of it&#8217;s imperfections is that you&#8217;ll have to resort to trickery to create private variables (<a href="https://www.google.com/?gws_rd=ssl#q=iife" target="_blank">iife</a>). So what aboutinheritance and protected variables?</p>
<p><!--more--></p>
<p>Lately I needed a base object to inherit multiple objects from. JavaScript does not really have classical inheritance so I always use prototypal inheritance (also, I don&#8217;t like <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this" target="_blank">this</a>). But I might reconsider with <a href="https://babeljs.io/docs/learn-es6/#classes" target="_blank">es6 classes</a>, even though it&#8217;s just sugarcoated prototypal.</p>
<h2>Protect your privates</h2>
<p>So&#8230; prototypal inheritance. We can fake private variables and methods through closures, but this will also prevent us from accessing them in child objects. So what we&#8217;re really looking for are protected variables and methods. There&#8217;s no such thing in JavaScript of course (no, not even in es6).<br />
But we can fake that to.<br />
The solution I came up with for my project is really an abstract base object. And it&#8217;s not really a base object but more a singleton factory. It does have a lot of <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind" target="_blank">bind</a>, but it works. Enough talk, here&#8217;s some code:</p>
<pre><code data-language="javascript" data-src="https://gist.githubusercontent.com/Sjeiti/efeb5c03f599f5fd15e9/raw/3537072afe6eac1d73d1af8b20ec5483fccaeabe/protectedInheritance.js"></code></pre>
<p>In the child object, instead of returning the instance, we return an instance property &#8216;expose&#8217;. This keeps the instance safely within the closure, effectively creating the illusion of protected variables and methods. There are limitations to this. The base object is abstract and the child objects are always final. Then again, you should never want to inherit too deep anyways.</p>
<p>And yes, it&#8217;s just a trick by convention, but it beats the hell out of prepending stuff with an underscore.</p>
<p>ps: here&#8217;s <a href="http://jsfiddle.net/Sjeiti/nd2oc2ak/" target="_blank">a fiddle</a></p>
