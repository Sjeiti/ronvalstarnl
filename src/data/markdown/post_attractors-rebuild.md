<!--
  id: 328
  date: 2008-12-13
  modified: 2020-05-31
  slug: attractors-rebuild
  type: post
  excerpt: <p>In the beginning of this year I had some free time and thought I&#8217;d spend it on P55 (which had been a while).</p>
  categories: code, image, Java, Processing, video
  tags: math, cool shit
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Attractors rebuild

<p>In the beginning of this year I had some free time and thought I&#8217;d spend it on <a href="http://processing.org/">P55</a> (which had been a while).<br />
<!--more--></p>
<p class="notice">Update: this post is obsolete, there is now <a href="/strange-attractors-javascript">a rerebuild</a>.</p>
<p><img src="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/Lorenz84-1234-682-945-484-296-1024x819.jpg" alt="" /><br />
Because I&#8217;ve been doing as3 since late 2006 I&#8217;m now all used to it&#8217;s way of oo programming. The only way to do that in P55 (using packages and all that) is by doing Java and using the P55 core library.<br />
I&#8217;m still fascinated by strange attractors and since my old P55 attractor viewer was made in P55 alpha, and there are all these useful libraries for the latest P55, I decide to rebuild it.<br />
So I fired up Eclipse and after I while had a really cool new version in which you can create and save attractor data to cookies, render and save <a href="http://flickr.com/photos/sjeiti/sets/72157603957488195/">images</a> directly. And the standalone version even renders out <a href="/48-hours-of-rendering">complete movies</a> (thanks to <a href="http://processing.org/reference/libraries/video/index.html">this cool lib</a>).<br />
All was going well until I started testing online. Somewhere in my code was a memory leak. I&#8217;m not that experienced with Java and/or Eclipse (yeah I do my as3 in some simple text editor because I can&#8217;t get used to Eclipses lack of features like vertical selection or keystroke recording). So I spend ages trying to find that leak, read a lot on garbage collection, changed a lot of code, but it still leaks after a while. In the end I just gave up on it, which is a pity because I had all these other cool ideas to implement.<br />
But yesterday I thought: what the hell, I&#8217;ll post this anyway, leak or no leak. It&#8217;s no use hiding in my test folder. You can still use it to render very cool images. Just remember: when the framerate slows down, save your attractor, close the page, reload it, and load your attractor again.</p>
<p>I&#8217;m gonna quit ranting, here it is: <a href="https://attractors.ronvalstar.nl/">Attractors rebuild</a>.</p>
