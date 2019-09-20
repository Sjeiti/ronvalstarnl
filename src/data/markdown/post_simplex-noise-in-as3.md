<!--
  id: 473
  description: A port from Java Simplex noise to actionscript 3.
  date: 2010-05-13T22:49:36
  modified: 2016-12-14T19:57:50
  slug: simplex-noise-in-as3
  type: post
  excerpt: <p>Well I ported the simplex noise to actionscript 3. The weird thing is that there is no speed increase whatsoever. I must be doing it wrong.</p>
  categories: code, Actionscript
  tags: simplex noise, Stefan Gustavson, test
  metaKeyword: Simplex noise
  metaTitle: Simplex noise in as3
  metaDescription: A port from Java Simplex noise to actionscript 3.
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Simplex noise in as3

<p>Well I ported the simplex noise to actionscript 3. The weird thing is that there is no speed increase whatsoever. I must be doing it wrong.</p>
<p><!--more--></p>
<p><a href="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/simplexAs4D.rar">Download Simplex.as and test class</a>. The test class also shows the spread and speed of both Perlin (left) and Simplex noise (right).</p>
<p><img src="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/classicVsSimplex.jpg" alt="classic vs simplex noise" style="border:1px solid grey;"/></p>
<p>&#8211; oh but wait &#8211;</p>
<p>I just notice the great <a href="http://toxi.co.uk/">Toxi</a> (aka Karsten Schmidt) also has taken Stefan Gustavson&#8217;s version and improved/modified it a bit in his <a href="http://code.google.com/p/toxiclibs/source/browse/trunk/toxiclibs/src.core/toxi/math/noise/SimplexNoise.java">Toxiclibs</a>. And this one is in 4D!!! (I was wondering why <a href="http://gist.github.com/304522">Sean McCullough</a> wasn&#8217;t doing anything with the simplex lookup table).<br />K&#8230; let&#8217;s see what this one does in as3&#8230;</p>
<p>Alrighty&#8230; <a href="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/simplexAs4D.rar">new version here</a>. It&#8217;s not much faster but it does have 4D!</p>
<p><del><small>Ps: I&#8217;ve also changed the first link in this post, old link is <a href="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/simplexAs4D.rar">this</a>.</small></del></p>