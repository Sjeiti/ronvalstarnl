<!--
  id: 326
  date: 2008-07-31T17:10:33
  modified: 2012-07-03T16:06:58
  slug: perlin-noise-and-frocessing
  type: post
  excerpt: <p>Just got back from a very relaxed vacation and I&#8217;m trying to pick up the old pace (but it&#8217;s too hot and humid here). Back at the old console I got this incoming link: Perlin Clouds and Frocessing (with an F). So somebody with a lot of spare time is porting Processing to AS3 (god [&hellip;]</p>
  categories: code, Processing, ActionScript
  tags: Mario Klingemann, Perlin Clouds, Perlin Noise, Flash
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Perlin Noise and Frocessing

<p>Just got back from a very relaxed vacation and I&#8217;m trying to pick up the old pace (but it&#8217;s too hot and humid here). Back at the old console I got this incoming link: <a href="http://nodename.com/blog/2008/07/11/perlin-clouds-and-frocessing-with-an-f/">Perlin Clouds and Frocessing (with an F)</a>. So <a href="http://nutsu.com/blog/">somebody with a lot of spare time</a> is porting Processing to AS3 (god knows why though, I can&#8217;t read Japanese). Very cool nonetheless.<br />
Another little newsflash in that first post is that <a href="http://www.quasimondo.com/archives/000672.php">Mario Klingemann</a> optimized my <a href="/perlin-noise-in-as3/">original Perlin Noise class</a>. It&#8217;s now almost twice as fast! Funny how two simple things (type casting and unrolling functions) can have such a huge effect.<br />
I originally created the class for use with something other that bitmaps, but since the speed increase allows it, Mario also implemented a bitmap fill method in there (although it doesn&#8217;t seem to have any scale control).</p>